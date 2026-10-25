import { describe, it, expect } from 'vitest'
import { deriveVertical } from '../vertical'

describe('deriveVertical', () => {
  it('mappe product_type "skincare" → beaute', () => {
    expect(deriveVertical('Soin visage', 'skincare')).toBe('beaute')
  })

  it('mappe product_type "beauty" → beaute', () => {
    expect(deriveVertical('Maquillage', 'beauty')).toBe('beaute')
  })

  it('mappe product_type "tech" → tech', () => {
    expect(deriveVertical('Électronique', 'tech')).toBe('tech')
  })

  it('retombe sur dropshipping pour un product_type non mappé (wellness, jewelry...)', () => {
    expect(deriveVertical('Compléments alimentaires', 'wellness')).toBe('dropshipping')
    expect(deriveVertical('Bijoux', 'jewelry')).toBe('dropshipping')
  })

  it('dérive depuis category si product_type absent — mots-clés beauté', () => {
    expect(deriveVertical('Soin de la peau', null)).toBe('beaute')
    expect(deriveVertical('Produits de beauté', null)).toBe('beaute')
    expect(deriveVertical('Cosmétique bio', null)).toBe('beaute')
  })

  it('dérive depuis category si product_type absent — mots-clés tech', () => {
    expect(deriveVertical('Audio sans fil', null)).toBe('tech')
    expect(deriveVertical('Appareil connecté', null)).toBe('tech')
    expect(deriveVertical('Électronique grand public', null)).toBe('tech')
  })

  it('retombe sur dropshipping par défaut si aucun signal', () => {
    expect(deriveVertical('Cuisine', null)).toBe('dropshipping')
    expect(deriveVertical(null, null)).toBe('dropshipping')
    expect(deriveVertical(undefined, undefined)).toBe('dropshipping')
  })

  it('product_type prime sur category en cas de désaccord', () => {
    // category vague ("Accessoires") mais product_type précis → on fait confiance au product_type
    expect(deriveVertical('Accessoires', 'tech')).toBe('tech')
  })
})
