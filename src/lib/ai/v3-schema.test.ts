import { describe, it, expect } from 'vitest'
import { deepseekV3OutputSchema, reviewSchema } from './v3-schema'

// Base review valide (référence) — chaque test override le champ testé.
const BASE_REVIEW = {
  author: 'Marie L.',
  initials: 'ML',
  rating: 5 as const,
  title: 'Parfait',
  text: 'Très content de mon achat.',
  date: 'il y a 3 jours',
  verified: true,
}

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

describe('reviewSchema — tolérance langues non-latines (repro AR 2026-07-28)', () => {
  it('accepte des initials latines classiques ≤3 chars (regression)', () => {
    const result = reviewSchema.safeParse(BASE_REVIEW)
    expect(result.success).toBe(true)
  })

  it('accepte initials arabes >3 chars envoyées par le LLM (ex: "س.م.")', () => {
    // Avant le fix : z.string().min(1).max(3) rejetait ce payload →
    // NoObjectGeneratedError intermittent en langue arabe (repro 2/10).
    const result = reviewSchema.safeParse({
      ...BASE_REVIEW,
      author: 'سارة م.',
      initials: 'س.م.', // 4 caractères
    })
    expect(result.success).toBe(true)
  })

  it('accepte reviews sans initials du tout (champ optionnel)', () => {
    const withoutInitials = {
      author: BASE_REVIEW.author,
      rating: BASE_REVIEW.rating,
      title: BASE_REVIEW.title,
      text: BASE_REVIEW.text,
      date: BASE_REVIEW.date,
      verified: BASE_REVIEW.verified,
    }
    const result = reviewSchema.safeParse(withoutInitials)
    expect(result.success).toBe(true)
  })

  it('mappe description → text quand text est absent (alias LLM)', () => {
    const result = reviewSchema.safeParse({
      author: BASE_REVIEW.author,
      initials: BASE_REVIEW.initials,
      rating: BASE_REVIEW.rating,
      title: BASE_REVIEW.title,
      date: BASE_REVIEW.date,
      verified: BASE_REVIEW.verified,
      description: 'Très content de mon achat.',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.text).toBe('Très content de mon achat.')
    }
  })

  it('ne mappe PAS description → text quand text est déjà présent', () => {
    const result = reviewSchema.safeParse({
      ...BASE_REVIEW,
      text: 'Le vrai texte',
      description: 'Un texte parasite qui ne doit pas écraser text',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.text).toBe('Le vrai texte')
    }
  })

  it('rejette toujours une review sans aucun texte exploitable (ni text ni description)', () => {
    const withoutText = {
      author: BASE_REVIEW.author,
      initials: BASE_REVIEW.initials,
      rating: BASE_REVIEW.rating,
      title: BASE_REVIEW.title,
      date: BASE_REVIEW.date,
      verified: BASE_REVIEW.verified,
    }
    const result = reviewSchema.safeParse(withoutText)
    expect(result.success).toBe(false)
  })
})

describe('deepseekV3OutputSchema — reviews non-latines n\'échouent plus la validation globale', () => {
  it('accepte un output complet avec reviews arabes + initials hors format', () => {
    const result = deepseekV3OutputSchema.safeParse({
      reviews: [
        { ...BASE_REVIEW, author: 'سارة م.', initials: 'س.م.' },
        { ...BASE_REVIEW, author: 'أحمد ل.', initials: 'أ.ل.', description: 'رحلة رائعة', text: undefined },
      ],
    })
    expect(result.success).toBe(true)
  })
})
