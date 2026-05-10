// Defense-in-depth contre le XSS stocké : les templates de landing page font
// du string-concat HTML pur (cf src/lib/templates/etec-blue.ts) et n'escapent
// pas les valeurs dynamiques. On neutralise donc les caractères dangereux à la
// source — au moment où la donnée entre (productInput utilisateur) et au
// moment où elle sort de DeepSeek (landingPageData) avant stockage en DB.

const HTML_ESCAPE_MAP: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

// Escape uniquement les chars qui permettent de breakout d'un attribut HTML
// ou d'ouvrir une balise. Volontairement NE PAS escape `&` pour éviter le
// double-encoding visible dans les titres légitimes ("Marshall & sons").
export function escapeHtmlText(input: unknown): string {
  if (input === null || input === undefined) return ''
  const str = String(input)
  return str.replace(/[<>"']/g, (c) => HTML_ESCAPE_MAP[c] ?? c)
}

// Valide qu'une URL d'image est exploitable dans un attribut `src=`.
// Refuse javascript:, data:, file:, et tout ce qui n'est pas http(s).
// Refuse aussi les caractères qui briseraient l'attribut HTML (`"`, `>`, espaces non-encodés).
export function safeImageUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/[\s"'<>`]/.test(trimmed)) return null
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
  return parsed.toString()
}

// Sanitize récursif d'un objet JSON arbitraire. Applique escapeHtmlText à
// toutes les strings, traverse arrays + objects. Utilisé sur landingPageData
// (sortie DeepSeek) avant stockage en DB pour neutraliser une éventuelle
// prompt injection qui aurait fait recopier du HTML dans headline/benefits/etc.
//
// Limite la profondeur pour éviter un stack overflow sur structures circulaires
// (théorique — JSON ne supporte pas, mais on est défensif).
export function sanitizeDeep<T>(value: T, depth = 0): T {
  if (depth > 32) return value
  if (typeof value === 'string') {
    return escapeHtmlText(value) as unknown as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeep(item, depth + 1)) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeDeep(v, depth + 1)
    }
    return out as unknown as T
  }
  return value
}
