import { describe, it, expect } from 'vitest'
import { LEGACY_TEMPLATE_TO_STYLE, mapLegacyToStyle } from './legacy-to-v3'
import { mapV2SectionsToV3 } from './section-v2-to-v3'
import { STYLE_IDS } from '@/lib/styles'

describe('mapLegacyToStyle', () => {
  it('maps all 42 etec-* templates to a valid StyleId', () => {
    const keys = Object.keys(LEGACY_TEMPLATE_TO_STYLE)
    expect(keys.length).toBe(42)
    for (const tpl of keys) {
      const style = mapLegacyToStyle(tpl)
      expect(STYLE_IDS).toContain(style)
    }
  })

  it('returns minimal-mono for unknown template', () => {
    expect(mapLegacyToStyle('unknown-xyz')).toBe('minimal-mono')
  })

  it('maps specific known templates correctly', () => {
    expect(mapLegacyToStyle('etec-platina')).toBe('luxe-noir')
    expect(mapLegacyToStyle('etec-rose')).toBe('soft')
    expect(mapLegacyToStyle('etec-gadget')).toBe('apple-clean')
    expect(mapLegacyToStyle('etec-streetz')).toBe('brutalist')
  })
})

describe('mapV2SectionsToV3', () => {
  it('always includes hero first', () => {
    const result = mapV2SectionsToV3(['story', 'features'])
    expect(result[0]).toBe('hero')
  })

  it('removes duplicates (multiple V2 mapping to same V3)', () => {
    const result = mapV2SectionsToV3(['value_stack', 'bonuses', 'guarantee', 'risk_reversal'])
    const careCount = result.filter(k => k === 'care_instructions').length
    expect(careCount).toBe(1)
  })

  it('drops null mappings (before_after, comparison, competitor_comparison)', () => {
    const result = mapV2SectionsToV3(['before_after', 'comparison', 'competitor_comparison', 'story'])
    expect(result).not.toContain('before_after')
    expect(result).not.toContain('comparison')
    expect(result).not.toContain('competitor_comparison')
    expect(result).toContain('hero')
    expect(result).toContain('why_we_love')
  })

  it('maps known sections correctly', () => {
    const result = mapV2SectionsToV3(['story', 'features', 'target_audience', 'gallery', 'final_pitch'])
    expect(result).toContain('why_we_love')              // story
    expect(result).toContain('thoughtfully_designed')    // features
    expect(result).toContain('best_for')                 // target_audience
    expect(result).toContain('gallery')                  // gallery
    expect(result).toContain('brand_manifesto')          // final_pitch
  })

  it('returns just ["hero"] for empty input', () => {
    expect(mapV2SectionsToV3([])).toEqual(['hero'])
  })

  it('ignores unknown V2 section keys', () => {
    const result = mapV2SectionsToV3(['unknown_section', 'story', 'xyz'])
    expect(result).toEqual(['hero', 'why_we_love'])
  })
})
