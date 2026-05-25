import { describe, it, expect, afterEach } from 'vitest'
import {
  renderHeroThumbs,
  renderGallery,
  renderUniqueMechanism,
  DEFAULT_THEME,
} from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'

describe('renderHeroThumbs', () => {
  it('retourne "" si 0 image', () => {
    expect(renderHeroThumbs([], DEFAULT_THEME, 'kvt-hero-img-test')).toBe('')
  })

  it('retourne "" si 1 image (pas de thumbs utiles)', () => {
    expect(renderHeroThumbs(['https://cdn.example.com/1.jpg'], DEFAULT_THEME, 'kvt-hero-img-test')).toBe('')
  })

  it('rend 2 thumbs si 2 images', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('class="kvt-thumb')
    expect((html.match(/class="kvt-thumb/g) ?? []).length).toBe(2)
  })

  it('rend max 4 thumbs même si 8 images (cap)', () => {
    const images = Array.from({ length: 8 }, (_, i) => `https://cdn.example.com/${i}.jpg`)
    const html = renderHeroThumbs(images, DEFAULT_THEME, 'kvt-hero-img-test')
    expect((html.match(/class="kvt-thumb/g) ?? []).length).toBe(4)
  })

  it('injecte le mainImgId dans le onclick JS', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-etec-blue',
    )
    expect(html).toContain("'kvt-hero-img-etec-blue'")
  })

  it('inclut le script kvtSwapHero', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('window.kvtSwapHero')
  })

  it('utilise les URLs reelles dans les src des thumbs', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('https://cdn.example.com/a.jpg')
    expect(html).toContain('https://cdn.example.com/b.jpg')
  })

  it('ne contient pas de couleurs danger/success hardcodees', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).not.toMatch(/#dc2626/i)
    expect(html).not.toMatch(/#059669/i)
  })
})
