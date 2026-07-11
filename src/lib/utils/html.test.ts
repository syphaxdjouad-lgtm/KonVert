import { describe, it, expect } from 'vitest'
import { escapeHtml, escapeAttr } from './html'

describe('escapeHtml', () => {
  it('escapes &, <, >, "', () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;')
  })

  it('does not escape single quotes', () => {
    expect(escapeHtml("it's a test")).toBe("it's a test")
  })
})

describe('escapeAttr', () => {
  it('escapes double quotes (breaks out of src="...")', () => {
    expect(escapeAttr('https://evil.com/x.jpg" onerror="alert(1)')).toBe(
      'https://evil.com/x.jpg&quot; onerror=&quot;alert(1)'
    )
  })

  it('escapes single quotes too (defense for single-quoted attrs)', () => {
    expect(escapeAttr("https://evil.com/x.jpg' onerror='alert(1)")).toBe(
      'https://evil.com/x.jpg&#39; onerror=&#39;alert(1)'
    )
  })

  it('escapes angle brackets and ampersands like escapeHtml', () => {
    expect(escapeAttr('<script>&</script>')).toBe('&lt;script&gt;&amp;&lt;/script&gt;')
  })

  it('leaves a clean URL untouched', () => {
    const url = 'https://images.unsplash.com/photo-123?w=800&q=80'
    // & est légitimement présent dans une query string — reste échappé en &amp;
    // (cohérent avec un attribut HTML valide, le navigateur le dé-échappe à l'affichage)
    expect(escapeAttr(url)).toBe('https://images.unsplash.com/photo-123?w=800&amp;q=80')
  })
})
