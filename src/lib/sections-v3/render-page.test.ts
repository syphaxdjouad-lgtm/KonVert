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
  it('skips gallery when images < 3', () => {
    const html = renderPageV3('soft', data)
    expect(html).not.toContain('v3-gallery')
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
