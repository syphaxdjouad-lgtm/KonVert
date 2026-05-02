import type { LandingPageData } from '@/types'
import { ico } from './icons'

import {
  renderStorySection,
  renderSocialProofBar,
  renderTestimonialsSection,
  renderComparisonSection,
  renderBonusesSection,
  renderGuaranteeSection,
  type SectionTheme,
} from './sections'
const IMGS = [
  'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=600'

const GLOW_THEME: SectionTheme = {
  primary:    '#ef4a65',
  accent:     '#fef1f3',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#fff9f5',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecGlow(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #F0E8E0;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-gl-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var arr=document.getElementById('arr-gl-${i}');arr.textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Nunito Sans',sans-serif;font-size:15px;font-weight:700;color:#111;">${f.question}</span>
        <span id="arr-gl-${i}" style="font-size:20px;color:#EF4A65;flex-shrink:0;margin-left:16px;font-weight:400;transition:transform .3s;">+</span>
      </button>
      <div id="faq-gl-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Nunito Sans',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const ritualSteps = [
    { step: '1', title: benefits[0] || 'Nettoyez', desc: 'Préparez votre peau avec un nettoyant doux' },
    { step: '2', title: benefits[1] || 'Appliquez', desc: `Déposez ${data.product_name} en mouvements circulaires` },
    { step: '3', title: benefits[2] || 'Rayonnez', desc: 'Profitez d\'un teint lumineux et éclatant' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Nunito Sans',sans-serif;background:#FFF9F5;color:#111;}
.gl-btn{background:linear-gradient(135deg,#EF4A65,#D63953);color:#fff;border:none;border-radius:15px;padding:18px 40px;font-family:'Nunito Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .3s;box-shadow:0 4px 16px rgba(239,74,101,0.25);}
.gl-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(239,74,101,0.35);}
.gl-btn-soft{background:#FFF0F2;color:#EF4A65;border:none;border-radius:15px;padding:16px 40px;font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;}
.gl-btn-soft:hover{background:#FFE0E5;}
@media(max-width:768px){
  .gl-hero-grid{flex-direction:column!important;}
  .gl-hero-media{width:100%!important;height:480px!important;}
  .gl-hero-info{width:100%!important;padding:32px 20px!important;}
  .gl-ritual-grid{grid-template-columns:1fr!important;}
  .gl-compare{flex-direction:column!important;}
  .gl-reviews-grid{grid-template-columns:1fr!important;}
  .gl-benefits-grid{grid-template-columns:1fr 1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR — SOFT PINK -->
<div style="background:linear-gradient(90deg,#EF4A65,#D63953);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:600;letter-spacing:0.04em;">
  ${data.urgency || 'Offre beauté — Livraison offerte + échantillon gratuit'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#FFF9F5;border-bottom:1px solid #F0E8E0;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#BBB;">Accueil</span>
    <span style="font-size:12px;color:#DDD;">›</span>
    <span style="font-size:12px;color:#BBB;">Skincare</span>
    <span style="font-size:12px;color:#DDD;">›</span>
    <span style="font-size:12px;color:#111;font-weight:600;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — BEAUTY EDITORIAL -->
<section style="background:#FFF9F5;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:640px;" class="gl-hero-grid">

    <!-- MEDIA -->
    <div style="width:55%;position:relative;overflow:hidden;border-radius:0 24px 24px 0;" class="gl-hero-media">
      <img id="mi-gl" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#EF4A65;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:15px;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-gl').src='${img}';document.querySelectorAll('.th-gl').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #EF4A65':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-gl" style="width:52px;height:52px;border-radius:12px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#EF4A65':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- INFO -->
    <div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="gl-hero-info">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
        <span style="color:#EF4A65;font-size:14px;">★★★★★</span>
        <span style="font-size:12px;color:#BBB;">4.9/5 — 2 340 avis</span>
      </div>
      <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#EF4A65;text-transform:uppercase;margin-bottom:10px;">Ritual Beauté</p>
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:600;color:#111;line-height:1.12;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h1>
      <p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>

      <!-- PRICE -->
      <div style="background:#FFF0F2;border-radius:15px;padding:16px 24px;display:inline-flex;align-items:baseline;gap:14px;margin-bottom:28px;">
        ${data.price ? `<span style="font-size:36px;font-weight:800;color:#EF4A65;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="font-size:12px;font-weight:700;color:#EF4A65;">Économisez ${+data.original_price! - +data.price!}€</span>` : ''}
      </div>

      <!-- BENEFITS TAGS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:28px;" class="gl-benefits-grid">
        ${benefits.map(b => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
          <span style="width:20px;height:20px;border-radius:50%;background:#FFF0F2;color:#EF4A65;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span>
          <span style="font-size:13px;color:#555;">${b}</span>
        </div>`).join('')}
      </div>

      <!-- CTAs -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="gl-btn" style="width:100%;text-align:center;font-size:16px;padding:18px;">
          ${data.cta || 'Ajouter au panier'} ✨
        </button>
        <button class="gl-btn-soft" style="width:100%;text-align:center;">
          Offrir en cadeau
        </button>
      </div>

      <!-- TRUST -->
      <div style="display:flex;gap:20px;margin-top:20px;justify-content:center;">
        <span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.leaf(13)} Clean</span>
        <span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.shield(13)} Certifié</span>
        <span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.truck(13)} Offerte</span>
        <span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.return(13)} 30j</span>
      </div>
    </div>
  </div>
</section>

<!-- RITUAL — 3 STEPS -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#EF4A65;text-align:center;text-transform:uppercase;margin-bottom:8px;">Votre routine</p>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#111;text-align:center;letter-spacing:-0.02em;margin-bottom:56px;">3 étapes pour un éclat radieux</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="gl-ritual-grid">
      ${ritualSteps.map(s => `
      <div style="background:#FFF9F5;border-radius:20px;padding:36px 28px;text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#EF4A65,#D63953);color:#fff;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">${s.step}</div>
        <h3 style="font-size:18px;font-weight:700;color:#111;margin-bottom:10px;">${s.title}</h3>
        <p style="font-size:14px;color:#888;line-height:1.7;">${s.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#FFF9F5;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#EF4A65;text-align:center;text-transform:uppercase;margin-bottom:8px;">Résultats prouvés</p>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#111;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Avant / Après 28 jours</h2>
    <div style="display:flex;gap:20px;" class="gl-compare">
      <div style="flex:1;position:relative;border-radius:20px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:350px;object-fit:cover;display:block;filter:saturate(0.5);" alt="Avant">
        <div style="position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;font-weight:700;padding:6px 16px;border-radius:15px;">AVANT</div>
      </div>
      <div style="flex:1;position:relative;border-radius:20px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:350px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:16px;left:16px;background:linear-gradient(135deg,#EF4A65,#D63953);color:#fff;font-size:11px;font-weight:700;padding:6px 16px;border-radius:15px;">APRÈS ✨</div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#EF4A65;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis vérifiés</p>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#111;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Elles ont dit oui à ${data.product_name}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="gl-reviews-grid">
      ${[
        { name: 'Amira L.', text: `Mon teint n'a jamais été aussi lumineux. Le ${data.product_name} est devenu mon indispensable. La texture est divine, ça sent incroyablement bon.`, date: '2 jours', badge: 'Peau sensible' },
        { name: 'Charlotte D.', text: `Résultat visible dès la première semaine ! Ma peau est plus douce, plus lisse. Les imperfections s'estompent visiblement. J'adore.`, date: '6 jours', badge: 'Peau mixte' },
        { name: 'Sarah K.', text: `Commandé en duo avec ma sœur. On est fan toutes les deux ! Le packaging est magnifique. Produit clean et efficace. Top.`, date: '12 jours', badge: 'Peau normale' },
      ].map(r => `
      <div style="background:#FFF9F5;border-radius:20px;padding:28px 24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span style="color:#EF4A65;font-size:13px;letter-spacing:2px;">★★★★★</span>
          <span style="background:#FFF0F2;color:#EF4A65;font-size:10px;font-weight:700;padding:4px 10px;border-radius:15px;">${r.badge}</span>
        </div>
        <p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#EF4A65,#D63953);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:700;color:#111;">${r.name}</p>
            <p style="font-size:11px;color:#BBB;">Il y a ${r.date} · Achat vérifié</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>


<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, GLOW_THEME)}
${renderStorySection(data, GLOW_THEME)}
${renderComparisonSection(data, GLOW_THEME)}
${renderTestimonialsSection(data, GLOW_THEME)}
${renderBonusesSection(data, GLOW_THEME)}
${renderGuaranteeSection(data, GLOW_THEME)}

<!-- FAQ -->
<section style="padding:80px 24px;background:#FFF9F5;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#EF4A65;text-align:center;text-transform:uppercase;margin-bottom:8px;">FAQ</p>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#111;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Vos questions</h2>
    <div style="background:#fff;border-radius:20px;padding:8px 32px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:linear-gradient(135deg,#EF4A65 0%,#D63953 100%);position:relative;overflow:hidden;">
  <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
  <div style="position:absolute;bottom:-60px;left:-60px;width:300px;height:300px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
  <div style="max-width:700px;margin:0 auto;text-align:center;position:relative;z-index:1;">
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;color:#fff;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(255,255,255,0.75);margin-bottom:36px;line-height:1.6;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:52px;font-weight:800;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:#EF4A65;border:none;border-radius:15px;padding:20px 56px;font-family:'Nunito Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.15);transition:transform .2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">${data.cta || 'Révéler mon éclat'} ✨</button>
    <p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Clean beauty · Livraison offerte · Satisfait ou remboursé</p>
  </div>
</section>

</body>
</html>`
}
