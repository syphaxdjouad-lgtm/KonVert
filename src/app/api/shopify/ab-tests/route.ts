// /api/shopify/ab-tests — CRUD authentifié (dashboard Konvert, UI = OBITO
// plus tard — ce sprint livre le backend + endpoints uniquement).
//
// POST : crée un test A/B sur un champ (h1_title|description). Snapshot
//        automatique de la variante A (= product.title/body_html actuel via
//        Admin API) — le marchand ne fournit QUE la variante B (challenger).
// GET  : liste les tests d'une connexion (`?connection_id=`) avec stats
//        live calculées depuis store_builder_ab_events (cf. compute-stats.ts).
//
// Cf. spec KAKASHI §A.1/A.3/A.5 (docs/store-builder-sprint8-spec.md).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 8, 2026-07-27) :
// aucune UI dashboard ne consomme encore cette route. Migration
// `20260727_store_builder_ab.sql` NON appliquée en base — tâche manuelle
// founder.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { decryptToken } from '@/lib/shopify'
import {
  DEFAULT_STORE_BUILDER_API_VERSION,
  hasReadOrdersScope,
  registerOrdersPaidWebhook,
  shopifyAdminRequest,
  type StoreBuilderContext,
} from '@/lib/shopify/store-builder'
import { getAppUrl } from '@/lib/env'
import { computeAbTestStats } from '@/lib/store-builder/ab-testing/compute-stats'
import { guardStoreBuilderUserRoute } from '@/lib/store-builder/access'

const createBodySchema = z.object({
  connection_id: z.string().uuid('connection_id doit être un UUID'),
  field: z.enum(['h1_title', 'description']),
  variant_b_text: z.string().min(1, 'La variante B ne peut pas être vide').max(5000),
})

interface OwnedConnection {
  id: string
  shop_domain: string
  access_token: string
  scopes: string
  product_id: number | null
}

async function requireOwnedConnection(userId: string, connectionId: string): Promise<OwnedConnection | null> {
  const { data } = await supabaseAdmin
    .from('shopify_store_connections')
    .select('id, shop_domain, access_token, scopes, product_id')
    .eq('id', connectionId)
    .eq('user_id', userId)
    .maybeSingle()
  return (data as OwnedConnection | null) ?? null
}

export async function POST(req: NextRequest) {
  const gate = await guardStoreBuilderUserRoute()
  if (!gate.ok) return gate.response

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } }, { status: 401 })
  }

  const rl = await rateLimitAsync(`ab-test-create:${user.id}`, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED', message: 'Trop de créations de test.' } }, { status: 429 })
  }

  const rawBody = await req.json().catch(() => null)
  const parsed = createBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'Payload invalide', details: parsed.error.flatten() } },
      { status: 400 }
    )
  }
  const { connection_id, field, variant_b_text } = parsed.data

  const connection = await requireOwnedConnection(user.id, connection_id)
  if (!connection) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Connexion Store Builder introuvable' } }, { status: 404 })
  }
  if (!connection.product_id) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'NOT_INSTALLED',
          message: "Aucun produit installé sur cette connexion — lance d'abord l'install Store Builder.",
        },
      },
      { status: 409 }
    )
  }

  const ctx: StoreBuilderContext = {
    shopDomain: connection.shop_domain,
    accessToken: decryptToken(connection.access_token),
    apiVersion: DEFAULT_STORE_BUILDER_API_VERSION,
  }

  // Snapshot de la variante A = contenu live actuel (jamais modifié après),
  // cf. spec A.1 — on va chercher la source de vérité côté Shopify plutôt
  // que de faire confiance à un état local qui pourrait être désynchronisé.
  const productResult = await shopifyAdminRequest<{ product: { title: string; body_html: string | null } }>(
    ctx,
    `/products/${connection.product_id}.json`
  )
  if (!productResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: 'SHOPIFY_ERROR', message: 'Impossible de lire le produit Shopify pour snapshot la variante A.', detail: productResult.error } },
      { status: 502 }
    )
  }
  const variantAText = field === 'h1_title' ? productResult.data.product.title : (productResult.data.product.body_html ?? '')

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .insert({
      user_id: user.id,
      connection_id,
      field,
      variant_a_text: variantAText,
      variant_b_text,
      status: 'running',
    })
    .select('id, field, variant_a_text, variant_b_text, status, started_at')
    .single()

  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json(
        { ok: false, error: { code: 'CONFLICT', message: 'Un test est déjà en cours sur ce champ pour cette boutique.' } },
        { status: 409 }
      )
    }
    console.error('[ab-tests] create failed:', insertErr.message)
    return NextResponse.json({ ok: false, error: { code: 'UNKNOWN', message: 'Impossible de créer le test A/B' } }, { status: 500 })
  }

  // Lazy scope upgrade + enregistrement webhook orders/paid — UNIQUEMENT au
  // 1er test A/B de la connexion, cf. spec §A.3. Best-effort, non-bloquant :
  // le test tourne déjà (page_view/add_to_cart trackés) même sans ce scope,
  // seule l'attribution des achats en dépend.
  let warning: string | undefined
  let reauthUrl: string | undefined

  if (!hasReadOrdersScope(connection.scopes)) {
    warning =
      "Le scope 'read_orders' manque sur cette connexion — les achats ne pourront pas être attribués à ce test tant " +
      "que la boutique n'est pas reconnectée."
    reauthUrl = `${getAppUrl()}/api/shopify/store-builder/connect?shop=${encodeURIComponent(connection.shop_domain)}&upgrade=ab_test`
  } else {
    const { count: priorTestsCount } = await supabaseAdmin
      .from('store_builder_ab_tests')
      .select('id', { count: 'exact', head: true })
      .eq('connection_id', connection_id)

    if ((priorTestsCount ?? 0) <= 1) {
      // <= 1 car le test qu'on vient d'insérer compte déjà.
      const address = `${getAppUrl()}/api/shopify/webhooks/orders-paid`
      const webhookResult = await registerOrdersPaidWebhook(ctx, address)
      if (!webhookResult.ok) {
        console.error('[ab-tests] webhook orders/paid registration failed (non-blocking):', webhookResult.error)
        warning = "L'enregistrement du webhook de commandes a échoué — l'attribution des achats pourrait ne pas fonctionner. Contacte le support si le problème persiste."
      }
    }
  }

  return NextResponse.json({ ok: true, data: inserted, warning, reauth_url: reauthUrl })
}

export async function GET(req: NextRequest) {
  const gate = await guardStoreBuilderUserRoute()
  if (!gate.ok) return gate.response

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } }, { status: 401 })
  }

  const connectionId = req.nextUrl.searchParams.get('connection_id')
  if (!connectionId) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_PAYLOAD', message: 'connection_id requis' } }, { status: 400 })
  }

  const connection = await requireOwnedConnection(user.id, connectionId)
  if (!connection) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Connexion Store Builder introuvable' } }, { status: 404 })
  }

  const { data: tests, error } = await supabaseAdmin
    .from('store_builder_ab_tests')
    .select('*')
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'UNKNOWN', message: 'Erreur de lecture' } }, { status: 500 })
  }

  const data = await Promise.all(
    (tests ?? []).map(async (test) => {
      const stats = await computeAbTestStats(supabaseAdmin, test.id, test.started_at)
      return { ...test, stats }
    })
  )

  return NextResponse.json({ ok: true, data })
}
