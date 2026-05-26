import { describe, it, expect } from 'vitest'
import { renderReviewsAiSummary } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderReviewsAiSummary', () => {
  it('renders summary paragraph', () => {
    const html = renderReviewsAiSummary({
      ...base, copy: { reviews_summary: 'Customers love the comfort and breathability...' }
    }, softTokens)
    expect(html).toContain('Customers love the comfort')
  })
  it('shows rating count when present', () => {
    const html = renderReviewsAiSummary({
      ...base,
      product: { ...base.product, rating: { value: 4.6, count: 10190 } },
      copy: { reviews_summary: 'X' },
    }, softTokens)
    expect(html).toContain('10190')
    expect(html).toContain('4.6')
  })
  it('returns empty string when no summary', () => {
    const html = renderReviewsAiSummary(base, softTokens)
    expect(html).toBe('')
  })
})
