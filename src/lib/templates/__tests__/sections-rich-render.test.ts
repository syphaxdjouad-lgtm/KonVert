/**
 * Test de rendu HTML — sections riches sur 5 templates × 2 fixtures.
 *
 * Remplace l'ancien e2e Playwright (qui saturait la RAM en lançant Next.js dev
 * + N Chromium en parallèle). Ici, on appelle directement `renderTemplate` côté
 * Node : ~1s d'exécution, 0 dev server, 0 browser.
 *
 * Pour la review visuelle (screenshots), utiliser la route dev
 * `/api/__test/render-template` manuellement, jamais en suite automatique.
 */

import { describe, it, expect } from 'vitest'
import { renderTemplate } from '../index'
import { mockLandingDataFull }    from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'
import type { LandingPageData } from '@/types'

const TEMPLATES = ['etec-blue', 'etec-noir', 'etec-rose', 'etec-luxe', 'etec-energy'] as const

const FIXTURES: ReadonlyArray<{ name: 'full' | 'partial'; data: LandingPageData }> = [
  { name: 'full',    data: mockLandingDataFull    },
  { name: 'partial', data: mockLandingDataPartial },
]

describe('sections riches — rendu HTML sur 5 templates × 2 fixtures', () => {
  for (const template of TEMPLATES) {
    for (const fixture of FIXTURES) {
      it(`${template} × ${fixture.name} — HTML propre et riche`, () => {
        const html = renderTemplate(template, fixture.data)

        // 1. Le HTML doit exister et avoir une taille raisonnable
        expect(html.length, `[${template}/${fixture.name}] HTML vide`).toBeGreaterThan(1000)
        expect(html.length, `[${template}/${fixture.name}] HTML > 500ko`).toBeLessThan(500_000)

        // 2. Pas de fuite de valeur JS dans le texte visible
        expect(
          html,
          `[${template}/${fixture.name}] ne doit pas contenir ">undefined<"`,
        ).not.toContain('>undefined<')

        expect(
          html,
          `[${template}/${fixture.name}] ne doit pas contenir "[object Object]"`,
        ).not.toContain('[object Object]')

        // NaN dans le texte visible (pas dans calc/style attributes)
        const nanVisible = />[^<]*\bNaN\b[^<]*</.test(html)
        expect(
          nanVisible,
          `[${template}/${fixture.name}] NaN visible dans le texte`,
        ).toBe(false)

        // 3. Le nom produit doit être présent (case-insensitive)
        const productName = fixture.data.product_name ?? ''
        if (productName) {
          expect(
            html.toLowerCase().includes(productName.toLowerCase()),
            `[${template}/${fixture.name}] nom produit "${productName}" absent`,
          ).toBe(true)
        }
      })
    }
  }

  describe('richesse des sections (fixture full uniquement)', () => {
    for (const template of TEMPLATES) {
      it(`${template} × full — au moins 10 balises <section>`, () => {
        const html = renderTemplate(template, mockLandingDataFull)
        const sectionCount = (html.match(/<section[\s>]/gi) ?? []).length

        expect(
          sectionCount,
          `[${template}] attendu ≥ 10 <section> avec fixture full, obtenu ${sectionCount}`,
        ).toBeGreaterThanOrEqual(10)
      })
    }
  })

  describe('feature flag KONVERT_RICH_SECTIONS=false (rollback)', () => {
    it('flag OFF retire bien les sections riches (comparatif ON vs OFF sur etec-blue)', () => {
      const previous = process.env.KONVERT_RICH_SECTIONS
      try {
        process.env.KONVERT_RICH_SECTIONS = 'true'
        const htmlOn = renderTemplate('etec-blue', mockLandingDataFull)
        const countOn = (htmlOn.match(/<section[\s>]/gi) ?? []).length

        process.env.KONVERT_RICH_SECTIONS = 'false'
        const htmlOff = renderTemplate('etec-blue', mockLandingDataFull)
        const countOff = (htmlOff.match(/<section[\s>]/gi) ?? []).length

        // ON doit produire significativement plus de sections que OFF
        expect(
          countOn - countOff,
          `flag ON devrait ajouter ≥ 10 sections (ON=${countOn}, OFF=${countOff})`,
        ).toBeGreaterThanOrEqual(10)
      } finally {
        if (previous === undefined) {
          delete process.env.KONVERT_RICH_SECTIONS
        } else {
          process.env.KONVERT_RICH_SECTIONS = previous
        }
      }
    })
  })
})
