import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'
import { createClient } from '@/lib/supabase/server'

// Vercel Pro permet jusqu'à 60s — on garde 55s pour les scrapes lourds
export const maxDuration = 55

// Domaines e-commerce autorisés — liste exacte de hosts valides (pas de includes() pour éviter le spoofing)
const ALLOWED_HOSTS = new Set([
  'aliexpress.com', 'fr.aliexpress.com', 'www.aliexpress.com',
  'alibaba.com', 'www.alibaba.com',
  'amazon.com', 'www.amazon.com',
  'amazon.fr', 'www.amazon.fr',
  'amazon.co.uk', 'www.amazon.co.uk',
  'amazon.de', 'www.amazon.de',
  'amazon.es', 'www.amazon.es',
  'amazon.it', 'www.amazon.it',
  'amazon.ca', 'www.amazon.ca',
])

// Patterns bloqués pour prévenir le SSRF (IPs privées, métadonnées cloud, IPv6 loopback)
const BLOCKED_PATTERNS = [
  /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^192\.168\./,
  /^169\.254\./, /^::1$/, /^\[::1\]$/, /^0\.0\.0\.0/,
  /^fc00:/, /^fe80:/, /^\[fc00/i, /^\[fe80/i,
  /localhost/i, /metadata/i, /169\.254\.169\.254/,
]

export async function POST(req: NextRequest) {
  try {
    // Auth obligatoire — pas de scraping sans compte
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await req.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 })
    }

    // Validation URL basique
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Protocol non autorisé' }, { status: 400 })
    }

    // Protection SSRF — bloquer les IPs internes et métadonnées cloud
    const hostname = parsedUrl.hostname
    if (BLOCKED_PATTERNS.some(p => p.test(hostname))) {
      return NextResponse.json({ error: 'URL non autorisée' }, { status: 403 })
    }

    // Whitelist exacte — évite le spoofing type "amazon.attacker.com"
    if (!ALLOWED_HOSTS.has(hostname)) {
      return NextResponse.json({ error: 'Domaine non supporté. Utilisez AliExpress, Amazon ou Alibaba.' }, { status: 403 })
    }

    const start = Date.now()

    // Timeout hard à 45s — évite que Vercel tue la fonction sans réponse propre
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Scraping timeout — le site met trop de temps à répondre')), 45000)
    )

    const raw = await Promise.race([scrapeProduct(url), timeout])
    const product = cleanProduct(raw)
    const duration = Date.now() - start

    return NextResponse.json({
      success: true,
      data: product,
      meta: {
        duration_ms: duration,
        platform: parsedUrl.hostname,
        images_count: product.images.length,
      },
    })
  } catch (err) {
    console.error('[/api/scrape]', err)
    return NextResponse.json(
      { error: 'Erreur lors du scraping. Vérifie l\'URL et réessaie.' },
      { status: 500 }
    )
  }
}
