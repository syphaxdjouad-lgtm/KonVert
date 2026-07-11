import type { V3PageData, V3Review } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml, escapeAttr } from '@/lib/utils/html'

// Tokens sémantiques Sprint 1 — fallbacks identiques aux valeurs design system
const CRO_DEFAULTS = {
  star:    '#F59E0B',
  success: '#16A34A',
  bgAlt:   '#F5F5F3',
} as const

// Couleurs de gradient avatar — cycle sur la liste pour chaque auteur
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#30cfd0 0%,#330867 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
  'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
] as const

function avatarGradient(index: number): string {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] as string
}

/**
 * Génère les étoiles HTML pour un rating donné.
 * Les étoiles non-remplies reçoivent la couleur border (discret, pas de rouge).
 */
function renderStars(rating: 1 | 2 | 3 | 4 | 5, starColor: string, borderColor: string): string {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < rating ? starColor : borderColor}">★</span>`
  ).join('')
}

/**
 * Calcule la distribution des étoiles à partir d'un tableau de reviews.
 * Retourne un tableau de 5 → 1 avec { stars, pct }.
 */
function buildDistribution(reviews: V3Review[]): Array<{ stars: number; pct: number }> {
  const counts = [0, 0, 0, 0, 0]
  for (const r of reviews) {
    counts[r.rating - 1] = (counts[r.rating - 1] ?? 0) + 1
  }
  const total = reviews.length || 1
  return [5, 4, 3, 2, 1].map(stars => ({
    stars,
    pct: Math.round(((counts[stars - 1] ?? 0) / total) * 100),
  }))
}

/**
 * Calcule la note moyenne arrondie à 1 décimale.
 */
function avgRating(reviews: V3Review[]): string {
  if (reviews.length === 0) return '5.0'
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

function renderReviewCard(review: V3Review, index: number, tokens: StyleTokens): string {
  const starColor = tokens.colors.star    ?? CRO_DEFAULTS.star
  const successColor = tokens.colors.success ?? CRO_DEFAULTS.success
  const gradient = avatarGradient(index)
  const starsHtml = renderStars(review.rating, starColor, tokens.colors.border)

  // Icône check inline — pas de lib externe
  const checkIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${successColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`

  const verifiedBadge = review.verified
    ? `<span style="display:flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:${successColor}">
        ${checkIcon} Achat vérifié
       </span>`
    : ''

  const variantTag = review.variant
    ? `<span style="font-size:11px;color:${tokens.colors.textMuted};background:${tokens.colors.bg};padding:3px 8px;border-radius:4px;border:1px solid ${tokens.colors.border};white-space:nowrap">${escapeHtml(review.variant)}</span>`
    : ''

  // Photo UGC — affichée en haut de la card quand photo_url est fourni.
  // Ratio 4:3, object-fit:cover pour cohérence visuelle entre les cards.
  const photoHtml = review.photo_url
    ? `<div style="aspect-ratio:4/3;overflow:hidden">
        <img src="${escapeAttr(review.photo_url)}"
             alt="Photo de ${escapeHtml(review.author)}"
             style="width:100%;height:100%;object-fit:cover;display:block"
             loading="lazy">
       </div>`
    : ''

  return `
<article class="kvt-review-card" style="
  background:${tokens.colors.surface};
  border-radius:${tokens.radius.card};
  overflow:hidden;
  box-shadow:${tokens.shadows.card};
  border:1px solid ${tokens.colors.border};
  display:flex;flex-direction:column;
  transition:box-shadow ${tokens.motion.durationShort ?? '120ms'} ${tokens.motion.ease},
             transform ${tokens.motion.durationShort ?? '120ms'} ${tokens.motion.ease};
" onmouseenter="this.style.boxShadow='${tokens.shadows.hover}';this.style.transform='translateY(-2px)'"
   onmouseleave="this.style.boxShadow='${tokens.shadows.card}';this.style.transform='translateY(0)'">
  ${photoHtml}
  <div style="padding:${review.photo_url ? '16px' : '20px'};flex:1;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span style="font-size:14px;letter-spacing:1px;line-height:1">${starsHtml}</span>
      ${verifiedBadge}
    </div>
    <p style="font-size:14px;font-weight:700;color:${tokens.colors.text};margin:0 0 6px;line-height:1.3">${escapeHtml(review.title)}</p>
    <p style="font-size:13px;color:${tokens.colors.textMuted};line-height:1.55;flex:1;margin:0">${escapeHtml(review.text)}</p>
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${tokens.colors.border};display:flex;align-items:center;justify-content:space-between;gap:8px">
      <div style="display:flex;align-items:center;gap:8px;min-width:0">
        <div aria-hidden="true" style="
          width:28px;height:28px;border-radius:50%;flex-shrink:0;
          background:${gradient};
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;color:#fff
        ">${escapeHtml(review.initials)}</div>
        <div style="min-width:0">
          <div style="font-size:13px;font-weight:600;color:${tokens.colors.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(review.author)}</div>
          <div style="font-size:11px;color:${tokens.colors.textMuted}">${escapeHtml(review.date)}</div>
        </div>
      </div>
      ${variantTag}
    </div>
  </div>
</article>`.trim()
}

export function renderReviews(data: V3PageData, tokens: StyleTokens): string {
  const reviews = data.copy.reviews
  // Sprint 4 T6 — seuil relevé de 3 à 5 (aligné avec display-rules.ts).
  // 5 reviews = 2 rangées complètes mobile → crédibilité visuelle suffisante.
  if (!reviews || reviews.length < 5) return ''

  const starColor    = tokens.colors.star    ?? CRO_DEFAULTS.star
  const bgAlt        = tokens.colors.bgAlt   ?? CRO_DEFAULTS.bgAlt
  const avg          = avgRating(reviews)
  const count        = reviews.length
  const distribution = buildDistribution(reviews)
  const sectionPad   = tokens.spacing.sectionMobile ?? '64px'

  // Rangée de 5 étoiles pleines pour la summary bar (toutes remplies, affichage global)
  const fullStars = Array.from({ length: 5 }, () =>
    `<span style="color:${starColor}">★</span>`
  ).join('')

  // Barres de distribution
  const distBars = distribution.map(({ stars, pct }) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:600;color:${tokens.colors.textMuted};width:12px;text-align:right;flex-shrink:0">${stars}</span>
      <div style="flex:1;height:6px;background:${tokens.colors.border};border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${starColor};border-radius:3px"></div>
      </div>
      <span style="font-size:11px;color:${tokens.colors.textMuted};width:28px;text-align:right;flex-shrink:0">${pct}%</span>
    </div>`).join('')

  // Filtres chips — visuels uniquement (MVP, pas de JS filter)
  const filterChips = ['Tous', 'Avec photos', '5 étoiles', 'Vérifiés']
    .map((label, i) => `
      <span style="
        display:inline-flex;align-items:center;
        padding:7px 16px;
        border:1px solid ${i === 0 ? tokens.colors.text : tokens.colors.border};
        border-radius:99px;
        font-size:13px;font-weight:500;
        color:${i === 0 ? tokens.colors.surface : tokens.colors.textMuted};
        background:${i === 0 ? tokens.colors.text : tokens.colors.surface};
        cursor:default;
        font-family:${tokens.fonts.body};
      ">${label}</span>`).join('')

  // Grid des cards
  const cardsHtml = reviews
    .map((r, i) => renderReviewCard(r, i, tokens))
    .join('\n')

  return `
<section class="kvt-reviews" style="
  background:${bgAlt};
  padding:${sectionPad} 24px;
  font-family:${tokens.fonts.body};
">
  <div style="max-width:1240px;margin:0 auto">

    <!-- Section header -->
    <p style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.colors.textMuted};margin:0 0 12px">Avis clients</p>
    <h2 style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3.5vw,40px);
      font-weight:400;letter-spacing:-0.02em;
      color:${tokens.colors.text};
      margin:0 0 40px;line-height:1.1
    ">Ce qu'ils en disent.</h2>

    <!-- Summary bar -->
    <div style="
      display:flex;flex-wrap:wrap;align-items:flex-start;
      gap:24px 40px;
      padding-bottom:32px;
      border-bottom:1px solid ${tokens.colors.border};
      margin-bottom:32px;
    ">
      <!-- Score global -->
      <div style="text-align:center;flex-shrink:0">
        <div style="
          font-family:${tokens.fonts.heading};
          font-size:clamp(44px,6vw,56px);
          font-weight:700;letter-spacing:-0.04em;
          color:${tokens.colors.text};line-height:1
        ">${avg.replace('.', ',')}</div>
        <div style="font-size:20px;letter-spacing:2px;margin:6px 0 4px">${fullStars}</div>
        <div style="font-size:13px;color:${tokens.colors.textMuted}">${count} avis vérifiés</div>
      </div>

      <!-- Distribution barres -->
      <div style="flex:1;min-width:180px;max-width:280px">
        ${distBars}
      </div>

      <!-- Filtres chips -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        ${filterChips}
      </div>
    </div>

    <!-- Grid des reviews -->
    <div class="kvt-reviews__grid" style="
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
      gap:${tokens.spacing.gap};
    ">
      ${cardsHtml}
    </div>

  </div>
</section>`.trim()
}

