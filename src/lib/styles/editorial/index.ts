import type { StyleDefinition } from '../types'
import { editorialTokens } from './tokens'

export const editorialStyle: StyleDefinition = {
  id: 'editorial',
  name: 'Editorial',
  description: 'Magazine — grand serif, grilles asymétriques, radius 0',
  tokens: editorialTokens,
}

export { editorialTokens }
