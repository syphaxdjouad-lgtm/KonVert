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

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const platform = detectPlatform(url)

  // Tente le scraper natif 2 fois avant de tomber sur Apify
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      switch (platform) {
        case 'aliexpress': return await scrapeAliExpress(url)
        case 'amazon':     return await scrapeAmazon(url)
        case 'alibaba':    return await scrapeAlibaba(url)
        default:           return await scrapeGeneric(url)
      }
    } catch (err) {
      console.warn(`[scraper] Tentative ${attempt}/2 échouée sur ${platform}:`, (err as Error).message)
      if (attempt < 2) {
        // Pause 2s entre les tentatives
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  }

  // Fallback Firecrawl si les 2 tentatives natives échouent
  console.warn(`[scraper] Fallback Firecrawl pour ${platform}`)
  return await scrapeViaFirecrawl(url)
}

// ─── Helpers Puppeteer ───────────────────────────────────────────────────────

async function getBrowser() {
  const puppeteer = await import('puppeteer')
  return puppeteer.default.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1280,720',
    ],
  })
}

async function getPage(browser: Awaited<ReturnType<typeof getBrowser>>) {
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )
  await page.setViewport({ width: 1280, height: 720 })
  // Masquer Puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })
  return page
}

// ─── AliExpress ──────────────────────────────────────────────────────────────

async function scrapeAliExpress(url: string): Promise<ScrapedProduct> {
  const browser = await getBrowser()
  try {
    const page = await getPage(browser)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // AliExpress charge les données dans window.runParams
    const data = await page.evaluate(() => {
      const rp = (window as any).runParams
      const product = rp?.data?.productInfoComponent || rp?.data?.skuComponent
      const title = document.querySelector('h1')?.textContent?.trim() || ''
      const images: string[] = []

      // Récupérer les images du slider
      document.querySelectorAll('.slider-img img, .magnifier-image').forEach((img) => {
        const src = (img as HTMLImageElement).src
        if (src && !src.includes('placeholder') && !images.includes(src)) {
          images.push(src.split('_')[0]) // version HD sans suffix
        }
      })

      // Prix
      const priceEl = document.querySelector('.product-price-value, .uniform-banner-box-price')
      const price = priceEl?.textContent?.trim() || null

      // Description
      const descEl = document.querySelector('.product-description, #product-description')
      const description = descEl?.textContent?.trim().slice(0, 500) || ''

      return { title, images: images.slice(0, 8), price, description }
    })

    if (!data.title) throw new Error('Titre AliExpress introuvable — anti-bot actif')

    return {
      title: data.title,
      description: data.description,
      images: data.images,
      price: data.price,
      original_price: null,
      variants: [],
      rating: null,
      reviews_count: null,
      source_url: url,
    }
  } finally {
    await browser.close()
  }
}

// ─── Amazon ──────────────────────────────────────────────────────────────────

async function scrapeAmazon(url: string): Promise<ScrapedProduct> {
  const browser = await getBrowser()
  try {
    const page = await getPage(browser)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const data = await page.evaluate(() => {
      const title =
        (document.querySelector('#productTitle') as HTMLElement)?.innerText?.trim() || ''

      const price =
        document
          .querySelector('.a-price .a-offscreen, #priceblock_ourprice')
          ?.textContent?.trim() || null

      const originalPrice =
        document
          .querySelector('.a-price.a-text-price .a-offscreen, #priceblock_saleprice')
          ?.textContent?.trim() || null

      const ratingEl = document.querySelector('#acrPopover')
      const rating = ratingEl
        ? parseFloat(ratingEl.getAttribute('title')?.split(' ')[0] || '0')
        : null

      const reviewsEl = document.querySelector('#acrCustomerReviewText')
      const reviews_count = reviewsEl
        ? parseInt(reviewsEl.textContent?.replace(/[^0-9]/g, '') || '0', 10)
        : null

      const images: string[] = []
      document.querySelectorAll('#altImages img, #imageBlock img').forEach((img) => {
        const src =
          (img as HTMLImageElement).src?.replace(/\._[A-Z0-9_,]+_\./, '._AC_SL1500_.') || ''
        if (src.includes('amazon') && !images.includes(src)) images.push(src)
      })

      const description =
        (document.querySelector('#feature-bullets') as HTMLElement)?.innerText?.trim().slice(
          0,
          500
        ) || ''

      // Variantes
      const variants: { name: string; values: string[] }[] = []
      document.querySelectorAll('.variation-select').forEach((select) => {
        const name = select.previousElementSibling?.textContent?.trim() || ''
        const values = Array.from(select.querySelectorAll('option'))
          .map((o) => o.textContent?.trim() || '')
          .filter(Boolean)
        if (name && values.length) variants.push({ name, values })
      })

      return { title, price, original_price: originalPrice, images: images.slice(0, 8), description, rating, reviews_count, variants }
    })

    if (!data.title) throw new Error('Titre Amazon introuvable — anti-bot actif')

    return { ...data, source_url: url }
  } finally {
    await browser.close()
  }
}

// ─── Alibaba ─────────────────────────────────────────────────────────────────

async function scrapeAlibaba(url: string): Promise<ScrapedProduct> {
  const browser = await getBrowser()
  try {
    const page = await getPage(browser)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || ''

      const priceEl = document.querySelector('.price, .product-price')
      const price = priceEl?.textContent?.trim() || null

      const images: string[] = []
      document.querySelectorAll('.slider-img img, .detail-gallery-img img').forEach((img) => {
        const src = (img as HTMLImageElement).src
        if (src && !images.includes(src)) images.push(src)
      })

      const description =
        (document.querySelector('.product-desc') as HTMLElement)?.innerText?.trim().slice(
          0,
          500
        ) || ''

      return { title, price, images: images.slice(0, 8), description }
    })

    if (!data.title) throw new Error('Titre Alibaba introuvable')

    return {
      title: data.title,
      description: data.description,
      images: data.images,
      price: data.price,
      original_price: null,
      variants: [],
      rating: null,
      reviews_count: null,
      source_url: url,
    }
  } finally {
    await browser.close()
  }
}

// ─── Scraper générique (HTML basique) ────────────────────────────────────────

async function scrapeGeneric(url: string): Promise<ScrapedProduct> {
  const browser = await getBrowser()
  try {
    const page = await getPage(browser)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const data = await page.evaluate(() => {
      const title =
        document.querySelector('h1')?.textContent?.trim() ||
        document.title

      const images: string[] = []
      document.querySelectorAll('img').forEach((img) => {
        const src = img.src
        if (src && img.naturalWidth > 200 && !images.includes(src)) images.push(src)
      })

      const description =
        (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content ||
        document.querySelector('p')?.textContent?.trim() ||
        ''

      return { title, images: images.slice(0, 6), description }
    })

    return {
      title: data.title,
      description: data.description,
      images: data.images,
      price: null,
      original_price: null,
      variants: [],
      rating: null,
      reviews_count: null,
      source_url: url,
    }
  } finally {
    await browser.close()
  }
}

// ─── Fallback Firecrawl ───────────────────────────────────────────────────────

async function scrapeViaFirecrawl(url: string): Promise<ScrapedProduct> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) throw new Error('FIRECRAWL_API_KEY manquant et scraper natif échoué')

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
        prompt: 'Extract the product information from this e-commerce page.',
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
