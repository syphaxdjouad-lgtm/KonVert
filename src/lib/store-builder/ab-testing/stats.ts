// Store Builder for Shopify — calcul du gagnant A/B (test de proportion à
// deux échantillons, z-test) + garde-fous obligatoires. Cf. spec KAKASHI
// §A.4 (docs/store-builder-sprint8-spec.md). Pur, aucun accès réseau/DB —
// les compteurs (visiteurs/achats/jours) sont assemblés par l'appelant
// depuis `store_builder_ab_events`.

import {
  AB_MAX_DURATION_DAYS,
  AB_MIN_DAYS_ELAPSED,
  AB_MIN_PURCHASES_PER_VARIANT,
  AB_MIN_VISITORS_PER_VARIANT,
  AB_SIGNIFICANCE_ALPHA,
  type AbVariant,
} from './types'

// ─── Fonction de répartition normale standard (approximation Abramowitz &
// Stegun 7.1.26, erreur max ~1.5e-7 — largement suffisant pour un p-value
// utilisé comme seuil de décision, pas pour une publication scientifique) ──

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)

  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const t = 1 / (1 + p * ax)
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax)
  return sign * y
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

// ─── Test de proportion à deux échantillons ────────────────────────────────

export interface ZTestInput {
  visitorsA: number
  purchasesA: number
  visitorsB: number
  purchasesB: number
}

export interface ZTestResult {
  pA: number
  pB: number
  z: number
  /** Test bilatéral — cf. spec A.4. */
  pValue: number
}

export function computeZTest({ visitorsA, purchasesA, visitorsB, purchasesB }: ZTestInput): ZTestResult {
  if (visitorsA <= 0 || visitorsB <= 0) {
    return { pA: 0, pB: 0, z: 0, pValue: 1 }
  }

  const pA = purchasesA / visitorsA
  const pB = purchasesB / visitorsB
  const pPool = (purchasesA + purchasesB) / (visitorsA + visitorsB)
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / visitorsA + 1 / visitorsB))

  if (se === 0) {
    // p_pool ∈ {0, 1} (aucun achat des deux côtés, ou 100% de conversion des
    // deux côtés) — pas de variance, aucune conclusion statistique possible.
    return { pA, pB, z: 0, pValue: 1 }
  }

  const z = (pB - pA) / se
  const pValue = 2 * (1 - normalCdf(Math.abs(z)))
  return { pA, pB, z, pValue }
}

// ─── Garde-fous obligatoires — cf. spec A.4 ────────────────────────────────

export interface GuardrailInput {
  visitorsA: number
  visitorsB: number
  purchasesA: number
  purchasesB: number
  daysElapsed: number
}

export interface GuardrailCheck {
  passed: boolean
  /** Raisons manquantes, actionnables (affichables dashboard). */
  reasons: string[]
}

export function evaluateGuardrails(input: GuardrailInput): GuardrailCheck {
  const reasons: string[] = []

  if (input.visitorsA < AB_MIN_VISITORS_PER_VARIANT) {
    reasons.push(`Visiteurs variante A insuffisants (${input.visitorsA}/${AB_MIN_VISITORS_PER_VARIANT})`)
  }
  if (input.visitorsB < AB_MIN_VISITORS_PER_VARIANT) {
    reasons.push(`Visiteurs variante B insuffisants (${input.visitorsB}/${AB_MIN_VISITORS_PER_VARIANT})`)
  }
  if (input.daysElapsed < AB_MIN_DAYS_ELAPSED) {
    reasons.push(`Durée du test insuffisante (${input.daysElapsed}/${AB_MIN_DAYS_ELAPSED} jours)`)
  }
  if (input.purchasesA < AB_MIN_PURCHASES_PER_VARIANT) {
    reasons.push(`Achats variante A insuffisants (${input.purchasesA}/${AB_MIN_PURCHASES_PER_VARIANT})`)
  }
  if (input.purchasesB < AB_MIN_PURCHASES_PER_VARIANT) {
    reasons.push(`Achats variante B insuffisants (${input.purchasesB}/${AB_MIN_PURCHASES_PER_VARIANT})`)
  }

  return { passed: reasons.length === 0, reasons }
}

// ─── Décision finale (garde-fous + z-test + plafond 30j) ──────────────────

export type AbDecisionStatus = 'collecting' | 'significant' | 'inconclusive'

export interface AbDecision {
  status: AbDecisionStatus
  winner: AbVariant | null
  zTest: ZTestResult
  guardrails: GuardrailCheck
}

/**
 * Décide du statut d'un test A/B. Ne déclare JAMAIS de gagnant tant que tous
 * les garde-fous ne sont pas simultanément vrais (cf. spec A.4) — même avec
 * un p-value < 0.05 obtenu prématurément sur un échantillon trop petit.
 *
 * Au plafond de 30 jours (`AB_MAX_DURATION_DAYS`), un test qui n'a jamais
 * atteint la significativité est clos automatiquement en `inconclusive`
 * (déclenché par le cron quotidien, cf. spec A.4 "Fenêtre de décision").
 */
export function decideAbTest(input: GuardrailInput): AbDecision {
  const guardrails = evaluateGuardrails(input)
  const zTest = computeZTest({
    visitorsA: input.visitorsA,
    purchasesA: input.purchasesA,
    visitorsB: input.visitorsB,
    purchasesB: input.purchasesB,
  })

  const pastDeadline = input.daysElapsed >= AB_MAX_DURATION_DAYS

  if (guardrails.passed && zTest.pValue < AB_SIGNIFICANCE_ALPHA) {
    return { status: 'significant', winner: zTest.pB > zTest.pA ? 'b' : 'a', zTest, guardrails }
  }

  if (pastDeadline) {
    return { status: 'inconclusive', winner: null, zTest, guardrails }
  }

  return { status: 'collecting', winner: null, zTest, guardrails }
}

// ─── Garde-fou secondaire — alerte ajout panier (non bloquant) ────────────
// cf. spec A.4 "Garde-fou secondaire affiché en continu" : si le taux
// d'ajout panier de B est significativement inférieur à A, on affiche une
// alerte dashboard, mais on ne coupe jamais le test automatiquement dessus.

export interface AddToCartAlertInput {
  visitorsA: number
  atcA: number
  visitorsB: number
  atcB: number
}

export interface AddToCartAlert {
  alert: boolean
  pValue: number
}

export function evaluateAddToCartAlert(input: AddToCartAlertInput): AddToCartAlert {
  const zTest = computeZTest({
    visitorsA: input.visitorsA,
    purchasesA: input.atcA,
    visitorsB: input.visitorsB,
    purchasesB: input.atcB,
  })
  const alert = zTest.pValue < AB_SIGNIFICANCE_ALPHA && zTest.pB < zTest.pA
  return { alert, pValue: zTest.pValue }
}
