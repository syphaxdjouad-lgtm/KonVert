// Store Builder for Shopify — extraction de l'attribution A/B depuis
// `order.note_attributes` (propagés automatiquement par Shopify depuis
// `cart.attributes`, cf. spec KAKASHI §A.2.5 et §A.3). Pur, aucun accès
// réseau/DB — consommé par le webhook `orders/paid`.

import type { AbVariant } from '@/lib/store-builder/ab-testing/types'
import { AB_CART_ATTR_TEST_ID, AB_CART_ATTR_VARIANT, AB_CART_ATTR_VISITOR_ID } from '@/lib/store-builder/ab-testing/types'

export interface ShopifyOrderNoteAttribute {
  name: string
  value: string
}

export interface AbAttribution {
  abTestId: string
  variant: AbVariant
  visitorId: string
}

/**
 * Renvoie `null` si la commande ne porte aucune attribution A/B exploitable
 * (commande hors test, ou attributs corrompus/partiels) — le webhook doit
 * alors traiter la commande comme "non liée à un test" sans erreur.
 */
export function extractAbAttribution(
  noteAttributes: ShopifyOrderNoteAttribute[] | null | undefined
): AbAttribution | null {
  if (!noteAttributes?.length) return null

  const map = new Map(noteAttributes.map((a) => [a.name, a.value]))
  const abTestId = map.get(AB_CART_ATTR_TEST_ID)
  const variant = map.get(AB_CART_ATTR_VARIANT)
  const visitorId = map.get(AB_CART_ATTR_VISITOR_ID)

  if (!abTestId || !visitorId) return null
  if (variant !== 'a' && variant !== 'b') return null

  return { abTestId, variant, visitorId }
}
