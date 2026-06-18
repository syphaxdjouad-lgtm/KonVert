/**
 * renderStickyAddToCartMobile — barre CTA fixe mobile déclenchée par IntersectionObserver
 *
 * MOBILE-ONLY : visible uniquement sur écrans < 1024px (lg breakpoint Tailwind).
 * Déclenchement : s'affiche quand le CTA principal (anchor #main-cta) sort du viewport.
 * Animation slide-up depuis le bas, backdrop blur, safe-area iOS.
 * prefers-reduced-motion respecté.
 * Z-index 40 : au-dessus de tout sauf modal/drawer (z-50+).
 *
 * Intégration :
 *   - Appelé dans renderPageV3() juste avant </body> (s'applique à tous les styles V3)
 *   - Appelé en fin de template dans les etec-* qui n'ont pas encore de sticky bar
 *
 * Options :
 *   productName    : nom produit (tronqué à 1 ligne)
 *   productImage   : URL thumbnail 40×40
 *   price          : { amount, currency, compareAt? }
 *   ctaLabel       : texte bouton (défaut "Ajouter au panier")
 *   ctaColor       : couleur fond bouton (reprend l'accent du template)
 *   ctaTextColor   : couleur texte bouton
 *   showQty        : affiche un mini QuantitySelector à gauche du bouton
 *   mainCtaId      : id du CTA principal à observer (défaut 'main-cta')
 *   fontFamily     : police
 *   stockSignal    : bandeau ambre au-dessus du sticky (stock faible/critique)
 *   flashSale      : bandeau rouge + countdown timer au-dessus du sticky
 */

import { renderQuantitySelector } from './QuantitySelector'

export interface StickyPrice {
  amount:    number
  currency:  string
  compareAt?: number
}

// Sprint 1 T6 — signal stock faible ou critique au-dessus du sticky
export interface StickyStockSignal {
  type:    'low' | 'critical'
  count?:  number    // "Plus que X unités"
  label?:  string    // texte libre si count absent
}

// Sprint 1 T6 — flash sale : bandeau rouge + countdown jusqu'à endsAt
export interface StickyFlashSale {
  endsAt:  string    // ISO 8601 datetime string (ex: "2026-06-20T23:59:00Z")
  label?:  string    // texte libre avant le timer (défaut "Offre flash expire dans")
}

export interface StickyAddToCartOptions {
  productName:   string
  productImage:  string
  price:         StickyPrice
  ctaLabel?:     string
  ctaColor?:     string
  ctaTextColor?: string
  showQty?:      boolean
  // P1-1 : si false, le bloc prix est masqué (cas prix absent ou 0).
  // Le CTA "Voir l'offre" est affiché sans chiffre — évite d'afficher "0,00 €".
  showPrice?:    boolean
  mainCtaId?:    string
  fontFamily?:   string
  bgColor?:      string
  borderColor?:  string
  // Sprint 1 T6
  stockSignal?:  StickyStockSignal
  flashSale?:    StickyFlashSale
}

function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

// ─── Helpers bandeaux ─────────────────────────────────────────────────────────

const COLOR_WARNING = '#D97706'
const COLOR_WARNING_BG = '#FFFBEB'
const COLOR_DANGER  = '#DC2626'
const COLOR_DANGER_BG  = '#FEF2F2'

function renderStockSignalBanner(signal: StickyStockSignal, fontFamily: string): string {
  const bg   = signal.type === 'critical' ? COLOR_DANGER_BG  : COLOR_WARNING_BG
  const color = signal.type === 'critical' ? COLOR_DANGER     : COLOR_WARNING

  let text: string
  if (signal.label) {
    text = signal.label
  } else if (signal.count !== undefined) {
    text = signal.type === 'critical'
      ? `🔴 Seulement ${signal.count} unité${signal.count > 1 ? 's' : ''} restante${signal.count > 1 ? 's' : ''}`
      : `Plus que ${signal.count} unité${signal.count > 1 ? 's' : ''} en stock`
  } else {
    text = signal.type === 'critical' ? 'Stock presque épuisé' : 'Stock limité'
  }

  return `<div id="kvt-stock-signal" style="
    background:${bg};
    color:${color};
    font-family:${fontFamily};
    font-size:12px;
    font-weight:600;
    text-align:center;
    padding:6px 16px;
    border-bottom:1px solid ${color}22;
    letter-spacing:0.01em;
  ">${text}</div>`
}

function renderFlashSaleBanner(flashSale: StickyFlashSale, fontFamily: string): string {
  const label = flashSale.label ?? 'Offre flash expire dans'
  // Échapper l'ISO pour injection JSON dans l'attribut data-*
  const endsAtEscaped = flashSale.endsAt.replace(/"/g, '&quot;')

  return `<div id="kvt-flash-sale" data-ends-at="${endsAtEscaped}" style="
    background:${COLOR_DANGER_BG};
    color:${COLOR_DANGER};
    font-family:${fontFamily};
    font-size:12px;
    font-weight:600;
    text-align:center;
    padding:6px 16px;
    border-bottom:1px solid ${COLOR_DANGER}22;
    letter-spacing:0.01em;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
  ">
    <span>${label}</span>
    <span id="kvt-flash-timer" style="
      font-variant-numeric:tabular-nums;
      min-width:56px;
      display:inline-block;
    ">–:––:––</span>
  </div>
<script>
(function() {
  var timerEl = document.getElementById('kvt-flash-timer');
  var bannerEl = document.getElementById('kvt-flash-sale');
  if (!timerEl || !bannerEl) return;
  var endsAt = new Date(bannerEl.getAttribute('data-ends-at'));
  if (isNaN(endsAt.getTime())) return;

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
    if (diff <= 0) {
      bannerEl.style.display = 'none';
      return;
    }
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    timerEl.textContent = h + ':' + pad(m) + ':' + pad(s);
    setTimeout(tick, 1000);
  }
  tick();
})();
<\/script>`
}

export function renderStickyAddToCartMobile(options: StickyAddToCartOptions): string {
  const {
    productName,
    productImage,
    price,
    ctaLabel    = 'Ajouter au panier',
    ctaColor    = '#1A1A1A',
    ctaTextColor = '#FFFFFF',
    showQty     = false,
    showPrice   = true,
    mainCtaId   = 'main-cta',
    fontFamily  = 'Inter,sans-serif',
    bgColor     = '#FFFFFF',
    borderColor = '#E5E7EB',
    stockSignal,
    flashSale,
  } = options

  // Les bandeaux s'affichent AU-DESSUS de la barre sticky (pas dedans)
  // Flash sale a la priorité sur stockSignal si les deux sont fournis
  const signalBanner = flashSale
    ? renderFlashSaleBanner(flashSale, fontFamily)
    : stockSignal
      ? renderStockSignalBanner(stockSignal, fontFamily)
      : ''

  const priceFormatted    = formatPrice(price.amount, price.currency)
  const compareFormatted  = price.compareAt ? formatPrice(price.compareAt, price.currency) : null

  // QuantitySelector compact inline (sans label, sans style tag répété)
  const qtyBlock = showQty
    ? renderQuantitySelector({
        size:        'compact',
        accentColor: ctaColor,
        textColor:   '#1A1A1A',
        bgColor:     '#F9FAFB',
        borderColor,
        fontFamily,
        id:          'sticky-qty',
      })
    : ''

  return `
<style>
  /* STICKY ADD-TO-CART MOBILE — mobile-only, z-40 */
  /* Wrapper : position fixed, enveloppe [bandeau signal] + [barre sticky] */
  #kvt-sticky-wrapper {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    flex-direction: column;
    transform: translateY(100%);
    transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
                opacity 0.28s ease;
    opacity: 0;
    will-change: transform;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.10);
  }
  #kvt-sticky-wrapper.kvt-visible {
    transform: translateY(0);
    opacity: 1;
  }
  /* Desktop : jamais visible */
  @media (min-width: 1024px) {
    #kvt-sticky-wrapper { display: none !important; }
  }
  /* Mobile : display flex (caché jusqu'à .kvt-visible) */
  @media (max-width: 1023px) {
    #kvt-sticky-wrapper { display: flex; }
  }
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    #kvt-sticky-wrapper {
      transition: opacity 0.15s ease;
      transform: translateY(0) !important;
    }
    #kvt-sticky-wrapper:not(.kvt-visible) { opacity: 0; pointer-events: none; }
  }
  #kvt-sticky-cta {
    background: ${bgColor};
    border-top: 1px solid ${borderColor};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
    font-family: ${fontFamily};
    display: flex;
    align-items: center;
  }
  #kvt-sticky-cta-btn {
    flex: 1;
    height: 48px;
    background: ${ctaColor};
    color: ${ctaTextColor};
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: ${fontFamily};
    letter-spacing: -0.01em;
    transition: transform 0.1s ease, opacity 0.1s ease;
    white-space: nowrap;
  }
  #kvt-sticky-cta-btn:hover { opacity: 0.92; }
  #kvt-sticky-cta-btn:active { transform: scale(0.98); }
  #kvt-sticky-cta-btn:focus-visible { outline: 2px solid ${ctaColor}; outline-offset: 2px; }
  .kvt-sticky-product-name {
    font-size: 13px;
    font-weight: 600;
    color: #1A1A1A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
    line-height: 1.3;
  }
  .kvt-sticky-price {
    font-size: 14px;
    font-weight: 700;
    color: #1A1A1A;
    line-height: 1.2;
  }
  .kvt-sticky-compare {
    font-size: 11px;
    color: #9CA3AF;
    text-decoration: line-through;
    margin-left: 4px;
  }
  /* Spinner number input reset */
  #sticky-qty-input::-webkit-inner-spin-button,
  #sticky-qty-input::-webkit-outer-spin-button,
  #kvt-sticky-cta input[type=number]::-webkit-inner-spin-button,
  #kvt-sticky-cta input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  #kvt-sticky-cta input[type=number] { -moz-appearance: textfield; }
</style>

${signalBanner}

<div id="kvt-sticky-wrapper" role="region" aria-label="Ajouter au panier — barre rapide">
  <div id="kvt-sticky-cta">
    <!-- Thumbnail + infos produit -->
    <div style="display:flex;align-items:center;gap:10px;flex:0 0 auto;max-width:180px;min-width:0;">
      <img
        src="${productImage}"
        alt=""
        aria-hidden="true"
        loading="lazy"
        width="40"
        height="40"
        style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid ${borderColor};"
      >
      <div style="min-width:0;">
        <p class="kvt-sticky-product-name">${productName}</p>
        ${showPrice ? `<div style="display:flex;align-items:baseline;gap:0;">
          <span class="kvt-sticky-price">${priceFormatted}</span>
          ${compareFormatted ? `<span class="kvt-sticky-compare">${compareFormatted}</span>` : ''}
        </div>` : ''}
      </div>
    </div>

    <!-- Séparateur flex -->
    <div style="flex:1;min-width:8px;max-width:16px;"></div>

    <!-- Quantity (optionnel) -->
    ${showQty ? `<div style="flex-shrink:0;">${qtyBlock}</div>` : ''}

    ${showQty ? `<div style="width:8px;flex-shrink:0;"></div>` : ''}

    <!-- CTA Button -->
    <button
      id="kvt-sticky-cta-btn"
      type="button"
      onclick="
        var mainBtn = document.getElementById('${mainCtaId}');
        if (mainBtn) mainBtn.click();
        else console.warn('[Konvert] main-cta not found');
      "
    >${ctaLabel}</button>
  </div>
</div>

<script>
(function() {
  var bar    = document.getElementById('kvt-sticky-wrapper');
  var target = document.getElementById('${mainCtaId}');

  // Guard : si le composant sticky lui-même est absent, no-op strict
  if (!bar) return;

  // Fallback scroll : #main-cta absent (0/43 templates etec le posent)
  // On affiche le sticky dès que l'utilisateur a scrollé > 300px
  if (!target) {
    var ticking = false;
    var scrollFallback = function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 300) {
            bar.classList.add('kvt-visible');
          } else {
            bar.classList.remove('kvt-visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', scrollFallback, { passive: true });
    // Check initial (page déjà scrollée à la mount, ou reload mid-page)
    scrollFallback();
    // Cleanup au unload pour éviter les leaks sur SPA
    window.addEventListener('pagehide', function() {
      window.removeEventListener('scroll', scrollFallback);
    }, { once: true });
    return;
  }

  // IntersectionObserver : s'affiche quand le CTA principal est hors du viewport
  if (!('IntersectionObserver' in window)) {
    // Fallback dégradé navigateur ancien : toujours visible sur mobile
    bar.classList.add('kvt-visible');
    return;
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        bar.classList.remove('kvt-visible');
      } else {
        bar.classList.add('kvt-visible');
      }
    });
  }, { threshold: 0.5 });

  io.observe(target);

  // Sync quantity sticky → main
  var stickyInner = document.getElementById('kvt-sticky-cta');
  if (stickyInner) {
    stickyInner.addEventListener('qty:change', function(e) {
      var mainQty = document.getElementById('main-qty-sel-input');
      if (mainQty && e.detail && e.detail.value) {
        mainQty.value = e.detail.value;
        mainQty.dispatchEvent(new CustomEvent('qty:change', { bubbles: true, detail: e.detail }));
      }
    });
  }
})();
<\/script>`
}
