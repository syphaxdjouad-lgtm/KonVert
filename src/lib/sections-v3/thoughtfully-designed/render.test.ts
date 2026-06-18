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

  // Sprint 3 T2 — icônes distinctes + description en sous-titre bénéfice
  it('renders feature descriptions as benefit subtitles', () => {
    const features = [
      { name: 'Matière premium', description: 'Doux au toucher toute la journée' },
    ]
    const html = renderThoughtfullyDesigned({ ...base, copy: { features } }, softTokens)
    expect(html).toContain('Doux au toucher toute la journée')
  })

  it('renders distinct SVG icons per feature', () => {
    const features = [
      { name: 'A', description: 'desc A' },
      { name: 'B', description: 'desc B' },
      { name: 'C', description: 'desc C' },
    ]
    const html = renderThoughtfullyDesigned({ ...base, copy: { features } }, softTokens)
    // Les icônes sont des SVG inline
    expect(html.match(/<svg/g)?.length).toBeGreaterThanOrEqual(3)
  })

  it('uses accent color on icons', () => {
    const features = [{ name: 'X', description: 'Y' }]
    const html = renderThoughtfullyDesigned({ ...base, copy: { features } }, softTokens)
    expect(html).toContain(softTokens.colors.accent)
    expect(html).toContain('<svg')
  })
})
