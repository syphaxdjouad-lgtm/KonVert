import { createClient } from '@/lib/supabase/server'

const BUCKET = 'konvert-product-images'
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

export interface UploadResult {
  url: string
  path: string
}

/**
 * Upload an image file to the konvert-product-images bucket.
 *
 * Path layout: {userId}/{timestamp}-{uuid-prefix}.{ext}
 * The userId prefix is required by the RLS policy (folder-scoped upload).
 */
export async function uploadProductImage(
  file: File,
  userId: string,
): Promise<UploadResult> {
  if (file.size > MAX_SIZE) {
    throw new Error(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB, max 10 MB)`,
    )
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported type (${file.type}). Allowed: JPG, PNG, WEBP, GIF, AVIF`)
  }

  const supabase = await createClient()

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExt = /^[a-z0-9]+$/.test(rawExt) ? rawExt : 'jpg'
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`
  const path = `${userId}/${filename}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000', // 1 year — path contains unique timestamp+uuid
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return { url: pub.publicUrl, path: data.path }
}

/**
 * Remove a file from the konvert-product-images bucket.
 * Caller is responsible for verifying ownership before calling this.
 */
export async function deleteProductImage(path: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}
