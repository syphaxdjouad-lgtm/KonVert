import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import { verifyShopifyWebhookHmac } from '../webhook-hmac'

function sign(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
}

describe('verifyShopifyWebhookHmac', () => {
  const secret = 'shpss_test_secret_value'
  const body = JSON.stringify({ id: 123, note_attributes: [] })

  it('valide une signature correcte', () => {
    const hmac = sign(body, secret)
    expect(verifyShopifyWebhookHmac(body, hmac, secret)).toBe(true)
  })

  it('rejette une signature incorrecte', () => {
    expect(verifyShopifyWebhookHmac(body, 'not-a-valid-signature==', secret)).toBe(false)
  })

  it('rejette si le secret utilisé pour vérifier diffère de celui qui a signé', () => {
    const hmac = sign(body, secret)
    expect(verifyShopifyWebhookHmac(body, hmac, 'wrong-secret')).toBe(false)
  })

  it('rejette si le corps a été altéré après signature', () => {
    const hmac = sign(body, secret)
    const tamperedBody = JSON.stringify({ id: 999, note_attributes: [] })
    expect(verifyShopifyWebhookHmac(tamperedBody, hmac, secret)).toBe(false)
  })

  it('rejette un header manquant', () => {
    expect(verifyShopifyWebhookHmac(body, null, secret)).toBe(false)
    expect(verifyShopifyWebhookHmac(body, undefined, secret)).toBe(false)
    expect(verifyShopifyWebhookHmac(body, '', secret)).toBe(false)
  })

  it('rejette un secret vide sans planter', () => {
    const hmac = sign(body, secret)
    expect(verifyShopifyWebhookHmac(body, hmac, '')).toBe(false)
  })

  it('ne plante pas sur des longueurs de buffer différentes (pas de throw timingSafeEqual)', () => {
    expect(() => verifyShopifyWebhookHmac(body, 'short', secret)).not.toThrow()
    expect(verifyShopifyWebhookHmac(body, 'short', secret)).toBe(false)
  })
})
