import { escapeHtmlText } from '@/lib/security/sanitize'
import { sanitizeRichTextP } from './sanitize-richtext'
import { getBaseTemplate, type DawnProductTemplate, type DawnSectionBlock } from './dawn-template'
import type { StoreBuilderOutput, Vertical } from './schema'

// ─── Assemblage — sortie LLM validée → template Dawn-compatible (spec §9) ──
//
// Mapping champ de sortie → `section.setting_id`/`block type` exécuté à la
// lettre depuis docs/store-builder-generator-spec.md §9. Tout le reste du
// template de base (couleurs, layout, `konvert-testimonials-carousel`,
// `konvert-social-proof`, `konvert-sticky-atc-mobile`, blocs `main` autres
// que `caption`) n'est JAMAIS touché ici — copié tel quel depuis le preset du
// vertical (cf. `getBaseTemplate`, copie profonde du squelette embarqué).

export interface StoreBuilderProductFields {
  /** → `product.title` (Shopify Admin) — pas un setting de template. */
  title: string
  /** → `product.body_html` (Shopify Admin). */
  bodyHtml: string
  /**
   * → metafield `descriptors.subtitle`, lu par le bloc `caption` de
   * `main-product` via `{{ product.metafields.descriptors.subtitle.value }}`
   * (référence déjà présente dans le squelette — ne jamais l'écraser).
   */
  subtitleMetafield: string
}

export interface AssembledStoreBuilderTemplate {
  template: DawnProductTemplate
  productFields: StoreBuilderProductFields
}

const REQUIRED_SECTIONS = [
  'konvert-faq-rich',
  'konvert-guarantees',
  'konvert-comparison-table',
  'konvert-urgency-bar',
  'konvert-founder-story',
  'konvert-exit-intent',
] as const

function getSection(template: DawnProductTemplate, id: string) {
  const section = template.sections[id]
  if (!section) {
    throw new Error(`Section "${id}" absente du template de base — squelette Dawn corrompu ou désynchronisé.`)
  }
  if (!section.settings) section.settings = {}
  return section
}

/**
 * Fusionne la sortie validée du générateur IA dans une copie du squelette
 * Dawn du vertical. Sanitizer déterministe appliqué systématiquement (§8.3) :
 * `escapeHtmlText` sur les champs plain-text (labels, titres, headings —
 * jamais destinés à contenir du HTML), `sanitizeRichTextP` sur les champs
 * HTML/richtext (whitelist `<p>` uniquement).
 */
export function assembleProductTemplate(
  output: StoreBuilderOutput,
  vertical: Vertical,
): AssembledStoreBuilderTemplate {
  const template = getBaseTemplate(vertical)

  for (const id of REQUIRED_SECTIONS) {
    if (!template.sections[id]) {
      throw new Error(`Squelette Dawn "${vertical}" invalide : section "${id}" manquante.`)
    }
  }

  const productFields: StoreBuilderProductFields = {
    title: escapeHtmlText(output.hero.h1_title),
    bodyHtml: sanitizeRichTextP(output.description_html),
    subtitleMetafield: escapeHtmlText(output.hero.subtitle),
  }

  setFaqBlocks(template, output.faq)
  setGuaranteeBlocks(template, output.guarantees)
  setComparisonTable(template, output.comparison_table)
  setUrgencyBar(template, output.urgency_bar)
  setFounderStory(template, output.founder_story)
  setExitIntent(template, output.exit_intent)

  return { template, productFields }
}

function setFaqBlocks(template: DawnProductTemplate, faq: StoreBuilderOutput['faq']) {
  const section = getSection(template, 'konvert-faq-rich')
  const blocks: Record<string, DawnSectionBlock> = {}
  const order: string[] = []
  faq.forEach((item, i) => {
    const key = `question-${i}`
    blocks[key] = {
      type: 'question',
      settings: {
        question: escapeHtmlText(item.question),
        answer: sanitizeRichTextP(item.answer_html),
      },
    }
    order.push(key)
  })
  section.blocks = blocks
  section.block_order = order
}

function setGuaranteeBlocks(template: DawnProductTemplate, guarantees: StoreBuilderOutput['guarantees']) {
  const section = getSection(template, 'konvert-guarantees')
  const blocks: Record<string, DawnSectionBlock> = {}
  const order: string[] = []
  guarantees.forEach((item, i) => {
    const key = `guarantee-${i}`
    blocks[key] = {
      type: 'guarantee',
      settings: {
        // Enum déjà validé par Zod (guaranteeIconEnum) — pas de champ texte libre.
        icon: item.icon,
        title: escapeHtmlText(item.title),
        text: sanitizeRichTextP(item.text_html),
      },
    }
    order.push(key)
  })
  section.blocks = blocks
  section.block_order = order
}

function setComparisonTable(template: DawnProductTemplate, table: StoreBuilderOutput['comparison_table']) {
  const section = getSection(template, 'konvert-comparison-table')

  Object.assign(section.settings as Record<string, unknown>, {
    heading: escapeHtmlText(table.heading),
    subheading: table.subheading ? escapeHtmlText(table.subheading) : '',
    criteria_column_label: escapeHtmlText(table.criteria_column_label),
    us_column_label: escapeHtmlText(table.us_column_label),
    // them_column_label est déjà contraint à l'enum générique du vertical par
    // Zod — jamais un nom de marque réelle (cf. schema.ts).
    them_column_label: escapeHtmlText(table.them_column_label),
  })

  const blocks: Record<string, DawnSectionBlock> = {}
  const order: string[] = []
  table.rows.forEach((row, i) => {
    const key = `row-${i}`
    blocks[key] = {
      type: 'comparison_row',
      settings: {
        label: escapeHtmlText(row.label),
        us_value: row.us_value,
        us_text: row.us_text ? escapeHtmlText(row.us_text) : '',
        them_value: row.them_value,
        them_text: row.them_text ? escapeHtmlText(row.them_text) : '',
      },
    }
    order.push(key)
  })
  section.blocks = blocks
  section.block_order = order
}

function setUrgencyBar(template: DawnProductTemplate, bar: StoreBuilderOutput['urgency_bar']) {
  const section = getSection(template, 'konvert-urgency-bar')
  Object.assign(section.settings as Record<string, unknown>, {
    message_default: escapeHtmlText(bar.message_default),
    // Le token littéral [count] survit à escapeHtmlText (les crochets ne sont
    // pas dans la liste des caractères échappés) — remplacé par Liquid côté
    // Shopify avec le stock réel.
    message_with_stock: escapeHtmlText(bar.message_with_stock),
  })
}

function setFounderStory(template: DawnProductTemplate, story: StoreBuilderOutput['founder_story']) {
  const section = getSection(template, 'konvert-founder-story')
  Object.assign(section.settings as Record<string, unknown>, {
    heading: escapeHtmlText(story.heading),
    story: sanitizeRichTextP(story.story_html),
    founder_role: escapeHtmlText(story.founder_role),
    // R5 — absent du schéma LLM (schema.ts), forcé vide même si le squelette
    // de base l'a déjà à "" — défense en profondeur (§5.3).
    founder_name: '',
  })
}

function setExitIntent(template: DawnProductTemplate, exitIntent: StoreBuilderOutput['exit_intent']) {
  const section = getSection(template, 'konvert-exit-intent')
  Object.assign(section.settings as Record<string, unknown>, {
    heading: escapeHtmlText(exitIntent.heading),
    text: sanitizeRichTextP(exitIntent.text_html),
    cta_label: escapeHtmlText(exitIntent.cta_label),
    // R5 — absents du schéma LLM, forcés vides (§5.3).
    promo_code: '',
    cta_link: '',
  })
}
