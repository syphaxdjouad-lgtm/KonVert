import { describe, it, expect } from 'vitest'
import { renderHero } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const baseData: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: {
    title: 'Sac à bandoulière en cuir vintage',
    description: 'Cuir véritable...',
    price: '79€',
    rating: { value: 4.6, count: 1247 },
  },
  images: ['hero.jpg', 'detail.jpg'],
  copy: { hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique, finition main' } },
}

describe('renderHero', () => {
  it('includes product title', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Sac à bandoulière en cuir vintage')
  })
  it('includes price', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('79€')
  })
  it('includes rating value and count when present', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('4.6')
    expect(html).toContain('1247')
  })
  it('uses primary image (first in images)', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('hero.jpg')
  })
  it('uses tagline from copy.hero', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Un cuir qui vit avec toi')
  })
  it('does not render rating section when rating absent', () => {
    const data = { ...baseData, product: { ...baseData.product, rating: undefined } }
    const html = renderHero(data, softTokens)
    expect(html).not.toContain('★')
  })
  it('applies token colors via inline style', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain(softTokens.colors.bg)
    expect(html).toContain(softTokens.colors.accent)
  })
})
