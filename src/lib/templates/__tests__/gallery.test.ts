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

describe('renderGallery', () => {
  it('retourne "" si <8 images (seuil grid 2x2)', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'],
    }
    expect(renderGallery(data, DEFAULT_THEME)).toBe('')
  })

  it('retourne "" si images undefined', () => {
    const { images: _, ...dataNoImages } = mockLandingDataFull
    expect(renderGallery(dataNoImages as typeof mockLandingDataFull, DEFAULT_THEME)).toBe('')
  })

  it('rend grid 2x2 si 8 images', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).toContain('class="kvt-gallery')
    expect(html).toContain(mockLandingDataFull.images![4])
    expect(html).toContain(mockLandingDataFull.images![5])
    expect(html).toContain(mockLandingDataFull.images![6])
    expect(html).toContain(mockLandingDataFull.images![7])
  })

  it('ne rend pas les 4 premieres images (deja dans hero galerie)', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).not.toContain(mockLandingDataFull.images![0])
    expect(html).not.toContain(mockLandingDataFull.images![1])
    expect(html).not.toContain(mockLandingDataFull.images![2])
    expect(html).not.toContain(mockLandingDataFull.images![3])
  })

  it('inclut loading="lazy" sur les images', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('loading="lazy"')
  })

  it('inclut le product_name dans les alt text', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain(`alt="${mockLandingDataFull.product_name}`)
  })

  it('utilise theme.bg et theme.radius', () => {
    const customTheme = { ...DEFAULT_THEME, bg: '#abcdef', radius: '20px' }
    const html = renderGallery(mockLandingDataFull, customTheme)
    expect(html).toContain('#abcdef')
    expect(html).toContain('20px')
  })

  it('label "Voir le produit en detail" en francais par defaut', () => {
    const data = { ...mockLandingDataFull, language: 'fr' }
    const html = renderGallery(data, DEFAULT_THEME)
    expect(html).toContain('Voir le produit en détail')
  })

  it('label en anglais si language=en', () => {
    const data = { ...mockLandingDataFull, language: 'en' }
    const html = renderGallery(data, DEFAULT_THEME)
    expect(html).toContain('See it in detail')
  })
})
