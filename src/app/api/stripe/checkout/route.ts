import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

type PaidPlan = 'starter' | 'pro' | 'agency'

// POST /api/stripe/checkout
// Body: { plan: 'starter' | 'pro' | 'agency' }
export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json() as { plan: PaidPlan }

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       'subscription',
      line_items: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${appUrl}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    console.error('[stripe/checkout] detail:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: 'Erreur Stripe. Réessaie ou contacte le support.' },
      { status: 500 }
    )
  }
}
