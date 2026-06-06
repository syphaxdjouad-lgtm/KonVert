import { describe, it, expect, afterEach } from 'vitest'
import { DEFAULT_ORDER, renderRichSections, type SectionKey } from '../sections'
import * as sections from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'
import type { LandingPageData } from '@/types'

describe('DEFAULT_ORDER', () => {
  it('contient exactement 21 sections', () => {
    expect(DEFAULT_ORDER).toHaveLength(21)
  })

  it('contient toutes les SectionKey attendues dans le bon ordre', () => {
    expect(DEFAULT_ORDER).toEqual([
      'social_proof_bar',
      'story',
      'target_audience',
      'features',
      'gallery',
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
      'trust_badges_payment',
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
  it('rend uniquement trust_badges_payment quand toutes les autres sections sont absentes', () => {
    // trust_badges_payment est "always-on" (fallback Visa/MC/PayPal/Apple Pay)
    // => renderRichSections retourne au minimum le bloc trust badges, pas ''
    const emptyData = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
    } as LandingPageData
    const html = renderRichSections(emptyData)
    expect(html).toContain('Paiement sécurisé')
    expect(html).not.toContain('undefined')
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
    // Aucune section "rich" rendue (clé inconnue) — mais le sticky CTA peut être injecté
    // si data.price est défini. On vérifie juste l'absence de throw et que les
    // sections inconnues ne génèrent pas de HTML de section.
    expect(html).not.toContain('undefined')
    // Pas de <section data-kvt-* pour la clé inconnue
    expect(html).not.toContain('UNKNOWN_KEY')
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

describe('renderRichSections — feature flag', () => {
  const originalEnv = process.env.KONVERT_RICH_SECTIONS

  afterEach(() => {
    process.env.KONVERT_RICH_SECTIONS = originalEnv
  })

  it('retourne "" quand KONVERT_RICH_SECTIONS=false (rollback)', () => {
    process.env.KONVERT_RICH_SECTIONS = 'false'
    expect(renderRichSections(mockLandingDataFull)).toBe('')
  })

  it('rend normalement quand KONVERT_RICH_SECTIONS=true', () => {
    process.env.KONVERT_RICH_SECTIONS = 'true'
    const html = renderRichSections(mockLandingDataFull)
    expect(html.length).toBeGreaterThan(100)
  })

  it('rend normalement quand KONVERT_RICH_SECTIONS est undefined (défaut)', () => {
    delete process.env.KONVERT_RICH_SECTIONS
    const html = renderRichSections(mockLandingDataFull)
    expect(html.length).toBeGreaterThan(100)
  })
})

describe('renderRichSections — editMode (click-to-edit)', () => {
  it('editMode=false : pas de data-kvt-section-id dans le HTML', () => {
    const html = renderRichSections(mockLandingDataFull, undefined, undefined, false)
    expect(html).not.toContain('data-kvt-section-id')
  })

  it('editMode=true : chaque section a data-kvt-section-id', () => {
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData
    const html = renderRichSections(data, undefined, undefined, true)
    expect(html).toContain('data-kvt-section-id')
  })

  it('editMode=true : le bloc <script> KVT est injecte exactement une fois', () => {
    const html = renderRichSections(mockLandingDataFull, undefined, undefined, true)
    // Compter le nombre de blocs <script> KVT (pas les occurrences de la string de detection)
    const count = (html.match(/__kvtClickToEditInjected\s*=\s*true/g) ?? []).length
    expect(count).toBe(1)
  })

  it('editMode=true avec SectionInstance[] : utilise l\'instance.id comme kvt-id', () => {
    const instances = [
      { id: 'instance-123', key: 'story' as SectionKey, visible: true },
    ]
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData
    const html = renderRichSections(data, undefined, instances, true)
    expect(html).toContain('data-kvt-section-id="instance-123"')
  })

  it('editMode=true avec SectionInstance[] invisible : pas de section rendue', () => {
    const instances = [
      { id: 'inst-hidden', key: 'story' as SectionKey, visible: false },
    ]
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData
    const html = renderRichSections(data, undefined, instances, true)
    expect(html).not.toContain('inst-hidden')
  })

  it('_kvt_edit_mode dans data active editMode sans le parametre', () => {
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      _kvt_edit_mode: true,
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData & { _kvt_edit_mode: boolean }
    const html = renderRichSections(data)
    expect(html).toContain('data-kvt-section-id')
  })
})

describe('Backward compatibility aliases (V1 names)', () => {
  it('exporte renderStorySection qui pointe vers renderStoryV2', () => {
    expect(sections.renderStorySection).toBe(sections.renderStoryV2)
  })

  it('exporte renderSocialProofBar qui pointe vers renderSocialProofBarV2', () => {
    expect(sections.renderSocialProofBar).toBe(sections.renderSocialProofBarV2)
  })

  it('exporte renderTestimonialsSection qui pointe vers renderTestimonialsV2', () => {
    expect(sections.renderTestimonialsSection).toBe(sections.renderTestimonialsV2)
  })

  it('exporte renderComparisonSection qui pointe vers renderComparisonV2', () => {
    expect(sections.renderComparisonSection).toBe(sections.renderComparisonV2)
  })

  it('exporte renderBonusesSection qui pointe vers renderBonusesV2', () => {
    expect(sections.renderBonusesSection).toBe(sections.renderBonusesV2)
  })

  it('exporte renderGuaranteeSection qui pointe vers renderGuaranteeV2', () => {
    expect(sections.renderGuaranteeSection).toBe(sections.renderGuaranteeV2)
  })
})
