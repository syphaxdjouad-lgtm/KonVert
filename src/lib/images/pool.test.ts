import { describe, it, expect } from 'vitest'
import { buildImagePool, getImage } from './pool'

describe('buildImagePool', () => {
  it('builds from empty array', () => {
    const pool = buildImagePool([])
    expect(pool.primary).toBe('')
    expect(pool.all).toEqual([])
    expect(pool.byAngle).toEqual({})
  })
  it('builds with primary = first image', () => {
    const pool = buildImagePool(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(pool.primary).toBe('a.jpg')
    expect(pool.all).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
  })
  it('detects angles from filenames', () => {
    const pool = buildImagePool([
      'product_LEFT.jpg',
      'product_BACK.jpg',
      'product_DETAIL.jpg',
      'product_LIFESTYLE.jpg',
    ])
    expect(pool.byAngle?.front).toBe('product_LEFT.jpg')
    expect(pool.byAngle?.back).toBe('product_BACK.jpg')
    expect(pool.byAngle?.detail).toBe('product_DETAIL.jpg')
    expect(pool.byAngle?.lifestyle).toBe('product_LIFESTYLE.jpg')
  })
})

describe('getImage', () => {
  it('returns angle-specific image if available', () => {
    const pool = buildImagePool(['a_LEFT.jpg', 'b_BACK.jpg'])
    expect(getImage(pool, 'back', 0)).toBe('b_BACK.jpg')
  })
  it('falls back to rotation when angle not present', () => {
    const pool = buildImagePool(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(getImage(pool, 'any', 0)).toBe('a.jpg')
    expect(getImage(pool, 'any', 1)).toBe('b.jpg')
    expect(getImage(pool, 'any', 2)).toBe('c.jpg')
    expect(getImage(pool, 'any', 3)).toBe('a.jpg')  // boucle
    expect(getImage(pool, 'any', 5)).toBe('c.jpg')
  })
  it('returns primary when pool has 1 image and index > 0', () => {
    const pool = buildImagePool(['only.jpg'])
    expect(getImage(pool, 'any', 0)).toBe('only.jpg')
    expect(getImage(pool, 'any', 1)).toBe('only.jpg')
    expect(getImage(pool, 'any', 99)).toBe('only.jpg')
  })
  it('returns empty string when pool is empty', () => {
    const pool = buildImagePool([])
    expect(getImage(pool, 'any', 0)).toBe('')
  })
})
