import type { ProductType } from '@/lib/templates'
import type { Vertical } from './schema'

// ─── Dérivation du vertical Store Builder — entrée, jamais générée (§3.2) ──
//
// Le `vertical` n'est jamais produit par le LLM générateur (mélangerait une
// tâche de classification déterministe et peu coûteuse avec une tâche de
// génération créative coûteuse — cf. spec §3.2). Il est déterminé AVANT
// l'appel, soit fourni explicitement par le marchand (wizard, priorité), soit
// dérivé ici depuis `category`/`product_type` déjà calculés par
// `cleanProductName()` (`src/lib/generation/product-name.ts`).

const PRODUCT_TYPE_TO_VERTICAL: Partial<Record<ProductType, Vertical>> = {
  skincare: 'beaute',
  beauty: 'beaute',
  tech: 'tech',
}

// Fallback texte si `product_type` est absent/non concluant (ex. 'universal',
// 'wellness'…) — on retombe sur le mot-clé `category` en français.
const CATEGORY_BEAUTE_PATTERN = /soin|beaut[eé]|cosm[ée]tique|maquillage|parfum/i
const CATEGORY_TECH_PATTERN = /audio|connect[eé]e?|[ée]lectroniq|gadget|smartphone/i

/**
 * Détermine le vertical Store Builder (dropshipping/beaute/tech) à partir du
 * `product_type` (enum fermé) et/ou de `category` (texte libre en français)
 * renvoyés par `cleanProductName()`. `dropshipping` est le défaut — c'est le
 * vertical généraliste "wow"/gadget, cohérent avec le gros du volume Konvert.
 */
export function deriveVertical(
  category: string | null | undefined,
  productType: ProductType | null | undefined,
): Vertical {
  if (productType) {
    const mapped = PRODUCT_TYPE_TO_VERTICAL[productType]
    if (mapped) return mapped
  }

  const cat = category ?? ''
  if (CATEGORY_BEAUTE_PATTERN.test(cat)) return 'beaute'
  if (CATEGORY_TECH_PATTERN.test(cat)) return 'tech'

  return 'dropshipping'
}
