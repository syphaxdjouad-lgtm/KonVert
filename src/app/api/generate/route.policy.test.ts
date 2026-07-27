// Tests Vitest — injection de la section-policy dans le prompt système V3 (Task 5).
// buildV3SystemPrompt vit dans prompt-v3.ts (extrait de route.ts pour rester
// testable — un handler App Router n'accepte pas d'exports arbitraires).

import { describe, it, expect } from 'vitest'
import { buildV3SystemPrompt } from './prompt-v3'

describe('buildV3SystemPrompt — injection section-policy', () => {
  it('injecte la consigne de ciblage avec les sections V3 discouraged quand policy est fournie', () => {
    const prompt = buildV3SystemPrompt({
      tone: 'friendly',
      product: { title: 'Écouteurs sans fil Pro', description: 'Bluetooth, réduction de bruit active' },
      language: 'fr',
      policy: {
        productType: 'tech',
        recommended: ['hero', 'thoughtfully_designed'],
        discouraged: ['materials_breakdown', 'brand_manifesto'],
        min: 6,
        max: 8,
      },
    })

    expect(prompt).toContain('NE PAS générer')
    expect(prompt).toContain('materials_breakdown')
  })

  it('ne change pas le prompt existant quand policy est absente (non-régression)', () => {
    const prompt = buildV3SystemPrompt({
      tone: 'friendly',
      product: { title: 'Écouteurs sans fil Pro', description: 'Bluetooth, réduction de bruit active' },
      language: 'fr',
    })

    expect(prompt).not.toContain('CIBLAGE PRODUIT')
    expect(prompt).not.toContain('NE PAS générer')
  })
})
