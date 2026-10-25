// Store Builder for Shopify — Re-audit CRO : intégration Google PageSpeed
// Insights (critères #17/#18). Cf. spec KAKASHI §B.1 Groupe 3.
//
// Nouvel env var requise : GOOGLE_PSI_API_KEY — à ajouter aux env vars
// Vercel (tâche manuelle founder). Sans cette clé, `fetchPageSpeedMobile`
// renvoie `null` et les critères #17/#18 sont marqués `measurable: false`
// (jamais de crash de l'audit, jamais de fausse mesure inventée).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — jamais appelé contre
// l'API PageSpeed réelle (Sprint 8, 2026-07-27).

const PAGESPEED_TIMEOUT_MS = 25_000

export interface PageSpeedResult {
  /** 0-1 (score Lighthouse brut, pas encore converti en %). */
  performanceScore: number
  lcpMs: number
}

export async function fetchPageSpeedMobile(url: string): Promise<PageSpeedResult | null> {
  const apiKey = process.env.GOOGLE_PSI_API_KEY
  if (!apiKey) return null

  try {
    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
    endpoint.searchParams.set('url', url)
    endpoint.searchParams.set('strategy', 'mobile')
    endpoint.searchParams.set('category', 'performance')
    endpoint.searchParams.set('key', apiKey)

    const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(PAGESPEED_TIMEOUT_MS) })
    if (!res.ok) return null

    const data = (await res.json()) as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number } }
        audits?: { 'largest-contentful-paint'?: { numericValue?: number } }
      }
    }

    const performanceScore = data.lighthouseResult?.categories?.performance?.score
    const lcpMs = data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue

    if (typeof performanceScore !== 'number' || typeof lcpMs !== 'number') return null
    return { performanceScore, lcpMs }
  } catch {
    // Timeout, réseau, JSON invalide — jamais de crash de l'audit pour un
    // critère secondaire (poids 5+2/100). Marqué non-mesurable en amont.
    return null
  }
}
