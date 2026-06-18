import type { StyleTokens } from '../types'

export const appleCleanTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#F5F5F7',
    accent:    '#0066CC',
    text:      '#1D1D1F',
    textMuted: '#86868B',
    border:    '#D2D2D7',
    // Sprint 1 — tokens sémantiques CRO
    bgAlt:   '#F5F5F7',   // fond alterné = même surface Apple pour cohérence
    success: '#34C759',   // Apple green iOS
    warning: '#FF9F0A',   // Apple amber iOS
    danger:  '#FF3B30',   // Apple red iOS
    star:    '#FF9F0A',   // cohérent avec warning (same apple amber)
  },
  fonts: {
    heading: '"SF Pro Display", "Inter", system-ui, sans-serif',
    body:    '"SF Pro Text", "Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', sectionMobile: '64px', card: '40px', gap: '24px' },
  radius:  { card: '12px', button: '980px', image: '12px' },
  shadows: { card: '0 4px 12px rgba(0,0,0,0.04)', hover: '0 12px 32px rgba(0,0,0,0.08)' },
  motion:  { ease: 'cubic-bezier(0.42, 0, 0.58, 1)', duration: '600ms', durationShort: '100ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
