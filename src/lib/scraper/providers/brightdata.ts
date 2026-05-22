import type { ScrapedProduct } from '@/types'
import { ProviderError, isGenericDomainTitle, parseProductFromHtml } from './_shared'

export type BrightDataOpts = {
  /** Nom de la zone Web Unlocker créée dans le dashboard Bright Data */
  zone: string
  /** Timeout abort côté client (ms) */
  abortMs: number
  /** Country code ISO ('us', 'fr', 'cn'…) — résolu via le proxy résidentiel Bright Data.
   *  Optionnel : par défaut Bright Data choisit selon la zone configurée. */
  countryCode?: string
}

// Bright Data Web Unlocker
// Doc: https://docs.brightdata.com/scraping-automation/web-unlocker/quickstart
//
// API : POST https://api.brightdata.com/request
// Auth : Bearer <API_TOKEN> (Settings → API tokens)
// Body : { zone, url, format: 'raw' } — `raw` = HTML brut (notre cas), `json` = wrapped
//
// Le Web Unlocker gère automatiquement : rotation proxy résidentiel, headers,
// fingerprinting, CAPTCHA solving, retry. Pay-as-you-go ~$3/1000 req sur prix
// public. C'est notre tier le plus fiable mais aussi le plus cher — on l'utilise
// en direct pour AliExpress et en filet pour les autres cas où la cascade échoue.
export async function scrapeViaBrightData(
  url: string,
  apiToken: string,
  opts: BrightDataOpts,
): Promise<ScrapedProduct> {
  const body: Record<string, unknown> = {
    zone:   opts.zone,
    url,
    format: 'raw',
  }
  if (opts.countryCode) {
    body.country = opts.countryCode
  }

  const res = await fetch('https://api.brightdata.com/request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.abortMs),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new ProviderError(
      `Bright Data HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ''}`,
    )
  }

  const html = await res.text()

  if (!html || html.length < 500) {
    throw new ProviderError(`Bright Data — réponse HTML vide ou trop courte (${html?.length ?? 0} bytes)`)
  }

  // Parser standard (JSON-LD prioritaire, puis og:title, h1, <title>)
  const parsed = parseProductFromHtml(html)

  if (parsed?.title && !isGenericDomainTitle(parsed.title)) {
    return { ...parsed, source_url: url }
  }

  // Fallback AliExpress : window.runParams.data — pattern propre à AliExpress
  // qui n'expose ni og:title ni JSON-LD côté HTML. Les données produit vivent
  // dans un objet JS inline qu'on parse à la regex (extraction non-DOM safe car
  // l'objet contient des fonctions JS, on ne peut pas JSON.parse).
  const aliexpressData = parseAliExpressRunParams(html)
  if (aliexpressData?.title && !isGenericDomainTitle(aliexpressData.title)) {
    return { ...aliexpressData, source_url: url }
  }

  // Aggrège tout ce qu'on a vu pour le mode dégradé
  const safeTitle = (t?: string) => (t && !isGenericDomainTitle(t)) ? t : ''
  const partial: ScrapedProduct = {
    title:          safeTitle(parsed?.title) || safeTitle(aliexpressData?.title) || '',
    description:    parsed?.description || aliexpressData?.description || '',
    images:         (parsed?.images?.length ? parsed.images : (aliexpressData?.images || [])).slice(0, 8),
    price:          parsed?.price || aliexpressData?.price || null,
    original_price: parsed?.original_price || aliexpressData?.original_price || null,
    variants:       [],
    rating:         parsed?.rating || aliexpressData?.rating || null,
    reviews_count:  parsed?.reviews_count || aliexpressData?.reviews_count || null,
    source_url:     url,
  }

  const reason = parsed?.title && isGenericDomainTitle(parsed.title)
    ? `page bloquée par anti-bot (titre extrait = "${parsed.title}", générique)`
    : 'aucun titre exploitable dans HTML, JSON-LD, og:title ou window.runParams'
  throw new ProviderError(`Bright Data — ${reason}`, partial)
}

// Wrapper standard pour l'orchestrator. Web Unlocker AliExpress prend 15-35s
// (rotation résidentielle + CAPTCHA solving si nécessaire). Abort 38s pour
// laisser 22s à DeepSeek (60s Vercel total).
export async function scrapeWithBrightData(
  url: string,
  apiToken: string,
  zone: string,
): Promise<ScrapedProduct> {
  return scrapeViaBrightData(url, apiToken, {
    zone,
    abortMs: 38000,
  })
}

// ─── Parser AliExpress window.runParams ─────────────────────────────────────
// AliExpress stocke les données produit dans un objet JS inline :
//   window.runParams = { data: { titleModule: { subject: "..." }, ... } }
// On regex les champs qu'on connaît plutôt que de tenter un JSON.parse (l'objet
// contient des fonctions, des références circulaires, etc.).

function parseAliExpressRunParams(html: string): Omit<ScrapedProduct, 'source_url'> | null {
  // Subject = nom du produit. Format : "subject":"..."
  const subjectMatch = html.match(/"subject"\s*:\s*"((?:[^"\\]|\\.)+)"/)
  const title = subjectMatch?.[1]
    ? subjectMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').trim()
    : ''
  if (!title) return null

  // Prix : formatedPrice (prix affiché courant) et formatedActivityPrice (promo)
  const formatedActivityMatch = html.match(/"formatedActivityPrice"\s*:\s*"([^"]+)"/)
  const formatedPriceMatch = html.match(/"formatedPrice"\s*:\s*"([^"]+)"/)
  const price = formatedActivityMatch?.[1] || formatedPriceMatch?.[1] || null
  // Si on a une promo, le formatedPrice est le prix barré (original)
  const original_price = formatedActivityMatch && formatedPriceMatch ? formatedPriceMatch[1] : null

  // Images : imagePathList = ["url1","url2",...]
  const imageListMatch = html.match(/"imagePathList"\s*:\s*\[([^\]]+)\]/)
  const images: string[] = []
  if (imageListMatch) {
    const urlRegex = /"(https?:\/\/[^"]+)"/g
    let m: RegExpExecArray | null
    while ((m = urlRegex.exec(imageListMatch[1])) !== null) {
      images.push(m[1])
    }
  }

  // Rating + reviews
  const avgStarMatch = html.match(/"averageStar"\s*:\s*"?([\d.]+)"?/)
  const rating = avgStarMatch?.[1] ? Number(avgStarMatch[1]) : null
  const totalValidMatch = html.match(/"totalValidNum"\s*:\s*(\d+)/)
  const reviews_count = totalValidMatch?.[1] ? Number(totalValidMatch[1]) : null

  // Description : descriptionModule.simpleStandardDescription (HTML court)
  const descMatch = html.match(/"simpleStandardDescription"\s*:\s*"((?:[^"\\]|\\.)+)"/)
  const description = descMatch?.[1]
    ? descMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/<[^>]+>/g, '').trim().slice(0, 500)
    : ''

  return {
    title:          title.slice(0, 200),
    description,
    images:         images.slice(0, 8),
    price,
    original_price,
    variants:       [],
    rating:         Number.isFinite(rating) ? rating : null,
    reviews_count:  Number.isFinite(reviews_count) ? reviews_count : null,
  }
}
