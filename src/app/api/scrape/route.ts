import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'
import { createClient } from '@/lib/supabase/server'
import { validateScrapeUrl } from '@/lib/security/url-allow'

// Vercel Pro permet jusqu'à 60s — on garde 55s pour les scrapes lourds
export const maxDuration = 55

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
