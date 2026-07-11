import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'

// Sprint 3 T2 — icônes SVG distinctes par index (cycle sur 6)
const FEATURE_ICONS: string[] = [
  // star
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  // shield
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  // clock
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  // leaf
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  // zap / lightning
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  // check-circle
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
]

export function renderThoughtfullyDesigned(data: V3PageData, tokens: StyleTokens): string {
  const features = data.copy.features ?? []

  const items = features.map((f, idx) => {
    const icon = FEATURE_ICONS[idx % FEATURE_ICONS.length]

    return `
    <li style="
      display:flex;gap:20px;align-items:flex-start;padding:24px 0;
      border-bottom:1px solid ${tokens.colors.border}
    ">
      <span style="
        flex:0 0 auto;color:${tokens.colors.accent};margin-top:2px;
        display:flex;align-items:center;justify-content:center
      ">${icon}</span>
      <div>
        <strong style="
          font-family:${tokens.fonts.body};font-weight:600;
          color:${tokens.colors.text};font-size:16px;display:block;margin-bottom:4px
        ">${escapeHtml(f.name)}</strong>
        <p style="
          margin:0;color:${tokens.colors.textMuted};font-size:15px;line-height:1.6
        ">${escapeHtml(f.description)}</p>
      </div>
    </li>`
  }).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};
      margin:0 0 8px;font-weight:400
    ">Conçu avec soin</h2>
    <ul style="list-style:none;padding:0;margin:0">${items}</ul>
  </div>
</section>`.trim()
}
