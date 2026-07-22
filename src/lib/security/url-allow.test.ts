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
