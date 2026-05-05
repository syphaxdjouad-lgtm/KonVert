import type { ScrapedProduct } from '@/types'

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
// On garde uniquement ce qui identifie le produit.

export function normalizeProductUrl(input: string): string {
  try {
    const u = new URL(input)
    const host = u.hostname.toLowerCase()

    // AliExpress : URL canonique = /item/[productId].html — on jette tout le
    // reste. Les params spm/scm_id/pap_npi/gatewayAdapt/url= servent au
    // tracking et peuvent rediriger vers une page de chargement vide.
    if (host.endsWith('aliexpress.com') || host.endsWith('aliexpress.us')) {
      // Extrait l'ID produit du path /item/[id].html ou /i/[id].html
      const idMatch = u.pathname.match(/\/(?:item|i)\/(\d+)\.html/)
      if (idMatch) {
        return `https://${u.hostname}/item/${idMatch[1]}.html`
      }
      // Fallback : on retire juste les params lourds, on garde le path
      u.search = ''
      return u.toString()
    }

    // Amazon : URL canonique = /dp/[ASIN] — on jette tag, ref, ascsubtag, etc.
    if (host.includes('amazon.')) {
      const asinMatch = u.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/)
      if (asinMatch) {
        return `https://${u.hostname}/dp/${asinMatch[1]}`
      }
      u.search = ''
      return u.toString()
    }

    // Autres plateformes : on garde tel quel (Shopify, Etsy, eBay l'utilisent légitimement)
    return input
  } catch {
    return input
  }
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
  // Normalise l'URL : retire les params de tracking AliExpress/Amazon qui
  // peuvent transformer une URL produit en URL de redirection vide.
  const cleanUrl = normalizeProductUrl(url)
  if (cleanUrl !== url) {
    console.log('[scraper] URL normalisée:', { from: url.slice(0, 80) + '…', to: cleanUrl })
  }

  const apiKey = process.env.FIRECRAWL_API_KEY
  const errors: { firecrawl?: string; fetch?: string; jsonld?: string } = {}

  // On accumule les meilleures données partielles vues à chaque tentative.
  // Si tout fail, au lieu de throw, on retourne ce qu'on a (titre OU images)
  // pour que l'UI puisse pré-remplir le formulaire de saisie manuelle.
  let bestPartial: ScrapedProduct | null = null
  const score = (x: ScrapedProduct) =>
    (x.title ? 1 : 0) + Math.min(x.images.length, 5) + (x.price ? 2 : 0)
  const collectPartial = (p: ScrapedProduct | null | undefined) => {
    if (!p) return
    if (!bestPartial || score(p) > score(bestPartial)) bestPartial = p
  }

  if (apiKey) {
    try {
      // 1er essai : mobile UA, waitFor=10s, AbortSignal=25s (10s wait + 15s render).
      // Le mobile UA évite souvent le mur de cookies/CAPTCHA AliExpress.
      const product = await scrapeViaFirecrawl(cleanUrl, apiKey, {
        waitFor: 10000, abortMs: 25000, mobile: true,
      })
      console.log('[scraper] ✓ Firecrawl OK:', { title: product.title, images: product.images.length })
      return product
    } catch (err) {
      const msg = (err as Error).message
      errors.firecrawl = msg
      console.warn('[scraper] ✗ Firecrawl 1er essai échoué:', msg)
      collectPartial((err as { partial?: ScrapedProduct }).partial)

      // Retry si :
      //  - erreur de contenu (titre manquant) : page rendue mais incomplète
      //  - timeout réseau : Firecrawl/AliExpress n'a juste pas eu le temps
      // On switch en UA desktop (mobile=false) pour varier le rendering — certaines
      // pages AliExpress mobile redirigent vers une PWA qui n'expose pas le titre.
      // Budget retry réduit : waitFor=14s + AbortSignal=18s pour rester sous 43s
      // total scraper (laisse 17s+ à DeepSeek dans /api/generate, limite 60s Vercel).
      const isEmptyPage = msg.includes('aucun titre exploitable') || msg.includes('page bloquée par anti-bot')
      const isTimeout = msg.includes('aborted due to timeout') || msg.includes('AbortError')
      if (isEmptyPage || isTimeout) {
        try {
          console.log('[scraper] retry Firecrawl (waitFor=14s, desktop UA)')
          const product = await scrapeViaFirecrawl(cleanUrl, apiKey, {
            waitFor: 14000, abortMs: 18000, mobile: false,
          })
          console.log('[scraper] ✓ Firecrawl retry OK:', { title: product.title, images: product.images.length })
          return product
        } catch (err2) {
          const msg2 = (err2 as Error).message
          errors.firecrawl = `${msg} | retry: ${msg2}`
          console.warn('[scraper] ✗ Firecrawl retry échoué:', msg2)
          collectPartial((err2 as { partial?: ScrapedProduct }).partial)
        }
      }
    }
  } else {
    errors.firecrawl = 'FIRECRAWL_API_KEY absent'
    console.warn('[scraper] ✗ FIRECRAWL_API_KEY absent en env')
  }

  // Fallback : fetch() natif + parsing HTML (JSON-LD prioritaire, meta-tags ensuite)
  try {
    const product = await scrapeViaFetch(cleanUrl)
    console.log('[scraper] ✓ fetch+JSON-LD OK:', { title: product.title, images: product.images.length })
    return product
  } catch (err) {
    const msg = (err as Error).message
    errors.fetch = msg
    console.warn('[scraper] ✗ fetch natif échoué:', msg)
  }

  // ── Dégradation gracieuse ─────────────────────────────────────────────
  // Si on a sauvé au moins UNE donnée utile (titre OU 1+ image), on retourne
  // un produit "partial" plutôt que de throw. L'UI peut alors générer la
  // page avec ce qu'on a et inviter l'user à compléter dans l'éditeur.
  if (bestPartial) {
    const safe: ScrapedProduct = bestPartial
    if (safe.title || safe.images.length > 0) {
      console.log('[scraper] ⚠ retour dégradé (partial):', {
        title: safe.title || '(vide)',
        images: safe.images.length,
        price: safe.price,
      })
      return {
        ...safe,
        partial: true,
        scrape_warning: errors.firecrawl || errors.fetch || 'extraction incomplète',
      }
    }
  }

  // Vraiment rien d'exploitable → on throw, le front affiche "saisie manuelle"
  throw new ScrapeError(
    `Scraping impossible — toutes les méthodes ont échoué`,
    errors,
  )
}

// ─── Firecrawl (primary) ─────────────────────────────────────────────────────

type FirecrawlOpts = { waitFor: number; abortMs: number; mobile: boolean }

// Mapping URL → pays + langue pour le proxy géographique Firecrawl.
// Sans ça, AliExpress sert sa page de splash "country selector" aux IPs
// datacenter (Vercel cdg1, Firecrawl default). Avec une IP FR/DE/US, AliExpress
// et Amazon servent directement la page produit localisée.
function pickProxyLocation(url: string): { country: string; languages: string[] } {
  const u = url.toLowerCase()
  if (u.includes('amazon.de') || u.includes('amazon.nl') || u.includes('amazon.pl')) return { country: 'DE', languages: ['de-DE'] }
  if (u.includes('amazon.es')) return { country: 'ES', languages: ['es-ES'] }
  if (u.includes('amazon.it')) return { country: 'IT', languages: ['it-IT'] }
  if (u.includes('amazon.co.uk')) return { country: 'GB', languages: ['en-GB'] }
  if (u.includes('amazon.ca')) return { country: 'CA', languages: ['en-CA'] }
  if (u.includes('amazon.com') && !u.includes('amazon.com.be')) return { country: 'US', languages: ['en-US'] }
  // Tout le reste (AliExpress, amazon.fr, amazon.com.be, alibaba, etsy, ebay, cdiscount, fnac, temu, shopify)
  // → IP FR par défaut. AliExpress avec IP FR sert la page produit en français
  // sans passer par le splash "shipping country".
  return { country: 'FR', languages: ['fr-FR'] }
}

async function scrapeViaFirecrawl(url: string, apiKey: string, opts: FirecrawlOpts): Promise<ScrapedProduct> {
  const { waitFor, abortMs, mobile } = opts
  const location = pickProxyLocation(url)
  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      // On demande json + html + markdown :
      // - json   : extraction LLM structurée (idéal cas standard)
      // - html   : on parse JSON-LD/og:title nous-mêmes si LLM échoue
      // - markdown : dernier fallback, souvent contient le titre/prix en clair
      //              quand le DOM est obfusqué (AliExpress / Amazon)
      formats: ['json', 'html', 'markdown'],
      proxy: 'stealth',
      // Proxy géographique : bypass le splash AliExpress + sert la page localisée
      location,
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
    // AbortSignal explicite via opts.abortMs (1er essai = 25s, retry = 18s).
    // Total max 43s sur les 2 tentatives → laisse ≥17s à DeepSeek (60s Vercel).
    signal: AbortSignal.timeout(abortMs),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Firecrawl HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ''}`)
  }

  const body = await res.json()
  const item = body?.data?.json
  const html = body?.data?.html as string | undefined
  const markdown = body?.data?.markdown as string | undefined

  // 1. Cas idéal : LLM extraction OK avec title NON-générique
  // (un title qui matche le nom du domaine = "Aliexpress", "Amazon" → page bloquée)
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

  // 2. Fallback : LLM a retourné title vide ou domaine → on parse l'HTML brut.
  // JSON-LD prioritaire (Amazon/Shopify l'exposent), puis og:title.
  let fromHtml: Omit<ScrapedProduct, 'source_url'> | null = null
  if (html) {
    fromHtml = parseProductFromHtml(html)
    if (fromHtml?.title && !isGenericDomainTitle(fromHtml.title)) {
      console.log('[scraper] Firecrawl JSON insuffisant → HTML parsing OK')
      return { ...fromHtml, source_url: url }
    }
  }

  // 3. Dernier fallback : parser le markdown généré par Firecrawl.
  // Quand le DOM est obfusqué et que JSON-LD est absent, le markdown contient
  // souvent le titre du produit comme premier h1 et les prix en clair.
  let fromMd: Omit<ScrapedProduct, 'source_url'> | null = null
  if (markdown) {
    fromMd = parseProductFromMarkdown(markdown)
    if (fromMd?.title && !isGenericDomainTitle(fromMd.title)) {
      console.log('[scraper] Firecrawl JSON+HTML insuffisants → markdown parsing OK')
      return { ...fromMd, source_url: url }
    }
  }

  // ── Préparation du fallback dégradé ────────────────────────────────────
  // On agrège le meilleur de ce qu'on a vu (LLM + HTML + markdown), même si
  // chaque source était insuffisante isolément. On l'attache à l'erreur pour
  // que scrapeProduct puisse l'exposer en mode "partial" plutôt que tout perdre.
  // IMPORTANT : on filtre les titres génériques (nom du domaine = page splash)
  // sur chaque source — sans ça, "Aliexpress" du LLM remontait jusqu'au wizard.
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

  // Diagnostic explicite pour aider le user à comprendre
  const reason = item?.title && isGenericDomainTitle(item.title)
    ? `page bloquée par anti-bot (titre extrait = "${item.title}", générique du domaine)`
    : 'aucun titre exploitable trouvé (LLM + HTML + markdown vides)'
  const err = new Error(`Firecrawl — ${reason}`) as Error & { partial?: ScrapedProduct }
  err.partial = partial
  throw err
}

// Détecte si un titre est juste le nom du domaine (= page bloquée) OU un
// placeholder générique LLM ("Product Title", "Sample Product"…).
// Si oui, on rejette et on tombe sur le fallback HTML/markdown qui parse
// les vraies données depuis le DOM (og:title, JSON-LD).
const GENERIC_DOMAIN_TITLES = new Set([
  // Noms de domaines (page de splash)
  'aliexpress', 'aliexpress.com', 'ali express',
  'amazon', 'amazon.com', 'amazon.fr', 'amazon.de', 'amazon.co.uk',
  'alibaba', 'alibaba.com',
  'shopify', 'etsy', 'ebay', 'ebay.com',
  'cdiscount', 'fnac', 'temu',
  'home', 'homepage', 'index',
  // Placeholders LLM (Firecrawl hallucine quand l'extraction échoue)
  'product title', 'product name', 'product', 'untitled', 'untitled product',
  'sample product', 'sample product title', 'default product', 'example product',
  'demo product', 'unnamed product', 'no title', 'item name', 'product description',
  'women summer dress', 'men t-shirt', 'women dress', 'men shirt',
])

function isGenericDomainTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase()
  if (GENERIC_DOMAIN_TITLES.has(normalized)) return true
  // Titres trop courts (1-2 mots vagues) : suspect
  if (normalized.length < 6 && !/\d/.test(normalized)) return true
  return false
}

// Parser markdown : extrait le 1er h1 comme titre, et tente de trouver un prix.
function parseProductFromMarkdown(md: string): Omit<ScrapedProduct, 'source_url'> | null {
  // Premier h1 (# Titre) ou h2 (## Titre) du markdown
  const h1Match = md.match(/^#\s+(.+)$/m) || md.match(/^##\s+(.+)$/m)
  const title = h1Match?.[1]?.trim().replace(/[*_`]/g, '') || ''
  if (!title) return null

  // Recherche de prix : patterns courants €/$/£ avec montant
  const priceMatch = md.match(/(?:€|EUR|\$|USD|£|GBP)\s*(\d+[.,]?\d*)/) || md.match(/(\d+[.,]?\d*)\s*(?:€|EUR|\$|USD|£|GBP)/)
  const price = priceMatch?.[1]?.replace(',', '.') ?? null

  // Description : 1er paragraphe non-titre, non-image
  const paragraphs = md.split('\n\n').filter(p => {
    const t = p.trim()
    return t && !t.startsWith('#') && !t.startsWith('![') && !t.startsWith('|') && t.length > 20
  })
  const description = paragraphs[0]?.replace(/[*_`]/g, '').trim().slice(0, 500) || ''

  // Images : URLs trouvées dans markdown ![alt](url) ou en HTML inline
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

// Parser HTML mutualisé : JSON-LD prioritaire, sinon og:title + h1.
// Utilisé à la fois par scrapeViaFirecrawl (fallback HTML) et scrapeViaFetch.
function parseProductFromHtml(html: string): Omit<ScrapedProduct, 'source_url'> | null {
  // 1. JSON-LD schema.org (Amazon, Shopify, Etsy l'exposent presque toujours)
  const jsonLd = extractJsonLdProduct(html)
  if (jsonLd && jsonLd.title) return jsonLd

  // 2. Priorité og:title > h1 > <title>.
  // og:title est curated par le site pour le partage social → c'est le titre
  // le plus fiable. Sur AliExpress, le h1 est souvent vide en SSR (rendu JS),
  // alors que og:title contient le vrai nom du produit.
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
  const parsed = parseProductFromHtml(html)
  if (!parsed) throw new Error('Aucun titre trouvé (page bloquée ou structure non reconnue)')
  return { ...parsed, source_url: url }
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
  // Défense en profondeur : si le titre est juste le nom du domaine (page splash
  // anti-bot), on le rejette même si le partial path l'a laissé passer.
  if (isGenericDomainTitle(p.title)) return { fake: true, reason: `titre = nom du domaine "${p.title}" (page anti-bot)` }

  // Si pas une seule image valide après nettoyage → page bloquée
  if (p.images.length === 0) return { fake: true, reason: 'aucune image produit valide' }

  return { fake: false }
}
