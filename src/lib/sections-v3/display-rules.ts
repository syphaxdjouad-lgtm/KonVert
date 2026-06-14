import type { V3PageData, V3SectionKey } from '@/types/v3'

const CONFIDENCE_THRESHOLD = 0.6

export function shouldRenderSection(key: V3SectionKey, data: V3PageData): boolean {
  switch (key) {
    case 'hero':
    case 'why_we_love':
    case 'thoughtfully_designed':
    case 'best_for':
    case 'care_instructions':
    case 'faq':
    case 'brand_manifesto':
      return true
    // P0-3 : threshold abaissé de 3 à 1 — AliExpress retourne souvent 1-2 images.
    // Avec l'ancien seuil, la gallery était skippée sur ~65% des produits réels,
    // laissant un vide blanc de 160px entre hero et why_we_love (deux sections
    // au padding-top identique, sans transition visuelle).
    // renderGallery gère déjà le cas images=[] en retournant une section vide.
    case 'gallery':
      return data.images.length >= 1
    case 'materials_breakdown': {
      const m = data.copy.materials ?? []
      const highConf = m.filter(x => x.confidence >= CONFIDENCE_THRESHOLD)
      return highConf.length >= 2
    }
    case 'how_it_works':
      return Array.isArray(data.copy.how_it_works) && data.copy.how_it_works.length >= 2
    case 'compare_variants':
      return (data.product.variants?.length ?? 0) >= 2
    case 'reviews_ai_summary':
      return Boolean(data.copy.reviews_summary)
    case 'press_quote':
      return Boolean(data.copy.press_quote)
    default:
      return false
  }
}
