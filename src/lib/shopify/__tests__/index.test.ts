import { describe, it, expect, vi, afterEach } from 'vitest'
import crypto from 'crypto'
import {
  isValidShopDomain,
  verifyHmac,
  exchangeCodeForTokenWithCredentials,
} from '../index'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isValidShopDomain', () => {
  it('accepte un domaine *.myshopify.com valide', () => {
    expect(isValidShopDomain('mon-store.myshopify.com')).toBe(true)
    expect(isValidShopDomain('store123.myshopify.com')).toBe(true)
  })

  it('rejette un domaine sans le suffixe myshopify.com', () => {
    expect(isValidShopDomain('mon-store.evil.com')).toBe(false)
    expect(isValidShopDomain('mon-store.myshopify.com.evil.com')).toBe(false)
  })

  it('rejette un domaine avec majuscules (pas de canonicalisation dans le regex)', () => {
    expect(isValidShopDomain('Mon-Store.myshopify.com')).toBe(false)
  })

  it('rejette une chaîne vide, un path, ou une IP', () => {
    expect(isValidShopDomain('')).toBe(false)
    expect(isValidShopDomain('mon-store.myshopify.com/admin')).toBe(false)
    expect(isValidShopDomain('192.168.0.1')).toBe(false)
  })

  it("rejette un domaine commençant par un caractère spécial (tentative d'injection)", () => {
    expect(isValidShopDomain('-store.myshopify.com')).toBe(false)
    expect(isValidShopDomain('.myshopify.com')).toBe(false)
  })
})

describe('verifyHmac', () => {
  const secret = 'test-shopify-secret'

  function signQuery(query: Record<string, string>, hmacSecret: string): string {
    const message = Object.keys(query)
      .sort()
      .map((k) => `${k}=${query[k]}`)
      .join('&')
    return crypto.createHmac('sha256', hmacSecret).update(message).digest('hex')
  }

  it('valide une requête correctement signée', () => {
    const query = { shop: 'test.myshopify.com', code: 'abc123', state: 'xyz' }
    const hmac = signQuery(query, secret)
    expect(verifyHmac({ ...query, hmac }, secret)).toBe(true)
  })

  it('rejette une requête sans hmac', () => {
    const query = { shop: 'test.myshopify.com', code: 'abc123' }
    expect(verifyHmac(query, secret)).toBe(false)
  })

  it('rejette une requête avec un paramètre modifié après signature (tampering)', () => {
    const query = { shop: 'test.myshopify.com', code: 'abc123', state: 'xyz' }
    const hmac = signQuery(query, secret)
    // Le "shop" est modifié après coup — le HMAC ne doit plus correspondre.
    expect(verifyHmac({ ...query, shop: 'attacker.myshopify.com', hmac }, secret)).toBe(false)
  })

  it('rejette une requête signée avec le mauvais secret', () => {
    const query = { shop: 'test.myshopify.com', code: 'abc123' }
    const hmac = signQuery(query, 'wrong-secret')
    expect(verifyHmac({ ...query, hmac }, secret)).toBe(false)
  })
})

describe('exchangeCodeForTokenWithCredentials', () => {
  it('renvoie accessToken + scope sur une réponse 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ access_token: 'shpat_abc', scope: 'write_themes,write_products' }), {
          status: 200,
        })
      )
    )

    const result = await exchangeCodeForTokenWithCredentials('test.myshopify.com', 'code123', 'key', 'secret')
    expect(result).toEqual({ accessToken: 'shpat_abc', scope: 'write_themes,write_products' })
  })

  it('renvoie un scope vide (chaîne) si absent de la réponse Shopify', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: 'shpat_abc' }), { status: 200 }))
    )

    const result = await exchangeCodeForTokenWithCredentials('test.myshopify.com', 'code123', 'key', 'secret')
    expect(result.scope).toBe('')
  })

  it('throw une erreur explicite si Shopify renvoie une erreur HTTP', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('invalid_grant', { status: 400 })))

    await expect(
      exchangeCodeForTokenWithCredentials('test.myshopify.com', 'bad-code', 'key', 'secret')
    ).rejects.toThrow(/token exchange failed/i)
  })
})
