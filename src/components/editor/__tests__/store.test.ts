import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '../store'
import type { EditorState, SectionInstance } from '@/types/editor'
import type { LandingPageData } from '@/types'

const fakeLandingData: LandingPageData = {
  headline: 'H',
  subtitle: 'S',
  benefits: ['b'],
  faq: [],
  cta: 'CTA',
  urgency: 'U',
  product_name: 'P',
}

const fakeSections: SectionInstance[] = [
  { id: 'id1', key: 'social_proof_bar', visible: true },
  { id: 'id2', key: 'story', visible: true },
  { id: 'id3', key: 'testimonials', visible: false },
]

describe('useEditorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      templateId: '',
      landingData: { ...fakeLandingData },
      sectionOrder: [],
      visualSettings: {},
      globalStyles: {},
      selectedSectionId: null,
      panelMode: 'sections',
      device: 'desktop',
    })
  })

  describe('hydrate', () => {
    it('charge un EditorState complet dans le store', () => {
      const state: EditorState = {
        templateId: 'etec-blue',
        landingData: fakeLandingData,
        sectionOrder: fakeSections,
        visualSettings: {},
        globalStyles: {},
      }
      useEditorStore.getState().hydrate(state)
      const s = useEditorStore.getState()
      expect(s.templateId).toBe('etec-blue')
      expect(s.sectionOrder).toHaveLength(3)
      expect(s.landingData.headline).toBe('H')
    })
  })

  describe('moveSection', () => {
    it('deplace une section par index source -> cible', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(0, 2)
      const order = useEditorStore.getState().sectionOrder
      expect(order.map(s => s.id)).toEqual(['id2', 'id3', 'id1'])
    })

    it('no-op si index identiques', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(1, 1)
      const order = useEditorStore.getState().sectionOrder
      expect(order.map(s => s.id)).toEqual(['id1', 'id2', 'id3'])
    })

    it('clamp les indices hors bornes', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(0, 99)
      const order = useEditorStore.getState().sectionOrder
      expect(order[order.length - 1].id).toBe('id1')
    })
  })

  describe('toggleVisible', () => {
    it('toggle visible d\'une section par id', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().toggleVisible('id1')
      const section = useEditorStore.getState().sectionOrder.find(s => s.id === 'id1')
      expect(section?.visible).toBe(false)
    })

    it('toggle inverse marche en boucle', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().toggleVisible('id3')
      const s = useEditorStore.getState().sectionOrder.find(s => s.id === 'id3')
      expect(s?.visible).toBe(true)
    })

    it('ignore les ids inconnus (no-op)', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      const before = JSON.stringify(useEditorStore.getState().sectionOrder)
      useEditorStore.getState().toggleVisible('unknown-id')
      const after = JSON.stringify(useEditorStore.getState().sectionOrder)
      expect(after).toBe(before)
    })
  })

  describe('removeSection', () => {
    it('supprime une section par id', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().removeSection('id2')
      const order = useEditorStore.getState().sectionOrder
      expect(order).toHaveLength(2)
      expect(order.map(s => s.id)).toEqual(['id1', 'id3'])
    })

    it('reset selectedSectionId si on supprime la section selectionnee', () => {
      useEditorStore.setState({
        sectionOrder: [...fakeSections],
        selectedSectionId: 'id2',
      })
      useEditorStore.getState().removeSection('id2')
      expect(useEditorStore.getState().selectedSectionId).toBeNull()
    })
  })

  describe('setSelectedSection / setPanelMode / setDevice', () => {
    it('setSelectedSection met a jour l\'id', () => {
      useEditorStore.getState().setSelectedSection('id42')
      expect(useEditorStore.getState().selectedSectionId).toBe('id42')
    })
    it('setPanelMode accepte les 4 modes', () => {
      useEditorStore.getState().setPanelMode('blocks')
      expect(useEditorStore.getState().panelMode).toBe('blocks')
    })
    it('setDevice accepte les 3 devices', () => {
      useEditorStore.getState().setDevice('mobile')
      expect(useEditorStore.getState().device).toBe('mobile')
    })
  })
})
