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

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const apiKey = process.env.FIRECRAWL_API_KEY

  if (apiKey) {
    try {
      return await scrapeViaFirecrawl(url, apiKey)
    } catch (err) {
      console.warn('[scraper] Firecrawl échoué, fallback natif:', (err as Error).message)
    }
  } else {
    console.warn('[scraper] FIRECRAWL_API_KEY absent — fallback natif uniquement')
  }

  // Fallback : fetch() natif (HTML basique, sans JS)
  return await scrapeViaFetch(url)
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

// ─── Fallback fetch natif (sans JS, meta tags uniquement) ────────────────────

async function scrapeViaFetch(url: string): Promise<ScrapedProduct> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`Fetch natif erreur ${res.status}`)

  const html = await res.text()

  const getMetaContent = (name: string): string => {
    const match = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'))
    return match?.[1] || ''
  }

  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i)
  const title = titleMatch?.[1]?.trim() || getMetaContent('og:title') || ''

  if (!title) throw new Error('Titre introuvable via fetch natif')

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
