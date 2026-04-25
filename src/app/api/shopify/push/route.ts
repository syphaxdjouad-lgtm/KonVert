import { NextRequest, NextResponse } from 'next/server'
import { ShopifyClient, decryptToken } from '@/lib/shopify'
import { createClient } from '@/lib/supabase/server'
import { injectTracker } from '@/lib/analytics/tracker'

// POST /api/shopify/push
// Body: { store_id, page_id } — publie une page KONVERT dans le store Shopify
export async function POST(req: NextRequest) {
  try {
    const { store_id, page_id } = await req.json()

    if (!store_id || !page_id) {
      return NextResponse.json({ error: 'store_id et page_id requis' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Récupérer le store (appartient bien à l'utilisateur)
    const { data: store, error: storeErr } = await supabase
      .from('stores')
      .select('*')
      .eq('id', store_id)
      .eq('user_id', user.id)
      .eq('platform', 'shopify')
      .single()

    if (storeErr || !store) {
      return NextResponse.json({ error: 'Store Shopify introuvable' }, { status: 404 })
    }

    // Récupérer la page KONVERT
    const { data: page, error: pageErr } = await supabase
      .from('pages')
      .select('*')
      .eq('id', page_id)
      .eq('user_id', user.id)
      .single()

    if (pageErr || !page) {
      return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })
    }

    if (!page.html_content) {
      return NextResponse.json({ error: 'Page sans contenu HTML — génère la landing page d\'abord' }, { status: 400 })
    }

    // Injecter le script de tracking dans le HTML
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackedHtml = injectTracker(page.html_content, page_id, appUrl)

    // Décrypter le token et pusher sur Shopify
    const accessToken = decryptToken(store.access_token)
    const shopDomain  = store.store_url.replace('https://', '')
    const client      = new ShopifyClient(shopDomain, accessToken)

    let result: { id: number; url: string }

    // ID Shopify stocké dans une colonne dédiée — plus fiable que reparser
    // l'URL stockée (qui peut avoir été éditée dans le store).
    const existingId = page.published_id ?? 0

    if (existingId) {
      await client.updatePage(existingId, page.title, trackedHtml)
      result = { id: existingId, url: page.published_url || '' }
    } else {
      result = await client.createPage(page.title, trackedHtml)
    }

    // Sauvegarder l'URL ET l'ID natif Shopify
    await supabase
      .from('pages')
      .update({ published_url: result.url, published_id: result.id, status: 'published' })
      .eq('id', page_id)

    return NextResponse.json({
      success: true,
      data: { shopify_page_id: result.id, url: result.url },
    })
  } catch (err) {
    console.error('[shopify/push]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur Shopify' },
      { status: 500 }
    )
  }
}
