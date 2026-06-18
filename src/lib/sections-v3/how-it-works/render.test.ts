import { describe, it, expect } from 'vitest'
import { renderHowItWorks } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderHowItWorks', () => {
  it('renders all steps', () => {
    const steps = [
      { step: 1, title: 'Nettoie', description: 'Applique sur peau sèche' },
      { step: 2, title: 'Patiente', description: 'Laisse poser 2 min' },
      { step: 3, title: 'Rince', description: "À l'eau tiède" },
    ]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps } }, softTokens)
    expect(html).toContain('Nettoie')
    expect(html).toContain('Patiente')
    expect(html).toContain('Rince')
  })

  it('renders step numbers', () => {
    const steps = [
      { step: 1, title: 'A', description: 'desc A' },
      { step: 2, title: 'B', description: 'desc B' },
    ]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps } }, softTokens)
    expect(html).toContain('1')
    expect(html).toContain('2')
  })

  it('renders title', () => {
    const html = renderHowItWorks(
      { ...base, copy: { how_it_works: [{ step: 1, title: 'X', description: 'Y' }] } },
      softTokens
    )
    expect(html).toContain("Comment l'utiliser")
  })

  it('handles empty steps array', () => {
    const html = renderHowItWorks({ ...base, copy: { how_it_works: [] } }, softTokens)
    expect(html).toBeDefined()
  })

  // Sprint 3 T1 — fond alterné + numéros grands
  it('alternates surface/bgAlt backgrounds across steps', () => {
    const steps = [
      { step: 1, title: 'A', description: 'desc A' },
      { step: 2, title: 'B', description: 'desc B' },
    ]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps } }, softTokens)
    expect(html).toContain(softTokens.colors.surface)
    expect(html).toContain(softTokens.colors.bgAlt)
  })

  it('renders step numbers with large font-size clamp', () => {
    const steps = [{ step: 1, title: 'A', description: 'B' }]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps } }, softTokens)
    expect(html).toContain('clamp(48px,6vw,80px)')
  })

  it('renders step numbers in accent color', () => {
    const steps = [{ step: 1, title: 'A', description: 'B' }]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps } }, softTokens)
    expect(html).toContain(softTokens.colors.accent)
  })
})
