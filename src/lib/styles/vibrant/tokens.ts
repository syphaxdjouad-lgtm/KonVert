import type { StyleTokens } from '../types'

export const vibrantTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#FFF8E1',
    accent:    '#FF4D88',
    text:      '#1A1A1A',
    textMuted: '#666666',
    border:    '#1A1A1A',
    // Sprint 1 — tokens sémantiques CRO (saturés, cohérents avec l'énergie vibrant)
    bgAlt:   '#FFF0F8',   // fond alterné rose pâle (dérivé de l'accent rose)
    success: '#00B341',   // vert vif
    warning: '#FF8800',   // orange vif
    danger:  '#FF3355',   // rose-rouge vif, proche de l'accent
    star:    '#FFD700',   // jaune saturé
  },
  fonts: {
    // Clash Display (Fontshare) = self-host à terme — pour Phase 4, swap par
    // Space Grotesk (Google Fonts) qui a le même feeling display moderne.
    heading: '"Space Grotesk", "Inter", sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', sectionMobile: '60px', card: '32px', gap: '24px' },
  radius:  { card: '16px', button: '999px', image: '16px' },
  shadows: { card: '0 4px 16px rgba(255,77,136,0.15)', hover: '0 16px 40px rgba(255,77,136,0.25)' },
  motion:  { ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: '400ms', durationShort: '120ms', easeSpring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
}
