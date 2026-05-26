export type { StyleId, StyleDefinition, StyleTokens } from './types'
import type { StyleId } from './types'

export const STYLE_IDS: readonly StyleId[] = [
  'soft', 'editorial', 'apple-clean', 'bold', 'organic',
  'luxe-noir', 'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant',
] as const

export const STYLE_LABELS: Record<StyleId, string> = {
  'soft':          'Soft — Mejuri / Glossier',
  'editorial':     'Editorial — Magazine',
  'apple-clean':   'Apple Clean',
  'bold':          'Bold — Bento',
  'organic':       'Organic — Natural',
  'luxe-noir':     'Luxe Noir',
  'brutalist':     'Brutalist',
  'warm-neutral':  'Warm Neutral',
  'minimal-mono':  'Minimal Mono',
  'vibrant':       'Vibrant',
}
