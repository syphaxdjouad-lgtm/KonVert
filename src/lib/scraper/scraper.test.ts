import { describe, it, expect } from 'vitest'
import { cleanProduct, looksHallucinated, detectPlatform } from './index'
import type { ScrapedProduct } from '@/types'

const baseProduct: ScrapedProduct = {
  title: 'Test Product',
  description: 'A test description',
  images: ['https://cdn.example.com/1.jpg'],
  price: '19.99',
  original_price: '29.99',
  variants: [],
  rating: 4.5,
  reviews_count: 42,
  source_url: 'https://aliexpress.com/x',
}

describe('cleanProduct', () => {
  it('escape les balises HTML dans title et description', () => {
    const result = cleanProduct({
      ...baseProduct,
      title: '<script>alert(1)</script>Stylo Pilot',
      description: '" onerror="alert(1) Voici un super stylo',
    })
    expect(result.title).toBe('&lt;script&gt;alert(1)&lt;/script&gt;Stylo Pilot')
    expect(result.description).toBe('&quot; onerror=&quot;alert(1) Voici un super stylo')
  })

  it('drop les URLs javascript: et data: dans images', () => {
    const result = cleanProduct({
      ...baseProduct,
      images: ['javascript:alert(1)', 'https://cdn.com/img.jpg', 'data:text/html,abc'],
    })
    expect(result.images).toEqual(['https://cdn.com/img.jpg'])
  })

  it('filtre les loaders et placeholders 150x150', () => {
    const result = cleanProduct({
      ...baseProduct,
      images: [
        'https://cdn.com/loading.gif',         // matched: 'loading'
        'https://cdn.com/150x150.jpg',         // matched: '150x150'
        'https://cdn.com/placeholder.png',     // matched: 'placeholder'
        'https://cdn.com/blank.gif',           // matched: 'blank.gif'
        'https://cdn.com/spinner-icon.gif',    // matched: .gif + 'icon'
        'https://cdn.com/real-product.jpg',    // ✅ kept
      ],
    })
    expect(result.images).toEqual(['https://cdn.com/real-product.jpg'])
  })

  it('limite a 8 images max', () => {
    const result = cleanProduct({
      ...baseProduct,
      images: Array.from({ length: 12 }, (_, i) => `https://cdn.com/${i}.jpg`),
    })
    expect(result.images).toHaveLength(8)
  })

  it('tronque title a 200 chars et description a 1000 chars', () => {
    const result = cleanProduct({
      ...baseProduct,
      title: 'a'.repeat(300),
      description: 'b'.repeat(1500),
    })
    expect(result.title.length).toBeLessThanOrEqual(200)
    expect(result.description.length).toBeLessThanOrEqual(1000)
  })

  it('accepte le shape wizard manuel (product_name + subtitle)', () => {
    // Defense-in-depth : la saisie wizard envoie product_name au lieu de title
    const wizardShape = {
      product_name: 'Wizard Product',
      subtitle: 'A wizard description',
      images: ['https://cdn.com/img.jpg'],
      price: '15',
      variants: [],
      rating: null,
      reviews_count: null,
      source_url: 'https://example.com',
    } as unknown as ScrapedProduct

    const result = cleanProduct(wizardShape)
    expect(result.title).toBe('Wizard Product')
    expect(result.description).toBe('A wizard description')
  })

  it('gere title/description undefined sans crash', () => {
    const result = cleanProduct({ ...baseProduct, title: undefined as unknown as string, description: undefined as unknown as string })
    expect(result.title).toBe('')
    expect(result.description).toBe('')
  })
})

describe('looksHallucinated', () => {
  it('detecte titre vide', () => {
    expect(looksHallucinated({ ...baseProduct, title: '' }).fake).toBe(true)
  })

  it('detecte titre trop court', () => {
    expect(looksHallucinated({ ...baseProduct, title: 'abc' }).fake).toBe(true)
  })

  it('detecte titre generique blacklisté', () => {
    expect(looksHallucinated({ ...baseProduct, title: 'sample product' }).fake).toBe(true)
    expect(looksHallucinated({ ...baseProduct, title: 'Women Summer Dress' }).fake).toBe(true)
  })

  it('detecte titre = nom de domaine (page splash anti-bot)', () => {
    expect(looksHallucinated({ ...baseProduct, title: 'Aliexpress' }).fake).toBe(true)
    expect(looksHallucinated({ ...baseProduct, title: 'Amazon' }).fake).toBe(true)
  })

  it('detecte aucune image valide', () => {
    expect(looksHallucinated({ ...baseProduct, images: [] }).fake).toBe(true)
  })

  it('accepte un produit valide', () => {
    expect(looksHallucinated(baseProduct).fake).toBe(false)
  })
})

describe('detectPlatform', () => {
  it('detecte AliExpress', () => {
    expect(detectPlatform('https://www.aliexpress.com/item/123.html')).toBe('aliexpress')
  })

  it('detecte Amazon (multiple TLDs)', () => {
    expect(detectPlatform('https://amazon.fr/dp/B08XYZ')).toBe('amazon')
    expect(detectPlatform('https://amazon.com/dp/B08XYZ')).toBe('amazon')
    expect(detectPlatform('https://amazon.co.uk/dp/B08XYZ')).toBe('amazon')
  })

  it('detecte Alibaba', () => {
    expect(detectPlatform('https://alibaba.com/product')).toBe('alibaba')
  })

  it('renvoie unknown pour domaine inconnu', () => {
    expect(detectPlatform('https://shop.example.com/p/123')).toBe('unknown')
  })
})
