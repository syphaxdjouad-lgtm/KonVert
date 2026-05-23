import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct, ScrapeError } from '@/lib/scraper'
import { createClient } from '@/lib/supabase/server'
import { validateScrapeUrl } from '@/lib/security/url-allow'

// Vercel Pro + Fluid Compute = 90s — Bright Data AliExpress peut prendre 50-65s
export const maxDuration = 90

export async function POST(req: NextRequest) {
  try {
    // Auth obligatoire — pas de scraping sans compte
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await req.json()

    const check = validateScrapeUrl(body?.url)
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: check.status })
    }
    const parsedUrl = check.parsed
    const url = parsedUrl.toString()

    const start = Date.now()

    // Timeout hard à 85s — laisse une marge à Bright Data (38s) + Firecrawl (22s)
    // + ScrapingBee (35s) en cascade, tout en restant sous maxDuration 90s.
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Scraping timeout — le site met trop de temps à répondre')), 85000)
    )

    const raw = await Promise.race([scrapeProduct(url), timeout])
    const product = cleanProduct(raw)
    const duration = Date.now() - start

    return NextResponse.json({
      success: true,
      data: product,
      // partial: true → l'extraction est incomplète, le front affiche un
      // warning et propose à l'user de compléter manuellement avant génération.
      partial: product.partial === true,
      warning: product.scrape_warning,
      meta: {
        duration_ms: duration,
        platform: parsedUrl.hostname,
        images_count: product.images.length,
      },
    })
  } catch (err) {
    console.error('[/api/scrape]', err)
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    const detail = err instanceof ScrapeError ? err.detail : undefined
    return NextResponse.json(
      {
        error: detail
          ? `Scraping échoué : ${msg}. Détail : Firecrawl ${detail.firecrawl ? `→ ${detail.firecrawl}` : 'OK'} | fetch ${detail.fetch ? `→ ${detail.fetch}` : 'OK'}.`
          : `Scraping échoué : ${msg}`,
        debug: detail,
      },
      { status: 500 }
    )
  }
}
