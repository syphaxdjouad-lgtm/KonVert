// Blocklist SSRF complète — couvre IPv4 + IPv6 + DNS particuliers.
// À utiliser sur tout fetch vers une URL fournie par l'utilisateur
// (WooCommerce connect, futurs webhooks, custom auth URLs, etc.).
//
// Audit Madara 2026-05-10 P1-01 : l'ancienne blocklist WC ratait :
// - IPv6 `::1` sans crochets
// - `fe80::/10` link-local IPv6
// - IPv4-mapped IPv6 (`::ffff:127.0.0.1`)
// - CGNAT `100.64.0.0/10`
// - mDNS `*.local`

const PRIVATE_IPV4 = [
  /^0\./,                                         // unspecified
  /^10\./,                                        // class A privé
  /^127\./,                                       // loopback
  /^169\.254\./,                                  // link-local
  /^172\.(1[6-9]|2[0-9]|3[01])\./,                // class B privé
  /^192\.168\./,                                  // class C privé
  /^192\.0\.0\./,                                 // IETF assignments
  /^192\.0\.2\./,                                 // TEST-NET-1
  /^198\.18\./, /^198\.19\./,                     // benchmark
  /^198\.51\.100\./,                              // TEST-NET-2
  /^203\.0\.113\./,                               // TEST-NET-3
  /^224\./, /^225\./, /^226\./, /^227\./,         // multicast (224.0.0.0/4)
  /^228\./, /^229\./, /^230\./, /^231\./,
  /^232\./, /^233\./, /^234\./, /^235\./,
  /^236\./, /^237\./, /^238\./, /^239\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./,  // CGNAT 100.64.0.0/10
]

// Normalise et détecte les loopbacks/private IPv6 + IPv4-mapped IPv6.
function isPrivateIpv6(addr: string): boolean {
  const lower = addr.toLowerCase()
  // IPv4-mapped IPv6 → on extrait la partie IPv4 et on re-checke
  const mappedMatch = lower.match(/^(?:::ffff:|::)((?:\d{1,3}\.){3}\d{1,3})$/)
  if (mappedMatch) return isPrivateIpv4(mappedMatch[1])

  if (lower === '::' || lower === '::1') return true
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true   // fc00::/7 unique local
  if (lower.startsWith('fe80:') || lower === 'fe80::') return true    // link-local
  if (lower.startsWith('ff')) return true                              // multicast (ff00::/8)
  if (/^64:ff9b::/.test(lower)) return true                            // NAT64
  if (/^2001:db8:/.test(lower)) return true                            // documentation
  return false
}

function isPrivateIpv4(addr: string): boolean {
  return PRIVATE_IPV4.some((re) => re.test(addr))
}

// Détecte si le hostname est une référence à une ressource interne.
// Strip les éventuels crochets IPv6 (`[::1]` → `::1`) avant test.
export function isPrivateHost(hostnameRaw: string): boolean {
  if (!hostnameRaw) return true
  const hostname = hostnameRaw.trim().toLowerCase().replace(/^\[|\]$/g, '')

  // Noms réservés
  if (hostname === 'localhost') return true
  if (hostname.endsWith('.localhost')) return true
  if (hostname.endsWith('.local')) return true       // mDNS bonjour
  if (hostname.endsWith('.internal')) return true
  if (hostname.endsWith('.lan')) return true
  if (hostname === 'metadata.google.internal') return true
  if (hostname === '169.254.169.254') return true    // AWS/GCP metadata

  // IPv4 littéral
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return isPrivateIpv4(hostname)
  }

  // IPv6 littéral
  if (hostname.includes(':')) {
    return isPrivateIpv6(hostname)
  }

  return false
}
