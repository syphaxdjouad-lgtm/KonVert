-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-07-27 — Store Builder for Shopify : A/B test natif
-- (Sprint 8, Partie A). Spec : docs/store-builder-sprint8-spec.md §A.1
-- ──────────────────────────────────────────────────────────────────────────
-- ⚠️ Founder : cette migration n'a PAS été appliquée en base par ANNA (tâche
-- manuelle) — à lancer via Supabase Dashboard → SQL Editor, ou
-- `supabase db push`, une fois relue. À appliquer AVANT ou APRÈS
-- 20260727_shopify_store_connections.sql peu importe l'ordre relatif entre
-- elles (celle-ci dépend de la table shopify_store_connections déjà créée).
--
-- Design (cf. spec §0) : le serveur rend toujours `product.title`/
-- `product.body_html` (variante A) — le swap vers la variante B se fait
-- CLIENT-SIDE (script thème), donc aucune donnée de test ne modifie le
-- rendu Liquid ni le cache Shopify. Ce fichier ne stocke donc que la config
-- des tests + les events, jamais un état "quelle variante a été servie".
-- ──────────────────────────────────────────────────────────────────────────

-- product_id : Product.id Shopify du produit installé (retour de
-- createProduct, cf. CreatedProduct.id) — non persisté aujourd'hui par
-- install/route.ts (best-effort, même pattern que theme_id).
-- theme_installed_at : posé au succès d'activateTheme — déclencheur du
-- cron de re-audit CRO J+7/J+30 (Partie B).
alter table public.shopify_store_connections
  add column if not exists product_id bigint,
  add column if not exists theme_installed_at timestamptz;

create table if not exists public.store_builder_ab_tests (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade not null,
  connection_id  uuid references public.shopify_store_connections(id) on delete cascade not null,
  field          text not null check (field in ('h1_title', 'description')),
  -- Snapshot de product.title/body_html au lancement (= contenu live à cet
  -- instant) — jamais modifié après coup, sert de référence "variante A".
  variant_a_text text not null,
  -- Challenger saisi par le marchand dans le dashboard (Sprint 8 backend
  -- only — UI dashboard = OBITO, hors scope de ce sprint).
  variant_b_text text not null,
  status         text not null default 'running' check (status in ('running','promoted','stopped','inconclusive')),
  winner         text check (winner in ('a','b','inconclusive')),
  started_at     timestamptz not null default now(),
  ended_at       timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Une seule variante ACTIVE (status='running') par (connection, field) — pas
-- 2 tests concurrents sur le même champ. Index partiel plutôt que
-- "unique nulls not distinct" (PG >= 15 requis, non garanti sur tous les
-- projets Supabase existants) — sémantique strictement équivalente pour ce
-- besoin : un test non-running (promoted/stopped/inconclusive) ne bloque
-- jamais la création d'un nouveau test sur le même champ.
create unique index if not exists store_builder_ab_tests_one_running_idx
  on public.store_builder_ab_tests(connection_id, field)
  where status = 'running';

create index if not exists idx_store_builder_ab_tests_connection
  on public.store_builder_ab_tests(connection_id);

drop trigger if exists store_builder_ab_tests_updated_at on public.store_builder_ab_tests;
create trigger store_builder_ab_tests_updated_at
  before update on public.store_builder_ab_tests
  for each row execute procedure public.set_updated_at();

alter table public.store_builder_ab_tests enable row level security;

drop policy if exists "Users can CRUD own ab tests" on public.store_builder_ab_tests;
create policy "Users can CRUD own ab tests" on public.store_builder_ab_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Events ───────────────────────────────────────────────────────────────

create table if not exists public.store_builder_ab_events (
  id            uuid primary key default uuid_generate_v4(),
  ab_test_id    uuid references public.store_builder_ab_tests(id) on delete cascade not null,
  variant       text not null check (variant in ('a', 'b')),
  event_type    text not null check (event_type in ('page_view', 'add_to_cart', 'purchase')),
  -- Valeur du cookie `_kv_ab` — UUID généré côté client, jamais une IP ni un
  -- identifiant Shopify customer. Pas de PII stockée dans cette table.
  visitor_id    text not null,
  session_id    text,
  -- Rempli uniquement pour event_type='purchase' — dédup webhook (retries
  -- Shopify sur `orders/paid`, cf. contrainte unique ci-dessous).
  order_id      bigint,
  -- Rempli uniquement pour event_type='purchase' (total_price commande).
  value_cents   integer,
  created_at    timestamptz not null default now(),
  constraint store_builder_ab_events_order_uniq unique (ab_test_id, order_id)
);

create index if not exists idx_store_builder_ab_events_test
  on public.store_builder_ab_events(ab_test_id, event_type, variant);

alter table public.store_builder_ab_events enable row level security;

-- Écriture : service role uniquement — l'endpoint public
-- /api/shopify/events et le webhook orders/paid utilisent supabaseAdmin,
-- jamais le client anon-key. Pas de policy INSERT pour anon/authenticated
-- (cohérent avec "jamais de service_role côté client").
drop policy if exists "Users can read own ab test events" on public.store_builder_ab_events;
create policy "Users can read own ab test events" on public.store_builder_ab_events
  for select using (
    exists (
      select 1 from public.store_builder_ab_tests t
      where t.id = ab_test_id and t.user_id = auth.uid()
    )
  );
