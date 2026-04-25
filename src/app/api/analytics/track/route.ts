import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role pour écriture analytics sans auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Headers CORS pour les appels cross-origin (pages Shopify/WooCommerce)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

// POST /api/analytics/track
// Appelé par le script de tracking injecté dans les pages générées
export async function POST(req: NextRequest) {
  try {
    const { page_id, event_type, meta } = await req.json()

    if (!page_id || !event_type) {
      return NextResponse.json({ error: 'page_id et event_type requis' }, { status: 400 })
    }

    const allowed = ['view', 'cta_click', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100']
    if (!allowed.includes(event_type)) {
      return NextResponse.json({ error: 'event_type invalide' }, { status: 400 })
    }

    // Valider que page_id est un UUID valide et que la page existe
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRe.test(page_id)) {
      return NextResponse.json({ error: 'page_id invalide' }, { status: 400 })
    }

    // Tracker uniquement les pages publiées — bloque la pollution de stats
    // sur des brouillons / pages archivées.
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id, status')
      .eq('id', page_id)
      .eq('status', 'published')
      .maybeSingle()

    if (!page) {
      return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })
    }

    // Hash de l'IP pour anonymat RGPD
    const ip     = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || ''
    const ipHash = ip ? await hashIp(ip) : null

    await supabaseAdmin.from('analytics_events').insert({
      page_id,
      event_type,
      ip_hash:    ipHash,
      user_agent: req.headers.get('user-agent')?.slice(0, 200) || null,
    })

    // Mettre à jour les compteurs dénormalisés sur la page
    if (event_type === 'view') {
      await supabaseAdmin.rpc('increment_page_views', { p_page_id: page_id })
    } else if (event_type === 'cta_click') {
      await supabaseAdmin.rpc('increment_cta_clicks', { p_page_id: page_id })
    }

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
  } catch (err) {
    // On ne renvoie pas d'erreur pour ne pas bloquer les pages visiteurs
    console.error('[analytics/track]', err)
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
  }
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data    = encoder.encode(ip + process.env.ENCRYPTION_KEY)
  const hash    = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
}
