import { describe, it, expect, vi, afterEach } from 'vitest'
import { shopifyAdminRequest, shopifyAdminRequestWithRetry } from '../client'
import type { StoreBuilderContext } from '../types'

const ctx: StoreBuilderContext = {
  shopDomain: 'test-store.myshopify.com',
  accessToken: 'shpat_fake_token',
  apiVersion: '2025-10',
}

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('shopifyAdminRequest', () => {
  it('renvoie ok:true avec les données sur 200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(200, { shop: { id: 1 } })))
    const result = await shopifyAdminRequest<{ shop: { id: number } }>(ctx, '/shop.json')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.shop.id).toBe(1)
  })

  it('mappe 429 en RATE_LIMITED avec retryAfterMs depuis le header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(429, { errors: 'rate limited' }, { 'Retry-After': '2' }))
    )
    const result = await shopifyAdminRequest(ctx, '/themes.json')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('RATE_LIMITED')
      expect(result.error.retryAfterMs).toBe(2000)
    }
  })

  it('mappe 401 en UNAUTHORIZED', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(401, { errors: 'invalid token' })))
    const result = await shopifyAdminRequest(ctx, '/themes.json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED')
  })

  it('mappe 403 en FORBIDDEN_SCOPE avec message actionnable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(403, { errors: 'forbidden' })))
    const result = await shopifyAdminRequest(ctx, '/themes.json')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('FORBIDDEN_SCOPE')
      expect(result.error.message).toMatch(/scope/i)
    }
  })

  it('mappe 422 en INVALID_PAYLOAD', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(422, { errors: { title: ["can't be blank"] } })))
    const result = await shopifyAdminRequest(ctx, '/products.json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('INVALID_PAYLOAD')
  })

  it('mappe 404 en NOT_FOUND', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(404, { errors: 'Not Found' })))
    const result = await shopifyAdminRequest(ctx, '/themes/999.json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND')
  })

  it('mappe une erreur réseau (fetch qui throw) en NETWORK_ERROR', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fetch failed')))
    const result = await shopifyAdminRequest(ctx, '/shop.json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('NETWORK_ERROR')
  })

  it('mappe un AbortError timeout en TIMEOUT', async () => {
    const timeoutError = new Error('The operation was aborted')
    timeoutError.name = 'TimeoutError'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeoutError))
    const result = await shopifyAdminRequest(ctx, '/shop.json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('TIMEOUT')
  })

  it('gère un 204 No Content sans tenter de parser du JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))
    const result = await shopifyAdminRequest(ctx, '/themes/1/assets.json', { method: 'DELETE' })
    expect(result.ok).toBe(true)
  })
})

describe('shopifyAdminRequestWithRetry', () => {
  it('retry sur RATE_LIMITED puis réussit', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(429, { errors: 'rate limited' }, { 'Retry-After': '0.01' }))
      .mockResolvedValueOnce(jsonResponse(200, { shop: { id: 1 } }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await shopifyAdminRequestWithRetry<{ shop: { id: number } }>(ctx, '/shop.json')
    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("ne retry jamais sur UNAUTHORIZED (pas d'auto-retry sur erreur d'auth)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(401, { errors: 'invalid' }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await shopifyAdminRequestWithRetry(ctx, '/shop.json')
    expect(result.ok).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
