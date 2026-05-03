-- ──────────────────────────────────────────────────────────────────────────
-- Migration 2026-05-03 — Bucket Supabase Storage pour les photos uploadées
-- ──────────────────────────────────────────────────────────────────────────
-- Bug #3 audit lancement : photos produit/avant/après stockées en base64
-- dans pages.json_content → JSON pouvant atteindre 13 MB (rejet DB ou Vercel).
--
-- Ce bucket sert d'alternative : l'API /api/upload pousse le fichier ici,
-- on stocke uniquement l'URL publique dans json_content.images.
-- ──────────────────────────────────────────────────────────────────────────

-- Bucket public en lecture (les pages publiées doivent pouvoir afficher
-- les images sans signature). En écriture, RLS limite chaque user à son
-- propre namespace user_id/.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pages-images',
  'pages-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies RLS sur storage.objects pour ce bucket
-- (on supprime celles qui existent déjà avant de recréer pour être idempotent).

drop policy if exists "pages-images: public read" on storage.objects;
create policy "pages-images: public read"
  on storage.objects for select
  using (bucket_id = 'pages-images');

drop policy if exists "pages-images: user upload own folder" on storage.objects;
create policy "pages-images: user upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pages-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "pages-images: user delete own folder" on storage.objects;
create policy "pages-images: user delete own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pages-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "pages-images: user update own folder" on storage.objects;
create policy "pages-images: user update own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'pages-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
