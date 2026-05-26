import { describe, it, expect } from 'vitest'
import { renderBrandManifesto } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderBrandManifesto', () => {
  it('renders custom headline and pillars', () => {
    const m = { headline: 'Better things, better way', pillars: ['Renewable', 'Recycled', 'Responsible'] }
    const html = renderBrandManifesto({ ...base, copy: { manifesto: m } }, softTokens)
    expect(html).toContain('Better things, better way')
    for (const p of m.pillars) expect(html).toContain(p)
  })

  it('renders default headline when no manifesto', () => {
    const html = renderBrandManifesto(base, softTokens)
    expect(html).toContain('Conçu pour durer')
  })

  it('renders lifestyle image when available', () => {
    const html = renderBrandManifesto({ ...base, images: ['life.jpg'] }, softTokens)
    expect(html).toContain('life.jpg')
  })
})
