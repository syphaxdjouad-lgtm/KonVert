// Store Builder — UI dashboard : types partagés côté client.
//
// Reflètent les contrats JSON des routes API déjà codées par ANNA (cf.
// docs/store-builder-generator-spec.md §9, docs/store-builder-sprint8-spec.md).
// Volontairement dupliqués ici plutôt qu'importés depuis src/lib/store-builder/*
// (code serveur — schema Zod, accès Supabase admin, etc. — ne doit jamais être
// bundlé côté client).

export type Vertical = 'dropshipping' | 'beaute' | 'tech'

export const VERTICAL_LABELS: Record<Vertical, string> = {
  dropshipping: 'Dropshipping / produit "wow"',
  beaute: 'Beauté & cosmétique',
  tech: 'Tech & électronique',
}

// ── Connexion boutique (table shopify_store_connections) ───────────────────

export interface StoreBuilderConnection {
  id: string
  shop_domain: string
  scopes: string
  theme_id: number | null
  product_id: number | null
  theme_installed_at: string | null
  created_at: string
}

export const STORE_BUILDER_REQUIRED_SCOPES = ['write_themes', 'write_products', 'read_products'] as const
export const AB_TEST_REQUIRED_SCOPE = 'read_orders'

// ── Générateur IA (POST /api/shopify/store-builder/generate) ───────────────

export interface DawnSectionBlock {
  type: string
  settings?: Record<string, unknown>
}

export interface DawnSection {
  type: string
  settings?: Record<string, unknown>
  blocks?: Record<string, DawnSectionBlock>
  block_order?: string[]
}

export interface DawnProductTemplate {
  sections: Record<string, DawnSection>
  order: string[]
}

export interface StoreBuilderProductFields {
  title: string
  bodyHtml: string
  subtitleMetafield: string
}

export type FlagSeverity = 'critical' | 'warning'

export interface HallucinationFlag {
  field: string
  pattern: string
  excerpt: string
  severity: FlagSeverity
}

export interface UsageInfo {
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
}

export interface GenerateResponseData {
  vertical: Vertical
  template: DawnProductTemplate
  productFields: StoreBuilderProductFields
  usedFallback: boolean
  usage?: UsageInfo
  flags: HallucinationFlag[]
  scrapeWarning?: string
  partial: boolean
}

export interface ApiError {
  code: string
  message: string
  detail?: string
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

// ── Installation (POST /api/shopify/store-builder/install) ─────────────────

export interface InstallVariantInput {
  title: string
  price: string
  compareAtPrice?: string
  sku?: string
  inventoryQuantity?: number
  optionValues: string[]
}

export interface InstallImageInput {
  src: string
  alt?: string
  position?: number
}

export type InstallStep = 'upload_theme' | 'create_product' | 'activate_theme'

// ── A/B tests (Sprint 8, Partie A) ──────────────────────────────────────────

export type AbField = 'h1_title' | 'description'
export type AbVariant = 'a' | 'b'
export type AbTestStatus = 'running' | 'promoted' | 'stopped' | 'inconclusive'
export type AbDecisionStatus = 'collecting' | 'significant' | 'inconclusive'

export interface AbTestCounts {
  visitorsA: number
  visitorsB: number
  atcA: number
  atcB: number
  purchasesA: number
  purchasesB: number
}

export interface ZTestResult {
  pA: number
  pB: number
  z: number
  pValue: number
}

export interface GuardrailCheck {
  passed: boolean
  reasons: string[]
}

export interface AbDecision {
  status: AbDecisionStatus
  winner: AbVariant | null
  zTest: ZTestResult
  guardrails: GuardrailCheck
}

export interface AddToCartAlert {
  alert: boolean
  pValue: number
}

export interface AbTestStatsSnapshot {
  counts: AbTestCounts
  daysElapsed: number
  decision: AbDecision
  addToCartAlert: AddToCartAlert
}

export interface AbTest {
  id: string
  user_id: string
  connection_id: string
  field: AbField
  variant_a_text: string
  variant_b_text: string
  status: AbTestStatus
  winner: 'a' | 'b' | 'inconclusive' | null
  started_at: string
  ended_at: string | null
  created_at: string
  updated_at: string
  stats: AbTestStatsSnapshot
}

// AB_* garde-fous — dupliqués de src/lib/store-builder/ab-testing/types.ts
// (constantes pures, sans risque de désynchronisation fonctionnelle — utilisées
// uniquement pour l'affichage des seuils dans l'UI).
export const AB_MIN_VISITORS_PER_VARIANT = 100
export const AB_MIN_DAYS_ELAPSED = 7
export const AB_MIN_PURCHASES_PER_VARIANT = 10
export const AB_MAX_DURATION_DAYS = 30
export const AB_SIGNIFICANCE_ALPHA = 0.05

// ── Audit CRO (Sprint 8, Partie B — table store_builder_audits) ────────────

export type AuditBand = 'red' | 'orange' | 'green'
export type AuditCheckpoint = 'j7' | 'j30'

export interface AuditCriterionResult {
  id: number
  label: string
  weight: number
  pass: boolean
  credit: number
  measuredValue: unknown
  measurable: boolean
  recommendation?: string
}

export interface StoreBuilderAudit {
  id: string
  connection_id: string
  checkpoint: AuditCheckpoint
  score: number
  band: AuditBand
  criteria: AuditCriterionResult[]
  created_at: string
}
