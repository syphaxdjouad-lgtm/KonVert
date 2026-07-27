import { describe, it, expect } from 'vitest'
import { validateScrapeUrl } from './url-allow'

describe('validateScrapeUrl — AliExpress regional subdomains', () => {
  it('allows ar.aliexpress.com (the bug case)', () => {
    const result = validateScrapeUrl('https://ar.aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('allows he.aliexpress.com', () => {
    const result = validateScrapeUrl('https://he.aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('allows www.aliexpress.com', () => {
    const result = validateScrapeUrl('https://www.aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('allows fr.aliexpress.com', () => {
    const result = validateScrapeUrl('https://fr.aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('allows aliexpress.com bare host', () => {
    const result = validateScrapeUrl('https://aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('allows www.aliexpress.us', () => {
    const result = validateScrapeUrl('https://www.aliexpress.us/item/1005012713034400.html')
    expect(result.ok).toBe(true)
  })

  it('rejects evil-aliexpress.com (SSRF non-regression)', () => {
    const result = validateScrapeUrl('https://evil-aliexpress.com/item/x.html')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(403)
  })

  it('rejects aliexpress.com.attacker.com (SSRF non-regression)', () => {
    const result = validateScrapeUrl('https://aliexpress.com.attacker.com/item/x.html')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(403)
  })
})

describe('validateScrapeUrl — AliExpress regional subdomain normalization', () => {
  it.each(['ar', 'fr', 'he', 'es', 'ru', 'ko'])(
    'normalizes %s.aliexpress.com to www.aliexpress.com and keeps path + query',
    (sub) => {
      const result = validateScrapeUrl(`https://${sub}.aliexpress.com/item/1005006462079612.html?spm=abc&aff=xyz`)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.parsed.hostname).toBe('www.aliexpress.com')
        expect(result.parsed.pathname).toBe('/item/1005006462079612.html')
        expect(result.parsed.searchParams.get('spm')).toBe('abc')
        expect(result.parsed.searchParams.get('aff')).toBe('xyz')
      }
    }
  )

  it('normalizes bare aliexpress.com to www.aliexpress.com', () => {
    const result = validateScrapeUrl('https://aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.aliexpress.com')
  })

  it('leaves www.aliexpress.com unchanged', () => {
    const result = validateScrapeUrl('https://www.aliexpress.com/item/1005012713034400.html')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.aliexpress.com')
  })

  it('normalizes fr.aliexpress.us to www.aliexpress.us', () => {
    const result = validateScrapeUrl('https://fr.aliexpress.us/item/1005012713034400.html')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.aliexpress.us')
  })

  it('leaves www.aliexpress.us unchanged', () => {
    const result = validateScrapeUrl('https://www.aliexpress.us/item/1005012713034400.html')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.aliexpress.us')
  })

  it('does not touch non-AliExpress domains (amazon)', () => {
    const result = validateScrapeUrl('https://www.amazon.fr/dp/B0ABCDEFG')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.amazon.fr')
  })

  it('does not touch non-AliExpress domains (etsy)', () => {
    const result = validateScrapeUrl('https://www.etsy.com/listing/12345')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.parsed.hostname).toBe('www.etsy.com')
  })
})
