import type { V3SectionKey } from '@/types/v3'

/**
 * Map V2 SectionKey strings → V3SectionKey. `null` = section supprimée en V3.
 * Référence : spec section 5.2 (suppressions V2).
 */
const V2_TO_V3_MAP: Record<string, V3SectionKey | null> = {
  // Conversion directe
  'gallery':                'gallery',
  'how_it_works':           'how_it_works',
  'testimonials':           'reviews_ai_summary',

  // Renommage / fusion en V3
  'social_proof_bar':       'press_quote',
  'story':                  'why_we_love',
  'target_audience':        'best_for',
  'features':               'thoughtfully_designed',
  'unique_mechanism':       'materials_breakdown',
  'press_mentions':         'press_quote',
  'founder_note':           'brand_manifesto',
  'value_stack':            'care_instructions',
  'bonuses':                'care_instructions',
  'guarantee':              'care_instructions',
  'risk_reversal':          'care_instructions',
  'objections':             'faq',
  'community_callout':      'brand_manifesto',
  'final_pitch':            'brand_manifesto',

  // Supprimées en V3 (patterns cheap / agressifs)
  'before_after':           null,
  'comparison':             null,
  'competitor_comparison':  null,
}

/**
 * Convertit un ordre de sections V2 en ordre V3, en :
 *  - dédupliquant (plusieurs sections V2 peuvent mapper sur la même V3)
 *  - filtrant les `null` (sections supprimées)
 *  - garantissant `hero` en première position
 */
export function mapV2SectionsToV3(v2: readonly string[]): V3SectionKey[] {
  const seen = new Set<V3SectionKey>()
  const result: V3SectionKey[] = ['hero']
  seen.add('hero')

  for (const key of v2) {
    const v3 = V2_TO_V3_MAP[key]
    if (v3 && !seen.has(v3)) {
      seen.add(v3)
      result.push(v3)
    }
  }
  return result
}
