/**
 * Tests unitaires — /api/email/unsubscribe
 *
 * On mocke supabaseAdmin et rateLimitAsync pour tester la logique de sécurité
 * (HMAC token + rate-limit) sans dépendance réseau.
 *
 * Couverture cible :
 *   - POST 401 sans token
 *   - POST 401 token invalide
 *   - POST 200 token valide
 *   - POST 429 après 5 requêtes / IP
 *   - GET 401 sans token
 *   - GET 401 token invalide
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Setup env avant tout import ─────────────────────────────────────────────

const TEST_ENCRYPTION_KEY = 'test-secret-key-for-unsubscribe-route-tests-32c'

vi.stubEnv('ENCRYPTION_KEY', TEST_ENCRYPTION_KEY)
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://konvertpilot.com')

// ── Mock supabaseAdmin (évite toute connexion Supabase en test) ─────────────

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: {
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  },
}))

// ── Mock rateLimitAsync — expose un compteur pour simuler le dépassement ────

let rateLimitCallCount = 0
let rateLimitShouldBlock = false

vi.mock('@/lib/security/ratelimit', () => ({
  rateLimitAsync: vi.fn(async (_key: string, _limit: number, _windowMs: number) => {
    rateLimitCallCount++
    if (rateLimitShouldBlock) {
      return { allowed: false, remaining: 0, retryAfterMs: 30_000 }
    }
    return { allowed: true, remaining: 4, retryAfterMs: 0 }
  }),
}))

// ── Import du handler APRES les mocks ──────────────────────────────────────

import { POST, GET } from './route'
import { generateUnsubscribeToken } from '@/lib/email/unsubscribe-token'

// ── Helpers ─────────────────────────────────────────────────────────────────

function makePostRequest(body: Record<string, unknown>, ip = '1.2.3.4'): NextRequest {
  return new NextRequest('http://localhost/api/email/unsubscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  })
}

function makeGetRequest(params: Record<string, string>, ip = '1.2.3.4'): NextRequest {
  const url = new URL('http://localhost/api/email/unsubscribe')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new NextRequest(url.toString(), {
    method: 'GET',
    headers: { 'x-forwarded-for': ip },
  })
}

// ── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  rateLimitCallCount = 0
  rateLimitShouldBlock = false
})

describe('POST /api/email/unsubscribe', () => {
  it('retourne 400 quand email et token sont absents', async () => {
    const req = makePostRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retourne 400 quand token est absent', async () => {
    const req = makePostRequest({ email: 'user@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retourne 403 pour un token invalide', async () => {
    const req = makePostRequest({ email: 'user@example.com', token: 'faux-token-bidon' })
    const res = await POST(req)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/invalide/i)
  })

  it('retourne 200 pour un token HMAC valide', async () => {
    const email = 'valid@example.com'
    const token = generateUnsubscribeToken(email)
    const req = makePostRequest({ email, token })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.unsubscribed).toBe(true)
  })

  it('retourne 200 meme avec email en majuscules (normalisation)', async () => {
    const email = 'Valid@Example.com'
    // Le token est genere sur la forme normalisee, verify accepte les deux
    const token = generateUnsubscribeToken(email)
    const req = makePostRequest({ email, token })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('retourne 429 quand le rate limit est depassé', async () => {
    rateLimitShouldBlock = true
    const email = 'user@example.com'
    const token = generateUnsubscribeToken(email)
    const req = makePostRequest({ email, token }, '9.9.9.9')
    const res = await POST(req)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBeTruthy()
  })
})

describe('GET /api/email/unsubscribe', () => {
  it('retourne 400 quand email et token sont absents', async () => {
    const req = makeGetRequest({})
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('retourne 403 pour un token invalide', async () => {
    const req = makeGetRequest({ email: 'user@example.com', token: 'faux-token' })
    const res = await GET(req)
    expect(res.status).toBe(403)
  })

  it('redirect 303 vers /unsubscribe?ok=1 pour token valide', async () => {
    const email = 'redirect@example.com'
    const token = generateUnsubscribeToken(email)
    const req = makeGetRequest({ email, token })
    const res = await GET(req)
    // NextResponse.redirect retourne 303 en test
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toContain('unsubscribe?ok=1')
  })

  it('retourne 429 quand le rate limit est depassé sur GET', async () => {
    rateLimitShouldBlock = true
    const req = makeGetRequest({ email: 'x@x.com', token: 'any' }, '8.8.8.8')
    const res = await GET(req)
    expect(res.status).toBe(429)
  })
})
