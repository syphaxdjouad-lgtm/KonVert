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

describe('renderRichSections — overrides.visualSettings (chantier C2)', () => {
  const sectionOrder: SectionInstance[] = [
    { id: 'sec-1', key: 'story', visible: true },
  ]

  it('padding lg → wrapper applique un padding accru sur la section', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, sectionOrder, false, {
      'sec-1': { padding: 'lg' },
    })
    expect(html).toMatch(/padding[^"]*120px/)
  })

  it('bgColor → wrapper applique background sur la section', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, sectionOrder, false, {
      'sec-1': { bgColor: '#FFEE00' },
    })
    expect(html.toLowerCase()).toContain('#ffee00')
  })

  it('alignment center → wrapper applique text-align:center', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, sectionOrder, false, {
      'sec-1': { alignment: 'center' },
    })
    expect(html).toMatch(/text-align[^"]*center/)
  })

  it('section sans visualSettings → comportement inchange (pas de wrapper)', () => {
    const htmlWith = renderRichSections(mockLandingDataFull, DEFAULT_THEME, sectionOrder, false, {})
    const htmlWithout = renderRichSections(mockLandingDataFull, DEFAULT_THEME, sectionOrder)
    expect(htmlWith).toContain(mockLandingDataFull.story!.problem)
    expect(htmlWithout).toContain(mockLandingDataFull.story!.problem)
    expect(htmlWith).not.toMatch(/data-kvt-visual-settings/)
  })
})

describe('renderTemplate — overrides.visualSettings (chantier C2)', () => {
  it('passe visualSettings au renderRichSections via _visualSettings', () => {
    const sectionOrder: SectionInstance[] = [
      { id: 'sec-1', key: 'story', visible: true },
    ]
    const html = renderTemplate('etec-blue', mockLandingDataFull, {
      sectionOrder,
      visualSettings: { 'sec-1': { bgColor: '#FFEE00' } },
    })
    expect(html.toLowerCase()).toContain('#ffee00')
  })
})
