import type { StyleTokens } from '../types'

export const warmNeutralTokens: StyleTokens = {
  colors: {
    bg:        '#F4ECE0',
    surface:   '#FAF5EC',
    accent:    '#B5854B',
    text:      '#3B2F23',
    textMuted: '#8B7D6E',
    border:    'rgba(59,47,35,0.1)',
    // Sprint 1 — tokens sémantiques CRO (tons chauds, cohérents avec la palette beige/caramel)
    bgAlt:   '#EDE4D6',   // fond alterné légèrement plus soutenu, même famille
    success: '#3D6B47',   // vert terracotta sobre
    warning: '#9C5E1A',   // ambre chaud, proche de l'accent caramel
    danger:  '#8B2020',   // rouge terre, pas agressif
    star:    '#C47F17',   // or caramel, cohérent avec l'accent #B5854B
  },
  fonts: {
    // PP Editorial New (Pangram) = propriétaire — swap par DM Serif Display (Google Fonts)
    heading: '"DM Serif Display", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '128px', sectionMobile: '64px', card: '32px', gap: '24px' },
  radius:  { card: '8px', button: '999px', image: '8px' },
  shadows: { card: '0 2px 8px rgba(59,47,35,0.06)', hover: '0 12px 32px rgba(59,47,35,0.1)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '450ms', durationShort: '120ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
