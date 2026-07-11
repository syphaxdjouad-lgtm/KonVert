import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { isAdmin } from '@/lib/security/admin-auth'

// Health check approfondi — destination monitoring externe (UptimeRobot,
// BetterUptime). Contrairement à /api/health qui retourne juste `ok`, celui-ci
// ping concrètement Supabase, DeepSeek, Stripe et retourne le statut de chacun.
//
// Protégé par `x-admin-secret` (timing-safe) : on ne veut pas exposer la liste
// de nos dépendances + leurs latences à n'importe qui.

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

type CheckResult = {
  name: string
  ok: boolean
  latency_ms: number
  detail?: string
}

async function timed<T>(name: string, fn: () => Promise<T>): Promise<CheckResult> {
  const t0 = Date.now()
  try {
    await fn()
    return { name, ok: true, latency_ms: Date.now() - t0 }
  } catch (err) {
    return {
      name,
      ok: false,
      latency_ms: Date.now() - t0,
      detail: err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    }
  }
}

async function checkSupabase(): Promise<CheckResult> {
  return timed('supabase', async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('env missing')
    const client = createClient(url, key, { auth: { persistSession: false } })
    // SELECT 1 minimal — pas de lecture data, juste prouver que la connexion vit.
    const { error } = await client.from('users').select('id', { count: 'exact', head: true }).limit(1)
    if (error) throw error
  })
}

async function checkDeepSeek(): Promise<CheckResult> {
  return timed('deepseek', async () => {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) throw new Error('DEEPSEEK_API_KEY manquant')
    // Endpoint léger : /v1/models renvoie la liste des modèles, ne consomme
    // pas de tokens. Si DeepSeek est down ou la clé révoquée, on saura.
    const res = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  })
}

async function checkStripe(): Promise<CheckResult> {
  return timed('stripe', async () => {
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) throw new Error('STRIPE_SECRET_KEY manquant')
    const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' })
    // Account.retrieve renvoie l'account lié à la clé — pas de side effect,
    // pas de cost, et lève si la clé est révoquée.
    await stripe.accounts.retrieve()
  })
}

async function checkResend(): Promise<CheckResult> {
  return timed('resend', async () => {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY manquant')
    // /domains liste les domaines vérifiés — pas de consommation, et révèle
    // si la clé est révoquée ou si le compte est suspendu.
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  })
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  // Tous les checks en parallèle — total ~latence du check le plus lent.
  const checks = await Promise.all([
    checkSupabase(),
    checkDeepSeek(),
    checkStripe(),
    checkResend(),
  ])

  const allOk = checks.every((c) => c.ok)

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      service: 'konvert',
      time: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
      region: process.env.VERCEL_REGION ?? 'unknown',
      checks,
    },
    {
      // 200 même en degraded : on veut que UptimeRobot/BetterUptime puissent
      // parser la réponse JSON et alerter sur `status: degraded`. Un 500
      // perdrait les détails par check dans les logs externes.
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}
