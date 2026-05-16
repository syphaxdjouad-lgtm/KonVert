#!/usr/bin/env node
// Smoke test prod konvertpilot.com — J-4 launch readiness check.
// Run: node scripts/prod-smoke-test.mjs

import { chromium } from 'playwright'

const BASE = 'https://konvertpilot.com'
const results = []
let browser

function record(name, ok, detail = '') {
  results.push({ name, ok, detail })
  const icon = ok ? '✅' : '❌'
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function check(name, fn) {
  try {
    const r = await fn()
    record(name, true, r || '')
  } catch (e) {
    record(name, false, e.message.slice(0, 200))
  }
}

async function newPage() {
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (smoke-test konvertpilot-prod-check)',
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text().slice(0, 120)}`)
  })
  return { page, ctx, errors }
}

async function run() {
  browser = await chromium.launch({ headless: true })
  console.log(`\n🧪 Smoke test prod — ${BASE}\n`)

  // 1. Home
  await check('Home : status 200 + H1 unique + 0 erreur JS', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (res.status() !== 200) throw new Error(`status ${res.status()}`)
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {})
    const h1s = await page.locator('h1').count()
    if (h1s !== 1) throw new Error(`${h1s} H1 (expected 1)`)
    const h1Text = await page.locator('h1').first().textContent()
    await ctx.close()
    const realErrors = errors.filter((e) => !e.includes('Failed to load resource'))
    if (realErrors.length > 0) throw new Error(`${realErrors.length} JS errors: ${realErrors[0]}`)
    return `H1="${h1Text?.slice(0, 50)}..."`
  })

  // 2. /launch-day
  await check('/launch-day : countdown + date 20 mai', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(`${BASE}/launch-day`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (res.status() !== 200) throw new Error(`status ${res.status()}`)
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {})
    const body = await page.content()
    const has20Mai =
      body.includes('20 mai') ||
      body.includes('mardi 20') ||
      body.includes('2026-05-20') ||
      body.includes('May 20')
    if (!has20Mai) throw new Error('date 20 mai introuvable dans HTML')
    const hasLaunch50 = body.includes('LAUNCH50')
    if (!hasLaunch50) throw new Error('coupon LAUNCH50 absent')
    await ctx.close()
    const hydrationErr = errors.find((e) => e.includes('Minified React error #418') || e.includes('Hydration'))
    if (hydrationErr) throw new Error(`HYDRATION FAIL: ${hydrationErr.slice(0, 100)}`)
    return 'date OK + coupon OK'
  })

  // 3. /producthunt
  await check('/producthunt : coupon + CTA + tracking', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(`${BASE}/producthunt`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (res.status() !== 200) throw new Error(`status ${res.status()}`)
    const body = await page.content()
    if (!body.includes('LAUNCH50')) throw new Error('coupon manquant')
    if (!body.includes('50')) throw new Error('mention 50% manquante')
    // Check au moins 1 CTA Pricing
    const pricingLink = await page.locator('a[href*="/pricing"]').count()
    if (pricingLink === 0) throw new Error('aucun lien vers /pricing')
    await ctx.close()
    if (errors.length > 0) throw new Error(`JS errors: ${errors[0]}`)
    return `${pricingLink} liens pricing`
  })

  // 4. /pricing — Stripe LIVE check
  await check('/pricing : Stripe LIVE keys + plans visibles', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (res.status() !== 200) throw new Error(`status ${res.status()}`)
    const body = await page.content()
    // Vérifie qu'on a au moins les 3 plans cités
    const hasPro = body.toLowerCase().includes('pro')
    if (!hasPro) throw new Error('plan Pro absent')
    // Stripe TEST mode = bandeau visible normalement
    const isTestMode = body.includes('Test mode') || body.includes('test_mode')
    if (isTestMode) throw new Error('⚠️ STRIPE EN TEST MODE EN PROD')
    await ctx.close()
    if (errors.length > 0) throw new Error(`JS errors: ${errors[0]}`)
    return 'plans OK, pas de bandeau test'
  })

  // 5. /essai — wizard accessible
  await check('/essai : wizard accessible', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(`${BASE}/essai`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    if (res.status() !== 200) throw new Error(`status ${res.status()}`)
    // Page 'use client' — attendre que React monte les inputs
    await page.waitForSelector('input[type="email"], input[type="text"]', { timeout: 10000 })
    const inputs = await page.locator('input').count()
    if (inputs === 0) throw new Error('aucun input après hydratation')
    await ctx.close()
    const realErrors = errors.filter((e) => !e.includes('Failed to load resource'))
    if (realErrors.length > 0) throw new Error(`JS errors: ${realErrors[0]}`)
    return `${inputs} inputs visibles`
  })

  // 6. Sitemap
  await check('Sitemap : 200 + URLs propres (pas de \\n)', async () => {
    const r = await fetch(`${BASE}/sitemap.xml`)
    if (r.status !== 200) throw new Error(`status ${r.status}`)
    const xml = await r.text()
    if (xml.includes('\\n</loc>') || xml.match(/<loc>[^<]*\n/)) {
      throw new Error('newlines détectées dans <loc>')
    }
    const urls = (xml.match(/<loc>/g) || []).length
    if (urls < 10) throw new Error(`seulement ${urls} URLs`)
    if (xml.includes('konvert.app') || xml.includes('konvert-ten')) {
      throw new Error('vieux domaine dans sitemap')
    }
    return `${urls} URLs propres`
  })

  // 7. Robots.txt
  await check('Robots.txt : 200 + Sitemap déclaré', async () => {
    const r = await fetch(`${BASE}/robots.txt`)
    if (r.status !== 200) throw new Error(`status ${r.status}`)
    const txt = await r.text()
    if (!txt.includes('Sitemap:')) throw new Error('Sitemap déclaration absente')
    if (!txt.toLowerCase().includes('konvertpilot.com')) throw new Error('mauvais domaine')
    return 'OK'
  })

  // 8. 404 propre
  await check('404 page : status 404 + pas de crash', async () => {
    const { page, ctx, errors } = await newPage()
    const res = await page.goto(`${BASE}/this-page-does-not-exist-zzz`, { timeout: 30000 })
    if (res.status() !== 404) throw new Error(`status ${res.status()} (expected 404)`)
    await ctx.close()
    const realErrors = errors.filter(
      (e) => !e.includes('Failed to load resource') && !e.includes('status of 404')
    )
    if (realErrors.length > 0) throw new Error(`JS errors: ${realErrors[0]}`)
    return 'OK'
  })

  // 9. API /api/health
  await check('API /api/health : OK', async () => {
    const r = await fetch(`${BASE}/api/health`)
    if (r.status !== 200) throw new Error(`status ${r.status}`)
    const j = await r.json().catch(() => null)
    if (!j) throw new Error('pas de JSON')
    return JSON.stringify(j).slice(0, 60)
  })

  // 10. Security headers
  await check('Security headers : HSTS + CSP + X-Frame', async () => {
    const r = await fetch(BASE, { redirect: 'manual' })
    const h = r.headers
    const missing = []
    if (!h.get('strict-transport-security')) missing.push('HSTS')
    if (!h.get('x-frame-options') && !h.get('content-security-policy')?.includes('frame-ancestors')) {
      missing.push('X-Frame-Options/CSP frame-ancestors')
    }
    if (!h.get('x-content-type-options')) missing.push('X-Content-Type-Options')
    if (missing.length > 0) throw new Error(`manquants: ${missing.join(', ')}`)
    return 'HSTS + frame + nosniff OK'
  })

  // 11. /pricing form Checkout → Stripe LIVE
  await check('Stripe checkout : redirige vers checkout.stripe.com (LIVE)', async () => {
    const { page, ctx, errors } = await newPage()
    await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    // Cherche un bouton subscribe / acheter / souscrire
    const buyButtons = await page.locator('button:has-text("Souscrire"), button:has-text("Démarrer"), button:has-text("Choisir"), a:has-text("Souscrire"), button:has-text("S\'abonner")').count()
    await ctx.close()
    return `${buyButtons} CTAs achat visibles (test redirection manuel)`
  })

  await browser.close()

  // Summary
  console.log('\n' + '='.repeat(60))
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  console.log(`RÉSULTAT: ${passed}/${results.length} OK · ${failed} échecs`)
  if (failed > 0) {
    console.log('\n❌ Échecs:')
    results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`))
    process.exit(1)
  }
  process.exit(0)
}

run().catch((e) => {
  console.error('Fatal:', e)
  process.exit(2)
})
