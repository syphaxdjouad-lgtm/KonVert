import { NextRequest, NextResponse } from 'next/server'
import { buildOAuthUrl, generateState } from '@/lib/shopify'
import { cookies } from 'next/headers'

// GET /api/shopify/install?shop=my-store.myshopify.com
export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')

  if (!shop) {
    return NextResponse.json({ error: 'Paramètre shop manquant' }, { status: 400 })
  }

  // Valider le format du shop
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop.toLowerCase())) {
    return NextResponse.json({ error: 'Format shop invalide (ex: mon-store.myshopify.com)' }, { status: 400 })
  }

  // Générer un state CSRF et le stocker en cookie
  const state = generateState()
  const cookieStore = await cookies()
  cookieStore.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  const oauthUrl = buildOAuthUrl(shop, state)
  return NextResponse.redirect(oauthUrl)
}
