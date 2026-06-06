// ─── PLANS ───────────────────────────────────────────────────────────────────

// 'free' = compte sans abonnement (tunnel "1 page gratuite", abonnement annulé,
// trial expiré). Quota 1 page/mois pour rester cohérent avec le tunnel public.
export type PlanType = 'free' | 'starter' | 'pro' | 'agency'

export const PLAN_LIMITS: Record<PlanType, { pages: number; stores: number; whiteLabel: boolean }> = {
  free:    { pages: 1,    stores: 0,  whiteLabel: false },
  starter: { pages: 75,   stores: 2,  whiteLabel: false },
  pro:     { pages: 300,  stores: 7,  whiteLabel: false },
  agency:  { pages: 9999, stores: 99, whiteLabel: true  },
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
  published_url: string | null
  published_id: number | null
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
  original_price?: string
  images?: string[]
  // ISO code (fr, en, es…) utilisé pour <html lang="..."> dans les templates.
  // Sans ça, une page EN/ES/AR garde lang="fr" → mauvais signal SEO + a11y.
  language?: string

  // Catégorie produit générique en langue cible (ex: "Lingerie", "Soin visage").
  // Produite par le mini-call de cleaning du titre — sert au label friendly
  // dans le warning template incompatible côté UI.
  category?: string

  // Type de template recommandé (enum strict ProductType). Produit par le
  // mini-call (meilleur classifier que keyword matching). Le wizard l'utilise
  // en priorité ; fallback détecteur keywords si null.
  product_type?: string

  // ─── Sections enrichies (DTC 2026) — toutes optionnelles côté types pour
  // ne pas casser les templates existants. Le LLM est instruit de TOUTES les
  // remplir à chaque génération.

  // Hero — petits badges sous le headline (Made in, Cruelty-free, Free shipping…)
  hero_badges?: string[]

  // PAS — Problème → Agitation → Solution → Transformation
  story?: {
    problem: string
    agitation: string
    solution: string
    transformation: string
  }

  // "Pour qui c'est ?" — 3 profils ICP cibles
  target_audience?: {
    profile: string
    pain: string
  }[]

  // Mécanisme unique : ce qui rend ce produit différent des autres + preuve
  unique_mechanism?: {
    name: string
    description: string
    proof: string
  }

  // 6 features détaillées avec icône emoji
  features?: {
    icon: string
    title: string
    description: string
  }[]

  // Comment ça marche — 4 étapes simples
  how_it_works?: {
    step: number
    title: string
    description: string
  }[]

  // Avant / Après — transformations concrètes (texte uniquement)
  before_after?: {
    before: string
    after: string
  }[]

  // Comparatif "Sans / Avec" le produit (4 vs 4)
  comparison?: {
    without_title: string
    without: string[]
    with_title: string
    with: string[]
  }

  // Comparatif vs 2 concurrents principaux sur 5 critères
  competitor_comparison?: {
    criteria: string[]
    us: { name: string; values: string[] }
    them: { name: string; values: string[] }[]
  }

  // Stats de social proof
  social_proof?: {
    customers: string
    rating: string
    sold: string
  }

  // Mentions médias / certifications / partenaires
  press_mentions?: string[]

  // 3 témoignages clients
  testimonials?: {
    name: string
    rating: number
    text: string
    variant?: string
    location?: string
  }[]

  // Mot du fondateur — humanise la marque
  founder_note?: {
    name: string
    role: string
    message: string
  }

  // Garantie principale
  guarantee?: {
    title: string
    description: string
    duration: string
  }

  // Triple réassurance (livraison, retour, support)
  risk_reversal?: {
    icon: string
    title: string
    description: string
  }[]

  // Bonus inclus
  bonuses?: {
    title: string
    description: string
    value: string
  }[]

  // Récap valeur perçue : produit + bonus = X, vous payez Y
  value_stack?: {
    items: { label: string; value: string }[]
    total: string
    you_pay: string
    savings: string
  }

  // 5 objections détaillées (différent de FAQ — plus émotionnel)
  objections?: {
    objection: string
    response: string
  }[]

  // Invitation communauté / Instagram / TikTok
  community_callout?: {
    title: string
    description: string
    cta: string
  }

  // Copy de fermeture — paragraphe final avant le dernier CTA
  final_pitch?: string

  // ─── Champs CRO enrichis v2 (2026-06-05) ────────────────────────────────
  // Ces 5 champs débloqueront : UGC photo reviews, trust badges paiement,
  // logos presse vectoriels, signal de stock/urgence, section bundle.
  // ANNA consomme exactement ces noms/types — contrat d'interface figé.

  /**
   * Photos UGC simulées : descriptions textuelles que le frontend transforme
   * en placeholders réalistes ou prompts d'image.
   * 3 à 6 entrées. Toujours présent si testimonials est présent.
   */
  photo_descriptions?: Array<{
    context: string              // "Femme 35 ans applique la crème devant son miroir, lumière naturelle"
    customer_first_name: string
    sentiment: 'before' | 'during' | 'after' | 'lifestyle'
  }>

  /**
   * Méthodes de paiement à afficher dans les trust badges.
   * Défaut si le LLM ne sait pas : ["visa","mastercard","paypal","apple_pay"]
   */
  payment_methods?: Array<
    'visa' | 'mastercard' | 'amex' | 'paypal' | 'apple_pay' | 'google_pay' | 'klarna' | 'alma'
  >

  /**
   * Logos presse à mentionner. Le rendu cherchera des logos correspondants
   * côté front. Vide [] si aucune presse cohérente avec la niche.
   */
  press_logos?: Array<{
    publication: string         // "Vogue", "Marie Claire", "Refinery29"
    quote_short?: string        // max 80 chars — optionnel
  }>

  /**
   * Signal stock/urgence pour pousser la scarcity sans mentir.
   * null si non pertinent pour ce produit.
   */
  stock_signal?: {
    type: 'limited_stock' | 'high_demand' | 'back_in_stock' | 'limited_time' | null
    message: string             // "Plus que 12 en stock"
    cta_intensifier: string     // "Commandez maintenant"
  } | null

  /**
   * Bundle / cross-sell suggéré.
   * null si bundle non pertinent (produit standalone, sans complémentaires évidents).
   */
  bundle_offer?: {
    title: string               // "Routine complète" / "Trio découverte"
    description: string         // 1-2 phrases
    products_to_pair: string[]  // ["Sérum hydratant", "Crème de nuit"]
    discount_label: string      // "-15% sur le bundle" / "Le 3e offert"
  } | null
}

// ─── A/B TESTING ─────────────────────────────────────────────────────────────

export type ABTestStatus = 'running' | 'paused' | 'completed'
export type ABVariantLetter = 'A' | 'B'
export type ABEventType = 'view' | 'click' | 'conversion'

export interface ABTest {
  id: string
  page_id: string
  status: ABTestStatus
  winner: ABVariantLetter | null
  created_at: string
}

export interface ABVariantRow {
  id: string
  ab_test_id: string
  variant: ABVariantLetter
  page_content: object | null
  vues: number
  clics: number
  conversions: number
  created_at: string
}

export interface ABEvent {
  id: string
  variant_id: string
  visitor_id: string
  event_type: ABEventType
  created_at: string
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
  // Dégradation gracieuse : true si l'extraction est incomplète mais qu'on
  // a réussi à sortir au moins une donnée exploitable (titre OU images).
  // Le front affiche alors un warning non-bloquant invitant à vérifier.
  partial?: boolean
  scrape_warning?: string
}
