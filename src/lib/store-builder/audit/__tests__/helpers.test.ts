import { describe, it, expect } from 'vitest'
import {
  countWordsFromHtml,
  hasUnresolvedBracketToken,
  htmlContainsProductJsonLd,
  isRealTestimonial,
  TESTIMONIAL_AUTHOR_PLACEHOLDER,
  TESTIMONIAL_QUOTE_PLACEHOLDER,
} from '../helpers'

describe('isRealTestimonial', () => {
  it('false pour un bloc placeholder inchangé', () => {
    expect(
      isRealTestimonial({ authorName: TESTIMONIAL_AUTHOR_PLACEHOLDER, quote: TESTIMONIAL_QUOTE_PLACEHOLDER, rating: 0 })
    ).toBe(false)
  })

  it('false si rating = 0 même avec un vrai texte', () => {
    expect(isRealTestimonial({ authorName: 'Marie D.', quote: 'Super produit !', rating: 0 })).toBe(false)
  })

  it('false si author_name vide', () => {
    expect(isRealTestimonial({ authorName: '', quote: 'Super produit !', rating: 5 })).toBe(false)
  })

  it('true pour un avis complet et réel', () => {
    expect(isRealTestimonial({ authorName: 'Marie D.', quote: 'Super produit, livraison rapide.', rating: 5 })).toBe(true)
  })
})

describe('hasUnresolvedBracketToken', () => {
  it('détecte un token [xxx] restant', () => {
    expect(hasUnresolvedBracketToken("Je m'appelle [Votre prénom] et j'ai fondé...")).toBe(true)
  })

  it('ne détecte rien sur un texte sans crochets', () => {
    expect(hasUnresolvedBracketToken("Je m'appelle Marie et j'ai fondé cette marque en 2022 à Lyon.")).toBe(false)
  })

  it('ignore les crochets vides []', () => {
    expect(hasUnresolvedBracketToken('Texte avec [] vide')).toBe(false)
  })
})

describe('countWordsFromHtml', () => {
  it('compte les mots en ignorant les balises HTML', () => {
    expect(countWordsFromHtml('<p>Un <strong>super</strong> produit</p>')).toBe(3)
  })

  it('renvoie 0 pour une chaîne vide ou uniquement des balises', () => {
    expect(countWordsFromHtml('')).toBe(0)
    expect(countWordsFromHtml('<p></p><br/>')).toBe(0)
  })

  it('&nbsp; sépare bien les mots (converti en espace, pas concaténé)', () => {
    expect(countWordsFromHtml('Un&nbsp;super&nbsp;produit')).toBe(3)
  })
})

describe('htmlContainsProductJsonLd', () => {
  it('détecte un script ld+json avec @type Product', () => {
    const html = `<html><head><script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Test"}</script></head></html>`
    expect(htmlContainsProductJsonLd(html)).toBe(true)
  })

  it("renvoie false si aucun script ld+json n'est présent", () => {
    expect(htmlContainsProductJsonLd('<html><head></head><body>Rien ici</body></html>')).toBe(false)
  })

  it('renvoie false si le script ld+json existe mais ne décrit pas un Product', () => {
    const html = `<script type="application/ld+json">{"@type":"BreadcrumbList"}</script>`
    expect(htmlContainsProductJsonLd(html)).toBe(false)
  })
})
