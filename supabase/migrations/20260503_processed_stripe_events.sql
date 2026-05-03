-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-05-03 — Idempotence webhook Stripe
-- ──────────────────────────────────────────────────────────────────────────
-- Bug #29 audit lancement : Stripe peut rejouer un event après timeout
-- → on doublonne les events PostHog et on incrémente subscriptions à tort.
--
-- Cette table stocke chaque event.id traité. Une contrainte UNIQUE +
-- un INSERT côté webhook permet un check atomique sans race condition.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.processed_stripe_events (
  event_id     text primary key,
  event_type   text not null,
  processed_at timestamptz not null default now()
);

-- Lock total : seul le service_role (webhook) peut écrire/lire.
alter table public.processed_stripe_events enable row level security;

drop policy if exists "processed_stripe_events: service only" on public.processed_stripe_events;
create policy "processed_stripe_events: service only"
  on public.processed_stripe_events for all
  to service_role
  using (true)
  with check (true);

-- Nettoyage : on garde 90 jours (pour debug + retry tardifs Stripe).
-- À automatiser via pg_cron ou manuellement.
create or replace function public.cleanup_processed_stripe_events()
returns void language plpgsql security definer
as $$
begin
  delete from public.processed_stripe_events
  where processed_at < now() - interval '90 days';
end;
$$;
