// Store Builder for Shopify — validation des scopes OAuth.
//
// Pur, sans réseau ni DB : permet de détecter côté app qu'une connexion n'a
// pas les scopes nécessaires (donc échouerait à coup sûr en FORBIDDEN_SCOPE
// côté API Shopify) sans attendre un aller-retour HTTP.

// Scopes minimaux confirmés par la doc publique Shopify pour le flow
// "upload thème → créer produit → activer thème" :
// - write_themes    : créer/uploader/activer un thème
// - write_products  : créer un produit + variantes + images
// - read_products   : lire l'état après création (vérifs, futurs diffs)
//
// ⚠️ QUESTION OUVERTE (non tranchée, pas de dev store pour valider) :
// `write_publications` pourrait être nécessaire en plus de `write_themes`
// pour que `PUT /themes/{id}.json` avec `role: "main"` soit accepté sur
// certains plans/stores — cf. commentaire détaillé dans activate-theme.ts.
// Comme ce fichier est isolé du scope OAuth du page-builder (aucun partage),
// l'ajouter ici le jour où le spike confirme le besoin n'a AUCUN risque de
// régression sur le page-builder — seulement d'imposer une nouvelle
// reconnexion aux boutiques déjà connectées au Store Builder.
export const STORE_BUILDER_REQUIRED_SCOPES = ['write_themes', 'write_products', 'read_products'] as const

export function parseScopes(scopesCsv: string | null | undefined): Set<string> {
  if (!scopesCsv) return new Set()
  return new Set(
    scopesCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )
}

/**
 * True si `grantedScopes` (valeur stockée en DB, telle que renvoyée par
 * Shopify au moment de l'échange OAuth) couvre tous les scopes requis par le
 * Store Builder. Ne fait aucun appel réseau — pure fonction de comparaison
 * d'ensembles.
 */
export function hasRequiredStoreBuilderScopes(grantedScopes: string | null | undefined): boolean {
  const granted = parseScopes(grantedScopes)
  return STORE_BUILDER_REQUIRED_SCOPES.every((scope) => granted.has(scope))
}

/** Scopes requis manquants — utile pour un message d'erreur actionnable. */
export function missingStoreBuilderScopes(grantedScopes: string | null | undefined): string[] {
  const granted = parseScopes(grantedScopes)
  return STORE_BUILDER_REQUIRED_SCOPES.filter((scope) => !granted.has(scope))
}

// ─── Scope élargi — A/B test natif (Sprint 8) ──────────────────────────────
//
// `read_orders` n'est PAS demandé au connect initial (cf. spec KAKASHI §A.3
// "Scope OAuth requis en plus") — seulement au moment où le marchand crée
// son 1er test A/B, pour ne pas alourdir l'onboarding Store Builder des
// marchands qui n'utilisent jamais l'A/B testing. Une connexion existante
// sans ce scope doit se reconnecter via /api/shopify/store-builder/connect
// (le flow OAuth redemande alors STORE_BUILDER_SCOPES + AB_TEST_SCOPE, cf.
// oauth.ts) avant de pouvoir créer un test.
export const AB_TEST_REQUIRED_SCOPE = 'read_orders'

export function hasReadOrdersScope(grantedScopes: string | null | undefined): boolean {
  return parseScopes(grantedScopes).has(AB_TEST_REQUIRED_SCOPE)
}
