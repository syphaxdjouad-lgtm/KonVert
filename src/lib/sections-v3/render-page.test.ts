import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

const data: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'Sac vintage', description: '' },
  images: ['a.jpg'],
  copy: {},
}

describe('renderPageV3', () => {
  it('always renders hero', () => {
    const html = renderPageV3('soft', data)
    expect(html).toContain('Sac vintage')
    expect(html).toContain('v3-hero')
  })
  // P0-3 : threshold gallery abaissé de 3 à 1 — la gallery s'affiche dès 1 image.
  // L'ancien test assertait que gallery était skippée avec 1 image, c'est maintenant le bon comportement.
  it('P0-3 : gallery présente dès 1 image (threshold abaissé de 3 à 1)', () => {
    const html = renderPageV3('soft', data)
    expect(html).toContain('v3-gallery')
  })
  it('P0-3 : gallery absente quand aucune image', () => {
    const noImages = { ...data, images: [] }
    const html = renderPageV3('soft', noImages)
    // renderGallery retourne une section vide (<section> sans contenu) pour images=[]
    // shouldRenderSection retourne false si images.length === 0
    expect(html).not.toContain('v3-gallery')
  })
  it('P0-3 : html généré contient le script kvt-height (hauteur dynamique iframe)', () => {
    const html = renderPageV3('soft', data)
    expect(html).toContain('kvt-height')
    expect(html).toContain('postMessage')
  })
  it('respects custom sectionOrder', () => {
    const html = renderPageV3('soft', data, ['hero'])
    expect(html).toContain('v3-hero')
  })
  it('throws on unknown styleId', () => {
    // @ts-expect-error - intentional invalid value
    expect(() => renderPageV3('nonexistent', data)).toThrow()
  })
})
