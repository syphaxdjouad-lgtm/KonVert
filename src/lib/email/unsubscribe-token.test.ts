import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const ORIGINAL_KEY = process.env.ENCRYPTION_KEY

beforeAll(() => {
  // Setter une clé connue pour rendre les tests déterministes.
  process.env.ENCRYPTION_KEY = 'test-secret-key-vitest-only'
})
afterAll(() => {
  if (ORIGINAL_KEY === undefined) delete process.env.ENCRYPTION_KEY
  else process.env.ENCRYPTION_KEY = ORIGINAL_KEY
})

describe('unsubscribe-token', () => {
  it('genere un token reproductible pour le meme email', async () => {
    const { generateUnsubscribeToken } = await import('./unsubscribe-token')
    const t1 = generateUnsubscribeToken('user@example.com')
    const t2 = generateUnsubscribeToken('user@example.com')
    expect(t1).toBe(t2)
    expect(t1.length).toBeGreaterThan(20)
  })

  it('genere un token different pour des emails differents', async () => {
    const { generateUnsubscribeToken } = await import('./unsubscribe-token')
    const t1 = generateUnsubscribeToken('a@example.com')
    const t2 = generateUnsubscribeToken('b@example.com')
    expect(t1).not.toBe(t2)
  })

  it('verify retourne true pour un token valide', async () => {
    const { generateUnsubscribeToken, verifyUnsubscribeToken } = await import('./unsubscribe-token')
    const token = generateUnsubscribeToken('user@example.com')
    expect(verifyUnsubscribeToken('user@example.com', token)).toBe(true)
  })

  it('verify retourne false pour un token bidon', async () => {
    const { verifyUnsubscribeToken } = await import('./unsubscribe-token')
    expect(verifyUnsubscribeToken('user@example.com', 'totally-fake-token')).toBe(false)
  })

  it('verify retourne false pour email different (pas de cross-account unsubscribe)', async () => {
    const { generateUnsubscribeToken, verifyUnsubscribeToken } = await import('./unsubscribe-token')
    const tokenForAlice = generateUnsubscribeToken('alice@example.com')
    expect(verifyUnsubscribeToken('mallory@example.com', tokenForAlice)).toBe(false)
  })

  it('verify retourne false pour token vide', async () => {
    const { verifyUnsubscribeToken } = await import('./unsubscribe-token')
    expect(verifyUnsubscribeToken('user@example.com', '')).toBe(false)
  })

  it('email normalise (case-insensitive + trim)', async () => {
    const { generateUnsubscribeToken, verifyUnsubscribeToken } = await import('./unsubscribe-token')
    const token = generateUnsubscribeToken('USER@Example.com')
    expect(verifyUnsubscribeToken('  user@example.com  ', token)).toBe(true)
  })
})
