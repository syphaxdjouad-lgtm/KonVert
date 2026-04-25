-- ═══════════════════════════════════════════════════════════════════
-- Ajout de pages.published_id (ID natif Shopify/WordPress)
--
-- Avant : on reparsait l'URL stockée dans published_url pour retrouver
-- l'ID — fragile (URL éditable côté store, formats différents Shopify
-- vs WP, regex pouvant matcher la mauvaise capture).
-- Après : ID natif stocké directement, source de vérité fiable.
-- ═══════════════════════════════════════════════════════════════════

alter table public.pages
  add column if not exists published_id bigint;

-- Backfill best-effort depuis published_url (Shopify uniquement, format /pages/{handle})
-- ne fonctionne pas car le handle n'est pas l'ID — on laisse les pages déjà publiées
-- republier au prochain push (createPage idempotent côté Shopify si même titre).
