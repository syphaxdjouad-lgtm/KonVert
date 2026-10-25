// Store Builder for Shopify — assignment déterministe visiteur ↔ variante.
//
// Pur, sans réseau ni DOM : implémenté séparément côté serveur (tests,
// endpoints) ET dupliqué en JS vanilla dans le snippet thème embarqué
// (cf. theme-snippet.ts — un thème Shopify ne peut pas importer un module
// TS/npm). Les deux implémentations DOIVENT rester identiques bit-à-bit
// pour que l'assignment reste cohérent client/serveur — cf. test de
// non-régression dans theme-snippet.test.ts qui exécute le script généré.

/**
 * FNV-1a 32-bit — hash rapide, déterministe, aucune dépendance externe.
 * cf. http://www.isthe.com/chongo/tech/comp/fnv/
 */
export function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5 // FNV offset basis (32-bit)
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    // Multiplication par le FNV prime 32-bit (0x01000193) décomposée en
    // additions de décalages pour rester dans l'espace int32 sans BigInt
    // (identique en sémantique, portable dans un moteur JS de thème Shopify).
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0
  }
  return hash >>> 0
}

/**
 * Bucket 0-99 déterministe pour un (visitorId, abTestId) donné — sticky tant
 * que le cookie visiteur ne change pas, sans stockage serveur de l'assignment.
 */
export function computeBucket(visitorId: string, abTestId: string): number {
  return fnv1aHash(`${visitorId}:${abTestId}`) % 100
}

/** Split 50/50 — cf. spec A.2.3. */
export function assignVariant(visitorId: string, abTestId: string): 'a' | 'b' {
  return computeBucket(visitorId, abTestId) < 50 ? 'a' : 'b'
}
