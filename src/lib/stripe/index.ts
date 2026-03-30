import Stripe from 'stripe'
import type { PlanType } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export const STRIPE_PRICES: Record<PlanType, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro:     process.env.STRIPE_PRICE_PRO!,
  agency:  process.env.STRIPE_PRICE_AGENCY!,
}

export const PLAN_NAMES: Record<PlanType, string> = {
  starter: 'Starter — 29€/mois',
  pro:     'Pro — 49€/mois',
  agency:  'Agency — 119€/mois',
}
