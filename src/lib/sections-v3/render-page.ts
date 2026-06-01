import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleId, StyleTokens } from '@/lib/styles/types'
import { STYLE_IDS } from '@/lib/styles'
import { DEFAULT_SECTION_ORDER_V3 } from './index'
import { shouldRenderSection } from './display-rules'
import { softTokens } from '@/lib/styles/soft/tokens'
import { editorialTokens } from '@/lib/styles/editorial/tokens'
import { appleCleanTokens } from '@/lib/styles/apple-clean/tokens'
import { boldTokens } from '@/lib/styles/bold/tokens'
import { organicTokens } from '@/lib/styles/organic/tokens'
import { luxeNoirTokens } from '@/lib/styles/luxe-noir/tokens'
import { brutalistTokens } from '@/lib/styles/brutalist/tokens'
import { warmNeutralTokens } from '@/lib/styles/warm-neutral/tokens'
import { minimalMonoTokens } from '@/lib/styles/minimal-mono/tokens'
import { vibrantTokens } from '@/lib/styles/vibrant/tokens'
import { renderHero } from './hero/render'
import { renderGallery } from './gallery/render'
import { renderWhyWeLove } from './why-we-love/render'
import { renderThoughtfullyDesigned } from './thoughtfully-designed/render'
import { renderBestFor } from './best-for/render'
import { renderMaterialsBreakdown } from './materials-breakdown/render'
import { renderHowItWorks } from './how-it-works/render'
import { renderCompareVariants } from './compare-variants/render'
import { renderReviewsAiSummary } from './reviews-ai-summary/render'
import { renderPressQuote } from './press-quote/render'
import { renderCareInstructions } from './care-instructions/render'
import { renderFaq } from './faq/render'
import { renderBrandManifesto } from './brand-manifesto/render'

// Map style -> tokens. Tous les 10 styles V3 sont enregistrés.
const STYLE_TOKENS: Record<StyleId, StyleTokens> = {
  'soft':         softTokens,
  'editorial':    editorialTokens,
  'apple-clean':  appleCleanTokens,
  'bold':         boldTokens,
  'organic':      organicTokens,
  'luxe-noir':    luxeNoirTokens,
  'brutalist':    brutalistTokens,
  'warm-neutral': warmNeutralTokens,
  'minimal-mono': minimalMonoTokens,
  'vibrant':      vibrantTokens,
}

// Map section -> renderer. Tous les 13 renderers V3 sont enregistrés ici.
type SectionRendererFn = (data: V3PageData, tokens: StyleTokens) => string

const SECTION_RENDERERS: Record<V3SectionKey, SectionRendererFn> = {
  'hero':                  renderHero,
  'gallery':               renderGallery,
  'why_we_love':           renderWhyWeLove,
  'thoughtfully_designed': renderThoughtfullyDesigned,
  'best_for':              renderBestFor,
  'materials_breakdown':   renderMaterialsBreakdown,
  'how_it_works':          renderHowItWorks,
  'compare_variants':      renderCompareVariants,
  'reviews_ai_summary':    renderReviewsAiSummary,
  'press_quote':           renderPressQuote,
  'care_instructions':     renderCareInstructions,
  'faq':                   renderFaq,
  'brand_manifesto':       renderBrandManifesto,
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
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER_V3

  const sections = order
    .filter(key => shouldRenderSection(key, data))
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap">
</head>
<body style="margin:0;padding:0">
${sections}
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
