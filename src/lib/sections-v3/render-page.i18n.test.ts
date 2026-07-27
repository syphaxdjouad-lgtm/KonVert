import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

// Fixture minimale — le contenu produit (copy) est volontairement en français
// car c'est le texte généré par DeepSeek (déjà traduit ailleurs, hors scope
// de ce test). Ce test vérifie uniquement la COQUE (chrome UI) : CTA, nav,
// libellés par défaut — cf ui-labels.ts.
function buildData(overrides: Partial<V3PageData> = {}): V3PageData {
  return {
    styleId: 'soft',
    tone: 'auto',
    product: {
      title: 'Sac à bandoulière en cuir vintage',
      description: 'Cuir véritable patiné main.',
      price: '79€',
      rating: { value: 4.6, count: 1247 },
    },
    images: ['a.jpg', 'b.jpg'],
    copy: {
      hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique' },
    },
    ...overrides,
  }
}

describe('renderPageV3 — i18n de la coque (habillage)', () => {
  it('language="fr" (ou absent) : comportement inchangé (non-régression)', () => {
    const html = renderPageV3('soft', buildData())
    expect(html).toContain('<html lang="fr">')
    expect(html).not.toContain('dir="rtl"')
    expect(html).toContain('Ajouter au panier')
    expect(html).toContain('Aller au contenu')
    expect(html).toContain('Navigation principale')
  })

  it('language="en" : CTA et libellés de coque traduits, pas de résidu FR', () => {
    const html = renderPageV3('soft', buildData({ language: 'en' }))
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('Add to cart')
    expect(html).toContain('Skip to content')
    expect(html).toContain('Main navigation')
    expect(html).not.toContain('Ajouter au panier')
    expect(html).not.toContain('Aller au contenu')
  })

  it('language="ar" : dir="rtl" injecté + libellés arabes', () => {
    const html = renderPageV3('soft', buildData({ language: 'ar' }))
    expect(html).toContain('<html lang="ar" dir="rtl">')
    expect(html).toContain('أضف إلى السلة') // Ajouter au panier
    expect(html).not.toContain('Ajouter au panier')
  })

  it('language invalide/inconnu : fallback fr (resolveLanguage)', () => {
    const html = renderPageV3('soft', buildData({ language: 'xx-not-a-lang' }))
    expect(html).toContain('<html lang="fr">')
    expect(html).toContain('Ajouter au panier')
  })

  it('clé de libellé manquante ne casse jamais le rendu (fallback gracieux)', () => {
    // Sanity check : render complet sans throw, HTML bien formé, sur les 9 langues.
    const langs = ['fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'ar', 'zh']
    for (const language of langs) {
      const html = renderPageV3('soft', buildData({ language }))
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('</html>')
    }
  })

  it('language="en" : FAQ par défaut traduite quand copy.faq absent', () => {
    const data = buildData({ language: 'en' })
    const html = renderPageV3('soft', data)
    expect(html).toContain('How long does shipping take?')
    expect(html).not.toContain('Combien de temps pour la livraison')
  })
})
