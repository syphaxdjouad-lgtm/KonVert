// Store Builder for Shopify — A/B test natif (Sprint 8).
//
// Types + constantes partagés par tout le module `ab-testing/` et par les
// routes API qui le consomment. Cf. spec KAKASHI §Partie A
// (docs/store-builder-sprint8-spec.md) pour le détail des décisions
// (swap client-side, attribution via cart.attributes, garde-fous stats).

export type AbField = 'h1_title' | 'description'
export type AbVariant = 'a' | 'b'
export type AbEventType = 'page_view' | 'add_to_cart' | 'purchase'
export type AbTestStatus = 'running' | 'promoted' | 'stopped' | 'inconclusive'

/** Nom du cookie first-party posé par le snippet thème — cf. spec A.2.1. */
export const AB_COOKIE_NAME = '_kv_ab'
export const AB_COOKIE_MAX_AGE_DAYS = 365

/** Garde-fous obligatoires avant de déclarer un gagnant — cf. spec A.4. */
export const AB_MIN_VISITORS_PER_VARIANT = 100
export const AB_MIN_DAYS_ELAPSED = 7
export const AB_MIN_PURCHASES_PER_VARIANT = 10
export const AB_MAX_DURATION_DAYS = 30
export const AB_SIGNIFICANCE_ALPHA = 0.05

/** Noms des champs cachés injectés dans le formulaire panier — cf. spec A.2.5. */
export const AB_CART_ATTR_TEST_ID = 'konvert_ab_test_id'
export const AB_CART_ATTR_VARIANT = 'konvert_ab_variant'
export const AB_CART_ATTR_VISITOR_ID = 'konvert_ab_visitor_id'
