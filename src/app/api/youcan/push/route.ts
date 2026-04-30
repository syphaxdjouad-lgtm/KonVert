import { NextRequest, NextResponse } from 'next/server'
import { YouCanClient, decryptYouCanToken } from '@/lib/youcan'
import { createClient } from '@/lib/supabase/server'
import { injectTracker } from '@/lib/analytics/tracker'

// POST /api/youcan/push
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

    // Récupérer le store YouCan
    const { data: store, error: storeErr } = await supabase
      .from('stores')
      .select('*')
      .eq('id', store_id)
      .eq('user_id', user.id)
      .eq('platform', 'youcan')
      .single()

    if (storeErr || !store) {
      return NextResponse.json({ error: 'Store YouCan introuvable' }, { status: 404 })
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

    // Injecter le tracker analytics
    const appUrl      = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackedHtml = injectTracker(page.html_content, page_id, appUrl)

    // Push vers YouCan
    const apiToken = decryptYouCanToken(store.access_token)
    const client   = new YouCanClient(apiToken)

    let result: { id: string; url: string }
    const existingId = page.published_id ?? null

    if (existingId) {
      await client.updatePage(String(existingId), page.title, trackedHtml)
      result = { id: String(existingId), url: page.published_url || '' }
    } else {
      result = await client.createPage(page.title, trackedHtml)
    }

    // Sauvegarder l'URL publiée
    await supabase
      .from('pages')
      .update({
        published_url: result.url,
        published_id:  result.id,
        status:        'published',
      })
      .eq('id', page_id)

    return NextResponse.json({
      success: true,
      data: { youcan_page_id: result.id, url: result.url },
    })
  } catch (err) {
    console.error('[youcan/push]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur YouCan' },
      { status: 500 }
    )
  }
}
