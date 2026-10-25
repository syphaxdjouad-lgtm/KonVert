-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-07-27 — Store Builder for Shopify : OAuth dédié (Sprint 6)
-- ──────────────────────────────────────────────────────────────────────────
-- Le page-builder existant utilise déjà `public.stores` (platform='shopify',
-- scopes write_pages/read_pages/write_content/read_content). Le Store
-- Builder a besoin de scopes différents (write_themes, write_products,
-- read_products) : plutôt que d'élargir les scopes de `stores` (ce qui
-- forcerait TOUS les marchands page-builder déjà connectés à ré-autoriser,
-- et couplerait deux features qui évoluent indépendamment), on crée une
-- table dédiée. Un même user peut donc avoir une ligne dans `stores` (page-
-- builder) ET une ligne ici (Store Builder) pour le même shop_domain, sans
-- interférence entre les deux flows OAuth.
--
-- ⚠️ Founder : cette migration n'a pas été appliquée en base par ANNA
-- (tâche manuelle) — à lancer via Supabase Dashboard → SQL Editor, ou
-- `supabase db push`, une fois relue.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.shopify_store_connections (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete cascade not null,
  shop_domain   text not null check (shop_domain ~ '^[a-z0-9][a-z0-9-]*\.myshopify\.com$'),
  -- Chiffré côté app (AES-256-GCM, cf. encryptToken/decryptToken dans
  -- src/lib/shopify/index.ts) avant stockage — jamais en clair en DB.
  access_token  text not null,
  -- Scopes réellement accordés par Shopify au moment de l'échange OAuth
  -- (champ `scope` de la réponse /admin/oauth/access_token), pas une valeur
  -- supposée côté app — permet de détecter un scope manquant sans attendre
  -- un 403 de l'Admin API (cf. hasRequiredStoreBuilderScopes()).
  scopes        text not null default '',
  -- Renseigné après un install réussi (thème activé) — nullable car une
  -- connexion peut exister sans qu'un thème ait encore été installé.
  theme_id      bigint,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Une seule connexion Store Builder par (user, shop) — permet l'upsert
  -- onConflict côté callback OAuth lors d'une reconnexion (élargissement de
  -- scopes, token expiré, etc.) sans dupliquer de lignes.
  constraint shopify_store_connections_user_shop_uniq unique (user_id, shop_domain)
);

create index if not exists idx_shopify_store_connections_user_id
  on public.shopify_store_connections(user_id);

-- Trigger updated_at auto — réutilise la fonction partagée déjà en place
-- pour public.pages / public.workspaces (cf. supabase/schema.sql).
drop trigger if exists shopify_store_connections_updated_at on public.shopify_store_connections;
create trigger shopify_store_connections_updated_at
  before update on public.shopify_store_connections
  for each row execute procedure public.set_updated_at();

-- RLS — même pattern que public.stores : un user ne CRUD que ses propres
-- connexions. Le access_token stocké reste chiffré (AES-256-GCM applicatif)
-- même en cas de lecture directe par son propriétaire via PostgREST.
alter table public.shopify_store_connections enable row level security;

drop policy if exists "Users can CRUD own shopify store connections" on public.shopify_store_connections;
create policy "Users can CRUD own shopify store connections"
  on public.shopify_store_connections
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
