import type { StyleTokens } from '../types'

export const brutalistTokens: StyleTokens = {
  colors: {
    bg:        '#F5F5F0',
    surface:   '#FFFFFF',
    accent:    '#FF6B35',
    text:      '#000000',
    textMuted: '#666666',
    border:    '#000000',
    // Sprint 1 — tokens sémantiques CRO (style raw + graphique)
    bgAlt:   '#EBEBEB',   // fond alterné gris neutre, contraste propre avec #F5F5F0
    success: '#008A00',   // vert pur, pas de subtilité — style brutalist
    warning: '#B35900',   // ambre sombre lisible sur fond clair
    danger:  '#CC0000',   // rouge pur
    star:    '#E6AC00',   // jaune lisible sur fond off-white
  },
  fonts: {
    heading: '"JetBrains Mono", "Courier New", monospace',
    body:    '"JetBrains Mono", "Courier New", monospace',
    mono:    '"JetBrains Mono", "Courier New", monospace',
  },
  spacing: { section: '100px', sectionMobile: '56px', card: '24px', gap: '16px' },
  radius:  { card: '0', button: '0', image: '0' },
  shadows: { card: 'none', hover: '4px 4px 0 #000' },
  motion:  { ease: 'linear', duration: '150ms', durationShort: '80ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
