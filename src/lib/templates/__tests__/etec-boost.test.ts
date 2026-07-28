import { describe, it, expect } from 'vitest'
import { templateEtecBoost } from '../etec-boost'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import type { LandingPageData } from '@/types'

// Repro founder 2026-07-28 : page TV Xiaomi générée en arabe → méli-mélo
// FR/AR + placeholders hardcodés cosmétiques sur un produit TV.
//
// Root cause (investigation confirmée) :
// - Bug A : 3 libellés "cœur" jamais branchés sur l'i18n (trans()) —
//   "Bestseller" (eyebrow hero), "Pourquoi ils adorent" (titre 3-cartes),
//   "Avant / Après" (titre section) — + un bloc de 3 faux avis 100%
//   hardcodés (Julie M./Karim A./Chloé D.) qui fait doublon avec les vrais
//   témoignages déjà rendus par renderRichSections (data.testimonials).
// - Bug B : `data.benefits` est un champ mort — absent du schema JSON envoyé
//   à DeepSeek depuis le prompt v2.2, donc toujours `[]` en prod. Les 3
//   cartes "Pourquoi ils adorent" tombaient donc systématiquement sur un
//   fallback FR cosmétique ("Formule naturelle"...) même sur une TV.
//
// Fixture réaliste : produit TV (pas cosmétique), benefits: [] (comme en
// vrai prod — DeepSeek ne renvoie jamais ce champ), features rempli (existe
// et est correctement dans la langue cible).
const TV_PRODUCT_AR: LandingPageData = {
  ...mockLandingDataFull,
  language: 'ar',
  product_name: 'تلفزيون شاومي الذكي 55 بوصة',
  headline: 'صورة تنبض بالحياة في كل غرفة',
  subtitle: 'شاشة 4K ذكية بصوت Dolby Audio غامر',
  benefits: [], // ← jamais rempli par DeepSeek en vrai (champ retiré du schema v2.2)
  features: [
    { icon: '📺', title: 'ألوان زاهية', description: 'تقنية HDR10+ لصور واقعية بدقة 4K' },
    { icon: '🔊', title: 'صوت Dolby Audio', description: 'تجربة صوتية غامرة بدون مكبرات خارجية' },
    { icon: '🧠', title: 'محرك الصورة الذكي', description: 'معالجة صور فورية لكل نوع محتوى' },
  ],
  testimonials: [
    { name: 'سارة م.', rating: 5, text: 'جودة الصورة مذهلة والصوت رائع بدون أي إضافات.' },
    { name: 'أحمد ل.', rating: 5, text: 'التلفزيون سهل الإعداد والواجهة سريعة جدا.' },
  ],
  social_proof: { customers: '18 200 +', rating: '4.7/5 على أساس 3 100 تقييم', sold: '620 هذا الأسبوع' },
}

const TV_PRODUCT_FR: LandingPageData = {
  ...mockLandingDataFull,
  language: 'fr',
  product_name: 'TV Xiaomi Smart 55 pouces',
  headline: 'Une image qui prend vie dans chaque pièce',
  subtitle: 'Écran 4K intelligent avec son Dolby Audio immersif',
  benefits: [], // idem — jamais rempli en vrai prod
  features: [
    { icon: '📺', title: 'Couleurs vibrantes', description: 'Technologie HDR10+ pour des images 4K réalistes' },
    { icon: '🔊', title: 'Dolby Audio', description: 'Expérience sonore immersive sans enceintes externes' },
    { icon: '🧠', title: "Moteur d'image intelligent", description: 'Traitement en temps réel pour tout type de contenu' },
  ],
}

// Textes fautifs identifiés dans l'audit — ne doivent JAMAIS apparaître,
// quel que soit le produit ou la langue.
const FORBIDDEN_STRINGS = [
  'Formule naturelle',
  'Ingrédients purs',
  'Résultats visibles', // fallback carte 2 (distinct du vrai contenu testimonials)
  'Certifié qualité',
  'Julie M.',
  'Karim A.',
  'Chloé D.',
  '2 847',
  '2 800',
  '+2 800 avis',
]

describe('templateEtecBoost — fix i18n + benefits mort (repro TV/arabe 2026-07-28)', () => {
  it('langue ar : aucun résidu FR fautif (placeholders cosmétiques + faux avis + chiffres inventés)', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    for (const bad of FORBIDDEN_STRINGS) {
      expect(html, `résidu fautif trouvé : "${bad}"`).not.toContain(bad)
    }
  })

  it('langue ar : eyebrow "Bestseller" et titre "Pourquoi ils adorent" passent par trans()', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    expect(html).not.toContain('>Bestseller<')
    expect(html).not.toContain('>Pourquoi ils adorent<')
  })

  it('langue ar : titre "Avant / Après" traduit (réutilise legacy.beforeAfter.title)', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    expect(html).not.toContain('>Avant / Après<')
    // legacy.beforeAfter.title.ar = 'قبل. بعد.'
    expect(html).toContain('قبل. بعد.')
  })

  it('langue ar : cartes "Pourquoi ils adorent" peuplées depuis data.features (pas de fallback)', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    expect(html).toContain('ألوان زاهية')
    expect(html).toContain('تقنية HDR10+ لصور واقعية بدقة 4K')
    expect(html).toContain('صوت Dolby Audio')
  })

  it('langue ar : plus de bloc "faux avis" hardcodé (doublon avec renderRichSections)', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    expect(html).not.toContain('Julie M.')
    expect(html).not.toContain('Karim A.')
    expect(html).not.toContain('Chloé D.')
  })

  it('langue ar : note/avis réelle affichée depuis data.social_proof si dispo (pas de "2 847" inventé)', () => {
    const html = templateEtecBoost(TV_PRODUCT_AR)
    expect(html).toContain('4.7/5 على أساس 3 100 تقييم')
  })

  it('features absent/vide → section "Pourquoi ils adorent" masquée proprement (pas de fallback FR)', () => {
    const html = templateEtecBoost({ ...TV_PRODUCT_AR, features: [] })
    expect(html).not.toContain('Pourquoi ils adorent')
    expect(html).not.toContain('Formule naturelle')
    for (const bad of FORBIDDEN_STRINGS) {
      expect(html).not.toContain(bad)
    }
  })

  it('social_proof absent → aucun chiffre de note inventé (bloc note/avis omis)', () => {
    const html = templateEtecBoost({ ...TV_PRODUCT_AR, social_proof: undefined })
    expect(html).not.toContain('2 847')
    expect(html).not.toContain('4.9/5')
  })

  it('regression FR : rendu cohérent, cartes peuplées depuis features réels, pas de faux avis', () => {
    const html = templateEtecBoost(TV_PRODUCT_FR)
    expect(html).toContain('<html lang="fr"')
    expect(html).toContain('Couleurs vibrantes')
    expect(html).toContain('Dolby Audio')
    expect(html).not.toContain('Formule naturelle')
    expect(html).not.toContain('Julie M.')
    expect(html).toContain('Pourquoi ils adorent') // valeur FR de la clé trans() — attendue en FR
  })

  it('ne throw jamais et produit un doctype valide', () => {
    expect(() => templateEtecBoost(TV_PRODUCT_AR)).not.toThrow()
    expect(templateEtecBoost(TV_PRODUCT_AR)).toContain('<!DOCTYPE html>')
  })
})
