import { describe, it, expect } from 'vitest'
import { STYLE_IDS, type StyleId } from './index'

describe('STYLE_IDS', () => {
  it('contains exactly 10 styles', () => {
    expect(STYLE_IDS).toHaveLength(10)
  })

  it('all ids are kebab-case strings', () => {
    for (const id of STYLE_IDS) {
      expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })

  it('contains the canonical 10 styles', () => {
    expect(STYLE_IDS).toEqual([
      'soft', 'editorial', 'apple-clean', 'bold', 'organic',
      'luxe-noir', 'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant',
    ])
  })
})
