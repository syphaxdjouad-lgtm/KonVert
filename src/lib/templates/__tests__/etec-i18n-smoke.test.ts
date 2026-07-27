import { describe, it, expect } from 'vitest'
import { TEMPLATES, renderTemplate } from '../index'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import type { LandingPageData } from '@/types'

// Smoke test paramétré sur les 43 templates etec-* : vérifie que chaque
// template respecte data.language pour sa coque (nav/footer/CTA/badges
// bespoke) — cf consolidation dans src/lib/i18n/ui-labels.ts.
//
// Stratégie : plutôt que de lister des assertions par template (bespoke et
// hétérogène par nature), on vérifie un contrat générique valable pour les 43 :
//   - le rendu ne throw jamais, quelle que soit la langue
//   - <html lang="..."> reflète la langue demandée
//   - lang="ar" → dir="rtl" toujours présent
//   - lang="en" → aucun résidu des libellés de coque français les plus
//     fréquents (identifiés lors de l'audit : "Accueil", "Questions
//     fréquentes", "Avis clients", "Nos engagements", "En savoir plus",
//     "Retours 30 jours", "Livraison gratuite") — si un template ne les
//     utilise pas, l'assertion est un no-op (toujours vraie), donc valable
//     pour les 43 sans hardcoder une liste par template.
// Note : "Livraison gratuite" volontairement exclu — c'est un champ de contenu
// dynamique (risk_reversal.title) dans le fixture mock, pas un libellé de coque
// codé en dur (en prod ce texte est généré par DeepSeek dans la langue cible).
const RESIDUAL_FR_CHROME = [
  'Accueil',
  'Questions fréquentes',
  'Avis clients',
  'Nos engagements',
  'En savoir plus',
  'Retours 30 jours',
  'Boutique',
  'Caractéristiques',
  'Achat vérifié',
]

describe('renderTemplate — smoke i18n sur les 43 templates etec-*', () => {
  for (const tpl of TEMPLATES) {
    describe(tpl.id, () => {
      it('language="fr" (par défaut) : rendu valide, <html lang="fr">', () => {
        const data: LandingPageData = { ...mockLandingDataFull, language: 'fr' }
        const html = renderTemplate(tpl.id, data)
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('<html lang="fr"')
      })

      it('language="en" : <html lang="en"> + pas de résidu FR sur la coque commune', () => {
        const data: LandingPageData = { ...mockLandingDataFull, language: 'en' }
        const html = renderTemplate(tpl.id, data)
        expect(html).toContain('<html lang="en"')
        for (const residual of RESIDUAL_FR_CHROME) {
          expect(html, `${tpl.id}: résidu FR "${residual}" trouvé en language=en`).not.toContain(`>${residual}<`)
        }
      })

      it('language="ar" : dir="rtl" présent', () => {
        const data: LandingPageData = { ...mockLandingDataFull, language: 'ar' }
        const html = renderTemplate(tpl.id, data)
        expect(html).toContain('<html lang="ar"')
        expect(html).toContain('dir="rtl"')
      })
    })
  }
})
