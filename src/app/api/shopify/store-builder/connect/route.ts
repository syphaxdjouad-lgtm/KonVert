// GET /api/shopify/store-builder/connect?shop=my-store.myshopify.com
//
// Démarre le flow OAuth dédié Store Builder (scopes write_themes,
// write_products, read_products — cf. src/lib/shopify/store-builder/oauth.ts).
// Volontairement séparé de /api/shopify/install (page-builder, scopes
// write_pages/read_pages/write_content/read_content) : voir justification
// dans oauth.ts et le rapport de commit Sprint 6.
//
// Sert aussi de point de "reconnexion" : un store déjà connecté au
// page-builder (ligne dans `stores`) OU déjà connecté au Store Builder avec
// des scopes insuffisants doit repasser par cette route pour (ré)autoriser
// avec les scopes Store Builder — le callback fait un upsert par
// (user_id, shop_domain), donc rejouer ce flow met simplement à jour le
// token + scopes existants sans dupliquer de ligne.
//
// ⚠️ CODÉ MAIS NON VALIDÉ SANS DEV STORE + APP PARTNER RÉELLE (2026-07-27).

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateState, isValidShopDomain } from '@/lib/shopify'
import { buildStoreBuilderOAuthUrl, STORE_BUILDER_STATE_COOKIE } from '@/lib/shopify/store-builder/oauth'

export async function GET(req: NextRequest) {
  const shopParam = req.nextUrl.searchParams.get('shop')
  const shop = shopParam?.toLowerCase()

  if (!shop || !isValidShopDomain(shop)) {
    return NextResponse.json(
      { error: 'Paramètre shop invalide (ex: mon-store.myshopify.com)' },
      { status: 400 }
    )
  }

  const state = generateState()
  const cookieStore = await cookies()
  cookieStore.set(STORE_BUILDER_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  return NextResponse.redirect(buildStoreBuilderOAuthUrl(shop, state))
}
