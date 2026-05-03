import type { ScrapedProduct } from '@/types'

// ─── Détection de la plateforme ──────────────────────────────────────────────

export type SupportedPlatform = 'aliexpress' | 'amazon' | 'alibaba' | 'unknown'

export function detectPlatform(url: string): SupportedPlatform {
  if (url.includes('aliexpress.com')) return 'aliexpress'
  if (url.includes('amazon.')) return 'amazon'
  if (url.includes('alibaba.com')) return 'alibaba'
  return 'unknown'
}

// ─── Scraper principal ───────────────────────────────────────────────────────
// Firecrawl est le scraper primaire (stealth proxy, compatible serverless Vercel).
// Le scraper natif fetch() est le fallback léger si Firecrawl échoue.

export class ScrapeError extends Error {
  constructor(
    message: string,
    public detail: { firecrawl?: string; fetch?: string; jsonld?: string },
  ) {
    super(message)
    this.name = 'ScrapeError'
  }
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  const errors: { firecrawl?: string; fetch?: string; jsonld?: string } = {}

  if (apiKey) {
    try {
      const product = await scrapeViaFirecrawl(url, apiKey)
      console.log('[scraper] ✓ Firecrawl OK:', { title: product.title, images: product.images.length })
      return product
    } catch (err) {
      const msg = (err as Error).message
      errors.firecrawl = msg
      console.warn('[scraper] ✗ Firecrawl échoué:', msg)
    }
  } else {
    errors.firecrawl = 'FIRECRAWL_API_KEY absent'
    console.warn('[scraper] ✗ FIRECRAWL_API_KEY absent en env')
  }

  // Fallback : fetch() natif + parsing HTML (JSON-LD prioritaire, meta-tags ensuite)
  try {
    const product = await scrapeViaFetch(url)
    console.log('[scraper] ✓ fetch+JSON-LD OK:', { title: product.title, images: product.images.length })
    return product
  } catch (err) {
    const msg = (err as Error).message
    errors.fetch = msg
    console.warn('[scraper] ✗ fetch natif échoué:', msg)
  }

  throw new ScrapeError(
    `Scraping impossible — toutes les méthodes ont échoué`,
    errors,
  )
}

// ─── Firecrawl (primary) ─────────────────────────────────────────────────────

async function scrapeViaFirecrawl(url: string, apiKey: string): Promise<ScrapedProduct> {
  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ['json'],
      proxy: 'stealth',
      waitFor: 3000,
      jsonOptions: {
        prompt: `Extract the REAL product information visible on this exact e-commerce page.

CRITICAL ANTI-HALLUCINATION RULES:
- Use ONLY data that is literally written/displayed on the page.
- If the page shows a CAPTCHA, login wall, "Page not found", or generic placeholder content, return empty strings and empty arrays — do NOT invent values.
- NEVER use generic example values like "Women Summer Dress", "Sample Product", "Product Title", "Men T-Shirt", "Default Product", or similar placeholders.
- For images: only return REAL product images (high resolution from the product gallery). EXCLUDE icons, loaders (e.g. URLs containing "150x150", ".gif" loaders, "placeholder", "loading"), and tracking pixels.
- For price: include the currency symbol exactly as shown on the page (€/£/$).
- For rating: only the numeric rating actually displayed (e.g. 4.7), not invented.

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
    signal: AbortSignal.timeout(45000),
  })

  if (!res.ok) throw new Error(`Firecrawl erreur ${res.status}`)

  const body = await res.json()
  const item = body?.data?.json

  if (!item?.title) throw new Error('Firecrawl — titre introuvable')

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

// ─── Fallback fetch natif (sans JS, JSON-LD prioritaire + meta tags) ─────────

async function scrapeViaFetch(url: string): Promise<ScrapedProduct> {
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

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

  const html = await res.text()

  // 1. Tentative JSON-LD (Amazon, AliExpress, Shopify, Etsy l'exposent)
  const jsonLd = extractJsonLdProduct(html)
  if (jsonLd && jsonLd.title) {
    return { ...jsonLd, source_url: url }
  }

  // 2. Fallback meta-tags Open Graph
  const getMetaContent = (name: string): string => {
    const match = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'))
    return match?.[1] || ''
  }

  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i)
  const title = titleMatch?.[1]?.trim() || getMetaContent('og:title') || ''

  if (!title) throw new Error('Aucun titre trouvé (page bloquée ou structure non reconnue)')

  const description = getMetaContent('og:description') || getMetaContent('description')
  const image = getMetaContent('og:image')
  const price = getMetaContent('product:price:amount') || getMetaContent('og:price:amount') || null

  return {
    title:          title.slice(0, 200),
    description:    description.slice(0, 1000),
    images:         image ? [image] : [],
    price,
    original_price: null,
    variants:       [],
    rating:         null,
    reviews_count:  null,
    source_url:     url,
  }
}

// ─── JSON-LD parser (schema.org Product) ─────────────────────────────────────
// Amazon, AliExpress, Shopify, Etsy, eBay, Cdiscount exposent presque toujours
// les infos produit dans <script type="application/ld+json"> au format Product.

function extractJsonLdProduct(html: string): Omit<ScrapedProduct, 'source_url'> | null {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  if (matches.length === 0) return null

  for (const m of matches) {
    try {
      const raw = m[1].trim()
      if (!raw) continue
      const parsed = JSON.parse(raw)
      const products = flattenJsonLd(parsed)
      const product = products.find(p => isProductLike(p))
      if (!product) continue

      const title = String(product.name || product.title || '').trim()
      if (!title) continue

      const description = String(product.description || '').trim()

      // Images : peut être string, array de string, ou array d'objets ImageObject
      const imagesRaw = product.image || product.images || []
      const images: string[] = []
      const collectImage = (v: unknown) => {
        if (typeof v === 'string') images.push(v)
        else if (v && typeof v === 'object' && 'url' in (v as Record<string, unknown>)) {
          images.push(String((v as Record<string, unknown>).url))
        }
      }
      if (Array.isArray(imagesRaw)) imagesRaw.forEach(collectImage)
      else collectImage(imagesRaw)

      // Prix : product.offers peut être un Offer, une AggregateOffer, ou un array
      const offers = product.offers
      let price: string | null = null
      let originalPrice: string | null = null
      const extractPrice = (o: unknown): string | null => {
        if (!o || typeof o !== 'object') return null
        const obj = o as Record<string, unknown>
        const p = obj.price ?? obj.lowPrice
        return p != null ? String(p) : null
      }
      if (Array.isArray(offers)) {
        price = extractPrice(offers[0])
      } else if (offers) {
        price = extractPrice(offers)
        const obj = offers as Record<string, unknown>
        if (obj.highPrice && obj.highPrice !== obj.price) {
          originalPrice = String(obj.highPrice)
        }
      }

      // Note + reviews
      const aggregateRating = product.aggregateRating as Record<string, unknown> | undefined
      const rating = aggregateRating?.ratingValue ? Number(aggregateRating.ratingValue) : null
      const reviewsCount = aggregateRating?.reviewCount
        ? Number(aggregateRating.reviewCount)
        : aggregateRating?.ratingCount
        ? Number(aggregateRating.ratingCount)
        : null

      return {
        title:          title.slice(0, 200),
        description:    description.slice(0, 1000),
        images:         images.slice(0, 8),
        price,
        original_price: originalPrice,
        variants:       [],
        rating:         Number.isFinite(rating) ? rating : null,
        reviews_count:  Number.isFinite(reviewsCount) ? reviewsCount : null,
      }
    } catch {
      // JSON malformé ou non-Product → on continue avec le bloc suivant
      continue
    }
  }

  return null
}

// JSON-LD peut être un Product direct, un @graph contenant un Product, ou un array.
function flattenJsonLd(node: unknown): Record<string, unknown>[] {
  if (!node) return []
  if (Array.isArray(node)) return node.flatMap(flattenJsonLd)
  if (typeof node !== 'object') return []
  const obj = node as Record<string, unknown>
  if (Array.isArray(obj['@graph'])) return flattenJsonLd(obj['@graph'])
  return [obj]
}

function isProductLike(obj: Record<string, unknown>): boolean {
  const type = obj['@type']
  if (!type) return false
  const types = Array.isArray(type) ? type : [type]
  return types.some(t => typeof t === 'string' && /^product/i.test(t))
}

// ─── Nettoyage données ────────────────────────────────────────────────────────

// Normalise un prix scrapé (peut contenir €, $, virgule décimale, espaces…)
// vers une string numérique pure utilisable par parseFloat() côté templates.
function cleanPrice(p: string | null | undefined): string | null {
  if (!p) return null
  const cleaned = String(p)
    .replace(/[^\d,.\-]/g, '')
    .replace(/,/g, '.')
    .replace(/^\.+/, '')
    .trim()
  if (!cleaned) return null
  const parts = cleaned.split('.')
  const normalized = parts.length > 1
    ? parts.slice(0, -1).join('') + '.' + parts[parts.length - 1]
    : cleaned
  const n = parseFloat(normalized)
  if (!Number.isFinite(n) || n < 0) return null
  return String(n)
}

export function cleanProduct(product: ScrapedProduct): ScrapedProduct {
  // Filtre les URLs d'images : exclut les loaders/placeholders (150x150.gif,
  // pixels de tracking, icônes) qui sont typiques d'une page bloquée.
  const cleanImages = product.images
    .filter((img) => img.startsWith('http'))
    .filter((img) => {
      const lower = img.toLowerCase()
      if (lower.includes('150x150')) return false
      if (lower.includes('placeholder')) return false
      if (lower.includes('loading')) return false
      if (lower.includes('blank.gif')) return false
      if (lower.includes('pixel.gif')) return false
      // Accepte .gif uniquement si l'URL ne ressemble pas à un loader/icon
      if (lower.endsWith('.gif') && (lower.includes('icon') || lower.includes('spinner'))) return false
      return true
    })
    .slice(0, 8)

  return {
    ...product,
    title: product.title.replace(/\s+/g, ' ').trim().slice(0, 200),
    description: product.description.replace(/\s+/g, ' ').trim().slice(0, 1000),
    images: cleanImages,
    price: cleanPrice(product.price),
    original_price: cleanPrice(product.original_price),
  }
}

// ─── Détection de données hallucinées par le LLM Firecrawl ──────────────────
// Quand AliExpress / Amazon bloque le scraping, Firecrawl LLM invente parfois
// des données génériques ("Women Summer Dress", placeholder $25.99…). On les
// rejette en amont pour ne pas polluer la génération DeepSeek + le builder.

const HALLUCINATED_TITLES = new Set([
  'sample product', 'sample product title', 'product title', 'product name',
  'untitled', 'untitled product', 'default product', 'example product',
  'women summer dress', 'men t-shirt', 'women dress', 'men shirt',
  'product', 'unnamed product', 'no title', 'demo product',
])

export function looksHallucinated(p: ScrapedProduct): { fake: boolean; reason?: string } {
  const title = p.title.trim().toLowerCase()

  if (!title) return { fake: true, reason: 'titre vide' }
  if (title.length < 5) return { fake: true, reason: 'titre trop court' }
  if (HALLUCINATED_TITLES.has(title)) return { fake: true, reason: `titre générique "${p.title}"` }

  // Si pas une seule image valide après nettoyage → page bloquée
  if (p.images.length === 0) return { fake: true, reason: 'aucune image produit valide' }

  return { fake: false }
}
