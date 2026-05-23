import { describe, it, expect } from 'vitest'
import { DEFAULT_ORDER, renderRichSections, type SectionKey } from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'
import type { LandingPageData } from '@/types'

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

describe('renderRichSections', () => {
  it('retourne "" quand toutes les sections sont absentes', () => {
    const emptyData = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
    } as LandingPageData
    expect(renderRichSections(emptyData)).toBe('')
  })

  it('rend du HTML quand au moins une section a de la data', () => {
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData
    const html = renderRichSections(data)
    expect(html).toContain('<section')
    expect(html).toContain('P')
  })

  it('respecte l\'ordre custom via le paramètre order', () => {
    const data = mockLandingDataFull
    const html = renderRichSections(data, undefined, ['features', 'story'])
    const idxFeatures = html.indexOf('Botanique')          // mot dans features
    const idxStory = html.indexOf('1% de collagène')       // mot dans story.problem
    expect(idxFeatures).toBeGreaterThan(-1)
    expect(idxStory).toBeGreaterThan(-1)
    expect(idxFeatures).toBeLessThan(idxStory)
  })

  it('skippe les clés inconnues sans throw', () => {
    const data = mockLandingDataFull
    const html = renderRichSections(data, undefined, ['UNKNOWN_KEY' as SectionKey])
    expect(html).toBe('')
  })

  it('rend les ~10 sections présentes dans mockLandingDataPartial et skippe les autres', () => {
    const html = renderRichSections(mockLandingDataPartial)
    // Sections présentes : doivent apparaître
    expect(html).toContain('12 480')              // social_proof_bar
    expect(html).toContain('Bio-Stim')            // story.solution
    expect(html).toContain('Botanique')           // features
    expect(html).toContain('Sophie L.')           // testimonials
    expect(html).toContain('Satisfait ou remboursé') // guarantee
    expect(html).toContain('Pochette')            // bonuses
    expect(html).toContain('Rides')               // comparison
    // Sections absentes : NE doivent pas générer de HTML "vide" ou "undefined"
    expect(html).not.toContain('undefined')
    expect(html).not.toContain('[object Object]')
  })
})
