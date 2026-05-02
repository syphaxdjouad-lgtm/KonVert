// Fragments HTML réutilisables pour les sections enrichies générées par
// DeepSeek (story, testimonials, comparison, social_proof, guarantee, bonuses).
// Chaque renderer retourne une string HTML prête à être injectée dans un
// template, ou '' si la donnée n'est pas dispo (no-op).
//
// Style configurable via `theme` pour s'adapter à chaque template (Blue,
// Noir, Rose, etc.). Les couleurs sont CSS-friendly.

import type { LandingPageData } from '@/types'

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

// ─── Storytelling PAS (Problème → Agitation → Solution → Transformation) ────

export function renderStorySection(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.story) return ''
  const s = d.story
  return `
<section style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:780px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:12px;">L'histoire</p>
    <h2 style="font-size:34px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;line-height:1.15;">${s.problem ? 'Pourquoi nous avons créé ' + d.product_name : ''}</h2>
    <div style="display:grid;gap:32px;">
      ${s.problem ? `
      <div style="display:flex;gap:20px;align-items:flex-start;">
        <div style="flex-shrink:0;width:44px;height:44px;border-radius:12px;background:#FEE2E2;display:flex;align-items:center;justify-content:center;font-size:22px;">😣</div>
        <div>
          <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#EF4444;text-transform:uppercase;margin-bottom:6px;">Le problème</p>
          <p style="font-size:17px;color:${t.text};line-height:1.65;">${s.problem}</p>
        </div>
      </div>` : ''}
      ${s.agitation ? `
      <div style="display:flex;gap:20px;align-items:flex-start;">
        <div style="flex-shrink:0;width:44px;height:44px;border-radius:12px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;font-size:22px;">⚠️</div>
        <div>
          <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#D97706;text-transform:uppercase;margin-bottom:6px;">Ce qui se passe sans solution</p>
          <p style="font-size:17px;color:${t.text};line-height:1.65;">${s.agitation}</p>
        </div>
      </div>` : ''}
      ${s.solution ? `
      <div style="display:flex;gap:20px;align-items:flex-start;">
        <div style="flex-shrink:0;width:44px;height:44px;border-radius:12px;background:${t.accent};display:flex;align-items:center;justify-content:center;font-size:22px;">💡</div>
        <div>
          <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${t.primary};text-transform:uppercase;margin-bottom:6px;">Notre solution</p>
          <p style="font-size:17px;color:${t.text};line-height:1.65;">${s.solution}</p>
        </div>
      </div>` : ''}
      ${s.transformation ? `
      <div style="display:flex;gap:20px;align-items:flex-start;">
        <div style="flex-shrink:0;width:44px;height:44px;border-radius:12px;background:#D1FAE5;display:flex;align-items:center;justify-content:center;font-size:22px;">✨</div>
        <div>
          <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#059669;text-transform:uppercase;margin-bottom:6px;">Le résultat</p>
          <p style="font-size:17px;color:${t.text};line-height:1.65;">${s.transformation}</p>
        </div>
      </div>` : ''}
    </div>
  </div>
</section>`
}

// ─── Bandeau Social Proof — chiffres clés ───────────────────────────────────

export function renderSocialProofBar(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.social_proof) return ''
  const sp = d.social_proof
  return `
<section style="padding:40px 24px;background:${t.accent};font-family:${t.fontFamily};border-top:1px solid ${t.border};border-bottom:1px solid ${t.border};">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:32px;text-align:center;">
    ${sp.customers ? `<div><p style="font-size:13px;color:${t.textMuted};font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">Clients</p><p style="font-size:22px;font-weight:800;color:${t.text};">${sp.customers}</p></div>` : ''}
    ${sp.rating ? `<div><p style="font-size:13px;color:${t.textMuted};font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">Note moyenne</p><p style="font-size:22px;font-weight:800;color:${t.text};">${sp.rating}</p></div>` : ''}
    ${sp.sold ? `<div><p style="font-size:13px;color:${t.textMuted};font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">Récemment vendus</p><p style="font-size:22px;font-weight:800;color:${t.text};">${sp.sold}</p></div>` : ''}
  </div>
</section>`
}

// ─── Témoignages — utilise data.testimonials du LLM ─────────────────────────

export function renderTestimonialsSection(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.testimonials || d.testimonials.length === 0) return ''
  const cards = d.testimonials.map(tm => {
    const stars = '★'.repeat(Math.round(tm.rating || 5)) + '☆'.repeat(5 - Math.round(tm.rating || 5))
    const initial = tm.name?.[0] || 'A'
    return `
    <div style="background:${t.bgAlt};border-radius:${t.radius};padding:28px 24px;border:1px solid ${t.border};">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:42px;height:42px;border-radius:50%;background:${t.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;">${initial}</div>
        <div>
          <p style="font-size:14px;font-weight:700;color:${t.text};margin:0;">${tm.name || 'Client vérifié'}</p>
          ${tm.variant ? `<p style="font-size:11px;color:${t.textMuted};margin:0;">${tm.variant}</p>` : ''}
        </div>
      </div>
      <div style="color:#F5A623;font-size:14px;letter-spacing:2px;margin-bottom:12px;">${stars}</div>
      <p style="font-size:14px;color:${t.text};line-height:1.7;margin:0;">"${tm.text}"</p>
      <div style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;background:${t.accent};padding:4px 10px;border-radius:100px;">
        <span style="font-size:11px;color:${t.primary};font-weight:700;">✓ Achat vérifié</span>
      </div>
    </div>`
  }).join('')

  return `
<section style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Ils l'ont adopté</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
      ${cards}
    </div>
  </div>
</section>`
}

// ─── Comparaison Avec / Sans ────────────────────────────────────────────────

export function renderComparisonSection(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.comparison || (!d.comparison.with?.length && !d.comparison.without?.length)) return ''
  const c = d.comparison
  return `
<section style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">La différence</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">${d.product_name} change la donne</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div style="background:#FEF2F2;border:2px solid #FECACA;border-radius:${t.radius};padding:28px;">
        <p style="font-size:13px;font-weight:800;color:#DC2626;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:18px;">${c.without_title || 'Sans'}</p>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px;">
          ${(c.without || []).map(item => `<li style="display:flex;gap:10px;font-size:15px;color:#7F1D1D;line-height:1.5;"><span style="color:#DC2626;flex-shrink:0;font-weight:800;">✗</span><span>${item}</span></li>`).join('')}
        </ul>
      </div>
      <div style="background:#F0FDF4;border:2px solid #BBF7D0;border-radius:${t.radius};padding:28px;">
        <p style="font-size:13px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:18px;">${c.with_title || 'Avec'}</p>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px;">
          ${(c.with || []).map(item => `<li style="display:flex;gap:10px;font-size:15px;color:#065F46;line-height:1.5;"><span style="color:#059669;flex-shrink:0;font-weight:800;">✓</span><span>${item}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`
}

// ─── Bonus inclus — value stack visuel ──────────────────────────────────────

export function renderBonusesSection(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.bonuses || d.bonuses.length === 0) return ''
  return `
<section style="padding:80px 24px;background:${t.bg};font-family:${t.fontFamily};">
  <div style="max-width:900px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-align:center;text-transform:uppercase;margin-bottom:8px;">Bonus offerts</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};text-align:center;letter-spacing:-0.03em;margin-bottom:12px;">Inclus dans votre commande</h2>
    <p style="font-size:15px;color:${t.textMuted};text-align:center;margin-bottom:48px;">Une valeur ajoutée gratuite si vous commandez aujourd'hui.</p>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${d.bonuses.map((b, i) => `
      <div style="background:${t.accent};border:1px solid ${t.border};border-radius:${t.radius};padding:24px 28px;display:flex;gap:20px;align-items:center;">
        <div style="flex-shrink:0;width:52px;height:52px;border-radius:14px;background:${t.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;">${i + 1}</div>
        <div style="flex:1;">
          <p style="font-size:17px;font-weight:800;color:${t.text};margin:0 0 4px 0;">${b.title || 'Bonus'}</p>
          <p style="font-size:14px;color:${t.textMuted};line-height:1.5;margin:0;">${b.description || ''}</p>
        </div>
        <div style="flex-shrink:0;text-align:right;">
          <p style="font-size:11px;color:${t.textMuted};margin:0 0 2px 0;">Valeur</p>
          <p style="font-size:18px;font-weight:900;color:${t.primary};margin:0;text-decoration:line-through;">${b.value || ''}</p>
          <p style="font-size:11px;font-weight:700;color:#059669;margin:0;">OFFERT</p>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`
}

// ─── Garantie — réassurance ──────────────────────────────────────────────────

export function renderGuaranteeSection(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.guarantee) return ''
  const g = d.guarantee
  return `
<section style="padding:80px 24px;background:${t.bgAlt};font-family:${t.fontFamily};">
  <div style="max-width:780px;margin:0 auto;text-align:center;">
    <div style="width:80px;height:80px;border-radius:50%;background:${t.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;margin:0 auto 24px;">🛡️</div>
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:${t.textMuted};text-transform:uppercase;margin-bottom:8px;">Sans risque</p>
    <h2 style="font-size:32px;font-weight:800;color:${t.text};letter-spacing:-0.03em;margin-bottom:16px;">${g.title || 'Satisfait ou remboursé'}</h2>
    ${g.duration ? `<p style="display:inline-block;background:${t.primary};color:#fff;padding:6px 16px;border-radius:100px;font-size:13px;font-weight:800;letter-spacing:0.04em;margin-bottom:20px;">${g.duration.toUpperCase()}</p>` : ''}
    <p style="font-size:17px;color:${t.text};line-height:1.7;margin:0;">${g.description || ''}</p>
  </div>
</section>`
}
