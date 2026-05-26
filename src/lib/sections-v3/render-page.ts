import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleId, StyleTokens } from '@/lib/styles/types'
import { STYLE_IDS } from '@/lib/styles'
import { DEFAULT_SECTION_ORDER_V3 } from './index'
import { shouldRenderSection } from './display-rules'
import { softTokens } from '@/lib/styles/soft/tokens'
import { renderHero } from './hero/render'
import { renderGallery } from './gallery/render'
import { renderWhyWeLove } from './why-we-love/render'
import { renderThoughtfullyDesigned } from './thoughtfully-designed/render'
import { renderBestFor } from './best-for/render'
import { renderCareInstructions } from './care-instructions/render'
import { renderFaq } from './faq/render'

// Map style -> tokens. Sprints 2-3 + Task 6.1 ajouteront les 9 autres entries.
const STYLE_TOKENS: Partial<Record<StyleId, StyleTokens>> = {
  'soft': softTokens,
}

// Map section -> renderer. Sprint 5 ajoutera les 6 sections restantes.
type SectionRendererFn = (data: V3PageData, tokens: StyleTokens) => string

const SECTION_RENDERERS: Partial<Record<V3SectionKey, SectionRendererFn>> = {
  'hero':                  renderHero,
  'gallery':               renderGallery,
  'why_we_love':           renderWhyWeLove,
  'thoughtfully_designed': renderThoughtfullyDesigned,
  'best_for':              renderBestFor,
  'care_instructions':     renderCareInstructions,
  'faq':                   renderFaq,
}

export function renderPageV3(
  styleId: StyleId,
  data: V3PageData,
  sectionOrder?: readonly V3SectionKey[],
): string {
  if (!STYLE_IDS.includes(styleId)) {
    throw new Error(`Unknown styleId: ${styleId}`)
  }
  const tokens = STYLE_TOKENS[styleId]
  if (!tokens) {
    throw new Error(`No tokens registered for styleId: ${styleId} (POC: only 'soft' until S6)`)
  }
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER_V3

  const sections = order
    .filter(key => shouldRenderSection(key, data))
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
      if (!renderer) return ''  // section pas encore implémentée
      return renderer(data, tokens)
    })
    .filter(Boolean)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(data.product.title)}</title>
</head>
<body style="margin:0;padding:0">
${sections}
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
