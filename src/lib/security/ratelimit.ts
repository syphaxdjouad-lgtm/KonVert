/**
 * Rate limiter distribué via Upstash Redis (fonctionne en serverless).
 * Fallback en mémoire si UPSTASH_REDIS_REST_URL n'est pas configuré.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

// ── Upstash distribué (prod) ─────────────────────────────────────────────────

const isUpstashConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// Cache de rate limiters Upstash par config (limit:windowMs)
const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit {
  const key = `${limit}:${windowMs}`
  let limiter = upstashLimiters.get(key)
  if (!limiter) {
    const windowSec = Math.ceil(windowMs / 1000)
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: 'rl',
    })
    upstashLimiters.set(key, limiter)
  }
  return limiter
}

// ── Fallback en mémoire (dev / si Upstash non configuré) ─────────────────────

interface Entry {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, Entry>()

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 }
}

// ── API publique ─────────────────────────────────────────────────────────────

// Au-delà, on considère Upstash KO : mieux vaut un rate limit local qu'une requête bloquée.
const UPSTASH_TIMEOUT_MS = 2000

// Un seul log par instance : sinon chaque requête spamme les logs pendant une panne.
let upstashFailureLogged = false

export async function rateLimitAsync(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (isUpstashConfigured && redis) {
    try {
      const limiter = getUpstashLimiter(limit, windowMs)
      let timer: ReturnType<typeof setTimeout> | undefined
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Upstash timeout (${UPSTASH_TIMEOUT_MS}ms)`)), UPSTASH_TIMEOUT_MS)
      })
      const { success, remaining, reset } = await Promise.race([limiter.limit(key), timeout]).finally(() => clearTimeout(timer))
      return {
        allowed: success,
        remaining,
        retryAfterMs: success ? 0 : Math.max(0, reset - Date.now()),
      }
    } catch (err) {
      // Fail-open : une panne Redis (base supprimée, DNS, réseau) ne doit jamais
      // faire tomber les routes en 500 — on bascule sur le compteur mémoire.
      if (!upstashFailureLogged) {
        upstashFailureLogged = true
        console.error('[ratelimit] Upstash indisponible, fallback mémoire :', err instanceof Error ? err.message : err)
      }
    }
  }
  return memoryRateLimit(key, limit, windowMs)
}

// Sync wrapper (backward compat — utilise le fallback mémoire)
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  return memoryRateLimit(key, limit, windowMs)
}

// Nettoyer les entrées mémoire expirées
if (typeof setInterval !== 'undefined') {
  try {
    setInterval(() => {
      const now = Date.now()
      for (const [k, v] of memoryStore) {
        if (v.resetAt <= now) memoryStore.delete(k)
      }
    }, 5 * 60 * 1000)
  } catch {
    // Edge Runtime — pas de setInterval
  }
}
