/**
 * Gating Store Builder sur les routes API — flag OFF ⇒ 404, plan non éligible
 * ⇒ 403, quota Pro (1 store) au connect, cron no-op flag OFF.
 *
 * Seul le client Supabase serveur est mocké (session + plan + connexions) :
 * les handlers et le helper d'accès tournent tels quels.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const state: {
  user: { id: string; email: string } | null
  plan: string | null
  connectedShops: string[]
  getUserCalls: number
} = { user: null, plan: null, connectedShops: [], getUserCalls: 0 }

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => {
        state.getUserCalls++
        return { data: { user: state.user } }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => {
          if (table === 'shopify_store_connections') {
            return Promise.resolve({ data: state.connectedShops.map((shop_domain) => ({ shop_domain })), error: null })
          }
          return { maybeSingle: async () => ({ data: state.plan ? { plan: state.plan } : null }) }
        },
      }),
    }),
  }),
}))

// Les routes publiques importent supabaseAdmin au top-level : on s'assure
// qu'il n'est jamais touché quand le flag est OFF.
vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: {
    from: () => {
      throw new Error('supabaseAdmin ne doit pas être appelé flag OFF')
    },
  },
}))

const { GET: connectGET } = await import('@/app/api/shopify/store-builder/connect/route')
const { POST: generatePOST } = await import('@/app/api/shopify/store-builder/generate/route')
const { GET: activeGET } = await import('@/app/api/shopify/ab-tests/active/route')
const { POST: eventsPOST } = await import('@/app/api/shopify/events/route')
const { POST: ordersPaidPOST } = await import('@/app/api/shopify/webhooks/orders-paid/route')
const { GET: auditCronGET } = await import('@/app/api/cron/store-builder-audit/route')

const BASE = 'https://konvertpilot.com'

beforeEach(() => {
  state.user = { id: 'u1', email: 'user@x.io' }
  state.plan = 'pro'
  state.connectedShops = []
  state.getUserCalls = 0
  vi.stubEnv('STORE_BUILDER_ADMIN_EMAILS', 'founder@example.com')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('flag OFF', () => {
  beforeEach(() => {
    vi.stubEnv('STORE_BUILDER_ENABLED', 'false')
  })

  it('route user (connect) → 404 JSON même pour un Pro', async () => {
    const res = await connectGET(new NextRequest(`${BASE}/api/shopify/store-builder/connect?shop=a.myshopify.com`))
    expect(res.status).toBe(404)
    expect(await res.json()).toMatchObject({ ok: false, error: { code: 'NOT_FOUND' } })
  })

  it('route user (generate) → 404 sans session non plus', async () => {
    state.user = null
    const res = await generatePOST(new NextRequest(`${BASE}/api/shopify/store-builder/generate`, { method: 'POST' }))
    expect(res.status).toBe(404)
  })

  it('sans admin configuré → 404 sans aucun appel Supabase Auth', async () => {
    vi.stubEnv('STORE_BUILDER_ADMIN_EMAILS', '')
    const res = await connectGET(new NextRequest(`${BASE}/api/shopify/store-builder/connect?shop=a.myshopify.com`))
    expect(res.status).toBe(404)
    expect(state.getUserCalls).toBe(0)
  })

  it('admin (email allowlist) passe le gate flag OFF', async () => {
    state.user = { id: 'admin', email: 'founder@example.com' }
    state.plan = 'free'
    // shop invalide : on vérifie juste qu'on a dépassé le gate (400 métier, pas 404)
    const res = await connectGET(new NextRequest(`${BASE}/api/shopify/store-builder/connect?shop=nope`))
    expect(res.status).toBe(400)
  })

  it.each([
    ['ab-tests/active', () => activeGET(new NextRequest(`${BASE}/api/shopify/ab-tests/active?shop=a.myshopify.com&product_id=1`))],
    ['events', () => eventsPOST(new NextRequest(`${BASE}/api/shopify/events`, { method: 'POST', body: '{}' }))],
    ['webhooks/orders-paid', () => ordersPaidPOST(new NextRequest(`${BASE}/api/shopify/webhooks/orders-paid`, { method: 'POST', body: '{}' }))],
  ])('route publique %s → 404 sans toucher la DB', async (_name, call) => {
    const res = await call()
    expect(res.status).toBe(404)
  })

  it('cron audit autorisé → 200 no-op', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-test')
    const res = await auditCronGET(
      new NextRequest(`${BASE}/api/cron/store-builder-audit`, { headers: { authorization: 'Bearer cron-test' } }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ skipped: true, reason: 'store_builder_disabled' })
  })

  it('cron non autorisé → toujours 401 (auth avant flag)', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-test')
    const res = await auditCronGET(new NextRequest(`${BASE}/api/cron/store-builder-audit`))
    expect(res.status).toBe(401)
  })
})

describe('flag ON', () => {
  beforeEach(() => {
    vi.stubEnv('STORE_BUILDER_ENABLED', 'true')
  })

  it('Starter → 403 PLAN_REQUIRED', async () => {
    state.plan = 'starter'
    const res = await connectGET(new NextRequest(`${BASE}/api/shopify/store-builder/connect?shop=a.myshopify.com`))
    expect(res.status).toBe(403)
    expect(await res.json()).toMatchObject({ error: { code: 'PLAN_REQUIRED' } })
  })

  it('Pro avec déjà 1 boutique → redirect store_limit_reached sur une 2e', async () => {
    state.connectedShops = ['a.myshopify.com']
    const res = await connectGET(new NextRequest(`${BASE}/api/shopify/store-builder/connect?shop=b.myshopify.com`))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('sb_error=store_limit_reached')
  })
})
