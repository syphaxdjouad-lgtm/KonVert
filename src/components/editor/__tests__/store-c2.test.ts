import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useEditorStore } from '../store'
import type { SectionInstance } from '@/types/editor'
import type { LandingPageData } from '@/types'

const baseLandingData: LandingPageData = {
  headline: 'H',
  subtitle: 'S',
  benefits: ['b'],
  faq: [],
  cta: 'CTA',
  urgency: 'U',
  product_name: 'P',
}

const fakeSections: SectionInstance[] = [
  { id: 'id1', key: 'story', visible: true },
  { id: 'id2', key: 'features', visible: true },
]

function resetStore() {
  useEditorStore.setState({
    templateId: '',
    landingData: { ...baseLandingData },
    sectionOrder: [],
    visualSettings: {},
    globalStyles: {},
    sectionData: {},
    saveStatus: 'idle',
    lastSavedAt: null,
    selectedSectionId: null,
    panelMode: 'sections',
    device: 'desktop',
    panelOpen: false,
    subPanelEditOpen: false,
    editingSectionId: null,
    editForm: { title: '', subtitle: '' },
  })
}

describe('useEditorStore — C2 sectionData + visualSettings', () => {
  beforeEach(resetStore)

  describe('updateSectionField', () => {
    it('mute sectionData[sectionId][fieldPath] avec la valeur', () => {
      useEditorStore.getState().updateSectionField('id1', 'story.hero_title', 'Nouveau titre')
      const s = useEditorStore.getState()
      expect(s.sectionData['id1']?.['story.hero_title']).toBe('Nouveau titre')
    })

    it('crée l\'entrée si sectionId inconnu, sans erreur', () => {
      expect(() => {
        useEditorStore.getState().updateSectionField('unknown-id', 'foo', 'bar')
      }).not.toThrow()
      expect(useEditorStore.getState().sectionData['unknown-id']?.['foo']).toBe('bar')
    })

    it('préserve les autres fields de la même section', () => {
      const api = useEditorStore.getState()
      api.updateSectionField('id1', 'story.hero_title', 'Titre')
      api.updateSectionField('id1', 'story.problem', 'Problème')
      const data = useEditorStore.getState().sectionData['id1']
      expect(data?.['story.hero_title']).toBe('Titre')
      expect(data?.['story.problem']).toBe('Problème')
    })
  })

  describe('updateVisualSetting', () => {
    it('mute visualSettings[sectionId].padding', () => {
      useEditorStore.getState().updateVisualSetting('id1', { padding: 'lg' })
      expect(useEditorStore.getState().visualSettings['id1']?.padding).toBe('lg')
    })

    it('merge (ne remplace pas) les champs existants', () => {
      useEditorStore.setState({
        visualSettings: { id1: { padding: 'sm', bgColor: '#FFF' } },
      })
      useEditorStore.getState().updateVisualSetting('id1', { padding: 'lg' })
      const vs = useEditorStore.getState().visualSettings['id1']
      expect(vs?.padding).toBe('lg')
      expect(vs?.bgColor).toBe('#FFF')
    })
  })

  describe('getRenderOverrides', () => {
    it('retourne { sectionOrder, visualSettings } depuis le store', () => {
      useEditorStore.setState({
        sectionOrder: fakeSections,
        visualSettings: { id1: { padding: 'lg' } },
      })
      const overrides = useEditorStore.getState().getRenderOverrides()
      expect(overrides.sectionOrder).toEqual(fakeSections)
      expect(overrides.visualSettings).toEqual({ id1: { padding: 'lg' } })
    })
  })

  describe('saveStatus', () => {
    it('setSaveStatus mute le statut', () => {
      useEditorStore.getState().setSaveStatus('saving')
      expect(useEditorStore.getState().saveStatus).toBe('saving')
    })

    it('démarre à idle', () => {
      expect(useEditorStore.getState().saveStatus).toBe('idle')
    })
  })

  describe('scheduleAutoSave — debounce 3s', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('callback appelé après 3000ms, pas avant', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      useEditorStore.getState().scheduleAutoSave('page1', onSave)

      vi.advanceTimersByTime(2999)
      expect(onSave).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(1)
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('debounce : 2 appels rapides → callback appelé 1 seule fois', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const api = useEditorStore.getState()
      api.scheduleAutoSave('page1', onSave)
      vi.advanceTimersByTime(1000)
      api.scheduleAutoSave('page1', onSave)
      await vi.advanceTimersByTimeAsync(3000)
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('setSaveStatus passe à saving puis saved en cas de succès', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      useEditorStore.getState().scheduleAutoSave('page1', onSave)
      await vi.advanceTimersByTimeAsync(3000)
      expect(useEditorStore.getState().saveStatus).toBe('saved')
      expect(useEditorStore.getState().lastSavedAt).toBeInstanceOf(Date)
    })
  })
})

describe('hasDataForSection — bug C1 trust_badges_payment (D4)', () => {
  it('retourne true si payment_methods défini et non vide', async () => {
    const { hasDataForSection } = await import('../store')
    const data: LandingPageData = {
      ...baseLandingData,
      payment_methods: ['visa', 'mastercard'],
    }
    expect(hasDataForSection(data, 'trust_badges_payment')).toBe(true)
  })

  it('retourne false si payment_methods absent', async () => {
    const { hasDataForSection } = await import('../store')
    expect(hasDataForSection(baseLandingData, 'trust_badges_payment')).toBe(false)
  })
})
