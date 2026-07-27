// Tests Vitest — injection de la section-policy dans le prompt legacy (Task 4).
// buildUserPrompt reste la source de vérité du contenu prompt ; on vérifie ici
// que la consigne "CIBLAGE PRODUIT" est bien injectée quand une policy est fournie,
// et absente sinon (non-régression sur l'appel sans policy).

import { describe, it, expect } from 'vitest'
import { buildUserPrompt } from './generate'
import { policyToLegacyKeys } from './section-policy'
import type { ScrapedProduct } from '@/types'

const mockProduct: ScrapedProduct = {
  title: 'Écouteurs sans fil Pro',
  description: 'Écouteurs bluetooth avec réduction de bruit active',
  images: ['https://example.com/1.jpg'],
  price: '29.99',
  original_price: null,
  variants: [],
  rating: 4.5,
  reviews_count: 120,
  source_url: 'https://example.com/product',
}

const policy = {
  productType: 'tech' as const,
  recommended: ['hero', 'features'] as const,
  discouraged: ['before_after', 'story'] as const,
  min: 6,
  max: 8,
}

describe('buildUserPrompt — injection section-policy', () => {
  it('injecte le bloc CIBLAGE PRODUIT avec les sections à ne pas générer quand policy est fournie', () => {
    const prompt = buildUserPrompt(mockProduct, 'persuasif', '', 'fr', {
      productType: policy.productType,
      recommended: [...policy.recommended],
      discouraged: [...policy.discouraged],
      min: policy.min,
      max: policy.max,
    })

    expect(prompt).toContain('NE PAS générer')
    const discouragedLegacyKeys = policyToLegacyKeys([...policy.discouraged])
    expect(discouragedLegacyKeys.length).toBeGreaterThan(0)
    expect(discouragedLegacyKeys.some(key => prompt.includes(key))).toBe(true)
  })

  it('ne modifie pas le prompt existant quand policy est absente (non-régression)', () => {
    const prompt = buildUserPrompt(mockProduct, 'persuasif', '', 'fr')
    expect(prompt).not.toContain('CIBLAGE PRODUIT')
    expect(prompt).not.toContain('NE PAS générer')
  })
})
