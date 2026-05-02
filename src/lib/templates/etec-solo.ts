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
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4226897/pexels-photo-4226897.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=600'

const SOLO_THEME: SectionTheme = {
  primary:    '#334fb4',
  accent:     '#eff1f9',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#fff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecSolo(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #F2F2F7;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-so-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var arr=document.getElementById('arr-so-${i}');arr.textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Inter',sans-serif;font-size:16px;font-weight:600;color:#121212;">${f.question}</span>
        <span id="arr-so-${i}" style="font-size:22px;color:#334FB4;flex-shrink:0;margin-left:16px;font-weight:300;transition:transform .3s;">+</span>
      </button>
      <div id="faq-so-${i}" style="max-height:0;overflow:hidden;transition:max-height .4s ease,padding-top .4s ease;padding-top:0;">
        <p style="font-family:'Inter',sans-serif;font-size:14px;color:#6E6E73;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const features = [
    { icon: ico.flash(24), title: benefits[0] || 'Performance', desc: data.subtitle || 'Conçu pour dépasser vos attentes au quotidien' },
    { icon: ico.shield(24), title: benefits[1] || 'Qualité premium', desc: 'Matériaux sélectionnés avec exigence pour une durabilité maximale' },
    { icon: ico.trophy(24), title: benefits[2] || 'Design primé', desc: 'Esthétique moderne récompensée par les experts du design' },
    { icon: ico.leaf(24), title: benefits[3] || 'Éco-responsable', desc: 'Fabrication respectueuse de l\'environnement, emballage recyclable' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#fff;color:#121212;}
.so-btn{background:#121212;color:#fff;border:none;border-radius:2rem;padding:18px 40px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .3s;display:inline-flex;align-items:center;gap:8px;}
.so-btn:hover{background:#334FB4;transform:translateY(-2px);box-shadow:0 8px 24px rgba(51,79,180,0.25);}
.so-fade{opacity:0;transform:translateY(20px);animation:soFadeUp .6s ease forwards;}
@keyframes soFadeUp{to{opacity:1;transform:translateY(0);}}
@media(max-width:768px){
  .so-hero-grid{flex-direction:column!important;}
  .so-hero-media{width:100%!important;height:500px!important;}
  .so-hero-content{width:100%!important;padding:32px 20px!important;}
  .so-feat-grid{grid-template-columns:1fr 1fr!important;}
  .so-compare{flex-direction:column!important;}
  .so-reviews-grid{grid-template-columns:1fr!important;}
  .so-stats{flex-wrap:wrap!important;}
  .so-stats>div{flex:1 1 45%!important;}
}
@media(max-width:480px){
  .so-feat-grid{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- ANNOUNCEMENT -->
<div style="background:#121212;color:#fff;text-align:center;padding:12px 20px;font-size:13px;font-weight:500;">
  ${data.urgency || 'Edition limitée — Stock en cours d\'épuisement'}
</div>

<!-- HERO — FULL WIDTH IMMERSIVE -->
<section style="background:#fff;">
  <div style="display:flex;align-items:stretch;min-height:680px;" class="so-hero-grid">

    <!-- MEDIA -->
    <div style="width:55%;position:relative;background:#F3F3F3;overflow:hidden;" class="so-hero-media">
      <img id="mi-so" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:24px;left:24px;background:#334FB4;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:2rem;letter-spacing:0.05em;">-${savePct}% OFFERT</div>` : ''}
      <!-- THUMBNAILS -->
      <div style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:10px;background:rgba(255,255,255,0.9);padding:8px 12px;border-radius:2rem;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-so').src='${img}';document.querySelectorAll('.th-so').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #334FB4':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-so" style="width:48px;height:48px;border-radius:50%;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#334FB4':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- CONTENT -->
    <div style="width:45%;padding:56px 52px;display:flex;flex-direction:column;justify-content:center;" class="so-hero-content">
      <div class="so-fade">
        <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#334FB4;text-transform:uppercase;margin-bottom:16px;">Le produit unique</p>
        <h1 style="font-size:46px;font-weight:900;color:#121212;line-height:1.08;letter-spacing:-0.04em;margin-bottom:16px;">${data.headline}</h1>
        <p style="font-size:16px;color:#6E6E73;line-height:1.65;margin-bottom:32px;">${data.subtitle}</p>

        <!-- PRICE -->
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px;">
          ${data.price ? `<span style="font-size:40px;font-weight:900;color:#121212;">${data.price}€</span>` : ''}
          ${data.original_price ? `<span style="font-size:20px;color:#999;text-decoration:line-through;">${data.original_price}€</span>` : ''}
        </div>

        <!-- BENEFITS COMPACT -->
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px;">
          ${benefits.map(b => `
          <span style="background:#F3F3F3;padding:8px 16px;border-radius:2rem;font-size:13px;font-weight:500;color:#444;">${b}</span>`).join('')}
        </div>

        <!-- CTA -->
        <button class="so-btn" style="width:100%;justify-content:center;font-size:16px;padding:20px 40px;">
          ${data.cta || 'Commander maintenant'} →
        </button>

        <!-- TRUST -->
        <div style="display:flex;gap:24px;margin-top:24px;justify-content:center;">
          <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Livraison offerte</span>
          <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Paiement sécurisé</span>
          <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS BAR -->
<section style="background:#121212;padding:40px 24px;">
  <div style="max-width:900px;margin:0 auto;display:flex;justify-content:space-around;text-align:center;" class="so-stats">
    <div>
      <p style="font-size:36px;font-weight:900;color:#fff;">12K+</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Clients satisfaits</p>
    </div>
    <div>
      <p style="font-size:36px;font-weight:900;color:#334FB4;">4.9★</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Note moyenne</p>
    </div>
    <div>
      <p style="font-size:36px;font-weight:900;color:#fff;">98%</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Recommandent</p>
    </div>
    <div>
      <p style="font-size:36px;font-weight:900;color:#334FB4;">24h</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Expédition</p>
    </div>
  </div>
</section>

<!-- FEATURES — 2x2 GRID -->
<section style="padding:80px 24px;background:#FAFAFA;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Pourquoi ${data.product_name}</p>
    <h2 style="font-size:36px;font-weight:900;color:#121212;text-align:center;letter-spacing:-0.03em;margin-bottom:56px;">Conçu pour l'excellence</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="so-feat-grid">
      ${features.map(f => `
      <div style="background:#fff;border-radius:2rem;padding:36px 32px;border:1px solid #F2F2F7;transition:transform .2s,box-shadow .2s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.06)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none';">
        <div style="width:48px;height:48px;border-radius:12px;background:#F3F3F3;display:flex;align-items:center;justify-content:center;color:#334FB4;margin-bottom:20px;">${f.icon}</div>
        <h3 style="font-size:18px;font-weight:700;color:#121212;margin-bottom:8px;">${f.title}</h3>
        <p style="font-size:14px;color:#6E6E73;line-height:1.7;">${f.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Transformation</p>
    <h2 style="font-size:36px;font-weight:900;color:#121212;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Avant / Après</h2>
    <div style="display:flex;gap:20px;" class="so-compare">
      <div style="flex:1;position:relative;border-radius:2rem;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:saturate(0.5) brightness(0.9);" alt="Avant">
        <div style="position:absolute;top:20px;left:20px;background:rgba(18,18,18,0.8);color:#fff;font-size:11px;font-weight:700;padding:6px 16px;border-radius:2rem;letter-spacing:0.08em;">AVANT</div>
      </div>
      <div style="flex:1;position:relative;border-radius:2rem;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:20px;left:20px;background:#334FB4;color:#fff;font-size:11px;font-weight:700;padding:6px 16px;border-radius:2rem;letter-spacing:0.08em;">APRÈS</div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#FAFAFA;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-size:36px;font-weight:900;color:#121212;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Ils l'ont adopté</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="so-reviews-grid">
      ${[
        { name: 'Alexandre D.', text: `Le seul produit dont j'ai besoin. Le ${data.product_name} remplace tout ce que j'avais avant. Qualité exceptionnelle.`, date: 'Il y a 2 jours' },
        { name: 'Marine C.', text: `Bluffée par la qualité. Je l'utilise quotidiennement et il est toujours impeccable. Un investissement qui vaut chaque centime.`, date: 'Il y a 5 jours' },
        { name: 'Hugo P.', text: `Design magnifique et performance au top. J'ai déjà converti 3 amis. Service client au top aussi !`, date: 'Il y a 10 jours' },
      ].map(r => `
      <div style="background:#fff;border-radius:2rem;padding:28px 24px;border:1px solid #F2F2F7;">
        <div style="color:#334FB4;font-size:14px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div>
        <p style="font-size:14px;color:#444;line-height:1.75;margin-bottom:20px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid #F2F2F7;">
          <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#121212,#334FB4);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:700;color:#121212;">${r.name}</p>
            <p style="font-size:11px;color:#999;">${r.date} · ✓ Achat vérifié</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>


<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, SOLO_THEME)}
${renderStorySection(data, SOLO_THEME)}
${renderComparisonSection(data, SOLO_THEME)}
${renderTestimonialsSection(data, SOLO_THEME)}
${renderBonusesSection(data, SOLO_THEME)}
${renderGuaranteeSection(data, SOLO_THEME)}

<!-- FAQ -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">FAQ</p>
    <h2 style="font-size:36px;font-weight:900;color:#121212;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="background:#FAFAFA;border-radius:2rem;padding:8px 32px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#121212;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(51,79,180,0.15),transparent);border-radius:50%;"></div>
  <div style="position:absolute;bottom:-80px;left:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(51,79,180,0.1),transparent);border-radius:50%;"></div>
  <div style="max-width:700px;margin:0 auto;text-align:center;position:relative;z-index:1;">
    <h2 style="font-size:42px;font-weight:900;color:#fff;letter-spacing:-0.04em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:16px;color:rgba(255,255,255,0.6);margin-bottom:36px;line-height:1.6;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:52px;font-weight:900;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button class="so-btn" style="background:#334FB4;font-size:16px;padding:20px 56px;">
      ${data.cta || 'Obtenir le mien'} →
    </button>
    <p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;">Livraison offerte · Satisfait ou remboursé · Paiement sécurisé</p>
  </div>
</section>

</body>
</html>`
}
