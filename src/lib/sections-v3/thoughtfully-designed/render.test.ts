import { describe, it, expect } from 'vitest'
import { renderThoughtfullyDesigned } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderThoughtfullyDesigned', () => {
  it('renders all features', () => {
    const features = [
      { name: 'TENCEL™ Lyocell', description: 'breathable tree fiber', isPropriety: true },
      { name: 'Soft lining', description: 'Merino wool' },
    ]
    const html = renderThoughtfullyDesigned({ ...base, copy: { features } }, softTokens)
    expect(html).toContain('TENCEL™ Lyocell')
    expect(html).toContain('Soft lining')
  })

  it('renders title when no features', () => {
    const html = renderThoughtfullyDesigned({ ...base, copy: { features: [] } }, softTokens)
    expect(html).toContain('Conçu avec soin')
  })
})
