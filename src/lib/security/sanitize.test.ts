import { describe, it, expect } from 'vitest'
import { escapeHtmlText, safeImageUrl, sanitizeDeep } from './sanitize'

describe('escapeHtmlText', () => {
  it('escape script tag', () => {
    expect(escapeHtmlText('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('escape attribute breakout', () => {
    expect(escapeHtmlText('" onerror="x')).toBe('&quot; onerror=&quot;x')
  })

  it('escape single quote', () => {
    expect(escapeHtmlText("hello' world")).toBe('hello&#39; world')
  })

  it('keep ampersand untouched', () => {
    expect(escapeHtmlText('Marshall & sons')).toBe('Marshall & sons')
  })

  it('returns empty for null/undefined', () => {
    expect(escapeHtmlText(null)).toBe('')
    expect(escapeHtmlText(undefined)).toBe('')
  })

  it('preserves accents and unicode', () => {
    expect(escapeHtmlText('Tarif 100€ — café')).toBe('Tarif 100€ — café')
  })
})

describe('safeImageUrl', () => {
  it('accepts valid https url', () => {
    expect(safeImageUrl('https://cdn.shopify.com/img.jpg')).toBe('https://cdn.shopify.com/img.jpg')
  })

  it('accepts valid http url', () => {
    expect(safeImageUrl('http://example.com/img.png')).toBe('http://example.com/img.png')
  })

  it('rejects javascript: protocol', () => {
    expect(safeImageUrl('javascript:alert(1)')).toBeNull()
  })

  it('rejects data: protocol', () => {
    expect(safeImageUrl('data:image/png;base64,abc')).toBeNull()
  })

  it('rejects file: protocol', () => {
    expect(safeImageUrl('file:///etc/passwd')).toBeNull()
  })

  it('rejects URL with double quote (attribute breakout)', () => {
    expect(safeImageUrl('https://x.com/a"onerror=x')).toBeNull()
  })

  it('rejects URL with space (browser would interpret as 2 attributes)', () => {
    expect(safeImageUrl('https://x.com/a b.jpg')).toBeNull()
  })

  it('rejects empty string', () => {
    expect(safeImageUrl('')).toBeNull()
  })

  it('rejects non-string input', () => {
    expect(safeImageUrl(123)).toBeNull()
    expect(safeImageUrl(null)).toBeNull()
    expect(safeImageUrl(undefined)).toBeNull()
  })

  it('rejects malformed URL', () => {
    expect(safeImageUrl('not-a-url')).toBeNull()
  })
})

describe('sanitizeDeep', () => {
  it('escapes string in object', () => {
    expect(sanitizeDeep({ a: '<x>' })).toEqual({ a: '&lt;x&gt;' })
  })

  it('escapes strings in array', () => {
    expect(sanitizeDeep(['<a>', '<b>'])).toEqual(['&lt;a&gt;', '&lt;b&gt;'])
  })

  it('traverses deeply nested structures', () => {
    expect(sanitizeDeep({ a: { b: ['<c>', { d: '<e>' }] } })).toEqual({
      a: { b: ['&lt;c&gt;', { d: '&lt;e&gt;' }] },
    })
  })

  it('preserves numbers, booleans, null', () => {
    expect(sanitizeDeep({ n: 42, b: true, x: null })).toEqual({ n: 42, b: true, x: null })
  })

  it('handles empty input', () => {
    expect(sanitizeDeep({})).toEqual({})
    expect(sanitizeDeep([])).toEqual([])
  })

  it('caps recursion at depth 32 (anti-stack-overflow)', () => {
    type Recursive = { x: Recursive | string }
    let nested: Recursive = { x: '<deep>' }
    for (let i = 0; i < 50; i++) nested = { x: nested }
    // Doit pas crasher même si la string profonde n'est pas escape
    expect(() => sanitizeDeep(nested)).not.toThrow()
  })
})
