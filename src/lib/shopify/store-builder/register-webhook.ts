// Store Builder for Shopify — enregistrement du webhook `orders/paid`.
//
// Déclenché uniquement à la création du 1er test A/B d'une connexion (cf.
// spec KAKASHI §A.3 "Enregistrement du webhook" — pas à l'install initial,
// pour ne pas alourdir l'onboarding des marchands qui n'utilisent jamais
// l'A/B testing).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — aucun appel n'a encore
// touché un vrai store Shopify (Sprint 8, 2026-07-27).

import type { StoreBuilderContext, StoreBuilderResult } from './types'
import { shopifyAdminRequestWithRetry } from './client'

export interface WebhookRegistrationPayload {
  webhook: {
    topic: string
    address: string
    format: 'json'
  }
}

/** Pur — testable sans réseau. */
export function buildWebhookRegistrationPayload(topic: string, address: string): WebhookRegistrationPayload {
  return { webhook: { topic, address, format: 'json' } }
}

interface ShopifyWebhookApiResponse {
  webhook: { id: number; topic: string; address: string }
}

export async function registerOrdersPaidWebhook(
  ctx: StoreBuilderContext,
  address: string
): Promise<StoreBuilderResult<{ id: number }>> {
  const result = await shopifyAdminRequestWithRetry<ShopifyWebhookApiResponse>(ctx, '/webhooks.json', {
    method: 'POST',
    body: JSON.stringify(buildWebhookRegistrationPayload('orders/paid', address)),
  })

  if (!result.ok) {
    // 422 avec "address for this topic has already been taken" = déjà
    // enregistré (retry après un échec précédent, ou double-clic dashboard)
    // — pas une vraie erreur, mais on laisse l'appelant décider (best-effort,
    // non-bloquant, même pattern que theme_id dans install/route.ts).
    return result
  }

  return { ok: true, data: { id: result.data.webhook.id } }
}
