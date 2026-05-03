import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

// Limites strictes côté serveur pour éviter qu'un user n'envoie un fichier
// énorme qui exploserait le storage Supabase.
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
])

const BUCKET = 'pages-images'

// POST /api/upload — multipart/form-data { file: File, kind?: 'product'|'before'|'after' }
// Retourne { url, path }. L'URL est servie publiquement par Supabase Storage.
//
// Remplace l'ancien stockage en base64 dans json_content.images qui faisait
// exploser la taille des rows pages (5 photos × 2 MB = ~13 MB JSON, rejeté
// par Vercel body limit 4.5 MB et lent à requêter).
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Body invalide (multipart attendu)' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Champ "file" manquant' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Fichier trop lourd (${Math.round(file.size / 1024 / 1024)} MB). Max ${MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 }
    )
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `Type de fichier non supporté (${file.type}). JPG, PNG, WEBP, GIF, AVIF uniquement.` },
      { status: 415 }
    )
  }

  const kindRaw = formData.get('kind')
  const kind = typeof kindRaw === 'string' && ['product', 'before', 'after'].includes(kindRaw)
    ? kindRaw
    : 'product'

  // Chemin namespace user/kind/timestamp-randombytes.ext
  // Le préfixe user.id permet de scoper la RLS Storage et de retrouver/supprimer
  // facilement tout ce qu'a uploadé un user.
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : 'jpg'
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`
  const path = `${user.id}/${kind}/${filename}`

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000', // 1 an — l'URL contient un suffixe random unique
      contentType: file.type,
      upsert: false,
    })

  if (uploadErr) {
    console.error('[/api/upload]', uploadErr.message)
    // "Bucket not found" = la migration 20260503_pages_images_bucket.sql
    // n'a pas été appliquée en base.
    if (uploadErr.message.toLowerCase().includes('bucket')) {
      return NextResponse.json(
        { error: 'Stockage non configuré. Contacte le support.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: 'Échec de l\'upload' }, { status: 500 })
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ url: pub.publicUrl, path })
}
