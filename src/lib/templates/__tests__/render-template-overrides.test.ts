import { describe, it, expect } from 'vitest'
import { renderRichSections, DEFAULT_THEME } from '../sections'
import { renderTemplate } from '../index'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import type { SectionInstance } from '@/types/editor'

describe('renderRichSections — overrides.sectionOrder (chantier C1)', () => {
  it('comportement legacy preserve : sans sectionOrder, utilise DEFAULT_ORDER', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME)
    expect(html.length).toBeGreaterThan(1000)
  })

  it('respecte sectionOrder fourni (ordre custom)', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'guarantee', visible: true },
      { id: 'b', key: 'story', visible: true },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    const guaranteeIdx = html.indexOf(mockLandingDataFull.guarantee!.title)
    const storyIdx = html.indexOf(mockLandingDataFull.story!.problem)
    expect(guaranteeIdx).toBeGreaterThan(-1)
    expect(storyIdx).toBeGreaterThan(-1)
    expect(guaranteeIdx).toBeLessThan(storyIdx)
  })

  it('skippe les sections visible:false', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'story', visible: true },
      { id: 'b', key: 'testimonials', visible: false },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    expect(html).toContain(mockLandingDataFull.story!.problem)
    expect(html).not.toContain(mockLandingDataFull.testimonials![0].text)
  })

  it('accepte des SectionKey inconnues (skip silencieux)', () => {
    const customOrder = [
      { id: 'a', key: 'story' as const, visible: true },
      { id: 'b', key: 'inconnue' as never, visible: true },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    expect(html).toContain(mockLandingDataFull.story!.problem)
    expect(html).not.toContain('inconnue')
  })

  it('liste vide → ""', () => {
    expect(renderRichSections(mockLandingDataFull, DEFAULT_THEME, [])).toBe('')
  })
})

describe('renderTemplate — overrides.sectionOrder (chantier C1)', () => {
  it('comportement legacy preserve : sans overrides, rend normalement', () => {
    const html = renderTemplate('etec-blue', mockLandingDataFull)
    expect(html).toContain('<!DOCTYPE html')
    expect(html.length).toBeGreaterThan(5000)
  })

  it('avec overrides.sectionOrder, applique l\'ordre custom dans la section riche', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'guarantee', visible: true },
      { id: 'b', key: 'story', visible: true },
    ]
    const html = renderTemplate('etec-blue', mockLandingDataFull, { sectionOrder: customOrder })
    const guaranteeIdx = html.indexOf(mockLandingDataFull.guarantee!.title)
    const storyIdx = html.indexOf(mockLandingDataFull.story!.problem)
    expect(guaranteeIdx).toBeLessThan(storyIdx)
  })
})
