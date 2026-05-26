import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderThoughtfullyDesigned(data: V3PageData, tokens: StyleTokens): string {
  const features = data.copy.features ?? []
  const items = features.map(f => `
    <li style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;
               border-bottom:1px solid ${tokens.colors.border}">
      <span style="
        width:8px;height:8px;border-radius:50%;
        background:${tokens.colors.accent};margin-top:8px;flex:0 0 auto
      "></span>
      <div>
        <strong style="
          font-family:${tokens.fonts.body};font-weight:600;color:${tokens.colors.text}
        ">${escapeHtml(f.name)}</strong>
        <p style="margin:4px 0 0;color:${tokens.colors.textMuted};font-size:15px;line-height:1.6">
          ${escapeHtml(f.description)}
        </p>
      </div>
    </li>`).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};
      margin:0 0 32px;font-weight:400
    ">Conçu avec soin</h2>
    <ul style="list-style:none;padding:0;margin:0">${items}</ul>
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
