import type { StyleTokens } from '../types'

/**
 * Luxe Noir — Discipline anti-noir-massif NEXARA :
 * - Bg dominant = dark WARM (#14110F), pas noir pur (#000000)
 * - Text = cream warm (#F5F0E8), pas blanc pur
 * - Accent = or chaud (#C9A84C)
 * Le résultat doit rester SOMBRE mais CHALEUREUX (jamais cyber/froid).
 */
export const luxeNoirTokens: StyleTokens = {
  colors: {
    bg:        '#14110F',
    surface:   '#1F1B17',
    accent:    '#C9A84C',
    text:      '#F5F0E8',
    textMuted: '#A89E91',
    border:    'rgba(245, 240, 232, 0.1)',
  },
  fonts: {
    heading: '"Playfair Display", "Times New Roman", serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '140px', card: '32px', gap: '24px' },
  radius:  { card: '2px', button: '0px', image: '2px' },
  shadows: { card: 'none', hover: '0 0 24px rgba(201, 168, 76, 0.3)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '500ms' },
}
