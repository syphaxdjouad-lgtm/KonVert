import Stripe from 'stripe'
import type { PlanType } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

type PaidPlan = Exclude<PlanType, 'free'>
export type BillingInterval = 'monthly' | 'annual'

// Price IDs Stripe par plan ET intervalle de facturation.
// Avant ce fix, l'UI proposait un toggle Mensuel/Annuel mais n'envoyait que les
// price IDs mensuels — les users qui choisissaient "Annuel" étaient sous-facturés
// au prix mensuel (perte de revenu directe).
//
// Les env vars STRIPE_PRICE_*_ANNUAL doivent être créées dans Stripe Dashboard
// puis ajoutées à Vercel. Tant qu'elles sont absentes, getStripePrice() lève
// pour empêcher silencieusement un fallback monthly (qui reproduirait le bug).
export const STRIPE_PRICES: Record<PaidPlan, Record<BillingInterval, string | undefined>> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER,
    annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  agency: {
    monthly: process.env.STRIPE_PRICE_AGENCY,
    annual:  process.env.STRIPE_PRICE_AGENCY_ANNUAL,
  },
}

export function getStripePrice(plan: PaidPlan, interval: BillingInterval): string {
  const priceId = STRIPE_PRICES[plan]?.[interval]
  if (!priceId) {
    throw new Error(`Stripe price ID manquant pour ${plan} / ${interval} (env var STRIPE_PRICE_${plan.toUpperCase()}${interval === 'annual' ? '_ANNUAL' : ''})`)
  }
  return priceId
}

// Reverse mapping price → { plan, interval }, utilisé par le webhook pour
// reconstituer le plan d'un abonnement (sub.items.data[0].price.id).
export function getPlanFromStripePrice(priceId: string | undefined): { plan: PaidPlan; interval: BillingInterval } | null {
  if (!priceId) return null
  for (const plan of ['starter', 'pro', 'agency'] as PaidPlan[]) {
    for (const interval of ['monthly', 'annual'] as BillingInterval[]) {
      if (STRIPE_PRICES[plan][interval] === priceId) return { plan, interval }
    }
  }
  return null
}

export const PLAN_NAMES: Record<PaidPlan, string> = {
  starter: 'Starter — 39€/mois',
  pro:     'Pro — 79€/mois',
  agency:  'Agency — 199€/mois',
}
