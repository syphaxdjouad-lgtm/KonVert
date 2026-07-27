// Garde-fou de rendu (Task 6) — plafond de sections indépendant de l'IA.
// Même si DeepSeek génère plus de sections que la policy ne le recommande,
// renderRichSections doit tronquer au nombre max fourni.

import { describe, it, expect } from 'vitest'
import { renderRichSections, DEFAULT_THEME } from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'

describe('renderRichSections — garde-fou maxSections', () => {
  it('sans maxSections, la fixture full rend plus de 8 sections (pré-requis du test)', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME)
    const count = (html.match(/<section[\s>]/gi) ?? []).length
    expect(count).toBeGreaterThan(8)
  })

  it('avec maxSections: 8, le HTML rendu contient au plus 8 blocs <section>', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, undefined, false, undefined, 8)
    const count = (html.match(/<section[\s>]/gi) ?? []).length
    expect(count).toBeLessThanOrEqual(8)
  })

  it('maxSections tronque aussi quand un order explicite (SectionKey[]) est fourni', () => {
    const order = [
      'social_proof_bar', 'story', 'target_audience', 'features', 'unique_mechanism',
      'how_it_works', 'before_after', 'comparison', 'testimonials', 'guarantee',
    ] as const
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, [...order], false, undefined, 5)
    const count = (html.match(/<section[\s>]/gi) ?? []).length
    expect(count).toBeLessThanOrEqual(5)
  })
})
