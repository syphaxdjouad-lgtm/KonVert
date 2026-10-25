import { describe, it, expect } from 'vitest'
import { evaluateAuditCriteria, AUDIT_TOTAL_WEIGHT } from '../criteria'
import type { AuditInputs } from '../types'

// Fixture "tout au vert" — sert de point de départ, chaque test dégrade un
// seul champ pour isoler le critère concerné.
function fullInputs(overrides: Partial<AuditInputs> = {}): AuditInputs {
  return {
    testimonials: [
      { authorName: 'Marie D.', quote: 'Top produit', rating: 5 },
      { authorName: 'Karim B.', quote: 'Livraison rapide', rating: 4 },
      { authorName: 'Sophie L.', quote: 'Je recommande', rating: 5 },
    ],
    socialProofNumber: '10 000+',
    socialProofCustomText: '',
    founderName: 'Julien',
    founderStoryHtml: 'Fondée en 2022 à Lyon par Julien, artisan passionné.',
    founderPhoto: 'https://cdn.shopify.com/photo.jpg',
    exitIntentPromoCode: 'BIENVENUE10',
    faqItems: [
      { question: 'Livraison ?', answer: '3-5 jours' },
      { question: 'Retour ?', answer: '30 jours' },
      { question: 'Paiement ?', answer: 'CB, Paypal' },
    ],
    guaranteesFilledCount: 3,
    comparisonRowsFilledCount: 4,
    urgencyMessageDefault: 'Stock limité',
    stickyAtcSectionPresent: true,
    productDescriptionHtml: `<p>${'mot '.repeat(160)}</p>`,
    productImagesCount: 6,
    metaTitle: 'Un titre SEO calibré pour ce produit précis',
    metaDescription:
      'Une meta description parfaitement calibrée entre 70 et 160 caractères pour un bon référencement Google.',
    jsonLdProductPresent: true,
    pageSpeedPerformanceScore: 0.95,
    pageSpeedLcpMs: 1800,
    ...overrides,
  }
}

describe('AUDIT_TOTAL_WEIGHT', () => {
  it('la somme des poids des 18 critères vaut exactement 100', () => {
    const criteria = evaluateAuditCriteria(fullInputs())
    expect(criteria).toHaveLength(18)
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
    expect(totalWeight).toBe(AUDIT_TOTAL_WEIGHT)
    expect(totalWeight).toBe(100)
  })

  it('groupes conformes à la spec : Σ groupe1=47, groupe2=23, groupe3=30', () => {
    const criteria = evaluateAuditCriteria(fullInputs())
    const sumRange = (from: number, to: number) =>
      criteria.filter((c) => c.id >= from && c.id <= to).reduce((s, c) => s + c.weight, 0)
    expect(sumRange(1, 6)).toBe(47)
    expect(sumRange(7, 12)).toBe(23)
    expect(sumRange(13, 18)).toBe(30)
  })
})

describe('#1 avis clients réels (tiered)', () => {
  it('credit 1 avec >= 3 vrais avis', () => {
    const c = evaluateAuditCriteria(fullInputs()).find((c) => c.id === 1)!
    expect(c.credit).toBe(1)
    expect(c.pass).toBe(true)
  })

  it('credit 0.6 avec 1-2 vrais avis', () => {
    const c = evaluateAuditCriteria(
      fullInputs({ testimonials: [{ authorName: 'Marie D.', quote: 'Top', rating: 5 }] })
    ).find((c) => c.id === 1)!
    expect(c.credit).toBe(0.6)
    expect(c.pass).toBe(false)
  })

  it('credit 0 avec 0 vrai avis (placeholders uniquement)', () => {
    const c = evaluateAuditCriteria(fullInputs({ testimonials: [] })).find((c) => c.id === 1)!
    expect(c.credit).toBe(0)
    expect(c.recommendation).toMatch(/vrais avis/i)
    expect(c.recommendation).not.toMatch(/génère/i)
  })
})

describe('#2 preuve sociale', () => {
  it('pass si proof_number OU custom_text renseigné', () => {
    expect(evaluateAuditCriteria(fullInputs()).find((c) => c.id === 2)!.pass).toBe(true)
  })

  it('fail si les deux sont vides, reco jamais "invente"', () => {
    const c = evaluateAuditCriteria(fullInputs({ socialProofNumber: '', socialProofCustomText: '' })).find(
      (c) => c.id === 2
    )!
    expect(c.pass).toBe(false)
    expect(c.recommendation).toMatch(/jamais inventé/i)
  })
})

describe('#3 nom du fondateur', () => {
  it('fail si vide', () => {
    expect(evaluateAuditCriteria(fullInputs({ founderName: '' })).find((c) => c.id === 3)!.pass).toBe(false)
  })
})

describe('#4 histoire fondateur personnalisée', () => {
  it('fail si un token [xxx] reste dans le texte', () => {
    const c = evaluateAuditCriteria(fullInputs({ founderStoryHtml: 'Fondée en [année] à [ville]' })).find(
      (c) => c.id === 4
    )!
    expect(c.pass).toBe(false)
  })

  it('pass si le texte est personnalisé sans crochets', () => {
    expect(evaluateAuditCriteria(fullInputs()).find((c) => c.id === 4)!.pass).toBe(true)
  })

  it('fail si vide', () => {
    expect(evaluateAuditCriteria(fullInputs({ founderStoryHtml: '' })).find((c) => c.id === 4)!.pass).toBe(false)
  })
})

describe('#5 photo fondateur', () => {
  it('fail si vide', () => {
    expect(evaluateAuditCriteria(fullInputs({ founderPhoto: '' })).find((c) => c.id === 5)!.pass).toBe(false)
  })
})

describe('#6 popup exit-intent', () => {
  it('fail si promo_code vide', () => {
    expect(evaluateAuditCriteria(fullInputs({ exitIntentPromoCode: '' })).find((c) => c.id === 6)!.pass).toBe(false)
  })
})

describe('#7 FAQ >= 3', () => {
  it('fail avec 2 Q/R remplies', () => {
    const c = evaluateAuditCriteria(
      fullInputs({ faqItems: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }] })
    ).find((c) => c.id === 7)!
    expect(c.pass).toBe(false)
  })

  it('ne compte pas les Q/R partiellement vides', () => {
    const c = evaluateAuditCriteria(
      fullInputs({
        faqItems: [
          { question: 'Q1', answer: 'A1' },
          { question: 'Q2', answer: '' },
          { question: '', answer: 'A3' },
        ],
      })
    ).find((c) => c.id === 7)!
    expect(c.measuredValue).toBe(1)
    expect(c.pass).toBe(false)
  })
})

describe('#8 garanties >= 3', () => {
  it('fail avec 2', () => {
    expect(evaluateAuditCriteria(fullInputs({ guaranteesFilledCount: 2 })).find((c) => c.id === 8)!.pass).toBe(false)
  })
})

describe('#9 tableau comparatif >= 4 lignes', () => {
  it('fail avec 3 lignes', () => {
    expect(
      evaluateAuditCriteria(fullInputs({ comparisonRowsFilledCount: 3 })).find((c) => c.id === 9)!.pass
    ).toBe(false)
  })
})

describe('#10 barre urgence', () => {
  it('fail si vide', () => {
    expect(evaluateAuditCriteria(fullInputs({ urgencyMessageDefault: '' })).find((c) => c.id === 10)!.pass).toBe(
      false
    )
  })
})

describe('#11 sticky ATC mobile', () => {
  it('fail si absent', () => {
    expect(
      evaluateAuditCriteria(fullInputs({ stickyAtcSectionPresent: false })).find((c) => c.id === 11)!.pass
    ).toBe(false)
  })
})

describe('#12 description >= 150 mots', () => {
  it('fail sous 150 mots', () => {
    const c = evaluateAuditCriteria(fullInputs({ productDescriptionHtml: '<p>Trop court.</p>' })).find(
      (c) => c.id === 12
    )!
    expect(c.pass).toBe(false)
  })

  it('pass à exactement 150 mots', () => {
    const html = `<p>${'mot '.repeat(150).trim()}</p>`
    const c = evaluateAuditCriteria(fullInputs({ productDescriptionHtml: html })).find((c) => c.id === 12)!
    expect(c.measuredValue).toBe(150)
    expect(c.pass).toBe(true)
  })
})

describe('#13 images >= 4', () => {
  it('fail avec 3 images', () => {
    expect(evaluateAuditCriteria(fullInputs({ productImagesCount: 3 })).find((c) => c.id === 13)!.pass).toBe(false)
  })
})

describe('#14 meta title 30-60 caractères', () => {
  it('fail si trop court', () => {
    expect(evaluateAuditCriteria(fullInputs({ metaTitle: 'Trop court' })).find((c) => c.id === 14)!.pass).toBe(false)
  })

  it('fail si trop long', () => {
    const c = evaluateAuditCriteria(fullInputs({ metaTitle: 'x'.repeat(61) })).find((c) => c.id === 14)!
    expect(c.pass).toBe(false)
  })

  it('pass aux bornes 30 et 60', () => {
    expect(evaluateAuditCriteria(fullInputs({ metaTitle: 'x'.repeat(30) })).find((c) => c.id === 14)!.pass).toBe(true)
    expect(evaluateAuditCriteria(fullInputs({ metaTitle: 'x'.repeat(60) })).find((c) => c.id === 14)!.pass).toBe(true)
  })
})

describe('#15 meta description 70-160 caractères', () => {
  it('fail hors bornes', () => {
    expect(evaluateAuditCriteria(fullInputs({ metaDescription: 'trop court' })).find((c) => c.id === 15)!.pass).toBe(
      false
    )
    expect(
      evaluateAuditCriteria(fullInputs({ metaDescription: 'x'.repeat(161) })).find((c) => c.id === 15)!.pass
    ).toBe(false)
  })
})

describe('#16 JSON-LD Product', () => {
  it('measurable=false et fail si jamais mesuré (null)', () => {
    const c = evaluateAuditCriteria(fullInputs({ jsonLdProductPresent: null })).find((c) => c.id === 16)!
    expect(c.measurable).toBe(false)
    expect(c.pass).toBe(false)
    expect(c.credit).toBe(0)
  })

  it('measurable=true et fail si mesuré absent', () => {
    const c = evaluateAuditCriteria(fullInputs({ jsonLdProductPresent: false })).find((c) => c.id === 16)!
    expect(c.measurable).toBe(true)
    expect(c.pass).toBe(false)
  })

  it('measurable=true et pass si présent', () => {
    const c = evaluateAuditCriteria(fullInputs({ jsonLdProductPresent: true })).find((c) => c.id === 16)!
    expect(c.measurable).toBe(true)
    expect(c.pass).toBe(true)
  })
})

describe('#17 perf mobile (tiered)', () => {
  it('measurable=false sans clé PageSpeed (score null)', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedPerformanceScore: null })).find((c) => c.id === 17)!
    expect(c.measurable).toBe(false)
    expect(c.credit).toBe(0)
  })

  it('credit 0 sous 50%', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedPerformanceScore: 0.3 })).find((c) => c.id === 17)!
    expect(c.credit).toBe(0)
  })

  it('credit 0.6 entre 50 et 89%', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedPerformanceScore: 0.7 })).find((c) => c.id === 17)!
    expect(c.credit).toBe(0.6)
  })

  it('credit 1 à partir de 90%', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedPerformanceScore: 0.9 })).find((c) => c.id === 17)!
    expect(c.credit).toBe(1)
  })
})

describe('#18 LCP mobile < 4000ms', () => {
  it('measurable=false sans clé PageSpeed', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedLcpMs: null })).find((c) => c.id === 18)!
    expect(c.measurable).toBe(false)
  })

  it('fail si >= 4000ms', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedLcpMs: 4200 })).find((c) => c.id === 18)!
    expect(c.pass).toBe(false)
  })

  it('pass si < 4000ms', () => {
    const c = evaluateAuditCriteria(fullInputs({ pageSpeedLcpMs: 3999 })).find((c) => c.id === 18)!
    expect(c.pass).toBe(true)
  })
})

describe('wording R5 — aucune reco social-proof/testimonials ne doit dire "génère"', () => {
  it('vérifie #1 et #2 sur un jeu de critères tous en échec', () => {
    const criteria = evaluateAuditCriteria(
      fullInputs({ testimonials: [], socialProofNumber: '', socialProofCustomText: '' })
    )
    const social = criteria.filter((c) => c.id === 1 || c.id === 2)
    for (const c of social) {
      expect(c.recommendation).toBeDefined()
      expect(c.recommendation!.toLowerCase()).not.toContain('génère')
      expect(c.recommendation!.toLowerCase()).not.toContain('génère automatiquement')
    }
  })
})
