// POST /api/shopify/ab-tests/[id]/stop
//
// "Arrêter le test" (cf. spec KAKASHI §A.5) : repasse en variante A —
// dès que `status != 'running'`, `/api/shopify/ab-tests/active` ne renvoie
// plus ce test, le script thème cesse de swapper automatiquement. Aucun
// appel Shopify nécessaire (le produit n'a jamais été modifié pendant le
// test — le swap est client-side).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27).

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } }, { status: 401 })
  }

  const { data: test } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!test) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Test A/B introuvable' } }, { status: 404 })
  }
  if (test.status !== 'running') {
    return NextResponse.json({ ok: false, error: { code: 'CONFLICT', message: `Ce test n'est plus actif (statut: ${test.status}).` } }, { status: 409 })
  }

  await supabaseAdmin
    .from('store_builder_ab_tests')
    .update({ status: 'stopped', ended_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
