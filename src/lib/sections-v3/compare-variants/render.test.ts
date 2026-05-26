import { describe, it, expect } from 'vitest'
import { renderCompareVariants } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderCompareVariants', () => {
  it('renders all variants with images', () => {
    const variants = [
      { name: 'Noir', image: 'black.jpg' },
      { name: 'Cognac', image: 'cognac.jpg' },
    ]
    const html = renderCompareVariants({
      ...base, product: { ...base.product, variants }
    }, softTokens)
    expect(html).toContain('Noir')
    expect(html).toContain('Cognac')
    expect(html).toContain('black.jpg')
    expect(html).toContain('cognac.jpg')
  })
  it('renders variants without images (text only)', () => {
    const html = renderCompareVariants({
      ...base, product: { ...base.product, variants: [{ name: 'Small' }, { name: 'Large' }] }
    }, softTokens)
    expect(html).toContain('Small')
    expect(html).toContain('Large')
  })
  it('handles empty variants gracefully', () => {
    const html = renderCompareVariants(base, softTokens)
    expect(html).toBeDefined()
  })
})
