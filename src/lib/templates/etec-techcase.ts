import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4526432/pexels-photo-4526432.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecTechcase(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #EBEBEB;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-tc-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var a=document.getElementById('arr-tc-${i}');a.textContent=open?'−':'+';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Jost',sans-serif;font-size:15px;font-weight:500;color:#000;">${f.question}</span>
        <span id="arr-tc-${i}" style="font-size:20px;color:#000;flex-shrink:0;margin-left:16px;font-weight:300;">+</span>
      </button>
      <div id="faq-tc-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Jost',sans-serif;font-size:14px;color:#777;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const specs = [
    { label: benefits[0] || 'Protection MIL-STD', value: 'Anti-choc 3m', icon: ico.shield(20) },
    { label: benefits[1] || 'Compatibilité', value: 'MagSafe Ready', icon: ico.flash(20) },
    { label: benefits[2] || 'Matériau', value: 'Polycarbonate + TPU', icon: ico.recycle(20) },
    { label: benefits[3] || 'Poids', value: 'Ultra-léger 28g', icon: ico.star(20) },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Jost',sans-serif;background:#fff;color:#000;}
.tc-btn{background:#000;color:#fff;border:none;border-radius:8px;padding:17px 40px;font-family:'Jost',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s;}
.tc-btn:hover{background:#333;transform:translateY(-1px);}
.tc-btn-gray{background:#EEEEEE;color:#000;border:none;border-radius:8px;padding:15px 40px;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;}
.tc-btn-gray:hover{background:#DDD;}
@media(max-width:768px){
  .tc-hero{flex-direction:column!important;}
  .tc-hero-img{width:100%!important;height:460px!important;}
  .tc-hero-info{width:100%!important;padding:32px 20px!important;}
  .tc-specs{grid-template-columns:1fr 1fr!important;}
  .tc-compare{flex-direction:column!important;}
  .tc-reviews{grid-template-columns:1fr!important;}
}
@media(max-width:480px){
  .tc-specs{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR -->
<div style="background:#000;color:#fff;text-align:center;padding:11px 20px;font-size:13px;font-weight:400;">
  ${data.urgency || 'Livraison gratuite — Commandez avant 14h, expédié aujourd\'hui'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#fff;border-bottom:1px solid #EBEBEB;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#999;">Home</span>
    <span style="font-size:12px;color:#DDD;">/</span>
    <span style="font-size:12px;color:#999;">Accessoires</span>
    <span style="font-size:12px;color:#DDD;">/</span>
    <span style="font-size:12px;color:#000;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — CLEAN MINIMAL -->
<section style="background:#fff;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="tc-hero">
    <div style="width:56%;position:relative;background:#F5F5F5;overflow:hidden;" class="tc-hero-img">
      <img id="mi-tc" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#000;color:#fff;font-size:13px;font-weight:500;padding:8px 16px;border-radius:8px;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;background:rgba(255,255,255,0.95);padding:8px 12px;border-radius:10px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-tc').src='${img}';document.querySelectorAll('.th-tc').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #000':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-tc" style="width:48px;height:48px;border-radius:6px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#000':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <div style="width:44%;padding:48px 44px;display:flex;flex-direction:column;justify-content:center;" class="tc-hero-info">
      <p style="font-size:12px;font-weight:500;letter-spacing:0.1em;color:#999;text-transform:uppercase;margin-bottom:12px;">Accessoire Tech</p>
      <h1 style="font-size:40px;font-weight:600;color:#000;line-height:1.12;letter-spacing:-0.02em;margin-bottom:14px;">${data.headline}</h1>
      <p style="font-size:15px;color:#777;line-height:1.65;margin-bottom:24px;">${data.subtitle}</p>

      <!-- PRICE -->
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">
        ${data.price ? `<span style="font-size:38px;font-weight:600;color:#000;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#BBB;text-decoration:line-through;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:#EEEEEE;color:#000;font-size:12px;font-weight:500;padding:4px 12px;border-radius:6px;">-${savePct}%</span>` : ''}
      </div>

      <!-- BENEFITS PILLS -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;">
        ${benefits.map(b => `
        <span style="background:#F5F5F5;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;color:#333;">${b}</span>`).join('')}
      </div>

      <!-- CTAs -->
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        <button class="tc-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button>
        <button class="tc-btn-gray" style="flex:1;text-align:center;">Acheter</button>
      </div>

      <!-- TRUST -->
      <div style="display:flex;gap:20px;margin-top:16px;padding-top:16px;border-top:1px solid #EBEBEB;">
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Express 24h</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Paiement sécurisé</span>
        <span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour gratuit</span>
      </div>
    </div>
  </div>
</section>

<!-- SPECS — 2x2 GRID -->
<section style="padding:80px 24px;background:#F5F5F5;">
  <div style="max-width:900px;margin:0 auto;">
    <p style="font-size:12px;font-weight:500;letter-spacing:0.1em;color:#999;text-align:center;text-transform:uppercase;margin-bottom:8px;">Caractéristiques</p>
    <h2 style="font-size:34px;font-weight:600;color:#000;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Conçu pour protéger</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="tc-specs">
      ${specs.map(s => `
      <div style="background:#fff;border-radius:12px;padding:28px 24px;display:flex;align-items:flex-start;gap:16px;">
        <div style="width:44px;height:44px;border-radius:10px;background:#F5F5F5;display:flex;align-items:center;justify-content:center;color:#000;flex-shrink:0;">${s.icon}</div>
        <div>
          <p style="font-size:14px;font-weight:600;color:#000;margin-bottom:4px;">${s.label}</p>
          <p style="font-size:13px;color:#999;">${s.value}</p>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#fff;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:2px solid #EBEBEB;margin-bottom:32px;">
      ${[
        { label: 'Description', content: `<p style="font-size:14px;color:#777;line-height:1.8;">Protection anti-choc certifiée MIL-STD-810G. Compatible charge sans fil et MagSafe. Boutons tactiles réactifs. Découpes précises pour tous les ports. Grip anti-dérapant.</p>` },
        { label: 'Compatibilité', content: `<p style="font-size:14px;color:#777;line-height:1.8;">Compatible avec les derniers modèles iPhone et Samsung Galaxy. Vérifiez la compatibilité exacte dans le sélecteur de modèle. Support MagSafe et Qi certifié.</p>` },
        { label: 'Livraison', content: `<p style="font-size:14px;color:#777;line-height:1.8;">Expédié sous 24h jours ouvrés. Livraison gratuite en France métropolitaine. Express 24h disponible. Suivi en temps réel. Retour gratuit sous 30 jours.</p>` },
      ].map((t, i) => `
      <button onclick="(function(){document.querySelectorAll('.tp-tc').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-tc').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #000':'2px solid transparent';b.style.color=j===${i}?'#000':'#999';b.style.marginBottom='-2px';});})()" class="tbtn-tc" style="padding:14px 24px;background:none;border:none;border-bottom:${i===0?'2px solid #000':'2px solid transparent'};color:${i===0?'#000':'#999'};font-family:'Jost',sans-serif;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:-2px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${[
      `<p style="font-size:14px;color:#777;line-height:1.8;">Protection anti-choc certifiée MIL-STD-810G. Compatible charge sans fil et MagSafe. Boutons tactiles réactifs. Découpes précises pour tous les ports. Grip anti-dérapant.</p>`,
      `<p style="font-size:14px;color:#777;line-height:1.8;">Compatible avec les derniers modèles iPhone et Samsung Galaxy. Vérifiez la compatibilité exacte dans le sélecteur de modèle. Support MagSafe et Qi certifié.</p>`,
      `<p style="font-size:14px;color:#777;line-height:1.8;">Expédié sous 24h jours ouvrés. Livraison gratuite en France métropolitaine. Express 24h disponible. Suivi en temps réel. Retour gratuit sous 30 jours.</p>`,
    ].map((c, i) => `<div class="tp-tc" style="display:${i===0?'block':'none'};">${c}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#F5F5F5;">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="font-size:34px;font-weight:600;color:#000;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Sans protection vs Avec ${data.product_name}</h2>
    <div style="display:flex;gap:16px;" class="tc-compare">
      <div style="flex:1;position:relative;border-radius:12px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:saturate(0.5);" alt="Sans">
        <div style="position:absolute;top:16px;left:16px;background:#000;color:#fff;font-size:12px;font-weight:500;padding:6px 16px;border-radius:8px;">SANS</div>
      </div>
      <div style="flex:1;position:relative;border-radius:12px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Avec">
        <div style="position:absolute;top:16px;left:16px;background:#000;color:#fff;font-size:12px;font-weight:500;padding:6px 16px;border-radius:8px;">AVEC ✓</div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-size:34px;font-weight:600;color:#000;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Ce qu'ils en pensent</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;" class="tc-reviews">
      ${[
        { name: 'Romain S.', text: `Le ${data.product_name} est parfait. Ultra fin, grip excellent, et mon téléphone a survécu à une chute de 1m50 sur du carrelage. Rien à dire.`, date: '2 jours' },
        { name: 'Julie H.', text: `Enfin une coque qui protège vraiment sans ajouter de volume. MagSafe fonctionne parfaitement à travers. Top qualité.`, date: '1 semaine' },
        { name: 'Kevin T.', text: `Commandé pour toute la famille. 4 téléphones différents, 4 coques parfaitement ajustées. Le rapport qualité-prix est imbattable.`, date: '2 semaines' },
      ].map(r => `
      <div style="background:#F5F5F5;border-radius:12px;padding:24px 20px;">
        <div style="color:#000;font-size:13px;letter-spacing:2px;margin-bottom:12px;">★★★★★</div>
        <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:18px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:8px;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:600;color:#000;">${r.name}</p>
            <p style="font-size:11px;color:#999;">Il y a ${r.date}</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F5F5F5;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:34px;font-weight:600;color:#000;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">FAQ</h2>
    <div style="background:#fff;border-radius:12px;padding:8px 28px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#000;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <h2 style="font-size:40px;font-weight:600;color:#fff;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(255,255,255,0.5);margin-bottom:36px;line-height:1.6;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:52px;font-weight:600;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:#000;border:none;border-radius:8px;padding:18px 52px;font-family:'Jost',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s;">${data.cta || 'Commander maintenant'}</button>
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:20px;">Express 24h · Retour gratuit · Paiement sécurisé</p>
  </div>
</section>

</body>
</html>`
}
