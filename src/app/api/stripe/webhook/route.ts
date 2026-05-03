import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { PostHog } from 'posthog-node'
import type Stripe from 'stripe'
import type { PlanType } from '@/types'

function getPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null
  return new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
  })
}

// Stripe a déplacé `invoice.subscription` dans `invoice.parent.subscription_details.subscription`
// au fil des versions de l'API. On lit les deux pour rester compatible sans `any`.
function extractSubscriptionId(invoice: Stripe.Invoice): string | null {
  const fromParent = invoice.parent?.subscription_details?.subscription
  if (typeof fromParent === 'string') return fromParent
  if (fromParent && typeof fromParent === 'object' && 'id' in fromParent) return fromParent.id

  const legacy = (invoice as unknown as { subscription?: string | { id: string } }).subscription
  if (typeof legacy === 'string') return legacy
  if (legacy && typeof legacy === 'object' && 'id' in legacy) return legacy.id

  return null
}

function extractPeriodEnd(sub: Stripe.Subscription): number {
  return (sub as unknown as { current_period_end?: number }).current_period_end ?? 0
}

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

  const ph = getPostHog()

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const userId = session.metadata?.supabase_user_id
        const plan   = session.metadata?.plan as PlanType
        if (!userId || !plan) break

        await activateSubscription(userId, plan, session.customer as string, session.subscription as string)

        ph?.capture({
          distinctId: userId,
          event: 'subscription_started',
          properties: {
            plan,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency,
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        const priceId = sub.items.data?.[0]?.price?.id
        const plan = getPlanFromPrice(priceId)
        if (!plan) {
          Sentry.captureMessage('[stripe/webhook] Unknown priceId', {
            level: 'warning',
            extra: { priceId, subscriptionId: sub.id, userId },
          })
          break
        }
        await updateSubscription(userId, plan, sub.status, extractPeriodEnd(sub))

        ph?.capture({
          distinctId: userId,
          event: 'subscription_updated',
          properties: { plan, status: sub.status },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        // Downgrade vers 'free' (1 page/mois) — pas 'starter' qui est PAYANT.
        // Reset quota pour éviter de garder un quota Pro/Agency consommé.
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'free' })
          .eq('user_id', userId)

        await supabaseAdmin
          .from('users')
          .update({ plan: 'free', pages_used_this_month: 0 })
          .eq('id', userId)

        ph?.capture({
          distinctId: userId,
          event: 'subscription_cancelled',
          properties: { previous_plan: sub.metadata?.plan },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = extractSubscriptionId(invoice)
        if (!subId) break

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subId)

        // distinctId = UUID Supabase (cohérent avec les autres events) plutôt
        // que le stripe_customer_id, sinon PostHog crée un profil orphelin.
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subId)
          .single()

        if (sub?.user_id) {
          ph?.capture({
            distinctId: sub.user_id,
            event: 'payment_failed',
            properties: { amount: (invoice.amount_due ?? 0) / 100 },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = extractSubscriptionId(invoice)
        if (!subId) break

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

          ph?.capture({
            distinctId: sub.user_id,
            event: 'subscription_renewed',
            properties: { amount: (invoice.amount_paid ?? 0) / 100 },
          })
        }
        break
      }
    }

    if (ph) await ph.shutdown()
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] Erreur traitement:', err)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/stripe/webhook' } })
    // On retourne 200 pour empêcher Stripe de rejouer indéfiniment ;
    // l'erreur est tracée Sentry → on l'investiguera après coup.
    return NextResponse.json({ received: true, error: 'logged' })
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
    current_period_end:     new Date(extractPeriodEnd(stripeSub) * 1000).toISOString(),
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
