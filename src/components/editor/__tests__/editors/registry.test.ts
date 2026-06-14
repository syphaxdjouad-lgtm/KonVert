import { describe, it, expect } from 'vitest'
import { SECTION_REGISTRY, getSectionSchema } from '../../editors/registry'
import type { FieldType } from '../../editors/schemas'

const VALID_FIELD_TYPES: FieldType[] = ['text', 'textarea', 'image', 'color', 'toggle', 'select', 'density']

describe('SECTION_REGISTRY — intégrité C2', () => {
  it('exporte 21 SectionSchema', () => {
    expect(SECTION_REGISTRY).toHaveLength(21)
  })

  it('chaque schema a un sectionKey unique', () => {
    const keys = SECTION_REGISTRY.map(s => s.sectionKey)
    const uniqueKeys = new Set(keys)
    expect(uniqueKeys.size).toBe(keys.length)
  })

  it('chaque schema a au moins 1 groupe avec au moins 1 field', () => {
    for (const schema of SECTION_REGISTRY) {
      expect(schema.groups.length).toBeGreaterThan(0)
      for (const group of schema.groups) {
        expect(group.fields.length).toBeGreaterThan(0)
      }
    }
  })

  it('chaque FieldDef.type est une valeur valide de FieldType', () => {
    for (const schema of SECTION_REGISTRY) {
      for (const group of schema.groups) {
        for (const field of group.fields) {
          expect(VALID_FIELD_TYPES).toContain(field.type)
        }
      }
    }
  })

  it('trust_badges_payment est présent (fix C1 D4)', () => {
    expect(getSectionSchema('trust_badges_payment')).toBeDefined()
  })

  it('social_proof_bar a un champ rating de type select', () => {
    const schema = getSectionSchema('social_proof_bar')!
    const allFields = schema.groups.flatMap(g => g.fields)
    const rating = allFields.find(f => f.key === 'social_proof.rating')
    expect(rating?.type).toBe('select')
    expect(rating?.options?.length).toBeGreaterThan(0)
  })
})

describe('getSectionSchema', () => {
  it('retourne le schema pour une SectionKey connue', () => {
    expect(getSectionSchema('story')).toBeDefined()
  })

  it('retourne undefined pour une SectionKey inconnue', () => {
    expect(getSectionSchema('inconnue' as never)).toBeUndefined()
  })
})
