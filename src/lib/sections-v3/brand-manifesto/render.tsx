import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { buildImagePool, getImage } from '@/lib/images/pool'
import { escapeHtml, escapeAttr } from '@/lib/utils/html'

export function renderBrandManifesto(data: V3PageData, tokens: StyleTokens): string {
  const m = data.copy.manifesto ?? {
    headline: 'Conçu pour durer',
    pillars: ['Qualité', 'Éthique', 'Transparence'],
  }

  const pool = buildImagePool(data.images)
  const lifestyle = getImage(pool, 'lifestyle', 0)

  const pillars = m.pillars
    .map(
      (p) => `
    <li style="font-family:${tokens.fonts.heading};font-size:18px;
               color:${tokens.colors.text};padding:8px 0;font-weight:400">
      <span style="color:${tokens.colors.accent};margin-right:12px">·</span>${escapeHtml(p)}
    </li>`,
    )
    .join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="
    max-width:1240px;margin:0 auto;
    display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center
  ">
    <div>
      ${lifestyle ? `<img src="${escapeAttr(lifestyle)}" alt=""
        style="width:100%;border-radius:${tokens.radius.image};aspect-ratio:4/5;object-fit:cover">` : ''}
    </div>
    <div>
      <h2 style="
        font-family:${tokens.fonts.heading};font-size:clamp(36px,4vw,56px);
        color:${tokens.colors.text};margin:0 0 24px;font-weight:400;line-height:1.1
      ">${escapeHtml(m.headline)}</h2>
      <ul style="list-style:none;padding:0;margin:0">${pillars}</ul>
      <button style="
        margin-top:40px;background:${tokens.colors.text};color:${tokens.colors.surface};
        padding:16px 32px;border:0;border-radius:${tokens.radius.button};
        font-family:${tokens.fonts.body};font-size:15px;cursor:pointer
      ">Découvrir l'histoire</button>
    </div>
  </div>
</section>`.trim()
}
