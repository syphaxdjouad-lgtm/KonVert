// Store Builder for Shopify — Re-audit CRO J+7/J+30 : types.
// Cf. spec KAKASHI §Partie B (docs/store-builder-sprint8-spec.md).

/** Données déjà collectées (Theme Asset API / Admin API / PageSpeed / fetch
 * public), consommées par le moteur de scoring pur (criteria.ts). Séparer
 * la collecte (impure, réseau) du scoring (pur) permet de tester les 18
 * critères sans réseau, avec des fixtures. */
export interface AuditTestimonialBlock {
  authorName: string
  quote: string
  rating: number
}

export interface AuditFaqItem {
  question: string
  answer: string
}

export interface AuditInputs {
  testimonials: AuditTestimonialBlock[]
  socialProofNumber: string
  socialProofCustomText: string
  founderName: string
  founderStoryHtml: string
  founderPhoto: string
  exitIntentPromoCode: string
  faqItems: AuditFaqItem[]
  guaranteesFilledCount: number
  comparisonRowsFilledCount: number
  urgencyMessageDefault: string
  stickyAtcSectionPresent: boolean
  productDescriptionHtml: string
  productImagesCount: number
  metaTitle: string
  metaDescription: string
  /** null = non mesuré (fetch de la page publique impossible/échoué). */
  jsonLdProductPresent: boolean | null
  /** 0-1, null si `GOOGLE_PSI_API_KEY` absente ou appel PageSpeed échoué. */
  pageSpeedPerformanceScore: number | null
  /** ms, null si PageSpeed indisponible. */
  pageSpeedLcpMs: number | null
}

export interface AuditCriterionResult {
  id: number
  label: string
  weight: number
  pass: boolean
  /** 0, 0.6 ou 1 — tiered pour #1 (avis) et #17 (perf mobile), binaire sinon. */
  credit: number
  measuredValue: unknown
  /** false = donnée non mesurable dans ce contexte (pas de clé/store réel) — le
   * critère compte quand même dans le score (credit=0) mais est signalé à part. */
  measurable: boolean
  /** Reco 1 phrase — présente seulement si credit < 1. */
  recommendation?: string
}

export type AuditBand = 'red' | 'orange' | 'green'

export interface AuditResult {
  score: number
  band: AuditBand
  criteria: AuditCriterionResult[]
}
