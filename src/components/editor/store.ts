import { create } from 'zustand'
import type { EditorState, SectionInstance, VisualSettings, GlobalStyles, PanelMode, Device } from '@/types/editor'
import type { LandingPageData } from '@/types'

interface EditorActions {
  hydrate: (state: EditorState) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  toggleVisible: (id: string) => void
  removeSection: (id: string) => void
  setSelectedSection: (id: string | null) => void
  setPanelMode: (mode: PanelMode) => void
  setDevice: (device: Device) => void
}

interface EditorStore {
  templateId: string
  landingData: LandingPageData
  sectionOrder: SectionInstance[]
  visualSettings: VisualSettings
  globalStyles: GlobalStyles
  selectedSectionId: string | null
  panelMode: PanelMode
  device: Device
  hydrate: EditorActions['hydrate']
  moveSection: EditorActions['moveSection']
  toggleVisible: EditorActions['toggleVisible']
  removeSection: EditorActions['removeSection']
  setSelectedSection: EditorActions['setSelectedSection']
  setPanelMode: EditorActions['setPanelMode']
  setDevice: EditorActions['setDevice']
}

const emptyLanding: LandingPageData = {
  headline: '', subtitle: '', benefits: [], faq: [],
  cta: '', urgency: '', product_name: '',
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export const useEditorStore = create<EditorStore>((set) => ({
  templateId: '',
  landingData: emptyLanding,
  sectionOrder: [],
  visualSettings: {},
  globalStyles: {},
  selectedSectionId: null,
  panelMode: 'sections',
  device: 'desktop',

  hydrate: (state) => set({
    templateId: state.templateId,
    landingData: state.landingData,
    sectionOrder: state.sectionOrder,
    visualSettings: state.visualSettings,
    globalStyles: state.globalStyles,
    selectedSectionId: null,
  }),

  moveSection: (fromIndex, toIndex) => set(state => {
    const order = [...state.sectionOrder]
    if (order.length === 0) return state
    const from = clamp(fromIndex, 0, order.length - 1)
    const to = clamp(toIndex, 0, order.length - 1)
    if (from === to) return state
    const [moved] = order.splice(from, 1)
    order.splice(to, 0, moved)
    return { sectionOrder: order }
  }),

  toggleVisible: (id) => set(state => {
    const idx = state.sectionOrder.findIndex(s => s.id === id)
    if (idx === -1) return state
    const next = [...state.sectionOrder]
    next[idx] = { ...next[idx], visible: !next[idx].visible }
    return { sectionOrder: next }
  }),

  removeSection: (id) => set(state => ({
    sectionOrder: state.sectionOrder.filter(s => s.id !== id),
    selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
  })),

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  setPanelMode: (mode) => set({ panelMode: mode }),
  setDevice: (device) => set({ device }),
}))
