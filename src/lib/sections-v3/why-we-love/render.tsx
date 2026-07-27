import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'
import { t } from '@/lib/i18n/ui-labels'
import { resolveLanguage } from '@/lib/i18n/languages'

export function renderWhyWeLove(data: V3PageData, tokens: StyleTokens): string {
  const lang = resolveLanguage(data.language)
  const text = data.copy.why_we_love ?? data.product.description.slice(0, 280)
  return `
<section style="
  background:${tokens.colors.surface};
  padding:${tokens.spacing.section} 24px;
">
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <span style="
      display:inline-block;font-size:12px;letter-spacing:0.15em;
      color:${tokens.colors.textMuted};margin-bottom:24px;text-transform:uppercase
    ">${escapeHtml(t(lang, 'whyWeLove.eyebrow'))}</span>
    <p style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(24px,2.5vw,36px);line-height:1.4;
      color:${tokens.colors.text};margin:0;font-weight:400
    ">${escapeHtml(text)}</p>
  </div>
</section>`.trim()
}

