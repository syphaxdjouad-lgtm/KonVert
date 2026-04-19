import type { LandingPageData } from '@/types'

// ─── FALLBACK IMAGES — fashion/personal styling ───────────────────────────────

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
]

// ─── STYLE GRID AVATARS ───────────────────────────────────────────────────────

const STYLE_AVATARS = [
  { label: 'Fairy',       url: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=120&q=80' },
  { label: 'Retro',       url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&q=80' },
  { label: 'Reworked',    url: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=120&q=80' },
  { label: 'Handmade',    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80' },
  { label: 'Indie',       url: 'https://images.unsplash.com/photo-1503342564739-10a0e5f41c66?w=120&q=80' },
  { label: 'Techwear',    url: 'https://images.unsplash.com/photo-1546961342-ea5f62d1f0dc?w=120&q=80' },
  { label: 'Glam',        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80' },
  { label: 'Casual',      url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=120&q=80' },
  { label: 'Elegant',     url: 'https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=120&q=80' },
  { label: 'Streetwear',  url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=120&q=80' },
]

// ─── COLOR TOKENS ─────────────────────────────────────────────────────────────

const C = {
  heroBg:   '#C9B49A',
  sectionBg:'#F8F7F3',
  darkBg:   '#0D0D0D',
  white:    '#FFFFFF',
  text:     '#1A1A1A',
  muted:    '#6B6B6B',
  border:   '#E5E0D8',
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

const ICON_SETTINGS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`

const ICON_ARROW_NE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`

const ICON_ARROW_LEFT  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`
const ICON_ARROW_RIGHT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`

const ICON_ARROW_LONG_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

const ICON_INFINITY   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>`
const ICON_USER       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_SHOPPING   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
const ICON_CHAT       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const ICON_WARDROBE   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="7" y1="9" x2="7" y2="9.01"/><line x1="17" y1="9" x2="17" y2="9.01"/></svg>`

// ─── MAIN TEMPLATE FUNCTION ───────────────────────────────────────────────────

export function templateEtecStyle(data: LandingPageData): string {
  const img = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const brandName = data.product_name || 'Style Studio'
  const ctaText   = data.cta         || 'Start journey'
  const price     = data.price       || null

  const rawBenefits = data.benefits?.slice(0, 6) || []
  const services = [
    { icon: ICON_INFINITY,  label: rawBenefits[0] || 'Ongoing support'           },
    { icon: ICON_USER,      label: rawBenefits[1] || 'Expert advice'              },
    { icon: ICON_SHOPPING,  label: rawBenefits[2] || 'Shopping assistance'        },
    { icon: ICON_CHAT,      label: rawBenefits[3] || 'Personalised consultation'  },
    { icon: ICON_WARDROBE,  label: rawBenefits[4] || 'Wardrobe revitalization'    },
    { icon: ICON_ARROW_NE,  label: rawBenefits[5] || 'Style transformation'       },
  ]

  const testimonials = data.faq || []
  const quote = testimonials[0]?.answer
    || data.subtitle
    || 'We believe that style is not just about clothing — it is about how you present yourself to the world.'

  // ── Style grid HTML ──────────────────────────────────────────────────────────
  const styleGridHTML = STYLE_AVATARS.map(s => `
        <div class="style-item">
          <div class="style-avatar" style="background-image:url('${s.url}')"></div>
          <span class="style-label">${s.label}</span>
        </div>`).join('')

  // ── Services grid HTML ───────────────────────────────────────────────────────
  const servicesHTML = services.map(s => `
              <div class="service-item">
                <div class="service-icon">${s.icon}</div>
                <span class="service-label">${s.label}</span>
              </div>`).join('')

  // ── Price badge ──────────────────────────────────────────────────────────────
  const priceBadge = price ? `
      <div class="price-pill">
        <span class="price-from">from</span>
        <span class="price-amount">${price}€</span>
        <span class="price-unit">/ session</span>
      </div>` : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName}</title>
  <meta name="description" content="${data.subtitle || 'Your personal styling studio — discover your unique style.'}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── RESET ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background: ${C.sectionBg};
      color: ${C.text};
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ── NAVIGATION ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: ${C.darkBg};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 48px;
      gap: 24px;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255,255,255,0.55);
      flex-shrink: 0;
    }
    .nav-left span {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
      list-style: none;
      flex: 1;
      justify-content: center;
    }
    .nav-links a {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }
    .nav-links a:hover,
    .nav-links a.active { color: ${C.white}; }
    .nav-cta {
      flex-shrink: 0;
      background: ${C.white};
      color: ${C.text};
      font-size: 13px;
      font-weight: 600;
      padding: 10px 22px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
    }
    .nav-cta:hover { opacity: 0.88; transform: scale(0.98); }

    /* ── HERO SPLIT ── */
    .hero {
      display: flex;
      min-height: calc(100vh - 61px);
    }

    /* Left column — beige */
    .hero-left {
      flex: 0 0 60%;
      background: ${C.heroBg};
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .hero-left-img {
      flex: 1;
      min-height: 0;
      width: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }
    .hero-left-bottom {
      padding: 32px 40px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      background: linear-gradient(to top, rgba(201,180,154,0.98) 0%, rgba(201,180,154,0.7) 60%, transparent 100%);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .hero-left-copy {}
    .hero-left-eyebrow {
      font-size: 13px;
      font-weight: 400;
      color: rgba(26,26,26,0.65);
      margin-bottom: 4px;
      font-style: italic;
    }
    .hero-left-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: ${C.text};
      line-height: 1.25;
      margin-bottom: 12px;
    }
    .hero-left-sub {
      font-size: 13px;
      color: rgba(26,26,26,0.72);
      line-height: 1.6;
      max-width: 320px;
      margin-bottom: 20px;
    }
    .hero-btns {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .btn-pill-white {
      background: ${C.white};
      color: ${C.text};
      font-size: 13px;
      font-weight: 600;
      padding: 11px 26px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-pill-white:hover { opacity: 0.88; transform: scale(0.98); }
    .btn-text-link {
      font-size: 13px;
      font-weight: 500;
      color: ${C.text};
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(26,26,26,0.3);
      padding-bottom: 1px;
      transition: border-color 0.2s;
    }
    .btn-text-link:hover { border-color: ${C.text}; }
    .hero-experts {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .hero-avatars {
      display: flex;
    }
    .hero-avatars span {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid ${C.heroBg};
      background-size: cover;
      background-position: center;
      display: block;
      margin-left: -10px;
      overflow: hidden;
    }
    .hero-avatars span:first-child { margin-left: 0; }
    .hero-experts-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.text};
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .hero-corner-note {
      position: absolute;
      bottom: 32px;
      right: 40px;
      text-align: right;
      max-width: 160px;
    }
    .hero-corner-note p {
      font-size: 11px;
      color: rgba(26,26,26,0.6);
      line-height: 1.5;
      margin-bottom: 6px;
    }
    .hero-corner-arrow {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${C.text};
      color: ${C.white};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      float: right;
    }

    /* Right column — white */
    .hero-right {
      flex: 0 0 40%;
      background: ${C.white};
      display: flex;
      flex-direction: column;
      padding: 48px 40px;
      gap: 0;
      overflow-y: auto;
    }
    .hero-right-top {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .hero-right-headline {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.3;
      color: ${C.text};
      margin-bottom: 28px;
    }
    .brand-logos {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid ${C.border};
    }
    .brand-logo-item {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(26,26,26,0.35);
    }
    .hero-right-desc {
      font-size: 13px;
      color: ${C.muted};
      line-height: 1.75;
      margin-bottom: 28px;
    }
    .hero-right-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    .btn-pill-dark {
      background: ${C.text};
      color: ${C.white};
      font-size: 13px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-pill-dark:hover { opacity: 0.82; transform: scale(0.98); }
    .members-count {
      font-size: 13px;
      color: ${C.muted};
    }
    .members-count strong {
      font-size: 15px;
      font-weight: 700;
      color: ${C.text};
    }
    .hero-right-divider {
      height: 1px;
      background: ${C.border};
      margin-bottom: 32px;
    }
    .services-title {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: ${C.text};
      margin-bottom: 8px;
    }
    .services-tagline {
      font-size: 12px;
      color: ${C.muted};
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .service-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1px solid ${C.border};
      border-radius: 12px;
      background: ${C.sectionBg};
      transition: border-color 0.2s, background 0.2s;
    }
    .service-item:hover {
      border-color: rgba(26,26,26,0.2);
      background: ${C.white};
    }
    .service-icon {
      flex-shrink: 0;
      color: ${C.text};
      opacity: 0.7;
    }
    .service-label {
      font-size: 11px;
      font-weight: 500;
      color: ${C.text};
      line-height: 1.4;
    }
    ${priceBadge ? `
    .price-pill {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
      background: ${C.text};
      color: ${C.white};
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 28px;
      align-self: flex-start;
    }
    .price-from { font-size: 10px; opacity: 0.6; }
    .price-amount { font-size: 18px; font-weight: 700; }
    .price-unit { font-size: 10px; opacity: 0.6; }
    ` : ''}

    /* ── CHOOSE YOUR STYLE ── */
    .styles-section {
      background: ${C.white};
      padding: 80px 64px;
    }
    .styles-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 48px;
      gap: 32px;
    }
    .styles-header-left {}
    .styles-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${C.muted};
      margin-bottom: 10px;
    }
    .styles-title {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 700;
      color: ${C.text};
      line-height: 1.2;
    }
    .styles-subtitle {
      font-size: 14px;
      color: ${C.muted};
      line-height: 1.65;
      max-width: 360px;
      margin-top: 14px;
    }
    .styles-content {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 40px;
      align-items: start;
    }
    .style-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
    }
    .style-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .style-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 2px solid transparent;
      transition: border-color 0.2s, transform 0.2s;
    }
    .style-item:hover .style-avatar {
      border-color: ${C.text};
      transform: scale(1.05);
    }
    .style-label {
      font-size: 12px;
      font-weight: 500;
      color: ${C.text};
      text-align: center;
      letter-spacing: 0.01em;
    }
    /* Right collage */
    .styles-collage {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .collage-main {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      height: 220px;
    }
    .collage-main img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .collage-badge {
      position: absolute;
      bottom: 14px;
      left: 14px;
      background: ${C.white};
      color: ${C.text};
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }
    .collage-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .collage-card {
      border-radius: 16px;
      overflow: hidden;
      background: ${C.sectionBg};
      position: relative;
    }
    .collage-card img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
    }
    .collage-card-info {
      padding: 10px 12px;
    }
    .collage-card-date {
      font-size: 10px;
      color: ${C.muted};
      margin-bottom: 3px;
    }
    .collage-card-title {
      font-size: 12px;
      font-weight: 600;
      color: ${C.text};
      line-height: 1.3;
    }
    .collage-round-wrap {
      position: relative;
    }
    .collage-round-img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 16px;
    }
    .collage-round-overlay {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(0,0,0,0.55);
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .collage-round-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.white};
    }
    .collage-round-btn {
      width: 24px;
      height: 24px;
      background: ${C.white};
      color: ${C.text};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ── QUOTE SECTION ── */
    .quote-section {
      background: ${C.sectionBg};
      padding: 100px 64px;
      text-align: center;
      position: relative;
    }
    .quote-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${C.muted};
      margin-bottom: 36px;
    }
    .quote-text {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 400;
      font-style: italic;
      line-height: 1.5;
      color: ${C.text};
      max-width: 800px;
      margin: 0 auto 48px;
      quotes: none;
    }
    .quote-text::before { content: '\\201C'; }
    .quote-text::after  { content: '\\201D'; }
    .quote-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .quote-nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid ${C.border};
      background: ${C.white};
      color: ${C.text};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
    }
    .quote-nav-btn:hover {
      background: ${C.text};
      color: ${C.white};
      border-color: ${C.text};
    }
    .quote-dots {
      display: flex;
      gap: 6px;
    }
    .quote-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${C.border};
      transition: background 0.2s, width 0.2s;
    }
    .quote-dot.active {
      background: ${C.text};
      width: 20px;
      border-radius: 999px;
    }

    /* ── FOOTER ── */
    .footer {
      background: ${C.darkBg};
      padding: 64px 64px 40px;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 40px;
      padding-bottom: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-brand {}
    .footer-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: ${C.white};
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }
    .footer-brand-desc {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
      max-width: 200px;
    }
    .footer-col-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin-bottom: 18px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .footer-links a {
      font-size: 13px;
      color: rgba(255,255,255,0.55);
      transition: color 0.2s;
    }
    .footer-links a:hover { color: ${C.white}; }
    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 32px;
      gap: 24px;
    }
    .footer-copy {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
    }
    .footer-bottom-links {
      display: flex;
      gap: 24px;
      list-style: none;
    }
    .footer-bottom-links a {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      transition: color 0.2s;
    }
    .footer-bottom-links a:hover { color: rgba(255,255,255,0.65); }

    /* ── FADE-IN ANIMATION ── */
    .fade-in {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .nav { padding: 16px 24px; }
      .nav-links { gap: 20px; }
      .hero-left { flex: 0 0 55%; }
      .hero-right { flex: 0 0 45%; padding: 36px 28px; }
      .hero-right-headline { font-size: 22px; }
      .styles-section { padding: 60px 32px; }
      .styles-content { grid-template-columns: 1fr; }
      .styles-collage { display: none; }
      .style-grid { grid-template-columns: repeat(5, 1fr); }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .quote-text { font-size: 26px; }
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero { flex-direction: column; min-height: auto; }
      .hero-left { flex: none; min-height: 60vw; }
      .hero-right { flex: none; padding: 32px 20px; }
      .hero-right-headline { font-size: 20px; }
      .services-grid { grid-template-columns: 1fr; }
      .styles-section { padding: 48px 20px; }
      .styles-title { font-size: 28px; }
      .style-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .style-avatar { width: 60px; height: 60px; }
      .quote-section { padding: 64px 24px; }
      .quote-text { font-size: 22px; }
      .footer { padding: 48px 24px 32px; }
      .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }

    @media (max-width: 480px) {
      .style-grid { grid-template-columns: repeat(3, 1fr); }
      .footer-top { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .fade-in { opacity: 1; transform: none; transition: none; }
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>

  <!-- ── NAVIGATION ── -->
  <nav class="nav" role="navigation" aria-label="Navigation principale">
    <div class="nav-left">
      <span aria-hidden="true">${ICON_SETTINGS}</span>
      <span>Menu</span>
    </div>
    <ul class="nav-links" role="list">
      <li><a href="#" class="active">Home</a></li>
      <li><a href="#styles">Lookbook</a></li>
      <li><a href="#styles">Favorite</a></li>
      <li><a href="#quote">Blog</a></li>
      <li><a href="#footer">About</a></li>
    </ul>
    <a href="#contact" class="nav-cta">Get in touch</a>
  </nav>

  <!-- ── HERO SPLIT ── -->
  <section class="hero" aria-label="Section principale">

    <!-- Left — beige image column -->
    <div class="hero-left">
      <img
        class="hero-left-img"
        src="${img(0)}"
        alt="Personal styling — ${brandName}"
        loading="eager"
      >
      <div class="hero-left-bottom">
        <div class="hero-left-copy">
          <p class="hero-left-eyebrow">Discover your style with</p>
          <h1 class="hero-left-title">professional stylist.</h1>
          <p class="hero-left-sub">${data.subtitle || 'Welcome to the ultimate destination for unlocking your unique style.'}</p>
          <div class="hero-btns">
            <a href="#styles" class="btn-pill-white">
              ${ctaText}
            </a>
            <a href="#contact" class="btn-text-link">
              Book session ${ICON_ARROW_LONG_RIGHT}
            </a>
          </div>
        </div>
        <div class="hero-experts" aria-label="Notre équipe d'experts">
          <div class="hero-avatars" aria-hidden="true">
            <span style="background-image:url('${img(1)}')"></span>
            <span style="background-image:url('${img(2)}')"></span>
            <span style="background-image:url('${img(3)}')"></span>
          </div>
          <span class="hero-experts-label">Our experts</span>
        </div>
      </div>
      <div class="hero-corner-note" aria-hidden="true">
        <p>Book your initial consultation today and unlock your full style potential.</p>
        <div class="hero-corner-arrow">${ICON_ARROW_NE}</div>
      </div>
    </div>

    <!-- Right — white content column -->
    <div class="hero-right">
      <div class="hero-right-top">
        <h2 class="hero-right-headline">Are you ready to unlock the best version of yourself?</h2>

        <div class="brand-logos" aria-label="Marques partenaires">
          <span class="brand-logo-item">paco</span>
          <span class="brand-logo-item">BOSS</span>
          <span class="brand-logo-item">WM</span>
          <span class="brand-logo-item">CK</span>
        </div>

        <p class="hero-right-desc">
          ${data.headline || 'Discover your style with a professional stylist who understands your vision and brings it to life.'}
        </p>

        ${priceBadge}

        <div class="hero-right-actions">
          <a href="#styles" class="btn-pill-dark">${ctaText}</a>
          <div class="members-count">
            <strong>34K+</strong> members
          </div>
        </div>

        <div class="hero-right-divider" role="separator"></div>

        <p class="services-title">Services we offer</p>
        <p class="services-tagline">Embrace the confidence that comes with knowing you look your best!</p>

        <div class="services-grid" role="list" aria-label="Nos services">
          ${servicesHTML}
        </div>
      </div>
    </div>

  </section>

  <!-- ── CHOOSE YOUR STYLE ── -->
  <section class="styles-section fade-in" id="styles" aria-labelledby="styles-heading">
    <div class="styles-header">
      <div class="styles-header-left">
        <p class="styles-eyebrow">Explore</p>
        <h2 class="styles-title" id="styles-heading">Choose from the styles</h2>
        <p class="styles-subtitle">Find the perfect outfit for a special occasion or refresh your everyday look — your style, your rules.</p>
      </div>
    </div>

    <div class="styles-content">
      <!-- Style grid with circular avatars -->
      <div>
        <div class="style-grid" role="list" aria-label="Styles disponibles">
          ${styleGridHTML}
        </div>
      </div>

      <!-- Collage right -->
      <div class="styles-collage" aria-hidden="true">
        <div class="collage-main">
          <img src="${img(4)}" alt="Sportswear style" loading="lazy">
          <span class="collage-badge">Sportswear</span>
        </div>
        <div class="collage-row">
          <div class="collage-card">
            <img src="${img(1)}" alt="Upcoming session" loading="lazy">
            <div class="collage-card-info">
              <p class="collage-card-date">24 July · 10:00 PM</p>
              <p class="collage-card-title">Outfit trends of 2025</p>
            </div>
          </div>
          <div class="collage-round-wrap">
            <img class="collage-round-img" src="${img(5)}" alt="Indie style" loading="lazy">
            <div class="collage-round-overlay">
              <span class="collage-round-label">Indie style</span>
              <div class="collage-round-btn" aria-hidden="true">${ICON_ARROW_NE}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── QUOTE ── -->
  <section class="quote-section fade-in" id="quote" aria-label="Citation">
    <p class="quote-eyebrow">Our philosophy</p>
    <blockquote class="quote-text" id="quote-text">
      ${quote}
    </blockquote>
    <div class="quote-nav" role="group" aria-label="Navigation citations">
      <button class="quote-nav-btn" aria-label="Citation précédente" onclick="prevQuote()">
        ${ICON_ARROW_LEFT}
      </button>
      <div class="quote-dots" aria-hidden="true">
        <div class="quote-dot active" data-index="0"></div>
        <div class="quote-dot" data-index="1"></div>
        <div class="quote-dot" data-index="2"></div>
      </div>
      <button class="quote-nav-btn" aria-label="Citation suivante" onclick="nextQuote()">
        ${ICON_ARROW_RIGHT}
      </button>
    </div>
  </section>

  <!-- ── FOOTER ── -->
  <footer class="footer" id="footer" id="contact" aria-label="Pied de page">
    <div class="footer-top">
      <div class="footer-brand">
        <p class="footer-brand-name">${brandName}</p>
        <p class="footer-brand-desc">Your personal styling studio — where confidence begins.</p>
      </div>
      <div>
        <p class="footer-col-title">Explore</p>
        <ul class="footer-links" role="list">
          <li><a href="#">Lookbook</a></li>
          <li><a href="#styles">Styles</a></li>
          <li><a href="#">Favorites</a></li>
          <li><a href="#quote">Blog</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">Services</p>
        <ul class="footer-links" role="list">
          <li><a href="#">Personal Styling</a></li>
          <li><a href="#">Wardrobe Edit</a></li>
          <li><a href="#">Shopping Day</a></li>
          <li><a href="#">Online Session</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">Contact</p>
        <ul class="footer-links" role="list">
          <li><a href="#">Book a session</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">hello@${brandName.toLowerCase().replace(/\s+/g, '')}.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
      <ul class="footer-bottom-links" role="list">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Use</a></li>
        <li><a href="#">Cookie Settings</a></li>
      </ul>
    </div>
  </footer>

  <script>
    // ── QUOTE ROTATOR ─────────────────────────────────────────────────────────
    const QUOTES = [
      ${JSON.stringify(quote)},
      "Style is a way to say who you are without having to speak.",
      "Fashion is the armor to survive the reality of everyday life."
    ]
    let currentQuote = 0

    function updateQuote(index) {
      const el = document.getElementById('quote-text')
      const dots = document.querySelectorAll('.quote-dot')
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      setTimeout(function() {
        el.textContent = QUOTES[index]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 250)
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index)
      })
    }

    function nextQuote() {
      currentQuote = (currentQuote + 1) % QUOTES.length
      updateQuote(currentQuote)
    }

    function prevQuote() {
      currentQuote = (currentQuote - 1 + QUOTES.length) % QUOTES.length
      updateQuote(currentQuote)
    }

    // Quote text smooth transition
    var quoteEl = document.getElementById('quote-text')
    if (quoteEl) {
      quoteEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
    }

    // ── SCROLL FADE-IN ────────────────────────────────────────────────────────
    var fadeEls = document.querySelectorAll('.fade-in')
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '-40px' })
    fadeEls.forEach(function(el) { io.observe(el) })

    // ── STYLE AVATAR ACTIVE STATE ─────────────────────────────────────────────
    var styleItems = document.querySelectorAll('.style-item')
    styleItems.forEach(function(item) {
      item.addEventListener('click', function() {
        styleItems.forEach(function(i) {
          i.querySelector('.style-avatar').style.borderColor = 'transparent'
        })
        item.querySelector('.style-avatar').style.borderColor = '#1A1A1A'
      })
    })
  </script>

</body>
</html>`
}
