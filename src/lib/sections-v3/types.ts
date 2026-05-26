import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export type SectionRenderer = (data: V3PageData, tokens: StyleTokens) => string

export interface DisplayRule {
  key: V3SectionKey
  shouldRender: (data: V3PageData) => boolean
}
