import { describe, it, expect } from 'vitest'
import { rateLimitAsync } from './ratelimit'

// Ces tests tournent sans UPSTASH_REDIS_REST_URL configuré (env de test) —
// rateLimitAsync retombe donc sur le fallback en mémoire (memoryRateLimit).
// C'est le même code path utilisé en dev/preview sans Upstash configuré.
describe('rateLimitAsync', () => {
  it('allows requests under the limit', async () => {
    const key = `test:${Math.random()}`
    const r1 = await rateLimitAsync(key, 3, 60_000)
    const r2 = await rateLimitAsync(key, 3, 60_000)
    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(true)
  })

  it('blocks the request once the limit is exceeded', async () => {
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
    const key = `analytics-view-dedup:page-1:1.2.3.4:${Math.random()}`
    const first = await rateLimitAsync(key, 1, 30 * 60_000)
    const second = await rateLimitAsync(key, 1, 30 * 60_000)
    expect(first.allowed).toBe(true)
    expect(second.allowed).toBe(false)
  })

  it('different keys are independent (different IP = different dedup bucket)', async () => {
    const suffix = Math.random()
    const keyIpA = `analytics-view-dedup:page-1:1.1.1.1:${suffix}`
    const keyIpB = `analytics-view-dedup:page-1:2.2.2.2:${suffix}`
    const a = await rateLimitAsync(keyIpA, 1, 30 * 60_000)
    const b = await rateLimitAsync(keyIpB, 1, 30 * 60_000)
    expect(a.allowed).toBe(true)
    expect(b.allowed).toBe(true)
  })
})
