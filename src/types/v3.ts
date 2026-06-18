import type { StyleId } from '@/lib/styles/types'

export type CopyTone =
  | 'auto' | 'friendly' | 'premium' | 'bold' | 'storytelling' | 'educational'

export type V3SectionKey =
  | 'hero' | 'gallery' | 'why_we_love' | 'thoughtfully_designed'
  | 'best_for' | 'materials_breakdown' | 'how_it_works'
  | 'compare_variants' | 'reviews_ai_summary' | 'reviews' | 'press_quote'
  | 'care_instructions' | 'faq' | 'brand_manifesto'

// Sprint 2 — Reviews avec photos (P3)
// photo_url: null pour le MVP (les vraies photos UGC viennent d'une phase ultérieure)
// verified: true pour la majorité, rating: 4-5 pour 80% des reviews
export interface V3Review {
  author:    string
  initials:  string
  rating:    1 | 2 | 3 | 4 | 5
  title:     string
  text:      string
  date:      string      // "il y a 3 jours" — texte généré, en français
  photo_url?: string     // URL image UGC (null pour MVP — out-of-scope vraies photos)
  variant?:  string      // "Noir mat", "Blanc perle", etc.
  verified:  boolean
}

export interface MaterialEntry {
  name: string
  benefit: string
  confidence: number  // 0-1
  imageHint?: 'detail' | 'macro'
}

// Catégories produit pour le rendu conditionnel des sections
// (ex: care_instructions uniquement sur textile/sport/beauty/fashion)
export type V3ProductCategory =
  | 'textile'
  | 'sport'
  | 'beauty'
  | 'fashion'
  | 'tech'
  | 'food'
  | 'home'
  | 'home_electronic'
  | 'toy'
  | 'other'

export interface V3PageData {
  styleId: StyleId
  tone: CopyTone
  sectionOrder?: V3SectionKey[]
  product: {
    title: string
    description: string
    price?: string
    rating?: { value: number; count: number }
    variants?: Array<{ name: string; image?: string }>
    // Sprint 1 — catégorie produit utilisée pour les display-rules conditionnelles
    category?: V3ProductCategory
  }
  images: string[]                       // ordre final, finalisé par user à l'étape Produit
  copy: {
    brand?: string  // affiché en haut du hero + dans le manifesto
    hero?: { tagline: string; subtagline: string; social_proof_fallback?: string }
    why_we_love?: string
    features?: Array<{ name: string; description: string; isPropriety?: boolean }>
    best_for?: string[]
    materials?: MaterialEntry[]
    care?: string
    faq?: Array<{ q: string; a: string }>
    manifesto?: { headline: string; pillars: string[] }
    press_quote?: { quote: string; source: string }
    reviews_summary?: string
    how_it_works?: Array<{ step: number; title: string; description: string }>
    // Sprint 2 — avis clients individuels avec photos UGC optionnelles
    reviews?: V3Review[]
  }
}
