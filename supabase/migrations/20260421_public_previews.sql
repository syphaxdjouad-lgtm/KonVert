-- Table pour les pages générées sans compte (offre gratuite)
-- Expire automatiquement après 7 jours via un cron ou check en code

create table if not exists public_previews (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  name              text,
  product_title     text not null,
  html_content      text not null,
  landing_page_data jsonb,
  expires_at        timestamptz not null,
  converted         boolean not null default false,
  emails_sent       integer[] not null default '{}',
  created_at        timestamptz not null default now()
);

-- Index pour les lookups par email (rate limiting)
create index if not exists public_previews_email_idx on public_previews (email);

-- Index pour les previews non-expirées
create index if not exists public_previews_expires_idx on public_previews (expires_at);

-- RLS : aucune policy → seul le service_role accède.
-- /api/generate/public et /api/preview/[id] utilisent supabaseAdmin (service_role).
-- Les anciennes policies "using (true)" laissaient anon lire/insérer toutes les
-- previews (fuite emails leads + HTML) — supprimées dans la migration suivante :
-- 20260425_security_rls_lockdown.sql
alter table public_previews enable row level security;
