import type { ScrapedProduct } from '@/types'
import {
  ProviderError,
  isGenericDomainTitle,
  parseProductFromHtml,
} from './_shared'

export type ScrapingBeeOpts = {
  abortMs: number
  /** waitFor en ms côté ScrapingBee (équivalent waitFor Firecrawl) */
  wait: number
  /** country_code ISO ('fr', 'us', 'de'…) pour éviter géoblocking AliExpress/Amazon */
  countryCode?: string
  /** premium_proxy=true → résidentiels rotatifs (anti-bot AliExpress/Amazon) — coûte 25 credits/req */
  premiumProxy: boolean
}

// ScrapingBee API : GET https://app.scrapingbee.com/api/v1/?api_key=X&url=Y...
// On récupère l'HTML rendu après JS, et on le parse avec notre parser HTML
// existant (JSON-LD prioritaire, og:title fallback). Stratégie : ScrapingBee
// gère le rendering + anti-bot, on garde le contrôle sur l'extraction.
export async function scrapeViaScrapingBee(
  url: string,
  apiKey: string,
  opts: ScrapingBeeOpts,
): Promise<ScrapedProduct> {
  const params = new URLSearchParams({
    api_key:        apiKey,
    url,
    render_js:      'true',
    premium_proxy:  String(opts.premiumProxy),
    wait:           String(opts.wait),
    // block_resources=false → garde les images chargées (sinon og:image peut manquer)
    block_resources: 'false',
  })
  if (opts.countryCode) params.set('country_code', opts.countryCode)

  const endpoint = `https://app.scrapingbee.com/api/v1/?${params.toString()}`

  const res = await fetch(endpoint, {
    method: 'GET',
    signal: AbortSignal.timeout(opts.abortMs),
  })

  if (!res.ok) {
    // ScrapingBee renvoie le détail de l'erreur dans le body en JSON ou plaintext
    const txt = await res.text().catch(() => '')
    throw new ProviderError(
      `ScrapingBee HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ''}`,
    )
  }

  const html = await res.text()

  if (!html || html.length < 500) {
    throw new ProviderError(`ScrapingBee — réponse HTML vide ou trop courte (${html?.length ?? 0} bytes)`)
  }

  const parsed = parseProductFromHtml(html)

  // Cas idéal : titre extrait et non-générique
  if (parsed?.title && !isGenericDomainTitle(parsed.title)) {
    return { ...parsed, source_url: url }
  }

  // Page rendue mais titre absent/générique → on retourne ce qu'on a en partial
  const partial: ScrapedProduct | undefined = parsed
    ? {
        title:          parsed.title && !isGenericDomainTitle(parsed.title) ? parsed.title : '',
        description:    parsed.description,
        images:         parsed.images,
        price:          parsed.price,
        original_price: parsed.original_price,
        variants:       [],
        rating:         parsed.rating,
        reviews_count:  parsed.reviews_count,
        source_url:     url,
      }
    : undefined

  const reason = parsed?.title && isGenericDomainTitle(parsed.title)
    ? `page bloquée par anti-bot (titre extrait = "${parsed.title}", générique du domaine)`
    : 'aucun titre exploitable trouvé dans le HTML rendu'
  throw new ProviderError(`ScrapingBee — ${reason}`, partial)
}

// Wrapper standard pour l'orchestrator : premium_proxy + country FR, wait 3s.
// Budget : ScrapingBee premium_proxy + render_js peut prendre 15-25s sur
// AliExpress (proxy résidentiel + rendering React lourd). On donne 35s d'abort
// pour absorber ces pics — total avec Firecrawl 1er essai 25s = 60s pile (Vercel).
export async function scrapeWithScrapingBee(url: string, apiKey: string): Promise<ScrapedProduct> {
  return scrapeViaScrapingBee(url, apiKey, {
    abortMs:       35000,
    wait:          3000,
    countryCode:   'fr',
    premiumProxy:  true,
  })
}
