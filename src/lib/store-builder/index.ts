export {
  buildStoreBuilderOutputSchema,
  GENERIC_COMPETITOR_LABELS,
  GUARANTEE_ICONS,
  R5_FORBIDDEN_KEYS,
  VERTICALS,
  isVertical,
  type StoreBuilderOutput,
  type Vertical,
} from './schema'

export { merchantFactsSchema, type MerchantFacts } from './merchant-facts'

export { deriveVertical } from './vertical'

export { buildSystemPrompt, buildUserPrompt } from './prompts'

export { assertNoForbiddenKeys, ForbiddenKeyError } from './guardrails'

export {
  generateStoreBuilderContent,
  type GenerateStoreBuilderResult,
} from './generate'

export { DEFAULT_TEMPLATE_CONTENT } from './default-content'

export {
  detectSuspiciousClaims,
  type Flag,
  type FlagSeverity,
} from './hallucination-check'

export {
  assembleProductTemplate,
  type AssembledStoreBuilderTemplate,
  type StoreBuilderProductFields,
} from './assemble'

export { getBaseTemplate, type DawnProductTemplate, type DawnSection, type DawnSectionBlock } from './dawn-template'

export { sanitizeRichTextP } from './sanitize-richtext'
