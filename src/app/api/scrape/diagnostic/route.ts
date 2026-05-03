import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '@/lib/scraper'
import { validateScrapeUrl } from '@/lib/security/url-allow'

// GET /api/scrape/diagnostic?secret=...
//   → ping Firecrawl API + check env
//
// GET /api/scrape/diagnostic?secret=...&url=https://...
//   → ping + lance un scrape complet sur l'URL et retourne le résultat brut
//     (utile pour debugger AliExpress/Amazon en prod sans passer par le wizard)
//
// Protégé par ADMIN_SECRET — réservé au debug.

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const apiKey = process.env.FIRECRAWL_API_KEY
  const result: Record<string, unknown> = {
    firecrawl_key_present: !!apiKey,
    firecrawl_key_length: apiKey?.length ?? 0,
    firecrawl_key_prefix: apiKey ? apiKey.slice(0, 6) + '…' : null,
  }

  if (apiKey) {
    try {
      // Endpoint Firecrawl /v1/credit-usage — vérifie la clé et donne le quota restant
      const t0 = Date.now()
      const res = await fetch('https://api.firecrawl.dev/v1/credit-usage', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(8000),
      })
      result.firecrawl_ping_status = res.status
      result.firecrawl_ping_ok = res.ok
      result.firecrawl_ping_ms = Date.now() - t0
      if (res.ok) {
        const body = await res.json().catch(() => null)
        result.firecrawl_credits = body
      } else {
        result.firecrawl_error = (await res.text().catch(() => '')).slice(0, 300)
      }
    } catch (err) {
      result.firecrawl_ping_error = err instanceof Error ? err.message : String(err)
    }
  }

  // Test scrape d'une URL si fournie
  const testUrl = req.nextUrl.searchParams.get('url')
  if (testUrl) {
    const check = validateScrapeUrl(testUrl)
    if (!check.ok) {
      result.test_scrape = { error: check.error, status: check.status }
    } else {
      const t0 = Date.now()
      try {
        const raw = await scrapeProduct(check.parsed.toString())
        const product = cleanProduct(raw)
        const halluc = looksHallucinated(product)
        result.test_scrape = {
          ok: true,
          duration_ms: Date.now() - t0,
          title: product.title,
          description_preview: product.description.slice(0, 100),
          price: product.price,
          original_price: product.original_price,
          images_count: product.images.length,
          images_sample: product.images.slice(0, 3),
          rating: product.rating,
          reviews_count: product.reviews_count,
          looks_hallucinated: halluc.fake,
          hallucination_reason: halluc.reason,
        }
      } catch (err) {
        result.test_scrape = {
          ok: false,
          duration_ms: Date.now() - t0,
          error: err instanceof Error ? err.message : String(err),
          detail: err instanceof ScrapeError ? err.detail : undefined,
        }
      }
    }
  }

  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
}
