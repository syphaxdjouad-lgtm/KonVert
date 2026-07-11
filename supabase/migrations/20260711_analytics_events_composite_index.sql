-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-07-11 — Index composite analytics_events(page_id, created_at)
-- ──────────────────────────────────────────────────────────────────────────
-- Audit Fable 5 (P-06) : dashboard/analytics/page.tsx filtre avec
--   .in('page_id', pageIds).gte('created_at', ...)
-- Le schéma ne déclare que 2 index séparés (idx_analytics_page_id,
-- idx_analytics_created_at) : Postgres doit combiner deux bitmap scans au
-- lieu d'un seul index scan composite. Sans impact aujourd'hui (peu de
-- volume), mais coûteux dès que la table grossit.
--
-- CONCURRENTLY pour ne pas locker la table en écriture pendant le build
-- de l'index (analytics_events reçoit des inserts en continu depuis le
-- tracking public). Ne peut pas tourner dans une transaction implicite
-- Supabase migration — à appliquer manuellement (voir note de fin).
-- ──────────────────────────────────────────────────────────────────────────

create index concurrently if not exists idx_analytics_page_id_created_at
  on public.analytics_events (page_id, created_at);

-- Note : CREATE INDEX CONCURRENTLY ne peut pas s'exécuter dans un bloc de
-- transaction. Si le pipeline de migration Supabase wrap les fichiers dans
-- une transaction, exécuter cette migration séparément via :
--   supabase db push --include-all
-- ou directement en SQL editor / psql sur l'instance cible.
