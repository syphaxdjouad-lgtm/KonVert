import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'

// Vercel Pro permet jusqu'à 60s — on garde 55s pour les scrapes lourds
export const maxDuration = 55

export async function POST(req: NextRequest) {
  try {
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
      { error: err instanceof Error ? err.message : 'Erreur de scraping' },
      { status: 500 }
    )
  }
}
