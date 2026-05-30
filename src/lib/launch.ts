/**
 * Source unique de vérité pour la date de launch KONVERT.
 * Surchargeable via env var NEXT_PUBLIC_LAUNCH_DATE (ISO 8601 UTC).
 *
 * Fallback : 2026-06-02 09:00 Paris (CEST = UTC+2) = 07:00 UTC.
 * Date officielle Product Hunt + multi-canal après report du 20 mai.
 */

// 2026-06-02 05:01 UTC = 00:01 PST = sweet spot algorithmique Product Hunt
// (launches démarrant à minuit PST captent la fenêtre complète 24h).
const LAUNCH_DATE_FALLBACK = '2026-06-02T05:01:00Z'

export const LAUNCH_DATE_ISO: string = (() => {
  const raw = process.env.NEXT_PUBLIC_LAUNCH_DATE?.trim()
  if (!raw) return LAUNCH_DATE_FALLBACK
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? LAUNCH_DATE_FALLBACK : raw
})()

export function getLaunchDate(): Date {
  return new Date(LAUNCH_DATE_ISO)
}
