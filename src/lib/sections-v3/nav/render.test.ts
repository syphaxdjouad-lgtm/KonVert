import { describe, it, expect } from 'vitest'
import { renderNav } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

// Fixture de base : brand_name via copy.brand
const baseData: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: {
    title: 'Sac à bandoulière en cuir vintage',
    description: 'Cuir véritable.',
    price: '79€',
  },
  images: ['hero.jpg'],
  copy: {
    brand: 'Maison Léonie',
    hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique' },
  },
}

describe('renderNav', () => {
  /**
   * T1 — brand_name présent (copy.brand) → contenu du nav
   */
  it('T1 : nav contient copy.brand quand fourni', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('Maison Léonie')
    // Le bouton CTA doit être présent
    expect(html).toContain('Voir l&#39;offre')
  })

  /**
   * T2 — sans copy.brand → fallback product.title tronqué
   */
  it('T2 : fallback product.title quand copy.brand absent', () => {
    const data: V3PageData = {
      ...baseData,
      copy: { hero: { tagline: 'hook', subtagline: '' } },
    }
    const html = renderNav(data, softTokens)
    // product.title = 'Sac à bandoulière en cuir vintage' (38 chars) → tronqué 30 chars + ellipsis
    expect(html).toContain('Sac à bandoulière en cuir vint…')
    expect(html).not.toContain('Maison Léonie')
  })

  /**
   * T3 — product.title > 30 chars → tronqué avec ellipsis (desktop)
   */
  it('T3 : product.title > 30 chars tronqué à 30 chars + ellipsis pour le desktop', () => {
    const longTitle = 'Sac à bandoulière en cuir vintage collection printemps-été 2026'
    const data: V3PageData = {
      ...baseData,
      product: { ...baseData.product, title: longTitle },
      copy: {},
    }
    const html = renderNav(data, softTokens)
    // Le titre de 63 chars doit être tronqué à 30 chars + ellipsis
    expect(html).toContain('Sac à bandoulière en cuir vint…')
    // La version complète ne doit pas apparaître (sauf peut-être dans aria-label du span parent)
    // On vérifie surtout que l'ellipsis est là
    expect(html).toMatch(/…/)
  })

  /**
   * T4 — skip link sr-only présent
   */
  it('T4 : skip link "Aller au contenu" présent en début de nav', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('Aller au contenu')
    expect(html).toContain('#main-content')
  })

  /**
   * T5 — a11y : role="navigation" + aria-label
   */
  it('T5 : nav a role="navigation" et aria-label="Navigation principale"', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('role="navigation"')
    expect(html).toContain('aria-label="Navigation principale"')
  })

  /**
   * T6 — sticky z-index 100 (au-dessus du sticky CTA mobile z-40)
   */
  it('T6 : nav a z-index:100 pour être au-dessus du sticky CTA mobile (z-40)', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('z-index: 100')
  })

  /**
   * T7 — scroll JS : .kvt-nav-scrolled ajouté après 100px de scroll
   */
  it('T7 : JS inline ajoute .kvt-nav-scrolled au scroll > 100px', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('kvt-nav-scrolled')
    expect(html).toContain('scrollY > 100')
  })

  /**
   * T8 — fond surface (jamais noir/quasi-noir)
   * tokens.colors.surface du style soft = '#FFFFFF' → off-white
   */
  it('T8 : fond du nav utilise tokens.colors.surface (pas de noir)', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain(softTokens.colors.surface)
    // Aucune occurrence de fond noir pur comme couleur de background du nav
    expect(html).not.toMatch(/background:\s*#000000/)
    expect(html).not.toMatch(/background:\s*#1A1A1A/)
  })

  /**
   * T9 — backdrop-filter blur pour effet glass
   */
  it('T9 : backdrop-filter blur présent (effet glass)', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('backdrop-filter: blur(8px)')
    expect(html).toContain('-webkit-backdrop-filter: blur(8px)')
  })

  /**
   * T10 — CTA scroll vers #main-cta
   */
  it('T10 : CTA du nav scroll vers #main-cta (getElementById)', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain("getElementById('main-cta')")
    expect(html).toContain("scrollIntoView")
    expect(html).toContain("behavior:'smooth'")
  })

  /**
   * T11 — prefers-reduced-motion : transition none
   */
  it('T11 : prefers-reduced-motion respecté (transition:none)', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('prefers-reduced-motion')
    expect(html).toContain('transition: none')
  })

  /**
   * T12 — Mobile : classe mobile-brand et cta-mobile présentes
   */
  it('T12 : labels mobile/desktop distincts pour brand et CTA', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('kvt-nav-brand-desktop')
    expect(html).toContain('kvt-nav-brand-mobile')
    expect(html).toContain('kvt-nav-cta-label-desktop')
    expect(html).toContain('kvt-nav-cta-label-mobile')
  })

  /**
   * T13 — nav ID kvt-nav présent pour le JS
   */
  it('T13 : nav a id="kvt-nav"', () => {
    const html = renderNav(baseData, softTokens)
    expect(html).toContain('id="kvt-nav"')
  })
})
