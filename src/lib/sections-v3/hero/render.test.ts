import { describe, it, expect } from 'vitest'
import { renderHero } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const baseData: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: {
    title: 'Sac à bandoulière en cuir vintage',
    description: 'Cuir véritable...',
    price: '79€',
    rating: { value: 4.6, count: 1247 },
  },
  images: ['hero.jpg', 'detail.jpg'],
  copy: { hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique, finition main' } },
}

describe('renderHero', () => {
  it('includes product title as secondary reference (not in h1)', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Sac à bandoulière en cuir vintage')
  })

  // P0-1 : le H1 doit contenir le hook LLM, PAS le titre AliExpress brut
  it('P0-1 : h1 contient le hook LLM (tagline), pas le titre produit brut', () => {
    const html = renderHero(baseData, softTokens)
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
    expect(h1Match).not.toBeNull()
    const h1Content = h1Match![1]
    expect(h1Content).toContain('Un cuir qui vit avec toi')
    expect(h1Content).not.toContain('Sac à bandoulière en cuir vintage')
  })

  it('P0-1 : fallback h1 = titre produit quand tagline absent', () => {
    const data: V3PageData = {
      ...baseData,
      copy: {},
    }
    const html = renderHero(data, softTokens)
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
    expect(h1Match).not.toBeNull()
    expect(h1Match![1]).toContain('Sac à bandoulière en cuir vintage')
  })

  it('includes price', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('79€')
  })

  it('includes rating value and count when present', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('4.6')
    expect(html).toContain('1247')
  })

  // P1-2 : fallback social proof quand rating absent
  it('P1-2 : affiche le fallback social proof quand rating absent', () => {
    const data = { ...baseData, product: { ...baseData.product, rating: undefined } }
    const html = renderHero(data, softTokens)
    expect(html).toContain('10 000 clients satisfaits')
  })

  it('P1-2 : le fallback social proof est remplacé par le rating réel quand présent', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('4.6')
    // Le fallback générique ne doit pas apparaître si le rating est réel
    expect(html).not.toContain('10 000 clients satisfaits')
  })

  it('P1-2 : le fallback social_proof_fallback personnalisé est utilisé si fourni', () => {
    const data: V3PageData = {
      ...baseData,
      product: { ...baseData.product, rating: undefined },
      copy: { ...baseData.copy, hero: { tagline: 'Mon hook', subtagline: '', social_proof_fallback: '★★★★★ 5 000 avis vérifiés' } },
    }
    const html = renderHero(data, softTokens)
    expect(html).toContain('5 000 avis vérifiés')
  })

  it('uses primary image (first in images)', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('hero.jpg')
  })

  it('uses tagline from copy.hero', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Un cuir qui vit avec toi')
  })

  // P1-3 : trust badges dans le hero
  it('P1-3 : trust badges compacts présents dans le hero (garantie, livraison, paiement)', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Garantie 30 jours')
    expect(html).toContain('Livraison rapide')
    expect(html).toContain('Paiement sécurisé')
  })

  it('applies token colors via inline style', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain(softTokens.colors.bg)
    expect(html).toContain(softTokens.colors.accent)
  })

  // Sprint 1 T5 — logos de paiement compacts (variant 'compact') injectés dans le hero
  it('T5 : trust badges paiement compacts présents dans le hero (Visa, PayPal)', () => {
    const html = renderHero(baseData, softTokens)
    // Le variant compact du renderTrustBadgesPayment doit être injecté sous le CTA
    expect(html).toContain('Moyens de paiement acceptés')
    expect(html).toContain('Visa')
    expect(html).toContain('PayPal')
  })

  it('T5 : les logos de paiement n\'utilisent pas de src= externe (SVG inline)', () => {
    const html = renderHero(baseData, softTokens)
    // Aucune image externe pour les logos paiement
    expect(html).not.toMatch(/src="http[^"]*payment/)
    // Le bloc compact est présent
    expect(html).toContain('role="group"')
  })
})
