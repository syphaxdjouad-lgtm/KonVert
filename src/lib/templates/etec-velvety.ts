import type { LandingPageData } from '@/types'
import { ico } from './icons'

// ─── FALLBACK IMAGES — skincare botanique Unsplash ───────────────────────────

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
  'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=800&q=80',
]

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────

const C = {
  bg:          '#F4F0E8',
  bgAlt:       '#EAF0E8',
  hero:        '#1E3D2F',
  card:        '#FFFFFF',
  accent:      '#4A7C59',
  accentDark:  '#1E3D2F',
  accentLight: '#D6E8D9',
  text:        '#1A2E1F',
  muted:       '#5C7A65',
  border:      '#C5D9C7',
  gold:        '#C9A84C',
}

// ─── INLINE SVG DECORATIONS ──────────────────────────────────────────────────

const LEAF_BG = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480" fill="none" style="position:absolute;right:-80px;top:-80px;opacity:.07;pointer-events:none;">
  <path d="M240 40 C320 80 420 160 400 280 C380 400 280 440 200 420 C120 400 60 320 80 220 C100 120 160 0 240 40Z" fill="#D6E8D9"/>
  <path d="M360 120 C400 180 400 280 340 340 C280 400 180 400 140 340 C100 280 120 180 180 140 C240 100 320 60 360 120Z" fill="#D6E8D9"/>
  <path d="M100 200 C140 160 220 160 260 200 C300 240 300 320 260 360 C220 400 140 400 100 360 C60 320 60 240 100 200Z" fill="#D6E8D9"/>
</svg>`

const FLORAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340" viewBox="0 0 340 340" fill="none">
  <circle cx="170" cy="170" r="60" stroke="#4A7C59" stroke-width="1.5" fill="none"/>
  <path d="M170 50 C180 90 200 110 170 130 C140 110 160 90 170 50Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".5"/>
  <path d="M170 290 C160 250 140 230 170 210 C200 230 180 250 170 290Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".5"/>
  <path d="M50 170 C90 160 110 140 130 170 C110 200 90 180 50 170Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".5"/>
  <path d="M290 170 C250 180 230 200 210 170 C230 140 250 160 290 170Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".5"/>
  <path d="M90 90 C115 120 120 145 100 160 C80 140 80 115 90 90Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".35"/>
  <path d="M250 90 C225 120 220 145 240 160 C260 140 260 115 250 90Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".35"/>
  <path d="M90 250 C115 220 120 195 100 180 C80 200 80 225 90 250Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".35"/>
  <path d="M250 250 C225 220 220 195 240 180 C260 200 260 225 250 250Z" stroke="#4A7C59" stroke-width="1.5" fill="${C.accentLight}" fill-opacity=".35"/>
  <circle cx="170" cy="170" r="22" fill="${C.accent}" fill-opacity=".15" stroke="#4A7C59" stroke-width="1.5"/>
  <circle cx="170" cy="170" r="8" fill="#4A7C59"/>
</svg>`

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function templateEtecVelvety(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const price         = data.price         || '34.90'
  const originalPrice = data.original_price || ''
  const savePct       = price && originalPrice
    ? Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)
    : 0

  const benefits = [
    data.benefits?.[0] || 'Formulated with 100% certified organic ingredients — no parabens, no sulfates, no compromise.',
    data.benefits?.[1] || 'Dermatologist-tested and adapted to all skin types, including sensitive and reactive skin.',
    data.benefits?.[2] || 'Ready-to-use ritual — just one step for radiant, moisturized skin every morning.',
    data.benefits?.[3] || 'Made from plant-based actives sourced from sustainable, cruelty-free farms.',
    data.benefits?.[4] || 'Biodegradable packaging — our commitment to your skin and to the planet.',
  ]

  // ── PRODUCT CARDS (3 variantes) ──────────────────────────────────────────
  const productNames = [
    data.product_name,
    `${data.product_name} — Nourishing Serum`,
    `${data.product_name} — Revitalizing Mask`,
  ]
  const productPrices = [
    `€${price}`,
    `€${(parseFloat(price) + 5).toFixed(2)}`,
    `€${Math.max(9.9, parseFloat(price) - 3).toFixed(2)}`,
  ]
  const productRatings = [
    { stars: '★★★★★', score: '4.9' },
    { stars: '★★★★☆', score: '4.8' },
    { stars: '★★★★★', score: '5.0' },
  ]

  const productCardsHTML = [0, 1, 2].map(i => `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:20px;overflow:hidden;transition:box-shadow .25s;" onmouseover="this.style.boxShadow='0 12px 40px rgba(30,61,47,.14)'" onmouseout="this.style.boxShadow='none'">
      <div style="aspect-ratio:1;overflow:hidden;background:${C.bgAlt};">
        <img src="${imgs[i] || imgs[0]}" alt="${productNames[i]}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div style="padding:20px 20px 22px;">
        <p style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};margin-bottom:6px;font-family:'DM Sans',sans-serif;">Skincare · Organic</p>
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:600;color:${C.text};margin-bottom:10px;line-height:1.3;">${productNames[i]}</h4>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:18px;font-weight:700;color:${C.accent};font-family:'DM Sans',sans-serif;">${productPrices[i]}</span>
          <span style="font-size:12px;color:${C.gold};letter-spacing:2px;">${productRatings[i].stars} <span style="color:${C.muted};letter-spacing:0;font-size:11px;">${productRatings[i].score}</span></span>
        </div>
        <a href="#" style="display:block;text-align:center;margin-top:14px;background:${C.accentDark};color:#fff;padding:10px 16px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;font-family:'DM Sans',sans-serif;transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Add to bag</a>
      </div>
    </div>`).join('')

  // ── ALL PRODUCTS GRID (4 items) ───────────────────────────────────────────
  const allProductsHTML = [0, 1, 2, 3].map(i => {
    const pname = i === 0 ? data.product_name : i === 1 ? `${data.product_name} Serum` : i === 2 ? `${data.product_name} Toner` : `${data.product_name} Mask`
    const pprice = `€${(parseFloat(price) + (i * 4 - 3)).toFixed(2)}`
    const pratings = ['4.9', '4.7', '5.0', '4.8']
    return `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;" onmouseover="this.style.boxShadow='0 8px 28px rgba(30,61,47,.12)'" onmouseout="this.style.boxShadow='none'" style="transition:box-shadow .25s;">
      <div style="aspect-ratio:3/2;overflow:hidden;background:${C.bg};">
        <img src="${imgs[i]}" alt="${pname}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div style="padding:16px 18px 18px;">
        <p style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};margin-bottom:4px;font-family:'DM Sans',sans-serif;">Organic Skincare</p>
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:15px;color:${C.text};margin-bottom:8px;line-height:1.3;">${pname}</h4>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:17px;font-weight:700;color:${C.accent};font-family:'DM Sans',sans-serif;">${pprice}</span>
          <span style="font-size:12px;color:${C.gold};">★★★★★ <span style="color:${C.muted};font-size:11px;">${pratings[i]}</span></span>
        </div>
      </div>
    </div>`
  }).join('')

  // ── FILTER TAGS ──────────────────────────────────────────────────────────
  const filterTags = ['All assets', 'Protein', 'Supplement', 'Purifying', 'Natural Retinol', 'Collagen', 'Antioxidant', 'Vitamin', 'Hyaluron', 'Peptides']
  const filterTagsHTML = filterTags.map((tag, i) => `
    <button
      onclick="document.querySelectorAll('.ftv').forEach(function(b,j){b.style.background=j===${i}?'${C.accentDark}':'${C.card}';b.style.color=j===${i}?'#fff':'${C.muted}';b.style.borderColor=j===${i}?'${C.accentDark}':'${C.border}';})"
      class="ftv"
      style="padding:8px 18px;border-radius:100px;border:1px solid ${i === 0 ? C.accentDark : C.border};background:${i === 0 ? C.accentDark : C.card};color:${i === 0 ? '#fff' : C.muted};font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif;transition:all .2s;"
    >${tag}</button>`).join('')

  // ── FAQ ACCORDION ─────────────────────────────────────────────────────────
  const faqItems = data.faq && data.faq.length > 0 ? data.faq : [
    { question: 'Are all your ingredients truly organic?', answer: 'Yes — every active ingredient in our formulas is certified organic by ECOCERT or COSMOS. We source directly from partner farms committed to sustainable agriculture.' },
    { question: 'Is this suitable for sensitive skin?', answer: `${data.product_name} has been dermatologist-tested and is free from parabens, sulfates, artificial fragrances, and known irritants. It is suitable for sensitive, reactive, and combination skin.` },
    { question: 'How long before I see results?', answer: 'Most customers notice a visible improvement in skin texture and radiance within 7 to 14 days of consistent daily use. Full results are typically visible after 4 weeks.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day satisfaction guarantee. If you are not fully happy with your purchase, contact our team and we will arrange a full refund with no questions asked.' },
  ]

  const faqHTML = faqItems.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fpv').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fiv').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='260px';p.style.padding='0 0 20px 0';this.querySelector('.fiv').textContent='−';}"
        style="width:100%;background:none;border:none;padding:22px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:600;color:${C.text};font-family:'DM Sans',sans-serif;">${item.question}</span>
        <span class="fiv" style="color:${C.accent};font-size:26px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fpv"
        style="max-height:${i === 0 ? '260px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 20px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.85;font-family:'DM Sans',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')

  // ─────────────────────────────────────────────────────────────────────────
  // HTML TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name} — Natural & Certified Organic Skincare</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;}
  a{text-decoration:none;}

  /* ── Responsive ─────────────────────────────────────────────────────────── */
  @media(max-width:900px){
    .hgv{grid-template-columns:1fr!important;gap:32px!important;}
    .hgv>div:first-child{order:2!important;}
    .hgv>div:last-child{order:1!important;}
    .h1v{font-size:32px!important;}
    .ngv{grid-template-columns:1fr!important;gap:18px!important;}
    .pgv{grid-template-columns:repeat(2,1fr)!important;gap:14px!important;}
    .abv{grid-template-columns:1fr!important;gap:32px!important;}
    .apgv{grid-template-columns:repeat(2,1fr)!important;gap:14px!important;}
    .thpv{display:grid!important;grid-template-columns:1fr!important;gap:1px!important;}
    .prsv{flex-direction:column!important;gap:16px!important;}
    .nav-linkv{display:none!important;}
    .nav-hambv{display:flex!important;}
  }
  @media(max-width:520px){
    .pgv{grid-template-columns:1fr!important;}
    .apgv{grid-template-columns:1fr!important;}
    .h1v{font-size:26px!important;}
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════════════════════
     1. NAVBAR
════════════════════════════════════════════════════════════════════════════ -->
<nav style="position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid ${C.border};box-shadow:0 1px 12px rgba(30,61,47,.06);">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:68px;">

    <!-- Logo -->
    <a href="#" style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:600;color:${C.accentDark};letter-spacing:-.01em;">
      ${data.product_name.split(' ')[0]}
    </a>

    <!-- Nav links -->
    <div class="nav-linkv" style="display:flex;align-items:center;gap:36px;">
      ${['Products', 'About', 'Blog', 'Contact'].map(link => `
        <a href="#" style="font-size:14px;font-weight:500;color:${C.muted};transition:color .2s;font-family:'DM Sans',sans-serif;" onmouseover="this.style.color='${C.accentDark}'" onmouseout="this.style.color='${C.muted}'">${link}</a>
      `).join('')}
    </div>

    <!-- CTA + hamburger -->
    <div style="display:flex;align-items:center;gap:14px;">
      <a href="#" style="background:${C.accentDark};color:#fff;padding:10px 24px;border-radius:100px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Shop now</a>
      <!-- Hamburger (mobile) -->
      <button class="nav-hambv" style="display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;" aria-label="Menu">
        <span style="display:block;width:22px;height:2px;background:${C.accentDark};border-radius:2px;"></span>
        <span style="display:block;width:22px;height:2px;background:${C.accentDark};border-radius:2px;"></span>
        <span style="display:block;width:22px;height:2px;background:${C.accentDark};border-radius:2px;"></span>
      </button>
    </div>

  </div>
</nav>


<!-- ═══════════════════════════════════════════════════════════════════════════
     2. HERO — fond vert forêt avec motif feuilles SVG
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.hero};position:relative;overflow:hidden;">
  ${LEAF_BG}

  <div style="max-width:1280px;margin:0 auto;padding:80px 32px 88px;position:relative;z-index:1;">
    <div class="hgv" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">

      <!-- Colonne gauche — image produit -->
      <div>
        <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/5;box-shadow:0 24px 64px rgba(0,0,0,.4);">
          <img src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
      </div>

      <!-- Colonne droite — copy -->
      <div>
        <!-- Badge -->
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(214,232,217,.15);border:1px solid rgba(214,232,217,.3);padding:8px 18px;border-radius:100px;margin-bottom:28px;">
          <span style="color:${C.accentLight};font-size:13px;">${ico.leaf(14)}</span>
          <span style="font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.accentLight};font-family:'DM Sans',sans-serif;">Natural & Certified Organic</span>
        </div>

        <!-- H1 -->
        <h1 class="h1v" style="font-family:'Playfair Display',Georgia,serif;font-size:52px;font-weight:600;line-height:1.1;letter-spacing:-.02em;color:#fff;margin-bottom:20px;">
          ${data.headline || `Let nature take care of your body and soul`}
        </h1>

        <!-- Sous-titre -->
        <p style="font-size:17px;color:rgba(255,255,255,.72);line-height:1.75;margin-bottom:36px;font-family:'DM Sans',sans-serif;max-width:460px;">
          ${data.subtitle || `A carefully crafted ritual drawn from ancestral botanical wisdom — pure ingredients, transformative results.`}
        </p>

        <!-- Prix -->
        ${price ? `
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:36px;">
          <span style="font-family:'Playfair Display',Georgia,serif;font-size:42px;font-weight:600;color:#fff;">€${price}</span>
          ${originalPrice ? `<span style="font-size:20px;color:rgba(255,255,255,.4);text-decoration:line-through;font-family:'DM Sans',sans-serif;">€${originalPrice}</span>` : ''}
          ${savePct > 0 ? `<span style="background:${C.gold};color:${C.accentDark};padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;">-${savePct}%</span>` : ''}
        </div>` : ''}

        <!-- CTA -->
        <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:40px;">
          <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:${C.accentDark};padding:15px 32px;border-radius:100px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);transition:transform .2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
            Shop now →
          </a>
          <a href="#about-v" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#fff;padding:15px 28px;border-radius:100px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;border:1.5px solid rgba(255,255,255,.35);transition:border-color .2s;" onmouseover="this.style.borderColor='rgba(255,255,255,.8)'" onmouseout="this.style.borderColor='rgba(255,255,255,.35)'">
            Learn more
          </a>
        </div>

        <!-- Trust micro row -->
        <div style="display:flex;flex-wrap:wrap;gap:20px;">
          ${[
            [ico.leaf(15), '100% Organic'],
            [ico.shield(15), 'Dermatologist tested'],
            [ico.truck(15), 'Free shipping'],
          ].map(([icon, label]) => `
            <span style="display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.6);font-family:'DM Sans',sans-serif;">
              <span style="color:${C.accentLight};">${icon}</span>${label}
            </span>`).join('')}
        </div>
      </div>

    </div>
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     3. INSPIRED BY NATURE — fond crème
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">
    <div class="abv" style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;">

      <!-- Gauche — image -->
      <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/5;box-shadow:0 16px 48px rgba(30,61,47,.12);">
        <img src="${imgs[1]}" alt="Natural ingredients" style="width:100%;height:100%;object-fit:cover;display:block;"/>
      </div>

      <!-- Droite — texte + feature cards -->
      <div>
        <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Our Philosophy</p>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;line-height:1.2;letter-spacing:-.01em;color:${C.text};margin-bottom:24px;">Inspired by traditional knowledge and nature</h2>
        <p style="font-size:15px;color:${C.muted};line-height:1.8;margin-bottom:40px;font-family:'DM Sans',sans-serif;">
          Every formula we create begins with a deep respect for botanical traditions. We source our actives from the wild — adaptogens, cold-pressed oils, plant extracts — and let nature do what it has always done best.
        </p>

        <!-- Feature cards horizontales -->
        <div class="ngv" style="display:grid;grid-template-columns:1fr;gap:0;">
          ${[
            { icon: ico.leaf(22), title: '100% Organic', desc: benefits[0] },
            { icon: ico.shield(22), title: 'Fits your skin', desc: benefits[1] },
            { icon: ico.flask(22), title: 'Easy to use', desc: benefits[2] },
          ].map((feat, i) => `
            <div style="display:flex;gap:18px;padding:22px 0;border-bottom:${i < 2 ? `1px solid ${C.border}` : 'none'};">
              <div style="width:46px;height:46px;background:${C.accentLight};border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${C.accent};">
                ${feat.icon}
              </div>
              <div>
                <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:600;color:${C.text};margin-bottom:5px;">${feat.title}</h4>
                <p style="font-size:13px;color:${C.muted};line-height:1.75;font-family:'DM Sans',sans-serif;">${feat.desc}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>

    </div>
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     4. FEATURED PRODUCTS — fond blanc
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.card};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Our featured products</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;line-height:1.2;color:${C.text};max-width:560px;margin:0 auto;letter-spacing:-.01em;">Facial and skincare, natural and certified organic</h2>
    </div>

    <!-- Grid 3 colonnes -->
    <div class="pgv" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      ${productCardsHTML}
    </div>

    <!-- View all CTA -->
    <div style="text-align:center;margin-top:48px;">
      <a href="#all-products-v" style="display:inline-flex;align-items:center;gap:8px;border:1.5px solid ${C.accentDark};color:${C.accentDark};padding:13px 32px;border-radius:100px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;transition:all .2s;" onmouseover="this.style.background='${C.accentDark}';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='${C.accentDark}'">View all products →</a>
    </div>

  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     5. ABOUT SECTION — fond crème
════════════════════════════════════════════════════════════════════════════ -->
<section id="about-v" style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">
    <div class="abv" style="display:grid;grid-template-columns:1fr 1fr;gap:72px;">

      <!-- Colonne gauche -->
      <div>
        <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:16px;">Our Story</p>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;line-height:1.2;color:${C.text};margin-bottom:24px;letter-spacing:-.01em;">Velvety facial and skincare company</h2>
        <p style="font-size:15px;color:${C.muted};line-height:1.85;margin-bottom:24px;font-family:'DM Sans',sans-serif;">
          ${data.subtitle || `We were born from a simple belief: the most effective skincare is the kind that works in harmony with your skin, not against it. Every product we craft starts with a botanical story — a plant, a root, a flower — and ends with a formula your skin will love.`}
        </p>
        <a href="#" style="display:inline-flex;align-items:center;gap:6px;color:${C.accent};font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;border-bottom:1.5px solid ${C.border};padding-bottom:2px;transition:border-color .2s;" onmouseover="this.style.borderColor='${C.accent}'" onmouseout="this.style.borderColor='${C.border}'">Learn more →</a>
      </div>

      <!-- Colonne droite -->
      <div style="padding-top:8px;">
        <p style="font-size:15px;color:${C.muted};line-height:1.85;margin-bottom:28px;font-family:'DM Sans',sans-serif;text-align:justify;">
          From our farms to your bathroom shelf, every step of our supply chain is governed by the same obsession: respect. Respect for the soil, respect for the farmers who tend it, and respect for your skin.
        </p>
        <div style="border-left:2px solid ${C.accentLight};padding-left:20px;margin-bottom:28px;">
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">${benefits[3]}</p>
        </div>
        <div style="border-left:2px solid ${C.accentLight};padding-left:20px;">
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">${benefits[4]}</p>
        </div>
      </div>

    </div>

    <!-- Logos presse -->
    <div style="margin-top:64px;padding-top:40px;border-top:1px solid ${C.border};">
      <p style="text-align:center;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};margin-bottom:28px;font-family:'DM Sans',sans-serif;">As seen in</p>
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:36px 48px;">
        ${['VOGUE', 'Forbes', 'THOUGHT CATALOG', "Women's Health", 'WWD'].map(press => `
          <span style="font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:600;color:rgba(92,122,101,.45);letter-spacing:.04em;">${press}</span>
        `).join('')}
      </div>
    </div>

  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     6. ALL PRODUCTS + FILTERS — fond vert pâle
════════════════════════════════════════════════════════════════════════════ -->
<section id="all-products-v" style="background:${C.bgAlt};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">

    <!-- Header -->
    <div style="margin-bottom:40px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">All products</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:600;color:${C.text};letter-spacing:-.01em;">Mild skincare &amp; facial routine</h2>
    </div>

    <!-- Filter tags -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:40px;">
      ${filterTagsHTML}
    </div>

    <!-- Grid 2x2 -->
    <div class="apgv" style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;">
      ${allProductsHTML}
    </div>

  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     7. SKIN DIAGNOSIS CTA — fond blanc
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.card};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">
    <div class="abv" style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;">

      <!-- Illustration florale gauche -->
      <div style="display:flex;justify-content:center;align-items:center;">
        <div style="background:${C.bgAlt};border-radius:50%;width:320px;height:320px;display:flex;align-items:center;justify-content:center;border:1px solid ${C.border};">
          ${FLORAL_SVG}
        </div>
      </div>

      <!-- Droite — texte -->
      <div>
        <p style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Try Our Service</p>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:42px;font-weight:600;line-height:1.15;letter-spacing:-.01em;color:${C.text};margin-bottom:20px;">Your skin diagnosis in 3 minutes</h2>
        <p style="font-size:15px;color:${C.muted};line-height:1.8;margin-bottom:36px;font-family:'DM Sans',sans-serif;max-width:440px;">
          Not sure which products are right for your skin? Our quick skin quiz analyses your skin type, concerns, and lifestyle — then recommends your ideal personalised routine.
        </p>
        <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:${C.accentDark};color:#fff;padding:15px 32px;border-radius:100px;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;transition:opacity .2s;box-shadow:0 6px 24px rgba(30,61,47,.25);" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
          Find my diagnosis →
        </a>
      </div>

    </div>
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     8. TESTIMONIALS — fond crème
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:860px;margin:0 auto;padding:0 32px;text-align:center;" id="testimonials-v">

    <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:16px;">Product Testimonials</p>

    <!-- Stars grandes en or -->
    <div style="font-size:30px;color:${C.gold};letter-spacing:6px;margin-bottom:40px;">★★★★★</div>

    <!-- Carrousel simple -->
    <div style="position:relative;overflow:hidden;">
      <div id="tsl-v" style="transition:opacity .35s ease;">
        <!-- Slide 0 -->
        <div class="tsl-itemv" style="display:block;">
          <blockquote style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:400;font-style:italic;line-height:1.65;color:${C.text};margin-bottom:32px;max-width:720px;margin-left:auto;margin-right:auto;">
            "I've been feeling pretty stressed with my skin lately, so I picked up a set of ${data.product_name} skincare. Oh my goodness! It was AMAZING. My skin felt so soft and moisturized!"
          </blockquote>
          <p style="font-size:14px;font-weight:600;color:${C.muted};font-family:'DM Sans',sans-serif;">— Sarah M. <span style="font-weight:400;color:${C.border}">&nbsp;·&nbsp;</span> <span style="font-weight:400;">Verified buyer</span></p>
        </div>
        <!-- Slide 1 -->
        <div class="tsl-itemv" style="display:none;">
          <blockquote style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:400;font-style:italic;line-height:1.65;color:${C.text};margin-bottom:32px;max-width:720px;margin-left:auto;margin-right:auto;">
            "The texture is divine — light as a feather but incredibly nourishing. I've been using it for three weeks and my skin has never looked this radiant. I'm never going back."
          </blockquote>
          <p style="font-size:14px;font-weight:600;color:${C.muted};font-family:'DM Sans',sans-serif;">— Emma L. <span style="font-weight:400;color:${C.border}">&nbsp;·&nbsp;</span> <span style="font-weight:400;">Verified buyer</span></p>
        </div>
        <!-- Slide 2 -->
        <div class="tsl-itemv" style="display:none;">
          <blockquote style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:400;font-style:italic;line-height:1.65;color:${C.text};margin-bottom:32px;max-width:720px;margin-left:auto;margin-right:auto;">
            "Finally a brand that lives up to its claims. All organic, all effective — and the packaging is absolutely beautiful. Makes your morning routine feel like a ritual."
          </blockquote>
          <p style="font-size:14px;font-weight:600;color:${C.muted};font-family:'DM Sans',sans-serif;">— Clara R. <span style="font-weight:400;color:${C.border}">&nbsp;·&nbsp;</span> <span style="font-weight:400;">Verified buyer</span></p>
        </div>
      </div>
    </div>

    <!-- Navigation flèches -->
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:40px;">
      <button
        onclick="(function(){var items=document.querySelectorAll('.tsl-itemv'),cur=0;items.forEach(function(el,i){if(el.style.display!=='none')cur=i;});items[cur].style.display='none';items[(cur-1+items.length)%items.length].style.display='block';})()"
        style="width:44px;height:44px;border-radius:50%;border:1.5px solid ${C.border};background:${C.card};color:${C.accent};cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.background='${C.accentDark}';this.style.color='#fff';this.style.borderColor='${C.accentDark}'" onmouseout="this.style.background='${C.card}';this.style.color='${C.accent}';this.style.borderColor='${C.border}'"
        aria-label="Previous"
      >←</button>
      <button
        onclick="(function(){var items=document.querySelectorAll('.tsl-itemv'),cur=0;items.forEach(function(el,i){if(el.style.display!=='none')cur=i;});items[cur].style.display='none';items[(cur+1)%items.length].style.display='block';})()"
        style="width:44px;height:44px;border-radius:50%;border:1.5px solid ${C.border};background:${C.card};color:${C.accent};cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.background='${C.accentDark}';this.style.color='#fff';this.style.borderColor='${C.accentDark}'" onmouseout="this.style.background='${C.card}';this.style.color='${C.accent}';this.style.borderColor='${C.border}'"
        aria-label="Next"
      >→</button>
    </div>

  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     9. THREE PILLARS — fond vert forêt
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.hero};padding:80px 0;">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">
    <div class="thpv" style="display:grid;grid-template-columns:repeat(3,1fr);">

      ${[
        { label: 'Loyalty Program', title: 'For Happy Skin', desc: 'Earn points with every purchase and unlock exclusive rewards, early access, and personalised gifts.', link: 'Join the program →' },
        { label: 'Find a Store Near You', title: 'Sponsor Those You Love', desc: 'Discover our retail partners worldwide. Bring the gift of organic skincare to someone you care about.', link: 'Find a store →' },
        { label: 'Find Your Nearest Retailer', title: 'at Maison Absoluthion', desc: 'Our flagship concept store carries the full Velvety range alongside curated botanical apothecary selections.', link: 'Get directions →' },
      ].map((pillar, i) => `
        <div style="padding:40px 36px;border-bottom:2px solid ${i === 0 ? C.accent : i === 1 ? C.gold : C.accentLight};transition:background .2s;" onmouseover="this.style.background='rgba(74,124,89,.12)'" onmouseout="this.style.background='transparent'">
          <p style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);font-family:'DM Sans',sans-serif;margin-bottom:10px;">${pillar.label}</p>
          <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:600;color:#fff;margin-bottom:14px;line-height:1.3;">${pillar.title}</h3>
          <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.8;margin-bottom:22px;font-family:'DM Sans',sans-serif;">${pillar.desc}</p>
          <a href="#" style="font-size:13px;font-weight:600;color:${C.accentLight};font-family:'DM Sans',sans-serif;border-bottom:1px solid rgba(214,232,217,.3);padding-bottom:2px;transition:border-color .2s;" onmouseover="this.style.borderColor='${C.accentLight}'" onmouseout="this.style.borderColor='rgba(214,232,217,.3)'">${pillar.link}</a>
        </div>`).join('')}

    </div>
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     10. NEWSLETTER — fond vert forêt
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.accentDark};border-top:1px solid rgba(74,124,89,.3);padding:72px 32px;text-align:center;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(214,232,217,.6);font-family:'DM Sans',sans-serif;margin-bottom:12px;">Stay in touch</p>
    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:30px;font-weight:600;color:#fff;margin-bottom:10px;line-height:1.25;">Subscribe to get 10% off your first order</h3>
    <p style="font-size:14px;color:rgba(255,255,255,.55);margin-bottom:32px;font-family:'DM Sans',sans-serif;">Join our community of skin-conscious shoppers. No spam, ever.</p>

    <!-- Form -->
    <form onsubmit="event.preventDefault();this.innerHTML='<p style=\'color:#D6E8D9;font-size:14px;font-family:DM Sans,sans-serif;\'>✓ You\'re on the list — check your inbox!</p>'" style="display:flex;gap:0;max-width:460px;margin:0 auto;">
      <input
        type="email"
        placeholder="Your email address"
        required
        style="flex:1;padding:14px 20px;border:1.5px solid rgba(74,124,89,.5);border-right:none;border-radius:100px 0 0 100px;background:rgba(255,255,255,.08);color:#fff;font-size:14px;outline:none;font-family:'DM Sans',sans-serif;"
      />
      <button
        type="submit"
        style="padding:14px 28px;background:#fff;color:${C.accentDark};border:none;border-radius:0 100px 100px 0;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:opacity .2s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'"
      >Subscribe</button>
    </form>

    <p style="font-size:12px;color:rgba(255,255,255,.3);margin-top:16px;font-family:'DM Sans',sans-serif;">By subscribing you agree to our Privacy Policy. Unsubscribe at any time.</p>
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     FAQ — interlude fond crème
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 32px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">FAQ</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:600;color:${C.text};">Frequently asked questions</h2>
    </div>
    ${faqHTML}
  </div>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     CTA FINAL BANNER — fond crème avec CTA vert
════════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:88px 32px;text-align:center;border-top:1px solid ${C.border};">
  <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Limited offer</p>
  <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:44px;font-weight:600;color:${C.text};letter-spacing:-.02em;line-height:1.15;margin-bottom:16px;max-width:600px;margin-left:auto;margin-right:auto;">${data.headline || 'Begin your organic skincare ritual today'}</h2>
  <p style="font-size:16px;color:${C.muted};margin-bottom:10px;max-width:460px;margin-left:auto;margin-right:auto;font-family:'DM Sans',sans-serif;line-height:1.75;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="font-size:14px;font-weight:600;color:${C.accent};margin-bottom:36px;font-family:'DM Sans',sans-serif;">${data.urgency}</p>` : '<div style="margin-bottom:36px;"></div>'}
  <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:${C.accentDark};color:#fff;padding:17px 48px;border-radius:100px;font-size:16px;font-weight:700;font-family:'DM Sans',sans-serif;box-shadow:0 8px 28px rgba(30,61,47,.25);transition:transform .2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
    ${data.cta || 'Shop the collection'} →
  </a>
  <p style="margin-top:20px;font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">Free shipping · 30-day returns · Certified organic · Cruelty-free</p>
</section>


<!-- ═══════════════════════════════════════════════════════════════════════════
     11. FOOTER — fond très sombre
════════════════════════════════════════════════════════════════════════════ -->
<footer style="background:#0F2318;padding:64px 0 0;">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.08);" class="fgv">

      <!-- Col 1 — Logo + adresse -->
      <div>
        <a href="#" style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:600;color:#fff;display:block;margin-bottom:16px;">${data.product_name.split(' ')[0]}</a>
        <p style="font-size:13px;color:rgba(255,255,255,.45);line-height:1.9;font-family:'DM Sans',sans-serif;margin-bottom:20px;">
          12 Rue des Botanistes<br/>
          75008 Paris, France<br/>
          Mon – Fri · 9:00 – 18:00
        </p>
        <!-- Socials -->
        <div style="display:flex;gap:12px;">
          ${['IG', 'FB', 'TK', 'YT'].map(s => `
            <a href="#" style="width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:rgba(255,255,255,.5);font-family:'DM Sans',sans-serif;transition:all .2s;" onmouseover="this.style.borderColor='${C.accentLight}';this.style.color='${C.accentLight}'" onmouseout="this.style.borderColor='rgba(255,255,255,.15)';this.style.color='rgba(255,255,255,.5)'">${s}</a>
          `).join('')}
        </div>
      </div>

      <!-- Col 2 — Shop -->
      <div>
        <h5 style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);font-family:'DM Sans',sans-serif;margin-bottom:18px;">Shop</h5>
        <ul style="list-style:none;">
          ${['All Products', 'Facial Care', 'Body Care', 'Serums', 'Gift Sets', 'New Arrivals'].map(link => `
            <li style="margin-bottom:10px;"><a href="#" style="font-size:13px;color:rgba(255,255,255,.55);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.55)'">${link}</a></li>
          `).join('')}
        </ul>
      </div>

      <!-- Col 3 — Help Desk -->
      <div>
        <h5 style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);font-family:'DM Sans',sans-serif;margin-bottom:18px;">Help Desk</h5>
        <ul style="list-style:none;">
          ${['FAQ', 'Shipping & Returns', 'Track my Order', 'Contact Us', 'Skin Quiz', 'Privacy Policy'].map(link => `
            <li style="margin-bottom:10px;"><a href="#" style="font-size:13px;color:rgba(255,255,255,.55);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.55)'">${link}</a></li>
          `).join('')}
        </ul>
      </div>

      <!-- Col 4 — Location -->
      <div>
        <h5 style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);font-family:'DM Sans',sans-serif;margin-bottom:18px;">Location</h5>
        <ul style="list-style:none;">
          ${['Paris Flagship', 'London – Covent Garden', 'Amsterdam – De Pijp', 'Online Worldwide', 'Wholesale Enquiries'].map(link => `
            <li style="margin-bottom:10px;"><a href="#" style="font-size:13px;color:rgba(255,255,255,.55);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.55)'">${link}</a></li>
          `).join('')}
        </ul>
      </div>

    </div>

    <!-- Copyright -->
    <div style="padding:24px 0;text-align:center;">
      <p style="font-size:12px;color:rgba(255,255,255,.25);font-family:'DM Sans',sans-serif;">
        © ${new Date().getFullYear()} ${data.product_name.split(' ')[0]}. All rights reserved. Certified organic by ECOCERT. Cruelty-free.
      </p>
    </div>

  </div>
</footer>

<style>
  @media(max-width:900px){
    .fgv{grid-template-columns:1fr 1fr!important;gap:32px!important;}
  }
  @media(max-width:520px){
    .fgv{grid-template-columns:1fr!important;}
  }
</style>

</body>
</html>`
}
