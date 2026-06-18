import type { StyleTokens } from '../types'

export const organicTokens: StyleTokens = {
  colors: {
    bg:        '#F4F1ED',
    surface:   '#FAF8F4',
    accent:    '#4A7C59',
    text:      '#1F2D24',
    textMuted: '#6B7B70',
    border:    'rgba(31,45,36,0.08)',
    // Sprint 1 — tokens sémantiques CRO (tons naturels, cohérents avec le style organic)
    bgAlt:   '#EAE5DC',   // fond alterné beige légèrement plus soutenu
    success: '#2D6A4F',   // vert forêt, cohérent avec l'accent vert #4A7C59
    warning: '#B5651D',   // terre cuite ambre
    danger:  '#A03030',   // rouge sobre, pas agressif
    star:    '#D4A017',   // or naturel / miel
  },
  fonts: {
    heading: '"DM Serif Display", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '128px', sectionMobile: '64px', card: '32px', gap: '24px' },
  radius:  { card: '16px', button: '999px', image: '12px' },
  shadows: { card: '0 2px 8px rgba(31,45,36,0.06)', hover: '0 12px 32px rgba(31,45,36,0.1)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '500ms', durationShort: '120ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
