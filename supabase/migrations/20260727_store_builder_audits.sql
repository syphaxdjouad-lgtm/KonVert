-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-07-27 — Store Builder for Shopify : Re-audit CRO J+7/J+30
-- (Sprint 8, Partie B). Spec : docs/store-builder-sprint8-spec.md §B.4/B.6
-- ──────────────────────────────────────────────────────────────────────────
-- ⚠️ Founder : cette migration n'a PAS été appliquée en base par ANNA (tâche
-- manuelle) — à lancer via Supabase Dashboard → SQL Editor, ou
-- `supabase db push`, une fois relue. Dépend de
-- 20260727_shopify_store_connections.sql (déjà en place) et bénéficie
-- (sans en dépendre strictement) de 20260727_store_builder_ab.sql pour
-- `theme_installed_at` — si cette dernière n'est pas encore appliquée,
-- la colonne est recréée ici avec `add column if not exists` (idempotent).
-- ──────────────────────────────────────────────────────────────────────────

-- `audit_emails_sent` pilote la cadence J+7 puis J+30 (2 checkpoints max,
-- pas un cron récurrent illimité — cf. spec §B.4) : contient `7` et/ou `30`
-- une fois les emails correspondants envoyés. Même pattern que
-- `trial_emails_sent` sur `users` (cf. cron/trial-emails/route.ts).
-- `theme_installed_at` : redéclarée ici en `if not exists` par sécurité
-- (déjà ajoutée par 20260727_store_builder_ab.sql en conditions normales).
alter table public.shopify_store_connections
  add column if not exists theme_installed_at timestamptz,
  add column if not exists audit_emails_sent integer[] not null default '{}';

create table if not exists public.store_builder_audits (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade not null,
  connection_id  uuid references public.shopify_store_connections(id) on delete cascade not null,
  checkpoint     text not null check (checkpoint in ('j7','j30')),
  score          numeric(5,2) not null,
  band           text not null check (band in ('red','orange','green')),
  -- Snapshot complet des 18 critères : [{id, label, weight, pass, credit,
  -- measuredValue, measurable, recommendation}] — permet au dashboard
  -- d'afficher l'historique sans recalcul, et sert de base au delta
  -- J+7→J+30 affiché dans l'email du 2e checkpoint.
  criteria       jsonb not null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_store_builder_audits_connection
  on public.store_builder_audits(connection_id, checkpoint);

alter table public.store_builder_audits enable row level security;

drop policy if exists "Users can read own audits" on public.store_builder_audits;
create policy "Users can read own audits" on public.store_builder_audits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
