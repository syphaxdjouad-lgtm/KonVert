import { describe, it, expect } from 'vitest'
import { extractAbAttribution } from '../order-attribution'

describe('extractAbAttribution', () => {
  it('extrait une attribution complète et valide', () => {
    const result = extractAbAttribution([
      { name: 'konvert_ab_test_id', value: 'test-uuid-1' },
      { name: 'konvert_ab_variant', value: 'b' },
      { name: 'konvert_ab_visitor_id', value: 'visitor-uuid-1' },
      { name: 'other_attr', value: 'ignored' },
    ])
    expect(result).toEqual({ abTestId: 'test-uuid-1', variant: 'b', visitorId: 'visitor-uuid-1' })
  })

  it('renvoie null si note_attributes est vide/absent', () => {
    expect(extractAbAttribution([])).toBeNull()
    expect(extractAbAttribution(null)).toBeNull()
    expect(extractAbAttribution(undefined)).toBeNull()
  })

  it("renvoie null si aucun attribut konvert_ab_* n'est présent (commande hors test)", () => {
    expect(extractAbAttribution([{ name: 'gift_message', value: 'Joyeux anniversaire' }])).toBeNull()
  })

  it('renvoie null si test_id manque', () => {
    expect(
      extractAbAttribution([
        { name: 'konvert_ab_variant', value: 'a' },
        { name: 'konvert_ab_visitor_id', value: 'v1' },
      ])
    ).toBeNull()
  })

  it('renvoie null si visitor_id manque', () => {
    expect(
      extractAbAttribution([
        { name: 'konvert_ab_test_id', value: 't1' },
        { name: 'konvert_ab_variant', value: 'a' },
      ])
    ).toBeNull()
  })

  it("renvoie null si variant n'est ni 'a' ni 'b' (valeur corrompue/manipulée)", () => {
    expect(
      extractAbAttribution([
        { name: 'konvert_ab_test_id', value: 't1' },
        { name: 'konvert_ab_variant', value: 'c' },
        { name: 'konvert_ab_visitor_id', value: 'v1' },
      ])
    ).toBeNull()
  })
})
