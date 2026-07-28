import { describe, it, expect } from 'vitest'
import { deriveInitials } from './derive-initials'

describe('deriveInitials', () => {
  it('dérive 2 lettres depuis un nom latin classique (regression FR)', () => {
    expect(deriveInitials('Marie L.')).toBe('ML')
  })

  it('dérive depuis un nom latin sans point (2 mots)', () => {
    expect(deriveInitials('Sarah Martin')).toBe('SM')
  })

  it('dérive des initiales valides depuis un nom arabe (2 mots)', () => {
    // "Sarah M." en arabe — repro locale 2026-07-28 : le LLM renvoyait
    // "initials": "س.م." (4 chars) qui pétait le schema max(3). On dérive
    // maintenant nous-mêmes, indépendamment de ce que le LLM a produit.
    const result = deriveInitials('سارة م.')
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(4)
    expect(result).toBe('سم')
  })

  it('fallback sur 1er caractère quand un seul mot', () => {
    expect(deriveInitials('Cher')).toBe('C')
  })

  it('fallback ultime "—" quand author vide', () => {
    expect(deriveInitials('')).toBe('—')
  })

  it('fallback ultime "—" quand author ne contient que des espaces', () => {
    expect(deriveInitials('   ')).toBe('—')
  })

  it('reste Unicode-safe sur un caractère astral (supplementary plane)', () => {
    // U+1D410 (𝐀, mathematical bold capital A) est encodé sur 2 unités UTF-16
    // (surrogate pair). Un naive `str[0]` ou `str.slice(0,1)` couperait la
    // paire et retournerait un caractère invalide. Array.from() découpe par
    // code point et reste correct.
    const astral = '\u{1D410}bc Test'
    const result = deriveInitials(astral)
    expect(Array.from(result).every((c) => c !== '�')).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('cap la longueur à 4 caractères après dérivation', () => {
    const result = deriveInitials('Word1 Word2 Word3 Word4')
    expect(Array.from(result).length).toBeLessThanOrEqual(4)
  })

  it('uppercase les initiales latines', () => {
    expect(deriveInitials('marie l.')).toBe('ML')
  })
})
