import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage, GENERATION_MODEL } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import type { ScrapedProduct } from '@/types'

// Vercel Pro 60s — DeepSeek prend 18-22s + scraping Firecrawl jusqu'à 45s
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Auth obligatoire — pas de génération sans compte
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    // Vérification et incrément atomique du quota via fonction SQL (FOR UPDATE)
    // Évite la race condition : deux requêtes simultanées ne peuvent pas dépasser le quota
    const { data: quotaOk, error: quotaError } = await supabase
      .rpc('check_and_increment_quota', { p_user_id: user.id })

    if (quotaError) {
      console.error('[/api/generate] quota RPC error:', quotaError.message)
      return NextResponse.json({ error: 'Erreur lors de la vérification du quota.' }, { status: 500 })
    }

    if (!quotaOk) {
      return NextResponse.json(
        { error: 'Quota mensuel atteint. Upgrade ton plan pour continuer.' },
        { status: 429 }
      )
    }

    let product: ScrapedProduct
    // Helper : rollback quota si la génération échoue après l'incrément.
    // Sans ça, un timeout DeepSeek consomme 1 page sans rien produire.
    const rollbackQuota = async () => {
      try {
        await supabase.rpc('decrement_quota', { p_user_id: user.id })
      } catch (rbErr) {
        console.error('[/api/generate] decrement_quota échoué:', rbErr)
      }
    }

    if (body.url) {
      // Mode scraping réel depuis une URL — anti-SSRF via whitelist e-commerce
      const check = validateScrapeUrl(body.url)
      if (!check.ok) {
        await rollbackQuota()
        return NextResponse.json({ error: check.error }, { status: check.status })
      }
      try {
        const raw = await scrapeProduct(check.parsed.toString())
        product = cleanProduct(raw)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'erreur inconnue'
        const detail = err instanceof ScrapeError ? err.detail : undefined
        console.warn('[/api/generate] scraping échoué:', msg, detail)
        await rollbackQuota()
        // On surface le détail technique pour aider à debugger côté user
        // (ex: "Firecrawl 401 unauthorized" → clé API expirée ; "fetch HTTP 503" → site bloque)
        const userMsg = detail
          ? `Scraping échoué : ${msg}. Détail : Firecrawl ${detail.firecrawl ? `→ ${detail.firecrawl}` : 'OK'} | fetch ${detail.fetch ? `→ ${detail.fetch}` : 'OK'}. Utilise la saisie manuelle.`
          : `Scraping échoué (${msg}). Utilise la saisie manuelle.`
        return NextResponse.json(
          { error: userMsg, debug: detail },
          { status: 422 }
        )
      }

      // Anti-hallucination : si Firecrawl a inventé des données génériques
      // ("Women Summer Dress" + image 150x150.gif), on rejette plutôt que
      // de polluer la génération DeepSeek et l'éditeur.
      const check2 = looksHallucinated(product)
      if (check2.fake) {
        console.warn('[/api/generate] données hallucinées:', check2.reason)
        await rollbackQuota()
        return NextResponse.json(
          {
            error: `Cette URL n'a pas pu être scrapée correctement (${check2.reason}). AliExpress et Amazon bloquent souvent les scrapers — utilise la saisie manuelle pour ce produit.`,
          },
          { status: 422 }
        )
      }
    } else {
      // Produit fourni directement (saisie manuelle wizard) ou mock.
      // On passe par cleanProduct pour normaliser le prix saisi à la main
      // (peut contenir "€", virgule, espaces) — sinon les templates affichent €NaN.
      product = body.product ? cleanProduct(body.product) : MOCK_PRODUCT
    }

    if (!product.title) {
      await rollbackQuota()
      return NextResponse.json(
        { error: 'Données produit invalides' },
        { status: 400 }
      )
    }

    let landingPage
    try {
      landingPage = await generateLandingPage(product, {
        language: body.language,
        tone: body.tone,
      })
    } catch (genErr) {
      // Rollback : DeepSeek timeout ou JSON invalide → ne pas brûler le quota.
      await rollbackQuota()
      throw genErr
    }

    return NextResponse.json({
      success: true,
      data: landingPage,
      meta: {
        model: GENERATION_MODEL,
        product_source: body.url ? 'scraped' : body.product ? 'provided' : 'mock',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[/api/generate]', message)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/generate' } })

    // JSON parse error = Claude a retourné du texte invalide
    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'La génération IA a retourné un format invalide. Réessaie.' },
        { status: 500 }
      )
    }

    // Ne jamais exposer les détails internes en prod
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération. Réessaie.' },
      { status: 500 }
    )
  }
}
