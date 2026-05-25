import type { LandingPageData } from './index'
import type { SectionKey } from '@/lib/templates/sections'

// Une instance de section dans la timeline editeur. Permet d'avoir plusieurs
// instances d'une meme SectionKey (ex: 2 zones testimonials differentes).
// Chantier C1 : seules les sections du chantier A (DEFAULT_ORDER) sont supportees.
// Chantier C3 : ajoutera la possibilite de cloner.
// Chantier C4 : ajoutera de nouvelles SectionKey (countdown, video_embed, etc.).
export interface SectionInstance {
  id: string              // uuid stable (cle React + dnd)
  key: SectionKey
  visible: boolean
  data?: Record<string, unknown>  // override de landingData pour cette instance (C3+)
}

// Tweaks visuels par instance (chantier C2). C1 : type defini mais inutilise.
export interface VisualSettings {
  [sectionId: string]: {
    padding?: 'sm' | 'md' | 'lg'
    bgColor?: string
    alignment?: 'left' | 'center' | 'right'
    hiddenElements?: string[]
  }
}

// Palette globale (chantier C5). C1 : type defini mais inutilise.
export interface GlobalStyles {
  primary?: string
  accent?: string
  fontFamily?: string
  radius?: string
}

// Etat complet de l'editeur. Persiste dans pages.json_content._editor_state.
export interface EditorState {
  templateId: string
  landingData: LandingPageData
  sectionOrder: SectionInstance[]
  visualSettings: VisualSettings
  globalStyles: GlobalStyles
}

export type PanelMode = 'sections' | 'blocks' | 'styles' | 'settings'
export type Device = 'desktop' | 'tablet' | 'mobile'
