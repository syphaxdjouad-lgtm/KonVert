import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml, escapeAttr } from '@/lib/utils/html'

export function renderCompareVariants(data: V3PageData, tokens: StyleTokens): string {
  const variants = data.product.variants ?? []

  // Sprint 3 T5 — highlight variante recommandée + sticky 1re col mobile
  // Les cartes sont wrappées dans un scroll horizontal (overflow-x:auto) qui anticipe
  // le tableau ligne/colonne des sprints suivants. Sur mobile, la 1re colonne
  // (ici : 1re carte) reste sticky grâce au position:sticky+left:0 sur la div interne.
  const cards = variants.map((v, idx) => {
    const isRecommended = v.recommended === true
    const cardBg = isRecommended ? tokens.colors.bgAlt : tokens.colors.surface
    const borderStyle = isRecommended
      ? `2px solid ${tokens.colors.accent}`
      : `1px solid ${tokens.colors.border}`

    // Sur mobile, la première variante est sticky horizontalement
    // (utile surtout si un tableau multi-lignes est rendu dans un sprint futur)
    const stickyStyle = idx === 0
      ? 'position:sticky;left:0;z-index:1'
      : ''

    return `
    <div style="
      text-align:center;min-width:160px;padding:20px 16px;
      background:${cardBg};border-radius:8px;
      border:${borderStyle};
      position:relative;
      ${stickyStyle}
    ">
      ${isRecommended ? `
      <span style="
        display:inline-block;
        background:${tokens.colors.success};color:#fff;
        font-family:${tokens.fonts.body};font-size:11px;font-weight:600;
        text-transform:uppercase;letter-spacing:0.08em;
        padding:3px 10px;border-radius:999px;margin-bottom:12px
      ">Recommandé</span>` : ''}
      ${v.image ? `<div style="
        aspect-ratio:1;background:${tokens.colors.surface};
        border-radius:${tokens.radius.image};overflow:hidden;margin-bottom:12px
      ">
        <img src="${escapeAttr(v.image)}" alt="${escapeHtml(v.name)}"
             style="width:100%;height:100%;object-fit:cover">
      </div>` : ''}
      <span style="font-family:${tokens.fonts.body};color:${tokens.colors.text};font-size:14px;font-weight:500">
        ${escapeHtml(v.name)}
      </span>
    </div>`
  }).join('')

  return `
<section style="background:${tokens.colors.surface};padding:80px 24px">
  <div style="max-width:1080px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(24px,2.5vw,32px);
      color:${tokens.colors.text};margin:0 0 32px;text-align:center;font-weight:400
    ">Toutes les variantes</h2>
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
      <div style="
        display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
        gap:${tokens.spacing.gap};min-width:0
      ">${cards}</div>
    </div>
  </div>
</section>`.trim()
}
