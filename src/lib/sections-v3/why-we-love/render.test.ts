import { describe, it, expect } from 'vitest'
import { renderWhyWeLove } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'Sac', description: 'A breezier take on our original...' },
  images: [],
  copy: {},
}

describe('renderWhyWeLove', () => {
  it('renders copy.why_we_love text', () => {
    const html = renderWhyWeLove({ ...base, copy: { why_we_love: 'A breezier take on...' } }, softTokens)
    expect(html).toContain('A breezier take on...')
  })
  it('falls back to description when copy missing', () => {
    const html = renderWhyWeLove(base, softTokens)
    expect(html).toContain('breezier')
  })
  it('uses heading font from tokens', () => {
    const html = renderWhyWeLove({ ...base, copy: { why_we_love: 'X' } }, softTokens)
    expect(html).toContain(softTokens.fonts.heading)
  })
})
