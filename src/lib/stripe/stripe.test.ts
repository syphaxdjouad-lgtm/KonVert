import { describe, it, expect, vi, afterEach } from 'vitest'

// On stub les env vars AVANT d'importer le module — sinon les STRIPE_PRICES
// sont calculés une fois pour toutes au module-load.

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('getStripePrice', () => {
  it('renvoie le price ID monthly correct', async () => {
    vi.stubEnv('STRIPE_PRICE_PRO', 'price_pro_monthly_test')
    vi.resetModules()
    const { getStripePrice } = await import('./index')
    expect(getStripePrice('pro', 'monthly')).toBe('price_pro_monthly_test')
  })

  it('renvoie le price ID annuel correct', async () => {
    vi.stubEnv('STRIPE_PRICE_PRO_ANNUAL', 'price_pro_annual_test')
    vi.resetModules()
    const { getStripePrice } = await import('./index')
    expect(getStripePrice('pro', 'annual')).toBe('price_pro_annual_test')
  })

  it('throw si price ID manquant (pas de fallback silencieux)', async () => {
    vi.stubEnv('STRIPE_PRICE_AGENCY_ANNUAL', '')
    vi.resetModules()
    const { getStripePrice } = await import('./index')
    expect(() => getStripePrice('agency', 'annual')).toThrow(/STRIPE_PRICE_AGENCY_ANNUAL/i)
  })
})

describe('getPlanFromStripePrice', () => {
  it('renvoie null pour priceId vide', async () => {
    const { getPlanFromStripePrice } = await import('./index')
    expect(getPlanFromStripePrice(undefined)).toBeNull()
    expect(getPlanFromStripePrice('')).toBeNull()
  })

  it('renvoie null pour priceId inconnu', async () => {
    const { getPlanFromStripePrice } = await import('./index')
    expect(getPlanFromStripePrice('price_inconnu_xyz')).toBeNull()
  })

  it('reconnait plan + interval monthly', async () => {
    vi.stubEnv('STRIPE_PRICE_PRO', 'price_pro_monthly_unique_xyz')
    vi.resetModules()
    const { getPlanFromStripePrice } = await import('./index')
    const result = getPlanFromStripePrice('price_pro_monthly_unique_xyz')
    expect(result?.plan).toBe('pro')
    expect(result?.interval).toBe('monthly')
  })

  it('reconnait plan + interval annual', async () => {
    vi.stubEnv('STRIPE_PRICE_AGENCY_ANNUAL', 'price_agency_annual_unique_xyz')
    vi.resetModules()
    const { getPlanFromStripePrice } = await import('./index')
    const result = getPlanFromStripePrice('price_agency_annual_unique_xyz')
    expect(result?.plan).toBe('agency')
    expect(result?.interval).toBe('annual')
  })
})
