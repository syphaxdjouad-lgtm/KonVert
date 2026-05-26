import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

const DEFAULT_FAQ: Array<{ q: string; a: string }> = [
  { q: 'Combien de temps pour la livraison ?', a: '24 à 48h ouvrées en France.' },
  { q: 'Puis-je retourner le produit ?', a: 'Oui, sous 30 jours, retour gratuit.' },
]

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderFaq(data: V3PageData, tokens: StyleTokens): string {
  const items = data.copy.faq ?? DEFAULT_FAQ

  const list = items
    .map(
      (f) => `
    <details style="border-bottom:1px solid ${tokens.colors.border};padding:24px 0">
      <summary style="cursor:pointer;font-family:${tokens.fonts.body};font-weight:600;color:${tokens.colors.text};font-size:17px;list-style:none;display:flex;justify-content:space-between;align-items:center">
        ${escapeHtml(f.q)}
        <span style="color:${tokens.colors.accent};font-size:24px;font-weight:300">+</span>
      </summary>
      <p style="margin:16px 0 0;color:${tokens.colors.textMuted};line-height:1.6">
        ${escapeHtml(f.a)}
      </p>
    </details>`,
    )
    .join('')

  return `
<section style="background:${tokens.colors.surface};padding:${tokens.spacing.section} 24px">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};margin:0 0 24px;font-weight:400">Questions fréquentes</h2>
    ${list}
  </div>
</section>`.trim()
}
