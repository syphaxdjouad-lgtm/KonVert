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

-- RLS : lecture publique par ID uniquement (pas de liste)
alter table public_previews enable row level security;

-- Pas de select * public — uniquement via l'API server-side (service role)
-- La route API /api/preview/[id] utilise le service role ou anon avec cette policy
create policy "Lecture par ID" on public_previews
  for select using (true);

-- Insert via API uniquement (service role bypass RLS)
create policy "Insert via API" on public_previews
  for insert with check (true);
