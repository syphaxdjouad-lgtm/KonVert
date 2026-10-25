// Store Builder for Shopify — vérification HMAC des webhooks entrants.
//
// Shopify signe chaque payload webhook avec HMAC-SHA256 (clé = client secret
// de l'app), encodé en base64, envoyé dans le header `X-Shopify-Hmac-Sha256`.
// Vérification obligatoire avant tout traitement — sans ça, n'importe qui
// peut POST un faux `orders/paid` et fabriquer des ventes/gagnants A/B.
// cf. https://shopify.dev/docs/apps/build/webhooks/subscribe/https#step-3-validate-the-webhook
//
// Distinct de `verifyHmac` (src/lib/shopify/index.ts) qui vérifie le HMAC
// des query params du flow OAuth (algorithme différent : query params triés
// et joints, pas le corps brut de la requête).

import crypto from 'crypto'

/**
 * Vérifie la signature HMAC-SHA256 (base64) d'un webhook Shopify contre le
 * corps BRUT de la requête (avant tout JSON.parse — le HMAC porte sur les
 * octets exacts envoyés par Shopify).
 *
 * `timingSafeEqual` exige des buffers de même longueur : si les longueurs
 * diffèrent, la signature est nécessairement invalide (retour rapide, pas de
 * comparaison — timingSafeEqual lèverait sinon une exception).
 */
export function verifyShopifyWebhookHmac(
  rawBody: string,
  hmacHeader: string | null | undefined,
  secret: string
): boolean {
  if (!hmacHeader || !secret) return false

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')

  const expected = Buffer.from(digest)
  const received = Buffer.from(hmacHeader)
  if (expected.length !== received.length) return false

  return crypto.timingSafeEqual(expected, received)
}
