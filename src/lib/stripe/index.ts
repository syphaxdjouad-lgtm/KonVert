import Stripe from 'stripe'
import type { PlanType } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

type PaidPlan = Exclude<PlanType, 'free'>

export const STRIPE_PRICES: Record<PaidPlan, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro:     process.env.STRIPE_PRICE_PRO!,
  agency:  process.env.STRIPE_PRICE_AGENCY!,
}

export const PLAN_NAMES: Record<PaidPlan, string> = {
  starter: 'Starter — 39€/mois',
  pro:     'Pro — 79€/mois',
  agency:  'Agency — 199€/mois',
}
