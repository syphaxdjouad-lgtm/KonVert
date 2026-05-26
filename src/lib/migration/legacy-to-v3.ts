import type { StyleId } from '@/lib/styles/types'

/**
 * Mapping des 42 templates legacy `etec-*` vers les 10 styles V3.
 * Choisi pour préserver au mieux la "vibe" originale du template.
 */
export const LEGACY_TEMPLATE_TO_STYLE: Record<string, StyleId> = {
  'etec-blue':      'apple-clean',
  'etec-noir':      'luxe-noir',
  'etec-rose':      'soft',
  'etec-sage':      'organic',
  'etec-gold':      'luxe-noir',
  'etec-energy':    'bold',
  'etec-beauty':    'soft',
  'etec-style':     'warm-neutral',
  'etec-shopz':     'minimal-mono',
  'etec-velvety':   'organic',
  'etec-prime':     'apple-clean',
  'etec-blusho':    'soft',
  'etec-casa':      'warm-neutral',
  'etec-pet':       'vibrant',
  'etec-gadget':    'apple-clean',
  'etec-aura':      'organic',
  'etec-luxe':      'luxe-noir',
  'etec-pulse':     'bold',
  'etec-nordic':    'editorial',
  'etec-cosmetix':  'soft',
  'etec-trendy':    'warm-neutral',
  'etec-solo':      'minimal-mono',
  'etec-prestige':  'luxe-noir',
  'etec-glow':      'soft',
  'etec-homestyle': 'warm-neutral',
  'etec-jewel':     'luxe-noir',
  'etec-techcase':  'minimal-mono',
  'etec-artisan':   'organic',
  'etec-outfit':    'warm-neutral',
  'etec-ella':      'soft',
  'etec-starter':   'minimal-mono',
  'etec-glowup':    'vibrant',
  'etec-hue':       'vibrant',
  'etec-interior':  'organic',
  'etec-platina':   'luxe-noir',
  'etec-streetz':   'brutalist',
  'etec-poterie':   'warm-neutral',
  'etec-electro':   'bold',
  'etec-agency':    'minimal-mono',
  'etec-supreme':   'brutalist',
  'etec-quarter':   'minimal-mono',
  'etec-boost':     'bold',
}

export function mapLegacyToStyle(templateId: string): StyleId {
  return LEGACY_TEMPLATE_TO_STYLE[templateId] ?? 'minimal-mono'
}
