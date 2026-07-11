/**
 * renderNav — nav header sticky global, injecté avant le hero dans renderPageV3.
 *
 * Structure :
 *   - <nav> sticky top:0 z-index:100, fond tokens.colors.surface (jamais noir)
 *   - Gauche : logo/nom de la marque (copy.brand ou copy.hero.tagline ou product.title tronqué)
 *   - Droite : bouton "Voir l'offre" (scroll smooth vers #main-cta)
 *   - Scroll > 100px : classe .kvt-nav-scrolled → shadow renforcé + blur augmenté
 *   - Skip link sr-only : "Aller au contenu" → #main-content
 *   - Mobile < 768px : nom tronqué à 20 chars, bouton compact "Voir →"
 *   - A11y : role="navigation" aria-label="Navigation principale"
 *
 * Pas de menu : page produit one-page, nav minimale brand + CTA.
 * Z-index 100 > sticky CTA mobile (z-40) — nav toujours au-dessus, pas de collision.
 * Backdrop blur + fond avec alpha pour effet glass au scroll.
 */

import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'

const NAV_MAX_CHARS_DESKTOP = 30
const NAV_MAX_CHARS_MOBILE  = 20

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

/**
 * Résout le label affiché dans le nav :
 * 1. copy.brand (nom de la marque, le plus pertinent si fourni)
 * 2. product.title (tronqué)
 * Pas de tagline : c'est un slogan, pas un nom de marque.
 */
function resolveBrandLabel(data: V3PageData): string {
  const raw = data.copy.brand ?? data.product.title
  return truncate(raw, NAV_MAX_CHARS_DESKTOP)
}

/**
 * Version mobile du label (truncature plus agressive).
 */
function resolveBrandLabelMobile(data: V3PageData): string {
  const raw = data.copy.brand ?? data.product.title
  return truncate(raw, NAV_MAX_CHARS_MOBILE)
}

export function renderNav(data: V3PageData, tokens: StyleTokens): string {
  const brandDesktop = escapeHtml(resolveBrandLabel(data))
  const brandMobile  = escapeHtml(resolveBrandLabelMobile(data))

  // Couleur de fond avec alpha pour l'effet glass (backdrop-filter)
  // On utilise tokens.colors.surface comme base (toujours off-white dans les 10 styles)
  // et on ajoute 0.92 d'opacité pour le blur de laisser passer légèrement le contenu
  const surfaceColor = tokens.colors.surface

  return `
<!-- Skip link accessibilité : toujours le 1er élément focusable de la page -->
<a href="#main-content" style="
  position:absolute;
  left:-9999px;
  top:auto;
  width:1px;
  height:1px;
  overflow:hidden;
  clip:rect(0 0 0 0);
  white-space:nowrap;
  border:0;
" onfocus="this.style.cssText='position:fixed;top:8px;left:8px;width:auto;height:auto;overflow:visible;clip:auto;white-space:nowrap;background:${escapeHtml(tokens.colors.accent)};color:${escapeHtml(surfaceColor)};padding:8px 16px;border-radius:6px;font-family:${escapeHtml(tokens.fonts.body)};font-size:14px;font-weight:600;z-index:200;text-decoration:none;'" onblur="this.style.cssText='position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;'">
  Aller au contenu
</a>

<style>
/* ── NAV HEADER STICKY ─────────────────────────────────────────────────── */
#kvt-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${surfaceColor};
  border-bottom: 1px solid ${tokens.colors.border};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: ${tokens.fonts.body};
  transition:
    box-shadow 240ms ${tokens.motion.ease},
    backdrop-filter 240ms ${tokens.motion.ease};
}

#kvt-nav.kvt-nav-scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.kvt-nav-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.kvt-nav-brand {
  font-size: 16px;
  font-weight: 600;
  color: ${tokens.colors.text};
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
  line-height: 1.2;
  /* Label desktop visible, mobile caché */
}

.kvt-nav-brand-desktop {
  display: inline;
}

.kvt-nav-brand-mobile {
  display: none;
}

.kvt-nav-cta {
  flex-shrink: 0;
  background: ${tokens.colors.accent};
  color: ${surfaceColor};
  border: 0;
  border-radius: ${tokens.radius.button};
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  font-family: ${tokens.fonts.body};
  cursor: pointer;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition:
    opacity ${tokens.motion.durationShort ?? '120ms'} ${tokens.motion.ease},
    transform ${tokens.motion.durationShort ?? '120ms'} ${tokens.motion.ease};
  /* Label desktop complet */
}

.kvt-nav-cta-label-desktop { display: inline; }
.kvt-nav-cta-label-mobile  { display: none; }

.kvt-nav-cta:hover   { opacity: 0.88; }
.kvt-nav-cta:active  { transform: scale(0.97); }
.kvt-nav-cta:focus-visible {
  outline: 2px solid ${tokens.colors.accent};
  outline-offset: 3px;
}

/* ── Mobile ≤ 767px ─────────────────────────────────────────── */
@media (max-width: 767px) {
  .kvt-nav-inner {
    height: 52px;
    padding: 0 16px;
  }

  .kvt-nav-brand-desktop { display: none; }
  .kvt-nav-brand-mobile  { display: inline; }

  .kvt-nav-cta {
    padding: 8px 14px;
    font-size: 13px;
  }

  .kvt-nav-cta-label-desktop { display: none; }
  .kvt-nav-cta-label-mobile  { display: inline; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  #kvt-nav { transition: none; }
  #kvt-nav.kvt-nav-scrolled { transition: none; }
  .kvt-nav-cta { transition: none; }
}
</style>

<nav id="kvt-nav" role="navigation" aria-label="Navigation principale">
  <div class="kvt-nav-inner">
    <!-- Marque / produit -->
    <span class="kvt-nav-brand" aria-label="${brandDesktop}">
      <span class="kvt-nav-brand-desktop" aria-hidden="true">${brandDesktop}</span>
      <span class="kvt-nav-brand-mobile"  aria-hidden="true">${brandMobile}</span>
    </span>

    <!-- CTA scroll vers #main-cta (buy box hero) -->
    <button
      class="kvt-nav-cta"
      type="button"
      aria-label="Voir l&#39;offre — aller au bouton principal"
      onclick="(function(){
        var el=document.getElementById('main-cta');
        if(el){el.scrollIntoView({behavior:'smooth',block:'center'});}
      }())"
    >
      <span class="kvt-nav-cta-label-desktop">Voir l&#39;offre</span>
      <span class="kvt-nav-cta-label-mobile" aria-hidden="true">Voir &#x2192;</span>
    </button>
  </div>
</nav>

<script>
(function(){
  var nav = document.getElementById('kvt-nav');
  if (!nav) return;
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        if (window.scrollY > 100) {
          nav.classList.add('kvt-nav-scrolled');
        } else {
          nav.classList.remove('kvt-nav-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Etat initial si la page est rechargée en mid-page
  onScroll();
})();
<\/script>`.trim()
}
