import { describe, it, expect } from 'vitest'
import { sanitizeRichTextP } from '../sanitize-richtext'

describe('sanitizeRichTextP', () => {
  it('laisse passer <p>/</p> propres', () => {
    const input = '<p>Bonjour</p><p>Deuxième paragraphe</p>'
    expect(sanitizeRichTextP(input)).toBe(input)
  })

  it('neutralise une balise <script> en texte visible échappé', () => {
    const input = '<p>Bonjour</p><script>alert(1)</script>'
    const out = sanitizeRichTextP(input)
    expect(out).not.toContain('<script>')
    expect(out).toContain('&lt;script&gt;')
  })

  it('supprime les attributs dangereux sur une balise <p> autorisée', () => {
    const input = '<p onclick="alert(1)">Texte</p>'
    const out = sanitizeRichTextP(input)
    expect(out).toBe('<p>Texte</p>')
    expect(out).not.toContain('onclick')
  })

  it('neutralise un <a href="javascript:...">', () => {
    const input = '<p>Cliquez <a href="javascript:alert(1)">ici</a></p>'
    const out = sanitizeRichTextP(input)
    expect(out).not.toContain('<a ')
    expect(out).toContain('&lt;a href=')
  })

  it('neutralise <iframe> et <img onerror>', () => {
    const iframe = sanitizeRichTextP('<iframe src="evil.com"></iframe>')
    expect(iframe).not.toContain('<iframe')

    const img = sanitizeRichTextP('<img src=x onerror=alert(1)>')
    expect(img).not.toContain('<img')
  })

  it('conserve du texte brut sans balises tel quel', () => {
    expect(sanitizeRichTextP('Aucune balise ici, juste du texte.')).toBe('Aucune balise ici, juste du texte.')
  })
})
