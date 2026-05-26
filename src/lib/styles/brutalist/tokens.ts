import type { StyleTokens } from '../types'

export const brutalistTokens: StyleTokens = {
  colors: {
    bg:        '#F5F5F0',
    surface:   '#FFFFFF',
    accent:    '#FF6B35',
    text:      '#000000',
    textMuted: '#666666',
    border:    '#000000',
  },
  fonts: {
    heading: '"JetBrains Mono", "Courier New", monospace',
    body:    '"JetBrains Mono", "Courier New", monospace',
    mono:    '"JetBrains Mono", "Courier New", monospace',
  },
  spacing: { section: '100px', card: '24px', gap: '16px' },
  radius:  { card: '0', button: '0', image: '0' },
  shadows: { card: 'none', hover: '4px 4px 0 #000' },
  motion:  { ease: 'linear', duration: '150ms' },
}
