import { describe, it, expect } from 'vitest'
import {
  renderTrustBadgesPayment,
  type PaymentMethod,
} from '../TrustBadgesPayment'

describe('renderTrustBadgesPayment', () => {
  it('retourne un bloc HTML non vide avec les méthodes par défaut', () => {
    const html = renderTrustBadgesPayment()
    expect(html.trim().length).toBeGreaterThan(0)
    // Les 4 méthodes par défaut sont présentes
    expect(html).toContain('Visa')
    expect(html).toContain('Mastercard')
    expect(html).toContain('PayPal')
    expect(html).toContain('Apple Pay')
  })

  it('rend uniquement les méthodes demandées', () => {
    const methods: PaymentMethod[] = ['visa', 'klarna', 'alma']
    const html = renderTrustBadgesPayment({ methods })
    expect(html).toContain('Visa')
    expect(html).toContain('Klarna')
    expect(html).toContain('alma')
    // Mastercard non demandé
    expect(html).not.toContain('Mastercard')
  })

  it('inclut role="group" et aria-label a11y', () => {
    const html = renderTrustBadgesPayment()
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="Moyens de paiement acceptés"')
  })

  it('variant compact ne contient pas de <section>', () => {
    const html = renderTrustBadgesPayment({ variant: 'compact' })
    expect(html).not.toContain('<section')
    expect(html).toContain('role="group"')
  })

  it('variant labeled contient le texte "Paiement 100% sécurisé"', () => {
    const html = renderTrustBadgesPayment({ variant: 'labeled' })
    expect(html).toContain('Paiement 100% sécurisé')
  })

  it('variant footer (default) contient "Paiement sécurisé" et une icône cadenas', () => {
    const html = renderTrustBadgesPayment({ variant: 'footer' })
    expect(html).toContain('Paiement sécurisé')
    // icône SVG cadenas incluse
    expect(html).toContain('<svg')
  })

  it('fallback sur Visa/MC/PayPal/Apple Pay si methods est tableau vide', () => {
    const html = renderTrustBadgesPayment({ methods: [] })
    expect(html).toContain('Visa')
    expect(html).toContain('PayPal')
  })

  it('respecte accentColor passé en prop', () => {
    const html = renderTrustBadgesPayment({ accentColor: '#FF0000' })
    expect(html).toContain('#FF0000')
  })

  it('SVGs sont inline (pas d\'attribut src= ni href= externe)', () => {
    const html = renderTrustBadgesPayment({ methods: ['visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay', 'klarna', 'alma'] })
    // Pas de référence externe dans les SVGs
    expect(html).not.toMatch(/src="http/)
    // Chaque méthode a son SVG
    expect(html).toContain('role="img" aria-label="Visa"')
    expect(html).toContain('role="img" aria-label="Mastercard"')
    expect(html).toContain('role="img" aria-label="American Express"')
    expect(html).toContain('role="img" aria-label="PayPal"')
    expect(html).toContain('role="img" aria-label="Apple Pay"')
    expect(html).toContain('role="img" aria-label="Google Pay"')
    expect(html).toContain('role="img" aria-label="Klarna"')
    expect(html).toContain('role="img" aria-label="Alma"')
  })
})
