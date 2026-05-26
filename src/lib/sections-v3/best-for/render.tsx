import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderBestFor(data: V3PageData, tokens: StyleTokens): string {
  const pills = (data.copy.best_for ?? []).map(p => `
    <li style="
      padding:10px 20px;border:1px solid ${tokens.colors.border};
      border-radius:${tokens.radius.button};
      color:${tokens.colors.text};font-size:14px;font-weight:500
    ">${escapeHtml(p)}</li>`).join('')

  return `
<section style="background:${tokens.colors.surface};padding:80px 24px">
  <div style="max-width:1080px;margin:0 auto;text-align:center">
    <span style="
      font-size:12px;letter-spacing:0.15em;text-transform:uppercase;
      color:${tokens.colors.textMuted};display:block;margin-bottom:16px
    ">Idéal pour</span>
    <ul style="
      list-style:none;padding:0;margin:0;
      display:flex;flex-wrap:wrap;gap:12px;justify-content:center
    ">${pills}</ul>
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
