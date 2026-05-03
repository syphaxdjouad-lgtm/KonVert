import { NextRequest, NextResponse } from 'next/server'

// GET /api/scrape/diagnostic?secret=...
//
// Renvoie l'état de configuration du scraper :
//  - FIRECRAWL_API_KEY présent ?
//  - Test ping Firecrawl API (validité de la clé + quota)
//
// Protégé par ADMIN_SECRET pour ne pas exposer la config en public.

export const runtime = 'nodejs'
export const maxDuration = 30

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
      // Endpoint Firecrawl /v1/team — ne consomme pas de crédit, vérifie la clé
      const t0 = Date.now()
      const res = await fetch('https://api.firecrawl.dev/v1/team', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(8000),
      })
      result.firecrawl_ping_status = res.status
      result.firecrawl_ping_ok = res.ok
      result.firecrawl_ping_ms = Date.now() - t0
      if (res.ok) {
        const body = await res.json().catch(() => null)
        result.firecrawl_team = body
      } else {
        result.firecrawl_error = await res.text().catch(() => null)
      }
    } catch (err) {
      result.firecrawl_ping_error = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json(result)
}
