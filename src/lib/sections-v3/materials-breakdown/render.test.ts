import { describe, it, expect } from 'vitest'
import { renderMaterialsBreakdown } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderMaterialsBreakdown', () => {
  it('renders one card per material (confidence >= 0.6)', () => {
    const materials = [
      { name: 'TENCEL™ Lyocell', benefit: 'breathable tree fiber', confidence: 0.9 },
      { name: 'Merino wool', benefit: 'soft lining', confidence: 0.85 },
    ]
    const html = renderMaterialsBreakdown(
      { ...base, copy: { materials }, images: ['a.jpg', 'b.jpg'] },
      softTokens,
    )
    expect(html).toContain('TENCEL™ Lyocell')
    expect(html).toContain('Merino wool')
    expect(html).toContain('breathable tree fiber')
  })

  it('skips materials with confidence < 0.6', () => {
    const materials = [
      { name: 'OK', benefit: 'high conf', confidence: 0.8 },
      { name: 'NOPE', benefit: 'low conf', confidence: 0.3 },
    ]
    const html = renderMaterialsBreakdown(
      { ...base, copy: { materials }, images: ['a.jpg'] },
      softTokens,
    )
    expect(html).toContain('OK')
    expect(html).not.toContain('NOPE')
  })

  it('uses image rotation when no angle match', () => {
    const html = renderMaterialsBreakdown(
      {
        ...base,
        copy: {
          materials: [
            { name: 'X', benefit: 'y', confidence: 0.8 },
            { name: 'Y', benefit: 'z', confidence: 0.8 },
            { name: 'Z', benefit: 'w', confidence: 0.8 },
          ],
        },
        images: ['a.jpg', 'b.jpg'],
      },
      softTokens,
    )
    expect(html).toContain('a.jpg')
    expect(html).toContain('b.jpg')
  })

  it('renders section title', () => {
    const html = renderMaterialsBreakdown(
      {
        ...base,
        copy: {
          materials: [
            { name: 'X', benefit: 'y', confidence: 0.8 },
            { name: 'Y', benefit: 'z', confidence: 0.8 },
          ],
        },
        images: ['a.jpg'],
      },
      softTokens,
    )
    expect(html).toContain('matériaux')
  })
})
