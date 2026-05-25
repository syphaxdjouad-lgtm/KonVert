import { describe, it, expect, afterEach } from 'vitest'
import {
  renderHeroThumbs,
  renderGallery,
  renderUniqueMechanism,
  DEFAULT_THEME,
} from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images: _images, ...dataNoImages } = mockLandingDataFull
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

describe('renderUniqueMechanism — enrichissement image chantier B', () => {
  it('regression : sans images, comportement chantier A (panneau preuve texte si proof)', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images: _images, ...dataNoImages } = mockLandingDataFull
    const html = renderUniqueMechanism(dataNoImages as typeof mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).not.toMatch(/<img[^>]*src=/)
  })

  it('regression : avec <5 images, pas d\'image rendue (evite duplication hero)', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    }
    const html = renderUniqueMechanism(data, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).not.toContain('src="1.jpg"')
    expect(html).not.toContain('src="4.jpg"')
  })

  it('avec >=5 images, rend l\'image[4] dans le panneau droit', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    }
    const html = renderUniqueMechanism(data, DEFAULT_THEME)
    expect(html).toContain('src="5.jpg"')
  })

  it('avec 8 images, utilise bien images[4] (pas images[0])', () => {
    const html = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain(`src="${mockLandingDataFull.images![4]}"`)
    expect(html).not.toContain(`src="${mockLandingDataFull.images![0]}"`)
  })

  it('si data.unique_mechanism absent, retourne "" meme avec images', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { unique_mechanism: _um, ...dataNoMechanism } = mockLandingDataFull
    expect(renderUniqueMechanism(dataNoMechanism as typeof mockLandingDataFull, DEFAULT_THEME)).toBe('')
  })
})

describe('Feature flag KONVERT_GALLERY', () => {
  const originalEnv = process.env.KONVERT_GALLERY

  afterEach(() => {
    process.env.KONVERT_GALLERY = originalEnv
  })

  it('KONVERT_GALLERY=false : renderHeroThumbs retourne ""', () => {
    process.env.KONVERT_GALLERY = 'false'
    expect(renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )).toBe('')
  })

  it('KONVERT_GALLERY=false : renderGallery retourne ""', () => {
    process.env.KONVERT_GALLERY = 'false'
    expect(renderGallery(mockLandingDataFull, DEFAULT_THEME)).toBe('')
  })

  it('KONVERT_GALLERY=false : renderUniqueMechanism ne contient pas l\'image', () => {
    process.env.KONVERT_GALLERY = 'false'
    const html = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).not.toContain(`src="${mockLandingDataFull.images![4]}"`)
  })

  it('KONVERT_GALLERY=true : renderHeroThumbs rend normalement', () => {
    process.env.KONVERT_GALLERY = 'true'
    const html = renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('kvt-thumb')
  })

  it('KONVERT_GALLERY undefined (defaut) : tout rend normalement', () => {
    delete process.env.KONVERT_GALLERY
    const heroHtml = renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    const galleryHtml = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    const mechanismHtml = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(heroHtml.length).toBeGreaterThan(50)
    expect(galleryHtml.length).toBeGreaterThan(50)
    expect(mechanismHtml).toContain(`src="${mockLandingDataFull.images![4]}"`)
  })
})
