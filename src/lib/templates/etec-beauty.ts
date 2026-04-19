import type { LandingPageData } from '@/types'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80',
]

const C = {
  bg:     '#FBF8F3',
  cream:  '#FFF3D0',
  dark:   '#2C2C2C',
  orange: '#E8622A',
  text:   '#1A1A1A',
  muted:  '#6B6B6B',
  white:  '#FFFFFF',
}

// ── SVG spark étoile orange ──────────────────────────────────────────────────
const SPARK = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2L15.8 10.2L24 12L15.8 13.8L14 22L12.2 13.8L4 12L12.2 10.2L14 2Z" fill="${C.orange}" opacity="0.9"/></svg>`
const SPARK_SM = `<svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2L15.8 10.2L24 12L15.8 13.8L14 22L12.2 13.8L4 12L12.2 10.2L14 2Z" fill="${C.orange}" opacity="0.75"/></svg>`

// ── Badge prix étoile (clip-path) ────────────────────────────────────────────
function starBadge(price: string, bg: string): string {
  return `
    <div style="position:absolute;top:14px;right:14px;width:58px;height:58px;background:${bg};clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);display:flex;align-items:center;justify-content:center;z-index:2;">
      <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#fff;text-align:center;line-height:1.1;padding-top:6px;">${price}€</span>
    </div>`
}

export function templateEtecBeauty(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const mainImg    = imgs[0]
  const productImg = imgs[1] || imgs[0]

  const price    = data.price    || '39'
  const savePct  = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  // ── Bénéfices FAQ accordion ───────────────────────────────────────────────
  const faqHTML = data.faq && data.faq.length > 0
    ? data.faq.map((item, i) => `
    <div style="border-bottom:1px solid rgba(255,255,255,0.08);">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fpb').forEach(function(x){x.style.maxHeight='0';x.style.padding='0 0 0 0';});document.querySelectorAll('.fib').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='220px';p.style.padding='0 0 16px 0';this.querySelector('.fib').textContent='−';}"
        style="width:100%;background:none;border:none;padding:18px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;"
      >
        <span style="font-size:14px;font-weight:600;color:${C.white};font-family:'DM Sans',sans-serif;">${item.question}</span>
        <span class="fib" style="color:${C.orange};font-size:22px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fpb"
        style="max-height:${i === 0 ? '220px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 16px 0' : '0'};font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;font-family:'DM Sans',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')
    : ''

  // ── 4 features Why Choose ─────────────────────────────────────────────────
  const featureItems = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      bg: '#7C5CBF',
      title: 'Best Hair Care',
      desc: data.benefits[0] || `${data.product_name} est formulé pour nourrir, réparer et sublimer chaque fibre capillaire en profondeur.`,
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      bg: C.orange,
      title: 'Sustainable',
      desc: data.benefits[1] || 'Ingrédients 100% biologiques, emballages recyclables, production éthique. Un choix beauté responsable.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>`,
      bg: C.orange,
      title: 'Advance Formula',
      desc: data.benefits[2] || 'Notre formule brevetée combine kératine, acides aminés et extraits botaniques pour des résultats visibles dès la première utilisation.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      bg: '#2D7D46',
      title: 'Transparency',
      desc: data.benefits[3] || 'Composition 100% transparente, sans sulfates ni parabènes. Chaque ingrédient est listé avec sa provenance et son rôle.',
    },
  ]

  // ── 4 produits cards grille 2x2 ───────────────────────────────────────────
  const productCards = [
    { img: imgs[0], title: data.product_name, desc: data.subtitle || 'Soin capillaire premium', price: price, starBg: '#7C5CBF' },
    { img: imgs[1], title: `${data.product_name} Pro`, desc: 'Traitement intensif réparateur', price: String(Math.round(parseFloat(price) * 1.3)), starBg: C.orange },
    { img: imgs[2], title: `${data.product_name} Light`, desc: 'Formule quotidienne légère', price: String(Math.round(parseFloat(price) * 0.85)), starBg: C.orange },
    { img: imgs[3], title: `${data.product_name} Night`, desc: 'Masque nuit régénérant', price: String(Math.round(parseFloat(price) * 1.15)), starBg: '#2D7D46' },
  ]

  // ── Témoignages ───────────────────────────────────────────────────────────
  const testimonials = [
    {
      name: 'Sophie L.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
      text: `"${data.product_name} a littéralement transformé mes cheveux. En moins de 3 semaines, mes pointes sont réparées, mes boucles définies et mon cuir chevelu apaisé. Un miracle en flacon."`,
    },
    {
      name: 'Amira B.',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
      text: `"Qualité professionnelle à la maison. Le parfum est subtil, la texture s'applique parfaitement et les résultats sont visibles dès le premier shampoing. Je ne reviendrai jamais en arrière."`,
    },
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name} — Hair Care Premium</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;line-height:1.6;font-size:15px;overflow-x:hidden;}
  img{display:block;}
  a{text-decoration:none;color:inherit;}

  /* ── Nav ── */
  .nav-link{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.text};opacity:.75;transition:opacity .2s;}
  .nav-link:hover{opacity:1;color:${C.orange};}
  .nav-icon{width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.7;transition:opacity .2s;}
  .nav-icon:hover{opacity:1;}

  /* ── CTA ── */
  .btn-orange{display:inline-flex;align-items:center;gap:10px;background:${C.orange};color:${C.white};padding:14px 28px;border-radius:40px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;border:none;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 20px rgba(232,98,42,0.35);}
  .btn-orange:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,98,42,0.45);}

  /* ── Product card ── */
  .prod-card{background:${C.white};border-radius:20px;overflow:hidden;position:relative;transition:transform .25s,box-shadow .25s;}
  .prod-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,0.1);}
  .prod-card-half{height:180px;background:${C.cream};border-radius:0 0 100px 100px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;position:relative;}
  .prod-card-half img{height:160px;width:auto;object-fit:contain;margin-bottom:-10px;}

  /* ── Feature card ── */
  .feat-card{background:${C.white};border-radius:16px;padding:24px;border:1px solid rgba(0,0,0,0.06);transition:box-shadow .2s;}
  .feat-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);}

  /* ── Testimonial card ── */
  .testi-card{background:${C.white};border-radius:20px;padding:32px;border:1px solid rgba(0,0,0,0.06);flex:1;}

  /* ── Responsive ── */
  @media(max-width:768px){
    .hero-grid{flex-direction:column!important;padding:40px 16px 60px!important;}
    .hero-text{order:1;text-align:center;}
    .hero-img{order:2;}
    .hero-socials{display:none!important;}
    .hero-meta{display:none!important;}
    .hero-title{font-size:42px!important;}
    .stats-bar{flex-wrap:wrap!important;gap:0!important;}
    .stats-item{width:50%!important;border-right:none!important;}
    .why-grid{flex-direction:column!important;}
    .why-center{display:none!important;}
    .prod-grid{grid-template-columns:1fr!important;}
    .testi-row{flex-direction:column!important;}
    .sub-inner{flex-direction:column!important;gap:24px!important;text-align:center!important;}
    .footer-cols{flex-wrap:wrap!important;gap:32px!important;}
    .footer-col{width:45%!important;}
    .nav-links{display:none!important;}
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════════════════════
     NAV
══════════════════════════════════════════════════════════════════════════ -->
<nav style="background:${C.bg};border-bottom:1px solid rgba(0,0,0,0.07);position:sticky;top:0;z-index:100;">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:24px;">

    <!-- Logo -->
    <a href="#" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;color:${C.text};letter-spacing:-.01em;flex-shrink:0;">${data.product_name}</a>

    <!-- Liens centre -->
    <div class="nav-links" style="display:flex;align-items:center;gap:32px;">
      <a href="#why" class="nav-link">Ingredients</a>
      <a href="#products" class="nav-link">Store</a>
      <a href="#testimonials" class="nav-link">Blog</a>
      <a href="#subscribe" class="nav-link">About Us</a>
    </div>

    <!-- Icônes droite -->
    <div style="display:flex;align-items:center;gap:4px;">
      <button class="nav-icon" style="background:none;border:none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.text}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <button class="nav-icon" style="background:none;border:none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.text}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </button>
      <button class="nav-icon" style="background:none;border:none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.text}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>
    </div>
  </div>
</nav>


<!-- ══════════════════════════════════════════════════════════════════════════
     HERO
══════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};overflow:hidden;position:relative;">
  <div class="hero-grid" style="max-width:1200px;margin:0 auto;padding:56px 32px 80px;display:flex;align-items:center;gap:0;position:relative;">

    <!-- Liens sociaux verticaux gauche -->
    <div class="hero-socials" style="display:flex;flex-direction:column;align-items:center;gap:18px;position:absolute;left:0;top:50%;transform:translateY(-50%);">
      <div style="width:1px;height:40px;background:${C.muted};opacity:.3;"></div>
      <!-- Twitter -->
      <a href="#" style="opacity:.55;transition:opacity .2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.55'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${C.text}"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 11.08 8a12.8 12.8 0 0 1-9.29-4.71 4.52 4.52 0 0 0 1.4 6.03A4.47 4.47 0 0 1 1 8.78v.06a4.52 4.52 0 0 0 3.62 4.43 4.54 4.54 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.07 9.07 0 0 1 0 18.54a12.8 12.8 0 0 0 6.92 2"/></svg>
      </a>
      <!-- Instagram -->
      <a href="#" style="opacity:.55;transition:opacity .2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.55'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </a>
      <!-- Facebook -->
      <a href="#" style="opacity:.55;transition:opacity .2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.55'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${C.text}"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </a>
      <div style="width:1px;height:40px;background:${C.muted};opacity:.3;"></div>
    </div>

    <!-- Colonne texte -->
    <div class="hero-text" style="flex:1;padding-left:40px;padding-right:32px;z-index:2;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.orange};font-family:'DM Sans',sans-serif;margin-bottom:18px;">Hair Care · Premium · Organic</p>

      <h1 class="hero-title" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:68px;font-weight:600;line-height:1.0;letter-spacing:-.02em;color:${C.text};margin-bottom:20px;">
        Ultra<br/>${data.product_name}
      </h1>

      <p style="font-size:16px;color:${C.muted};line-height:1.75;max-width:420px;margin-bottom:36px;font-family:'DM Sans',sans-serif;">${data.subtitle || `Découvrez ${data.product_name}, la révolution capillaire qui nourrit, répare et sublime vos cheveux avec des ingrédients 100% organiques.`}</p>

      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <button class="btn-orange">
          Buy Now &nbsp;|&nbsp; ${price}€
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        ${savePct > 0 ? `<span style="font-size:13px;font-weight:700;color:${C.orange};font-family:'DM Sans',sans-serif;">-${savePct}% aujourd'hui</span>` : ''}
      </div>

      <!-- Note clients -->
      <div style="display:flex;align-items:center;gap:10px;margin-top:28px;">
        <span style="color:${C.orange};font-size:13px;letter-spacing:2px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">4.9/5 · 2 400+ avis</span>
      </div>
    </div>

    <!-- Colonne image centrale -->
    <div class="hero-img" style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;min-height:480px;">
      <!-- Grand cercle doré derrière -->
      <div style="position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,#F5D97A 0%,#E8C44A 60%,#D4A830 100%);opacity:.45;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0;"></div>

      <!-- Spark décoratifs autour du cercle -->
      <div style="position:absolute;top:12%;left:18%;z-index:1;">${SPARK}</div>
      <div style="position:absolute;top:22%;right:16%;z-index:1;">${SPARK_SM}</div>
      <div style="position:absolute;bottom:18%;left:14%;z-index:1;">${SPARK_SM}</div>
      <div style="position:absolute;bottom:10%;right:20%;z-index:1;">${SPARK}</div>

      <!-- Feuilles tropicales SVG gauche -->
      <svg style="position:absolute;left:-20px;bottom:20px;z-index:1;opacity:.7;" width="110" height="130" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 120 Q30 80 80 20 Q90 50 60 90 Q40 110 10 120Z" fill="#4A7C4E" opacity=".8"/>
        <path d="M5 125 Q50 90 90 30" stroke="#3A6B3E" stroke-width="1.5" fill="none" opacity=".6"/>
        <path d="M30 115 Q20 60 70 10 Q80 40 55 80 Q40 100 30 115Z" fill="#2D6A4F" opacity=".65"/>
        <path d="M35 118 Q25 65 75 15" stroke="#2D6A4F" stroke-width="1.5" fill="none" opacity=".5"/>
      </svg>

      <!-- Feuilles tropicales SVG droite -->
      <svg style="position:absolute;right:-20px;top:20px;z-index:1;opacity:.7;transform:scaleX(-1)rotate(20deg);" width="100" height="120" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 120 Q30 80 80 20 Q90 50 60 90 Q40 110 10 120Z" fill="#4A7C4E" opacity=".8"/>
        <path d="M5 125 Q50 90 90 30" stroke="#3A6B3E" stroke-width="1.5" fill="none" opacity=".6"/>
      </svg>

      <!-- Image produit -->
      <img src="${mainImg}" alt="${data.product_name}" style="position:relative;z-index:2;width:280px;height:340px;object-fit:contain;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.18));"/>
    </div>

    <!-- Meta droite : DESIGN / SIZE / COLOR -->
    <div class="hero-meta" style="display:flex;flex-direction:column;gap:20px;align-items:flex-start;z-index:2;padding-right:8px;">
      ${['DESIGN', 'SIZE', 'COLOR'].map(label => `
        <div style="writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);">
          <span style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};font-family:'DM Sans',sans-serif;">${label}</span>
        </div>
        <div style="width:1px;height:32px;background:${C.muted};opacity:.25;margin:0 auto;"></div>
      `).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     STATS BAR
══════════════════════════════════════════════════════════════════════════ -->
<section style="background:${C.dark};">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">
    <div class="stats-bar" style="display:flex;align-items:stretch;">
      ${[
        { label: 'INGREDIENTS', value: '100% Organic' },
        { label: 'MATERIAL', value: 'Beauty Grade' },
        { label: 'FLAVOR', value: '9 Variations' },
        { label: 'VOLUME', value: '100ml' },
        { label: 'DELIVERY', value: 'Free' },
      ].map((s, i) => `
        <div style="flex:1;padding:28px 20px;border-right:${i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none'};text-align:center;">
          <p style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);font-family:'DM Sans',sans-serif;margin-bottom:8px;">${s.label}</p>
          <p style="font-size:15px;font-weight:600;color:${C.white};font-family:'DM Sans',sans-serif;">${s.value}</p>
        </div>`).join('')}
    </div>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     WHY CHOOSE
══════════════════════════════════════════════════════════════════════════ -->
<section id="why" style="background:${C.white};padding:96px 0;">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">

    <!-- Header centré -->
    <div style="text-align:center;margin-bottom:72px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.orange};font-family:'DM Sans',sans-serif;margin-bottom:14px;">The Difference</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;font-weight:600;line-height:1.1;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;">Why Choose ${data.product_name}?</h2>
      <p style="color:${C.muted};font-size:16px;max-width:520px;margin:0 auto;font-family:'DM Sans',sans-serif;line-height:1.75;">${data.subtitle || 'Une formule d\'exception conçue par des experts pour des résultats visibles et durables.'}</p>
    </div>

    <!-- Layout 2 cartes | image | 2 cartes -->
    <div class="why-grid" style="display:flex;align-items:center;gap:40px;">

      <!-- Cartes gauche -->
      <div style="flex:1;display:flex;flex-direction:column;gap:20px;">
        ${featureItems.slice(0, 2).map(f => `
          <div class="feat-card">
            <div style="width:44px;height:44px;border-radius:50%;background:${f.bg};display:flex;align-items:center;justify-content:center;margin-bottom:14px;">${f.icon}</div>
            <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${C.text};margin-bottom:8px;">${f.title}</h3>
            <p style="font-size:13px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">${f.desc}</p>
          </div>`).join('')}
      </div>

      <!-- Image centrale avec sparks -->
      <div class="why-center" style="flex:0 0 280px;display:flex;align-items:center;justify-content:center;position:relative;">
        <!-- Cercle crème derrière -->
        <div style="position:absolute;width:260px;height:260px;border-radius:50%;background:${C.cream};z-index:0;"></div>
        <!-- Sparks oranges -->
        <div style="position:absolute;top:-10px;left:20px;z-index:2;">${SPARK}</div>
        <div style="position:absolute;top:20px;right:0px;z-index:2;">${SPARK_SM}</div>
        <div style="position:absolute;bottom:-10px;left:10px;z-index:2;">${SPARK_SM}</div>
        <div style="position:absolute;bottom:10px;right:-5px;z-index:2;">${SPARK}</div>
        <!-- Produit -->
        <img src="${productImg}" alt="${data.product_name}" style="position:relative;z-index:1;width:200px;height:260px;object-fit:contain;filter:drop-shadow(0 12px 28px rgba(0,0,0,0.15));"/>
      </div>

      <!-- Cartes droite -->
      <div style="flex:1;display:flex;flex-direction:column;gap:20px;">
        ${featureItems.slice(2, 4).map(f => `
          <div class="feat-card">
            <div style="width:44px;height:44px;border-radius:50%;background:${f.bg};display:flex;align-items:center;justify-content:center;margin-bottom:14px;">${f.icon}</div>
            <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${C.text};margin-bottom:8px;">${f.title}</h3>
            <p style="font-size:13px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">${f.desc}</p>
          </div>`).join('')}
      </div>

    </div>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     OUR PRODUCTS
══════════════════════════════════════════════════════════════════════════ -->
<section id="products" style="background:${C.bg};padding:96px 0;">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.orange};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Collection</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;font-weight:600;line-height:1.1;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;">Our Products</h2>
      <p style="color:${C.muted};font-size:16px;max-width:480px;margin:0 auto;font-family:'DM Sans',sans-serif;">Une gamme complète pour chaque type de cheveux et chaque besoin.</p>
    </div>

    <!-- Grille 2x2 -->
    <div class="prod-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      ${productCards.map(card => `
        <div class="prod-card">
          <!-- Demi-cercle crème avec image -->
          <div class="prod-card-half">
            <img src="${card.img}" alt="${card.title}"/>
            <!-- Badge prix étoile -->
            ${starBadge(card.price, card.starBg)}
          </div>
          <!-- Infos produit -->
          <div style="padding:20px 24px 24px;">
            <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${C.text};margin-bottom:6px;">${card.title}</h3>
            <p style="font-size:13px;color:${C.muted};line-height:1.7;font-family:'DM Sans',sans-serif;margin-bottom:14px;">${card.desc}</p>
            <a href="#" style="font-size:13px;font-weight:700;color:${C.orange};font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:6px;transition:gap .2s;" onmouseover="this.style.gap='10px'" onmouseout="this.style.gap='6px'">
              Order Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>`).join('')}
    </div>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════════════════════════════════ -->
<section id="testimonials" style="background:${C.white};padding:96px 0;">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.orange};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Témoignages</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;font-weight:600;line-height:1.1;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;">Testimonial</h2>
      <p style="color:${C.muted};font-size:16px;max-width:480px;margin:0 auto;font-family:'DM Sans',sans-serif;">Ce que nos clientes disent vraiment de ${data.product_name}.</p>
    </div>

    <!-- Cartes + dots -->
    <div style="display:flex;align-items:flex-start;gap:32px;">

      <!-- 2 cartes côte à côte -->
      <div class="testi-row" style="display:flex;gap:24px;flex:1;">
        ${testimonials.map(t => `
          <div class="testi-card">
            <!-- Étoiles -->
            <div style="display:flex;gap:3px;margin-bottom:18px;">
              ${'★★★★★'.split('').map(() => `<span style="color:${C.orange};font-size:15px;">★</span>`).join('')}
            </div>
            <!-- Citation -->
            <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-style:italic;font-weight:400;color:${C.text};line-height:1.7;margin-bottom:24px;">${t.text}</p>
            <!-- Auteur -->
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${t.avatar}" alt="${t.name}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;"/>
              <div>
                <p style="font-size:14px;font-weight:700;color:${C.orange};font-family:'DM Sans',sans-serif;">${t.name}</p>
                <p style="font-size:12px;color:${C.muted};font-family:'DM Sans',sans-serif;">Cliente vérifiée</p>
              </div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Dots navigation verticaux -->
      <div style="display:flex;flex-direction:column;gap:8px;padding-top:16px;flex-shrink:0;">
        <div style="width:10px;height:10px;border-radius:50%;background:${C.orange};"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:rgba(0,0,0,0.12);"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:rgba(0,0,0,0.12);"></div>
      </div>

    </div>

    <!-- Trust stats -->
    <div style="display:flex;align-items:center;justify-content:center;gap:48px;margin-top:60px;flex-wrap:wrap;">
      ${[
        { value: '2 400+', label: 'Avis clients' },
        { value: '4.9/5', label: 'Note moyenne' },
        { value: '98%', label: 'Clients satisfaits' },
        { value: '30j', label: 'Garantie remboursement' },
      ].map(s => `
        <div style="text-align:center;">
          <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:600;color:${C.orange};margin-bottom:4px;">${s.value}</p>
          <p style="font-size:12px;color:${C.muted};font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-family:'DM Sans',sans-serif;">${s.label}</p>
        </div>`).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     FAQ (si présente)
══════════════════════════════════════════════════════════════════════════ -->
${data.faq && data.faq.length > 0 ? `
<section style="background:${C.dark};padding:80px 0;">
  <div style="max-width:760px;margin:0 auto;padding:0 32px;">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.orange};font-family:'DM Sans',sans-serif;margin-bottom:14px;">FAQ</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;color:${C.white};">Questions fréquentes</h2>
    </div>
    ${faqHTML}
  </div>
</section>` : ''}


<!-- ══════════════════════════════════════════════════════════════════════════
     SUBSCRIBE
══════════════════════════════════════════════════════════════════════════ -->
<section id="subscribe" style="background:${C.dark};padding:72px 0;border-top:1px solid rgba(255,255,255,0.06);">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">
    <div class="sub-inner" style="display:flex;align-items:center;justify-content:space-between;gap:48px;">

      <!-- Texte gauche -->
      <div style="flex:1;">
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;color:${C.white};margin-bottom:10px;line-height:1.15;">Subscribe for Updates</h2>
        <p style="font-size:14px;color:rgba(255,255,255,0.55);font-family:'DM Sans',sans-serif;line-height:1.75;max-width:380px;">Recevez les nouvelles formules, promotions exclusives et conseils beauté capillaires en avant-première.</p>
      </div>

      <!-- Formulaire droite -->
      <div style="flex:1;max-width:440px;">
        <div style="display:flex;gap:0;border-radius:40px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            style="flex:1;background:none;border:none;outline:none;padding:14px 20px;font-size:14px;color:${C.white};font-family:'DM Sans',sans-serif;"
          />
          <button class="btn-orange" style="border-radius:40px;padding:14px 24px;white-space:nowrap;font-size:14px;">
            Subscribe
          </button>
        </div>
        <p style="font-size:11px;color:rgba(255,255,255,0.35);font-family:'DM Sans',sans-serif;margin-top:10px;padding-left:20px;">Pas de spam. Désabonnement en 1 clic.</p>
      </div>

    </div>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════════════════════════════════ -->
<footer style="background:${C.dark};border-top:1px solid rgba(255,255,255,0.06);padding:64px 0 32px;">
  <div style="max-width:1200px;margin:0 auto;padding:0 32px;">

    <!-- Colonnes -->
    <div class="footer-cols" style="display:flex;gap:48px;margin-bottom:56px;flex-wrap:nowrap;">

      <!-- Brand colonne -->
      <div style="flex:1.4;min-width:200px;">
        <a href="#" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:600;color:${C.white};display:block;margin-bottom:16px;">${data.product_name}</a>
        <p style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.8;font-family:'DM Sans',sans-serif;margin-bottom:20px;max-width:240px;">Votre partenaire beauté capillaire premium depuis 2020. Formulé avec amour, livré avec soin.</p>
        <!-- Contact -->
        <p style="font-size:12px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;margin-bottom:6px;">hello@${data.product_name.toLowerCase().replace(/\s/g,'')}.com</p>
        <p style="font-size:12px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;margin-bottom:20px;">+33 1 23 45 67 89</p>
        <!-- Socials -->
        <div style="display:flex;gap:12px;">
          ${[
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 11.08 8a12.8 12.8 0 0 1-9.29-4.71 4.52 4.52 0 0 0 1.4 6.03A4.47 4.47 0 0 1 1 8.78v.06a4.52 4.52 0 0 0 3.62 4.43 4.54 4.54 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.07 9.07 0 0 1 0 18.54a12.8 12.8 0 0 0 6.92 2"/></svg>`,
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
          ].map(icon => `
            <a href="#" style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;transition:background .2s;" onmouseover="this.style.background='${C.orange}'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">${icon}</a>`).join('')}
        </div>
      </div>

      <!-- 4 colonnes liens -->
      ${[
        { title: 'Blog', links: ['Conseils capillaires', 'Tendances 2026', 'Routines beauté', 'Interviews experts', 'Tutoriels vidéo'] },
        { title: 'About', links: ['Notre histoire', 'Nos valeurs', 'Équipe', 'Presse', 'Carrières'] },
        { title: 'Product', links: ['Gamme complète', 'Nouveautés', 'Bestsellers', 'Coffrets cadeaux', 'Abonnement'] },
        { title: 'Download App', links: ['App Store', 'Google Play', 'Suivre ma commande', 'Aide & Support', 'Contact'] },
      ].map(col => `
        <div class="footer-col" style="flex:1;min-width:120px;">
          <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.white};font-family:'DM Sans',sans-serif;margin-bottom:18px;">${col.title}</p>
          <ul style="list-style:none;">
            ${col.links.map(link => `
              <li style="margin-bottom:10px;">
                <a href="#" style="font-size:13px;color:rgba(255,255,255,0.45);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='${C.white}'" onmouseout="this.style.color='rgba(255,255,255,0.45)'">${link}</a>
              </li>`).join('')}
          </ul>
        </div>`).join('')}

    </div>

    <!-- Copyright -->
    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;">© 2026 ${data.product_name}. Tous droits réservés.</p>
      <div style="display:flex;gap:20px;">
        ${['Politique de confidentialité', 'CGV', 'Cookies'].map(link => `
          <a href="#" style="font-size:12px;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='rgba(255,255,255,0.7)'" onmouseout="this.style.color='rgba(255,255,255,0.3)'">${link}</a>`).join('')}
      </div>
    </div>

  </div>
</footer>

</body>
</html>`
}
