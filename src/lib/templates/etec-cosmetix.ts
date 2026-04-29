import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecCosmetix(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E8E4DF;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-cx-${i}');var a=document.getElementById('arr-cx-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(180deg)':'rotate(0deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#121212;">${f.question}</span>
        <span id="arr-cx-${i}" style="font-size:18px;color:#999;transition:transform .3s;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-cx-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#666;line-height:1.7;padding-bottom:18px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const tabContents = [
    { id: 'tab-cx-garantie', label: 'Garantie', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">Satisfait ou remboursé pendant 30 jours. Retournez le produit dans son emballage d'origine pour un remboursement intégral. Nos formules sont dermatologiquement testées et certifiées.</p>` },
    { id: 'tab-cx-compo', label: 'Composition', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">Formule clean, sans parabènes, sans sulfates, sans silicones. Ingrédients d'origine naturelle soigneusement sélectionnés. Testé dermatologiquement. Convient aux peaux sensibles.</p>` },
    { id: 'tab-cx-livraison', label: 'Livraison', content: `<p style="font-size:14px;color:#666;line-height:1.7;margin:0;">Livraison offerte dès 40€. Expédition sous 24h en jours ouvrés. Emballage recyclable et éco-responsable. Suivi en temps réel par email.</p>` },
  ]

  const ingredients = [
    { name: benefits[0] || 'Acide Hyaluronique', desc: data.subtitle || 'Hydratation intense et durable' },
    { name: benefits[1] || 'Vitamine C', desc: 'Éclat naturel et anti-oxydant' },
    { name: benefits[2] || 'Niacinamide', desc: 'Pores resserrés, teint uniforme' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FEFCFA;color:#121212;}
.cx-btn{background:#121212;color:#fff;border:none;border-radius:0;padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background .3s,transform .15s;}
.cx-btn:hover{background:#334FB4;transform:translateY(-1px);}
.cx-btn-outline{background:transparent;color:#121212;border:1.5px solid #121212;border-radius:0;padding:14px 36px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.cx-btn-outline:hover{background:#121212;color:#fff;}
@media(max-width:768px){
  .cx-hero-grid{flex-direction:column!important;}
  .cx-hero-img{width:100%!important;min-height:400px!important;}
  .cx-hero-info{width:100%!important;padding:32px 20px!important;}
  .cx-ingr-grid{grid-template-columns:1fr!important;}
  .cx-before-after{flex-direction:column!important;}
  .cx-reviews-grid{grid-template-columns:1fr!important;}
  .cx-trust-row{flex-wrap:wrap!important;}
}
</style>
</head>
<body>

<!-- TOP BAR -->
<div style="background:#121212;color:#fff;text-align:center;padding:10px 20px;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;">
  ${data.urgency || 'Offre exclusive — Livraison offerte aujourd\'hui'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#FEFCFA;border-bottom:1px solid #E8E4DF;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#999;">Accueil</span>
    <span style="font-size:12px;color:#CCC;">—</span>
    <span style="font-size:12px;color:#999;">Soins</span>
    <span style="font-size:12px;color:#CCC;">—</span>
    <span style="font-size:12px;color:#121212;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — EDITORIAL SPLIT -->
<section style="background:#FEFCFA;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:600px;" class="cx-hero-grid">

    <!-- IMAGE -->
    <div style="width:55%;position:relative;overflow:hidden;" class="cx-hero-img">
      <img id="mi-cx" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:500px;" alt="${data.product_name}">
      <div style="position:absolute;bottom:24px;left:24px;display:flex;gap:6px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-cx').src='${img}';document.querySelectorAll('.th-cx').forEach(function(t,j){t.style.border=j===${i}?'2px solid #121212':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-cx" style="width:48px;height:48px;overflow:hidden;cursor:pointer;border:2px solid ${i===0?'#121212':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- INFO -->
    <div style="width:45%;padding:56px 48px;display:flex;flex-direction:column;justify-content:center;background:#FEFCFA;" class="cx-hero-info">
      ${savePct > 0 ? `<span style="display:inline-block;background:#334FB4;color:#fff;font-size:11px;font-weight:700;padding:5px 14px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;width:fit-content;">-${savePct}%</span>` : ''}
      <p style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-transform:uppercase;margin-bottom:12px;">Collection Soins</p>
      <h1 style="font-family:'Playfair Display',serif;font-size:42px;font-weight:600;color:#121212;line-height:1.15;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h1>
      <p style="font-size:15px;color:#666;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>

      <!-- PRICE -->
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">
        ${data.price ? `<span style="font-size:36px;font-weight:700;color:#121212;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#999;text-decoration:line-through;">${data.original_price}€</span>` : ''}
      </div>

      <!-- BENEFITS -->
      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:12px;">
          <span style="width:6px;height:6px;background:#334FB4;border-radius:50%;flex-shrink:0;"></span>
          <span style="font-size:14px;color:#444;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <!-- CTAs -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button class="cx-btn" style="width:100%;text-align:center;">
          ${data.cta || 'Ajouter au panier'}
        </button>
        <button class="cx-btn-outline" style="width:100%;text-align:center;">
          Acheter maintenant
        </button>
      </div>

      <!-- TRUST -->
      <div style="display:flex;gap:24px;margin-top:24px;padding-top:20px;border-top:1px solid #E8E4DF;" class="cx-trust-row">
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.03em;">${ico.leaf(14)} Naturel</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.03em;">${ico.shield(14)} Certifié</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.03em;">${ico.truck(14)} Offerte</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:6px;letter-spacing:0.03em;">${ico.return(14)} 30 jours</span>
      </div>
    </div>
  </div>
</section>

<!-- INGREDIENTS — 3 COL CLEAN -->
<section style="padding:80px 24px;background:#F6F3EF;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Ingrédients clés</p>
    <h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:56px;">Ce qui rend ${data.product_name} unique</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="cx-ingr-grid">
      ${ingredients.map((ing, i) => `
      <div style="background:#fff;padding:40px 32px;text-align:center;border:1px solid #E8E4DF;">
        <span style="font-size:32px;font-weight:300;color:#334FB4;display:block;margin-bottom:16px;">0${i+1}</span>
        <h3 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:#121212;margin-bottom:12px;">${ing.name}</h3>
        <p style="font-size:14px;color:#666;line-height:1.6;">${ing.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#FEFCFA;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:1px solid #E8E4DF;margin-bottom:32px;gap:0;">
      ${tabContents.map((t, i) => `
      <button id="tbtn-cx-${i}" onclick="(function(){document.querySelectorAll('.tp-cx').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-cx').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #121212':'2px solid transparent';b.style.color=j===${i}?'#121212':'#999';b.style.marginBottom='-1px';});})()" class="tbtn-cx" style="padding:14px 28px;background:none;border:none;border-bottom:${i===0?'2px solid #121212':'2px solid transparent'};color:${i===0?'#121212':'#999'};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;margin-bottom:-1px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${tabContents.map((t, i) => `
    <div id="${t.id}" class="tp-cx" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#F6F3EF;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Résultats visibles</p>
    <h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Avant / Après 4 semaines</h2>
    <div style="display:flex;gap:24px;" class="cx-before-after">
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:saturate(0.5);" alt="Avant">
        <div style="position:absolute;top:16px;left:16px;background:#121212;color:#fff;font-size:11px;font-weight:600;padding:6px 16px;letter-spacing:0.1em;text-transform:uppercase;">Avant</div>
      </div>
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:16px;left:16px;background:#334FB4;color:#fff;font-size:11px;font-weight:600;padding:6px 16px;letter-spacing:0.1em;text-transform:uppercase;">Après</div>
      </div>
    </div>
  </div>
</section>

<!-- AVIS CLIENTS -->
<section style="padding:80px 24px;background:#FEFCFA;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Témoignages</p>
    <h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Elles adorent ${data.product_name}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="cx-reviews-grid">
      ${[
        { name: 'Camille R.', text: `Ma peau n'a jamais été aussi lumineuse. Le ${data.product_name} a changé ma routine beauté. Texture divine, résultat visible en 2 semaines.`, date: 'Il y a 3 jours' },
        { name: 'Léa M.', text: `Enfin un produit qui tient ses promesses. Peau douce, hydratée, zéro tiraillement. Je ne peux plus m'en passer !`, date: 'Il y a 1 semaine' },
        { name: 'Inès D.', text: `Offert à ma mère, elle est conquise. Le packaging est magnifique, la formule ultra-douce. On recommande !`, date: 'Il y a 2 semaines' },
      ].map(r => `
      <div style="background:#F6F3EF;padding:32px 28px;border:1px solid #E8E4DF;">
        <div style="color:#D4A853;font-size:13px;letter-spacing:3px;margin-bottom:16px;">★★★★★</div>
        <p style="font-size:14px;color:#444;line-height:1.75;margin-bottom:20px;font-style:italic;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;background:#334FB4;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border-radius:50%;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:600;color:#121212;">${r.name}</p>
            <p style="font-size:11px;color:#999;">${r.date} · Achat vérifié</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F6F3EF;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Questions</p>
    <h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Foire aux questions</h2>
    <div style="background:#FEFCFA;border:1px solid #E8E4DF;padding:8px 32px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:80px 24px;background:#121212;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;color:#334FB4;text-transform:uppercase;margin-bottom:16px;">Ne manquez pas</p>
    <h2 style="font-family:'Playfair Display',serif;font-size:38px;font-weight:600;color:#fff;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(255,255,255,0.6);margin-bottom:32px;line-height:1.6;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:48px;font-weight:700;color:#fff;margin-bottom:32px;">${data.price}€</p>` : ''}
    <button style="background:#334FB4;color:#fff;border:none;padding:18px 52px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background .3s;">${data.cta || 'Commander maintenant'}</button>
    <p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;letter-spacing:0.03em;">Formule naturelle · Livraison offerte · Satisfait ou remboursé</p>
  </div>
</section>

</body>
</html>`
}
