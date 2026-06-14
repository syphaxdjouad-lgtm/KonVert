import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderHero(data: V3PageData, tokens: StyleTokens): string {
  const { product, images, copy } = data
  const heroImage = images[0] ?? ''

  // P0-1 : H1 = hook émotionnel LLM (copy.hero.tagline), pas le titre AliExpress brut.
  // Le titre produit brut est rétrogradé en référence secondaire sous le H1.
  // Fallback : si le LLM n'a pas généré de tagline, on utilise le titre produit.
  const h1Text = copy.hero?.tagline ?? product.title
  const productRef = copy.hero?.tagline ? product.title : null
  const subtagline = copy.hero?.subtagline ?? ''

  // P1-2 : social proof above the fold — rating scrappé ou fallback textuel.
  // Le fallback est paramétrable via copy.hero.social_proof_fallback (optionnel).
  const socialProofFallback = copy.hero?.social_proof_fallback ?? '★★★★★ Plus de 10 000 clients satisfaits'
  const ratingBlock = product.rating
    ? `
      <div class="v3-hero__rating" style="color:${tokens.colors.textMuted};font-size:14px;margin:0 0 24px">
        <span style="color:${tokens.colors.accent}">★</span>
        ${product.rating.value} / 5 &nbsp;·&nbsp; ${product.rating.count} avis
      </div>`
    : `
      <div class="v3-hero__rating" style="color:${tokens.colors.textMuted};font-size:13px;margin:0 0 24px">
        ${escapeHtml(socialProofFallback)}
      </div>`

  // P1-3 : trust badges compacts (garantie + livraison + paiement sécurisé) dupliqués
  // dans le hero buy-box, sous le CTA. Toujours visibles above the fold sans scroll.
  const heroBadges = `
    <div class="v3-hero__trust-strip" style="
      display:flex;flex-wrap:wrap;gap:8px 16px;
      margin-top:20px;
    ">
      <span style="font-size:12px;color:${tokens.colors.textMuted};display:flex;align-items:center;gap:5px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Garantie 30 jours
      </span>
      <span style="font-size:12px;color:${tokens.colors.textMuted};display:flex;align-items:center;gap:5px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        Livraison rapide
      </span>
      <span style="font-size:12px;color:${tokens.colors.textMuted};display:flex;align-items:center;gap:5px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Paiement sécurisé
      </span>
    </div>`

  return `
<section class="v3-hero" style="
  background:${tokens.colors.bg};
  padding:${tokens.spacing.section} 24px;
  font-family:${tokens.fonts.body};
">
  <div class="v3-hero__grid" style="
    max-width:1240px;margin:0 auto;
    display:grid;grid-template-columns:1fr 1fr;gap:${tokens.spacing.gap};
    align-items:center;
  ">
    <div class="v3-hero__image">
      <img src="${heroImage}"
           alt="${escapeHtml(product.title)}"
           style="width:100%;border-radius:${tokens.radius.image};display:block">
    </div>
    <div class="v3-hero__content" style="color:${tokens.colors.text}">
      ${copy.brand
        ? `<div style="
            font-family:${tokens.fonts.body};
            font-size:13px;font-weight:600;letter-spacing:0.18em;
            text-transform:uppercase;color:${tokens.colors.accent};
            margin:0 0 16px
          ">${escapeHtml(copy.brand)}</div>`
        : ''}
      <h1 style="
        font-family:${tokens.fonts.heading};
        font-size:clamp(40px,5vw,72px);
        line-height:1.05;font-weight:400;margin:0 0 16px
      ">${escapeHtml(h1Text)}</h1>
      ${productRef
        ? `<p style="font-size:15px;color:${tokens.colors.textMuted};margin:0 0 8px;font-weight:400">${escapeHtml(productRef)}</p>`
        : ''}
      ${subtagline
        ? `<p style="font-size:16px;color:${tokens.colors.textMuted};margin:0 0 16px">${escapeHtml(subtagline)}</p>`
        : ''}
      ${ratingBlock}
      ${product.price
        ? `<div style="font-size:24px;font-weight:600;margin:0 0 16px">${escapeHtml(product.price)}</div>`
        : ''}
      <button id="main-cta" style="
        margin-top:8px;
        background:${tokens.colors.text};color:${tokens.colors.surface};
        padding:18px 40px;border:0;border-radius:${tokens.radius.button};
        font-family:${tokens.fonts.body};font-size:16px;font-weight:500;
        cursor:pointer;transition:transform ${tokens.motion.duration} ${tokens.motion.ease}
      ">Ajouter au panier</button>
      ${heroBadges}
    </div>
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
