-- Grants hardening — MEDIUM-4 (MADARA) + 2 trouvages JIRAYA J-3
--
-- Trois fonctions Postgres étaient exposées à anon/authenticated/PUBLIC
-- alors qu'elles n'auraient dû être appelables que par service_role :
--
-- 1. decrement_quota(uuid) — un user authentifié pouvait passer le
--    p_user_id d'un autre user pour décrémenter son quota à 0 (DoS ciblé).
--
-- 2. check_and_increment_quota(uuid) — grant PUBLIC + anon : un visiteur
--    NON authentifié pouvait épuiser le quota mensuel d'un autre user.
--
-- 3. cleanup_processed_stripe_events() — grant PUBLIC + anon : un anonyme
--    pouvait TRUNCATE la table d'idempotency Stripe → un même webhook
--    aurait pu être rejoué et générer des doublons (paiements/subs).
--
-- Toutes ces fonctions sont SECURITY DEFINER (s'exécutent avec les droits
-- du owner postgres). Elles ne doivent être appelées que côté serveur via
-- supabaseAdmin (service_role) — jamais via le client SDK.

revoke execute on function public.decrement_quota(uuid) from public, anon, authenticated;
revoke execute on function public.check_and_increment_quota(uuid) from public, anon, authenticated;
revoke execute on function public.cleanup_processed_stripe_events() from public, anon, authenticated;

-- service_role conserve ses droits par défaut (Supabase grant tout à
-- service_role globalement). On le redonne explicitement pour documenter
-- l'intent dans la migration.

grant execute on function public.decrement_quota(uuid) to service_role;
grant execute on function public.check_and_increment_quota(uuid) to service_role;
grant execute on function public.cleanup_processed_stripe_events() to service_role;
