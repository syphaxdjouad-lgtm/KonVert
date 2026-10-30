import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Ce fichier ne touche JAMAIS le réseau : les deux clients Upstash sont mockés.
// Avant (2026-05 → 2026-10) le CI exportait UPSTASH_REDIS_REST_URL=https://ci.upstash.fake,
// donc rateLimitAsync prenait le chemin distribué et les 4 tests tombaient sur
// `getaddrinfo ENOTFOUND ci.upstash.fake` — la CI était rouge en permanence alors
// que le code était bon. On pilote maintenant le chemin via l'env stubbée, et on
// couvre AUSSI le chemin Upstash qui est celui réellement utilisé en prod.

const upstash = vi.hoisted(() => ({
  counts: new Map<string, number>(),
  // 'ok' | 'throw' (DNS/réseau KO) | 'hang' (Redis qui ne répond jamais)
  mode: 'ok' as 'ok' | 'throw' | 'hang',
  // configs vues par `new Redis(...)` — sert à vérifier qu'on ne l'instancie pas pour rien
  redisConfigs: [] as Array<{ url: string; token: string }>,
}))

vi.mock('@upstash/redis', () => ({
  Redis: class {
    constructor(config: { url: string; token: string }) {
      upstash.redisConfigs.push(config)
    }
  },
}))

vi.mock('@upstash/ratelimit', () => {
  class Ratelimit {
    static slidingWindow(limit: number, window: string) {
      return { limit, window }
    }

    private readonly limit_: number
    private readonly prefix: string

    constructor(opts: { redis: unknown; limiter: { limit: number }; prefix: string }) {
      this.limit_ = opts.limiter.limit
      this.prefix = opts.prefix
    }

    // Compteur en mémoire partagé entre instances, comme le ferait Redis.
    async limit(key: string) {
      if (upstash.mode === 'throw') throw new TypeError('fetch failed')
      if (upstash.mode === 'hang') return new Promise(() => {})
      const bucket = `${this.prefix}:${this.limit_}:${key}`
      const used = (upstash.counts.get(bucket) ?? 0) + 1
      upstash.counts.set(bucket, used)
      return {
        success: used <= this.limit_,
        remaining: Math.max(0, this.limit_ - used),
        reset: Date.now() + 60_000,
      }
    }
  }

  return { Ratelimit }
})

type RateLimitModule = typeof import('./ratelimit')

// `isUpstashConfigured` est évalué au chargement du module → il faut stubber
// l'env puis réimporter pour choisir le chemin testé.
async function loadRatelimit(mode: 'upstash' | 'memory'): Promise<RateLimitModule> {
  vi.resetModules()
  if (mode === 'upstash') {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.invalid')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'unit-test-token')
  } else {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
  }
  return import('./ratelimit')
}

beforeEach(() => {
  upstash.mode = 'ok'
  upstash.counts.clear()
  upstash.redisConfigs.length = 0
})

afterEach(() => {
  vi.unstubAllEnvs()
})

// ── Fallback en mémoire (dev / preview sans Upstash configuré) ────────────────

describe('rateLimitAsync — fallback en mémoire', () => {
  it('allows requests under the limit', async () => {
    const { rateLimitAsync } = await loadRatelimit('memory')
    const key = `test:${Math.random()}`
    const r1 = await rateLimitAsync(key, 3, 60_000)
    const r2 = await rateLimitAsync(key, 3, 60_000)
    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(true)
  })

  it('blocks the request once the limit is exceeded', async () => {
    const { rateLimitAsync } = await loadRatelimit('memory')
    const key = `test:${Math.random()}`
    await rateLimitAsync(key, 2, 60_000)
    await rateLimitAsync(key, 2, 60_000)
    const r3 = await rateLimitAsync(key, 2, 60_000)
    expect(r3.allowed).toBe(false)
  })

  // Pattern utilisé pour la dédup SEC-04 (analytics/track + ab log) :
  // limit=1 sur une fenêtre longue == "une seule occurrence acceptée,
  // tout appel suivant avec la même clé est rejeté silencieusement".
  it('limit=1 dedup pattern: first call allowed, second call with same key rejected', async () => {
    const { rateLimitAsync } = await loadRatelimit('memory')
    const key = `analytics-view-dedup:page-1:1.2.3.4:${Math.random()}`
    const first = await rateLimitAsync(key, 1, 30 * 60_000)
    const second = await rateLimitAsync(key, 1, 30 * 60_000)
    expect(first.allowed).toBe(true)
    expect(second.allowed).toBe(false)
  })

  it('different keys are independent (different IP = different dedup bucket)', async () => {
    const { rateLimitAsync } = await loadRatelimit('memory')
    const suffix = Math.random()
    const keyIpA = `analytics-view-dedup:page-1:1.1.1.1:${suffix}`
    const keyIpB = `analytics-view-dedup:page-1:2.2.2.2:${suffix}`
    const a = await rateLimitAsync(keyIpA, 1, 30 * 60_000)
    const b = await rateLimitAsync(keyIpB, 1, 30 * 60_000)
    expect(a.allowed).toBe(true)
    expect(b.allowed).toBe(true)
  })

  it("n'instancie pas de client Redis quand Upstash n'est pas configuré", async () => {
    await loadRatelimit('memory')
    expect(upstash.redisConfigs).toHaveLength(0)
  })
})

// ── Chemin Upstash distribué (celui utilisé en prod) ─────────────────────────

describe('rateLimitAsync — chemin Upstash', () => {
  it('passe par Upstash et mappe success/remaining', async () => {
    const { rateLimitAsync } = await loadRatelimit('upstash')
    const key = `test:${Math.random()}`
    const r1 = await rateLimitAsync(key, 3, 60_000)
    const r2 = await rateLimitAsync(key, 3, 60_000)
    expect(r1).toMatchObject({ allowed: true, remaining: 2, retryAfterMs: 0 })
    expect(r2).toMatchObject({ allowed: true, remaining: 1, retryAfterMs: 0 })
    expect(upstash.redisConfigs).toHaveLength(1)
  })

  it('bloque au-delà de la limite et renvoie un retryAfterMs positif', async () => {
    const { rateLimitAsync } = await loadRatelimit('upstash')
    const key = `test:${Math.random()}`
    await rateLimitAsync(key, 2, 60_000)
    await rateLimitAsync(key, 2, 60_000)
    const r3 = await rateLimitAsync(key, 2, 60_000)
    expect(r3.allowed).toBe(false)
    expect(r3.remaining).toBe(0)
    expect(r3.retryAfterMs).toBeGreaterThan(0)
  })

  it('réutilise le même limiter pour une config identique (cache limit:windowMs)', async () => {
    const { rateLimitAsync } = await loadRatelimit('upstash')
    // Deux clés distinctes, même config → même limiter, buckets séparés.
    const a = await rateLimitAsync(`ip-a:${Math.random()}`, 1, 30 * 60_000)
    const b = await rateLimitAsync(`ip-b:${Math.random()}`, 1, 30 * 60_000)
    expect(a.allowed).toBe(true)
    expect(b.allowed).toBe(true)
    // Un seul client Redis pour tout le module, pas un par appel.
    expect(upstash.redisConfigs).toHaveLength(1)
  })
})

// ── Panne Upstash → fail-open sur le fallback mémoire ────────────────────────

describe('rateLimitAsync — Upstash en panne', () => {
  it("ne jette pas si Upstash plante (ENOTFOUND) et applique la limite en mémoire", async () => {
    const { rateLimitAsync } = await loadRatelimit('upstash')
    upstash.mode = 'throw'
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const key = `down:${Math.random()}`
    const r1 = await rateLimitAsync(key, 1, 60_000)
    const r2 = await rateLimitAsync(key, 1, 60_000)
    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(false)
  })

  it('bascule en mémoire si Upstash ne répond pas dans le délai', async () => {
    vi.useFakeTimers()
    try {
      const { rateLimitAsync } = await loadRatelimit('upstash')
      upstash.mode = 'hang'
      vi.spyOn(console, 'error').mockImplementation(() => {})
      const pending = rateLimitAsync(`hang:${Math.random()}`, 3, 60_000)
      await vi.advanceTimersByTimeAsync(2000)
      await expect(pending).resolves.toMatchObject({ allowed: true, remaining: 2 })
    } finally {
      vi.useRealTimers()
    }
  })
})

// ── Wrapper sync (backward compat) ───────────────────────────────────────────

describe('rateLimit (sync)', () => {
  it('reste sur le fallback mémoire même quand Upstash est configuré', async () => {
    const { rateLimit } = await loadRatelimit('upstash')
    const key = `sync:${Math.random()}`
    expect(rateLimit(key, 1, 60_000).allowed).toBe(true)
    expect(rateLimit(key, 1, 60_000).allowed).toBe(false)
    // Aucun passage par le mock Upstash.
    expect(upstash.counts.size).toBe(0)
  })
})
