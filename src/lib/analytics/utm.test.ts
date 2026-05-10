import { describe, it, expect } from 'vitest'
import { encodeUtm, decodeUtm } from './utm'

describe('encodeUtm / decodeUtm — round-trip', () => {
  it('roundtrip preserve toutes les keys', () => {
    const data = {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'launch_2026',
      utm_term: 'landing pages',
      utm_content: 'ad_variant_a',
      gclid: 'abc123',
      fbclid: 'def456',
      ttclid: 'ghi789',
      ts: 1234567890,
      landing: '/essai',
      referrer: 'https://google.com',
    }
    const encoded = encodeUtm(data)
    const decoded = decodeUtm(encoded)
    expect(decoded).toEqual(data)
  })

  it('decodeUtm renvoie null pour input vide', () => {
    expect(decodeUtm(undefined)).toBeNull()
    expect(decodeUtm(null)).toBeNull()
    expect(decodeUtm('')).toBeNull()
  })

  it('decodeUtm renvoie null pour JSON corrompu (defensive)', () => {
    expect(decodeUtm('not-valid-json-or-base64')).toBeNull()
    expect(decodeUtm('%7Bnot-json%7D')).toBeNull()
  })

  it('handle caracteres speciaux dans les valeurs (e-commerce keywords)', () => {
    const data = {
      utm_term: 'café & croissants — 100€',
      utm_campaign: 'halloween/2026',
    }
    const encoded = encodeUtm(data)
    const decoded = decodeUtm(encoded)
    expect(decoded?.utm_term).toBe('café & croissants — 100€')
    expect(decoded?.utm_campaign).toBe('halloween/2026')
  })

  it('handle objet vide', () => {
    expect(decodeUtm(encodeUtm({}))).toEqual({})
  })
})
