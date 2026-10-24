// POST /api/shopify/store-builder/generate
//
// Store Builder Sprint 7 — générateur IA de page produit (spec MINATO
// docs/store-builder-generator-spec.md). Flux : URL produit → scrape
// (réutilise src/lib/scraper, même cascade que /api/scrape) → génération
// deepseek-chat (généré/validé strictement par schéma Zod R5-safe) →
// assemblage dans un template Dawn-compatible (konvert-dawn/templates/
// product.<vertical>.json).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 7, 2026-07-27) :
// aucun appel de cette route n'a encore touché un vrai produit scrapé +
// DeepSeek en conditions réelles (pas de réseau/clé dans cet environnement de
// dev). Tests unitaires (schema/mapping/hallucination/retry) mockent le
// scraper et `generateObject` — cf. src/lib/store-builder/__tests__/.
//
// ⚠️ Latence : scrape (jusqu'à ~65s cascade Bright Data pire cas, cf.
// /api/scrape) + génération DeepSeek (jusqu'à 50s) exécutés séquentiellement
// peuvent dépasser le budget Vercel Pro (maxDuration 90s) sur le pire cas
// combiné. Pas un problème rencontré dans les scrapes habituels (quelques
// secondes), mais à surveiller — si ça devient un point de friction en
// prod, envisager d'accepter un `product` déjà scrapé (évite le double coût)
// plutôt qu'une `url` à re-scraper à chaque génération. Décision founder,
// hors scope Sprint 7.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { scrapeProduct, cleanProduct, ScrapeError } from '@/lib/scraper'
import { cleanProductName } from '@/lib/generation/product-name'
import {
  generateStoreBuilderContent,
  detectSuspiciousClaims,
  assembleProductTemplate,
  deriveVertical,
  merchantFactsSchema,
  isVertical,
} from '@/lib/store-builder'
import { guardStoreBuilderUserRoute } from '@/lib/store-builder/access'

export const maxDuration = 90

const requestBodySchema = z.object({
  url: z.string().url('URL produit invalide'),
  vertical: z.enum(['dropshipping', 'beaute', 'tech']).optional(),
  merchant_facts: merchantFactsSchema.optional(),
})

export async function POST(req: NextRequest) {
  const gate = await guardStoreBuilderUserRoute()
  if (!gate.ok) return gate.response

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
        { status: 401 },
      )
    }

    // Coûte un scrape + un appel LLM par requête — throttle par user pour
    // éviter qu'un double-clic/retry agressif ne fasse exploser la facture
    // Firecrawl/Bright Data/DeepSeek (même doctrine que /api/scrape et
    // /api/shopify/store-builder/install).
    const rl = await rateLimitAsync(`store-builder-generate:${user.id}`, 8, 60_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: `Trop de générations. Réessaie dans ${retryAfter}s.` } },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }

    const rawBody = await req.json().catch(() => null)
    const parsed = requestBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'Payload invalide', details: parsed.error.flatten() } },
        { status: 400 },
      )
    }
    const { url, vertical: requestedVertical, merchant_facts: merchantFacts } = parsed.data

    const urlCheck = validateScrapeUrl(url)
    if (!urlCheck.ok) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_PAYLOAD', message: urlCheck.error } },
        { status: urlCheck.status },
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error('[store-builder/generate] DEEPSEEK_API_KEY manquante')
      return NextResponse.json(
        { ok: false, error: { code: 'CONFIG_ERROR', message: 'Générateur IA indisponible (configuration serveur manquante)' } },
        { status: 500 },
      )
    }

    // ── 1. Scrape (cascade Firecrawl → ScrapingBee → Bright Data → fetch) ──
    let product
    try {
      const raw = await scrapeProduct(urlCheck.parsed.toString())
      product = cleanProduct(raw)
    } catch (err) {
      if (err instanceof ScrapeError) {
        return NextResponse.json(
          { ok: false, error: { code: 'NOT_FOUND', message: 'Impossible d\'extraire les données du produit depuis cette URL', detail: err.message } },
          { status: 502 },
        )
      }
      throw err
    }

    // ── 2. Détermination du vertical (entrée, jamais générée — spec §3.2) ──
    let vertical = requestedVertical
    if (!vertical) {
      const cleaned = await cleanProductName(product.title, 'fr', apiKey).catch(() => null)
      vertical = deriveVertical(cleaned?.category ?? null, cleaned?.product_type ?? null)
    }
    if (!isVertical(vertical)) {
      // Filet défensif — ne devrait jamais arriver (enum Zod + deriveVertical
      // retournent toujours une valeur valide), mais on refuse plutôt que de
      // laisser passer une valeur inattendue vers le générateur.
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'Vertical invalide' } },
        { status: 400 },
      )
    }

    // ── 3. Génération IA (deepseek-chat + generateObject, schéma R5-safe) ──
    const { output, usedFallback, usage } = await generateStoreBuilderContent(product, vertical, merchantFacts)

    // ── 4. Détection d'hallucination — non-bloquant, log + flag UI (§7.3) ──
    const flags = detectSuspiciousClaims(output, product.description, merchantFacts)
    if (flags.some((f) => f.severity === 'critical')) {
      console.error('[store-builder/generate] critical hallucination flag(s) detected (non-blocking)', {
        vertical,
        flagCount: flags.length,
        patterns: flags.map((f) => f.pattern),
      })
    }

    // ── 5. Assemblage — mapping vers le template Dawn-compatible (§9) ──────
    const { template, productFields } = assembleProductTemplate(output, vertical)

    return NextResponse.json({
      ok: true,
      data: {
        vertical,
        template,
        productFields,
        usedFallback,
        usage,
        // Non-bloquant : le dashboard affiche une bannière de vérification si
        // flags.length > 0, ne bloque jamais la génération (spec §8.2).
        flags,
        scrapeWarning: product.scrape_warning,
        partial: product.partial === true,
      },
    })
  } catch (err) {
    console.error('[shopify/store-builder/generate]', err)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/shopify/store-builder/generate' } })
    return NextResponse.json(
      { ok: false, error: { code: 'UNKNOWN', message: err instanceof Error ? err.message : 'Erreur génération Store Builder' } },
      { status: 500 },
    )
  }
}
