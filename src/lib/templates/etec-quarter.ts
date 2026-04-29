import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3965540/pexels-photo-3965540.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecQuarter(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E5E5E5;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-qt-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-qt-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Manrope',sans-serif;font-size:15px;font-weight:600;color:#121212;">${f.question}</span>
        <span id="arr-qt-${i}" style="font-size:20px;color:#121212;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-qt-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Manrope',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Manrope',sans-serif;background:#fff;color:#121212;}
.qt-btn{background:#121212;color:#fff;border:none;border-radius:0;padding:17px 40px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;}.qt-btn:hover{background:#333;transform:translateY(-1px);}
.qt-btn-alt{background:#fff;color:#121212;border:1.5px solid #121212;border-radius:0;padding:15px 40px;font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .3s;}.qt-btn-alt:hover{background:#F5F5F5;}
@media(max-width:768px){.qt-hero{flex-direction:column!important;}.qt-hero-img{width:100%!important;height:460px!important;}.qt-hero-info{width:100%!important;padding:32px 20px!important;}.qt-grid3{grid-template-columns:1fr!important;}.qt-compare{flex-direction:column!important;}.qt-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#121212;color:rgba(255,255,255,0.7);text-align:center;padding:11px 20px;font-size:12px;font-weight:500;letter-spacing:0.04em;">${data.urgency || 'Nouvelle collection disponible — Livraison offerte'}</div>
<nav style="background:#fff;border-bottom:1.5px solid #121212;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#999;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#999;">Boutique</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#121212;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#fff;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="qt-hero">
<div style="width:55%;position:relative;background:#F5F5F5;overflow:hidden;" class="qt-hero-img"><img id="mi-qt" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#121212;color:#fff;font-size:12px;font-weight:700;padding:7px 16px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-qt').src='${img}';document.querySelectorAll('.th-qt').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #121212':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-qt" style="width:52px;height:52px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#121212':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="qt-hero-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:#121212;text-transform:uppercase;margin-bottom:12px;">Essentiel</p>
<h1 style="font-size:40px;font-weight:800;color:#121212;line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;padding-bottom:20px;border-bottom:1.5px solid #E5E5E5;">${data.price ? `<span style="font-size:36px;font-weight:800;color:#121212;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:6px;height:6px;border-radius:50%;background:#121212;flex-shrink:0;"></span><span style="font-size:14px;color:#666;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="qt-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="qt-btn-alt" style="flex:1;text-align:center;">Détails</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1.5px solid #E5E5E5;"><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Offerte</span><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#999;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F5F5F5;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:800;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:56px;">Les détails qui comptent</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="qt-grid3">${[
  { t: benefits[0]||'Matériaux nobles', d: 'Sélection rigoureuse pour une qualité qui se voit et se ressent' },
  { t: benefits[1]||'Design épuré', d: `L'essentiel, rien de superflu. Chaque détail a sa raison d'être` },
  { t: benefits[2]||'Durabilité', d: 'Conçu pour traverser le temps avec élégance et résistance' },
].map(s => `<div style="background:#fff;padding:36px 28px;text-align:center;border-bottom:3px solid #121212;"><h3 style="font-size:18px;font-weight:700;color:#121212;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:800;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">En contexte</h2>
<div style="display:flex;gap:20px;" class="qt-compare"><div style="flex:1;position:relative;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Minimaliste</p></div></div><div style="flex:1;position:relative;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Contemporain</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F5F5F5;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:800;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">Avis</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="qt-reviews">${[
  { name:'Vincent R.', text:`Le ${data.product_name} est exactement ce que je cherchais. Minimaliste, efficace, bien fait.`, date:'4 jours' },
  { name:'Pauline G.', text:`Design impeccable et finitions soignées. On voit que chaque détail a été pensé.`, date:'1 semaine' },
  { name:'David C.', text:'Simple mais pas simpliste. La qualité est remarquable pour le prix. Très satisfait.', date:'2 semaines' },
].map(r => `<div style="background:#fff;padding:28px 24px;border-bottom:3px solid #121212;"><div style="color:#121212;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#666;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#121212;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:700;color:#121212;">${r.name}</p><p style="font-size:11px;color:#999;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-size:32px;font-weight:800;color:#121212;text-align:center;letter-spacing:-0.02em;margin-bottom:48px;">FAQ</h2><div style="background:#F5F5F5;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#121212;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-size:40px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.4);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:52px;font-weight:800;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#121212;border:none;padding:18px 52px;font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Commander'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:20px;">Livraison offerte · Retour gratuit · Paiement sécurisé</p>
</div></section></body></html>`
}
