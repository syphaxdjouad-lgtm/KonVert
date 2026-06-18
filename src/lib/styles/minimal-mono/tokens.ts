import type { StyleTokens } from '../types'

export const minimalMonoTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#FAFAFA',
    accent:    '#000000',
    text:      '#000000',
    textMuted: '#737373',
    border:    '#E5E5E5',
    // Sprint 1 — tokens sémantiques CRO (monochromes, sobres)
    bgAlt:   '#F5F5F5',   // fond alterné gris très clair
    success: '#166534',   // vert sombre lisible sur blanc
    warning: '#92400E',   // ambre sombre, cohérent mono
    danger:  '#991B1B',   // rouge sombre
    star:    '#78350F',   // brun-or sombre, cohérent avec le noir mono
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', sectionMobile: '64px', card: '32px', gap: '24px' },
  radius:  { card: '4px', button: '4px', image: '4px' },
  shadows: { card: 'none', hover: '0 4px 12px rgba(0,0,0,0.06)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '300ms', durationShort: '100ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
