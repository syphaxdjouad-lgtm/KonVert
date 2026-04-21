import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Récupère une preview publique par ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('public_previews')
      .select('id, product_title, html_content, expires_at, converted, email')
      .eq('id', id)
      .single()

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
