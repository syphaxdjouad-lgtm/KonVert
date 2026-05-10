// UTM capture & retrieval — first-party cookie 90 jours.
// Persisté côté middleware au premier hit avec utm_*, lu côté signup
// pour stocker dans user_metadata Supabase et envoyer aux pixels.

export const UTM_COOKIE = '_konvert_utm'
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ttclid'] as const

export type UtmData = Partial<Record<typeof UTM_KEYS[number], string>> & {
  ts?: number  // timestamp first-touch en ms
  landing?: string  // pathname de la 1re page atterrie
  referrer?: string  // document.referrer si dispo
}

// Sérialisation : on stocke en JSON encodé URI (cookie sûr) plutôt qu'en
// querystring qui se casse sur les caractères spéciaux des campagnes.
export function encodeUtm(data: UtmData): string {
  return encodeURIComponent(JSON.stringify(data))
}

export function decodeUtm(raw: string | undefined | null): UtmData | null {
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as UtmData
  } catch {
    return null
  }
}

// Côté client uniquement — lecture du cookie pour l'attacher au signup ou
// à un event PostHog. Retourne null si cookie absent ou invalide.
export function readUtmCookie(): UtmData | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${UTM_COOKIE}=([^;]+)`))
  return match ? decodeUtm(match[1]) : null
}
