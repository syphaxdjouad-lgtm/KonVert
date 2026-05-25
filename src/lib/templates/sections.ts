// Fragments HTML réutilisables pour les sections enrichies générées par
// DeepSeek (story, testimonials, comparison, social_proof, guarantee, bonuses).
// Chaque renderer retourne une string HTML prête à être injectée dans un
// template, ou '' si la donnée n'est pas dispo (no-op).
//
// Style configurable via `theme` pour s'adapter à chaque template (Blue,
// Noir, Rose, etc.). Les couleurs sont CSS-friendly.

import type { LandingPageData } from '@/types'

// ─── Section keys & ordre canonique ──────────────────────────────────────────
// Liste exhaustive des sections rendues par renderRichSections, dans l'ordre
// psychologique e-com DTC validé en brainstorming (spec § 3.2).
// `hero_badges` n'est PAS dans cette liste — il reste dans le hero du template.

export type SectionKey =
  | 'social_proof_bar'
  | 'story'
  | 'target_audience'
  | 'features'
  | 'gallery'
  | 'unique_mechanism'
  | 'how_it_works'
  | 'before_after'
  | 'comparison'
  | 'competitor_comparison'
  | 'testimonials'
  | 'press_mentions'
  | 'founder_note'
  | 'value_stack'
  | 'bonuses'
  | 'guarantee'
  | 'risk_reversal'
  | 'objections'
  | 'community_callout'
  | 'final_pitch'

export const DEFAULT_ORDER: SectionKey[] = [
  'social_proof_bar',
  'story',
  'target_audience',
  'features',
  'gallery',
  'unique_mechanism',
  'how_it_works',
  'before_after',
  'comparison',
  'competitor_comparison',
  'testimonials',
  'press_mentions',
  'founder_note',
  'value_stack',
  'bonuses',
  'guarantee',
  'risk_reversal',
  'objections',
  'community_callout',
  'final_pitch',
]

export interface SectionTheme {
  primary: string         // #0055D4 (Blue), #000 (Noir)…
  accent: string          // #EEF3FF (Blue light), #1a1a1a (Noir card)…
  text: string            // #1D1D1F
  textMuted: string       // #6E6E73
  bg: string              // #fff
  bgAlt: string           // #F5F5F7
  border: string          // #E8E8ED
  fontFamily: string      // 'Inter', 'Playfair Display'…
  radius: string          // '12px', '0' selon le template
}

export const DEFAULT_THEME: SectionTheme = {
  primary: '#0055D4',
  accent: '#EEF3FF',
  text: '#1D1D1F',
  textMuted: '#6E6E73',
  bg: '#fff',
  bgAlt: '#F5F5F7',
  border: '#E8E8ED',
  fontFamily: 'Inter,sans-serif',
  radius: '16px',
}

// ═══════════════════════════════════════════════════════════════════════════
// V2 PREMIUM SECTIONS (OBITO design 2026-05-23) + 13 nouvelles sections
// ═══════════════════════════════════════════════════════════════════════════

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Génère le bloc <style> responsive injecté une seule fois par section. */
function mq(sectionId: string, rules: string): string {
  return `<style>@media(max-width:768px){${rules.replace(/SECTION/g, sectionId)}}</style>`
}

/** Étoiles SVG inline (au lieu d'emoji ★) pour un rendu typographique propre. */
function starsSvg(rating: number, color: string): string {
  const n = Math.min(5, Math.max(0, Math.round(rating)))
  return Array.from({ length: 5 }, (_, i) => {
    const filled = i < n
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="${filled ? color : 'none'}" stroke="${color}" stroke-width="1.5" style="display:inline-block;vertical-align:middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }).join('')
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SOCIAL PROOF BAR V2 — bandeau horizontal 3 chiffres clés
// ─────────────────────────────────────────────────────────────────────────────
export function renderSocialProofBarV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.social_proof) return ''
  const sp = d.social_proof
  if (!sp.customers && !sp.rating && !sp.sold) return ''

  const items: { label: string; value: string; icon: string }[] = []
  if (sp.customers) items.push({ label: 'Clients satisfaits', value: sp.customers, icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` })
  if (sp.rating)    items.push({ label: 'Note moyenne', value: sp.rating, icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` })
  if (sp.sold)      items.push({ label: 'Vendus ce mois', value: sp.sold, icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>` })

  const cols = items.map((it, i) => `
    <div style="flex:1;min-width:160px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 20px;${i < items.length - 1 ? `border-right:1px solid ${t.border};` : ''}">
      <div style="width:48px;height:48px;border-radius:50%;background:${t.accent};display:flex;align-items:center;justify-content:center;color:${t.primary};">
        ${it.icon}
      </div>
      <p style="font-size:30px;font-weight:800;color:${t.text};letter-spacing:-0.03em;line-height:1;margin:0;">${it.value}</p>
      <p style="font-size:11px;font-weight:700;color:${t.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin:0;text-align:center;">${it.label}</p>
    </div>`).join('')

  return `
${mq('spb', `.spb-inner{flex-direction:column!important;} .spb-item{border-right:none!important;border-bottom:1px solid ${t.border};}`)}
<section style="background:${t.bg};font-family:${t.fontFamily};border-top:1px solid ${t.border};border-bottom:1px solid ${t.border};">
  <div class="spb-inner" style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;">
    ${cols}
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. STORY V2 — timeline verticale PAS (SVG — zéro emoji icône principale)
// ─────────────────────────────────────────────────────────────────────────────
export function renderStoryV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.story) return ''
  const s = d.story
  if (!s.problem && !s.agitation && !s.solution && !s.transformation) return ''

  // SVG inline 24×24 pour chaque étape — stroke uniquement, zéro emoji
  const steps = [
    {
      key: s.problem,
      label: 'Le problème',
      labelColor: '#B91C1C',
      bg: '#FEF2F2',
      stroke: '#B91C1C',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    },
    {
      key: s.agitation,
      label: 'Ce que ça coûte',
      labelColor: '#B45309',
      bg: '#FFFBEB',
      stroke: '#B45309',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    },
    {
      key: s.solution,
      label: 'Notre solution',
      labelColor: t.primary,
      bg: t.accent,
      stroke: t.primary,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    },
    {
      key: s.transformation,
      label: 'Le résultat',
      labelColor: '#065F46',
      bg: '#ECFDF5',
      stroke: '#065F46',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    },
  ].filter(st => Boolean(st.key))

  const title = d.product_name ? `Pourquoi nous avons créé ${d.product_name}` : "L'histoire derrière le produit"

  const timeline = steps.map((st, i) => {
    const isLast = i === steps.length - 1
    return `
    <div style="display:flex;gap:24px;align-items:flex-start;position:relative;">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
        <div style="width:48px;height:48px;border-radius:50%;background:${st.bg};display:flex;align-items:center;justify-content:center;border:2px solid ${st.stroke}20;">
          ${st.icon}
        </div>
        ${!isLast ? `<div style="width:2px;flex:1;min-height:32px;background:linear-gradient(to bottom,${st.bg},${t.border});margin-top:4px;"></div>` : ''}
      </div>
      <div style="flex:1;padding-bottom:${isLast ? '0' : '36px'};">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:${st.labelColor};text-transform:uppercase;margin:0 0 6px 0;">${st.label}</p>
        <p style="font-size:17px;color:${t.text};line-height:1.65;margin:0;">${st.key}</p>
      </div>
    </div>`
  }).join('')

  return `
${mq('stv2', `.stv2-wrap{padding:60px 20px!important;}`)}
<section class="stv2-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:760px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:12px;">L'histoire</p>
    <h2 style="font-size:34px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:52px;line-height:1.15;">${title}</h2>
    <div style="display:flex;flex-direction:column;">
      ${timeline}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTIMONIALS V2 — grid 3 cards reviews avec étoiles SVG
// ─────────────────────────────────────────────────────────────────────────────
export function renderTestimonialsV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.testimonials || d.testimonials.length === 0) return ''

  const cards = d.testimonials.slice(0, 6).map(tm => {
    const initial = (tm.name?.[0] ?? 'A').toUpperCase()
    const stars = starsSvg(tm.rating ?? 5, '#F5A623')
    const checkIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    return `
    <div style="background:${t.bg};border-radius:${t.radius};padding:28px 26px;border:1px solid ${t.border};display:flex;flex-direction:column;gap:16px;box-shadow:0 1px 4px rgba(0,0,0,.05);">
      <div style="display:flex;gap:4px;">${stars}</div>
      <p style="font-size:15px;color:${t.text};line-height:1.7;margin:0;flex:1;">"${tm.text}"</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${t.accent};color:${t.primary};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;flex-shrink:0;">${initial}</div>
          <div>
            <p style="font-size:14px;font-weight:700;color:${t.text};margin:0;">${tm.name ?? 'Client vérifié'}</p>
            <p style="font-size:12px;color:${t.textMuted};margin:0;">${tm.variant ?? (tm.location ?? '')}</p>
          </div>
        </div>
        <div style="display:inline-flex;align-items:center;gap:5px;background:${t.accent};padding:4px 10px;border-radius:100px;flex-shrink:0;">
          ${checkIcon}
          <span style="font-size:11px;color:${t.primary};font-weight:700;white-space:nowrap;">Achat vérifié</span>
        </div>
      </div>
    </div>`
  }).join('')

  return `
${mq('tmv2', `.tmv2-grid{grid-template-columns:1fr!important;} .tmv2-wrap{padding:60px 20px!important;}`)}
<section class="tmv2-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Ils ont fait le choix.</h2>
    <div class="tmv2-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
      ${cards}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPARISON V2 — 2 colonnes sans/avec (rouge/vert hardcodés — autorisé)
// ─────────────────────────────────────────────────────────────────────────────
export function renderComparisonV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.comparison) return ''
  const c = d.comparison
  if (!c.without?.length && !c.with?.length) return ''

  const crossIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`

  const withoutItems = (c.without ?? []).map(item =>
    `<li style="display:flex;gap:10px;font-size:15px;color:#7F1D1D;line-height:1.55;align-items:flex-start;"><span style="flex-shrink:0;margin-top:2px;">${crossIcon}</span><span>${item}</span></li>`
  ).join('')

  const withItems = (c.with ?? []).map(item =>
    `<li style="display:flex;gap:10px;font-size:15px;color:#064E3B;line-height:1.55;align-items:flex-start;"><span style="flex-shrink:0;margin-top:2px;">${checkIcon}</span><span>${item}</span></li>`
  ).join('')

  return `
${mq('cpv2', `.cpv2-grid{grid-template-columns:1fr!important;} .cpv2-wrap{padding:60px 20px!important;}`)}
<section class="cpv2-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">La différence</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">${d.product_name ? `${d.product_name} change la donne` : 'Avec ou sans ?'}</h2>
    <div class="cpv2-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div style="background:#FEF2F2;border:2px solid #FECACA;border-radius:${t.radius};padding:28px 24px;">
        <p style="font-size:12px;font-weight:800;color:#DC2626;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">${c.without_title ?? 'Sans'}</p>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">${withoutItems}</ul>
      </div>
      <div style="background:#F0FDF4;border:2px solid #BBF7D0;border-radius:${t.radius};padding:28px 24px;">
        <p style="font-size:12px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">${c.with_title ?? 'Avec'}</p>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">${withItems}</ul>
      </div>
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BONUSES V2 — cards empilées avec ribbon "OFFERT" + numéro SVG
// ─────────────────────────────────────────────────────────────────────────────
export function renderBonusesV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.bonuses || d.bonuses.length === 0) return ''

  const giftIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`

  const cards = d.bonuses.map((b, i) => `
    <div style="background:${t.bg};border:1px solid ${t.border};border-radius:${t.radius};padding:24px 28px;display:flex;gap:20px;align-items:center;position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);">
      <div style="flex-shrink:0;width:52px;height:52px;border-radius:14px;background:${t.accent};color:${t.primary};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;letter-spacing:-0.02em;">${String(i + 1).padStart(2, '0')}</div>
      <div style="flex:1;min-width:0;">
        <p style="font-size:17px;font-weight:800;color:${t.text};margin:0 0 4px 0;">${b.title ?? 'Bonus'}</p>
        <p style="font-size:14px;color:${t.textMuted};line-height:1.55;margin:0;">${b.description ?? ''}</p>
      </div>
      <div style="flex-shrink:0;text-align:right;">
        ${b.value ? `<p style="font-size:14px;font-weight:600;color:${t.textMuted};margin:0 0 2px 0;text-decoration:line-through;">${b.value}</p>` : ''}
        <div style="display:inline-flex;align-items:center;gap:5px;background:#ECFDF5;border:1px solid #6EE7B7;border-radius:6px;padding:4px 10px;">
          ${giftIcon}
          <span style="font-size:11px;font-weight:800;color:#059669;letter-spacing:0.06em;">OFFERT</span>
        </div>
      </div>
    </div>`).join('')

  return `
${mq('bnv2', `.bnv2-wrap{padding:60px 20px!important;}`)}
<section class="bnv2-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:880px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Bonus exclusifs</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:12px;">Inclus dans votre commande</h2>
    <p style="font-size:15px;color:${t.textMuted};text-align:center;margin-bottom:44px;">Valeur additionnelle offerte — disponible uniquement aujourd'hui.</p>
    <div style="display:flex;flex-direction:column;gap:14px;">${cards}</div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GUARANTEE V2 — section centrale, shield SVG premium
// ─────────────────────────────────────────────────────────────────────────────
export function renderGuaranteeV2(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.guarantee) return ''
  const g = d.guarantee

  const shieldIcon = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`

  return `
${mq('grv2', `.grv2-wrap{padding:60px 20px!important;}`)}
<section class="grv2-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:640px;margin:0 auto;text-align:center;">
    <div style="width:96px;height:96px;border-radius:50%;background:${t.accent};display:flex;align-items:center;justify-content:center;margin:0 auto 28px;border:2px solid ${t.border};">
      ${shieldIcon}
    </div>
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-transform:uppercase;margin-bottom:8px;">Sans risque</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};letter-spacing:-0.03em;margin-bottom:16px;line-height:1.2;">${g.title ?? 'Satisfait ou remboursé'}</h2>
    ${g.duration ? `<div style="display:inline-block;background:${t.primary};color:#fff;padding:6px 20px;border-radius:100px;font-size:13px;font-weight:800;letter-spacing:0.06em;margin-bottom:24px;">${g.duration.toUpperCase()}</div>` : ''}
    <p style="font-size:17px;color:${t.text};line-height:1.7;">${g.description ?? ''}</p>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TARGET AUDIENCE — grid 3 cards profils ICP
// ─────────────────────────────────────────────────────────────────────────────
export function renderTargetAudience(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.target_audience || d.target_audience.length === 0) return ''

  const personIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

  const cards = d.target_audience.slice(0, 6).map(ta => `
    <div style="background:${t.bg};border:1px solid ${t.border};border-radius:${t.radius};padding:28px 24px;display:flex;flex-direction:column;gap:16px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
      <div style="width:48px;height:48px;border-radius:50%;background:${t.accent};display:flex;align-items:center;justify-content:center;">
        ${personIcon}
      </div>
      <div>
        <p style="font-size:16px;font-weight:800;color:${t.text};margin:0 0 10px 0;line-height:1.3;">${ta.profile}</p>
        <p style="font-size:14px;color:${t.textMuted};line-height:1.6;margin:0;">${ta.pain}</p>
      </div>
      <div style="display:inline-flex;align-items:center;gap:6px;background:${t.accent};padding:5px 12px;border-radius:100px;width:fit-content;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span style="font-size:11px;font-weight:700;color:${t.primary};letter-spacing:0.04em;">Ce produit est fait pour toi</span>
      </div>
    </div>`).join('')

  return `
${mq('tau', `.tau-grid{grid-template-columns:1fr!important;} .tau-wrap{padding:60px 20px!important;}`)}
<section class="tau-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Pour qui ?</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Ce produit a été pensé pour vous</h2>
    <div class="tau-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      ${cards}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. FEATURES — grid 3×2 features avec icônes (emoji → badge, SVG générique si nom d'icône)
// ─────────────────────────────────────────────────────────────────────────────
export function renderFeatures(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.features || d.features.length === 0) return ''

  // Si feature.icon ressemble à un emoji, on le place dans un badge secondaire.
  // Sinon on affiche un SVG générique "star/check". Pattern compatible LLM qui envoie des emojis.
  function featureIcon(icon: string): string {
    const isEmoji = /\p{Emoji}/u.test(icon) && icon.length <= 4
    if (isEmoji) {
      return `<span style="font-size:22px;line-height:1;" aria-hidden="true">${icon}</span>`
    }
    // Icône texte/nom : SVG générique check-circle
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
  }

  const cards = d.features.slice(0, 6).map(f => `
    <div style="background:${t.bg};border:1px solid ${t.border};border-radius:${t.radius};padding:28px 24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
      <div style="width:52px;height:52px;border-radius:14px;background:${t.accent};display:flex;align-items:center;justify-content:center;">
        ${featureIcon(f.icon ?? '')}
      </div>
      <div>
        <p style="font-size:16px;font-weight:800;color:${t.text};margin:0 0 8px 0;">${f.title}</p>
        <p style="font-size:14px;color:${t.textMuted};line-height:1.6;margin:0;">${f.description}</p>
      </div>
    </div>`).join('')

  return `
${mq('fts', `.fts-grid{grid-template-columns:1fr!important;} .fts-wrap{padding:60px 20px!important;}`)}
<section class="fts-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Caractéristiques</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Conçu dans les moindres détails</h2>
    <div class="fts-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      ${cards}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. UNIQUE MECHANISM — split asymétrique texte + panneau preuve visuelle
// ─────────────────────────────────────────────────────────────────────────────
export function renderUniqueMechanism(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.unique_mechanism) return ''
  const um = d.unique_mechanism
  if (!um.name && !um.description) return ''

  const dnaIcon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M10 2C9.229 4.548 9.366 6.936 10 9"/><path d="M2 9c6.667 6 13.333 0 20 6"/></svg>`
  const sparkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`

  return `
${mq('umch', `.umch-grid{flex-direction:column!important;} .umch-proof{margin-top:24px!important;} .umch-wrap{padding:60px 20px!important;}`)}
<section class="umch-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Technologie exclusive</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:52px;line-height:1.2;">Ce qui nous rend différents</h2>
    <div class="umch-grid" style="display:flex;gap:48px;align-items:center;">
      <div style="flex:1;min-width:0;">
        <div style="display:inline-flex;align-items:center;gap:10px;background:${t.accent};padding:10px 18px;border-radius:100px;margin-bottom:24px;">
          ${sparkIcon}
          <span style="font-size:12px;font-weight:800;color:${t.primary};letter-spacing:0.08em;text-transform:uppercase;">${um.name}</span>
        </div>
        <p style="font-size:18px;color:${t.text};line-height:1.7;margin:0;">${um.description}</p>
      </div>
      ${um.proof ? `
      <div class="umch-proof" style="flex:0 0 380px;background:${t.bgAlt};border:1px solid ${t.border};border-radius:${t.radius};padding:32px;display:flex;flex-direction:column;gap:16px;border-left:4px solid ${t.primary};">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
          ${dnaIcon}
          <p style="font-size:12px;font-weight:700;color:${t.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin:0;">Preuve</p>
        </div>
        <p style="font-size:15px;color:${t.text};line-height:1.65;margin:0;">${um.proof}</p>
      </div>` : ''}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. HOW IT WORKS — timeline horizontale numérotée 4 étapes
// ─────────────────────────────────────────────────────────────────────────────
export function renderHowItWorks(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.how_it_works || d.how_it_works.length === 0) return ''

  const steps = d.how_it_works.slice(0, 6)

  const stepCards = steps.map((s, i) => {
    const isLast = i === steps.length - 1
    return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;flex:1;min-width:180px;position:relative;">
      <div style="width:56px;height:56px;border-radius:50%;background:${t.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;flex-shrink:0;z-index:1;">${String(i + 1).padStart(2, '0')}</div>
      ${!isLast ? `<div class="hiw-arrow" style="position:absolute;top:28px;left:calc(50% + 28px);right:calc(-50% + 28px);height:2px;background:linear-gradient(to right,${t.primary}40,${t.primary}10);display:block;"></div>` : ''}
      <div>
        <p style="font-size:15px;font-weight:800;color:${t.text};margin:0 0 8px 0;">${s.title}</p>
        <p style="font-size:13px;color:${t.textMuted};line-height:1.6;margin:0;">${s.description}</p>
      </div>
    </div>`
  }).join('')

  return `
${mq('hiw', `.hiw-grid{flex-direction:column!important;gap:32px!important;} .hiw-arrow{display:none!important;} .hiw-wrap{padding:60px 20px!important;}`)}
<section class="hiw-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">En pratique</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:52px;line-height:1.2;">Comment ça marche</h2>
    <div class="hiw-grid" style="display:flex;gap:16px;align-items:flex-start;justify-content:center;">
      ${stepCards}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. BEFORE AFTER — 2 colonnes côte à côte, texte uniquement
// ─────────────────────────────────────────────────────────────────────────────
export function renderBeforeAfter(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.before_after || d.before_after.length === 0) return ''

  const arrowIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

  const rows = d.before_after.map(ba => `
    <div style="display:flex;gap:16px;align-items:center;">
      <div style="flex:1;background:#FEF2F2;border:1px solid #FECACA;border-radius:${t.radius};padding:18px 20px;">
        <p style="font-size:11px;font-weight:700;color:#B91C1C;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px 0;">Avant</p>
        <p style="font-size:14px;color:#7F1D1D;line-height:1.6;margin:0;">${ba.before}</p>
      </div>
      <div style="flex-shrink:0;">${arrowIcon}</div>
      <div style="flex:1;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:${t.radius};padding:18px 20px;">
        <p style="font-size:11px;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px 0;">Après</p>
        <p style="font-size:14px;color:#064E3B;line-height:1.6;margin:0;">${ba.after}</p>
      </div>
    </div>`).join('')

  return `
${mq('bafr', `.bafr-row{flex-direction:column!important;} .bafr-row>div:nth-child(2){transform:rotate(90deg);} .bafr-wrap{padding:60px 20px!important;}`)}
<section class="bafr-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:900px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Transformation</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Avant. Après.</h2>
    <div style="display:flex;flex-direction:column;gap:14px;">${rows}</div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. COMPETITOR COMPARISON — table scrollable (vert/rouge hardcodés — autorisé)
// ─────────────────────────────────────────────────────────────────────────────
export function renderCompetitorComparison(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.competitor_comparison) return ''
  const cc = d.competitor_comparison
  if (!cc.criteria?.length || !cc.us) return ''

  const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  const crossIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

  // Tous les compétiteurs à afficher (nous + eux)
  const allCols = [cc.us, ...(cc.them ?? [])]

  const headerCols = allCols.map((col, i) => {
    const isUs = i === 0
    return `<th style="padding:14px 18px;font-size:13px;font-weight:800;color:${isUs ? '#fff' : t.textMuted};background:${isUs ? t.primary : t.bgAlt};text-align:center;border-left:1px solid ${t.border};white-space:nowrap;">${col.name}</th>`
  }).join('')

  const bodyRows = cc.criteria.map((crit, ri) => {
    const cellBg = ri % 2 === 0 ? t.bg : t.bgAlt
    const cells = allCols.map((col, ci) => {
      const val = col.values?.[ri] ?? ''
      const isUs = ci === 0
      // Détecter vrai/faux : 'oui','yes','✓','true' → check ; 'non','no','✗','false' → cross
      const isTrue = /^(oui|yes|✓|true|1)$/i.test(val.trim())
      const isFalse = /^(non|no|✗|false|0)$/i.test(val.trim())
      const cellContent = isTrue
        ? `<span style="display:inline-flex;justify-content:center;">${checkIcon}</span>`
        : isFalse
          ? `<span style="display:inline-flex;justify-content:center;">${crossIcon}</span>`
          : `<span style="font-size:13px;color:${isUs ? t.text : t.textMuted};font-weight:${isUs ? '600' : '400'};">${val}</span>`
      return `<td style="padding:14px 18px;text-align:center;background:${isUs ? `${t.accent}` : cellBg};border-left:1px solid ${t.border};">${cellContent}</td>`
    }).join('')
    return `<tr><td style="padding:14px 18px;font-size:13px;font-weight:600;color:${t.text};background:${cellBg};white-space:nowrap;">${crit}</td>${cells}</tr>`
  }).join('')

  return `
${mq('cmpv', `.cmpv-wrap{padding:60px 20px!important;} .cmpv-scroll{overflow-x:auto!important;}`)}
<section class="cmpv-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Comparatif</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Pourquoi nous ?</h2>
    <div class="cmpv-scroll" style="overflow-x:auto;border-radius:${t.radius};border:1px solid ${t.border};box-shadow:0 1px 4px rgba(0,0,0,.06);">
      <table style="width:100%;border-collapse:collapse;min-width:500px;">
        <thead>
          <tr>
            <th style="padding:14px 18px;font-size:11px;font-weight:700;color:${t.textMuted};text-transform:uppercase;letter-spacing:0.08em;background:${t.bg};text-align:left;">Critère</th>
            ${headerCols}
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. PRESS MENTIONS — bandeau monochrome logos textuels
// ─────────────────────────────────────────────────────────────────────────────
export function renderPressMentions(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.press_mentions || d.press_mentions.length === 0) return ''

  const logos = d.press_mentions.slice(0, 8).map(name => `
    <div style="flex:0 0 auto;padding:12px 24px;border:1px solid ${t.border};border-radius:8px;background:${t.bg};">
      <span style="font-size:15px;font-weight:700;color:${t.textMuted};letter-spacing:-0.01em;white-space:nowrap;">${name}</span>
    </div>`).join('')

  return `
${mq('prss', `.prss-wrap{padding:40px 20px!important;} .prss-scroll{gap:10px!important;}`)}
<section class="prss-wrap" style="padding:52px 24px;background:${t.bgAlt};font-family:${t.fontFamily};border-top:1px solid ${t.border};border-bottom:1px solid ${t.border};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:28px;">Vu dans la presse</p>
    <div class="prss-scroll" style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;">
      ${logos}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. FOUNDER NOTE — split asymétrique avatar circulaire + citation
// Décision design : split 40/60 (avatar à gauche, message à droite) — plus
// intime que centré, signature humaine dans un univers marchand.
// ─────────────────────────────────────────────────────────────────────────────
export function renderFounderNote(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.founder_note) return ''
  const fn = d.founder_note
  if (!fn.message) return ''

  const initial = (fn.name?.[0] ?? 'F').toUpperCase()
  const quoteIcon = `<svg width="36" height="36" viewBox="0 0 24 24" fill="${t.accent}" stroke="${t.primary}" stroke-width="1" style="opacity:0.6;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`

  return `
${mq('fnd', `.fnd-grid{flex-direction:column!important;align-items:center!important;text-align:center!important;} .fnd-wrap{padding:60px 20px!important;}`)}
<section class="fnd-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:960px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Le mot du fondateur</p>
    <div class="fnd-grid" style="display:flex;gap:48px;align-items:center;margin-top:40px;">
      <div style="flex:0 0 180px;display:flex;flex-direction:column;align-items:center;gap:14px;">
        <div style="width:120px;height:120px;border-radius:50%;background:${t.accent};color:${t.primary};display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:800;border:3px solid ${t.border};">${initial}</div>
        <div style="text-align:center;">
          <p style="font-size:15px;font-weight:800;color:${t.text};margin:0 0 2px 0;">${fn.name ?? ''}</p>
          <p style="font-size:12px;color:${t.textMuted};margin:0;">${fn.role ?? ''}</p>
        </div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="margin-bottom:16px;">${quoteIcon}</div>
        <p style="font-size:18px;color:${t.text};line-height:1.75;margin:0;font-style:italic;">${fn.message}</p>
      </div>
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. VALUE STACK — table valeur barrée + prix final mis en évidence
// ─────────────────────────────────────────────────────────────────────────────
export function renderValueStack(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.value_stack) return ''
  const vs = d.value_stack
  if (!vs.items?.length) return ''

  const rows = vs.items.map(it => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid ${t.border};">
      <p style="font-size:15px;color:${t.text};margin:0;">${it.label}</p>
      <p style="font-size:15px;font-weight:700;color:${t.textMuted};margin:0;text-decoration:line-through;">${it.value}</p>
    </div>`).join('')

  return `
${mq('vls', `.vls-wrap{padding:60px 20px!important;} .vls-inner{padding:32px 24px!important;}`)}
<section class="vls-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:680px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Ce que vous obtenez</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:40px;line-height:1.2;">Tout ce qui est inclus</h2>
    <div class="vls-inner" style="background:${t.bg};border-radius:${t.radius};padding:36px 40px;border:1px solid ${t.border};box-shadow:0 2px 8px rgba(0,0,0,.07);">
      <div style="margin-bottom:8px;">${rows}</div>
      ${vs.total ? `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:2px solid ${t.border};">
        <p style="font-size:14px;font-weight:600;color:${t.textMuted};margin:0;">Valeur totale</p>
        <p style="font-size:18px;font-weight:700;color:${t.textMuted};margin:0;text-decoration:line-through;">${vs.total}</p>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 0 0 0;">
        <p style="font-size:16px;font-weight:800;color:${t.text};margin:0;">Vous payez aujourd'hui</p>
        <p style="font-size:28px;font-weight:800;color:${t.primary};margin:0;letter-spacing:-0.02em;">${vs.you_pay ?? ''}</p>
      </div>
      ${vs.savings ? `
      <div style="margin-top:14px;background:${t.accent};border-radius:8px;padding:10px 16px;text-align:center;">
        <p style="font-size:13px;font-weight:800;color:${t.primary};margin:0;letter-spacing:0.02em;">Vous économisez ${vs.savings}</p>
      </div>` : ''}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. RISK REVERSAL — grid 3 cards livraison / retour / support
// ─────────────────────────────────────────────────────────────────────────────
export function renderRiskReversal(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.risk_reversal || d.risk_reversal.length === 0) return ''

  // SVG fallback générique si icon est emoji ou texte non-SVG
  const rrIconSvgs: Record<string, string> = {
    truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    return: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>`,
    support: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    star: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${t.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  }

  function resolveIcon(icon: string): string {
    if (!icon) return rrIconSvgs.shield
    const lc = icon.toLowerCase()
    for (const [key, svg] of Object.entries(rrIconSvgs)) {
      if (lc.includes(key)) return svg
    }
    // Emoji → afficher dans un badge neutre
    const isEmoji = /\p{Emoji}/u.test(icon) && icon.length <= 4
    if (isEmoji) return `<span style="font-size:22px;" aria-hidden="true">${icon}</span>`
    return rrIconSvgs.shield
  }

  const cards = d.risk_reversal.slice(0, 4).map(item => `
    <div style="background:${t.bg};border:1px solid ${t.border};border-radius:${t.radius};padding:28px 24px;display:flex;flex-direction:column;gap:14px;align-items:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.05);">
      <div style="width:52px;height:52px;border-radius:50%;background:${t.accent};display:flex;align-items:center;justify-content:center;">
        ${resolveIcon(item.icon ?? '')}
      </div>
      <div>
        <p style="font-size:16px;font-weight:800;color:${t.text};margin:0 0 8px 0;">${item.title}</p>
        <p style="font-size:14px;color:${t.textMuted};line-height:1.6;margin:0;">${item.description}</p>
      </div>
    </div>`).join('')

  return `
${mq('rrv', `.rrv-grid{grid-template-columns:1fr!important;} .rrv-wrap{padding:60px 20px!important;}`)}
<section class="rrv-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Réassurance</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Achetez sans risque</h2>
    <div class="rrv-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
      ${cards}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. OBJECTIONS — accordéon inline JS (pattern FAQ etec-blue.ts)
// ─────────────────────────────────────────────────────────────────────────────
export function renderObjections(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.objections || d.objections.length === 0) return ''

  const items = d.objections.map((obj, i) => `
    <div style="border-bottom:1px solid ${t.border};overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('obj-${i}');var a=document.getElementById('arr-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'600px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(0deg)':'rotate(180deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;">
        <span style="font-family:${t.fontFamily};font-size:15px;font-weight:700;color:${t.text};line-height:1.4;">${obj.objection}</span>
        <svg id="arr-${i}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${t.textMuted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;transition:transform .3s;"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div id="obj-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:${t.fontFamily};font-size:15px;color:${t.textMuted};line-height:1.7;padding-bottom:20px;margin:0;">${obj.response}</p>
      </div>
    </div>`).join('')

  return `
${mq('obj', `.obj-wrap{padding:60px 20px!important;}`)}
<section class="obj-wrap" style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:760px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Vos questions</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.2;">Les vraies questions.</h2>
    <div style="border-top:1px solid ${t.border};">
      ${items}
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. COMMUNITY CALLOUT — banner CTA réseaux sociaux
// ─────────────────────────────────────────────────────────────────────────────
export function renderCommunityCallout(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.community_callout) return ''
  const cc = d.community_callout
  if (!cc.title && !cc.description) return ''

  // Icônes Instagram + TikTok SVG inline
  const igIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
  const tkIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`

  return `
${mq('comu', `.comu-inner{flex-direction:column!important;text-align:center!important;} .comu-icons{justify-content:center!important;} .comu-wrap{padding:60px 20px!important;}`)}
<section class="comu-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:900px;margin:0 auto;background:${t.accent};border-radius:${t.radius};padding:52px 48px;border:1px solid ${t.border};">
    <div class="comu-inner" style="display:flex;align-items:center;justify-content:space-between;gap:40px;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.primary};text-transform:uppercase;margin-bottom:10px;">Communauté</p>
        <h2 style="font-size:28px;font-weight:800;color:${t.text};letter-spacing:-0.03em;margin:0 0 12px 0;line-height:1.2;">${cc.title}</h2>
        <p style="font-size:15px;color:${t.textMuted};line-height:1.65;margin:0 0 20px 0;">${cc.description}</p>
        <div class="comu-icons" style="display:flex;gap:16px;align-items:center;">
          <span style="display:inline-flex;align-items:center;gap:8px;color:${t.primary};">${igIcon}<span style="font-size:13px;font-weight:600;">Instagram</span></span>
          <span style="display:inline-flex;align-items:center;gap:8px;color:${t.primary};">${tkIcon}<span style="font-size:13px;font-weight:600;">TikTok</span></span>
        </div>
      </div>
      <div style="flex-shrink:0;">
        <div style="background:${t.primary};color:#fff;padding:16px 32px;border-radius:100px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;">${cc.cta ?? 'Rejoindre la communauté'}</div>
      </div>
    </div>
  </div>
</section>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. FINAL PITCH — paragraphe central + CTA bouton
// ─────────────────────────────────────────────────────────────────────────────
export function renderFinalPitch(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.final_pitch) return ''

  const arrowIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

  return `
${mq('fp', `.fp-wrap{padding:60px 20px!important;}`)}
<section class="fp-wrap" style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:680px;margin:0 auto;text-align:center;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-transform:uppercase;margin-bottom:16px;">Dernière chance</p>
    <p style="font-size:20px;color:${t.text};line-height:1.75;margin:0 0 40px 0;font-weight:400;">${d.final_pitch}</p>
    <a href="#buy" style="display:inline-flex;align-items:center;gap:10px;background:${t.primary};color:#fff;padding:18px 40px;border-radius:100px;font-size:16px;font-weight:800;text-decoration:none;letter-spacing:0.01em;">
      ${d.cta ?? 'Commander maintenant'}
      ${arrowIcon}
    </a>
  </div>
</section>`
}

// ─── Section renderers map ──────────────────────────────────────────────────
// Map qui associe chaque SectionKey à son renderer V2. Utilisée par
// renderRichSections pour itérer dans l'ordre voulu.

type SectionRenderer = (d: LandingPageData, t: SectionTheme) => string

const SECTION_RENDERERS: Record<SectionKey, SectionRenderer> = {
  social_proof_bar:      renderSocialProofBarV2,
  story:                 renderStoryV2,
  target_audience:       renderTargetAudience,
  features:              renderFeatures,
  gallery:               () => '', // placeholder remplacé en Task 4 par renderGallery
  unique_mechanism:      renderUniqueMechanism,
  how_it_works:          renderHowItWorks,
  before_after:          renderBeforeAfter,
  comparison:            renderComparisonV2,
  competitor_comparison: renderCompetitorComparison,
  testimonials:          renderTestimonialsV2,
  press_mentions:        renderPressMentions,
  founder_note:          renderFounderNote,
  value_stack:           renderValueStack,
  bonuses:               renderBonusesV2,
  guarantee:             renderGuaranteeV2,
  risk_reversal:         renderRiskReversal,
  objections:            renderObjections,
  community_callout:     renderCommunityCallout,
  final_pitch:           renderFinalPitch,
}

// ─── renderRichSections — l'API publique ────────────────────────────────────
// Rend les 19 sections riches dans l'ordre voulu, en skippant celles dont la
// data est absente. Si KONVERT_RICH_SECTIONS=false (rollback prod), retourne
// '' (aucune section).

export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[],
): string {
  // Feature flag rollback (spec § 3.6)
  if (process.env.KONVERT_RICH_SECTIONS === 'false') return ''

  const keys = order ?? DEFAULT_ORDER
  return keys
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
      if (!renderer) return '' // clé inconnue → skip silencieux
      return renderer(data, theme)
    })
    .filter(html => html.trim().length > 0)
    .join('\n')
}

// ─── Backward compat ────────────────────────────────────────────────────────
// Les noms V1 sont conservés comme aliases vers les versions V2 refondues.
// Permet à du code externe (ou aux 41 templates pas encore migrés pendant le
// rollout) de continuer à fonctionner.

export const renderStorySection         = renderStoryV2
export const renderSocialProofBar       = renderSocialProofBarV2
export const renderTestimonialsSection  = renderTestimonialsV2
export const renderComparisonSection    = renderComparisonV2
export const renderBonusesSection       = renderBonusesV2
export const renderGuaranteeSection     = renderGuaranteeV2
