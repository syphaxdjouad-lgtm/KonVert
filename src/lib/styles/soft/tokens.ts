import type { StyleTokens } from '../types'

export const softTokens: StyleTokens = {
  colors: {
    bg:        '#FAF7F2',
    surface:   '#FFFFFF',
    accent:    '#C9A77E',
    text:      '#1A1614',
    textMuted: '#7A6F66',
    border:    'rgba(26, 22, 20, 0.08)',
  },
  fonts: {
    heading: '"Cormorant Garamond", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: {
    section: '128px',
    card:    '32px',
    gap:     '24px',
  },
  radius: {
    card:   '6px',
    button: '999px',
    image:  '4px',
  },
  shadows: {
    card:  '0 1px 3px rgba(26, 22, 20, 0.04)',
    hover: '0 8px 24px rgba(26, 22, 20, 0.08)',
  },
  motion: {
    ease:     'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: '400ms',
  },
}
