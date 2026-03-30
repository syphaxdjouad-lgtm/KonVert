// ─── PLANS ───────────────────────────────────────────────────────────────────

export type PlanType = 'starter' | 'pro' | 'agency'

export const PLAN_LIMITS: Record<PlanType, { pages: number; stores: number; whiteLabel: boolean }> = {
  starter: { pages: 50,  stores: 2,  whiteLabel: false },
  pro:     { pages: 200, stores: 5,  whiteLabel: false },
  agency:  { pages: 500, stores: 15, whiteLabel: true  },
}

// ─── USER ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  name: string | null
  plan: PlanType
  pages_used_this_month: number
  stores_count: number
  created_at: string
}

// ─── SUBSCRIPTION ────────────────────────────────────────────────────────────

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: PlanType
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string
}

// ─── STORE ───────────────────────────────────────────────────────────────────

export type StorePlatform = 'shopify' | 'woocommerce'

export interface Store {
  id: string
  user_id: string
  platform: StorePlatform
  name: string
  store_url: string
  access_token: string | null
  created_at: string
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export type PageStatus = 'draft' | 'published' | 'archived'

export interface Page {
  id: string
  user_id: string
  store_id: string | null
  title: string
  product_url: string | null
  html_content: string | null
  json_content: LandingPageData | null
  template_id: string | null
  status: PageStatus
  views: number
  cta_clicks: number
  created_at: string
  updated_at: string
}

// ─── TEMPLATE ────────────────────────────────────────────────────────────────

export interface Template {
  id: string
  name: string
  preview_url: string
  html_template: string
  category: 'dark' | 'light' | 'bold' | 'luxury' | 'mobile'
}

// ─── IA — GENERATED CONTENT ──────────────────────────────────────────────────

export interface LandingPageData {
  headline: string
  subtitle: string
  benefits: string[]
  faq: { question: string; answer: string }[]
  cta: string
  urgency: string
  product_name: string
  price?: string
  images?: string[]
}

// ─── SCRAPER ─────────────────────────────────────────────────────────────────

export interface ScrapedProduct {
  title: string
  description: string
  images: string[]
  price: string | null
  original_price: string | null
  variants: { name: string; values: string[] }[]
  rating: number | null
  reviews_count: number | null
  source_url: string
}
