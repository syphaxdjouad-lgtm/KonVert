import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecOutfit(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E5E0D8;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-of-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-of-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:#1A1A1A;">${f.question}</span>
        <span id="arr-of-${i}" style="font-size:20px;color:#B5854B;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-of-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Outfit',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Outfit',sans-serif;background:#FFFDF8;color:#1A1A1A;}
.of-btn{background:#1A1A1A;color:#fff;border:none;border-radius:8px;padding:17px 40px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.of-btn:hover{background:#B5854B;transform:translateY(-1px);}
.of-btn-alt{background:#F5EFE6;color:#1A1A1A;border:none;border-radius:8px;padding:15px 40px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.of-btn-alt:hover{background:#E8DFD2;}
@media(max-width:768px){.of-hero{flex-direction:column!important;}.of-hero-img{width:100%!important;height:460px!important;}.of-hero-info{width:100%!important;padding:32px 20px!important;}.of-grid3{grid-template-columns:1fr!important;}.of-compare{flex-direction:column!important;}.of-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#1A1A1A;color:#E5D5BE;text-align:center;padding:11px 20px;font-size:12px;font-weight:400;letter-spacing:0.06em;">${data.urgency || 'Nouvelle collection — Livraison offerte dès 80€'}</div>
<nav style="background:#FFFDF8;border-bottom:1px solid #E5E0D8;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Home</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Vêtements</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#1A1A1A;font-weight:500;">${data.product_name}</span></div></nav>
<section style="background:#FFFDF8;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="of-hero">
<div style="width:56%;position:relative;background:#F5EFE6;overflow:hidden;border-radius:0 16px 16px 0;" class="of-hero-img">
<img id="mi-of" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#B5854B;color:#fff;font-size:12px;font-weight:600;padding:7px 16px;border-radius:8px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-of').src='${img}';document.querySelectorAll('.th-of').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #B5854B':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-of" style="width:52px;height:52px;border-radius:8px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#B5854B':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:44%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="of-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#B5854B;text-transform:uppercase;margin-bottom:12px;">Collection Essentiels</p>
<h1 style="font-size:40px;font-weight:700;color:#1A1A1A;line-height:1.12;letter-spacing:-0.02em;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#1A1A1A;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#BBB;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#B5854B;font-size:14px;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="of-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="of-btn-alt" style="flex:1;text-align:center;">Guide des tailles</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #E5E0D8;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Offerte</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(14)} Échanges gratuits</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F5EFE6;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#B5854B;text-align:center;text-transform:uppercase;margin-bottom:8px;">Qualité</p>
<h2 style="font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:56px;">Pourquoi choisir ${data.product_name}</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="of-grid3">${[
  { t: benefits[0]||'Coton bio', d: 'Matières naturelles certifiées GOTS, douces et durables' },
  { t: benefits[1]||'Coupe parfaite', d: 'Patronage étudié pour un tombé impeccable sur toutes les morphologies' },
  { t: benefits[2]||'Fait en Europe', d: 'Confection éthique dans nos ateliers partenaires européens' },
].map(s => `<div style="background:#FFFDF8;border-radius:12px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:600;color:#1A1A1A;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#888;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFFDF8;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">Lookbook</h2>
<div style="display:flex;gap:20px;" class="of-compare"><div style="flex:1;position:relative;border-radius:12px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Look Casual</p></div></div><div style="flex:1;position:relative;border-radius:12px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Look Soirée</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F5EFE6;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">Avis clients</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="of-reviews">${[
  { name:'Sarah M.', text:`Le ${data.product_name} est devenu mon basique préféré. La matière est incroyable, ça ne bouloche pas même après 20 lavages.`, date:'4 jours' },
  { name:'Julien R.', text:`Coupe parfaite dès la première fois. J'ai racheté en 3 couleurs. Le rapport qualité-prix est top.`, date:'1 semaine' },
  { name:'Laura D.', text:`Super agréable à porter. Le coton bio se sent vraiment. Livraison rapide et emballage soigné.`, date:'2 semaines' },
].map(r => `<div style="background:#FFFDF8;border-radius:12px;padding:28px 24px;"><div style="color:#B5854B;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#1A1A1A;color:#E5D5BE;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#1A1A1A;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFFDF8;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F5EFE6;border-radius:12px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#1A1A1A;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-size:38px;font-weight:700;color:#FFFDF8;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,253,248,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#B5854B;margin-bottom:36px;">${data.price}€</p>` : ''}
<button class="of-btn" style="background:#B5854B;font-size:15px;padding:18px 52px;">${data.cta || 'Commander maintenant'}</button>
<p style="font-size:12px;color:rgba(255,253,248,0.3);margin-top:20px;">Coton bio · Livraison offerte · Échanges gratuits</p>
</div></section></body></html>`
}
