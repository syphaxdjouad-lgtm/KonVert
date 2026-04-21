import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/4210373/pexels-photo-4210373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4210374/pexels-photo-4210374.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/4210373/pexels-photo-4210373.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecArtisan(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #EDE6DC;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-ar-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var a=document.getElementById('arr-ar-${i}');a.textContent=open?'−':'+';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Jost',sans-serif;font-size:15px;font-weight:500;color:#111;">${f.question}</span>
        <span id="arr-ar-${i}" style="font-size:20px;color:#FF871D;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-ar-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Jost',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const values = [
    { icon: ico.leaf(24), title: benefits[0] || '100% Naturel', desc: data.subtitle || 'Ingrédients naturels et biologiques, sans produit chimique' },
    { icon: ico.recycle(24), title: benefits[1] || 'Éco-responsable', desc: 'Emballages recyclables et production zéro déchet' },
    { icon: ico.flask(24), title: benefits[2] || 'Fait main', desc: 'Chaque produit est fabriqué artisanalement avec amour' },
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Jost',sans-serif;background:#FBF3ED;color:#111;}
.ar-btn{background:#FF871D;color:#fff;border:none;border-radius:10px;padding:17px 40px;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .3s;}
.ar-btn:hover{background:#ee9051;transform:translateY(-1px);}
.ar-btn-outline{background:transparent;color:#111;border:1.5px solid #111;border-radius:10px;padding:15px 40px;font-family:'Jost',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .3s;}
.ar-btn-outline:hover{background:#111;color:#FBF3ED;}
@media(max-width:768px){
  .ar-hero{flex-direction:column!important;}
  .ar-hero-img{width:100%!important;height:460px!important;}
  .ar-hero-info{width:100%!important;padding:32px 20px!important;}
  .ar-values{grid-template-columns:1fr!important;}
  .ar-compare{flex-direction:column!important;}
  .ar-reviews{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR — WARM -->
<div style="background:#FF871D;color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;">
  ${data.urgency || 'Fait main avec amour — Livraison offerte dès 35€'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#FBF3ED;border-bottom:1px solid #EDE6DC;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#AAA;">Boutique</span>
    <span style="font-size:12px;color:#DDD;">›</span>
    <span style="font-size:12px;color:#AAA;">Soins artisanaux</span>
    <span style="font-size:12px;color:#DDD;">›</span>
    <span style="font-size:12px;color:#111;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — ARTISANAL WARM -->
<section style="background:#FBF3ED;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:600px;" class="ar-hero">
    <div style="width:55%;position:relative;overflow:hidden;border-radius:0 20px 20px 0;" class="ar-hero-img">
      <img id="mi-ar" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:500px;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#FF871D;color:#fff;font-size:12px;font-weight:600;padding:7px 16px;border-radius:10px;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-ar').src='${img}';document.querySelectorAll('.th-ar').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #FF871D':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-ar" style="width:50px;height:50px;border-radius:10px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#FF871D':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="ar-hero-info">
      <p style="font-size:12px;font-weight:500;letter-spacing:0.1em;color:#FF871D;text-transform:uppercase;margin-bottom:12px;">Artisanal & Naturel</p>
      <h1 style="font-family:'Crimson Text',serif;font-size:42px;font-weight:700;color:#111;line-height:1.15;margin-bottom:14px;">${data.headline}</h1>
      <p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>

      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">
        ${data.price ? `<span style="font-family:'Crimson Text',serif;font-size:36px;font-weight:700;color:#111;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#BBB;text-decoration:line-through;">${data.original_price}€</span>` : ''}
      </div>

      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:10px;">
          <span style="color:#FF871D;font-size:14px;">●</span>
          <span style="font-size:14px;color:#555;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <div style="display:flex;gap:12px;">
        <button class="ar-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button>
        <button class="ar-btn-outline" style="flex:1;text-align:center;">Offrir</button>
      </div>

      <div style="display:flex;gap:20px;margin-top:24px;padding-top:18px;border-top:1px solid #EDE6DC;">
        <span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.leaf(13)} Naturel</span>
        <span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.recycle(13)} Éco</span>
        <span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(13)} Offerte</span>
        <span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(13)} 30j</span>
      </div>
    </div>
  </div>
</section>

<!-- VALUES — 3 COL -->
<section style="padding:80px 24px;background:#F5EDE4;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:12px;font-weight:500;letter-spacing:0.1em;color:#FF871D;text-align:center;text-transform:uppercase;margin-bottom:8px;">Nos engagements</p>
    <h2 style="font-family:'Crimson Text',serif;font-size:34px;font-weight:700;color:#111;text-align:center;margin-bottom:56px;">Fait avec soin, pour vous</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="ar-values">
      ${values.map(v => `
      <div style="background:#FBF3ED;border-radius:16px;padding:36px 28px;text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:#FFF0E0;display:flex;align-items:center;justify-content:center;color:#FF871D;margin:0 auto 20px;">${v.icon}</div>
        <h3 style="font-size:18px;font-weight:600;color:#111;margin-bottom:10px;">${v.title}</h3>
        <p style="font-size:14px;color:#888;line-height:1.7;">${v.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#FBF3ED;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:1px solid #EDE6DC;margin-bottom:32px;">
      ${[
        { label: 'Ingrédients', content: `<p style="font-size:14px;color:#888;line-height:1.8;">Huile d'olive bio, beurre de karité, huiles essentielles naturelles, argile, miel. Sans parabènes, sans sulfates, sans colorants artificiels. Formule végane et cruelty-free.</p>` },
        { label: 'Utilisation', content: `<p style="font-size:14px;color:#888;line-height:1.8;">Mouillez le savon sous l'eau tiède. Faites mousser entre vos mains ou avec un gant. Appliquez sur le corps en massant. Rincez abondamment. Conservez au sec entre chaque utilisation.</p>` },
        { label: 'Livraison', content: `<p style="font-size:14px;color:#888;line-height:1.8;">Livraison offerte dès 35€. Emballage kraft recyclable. Expédition sous 48h. Petite carte manuscrite incluse dans chaque commande. Livraison en France et Belgique.</p>` },
      ].map((t, i) => `
      <button onclick="(function(){document.querySelectorAll('.tp-ar').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-ar').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #FF871D':'2px solid transparent';b.style.color=j===${i}?'#111':'#AAA';b.style.marginBottom='-1px';});})()" class="tbtn-ar" style="padding:14px 24px;background:none;border:none;border-bottom:${i===0?'2px solid #FF871D':'2px solid transparent'};color:${i===0?'#111':'#AAA'};font-family:'Jost',sans-serif;font-size:13px;font-weight:500;cursor:pointer;margin-bottom:-1px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${[
      `<p style="font-size:14px;color:#888;line-height:1.8;">Huile d'olive bio, beurre de karité, huiles essentielles naturelles, argile, miel. Sans parabènes, sans sulfates, sans colorants artificiels. Formule végane et cruelty-free.</p>`,
      `<p style="font-size:14px;color:#888;line-height:1.8;">Mouillez le savon sous l'eau tiède. Faites mousser entre vos mains ou avec un gant. Appliquez sur le corps en massant. Rincez abondamment. Conservez au sec entre chaque utilisation.</p>`,
      `<p style="font-size:14px;color:#888;line-height:1.8;">Livraison offerte dès 35€. Emballage kraft recyclable. Expédition sous 48h. Petite carte manuscrite incluse dans chaque commande. Livraison en France et Belgique.</p>`,
    ].map((c, i) => `<div class="tp-ar" style="display:${i===0?'block':'none'};">${c}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#F5EDE4;">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="font-family:'Crimson Text',serif;font-size:34px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">Peau douce, naturellement</h2>
    <div style="display:flex;gap:20px;" class="ar-compare">
      <div style="flex:1;position:relative;border-radius:16px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:saturate(0.5);" alt="Avant">
        <div style="position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;font-weight:600;padding:6px 16px;border-radius:10px;">AVANT</div>
      </div>
      <div style="flex:1;position:relative;border-radius:16px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:16px;left:16px;background:#FF871D;color:#fff;font-size:11px;font-weight:600;padding:6px 16px;border-radius:10px;">APRÈS</div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#FBF3ED;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-family:'Crimson Text',serif;font-size:34px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">Ils ont craqué</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="ar-reviews">
      ${[
        { name: 'Manon T.', text: `Le ${data.product_name} sent divinement bon. Ma peau n'a jamais été aussi douce. On sent vraiment la qualité artisanale. Je suis fan !`, date: '3 jours' },
        { name: 'Pauline R.', text: `Commandé le coffret pour offrir. Le packaging kraft est adorable, la carte manuscrite est un joli geste. Produits top qualité.`, date: '1 semaine' },
        { name: 'Chloé B.', text: `Enfin du vrai savon naturel ! Plus de tiraillements, plus de rougeurs. Ma peau sensible adore. J'ai déjà recommandé 3 fois.`, date: '2 semaines' },
      ].map(r => `
      <div style="background:#F5EDE4;border-radius:16px;padding:28px 24px;">
        <div style="color:#FF871D;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div>
        <p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#FF871D;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:600;color:#111;">${r.name}</p>
            <p style="font-size:11px;color:#AAA;">Il y a ${r.date} · Achat vérifié</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F5EDE4;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-family:'Crimson Text',serif;font-size:34px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="background:#FBF3ED;border-radius:16px;padding:8px 32px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#111;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <p style="font-size:12px;font-weight:500;letter-spacing:0.1em;color:#FF871D;text-transform:uppercase;margin-bottom:16px;">Artisanal & Naturel</p>
    <h2 style="font-family:'Crimson Text',serif;font-size:40px;font-weight:700;color:#FBF3ED;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(251,243,237,0.5);margin-bottom:36px;line-height:1.7;">${data.subtitle}</p>
    ${data.price ? `<p style="font-family:'Crimson Text',serif;font-size:48px;font-weight:700;color:#FF871D;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button class="ar-btn" style="font-size:15px;padding:18px 52px;">${data.cta || 'Adopter maintenant'}</button>
    <p style="font-size:12px;color:rgba(251,243,237,0.3);margin-top:20px;">100% naturel · Fait main · Livraison offerte</p>
  </div>
</section>

</body>
</html>`
}
