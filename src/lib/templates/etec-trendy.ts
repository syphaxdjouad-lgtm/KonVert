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
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600'

const TRENDY_THEME: SectionTheme = {
  primary:    '#319da0',
  accent:     '#eff7f7',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#fff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecTrendy(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #EBEBEB;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-tr-${i}');var a=document.getElementById('arr-tr-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(45deg)':'rotate(0deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Rubik',sans-serif;font-size:15px;font-weight:500;color:#222;">${f.question}</span>
        <span id="arr-tr-${i}" style="font-size:20px;color:#319da0;transition:transform .3s;flex-shrink:0;margin-left:16px;font-weight:300;">+</span>
      </button>
      <div id="faq-tr-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Rubik',sans-serif;font-size:14px;color:#666;line-height:1.7;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const tabContents = [
    { id: 'tab-tr-details', label: 'Détails', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">Conçu avec des matériaux premium pour un confort et un style incomparables. Coupe moderne pensée pour le quotidien. Finitions soignées, coutures renforcées.</p>` },
    { id: 'tab-tr-tailles', label: 'Guide tailles', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">XS : 34-36 · S : 36-38 · M : 38-40 · L : 40-42 · XL : 42-44. Coupe regular fit. En cas de doute, prenez une taille au-dessus pour un fit oversize tendance.</p>` },
    { id: 'tab-tr-livraison', label: 'Livraison & Retours', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">Livraison express 24-48h gratuite dès 60€. Retour gratuit sous 30 jours. Échanges illimités. Emballage fashion recyclable.</p>` },
  ]

  const stylePoints = [
    { title: benefits[0] || 'Coupe moderne', desc: data.subtitle || 'Silhouette flatteuse au quotidien' },
    { title: benefits[1] || 'Matière premium', desc: 'Toucher doux, résistant au lavage' },
    { title: benefits[2] || 'Polyvalent', desc: 'Du bureau au weekend, un seul look' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Rubik',sans-serif;background:#fff;color:#222;}
.tr-btn{background:#204a80;color:#fff;border:none;border-radius:4px;padding:16px 36px;font-family:'Rubik',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.tr-btn:hover{background:#319da0;transform:translateY(-1px);}
.tr-btn-alt{background:#f50381;color:#fff;border:none;border-radius:4px;padding:14px 36px;font-family:'Rubik',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.tr-btn-alt:hover{background:#d5026d;}
@media(max-width:768px){
  .tr-hero-grid{flex-direction:column!important;}
  .tr-hero-img{width:100%!important;min-height:420px!important;}
  .tr-hero-info{width:100%!important;padding:28px 20px!important;}
  .tr-style-grid{grid-template-columns:1fr!important;}
  .tr-look-grid{flex-direction:column!important;}
  .tr-reviews-grid{grid-template-columns:1fr!important;}
  .tr-trust-row{flex-wrap:wrap!important;gap:12px!important;}
}
</style>
</head>
<body>

<!-- PROMO BAR — GRADIENT -->
<div style="background:linear-gradient(90deg,#43cea2,#185b9d);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;letter-spacing:0.06em;">
  ${data.urgency || 'FLASH SALE — Jusqu\'a -50% sur toute la collection'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#fff;border-bottom:1px solid #EBEBEB;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#999;">Home</span>
    <span style="font-size:12px;color:#ddd;">/</span>
    <span style="font-size:12px;color:#999;">Collection</span>
    <span style="font-size:12px;color:#ddd;">/</span>
    <span style="font-size:12px;color:#222;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — FASHION SPLIT -->
<section style="background:#fff;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="tr-hero-grid">

    <!-- IMAGE COL -->
    <div style="width:58%;position:relative;background:#f3f3f3;overflow:hidden;" class="tr-hero-img">
      <img id="mi-tr" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;transition:opacity .3s;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;right:20px;background:#f50381;color:#fff;font-size:13px;font-weight:700;padding:8px 16px;border-radius:4px;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-tr').src='${img}';document.querySelectorAll('.th-tr').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #204a80':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-tr" style="width:56px;height:56px;border-radius:4px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#204a80':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- INFO COL -->
    <div style="width:42%;padding:48px 44px;display:flex;flex-direction:column;justify-content:center;" class="tr-hero-info">
      <p style="font-family:'Oswald',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.18em;color:#319da0;text-transform:uppercase;margin-bottom:12px;">Nouvelle collection</p>
      <h1 style="font-family:'Oswald',sans-serif;font-size:44px;font-weight:700;color:#222;line-height:1.1;letter-spacing:-0.01em;text-transform:uppercase;margin-bottom:14px;">${data.headline}</h1>
      <p style="font-size:15px;color:#666;line-height:1.65;margin-bottom:28px;">${data.subtitle}</p>

      <!-- PRICE -->
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:24px;">
        ${data.price ? `<span style="font-family:'Oswald',sans-serif;font-size:38px;font-weight:700;color:#222;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#999;text-decoration:line-through;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:#f50381;color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:3px;">SAVE ${savePct}%</span>` : ''}
      </div>

      <!-- BENEFITS -->
      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:10px;">
          <span style="color:#319da0;font-size:16px;font-weight:700;">✓</span>
          <span style="font-size:14px;color:#444;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <!-- CTAs -->
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <button class="tr-btn" style="flex:1;text-align:center;">
          ${data.cta || 'Ajouter au panier'}
        </button>
        <button class="tr-btn-alt" style="flex:1;text-align:center;">
          Acheter now
        </button>
      </div>

      <!-- TRUST -->
      <div style="display:flex;gap:20px;margin-top:20px;padding-top:16px;border-top:1px solid #EBEBEB;" class="tr-trust-row">
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Express 24h</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Paiement sécurisé</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour gratuit</span>
      </div>
    </div>
  </div>
</section>

<!-- STYLE POINTS — 3 COL -->
<section style="padding:80px 24px;background:#f3f3f3;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:'Oswald',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.18em;color:#319da0;text-align:center;text-transform:uppercase;margin-bottom:8px;">Pourquoi ce style</p>
    <h2 style="font-family:'Oswald',sans-serif;font-size:34px;font-weight:700;color:#222;text-align:center;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:56px;">${data.product_name} en détail</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="tr-style-grid">
      ${stylePoints.map((s, i) => `
      <div style="background:#fff;padding:36px 28px;border-radius:4px;border-top:3px solid ${['#204a80','#319da0','#f50381'][i]};">
        <span style="font-family:'Oswald',sans-serif;font-size:40px;font-weight:700;color:#f3f3f3;display:block;margin-bottom:8px;">0${i+1}</span>
        <h3 style="font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:#222;text-transform:uppercase;margin-bottom:10px;">${s.title}</h3>
        <p style="font-size:14px;color:#666;line-height:1.6;">${s.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#fff;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:2px solid #EBEBEB;margin-bottom:32px;gap:0;">
      ${tabContents.map((t, i) => `
      <button id="tbtn-tr-${i}" onclick="(function(){document.querySelectorAll('.tp-tr').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-tr').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #204a80':'2px solid transparent';b.style.color=j===${i}?'#204a80':'#999';b.style.marginBottom='-2px';});})()" class="tbtn-tr" style="padding:14px 24px;background:none;border:none;border-bottom:${i===0?'2px solid #204a80':'2px solid transparent'};color:${i===0?'#204a80':'#999'};font-family:'Rubik',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;margin-bottom:-2px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${tabContents.map((t, i) => `
    <div id="${t.id}" class="tp-tr" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- LOOKBOOK — AVANT / APRES -->
<section style="padding:80px 24px;background:#f9f9f9;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-family:'Oswald',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.18em;color:#319da0;text-align:center;text-transform:uppercase;margin-bottom:8px;">Lookbook</p>
    <h2 style="font-family:'Oswald',sans-serif;font-size:34px;font-weight:700;color:#222;text-align:center;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:48px;">Portez-le partout</h2>
    <div style="display:flex;gap:20px;" class="tr-look-grid">
      <div style="flex:1;position:relative;border-radius:4px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.7));">
          <p style="font-family:'Oswald',sans-serif;color:#fff;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Look Casual</p>
        </div>
      </div>
      <div style="flex:1;position:relative;border-radius:4px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.7));">
          <p style="font-family:'Oswald',sans-serif;color:#fff;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Look Soirée</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- AVIS CLIENTS -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:'Oswald',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.18em;color:#319da0;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-family:'Oswald',sans-serif;font-size:34px;font-weight:700;color:#222;text-align:center;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:48px;">Ils portent ${data.product_name}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="tr-reviews-grid">
      ${[
        { name: 'Yassine K.', text: `La coupe est parfaite, exactement comme sur les photos. Le ${data.product_name} est devenu ma pièce go-to. Qualité dingue pour le prix.`, date: '3 jours' },
        { name: 'Clara B.', text: `Commandé en S, taille parfaite. Le tissu est incroyable, tellement confortable. J'ai déjà commandé dans 2 autres couleurs.`, date: '1 semaine' },
        { name: 'Thomas L.', text: `Style impeccable, j'ai reçu plein de compliments. Livraison ultra rapide en plus. Je recommande à fond !`, date: '2 semaines' },
      ].map(r => `
      <div style="background:#f9f9f9;padding:28px 24px;border-radius:4px;border-left:3px solid #319da0;">
        <div style="color:#f50381;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div>
        <p style="font-size:14px;color:#444;line-height:1.75;margin-bottom:20px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;background:linear-gradient(135deg,#204a80,#319da0);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border-radius:50%;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:600;color:#222;">${r.name}</p>
            <p style="font-size:11px;color:#999;">Il y a ${r.date}</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>


<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, TRENDY_THEME)}
${renderStorySection(data, TRENDY_THEME)}
${renderComparisonSection(data, TRENDY_THEME)}
${renderTestimonialsSection(data, TRENDY_THEME)}
${renderBonusesSection(data, TRENDY_THEME)}
${renderGuaranteeSection(data, TRENDY_THEME)}

<!-- FAQ -->
<section style="padding:80px 24px;background:#f3f3f3;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-family:'Oswald',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.18em;color:#319da0;text-align:center;text-transform:uppercase;margin-bottom:8px;">FAQ</p>
    <h2 style="font-family:'Oswald',sans-serif;font-size:34px;font-weight:700;color:#222;text-align:center;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="background:#fff;border-radius:4px;padding:8px 28px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:80px 24px;background:linear-gradient(135deg,#204a80 0%,#185b9d 50%,#319da0 100%);">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <h2 style="font-family:'Oswald',sans-serif;font-size:40px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:32px;line-height:1.6;">${data.subtitle}</p>
    ${data.price ? `<p style="font-family:'Oswald',sans-serif;font-size:52px;font-weight:700;color:#fff;margin-bottom:32px;">${data.price}€</p>` : ''}
    <button style="background:#f50381;color:#fff;border:none;border-radius:4px;padding:18px 52px;font-family:'Rubik',sans-serif;font-size:15px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:background .3s;">${data.cta || 'Shopper maintenant'}</button>
    <p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Express 24h · Retour gratuit · Paiement sécurisé</p>
  </div>
</section>

</body>
</html>`
}
