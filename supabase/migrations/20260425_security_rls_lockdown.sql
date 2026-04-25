-- ═══════════════════════════════════════════════════════════════════
-- SECURITY FIX — RLS lockdown sur public_previews et ab_events
--
-- À LANCER DANS Supabase Dashboard → SQL Editor → New query
--
-- Contexte :
-- 1. public_previews avait `using (true)` + `with check (true)` →
--    n'importe qui avec la clé anon publique pouvait lister tous les emails
--    et HTML générés, et insérer en bypass du rate-limit middleware.
-- 2. ab_events n'avait PAS de RLS activée → table exposée en lecture/écriture
--    via PostgREST avec la clé anon.
--
-- Après ce script :
-- - public_previews : lecture/écriture SEULEMENT via service_role (côté API)
-- - ab_events       : RLS activée, aucune policy → bloqué pour anon/auth.
--                     Les inserts passent par /api/ab qui utilise service_role.
-- ═══════════════════════════════════════════════════════════════════

-- ── public_previews ───────────────────────────────────────────────
-- Drop des policies trop permissives
drop policy if exists "Lecture par ID" on public.public_previews;
drop policy if exists "Insert via API" on public.public_previews;

-- RLS toujours activée (par défaut depuis la migration initiale)
alter table public.public_previews enable row level security;

-- Aucune policy pour anon/authenticated → seul service_role accède.
-- Les routes /api/preview/[id] et /api/generate/public utilisent désormais
-- supabaseAdmin (service_role) pour lire/écrire ces lignes.

-- Index unique partiel : empêche 2 previews actives pour le même email
-- (verrouille la race condition dans /api/generate/public côté DB).
create unique index if not exists public_previews_email_active_uniq
  on public.public_previews (email)
  where expires_at > now() and converted = false;

-- ── ab_events ─────────────────────────────────────────────────────
alter table public.ab_events enable row level security;

-- Aucune policy → bloqué pour anon/authenticated.
-- Inserts/selects passent par /api/ab qui utilise supabaseAdmin (service_role).

-- ═══════════════════════════════════════════════════════════════════
-- FIN
-- ═══════════════════════════════════════════════════════════════════
