import type { ScrapedProduct } from '@/types'
import { ProviderError, isGenericDomainTitle, parseProductFromHtml } from './_shared'

type PartialProduct = Omit<ScrapedProduct, 'source_url'>

// ─── Fusion HTML (og/JSON-LD) + window.runParams (AliExpress) ────────────────
// AliExpress est un cas particulier : le TITRE est fiable via og:title (curated
// pour le partage social), mais le PRIX, la NOTE et la GALERIE ne vivent QUE
// dans window.runParams (objet JS inline, ni og:price ni JSON-LD côté HTML).
//
// L'ancien code renvoyait dès que parseProductFromHtml trouvait un og:title →
// il n'atteignait JAMAIS parseAliExpressRunParams et perdait prix/note/images.
// On extrait donc les DEUX sources puis on fusionne champ par champ :
//   - titre / description : og/JSON-LD prioritaire (curated), fallback runParams
//   - prix / note / avis  : runParams prioritaire (og n'en a pas), fallback parsed
//   - images              : union dédupliquée (galerie runParams souvent + riche)
export function extractProductFromHtml(html: string): {
  product: PartialProduct | null
  merged: PartialProduct
} {
  const parsed = parseProductFromHtml(html)
  const runParams = parseAliExpressRunParams(html)

  const parsedTitleOk = !!parsed?.title && !isGenericDomainTitle(parsed.title)
  const runTitleOk = !!runParams?.title && !isGenericDomainTitle(runParams.title)

  const title = parsedTitleOk ? parsed!.title : runTitleOk ? runParams!.title : ''

  // Union dédupliquée : galerie produit (runParams) d'abord, puis og:image.
  const images = Array.from(
    new Set([...(runParams?.images ?? []), ...(parsed?.images ?? [])]),
  ).slice(0, 8)

  const merged: PartialProduct = {
    title,
    description: parsed?.description || runParams?.description || '',
    images,
    price: runParams?.price ?? parsed?.price ?? null,
    original_price: runParams?.original_price ?? parsed?.original_price ?? null,
    variants: [],
    rating: runParams?.rating ?? parsed?.rating ?? null,
    reviews_count: runParams?.reviews_count ?? parsed?.reviews_count ?? null,
  }

  // Produit "valide" = titre exploitable (non vide, non générique).
  return { product: title ? merged : null, merged }
}

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

  // Fusion og/JSON-LD (titre curated) + window.runParams (prix/note/galerie
  // AliExpress). Voir extractProductFromHtml pour le détail du merge.
  const { product, merged } = extractProductFromHtml(html)

  if (product) {
    return { ...product, source_url: url }
  }

  // Titre inexploitable : page anti-bot ou HTML squelette. On throw en attachant
  // le meilleur partial vu (le mode dégradé de l'orchestrator le récupère si un
  // titre OU une image a survécu).
  const reason = merged.images.length > 0
    ? 'page anti-bot / HTML non hydraté (titre absent mais images trouvées)'
    : 'aucun titre exploitable dans HTML, JSON-LD, og:title ou window.runParams'
  throw new ProviderError(`Bright Data — ${reason}`, { ...merged, source_url: url })
}

// Wrapper standard pour l'orchestrator. Web Unlocker AliExpress prend 15-35s
// (rotation résidentielle + CAPTCHA solving si nécessaire). Abort 38s pour
// laisser 22s à DeepSeek (60s Vercel total).
//
// Pays du proxy résidentiel épinglé (défaut 'fr') : sans ça, Bright Data route
// via un pays aléatoire → AliExpress sert le produit dans une locale random
// (titres en arabe/russe/etc. vus en prod). Un SaaS FR/EU veut un titre FR +
// des prix en EUR. Override possible via BRIGHTDATA_COUNTRY.
export async function scrapeWithBrightData(
  url: string,
  apiToken: string,
  zone: string,
): Promise<ScrapedProduct> {
  return scrapeViaBrightData(url, apiToken, {
    zone,
    abortMs: 38000,
    countryCode: process.env.BRIGHTDATA_COUNTRY || 'fr',
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
