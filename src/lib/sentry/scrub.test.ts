import { describe, it, expect } from 'vitest'
import { scrubString, scrubValue, scrubEvent } from './scrub'

describe('scrubString', () => {
  it('masque les emails', () => {
    expect(scrubString('contact: user@example.com a écrit')).toContain('[email]')
    expect(scrubString('user@example.com')).toBe('[email]')
  })

  it('masque les Stripe secret keys', () => {
    expect(scrubString('STRIPE_SECRET_KEY=sk_live_AAAAAAAAAAAAAAAAAA')).toContain('[stripe-secret]')
    expect(scrubString('sk_test_xyzABC123')).toContain('[stripe-secret]')
  })

  it('masque les JWT', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    expect(scrubString(`Authorization: Bearer ${jwt}`)).not.toContain('eyJ')
  })

  it('masque les Bearer tokens', () => {
    expect(scrubString('Authorization: Bearer secret-token-xyz')).toContain('[redacted]')
  })

  it('preserve le texte sans secrets', () => {
    expect(scrubString('Hello world, all good!')).toBe('Hello world, all good!')
  })
})

describe('scrubValue', () => {
  it('redact les keys sensibles dans un objet', () => {
    const v = scrubValue({ password: 'p4ss', email: 'alice@example.com', name: 'Alice' }) as Record<string, unknown>
    expect(v.password).toBe('[redacted]')
    expect(v.email).toBe('[email]')
    expect(v.name).toBe('Alice')
  })

  it('traverse arrays + objets imbriques', () => {
    const v = scrubValue({
      headers: { authorization: 'Bearer abc', accept: 'json' },
      body: ['user@example.com', { token: 'xyz' }],
    }) as { headers: Record<string, string>; body: unknown[] }
    expect(v.headers.authorization).toBe('[redacted]')
    expect(v.headers.accept).toBe('json')
    expect(v.body[0]).toBe('[email]')
    expect((v.body[1] as Record<string, string>).token).toBe('[redacted]')
  })

  it('preserve les types non-string', () => {
    const v = scrubValue({ count: 42, ok: true, when: null })
    expect(v).toEqual({ count: 42, ok: true, when: null })
  })

  it('cap recursion (anti-stack-overflow)', () => {
    type Recursive = { x: Recursive | string }
    let nested: Recursive = { x: 'a@b.com' }
    for (let i = 0; i < 20; i++) nested = { x: nested }
    expect(() => scrubValue(nested)).not.toThrow()
  })
})

describe('scrubEvent', () => {
  it('scrub message + breadcrumbs + extra', () => {
    const event = {
      message: 'Erreur pour user@example.com',
      breadcrumbs: [
        { message: 'auth: user@example.com', category: 'auth', timestamp: 1234567890 },
        { message: 'normal log', category: 'console', timestamp: 1234567891 },
      ],
      extra: {
        email: 'a@b.com',
        debug_info: 'Bearer eyJhbGciOiJIUzI1NiJ9.aaa.bbb',
      },
      exception: {
        values: [{ type: 'Error', value: 'Failed for user@example.com' }],
      },
    }
    // Le hook accepte un Event Sentry — on cast car le shape est partiel
    const scrubbed = scrubEvent(event as unknown as Parameters<typeof scrubEvent>[0])
    expect(scrubbed.message).toContain('[email]')
    expect(scrubbed.breadcrumbs?.[0].message).toContain('[email]')
    expect(scrubbed.breadcrumbs?.[1].message).toBe('normal log')
    expect((scrubbed.extra as Record<string, string>).email).toBe('[email]')
    // Le scrubber remplace 'Bearer xxx' par 'Bearer [redacted]' — on vérifie
    // que le token JWT brut n'apparaît plus, pas que le mot 'Bearer' a disparu.
    expect((scrubbed.extra as Record<string, string>).debug_info).toContain('[redacted]')
    expect((scrubbed.extra as Record<string, string>).debug_info).not.toContain('eyJ')
    expect(scrubbed.exception?.values?.[0].value).toContain('[email]')
  })
})
