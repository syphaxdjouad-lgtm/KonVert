-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-05-03 — Quota cohérent + rollback sur erreur génération
-- ──────────────────────────────────────────────────────────────────────────
-- Bug #2 audit lancement : si DeepSeek timeout/JSON invalide après le check,
-- l'utilisateur perdait 1 page de quota sans rien recevoir.
--
-- 1. Aligne les limites SQL sur PLAN_LIMITS TypeScript (75/300/9999) + ajoute 'free'.
-- 2. Ajoute decrement_quota() pour rollback côté API en cas d'erreur post-check.
-- ──────────────────────────────────────────────────────────────────────────

create or replace function public.check_and_increment_quota(p_user_id uuid)
returns boolean language plpgsql security definer
as $$
declare
  v_plan            text;
  v_pages_used      int;
  v_quota_reset_at  timestamptz;
  v_limit           int;
begin
  select plan, pages_used_this_month, quota_reset_at
  into v_plan, v_pages_used, v_quota_reset_at
  from public.users
  where id = p_user_id
  for update;

  -- Reset quota si nouveau mois
  if now() >= v_quota_reset_at then
    update public.users
    set pages_used_this_month = 0,
        quota_reset_at = date_trunc('month', now()) + interval '1 month'
    where id = p_user_id;
    v_pages_used := 0;
  end if;

  -- Limite selon le plan (aligné sur src/types/index.ts > PLAN_LIMITS).
  v_limit := case v_plan
    when 'free'    then 1
    when 'starter' then 75
    when 'pro'     then 300
    when 'agency'  then 9999
    else 1
  end;

  if v_pages_used >= v_limit then
    return false;
  end if;

  update public.users
  set pages_used_this_month = pages_used_this_month + 1
  where id = p_user_id;

  return true;
end;
$$;

-- Décrémente le quota d'un user (ne descend jamais sous zéro).
-- Utilisé par l'API /api/generate pour rollback si la génération échoue
-- après le check_and_increment.
create or replace function public.decrement_quota(p_user_id uuid)
returns void language plpgsql security definer
as $$
begin
  update public.users
  set pages_used_this_month = greatest(pages_used_this_month - 1, 0)
  where id = p_user_id;
end;
$$;

revoke all on function public.decrement_quota(uuid) from public;
grant execute on function public.decrement_quota(uuid) to authenticated, service_role;
