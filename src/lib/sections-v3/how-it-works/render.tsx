import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'

export function renderHowItWorks(data: V3PageData, tokens: StyleTokens): string {
  const steps = data.copy.how_it_works ?? []

  const items = steps
    .map(
      (s, idx) => {
        // Sprint 3 T1 — fond alterné : étape paire → bgAlt, étape impaire → surface
        const bg = idx % 2 === 0 ? tokens.colors.surface : tokens.colors.bgAlt

        return `
    <div style="
      flex:1;min-width:240px;padding:40px 32px;
      background:${bg};border-radius:8px;text-align:center
    ">
      <div style="
        font-family:${tokens.fonts.heading};
        font-size:clamp(48px,6vw,80px);line-height:1;
        color:${tokens.colors.accent};font-weight:600;
        margin:0 0 20px;
        letter-spacing:-0.02em
      ">${s.step}</div>
      <h3 style="
        font-family:${tokens.fonts.heading};font-size:20px;
        color:${tokens.colors.text};margin:0 0 10px;font-weight:400
      ">${escapeHtml(s.title)}</h3>
      <p style="color:${tokens.colors.textMuted};font-size:14px;line-height:1.6;margin:0">
        ${escapeHtml(s.description)}
      </p>
    </div>`
      }
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
