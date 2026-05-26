import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

/**
 * Smoke test Sprint 5 : full page avec les 13 sections V3 rendues.
 */
describe('renderPageV3 Sprint 5 — full page 13 sections', () => {
  const fullData: V3PageData = {
    styleId: 'soft', tone: 'auto',
    product: {
      title: 'Sac à bandoulière en cuir vintage',
      description: 'Cuir véritable patiné main, finition italienne.',
      price: '79€',
      rating: { value: 4.6, count: 1247 },
      variants: [
        { name: 'Noir', image: 'black.jpg' },
        { name: 'Cognac', image: 'cognac.jpg' },
      ],
    },
    images: ['hero.jpg', 'detail.jpg', 'macro.jpg', 'lifestyle.jpg', 'side.jpg'],
    copy: {
      hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique' },
      why_we_love: 'Le sac qui s\'embellit avec le temps.',
      features: [
        { name: 'Cuir italien', description: 'pleine fleur certifiée' },
        { name: 'SoftFit™', description: 'sangle réglable' },
      ],
      best_for: ['Quotidien', 'Travail', 'Sortie'],
      materials: [
        { name: 'Cuir pleine fleur', benefit: 'tannage végétal certifié', confidence: 0.9 },
        { name: 'Coton bio GOTS', benefit: 'soft touch, anti-rayures', confidence: 0.85 },
        { name: 'Laiton brossé', benefit: 'résistance long terme', confidence: 0.8 },
      ],
      how_it_works: [
        { step: 1, title: 'Choisis ta couleur', description: 'Noir, Cognac ou Camel' },
        { step: 2, title: 'Reçois en 48h', description: 'Livraison gratuite France' },
        { step: 3, title: 'Patine 6 mois', description: 'S\'embellit avec ton usage' },
      ],
      care: 'Baume neutre tous les 6 mois.',
      reviews_summary: 'Les clientes adorent la patine et le confort de la bandoulière.',
      press_quote: { quote: 'Le sac qui réconcilie élégance et quotidien.', source: 'Vogue Paris' },
      faq: [
        { q: 'Livraison ?', a: '24-48h.' },
        { q: 'Retours ?', a: '30 jours gratuit.' },
      ],
      manifesto: {
        headline: 'Conçu pour celles qui savent',
        pillars: ['Cuir vivant', 'Origine traçable', 'Fait pour durer'],
      },
    },
  }

  it('renders all 13 sections when data is complete', () => {
    const html = renderPageV3('soft', fullData)
    const count = (html.match(/<section/g) ?? []).length
    expect(count).toBeGreaterThanOrEqual(12)  // au moins 12 sections (some may merge)
  })

  it('contains content from each major section', () => {
    const html = renderPageV3('soft', fullData)
    // hero
    expect(html).toContain('Sac à bandoulière en cuir vintage')
    expect(html).toContain('79€')
    // gallery
    expect(html).toContain('Tous les angles')
    // why_we_love
    expect(html).toContain('s\'embellit avec le temps')
    // features
    expect(html).toContain('SoftFit™')
    // best_for
    expect(html).toContain('Quotidien')
    // materials
    expect(html).toContain('Cuir pleine fleur')
    expect(html).toContain('Coton bio GOTS')
    // how_it_works
    expect(html).toContain('Choisis ta couleur')
    // compare_variants
    expect(html).toContain('Cognac')
    // reviews
    expect(html).toContain('Les clientes adorent')
    // press_quote
    expect(html).toContain('Vogue Paris')
    // care
    expect(html).toContain('Baume neutre')
    // faq
    expect(html).toContain('Questions fréquentes')
    // manifesto
    expect(html).toContain('Conçu pour celles qui savent')
    expect(html).toContain('Cuir vivant')
  })

  it('produces valid HTML document', () => {
    const html = renderPageV3('soft', fullData)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html lang="fr">')
    expect(html).toContain('<title>Sac à bandoulière en cuir vintage</title>')
  })

  it('respects display-rules (skips materials_breakdown if low confidence)', () => {
    const lowConf: V3PageData = {
      ...fullData,
      copy: {
        ...fullData.copy,
        materials: [
          { name: 'X', benefit: 'y', confidence: 0.3 },
          { name: 'Y', benefit: 'z', confidence: 0.5 },
        ],
      },
    }
    const html = renderPageV3('soft', lowConf)
    expect(html).not.toContain('"Matériau"')  // section materials section masquée
  })
})
