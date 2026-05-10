import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, getStripePrice, type BillingInterval } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { getAppUrl } from '@/lib/env'

type PaidPlan = 'starter' | 'pro' | 'agency'

// POST /api/stripe/checkout
// Body: { plan: 'starter' | 'pro' | 'agency', interval?: 'monthly' | 'annual' }
// `interval` par défaut 'monthly' — sans ce param, l'UI envoie depuis le toggle.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { plan: PaidPlan; interval?: BillingInterval; coupon?: string }
    const { plan } = body
    const interval: BillingInterval = body.interval === 'annual' ? 'annual' : 'monthly'
    // Coupon promo (LAUNCH50, etc.) — Stripe gere la validite cote serveur, on
    // pre-applique seulement le code via discounts pour eviter au user de
    // retaper. Si invalide, Stripe affiche une erreur user-friendly.
    const couponCode = typeof body.coupon === 'string' && body.coupon.length < 50
      ? body.coupon.trim().toUpperCase()
      : undefined

    if (!['starter', 'pro', 'agency'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Récupérer ou créer le customer Stripe
    const { data: profile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = sub?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  profile?.name || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
    }

    const appUrl = getAppUrl()

    let priceId: string
    try {
      priceId = getStripePrice(plan, interval)
    } catch (err) {
      // Env var STRIPE_PRICE_*_ANNUAL absente — on refuse plutôt que de silently
      // basculer sur le price mensuel (ancien bug). User informé qu'il faut
      // contacter le support pour activer la facturation annuelle.
      const Sentry = await import('@sentry/nextjs').catch(() => null)
      Sentry?.captureException(err, { tags: { route: 'stripe/checkout', phase: 'price_lookup' }, extra: { plan, interval } })
      return NextResponse.json(
        { error: 'Cette combinaison plan/intervalle n\'est pas encore disponible. Choisis Mensuel ou contacte le support.' },
        { status: 503 }
      )
    }

    // Si un coupon explicite est fourni, on essaie de l'appliquer via `discounts`.
    // Sinon on garde `allow_promotion_codes: true` pour permettre la saisie
    // manuelle dans le checkout Stripe. Les deux ne peuvent PAS coexister
    // (limitation Stripe API).
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer:   customerId,
      mode:       'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${appUrl}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        interval,
        ...(couponCode && { coupon: couponCode }),
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan, interval },
      },
    }
    if (couponCode) {
      // Stripe attend un Promotion Code (commence par `promo_`) pas un nom de
      // coupon. On lookup le promotion code via le code humain (LAUNCH50).
      try {
        const promoCodes = await stripe.promotionCodes.list({ code: couponCode, active: true, limit: 1 })
        if (promoCodes.data[0]) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }]
        } else {
          // Coupon invalide ou expiré → on fallback sur la saisie manuelle
          // (le user verra un champ "Promo code" dans le checkout Stripe).
          sessionParams.allow_promotion_codes = true
        }
      } catch {
        sessionParams.allow_promotion_codes = true
      }
    } else {
      sessionParams.allow_promotion_codes = true
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'stripe/checkout' } })
    return NextResponse.json(
      { error: 'Erreur Stripe. Réessaie ou contacte le support.' },
      { status: 500 }
    )
  }
}
