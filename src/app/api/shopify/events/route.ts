// POST /api/shopify/events
//
// Route PUBLIQUE (appelée depuis le storefront Shopify du marchand, aucune
// session Supabase) — enregistre un event `page_view`/`add_to_cart` du
// snippet A/B test (cf. src/lib/store-builder/ab-testing/theme-snippet.ts
// et spec KAKASHI §A.3). L'event `purchase` n'est JAMAIS écrit ici : il est
// exclusivement inséré côté webhook `orders/paid` (source de vérité
// business, cf. /api/shopify/webhooks/orders-paid).
//
// Écriture exclusivement via `supabaseAdmin` (service role) — aucune policy
// INSERT publique sur `store_builder_ab_events` (cf. migration).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — jamais appelé depuis un
// vrai storefront (Sprint 8, 2026-07-27).

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { guardStoreBuilderPublicRoute } from '@/lib/store-builder/access'

const eventBodySchema = z.object({
  shop_domain: z.string().regex(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/, 'shop_domain invalide'),
  ab_test_id: z.string().uuid(),
  variant: z.enum(['a', 'b']),
  visitor_id: z.string().min(1).max(200),
  event_type: z.enum(['page_view', 'add_to_cart']),
  session_id: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  const disabled = guardStoreBuilderPublicRoute()
  if (disabled) return disabled

  const rawBody = await req.json().catch(() => null)
  const parsed = eventBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    // 204 plutôt que 400 : cette route est publique et peut recevoir des
    // payloads malformés (bots, extensions navigateur) — pas la peine de
    // renvoyer une erreur exploitable côté attaquant.
    return new NextResponse(null, { status: 204 })
  }
  const { shop_domain, ab_test_id, variant, visitor_id, event_type, session_id } = parsed.data

  // Anti-spam/anti-bot basique — cf. spec A.3.
  const rl = await rateLimitAsync(`ab-events:${shop_domain}:${visitor_id}`, 20, 60_000)
  if (!rl.allowed) {
    return new NextResponse(null, { status: 204 })
  }

  // Le test doit exister, tourner, ET appartenir à une connexion dont le
  // shop_domain correspond — évite qu'un ab_test_id deviné/volé permette de
  // spammer des events sur le test d'un autre marchand.
  const { data: test } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('id, status, connection_id, shopify_store_connections!inner(shop_domain)')
    .eq('id', ab_test_id)
    .eq('status', 'running')
    .maybeSingle<{ id: string; status: string; connection_id: string; shopify_store_connections: { shop_domain: string } }>()

  if (!test || test.shopify_store_connections?.shop_domain !== shop_domain) {
    return new NextResponse(null, { status: 204 })
  }

  const { error } = await supabaseAdmin.from('store_builder_ab_events').insert({
    ab_test_id,
    variant,
    event_type,
    visitor_id,
    session_id: session_id ?? null,
  })

  if (error) {
    console.error('[shopify/events] insert failed:', error.message)
  }

  return new NextResponse(null, { status: 204 })
}
