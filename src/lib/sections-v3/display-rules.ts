import type { V3PageData, V3SectionKey, V3ProductCategory } from '@/types/v3'

const CONFIDENCE_THRESHOLD = 0.6

// Sprint 1 — Catégories pour lesquelles "Entretien" est pertinent.
// Pour tech, food, home electronic etc., les instructions de soin n'ont
// pas de sens (un casque audio n'a pas d'instructions lavage machine).
const CARE_CATEGORIES: ReadonlySet<V3ProductCategory> = new Set([
  'textile',
  'sport',
  'beauty',
  'fashion',
])

export function shouldRenderSection(key: V3SectionKey, data: V3PageData): boolean {
  switch (key) {
    case 'hero':
    case 'why_we_love':
    case 'thoughtfully_designed':
    case 'best_for':
    case 'faq':
    case 'brand_manifesto':
      return true

    // Sprint 1 — conditionnel : uniquement si catégorie textile/sport/beauty/fashion.
    // Si category est absent (non fourni par le scraper), on l'affiche par défaut
    // pour éviter de supprimer la section sur les anciens produits sans catégorie.
    case 'care_instructions': {
      const cat = data.product.category
      if (!cat) return true  // fallback conservateur : afficher si catégorie inconnue
      return CARE_CATEGORIES.has(cat)
    }
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
    // Sprint 4 T6 — reviews individuelles : seuil relevé de 3 à 5 (KISAME QW-3).
    // 3-4 reviews → grid creuse sur mobile (1 rangée ou 1.5), visuellement peu crédible.
    // 5 reviews → 2 rangées complètes sur mobile 1-col = densité et crédibilité sociale.
    // Le prompt demande maintenant EXACTEMENT 5 reviews, le seuil est cohérent.
    case 'reviews':
      return Array.isArray(data.copy.reviews) && data.copy.reviews.length >= 5
    case 'press_quote':
      return Boolean(data.copy.press_quote)
    default:
      return false
  }
}
