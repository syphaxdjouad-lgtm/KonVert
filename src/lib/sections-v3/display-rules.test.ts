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

  // Sprint 1 T4 — care_instructions conditionnel par catégorie
  describe('care_instructions: Sprint 1 — conditionnel par catégorie', () => {
    it('affiché si category est textile', () => {
      const d = { ...base, product: { ...base.product, category: 'textile' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(true)
    })
    it('affiché si category est sport', () => {
      const d = { ...base, product: { ...base.product, category: 'sport' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(true)
    })
    it('affiché si category est beauty', () => {
      const d = { ...base, product: { ...base.product, category: 'beauty' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(true)
    })
    it('affiché si category est fashion', () => {
      const d = { ...base, product: { ...base.product, category: 'fashion' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(true)
    })
    it('masqué si category est tech', () => {
      const d = { ...base, product: { ...base.product, category: 'tech' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(false)
    })
    it('masqué si category est food', () => {
      const d = { ...base, product: { ...base.product, category: 'food' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(false)
    })
    it('masqué si category est home_electronic', () => {
      const d = { ...base, product: { ...base.product, category: 'home_electronic' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(false)
    })
    it('fallback conservateur : affiché si category est absent (produits sans catégorie)', () => {
      // Ne pas casser les anciens produits générés sans champ category
      expect(shouldRenderSection('care_instructions', base)).toBe(true)
    })
    it('masqué si category est other', () => {
      const d = { ...base, product: { ...base.product, category: 'other' as const } }
      expect(shouldRenderSection('care_instructions', d)).toBe(false)
    })
  })

  // Sprint 4 T11-T14 — reviews display-rules explicites
  // T11 : care_instructions affichée pour {textile, sport, beauty, fashion} — déjà couvert ci-dessus.
  // T12 : care_instructions masquée pour tech — déjà couvert ci-dessus.
  // T13 & T14 : reviews length gate
  describe('reviews: Sprint 4 — gate length >= 3', () => {
    it('T13 : reviews undefined → shouldRenderSection retourne false', () => {
      expect(shouldRenderSection('reviews', base)).toBe(false)
    })

    it('T13b : reviews = [] → shouldRenderSection retourne false', () => {
      expect(shouldRenderSection('reviews', { ...base, copy: { reviews: [] } })).toBe(false)
    })

    it('T14 : reviews.length === 2 (< 3) → shouldRenderSection retourne false', () => {
      const twoReviews: V3PageData = { ...base, copy: { reviews: [
        { author: 'A', initials: 'AA', rating: 5 as const, title: 'Top', text: 'OK', date: 'J-1', verified: true },
        { author: 'B', initials: 'BB', rating: 4 as const, title: 'Bien', text: 'OK', date: 'J-2', verified: false },
      ]}}
      expect(shouldRenderSection('reviews', twoReviews)).toBe(false)
    })

    // Sprint 4 T6 — seuil relevé à 5 : 3 reviews n'est plus suffisant
    it('T13c : reviews.length === 3 (< 5, seuil Sprint 4) → shouldRenderSection retourne false', () => {
      const threeReviews: V3PageData = { ...base, copy: { reviews: [
        { author: 'A', initials: 'AA', rating: 5 as const, title: 'Top', text: 'OK', date: 'J-1', verified: true },
        { author: 'B', initials: 'BB', rating: 4 as const, title: 'Bien', text: 'OK', date: 'J-2', verified: false },
        { author: 'C', initials: 'CC', rating: 5 as const, title: 'Parfait', text: 'OK', date: 'J-3', verified: true },
      ]}}
      expect(shouldRenderSection('reviews', threeReviews)).toBe(false)
    })
  })

  // Sprint 4 T13bis/T14bis — gate reviews relevé de 3 à 5 (KISAME QW-3, T6)
  describe('reviews: Sprint 4 T6 — gate relevé à >= 5 (était >= 3)', () => {
    it('T6a : reviews.length === 3 (< 5) → shouldRenderSection retourne false', () => {
      const threeReviews: V3PageData = { ...base, copy: { reviews: [
        { author: 'A', initials: 'AA', rating: 5 as const, title: 'Top', text: 'OK', date: 'J-1', verified: true },
        { author: 'B', initials: 'BB', rating: 4 as const, title: 'Bien', text: 'OK', date: 'J-2', verified: false },
        { author: 'C', initials: 'CC', rating: 5 as const, title: 'Parfait', text: 'OK', date: 'J-3', verified: true },
      ]}}
      expect(shouldRenderSection('reviews', threeReviews)).toBe(false)
    })

    it('T6b : reviews.length === 5 (>= 5) → shouldRenderSection retourne true', () => {
      const fiveReviews: V3PageData = { ...base, copy: { reviews: [
        { author: 'A', initials: 'AA', rating: 5 as const, title: 'Top', text: 'OK', date: 'J-1', verified: true },
        { author: 'B', initials: 'BB', rating: 4 as const, title: 'Bien', text: 'OK', date: 'J-2', verified: false },
        { author: 'C', initials: 'CC', rating: 5 as const, title: 'Parfait', text: 'OK', date: 'J-3', verified: true },
        { author: 'D', initials: 'DD', rating: 5 as const, title: 'Super', text: 'OK', date: 'J-4', verified: true },
        { author: 'E', initials: 'EE', rating: 4 as const, title: 'Bon', text: 'OK', date: 'J-5', verified: true },
      ]}}
      expect(shouldRenderSection('reviews', fiveReviews)).toBe(true)
    })
  })

  // Sprint 4 T15 — compare_variants highlight : shouldRenderSection passe dès 2 variants,
  // le highlight "recommended" est une responsabilité du renderer (testé dans render.test.ts).
  // Ici on vérifie que la rule n'est pas cassée par la présence du flag recommended.
  describe('compare_variants: Sprint 4 — highlight recommended', () => {
    it('T15 : >= 1 variant avec recommended:true → shouldRenderSection retourne true', () => {
      const d: V3PageData = {
        ...base,
        product: {
          ...base.product,
          variants: [
            { name: 'Standard' },
            { name: 'Premium', recommended: true },
          ],
        },
      }
      expect(shouldRenderSection('compare_variants', d)).toBe(true)
    })

    it('T15b : variants sans recommended → shouldRenderSection retourne true si >= 2', () => {
      const d: V3PageData = {
        ...base,
        product: { ...base.product, variants: [{ name: 'A' }, { name: 'B' }] },
      }
      expect(shouldRenderSection('compare_variants', d)).toBe(true)
    })
  })
})
