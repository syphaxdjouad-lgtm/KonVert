import type { ErrorEvent, EventHint } from '@sentry/nextjs'

// Masque les patterns sensibles connus dans les chaînes envoyées à Sentry.
// Volontairement large : on préfère perdre du contexte qu'envoyer du PII.
const SCRUBBERS: Array<[RegExp, string]> = [
  [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, '[email]'],
  [/sk_(live|test)_[A-Za-z0-9]+/g, '[stripe-secret]'],
  [/pk_(live|test)_[A-Za-z0-9]+/g, '[stripe-public]'],
  [/whsec_[A-Za-z0-9]+/g, '[stripe-webhook-secret]'],
  [/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[jwt]'],
  [/sbp_[A-Za-z0-9]+/g, '[supabase-pat]'],
  [/AIza[A-Za-z0-9_-]{35}/g, '[google-api-key]'],
  [/fc-[A-Za-z0-9]+/g, '[firecrawl-key]'],
  [/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [redacted]'],
]

const SENSITIVE_KEYS = new Set([
  'authorization', 'cookie', 'set-cookie', 'x-admin-secret', 'x-internal-secret',
  'password', 'token', 'access_token', 'refresh_token', 'api_key', 'apiKey',
  'stripe_signature', 'session_id',
])

export function scrubString(s: string): string {
  let out = s
  for (const [pattern, replacement] of SCRUBBERS) {
    out = out.replace(pattern, replacement)
  }
  return out
}

export function scrubValue(v: unknown, depth = 0): unknown {
  if (depth > 8) return v
  if (typeof v === 'string') return scrubString(v)
  if (Array.isArray(v)) return v.map((item) => scrubValue(item, depth + 1))
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(k.toLowerCase())) {
        out[k] = '[redacted]'
      } else {
        out[k] = scrubValue(val, depth + 1)
      }
    }
    return out
  }
  return v
}

// Hook beforeSend Sentry : on traverse les champs susceptibles de contenir du PII
// (message, breadcrumbs, request, extra, tags, contexts) et on masque.
export function scrubEvent(event: ErrorEvent, _hint?: EventHint): ErrorEvent {
  if (event.message) event.message = scrubString(event.message)

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((b) => ({
      ...b,
      message: b.message ? scrubString(b.message) : b.message,
      data: b.data ? (scrubValue(b.data) as Record<string, unknown>) : b.data,
    }))
  }

  if (event.request) {
    event.request = scrubValue(event.request) as typeof event.request
  }

  if (event.extra) {
    event.extra = scrubValue(event.extra) as typeof event.extra
  }

  if (event.tags) {
    event.tags = scrubValue(event.tags) as typeof event.tags
  }

  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as typeof event.contexts
  }

  if (event.exception?.values) {
    event.exception.values = event.exception.values.map((ex) => ({
      ...ex,
      value: ex.value ? scrubString(ex.value) : ex.value,
    }))
  }

  return event
}
