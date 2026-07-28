// Dérive les initiales d'un avis client depuis `author`, server-side.
//
// Pourquoi : on ne fait plus confiance à `reviews[].initials` renvoyé par
// DeepSeek. Repro locale 2026-07-28 (harness jetable, langue arabe) : le
// schema imposait `.max(3)`, calibré pour un format latin ("ML", "TD"), mais
// le LLM produit naturellement des initiales arabes avec points abréviatifs
// (ex: "س.م." = 4 caractères) → NoObjectGeneratedError intermittent en prod
// (2/10 runs AR, 0/5 FR). On dérive nous-mêmes, indépendamment de la langue.
//
// Unicode-safe : Array.from() découpe par code point, jamais par unité
// UTF-16 brute (contrairement à `str[0]` ou `str.slice(0, n)`), donc reste
// correct sur tout alphabet (arabe, CJK, caractères astraux).
export function deriveInitials(author: string): string {
  const trimmed = author.trim()
  if (!trimmed) return '—'

  const words = trimmed.split(/\s+/).filter(Boolean)

  const chars = words.length >= 2
    ? words.slice(0, 2)
        .map((w) => Array.from(w)[0])
        .filter((c): c is string => Boolean(c))
    : Array.from(words[0] ?? '').slice(0, 1)

  const joined = chars.join('').toUpperCase()
  if (!joined) return '—'

  // Cap défensif : toUpperCase() peut exceptionnellement étendre un
  // caractère (ex: 'ß' → 'SS'), donc on borne APRÈS transformation, toujours
  // en découpant par code point.
  return Array.from(joined).slice(0, 4).join('')
}
