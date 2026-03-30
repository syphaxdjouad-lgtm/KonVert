import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage } from '@/lib/anthropic/generate'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import type { ScrapedProduct } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    // Utilise le produit du body ou le mock si absent (mode dev/test)
    const product: ScrapedProduct = body.product ?? MOCK_PRODUCT

    if (!product.title) {
      return NextResponse.json(
        { error: 'Données produit invalides' },
        { status: 400 }
      )
    }

    const landingPage = await generateLandingPage(product)

    return NextResponse.json({
      success: true,
      data: landingPage,
      meta: {
        model: 'claude-haiku-4-5',
        product_source: body.product ? 'provided' : 'mock',
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
