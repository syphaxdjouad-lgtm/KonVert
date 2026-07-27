import { describe, it, expect } from 'vitest'
import { assembleProductTemplate } from '../assemble'
import { DEFAULT_TEMPLATE_CONTENT } from '../default-content'
import { getBaseTemplate } from '../dawn-template'
import { VERTICALS } from '../schema'

describe('assembleProductTemplate — mapping champ → setting_id (spec §9)', () => {
  it('mappe hero.h1_title/subtitle vers productFields.title/subtitleMetafield (pas des settings de template)', () => {
    const { productFields } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    expect(productFields.title).toContain('essentiel')
    expect(productFields.subtitleMetafield).toContain('Complétez')
  })

  it('mappe description_html vers productFields.bodyHtml (product.body_html)', () => {
    const { productFields } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    expect(productFields.bodyHtml).toContain('<p>')
    expect(productFields.bodyHtml).toContain('galère')
  })

  it('mappe faq[i] vers sections["konvert-faq-rich"].blocks["question-i"].settings.{question,answer}', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-faq-rich']
    expect(section.block_order).toEqual(['question-0', 'question-1', 'question-2', 'question-3'])
    const block0 = section.blocks?.['question-0']
    expect(block0?.type).toBe('question')
    expect(block0?.settings?.question).toBe(DEFAULT_TEMPLATE_CONTENT.dropshipping.faq[0].question)
    expect(block0?.settings?.answer).toContain('<p>')
  })

  it('mappe guarantees[i] vers sections["konvert-guarantees"].blocks["guarantee-i"].settings.{icon,title,text}', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-guarantees']
    expect(section.block_order).toEqual(['guarantee-0', 'guarantee-1', 'guarantee-2', 'guarantee-3'])
    const block0 = section.blocks?.['guarantee-0']
    expect(block0?.settings?.icon).toBe('truck')
    expect(block0?.settings?.title).toBe('Livraison suivie')
  })

  it('mappe comparison_table vers sections["konvert-comparison-table"].settings + blocks["row-i"]', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-comparison-table']
    expect(section.settings?.heading).toBe('Pourquoi choisir [Nom de votre marque]')
    expect(section.settings?.them_column_label).toBe('Boutique classique')
    expect(section.block_order).toHaveLength(4)
    const row0 = section.blocks?.['row-0']
    expect(row0?.settings?.us_value).toBe('yes')
  })

  it('préserve les settings couleur non touchés par le générateur (heritage preset thème)', () => {
    const base = getBaseTemplate('dropshipping')
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-comparison-table']
    expect(section.settings?.color_scheme).toBe(base.sections['konvert-comparison-table'].settings?.color_scheme)
    expect(section.settings?.heading_color).toBe(base.sections['konvert-comparison-table'].settings?.heading_color)
  })

  it('mappe urgency_bar vers sections["konvert-urgency-bar"].settings (préserve show_stock_count etc.)', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-urgency-bar']
    expect(section.settings?.message_with_stock).toContain('[count]')
    expect(section.settings?.show_stock_count).toBe(true) // hérité, jamais généré par l'IA
  })

  it('force founder_name à "" quel que soit le contenu généré (R5)', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-founder-story']
    expect(section.settings?.founder_name).toBe('')
    expect(section.settings?.story).toContain('<p>')
  })

  it('force promo_code et cta_link à "" quel que soit le contenu généré (R5)', () => {
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const section = template.sections['konvert-exit-intent']
    expect(section.settings?.promo_code).toBe('')
    expect(section.settings?.cta_link).toBe('')
  })

  it('ne touche jamais konvert-testimonials-carousel / konvert-social-proof / konvert-sticky-atc-mobile', () => {
    const base = getBaseTemplate('dropshipping')
    const { template } = assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    for (const untouched of ['konvert-testimonials-carousel', 'konvert-social-proof', 'konvert-sticky-atc-mobile']) {
      expect(template.sections[untouched]).toEqual(base.sections[untouched])
    }
  })

  it('ne mute jamais le squelette de base partagé (copie profonde à chaque appel)', () => {
    const before = JSON.stringify(getBaseTemplate('dropshipping'))
    assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT.dropshipping, 'dropshipping')
    const after = JSON.stringify(getBaseTemplate('dropshipping'))
    expect(after).toBe(before)
  })

  it('assemble sans erreur pour les 3 verticals avec leur contenu fallback respectif', () => {
    for (const vertical of VERTICALS) {
      expect(() => assembleProductTemplate(DEFAULT_TEMPLATE_CONTENT[vertical], vertical)).not.toThrow()
    }
  })

  it('échappe un caractère HTML injecté dans un champ plain-text (label comparison_table)', () => {
    const malicious = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      comparison_table: {
        ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table,
        rows: [
          { label: '<img src=x onerror=alert(1)>', us_value: 'yes' as const, them_value: 'no' as const },
          ...DEFAULT_TEMPLATE_CONTENT.dropshipping.comparison_table.rows.slice(1),
        ],
      },
    }
    const { template } = assembleProductTemplate(malicious, 'dropshipping')
    const label = template.sections['konvert-comparison-table'].blocks?.['row-0']?.settings?.label
    expect(label).not.toContain('<img')
  })
})
