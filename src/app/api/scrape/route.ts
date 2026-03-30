import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'

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
    const raw = await scrapeProduct(url)
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
