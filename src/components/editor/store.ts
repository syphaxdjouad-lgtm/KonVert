import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { EditorState, SectionInstance, VisualSettings, GlobalStyles, PanelMode, Device } from '@/types/editor'
import type { LandingPageData } from '@/types'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import type { SectionKey } from '@/lib/templates/sections'

// Edit form state for SubPanelEdit (C1 minimal)
export interface EditFormState {
  title: string
  subtitle: string
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type SectionData = Record<string, Record<string, unknown>>

interface EditorActions {
  hydrate: (state: EditorState) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  toggleVisible: (id: string) => void
  removeSection: (id: string) => void
  duplicateSection: (id: string) => void
  setSelectedSection: (id: string | null) => void
  setPanelMode: (mode: PanelMode) => void
  setDevice: (device: Device) => void
  setPanelOpen: (open: boolean) => void
  setSubPanelEditOpen: (open: boolean) => void
  setEditForm: (form: Partial<EditFormState>) => void
  openSubPanelEdit: (sectionId: string) => void
  // ─── C2 actions ──────────────────────────────────────────────────────────
  updateSectionField: (sectionId: string, fieldPath: string, value: unknown) => void
  updateVisualSetting: (sectionId: string, patch: Partial<VisualSettings[string]>) => void
  setSaveStatus: (status: SaveStatus) => void
  scheduleAutoSave: (pageId: string, onSave: (jsonForDb: object) => Promise<void>) => void
  getRenderOverrides: () => { sectionOrder: SectionInstance[]; visualSettings: VisualSettings }
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
  // V3 — html rendu serveur (renderPageV3) pour bypass renderTemplate côté
  // client. Set par EditorRoot via staticHtml prop quand engine V3 a généré
  // la page (le client ne peut pas re-render les 13 sections V3, c'est serveur).
  staticHtml: string
  setStaticHtml: (html: string) => void
  // v2 panel state
  panelOpen: boolean
  subPanelEditOpen: boolean
  editingSectionId: string | null
  editForm: EditFormState
  // C2 — édition par section + auto-save
  sectionData: SectionData
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  hydrate: EditorActions['hydrate']
  moveSection: EditorActions['moveSection']
  toggleVisible: EditorActions['toggleVisible']
  removeSection: EditorActions['removeSection']
  duplicateSection: EditorActions['duplicateSection']
  setSelectedSection: EditorActions['setSelectedSection']
  setPanelMode: EditorActions['setPanelMode']
  setDevice: EditorActions['setDevice']
  setPanelOpen: EditorActions['setPanelOpen']
  setSubPanelEditOpen: EditorActions['setSubPanelEditOpen']
  setEditForm: EditorActions['setEditForm']
  openSubPanelEdit: EditorActions['openSubPanelEdit']
  updateSectionField: EditorActions['updateSectionField']
  updateVisualSetting: EditorActions['updateVisualSetting']
  setSaveStatus: EditorActions['setSaveStatus']
  scheduleAutoSave: EditorActions['scheduleAutoSave']
  getRenderOverrides: EditorActions['getRenderOverrides']
}

// Timer ref pour debounce auto-save. Hors store pour éviter de re-render.
// Reset par chaque scheduleAutoSave (debounce).
let autoSaveTimerRef: ReturnType<typeof setTimeout> | null = null

const emptyLanding: LandingPageData = {
  headline: '', subtitle: '', benefits: [], faq: [],
  cta: '', urgency: '', product_name: '',
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export const useEditorStore = create<EditorStore>((set, get) => ({
  templateId: '',
  landingData: emptyLanding,
  sectionOrder: [],
  visualSettings: {},
  globalStyles: {},
  selectedSectionId: null,
  panelMode: 'sections',
  device: 'desktop',
  staticHtml: '',
  setStaticHtml: (html: string) => set({ staticHtml: html }),
  // v2 panel state
  panelOpen: false,
  subPanelEditOpen: false,
  editingSectionId: null,
  editForm: { title: '', subtitle: '' },
  // C2 — édition + auto-save
  sectionData: {},
  saveStatus: 'idle',
  lastSavedAt: null,

  hydrate: (state) => set({
    templateId: state.templateId,
    landingData: state.landingData,
    sectionOrder: state.sectionOrder,
    visualSettings: state.visualSettings,
    globalStyles: state.globalStyles,
    selectedSectionId: null,
    panelOpen: false,
    subPanelEditOpen: false,
    editingSectionId: null,
    editForm: { title: '', subtitle: '' },
    sectionData: {},
    saveStatus: 'idle',
    lastSavedAt: null,
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
    editingSectionId: state.editingSectionId === id ? null : state.editingSectionId,
    subPanelEditOpen: state.editingSectionId === id ? false : state.subPanelEditOpen,
  })),

  duplicateSection: (id) => set(state => {
    const idx = state.sectionOrder.findIndex(s => s.id === id)
    if (idx === -1) return state
    const original = state.sectionOrder[idx]
    const copy: SectionInstance = { ...original, id: uuidv4() }
    const next = [...state.sectionOrder]
    next.splice(idx + 1, 0, copy)
    return { sectionOrder: next }
  }),

  setSelectedSection: (id) => set(state => ({
    selectedSectionId: id,
    // Auto-open panel when a section is selected
    panelOpen: id !== null ? true : state.panelOpen,
  })),
  setPanelMode: (mode) => set({ panelMode: mode }),
  setDevice: (device) => set({ device }),
  setPanelOpen: (open) => set(state => ({
    panelOpen: open,
    // Close sub-panel when main panel closes
    subPanelEditOpen: open ? state.subPanelEditOpen : false,
    selectedSectionId: open ? state.selectedSectionId : null,
  })),
  setSubPanelEditOpen: (open) => set({ subPanelEditOpen: open }),
  setEditForm: (form) => set(state => ({ editForm: { ...state.editForm, ...form } })),
  openSubPanelEdit: (sectionId) => set({ subPanelEditOpen: true, editingSectionId: sectionId }),

  // ─── C2 ────────────────────────────────────────────────────────────────────
  updateSectionField: (sectionId, fieldPath, value) => set(state => ({
    sectionData: {
      ...state.sectionData,
      [sectionId]: {
        ...(state.sectionData[sectionId] ?? {}),
        [fieldPath]: value,
      },
    },
  })),

  updateVisualSetting: (sectionId, patch) => set(state => ({
    visualSettings: {
      ...state.visualSettings,
      [sectionId]: {
        ...(state.visualSettings[sectionId] ?? {}),
        ...patch,
      },
    },
  })),

  setSaveStatus: (status) => set({ saveStatus: status }),

  scheduleAutoSave: (_pageId, onSave) => {
    if (autoSaveTimerRef) clearTimeout(autoSaveTimerRef)
    autoSaveTimerRef = setTimeout(async () => {
      set({ saveStatus: 'saving' })
      const state = get()
      const jsonForDb = buildJsonForDb(state)
      try {
        await onSave(jsonForDb)
        set({ saveStatus: 'saved', lastSavedAt: new Date() })
      } catch {
        // Retry 1x après 2s (T10 affinera)
        setTimeout(async () => {
          try {
            await onSave(jsonForDb)
            set({ saveStatus: 'saved', lastSavedAt: new Date() })
          } catch {
            set({ saveStatus: 'error' })
          }
        }, 2000)
      }
    }, 3000)
  },

  getRenderOverrides: () => {
    const state = get()
    return {
      sectionOrder: state.sectionOrder,
      visualSettings: state.visualSettings,
    }
  },
}))

// ─── buildJsonForDb ─────────────────────────────────────────────────────────
// Assemble landingData + sectionData (mergé via path resolver) + _editor_state
// pour la persistance Supabase. Format rétrocompatible : ancien éditeur ignore
// `_editor_state`.
export function buildJsonForDb(state: {
  landingData: LandingPageData
  sectionData: SectionData
  sectionOrder: SectionInstance[]
  visualSettings: VisualSettings
  globalStyles: GlobalStyles
  templateId: string
}): object {
  // Merge sectionData dans landingData via nested paths (ex: "features.0.title")
  const merged: Record<string, unknown> = { ...state.landingData }
  for (const sectionId of Object.keys(state.sectionData)) {
    const fields = state.sectionData[sectionId]
    for (const path of Object.keys(fields)) {
      setNestedValue(merged, path, fields[path])
    }
  }
  return {
    ...merged,
    _template_slug: state.templateId,
    _editor_state: {
      sectionOrder: state.sectionOrder,
      visualSettings: state.visualSettings,
      globalStyles: state.globalStyles,
    },
  }
}

// setNestedValue(obj, "features.0.title", value) → mute obj.features[0].title.
// Crée les objets/tableaux intermédiaires si nécessaire. Indices numériques
// reconnus automatiquement.
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.')
  let cur: Record<string, unknown> | unknown[] = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const nextKey = parts[i + 1]
    const nextIsIndex = /^\d+$/.test(nextKey)
    const curObj = cur as Record<string, unknown>
    const idxKey = /^\d+$/.test(key) ? Number(key) : key
    const existing = Array.isArray(cur) ? cur[idxKey as number] : curObj[key]
    if (existing === undefined || existing === null) {
      const created = nextIsIndex ? [] : {}
      if (Array.isArray(cur)) (cur as unknown[])[idxKey as number] = created
      else curObj[key] = created
      cur = created as Record<string, unknown> | unknown[]
    } else {
      cur = existing as Record<string, unknown> | unknown[]
    }
  }
  const lastKey = parts[parts.length - 1]
  if (Array.isArray(cur)) {
    cur[Number(lastKey)] = value
  } else {
    (cur as Record<string, unknown>)[lastKey] = value
  }
}

// getNestedValue(obj, "features.0.title") → lit la valeur ou undefined.
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const part of parts) {
    if (cur === undefined || cur === null) return undefined
    if (Array.isArray(cur)) cur = cur[Number(part)]
    else cur = (cur as Record<string, unknown>)[part]
  }
  return cur
}

// ─── Migration helpers ──────────────────────────────────────────────────────
// hydrateFromPage convertit un pages.json_content (legacy ou recent) en EditorState.
// Gere 2 cas :
// - Legacy (sans _editor_state) : genere sectionOrder depuis DEFAULT_ORDER
//   avec visible=true pour les sections ayant de la data dans LandingPageData
// - Recent (avec _editor_state) : preserve l'etat editeur complet

interface PageJsonContent extends LandingPageData {
  _template_slug?: string
  _editor_state?: {
    sectionOrder?: SectionInstance[]
    visualSettings?: VisualSettings
    globalStyles?: GlobalStyles
  }
}

// Heuristique : la section est "remplie" si la data correspondante est presente.
// hero_badges et price ne comptent pas (ils restent dans le hero des templates).
// Exporté pour tests (C2 D4 fix trust_badges_payment).
export function hasDataForSection(data: LandingPageData, key: SectionKey): boolean {
  switch (key) {
    case 'social_proof_bar':      return !!data.social_proof
    case 'story':                 return !!data.story
    case 'target_audience':       return Array.isArray(data.target_audience) && data.target_audience.length > 0
    case 'features':              return Array.isArray(data.features) && data.features.length > 0
    case 'gallery':               return Array.isArray(data.images) && data.images.length >= 8
    case 'unique_mechanism':      return !!data.unique_mechanism
    case 'how_it_works':          return Array.isArray(data.how_it_works) && data.how_it_works.length > 0
    case 'before_after':          return Array.isArray(data.before_after) && data.before_after.length > 0
    case 'comparison':            return !!data.comparison
    case 'competitor_comparison': return !!data.competitor_comparison
    case 'testimonials':          return Array.isArray(data.testimonials) && data.testimonials.length > 0
    case 'press_mentions':        return Array.isArray(data.press_mentions) && data.press_mentions.length > 0
    case 'founder_note':          return !!data.founder_note
    case 'value_stack':           return !!data.value_stack
    case 'bonuses':               return Array.isArray(data.bonuses) && data.bonuses.length > 0
    case 'guarantee':             return !!data.guarantee
    case 'trust_badges_payment':  return Array.isArray(data.payment_methods) && data.payment_methods.length > 0
    case 'risk_reversal':         return Array.isArray(data.risk_reversal) && data.risk_reversal.length > 0
    case 'objections':            return Array.isArray(data.objections) && data.objections.length > 0
    case 'community_callout':     return !!data.community_callout
    case 'final_pitch':           return !!data.final_pitch
    default:                      return false
  }
}

export function hydrateFromPage(jsonContent: PageJsonContent): EditorState {
  const templateId = jsonContent._template_slug || 'etec-blue'
  const editorState = jsonContent._editor_state

  // Page recente : preserve l'etat complet
  if (editorState?.sectionOrder) {
    return {
      templateId,
      landingData: jsonContent,
      sectionOrder: editorState.sectionOrder,
      visualSettings: editorState.visualSettings ?? {},
      globalStyles: editorState.globalStyles ?? {},
    }
  }

  // Legacy : genere sectionOrder depuis DEFAULT_ORDER, visible si data presente
  return {
    templateId,
    landingData: jsonContent,
    sectionOrder: DEFAULT_ORDER.map(key => ({
      id: uuidv4(),
      key,
      visible: hasDataForSection(jsonContent, key),
    })),
    visualSettings: {},
    globalStyles: {},
  }
}
