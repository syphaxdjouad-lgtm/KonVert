import { describe, it, expect } from 'vitest'
import { renderStickyAddToCartMobile } from '../StickyAddToCartMobile'

const BASE_OPTS = {
  productName:  'Sérum Renaissance',
  productImage: 'https://cdn.shopify.com/serum-1.jpg',
  price: { amount: 49, currency: 'EUR' },
}

describe('renderStickyAddToCartMobile', () => {
  it('retourne un HTML non vide', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html.trim().length).toBeGreaterThan(0)
  })

  it('contient l\'id principal #kvt-sticky-cta', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('id="kvt-sticky-cta"')
  })

  it('affiche le nom produit (tronqué avec text-overflow)', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('Sérum Renaissance')
    expect(html).toContain('text-overflow: ellipsis')
  })

  it('affiche le prix formaté (EUR)', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    // Le prix formaté doit apparaître (format fr-FR: "49,00 €" ou "49 €")
    expect(html).toMatch(/49/)
    expect(html).toContain('kvt-sticky-price')
  })

  it('affiche le compareAt barré si fourni', () => {
    const html = renderStickyAddToCartMobile({
      ...BASE_OPTS,
      price: { amount: 49, currency: 'EUR', compareAt: 79 },
    })
    expect(html).toContain('kvt-sticky-compare')
    expect(html).toMatch(/79/)
    expect(html).toContain('text-decoration: line-through')
  })

  it('mobile-only : display none à lg+ (media query >= 1024px)', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('min-width: 1024px')
    expect(html).toContain('display: none !important')
  })

  it('inclut env(safe-area-inset-bottom) pour iPhone', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('env(safe-area-inset-bottom')
  })

  it('respecte prefers-reduced-motion', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    // Media query présente
    expect(html).toContain('prefers-reduced-motion: reduce')
    // La transform est annulée en reduced-motion
    expect(html).toContain('transform: translateY(0) !important')
  })

  it('z-index à 40', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('z-index: 40')
  })

  it('inclut IntersectionObserver dans le script inline', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('IntersectionObserver')
    expect(html).toContain('kvt-visible')
  })

  it('bouton CTA avec texte par défaut "Ajouter au panier"', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('Ajouter au panier')
    expect(html).toContain('id="kvt-sticky-cta-btn"')
  })

  it('ctaLabel personnalisé est respecté', () => {
    const html = renderStickyAddToCartMobile({ ...BASE_OPTS, ctaLabel: 'Buy Now' })
    expect(html).toContain('Buy Now')
  })

  it('affiche le QuantitySelector quand showQty=true', () => {
    const html = renderStickyAddToCartMobile({ ...BASE_OPTS, showQty: true })
    expect(html).toContain('id="sticky-qty-input"')
    expect(html).toContain('role="spinbutton"')
  })

  it('n\'affiche pas de QuantitySelector quand showQty=false (défaut)', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    // Le widget QS n'est pas rendu — pas de boutons +/- propres au QS
    expect(html).not.toContain('id="sticky-qty-dec"')
    expect(html).not.toContain('id="sticky-qty-inc"')
  })

  it('mainCtaId personnalisé est câblé dans le script IntersectionObserver', () => {
    const html = renderStickyAddToCartMobile({ ...BASE_OPTS, mainCtaId: 'hero-cta-custom' })
    expect(html).toContain("getElementById('hero-cta-custom')")
  })

  it('fallback scroll : script contient requestAnimationFrame + passive scroll quand target absent', () => {
    // Quand #main-cta est absent (cas 43/43 templates etec), le script doit
    // activer le fallback scroll (rAF + passive listener) plutôt que de return silencieusement.
    // On vérifie la présence du code fallback dans l'HTML généré (le composant est SSR-string).
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    // Le fallback scroll doit être présent dans le script inline
    expect(html).toContain('requestAnimationFrame')
    expect(html).toContain("passive: true")
    expect(html).toContain('scrollFallback')
    expect(html).toContain('window.scrollY > 300')
    // Le cleanup pagehide doit être présent
    expect(html).toContain('pagehide')
    expect(html).toContain('removeEventListener')
  })

  it('thumbnail produit a alt="" aria-hidden (image décorative)', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    // Image décorative : alt vide + aria-hidden
    expect(html).toContain('alt=""')
    expect(html).toContain('aria-hidden="true"')
  })

  it('aria-label sur le conteneur principal', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('aria-label="Ajouter au panier — barre rapide"')
  })

  // P1-1 : showPrice=false masque le bloc prix dans le DOM (pas le CSS selector).
  // Le sélecteur CSS .kvt-sticky-price reste dans le <style> — on cherche le span dans le HTML.
  it('P1-1 : showPrice=false masque le bloc prix dans le DOM', () => {
    const html = renderStickyAddToCartMobile({ ...BASE_OPTS, showPrice: false })
    // Le span prix ne doit PAS être dans le DOM (classe appliquée via HTML, pas CSS uniquement)
    expect(html).not.toContain('<span class="kvt-sticky-price">')
    // L'image et le nom produit restent visibles
    expect(html).toContain('Sérum Renaissance')
  })

  it('P1-1 : showPrice=true (défaut) affiche bien le span prix dans le DOM', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('<span class="kvt-sticky-price">')
  })
})
