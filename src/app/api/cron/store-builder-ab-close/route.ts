// GET /api/cron/store-builder-ab-close — cron quotidien
//
// Clôture automatiquement les tests A/B qui ont atteint le plafond de 30
// jours sans avoir atteint la significativité statistique (cf. spec
// KAKASHI §A.4 "Fenêtre de décision"). Statut → `inconclusive`, retour
// (implicite) à la variante A par défaut : dès que `status != 'running'`,
// `/api/shopify/ab-tests/active` cesse de renvoyer ce test.
//
// N'auto-promeut JAMAIS un gagnant avant terme — la promotion reste une
// action manuelle du marchand (bouton dashboard "Promouvoir la variante
// gagnante", cf. POST .../promote). Ce cron ne fait QUE la clôture négative.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27) :
// jamais exécuté contre des données réelles (aucun test A/B créé sur un
// vrai store à ce stade).

import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { safeCompare } from '@/lib/security/safe-compare'
import { computeAbTestStats, AB_MAX_DURATION_DAYS } from '@/lib/store-builder'
import { isStoreBuilderEnabled } from '@/lib/store-builder/flag'

export const maxDuration = 60
export const runtime = 'nodejs'

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  const header = req.headers.get('authorization') ?? ''
  return safeCompare(header, `Bearer ${cronSecret}`)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Flag OFF : no-op 200 (pas d'erreur → pas d'alerte cron Vercel), sans
  // toucher aux tables Store Builder potentiellement non migrées.
  if (!isStoreBuilderEnabled()) {
    return NextResponse.json({ skipped: true, reason: 'store_builder_disabled' })
  }

  const cutoff = new Date(Date.now() - AB_MAX_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: candidates, error } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('id, started_at')
    .eq('status', 'running')
    .lte('started_at', cutoff)
    .limit(500)

  if (error) {
    console.error('[cron/store-builder-ab-close] Supabase error:', error.message)
    Sentry.captureException(error, { tags: { cron: 'store-builder-ab-close', phase: 'fetch' } })
    return NextResponse.json({ error: 'Erreur de lecture des tests' }, { status: 500 })
  }

  let closed = 0
  let stillRunning = 0
  let errors = 0

  for (const candidate of candidates ?? []) {
    try {
      const stats = await computeAbTestStats(supabaseAdmin, candidate.id, candidate.started_at)

      if (stats.decision.status === 'inconclusive') {
        await supabaseAdmin
          .from('store_builder_ab_tests')
          .update({ status: 'inconclusive', winner: 'inconclusive', ended_at: new Date().toISOString() })
          .eq('id', candidate.id)
          .eq('status', 'running') // évite d'écraser une clôture concurrente (promote/stop manuel entretemps)
        closed++
      } else {
        // significant/collecting improbable à >=30j (decideAbTest renvoie
        // toujours 'significant' ou 'inconclusive' passé le plafond) — gardé
        // en défense en profondeur si la logique de stats.ts évolue.
        stillRunning++
      }
    } catch (err) {
      console.error(`[cron/store-builder-ab-close] erreur test ${candidate.id}:`, err)
      Sentry.captureException(err, { tags: { cron: 'store-builder-ab-close' }, extra: { ab_test_id: candidate.id } })
      errors++
    }
  }

  return NextResponse.json({ closed, stillRunning, errors, checked: candidates?.length ?? 0 })
}
