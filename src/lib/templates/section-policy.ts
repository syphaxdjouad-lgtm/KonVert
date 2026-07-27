// Doctrine des sections — moteur product-aware KONVERT.
//
// Source de vérité fonctionnelle : docs/marketing/redesign/section-policy.md
// (rédigée par OBITO). Ce fichier traduit cette doctrine en code : quelles
// SectionKey (cf. templates/sections.ts) sont autorisées pour quel type de
// produit détecté, et sous quelle condition de données réelles.
//
// Objectif : ne plus forcer les ~20 sections du moteur sur CHAQUE produit
// (une bague qui reçoit un "avant/après", un oreiller qui reçoit un
// comparatif "Avec/Sans" rouge/vert). Le filtrage se fait ICI, une seule
// fois, avant le rendu — pas en dupliquant la logique dans 42 templates.

import type { LandingPageData } from '@/types'
import type { SectionKey } from './sections'
import type { ProductType } from './index'
import { detectProductType } from './detect-product-type'

const KNOWN_PRODUCT_TYPES: ReadonlySet<string> = new Set<ProductType>([
  'skincare', 'beauty', 'wellness', 'tech', 'jewelry',
  'home', 'fashion', 'pet', 'luxury', 'universal',
])

/**
 * Résout le ProductType effectif d'une landing page déjà générée : priorité
 * au classifier LLM (data.product_type, posé par le mini-call DeepSeek dans
 * generate.ts), fallback sur le keyword-matching si absent/`universal`.
 * Même pattern que dashboard/new/page.tsx (mismatch template ↔ produit).
 */
export function resolveProductType(data: LandingPageData): ProductType | null {
  if (data.product_type && data.product_type !== 'universal' && KNOWN_PRODUCT_TYPES.has(data.product_type)) {
    return data.product_type as ProductType
  }
  return detectProductType({
    title: data.product_name,
    description: `${data.headline || ''} ${data.subtitle || ''} ${(data.benefits || []).join(' ')}`,
  })
}

// ─── 1. Sections bannies partout, sans exception ────────────────────────────
//
// cf. section-policy.md § 1. Ces clés ne sont JAMAIS rendues, quel que soit
// le produit ou les données disponibles. `comparison` = le comparatif
// "Avec/Sans [marque]" rouge/vert, le cliché absolu dropshipping.
// `competitor_comparison` = le 2e comparatif redondant "Pourquoi nous ?".
export const BANNED_SECTIONS: ReadonlySet<SectionKey> = new Set<SectionKey>([
  'comparison',
  'competitor_comparison',
])

// ─── 2. Sections conditionnelles par type de produit ────────────────────────
//
// cf. section-policy.md § 3 + tableau récapitulatif § 4. Seule `before_after`
// est actuellement implémentée comme SectionKey rendable (les autres cases du
// tableau — certifications, guide tailles, ingrédients, démo vidéo, lifestyle,
// écosystème — n'ont pas de renderer dédié dans sections.ts aujourd'hui : hors
// scope de ce quick win, cf. limites signalées).
//
// `universal` (type non détecté) reste volontairement absent de cette liste :
// aucune section conditionnelle ne s'active par défaut si on ne sait pas
// classer le produit (principe de précaution, section-policy.md § 5.3).
const BEFORE_AFTER_ALLOWED_TYPES: ReadonlySet<ProductType> = new Set<ProductType>([
  'skincare',
  'beauty',
  'wellness',
])

/**
 * Sections toujours interdites pour `productType`, au-delà de BANNED_SECTIONS.
 * Aujourd'hui : before_after hors skincare/beauty/wellness.
 */
function isConditionalSectionAllowed(key: SectionKey, productType: ProductType | null): boolean {
  if (key !== 'before_after') return true
  if (!productType) return false // universel/non détecté → precaution, on masque
  return BEFORE_AFTER_ALLOWED_TYPES.has(productType)
}

// ─── 3. Garde-fou anti-invention : sections qui exigent une vraie donnée ────
//
// cf. section-policy.md § 5.3-5.4 : "si aucune donnée réelle n'est disponible
// pour une section potentiellement pertinente, le moteur doit la masquer
// plutôt que la remplir avec du contenu générique/inventé". Le prompt DeepSeek
// ne doit plus halluciner ces champs (cf. generate.ts), mais on masque quand
// même côté rendu en défense en profondeur — si jamais un champ arrive rempli
// malgré tout par une régression de prompt, on ne l'affiche pas sans preuve.
function hasRealDataFor(key: SectionKey, data: LandingPageData): boolean {
  switch (key) {
    // press_mentions n'est affiché que si le gate anti-hallucination de
    // generate.ts a laissé passer une entrée (whitelist brand-based + seuil
    // reviews_count >= 5000). Rien à revérifier ici : la présence du champ
    // suffit, sanitizeLandingPageData/generate.ts ont déjà fait le tri.
    case 'press_mentions':
      return Boolean(data.press_mentions && data.press_mentions.length > 0)

    // social_proof : n'affiche le bandeau QUE si au moins un chiffre vient de
    // données scrapées réelles (rating/reviews du produit). On ne peut pas le
    // vérifier ici sans le produit source, donc la garantie principale est en
    // amont (generate.ts ne doit plus générer social_proof inventé — cf.
    // rules 12/25). Ce garde-fou reste défensif : section masquée si vide.
    case 'social_proof_bar':
      return Boolean(data.social_proof && (data.social_proof.customers || data.social_proof.rating || data.social_proof.sold))

    case 'testimonials':
      return Boolean(data.testimonials && data.testimonials.length > 0)

    case 'before_after':
      return Boolean(data.before_after && data.before_after.length > 0)

    default:
      return true
  }
}

// ─── 4. API publique ─────────────────────────────────────────────────────────

/**
 * Construit l'ordre de sections à rendre pour un produit donné : part de
 * DEFAULT_ORDER (templates/sections.ts), retire les sections bannies, filtre
 * les sections conditionnelles selon le type détecté, et masque toute section
 * dont la donnée réelle manque (anti-invention).
 *
 * Ne modifie PAS DEFAULT_ORDER — la fonction est pure, appelée à la volée par
 * renderTemplate/renderPage juste avant le rendu.
 */
export function buildProductAwareSectionOrder(
  defaultOrder: readonly SectionKey[],
  productType: ProductType | null,
  data: LandingPageData,
): SectionKey[] {
  return defaultOrder.filter(key => {
    if (BANNED_SECTIONS.has(key)) return false
    if (!isConditionalSectionAllowed(key, productType)) return false
    if (!hasRealDataFor(key, data)) return false
    return true
  })
}
