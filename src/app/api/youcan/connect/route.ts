import { NextRequest, NextResponse } from 'next/server'
import { YouCanClient, encryptYouCanToken } from '@/lib/youcan'
import { createClient } from '@/lib/supabase/server'

// POST /api/youcan/connect
// Body: { api_token, store_name? }
export async function POST(req: NextRequest) {
  try {
    const { api_token, store_name } = await req.json()

    if (!api_token) {
      return NextResponse.json({ error: 'api_token requis' }, { status: 400 })
    }

    // Authentification Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Tester le token avant de sauvegarder
    const client = new YouCanClient(api_token)
    let storeInfo: { id: string; name: string; url: string }

    try {
      storeInfo = await client.ping()
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Connexion YouCan échouée' },
        { status: 422 }
      )
    }

    const encryptedToken = encryptYouCanToken(api_token)
    const resolvedName   = store_name || storeInfo.name || 'Ma boutique YouCan'
    const resolvedUrl    = storeInfo.url || `youcan-store-${storeInfo.id}`

    const { data: store, error } = await supabase
      .from('stores')
      .upsert({
        user_id:      user.id,
        platform:     'youcan',
        store_url:    resolvedUrl,
        name:         resolvedName,
        access_token: encryptedToken,
      }, { onConflict: 'user_id,store_url' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        store_id:   store.id,
        store_name: resolvedName,
        store_url:  resolvedUrl,
      },
    })
  } catch (err) {
    console.error('[youcan/connect]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
