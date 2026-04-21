import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecBoost(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #F0E0F0;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-bo-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-bo-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;color:#1A1A2E;">${f.question}</span>
        <span id="arr-bo-${i}" style="font-size:20px;color:#FF2277;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-bo-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Poppins',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Poppins',sans-serif;background:#fff;color:#1A1A2E;}
.bo-btn{background:linear-gradient(135deg,#FF2277,#724CE9);color:#fff;border:none;border-radius:14px;padding:17px 40px;font-family:'Poppins',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;}.bo-btn:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(255,34,119,0.35);}
.bo-btn-alt{background:#FFF0F5;color:#FF2277;border:none;border-radius:14px;padding:15px 40px;font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.bo-btn-alt:hover{background:#FFE0EB;}
@media(max-width:768px){.bo-hero{flex-direction:column!important;}.bo-hero-img{width:100%!important;height:460px!important;}.bo-hero-info{width:100%!important;padding:32px 20px!important;}.bo-grid3{grid-template-columns:1fr!important;}.bo-compare{flex-direction:column!important;}.bo-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:linear-gradient(90deg,#FF2277,#724CE9);color:#fff;text-align:center;padding:12px 20px;font-size:12px;font-weight:600;">${data.urgency || 'Offre flash — Plus que quelques unités en stock !'}</div>
<nav style="background:#fff;border-bottom:1px solid #F0E0F0;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#BBB;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#BBB;">Wellness</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#1A1A2E;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#fff;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="bo-hero">
<div style="width:55%;position:relative;background:#FFF0F5;overflow:hidden;border-radius:0 14px 14px 0;" class="bo-hero-img"><img id="mi-bo" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:linear-gradient(135deg,#FF2277,#724CE9);color:#fff;font-size:12px;font-weight:700;padding:8px 20px;border-radius:14px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-bo').src='${img}';document.querySelectorAll('.th-bo').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #FF2277':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-bo" style="width:52px;height:52px;border-radius:14px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#FF2277':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="bo-hero-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#FF2277;text-transform:uppercase;margin-bottom:12px;">Bestseller</p>
<h1 style="font-size:40px;font-weight:800;color:#1A1A2E;line-height:1.1;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:20px;">${data.subtitle}</p>
<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;"><div style="display:flex;">${'★★★★★'.split('').map(() => `<span style="color:#FF2277;font-size:16px;">★</span>`).join('')}</div><span style="font-size:13px;color:#999;">4.9/5 · 2 847 avis</span></div>
<div style="background:#FFF0F5;border-radius:14px;padding:16px 24px;display:inline-flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:800;color:#FF2277;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#FF2277,#724CE9);color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="bo-btn" style="flex:1;text-align:center;">${data.cta || 'Commander maintenant'}</button><button class="bo-btn-alt" style="flex:1;text-align:center;">Composition</button></div>
<div style="display:flex;gap:16px;margin-top:20px;justify-content:center;"><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.truck(13)} Offerte</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.lock(13)} Sécurisé</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.shield(13)} Garanti</span><span style="font-size:11px;color:#039903;font-weight:600;display:flex;align-items:center;gap:5px;">${ico.flash(13)} En stock</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#FFF0F5;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#FF2277;text-align:center;text-transform:uppercase;margin-bottom:8px;">Résultats prouvés</p>
<h2 style="font-size:32px;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:56px;">Pourquoi ils adorent</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="bo-grid3">${[
  { t: benefits[0]||'Formule naturelle', d: 'Ingrédients purs et efficaces, sans additifs inutiles' },
  { t: benefits[1]||'Résultats visibles', d: 'Effets ressentis dès les premières utilisations' },
  { t: benefits[2]||'Certifié qualité', d: 'Testé en laboratoire et approuvé par des experts' },
].map(s => `<div style="background:#fff;border-radius:14px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:48px;">Avant / Après</h2>
<div style="display:flex;gap:20px;" class="bo-compare"><div style="flex:1;position:relative;border-radius:14px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Avant"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Avant</p></div></div><div style="flex:1;position:relative;border-radius:14px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Après"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Après</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#FFF0F5;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-size:32px;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:48px;">+2 800 avis 5 étoiles</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="bo-reviews">${[
  { name:'Julie M.', text:`Le ${data.product_name} a changé ma vie. Résultats visibles en 2 semaines. Je ne peux plus m'en passer !`, date:'2 jours' },
  { name:'Karim A.', text:`J'étais sceptique mais les résultats parlent d'eux-mêmes. Formule top, goût agréable. 5 étoiles.`, date:'5 jours' },
  { name:'Chloé D.', text:'Commandé 3 fois déjà. Livraison rapide, produit efficace. Mon entourage me demande mon secret !', date:'1 semaine' },
].map(r => `<div style="background:#fff;border-radius:14px;padding:28px 24px;"><div style="color:#FF2277;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF2277,#724CE9);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#1A1A2E;">${r.name}</p><p style="font-size:11px;color:#BBB;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-size:32px;font-weight:800;color:#1A1A2E;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#FFF0F5;border-radius:14px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:linear-gradient(135deg,#724CE9,#FF2277);"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-size:40px;font-weight:800;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:52px;font-weight:800;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#FF2277;border:none;border-radius:14px;padding:18px 52px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Je commande maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Satisfait ou remboursé · Livraison offerte · Paiement sécurisé</p>
</div></section></body></html>`
}
