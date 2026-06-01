import type { StyleTokens } from '../types'

export const boldTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#FFF5E6',
    accent:    '#FF2277',
    text:      '#0F0F0F',
    textMuted: '#6B6B6B',
    border:    '#0F0F0F',
  },
  fonts: {
    // PP Neue Machina (Pangram) = propriétaire — swap par Space Grotesk (Google Fonts)
    heading: '"Space Grotesk", "Arial Black", sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '20px' },
  radius:  { card: '20px', button: '999px', image: '20px' },
  shadows: { card: '8px 8px 0 #0F0F0F', hover: '12px 12px 0 #FF2277' },
  motion:  { ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: '350ms' },
}
