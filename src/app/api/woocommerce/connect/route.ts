import { NextRequest, NextResponse } from 'next/server'
import { WooCommerceClient, encryptCredentials } from '@/lib/woocommerce'
import { createClient } from '@/lib/supabase/server'

// POST /api/woocommerce/connect
// Body: { store_url, consumer_key, consumer_secret }
export async function POST(req: NextRequest) {
  try {
    const { store_url, consumer_key, consumer_secret } = await req.json()

    if (!store_url || !consumer_key || !consumer_secret) {
      return NextResponse.json(
        { error: 'store_url, consumer_key et consumer_secret sont requis' },
        { status: 400 }
      )
    }

    // Valider le format de l'URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(store_url)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error()
    } catch {
      return NextResponse.json({ error: 'URL du store invalide' }, { status: 400 })
    }

    // Protection SSRF — bloquer les IPs privees et localhost
    const host = parsedUrl.hostname
    const blockedPatterns = [
      /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^192\.168\./,
      /^169\.254\./, /^0\.0\.0\.0/, /^localhost$/i, /^\[::1\]$/,
    ]
    if (blockedPatterns.some(p => p.test(host))) {
      return NextResponse.json({ error: 'URL du store invalide' }, { status: 400 })
    }

    // Tester la connexion avant de sauvegarder
    const client = new WooCommerceClient(store_url, consumer_key, consumer_secret)
    let storeInfo: { name: string; url: string; version: string }

    try {
      storeInfo = await client.ping()
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Connexion WooCommerce échouée' },
        { status: 422 }
      )
    }

    // Sauvegarder en DB avec les credentials chiffrés
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const encryptedToken = encryptCredentials(consumer_key, consumer_secret)

    const { data: store, error } = await supabase
      .from('stores')
      .upsert({
        user_id:      user.id,
        platform:     'woocommerce',
        store_url:    parsedUrl.origin,
        name:         storeInfo.name,
        access_token: encryptedToken,
      }, { onConflict: 'user_id,store_url' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        store_id:   store.id,
        store_name: storeInfo.name,
        store_url:  storeInfo.url,
        wc_version: storeInfo.version,
      },
    })
  } catch (err) {
    console.error('[woocommerce/connect]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
