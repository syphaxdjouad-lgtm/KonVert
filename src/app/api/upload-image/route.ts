import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { uploadProductImage } from '@/lib/storage/images'

export const maxDuration = 30

// POST /api/upload-image — multipart/form-data { file: File }
// Distinct from /api/upload (pages-images bucket / builder).
// This endpoint targets konvert-product-images for V3 product dashboard uploads.
// Returns { url: string, path: string }.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }

  // Rate limit: 20 uploads/min — same budget as /api/upload, separate key space.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = await rateLimitAsync(`upload-image:${user.id}:${ip}`, 20, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Trop d'uploads, réessaie dans une minute." },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.max(1, Math.ceil(rl.retryAfterMs / 1000))) },
      },
    )
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

  try {
    const result = await uploadProductImage(file, user.id)
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload error'
    // Surface bucket-not-found clearly so ops knows the migration is missing.
    const status = message.toLowerCase().includes('bucket') ? 500 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
