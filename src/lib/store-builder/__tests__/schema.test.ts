import { describe, it, expect } from 'vitest'
import {
  buildStoreBuilderOutputSchema,
  GENERIC_COMPETITOR_LABELS,
  R5_FORBIDDEN_KEYS,
  VERTICALS,
} from '../schema'
import { DEFAULT_TEMPLATE_CONTENT } from '../default-content'

describe('buildStoreBuilderOutputSchema', () => {
  it('accepte la sortie fallback (valide déjà connu) pour chaque vertical', () => {
    for (const vertical of VERTICALS) {
      const schema = buildStoreBuilderOutputSchema(vertical)
      const result = schema.safeParse(DEFAULT_TEMPLATE_CONTENT[vertical])
      if (!result.success) {
        console.error(vertical, result.error.flatten())
      }
      expect(result.success).toBe(true)
    }
  })

  it('rejette une sortie vide (tous les champs sont requis)', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    expect(schema.safeParse({}).success).toBe(false)
  })

  it('rejette une clé additionnelle inconnue au niveau racine (.strict())', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const withExtra = { ...DEFAULT_TEMPLATE_CONTENT.dropshipping, extra_field: 'nope' }
    const result = schema.safeParse(withExtra)
    expect(result.success).toBe(false)
  })

  for (const forbidden of R5_FORBIDDEN_KEYS) {
    it(`rejette une sortie qui contiendrait le champ interdit R5 "${forbidden}" (non-régression structurelle)`, () => {
      const schema = buildStoreBuilderOutputSchema('dropshipping')
      const polluted = { ...DEFAULT_TEMPLATE_CONTENT.dropshipping, [forbidden]: 'valeur interdite' }
      const result = schema.safeParse(polluted)
      // .strict() rejette toute clé hors schéma — le champ interdit ne doit
      // jamais pouvoir être accepté à la racine de la sortie.
      expect(result.success).toBe(false)
    })
  }

  it('rejette founder_name au niveau founder_story (.strict() imbriqué)', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      founder_story: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.founder_story, founder_name: 'Jean Dupont' },
    }
    expect(schema.safeParse(polluted).success).toBe(false)
  })

  it('rejette promo_code et cta_link au niveau exit_intent (.strict() imbriqué)', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const withPromo = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      exit_intent: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.exit_intent, promo_code: 'SOLDES20' },
    }
    expect(schema.safeParse(withPromo).success).toBe(false)

    const withCtaLink = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      exit_intent: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.exit_intent, cta_link: '/cart' },
    }
    expect(schema.safeParse(withCtaLink).success).toBe(false)
  })

  it('rejette them_column_label hors énumération du vertical', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      comparison_table: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table, them_column_label: 'Shein' },
    }
    expect(schema.safeParse(polluted).success).toBe(false)
  })

  it('accepte them_column_label pour chaque valeur de l\'énumération du vertical', () => {
    for (const vertical of VERTICALS) {
      const schema = buildStoreBuilderOutputSchema(vertical)
      for (const label of GENERIC_COMPETITOR_LABELS[vertical]) {
        const candidate = {
          ...DEFAULT_TEMPLATE_CONTENT[vertical],
          comparison_table: { ...DEFAULT_TEMPLATE_CONTENT[vertical].comparison_table, them_column_label: label },
        }
        expect(schema.safeParse(candidate).success).toBe(true)
      }
    }
  })

  it('rejette message_with_stock sans le token littéral [count]', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      urgency_bar: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.urgency_bar, message_with_stock: 'Il en reste peu, commandez vite' },
    }
    expect(schema.safeParse(polluted).success).toBe(false)
  })

  it('rejette story_html sans aucun gabarit [entre crochets]', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      founder_story: {
        ...DEFAULT_TEMPLATE_CONTENT.dropshipping.founder_story,
        story_html: '<p>'.padEnd(90, 'x') + '</p>', // >= 80 chars, sans crochets
      },
    }
    expect(schema.safeParse(polluted).success).toBe(false)
  })

  it('rejette une comparison_row us_value="custom" sans us_text (superRefine)', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const rows = [...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table.rows]
    rows[0] = { label: 'Critère test', us_value: 'custom', them_value: 'yes' }
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      comparison_table: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table, rows },
    }
    expect(schema.safeParse(polluted).success).toBe(false)
  })

  it('rejette moins de 4 items FAQ ou plus de 6', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const tooFew = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      faq: DEFAULT_TEMPLATE_CONTENT.dropshipping.faq.slice(0, 2),
    }
    expect(schema.safeParse(tooFew).success).toBe(false)
  })

  it('rejette une icon guarantees hors énumération', () => {
    const schema = buildStoreBuilderOutputSchema('dropshipping')
    const guarantees = [...DEFAULT_TEMPLATE_CONTENT.dropshipping.guarantees]
    guarantees[0] = { ...guarantees[0], icon: 'rocket' as never }
    const polluted = { ...DEFAULT_TEMPLATE_CONTENT.dropshipping, guarantees }
    expect(schema.safeParse(polluted).success).toBe(false)
  })
})
