import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleId, StyleTokens } from '@/lib/styles/types'
import { STYLE_IDS } from '@/lib/styles'
import { DEFAULT_SECTION_ORDER_V3 } from './index'
import { shouldRenderSection } from './display-rules'
import { softTokens } from '@/lib/styles/soft/tokens'
import { editorialTokens } from '@/lib/styles/editorial/tokens'
import { appleCleanTokens } from '@/lib/styles/apple-clean/tokens'
import { boldTokens } from '@/lib/styles/bold/tokens'
import { organicTokens } from '@/lib/styles/organic/tokens'
import { luxeNoirTokens } from '@/lib/styles/luxe-noir/tokens'
import { brutalistTokens } from '@/lib/styles/brutalist/tokens'
import { warmNeutralTokens } from '@/lib/styles/warm-neutral/tokens'
import { minimalMonoTokens } from '@/lib/styles/minimal-mono/tokens'
import { vibrantTokens } from '@/lib/styles/vibrant/tokens'
import { renderHero } from './hero/render'
import { renderGallery } from './gallery/render'
import { renderWhyWeLove } from './why-we-love/render'
import { renderThoughtfullyDesigned } from './thoughtfully-designed/render'
import { renderBestFor } from './best-for/render'
import { renderMaterialsBreakdown } from './materials-breakdown/render'
import { renderHowItWorks } from './how-it-works/render'
import { renderCompareVariants } from './compare-variants/render'
import { renderReviewsAiSummary } from './reviews-ai-summary/render'
import { renderReviews } from './reviews/render'
import { renderPressQuote } from './press-quote/render'
import { renderCareInstructions } from './care-instructions/render'
import { renderFaq } from './faq/render'
import { renderBrandManifesto } from './brand-manifesto/render'
import { renderNav } from './nav/render'
import { renderStickyAddToCartMobile } from './shared/StickyAddToCartMobile'
import { renderTrustBadgesPayment } from './shared/TrustBadgesPayment'

// Map style -> tokens. Tous les 10 styles V3 sont enregistrés.
const STYLE_TOKENS: Record<StyleId, StyleTokens> = {
  'soft':         softTokens,
  'editorial':    editorialTokens,
  'apple-clean':  appleCleanTokens,
  'bold':         boldTokens,
  'organic':      organicTokens,
  'luxe-noir':    luxeNoirTokens,
  'brutalist':    brutalistTokens,
  'warm-neutral': warmNeutralTokens,
  'minimal-mono': minimalMonoTokens,
  'vibrant':      vibrantTokens,
}

// Map section -> renderer. Tous les 14 renderers V3 sont enregistrés ici.
type SectionRendererFn = (data: V3PageData, tokens: StyleTokens) => string

const SECTION_RENDERERS: Record<V3SectionKey, SectionRendererFn> = {
  'hero':                  renderHero,
  'gallery':               renderGallery,
  'why_we_love':           renderWhyWeLove,
  'thoughtfully_designed': renderThoughtfullyDesigned,
  'best_for':              renderBestFor,
  'materials_breakdown':   renderMaterialsBreakdown,
  'how_it_works':          renderHowItWorks,
  'compare_variants':      renderCompareVariants,
  'reviews_ai_summary':    renderReviewsAiSummary,
  'reviews':               renderReviews,     // Sprint 2 — reviews individuelles avec photos
  'press_quote':           renderPressQuote,
  'care_instructions':     renderCareInstructions,
  'faq':                   renderFaq,
  'brand_manifesto':       renderBrandManifesto,
}

export function renderPageV3(
  styleId: StyleId,
  data: V3PageData,
  sectionOrder?: readonly V3SectionKey[],
): string {
  if (!STYLE_IDS.includes(styleId)) {
    throw new Error(`Unknown styleId: ${styleId}`)
  }
  const tokens = STYLE_TOKENS[styleId]
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER_V3

  const sectionsRaw = order
    .filter(key => shouldRenderSection(key, data))
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
      return renderer(data, tokens)
    })
    .filter(Boolean)

  // T3 Sprint 4 — injecter id="main-content" sur la première section
  // afin que le skip link du nav ("Aller au contenu") y pointe correctement.
  const sections = sectionsRaw
    .map((html, idx) => idx === 0 ? html.replace('<section', '<section id="main-content"') : html)
    .join('\n')

  // P1-1 : Sticky add-to-cart mobile — toujours injecté, même si le prix est absent.
  // Avant ce fix, le sticky n'apparaissait que si priceAmount > 0. AliExpress retourne
  // souvent un prix null/vide → sticky CTA absent sur ~30% des pages V3.
  // Fix : fallback prix à 0 → on affiche quand même la barre avec "Voir l'offre".
  const priceAmount = data.product.price
    ? parseFloat(data.product.price.replace(/[^0-9.]/g, ''))
    : 0
  const hasPriceData = Number.isFinite(priceAmount) && priceAmount > 0
  // Sprint 4 T4 — mapper stock_signal vers le sticky CTA mobile.
  // data.copy.stock_signal est le signal sanitisé (sans chiffre, gate anti-count
  // appliqué dans route.ts). Le composant gère low/critical avec les couleurs
  // warning/danger, et affiche le label textuel seul (jamais de count).
  const stockSignalForSticky = data.copy.stock_signal
    ? {
        type:  data.copy.stock_signal.tone,  // 'low' | 'critical'
        label: data.copy.stock_signal.label, // toujours sans chiffre
      } as const
    : undefined

  const stickyHtml = renderStickyAddToCartMobile({
    productName:  data.product.title,
    productImage: data.images[0] ?? '',
    price: {
      amount:   hasPriceData ? priceAmount : 0,
      currency: 'EUR',
    },
    // Si pas de prix valide : libellé "Voir l'offre" + prix masqué (évite "0,00 €")
    ctaLabel:    hasPriceData ? 'Ajouter au panier' : 'Voir l\'offre',
    showPrice:   hasPriceData,
    ctaColor:    tokens.colors.accent,
    fontFamily:  tokens.fonts.body,
    bgColor:     tokens.colors.bg,
    borderColor: tokens.colors.border,
    showQty:     false,
    stockSignal: stockSignalForSticky,
  })

  // Trust badges footer — auto-injecté juste avant </body> pour les pages V3
  const trustHtml = renderTrustBadgesPayment({
    variant:     'footer',
    accentColor: tokens.colors.textMuted,
    bg:          tokens.colors.surface,
    border:      tokens.colors.border,
    fontFamily:  tokens.fonts.body,
  })

  // P0-3 (iframe) : script postMessage hauteur dynamique.
  // Envoyé après DOMContentLoaded et après chaque resize (fonts async, images lazy).
  // Le parent React écoute 'kvt-height' pour passer l'iframe en height auto.
  // Sans ça, l'iframe reste à calc(100vh - 60px) → 80% des sections cachées.
  const heightScript = `<script>
(function() {
  function sendHeight() {
    var h = document.body ? document.body.scrollHeight : 0;
    if (h > 0) {
      window.parent.postMessage({ type: 'kvt-height', height: h }, '*');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendHeight);
  } else {
    sendHeight();
  }
  // Re-envoie après le chargement des fonts/images (lazy)
  window.addEventListener('load', sendHeight);
  // Re-envoie si le contenu change de taille (ex: expand FAQ)
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(sendHeight);
    ro.observe(document.body);
  }
}());
<\/script>`

  // Sprint 3 T6 — animation fadeInUp globale CSS.
  // Disponible via la classe .kvt-fade-up sur n'importe quel élément.
  // NOT appliquée massivement ici pour éviter le CLS — les renderers individuels
  // peuvent l'utiliser de façon ciblée avec animation-delay pour cascade.
  // Guard prefers-reduced-motion obligatoire.
  const globalAnimationStyle = `<style>
@keyframes kvtFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kvt-fade-up {
  animation: kvtFadeUp 480ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .kvt-fade-up { animation: none; }
}
</style>`

  // T3 Sprint 4 — nav header sticky injecté avant le hero.
  // N'est PAS dans SECTION_RENDERERS : c'est un élément de chrome (header global),
  // pas une section de contenu produit. Il ne peut ni être réordonné ni filtré
  // par display-rules — il est toujours présent sur toutes les pages V3.
  const navHtml = renderNav(data, tokens)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(data.product.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap">
${globalAnimationStyle}
</head>
<body style="margin:0;padding:0">
${navHtml}
${sections}
${trustHtml}
${stickyHtml}
${heightScript}
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
