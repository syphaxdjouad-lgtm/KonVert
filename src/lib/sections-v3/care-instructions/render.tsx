import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml } from '@/lib/utils/html'
import { t } from '@/lib/i18n/ui-labels'
import { resolveLanguage } from '@/lib/i18n/languages'

export function renderCareInstructions(data: V3PageData, tokens: StyleTokens): string {
  const lang = resolveLanguage(data.language)
  const care = data.copy.care ?? t(lang, 'care.defaultText')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:880px;margin:0 auto">
    <div style="
      display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
      gap:${tokens.spacing.gap};
    ">
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">${escapeHtml(t(lang, 'care.title'))}</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          ${escapeHtml(care)}
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">${escapeHtml(t(lang, 'care.shippingTitle'))}</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          ${escapeHtml(t(lang, 'care.shippingText'))}
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">${escapeHtml(t(lang, 'care.returnsTitle'))}</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          ${escapeHtml(t(lang, 'care.returnsText'))}
        </p>
      </div>
    </div>
  </div>
</section>`.trim()
}

