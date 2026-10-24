// POST /api/shopify/ab-tests/[id]/promote
//
// "Promouvoir la variante gagnante" (cf. spec KAKASHI §A.5) : écrit la
// variante gagnante dans product.title/body_html via Admin API, fige le
// test en `status='promoted'`. Deux modes :
// - Normal : le test doit être en statut `significant` recalculé côté
//   serveur (jamais fait confiance à un état client potentiellement périmé).
// - `force: true` : "Forcer maintenant" — permet au marchand de trancher
//   hors garde-fous statistiques, en connaissance de cause (cf. spec A.5).
//   Body doit alors préciser `winner` explicitement ('a'|'b').
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27).

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { decryptToken } from '@/lib/shopify'
import { DEFAULT_STORE_BUILDER_API_VERSION, updateProductField, type StoreBuilderContext } from '@/lib/shopify/store-builder'
import { computeAbTestStats } from '@/lib/store-builder/ab-testing/compute-stats'
import { guardStoreBuilderUserRoute } from '@/lib/store-builder/access'

const bodySchema = z.object({
  force: z.boolean().optional().default(false),
  winner: z.enum(['a', 'b']).optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await guardStoreBuilderUserRoute()
  if (!gate.ok) return gate.response

  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } }, { status: 401 })
  }

  const rawBody = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_PAYLOAD', message: 'Payload invalide' } }, { status: 400 })
  }
  const { force, winner: forcedWinner } = parsed.data

  const { data: test } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('id, user_id, connection_id, field, variant_a_text, variant_b_text, status, started_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!test) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Test A/B introuvable' } }, { status: 404 })
  }
  if (test.status !== 'running') {
    return NextResponse.json({ ok: false, error: { code: 'CONFLICT', message: `Ce test n'est plus actif (statut: ${test.status}).` } }, { status: 409 })
  }

  let winner: 'a' | 'b'

  if (force) {
    if (!forcedWinner) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_PAYLOAD', message: "`winner` requis quand `force` est vrai." } },
        { status: 400 }
      )
    }
    winner = forcedWinner
  } else {
    const stats = await computeAbTestStats(supabaseAdmin, test.id, test.started_at)
    if (stats.decision.status !== 'significant' || !stats.decision.winner) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'NOT_SIGNIFICANT',
            message: 'Aucun gagnant statistiquement significatif pour le moment — utilise `force: true` pour trancher malgré tout.',
          },
          data: { decision: stats.decision },
        },
        { status: 409 }
      )
    }
    winner = stats.decision.winner
  }

  const { data: connection } = await supabaseAdmin
    .from('shopify_store_connections')
    .select('shop_domain, access_token, product_id')
    .eq('id', test.connection_id)
    .single()

  if (!connection?.product_id) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_INSTALLED', message: 'Connexion sans produit installé.' } }, { status: 409 })
  }

  const ctx: StoreBuilderContext = {
    shopDomain: connection.shop_domain,
    accessToken: decryptToken(connection.access_token),
    apiVersion: DEFAULT_STORE_BUILDER_API_VERSION,
  }

  const winningText = winner === 'a' ? test.variant_a_text : test.variant_b_text
  const shopifyField = test.field === 'h1_title' ? 'title' : 'body_html'

  const updateResult = await updateProductField(ctx, connection.product_id, shopifyField, winningText)
  if (!updateResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: 'SHOPIFY_ERROR', message: "Échec de l'écriture Shopify.", detail: updateResult.error } },
      { status: 502 }
    )
  }

  await supabaseAdmin
    .from('store_builder_ab_tests')
    .update({ status: 'promoted', winner, ended_at: new Date().toISOString() })
    .eq('id', test.id)

  return NextResponse.json({ ok: true, data: { winner } })
}
