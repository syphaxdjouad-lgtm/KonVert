import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// POST /api/stripe/portal — ouvre le portail de gestion Stripe
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer:   sub.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/portal]', err)
    console.error('[stripe/portal] detail:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: 'Erreur Stripe. Réessaie ou contacte le support.' },
      { status: 500 }
    )
  }
}
