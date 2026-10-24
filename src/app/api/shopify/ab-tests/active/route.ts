// GET /api/shopify/ab-tests/active?shop=xxx.myshopify.com&product_id=123
//
// Route PUBLIQUE, cacheable (Cache-Control public max-age=60 — ne dépend pas
// du visiteur, cf. spec KAKASHI §A.2.2) — renvoie la config des tests A/B
// actifs pour un produit donné. Consommée par le snippet thème
// (theme-snippet.ts) qui calcule l'assignment localement (hash déterministe,
// jamais renvoyé par le serveur — cf. décision "swap client-side" §0 spec).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27).

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { guardStoreBuilderPublicRoute } from '@/lib/store-builder/access'

const querySchema = z.object({
  shop: z.string().regex(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/, 'shop invalide'),
  product_id: z.coerce.number().int().positive(),
})

interface ActiveTestRow {
  id: string
  field: 'h1_title' | 'description'
  variant_b_text: string
}

export async function GET(req: NextRequest) {
  const disabled = guardStoreBuilderPublicRoute()
  if (disabled) return disabled

  const parsed = querySchema.safeParse({
    shop: req.nextUrl.searchParams.get('shop'),
    product_id: req.nextUrl.searchParams.get('product_id'),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }
  const { shop, product_id } = parsed.data

  const { data: connection } = await supabaseAdmin
    .from('shopify_store_connections')
    .select('id')
    .eq('shop_domain', shop)
    .eq('product_id', product_id)
    .maybeSingle()

  if (!connection) {
    return NextResponse.json(
      { h1_title_test: null, description_test: null },
      { headers: { 'Cache-Control': 'public, max-age=60' } }
    )
  }

  const { data: tests } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('id, field, variant_b_text')
    .eq('connection_id', connection.id)
    .eq('status', 'running')
    .in('field', ['h1_title', 'description'])

  const rows = (tests ?? []) as ActiveTestRow[]
  const h1Test = rows.find((t) => t.field === 'h1_title')
  const descTest = rows.find((t) => t.field === 'description')

  return NextResponse.json(
    {
      h1_title_test: h1Test ? { id: h1Test.id, variant_b_text: h1Test.variant_b_text } : null,
      description_test: descTest ? { id: descTest.id, variant_b_text: descTest.variant_b_text } : null,
    },
    { headers: { 'Cache-Control': 'public, max-age=60' } }
  )
}
