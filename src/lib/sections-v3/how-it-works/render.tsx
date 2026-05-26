import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderHowItWorks(data: V3PageData, tokens: StyleTokens): string {
  const steps = data.copy.how_it_works ?? []

  const items = steps
    .map(
      (s) => `
    <div style="text-align:center;flex:1;min-width:200px">
      <div style="
        width:64px;height:64px;border-radius:50%;
        background:${tokens.colors.surface};display:flex;
        align-items:center;justify-content:center;margin:0 auto 16px;
        font-family:${tokens.fonts.heading};font-size:24px;
        color:${tokens.colors.accent};font-weight:600
      ">${s.step}</div>
      <h3 style="
        font-family:${tokens.fonts.heading};font-size:20px;
        color:${tokens.colors.text};margin:0 0 8px;font-weight:400
      ">${escapeHtml(s.title)}</h3>
      <p style="color:${tokens.colors.textMuted};font-size:14px;line-height:1.6;margin:0">
        ${escapeHtml(s.description)}
      </p>
    </div>`
    )
    .join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:1080px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);
      text-align:center;color:${tokens.colors.text};margin:0 0 48px;font-weight:400
    ">Comment l'utiliser</h2>
    <div style="display:flex;gap:${tokens.spacing.gap};flex-wrap:wrap;justify-content:center">${items}</div>
  </div>
</section>`.trim()
}
