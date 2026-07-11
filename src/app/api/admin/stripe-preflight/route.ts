import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { isAdmin } from '@/lib/security/admin-auth'

// Preflight Stripe pour le launch — vérifie en prod :
//   - mode de la clé (live vs test)
//   - existence + validité du coupon LAUNCH50
//   - existence + activeness des 6 prices configurés (Starter/Pro/Agency × mtly/annual)
//
// GET  : retourne l'état (read-only)
// POST : crée le coupon LAUNCH50 si manquant (idempotent — 409 si existe)
//
// Protégé par `x-admin-secret` (timing-safe). À retirer post-launch si plus utile.

export const runtime = 'nodejs'
export const maxDuration = 15
export const dynamic = 'force-dynamic'

function detectMode(secret: string | undefined): 'live' | 'test' | 'missing' | 'invalid' {
  if (!secret) return 'missing'
  if (secret.startsWith('sk_live_')) return 'live'
  if (secret.startsWith('sk_test_')) return 'test'
  return 'invalid'
}

const PRICE_ENVS = [
  'STRIPE_PRICE_STARTER',
  'STRIPE_PRICE_STARTER_ANNUAL',
  'STRIPE_PRICE_PRO',
  'STRIPE_PRICE_PRO_ANNUAL',
  'STRIPE_PRICE_AGENCY',
  'STRIPE_PRICE_AGENCY_ANNUAL',
] as const

async function checkPrice(stripe: Stripe, envName: string) {
  const id = process.env[envName]?.trim()
  if (!id) return { env: envName, ok: false, detail: 'env manquant' }
  try {
    const p = await stripe.prices.retrieve(id)
    return {
      env: envName,
      ok: p.active === true,
      id: p.id,
      active: p.active,
      livemode: p.livemode,
      unit_amount: p.unit_amount,
      currency: p.currency,
      interval: p.recurring?.interval ?? null,
    }
  } catch (err) {
    return {
      env: envName,
      ok: false,
      id,
      detail: err instanceof Error ? err.message.slice(0, 200) : String(err),
    }
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  const mode = detectMode(secret)

  if (mode !== 'live' && mode !== 'test') {
    return NextResponse.json({
      status: 'error',
      mode,
      detail: 'STRIPE_SECRET_KEY absent ou mal formaté en prod',
    })
  }

  const stripe = new Stripe(secret!, { apiVersion: '2026-03-25.dahlia' })

  // 1. Account info
  let account: { id: string; country: string | null; charges_enabled: boolean | null; details_submitted: boolean | null } | { error: string }
  try {
    const acc = await stripe.accounts.retrieve()
    account = {
      id: acc.id,
      country: acc.country ?? null,
      charges_enabled: acc.charges_enabled ?? null,
      details_submitted: acc.details_submitted ?? null,
    }
  } catch (err) {
    account = { error: err instanceof Error ? err.message.slice(0, 200) : String(err) }
  }

  // 2. Coupon LAUNCH50
  let launch50: { exists: boolean; valid?: boolean; percent_off?: number | null; max_redemptions?: number | null; times_redeemed?: number | null; redeem_by?: string | null; livemode?: boolean; detail?: string }
  try {
    const c = await stripe.coupons.retrieve('LAUNCH50')
    launch50 = {
      exists: true,
      valid: c.valid,
      percent_off: c.percent_off ?? null,
      max_redemptions: c.max_redemptions ?? null,
      times_redeemed: c.times_redeemed ?? null,
      redeem_by: c.redeem_by ? new Date(c.redeem_by * 1000).toISOString() : null,
      livemode: c.livemode,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('No such coupon')) {
      launch50 = { exists: false }
    } else {
      launch50 = { exists: false, detail: msg.slice(0, 200) }
    }
  }

  // 2b. Promotion Code "LAUNCH50" lié au coupon — c'est ce que l'user tape.
  // Sans promotion code, le checkout API ne trouve rien et fallback (échec UX).
  let promoLaunch50: { exists: boolean; active?: boolean; coupon_id?: string; livemode?: boolean; times_redeemed?: number | null; detail?: string }
  try {
    const list = await stripe.promotionCodes.list({ code: 'LAUNCH50', limit: 1 })
    if (list.data[0]) {
      const p = list.data[0]
      // Stripe SDK v21 : `promotion.coupon` peut être string (non expanded) ou objet Coupon.
      const c = p.promotion?.coupon
      const couponId = typeof c === 'string' ? c : c && 'id' in c ? c.id : 'unknown'
      promoLaunch50 = {
        exists: true,
        active: p.active,
        coupon_id: couponId,
        livemode: p.livemode,
        times_redeemed: p.times_redeemed ?? null,
      }
    } else {
      promoLaunch50 = { exists: false }
    }
  } catch (err) {
    promoLaunch50 = { exists: false, detail: err instanceof Error ? err.message.slice(0, 200) : String(err) }
  }

  // 3. Prices
  const prices = await Promise.all(PRICE_ENVS.map((env) => checkPrice(stripe, env)))

  // 4. Webhook secret presence
  const webhook_secret = {
    secret_present: !!process.env.STRIPE_WEBHOOK_SECRET,
    prefix_ok: process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_') ?? false,
  }

  // 4b. Webhook endpoints configurés dans Stripe Dashboard
  let webhook_endpoints: Array<{
    id: string
    url: string
    status: string
    livemode: boolean
    enabled_events: string[]
    api_version: string | null
    targets_konvert: boolean
    has_required_events: boolean
  }>
  const REQUIRED_EVENTS = [
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_failed',
    'invoice.payment_succeeded',
  ]
  try {
    const eps = await stripe.webhookEndpoints.list({ limit: 20 })
    webhook_endpoints = eps.data.map((ep) => {
      const events = ep.enabled_events ?? []
      const hasAll = events.includes('*') || REQUIRED_EVENTS.every((e) => events.includes(e))
      return {
        id: ep.id,
        url: ep.url,
        status: ep.status ?? 'unknown',
        livemode: ep.livemode,
        enabled_events: events,
        api_version: ep.api_version ?? null,
        targets_konvert: ep.url.includes('konvertpilot.com') || ep.url.includes('konvert.app'),
        has_required_events: hasAll,
      }
    })
  } catch (err) {
    webhook_endpoints = []
    // détail logué ci-dessous via webhook_endpoints_error
  }

  const konvert_endpoint = webhook_endpoints.find((e) => e.targets_konvert && e.livemode === (mode === 'live') && e.status === 'enabled')

  // 4c. Payment method types activés sur l'account
  let payment_method_types: string[] = []
  try {
    const conf = await stripe.paymentMethodConfigurations.list({ limit: 5 })
    // Heuristique : on prend la première active, sinon vide
    const active = conf.data.find((c) => c.active) ?? conf.data[0]
    if (active) {
      const flags = active as unknown as Record<string, { display_preference?: { value?: string } } | undefined>
      payment_method_types = Object.entries(flags)
        .filter(([k, v]) => typeof v === 'object' && v && 'display_preference' in v && v.display_preference?.value !== 'none' && !['id', 'object', 'name', 'active', 'is_default', 'livemode', 'parent', 'application'].includes(k))
        .map(([k]) => k)
    }
  } catch {
    // Si l'API payment_method_configurations n'est pas dispo, on skip.
  }

  // 4d. Customer Portal config — vérifie qu'il y a au moins une config active.
  let portal_configured = false
  try {
    const portals = await stripe.billingPortal.configurations.list({ active: true, limit: 1 })
    portal_configured = portals.data.length > 0
  } catch {
    portal_configured = false
  }

  const launchDateConfigured = !!process.env.NEXT_PUBLIC_LAUNCH_DATE
  const launchDateValue = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? null

  // Verdict global
  const livemodeChecks = [
    'account' in launch50 ? null : launch50.livemode === (mode === 'live'),
    ...prices.map((p) => ('livemode' in p ? p.livemode === (mode === 'live') : null)),
  ].filter((v) => v !== null) as boolean[]
  const livemodeConsistent = livemodeChecks.every((v) => v)

  const allPricesOk = prices.every((p) => p.ok)
  const accountOk = 'id' in account
  const promoOk = promoLaunch50.exists && promoLaunch50.active && promoLaunch50.livemode === (mode === 'live')
  const webhookEndpointOk = !!konvert_endpoint && konvert_endpoint.has_required_events
  const launchReady =
    mode === 'live' &&
    launch50.exists &&
    launch50.valid &&
    promoOk &&
    allPricesOk &&
    accountOk &&
    webhook_secret.prefix_ok &&
    webhookEndpointOk &&
    livemodeConsistent &&
    launchDateConfigured

  return NextResponse.json(
    {
      status: launchReady ? 'ready' : 'not-ready',
      mode,
      livemode_consistent: livemodeConsistent,
      account,
      coupon_launch50: launch50,
      promotion_code_launch50: promoLaunch50,
      prices,
      webhook_secret,
      webhook_endpoints,
      konvert_endpoint_ok: webhookEndpointOk,
      konvert_endpoint: konvert_endpoint ?? null,
      payment_method_types,
      customer_portal_configured: portal_configured,
      launch_date_env: { configured: launchDateConfigured, value: launchDateValue },
      launch_ready: launchReady,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
      time: new Date().toISOString(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}

// POST = idempotent — crée Coupon LAUNCH50 + Promotion Code LAUNCH50 si absents.
// Body optionnel : { redeem_by_iso?: string, max_redemptions?: number }
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY absent' }, { status: 500 })
  }

  let body: { redeem_by_iso?: string; max_redemptions?: number } = {}
  try {
    body = await req.json()
  } catch {
    // body vide = OK
  }

  const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' })
  const redeemBy = body.redeem_by_iso
    ? Math.floor(new Date(body.redeem_by_iso).getTime() / 1000)
    : Math.floor(new Date('2026-05-27T23:59:59Z').getTime() / 1000)
  const maxRedemptions = body.max_redemptions ?? 100

  const result: {
    coupon: { status: string; id?: string; livemode?: boolean; detail?: string }
    promotion_code: { status: string; id?: string; code?: string; livemode?: boolean; detail?: string }
  } = {
    coupon: { status: 'pending' },
    promotion_code: { status: 'pending' },
  }

  // 1. Coupon LAUNCH50
  try {
    const existing = await stripe.coupons.retrieve('LAUNCH50')
    result.coupon = { status: 'already_exists', id: existing.id, livemode: existing.livemode }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('No such coupon')) {
      try {
        const created = await stripe.coupons.create({
          id: 'LAUNCH50',
          percent_off: 50,
          duration: 'once',
          max_redemptions: maxRedemptions,
          redeem_by: redeemBy,
          name: 'ProductHunt Launch — 50% off first month',
          metadata: { campaign: 'ph_launch_day', created_by: 'stripe-preflight-api' },
        })
        result.coupon = { status: 'created', id: created.id, livemode: created.livemode }
      } catch (e) {
        result.coupon = { status: 'error', detail: e instanceof Error ? e.message.slice(0, 200) : String(e) }
      }
    } else {
      result.coupon = { status: 'error', detail: msg.slice(0, 200) }
    }
  }

  // 2. Promotion Code "LAUNCH50" lié au coupon (c'est ce que l'user tape)
  try {
    const existing = await stripe.promotionCodes.list({ code: 'LAUNCH50', limit: 1 })
    if (existing.data[0]) {
      const p = existing.data[0]
      result.promotion_code = {
        status: 'already_exists',
        id: p.id,
        code: p.code,
        livemode: p.livemode,
      }
    } else if (result.coupon.id) {
      // Stripe SDK v21 : on passe `promotion: { type: 'coupon', coupon: id }`
      const created = await stripe.promotionCodes.create({
        promotion: { type: 'coupon', coupon: result.coupon.id },
        code: 'LAUNCH50',
        max_redemptions: maxRedemptions,
        expires_at: redeemBy,
        active: true,
        metadata: { campaign: 'ph_launch_day', created_by: 'stripe-preflight-api' },
      })
      result.promotion_code = {
        status: 'created',
        id: created.id,
        code: created.code,
        livemode: created.livemode,
      }
    } else {
      result.promotion_code = { status: 'error', detail: 'Pas de coupon associé — création impossible' }
    }
  } catch (err) {
    result.promotion_code = { status: 'error', detail: err instanceof Error ? err.message.slice(0, 200) : String(err) }
  }

  return NextResponse.json(result)
}
