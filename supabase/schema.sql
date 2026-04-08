-- ═══════════════════════════════════════════════════════════════════
-- KONVERT — Schema Supabase
-- Créer ces tables dans l'ordre dans le SQL Editor de Supabase
-- ═══════════════════════════════════════════════════════════════════

-- ─── EXTENSION UUID ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────────
-- Note : auth.users est géré par Supabase Auth
-- Cette table étend le profil public

create table public.users (
  id                      uuid references auth.users(id) on delete cascade primary key,
  email                   text not null,
  name                    text,
  plan                    text not null default 'starter' check (plan in ('starter','pro','agency')),
  pages_used_this_month   int  not null default 0,
  quota_reset_at          timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  created_at              timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
create policy "Users can view own profile"   on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Trigger : créer le profil auto à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────

create table public.subscriptions (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid references public.users(id) on delete cascade not null,
  stripe_customer_id       text unique,
  stripe_subscription_id   text unique,
  plan                     text not null default 'starter' check (plan in ('starter','pro','agency')),
  status                   text not null default 'active' check (status in ('active','canceled','past_due','trialing')),
  current_period_end       timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- ─── STORES ──────────────────────────────────────────────────────

create table public.stores (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete cascade not null,
  platform      text not null check (platform in ('shopify','woocommerce')),
  name          text not null,
  store_url     text not null,
  access_token  text,  -- chiffré côté app avant stockage
  woo_key       text,  -- WooCommerce consumer key
  woo_secret    text,  -- WooCommerce consumer secret
  created_at    timestamptz not null default now()
);

create index idx_stores_user_id on public.stores(user_id);

alter table public.stores enable row level security;
create policy "Users can CRUD own stores" on public.stores
  for all using (auth.uid() = user_id);

-- ─── TEMPLATES ───────────────────────────────────────────────────

create table public.templates (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  preview_url    text,
  html_template  text not null default '',
  category       text not null check (category in ('dark','light','bold','luxury','mobile')),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Templates publics = lisibles par tous les users connectés
alter table public.templates enable row level security;
create policy "Authenticated users can view templates" on public.templates
  for select using (auth.role() = 'authenticated');

-- ─── PAGES ───────────────────────────────────────────────────────

create table public.pages (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade not null,
  store_id       uuid references public.stores(id) on delete set null,
  template_id    uuid references public.templates(id) on delete set null,
  title          text not null default 'Nouvelle page',
  product_url    text,
  html_content   text,
  json_content   jsonb,           -- LandingPageData structuré
  status         text not null default 'draft' check (status in ('draft','published','archived')),
  published_url  text,            -- URL après push Shopify/WooCommerce
  views          int not null default 0,
  cta_clicks     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_pages_user_id  on public.pages(user_id);
create index idx_pages_store_id on public.pages(store_id);
create index idx_pages_status   on public.pages(status);

alter table public.pages enable row level security;
create policy "Users can CRUD own pages" on public.pages
  for all using (auth.uid() = user_id);

-- Trigger updated_at auto
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_updated_at
  before update on public.pages
  for each row execute procedure public.set_updated_at();

-- ─── ANALYTICS EVENTS ────────────────────────────────────────────

create table public.analytics_events (
  id         uuid primary key default uuid_generate_v4(),
  page_id    uuid references public.pages(id) on delete cascade not null,
  event_type text not null check (event_type in ('view','scroll_25','scroll_50','scroll_75','scroll_100','cta_click')),
  ip_hash    text,   -- IP hashée pour dédupliquer sans stocker de données perso
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_analytics_page_id   on public.analytics_events(page_id);
create index idx_analytics_event_type on public.analytics_events(event_type);
create index idx_analytics_created_at on public.analytics_events(created_at);

-- Events accessibles via service_role uniquement (insert depuis tracking script)
alter table public.analytics_events enable row level security;
create policy "Users can view analytics for own pages" on public.analytics_events
  for select using (
    exists (
      select 1 from public.pages
      where pages.id = analytics_events.page_id
      and pages.user_id = auth.uid()
    )
  );

-- ─── FONCTION : vérifier quota avant génération ──────────────────

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

  -- Limite selon le plan
  v_limit := case v_plan
    when 'starter' then 50
    when 'pro'     then 200
    when 'agency'  then 500
    else 50
  end;

  -- Quota dépassé ?
  if v_pages_used >= v_limit then
    return false;
  end if;

  -- Incrémenter
  update public.users
  set pages_used_this_month = pages_used_this_month + 1
  where id = p_user_id;

  return true;
end;
$$;

-- ─── WAITLIST ─────────────────────────────────────────────────────

create table public.waitlist (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  name       text,
  context    text,  -- profil renseigné à l'inscription (dropshippeur, agence...)
  status     text not null default 'pending' check (status in ('pending','invited','registered')),
  invited_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_waitlist_email  on public.waitlist(email);
create index idx_waitlist_status on public.waitlist(status);

-- Pas de RLS user : table gérée uniquement via service_role (admin)
alter table public.waitlist enable row level security;

-- ─── INVITATIONS ──────────────────────────────────────────────────

create table public.invitations (
  id           uuid primary key default uuid_generate_v4(),
  email        text not null,
  token        uuid not null default uuid_generate_v4() unique,
  waitlist_id  uuid references public.waitlist(id) on delete set null,
  used         boolean not null default false,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  created_at   timestamptz not null default now()
);

create index idx_invitations_token on public.invitations(token);
create index idx_invitations_email on public.invitations(email);

-- Pas de RLS user : table gérée uniquement via service_role (admin)
alter table public.invitations enable row level security;

-- ─── WORKSPACES ───────────────────────────────────────────────────

create table public.workspaces (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references public.users(id) on delete cascade not null,
  name          text not null,
  client_name   text,
  client_email  text,
  brand_name    text,
  brand_color   text default '#7c3aed',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_workspaces_owner_id on public.workspaces(owner_id);

alter table public.workspaces enable row level security;
create policy "Owners can CRUD own workspaces" on public.workspaces
  for all using (auth.uid() = owner_id);

create trigger workspaces_updated_at
  before update on public.workspaces
  for each row execute procedure public.set_updated_at();

-- ─── WORKSPACE MEMBERS ────────────────────────────────────────────

create table public.workspace_members (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid references public.workspaces(id) on delete cascade not null,
  email         text not null,
  role          text not null default 'viewer' check (role in ('viewer','editor','admin')),
  status        text not null default 'pending' check (status in ('pending','active')),
  invited_at    timestamptz not null default now(),
  joined_at     timestamptz,
  unique (workspace_id, email)
);

create index idx_workspace_members_workspace_id on public.workspace_members(workspace_id);
create index idx_workspace_members_email        on public.workspace_members(email);

alter table public.workspace_members enable row level security;
-- Le owner du workspace peut lire/gérer les membres
create policy "Workspace owners can manage members" on public.workspace_members
  for all using (
    exists (
      select 1 from public.workspaces
      where workspaces.id = workspace_members.workspace_id
      and workspaces.owner_id = auth.uid()
    )
  );
-- Un membre peut lire son propre enregistrement
create policy "Members can view own membership" on public.workspace_members
  for select using (
    email = (select email from public.users where id = auth.uid())
  );

-- ─── COLONNE workspace_id sur PAGES ───────────────────────────────
-- Permet d'associer une page à un workspace (mode Agence)

alter table public.pages
  add column if not exists workspace_id uuid references public.workspaces(id) on delete set null;

create index if not exists idx_pages_workspace_id on public.pages(workspace_id);

-- ═══════════════════════════════════════════════════════════════════
-- FIN DU SCHEMA
-- Coller ce SQL dans : Supabase Dashboard > SQL Editor > New query
-- ═══════════════════════════════════════════════════════════════════

-- ─── A/B TESTING ─────────────────────────────────────────────────

create table public.ab_tests (
  id         uuid primary key default uuid_generate_v4(),
  page_id    uuid references public.pages(id) on delete cascade not null,
  status     text not null default 'running' check (status in ('running','paused','completed')),
  winner     text check (winner in ('A','B')),
  created_at timestamptz not null default now()
);

create index idx_ab_tests_page_id on public.ab_tests(page_id);

alter table public.ab_tests enable row level security;
create policy "ab_tests: owner access" on public.ab_tests
  using (
    exists (
      select 1 from public.pages p
      where p.id = page_id and p.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────

create table public.ab_variants (
  id           uuid primary key default uuid_generate_v4(),
  ab_test_id   uuid references public.ab_tests(id) on delete cascade not null,
  variant      text not null check (variant in ('A','B')),
  page_content jsonb,
  vues         integer not null default 0,
  clics        integer not null default 0,
  conversions  integer not null default 0,
  created_at   timestamptz not null default now(),
  unique(ab_test_id, variant)
);

create index idx_ab_variants_test_id on public.ab_variants(ab_test_id);

alter table public.ab_variants enable row level security;
create policy "ab_variants: owner access" on public.ab_variants
  using (
    exists (
      select 1 from public.ab_tests t
      join public.pages p on p.id = t.page_id
      where t.id = ab_test_id and p.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────

create table public.ab_events (
  id         uuid primary key default uuid_generate_v4(),
  variant_id uuid references public.ab_variants(id) on delete cascade not null,
  visitor_id text not null,
  event_type text not null check (event_type in ('view','click','conversion')),
  created_at timestamptz not null default now()
);

create index idx_ab_events_variant_id on public.ab_events(variant_id);
create index idx_ab_events_visitor    on public.ab_events(visitor_id, variant_id, event_type);

-- ab_events est public (tracking visiteur) — pas de RLS
-- (Service role key utilisée côté API)

-- ─── FONCTIONS ATOMIQUES A/B ──────────────────────────────────────

create or replace function increment_ab_vues(p_variant_id uuid)
returns void language sql security definer as $$
  update public.ab_variants set vues = vues + 1 where id = p_variant_id;
$$;

create or replace function increment_ab_clics(p_variant_id uuid)
returns void language sql security definer as $$
  update public.ab_variants set clics = clics + 1 where id = p_variant_id;
$$;

create or replace function increment_ab_conversions(p_variant_id uuid)
returns void language sql security definer as $$
  update public.ab_variants set conversions = conversions + 1 where id = p_variant_id;
$$;
