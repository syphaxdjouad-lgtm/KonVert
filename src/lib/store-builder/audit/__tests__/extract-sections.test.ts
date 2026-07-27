import { describe, it, expect } from 'vitest'
import { parseThemeTemplate } from '../parse-template'
import {
  countFilledComparisonRows,
  countFilledGuarantees,
  extractExitIntentPromoCode,
  extractFaqItems,
  extractFounderStory,
  extractSocialProof,
  extractTestimonials,
  extractUrgencyMessage,
  isStickyAtcMobileActive,
} from '../extract-sections'

const FULL_FIXTURE = JSON.stringify({
  sections: {
    testimonials: {
      type: 'konvert-testimonials-carousel',
      blocks: {
        t1: { type: 'testimonial', settings: { author_name: 'Marie D.', quote: 'Top produit', rating: 5 } },
        t2: {
          type: 'testimonial',
          settings: {
            author_name: '[Remplacez par un prénom/nom de client réel]',
            quote: '[Remplacez par un avis client réel — ne publiez jamais un témoignage fictif]',
            rating: 0,
          },
        },
      },
      block_order: ['t1', 't2'],
    },
    social_proof: { type: 'konvert-social-proof', settings: { proof_number: '', custom_text: '10 000 clients' } },
    founder: {
      type: 'konvert-founder-story',
      settings: { founder_name: 'Julien', story: "Fondée en [année] à [ville]", founder_photo: '' },
    },
    exit_intent: { type: 'konvert-exit-intent', settings: { promo_code: 'BIENVENUE10' } },
    faq: {
      type: 'konvert-faq-rich',
      blocks: {
        f1: { type: 'faq_item', settings: { question: 'Q1', answer: 'A1' } },
        f2: { type: 'faq_item', settings: { question: 'Q2', answer: '' } },
        f3: { type: 'faq_item', settings: { question: 'Q3', answer: 'A3' } },
      },
      block_order: ['f1', 'f2', 'f3'],
    },
    guarantees: {
      type: 'konvert-guarantees',
      blocks: {
        g1: { type: 'guarantee', settings: { title: 'Livraison', text: '48h' } },
        g2: { type: 'guarantee', settings: { title: '', text: '' } },
      },
      block_order: ['g1', 'g2'],
    },
    comparison: {
      type: 'konvert-comparison-table',
      blocks: {
        c1: { type: 'row', settings: { label: 'Prix' } },
        c2: { type: 'row', settings: { label: '' } },
      },
      block_order: ['c1', 'c2'],
    },
    urgency: { type: 'konvert-urgency-bar', settings: { message_default: 'Stock limité' } },
    sticky: { type: 'konvert-sticky-atc-mobile', settings: {} },
  },
  order: ['testimonials', 'social_proof', 'founder', 'exit_intent', 'faq', 'guarantees', 'comparison', 'urgency', 'sticky'],
})

const template = parseThemeTemplate(FULL_FIXTURE)!

describe('extractTestimonials', () => {
  it('extrait tous les blocs (y compris placeholders — le filtre isRealTestimonial est côté criteria.ts)', () => {
    const testimonials = extractTestimonials(template)
    expect(testimonials).toHaveLength(2)
    expect(testimonials[0]).toEqual({ authorName: 'Marie D.', quote: 'Top produit', rating: 5 })
  })
})

describe('extractSocialProof', () => {
  it('extrait proof_number et custom_text', () => {
    expect(extractSocialProof(template)).toEqual({ number: '', customText: '10 000 clients' })
  })
})

describe('extractFounderStory', () => {
  it('extrait founder_name/story/founder_photo', () => {
    expect(extractFounderStory(template)).toEqual({
      founderName: 'Julien',
      storyHtml: 'Fondée en [année] à [ville]',
      founderPhoto: '',
    })
  })
})

describe('extractExitIntentPromoCode', () => {
  it('extrait le promo_code', () => {
    expect(extractExitIntentPromoCode(template)).toBe('BIENVENUE10')
  })
})

describe('extractFaqItems', () => {
  it('extrait les 3 blocs FAQ (y compris ceux avec answer vide)', () => {
    expect(extractFaqItems(template)).toHaveLength(3)
  })
})

describe('countFilledGuarantees', () => {
  it('ne compte que les blocs title ET text non vides', () => {
    expect(countFilledGuarantees(template)).toBe(1)
  })
})

describe('countFilledComparisonRows', () => {
  it('ne compte que les lignes avec label non vide', () => {
    expect(countFilledComparisonRows(template)).toBe(1)
  })
})

describe('extractUrgencyMessage', () => {
  it('extrait message_default', () => {
    expect(extractUrgencyMessage(template)).toBe('Stock limité')
  })
})

describe('isStickyAtcMobileActive', () => {
  it('true si la section est présente dans sections ET order', () => {
    expect(isStickyAtcMobileActive(template)).toBe(true)
  })

  it("false si la section a été retirée de l'order", () => {
    const noOrderTemplate = { ...template, order: template.order!.filter((id) => id !== 'sticky') }
    expect(isStickyAtcMobileActive(noOrderTemplate)).toBe(false)
  })

  it("false si la section n'existe pas du tout", () => {
    const withoutSection = { sections: {}, order: [] }
    expect(isStickyAtcMobileActive(withoutSection)).toBe(false)
  })
})
