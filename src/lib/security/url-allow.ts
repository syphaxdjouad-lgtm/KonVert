/**
 * Validation d'URLs e-commerce — anti-SSRF.
 * Utilisé par /api/scrape, /api/generate, /api/generate/public.
 */

// Whitelist exacte des hosts e-commerce supportés.
// Pas de includes() ni endsWith() — sinon "amazon.attacker.com" passerait.
const ALLOWED_HOSTS = new Set([
  // AliExpress — hosts nus seulement, les sous-domaines régionaux
  // (fr., ar., he., ko., www., etc.) passent par ALLOWED_SUFFIXES ci-dessous.
  'aliexpress.com', 'aliexpress.us',
  // Alibaba
  'alibaba.com', 'www.alibaba.com', 'french.alibaba.com',
  // Amazon (toutes régions courantes)
  'amazon.com', 'www.amazon.com',
  'amazon.fr', 'www.amazon.fr',
  'amazon.co.uk', 'www.amazon.co.uk',
  'amazon.de', 'www.amazon.de',
  'amazon.es', 'www.amazon.es',
  'amazon.it', 'www.amazon.it',
  'amazon.ca', 'www.amazon.ca',
  'amazon.com.be', 'www.amazon.com.be',
  'amazon.nl', 'www.amazon.nl',
  'amazon.pl', 'www.amazon.pl',
  // Etsy
  'etsy.com', 'www.etsy.com',
  // eBay
  'ebay.com', 'www.ebay.com',
  'ebay.fr', 'www.ebay.fr',
  'ebay.co.uk', 'www.ebay.co.uk',
  'ebay.de', 'www.ebay.de',
  'ebay.it', 'www.ebay.it',
  'ebay.es', 'www.ebay.es',
  // Cdiscount + Fnac (FR)
  'cdiscount.com', 'www.cdiscount.com',
  'fnac.com', 'www.fnac.com',
  // Temu (gros pour dropshipping 2026)
  'temu.com', 'www.temu.com',
])

// Hosts dont les sous-domaines sont autorisés (suffixes contrôlés).
// Vérification stricte par endsWith précédé d'un point pour éviter
// "myshopify.com.attacker.com".
const ALLOWED_SUFFIXES = [
  '.aliexpress.com',  // AliExpress : tous les sous-domaines régionaux (fr., ar., he., ko., www., etc.)
  '.aliexpress.us',   // AliExpress US : www.aliexpress.us, etc.
  '.myshopify.com',   // Shopify : mystore.myshopify.com
  '.shopify.com',     // Shopify : assets / pages annexes
  '.bigcartel.com',   // BigCartel
  '.tictail.com',     // Tictail (héritage)
  '.squarespace.com', // Squarespace stores
  '.bigcommerce.com', // BigCommerce
  '.wixsite.com',     // Wix stores
]

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

  const hostMatchesSuffix = ALLOWED_SUFFIXES.some(s => host.endsWith(s))
  if (!ALLOWED_HOSTS.has(host) && !hostMatchesSuffix) {
    return {
      ok: false,
      status: 403,
      error: 'Domaine non supporté. Utilise AliExpress, Amazon, Alibaba, Shopify, Etsy, eBay, Cdiscount, Fnac ou Temu.',
    }
  }

  return { ok: true, parsed }
}
