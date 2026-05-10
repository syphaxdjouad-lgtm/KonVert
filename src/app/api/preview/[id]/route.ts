import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Format UUID v4 — le caller doit fournir l'ID complet, pas de listing.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Récupère une preview publique par ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Preview introuvable' }, { status: 404 })
    }

    // Pas d'email retourné côté client — RGPD.
    const { data, error } = await supabaseAdmin
      .from('public_previews')
      .select('id, product_title, html_content, expires_at, converted')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Preview introuvable' }, { status: 404 })
    }

    // Vérifier expiration
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Cette preview a expiré.' }, { status: 410 })
    }

    return NextResponse.json({
      id: data.id,
      product_title: data.product_title,
      html_content: data.html_content,
      expires_at: data.expires_at,
      converted: data.converted,
    })
  } catch (err) {
    console.error('[preview/id]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
