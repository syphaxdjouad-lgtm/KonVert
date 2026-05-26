import { describe, it, expect } from 'vitest'
import { softTokens } from './tokens'

describe('softTokens', () => {
  it('has cream background', () => {
    expect(softTokens.colors.bg).toBe('#FAF7F2')
  })
  it('uses serif heading + sans body', () => {
    expect(softTokens.fonts.heading).toContain('Cormorant')
    expect(softTokens.fonts.body).toContain('Inter')
  })
  it('uses small radius (~6px) for understated feel', () => {
    expect(softTokens.radius.card).toBe('6px')
  })
})
