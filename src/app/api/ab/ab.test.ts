import { describe, it, expect } from 'vitest'
import { assignVariant } from './route'

describe('assignVariant', () => {
  it('renvoie A ou B (jamais autre chose)', () => {
    for (let i = 0; i < 100; i++) {
      const v = assignVariant(`visitor-${i}`)
      expect(['A', 'B']).toContain(v)
    }
  })

  it('est deterministe pour le meme visitorId', () => {
    const id = 'visitor-deterministic-test'
    const v1 = assignVariant(id)
    const v2 = assignVariant(id)
    const v3 = assignVariant(id)
    expect(v1).toBe(v2)
    expect(v2).toBe(v3)
  })

  it('repartit a peu pres 50/50 sur 1000 visitors random', () => {
    let countA = 0, countB = 0
    for (let i = 0; i < 1000; i++) {
      const id = `v_${Math.random().toString(36).slice(2)}`
      if (assignVariant(id) === 'A') countA++
      else countB++
    }
    // Une déviation > 15 % indiquerait un biais important du hash
    const ratioA = countA / 1000
    expect(ratioA).toBeGreaterThan(0.35)
    expect(ratioA).toBeLessThan(0.65)
  })

  it('handle visitorId vide sans crash', () => {
    expect(['A', 'B']).toContain(assignVariant(''))
  })
})
