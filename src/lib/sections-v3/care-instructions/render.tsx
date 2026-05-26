import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderCareInstructions(data: V3PageData, tokens: StyleTokens): string {
  const care = data.copy.care ?? 'Pour conserver toute sa qualité, suis simplement les indications fournies avec le produit.'

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
        ">Entretien</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          ${escapeHtml(care)}
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">Livraison</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          Livraison gratuite à partir de 75€. Expédition sous 24-48h.
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">Retours</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          30 jours pour changer d'avis. Retour gratuit, remboursement sous 5 jours.
        </p>
      </div>
    </div>
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
