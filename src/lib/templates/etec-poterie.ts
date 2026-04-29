import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3094035/pexels-photo-3094035.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2749165/pexels-photo-2749165.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3094035/pexels-photo-3094035.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecPoterie(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #DDD5CA;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-po-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-po-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Source Sans 3',sans-serif;font-size:15px;font-weight:600;color:#3D2E1F;">${f.question}</span>
        <span id="arr-po-${i}" style="font-size:20px;color:#A0522D;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-po-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Source Sans 3',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Source Sans 3',sans-serif;background:#FBF8F4;color:#3D2E1F;}
.po-btn{background:#A0522D;color:#fff;border:none;border-radius:20px;padding:17px 40px;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.po-btn:hover{background:#8B4726;transform:translateY(-1px);}
.po-btn-alt{background:#F0EBE1;color:#A0522D;border:none;border-radius:20px;padding:15px 40px;font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.po-btn-alt:hover{background:#E5DDD0;}
@media(max-width:768px){.po-hero{flex-direction:column!important;}.po-hero-img{width:100%!important;height:460px!important;}.po-hero-info{width:100%!important;padding:32px 20px!important;}.po-grid3{grid-template-columns:1fr!important;}.po-compare{flex-direction:column!important;}.po-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#A0522D;color:#F5EEE6;text-align:center;padding:11px 20px;font-size:12px;font-weight:400;">${data.urgency || 'Pièces uniques façonnées à la main — Série limitée'}</div>
<nav style="background:#FBF8F4;border-bottom:1px solid #DDD5CA;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Artisanat</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#3D2E1F;font-weight:500;">${data.product_name}</span></div></nav>
<section style="background:#FBF8F4;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="po-hero">
<div style="width:55%;position:relative;background:#F0EBE1;overflow:hidden;border-radius:0 20px 20px 0;" class="po-hero-img"><img id="mi-po" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#A0522D;color:#fff;font-size:12px;font-weight:600;padding:7px 16px;border-radius:20px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-po').src='${img}';document.querySelectorAll('.th-po').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #A0522D':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-po" style="width:52px;height:52px;border-radius:50%;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#A0522D':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="po-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#A0522D;text-transform:uppercase;margin-bottom:12px;">Fait Main</p>
<h1 style="font-family:'Libre Baskerville',serif;font-size:38px;font-weight:400;color:#3D2E1F;line-height:1.15;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#3D2E1F;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#A0522D;font-size:14px;">✓</span><span style="font-size:14px;color:#666;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="po-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="po-btn-alt" style="flex:1;text-align:center;">L'histoire</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #DDD5CA;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Soigné</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.leaf(14)} Naturel</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F0EBE1;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#A0522D;text-align:center;text-transform:uppercase;margin-bottom:8px;">Savoir-faire</p>
<h2 style="font-family:'Libre Baskerville',serif;font-size:32px;font-weight:400;color:#3D2E1F;text-align:center;margin-bottom:56px;">L'art de la terre</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="po-grid3">${[
  { t: benefits[0]||'Terre naturelle', d: 'Argile locale sélectionnée avec soin, sans additifs chimiques' },
  { t: benefits[1]||'Tourné à la main', d: 'Chaque pièce est unique, façonnée par nos artisans potiers' },
  { t: benefits[2]||'Cuisson au four', d: 'Cuisson traditionnelle à haute température pour une durabilité maximale' },
].map(s => `<div style="background:#FBF8F4;border-radius:20px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:600;color:#3D2E1F;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FBF8F4;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Libre Baskerville',serif;font-size:32px;font-weight:400;color:#3D2E1F;text-align:center;margin-bottom:48px;">Dans votre intérieur</h2>
<div style="display:flex;gap:20px;" class="po-compare"><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Ambiance 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Table dressée</p></div></div><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Ambiance 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Décoration</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F0EBE1;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Libre Baskerville',serif;font-size:32px;font-weight:400;color:#3D2E1F;text-align:center;margin-bottom:48px;">Avis clients</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="po-reviews">${[
  { name:'Hélène C.', text:`Le ${data.product_name} est magnifique. On sent le travail artisanal. Chaque pièce est vraiment unique.`, date:'3 jours' },
  { name:'François P.', text:'Superbe qualité, les finitions sont impeccables. Ça donne un cachet incroyable à notre cuisine.', date:'1 semaine' },
  { name:'Claire M.', text:'Emballage très soigné, la pièce est arrivée intacte. Les couleurs sont encore plus belles en vrai.', date:'2 semaines' },
].map(r => `<div style="background:#FBF8F4;border-radius:20px;padding:28px 24px;"><div style="color:#A0522D;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#666;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#A0522D;color:#F5EEE6;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#3D2E1F;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FBF8F4;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Libre Baskerville',serif;font-size:32px;font-weight:400;color:#3D2E1F;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F0EBE1;border-radius:20px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#A0522D;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Libre Baskerville',serif;font-size:38px;font-weight:400;color:#FBF8F4;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(251,248,244,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#F5EEE6;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#FBF8F4;color:#A0522D;border:none;border-radius:20px;padding:18px 52px;font-family:'Source Sans 3',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Commander maintenant'}</button>
<p style="font-size:12px;color:rgba(251,248,244,0.4);margin-top:20px;">Fait main · Emballage soigné · Retour gratuit</p>
</div></section></body></html>`
}
