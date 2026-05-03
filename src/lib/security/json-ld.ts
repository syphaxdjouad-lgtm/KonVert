/**
 * Sérialise un objet JSON-LD en string sûre pour injection dans
 * <script type="application/ld+json">.
 *
 * Pourquoi : `JSON.stringify()` standard n'échappe PAS la séquence `</script>`,
 * ce qui ouvre une faille XSS si une donnée du JSON-LD contient cette chaîne.
 * Exemple : { name: '</script><script>alert(1)</script>' } → casse le bloc.
 *
 * On échappe également `<!--` et `-->` (commentaires HTML) et le séparateur
 * Unicode U+2028/U+2029 par sécurité.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
