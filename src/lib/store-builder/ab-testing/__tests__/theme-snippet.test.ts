import { describe, it, expect } from 'vitest'
import { buildAbTestSnippet } from '../theme-snippet'
import { fnv1aHash } from '../hash'

describe('buildAbTestSnippet', () => {
  const snippet = buildAbTestSnippet('https://konvertpilot.com/')

  it('est un script JS syntaxiquement valide (parseable)', () => {
    // new Function() lève une SyntaxError si le corps n'est pas du JS valide.
    // Ne PAS invoquer la fonction (elle référence `document`/`window`,
    // absents en environnement Node) — seule la validité syntaxique compte.
    expect(() => new Function(snippet)).not.toThrow()
  })

  it("normalise l'URL de base (retire le trailing slash)", () => {
    expect(snippet).toContain("var API_BASE = 'https://konvertpilot.com';")
    expect(snippet).not.toContain("konvertpilot.com/';")
  })

  it('utilise le même nom de cookie que la constante partagée', () => {
    expect(snippet).toContain("var COOKIE_NAME = '_kv_ab';")
  })

  it('appelle bien les endpoints attendus', () => {
    expect(snippet).toContain('/api/shopify/ab-tests/active')
    expect(snippet).toContain('/api/shopify/events')
  })

  it('injecte les 3 attributs cart requis pour attribution order.note_attributes', () => {
    expect(snippet).toContain('attributes[konvert_ab_test_id]')
    expect(snippet).toContain('attributes[konvert_ab_variant]')
    expect(snippet).toContain('attributes[konvert_ab_visitor_id]')
  })

  it('cible des sélecteurs Dawn stables (jamais un id — golden rule konvert-dawn : ne pas éditer main-product.liquid)', () => {
    expect(snippet).toContain('.product__title h1, .product__title h2')
    expect(snippet).toContain('.product__description')
    expect(snippet).not.toContain('getElementById')
  })

  it("s'enregistre comme custom element <konvert-ab-test>, posé par une section Konvert dédiée (pas un fichier Dawn core)", () => {
    expect(snippet).toContain("customElements.define('konvert-ab-test'")
    expect(snippet).toContain('connectedCallback')
    expect(snippet).toContain("this.getAttribute('data-product-id')")
  })

  it('utilise sendBeacon pour add_to_cart (survit à la navigation) et fetch keepalive pour page_view', () => {
    expect(snippet).toContain('sendBeacon')
    expect(snippet).toContain('keepalive: true')
  })

  it('reste compact — taille raisonnable pour un script bloquant le render (cf. spec: cible < 2 Ko une fois minifié par un vrai minifier/gzip, non simulé ici)', () => {
    const roughlyStripped = snippet.replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim()
    // Le code source non-minifié (noms de variables lisibles, pas de mangling)
    // ne peut pas tenir sous 2 Ko — seul un vrai minifier (terser) y arrive.
    // On vérifie juste l'absence de bloat au-delà d'un budget raisonnable.
    expect(roughlyStripped.length).toBeLessThan(6000)
  })

  it("l'implémentation FNV-1a du snippet produit le MÊME hash que la version serveur (non-régression)", () => {
    // Exécute le fnv1aHash extrait du snippet dans une sandbox Function et
    // compare bit-à-bit avec l'implémentation serveur — garantit que
    // l'assignment client et le calcul serveur (ex: recompute côté API)
    // restent cohérents si l'un des deux fichiers est modifié sans l'autre.
    const runner = new Function(
      `${snippet.match(/function fnv1aHash[\s\S]*?\n  }/)![0]}\n  return fnv1aHash(arguments[0]);`
    ) as (input: string) => number

    for (const input of ['visitor-1:test-1', 'abc', '', 'é🦊']) {
      expect(runner(input)).toBe(fnv1aHash(input))
    }
  })
})
