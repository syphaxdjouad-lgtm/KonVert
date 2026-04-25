-- ═══════════════════════════════════════════════════════════════════
-- SECURITY FOLLOW-UP — fixes HAUT
--
-- À LANCER APRÈS 20260425_security_rls_lockdown.sql
-- Dans Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. subscriptions.user_id UNIQUE ──────────────────────────────
-- Sans cette contrainte, le `upsert(..., onConflict: 'user_id')` du webhook
-- Stripe se comporte comme un INSERT silencieux : 2 activations successives
-- créent 2 lignes au lieu d'updater. Le code suppose une ligne par user.
alter table public.subscriptions
  drop constraint if exists subscriptions_user_id_key;

alter table public.subscriptions
  add constraint subscriptions_user_id_key unique (user_id);

-- ── 2. workspace_members policy : email case-insensitive ─────────
-- L'ancienne policy comparait `email = (select email from users)` brut.
-- Si l'invitation utilise "Bob@x.com" et le profil "bob@x.com", le membre
-- légitime ne voyait jamais sa propre invitation.
-- Couplé avec la normalisation `email = lower(trim(...))` à l'insert dans
-- /api/workspaces/[id]/invite.
drop policy if exists "Members can view own membership" on public.workspace_members;

create policy "Members can view own membership" on public.workspace_members
  for select using (
    lower(email) = (select lower(email) from public.users where id = auth.uid())
  );

-- Backfill : normaliser les emails déjà en base pour cohérence des matches.
update public.workspace_members
set email = lower(trim(email))
where email <> lower(trim(email));

-- ═══════════════════════════════════════════════════════════════════
-- FIN
-- ═══════════════════════════════════════════════════════════════════
