import { describe, it, expect } from 'vitest'
import {
  computeZTest,
  evaluateGuardrails,
  decideAbTest,
  evaluateAddToCartAlert,
} from '../stats'

describe('computeZTest', () => {
  it('p-value = 1 et z = 0 si les deux variantes ont un taux identique', () => {
    const result = computeZTest({ visitorsA: 200, purchasesA: 20, visitorsB: 200, purchasesB: 20 })
    expect(result.pA).toBeCloseTo(0.1)
    expect(result.pB).toBeCloseTo(0.1)
    expect(result.z).toBeCloseTo(0)
    expect(result.pValue).toBeCloseTo(1)
  })

  it('détecte un écart significatif avec un grand échantillon et un fort delta', () => {
    // A: 5% conversion, B: 15% conversion, 1000 visiteurs chacun — écart net.
    const result = computeZTest({ visitorsA: 1000, purchasesA: 50, visitorsB: 1000, purchasesB: 150 })
    expect(result.pB).toBeGreaterThan(result.pA)
    expect(result.pValue).toBeLessThan(0.05)
  })

  it('ne détecte rien de significatif avec un petit échantillon bruité', () => {
    const result = computeZTest({ visitorsA: 20, purchasesA: 2, visitorsB: 20, purchasesB: 3 })
    expect(result.pValue).toBeGreaterThan(0.05)
  })

  it('gère les visiteurs à 0 sans diviser par zéro', () => {
    const result = computeZTest({ visitorsA: 0, purchasesA: 0, visitorsB: 100, purchasesB: 10 })
    expect(result.pA).toBe(0)
    expect(result.pValue).toBe(1)
  })

  it('gère le cas 0 achat des deux côtés (variance nulle) sans NaN', () => {
    const result = computeZTest({ visitorsA: 100, purchasesA: 0, visitorsB: 100, purchasesB: 0 })
    expect(Number.isNaN(result.z)).toBe(false)
    expect(Number.isNaN(result.pValue)).toBe(false)
    expect(result.pValue).toBe(1)
  })
})

describe('evaluateGuardrails', () => {
  const passing = { visitorsA: 150, visitorsB: 150, purchasesA: 15, purchasesB: 20, daysElapsed: 10 }

  it('passe quand tous les seuils sont atteints', () => {
    expect(evaluateGuardrails(passing).passed).toBe(true)
  })

  it('échoue si visiteurs A < 100', () => {
    const check = evaluateGuardrails({ ...passing, visitorsA: 99 })
    expect(check.passed).toBe(false)
    expect(check.reasons.some((r) => r.includes('Visiteurs variante A'))).toBe(true)
  })

  it('échoue si visiteurs B < 100', () => {
    const check = evaluateGuardrails({ ...passing, visitorsB: 99 })
    expect(check.passed).toBe(false)
  })

  it('échoue si moins de 7 jours écoulés', () => {
    const check = evaluateGuardrails({ ...passing, daysElapsed: 6 })
    expect(check.passed).toBe(false)
    expect(check.reasons.some((r) => r.includes('Durée du test'))).toBe(true)
  })

  it('échoue si achats A < 10 même avec N élevé', () => {
    const check = evaluateGuardrails({ ...passing, purchasesA: 9 })
    expect(check.passed).toBe(false)
    expect(check.reasons.some((r) => r.includes('Achats variante A'))).toBe(true)
  })

  it('échoue si achats B < 10', () => {
    const check = evaluateGuardrails({ ...passing, purchasesB: 9 })
    expect(check.passed).toBe(false)
  })

  it('cumule toutes les raisons manquantes', () => {
    const check = evaluateGuardrails({ visitorsA: 10, visitorsB: 10, purchasesA: 1, purchasesB: 1, daysElapsed: 1 })
    expect(check.reasons.length).toBe(5)
  })
})

describe('decideAbTest', () => {
  it("statut 'collecting' tant que les garde-fous ne sont pas remplis, même si p<0.05", () => {
    // Échantillon minuscule mais écart énorme → p-value potentiellement basse,
    // NE DOIT JAMAIS déclarer de gagnant sous les seuils N/achats/jours.
    const decision = decideAbTest({ visitorsA: 20, purchasesA: 1, visitorsB: 20, purchasesB: 15, daysElapsed: 10 })
    expect(decision.status).toBe('collecting')
    expect(decision.winner).toBeNull()
  })

  it("statut 'significant' avec winner correct quand tous les garde-fous + p<0.05 sont réunis", () => {
    const decision = decideAbTest({ visitorsA: 500, purchasesA: 25, visitorsB: 500, purchasesB: 60, daysElapsed: 10 })
    expect(decision.status).toBe('significant')
    expect(decision.winner).toBe('b')
  })

  it("statut 'inconclusive' à 30 jours si les garde-fous ne sont toujours pas remplis", () => {
    const decision = decideAbTest({ visitorsA: 50, purchasesA: 2, visitorsB: 50, purchasesB: 3, daysElapsed: 30 })
    expect(decision.status).toBe('inconclusive')
    expect(decision.winner).toBeNull()
  })

  it("statut 'inconclusive' à 30 jours si garde-fous OK mais p >= 0.05", () => {
    const decision = decideAbTest({ visitorsA: 200, purchasesA: 20, visitorsB: 200, purchasesB: 22, daysElapsed: 30 })
    expect(decision.status).toBe('inconclusive')
    expect(decision.winner).toBeNull()
  })

  it("reste 'collecting' avant 30 jours même si les garde-fous échouent", () => {
    const decision = decideAbTest({ visitorsA: 50, purchasesA: 2, visitorsB: 50, purchasesB: 3, daysElapsed: 15 })
    expect(decision.status).toBe('collecting')
  })

  it('désigne A comme gagnant si A convertit mieux', () => {
    const decision = decideAbTest({ visitorsA: 500, purchasesA: 60, visitorsB: 500, purchasesB: 25, daysElapsed: 10 })
    expect(decision.status).toBe('significant')
    expect(decision.winner).toBe('a')
  })
})

describe('evaluateAddToCartAlert', () => {
  it('alerte quand B a un taux ajout-panier significativement inférieur à A', () => {
    const alert = evaluateAddToCartAlert({ visitorsA: 1000, atcA: 200, visitorsB: 1000, atcB: 80 })
    expect(alert.alert).toBe(true)
  })

  it("n'alerte pas quand B fait mieux ou pareil que A", () => {
    const alert = evaluateAddToCartAlert({ visitorsA: 1000, atcA: 100, visitorsB: 1000, atcB: 200 })
    expect(alert.alert).toBe(false)
  })

  it("n'alerte pas si l'écart n'est pas significatif", () => {
    const alert = evaluateAddToCartAlert({ visitorsA: 50, atcA: 10, visitorsB: 50, atcB: 8 })
    expect(alert.alert).toBe(false)
  })
})
