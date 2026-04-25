-- ═══════════════════════════════════════════════════════════════════
-- Trigger handle_new_user : email normalisé en lower(trim(...))
--
-- Aligne la création de profil sur la convention adoptée dans
-- 20260425_security_followup.sql (workspace_members.policy + invite route).
-- Empêche les profils doublons "Bob@x.com" vs "bob@x.com" et garantit
-- que la policy "Members can view own membership" trouve toujours un match.
-- ═══════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    lower(trim(new.email)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Backfill des profils existants qui n'auraient pas l'email normalisé.
update public.users
set email = lower(trim(email))
where email <> lower(trim(email));
