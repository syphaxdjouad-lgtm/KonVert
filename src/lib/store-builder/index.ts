export {
  buildStoreBuilderOutputSchema,
  GENERIC_COMPETITOR_LABELS,
  GUARANTEE_ICONS,
  R5_FORBIDDEN_KEYS,
  VERTICALS,
  isVertical,
  type StoreBuilderOutput,
  type Vertical,
} from './schema'

export { merchantFactsSchema, type MerchantFacts } from './merchant-facts'

export { deriveVertical } from './vertical'

export { buildSystemPrompt, buildUserPrompt } from './prompts'

export { assertNoForbiddenKeys, ForbiddenKeyError } from './guardrails'

export {
  generateStoreBuilderContent,
  type GenerateStoreBuilderResult,
} from './generate'

export { DEFAULT_TEMPLATE_CONTENT } from './default-content'

export {
  detectSuspiciousClaims,
  type Flag,
  type FlagSeverity,
} from './hallucination-check'

export {
  assembleProductTemplate,
  type AssembledStoreBuilderTemplate,
  type StoreBuilderProductFields,
} from './assemble'

export { getBaseTemplate, type DawnProductTemplate, type DawnSection, type DawnSectionBlock } from './dawn-template'

export { sanitizeRichTextP } from './sanitize-richtext'

// ─── Sprint 8 — A/B test natif ──────────────────────────────────────────────
export {
  AB_COOKIE_NAME,
  AB_COOKIE_MAX_AGE_DAYS,
  AB_MIN_VISITORS_PER_VARIANT,
  AB_MIN_DAYS_ELAPSED,
  AB_MIN_PURCHASES_PER_VARIANT,
  AB_MAX_DURATION_DAYS,
  AB_SIGNIFICANCE_ALPHA,
  AB_CART_ATTR_TEST_ID,
  AB_CART_ATTR_VARIANT,
  AB_CART_ATTR_VISITOR_ID,
  type AbField,
  type AbVariant,
  type AbEventType,
  type AbTestStatus,
} from './ab-testing/types'
export { fnv1aHash, computeBucket, assignVariant } from './ab-testing/hash'
export {
  computeZTest,
  evaluateGuardrails,
  decideAbTest,
  evaluateAddToCartAlert,
  type ZTestInput,
  type ZTestResult,
  type GuardrailInput,
  type GuardrailCheck,
  type AbDecisionStatus,
  type AbDecision,
  type AddToCartAlertInput,
  type AddToCartAlert,
} from './ab-testing/stats'
export { buildAbTestSnippet } from './ab-testing/theme-snippet'
export {
  fetchAbTestCounts,
  computeAbTestStats,
  daysElapsedSince,
  type AbTestCounts,
  type AbTestStatsSnapshot,
} from './ab-testing/compute-stats'

// ─── Sprint 8 — Re-audit CRO J+7/J+30 ───────────────────────────────────────
export {
  evaluateAuditCriteria,
  AUDIT_TOTAL_WEIGHT,
} from './audit/criteria'
export { computeAuditScore, selectTopRecommendations, countGroup1Failures } from './audit/score'
export type {
  AuditInputs,
  AuditCriterionResult,
  AuditBand,
  AuditResult,
  AuditTestimonialBlock,
  AuditFaqItem,
} from './audit/types'
export { parseThemeTemplate, type ThemeTemplate } from './audit/parse-template'
export { fetchAuditInputs, type FetchAuditInputsParams } from './audit/fetch-inputs'
export { fetchPageSpeedMobile } from './audit/pagespeed'
