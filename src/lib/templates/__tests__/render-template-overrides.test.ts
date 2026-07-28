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

describe('renderTemplate — etec-solo, accent adaptatif (globalStyles.accent)', () => {
  it('sans override, garde l\'indigo par défaut', () => {
    const html = renderTemplate('etec-solo', mockLandingDataFull)
    expect(html.toLowerCase()).toContain('#334fb4')
  })

  it('avec overrides.globalStyles.accent, recolore le CTA/badges avec l\'accent fourni', () => {
    const html = renderTemplate('etec-solo', mockLandingDataFull, {
      globalStyles: { accent: '#00D4FF' },
    })
    expect(html).toContain('#00D4FF')
    // L'indigo par défaut ne doit plus apparaître (entièrement remplacé par l'accent).
    expect(html.toLowerCase()).not.toContain('#334fb4')
    // Garde anti-régression : le template literal imbriqué (thumbnails outline)
    // doit être correctement interpolé — pas de littéral "${ACCENT}" non résolu.
    expect(html).not.toContain('${ACCENT}')
    // Le swap d'image (thumbnail actif) doit bien porter le vrai hex, pas un
    // littéral non interpolé, dans l'attribut outline inline.
    expect(html).toMatch(/outline:2px solid #00D4FF/)
  })

  it('ignore un accent invalide (pas un hex #RRGGBB) et garde le défaut', () => {
    const html = renderTemplate('etec-solo', mockLandingDataFull, {
      globalStyles: { accent: 'not-a-color' },
    })
    expect(html.toLowerCase()).toContain('#334fb4')
  })

  it('globalStyles.accent est ignoré pour les autres templates (pas de fuite cross-template)', () => {
    const html = renderTemplate('etec-blue', mockLandingDataFull, {
      globalStyles: { accent: '#00D4FF' },
    })
    // etec-blue n'a aucune notion d'accent adaptatif — le override ne doit
    // rien changer par rapport au rendu sans overrides.
    const htmlWithout = renderTemplate('etec-blue', mockLandingDataFull)
    expect(html).toBe(htmlWithout)
  })
})
