import { describe, it, expect } from 'vitest'
import { fnv1aHash, computeBucket, assignVariant } from '../hash'

describe('fnv1aHash', () => {
  it('est déterministe pour une même entrée', () => {
    expect(fnv1aHash('visitor-1:test-1')).toBe(fnv1aHash('visitor-1:test-1'))
  })

  it('renvoie des hash différents pour des entrées différentes', () => {
    expect(fnv1aHash('visitor-1:test-1')).not.toBe(fnv1aHash('visitor-2:test-1'))
  })

  it('renvoie toujours un entier non-négatif (32-bit unsigned)', () => {
    for (const input of ['a', 'visitor-xyz', '', '🦊', 'a'.repeat(500)]) {
      const h = fnv1aHash(input)
      expect(Number.isInteger(h)).toBe(true)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThanOrEqual(0xffffffff)
    }
  })
})

describe('computeBucket', () => {
  it('renvoie un bucket entre 0 et 99', () => {
    for (let i = 0; i < 200; i++) {
      const bucket = computeBucket(`visitor-${i}`, 'test-abc')
      expect(bucket).toBeGreaterThanOrEqual(0)
      expect(bucket).toBeLessThanOrEqual(99)
    }
  })

  it('sticky : même visiteur + même test => même bucket à chaque appel', () => {
    const b1 = computeBucket('visitor-42', 'test-1')
    const b2 = computeBucket('visitor-42', 'test-1')
    expect(b1).toBe(b2)
  })

  it('un même visiteur peut avoir un bucket différent sur 2 tests distincts', () => {
    // Pas une garantie mathématique stricte (collision possible) mais on
    // vérifie qu'au moins un des N tests généré diffère — sinon la fonction
    // ignorerait silencieusement `abTestId`.
    const buckets = new Set<number>()
    for (let i = 0; i < 20; i++) {
      buckets.add(computeBucket('visitor-fixed', `test-${i}`))
    }
    expect(buckets.size).toBeGreaterThan(1)
  })
})

describe('assignVariant', () => {
  it("renvoie 'a' ou 'b' uniquement", () => {
    for (let i = 0; i < 100; i++) {
      const variant = assignVariant(`visitor-${i}`, 'test-1')
      expect(['a', 'b']).toContain(variant)
    }
  })

  it('déterministe et sticky pour un couple (visitorId, abTestId) donné', () => {
    const v1 = assignVariant('visitor-99', 'test-9')
    const v2 = assignVariant('visitor-99', 'test-9')
    expect(v1).toBe(v2)
  })

  it('split approximativement 50/50 sur un grand échantillon (tolérance ±10pt)', () => {
    let countA = 0
    const N = 5000
    for (let i = 0; i < N; i++) {
      if (assignVariant(`visitor-${i}-${Math.random()}`, 'test-fixed') === 'a') countA++
    }
    const ratio = countA / N
    expect(ratio).toBeGreaterThan(0.4)
    expect(ratio).toBeLessThan(0.6)
  })
})
