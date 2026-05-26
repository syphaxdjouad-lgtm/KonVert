import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

/**
 * Smoke test Sprint 4 : vérifie que les 7 sections du Sprint 4 (hero +
 * 6 nouvelles) sont rendues quand les données sont riches.
 */
describe('renderPageV3 Sprint 4 smoke', () => {
  const richData: V3PageData = {
    styleId: 'soft', tone: 'auto',
    product: {
      title: 'Sac à bandoulière en cuir vintage',
      description: 'Cuir véritable patiné main, finition italienne.',
      price: '79€',
      rating: { value: 4.6, count: 1247 },
    },
    images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'],
    copy: {
      hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique' },
      why_we_love: 'Le sac qui s\'embellit avec le temps.',
      features: [
        { name: 'Cuir italien', description: 'pleine fleur certifiée' },
        { name: 'SoftFit™ bandoulière', description: 'sangle réglable' },
      ],
      best_for: ['Quotidien', 'Travail', 'Sortie'],
      care: 'Baume neutre tous les 6 mois.',
      faq: [
        { q: 'Livraison ?', a: '24-48h en France.' },
        { q: 'Retours ?', a: '30 jours, gratuit.' },
      ],
    },
  }

  it('renders hero section', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('v3-hero')
    expect(html).toContain('Un cuir qui vit avec toi')
  })

  it('renders gallery (images >= 3)', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('v3-gallery')
    expect(html).toContain('Tous les angles')
  })

  it('renders why_we_love', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('Pourquoi on aime')
    expect(html).toContain('s\'embellit avec le temps')
  })

  it('renders thoughtfully_designed with features', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('Conçu avec soin')
    expect(html).toContain('Cuir italien')
    expect(html).toContain('SoftFit™ bandoulière')
  })

  it('renders best_for pills', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('Idéal pour')
    expect(html).toContain('Quotidien')
    expect(html).toContain('Travail')
  })

  it('renders care_instructions 3 columns', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('Entretien')
    expect(html).toContain('Livraison')
    expect(html).toContain('Retours')
    expect(html).toContain('Baume neutre')
  })

  it('renders faq with all entries', () => {
    const html = renderPageV3('soft', richData)
    expect(html).toContain('Questions fréquentes')
    expect(html).toContain('Livraison ?')
    expect(html).toContain('Retours ?')
  })

  it('produces at least 7 sections', () => {
    const html = renderPageV3('soft', richData)
    const count = (html.match(/<section/g) ?? []).length
    expect(count).toBeGreaterThanOrEqual(7)
  })
})
