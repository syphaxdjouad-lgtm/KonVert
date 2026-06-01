import type { StyleTokens } from '../types'

export const vibrantTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#FFF8E1',
    accent:    '#FF4D88',
    text:      '#1A1A1A',
    textMuted: '#666666',
    border:    '#1A1A1A',
  },
  fonts: {
    // Clash Display (Fontshare) = self-host à terme — pour Phase 4, swap par
    // Space Grotesk (Google Fonts) qui a le même feeling display moderne.
    heading: '"Space Grotesk", "Inter", sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '24px' },
  radius:  { card: '16px', button: '999px', image: '16px' },
  shadows: { card: '0 4px 16px rgba(255,77,136,0.15)', hover: '0 16px 40px rgba(255,77,136,0.25)' },
  motion:  { ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: '400ms' },
}
