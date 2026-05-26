import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderWhyWeLove(data: V3PageData, tokens: StyleTokens): string {
  const text = data.copy.why_we_love ?? data.product.description.slice(0, 280)
  return `
<section style="
  background:${tokens.colors.surface};
  padding:${tokens.spacing.section} 24px;
">
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <span style="
      display:inline-block;font-size:12px;letter-spacing:0.15em;
      color:${tokens.colors.textMuted};margin-bottom:24px;text-transform:uppercase
    ">Pourquoi on aime ça</span>
    <p style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(24px,2.5vw,36px);line-height:1.4;
      color:${tokens.colors.text};margin:0;font-weight:400
    ">${escapeHtml(text)}</p>
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
