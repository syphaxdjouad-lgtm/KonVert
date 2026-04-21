import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1619651/pexels-photo-1619651.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecPrestige(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid rgba(221,29,29,0.1);overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-pr-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'14px';var arr=document.getElementById('arr-pr-${i}');arr.style.transform=open?'rotate(0deg)':'rotate(180deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:22px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#2E2A39;">${f.question}</span>
        <span id="arr-pr-${i}" style="font-size:16px;color:#DD1D1D;transition:transform .3s;flex-shrink:0;margin-left:16px;">▾</span>
      </button>
      <div id="faq-pr-${i}" style="max-height:0;overflow:hidden;transition:max-height .4s ease,padding-top .4s ease;padding-top:0;">
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#777;line-height:1.8;padding-bottom:22px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const pillars = [
    { num: '01', title: benefits[0] || 'Savoir-faire', desc: data.subtitle || 'Chaque détail est pensé avec une précision artisanale' },
    { num: '02', title: benefits[1] || 'Matériaux nobles', desc: 'Sélection rigoureuse des meilleures matières premières' },
    { num: '03', title: benefits[2] || 'Exclusivité', desc: 'Production limitée pour une expérience unique et rare' },
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FDFBF7;color:#2E2A39;}
.pr-btn{background:#DD1D1D;color:#FDFBF7;border:none;border-radius:0;padding:18px 44px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.pr-btn:hover{background:#B81818;transform:translateY(-1px);}
.pr-btn-ghost{background:transparent;color:#2E2A39;border:1.5px solid #2E2A39;border-radius:0;padding:16px 44px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.pr-btn-ghost:hover{background:#2E2A39;color:#FDFBF7;}
@media(max-width:768px){
  .pr-hero-grid{flex-direction:column!important;}
  .pr-hero-media{width:100%!important;height:480px!important;}
  .pr-hero-info{width:100%!important;padding:36px 20px!important;}
  .pr-pillars{grid-template-columns:1fr!important;}
  .pr-compare{flex-direction:column!important;}
  .pr-reviews-grid{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR -->
<div style="background:#2E2A39;color:#FDFBF7;text-align:center;padding:11px 20px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">
  ${data.urgency || 'Édition exclusive — Quantités très limitées'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#FDFBF7;border-bottom:1px solid rgba(46,42,57,0.08);padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:10px;">
    <span style="font-size:11px;color:#999;letter-spacing:0.06em;">Accueil</span>
    <span style="font-size:11px;color:#DDD;">·</span>
    <span style="font-size:11px;color:#999;letter-spacing:0.06em;">Collection</span>
    <span style="font-size:11px;color:#DDD;">·</span>
    <span style="font-size:11px;color:#2E2A39;font-weight:600;letter-spacing:0.06em;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — PRESTIGE SPLIT -->
<section style="background:#FDFBF7;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:640px;" class="pr-hero-grid">

    <!-- MEDIA -->
    <div style="width:55%;position:relative;overflow:hidden;" class="pr-hero-media">
      <img id="mi-pr" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:24px;left:24px;background:#DD1D1D;color:#fff;font-size:11px;font-weight:700;padding:8px 18px;letter-spacing:0.1em;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-pr').src='${img}';document.querySelectorAll('.th-pr').forEach(function(t,j){t.style.border=j===${i}?'2px solid #DD1D1D':'2px solid rgba(255,255,255,0.5)';t.style.opacity=j===${i}?'1':'.6';});" class="th-pr" style="width:52px;height:52px;overflow:hidden;cursor:pointer;border:2px solid ${i===0?'#DD1D1D':'rgba(255,255,255,0.5)'};opacity:${i===0?1:.6};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- INFO -->
    <div style="width:45%;padding:56px 52px;display:flex;flex-direction:column;justify-content:center;" class="pr-hero-info">
      <div style="width:40px;height:2px;background:#DD1D1D;margin-bottom:20px;"></div>
      <p style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:#DD1D1D;text-transform:uppercase;margin-bottom:12px;">Collection Prestige</p>
      <h1 style="font-family:'DM Serif Display',serif;font-size:44px;color:#2E2A39;line-height:1.1;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h1>
      <p style="font-size:15px;color:#777;line-height:1.7;margin-bottom:32px;">${data.subtitle}</p>

      <!-- PRICE -->
      <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(46,42,57,0.08);">
        ${data.price ? `<span style="font-family:'DM Serif Display',serif;font-size:38px;color:#2E2A39;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#BBB;text-decoration:line-through;">${data.original_price}€</span>` : ''}
      </div>

      <!-- BENEFITS -->
      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:12px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:12px;">
          <span style="width:8px;height:1px;background:#DD1D1D;flex-shrink:0;"></span>
          <span style="font-size:14px;color:#555;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <!-- CTAs -->
      <div style="display:flex;gap:12px;">
        <button class="pr-btn" style="flex:1;text-align:center;">
          ${data.cta || 'Ajouter au panier'}
        </button>
        <button class="pr-btn-ghost" style="flex:1;text-align:center;">
          En savoir plus
        </button>
      </div>

      <!-- TRUST -->
      <div style="display:flex;gap:24px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(46,42,57,0.08);">
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.04em;">${ico.shield(14)} Authentique</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.04em;">${ico.truck(14)} Express</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.04em;">${ico.return(14)} 30 jours</span>
      </div>
    </div>
  </div>
</section>

<!-- PILLARS — PRESTIGE 3 COL -->
<section style="padding:80px 24px;background:#F3F3F3;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:56px;">
      <div style="width:40px;height:2px;background:#DD1D1D;margin:0 auto 16px;"></div>
      <p style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:#DD1D1D;text-transform:uppercase;margin-bottom:8px;">L'excellence</p>
      <h2 style="font-family:'DM Serif Display',serif;font-size:34px;color:#2E2A39;letter-spacing:-0.02em;">Les piliers de ${data.product_name}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;" class="pr-pillars">
      ${pillars.map(p => `
      <div style="background:#FDFBF7;padding:44px 36px;">
        <span style="font-family:'DM Serif Display',serif;font-size:48px;color:rgba(221,29,29,0.1);">${p.num}</span>
        <h3 style="font-size:18px;font-weight:700;color:#2E2A39;margin:12px 0 10px;">${p.title}</h3>
        <p style="font-size:14px;color:#777;line-height:1.7;">${p.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:64px 24px;background:#FDFBF7;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;gap:0;margin-bottom:32px;">
      ${[
        { id: 'tab-pr-craft', label: 'Fabrication', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Chaque pièce est fabriquée avec un savoir-faire d'exception. Nos artisans sélectionnent les matériaux les plus nobles et appliquent des techniques éprouvées pour garantir une qualité irréprochable.</p>` },
        { id: 'tab-pr-garantie', label: 'Garantie', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Garantie satisfait ou remboursé pendant 30 jours. Garantie fabricant 2 ans. Notre service client premium est disponible 7j/7 pour vous accompagner.</p>` },
        { id: 'tab-pr-livraison', label: 'Livraison', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Livraison express offerte. Emballage cadeau premium inclus. Suivi en temps réel. Livraison en Europe sous 2-4 jours ouvrés.</p>` },
      ].map((t, i) => `
      <button onclick="(function(){document.querySelectorAll('.tp-pr').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-pr').forEach(function(b,j){b.style.background=j===${i}?'#2E2A39':'transparent';b.style.color=j===${i}?'#FDFBF7':'#999';});})()" class="tbtn-pr" style="padding:12px 28px;background:${i===0?'#2E2A39':'transparent'};color:${i===0?'#FDFBF7':'#999'};border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${[
      { id: 'tab-pr-craft', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Chaque pièce est fabriquée avec un savoir-faire d'exception. Nos artisans sélectionnent les matériaux les plus nobles et appliquent des techniques éprouvées pour garantir une qualité irréprochable.</p>` },
      { id: 'tab-pr-garantie', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Garantie satisfait ou remboursé pendant 30 jours. Garantie fabricant 2 ans. Notre service client premium est disponible 7j/7 pour vous accompagner.</p>` },
      { id: 'tab-pr-livraison', content: `<p style="font-size:14px;color:#777;line-height:1.8;margin:0;">Livraison express offerte. Emballage cadeau premium inclus. Suivi en temps réel. Livraison en Europe sous 2-4 jours ouvrés.</p>` },
    ].map((t, i) => `
    <div id="${t.id}" class="tp-pr" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#F3F3F3;">
  <div style="max-width:1000px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <div style="width:40px;height:2px;background:#DD1D1D;margin:0 auto 16px;"></div>
      <h2 style="font-family:'DM Serif Display',serif;font-size:34px;color:#2E2A39;letter-spacing:-0.02em;">La différence Prestige</h2>
    </div>
    <div style="display:flex;gap:2px;" class="pr-compare">
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;filter:saturate(0.4) brightness(0.85);" alt="Standard">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:24px;background:linear-gradient(transparent,rgba(0,0,0,0.7));">
          <p style="color:#fff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Standard</p>
        </div>
      </div>
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Prestige">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:24px;background:linear-gradient(transparent,rgba(221,29,29,0.8));">
          <p style="color:#fff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Prestige</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#FDFBF7;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <div style="width:40px;height:2px;background:#DD1D1D;margin:0 auto 16px;"></div>
      <p style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:#DD1D1D;text-transform:uppercase;margin-bottom:8px;">Témoignages</p>
      <h2 style="font-family:'DM Serif Display',serif;font-size:34px;color:#2E2A39;">Nos clients témoignent</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="pr-reviews-grid">
      ${[
        { name: 'Isabelle V.', text: `Un produit d'exception. Le ${data.product_name} respire la qualité. Chaque détail est soigné. Un achat que je ne regrette absolument pas.`, date: 'Il y a 4 jours' },
        { name: 'Philippe M.', text: `La finition est remarquable. On sent le savoir-faire derrière chaque aspect. Le service client est tout aussi premium que le produit.`, date: 'Il y a 1 semaine' },
        { name: 'Nathalie R.', text: `Offert pour un anniversaire. L'emballage cadeau était sublime. Le produit a fait sensation. Merci pour cette expérience luxe !`, date: 'Il y a 2 semaines' },
      ].map(r => `
      <div style="background:#fff;padding:32px 28px;border:1px solid rgba(46,42,57,0.06);">
        <div style="color:#DD1D1D;font-size:12px;letter-spacing:3px;margin-bottom:16px;">★★★★★</div>
        <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:24px;font-style:italic;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid rgba(46,42,57,0.06);">
          <div style="width:38px;height:38px;background:#2E2A39;color:#FDFBF7;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:700;color:#2E2A39;">${r.name}</p>
            <p style="font-size:11px;color:#999;">${r.date}</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F3F3F3;">
  <div style="max-width:700px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <div style="width:40px;height:2px;background:#DD1D1D;margin:0 auto 16px;"></div>
      <h2 style="font-family:'DM Serif Display',serif;font-size:34px;color:#2E2A39;">Questions fréquentes</h2>
    </div>
    <div style="background:#FDFBF7;padding:8px 36px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#2E2A39;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <div style="width:40px;height:2px;background:#DD1D1D;margin:0 auto 24px;"></div>
    <h2 style="font-family:'DM Serif Display',serif;font-size:40px;color:#FDFBF7;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(253,251,247,0.5);margin-bottom:36px;line-height:1.7;">${data.subtitle}</p>
    ${data.price ? `<p style="font-family:'DM Serif Display',serif;font-size:52px;color:#FDFBF7;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button class="pr-btn" style="font-size:14px;padding:20px 56px;">${data.cta || 'Acquérir maintenant'}</button>
    <p style="font-size:11px;color:rgba(253,251,247,0.3);margin-top:24px;letter-spacing:0.06em;">Livraison premium offerte · Garantie 2 ans · Retour 30 jours</p>
  </div>
</section>

</body>
</html>`
}
