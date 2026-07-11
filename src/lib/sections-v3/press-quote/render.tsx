import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { buildImagePool, getImage } from '@/lib/images/pool'
import { escapeHtml, escapeAttr } from '@/lib/utils/html'

// Sprint 3 T3 — stats génériques pour la trust bar de fallback
const TRUST_STATS: Array<{ icon: string; label: string }> = [
  {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    label: '+10 000 clients satisfaits',
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    label: 'Note moyenne 4,8&#9733;',
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    label: 'Livraison rapide 48h',
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    label: 'Garantie 30 jours',
  },
]

function renderTrustStatsBar(tokens: StyleTokens): string {
  const stats = TRUST_STATS.map(
    (s) => `
    <div style="
      display:flex;align-items:center;gap:10px;
      flex:1;min-width:180px;justify-content:center
    ">
      <span style="color:${tokens.colors.accent};display:flex;align-items:center">${s.icon}</span>
      <span style="
        font-family:${tokens.fonts.body};font-size:14px;
        color:${tokens.colors.text};font-weight:500;white-space:nowrap
      ">${s.label}</span>
    </div>`
  ).join('')

  return `
<section style="background:${tokens.colors.bgAlt};padding:32px 24px">
  <div style="
    max-width:960px;margin:0 auto;
    display:flex;flex-wrap:wrap;gap:24px;
    justify-content:center;align-items:center
  ">${stats}</div>
</section>`.trim()
}

export function renderPressQuote(data: V3PageData, tokens: StyleTokens): string {
  const pq = data.copy.press_quote

  // Sprint 3 T3 — si pas de quote, on renvoie la trust stats bar
  // plutôt que '' pour éviter le gap visuel de 80px
  if (!pq) return renderTrustStatsBar(tokens)

  const pool = buildImagePool(data.images)
  const lifestyleImg = getImage(pool, 'lifestyle', 0)

  return `
<section style="position:relative;padding:${tokens.spacing.section} 24px;overflow:hidden">
  ${lifestyleImg ? `
    <div style="position:absolute;inset:0;z-index:0">
      <img src="${escapeAttr(lifestyleImg)}" alt=""
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
