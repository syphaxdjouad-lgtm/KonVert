import { describe, it, expect } from 'vitest'
import { buildShopifyProductPayload } from '../create-product'
import type { NormalizedProduct } from '../types'

const baseProduct: NormalizedProduct = {
  title: 'T-shirt Konvert',
  descriptionHtml: '<p>Description</p>',
  vendor: 'Konvert',
  productType: 'Apparel',
  tags: ['dtc', 'premium'],
  optionNames: ['Couleur', 'Taille'],
  variants: [
    { title: 'Rouge / M', price: '29.99', optionValues: ['Rouge', 'M'], sku: 'SKU-1' },
    { title: 'Bleu / L', price: '29.99', compareAtPrice: '39.99', optionValues: ['Bleu', 'L'] },
  ],
  images: [{ src: 'https://cdn.example.com/1.jpg', alt: 'Vue face', position: 1 }],
}

describe('buildShopifyProductPayload', () => {
  it('mappe les champs de base', () => {
    const payload = buildShopifyProductPayload(baseProduct)
    expect(payload.title).toBe('T-shirt Konvert')
    expect(payload.body_html).toBe('<p>Description</p>')
    expect(payload.vendor).toBe('Konvert')
    expect(payload.product_type).toBe('Apparel')
    expect(payload.tags).toBe('dtc, premium')
  })

  it('défaut status à draft si non fourni', () => {
    const payload = buildShopifyProductPayload(baseProduct)
    expect(payload.status).toBe('draft')
  })

  it('respecte status explicite', () => {
    const payload = buildShopifyProductPayload({ ...baseProduct, status: 'active' })
    expect(payload.status).toBe('active')
  })

  it('mappe les options dans le bon ordre', () => {
    const payload = buildShopifyProductPayload(baseProduct)
    expect(payload.options).toEqual([{ name: 'Couleur' }, { name: 'Taille' }])
  })

  it('mappe les variantes avec option1/option2 depuis optionValues', () => {
    const payload = buildShopifyProductPayload(baseProduct)
    const variants = payload.variants as Record<string, unknown>[]
    expect(variants).toHaveLength(2)
    expect(variants[0]).toMatchObject({ price: '29.99', option1: 'Rouge', option2: 'M', sku: 'SKU-1' })
    expect(variants[1]).toMatchObject({ price: '29.99', compare_at_price: '39.99', option1: 'Bleu', option2: 'L' })
  })

  it('fallback sur une variante Default Title si aucune variante fournie', () => {
    const payload = buildShopifyProductPayload({ ...baseProduct, variants: [] })
    expect(payload.variants).toEqual([{ price: '0.00', option1: 'Default Title' }])
  })

  it('fallback options sur ["Title"] si optionNames absent', () => {
    const payload = buildShopifyProductPayload({ ...baseProduct, optionNames: undefined })
    expect(payload.options).toEqual([{ name: 'Title' }])
  })

  it('mappe les images avec position', () => {
    const payload = buildShopifyProductPayload(baseProduct)
    expect(payload.images).toEqual([{ src: 'https://cdn.example.com/1.jpg', alt: 'Vue face', position: 1 }])
  })

  it('active inventory_management shopify seulement si inventoryQuantity fourni', () => {
    const withInventory: NormalizedProduct = {
      ...baseProduct,
      variants: [{ title: 'Unique', price: '10.00', optionValues: [], inventoryQuantity: 5 }],
    }
    const payload = buildShopifyProductPayload(withInventory)
    const variants = payload.variants as Record<string, unknown>[]
    expect(variants[0]).toMatchObject({ inventory_quantity: 5, inventory_management: 'shopify' })
  })
})
