// Store Builder for Shopify — Re-audit CRO : agrégation du score + bandes.
// Cf. spec KAKASHI §B.2 (docs/store-builder-sprint8-spec.md).

import type { AuditBand, AuditCriterionResult, AuditResult } from './types'

export function computeAuditScore(criteria: AuditCriterionResult[]): AuditResult {
  const raw = criteria.reduce((sum, c) => sum + c.weight * c.credit, 0)
  const score = Math.round(raw * 100) / 100
  const band: AuditBand = score < 50 ? 'red' : score <= 75 ? 'orange' : 'green'
  return { score, band, criteria }
}

/**
 * Top N recommandations — les critères en échec (credit < 1) triés par
 * poids décroissant, cf. spec §B.5 "Top 3 recommandations uniquement,
 * jamais plus de 3 actions". Tie-break par id croissant pour un ordre
 * stable et déterministe (tests reproductibles).
 */
export function selectTopRecommendations(criteria: AuditCriterionResult[], limit = 3): AuditCriterionResult[] {
  return criteria
    .filter((c) => c.credit < 1 && c.recommendation)
    .sort((a, b) => (b.weight !== a.weight ? b.weight - a.weight : a.id - b.id))
    .slice(0, limit)
}

/** Nombre de critères du Groupe 1 (ids 1-6, les "vrais gaps structurels") en
 * échec — cf. spec §Récap "Nombre de critères Groupe 1 en échec". */
export function countGroup1Failures(criteria: AuditCriterionResult[]): number {
  return criteria.filter((c) => c.id >= 1 && c.id <= 6 && c.credit < 1).length
}
