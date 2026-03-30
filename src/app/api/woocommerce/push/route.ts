import { NextRequest, NextResponse } from 'next/server'
import { WooCommerceClient, decryptCredentials } from '@/lib/woocommerce'
import { createClient } from '@/lib/supabase/server'

// POST /api/woocommerce/push
// Body: { store_id, page_id }
export async function POST(req: NextRequest) {
  try {
    const { store_id, page_id } = await req.json()

    if (!store_id || !page_id) {
      return NextResponse.json({ error: 'store_id et page_id requis' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Récupérer le store WooCommerce de l'utilisateur
    const { data: store, error: storeErr } = await supabase
      .from('stores')
      .select('*')
      .eq('id', store_id)
      .eq('user_id', user.id)
      .eq('platform', 'woocommerce')
      .single()

    if (storeErr || !store) {
      return NextResponse.json({ error: 'Store WooCommerce introuvable' }, { status: 404 })
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
      return NextResponse.json(
        { error: 'Page sans contenu HTML — génère la landing page d\'abord' },
        { status: 400 }
      )
    }

    // Décrypter les credentials et pusher
    const { consumerKey, consumerSecret } = decryptCredentials(store.access_token)
    const client = new WooCommerceClient(store.store_url, consumerKey, consumerSecret)

    let result: { id: number; url: string }

    if (page.published_url) {
      // Extraire l'ID WordPress depuis l'URL stockée
      const match = page.published_url.match(/\?p=(\d+)$|\/(\d+)\/?$/)
      const existingId = match ? parseInt(match[1] || match[2], 10) : 0

      if (existingId) {
        await client.updatePage(existingId, page.title, page.html_content)
        result = { id: existingId, url: page.published_url }
      } else {
        result = await client.createPage(page.title, page.html_content)
      }
    } else {
      result = await client.createPage(page.title, page.html_content)
    }

    // Mettre à jour la page en DB
    await supabase
      .from('pages')
      .update({ published_url: result.url, status: 'published' })
      .eq('id', page_id)

    return NextResponse.json({
      success: true,
      data: { wp_page_id: result.id, url: result.url },
    })
  } catch (err) {
    console.error('[woocommerce/push]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur WooCommerce' },
      { status: 500 }
    )
  }
}
