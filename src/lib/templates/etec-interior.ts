import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecInterior(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #DDD8D0;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-in-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-in-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#2D2D2D;">${f.question}</span>
        <span id="arr-in-${i}" style="font-size:20px;color:#5B7553;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-in-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'DM Sans',sans-serif;background:#FAF9F6;color:#2D2D2D;}
.in-btn{background:#5B7553;color:#fff;border:none;border-radius:8px;padding:17px 40px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.in-btn:hover{background:#4A6344;transform:translateY(-1px);}
.in-btn-alt{background:#EEF0E8;color:#5B7553;border:none;border-radius:8px;padding:15px 40px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.in-btn-alt:hover{background:#E0E4D8;}
@media(max-width:768px){.in-hero{flex-direction:column!important;}.in-hero-img{width:100%!important;height:460px!important;}.in-hero-info{width:100%!important;padding:32px 20px!important;}.in-grid3{grid-template-columns:1fr!important;}.in-compare{flex-direction:column!important;}.in-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#5B7553;color:#E8EDE4;text-align:center;padding:11px 20px;font-size:12px;font-weight:400;letter-spacing:0.04em;">${data.urgency || `Soldes Maison — Jusqu'à -30% sur la sélection`}</div>
<nav style="background:#FAF9F6;border-bottom:1px solid #DDD8D0;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Mobilier</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#2D2D2D;font-weight:500;">${data.product_name}</span></div></nav>
<section style="background:#FAF9F6;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="in-hero">
<div style="width:56%;position:relative;background:#EEF0E8;overflow:hidden;border-radius:0 8px 8px 0;" class="in-hero-img"><img id="mi-in" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#5B7553;color:#fff;font-size:12px;font-weight:600;padding:7px 16px;border-radius:8px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-in').src='${img}';document.querySelectorAll('.th-in').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #5B7553':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-in" style="width:52px;height:52px;border-radius:8px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#5B7553':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:44%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="in-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#5B7553;text-transform:uppercase;margin-bottom:12px;">Collection Intérieur</p>
<h1 style="font-family:'DM Serif Display',serif;font-size:40px;font-weight:400;color:#2D2D2D;line-height:1.12;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#2D2D2D;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#BBB;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#5B7553;font-size:14px;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="in-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="in-btn-alt" style="flex:1;text-align:center;">Voir les dimensions</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #DDD8D0;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Livraison soignée</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 14j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#EEF0E8;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#5B7553;text-align:center;text-transform:uppercase;margin-bottom:8px;">Qualité</p>
<h2 style="font-family:'DM Serif Display',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:56px;">L'art de vivre chez soi</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="in-grid3">${[
  { t: benefits[0]||'Bois massif', d: 'Matériaux nobles et durables, issus de forêts gérées durablement' },
  { t: benefits[1]||'Design intemporel', d: `Lignes épurées qui s'intègrent dans tous les intérieurs` },
  { t: benefits[2]||'Fabrication française', d: 'Confectionné dans nos ateliers partenaires en France' },
].map(s => `<div style="background:#FAF9F6;border-radius:8px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:600;color:#2D2D2D;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#888;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FAF9F6;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'DM Serif Display',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">Inspirations</h2>
<div style="display:flex;gap:20px;" class="in-compare"><div style="flex:1;position:relative;border-radius:8px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Ambiance 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Salon Contemporain</p></div></div><div style="flex:1;position:relative;border-radius:8px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Ambiance 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Chambre Cocooning</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#EEF0E8;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'DM Serif Display',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">Avis clients</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="in-reviews">${[
  { name:'Isabelle F.', text:`Le ${data.product_name} est magnifique. La qualité du bois est remarquable, le montage simple et rapide.`, date:'5 jours' },
  { name:'Pierre D.', text:'On sent la qualité artisanale. Ce meuble donne une vraie âme à notre salon. Très satisfait.', date:'1 semaine' },
  { name:'Nathalie G.', text:`Livraison impeccable, bien emballé. Le rendu est encore plus beau qu'en photo.`, date:'3 semaines' },
].map(r => `<div style="background:#FAF9F6;border-radius:8px;padding:28px 24px;"><div style="color:#5B7553;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#5B7553;color:#E8EDE4;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#2D2D2D;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FAF9F6;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'DM Serif Display',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#EEF0E8;border-radius:8px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#5B7553;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'DM Serif Display',serif;font-size:38px;font-weight:400;color:#FAF9F6;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(250,249,246,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#E8EDE4;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#FAF9F6;color:#5B7553;border:none;border-radius:8px;padding:18px 52px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Commander maintenant'}</button>
<p style="font-size:12px;color:rgba(250,249,246,0.3);margin-top:20px;">Bois massif · Livraison soignée · Retour gratuit</p>
</div></section></body></html>`
}
