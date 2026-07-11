import { describe, it, expect } from 'vitest'
import { renderPressQuote } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderPressQuote', () => {
  it('renders quote and source when data is provided', () => {
    const html = renderPressQuote({
      ...base, copy: { press_quote: { quote: 'Game changer.', source: 'Vogue' }}
    }, softTokens)
    expect(html).toContain('Game changer.')
    expect(html).toContain('Vogue')
  })

  // Sprint 3 T3 — fallback trust stats bar (plus '' vide qui laissait un gap 80px)
  it('renders trust stats bar when no press_quote', () => {
    const html = renderPressQuote(base, softTokens)
    expect(html).not.toBe('')
    expect(html).toContain('clients satisfaits')
  })

  it('trust stats bar contains all 4 stats', () => {
    const html = renderPressQuote(base, softTokens)
    expect(html).toContain('clients satisfaits')
    expect(html).toContain('4,8')
    expect(html).toContain('48h')
    expect(html).toContain('30 jours')
  })

  it('trust stats bar uses bgAlt background', () => {
    const html = renderPressQuote(base, softTokens)
    expect(html).toContain(softTokens.colors.bgAlt)
  })

  it('uses background image when available', () => {
    const html = renderPressQuote({
      ...base,
      images: ['lifestyle.jpg'],
      copy: { press_quote: { quote: 'X', source: 'Y' }}
    }, softTokens)
    expect(html).toContain('lifestyle.jpg')
  })
})
