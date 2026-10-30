import { describe, it, expect } from 'vitest'
import { readJson } from './read-json'

describe('readJson', () => {
  it('parse une réponse JSON normale', async () => {
    const res = new Response(JSON.stringify({ success: true, data: 1 }), { status: 200 })
    expect(await readJson(res)).toEqual({ success: true, data: 1 })
  })

  it('renvoie un error lisible sur un 500 texte brut au lieu de jeter', async () => {
    const res = new Response('Internal Server Error', { status: 500 })
    const json = await readJson(res)
    expect(json.success).toBe(false)
    expect(json.error).toContain('HTTP 500')
    expect(json.error).not.toContain('Unexpected token')
  })

  it('message dédié pour un timeout 504', async () => {
    const res = new Response('<html>Gateway Timeout</html>', { status: 504 })
    expect((await readJson(res)).error).toContain('trop de temps')
  })

  it('renvoie un objet vide sur un corps vide', async () => {
    expect(await readJson(new Response(null, { status: 204 }))).toEqual({})
  })
})
