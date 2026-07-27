import { describe, it, expect } from 'vitest'
import {
  findSectionByType,
  findSectionIdByType,
  parseThemeTemplate,
  readStringSetting,
  sectionBlocks,
  sectionIsInOrder,
} from '../parse-template'

const FIXTURE = JSON.stringify({
  sections: {
    main: { type: 'main-product', settings: {} },
    social_proof_1: { type: 'konvert-social-proof', settings: { proof_number: '10 000+', custom_text: '' } },
    faq_1: {
      type: 'konvert-faq-rich',
      settings: { heading: 'FAQ' },
      blocks: {
        b1: { type: 'faq_item', settings: { question: 'Livraison ?', answer: '3-5 jours' } },
        b2: { type: 'faq_item', settings: { question: '', answer: '' } },
      },
      block_order: ['b1', 'b2'],
    },
    sticky_atc: { type: 'konvert-sticky-atc-mobile', settings: {} },
  },
  order: ['main', 'social_proof_1', 'faq_1'],
})

describe('parseThemeTemplate', () => {
  it('parse un JSON valide avec `sections`', () => {
    const parsed = parseThemeTemplate(FIXTURE)
    expect(parsed).not.toBeNull()
    expect(Object.keys(parsed!.sections)).toContain('social_proof_1')
  })

  it('renvoie null pour un JSON invalide', () => {
    expect(parseThemeTemplate('{not valid json')).toBeNull()
  })

  it('renvoie null si la clé `sections` est absente', () => {
    expect(parseThemeTemplate(JSON.stringify({ order: [] }))).toBeNull()
  })

  it('renvoie null pour un JSON valide mais pas un objet (ex: tableau)', () => {
    expect(parseThemeTemplate('[]')).toBeNull()
  })
})

describe('findSectionByType', () => {
  it('trouve la section par son type', () => {
    const template = parseThemeTemplate(FIXTURE)!
    const section = findSectionByType(template, 'konvert-social-proof')
    expect(section?.settings?.proof_number).toBe('10 000+')
  })

  it('renvoie undefined si aucune section ne correspond', () => {
    const template = parseThemeTemplate(FIXTURE)!
    expect(findSectionByType(template, 'konvert-testimonials-carousel')).toBeUndefined()
  })
})

describe('readStringSetting', () => {
  it('lit un setting string existant', () => {
    const template = parseThemeTemplate(FIXTURE)!
    const section = findSectionByType(template, 'konvert-social-proof')
    expect(readStringSetting(section, 'proof_number')).toBe('10 000+')
  })

  it("renvoie '' si le setting est absent ou la section undefined", () => {
    expect(readStringSetting(undefined, 'proof_number')).toBe('')
    const template = parseThemeTemplate(FIXTURE)!
    const section = findSectionByType(template, 'konvert-social-proof')
    expect(readStringSetting(section, 'inexistant')).toBe('')
  })
})

describe('sectionBlocks', () => {
  it('renvoie les blocs dans l’ordre de block_order', () => {
    const template = parseThemeTemplate(FIXTURE)!
    const section = findSectionByType(template, 'konvert-faq-rich')
    const blocks = sectionBlocks(section)
    expect(blocks).toHaveLength(2)
    expect(blocks[0].settings?.question).toBe('Livraison ?')
  })

  it('renvoie [] si la section est undefined ou sans blocks', () => {
    expect(sectionBlocks(undefined)).toEqual([])
    const template = parseThemeTemplate(FIXTURE)!
    expect(sectionBlocks(findSectionByType(template, 'konvert-social-proof'))).toEqual([])
  })
})

describe('findSectionIdByType / sectionIsInOrder', () => {
  it('trouve l’id de section et vérifie sa présence dans order', () => {
    const template = parseThemeTemplate(FIXTURE)!
    const id = findSectionIdByType(template, 'konvert-social-proof')
    expect(id).toBe('social_proof_1')
    expect(sectionIsInOrder(template, id!)).toBe(true)
  })

  it("renvoie false si la section existe mais a été retirée de `order`", () => {
    const template = parseThemeTemplate(FIXTURE)!
    const id = findSectionIdByType(template, 'konvert-sticky-atc-mobile')
    expect(id).toBe('sticky_atc')
    expect(sectionIsInOrder(template, id!)).toBe(false)
  })

  it('renvoie undefined si aucune section de ce type', () => {
    const template = parseThemeTemplate(FIXTURE)!
    expect(findSectionIdByType(template, 'konvert-guarantees')).toBeUndefined()
  })
})
