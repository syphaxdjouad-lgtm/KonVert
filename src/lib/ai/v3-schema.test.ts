import { describe, it, expect } from 'vitest'
import { deepseekV3OutputSchema } from './v3-schema'

describe('deepseekV3OutputSchema', () => {
  it('accepte un JSON V3 minimal valide (tous champs absents)', () => {
    const result = deepseekV3OutputSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepte un JSON V3 complet valide', () => {
    const full = {
      hero: { tagline: 'Designed to last', subtagline: 'Crafted in Portugal since 1972' },
      why_we_love: 'Soft natural fibers, breathable comfort, made to age beautifully.',
      features: [
        { name: 'SoftFit™', description: 'Conforme à la voûte plantaire', isPropriety: true },
      ],
      best_for: ['Daily wear', 'Travel'],
      materials: [{ name: 'Merino wool', benefit: 'Thermoregulating', confidence: 0.9 }],
      care: 'Machine wash cold, air dry.',
      faq: [{ q: 'Are they machine washable?', a: 'Yes, on cold cycle.' }],
      manifesto: { headline: 'Comfort first', pillars: ['Natural', 'Durable', 'Honest'] },
      press_quote: { quote: 'A revelation.', source: 'Vogue' },
      reviews_summary: '4.8/5 across 12k reviews.',
      how_it_works: [{ step: 1, title: 'Choose', description: 'Pick your size.' }],
    }
    const result = deepseekV3OutputSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('rejette hero avec tagline vide', () => {
    const result = deepseekV3OutputSchema.safeParse({
      hero: { tagline: '', subtagline: 'ok' },
    })
    expect(result.success).toBe(false)
  })

  it('rejette feature sans description', () => {
    const result = deepseekV3OutputSchema.safeParse({
      features: [{ name: 'SoftFit' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejette material avec confidence > 1', () => {
    const result = deepseekV3OutputSchema.safeParse({
      materials: [{ name: 'Wool', benefit: 'Warm', confidence: 1.5 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejette material avec confidence < 0', () => {
    const result = deepseekV3OutputSchema.safeParse({
      materials: [{ name: 'Wool', benefit: 'Warm', confidence: -0.1 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejette how_it_works avec step non entier', () => {
    const result = deepseekV3OutputSchema.safeParse({
      how_it_works: [{ step: 1.5, title: 'Choose', description: 'Pick.' }],
    })
    expect(result.success).toBe(false)
  })

  it('accepte hero seul (autres sections optionnelles)', () => {
    const result = deepseekV3OutputSchema.safeParse({
      hero: { tagline: 'Hello', subtagline: 'World' },
    })
    expect(result.success).toBe(true)
  })

  it('rejette manifesto sans pillars', () => {
    const result = deepseekV3OutputSchema.safeParse({
      manifesto: { headline: 'Brand' },
    })
    expect(result.success).toBe(false)
  })

  it('accepte manifesto avec pillars vide (array OK)', () => {
    const result = deepseekV3OutputSchema.safeParse({
      manifesto: { headline: 'Brand', pillars: [] },
    })
    expect(result.success).toBe(true)
  })
})
