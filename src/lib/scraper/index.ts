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
        prompt: 'Extract the product information from this e-commerce page: title, description, price, original_price (if on sale), image URLs, rating, reviews count.',
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

export function cleanProduct(product: ScrapedProduct): ScrapedProduct {
  return {
    ...product,
    title: product.title.replace(/\s+/g, ' ').trim().slice(0, 200),
    description: product.description.replace(/\s+/g, ' ').trim().slice(0, 1000),
    images: product.images.filter((img) => img.startsWith('http')).slice(0, 8),
    price: product.price?.replace(/\s+/g, ' ').trim() || null,
    original_price: product.original_price?.replace(/\s+/g, ' ').trim() || null,
  }
}
