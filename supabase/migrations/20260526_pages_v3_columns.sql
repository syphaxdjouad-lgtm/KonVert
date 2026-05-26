-- Colonnes V3 sur la table pages pour permettre la migration progressive
-- des pages legacy (templateId etec-*) vers V3 (styleId + section_order_v3).

alter table pages
  add column if not exists style_id text,
  add column if not exists section_order_v3 text[],
  add column if not exists v3_migrated_at timestamptz;

create index if not exists pages_style_id_idx on pages(style_id) where style_id is not null;
create index if not exists pages_v3_migrated_at_idx on pages(v3_migrated_at) where v3_migrated_at is not null;

comment on column pages.style_id is 'V3 styleId — défini si la page a été migrée depuis template legacy';
comment on column pages.section_order_v3 is 'V3 section keys — sections rendues par renderPageV3';
comment on column pages.v3_migrated_at is 'Timestamp de la migration legacy → V3. NULL = pas encore migrée';
