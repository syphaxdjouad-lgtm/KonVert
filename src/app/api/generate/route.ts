import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import type { ScrapedProduct } from '@/types'

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

    if (body.url) {
      // Mode scraping réel depuis une URL
      const raw = await scrapeProduct(body.url)
      product = cleanProduct(raw)
    } else {
      // Produit fourni directement ou mock
      product = body.product ?? MOCK_PRODUCT
    }

    if (!product.title) {
      return NextResponse.json(
        { error: 'Données produit invalides' },
        { status: 400 }
      )
    }

    const landingPage = await generateLandingPage(product, {
      language: body.language,
      tone: body.tone,
    })

    return NextResponse.json({
      success: true,
      data: landingPage,
      meta: {
        model: 'claude-haiku-4-5',
        product_source: body.url ? 'scraped' : body.product ? 'provided' : 'mock',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[/api/generate]', message)

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
