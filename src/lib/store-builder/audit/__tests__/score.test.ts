import { describe, it, expect } from 'vitest'
import { computeAuditScore, countGroup1Failures, selectTopRecommendations } from '../score'
import type { AuditCriterionResult } from '../types'

function criterion(overrides: Partial<AuditCriterionResult>): AuditCriterionResult {
  return {
    id: 1,
    label: 'Test',
    weight: 10,
    pass: true,
    credit: 1,
    measuredValue: null,
    measurable: true,
    ...overrides,
  }
}

describe('computeAuditScore', () => {
  it('score = 100 si tous les critères sont au max, band vert', () => {
    const criteria = [criterion({ id: 1, weight: 60, credit: 1 }), criterion({ id: 2, weight: 40, credit: 1 })]
    const result = computeAuditScore(criteria)
    expect(result.score).toBe(100)
    expect(result.band).toBe('green')
  })

  it('score = 0 si tous les critères sont à 0, band rouge', () => {
    const criteria = [criterion({ id: 1, weight: 60, credit: 0 }), criterion({ id: 2, weight: 40, credit: 0 })]
    const result = computeAuditScore(criteria)
    expect(result.score).toBe(0)
    expect(result.band).toBe('red')
  })

  it('gère les credits tiered (0.6) dans la somme pondérée', () => {
    const criteria = [criterion({ id: 1, weight: 50, credit: 0.6 }), criterion({ id: 2, weight: 50, credit: 1 })]
    const result = computeAuditScore(criteria)
    expect(result.score).toBe(80) // 50*0.6 + 50*1 = 30+50=80
    expect(result.band).toBe('green')
  })

  it('bandes : rouge <50, orange 50-75 inclus, vert >75', () => {
    expect(computeAuditScore([criterion({ weight: 100, credit: 0.49 })]).band).toBe('red')
    expect(computeAuditScore([criterion({ weight: 100, credit: 0.5 })]).band).toBe('orange')
    expect(computeAuditScore([criterion({ weight: 100, credit: 0.75 })]).band).toBe('orange')
    expect(computeAuditScore([criterion({ weight: 100, credit: 0.76 })]).band).toBe('green')
  })
})

describe('selectTopRecommendations', () => {
  it('sélectionne les 3 critères en échec au poids le plus élevé, triés décroissant', () => {
    const criteria = [
      criterion({ id: 1, weight: 14, credit: 0, recommendation: 'r1' }),
      criterion({ id: 2, weight: 5, credit: 0, recommendation: 'r2' }),
      criterion({ id: 3, weight: 10, credit: 0, recommendation: 'r3' }),
      criterion({ id: 4, weight: 3, credit: 0, recommendation: 'r4' }),
      criterion({ id: 5, weight: 1, credit: 1 }), // pass — ignoré
    ]
    const top = selectTopRecommendations(criteria, 3)
    expect(top.map((c) => c.id)).toEqual([1, 3, 2])
  })

  it('ignore les critères qui passent (credit=1)', () => {
    const criteria = [criterion({ id: 1, credit: 1 }), criterion({ id: 2, credit: 1 })]
    expect(selectTopRecommendations(criteria)).toEqual([])
  })

  it("renvoie moins de 3 éléments s'il y a moins de 3 échecs (jamais plus de 3 actions)", () => {
    const criteria = [criterion({ id: 1, credit: 0, recommendation: 'r1' })]
    expect(selectTopRecommendations(criteria, 3)).toHaveLength(1)
  })

  it('tie-break stable par id croissant à poids égal', () => {
    const criteria = [
      criterion({ id: 5, weight: 5, credit: 0, recommendation: 'r5' }),
      criterion({ id: 2, weight: 5, credit: 0, recommendation: 'r2' }),
    ]
    expect(selectTopRecommendations(criteria, 2).map((c) => c.id)).toEqual([2, 5])
  })
})

describe('countGroup1Failures', () => {
  it("compte uniquement les échecs des critères 1-6 (vrais gaps structurels)", () => {
    const criteria = [
      criterion({ id: 1, credit: 0 }),
      criterion({ id: 3, credit: 0.6 }),
      criterion({ id: 6, credit: 1 }),
      criterion({ id: 10, credit: 0 }), // groupe 2, ignoré
    ]
    expect(countGroup1Failures(criteria)).toBe(2)
  })
})
