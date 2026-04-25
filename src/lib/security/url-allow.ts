/**
 * Validation d'URLs e-commerce — anti-SSRF.
 * Utilisé par /api/scrape, /api/generate, /api/generate/public.
 */

// Whitelist exacte des hosts e-commerce supportés.
// Pas de includes() ni endsWith() — sinon "amazon.attacker.com" passerait.
const ALLOWED_HOSTS = new Set([
  'aliexpress.com', 'fr.aliexpress.com', 'www.aliexpress.com',
  'alibaba.com', 'www.alibaba.com',
  'amazon.com', 'www.amazon.com',
  'amazon.fr', 'www.amazon.fr',
  'amazon.co.uk', 'www.amazon.co.uk',
  'amazon.de', 'www.amazon.de',
  'amazon.es', 'www.amazon.es',
  'amazon.it', 'www.amazon.it',
  'amazon.ca', 'www.amazon.ca',
])

// IPs privées, métadonnées cloud (AWS/GCP), loopback, link-local.
const BLOCKED_PATTERNS = [
  /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^192\.168\./,
  /^169\.254\./, /^::1$/, /^\[::1\]$/, /^0\.0\.0\.0/,
  /^fc00:/, /^fe80:/, /^\[fc00/i, /^\[fe80/i,
  /localhost/i, /metadata/i, /169\.254\.169\.254/,
]

export type UrlValidationResult =
  | { ok: true; parsed: URL }
  | { ok: false; status: 400 | 403; error: string }

export function validateScrapeUrl(input: unknown): UrlValidationResult {
  if (!input || typeof input !== 'string') {
    return { ok: false, status: 400, error: 'URL manquante' }
  }

  let parsed: URL
  try {
    parsed = new URL(input)
  } catch {
    return { ok: false, status: 400, error: 'URL invalide' }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { ok: false, status: 400, error: 'Protocol non autorisé' }
  }

  const host = parsed.hostname
  if (BLOCKED_PATTERNS.some(p => p.test(host))) {
    return { ok: false, status: 403, error: 'URL non autorisée' }
  }

  if (!ALLOWED_HOSTS.has(host)) {
    return { ok: false, status: 403, error: 'Domaine non supporté. Utilisez AliExpress, Amazon ou Alibaba.' }
  }

  return { ok: true, parsed }
}
