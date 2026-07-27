// Store Builder for Shopify — mise à jour d'un champ produit (title ou
// body_html) — utilisé pour "Promouvoir la variante gagnante" d'un test A/B
// (cf. spec KAKASHI §A.5). Écrit `product.title`/`product.body_html`, la
// seule source de vérité rendue par le thème (cf. constat §0 de la spec).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — aucun appel n'a encore
// touché un vrai store Shopify (Sprint 8, 2026-07-27).

import type { StoreBuilderContext, StoreBuilderResult } from './types'
import { shopifyAdminRequestWithRetry } from './client'

export type UpdatableProductField = 'title' | 'body_html'

interface ShopifyProductUpdateApiResponse {
  product: { id: number }
}

export async function updateProductField(
  ctx: StoreBuilderContext,
  productId: number,
  field: UpdatableProductField,
  value: string
): Promise<StoreBuilderResult<{ id: number }>> {
  if (!Number.isInteger(productId) || productId <= 0) {
    return { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'productId invalide.' } }
  }
  if (!value.trim()) {
    return { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'Valeur vide — rien à écrire.' } }
  }

  const payload = { product: { id: productId, [field]: value } }

  const result = await shopifyAdminRequestWithRetry<ShopifyProductUpdateApiResponse>(
    ctx,
    `/products/${productId}.json`,
    { method: 'PUT', body: JSON.stringify(payload) }
  )

  if (!result.ok) return result
  return { ok: true, data: { id: result.data.product.id } }
}
