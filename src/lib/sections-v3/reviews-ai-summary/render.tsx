import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderReviewsAiSummary(data: V3PageData, tokens: StyleTokens): string {
  const summary = data.copy.reviews_summary
  if (!summary) return ''
  const rating = data.product.rating

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:880px;margin:0 auto;text-align:center">
    ${rating ? `
      <div style="margin-bottom:32px">
        <span style="
          font-family:${tokens.fonts.heading};font-size:48px;
          color:${tokens.colors.text};display:block;font-weight:400
        ">${rating.value}</span>
        <span style="color:${tokens.colors.accent};font-size:20px;letter-spacing:4px">★★★★★</span>
        <p style="color:${tokens.colors.textMuted};margin:8px 0 0">
          ${rating.count} avis vérifiés
        </p>
      </div>` : ''}
    <p style="
      font-family:${tokens.fonts.heading};font-size:clamp(20px,2vw,28px);
      color:${tokens.colors.text};line-height:1.5;margin:0;font-weight:400;font-style:italic
    ">"${escapeHtml(summary)}"</p>
    <p style="color:${tokens.colors.textMuted};margin:16px 0 0;font-size:13px">
      — Résumé généré à partir des avis clients
    </p>
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
