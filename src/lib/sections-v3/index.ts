export type { V3SectionKey } from '@/types/v3'
export type { SectionRenderer, DisplayRule } from './types'

import type { V3SectionKey } from '@/types/v3'

export const DEFAULT_SECTION_ORDER_V3: readonly V3SectionKey[] = [
  'hero',
  'gallery',
  'why_we_love',
  'thoughtfully_designed',
  'best_for',
  'materials_breakdown',
  'how_it_works',
  'compare_variants',
  'reviews_ai_summary',
  'reviews',          // Sprint 2 — section reviews individuelle (P3) après le résumé AI
  'press_quote',
  'care_instructions',
  'faq',
  'brand_manifesto',
] as const
