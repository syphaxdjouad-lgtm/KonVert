import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2220317/pexels-photo-2220317.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecStreetz(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #333;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-sz-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-sz-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Barlow',sans-serif;font-size:15px;font-weight:600;color:#F8F8F8;">${f.question}</span>
        <span id="arr-sz-${i}" style="font-size:20px;color:#E11D48;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-sz-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Barlow',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Barlow',sans-serif;background:#F8F8F8;color:#111;}
.sz-btn{background:#E11D48;color:#fff;border:none;border-radius:0;padding:17px 40px;font-family:'Barlow',sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;transition:all .3s;}.sz-btn:hover{background:#BE123C;transform:translateY(-1px);}
.sz-btn-alt{background:#111;color:#F8F8F8;border:none;border-radius:0;padding:15px 40px;font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;cursor:pointer;transition:all .3s;}.sz-btn-alt:hover{background:#222;}
@media(max-width:768px){.sz-hero{flex-direction:column!important;}.sz-hero-img{width:100%!important;height:460px!important;}.sz-hero-info{width:100%!important;padding:32px 20px!important;}.sz-grid3{grid-template-columns:1fr!important;}.sz-compare{flex-direction:column!important;}.sz-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#E11D48;color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${data.urgency || `Drop limité — Dispo jusqu'à épuisement`}</div>
<nav style="background:#F8F8F8;border-bottom:2px solid #111;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#999;">Home</span><span style="font-size:12px;color:#CCC;">›</span><span style="font-size:12px;color:#999;">Street</span><span style="font-size:12px;color:#CCC;">›</span><span style="font-size:12px;color:#111;font-weight:600;text-transform:uppercase;">${data.product_name}</span></div></nav>
<section style="background:#F8F8F8;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="sz-hero">
<div style="width:55%;position:relative;background:#E5E5E5;overflow:hidden;" class="sz-hero-img"><img id="mi-sz" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#E11D48;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;text-transform:uppercase;letter-spacing:0.06em;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-sz').src='${img}';document.querySelectorAll('.th-sz').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #E11D48':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-sz" style="width:52px;height:52px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#E11D48':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="sz-hero-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:#E11D48;text-transform:uppercase;margin-bottom:12px;">New Drop</p>
<h1 style="font-family:'Bebas Neue',sans-serif;font-size:52px;font-weight:400;color:#111;line-height:1.0;letter-spacing:0.02em;text-transform:uppercase;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-family:'Bebas Neue',sans-serif;font-size:42px;color:#111;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#E11D48;font-size:14px;font-weight:800;">→</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="sz-btn" style="flex:1;text-align:center;">${data.cta || 'Cop maintenant'}</button><button class="sz-btn-alt" style="flex:1;text-align:center;">Size Guide</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:2px solid #E5E5E5;"><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Express</span><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.return(14)} Échange</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#111;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:#E11D48;text-align:center;text-transform:uppercase;margin-bottom:8px;">Le game</p>
<h2 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#F8F8F8;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:56px;">Pourquoi c'est un must</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="sz-grid3">${[
  { t: benefits[0]||'Coupe oversize', d: 'Fit streetwear authentique, pensé pour le style urbain' },
  { t: benefits[1]||'Tissu heavy', d: 'Cotton premium 300gsm, robuste et confortable au quotidien' },
  { t: benefits[2]||'Édition limitée', d: 'Production en série limitée, chaque drop est unique' },
].map(s => `<div style="background:#1A1A1A;padding:36px 28px;text-align:center;border:1px solid #333;"><h3 style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#F8F8F8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#888;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#F8F8F8;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#111;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">Lookbook</h2>
<div style="display:flex;gap:20px;" class="sz-compare"><div style="flex:1;position:relative;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.7));"><p style="color:#fff;font-family:'Bebas Neue',sans-serif;font-size:16px;text-transform:uppercase;letter-spacing:0.06em;">Street Casual</p></div></div><div style="flex:1;position:relative;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.7));"><p style="color:#fff;font-family:'Bebas Neue',sans-serif;font-size:16px;text-transform:uppercase;letter-spacing:0.06em;">Full Drip</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#111;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#F8F8F8;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">La communauté parle</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="sz-reviews">${[
  { name:'Yassine K.', text:`Le ${data.product_name} est une tuerie. Le fit est parfait, le tissu est lourd. Exactement ce que je voulais.`, date:'2 jours' },
  { name:'Théo M.', text:`Qualité incroyable pour le prix. J'ai pris 2 coloris. Le packaging est stylé aussi.`, date:'5 jours' },
  { name:'Amine B.', text:'Drop cop réussi ! La qualité est vraiment au dessus. Hâte du prochain drop.', date:'1 semaine' },
].map(r => `<div style="background:#1A1A1A;padding:28px 24px;border:1px solid #333;"><div style="color:#E11D48;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#AAA;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#E11D48;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#F8F8F8;">${r.name}</p><p style="font-size:11px;color:#666;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#1A1A1A;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#F8F8F8;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">FAQ</h2><div style="background:#111;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#E11D48;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#fff;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.6);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-family:'Bebas Neue',sans-serif;font-size:56px;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#E11D48;border:none;padding:18px 52px;font-family:'Barlow',sans-serif;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;">${data.cta || 'Cop maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;">Édition limitée · Livraison express · Échanges gratuits</p>
</div></section></body></html>`
}
