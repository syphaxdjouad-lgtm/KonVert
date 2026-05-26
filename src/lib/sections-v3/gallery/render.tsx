import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderGallery(data: V3PageData, tokens: StyleTokens): string {
  if (data.images.length === 0) {
    return `<section class="v3-gallery" style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 0;"></section>`
  }

  const slides = data.images
    .map(
      (src, i) => `
    <div class="v3-gallery__slide" style="
      flex:0 0 auto;width:min(420px,70vw);
      border-radius:${tokens.radius.image};
      overflow:hidden;
      scroll-snap-align:start;
      box-shadow:${tokens.shadows.card};
    ">
      <img
        src="${src}"
        alt="${escapeHtml(data.product.title)} - vue ${i + 1}"
        style="width:100%;height:auto;display:block"
        loading="lazy"
      >
    </div>`,
    )
    .join('')

  return `
<section class="v3-gallery" style="
  background:${tokens.colors.bg};
  padding:${tokens.spacing.section} 0;
  font-family:${tokens.fonts.body};
">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px 32px">
    <h2 style="
      font-family:${tokens.fonts.heading};
      color:${tokens.colors.text};
      font-size:clamp(28px,3vw,40px);
      font-weight:400;
      margin:0;
    ">Tous les angles</h2>
  </div>
  <div class="v3-gallery__track" style="
    display:flex;
    gap:${tokens.spacing.gap};
    overflow-x:auto;
    scroll-snap-type:x mandatory;
    padding:0 24px 24px;
    scrollbar-width:none;
    -ms-overflow-style:none;
  ">
    ${slides}
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
