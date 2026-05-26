import type { StyleTokens } from '../types'

export const minimalMonoTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#FAFAFA',
    accent:    '#000000',
    text:      '#000000',
    textMuted: '#737373',
    border:    '#E5E5E5',
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '24px' },
  radius:  { card: '4px', button: '4px', image: '4px' },
  shadows: { card: 'none', hover: '0 4px 12px rgba(0,0,0,0.06)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '300ms' },
}
