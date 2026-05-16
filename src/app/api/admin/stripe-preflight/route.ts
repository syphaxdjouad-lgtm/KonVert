import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Stripe from 'stripe'

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

function isAdmin(req: NextRequest): boolean {
  const provided = req.headers.get('x-admin-secret')
  const expected = process.env.ADMIN_SECRET
  if (!provided || !expected) return false
  const a = crypto.createHash('sha256').update(provided).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

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

  // 3. Prices
  const prices = await Promise.all(PRICE_ENVS.map((env) => checkPrice(stripe, env)))

  // 4. Webhook secret presence
  const webhook = {
    secret_present: !!process.env.STRIPE_WEBHOOK_SECRET,
    prefix_ok: process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_') ?? false,
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
  const launchReady = mode === 'live' && launch50.exists && launch50.valid && allPricesOk && accountOk && webhook.prefix_ok && livemodeConsistent

  return NextResponse.json(
    {
      status: launchReady ? 'ready' : 'not-ready',
      mode,
      livemode_consistent: livemodeConsistent,
      account,
      coupon_launch50: launch50,
      prices,
      webhook,
      launch_date_env: { configured: launchDateConfigured, value: launchDateValue },
      launch_ready: launchReady,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
      time: new Date().toISOString(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}

// POST = créer le coupon LAUNCH50 (idempotent : 409 si existe déjà)
// Body optionnel : { redeem_by_iso?: string, max_redemptions?: number }
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY absent' }, { status: 500 })
  }

  // Body parsing safe
  let body: { redeem_by_iso?: string; max_redemptions?: number } = {}
  try {
    body = await req.json()
  } catch {
    // body vide = OK, on prend les défauts
  }

  const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' })

  // Check existence first — idempotent.
  try {
    const existing = await stripe.coupons.retrieve('LAUNCH50')
    return NextResponse.json(
      {
        status: 'already_exists',
        coupon: {
          id: existing.id,
          valid: existing.valid,
          percent_off: existing.percent_off,
          max_redemptions: existing.max_redemptions,
          times_redeemed: existing.times_redeemed,
          livemode: existing.livemode,
        },
      },
      { status: 409 },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!msg.includes('No such coupon')) {
      return NextResponse.json({ error: msg.slice(0, 200) }, { status: 500 })
    }
    // Le coupon n'existe pas → on continue vers la création.
  }

  // Création coupon LAUNCH50
  const redeemBy = body.redeem_by_iso
    ? Math.floor(new Date(body.redeem_by_iso).getTime() / 1000)
    : Math.floor(new Date('2026-05-27T23:59:59Z').getTime() / 1000) // par défaut : 1 sem post-launch

  const maxRedemptions = body.max_redemptions ?? 100

  try {
    const coupon = await stripe.coupons.create({
      id: 'LAUNCH50',
      percent_off: 50,
      duration: 'once',
      max_redemptions: maxRedemptions,
      redeem_by: redeemBy,
      name: 'ProductHunt Launch — 50% off first month',
      metadata: {
        campaign: 'ph_launch_day',
        created_by: 'stripe-preflight-api',
      },
    })

    return NextResponse.json({
      status: 'created',
      coupon: {
        id: coupon.id,
        valid: coupon.valid,
        percent_off: coupon.percent_off,
        max_redemptions: coupon.max_redemptions,
        redeem_by: coupon.redeem_by ? new Date(coupon.redeem_by * 1000).toISOString() : null,
        livemode: coupon.livemode,
        name: coupon.name,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { status: 'error', detail: err instanceof Error ? err.message.slice(0, 300) : String(err) },
      { status: 500 },
    )
  }
}
