import { describe, it, expect } from 'vitest'
import { renderCareInstructions } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderCareInstructions', () => {
  it('renders default care copy', () => {
    const html = renderCareInstructions(base, softTokens)
    expect(html.length).toBeGreaterThan(100)
    expect(html).toContain('Entretien')
    expect(html).toContain('Livraison')
    expect(html).toContain('Retours')
  })
  it('renders custom care copy when provided', () => {
    const html = renderCareInstructions({ ...base, copy: { care: 'Lavable en machine 30°' } }, softTokens)
    expect(html).toContain('Lavable en machine 30°')
  })
})
