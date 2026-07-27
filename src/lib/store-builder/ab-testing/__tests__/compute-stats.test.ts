import { describe, it, expect, vi } from 'vitest'
import { daysElapsedSince, fetchAbTestCounts, computeAbTestStats } from '../compute-stats'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('daysElapsedSince', () => {
  it('calcule le nombre de jours entiers écoulés', () => {
    const startedAt = new Date('2026-07-01T00:00:00Z').toISOString()
    const now = new Date('2026-07-08T12:00:00Z')
    expect(daysElapsedSince(startedAt, now)).toBe(7)
  })

  it('renvoie 0 le jour même', () => {
    const startedAt = new Date('2026-07-01T10:00:00Z').toISOString()
    const now = new Date('2026-07-01T14:00:00Z')
    expect(daysElapsedSince(startedAt, now)).toBe(0)
  })
})

/** Mock minimal — reproduit la chaîne `.from().select().eq().eq().eq()` avec
 * `{count, error}` en sortie, sans toucher au réseau. */
function buildMockSupabase(countsByKey: Record<string, number>): SupabaseClient {
  const from = vi.fn(() => {
    const state: { eventType?: string; variant?: string } = {}
    const builder = {
      select: vi.fn(() => builder),
      eq: vi.fn((column: string, value: string) => {
        if (column === 'event_type') state.eventType = value
        if (column === 'variant') state.variant = value
        return builder
      }),
      then: undefined,
    }
    // Le vrai code fait `await supabase.from(...).select(...).eq(...).eq(...).eq(...)`
    // — on rend le builder "thenable" pour que `await` résolve avec le count.
    Object.assign(builder, {
      // @ts-expect-error mock thenable minimal pour simuler la promesse Supabase
      then: (resolve: (v: { count: number; error: null }) => void) => {
        const key = `${state.eventType}:${state.variant}`
        resolve({ count: countsByKey[key] ?? 0, error: null })
      },
    })
    return builder
  })
  return { from } as unknown as SupabaseClient
}

describe('fetchAbTestCounts', () => {
  it('agrège les 6 compteurs (page_view/add_to_cart/purchase × a/b)', async () => {
    const supabase = buildMockSupabase({
      'page_view:a': 150,
      'page_view:b': 160,
      'add_to_cart:a': 30,
      'add_to_cart:b': 45,
      'purchase:a': 12,
      'purchase:b': 18,
    })

    const counts = await fetchAbTestCounts(supabase, 'test-1')
    expect(counts).toEqual({
      visitorsA: 150,
      visitorsB: 160,
      atcA: 30,
      atcB: 45,
      purchasesA: 12,
      purchasesB: 18,
    })
  })
})

describe('computeAbTestStats', () => {
  it('combine compteurs + décision statistique cohérente', async () => {
    const supabase = buildMockSupabase({
      'page_view:a': 500,
      'page_view:b': 500,
      'add_to_cart:a': 100,
      'add_to_cart:b': 100,
      'purchase:a': 25,
      'purchase:b': 60,
    })

    const startedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    const snapshot = await computeAbTestStats(supabase, 'test-1', startedAt)

    expect(snapshot.counts.purchasesB).toBe(60)
    expect(snapshot.daysElapsed).toBeGreaterThanOrEqual(9)
    expect(snapshot.decision.status).toBe('significant')
    expect(snapshot.decision.winner).toBe('b')
  })
})
