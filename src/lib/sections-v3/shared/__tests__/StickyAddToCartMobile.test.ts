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

  // Sprint 1 T6 : le wrapper est maintenant #kvt-sticky-wrapper (pas #kvt-sticky-cta)
  it('contient le wrapper principal #kvt-sticky-wrapper', () => {
    const html = renderStickyAddToCartMobile(BASE_OPTS)
    expect(html).toContain('id="kvt-sticky-wrapper"')
  })

  it('contient l\'inner bar #kvt-sticky-cta', () => {
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

  // ─── Sprint 4 T6-T10 — états bandeau (valeurs exactes du brief) ──────────
  describe('Sprint 4 T6-T10 : états bandeau stockSignal + flashSale', () => {
    // T6 : rendu standard sans aucun bandeau
    it('T6 : sans stockSignal ni flashSale → rendu standard, aucun bandeau', () => {
      const html = renderStickyAddToCartMobile(BASE_OPTS)
      expect(html).toContain('id="kvt-sticky-wrapper"')
      expect(html).not.toContain('id="kvt-stock-signal"')
      expect(html).not.toContain('id="kvt-flash-sale"')
    })

    // T7 : stockSignal low count=3 → bandeau ambre, count visible
    it('T7 : stockSignal { type: low, count: 3 } → bandeau ambre #kvt-stock-signal + count 3 visible', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'low', count: 3 },
      })
      expect(html).toContain('id="kvt-stock-signal"')
      expect(html).toContain('#D97706') // ambre warning
      expect(html).toContain('3')
    })

    // T8 : stockSignal critical count=1 → bandeau danger rouge
    it('T8 : stockSignal { type: critical, count: 1 } → bandeau danger rouge', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'critical', count: 1 },
      })
      expect(html).toContain('id="kvt-stock-signal"')
      expect(html).toContain('#DC2626') // rouge danger
      expect(html).toContain('1')
    })

    // T9 : flashSale endsAt → bandeau rouge + script countdown injecté
    it('T9 : flashSale { endsAt: 2026-06-19 } → bandeau rouge + countdown injecté', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale: { endsAt: '2026-06-19T00:00:00Z' },
      })
      expect(html).toContain('id="kvt-flash-sale"')
      expect(html).toContain('data-ends-at="2026-06-19T00:00:00Z"')
      expect(html).toContain('#DC2626')
      expect(html).toContain('function tick()')
      expect(html).toContain('setTimeout(tick, 1000)')
    })

    // T10 : flashSale + stockSignal simultanés → priorité flashSale (un seul bandeau)
    it('T10 : flashSale + stockSignal simultanés → priorité flashSale, pas de bandeau stock', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale:   { endsAt: '2026-06-19T00:00:00Z' },
        stockSignal: { type: 'low', count: 3 },
      })
      expect(html).toContain('id="kvt-flash-sale"')
      expect(html).not.toContain('id="kvt-stock-signal"')
    })
  })

  // ─── Sprint 1 T6 — stockSignal ───────────────────────────────────────────
  describe('T6 stockSignal', () => {
    it('stockSignal low : bandeau ambre #kvt-stock-signal présent', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'low', count: 5 },
      })
      expect(html).toContain('id="kvt-stock-signal"')
      // Couleur warning ambre
      expect(html).toContain('#D97706')
      expect(html).toContain('5')
    })

    it('stockSignal critical : couleur danger rouge', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'critical', count: 2 },
      })
      expect(html).toContain('id="kvt-stock-signal"')
      expect(html).toContain('#DC2626')
      expect(html).toContain('2')
    })

    it('stockSignal avec label personnalisé', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'low', label: 'Dernières pièces en stock' },
      })
      expect(html).toContain('Dernières pièces en stock')
    })

    it('stockSignal sans count ni label : fallback texte générique', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        stockSignal: { type: 'low' },
      })
      expect(html).toContain('Stock limité')
    })

    it('sans stockSignal : pas de bandeau #kvt-stock-signal', () => {
      const html = renderStickyAddToCartMobile(BASE_OPTS)
      expect(html).not.toContain('id="kvt-stock-signal"')
    })
  })

  // ─── Sprint 1 T6 — flashSale ─────────────────────────────────────────────
  describe('T6 flashSale', () => {
    it('flashSale : bandeau rouge #kvt-flash-sale présent', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale: { endsAt: '2026-12-31T23:59:00Z' },
      })
      expect(html).toContain('id="kvt-flash-sale"')
      // data-ends-at doit être présent pour le countdown JS
      expect(html).toContain('data-ends-at="2026-12-31T23:59:00Z"')
      // Couleur rouge danger
      expect(html).toContain('#DC2626')
    })

    it('flashSale : timer countdown element #kvt-flash-timer présent', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale: { endsAt: '2026-12-31T23:59:00Z' },
      })
      expect(html).toContain('id="kvt-flash-timer"')
    })

    it('flashSale : script countdown injecté (tick function)', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale: { endsAt: '2026-12-31T23:59:00Z' },
      })
      expect(html).toContain('function tick()')
      expect(html).toContain('setTimeout(tick, 1000)')
    })

    it('flashSale : label personnalisé respecté', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale: { endsAt: '2026-12-31T23:59:00Z', label: 'Promo expire dans' },
      })
      expect(html).toContain('Promo expire dans')
    })

    it('flashSale a la priorité sur stockSignal si les deux sont fournis', () => {
      const html = renderStickyAddToCartMobile({
        ...BASE_OPTS,
        flashSale:   { endsAt: '2026-12-31T23:59:00Z' },
        stockSignal: { type: 'low', count: 3 },
      })
      // Flash sale doit être présent
      expect(html).toContain('id="kvt-flash-sale"')
      // Stock signal ne doit pas être présent (flashSale a la priorité)
      expect(html).not.toContain('id="kvt-stock-signal"')
    })

    it('sans flashSale : pas de bandeau #kvt-flash-sale', () => {
      const html = renderStickyAddToCartMobile(BASE_OPTS)
      expect(html).not.toContain('id="kvt-flash-sale"')
    })
  })
})
