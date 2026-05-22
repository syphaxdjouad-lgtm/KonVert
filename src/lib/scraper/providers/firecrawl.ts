import type { ScrapedProduct } from '@/types'
import {
  ProviderError,
  isGenericDomainTitle,
  parseProductFromHtml,
  parseProductFromMarkdown,
} from './_shared'

export type FirecrawlOpts = { waitFor: number; abortMs: number; mobile: boolean }

// Firecrawl /v1/scrape avec proxy stealth + LLM extraction.
// On demande json + html + markdown : 3 niveaux de fallback dans une seule requête.
export async function scrapeViaFirecrawl(
  url: string,
  apiKey: string,
  opts: FirecrawlOpts,
): Promise<ScrapedProduct> {
  const { waitFor, abortMs, mobile } = opts
  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ['json', 'html', 'markdown'],
      proxy: 'stealth',
      waitFor,
      mobile,
      blockAds: true,
      removeBase64Images: true,
      jsonOptions: {
        prompt: `Extract the REAL product information visible on this exact e-commerce page.

CRITICAL ANTI-HALLUCINATION RULES:
- Use ONLY data that is literally written/displayed on the page.
- If the page shows a CAPTCHA, login wall, "Page not found", or generic placeholder content, return empty strings and empty arrays — do NOT invent values.
- NEVER use generic example values like "Women Summer Dress", "Sample Product", "Product Title", "Men T-Shirt", "Default Product", or similar placeholders.
- For images: only return REAL product images (high resolution from the product gallery). EXCLUDE icons, loaders (e.g. URLs containing "150x150", ".gif" loaders, "placeholder", "loading"), and tracking pixels.
- For price: include the currency symbol exactly as shown on the page (€/£/$).
- For rating: only the numeric rating actually displayed (e.g. 4.7), not invented.
- The product title may be labeled "name", "productName", "productTitle", "title" or "h1" on the page — return whatever is the most prominent product name.

Return: title, description, price, original_price (if discount visible), images (array of full URLs), rating, reviews_count.`,
        schema: {
          type: 'object',
          properties: {
            title:          { type: 'string' },
            description:    { type: 'string' },
            price:          { type: 'string' },
            original_price: { type: 'string' },
            images:         { type: 'array', items: { type: 'string' } },
            rating:         { type: 'number' },
            reviews_count:  { type: 'number' },
          },
        },
      },
    }),
    signal: AbortSignal.timeout(abortMs),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new ProviderError(`Firecrawl HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ''}`)
  }

  const body = await res.json()
  const item = body?.data?.json
  const html = body?.data?.html as string | undefined
  const markdown = body?.data?.markdown as string | undefined

  // 1. LLM extraction OK avec title non-générique
  if (item?.title && !isGenericDomainTitle(item.title)) {
    return {
      title:          item.title || '',
      description:    item.description || '',
      images:         Array.isArray(item.images) ? item.images.slice(0, 8) : [],
      price:          item.price?.toString() || null,
      original_price: item.original_price?.toString() || null,
      variants:       [],
      rating:         item.rating || null,
      reviews_count:  item.reviews_count || null,
      source_url:     url,
    }
  }

  // 2. Fallback HTML brut (JSON-LD prioritaire, puis og:title)
  let fromHtml: Omit<ScrapedProduct, 'source_url'> | null = null
  if (html) {
    fromHtml = parseProductFromHtml(html)
    if (fromHtml?.title && !isGenericDomainTitle(fromHtml.title)) {
      return { ...fromHtml, source_url: url }
    }
  }

  // 3. Fallback markdown (souvent contient le titre/prix quand le DOM est obfusqué)
  let fromMd: Omit<ScrapedProduct, 'source_url'> | null = null
  if (markdown) {
    fromMd = parseProductFromMarkdown(markdown)
    if (fromMd?.title && !isGenericDomainTitle(fromMd.title)) {
      return { ...fromMd, source_url: url }
    }
  }

  // Aggrège le meilleur des 3 sources pour le mode dégradé.
  const safeTitle = (t?: string) => (t && !isGenericDomainTitle(t)) ? t : ''
  const partial: ScrapedProduct = {
    title:          safeTitle(item?.title) || safeTitle(fromHtml?.title) || safeTitle(fromMd?.title) || '',
    description:    item?.description || fromHtml?.description || fromMd?.description || '',
    images:         (Array.isArray(item?.images) && item.images.length ? item.images
                      : (fromHtml?.images?.length ? fromHtml.images : (fromMd?.images || []))).slice(0, 8),
    price:          item?.price?.toString() || fromHtml?.price || fromMd?.price || null,
    original_price: item?.original_price?.toString() || fromHtml?.original_price || null,
    variants:       [],
    rating:         item?.rating || fromHtml?.rating || null,
    reviews_count:  item?.reviews_count || fromHtml?.reviews_count || null,
    source_url:     url,
  }

  const reason = item?.title && isGenericDomainTitle(item.title)
    ? `page bloquée par anti-bot (titre extrait = "${item.title}", générique du domaine)`
    : 'aucun titre exploitable trouvé (LLM + HTML + markdown vides)'
  throw new ProviderError(`Firecrawl — ${reason}`, partial)
}

// Wrapper avec retry mobile→desktop. Premier essai mobile (moins agressif côté
// anti-bot AliExpress), retry desktop si page vide ou timeout. Budget total ≤43s.
export async function scrapeWithFirecrawlRetry(url: string, apiKey: string): Promise<ScrapedProduct> {
  try {
    return await scrapeViaFirecrawl(url, apiKey, {
      waitFor: 10000, abortMs: 25000, mobile: true,
    })
  } catch (err) {
    const msg = (err as Error).message
    const isEmptyPage = msg.includes('aucun titre exploitable') || msg.includes('page bloquée par anti-bot')
    const isTimeout = msg.includes('aborted due to timeout') || msg.includes('AbortError')
    if (!isEmptyPage && !isTimeout) throw err

    try {
      return await scrapeViaFirecrawl(url, apiKey, {
        waitFor: 14000, abortMs: 18000, mobile: false,
      })
    } catch (err2) {
      // Garde le meilleur partial des 2 tentatives
      const partial1 = (err as ProviderError).partial
      const partial2 = (err2 as ProviderError).partial
      const best = partial2 ?? partial1
      throw new ProviderError(
        `Firecrawl — ${msg} | retry: ${(err2 as Error).message}`,
        best,
      )
    }
  }
}
