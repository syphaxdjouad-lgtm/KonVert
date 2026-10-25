// Store Builder for Shopify — création produit + images via Admin API.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — aucun appel n'a encore
// touché un vrai store Shopify (Sprint 4, 2026-07-27).

import type { CreatedProduct, NormalizedProduct, StoreBuilderContext, StoreBuilderResult } from './types'
import { shopifyAdminRequestWithRetry } from './client'

interface ShopifyProductApiResponse {
  product: {
    id: number
    handle: string
    variants: { id: number }[]
    images: { id: number }[]
  }
}

/**
 * Construit le payload Admin API `product` à partir d'un produit normalisé.
 * Exporté séparément de `createProduct` pour être testable sans réseau
 * (parsing/normalisation pur, cf. __tests__/create-product.test.ts).
 */
export function buildShopifyProductPayload(product: NormalizedProduct): Record<string, unknown> {
  const optionNames = product.optionNames?.length ? product.optionNames : ['Title']

  const variants = product.variants.length > 0
    ? product.variants.map((v) => ({
        price: v.price,
        compare_at_price: v.compareAtPrice,
        sku: v.sku,
        inventory_quantity: v.inventoryQuantity,
        inventory_management: v.inventoryQuantity !== undefined ? 'shopify' : null,
        option1: v.optionValues[0] ?? v.title,
        option2: v.optionValues[1],
        option3: v.optionValues[2],
      }))
    : [{ price: '0.00', option1: 'Default Title' }]

  return {
    title: product.title,
    body_html: product.descriptionHtml,
    vendor: product.vendor,
    product_type: product.productType,
    tags: product.tags?.join(', '),
    status: product.status ?? 'draft',
    options: optionNames.map((name) => ({ name })),
    variants,
    images: product.images.map((img) => ({
      src: img.src,
      alt: img.alt,
      position: img.position,
    })),
  }
}

export async function createProduct(
  ctx: StoreBuilderContext,
  product: NormalizedProduct
): Promise<StoreBuilderResult<CreatedProduct>> {
  if (!product.title.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_PAYLOAD', message: 'Titre produit manquant — impossible de créer le produit.' },
    }
  }
  if (product.variants.some((v) => !v.price || Number.isNaN(Number(v.price)))) {
    return {
      ok: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Au moins une variante a un prix manquant ou invalide.',
      },
    }
  }

  const payload = buildShopifyProductPayload(product)

  const result = await shopifyAdminRequestWithRetry<ShopifyProductApiResponse>(ctx, '/products.json', {
    method: 'POST',
    body: JSON.stringify({ product: payload }),
  })

  if (!result.ok) return result

  const { product: created } = result.data
  return {
    ok: true,
    data: {
      id: created.id,
      handle: created.handle,
      variantIds: created.variants.map((v) => v.id),
      imageIds: created.images.map((i) => i.id),
    },
  }
}
