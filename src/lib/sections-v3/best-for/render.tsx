import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'

// ─── Fallback pour les tokens sémantiques (cas où le style ne les définit pas) ──
const CRO_DEFAULTS = {
  bgAlt:   '#F5F5F5',
  success: '#16A34A',
  star:    '#F59E0B',
  warning: '#D97706',
  danger:  '#DC2626',
} as const

// ─── Mapping icône SVG par mots-clés dans le label ───────────────────────────
// Chaque icône est un SVG inline 24×24, outline style, aria-hidden.

const ICON_RUNNING = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><path d="m10 9-1 5 4 2 2 4"/><path d="m14 9 1 3-3 1"/><path d="M8 14s-1 2-1 4"/><path d="M14 14s2 1 3 3"/></svg>`
const ICON_MUSIC = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
const ICON_WORK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`
const ICON_TRAVEL = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 4 2 2 4 1-1v-3l3-2 6.2 7.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`
const ICON_FAMILY = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
const ICON_SLEEP = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
const ICON_GAMING = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>`
const ICON_OUTDOOR = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 17 4-8 4 4 4-7 6 11H3z"/><circle cx="17" cy="5" r="2"/></svg>`
const ICON_COOKING = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"/><rect x="8" y="15" width="8" height="4"/><path d="M7.5 4C5 4 5 6 5 6s0 2 2.5 2h1"/><path d="M16.5 4C19 4 19 6 19 6s0 2-2.5 2h-1"/><line x1="12" y1="4" x2="12" y2="8"/></svg>`
const ICON_BEAUTY = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`
const ICON_DEFAULT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`

/**
 * Choisit une icône en fonction des mots présents dans le label.
 * Matching insensible à la casse, partiel (indexOf).
 */
function pickIcon(label: string): string {
  const l = label.toLowerCase()
  if (/run|sport|gym|fitness|exer|jogg|yoga|vélo|cycl|natation|walk|marche|athlét/.test(l)) return ICON_RUNNING
  if (/music|son|oreille|concert|écoute|audio|podcast|musiq/.test(l)) return ICON_MUSIC
  if (/work|travail|bureau|meeting|télétra|office|réunion|confér/.test(l)) return ICON_WORK
  if (/travel|voyage|trip|avion|trajet|déplace|transit|train|road/.test(l)) return ICON_TRAVEL
  if (/famil|enfant|kids|bébé|home|maison|foyer/.test(l)) return ICON_FAMILY
  if (/sommeil|sleep|nuit|repos|détent|relax/.test(l)) return ICON_SLEEP
  if (/gaming|jeux|game|streamer/.test(l)) return ICON_GAMING
  if (/outdoor|nature|montagne|randonnée|plein air|aventure/.test(l)) return ICON_OUTDOOR
  if (/cuisinier|cooking|recette|cuisine|gastro/.test(l)) return ICON_COOKING
  if (/beauty|soin|skincare|beauté|maquillage|cosmétique/.test(l)) return ICON_BEAUTY
  return ICON_DEFAULT
}

// ─── Rendu principal ──────────────────────────────────────────────────────────

export function renderBestFor(data: V3PageData, tokens: StyleTokens): string {
  const items = data.copy.best_for ?? []

  const accentBg      = tokens.colors.bgAlt   ?? CRO_DEFAULTS.bgAlt
  const successColor  = tokens.colors.success  ?? CRO_DEFAULTS.success

  const cards = items.map((label, idx) => {
    const icon = pickIcon(label)
    // Alterner légèrement l'accent sur chaque card pour un visuel aéré
    const cardBg = idx % 2 === 0 ? accentBg : tokens.colors.surface
    return `
    <div style="
      background:${cardBg};
      border:1px solid ${tokens.colors.border};
      border-radius:${tokens.radius.card};
      padding:20px 16px;
      display:flex;
      flex-direction:column;
      align-items:flex-start;
      gap:10px;
      transition:box-shadow 0.2s ease;
    " class="kvt-bf-card">
      <div style="
        color:${successColor};
        display:flex;
        align-items:center;
        justify-content:center;
        width:40px;height:40px;
        background:${tokens.colors.surface};
        border-radius:${tokens.radius.card};
        flex-shrink:0;
        box-shadow:${tokens.shadows.card};
      ">
        ${icon}
      </div>
      <p style="
        font-family:${tokens.fonts.body};
        font-size:14px;
        font-weight:600;
        color:${tokens.colors.text};
        margin:0;
        line-height:1.4;
      ">${escapeHtml(label)}</p>
    </div>`
  }).join('')

  return `
<section style="background:${tokens.colors.surface};padding:${tokens.spacing.sectionMobile ?? '64px'} 24px">
  <style>
    @media (min-width:990px) {
      .kvt-bf-section { padding-top:${tokens.spacing.section} !important; padding-bottom:${tokens.spacing.section} !important; }
      .kvt-bf-grid { grid-template-columns: repeat(4, 1fr) !important; }
    }
    .kvt-bf-card:hover { box-shadow:${tokens.shadows.hover}; }
  </style>
  <div class="kvt-bf-section" style="max-width:1080px;margin:0 auto">
    <p style="
      font-family:${tokens.fonts.body};
      font-size:12px;letter-spacing:0.15em;text-transform:uppercase;
      color:${tokens.colors.textMuted};display:block;margin:0 0 24px;text-align:center
    ">Idéal pour</p>
    <div class="kvt-bf-grid" style="
      display:grid;
      grid-template-columns:repeat(2, 1fr);
      gap:${tokens.spacing.gap};
    ">${items.length > 0 ? cards : `
      <p style="color:${tokens.colors.textMuted};font-size:14px;grid-column:1/-1;text-align:center;margin:0">
        Informations non disponibles pour ce produit.
      </p>`}
    </div>
  </div>
</section>`.trim()
}

