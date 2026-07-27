import { describe, it, expect } from 'vitest'
import { buildWebhookRegistrationPayload } from '../register-webhook'

describe('buildWebhookRegistrationPayload', () => {
  it('construit le payload attendu par POST /webhooks.json', () => {
    expect(buildWebhookRegistrationPayload('orders/paid', 'https://konvertpilot.com/api/shopify/webhooks/orders-paid')).toEqual({
      webhook: {
        topic: 'orders/paid',
        address: 'https://konvertpilot.com/api/shopify/webhooks/orders-paid',
        format: 'json',
      },
    })
  })
})
