import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecJewel(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid rgba(163,114,73,0.15);overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-jw-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var a=document.getElementById('arr-jw-${i}');a.textContent=open?'−':'+';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:22px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Poppins',sans-serif;font-size:15px;font-weight:500;color:#e3e3e3;">${f.question}</span>
        <span id="arr-jw-${i}" style="font-size:18px;color:#a37249;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-jw-${i}" style="max-height:0;overflow:hidden;transition:max-height .4s ease,padding-top .4s ease;padding-top:0;">
        <p style="font-family:'Poppins',sans-serif;font-size:14px;color:#868686;line-height:1.8;padding-bottom:22px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const crafts = [
    { title: benefits[0] || 'Or 18 carats', desc: data.subtitle || 'Matériaux précieux certifiés pour une brillance éternelle' },
    { title: benefits[1] || 'Fait main', desc: 'Chaque pièce est façonnée à la main par nos maîtres joailliers' },
    { title: benefits[2] || 'Certificat', desc: 'Certificat d\'authenticité et de qualité inclus' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700;900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Poppins',sans-serif;background:#000;color:#e3e3e3;}
.jw-btn{background:#a37249;color:#fff;border:none;border-radius:0;padding:18px 44px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.jw-btn:hover{background:#ddab6a;color:#000;}
.jw-btn-outline{background:transparent;color:#a37249;border:1px solid #a37249;border-radius:0;padding:16px 44px;font-family:'Poppins',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;transition:all .3s;}
.jw-btn-outline:hover{background:#a37249;color:#fff;}
@media(max-width:768px){
  .jw-hero{flex-direction:column!important;}
  .jw-hero-img{width:100%!important;height:480px!important;}
  .jw-hero-info{width:100%!important;padding:32px 20px!important;}
  .jw-craft-grid{grid-template-columns:1fr!important;}
  .jw-compare{flex-direction:column!important;}
  .jw-reviews{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR -->
<div style="background:#a37249;color:#fff;text-align:center;padding:10px 20px;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;">
  ${data.urgency || 'Collection exclusive — Écrin cadeau offert'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#000;border-bottom:1px solid rgba(163,114,73,0.15);padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:10px;">
    <span style="font-size:11px;color:#868686;letter-spacing:0.06em;">Accueil</span>
    <span style="font-size:11px;color:#444;">·</span>
    <span style="font-size:11px;color:#868686;letter-spacing:0.06em;">Joaillerie</span>
    <span style="font-size:11px;color:#444;">·</span>
    <span style="font-size:11px;color:#e3e3e3;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — DARK LUXURY -->
<section style="background:#000;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:660px;" class="jw-hero">
    <div style="width:55%;position:relative;overflow:hidden;" class="jw-hero-img">
      <img id="mi-jw" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:540px;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;right:20px;background:#a37249;color:#fff;font-size:11px;font-weight:700;padding:8px 18px;letter-spacing:0.1em;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-jw').src='${img}';document.querySelectorAll('.th-jw').forEach(function(t,j){t.style.border=j===${i}?'1px solid #a37249':'1px solid rgba(255,255,255,0.2)';t.style.opacity=j===${i}?'1':'.5';});" class="th-jw" style="width:52px;height:52px;overflow:hidden;cursor:pointer;border:1px solid ${i===0?'#a37249':'rgba(255,255,255,0.2)'};opacity:${i===0?1:.5};transition:all .3s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <div style="width:45%;padding:56px 52px;display:flex;flex-direction:column;justify-content:center;" class="jw-hero-info">
      <p style="font-family:'Bodoni Moda',serif;font-size:13px;font-weight:400;letter-spacing:0.2em;color:#a37249;text-transform:uppercase;margin-bottom:16px;">Haute Joaillerie</p>
      <h1 style="font-family:'Bodoni Moda',serif;font-size:48px;font-weight:400;color:#e3e3e3;line-height:1.1;letter-spacing:0.02em;margin-bottom:16px;">${data.headline}</h1>
      <p style="font-size:14px;color:#868686;line-height:1.8;margin-bottom:32px;">${data.subtitle}</p>

      <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(163,114,73,0.15);">
        ${data.price ? `<span style="font-family:'Bodoni Moda',serif;font-size:42px;font-weight:400;color:#ddab6a;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#555;text-decoration:line-through;">${data.original_price}€</span>` : ''}
      </div>

      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:12px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:12px;">
          <span style="width:8px;height:1px;background:#a37249;flex-shrink:0;"></span>
          <span style="font-size:13px;color:#999;line-height:1.5;letter-spacing:0.02em;">${b}</span>
        </li>`).join('')}
      </ul>

      <div style="display:flex;gap:12px;">
        <button class="jw-btn" style="flex:1;text-align:center;">${data.cta || 'Acquérir'}</button>
        <button class="jw-btn-outline" style="flex:1;text-align:center;">Offrir</button>
      </div>

      <div style="display:flex;gap:24px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(163,114,73,0.15);">
        <span style="font-size:10px;color:#666;display:flex;align-items:center;gap:6px;letter-spacing:0.06em;text-transform:uppercase;">${ico.shield(13)} Certifié</span>
        <span style="font-size:10px;color:#666;display:flex;align-items:center;gap:6px;letter-spacing:0.06em;text-transform:uppercase;">${ico.truck(13)} Écrin offert</span>
        <span style="font-size:10px;color:#666;display:flex;align-items:center;gap:6px;letter-spacing:0.06em;text-transform:uppercase;">${ico.return(13)} 30 jours</span>
      </div>
    </div>
  </div>
</section>

<!-- CRAFTSMANSHIP — 3 COL -->
<section style="padding:80px 24px;background:#0A0A0A;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:'Bodoni Moda',serif;font-size:13px;letter-spacing:0.2em;color:#a37249;text-align:center;text-transform:uppercase;margin-bottom:8px;">L'art du bijou</p>
    <h2 style="font-family:'Bodoni Moda',serif;font-size:36px;font-weight:400;color:#e3e3e3;text-align:center;letter-spacing:0.02em;margin-bottom:56px;">${data.product_name}, pièce d'exception</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;" class="jw-craft-grid">
      ${crafts.map((c, i) => `
      <div style="background:#111;padding:44px 36px;text-align:center;">
        <span style="font-family:'Bodoni Moda',serif;font-size:52px;font-weight:400;color:rgba(163,114,73,0.15);display:block;margin-bottom:8px;">0${i+1}</span>
        <h3 style="font-family:'Bodoni Moda',serif;font-size:20px;font-weight:400;color:#ddab6a;letter-spacing:0.06em;margin-bottom:12px;">${c.title}</h3>
        <p style="font-size:13px;color:#868686;line-height:1.7;">${c.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:64px 24px;background:#000;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;gap:0;margin-bottom:32px;border-bottom:1px solid rgba(163,114,73,0.15);">
      ${[
        { label: 'Détails', content: `<p style="font-size:14px;color:#868686;line-height:1.8;">Façonné à la main dans notre atelier parisien. Or 18 carats, pierres précieuses certifiées. Poinçon de maître. Finition polie miroir. Livré dans un écrin de luxe avec certificat d'authenticité.</p>` },
        { label: 'Entretien', content: `<p style="font-size:14px;color:#868686;line-height:1.8;">Nettoyez avec un chiffon doux. Évitez le contact avec les produits chimiques. Rangez dans l'écrin fourni. Révision gratuite chaque année dans notre atelier.</p>` },
        { label: 'Livraison', content: `<p style="font-size:14px;color:#868686;line-height:1.8;">Livraison sécurisée et assurée sous 48h. Emballage cadeau premium inclus. Suivi en temps réel. Livraison en Europe et international disponible.</p>` },
      ].map((t, i) => `
      <button onclick="(function(){document.querySelectorAll('.tp-jw').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-jw').forEach(function(b,j){b.style.borderBottom=j===${i}?'1px solid #a37249':'1px solid transparent';b.style.color=j===${i}?'#ddab6a':'#666';b.style.marginBottom='-1px';});})()" class="tbtn-jw" style="padding:14px 28px;background:none;border:none;border-bottom:${i===0?'1px solid #a37249':'1px solid transparent'};color:${i===0?'#ddab6a':'#666'};font-family:'Poppins',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;margin-bottom:-1px;transition:all .3s;">${t.label}</button>`).join('')}
    </div>
    ${[
      `<p style="font-size:14px;color:#868686;line-height:1.8;">Façonné à la main dans notre atelier parisien. Or 18 carats, pierres précieuses certifiées. Poinçon de maître. Finition polie miroir. Livré dans un écrin de luxe avec certificat d'authenticité.</p>`,
      `<p style="font-size:14px;color:#868686;line-height:1.8;">Nettoyez avec un chiffon doux. Évitez le contact avec les produits chimiques. Rangez dans l'écrin fourni. Révision gratuite chaque année dans notre atelier.</p>`,
      `<p style="font-size:14px;color:#868686;line-height:1.8;">Livraison sécurisée et assurée sous 48h. Emballage cadeau premium inclus. Suivi en temps réel. Livraison en Europe et international disponible.</p>`,
    ].map((c, i) => `<div class="tp-jw" style="display:${i===0?'block':'none'};">${c}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#0A0A0A;">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="font-family:'Bodoni Moda',serif;font-size:34px;font-weight:400;color:#e3e3e3;text-align:center;letter-spacing:0.02em;margin-bottom:48px;">Porté au quotidien</h2>
    <div style="display:flex;gap:2px;" class="jw-compare">
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Détail">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:24px;background:linear-gradient(transparent,rgba(0,0,0,0.8));">
          <p style="font-family:'Bodoni Moda',serif;color:#ddab6a;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;">Détail</p>
        </div>
      </div>
      <div style="flex:1;position:relative;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Porté">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:24px;background:linear-gradient(transparent,rgba(0,0,0,0.8));">
          <p style="font-family:'Bodoni Moda',serif;color:#ddab6a;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;">Porté</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#000;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:'Bodoni Moda',serif;font-size:13px;letter-spacing:0.2em;color:#a37249;text-align:center;text-transform:uppercase;margin-bottom:8px;">Témoignages</p>
    <h2 style="font-family:'Bodoni Moda',serif;font-size:34px;font-weight:400;color:#e3e3e3;text-align:center;margin-bottom:48px;">Elles l'ont choisi</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="jw-reviews">
      ${[
        { name: 'Catherine B.', text: `Un bijou d'une beauté saisissante. Le ${data.product_name} est encore plus beau en vrai. L'écrin est magnifique. Un cadeau inoubliable.`, date: '3 jours' },
        { name: 'Alexandra M.', text: `La qualité est remarquable. Je le porte tous les jours et il reste impeccable. Les reflets sont sublimes. Un vrai investissement.`, date: '1 semaine' },
        { name: 'Diane P.', text: `Mon mari me l'a offert pour notre anniversaire. C'est devenu ma pièce préférée. Le service client est d'un raffinement exemplaire.`, date: '2 semaines' },
      ].map(r => `
      <div style="background:#0A0A0A;padding:32px 28px;border:1px solid rgba(163,114,73,0.12);">
        <div style="color:#ddab6a;font-size:12px;letter-spacing:3px;margin-bottom:16px;">★★★★★</div>
        <p style="font-size:13px;color:#999;line-height:1.8;margin-bottom:24px;font-style:italic;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid rgba(163,114,73,0.1);">
          <div style="width:36px;height:36px;background:#a37249;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:12px;font-weight:500;color:#e3e3e3;">${r.name}</p>
            <p style="font-size:10px;color:#666;">Il y a ${r.date}</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#0A0A0A;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-family:'Bodoni Moda',serif;font-size:34px;font-weight:400;color:#e3e3e3;text-align:center;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="padding:8px 36px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#000;border-top:1px solid rgba(163,114,73,0.1);">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <p style="font-family:'Bodoni Moda',serif;font-size:13px;letter-spacing:0.2em;color:#a37249;text-transform:uppercase;margin-bottom:20px;">Pièce d'exception</p>
    <h2 style="font-family:'Bodoni Moda',serif;font-size:42px;font-weight:400;color:#e3e3e3;letter-spacing:0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:14px;color:#666;margin-bottom:36px;line-height:1.7;">${data.subtitle}</p>
    ${data.price ? `<p style="font-family:'Bodoni Moda',serif;font-size:52px;font-weight:400;color:#ddab6a;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button class="jw-btn" style="font-size:13px;padding:20px 56px;">${data.cta || 'Acquérir cette pièce'}</button>
    <p style="font-size:10px;color:#444;margin-top:24px;letter-spacing:0.1em;text-transform:uppercase;">Certificat d'authenticité · Écrin offert · Livraison sécurisée</p>
  </div>
</section>

</body>
</html>`
}
