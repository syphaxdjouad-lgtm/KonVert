import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderHero(data: V3PageData, tokens: StyleTokens): string {
  const { product, images, copy } = data
  const heroImage = images[0] ?? ''
  const tagline = copy.hero?.tagline ?? product.title
  const subtagline = copy.hero?.subtagline ?? ''

  const ratingBlock = product.rating
    ? `
      <div class="v3-hero__rating" style="color:${tokens.colors.textMuted};font-size:14px">
        <span style="color:${tokens.colors.accent}">★</span>
        ${product.rating.value} (${product.rating.count} avis)
      </div>`
    : ''

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
      <h1 style="
        font-family:${tokens.fonts.heading};
        font-size:clamp(40px,5vw,72px);
        line-height:1.05;font-weight:400;margin:0 0 16px
      ">${escapeHtml(product.title)}</h1>
      ${tagline !== product.title
        ? `<p style="font-size:20px;color:${tokens.colors.textMuted};margin:0 0 8px">${escapeHtml(tagline)}</p>`
        : ''}
      ${subtagline
        ? `<p style="font-size:16px;color:${tokens.colors.textMuted};margin:0 0 32px">${escapeHtml(subtagline)}</p>`
        : ''}
      ${product.price
        ? `<div style="font-size:24px;font-weight:600;margin:0 0 16px">${escapeHtml(product.price)}</div>`
        : ''}
      ${ratingBlock}
      <button style="
        margin-top:32px;
        background:${tokens.colors.text};color:${tokens.colors.surface};
        padding:18px 40px;border:0;border-radius:${tokens.radius.button};
        font-family:${tokens.fonts.body};font-size:16px;font-weight:500;
        cursor:pointer;transition:transform ${tokens.motion.duration} ${tokens.motion.ease}
      ">Ajouter au panier</button>
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
