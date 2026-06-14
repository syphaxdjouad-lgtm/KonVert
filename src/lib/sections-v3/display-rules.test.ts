import { describe, it, expect } from 'vitest'
import { shouldRenderSection } from './display-rules'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('shouldRenderSection', () => {
  it('hero: always true (mandatory)', () => {
    expect(shouldRenderSection('hero', base)).toBe(true)
  })
  // P0-3 : threshold gallery abaissé à 1 (était 3).
  // 65% des produits AliExpress n'ont que 1-2 images scrapées → la gallery
  // était systématiquement skippée → vide blanc 160px.
  it('gallery: P0-3 — affiche dès 1 image (threshold abaissé de 3 à 1)', () => {
    expect(shouldRenderSection('gallery', { ...base, images: [] })).toBe(false)
    expect(shouldRenderSection('gallery', { ...base, images: ['a'] })).toBe(true)
    expect(shouldRenderSection('gallery', { ...base, images: ['a', 'b'] })).toBe(true)
    expect(shouldRenderSection('gallery', { ...base, images: ['a', 'b', 'c'] })).toBe(true)
  })
  it('materials_breakdown: needs >= 2 materials with confidence >= 0.6', () => {
    const lowConf: V3PageData = { ...base, copy: { materials: [
      { name: 'X', benefit: 'y', confidence: 0.3 },
      { name: 'Y', benefit: 'z', confidence: 0.5 },
    ]}}
    const highConf: V3PageData = { ...base, copy: { materials: [
      { name: 'X', benefit: 'y', confidence: 0.8 },
      { name: 'Y', benefit: 'z', confidence: 0.7 },
    ]}}
    expect(shouldRenderSection('materials_breakdown', lowConf)).toBe(false)
    expect(shouldRenderSection('materials_breakdown', highConf)).toBe(true)
  })
  it('reviews_ai_summary: needs reviews_summary copy', () => {
    expect(shouldRenderSection('reviews_ai_summary', base)).toBe(false)
    expect(shouldRenderSection('reviews_ai_summary', {
      ...base, copy: { reviews_summary: 'Customers say...' }
    })).toBe(true)
  })
  it('compare_variants: needs >= 2 variants', () => {
    const oneVar: V3PageData = { ...base, product: { ...base.product, variants: [{ name: 'A' }] }}
    const twoVar: V3PageData = { ...base, product: { ...base.product, variants: [{ name: 'A' }, { name: 'B' }] }}
    expect(shouldRenderSection('compare_variants', oneVar)).toBe(false)
    expect(shouldRenderSection('compare_variants', twoVar)).toBe(true)
  })
})
