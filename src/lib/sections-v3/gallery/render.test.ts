import { describe, it, expect } from 'vitest'
import { renderGallery } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const data: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'],
  copy: {},
}

describe('renderGallery', () => {
  it('renders all images from pool', () => {
    const html = renderGallery(data, softTokens)
    for (const img of data.images) expect(html).toContain(img)
  })
  it('uses horizontal scroll markup', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('overflow-x:auto')
  })
  it('renders nothing useful when no images', () => {
    const empty = renderGallery({ ...data, images: [] }, softTokens)
    expect(empty).toBeDefined()
    // ne crash pas même sans image
  })
  it('applies token colors via inline style', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.colors.bg)
  })
  it('applies token radius on slides', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.radius.image)
  })
  it('applies token gap on track', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.spacing.gap)
  })
  it('contains section heading', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('Tous les angles')
  })
  it('escapes product title in alt attribute', () => {
    const dangerous = renderGallery(
      { ...data, product: { title: '<script>', description: '' } },
      softTokens,
    )
    expect(dangerous).not.toContain('<script>')
    expect(dangerous).toContain('&lt;script&gt;')
  })
})
