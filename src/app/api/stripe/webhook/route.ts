import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import type { PlanType } from '@/types'

// Webhook Stripe — utilise le service role pour bypasser RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] Signature invalide:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const userId = session.metadata?.supabase_user_id
        const plan   = session.metadata?.plan as PlanType
        if (!userId || !plan) break

        await activateSubscription(userId, plan, session.customer as string, session.subscription as string)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        const plan = getPlanFromPrice(sub.items.data?.[0]?.price?.id)
        if (!plan) {
          console.warn('[webhook] Plan introuvable pour subscription:', sub.id)
          break
        }
        const periodEnd = (sub as any).current_period_end ?? 0
        await updateSubscription(userId, plan, sub.status, periodEnd)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        // Downgrade vers starter à l'expiration
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'starter' })
          .eq('user_id', userId)

        await supabaseAdmin
          .from('users')
          .update({ plan: 'starter' })
          .eq('id', userId)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId   = (invoice as any).subscription as string
        if (!subId) break

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subId)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId   = (invoice as any).subscription as string
        if (!subId) break

        // Réinitialiser le quota mensuel au renouvellement
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subId)
          .single()

        if (sub?.user_id) {
          await supabaseAdmin
            .from('users')
            .update({ pages_used_this_month: 0, quota_reset_at: new Date().toISOString() })
            .eq('id', sub.user_id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] Erreur traitement:', err)
    return NextResponse.json({ error: 'Erreur traitement' }, { status: 500 })
  }
}

async function activateSubscription(
  userId: string,
  plan: PlanType,
  customerId: string,
  subscriptionId: string
) {
  // Récupérer la sub Stripe pour avoir la date de fin
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)

  await supabaseAdmin.from('subscriptions').upsert({
    user_id:                userId,
    stripe_customer_id:     customerId,
    stripe_subscription_id: subscriptionId,
    plan,
    status:                 'active',
    current_period_end:     new Date(((stripeSub as any).current_period_end ?? 0) * 1000).toISOString(),
  }, { onConflict: 'user_id' })

  await supabaseAdmin
    .from('users')
    .update({ plan })
    .eq('id', userId)
}

async function updateSubscription(
  userId: string,
  plan: PlanType,
  status: string,
  periodEnd: number
) {
  await supabaseAdmin
    .from('subscriptions')
    .update({
      plan,
      status,
      current_period_end: new Date(periodEnd * 1000).toISOString(),
    })
    .eq('user_id', userId)

  if (status === 'active') {
    await supabaseAdmin
      .from('users')
      .update({ plan })
      .eq('id', userId)
  }
}

function getPlanFromPrice(priceId?: string): PlanType | null {
  if (!priceId) return null
  const map: Record<string, PlanType> = {
    [process.env.STRIPE_PRICE_STARTER!]: 'starter',
    [process.env.STRIPE_PRICE_PRO!]:     'pro',
    [process.env.STRIPE_PRICE_AGENCY!]:  'agency',
  }
  return map[priceId] || null
}
