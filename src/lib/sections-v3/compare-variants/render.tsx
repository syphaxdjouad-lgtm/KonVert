import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderCompareVariants(data: V3PageData, tokens: StyleTokens): string {
  const variants = data.product.variants ?? []
  const cards = variants.map(v => `
    <div style="text-align:center">
      ${v.image ? `<div style="
        aspect-ratio:1;background:${tokens.colors.surface};
        border-radius:${tokens.radius.image};overflow:hidden;margin-bottom:12px
      ">
        <img src="${v.image}" alt="${escapeHtml(v.name)}"
             style="width:100%;height:100%;object-fit:cover">
      </div>` : ''}
      <span style="font-family:${tokens.fonts.body};color:${tokens.colors.text};font-size:14px">
        ${escapeHtml(v.name)}
      </span>
    </div>`).join('')

  return `
<section style="background:${tokens.colors.surface};padding:80px 24px">
  <div style="max-width:1080px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(24px,2.5vw,32px);
      color:${tokens.colors.text};margin:0 0 32px;text-align:center;font-weight:400
    ">Toutes les variantes</h2>
    <div style="
      display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
      gap:${tokens.spacing.gap}
    ">${cards}</div>
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
