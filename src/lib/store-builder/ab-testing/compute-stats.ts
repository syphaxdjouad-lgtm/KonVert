// Store Builder for Shopify — agrège les compteurs `store_builder_ab_events`
// pour un test donné et calcule la décision (cf. stats.ts). Impure (accès
// Supabase) — séparé de stats.ts qui reste pur/testable sans réseau.
//
// Utilisé par : GET /api/shopify/ab-tests (dashboard), POST .../promote,
// et le cron d'auto-clôture à 30 jours.

import type { SupabaseClient } from '@supabase/supabase-js'
import { decideAbTest, evaluateAddToCartAlert, type AbDecision, type AddToCartAlert } from './stats'

export interface AbTestCounts {
  visitorsA: number
  visitorsB: number
  atcA: number
  atcB: number
  purchasesA: number
  purchasesB: number
}

async function countEvents(
  supabase: SupabaseClient,
  abTestId: string,
  eventType: 'page_view' | 'add_to_cart' | 'purchase',
  variant: 'a' | 'b'
): Promise<number> {
  const { count, error } = await supabase
    .from('store_builder_ab_events')
    .select('id', { count: 'exact', head: true })
    .eq('ab_test_id', abTestId)
    .eq('event_type', eventType)
    .eq('variant', variant)

  if (error) {
    console.error('[ab-testing/compute-stats] count query failed:', error.message)
    return 0
  }
  return count ?? 0
}

export async function fetchAbTestCounts(supabase: SupabaseClient, abTestId: string): Promise<AbTestCounts> {
  const [visitorsA, visitorsB, atcA, atcB, purchasesA, purchasesB] = await Promise.all([
    countEvents(supabase, abTestId, 'page_view', 'a'),
    countEvents(supabase, abTestId, 'page_view', 'b'),
    countEvents(supabase, abTestId, 'add_to_cart', 'a'),
    countEvents(supabase, abTestId, 'add_to_cart', 'b'),
    countEvents(supabase, abTestId, 'purchase', 'a'),
    countEvents(supabase, abTestId, 'purchase', 'b'),
  ])

  return { visitorsA, visitorsB, atcA, atcB, purchasesA, purchasesB }
}

export function daysElapsedSince(startedAt: string, now: Date = new Date()): number {
  const ms = now.getTime() - new Date(startedAt).getTime()
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}

export interface AbTestStatsSnapshot {
  counts: AbTestCounts
  daysElapsed: number
  decision: AbDecision
  addToCartAlert: AddToCartAlert
}

export async function computeAbTestStats(
  supabase: SupabaseClient,
  abTestId: string,
  startedAt: string
): Promise<AbTestStatsSnapshot> {
  const counts = await fetchAbTestCounts(supabase, abTestId)
  const daysElapsed = daysElapsedSince(startedAt)

  const decision = decideAbTest({
    visitorsA: counts.visitorsA,
    visitorsB: counts.visitorsB,
    purchasesA: counts.purchasesA,
    purchasesB: counts.purchasesB,
    daysElapsed,
  })

  const addToCartAlert = evaluateAddToCartAlert({
    visitorsA: counts.visitorsA,
    atcA: counts.atcA,
    visitorsB: counts.visitorsB,
    atcB: counts.atcB,
  })

  return { counts, daysElapsed, decision, addToCartAlert }
}
