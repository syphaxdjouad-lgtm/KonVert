import { describe, it, expect } from 'vitest'
import { autoPickTone } from './auto-pick-tone'

describe('autoPickTone', () => {
  it('returns premium for luxury items > 200€', () => {
    expect(autoPickTone({ title: 'Bague or 18k', description: '', price: 350 })).toBe('premium')
  })
  it('returns educational for wellness/skincare', () => {
    expect(autoPickTone({ title: 'Sérum vitamine C', description: '' })).toBe('educational')
    expect(autoPickTone({ title: 'Vitamine D3', description: '' })).toBe('educational')
  })
  it('returns bold for tech', () => {
    expect(autoPickTone({ title: 'Drone 4K', description: '' })).toBe('bold')
  })
  it('returns friendly for fashion/beauty', () => {
    expect(autoPickTone({ title: 'Sac à main', description: '' })).toBe('friendly')
  })
  it('default friendly for unknown', () => {
    expect(autoPickTone({ title: 'Bidule xyz', description: '' })).toBe('friendly')
  })
})
