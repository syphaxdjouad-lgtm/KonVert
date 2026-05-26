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
  it('renders quote and source', () => {
    const html = renderPressQuote({
      ...base, copy: { press_quote: { quote: 'Game changer.', source: 'Vogue' }}
    }, softTokens)
    expect(html).toContain('Game changer.')
    expect(html).toContain('Vogue')
  })
  it('returns empty when no press_quote', () => {
    const html = renderPressQuote(base, softTokens)
    expect(html).toBe('')
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
