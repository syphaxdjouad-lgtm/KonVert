// CAPI (Conversions API) — envoi server-side d'events vers Meta + TikTok.
// Plus fiable que les pixels client-side (pas bloqué par adblockers, pas
// dépendant du consent côté navigateur — mais on respecte quand même le
// consent en n'envoyant que pour les users qui l'ont accepté).
//
// Google Ads enhanced conversions sont gérés différemment (via le tag
// client + import GBQ) — pas de CAPI symétrique, donc pas couvert ici.

import crypto from 'crypto'
import * as Sentry from '@sentry/nextjs'

// ─── Hash SHA-256 lower-cased trimmed (format requis par Meta + TikTok) ──
function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

export type CapiUserData = {
  email?: string
  phone?: string  // E.164 sans +
  externalId?: string  // user_id Supabase
  ip?: string  // IP client
  userAgent?: string  // user agent client
  fbp?: string  // _fbp cookie (Meta browser pixel)
  fbc?: string  // _fbc cookie (Meta click ID)
  ttp?: string  // _ttp cookie TikTok
}

export type CapiEvent = {
  eventName: 'Purchase' | 'CompleteRegistration' | 'Lead' | 'InitiateCheckout' | 'ViewContent'
  eventId?: string  // pour dedup avec pixel client (même event envoyé 2× = compté 1)
  eventSourceUrl?: string  // URL de la page où l'event a eu lieu
  userData: CapiUserData
  customData?: {
    value?: number
    currency?: string
    contentName?: string
    contentIds?: string[]
    contentType?: 'product' | 'product_group'
  }
}

// ─── Meta Conversions API ─────────────────────────────────────────────
async function sendMetaCapi(event: CapiEvent): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !accessToken) return  // no-op silencieux si pas configuré

  const userDataPayload: Record<string, unknown> = {
    em: hash(event.userData.email),
    ph: hash(event.userData.phone),
    external_id: hash(event.userData.externalId),
    client_ip_address: event.userData.ip,
    client_user_agent: event.userData.userAgent,
    fbp: event.userData.fbp,
    fbc: event.userData.fbc,
  }
  // Meta refuse les clés undefined — on les retire
  Object.keys(userDataPayload).forEach((k) => userDataPayload[k] === undefined && delete userDataPayload[k])

  const customDataPayload: Record<string, unknown> = {
    value: event.customData?.value,
    currency: event.customData?.currency,
    content_name: event.customData?.contentName,
    content_ids: event.customData?.contentIds,
    content_type: event.customData?.contentType,
  }
  Object.keys(customDataPayload).forEach((k) => customDataPayload[k] === undefined && delete customDataPayload[k])

  const body = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: 'website',
        user_data: userDataPayload,
        custom_data: customDataPayload,
      },
    ],
    // Test event code optionnel : permet de filtrer les events en dev dans
    // l'UI Meta sans polluer les vraies stats. Set via env META_TEST_EVENT_CODE.
    ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      Sentry.captureMessage('[capi/meta] HTTP error', {
        level: 'warning',
        extra: { status: res.status, body: text.slice(0, 500), event_name: event.eventName },
      })
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { capi: 'meta', event: event.eventName } })
  }
}

// ─── TikTok Events API ─────────────────────────────────────────────────
async function sendTikTokCapi(event: CapiEvent): Promise<void> {
  const pixelCode = process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
  const accessToken = process.env.TIKTOK_CAPI_ACCESS_TOKEN
  if (!pixelCode || !accessToken) return

  const body = {
    event_source: 'web',
    event_source_id: pixelCode,
    data: [
      {
        event: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        user: {
          email: hash(event.userData.email),
          phone: hash(event.userData.phone),
          external_id: hash(event.userData.externalId),
          ttp: event.userData.ttp,
          ip: event.userData.ip,
          user_agent: event.userData.userAgent,
        },
        properties: {
          value: event.customData?.value,
          currency: event.customData?.currency,
          content_name: event.customData?.contentName,
          content_id: event.customData?.contentIds?.[0],
          content_type: event.customData?.contentType,
        },
        page: {
          url: event.eventSourceUrl,
        },
      },
    ],
  }

  try {
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      Sentry.captureMessage('[capi/tiktok] HTTP error', {
        level: 'warning',
        extra: { status: res.status, body: text.slice(0, 500), event_name: event.eventName },
      })
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { capi: 'tiktok', event: event.eventName } })
  }
}

// ─── API publique unifiée ──────────────────────────────────────────────
// Envoie l'event aux 2 réseaux configurés en parallèle. Les erreurs sont
// catchées individuellement par chaque sender — un échec Meta ne bloque pas
// TikTok et vice-versa. Tout va à Sentry pour observabilité.
export async function sendConversion(event: CapiEvent): Promise<void> {
  await Promise.all([sendMetaCapi(event), sendTikTokCapi(event)])
}
