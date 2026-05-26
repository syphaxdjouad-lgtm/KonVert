import type { StyleTokens } from '../types'

export const editorialTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#F8F6F2',
    accent:    '#0A0A0A',
    text:      '#0A0A0A',
    textMuted: '#5C5C5C',
    border:    'rgba(10, 10, 10, 0.1)',
  },
  fonts: {
    heading: '"Tiempos Headline", "Times New Roman", serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '160px', card: '40px', gap: '32px' },
  radius:  { card: '0px', button: '0px', image: '0px' },
  shadows: { card: 'none', hover: '0 0 0 1px rgba(10,10,10,0.2)' },
  motion:  { ease: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: '600ms' },
}
