import { describe, it, expect, vi, afterEach } from 'vitest'
import { getAppUrl } from './env'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getAppUrl', () => {
  it('renvoie NEXT_PUBLIC_APP_URL si défini', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://konvert.app')
    expect(getAppUrl()).toBe('https://konvert.app')
  })

  it('strip le trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://konvert.app/')
    expect(getAppUrl()).toBe('https://konvert.app')
  })

  it('throw en production si NEXT_PUBLIC_APP_URL manquant', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '')
    expect(() => getAppUrl()).toThrow(/NEXT_PUBLIC_APP_URL/)
  })

  it('fallback localhost en dev', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_APP_URL', '')
    expect(getAppUrl()).toBe('http://localhost:3000')
  })
})
