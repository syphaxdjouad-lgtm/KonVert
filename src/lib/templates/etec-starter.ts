import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecStarter(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E5E7EB;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-st-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-st-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:#111;">${f.question}</span>
        <span id="arr-st-${i}" style="font-size:20px;color:#4F46E5;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-st-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Inter',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',sans-serif;background:#FFFFFF;color:#111;}
.st-btn{background:#4F46E5;color:#fff;border:none;border-radius:12px;padding:17px 40px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.st-btn:hover{background:#4338CA;transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,0.25);}
.st-btn-alt{background:#F5F5FF;color:#4F46E5;border:none;border-radius:12px;padding:15px 40px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.st-btn-alt:hover{background:#EEF2FF;}
@media(max-width:768px){.st-hero{flex-direction:column!important;}.st-hero-img{width:100%!important;height:460px!important;}.st-hero-info{width:100%!important;padding:32px 20px!important;}.st-grid3{grid-template-columns:1fr!important;}.st-compare{flex-direction:column!important;}.st-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#4F46E5;color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;">${data.urgency || `Offre spéciale — Livraison offerte aujourd'hui`}</div>
<nav style="background:#fff;border-bottom:1px solid #E5E7EB;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Boutique</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#111;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#fff;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="st-hero">
<div style="width:55%;position:relative;background:#F5F5FF;overflow:hidden;border-radius:0 12px 12px 0;" class="st-hero-img"><img id="mi-st" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#4F46E5;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:12px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-st').src='${img}';document.querySelectorAll('.th-st').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #4F46E5':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-st" style="width:52px;height:52px;border-radius:12px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#4F46E5':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="st-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#4F46E5;text-transform:uppercase;margin-bottom:12px;">Nouveauté</p>
<h1 style="font-family:'Space Grotesk',sans-serif;font-size:40px;font-weight:700;color:#111;line-height:1.12;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#111;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:20px;height:20px;border-radius:6px;background:#F5F5FF;color:#4F46E5;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="st-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="st-btn-alt" style="flex:1;text-align:center;">En savoir plus</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #E5E7EB;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Offerte</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F5F5FF;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#4F46E5;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avantages</p>
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#111;text-align:center;margin-bottom:56px;">Pourquoi choisir ${data.product_name}</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="st-grid3">${[
  { t: benefits[0]||'Qualité premium', d: 'Des matériaux soigneusement sélectionnés pour une durabilité maximale' },
  { t: benefits[1]||'Design moderne', d: `Un design épuré et contemporain qui s'adapte à tous les styles` },
  { t: benefits[2]||'Satisfaction garantie', d: `Retour gratuit sous 30 jours si vous n'êtes pas satisfait` },
].map(s => `<div style="background:#fff;border-radius:12px;padding:36px 28px;text-align:center;border:1px solid #E5E7EB;"><h3 style="font-size:18px;font-weight:600;color:#111;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#888;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">En situation</h2>
<div style="display:flex;gap:20px;" class="st-compare"><div style="flex:1;position:relative;border-radius:12px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Au quotidien</p></div></div><div style="flex:1;position:relative;border-radius:12px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">En déplacement</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F5F5FF;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">Avis clients</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="st-reviews">${[
  { name:'Thomas D.', text:`Le ${data.product_name} a dépassé mes attentes. Qualité irréprochable et livraison ultra rapide.`, date:'3 jours' },
  { name:'Marine L.', text:'Exactement ce que je cherchais. Simple, efficace, bien pensé. Je recommande à 100%.', date:'1 semaine' },
  { name:'Antoine P.', text:`Rapport qualité-prix imbattable. J'en ai commandé un deuxième pour offrir.`, date:'2 semaines' },
].map(r => `<div style="background:#fff;border-radius:12px;padding:28px 24px;border:1px solid #E5E7EB;"><div style="color:#4F46E5;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#4F46E5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#111;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#111;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F5F5FF;border-radius:12px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#4F46E5;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:38px;font-weight:700;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.6);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#4F46E5;border:none;border-radius:12px;padding:18px 52px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Commander maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;">Livraison offerte · Retour gratuit · Paiement sécurisé</p>
</div></section></body></html>`
}
