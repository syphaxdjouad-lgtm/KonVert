import { describe, it, expect } from 'vitest'
import { DEFAULT_ORDER, type SectionKey } from '../sections'

describe('DEFAULT_ORDER', () => {
  it('contient exactement 19 sections', () => {
    expect(DEFAULT_ORDER).toHaveLength(19)
  })

  it('contient toutes les SectionKey attendues dans le bon ordre', () => {
    expect(DEFAULT_ORDER).toEqual([
      'social_proof_bar',
      'story',
      'target_audience',
      'features',
      'unique_mechanism',
      'how_it_works',
      'before_after',
      'comparison',
      'competitor_comparison',
      'testimonials',
      'press_mentions',
      'founder_note',
      'value_stack',
      'bonuses',
      'guarantee',
      'risk_reversal',
      'objections',
      'community_callout',
      'final_pitch',
    ] satisfies SectionKey[])
  })

  it('ne contient pas de hero_badges (qui reste dans le hero du template)', () => {
    expect(DEFAULT_ORDER).not.toContain('hero_badges' as SectionKey)
  })

  it('ne contient pas de doublon', () => {
    expect(new Set(DEFAULT_ORDER).size).toBe(DEFAULT_ORDER.length)
  })
})
