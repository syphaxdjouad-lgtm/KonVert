// POST /api/shopify/webhooks/orders-paid
//
// Webhook Shopify `orders/paid` — SEULE source de vérité pour l'attribution
// des achats A/B (cf. spec KAKASHI §A.3 "Attribution achats sans
// extension"). Lit `order.note_attributes` (propagés automatiquement par
// Shopify depuis `cart.attributes`, injectés par le snippet thème), insère
// l'event `purchase` correspondant.
//
// Sécurité : vérification HMAC obligatoire (`X-Shopify-Hmac-Sha256`) AVANT
// tout traitement — cf. verifyShopifyWebhookHmac. Le corps est lu en texte
// BRUT (`req.text()`) avant tout JSON.parse, le HMAC portant sur les octets
// exacts envoyés par Shopify.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — jamais reçu de vrai
// webhook Shopify (Sprint 8, 2026-07-27). Body/headers Shopify réels non
// vérifiés (écrit contre la doc publique).

import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyShopifyWebhookHmac, extractAbAttribution, getStoreBuilderApiSecret } from '@/lib/shopify/store-builder'
import { guardStoreBuilderPublicRoute } from '@/lib/store-builder/access'

export const maxDuration = 30
export const runtime = 'nodejs'

interface ShopifyOrderPaidPayload {
  id: number
  total_price?: string
  note_attributes?: { name: string; value: string }[]
}

export async function POST(req: NextRequest) {
  const disabled = guardStoreBuilderPublicRoute()
  if (disabled) return disabled

  const rawBody = await req.text()
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256')
  const shopHeader = req.headers.get('x-shopify-shop-domain')

  const secret = getStoreBuilderApiSecret()
  if (!verifyShopifyWebhookHmac(rawBody, hmacHeader, secret)) {
    console.error('[webhooks/orders-paid] HMAC invalide — requête rejetée.')
    return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
  }

  let payload: ShopifyOrderPaidPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Payload JSON invalide' }, { status: 400 })
  }

  try {
    const attribution = extractAbAttribution(payload.note_attributes)
    if (!attribution) {
      // Commande hors test A/B — rien à faire, ce n'est pas une erreur.
      return NextResponse.json({ received: true, attributed: false })
    }

    // Vérifie que le test appartient bien à la boutique qui a envoyé le
    // webhook — le secret HMAC est partagé par TOUTE l'app (pas par shop),
    // donc l'authenticité du header `x-shopify-shop-domain` doit être
    // recoupée avec la connexion réelle du test pour empêcher qu'une
    // boutique A rejoue une commande avec l'ab_test_id d'une boutique B.
    const { data: test } = await supabaseAdmin
      .from('store_builder_ab_tests')
      .select('id, status, connection_id, shopify_store_connections!inner(shop_domain)')
      .eq('id', attribution.abTestId)
      .maybeSingle<{ id: string; status: string; connection_id: string; shopify_store_connections: { shop_domain: string } }>()

    if (!test || test.shopify_store_connections?.shop_domain !== shopHeader) {
      console.warn('[webhooks/orders-paid] attribution test/shop mismatch — event ignoré.', {
        abTestId: attribution.abTestId,
        shopHeader,
      })
      return NextResponse.json({ received: true, attributed: false })
    }

    const totalPriceEur = payload.total_price ? Number(payload.total_price) : null
    const valueCents = totalPriceEur !== null && !Number.isNaN(totalPriceEur) ? Math.round(totalPriceEur * 100) : null

    // Dédup via la contrainte unique (ab_test_id, order_id) — absorbe les
    // retries webhook Shopify sans doublon (cf. migration).
    const { error: insertErr } = await supabaseAdmin.from('store_builder_ab_events').insert({
      ab_test_id: attribution.abTestId,
      variant: attribution.variant,
      event_type: 'purchase',
      visitor_id: attribution.visitorId,
      order_id: payload.id,
      value_cents: valueCents,
    })

    if (insertErr && insertErr.code !== '23505') {
      console.error('[webhooks/orders-paid] insert failed:', insertErr.message)
      Sentry.captureException(new Error(insertErr.message), { tags: { route: 'webhooks/orders-paid' } })
    }

    return NextResponse.json({ received: true, attributed: true })
  } catch (err) {
    console.error('[webhooks/orders-paid] erreur traitement:', err)
    Sentry.captureException(err, { tags: { route: 'webhooks/orders-paid' } })
    // 200 pour empêcher Shopify de rejouer indéfiniment un event qu'on a
    // déjà tenté de traiter — même doctrine que le webhook Stripe du repo.
    return NextResponse.json({ received: true, error: 'logged' })
  }
}
