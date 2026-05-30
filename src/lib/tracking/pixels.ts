// Helpers d'événements pixels client-side. Tous les calls sont des no-op
// silencieux si la lib pixel n'est pas chargée (env var manquante OU consent
// pas accordé). Cela évite que le code appelant ait à vérifier
// `typeof fbq === 'function'` à chaque event.
//
// Defense in depth : les wrappers publics `pixels.*` vérifient aussi le
// consent localStorage avant de fire — même si window.fbq existe pour une
// raison X (race condition, dev mistake), aucun event ne part sans consent.

import { getConsent } from '@/lib/consent'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void; identify: (data: Record<string, unknown>) => void; page: () => void }
  }
}

// ─── Meta Pixel ────────────────────────────────────────────────────────
export const fbqEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}

// ─── Google Tag (Ads + GA4) ────────────────────────────────────────────
export const gtagEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}

// Conversion Google Ads — params : send_to + value + currency + transaction_id
export const gtagConversion = (params: { send_to: string; value?: number; currency?: string; transaction_id?: string }) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'conversion', params)
}

// ─── TikTok Pixel ──────────────────────────────────────────────────────
export const ttqEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.ttq) return
  window.ttq.track(event, params)
}

// ─── Helpers funnel high-level — appelle les 3 pixels en un seul call ──
// Ces wrappers permettent d'aligner les events critiques (signup, checkout,
// purchase) sur les 3 réseaux d'un coup, sans dupliquer la liste de calls.
//
// Chaque wrapper guard `getConsent() === 'accepted'` avant de fire — defense
// in depth RGPD au-dessus du gating au niveau du Script <Pixel>.

const consentGranted = () => typeof window !== 'undefined' && getConsent() === 'accepted'

export const pixels = {
  // ViewContent — page vue (déjà couvert par auto-tracking pixel + PostHog $pageview)
  viewContent: (params?: { content_name?: string }) => {
    if (!consentGranted()) return
    fbqEvent('ViewContent', params)
    ttqEvent('ViewContent', params)
  },

  // Lead — capture email essai (avant génération réelle)
  lead: (params?: { content_name?: string; value?: number }) => {
    if (!consentGranted()) return
    fbqEvent('Lead', params)
    gtagEvent('generate_lead', params)
    ttqEvent('SubmitForm', params)
  },

  // CompleteRegistration — signup confirmé
  completeRegistration: (params?: { method?: string; value?: number }) => {
    if (!consentGranted()) return
    fbqEvent('CompleteRegistration', params)
    gtagEvent('sign_up', params)
    ttqEvent('CompleteRegistration', params)
  },

  // InitiateCheckout — clic plan + redirect Stripe
  initiateCheckout: (params: { plan: string; value: number; currency?: string }) => {
    if (!consentGranted()) return
    const p = { ...params, currency: params.currency ?? 'EUR' }
    fbqEvent('InitiateCheckout', { content_name: params.plan, value: params.value, currency: p.currency })
    gtagEvent('begin_checkout', { items: [{ item_name: params.plan, price: params.value }], currency: p.currency, value: params.value })
    ttqEvent('InitiateCheckout', p)
  },

  // Purchase — webhook Stripe confirmé (côté CLIENT seulement, fallback. Le call SERVER via CAPI est plus fiable)
  purchase: (params: { plan: string; value: number; currency?: string; transaction_id?: string }) => {
    if (!consentGranted()) return
    const p = { ...params, currency: params.currency ?? 'EUR' }
    fbqEvent('Purchase', p)
    gtagEvent('purchase', { transaction_id: params.transaction_id, value: params.value, currency: p.currency, items: [{ item_name: params.plan, price: params.value }] })
    ttqEvent('Purchase', p)
  },
}
