import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'
import type { ScrapedProduct, PlanType } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    // Vérification quota si user authentifié (skip pour les routes de test sans auth)
    const supabase    = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('plan, pages_used_this_month')
        .eq('id', user.id)
        .single()

      if (profile) {
        const plan   = (profile.plan || 'starter') as PlanType
        const limit  = PLAN_LIMITS[plan].pages
        const used   = profile.pages_used_this_month || 0

        if (used >= limit) {
          return NextResponse.json(
            { error: `Quota mensuel atteint (${used}/${limit} pages). Upgrade ton plan pour continuer.` },
            { status: 429 }
          )
        }

        // Incrémenter le compteur
        await supabase
          .from('users')
          .update({ pages_used_this_month: used + 1 })
          .eq('id', user.id)
      }
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

    // JSON parse error = Claude a retourné du texte invalide
    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'La génération IA a retourné un format invalide. Réessaie.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
