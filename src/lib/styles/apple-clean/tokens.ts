import type { StyleTokens } from '../types'

export const appleCleanTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#F5F5F7',
    accent:    '#0066CC',
    text:      '#1D1D1F',
    textMuted: '#86868B',
    border:    '#D2D2D7',
  },
  fonts: {
    heading: '"SF Pro Display", "Inter", system-ui, sans-serif',
    body:    '"SF Pro Text", "Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '40px', gap: '24px' },
  radius:  { card: '12px', button: '980px', image: '12px' },
  shadows: { card: '0 4px 12px rgba(0,0,0,0.04)', hover: '0 12px 32px rgba(0,0,0,0.08)' },
  motion:  { ease: 'cubic-bezier(0.42, 0, 0.58, 1)', duration: '600ms' },
}
