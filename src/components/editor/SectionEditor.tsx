'use client'

import { useEditorStore } from './store'
import { getSectionSchema } from './editors/registry'
import type { FieldDef, FieldType } from './editors/schemas'
import {
  TextField,
  TextAreaField,
  ImageField,
  ColorField,
  ToggleField,
  SelectField,
  DensityField,
} from './fields'
import type { SectionKey } from '@/lib/templates/sections'
import { getNestedValue } from './store'

interface SectionEditorProps {
  sectionId: string
  sectionKey: SectionKey
}

function resolveValue(
  landingData: Record<string, unknown>,
  sectionData: Record<string, unknown> | undefined,
  visualSettings: Record<string, unknown> | undefined,
  field: FieldDef,
): unknown {
  if (field.target === 'visualSettings') {
    return visualSettings?.[field.key]
  }
  // sectionData prend priorité sur landingData
  if (sectionData && field.key in sectionData) return sectionData[field.key]
  return getNestedValue(landingData, field.key)
}

function renderFieldByType(
  field: FieldDef,
  value: unknown,
  onChange: (v: unknown) => void,
) {
  const labelText = field.label
  const helpText = field.helpText
  switch (field.type as FieldType) {
    case 'text':
      return <TextField value={String(value ?? '')} onChange={onChange} label={labelText} helpText={helpText} />
    case 'textarea':
      return <TextAreaField value={String(value ?? '')} onChange={onChange} label={labelText} helpText={helpText} rows={field.rows} />
    case 'image':
      return <ImageField value={String(value ?? '')} onChange={onChange} label={labelText} helpText={helpText} />
    case 'color':
      return <ColorField value={String(value ?? '')} onChange={onChange} label={labelText} helpText={helpText} />
    case 'toggle':
      return <ToggleField value={Boolean(value)} onChange={onChange} label={labelText} helpText={helpText} />
    case 'select':
      return <SelectField value={String(value ?? '')} onChange={onChange} label={labelText} options={field.options ?? []} helpText={helpText} />
    case 'density':
      return <DensityField value={String(value ?? 'md')} onChange={onChange} label={labelText} helpText={helpText} />
    default:
      return null
  }
}

export function SectionEditor({ sectionId, sectionKey }: SectionEditorProps) {
  const landingData = useEditorStore(s => s.landingData) as unknown as Record<string, unknown>
  const sectionData = useEditorStore(s => s.sectionData[sectionId])
  const visualSettings = useEditorStore(s => s.visualSettings[sectionId])
  const updateSectionField = useEditorStore(s => s.updateSectionField)
  const updateVisualSetting = useEditorStore(s => s.updateVisualSetting)

  const schema = getSectionSchema(sectionKey)
  if (!schema) {
    return <div style={{ padding: '16px', fontSize: '13px', color: '#666' }}>Editor non disponible pour {sectionKey}</div>
  }

  return (
    <div style={{ padding: '16px' }}>
      {schema.groups.map((group, gIdx) => (
        <div key={gIdx} style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#888',
            marginBottom: '12px',
            paddingBottom: '6px',
            borderBottom: '1px solid #EEE',
          }}>
            {group.title}
          </h3>
          {group.fields.map((field) => {
            const value = resolveValue(
              landingData,
              sectionData as Record<string, unknown> | undefined,
              visualSettings as Record<string, unknown> | undefined,
              field,
            )
            const onChange = (v: unknown) => {
              if (field.target === 'visualSettings') {
                updateVisualSetting(sectionId, { [field.key]: v } as Parameters<typeof updateVisualSetting>[1])
              } else {
                updateSectionField(sectionId, field.key, v)
              }
            }
            return <div key={field.key}>{renderFieldByType(field, value, onChange)}</div>
          })}
        </div>
      ))}
    </div>
  )
}
