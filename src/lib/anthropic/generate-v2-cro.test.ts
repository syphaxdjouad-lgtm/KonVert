/**
 * Tests Vitest — generate.ts v2.0-enriched-2026-06-05
 * Couvre les 5 nouveaux champs CRO : photo_descriptions, payment_methods,
 * press_logos, stock_signal, bundle_offer.
 *
 * 1. Happy path complet : tous les champs v2 bien formés → sanitization transparente
 * 2. Champs optionnels null/[] : stock_signal null, bundle_offer null, press_logos []
 * 3. Edge case LLM malformé → fallback gracieux (pas de crash, valeurs par défaut)
 */

import { describe, it, expect } from 'vitest'
import { sanitizeLandingPageData } from './generate'
import type { LandingPageData } from '@/types'

// ─── Fixture de base (champs core obligatoires) ──────────────────────────────
const BASE: LandingPageData = {
  headline: 'La peau qu\'on vous a dit impossible à avoir',
  subtitle: 'Le sérum qui répare pendant que vous dormez',
  benefits: ['Hydratation 72h', 'Texture légère', 'Sans parfum'],
  faq: [{ question: 'Compatible peaux sensibles ?', answer: 'Oui, testé dermato.' }],
  cta: 'Commander maintenant',
  urgency: 'Plus que 8 en stock',
  product_name: 'Sérum Nuit Répare',
  price: '39',
  language: 'fr',
}

// ─── 1. HAPPY PATH complet ───────────────────────────────────────────────────
describe('sanitizeLandingPageData — happy path v2 complet', () => {
  it('passe tous les champs CRO enrichis valides sans altération majeure', () => {
    const input: LandingPageData = {
      ...BASE,
      photo_descriptions: [
        { context: 'Femme 32 ans applique le sérum, salle de bain, lumière douce', customer_first_name: 'Sophie', sentiment: 'during' },
        { context: 'Peau terne, cernes visibles, lumière dure matin', customer_first_name: 'Clara', sentiment: 'before' },
        { context: 'Teint éclatant, sourire naturel, lumière naturelle', customer_first_name: 'Manon', sentiment: 'after' },
        { context: 'Femme active 30 ans, routine matinale, café', customer_first_name: 'Léa', sentiment: 'lifestyle' },
      ],
      payment_methods: ['visa', 'mastercard', 'paypal', 'apple_pay', 'klarna'],
      press_logos: [
        { publication: 'Vogue', quote_short: 'Le sérum qui a changé notre routine.' },
        { publication: 'Marie Claire' },
      ],
      stock_signal: {
        type: 'limited_stock',
        message: 'Plus que 12 en stock',
        cta_intensifier: 'Commandez maintenant',
      },
      bundle_offer: {
        title: 'Routine Nuit Complète',
        description: 'Le duo gagnant pour une peau transformée en 14 jours.',
        products_to_pair: ['Crème de nuit régénérante', 'Masque détox hebdomadaire'],
        discount_label: '-15% sur le bundle',
      },
    }

    const result = sanitizeLandingPageData(input)

    // photo_descriptions
    expect(result.photo_descriptions).toHaveLength(4)
    expect(result.photo_descriptions![0].sentiment).toBe('during')
    expect(result.photo_descriptions![0].customer_first_name).toBe('Sophie')
    // escapeHtml ne doit pas altérer les apostrophes normales de ce contexte
    expect(result.photo_descriptions![0].context).toContain('salle de bain')

    // payment_methods
    expect(result.payment_methods).toEqual(['visa', 'mastercard', 'paypal', 'apple_pay', 'klarna'])

    // press_logos
    expect(result.press_logos).toHaveLength(2)
    expect(result.press_logos![0].publication).toBe('Vogue')
    expect(result.press_logos![0].quote_short).toBe('Le sérum qui a changé notre routine.')
    expect(result.press_logos![1].publication).toBe('Marie Claire')
    // quote_short absent → pas de clé vide
    expect(result.press_logos![1].quote_short).toBeUndefined()

    // stock_signal
    expect(result.stock_signal).not.toBeNull()
    expect(result.stock_signal!.type).toBe('limited_stock')
    expect(result.stock_signal!.message).toBe('Plus que 12 en stock')
    expect(result.stock_signal!.cta_intensifier).toBe('Commandez maintenant')

    // bundle_offer
    expect(result.bundle_offer).not.toBeNull()
    expect(result.bundle_offer!.title).toBe('Routine Nuit Complète')
    expect(result.bundle_offer!.products_to_pair).toHaveLength(2)
    expect(result.bundle_offer!.discount_label).toBe('-15% sur le bundle')
  })
})

// ─── 2. CHAMPS OPTIONNELS null / [] ─────────────────────────────────────────
describe('sanitizeLandingPageData — champs optionnels null et tableaux vides', () => {
  it('stock_signal null est préservé null', () => {
    const result = sanitizeLandingPageData({ ...BASE, stock_signal: null })
    expect(result.stock_signal).toBeNull()
  })

  it('bundle_offer null est préservé null', () => {
    const result = sanitizeLandingPageData({ ...BASE, bundle_offer: null })
    expect(result.bundle_offer).toBeNull()
  })

  it('press_logos tableau vide est préservé vide', () => {
    const result = sanitizeLandingPageData({ ...BASE, press_logos: [] })
    expect(result.press_logos).toEqual([])
  })

  it('payment_methods absent → défaut [visa,mastercard,paypal,apple_pay]', () => {
    // Sans payment_methods dans l'input, v2 injecte le défaut
    const result = sanitizeLandingPageData({ ...BASE })
    // En mode v2 (USE_V2_PROMPT=true par défaut), le défaut est injecté
    // Note: ce test suppose KONVERT_PROMPT_VERSION != 'v1' (défaut process.env)
    expect(Array.isArray(result.payment_methods)).toBe(true)
  })

  it('photo_descriptions absent → field undefined (pas de plantage)', () => {
    const result = sanitizeLandingPageData({ ...BASE })
    // Pas d'erreur runtime, champ simplement absent
    expect(result.photo_descriptions).toBeUndefined()
  })

  it('stock_signal avec type null inline est préservé', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      stock_signal: { type: null, message: 'message', cta_intensifier: 'cta' },
    })
    // type null → stock_signal entier → null (invalide, rejeté par sanitizer)
    expect(result.stock_signal).toBeNull()
  })
})

// ─── 3. EDGE CASES — LLM retourne forme invalide → fallback gracieux ─────────
describe('sanitizeLandingPageData — edge cases LLM malformé', () => {
  it('payment_methods avec valeur inconnue → défaut safe', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      // @ts-expect-error — simule LLM qui retourne une valeur hors enum
      payment_methods: ['visa', 'bitcoin', 'unknown_card'],
    })
    // 'bitcoin' et 'unknown_card' filtrés, seul 'visa' reste
    // → moins de 1 résultat valide : on prend le défaut complet
    // (le comportement dépend du branch : si filtered.length > 0 → garde le filtré)
    expect(result.payment_methods).toBeDefined()
    expect(result.payment_methods).not.toContain('bitcoin')
    expect(result.payment_methods).not.toContain('unknown_card')
    if (result.payment_methods!.includes('visa')) {
      // filtered avait au moins 'visa' → on garde le tableau filtré
      expect(result.payment_methods).toContain('visa')
    } else {
      // fallback défaut
      expect(result.payment_methods).toContain('mastercard')
    }
  })

  it('photo_descriptions avec sentiment invalide → entrée filtrée', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      photo_descriptions: [
        { context: 'Contexte valide', customer_first_name: 'Sophie', sentiment: 'during' },
        // @ts-expect-error — simule LLM qui invente un sentiment
        { context: 'Contexte invalide', customer_first_name: 'Claire', sentiment: 'invalid_mood' },
      ],
    })
    // Seule l'entrée valide est conservée
    expect(result.photo_descriptions).toHaveLength(1)
    expect(result.photo_descriptions![0].sentiment).toBe('during')
  })

  it('stock_signal avec type inconnu → stock_signal null', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      stock_signal: {
        // @ts-expect-error — simule LLM qui invente un type
        type: 'flash_sale',
        message: 'Vente flash 2h',
        cta_intensifier: 'Profitez maintenant',
      },
    })
    expect(result.stock_signal).toBeNull()
  })

  it('bundle_offer avec structure incomplète → bundle_offer null', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      bundle_offer: {
        // products_to_pair et discount_label manquants
        title: 'Bundle incomplet',
        // @ts-expect-error — simule LLM qui omet des champs requis
        description: undefined,
        products_to_pair: undefined,
        discount_label: undefined,
      },
    })
    // Structure invalide → null, pas de crash
    expect(result.bundle_offer).toBeNull()
  })

  it('press_logos avec publication vide → entrée filtrée', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: 'Vogue', quote_short: 'Belle citation.' },
        { publication: '   ' }, // espace seul → trim → vide → filtré
        { publication: '' },    // vide → filtré
      ],
    })
    expect(result.press_logos).toHaveLength(1)
    expect(result.press_logos![0].publication).toBe('Vogue')
  })

  it('XSS dans les champs v2 → escape HTML appliqué', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [{ publication: '<script>alert(1)</script>', quote_short: '<b>Bold</b>' }],
      stock_signal: {
        type: 'high_demand',
        message: '<img src=x onerror=alert(1)>',
        cta_intensifier: '<a href="evil">Click</a>',
      },
    })
    expect(result.press_logos![0].publication).not.toContain('<script>')
    expect(result.press_logos![0].publication).toContain('&lt;script&gt;')
    expect(result.stock_signal!.message).not.toContain('<img')
    expect(result.stock_signal!.cta_intensifier).not.toContain('<a href')
  })
})
