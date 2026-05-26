import { describe, it, expect } from 'vitest'
import { renderBestFor } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderBestFor', () => {
  it('renders pills from best_for array', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Travelling', 'Walking', 'Everyday'] }}, softTokens)
    for (const pill of ['Travelling', 'Walking', 'Everyday']) {
      expect(html).toContain(pill)
    }
  })
  it('renders empty list gracefully', () => {
    const html = renderBestFor({ ...base, copy: { best_for: [] }}, softTokens)
    expect(html).toContain('Idéal pour')
  })
})
