import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

describe('renderPageV3 smoke', () => {
  it('produces valid HTML doc for soft style with rich data', () => {
    const data: V3PageData = {
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
      },
    }
    const html = renderPageV3('soft', data)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<title>Sac à bandoulière en cuir vintage</title>')
    expect(html).toContain('Sac à bandoulière en cuir vintage')
    expect(html).toContain('79€')
    expect(html).toContain('a.jpg')  // hero image
  })
})
