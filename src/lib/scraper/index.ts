import type { ScrapedProduct } from '@/types'
import { escapeHtmlText, safeImageUrl } from '@/lib/security/sanitize'
import { ProviderError, isGenericDomainTitle, scorePartial } from './providers/_shared'
import { scrapeViaFirecrawl, scrapeWithFirecrawlRetry } from './providers/firecrawl'
import { scrapeWithScrapingBee } from './providers/scrapingbee'
import { scrapeWithBrightData } from './providers/brightdata'
import { scrapeViaFetch } from './providers/fetch'

// ─── Détection de la plateforme ──────────────────────────────────────────────

export type SupportedPlatform = 'aliexpress' | 'amazon' | 'alibaba' | 'unknown'

export function detectPlatform(url: string): SupportedPlatform {
  if (url.includes('aliexpress.com')) return 'aliexpress'
  if (url.includes('amazon.')) return 'amazon'
  if (url.includes('alibaba.com')) return 'alibaba'
  return 'unknown'
}

// ─── Normalisation URL : retire les query params de tracking ─────────────────
// AliExpress et Amazon ajoutent énormément de params (spm, scm_id, pap_npi,
// gatewayAdapt, url=..., tag, ref, ascsubtag…) qui peuvent transformer une
// URL produit en URL de redirection/tracking et casser le scraping.

export function normalizeProductUrl(input: string): string {
  try {
    const u = new URL(input)
    const host = u.hostname.toLowerCase()

    if (host.endsWith('aliexpress.com') || host.endsWith('aliexpress.us')) {
      const idMatch = u.pathname.match(/\/(?:item|i)\/(\d+)\.html/)
      if (idMatch) {
        return `https://${u.hostname}/item/${idMatch[1]}.html`
      }
      u.search = ''
      return u.toString()
    }

    if (host.includes('amazon.')) {
      const asinMatch = u.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/)
      if (asinMatch) {
        return `https://${u.hostname}/dp/${asinMatch[1]}`
      }
      u.search = ''
      return u.toString()
    }

    return input
  } catch {
    return input
  }
}

// ─── Erreur publique : compat ancienne signature (firecrawl/fetch/jsonld) ───
// L'API /api/scrape utilise detail.firecrawl/detail.fetch dans le message
// d'erreur. On garde la shape mais on ajoute scrapingbee.

export class ScrapeError extends Error {
  constructor(
    message: string,
    public detail: {
      firecrawl?: string
      scrapingbee?: string
      brightdata?: string
      fetch?: string
      jsonld?: string
    },
  ) {
    super(message)
    this.name = 'ScrapeError'
  }
}

// ─── Orchestrator cascade avec routing par plateforme ───────────────────────
//
// AliExpress = anti-bot trop sophistiqué pour Firecrawl/ScrapingBee (testés KO
// les deux sur premium + stealth proxies). On route DIRECT vers Bright Data
// Web Unlocker qui gère résidentiel + CAPTCHA + fingerprinting automatiquement.
// Fallback Firecrawl/ScrapingBee uniquement si Bright Data est down.
//
// Autres plateformes (Amazon, Shopify, Etsy, eBay, Cdiscount, Alibaba…) =
// cascade économique standard Firecrawl → ScrapingBee → Bright Data → fetch.
//
// → si tout échoue mais qu'on a un partial utile (title OU image), on dégrade.
// → sinon throw ScrapeError, le front affiche "saisie manuelle".

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const cleanUrl = normalizeProductUrl(url)
  const platform = detectPlatform(cleanUrl)

  const firecrawlKey = process.env.FIRECRAWL_API_KEY
  const scrapingbeeKey = process.env.SCRAPINGBEE_API_KEY
  const brightdataToken = process.env.BRIGHTDATA_API_TOKEN
  const brightdataZone = process.env.BRIGHTDATA_ZONE

  const errors: { firecrawl?: string; scrapingbee?: string; brightdata?: string; fetch?: string } = {}

  let bestPartial: ScrapedProduct | null = null
  const collectPartial = (p: ScrapedProduct | null | undefined) => {
    if (!p) return
    if (!bestPartial || scorePartial(p) > scorePartial(bestPartial)) bestPartial = p
  }

  const tryFirecrawl = async (): Promise<ScrapedProduct | null> => {
    if (!firecrawlKey) {
      errors.firecrawl = 'FIRECRAWL_API_KEY absent'
      return null
    }
    try {
      // Si on a un Tier 2/3 dispo, on saute le retry mobile→desktop interne
      // de Firecrawl pour préserver le budget temps Vercel (60s).
      const hasFallback = !!scrapingbeeKey || !!(brightdataToken && brightdataZone)
      return hasFallback
        ? await scrapeViaFirecrawl(cleanUrl, firecrawlKey, { waitFor: 10000, abortMs: 22000, mobile: true })
        : await scrapeWithFirecrawlRetry(cleanUrl, firecrawlKey)
    } catch (err) {
      errors.firecrawl = (err as Error).message
      collectPartial((err as ProviderError).partial)
      return null
    }
  }

  const tryScrapingBee = async (): Promise<ScrapedProduct | null> => {
    if (!scrapingbeeKey) {
      errors.scrapingbee = 'SCRAPINGBEE_API_KEY absent'
      return null
    }
    try {
      return await scrapeWithScrapingBee(cleanUrl, scrapingbeeKey)
    } catch (err) {
      errors.scrapingbee = (err as Error).message
      collectPartial((err as ProviderError).partial)
      return null
    }
  }

  const tryBrightData = async (): Promise<ScrapedProduct | null> => {
    if (!brightdataToken || !brightdataZone) {
      errors.brightdata = 'BRIGHTDATA_API_TOKEN ou BRIGHTDATA_ZONE absent'
      return null
    }
    try {
      return await scrapeWithBrightData(cleanUrl, brightdataToken, brightdataZone)
    } catch (err) {
      errors.brightdata = (err as Error).message
      collectPartial((err as ProviderError).partial)
      return null
    }
  }

  const tryFetch = async (): Promise<ScrapedProduct | null> => {
    try {
      return await scrapeViaFetch(cleanUrl)
    } catch (err) {
      errors.fetch = (err as Error).message
      return null
    }
  }

  // Ordre des providers selon la plateforme
  const order: Array<() => Promise<ScrapedProduct | null>> = platform === 'aliexpress'
    ? [tryBrightData, tryFirecrawl, tryScrapingBee, tryFetch]
    : [tryFirecrawl, tryScrapingBee, tryBrightData, tryFetch]

  for (const attempt of order) {
    const product = await attempt()
    if (product) return product
  }

  // ── Dégradation gracieuse ─────────────────────────────────────────────
  if (bestPartial) {
    const safe: ScrapedProduct = bestPartial
    if (safe.title || safe.images.length > 0) {
      return {
        ...safe,
        partial: true,
        scrape_warning: errors.brightdata || errors.scrapingbee || errors.firecrawl || errors.fetch || 'extraction incomplète',
      }
    }
  }

  throw new ScrapeError(`Scraping impossible — toutes les méthodes ont échoué`, errors)
}

// ─── Nettoyage données (post-extraction) ────────────────────────────────────

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
  // Defense-in-depth : la saisie manuelle du wizard envoie product_name /
  // subtitle au lieu de title / description. On accepte les deux shapes.
  const p = product as ScrapedProduct & { product_name?: string; subtitle?: string; headline?: string }
  const safeTitle = (p.title ?? p.product_name ?? '').toString()
  const safeDescription = (p.description ?? p.subtitle ?? p.headline ?? '').toString()
  const safeImages = Array.isArray(product.images) ? product.images : []

  const cleanImages = safeImages
    .map((img) => safeImageUrl(img))
    .filter((img): img is string => img !== null)
    .filter((img) => {
      const lower = img.toLowerCase()
      if (lower.includes('150x150')) return false
      if (lower.includes('placeholder')) return false
      if (lower.includes('loading')) return false
      if (lower.includes('blank.gif')) return false
      if (lower.includes('pixel.gif')) return false
      if (lower.endsWith('.gif') && (lower.includes('icon') || lower.includes('spinner'))) return false
      return true
    })
    .slice(0, 8)

  return {
    ...product,
    title: escapeHtmlText(safeTitle.replace(/\s+/g, ' ').trim().slice(0, 200)),
    description: escapeHtmlText(safeDescription.replace(/\s+/g, ' ').trim().slice(0, 1000)),
    images: cleanImages,
    price: cleanPrice(product.price),
    original_price: cleanPrice(product.original_price),
    variants: Array.isArray(product.variants) ? product.variants : [],
    rating: typeof product.rating === 'number' ? product.rating : null,
    reviews_count: typeof product.reviews_count === 'number' ? product.reviews_count : null,
    source_url: product.source_url ?? '',
  }
}

// ─── Détection hallucination (post-cascade) ─────────────────────────────────
// Filet final avant la génération DeepSeek — bloque les titres placeholders
// qui auraient pu survivre aux fallbacks providers.

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
  if (isGenericDomainTitle(p.title)) return { fake: true, reason: `titre = nom du domaine "${p.title}" (page anti-bot)` }

  if (p.images.length === 0) return { fake: true, reason: 'aucune image produit valide' }

  return { fake: false }
}
