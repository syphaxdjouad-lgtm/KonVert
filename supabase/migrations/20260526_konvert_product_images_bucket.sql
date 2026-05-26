-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-05-26 — Bucket Supabase Storage pour images produit V3
-- ──────────────────────────────────────────────────────────────────────────
-- Distinct de "pages-images" (builder de pages) : ce bucket sert les images
-- produit uploadées par le user dans le dashboard V3 (fiche produit, galerie).
-- Les images scrapées (Shopify CDN, AliExpress, etc.) restent en URL externe.
--
-- Limite 10 MB vs 5 MB de pages-images, car les photos produit packshot peuvent
-- être plus lourdes (raw DSLR resized en WebP).
-- ──────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'konvert-product-images',
  'konvert-product-images',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set
  public              = excluded.public,
  file_size_limit     = excluded.file_size_limit,
  allowed_mime_types  = excluded.allowed_mime_types;

-- Policies RLS — drop + recreate pour idempotence (même pattern que pages-images)

drop policy if exists "konvert-product-images: public read" on storage.objects;
create policy "konvert-product-images: public read"
  on storage.objects for select
  using (bucket_id = 'konvert-product-images');

drop policy if exists "konvert-product-images: user upload own folder" on storage.objects;
create policy "konvert-product-images: user upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'konvert-product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "konvert-product-images: user delete own folder" on storage.objects;
create policy "konvert-product-images: user delete own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'konvert-product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "konvert-product-images: user update own folder" on storage.objects;
create policy "konvert-product-images: user update own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'konvert-product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
