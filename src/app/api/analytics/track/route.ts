import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'

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
    // Rate limit : 30 events/min/IP. L'endpoint est public + CORS wildcard
    // (script de tracking embarqué sur les boutiques clients) donc sans
    // throttle un script adverse peut polluer les stats de toutes les pages
    // publiées. Au-delà du seuil on renvoie un 200 silencieux pour ne pas
    // signaler le throttle au tracker côté client (et éviter qu'il retry).
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const rl = await rateLimitAsync(`analytics:${ip}`, 30, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
    }

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

    // Audit Fable 5 SEC-04 : le rate-limit 30/min/IP ci-dessus ralentit un
    // spam mais n'empêche pas un script tiers de gonfler durablement le
    // compteur "vues" (métrique la plus visible côté dashboard) en rejouant
    // 'view' depuis la même IP sur la durée. cta_click/scroll_* ne sont PAS
    // dédupliqués ici : un vrai visiteur peut légitimement re-cliquer un CTA
    // ou re-scroller plusieurs fois dans une même session.
    // 1 'view' compté par (page_id, IP) toutes les 30 min — réutilise le
    // rate-limiter Upstash existant comme dédup léger, pas de requête DB
    // supplémentaire à chaque insert.
    if (event_type === 'view' && ip !== 'unknown') {
      const dedup = await rateLimitAsync(`analytics-view-dedup:${page_id}:${ip}`, 1, 30 * 60_000)
      if (!dedup.allowed) {
        return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
      }
    }

    // Hash de l'IP pour anonymat RGPD — réutilise l'IP déjà extraite pour le
    // rate limit, sauf si elle vaut 'unknown' (pas d'IP réelle disponible).
    const ipHash = ip !== 'unknown' ? await hashIp(ip) : null

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
