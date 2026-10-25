// Store Builder for Shopify — barrel export.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 4, 2026-07-27) : tout
// ce module a été écrit contre la doc publique Shopify Admin API, sans dev
// store réel connecté. Validation prévue Sprint 6.

export * from './types'
export { uploadTheme } from './upload-theme'
export { createProduct, buildShopifyProductPayload } from './create-product'
export { activateTheme } from './activate-theme'
export { shopifyAdminRequest, shopifyAdminRequestWithRetry } from './client'
export {
  STORE_BUILDER_REQUIRED_SCOPES,
  AB_TEST_REQUIRED_SCOPE,
  hasRequiredStoreBuilderScopes,
  hasReadOrdersScope,
  missingStoreBuilderScopes,
  parseScopes,
} from './scopes'
export {
  STORE_BUILDER_SCOPES,
  STORE_BUILDER_STATE_COOKIE,
  AB_TEST_OAUTH_SCOPE,
  buildStoreBuilderOAuthUrl,
  getStoreBuilderApiKey,
  getStoreBuilderApiSecret,
} from './oauth'

// ─── Sprint 8 — A/B test natif + re-audit CRO J+7 ──────────────────────────
export { verifyShopifyWebhookHmac } from './webhook-hmac'
export { extractAbAttribution, type AbAttribution, type ShopifyOrderNoteAttribute } from './order-attribution'
export {
  buildWebhookRegistrationPayload,
  registerOrdersPaidWebhook,
  type WebhookRegistrationPayload,
} from './register-webhook'
export { updateProductField, type UpdatableProductField } from './update-product'
