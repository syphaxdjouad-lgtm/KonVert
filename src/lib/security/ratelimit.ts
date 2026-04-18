/**
 * Rate limiter en mémoire — sliding window par clé (IP, user ID, etc.)
 * Fonctionne par instance serverless. Pour un rate limiting distribué
 * à grande échelle, migrer vers @upstash/ratelimit + Vercel KV.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

/**
 * @param key      Clé unique (ex: `ip:generate:1.2.3.4`)
 * @param limit    Nombre max de requêtes dans la fenêtre
 * @param windowMs Durée de la fenêtre en ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 }
}

// Nettoyer les entrées expirées périodiquement (hors Edge Runtime)
if (typeof setInterval !== 'undefined') {
  try {
    setInterval(() => {
      const now = Date.now()
      for (const [k, v] of store) {
        if (v.resetAt <= now) store.delete(k)
      }
    }, 5 * 60 * 1000)
  } catch {
    // Edge Runtime — pas de setInterval, pas grave (les entrées expirent naturellement)
  }
}
