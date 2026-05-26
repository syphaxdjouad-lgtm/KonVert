import type { StyleDefinition } from '../types'
import { brutalistTokens } from './tokens'

export const brutalistStyle: StyleDefinition = {
  id: 'brutalist',
  name: 'Brutalist',
  description: 'Monospace + grilles strictes + radius 0 (Vercel/Linear vibe)',
  tokens: brutalistTokens,
}

export { brutalistTokens }
