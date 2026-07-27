import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  STORE_BUILDER_SCOPES,
  buildStoreBuilderOAuthUrl,
  getStoreBuilderApiKey,
  getStoreBuilderApiSecret,
} from '../oauth'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('buildStoreBuilderOAuthUrl', () => {
  it("construit une URL d'autorisation vers le bon shop avec les scopes Store Builder", () => {
    vi.stubEnv('SHOPIFY_STORE_BUILDER_API_KEY', 'sb-key')
    const url = new URL(buildStoreBuilderOAuthUrl('test.myshopify.com', 'state123'))

    expect(url.origin).toBe('https://test.myshopify.com')
    expect(url.pathname).toBe('/admin/oauth/authorize')
    expect(url.searchParams.get('client_id')).toBe('sb-key')
    expect(url.searchParams.get('scope')).toBe(STORE_BUILDER_SCOPES)
    expect(url.searchParams.get('state')).toBe('state123')
    expect(url.searchParams.get('redirect_uri')).toMatch(/\/api\/shopify\/store-builder\/callback$/)
  })

  it('inclut write_themes, write_products et read_products dans les scopes envoyés', () => {
    const url = new URL(buildStoreBuilderOAuthUrl('test.myshopify.com', 'state123'))
    const scope = url.searchParams.get('scope') ?? ''
    expect(scope).toContain('write_themes')
    expect(scope).toContain('write_products')
    expect(scope).toContain('read_products')
  })
})

describe('getStoreBuilderApiKey / getStoreBuilderApiSecret', () => {
  it('utilise les env vars dédiées Store Builder si présentes', () => {
    vi.stubEnv('SHOPIFY_STORE_BUILDER_API_KEY', 'sb-key')
    vi.stubEnv('SHOPIFY_STORE_BUILDER_API_SECRET', 'sb-secret')
    expect(getStoreBuilderApiKey()).toBe('sb-key')
    expect(getStoreBuilderApiSecret()).toBe('sb-secret')
  })

  it('retombe sur les identifiants page-builder si les env vars dédiées sont absentes', () => {
    vi.stubEnv('SHOPIFY_STORE_BUILDER_API_KEY', '')
    vi.stubEnv('SHOPIFY_STORE_BUILDER_API_SECRET', '')
    vi.stubEnv('SHOPIFY_API_KEY', 'pb-key')
    vi.stubEnv('SHOPIFY_API_SECRET', 'pb-secret')
    expect(getStoreBuilderApiKey()).toBe('pb-key')
    expect(getStoreBuilderApiSecret()).toBe('pb-secret')
  })
})
