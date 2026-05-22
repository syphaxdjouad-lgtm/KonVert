import type { ScrapedProduct } from '@/types'

// ─── Détection titres génériques (page bloquée / hallucination LLM) ─────────
// Un titre = nom du domaine signifie qu'on a hit une page splash anti-bot.
// Un titre placeholder ("Product Title", "Women Summer Dress") = LLM Firecrawl
// invente quand il ne voit rien d'utile. On rejette dans les deux cas et on
// tombe sur le fallback HTML/markdown qui parse les vraies données du DOM.

const GENERIC_DOMAIN_TITLES = new Set([
  'aliexpress', 'aliexpress.com', 'ali express',
  'amazon', 'amazon.com', 'amazon.fr', 'amazon.de', 'amazon.co.uk',
  'alibaba', 'alibaba.com',
  'shopify', 'etsy', 'ebay', 'ebay.com',
  'cdiscount', 'fnac', 'temu',
  'home', 'homepage', 'index',
  'product title', 'product name', 'product', 'untitled', 'untitled product',
  'sample product', 'sample product title', 'default product', 'example product',
  'demo product', 'unnamed product', 'no title', 'item name', 'product description',
  'women summer dress', 'men t-shirt', 'women dress', 'men shirt',
])

export function isGenericDomainTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase()
  if (GENERIC_DOMAIN_TITLES.has(normalized)) return true
  if (normalized.length < 6 && !/\d/.test(normalized)) return true
  return false
}

// ─── Parser markdown : 1er h1 + recherche de prix ───────────────────────────

export function parseProductFromMarkdown(md: string): Omit<ScrapedProduct, 'source_url'> | null {
  const h1Match = md.match(/^#\s+(.+)$/m) || md.match(/^##\s+(.+)$/m)
  const title = h1Match?.[1]?.trim().replace(/[*_`]/g, '') || ''
  if (!title) return null

  const priceMatch = md.match(/(?:€|EUR|\$|USD|£|GBP)\s*(\d+[.,]?\d*)/) || md.match(/(\d+[.,]?\d*)\s*(?:€|EUR|\$|USD|£|GBP)/)
  const price = priceMatch?.[1]?.replace(',', '.') ?? null

  const paragraphs = md.split('\n\n').filter(p => {
    const t = p.trim()
    return t && !t.startsWith('#') && !t.startsWith('![') && !t.startsWith('|') && t.length > 20
  })
  const description = paragraphs[0]?.replace(/[*_`]/g, '').trim().slice(0, 500) || ''

  const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g
  const images: string[] = []
  let m: RegExpExecArray | null
  while ((m = imageRegex.exec(md)) !== null) {
    if (m[1].startsWith('http')) images.push(m[1])
  }

  return {
    title:          title.slice(0, 200),
    description,
    images:         images.slice(0, 8),
    price,
    original_price: null,
    variants:       [],
    rating:         null,
    reviews_count:  null,
  }
}

// ─── Parser HTML : JSON-LD prioritaire, sinon og:title + h1 ─────────────────

export function parseProductFromHtml(html: string): Omit<ScrapedProduct, 'source_url'> | null {
  const jsonLd = extractJsonLdProduct(html)
  if (jsonLd && jsonLd.title) return jsonLd

  // og:title est curated par le site pour le partage social → c'est le titre
  // le plus fiable. Sur AliExpress, h1 est souvent vide en SSR (rendu JS),
  // alors qu'og:title contient le vrai nom du produit.
  const getMeta = (name: string): string => {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'))
    return m?.[1] || ''
  }

  const ogTitle = getMeta('og:title')
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i)
  const rawTitle = ogTitle || h1Match?.[1]?.trim() || titleTagMatch?.[1]?.trim() || ''
  if (!rawTitle) return null

  // Nettoyage des suffixes type " - AliExpress 66" / " | Amazon.com" / " - Etsy"
  const title = rawTitle
    .replace(/\s*[-–|]\s*(AliExpress|Amazon[.\w]*|Etsy|eBay|Shopify|Alibaba|Cdiscount|Fnac|Temu)(\s+\d+)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!title) return null

  const description = getMeta('og:description') || getMeta('description')
  const image = getMeta('og:image:secure_url') || getMeta('og:image')
  const price = getMeta('product:price:amount') || getMeta('og:price:amount') || null

  return {
    title:          title.slice(0, 200),
    description:    description.slice(0, 1000),
    images:         image ? [image] : [],
    price,
    original_price: null,
    variants:       [],
    rating:         null,
    reviews_count:  null,
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

      // JSON-LD AliExpress inclut un suffixe " - AliExpress 36" dans le `name`
      // (numéro = page count interne). On nettoie comme pour og:title.
      const rawJsonLdTitle = String(product.name || product.title || '').trim()
      const title = rawJsonLdTitle
        .replace(/\s*[-–|]\s*(AliExpress|Amazon[.\w]*|Etsy|eBay|Shopify|Alibaba|Cdiscount|Fnac|Temu)(\s+\d+)?\s*$/i, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (!title) continue

      const description = String(product.description || '').trim()

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
      continue
    }
  }

  return null
}

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

// ─── Type d'erreur provider avec partial data ───────────────────────────────
// Chaque provider peut throw avec une donnée partielle attachée — l'orchestrator
// agrège le meilleur partial vu pour le retourner en mode dégradé si tout échoue.

export class ProviderError extends Error {
  partial?: ScrapedProduct
  constructor(message: string, partial?: ScrapedProduct) {
    super(message)
    this.name = 'ProviderError'
    this.partial = partial
  }
}

// Score d'une extraction partielle — utilisé par l'orchestrator pour garder
// le "best of all attempts" : titre = 1pt, prix = 2pt, jusqu'à 5 images = 5pt.
export function scorePartial(p: ScrapedProduct): number {
  return (p.title ? 1 : 0) + Math.min(p.images.length, 5) + (p.price ? 2 : 0)
}
