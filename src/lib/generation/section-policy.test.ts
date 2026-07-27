import { describe, it, expect } from 'vitest'
import { getSectionPolicy, policyToLegacyKeys, policyToV3Keys } from './section-policy'

describe('getSectionPolicy', () => {
  it('electronics bannit before_after et story', () => {
    const p = getSectionPolicy({ productType: 'tech', price: 30 })
    expect(p.discouraged).toContain('before_after')
    expect(p.discouraged).toContain('story')
    expect(p.recommended).toContain('features')
  })
  it('skincare recommande before_after et materials', () => {
    const p = getSectionPolicy({ productType: 'skincare', price: 45 })
    expect(p.recommended).toContain('before_after')
    expect(p.recommended).toContain('materials')
  })
  it('produit pas cher → max plus court que produit premium', () => {
    const cheap = getSectionPolicy({ productType: 'tech', price: 20 })
    const premium = getSectionPolicy({ productType: 'tech', price: 300 })
    expect(cheap.max).toBeLessThan(premium.max)
  })
  it('catégorie inconnue → policy universal', () => {
    const p = getSectionPolicy({ productType: null })
    expect(p.recommended).toContain('hero')
    expect(p.recommended).toContain('reviews')
    expect(p.max).toBeGreaterThanOrEqual(p.min)
  })
})

describe('policyToLegacyKeys / policyToV3Keys', () => {
  it('V3 n\'a pas de before_after — le mapping renvoie []', () => {
    expect(policyToV3Keys(['before_after'])).toEqual([])
  })
  it('legacy a before_after — le mapping le contient', () => {
    expect(policyToLegacyKeys(['before_after'])).toContain('before_after')
  })
  it('reviews → V3 contient bien reviews', () => {
    expect(policyToV3Keys(['reviews'])).toContain('reviews')
  })
})
