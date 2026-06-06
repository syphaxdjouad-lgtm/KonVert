/**
 * Barrel — Shared universal components (HTML string renderers)
 *
 * Ces composants sont des fonctions pures (data) → string HTML.
 * Ils s'intègrent dans :
 *   - renderRichSections (sections.ts) via les clés 'trust_badges_payment' et 'quantity_selector'
 *   - renderPageV3 (render-page.ts) pour sticky CTA automatique sur tous les styles V3
 *   - Templates etec-* individuellement dans leur hero buy-box
 */

export {
  renderTrustBadgesPayment,
  type PaymentMethod,
  type TrustBadgesVariant,
  type TrustBadgesOptions,
} from './TrustBadgesPayment'

export {
  renderQuantitySelector,
  type QuantitySize,
  type QuantitySelectorOptions,
} from './QuantitySelector'

export {
  renderStickyAddToCartMobile,
  type StickyPrice,
  type StickyAddToCartOptions,
} from './StickyAddToCartMobile'
