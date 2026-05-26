import { describe, it, expect } from 'vitest'
import { suggestStyle } from './auto-pick'

describe('suggestStyle', () => {
  it('returns luxe-noir for jewelry products > 200€', () => {
    expect(suggestStyle({ title: 'Bague en or 18k', description: '', price: 450 })).toBe('luxe-noir')
  })
  it('returns soft for jewelry products < 200€', () => {
    expect(suggestStyle({ title: 'Collier en argent', description: '', price: 89 })).toBe('soft')
  })
  it('returns organic for skincare', () => {
    expect(suggestStyle({ title: 'Sérum hyaluronique anti-âge', description: '' })).toBe('organic')
  })
  it('returns apple-clean for tech', () => {
    expect(suggestStyle({ title: 'Chargeur USB-C 65W', description: '' })).toBe('apple-clean')
  })
  it('returns minimal-mono when no category detected', () => {
    expect(suggestStyle({ title: 'Truc bidule xyzabc', description: '' })).toBe('minimal-mono')
  })
  it('returns luxe-noir for any luxury category', () => {
    expect(suggestStyle({ title: 'Édition limitée artisan luxe', description: '' })).toBe('luxe-noir')
  })
  it('returns warm-neutral for fashion', () => {
    expect(suggestStyle({ title: 'Sac à main cuir', description: '' })).toBe('warm-neutral')
  })
})
