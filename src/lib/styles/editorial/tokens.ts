import type { StyleTokens } from '../types'

export const editorialTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#F8F6F2',
    accent:    '#0A0A0A',
    text:      '#0A0A0A',
    textMuted: '#5C5C5C',
    border:    'rgba(10, 10, 10, 0.1)',
    // Sprint 1 — tokens sémantiques CRO (sobres, cohérents avec l'esthétique éditoriale)
    bgAlt:   '#F2EFE8',   // fond alterné beige-papier, rappelle une gazette
    success: '#1B6B3A',   // vert sobre, pas néon
    warning: '#8B5E00',   // ambre foncé lisible sur fond blanc/beige
    danger:  '#8B1A1A',   // rouge sobre — pas agressif
    star:    '#B8860B',   // or foncé, ton éditorial
  },
  fonts: {
    // Tiempos Headline (Klim) = propriétaire — swap par Playfair Display (Google Fonts)
    heading: '"Playfair Display", "Times New Roman", serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '160px', sectionMobile: '80px', card: '40px', gap: '32px' },
  radius:  { card: '0px', button: '0px', image: '0px' },
  shadows: { card: 'none', hover: '0 0 0 1px rgba(10,10,10,0.2)' },
  motion:  { ease: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: '600ms', durationShort: '150ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
