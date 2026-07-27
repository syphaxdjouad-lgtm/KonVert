// Store Builder for Shopify — Re-audit CRO : extraction des champs
// audités depuis un `ThemeTemplate` déjà parsé (cf. parse-template.ts).
// Pur — connaît les `setting_id`/`type` exacts des sections konvert-*
// (cf. konvert-dawn/sections/konvert-*.liquid, vérifiés le 2026-07-27).
// Testable avec des fixtures JSON, sans réseau.

import {
  findSectionByType,
  readBooleanSetting,
  readStringSetting,
  sectionBlocks,
  sectionIsInOrder,
  findSectionIdByType,
  type ThemeTemplate,
} from './parse-template'
import type { AuditFaqItem, AuditTestimonialBlock } from './types'

export function extractTestimonials(template: ThemeTemplate): AuditTestimonialBlock[] {
  const section = findSectionByType(template, 'konvert-testimonials-carousel')
  return sectionBlocks(section).map((block) => ({
    authorName: typeof block.settings?.author_name === 'string' ? block.settings.author_name : '',
    quote: typeof block.settings?.quote === 'string' ? block.settings.quote : '',
    rating: typeof block.settings?.rating === 'number' ? block.settings.rating : 0,
  }))
}

export function extractSocialProof(template: ThemeTemplate): { number: string; customText: string } {
  const section = findSectionByType(template, 'konvert-social-proof')
  return {
    number: readStringSetting(section, 'proof_number'),
    customText: readStringSetting(section, 'custom_text'),
  }
}

export function extractFounderStory(template: ThemeTemplate): {
  founderName: string
  storyHtml: string
  founderPhoto: string
} {
  const section = findSectionByType(template, 'konvert-founder-story')
  return {
    founderName: readStringSetting(section, 'founder_name'),
    storyHtml: readStringSetting(section, 'story'),
    founderPhoto: readStringSetting(section, 'founder_photo'),
  }
}

export function extractExitIntentPromoCode(template: ThemeTemplate): string {
  return readStringSetting(findSectionByType(template, 'konvert-exit-intent'), 'promo_code')
}

export function extractFaqItems(template: ThemeTemplate): AuditFaqItem[] {
  const section = findSectionByType(template, 'konvert-faq-rich')
  return sectionBlocks(section).map((block) => ({
    question: typeof block.settings?.question === 'string' ? block.settings.question : '',
    answer: typeof block.settings?.answer === 'string' ? block.settings.answer : '',
  }))
}

export function countFilledGuarantees(template: ThemeTemplate): number {
  const section = findSectionByType(template, 'konvert-guarantees')
  return sectionBlocks(section).filter((block) => {
    const title = block.settings?.title
    const text = block.settings?.text
    return typeof title === 'string' && title.trim() !== '' && typeof text === 'string' && text.trim() !== ''
  }).length
}

export function countFilledComparisonRows(template: ThemeTemplate): number {
  const section = findSectionByType(template, 'konvert-comparison-table')
  return sectionBlocks(section).filter((block) => {
    const label = block.settings?.label
    return typeof label === 'string' && label.trim() !== ''
  }).length
}

export function extractUrgencyMessage(template: ThemeTemplate): string {
  return readStringSetting(findSectionByType(template, 'konvert-urgency-bar'), 'message_default')
}

/** Une section peut exister dans `sections` (définie) sans être rendue si
 * elle a été retirée de `order` — on vérifie donc les deux. */
export function isStickyAtcMobileActive(template: ThemeTemplate): boolean {
  const sectionId = findSectionIdByType(template, 'konvert-sticky-atc-mobile')
  if (!sectionId) return false
  return sectionIsInOrder(template, sectionId)
}

// readBooleanSetting non utilisé pour l'instant (aucun critère booléen de
// settings actuel) — conservé pour un futur critère (ex: show_countdown).
export { readBooleanSetting }
