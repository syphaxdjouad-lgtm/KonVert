import { describe, it, expect } from 'vitest'
import { renderRichSections } from '../sections'
import { renderTemplate } from '../index'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import type { LandingPageData } from '@/types'

// Vérifie que renderRichSections (partagé par les 43 templates etec-*) respecte
// la langue de data.language pour les libellés de coque (eyebrows, titres,
// CTA par défaut) — cf ui-labels.ts. Le contenu produit (story, testimonials...)
// reste tel que fourni par le fixture (généré par DeepSeek, hors scope ici).
describe('renderRichSections — i18n de la coque legacy', () => {
  it('language="fr" (fixture par défaut) : libellés inchangés (non-régression)', () => {
    const html = renderRichSections(mockLandingDataFull)
    expect(html).toContain('Avis clients')
    expect(html).toContain('Paiement sécurisé')
  })

  it('language="en" : eyebrows/titres de coque traduits, pas de résidu FR', () => {
    const data: LandingPageData = { ...mockLandingDataFull, language: 'en' }
    const html = renderRichSections(data)
    expect(html).toContain('Customer reviews')
    expect(html).toContain('Secure payment')
    expect(html).not.toContain('Avis clients')
    expect(html).not.toContain('Paiement sécurisé')
  })

  it('language="ar" : libellés arabes injectés', () => {
    const data: LandingPageData = { ...mockLandingDataFull, language: 'ar' }
    const html = renderRichSections(data)
    expect(html).toContain('تقييمات العملاء') // Avis clients
  })

  it('renderTemplate (etec-blue) — smoke test 1-2 templates, aucune régression FR', () => {
    const dataFr: LandingPageData = { ...mockLandingDataFull, language: 'fr' }
    const htmlFr = renderTemplate('etec-blue', dataFr)
    expect(htmlFr).toContain('<html lang="fr"')

    const dataEn: LandingPageData = { ...mockLandingDataFull, language: 'en' }
    const htmlEn = renderTemplate('etec-blue', dataEn)
    expect(htmlEn).toContain('<html lang="en"')
  })

  it('renderTemplate (etec-noir) — smoke test langue arabe : dir="rtl"', () => {
    const data: LandingPageData = { ...mockLandingDataFull, language: 'ar' }
    const html = renderTemplate('etec-noir', data)
    expect(html).toContain('<html lang="ar" dir="rtl"')
  })
})
