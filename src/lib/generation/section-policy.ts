// Section Policy — le "playbook" qui traduit (catégorie produit détectée + prix)
// en socle de sections à générer, pour éviter les pages hors-sujet (avant/après
// sur des écouteurs, story artisanale sur un gadget tech...).
//
// Module pur, sans I/O, 100% testable en isolation. Les valeurs viennent du
// benchmark DTC documenté dans docs/superpowers/research/2026-07-27-dtc-sections-benchmark.md
// — ne pas modifier une valeur ici sans mettre à jour la source.
//
// Consommé par generate.ts (path legacy) et api/generate/route.ts (path V3).

import type { ProductType } from '@/lib/templates'
import type { SectionKey } from '@/lib/templates/sections'
import type { V3SectionKey } from '@/types/v3'

// ─── Vocabulaire neutre de sections (indépendant des deux moteurs) ─────────
// Le mapping vers les clés legacy (SectionKey) et V3 (V3SectionKey) est
// ajouté séparément (cf policyToLegacyKeys / policyToV3Keys plus bas dans ce module).

export type PolicySectionKey =
  | 'hero' | 'social_proof' | 'why' | 'features' | 'materials'
  | 'how_it_works' | 'before_after' | 'comparison' | 'reviews'
  | 'press' | 'faq' | 'guarantee' | 'story' | 'gallery'

export interface SectionPolicy {
  recommended: PolicySectionKey[]
  discouraged: PolicySectionKey[]
  min: number
  max: number
}

// ─── Table de policies par catégorie ───────────────────────────────────────
// Source : docs/superpowers/research/2026-07-27-dtc-sections-benchmark.md
// `max` ici = plafond "produit premium" de la catégorie (cf règle prix plus bas).
//
// `ProductType` (src/lib/templates/index.ts) ≠ vocabulaire du benchmark
// (electronics/cosmetics/supplements/apparel). Mapping appliqué :
//   electronics → tech, cosmetics → beauty, supplements → wellness, apparel → fashion.
// `pet` et `luxury` n'ont pas de benchmark dédié (hors périmètre Task 1) →
// fallback `universal`, au même titre qu'un ProductType inconnu/null.

const POLICY_TABLE: Record<Exclude<ProductType, 'pet' | 'luxury'>, SectionPolicy> = {
  // benchmark: electronics — Anker Prime Power Bank, Nothing Ear (3)
  // Vend sur la spec et la certification, pas la narration : ni before/after
  // (rien à "transformer"), ni story/materials (pas de récit fondateur ni
  // "de quoi c'est fait" mis en avant), ni gallery (images = plans produit studio).
  tech: {
    recommended: ['hero', 'features', 'comparison', 'social_proof', 'reviews', 'faq', 'guarantee'],
    discouraged: ['before_after', 'story', 'materials', 'gallery', 'press'],
    min: 6,
    max: 8,
  },
  // benchmark: skincare — The Ordinary Niacinamide 10% + Zinc 1%
  // La preuve clinique quantifiée fait office de before_after fort, même sans
  // photo. Pas de comparatif spec-vs-concurrent, pas de story/gallery éditoriale.
  skincare: {
    recommended: ['hero', 'materials', 'how_it_works', 'before_after', 'reviews', 'faq', 'press', 'guarantee'],
    discouraged: ['comparison', 'story', 'gallery'],
    min: 7,
    max: 9,
  },
  // benchmark: cosmetics — Rare Beauty Soft Pinch Blush, Glossier Cloud Paint
  // Le maquillage se juge à l'instant, pas sur une temporalité → pas de
  // before_after. Pas de tableau comparatif, storytelling de marque hors page produit.
  beauty: {
    recommended: ['hero', 'gallery', 'materials', 'how_it_works', 'social_proof', 'reviews', 'press', 'faq'],
    discouraged: ['before_after', 'comparison', 'story'],
    min: 6,
    max: 8,
  },
  // benchmark: supplements — AG1 Next Gen Pouch
  // La confiance passe par la donnée clinique et les certifs, pas la narration
  // → ni story, ni gallery lifestyle, ni bandeau presse.
  wellness: {
    recommended: ['hero', 'social_proof', 'comparison', 'materials', 'before_after', 'how_it_works', 'faq', 'guarantee'],
    discouraged: ['story', 'gallery', 'press'],
    min: 6,
    max: 9,
  },
  // benchmark: jewelry — Mejuri Thin Dôme Ring, Mejuri Lotus Necklace
  // Le bijou se vend sur l'émotion/l'artisanat : pas de comparatif spec-vs-concurrent,
  // pas de before_after (objet fini), pas de "feature bullet" (remplacé par materials+story).
  jewelry: {
    recommended: ['hero', 'materials', 'story', 'gallery', 'social_proof', 'guarantee', 'reviews', 'faq'],
    discouraged: ['comparison', 'before_after', 'features'],
    min: 6,
    max: 8,
  },
  // benchmark: apparel — Gymshark Flex Leggings, Allbirds
  // Pas de photo de transformation ni de tableau comparatif ; le narratif de
  // marque reste dans le copy matériaux, pas un bloc story séparé.
  fashion: {
    recommended: ['hero', 'social_proof', 'materials', 'gallery', 'reviews', 'faq', 'guarantee'],
    discouraged: ['before_after', 'comparison', 'story'],
    min: 5,
    max: 8,
  },
  // benchmark: home — Our Place Always Pan
  // Confiance construite via démonstration fonctionnelle + avis + garantie —
  // aucune photo de transformation, tableau vs-concurrent, récit fondateur ou presse.
  home: {
    recommended: ['hero', 'why', 'features', 'materials', 'how_it_works', 'guarantee', 'social_proof', 'reviews', 'faq'],
    discouraged: ['before_after', 'comparison', 'story', 'press'],
    min: 6,
    max: 9,
  },
  // benchmark: universal (fallback prudent) — hero/reviews/faq apparaissent sur
  // les 7 catégories analysées sans exception. Socle générique, pas d'exclusion
  // a priori (discouraged vide). `why` retenu pour le duo "features/why" du
  // benchmark (cf décision explicite : une seule clé, pas de clé composite).
  universal: {
    recommended: ['hero', 'why', 'social_proof', 'reviews', 'faq', 'guarantee'],
    discouraged: [],
    min: 6,
    max: 9,
  },
}

function resolveBasePolicy(productType: ProductType | null): SectionPolicy {
  if (productType === null) return POLICY_TABLE.universal
  // pet / luxury : pas de benchmark dédié → fallback universal (prudent).
  if (productType === 'pet' || productType === 'luxury') return POLICY_TABLE.universal
  return POLICY_TABLE[productType] ?? POLICY_TABLE.universal
}

/**
 * Résout la policy de sections pour un produit donné.
 *
 * Règle prix (au sein d'une catégorie) : le `max` de base représente le
 * plafond "produit premium" (>= 150€). En dessous de 40€, on réduit le max
 * de 2 (sans jamais descendre sous le plancher `min`) — un produit simple/pas
 * cher n'a pas besoin de la fourchette haute. Entre 40 et 150€ (ou prix
 * inconnu), on garde le max de base.
 */
export function getSectionPolicy(input: {
  productType: ProductType | null
  price?: number
}): SectionPolicy {
  const base = resolveBasePolicy(input.productType)

  let max = base.max
  if (typeof input.price === 'number' && input.price < 40) {
    max = Math.max(base.min, base.max - 2)
  }

  return {
    recommended: [...base.recommended],
    discouraged: [...base.discouraged],
    min: base.min,
    max,
  }
}

// ─── Mapping vers les clés des deux moteurs de rendu ───────────────────────
// Chaque clé neutre traduit vers 0..n clés du moteur cible. `hero`/`faq` n'ont
// pas d'équivalent legacy car ce sont des blocs toujours rendus par chaque
// template (pas des "rich sections" togglables via renderRichSections).

const POLICY_TO_LEGACY: Record<PolicySectionKey, SectionKey[]> = {
  hero:          [], // le hero fait partie du template lui-même, pas une rich section
  social_proof:  ['social_proof_bar'],
  why:           ['unique_mechanism'],
  features:      ['features'],
  materials:     [], // pas de section ingrédients/matières dédiée côté legacy
  how_it_works:  ['how_it_works'],
  before_after:  ['before_after'],
  comparison:    ['comparison', 'competitor_comparison'],
  reviews:       ['testimonials'],
  press:         ['press_mentions'],
  faq:           [], // FAQ toujours rendue par le template via data.faq, pas togglable
  guarantee:     ['guarantee', 'risk_reversal'], // risk_reversal = réassurance de type garantie
  story:         ['story', 'founder_note'], // founder_note = même registre narratif
  gallery:       ['gallery'],
}

const POLICY_TO_V3: Record<PolicySectionKey, V3SectionKey[]> = {
  hero:          ['hero'],
  social_proof:  [], // pas de section dédiée V3 — la note/rating vit dans le hero
  why:           ['why_we_love'],
  features:      ['thoughtfully_designed'],
  materials:     ['materials_breakdown'],
  how_it_works:  ['how_it_works'],
  before_after:  [], // V3 n'a pas de section before/after
  comparison:    ['compare_variants'],
  reviews:       ['reviews', 'reviews_ai_summary'],
  press:         ['press_quote'],
  faq:           ['faq'],
  guarantee:     [], // pas de section dédiée V3 — vit dans TrustBadgesPayment (composant partagé, pas un SectionKey)
  story:         ['brand_manifesto'],
  gallery:       ['gallery'],
}

/** Traduit des clés neutres vers les clés `SectionKey` du moteur legacy (dédupliquées). */
export function policyToLegacyKeys(keys: PolicySectionKey[]): SectionKey[] {
  const out = new Set<SectionKey>()
  for (const key of keys) {
    for (const mapped of POLICY_TO_LEGACY[key]) out.add(mapped)
  }
  return [...out]
}

/** Traduit des clés neutres vers les clés `V3SectionKey` du moteur V3 (dédupliquées). */
export function policyToV3Keys(keys: PolicySectionKey[]): V3SectionKey[] {
  const out = new Set<V3SectionKey>()
  for (const key of keys) {
    for (const mapped of POLICY_TO_V3[key]) out.add(mapped)
  }
  return [...out]
}
