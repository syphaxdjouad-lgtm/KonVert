/**
 * Helper consent RGPD/ePrivacy.
 * Le CookieBanner stocke le choix dans localStorage et émet un CustomEvent
 * `konvert-consent-changed` pour que les providers de tracking (PostHog, Crisp)
 * puissent s'init/se désactiver dynamiquement.
 */

export const CONSENT_KEY = 'konvert-cookie-consent'
export const CONSENT_EVENT = 'konvert-consent-changed'

export type ConsentValue = 'accepted' | 'refused' | null

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(CONSENT_KEY)
  if (v === 'accepted' || v === 'refused') return v
  return null
}

export function setConsent(value: 'accepted' | 'refused') {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONSENT_KEY, value)
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

export function onConsentChange(handler: (v: ConsentValue) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => {
    const detail = (e as CustomEvent).detail as ConsentValue
    handler(detail)
  }
  window.addEventListener(CONSENT_EVENT, listener)
  return () => window.removeEventListener(CONSENT_EVENT, listener)
}
