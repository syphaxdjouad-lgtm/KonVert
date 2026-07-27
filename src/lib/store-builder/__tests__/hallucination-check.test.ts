import { describe, it, expect } from 'vitest'
import { detectSuspiciousClaims } from '../hallucination-check'
import { DEFAULT_TEMPLATE_CONTENT } from '../default-content'
import type { StoreBuilderOutput } from '../schema'

describe('detectSuspiciousClaims', () => {
  it('ne flag rien sur le contenu fallback propre (aucune donnée factuelle inventée)', () => {
    const flags = detectSuspiciousClaims(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'Description produit neutre.')
    expect(flags).toHaveLength(0)
  })

  it('flag un chiffre de preuve sociale halluciné ("1200 clients")', () => {
    const polluted: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      description_html: '<p>Rejoignez plus de 1200 clients satisfaits chaque mois.</p>',
    }
    const flags = detectSuspiciousClaims(polluted, 'Description produit neutre.')
    expect(flags.some((f) => f.pattern === 'social_proof_number' && f.severity === 'critical')).toBe(true)
  })

  it('flag une note ou un taux d\'efficacité inventé ("4.8/5", "98% efficace")', () => {
    const withRating: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      description_html: '<p>Noté 4.8/5 par nos clients.</p>',
    }
    expect(detectSuspiciousClaims(withRating, '').some((f) => f.pattern === 'fake_rating_or_efficacy')).toBe(true)

    const withEfficacy: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      description_html: '<p>Résultat garanti à 98% efficace.</p>',
    }
    expect(detectSuspiciousClaims(withEfficacy, '').some((f) => f.pattern === 'fake_rating_or_efficacy')).toBe(true)
  })

  it('flag une certification non sourcée dans la description produit d\'origine', () => {
    const polluted: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.tech,
      description_html: '<p>Certifié IP67 et Bluetooth 5.3 pour une résistance totale.</p>',
    }
    const flags = detectSuspiciousClaims(polluted, 'Écouteurs sans fil, autonomie 20h.')
    expect(flags.some((f) => f.pattern === 'unsourced_certification')).toBe(true)
  })

  it('ne flag PAS une certification qui apparaît littéralement dans la description source (RÈGLE 3)', () => {
    const legit: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.tech,
      description_html: '<p>Résistance IP67 comme annoncé par le fabricant.</p>',
    }
    const flags = detectSuspiciousClaims(legit, 'Écouteurs IP67 résistants à l\'eau, autonomie 20h.')
    expect(flags.some((f) => f.pattern === 'unsourced_certification')).toBe(false)
  })

  it('flag un code promo chiffré non fourni dans exit_intent', () => {
    const polluted: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      exit_intent: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.exit_intent, text_html: '<p>Profitez de -20% avec le code promo BIENVENUE.</p>' },
    }
    const flags = detectSuspiciousClaims(polluted, '')
    expect(flags.some((f) => f.pattern === 'unfunded_promo' && f.severity === 'critical')).toBe(true)
  })

  it('flag un nom de marque concurrente réelle dans comparison_table.rows[].them_text', () => {
    const polluted: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      comparison_table: {
        ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table,
        rows: [
          { label: 'Prix', us_value: 'yes', them_value: 'custom', them_text: 'Moins cher que sur Amazon' },
          ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table.rows.slice(1),
        ],
      },
    }
    const flags = detectSuspiciousClaims(polluted, '')
    expect(flags.some((f) => f.pattern === 'real_competitor_brand')).toBe(true)
  })

  it('ne flag pas un délai chiffré légitime encadré par un gabarit [...]', () => {
    // Cas déjà couvert par le contenu fallback (ex. "[délai réel, ex. 14 jours]")
    const flags = detectSuspiciousClaims(DEFAULT_TEMPLATE_CONTENT.dropshipping, '')
    expect(flags.some((f) => f.pattern === 'bare_delay_without_placeholder')).toBe(false)
  })

  it('ne flag pas un délai chiffré nu si présent dans merchant_facts (donnée réelle légitime)', () => {
    const withRealDelay: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      guarantees: [
        {
          icon: 'truck',
          title: 'Livraison rapide',
          text_html: '<p>Expédition sous 24 heures ouvrées, garanti.</p>',
        },
        ...DEFAULT_TEMPLATE_CONTENT.dropshipping.guarantees.slice(1),
      ],
    }
    const flags = detectSuspiciousClaims(withRealDelay, '', { processing_delay: '24 heures ouvrées' })
    expect(flags.some((f) => f.pattern === 'bare_delay_without_placeholder')).toBe(false)
  })

  it('flag (warning, non-critique) un délai chiffré nu sans gabarit ni merchant_facts', () => {
    const withBareDelay: StoreBuilderOutput = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      guarantees: [
        {
          icon: 'truck',
          title: 'Livraison rapide',
          text_html: '<p>Expédition sous 24 heures ouvrées, garanti.</p>',
        },
        ...DEFAULT_TEMPLATE_CONTENT.dropshipping.guarantees.slice(1),
      ],
    }
    const flags = detectSuspiciousClaims(withBareDelay, '')
    const flag = flags.find((f) => f.pattern === 'bare_delay_without_placeholder')
    expect(flag).toBeDefined()
    expect(flag?.severity).toBe('warning')
  })
})
