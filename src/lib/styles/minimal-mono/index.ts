import type { StyleDefinition } from '../types'
import { minimalMonoTokens } from './tokens'

export const minimalMonoStyle: StyleDefinition = {
  id: 'minimal-mono',
  name: 'Minimal Mono',
  description: 'N&B strict + Inter only + radius 4px (MUJI/Everlane vibe)',
  tokens: minimalMonoTokens,
}

export { minimalMonoTokens }
