import { describe, it, expect, vi, afterEach } from 'vitest'
import { uploadTheme } from '../upload-theme'
import type { StoreBuilderContext } from '../types'

const ctx: StoreBuilderContext = {
  shopDomain: 'test-store.myshopify.com',
  accessToken: 'shpat_fake_token',
  apiVersion: '2025-10',
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status })
}

afterEach(() => {
  vi.unstubAllGlobals()
  delete process.env.KONVERT_THEME_ZIP_URL
})

describe('uploadTheme', () => {
  it("échoue en INVALID_PAYLOAD si ni zipUrl, ni env var, ni assets ne sont fournis", async () => {
    const result = await uploadTheme(ctx, { name: 'Konvert CRO - V1' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_PAYLOAD')
      expect(result.error.message).toMatch(/hébergement/i)
    }
  })

  it('utilise la stratégie "src zip" quand zipUrl est fourni (1 seul appel API)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, { theme: { id: 1, name: 'Konvert CRO - V1', role: 'unpublished', created_at: '2026-07-27' } })
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await uploadTheme(ctx, { name: 'Konvert CRO - V1', zipUrl: 'https://cdn.example.com/theme.zip' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data).toEqual({ id: 1, name: 'Konvert CRO - V1', role: 'unpublished', createdAt: '2026-07-27' })
  })

  it('lit KONVERT_THEME_ZIP_URL en fallback si zipUrl absent du param', async () => {
    process.env.KONVERT_THEME_ZIP_URL = 'https://cdn.example.com/from-env.zip'
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, { theme: { id: 2, name: 'Konvert CRO - V1', role: 'unpublished', created_at: '2026-07-27' } })
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await uploadTheme(ctx, { name: 'Konvert CRO - V1' })
    expect(result.ok).toBe(true)

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(options.body as string)
    expect(body.theme.src).toBe('https://cdn.example.com/from-env.zip')
  })

  it('fallback thème vide + assets un par un quand aucun zipUrl (env absent)', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(200, { theme: { id: 3, name: 'Konvert CRO - V1', role: 'unpublished', created_at: '2026-07-27' } })
      )
      .mockResolvedValueOnce(jsonResponse(200, { asset: { key: 'layout/theme.liquid' } }))
      .mockResolvedValueOnce(jsonResponse(200, { asset: { key: 'config/settings_schema.json' } }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await uploadTheme(ctx, {
      name: 'Konvert CRO - V1',
      assets: {
        'layout/theme.liquid': '<html></html>',
        'config/settings_schema.json': '[]',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.id).toBe(3)
  })

  it('renvoie une erreur détaillée si un asset échoue à uploader', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(200, { theme: { id: 4, name: 'Konvert CRO - V1', role: 'unpublished', created_at: '2026-07-27' } })
      )
      .mockResolvedValueOnce(jsonResponse(422, { errors: 'invalid asset' }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await uploadTheme(ctx, {
      name: 'Konvert CRO - V1',
      assets: { 'layout/theme.liquid': '<html></html>' },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toMatch(/layout\/theme\.liquid/)
      expect(result.error.detail).toMatchObject({ themeId: 4 })
    }
  })
})
