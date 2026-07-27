// Store Builder for Shopify — flow OAuth dédié (Sprint 6).
//
// Volontairement SÉPARÉ du flow OAuth page-builder (src/lib/shopify/index.ts
// + src/app/api/shopify/install|callback) : le Store Builder a besoin de
// scopes différents (write_themes, write_products, read_products) et on ne
// veut pas élargir silencieusement les permissions déjà accordées par les
// marchands page-builder existants, ni risquer de casser leur flow en cas de
// bug. Détail de la décision dans le rapport de commit / plan Sprint 6.
//
// Réutilise les primitives OAuth génériques déjà présentes dans
// src/lib/shopify/index.ts (verifyHmac, generateState, encryptToken,
// decryptToken, exchangeCodeForTokenWithCredentials) — elles ne sont pas
// spécifiques au page-builder, seul `buildOAuthUrl` l'était (scopes/redirect
// hardcodés), donc on ajoute ici l'équivalent Store Builder plutôt que de
// dupliquer HMAC/state/chiffrement.
//
// ⚠️ CODÉ MAIS NON VALIDÉ SANS DEV STORE + APP PARTNER RÉELLE (2026-07-27) :
// écrit contre la doc publique Shopify OAuth, aucun round-trip réel effectué.

import { getAppUrl } from '@/lib/env'

// ─── Scopes ───────────────────────────────────────────────────────────────

// cf. src/lib/shopify/store-builder/scopes.ts pour la liste des scopes requis
// côté validation. Cette constante est la valeur ENVOYÉE à Shopify lors du
// /admin/oauth/authorize — elle doit rester en synchro avec
// STORE_BUILDER_REQUIRED_SCOPES (mais peut en demander PLUS si Shopify exige
// un scope non strictement requis par nos appels API, ex: futur
// write_publications — cf. question ouverte dans scopes.ts).
export const STORE_BUILDER_SCOPES = 'write_themes,write_products,read_products'

// Scope élargi demandé UNIQUEMENT à la création du 1er test A/B (cf.
// scopes.ts AB_TEST_REQUIRED_SCOPE et spec KAKASHI §A.3) — jamais au connect
// initial, pour ne pas alourdir l'onboarding des marchands qui n'utilisent
// pas l'A/B testing.
export const AB_TEST_OAUTH_SCOPE = 'read_orders'

// ─── Cookie state CSRF ────────────────────────────────────────────────────

// Nom dédié, différent de 'shopify_oauth_state' (page-builder, cf.
// src/app/api/shopify/install/route.ts) : un même navigateur pourrait en
// théorie avoir les deux flows OAuth ouverts (2 onglets) — des cookies
// distincts évitent qu'ils s'écrasent l'un l'autre.
export const STORE_BUILDER_STATE_COOKIE = 'shopify_store_builder_oauth_state'

// ─── Identifiants Shopify ─────────────────────────────────────────────────

// Recommandé : un Partner app Shopify DÉDIÉ au Store Builder (client_id/
// secret différents du page-builder). Raison : si le Store Builder et le
// page-builder partagent la même app Shopify, élargir les scopes de cette
// app peut déclencher une notification de ré-autorisation à TOUS les
// marchands déjà installés (y compris ceux qui n'utilisent que le
// page-builder et ne veulent pas du Store Builder) selon la politique
// Shopify. Une app séparée isole complètement les deux surfaces.
//
// Fallback sur les identifiants page-builder si les env vars dédiées ne
// sont pas encore configurées — permet de démarrer le dev/tests sans
// bloquer sur la création d'un 2e Partner app, au prix de perdre l'isolation
// ci-dessus tant que SHOPIFY_STORE_BUILDER_API_KEY/_SECRET ne sont pas
// définies. Le founder doit créer le Partner app dédié avant tout test réel.
export function getStoreBuilderApiKey(): string {
  return process.env.SHOPIFY_STORE_BUILDER_API_KEY || process.env.SHOPIFY_API_KEY || ''
}

export function getStoreBuilderApiSecret(): string {
  return process.env.SHOPIFY_STORE_BUILDER_API_SECRET || process.env.SHOPIFY_API_SECRET || ''
}

// ─── URL d'autorisation ───────────────────────────────────────────────────

export function buildStoreBuilderOAuthUrl(shop: string, state: string, extraScopes: string[] = []): string {
  const redirectUri = `${getAppUrl()}/api/shopify/store-builder/callback`
  const scope = extraScopes.length ? `${STORE_BUILDER_SCOPES},${extraScopes.join(',')}` : STORE_BUILDER_SCOPES
  const params = new URLSearchParams({
    client_id: getStoreBuilderApiKey(),
    scope,
    redirect_uri: redirectUri,
    state,
    'grant_options[]': 'per-user',
  })
  return `https://${shop}/admin/oauth/authorize?${params}`
}
