import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  canConnectShop,
  hasStoreBuilderAdmins,
  isStoreBuilderAdmin,
  isStoreBuilderEnabled,
  resolveStoreBuilderAccess,
} from '../flag'
import type { PlanType } from '@/types'

const ADMIN = 'founder@example.com'

function setEnv(flag: string | undefined, admins = ADMIN) {
  vi.stubEnv('STORE_BUILDER_ENABLED', flag as string)
  vi.stubEnv('STORE_BUILDER_ADMIN_EMAILS', admins)
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('isStoreBuilderEnabled', () => {
  it.each([
    ['true', true],
    ['false', false],
    ['TRUE', false],
    ['1', false],
    ['', false],
  ])('STORE_BUILDER_ENABLED=%j → %s', (value, expected) => {
    setEnv(value)
    expect(isStoreBuilderEnabled()).toBe(expected)
  })

  it('est OFF par défaut (var absente)', () => {
    vi.stubEnv('STORE_BUILDER_ENABLED', undefined as unknown as string)
    delete process.env.STORE_BUILDER_ENABLED
    expect(isStoreBuilderEnabled()).toBe(false)
  })
})

describe('isStoreBuilderAdmin', () => {
  it('matche insensible à la casse et aux espaces, liste séparée par virgules', () => {
    setEnv('false', ` other@x.io , ${ADMIN.toUpperCase()} `)
    expect(isStoreBuilderAdmin(ADMIN)).toBe(true)
    expect(isStoreBuilderAdmin('other@x.io')).toBe(true)
    expect(isStoreBuilderAdmin('nope@x.io')).toBe(false)
    expect(hasStoreBuilderAdmins()).toBe(true)
  })

  it('refuse email vide/null et liste vide', () => {
    setEnv('false', '')
    expect(isStoreBuilderAdmin(null)).toBe(false)
    expect(isStoreBuilderAdmin('')).toBe(false)
    expect(isStoreBuilderAdmin(ADMIN)).toBe(false)
    expect(hasStoreBuilderAdmins()).toBe(false)
  })
})

describe('resolveStoreBuilderAccess — flag × admin × plan', () => {
  const plans: PlanType[] = ['free', 'starter', 'pro', 'agency']

  describe('flag OFF', () => {
    it.each(plans)('non-admin plan %s → hidden', (plan) => {
      setEnv('false')
      expect(resolveStoreBuilderAccess({ email: 'user@x.io', plan })).toEqual({ kind: 'hidden' })
    })

    it.each(plans)('admin plan %s → granted multi-store (bypass flag + plan)', (plan) => {
      setEnv('false')
      expect(resolveStoreBuilderAccess({ email: ADMIN, plan })).toEqual({
        kind: 'granted',
        maxStores: 99,
        viaAdmin: true,
      })
    })
  })

  describe('flag ON', () => {
    it.each<[PlanType, unknown]>([
      ['free', { kind: 'upgrade', plan: 'free' }],
      ['starter', { kind: 'upgrade', plan: 'starter' }],
      ['pro', { kind: 'granted', maxStores: 1, viaAdmin: false }],
      ['agency', { kind: 'granted', maxStores: 99, viaAdmin: false }],
    ])('non-admin plan %s', (plan, expected) => {
      setEnv('true')
      expect(resolveStoreBuilderAccess({ email: 'user@x.io', plan })).toEqual(expected)
    })

    it('admin sur plan starter → granted quand même', () => {
      setEnv('true')
      expect(resolveStoreBuilderAccess({ email: ADMIN, plan: 'starter' }).kind).toBe('granted')
    })

    it('plan inconnu/absent → traité comme free (upgrade)', () => {
      setEnv('true')
      expect(resolveStoreBuilderAccess({ email: 'user@x.io', plan: null })).toEqual({ kind: 'upgrade', plan: 'free' })
      expect(
        resolveStoreBuilderAccess({ email: 'user@x.io', plan: 'enterprise' as unknown as PlanType }),
      ).toEqual({ kind: 'upgrade', plan: 'free' })
    })
  })
})

describe('canConnectShop', () => {
  it('Pro (1 store) : premier connect OK', () => {
    expect(canConnectShop({ maxStores: 1, connectedShops: [], shop: 'a.myshopify.com' })).toBe(true)
  })

  it('Pro (1 store) : 2e boutique refusée', () => {
    expect(canConnectShop({ maxStores: 1, connectedShops: ['a.myshopify.com'], shop: 'b.myshopify.com' })).toBe(false)
  })

  it('Pro (1 store) : reconnexion du même shop autorisée (upgrade scopes)', () => {
    expect(canConnectShop({ maxStores: 1, connectedShops: ['A.myshopify.com'], shop: 'a.myshopify.com' })).toBe(true)
  })

  it('Agency (99) : multi-store OK', () => {
    expect(
      canConnectShop({ maxStores: 99, connectedShops: ['a.myshopify.com', 'b.myshopify.com'], shop: 'c.myshopify.com' }),
    ).toBe(true)
  })
})
