import type { ScrapedProduct } from '@/types'
import { ProviderError, parseProductFromHtml } from './_shared'

// Fallback fetch natif (sans JS). Utilisé quand tous les providers premium
// échouent ou que les clés API sont absentes. JSON-LD prioritaire — Amazon
// expose le produit en JSON-LD même en réponse SSR sans JS.
export async function scrapeViaFetch(url: string): Promise<ScrapedProduct> {
  const res = await fetch(url, {
    headers: {
      // UA Chrome desktop récent — moins de chances d'être servi un bot-page
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
    },
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
  })

  if (!res.ok) throw new ProviderError(`fetch HTTP ${res.status} ${res.statusText}`)

  const html = await res.text()
  const parsed = parseProductFromHtml(html)
  if (!parsed) throw new ProviderError('fetch — aucun titre trouvé (page bloquée ou structure non reconnue)')
  return { ...parsed, source_url: url }
}
