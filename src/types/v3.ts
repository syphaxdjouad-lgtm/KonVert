import type { StyleId } from '@/lib/styles/types'

export type CopyTone =
  | 'auto' | 'friendly' | 'premium' | 'bold' | 'storytelling' | 'educational'

export type V3SectionKey =
  | 'hero' | 'gallery' | 'why_we_love' | 'thoughtfully_designed'
  | 'best_for' | 'materials_breakdown' | 'how_it_works'
  | 'compare_variants' | 'reviews_ai_summary' | 'press_quote'
  | 'care_instructions' | 'faq' | 'brand_manifesto'

export interface MaterialEntry {
  name: string
  benefit: string
  confidence: number  // 0-1
  imageHint?: 'detail' | 'macro'
}

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
  }
}
