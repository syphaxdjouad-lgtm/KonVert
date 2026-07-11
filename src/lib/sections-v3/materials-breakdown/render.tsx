import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { buildImagePool, getImage } from '@/lib/images/pool'
import type { ImageSlot } from '@/lib/images/pool'
import { escapeHtml } from '@/lib/utils/html'

const CONFIDENCE_THRESHOLD = 0.6

function imageHintToSlot(hint: string | undefined): ImageSlot {
  // 'detail' maps directly, 'macro' has no Angle equivalent → fallback to 'any'
  if (hint === 'detail') return 'detail'
  return 'any'
}

export function renderMaterialsBreakdown(data: V3PageData, tokens: StyleTokens): string {
  const materials = (data.copy.materials ?? []).filter(
    (m) => m.confidence >= CONFIDENCE_THRESHOLD,
  )
  const pool = buildImagePool(data.images)

  const cards = materials
    .map((m, i) => {
      const slot = imageHintToSlot(m.imageHint)
      const img = getImage(pool, slot, i)
      const imgTag =
        img
          ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(m.name)}" style="width:100%;height:100%;object-fit:cover;display:block">`
          : ''

      return `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="aspect-ratio:1;background:${tokens.colors.surface};border-radius:${tokens.radius.image};overflow:hidden">
        ${imgTag}
      </div>
      <div>
        <span style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${tokens.colors.textMuted}">Matériau</span>
        <h3 style="font-family:${tokens.fonts.heading};font-size:20px;font-weight:400;color:${tokens.colors.text};margin:8px 0 6px">${escapeHtml(m.name)}</h3>
        <p style="color:${tokens.colors.textMuted};font-size:14px;line-height:1.6;margin:0">${escapeHtml(m.benefit)}</p>
      </div>
    </div>`
    })
    .join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:1240px;margin:0 auto">
    <h2 style="font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};margin:0 0 48px;text-align:center;font-weight:400">Les matériaux</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:${tokens.spacing.gap}">${cards}</div>
  </div>
</section>`.trim()
}
