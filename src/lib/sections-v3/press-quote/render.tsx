import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { buildImagePool, getImage } from '@/lib/images/pool'

export function renderPressQuote(data: V3PageData, tokens: StyleTokens): string {
  const pq = data.copy.press_quote
  if (!pq) return ''
  const pool = buildImagePool(data.images)
  const lifestyleImg = getImage(pool, 'lifestyle', 0)

  return `
<section style="position:relative;padding:${tokens.spacing.section} 24px;overflow:hidden">
  ${lifestyleImg ? `
    <div style="position:absolute;inset:0;z-index:0">
      <img src="${lifestyleImg}" alt=""
           style="width:100%;height:100%;object-fit:cover;opacity:0.35">
      <div style="position:absolute;inset:0;background:${tokens.colors.bg};opacity:0.8"></div>
    </div>` : ''}
  <div style="
    position:relative;z-index:1;max-width:880px;margin:0 auto;text-align:center
  ">
    <p style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,42px);line-height:1.4;color:${tokens.colors.text};
      margin:0 0 24px;font-weight:400
    ">&ldquo;${escapeHtml(pq.quote)}&rdquo;</p>
    <span style="
      font-size:13px;letter-spacing:0.15em;text-transform:uppercase;
      color:${tokens.colors.textMuted}
    ">&mdash; ${escapeHtml(pq.source)}</span>
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
