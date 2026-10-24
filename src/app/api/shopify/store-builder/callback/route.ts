// GET /api/shopify/store-builder/callback?code=...&hmac=...&shop=...&state=...
//
// Callback OAuth dédié Store Builder — miroir de /api/shopify/callback
// (page-builder) mais écrit dans `shopify_store_connections` (pas `stores`)
// et vérifie/stocke le scope Store Builder dédié. Ne touche jamais aux
// lignes `stores` du page-builder.
//
// ⚠️ CODÉ MAIS NON VALIDÉ SANS DEV STORE + APP PARTNER RÉELLE (2026-07-27) :
// écrit contre la doc publique Shopify OAuth, aucun round-trip réel effectué.

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyHmac, encryptToken, exchangeCodeForTokenWithCredentials, isValidShopDomain } from '@/lib/shopify'
import { getStoreBuilderApiKey, getStoreBuilderApiSecret, STORE_BUILDER_STATE_COOKIE } from '@/lib/shopify/store-builder/oauth'
import { createClient } from '@/lib/supabase/server'
import { canUserConnectShop, guardStoreBuilderUserRoute } from '@/lib/store-builder/access'

export async function GET(req: NextRequest) {
  const gate = await guardStoreBuilderUserRoute()
  if (!gate.ok) return gate.response

  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const { shop, code, state } = params

  // 0. Valider le format du shop domain — jamais laisser passer un domaine
  // arbitraire (redirect_uri/token exchange partiraient vers un tiers).
  if (!shop || !isValidShopDomain(shop)) {
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=invalid_shop', req.url))
  }

  // 1. Vérifier le state CSRF (cookie dédié Store Builder)
  const cookieStore = await cookies()
  const savedState = cookieStore.get(STORE_BUILDER_STATE_COOKIE)?.value
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=oauth_state_invalid', req.url))
  }
  cookieStore.delete(STORE_BUILDER_STATE_COOKIE)

  // 2. Vérifier la signature HMAC de la requête Shopify (secret Store Builder)
  if (!verifyHmac(params, getStoreBuilderApiSecret())) {
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=oauth_hmac_invalid', req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=oauth_missing_code', req.url))
  }

  // 2b. Quota de boutiques du plan — re-vérifié ici (point d'écriture) :
  // le connect peut avoir été lancé avant qu'un autre onglet ne consomme
  // le slot. Avant l'échange de code : aucun token obtenu ni stocké.
  if (!(await canUserConnectShop(gate.userId, gate.access.maxStores, shop))) {
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=store_limit_reached', req.url))
  }

  // 3. Échanger le code contre un access token — on récupère le `scope`
  // réellement accordé (pas supposé côté app) pour le stocker en DB.
  let accessToken: string
  let scope: string
  try {
    const result = await exchangeCodeForTokenWithCredentials(
      shop,
      code,
      getStoreBuilderApiKey(),
      getStoreBuilderApiSecret()
    )
    accessToken = result.accessToken
    scope = result.scope
  } catch (err) {
    console.error('[shopify/store-builder/callback] token exchange error:', err)
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=oauth_token_failed', req.url))
  }

  // 4. Chiffrer et stocker le token en DB (upsert par user+shop — gère la
  // reconnexion pour élargir les scopes sans dupliquer de ligne).
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const encryptedToken = encryptToken(accessToken)

    const { error } = await supabase
      .from('shopify_store_connections')
      .upsert(
        {
          user_id: user.id,
          shop_domain: shop,
          access_token: encryptedToken,
          scopes: scope,
        },
        { onConflict: 'user_id,shop_domain' }
      )

    if (error) throw error
  } catch (err) {
    console.error('[shopify/store-builder/callback] db error:', err)
    return NextResponse.redirect(new URL('/dashboard/store-builder?sb_error=store_save_failed', req.url))
  }

  // 5. Rediriger vers le dashboard avec succès
  return NextResponse.redirect(new URL('/dashboard/store-builder?store_builder_connected=1', req.url))
}
