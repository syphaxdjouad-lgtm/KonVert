// Types pour le registry des section editors (chantier C2).
// Chaque section a un SectionSchema qui décrit les groupes + fields
// éditables dans le PanelRight.
//
// Conventions :
// - field.key supporte les nested paths : "story.hero_title", "features.0.title"
// - field.target='data' → mute landingData via updateSectionField
// - field.target='visualSettings' → mute visualSettings via updateVisualSetting

import type { SectionKey } from '@/lib/templates/sections'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'image'
  | 'color'
  | 'toggle'
  | 'select'
  | 'density'

export type FieldTarget = 'data' | 'visualSettings'

export interface SelectOption {
  value: string
  label: string
}

export interface FieldDef {
  key: string
  type: FieldType
  label: string
  helpText?: string
  target?: FieldTarget
  options?: SelectOption[]
  defaultValue?: unknown
  rows?: number
}

export interface GroupDef {
  title: string
  fields: FieldDef[]
}

export interface SectionSchema {
  sectionKey: SectionKey
  groups: GroupDef[]
}
