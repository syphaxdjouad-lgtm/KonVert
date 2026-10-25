import { describe, it, expect } from 'vitest'
import { assertNoForbiddenKeys, ForbiddenKeyError } from '../guardrails'
import { DEFAULT_TEMPLATE_CONTENT } from '../default-content'

describe('assertNoForbiddenKeys', () => {
  it('ne lève rien sur une sortie fallback propre', () => {
    expect(() => assertNoForbiddenKeys(DEFAULT_TEMPLATE_CONTENT.dropshipping)).not.toThrow()
  })

  it('lève ForbiddenKeyError si "founder_name" apparaît n\'importe où dans l\'arbre', () => {
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      founder_story: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.founder_story, founder_name: 'Jean' },
    }
    expect(() => assertNoForbiddenKeys(polluted)).toThrow(ForbiddenKeyError)
  })

  it('lève ForbiddenKeyError si "promo_code" apparaît dans un tableau imbriqué', () => {
    const polluted = { nested: [{ deep: { promo_code: 'X20' } }] }
    expect(() => assertNoForbiddenKeys(polluted)).toThrow(ForbiddenKeyError)
  })

  it('lève ForbiddenKeyError si "reviews" apparaît à la racine', () => {
    expect(() => assertNoForbiddenKeys({ reviews: [] })).toThrow(ForbiddenKeyError)
  })

  it('n\'est pas perturbée par des valeurs primitives, null ou undefined', () => {
    expect(() => assertNoForbiddenKeys('a string')).not.toThrow()
    expect(() => assertNoForbiddenKeys(42)).not.toThrow()
    expect(() => assertNoForbiddenKeys(null)).not.toThrow()
    expect(() => assertNoForbiddenKeys(undefined)).not.toThrow()
  })
})
