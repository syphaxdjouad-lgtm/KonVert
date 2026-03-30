import { NextRequest, NextResponse } from 'next/server'
import { verifyHmac, exchangeCodeForToken, encryptToken, SHOPIFY_API_SECRET } from '@/lib/shopify'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// GET /api/shopify/callback?code=...&hmac=...&shop=...&state=...
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const { shop, code, state, hmac } = params

  // 1. Vérifier le state CSRF
  const cookieStore = await cookies()
  const savedState = cookieStore.get('shopify_oauth_state')?.value
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_state_invalid', req.url))
  }
  cookieStore.delete('shopify_oauth_state')

  // 2. Vérifier la signature HMAC de Shopify
  if (!verifyHmac(params, SHOPIFY_API_SECRET)) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_hmac_invalid', req.url))
  }

  // 3. Échanger le code contre un access token
  let accessToken: string
  try {
    accessToken = await exchangeCodeForToken(shop, code)
  } catch (err) {
    console.error('[shopify/callback] token exchange error:', err)
    return NextResponse.redirect(new URL('/dashboard?error=oauth_token_failed', req.url))
  }

  // 4. Chiffrer et stocker le token en DB
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const encryptedToken = encryptToken(accessToken)

    // Upsert du store (mise à jour si déjà connecté)
    const { error } = await supabase
      .from('stores')
      .upsert({
        user_id:      user.id,
        platform:     'shopify',
        store_url:    `https://${shop}`,
        name:         shop.replace('.myshopify.com', ''),
        access_token: encryptedToken,
      }, { onConflict: 'user_id,store_url' })

    if (error) throw error
  } catch (err) {
    console.error('[shopify/callback] db error:', err)
    return NextResponse.redirect(new URL('/dashboard?error=store_save_failed', req.url))
  }

  // 5. Rediriger vers le dashboard avec succès
  return NextResponse.redirect(new URL('/dashboard/stores?connected=shopify', req.url))
}
