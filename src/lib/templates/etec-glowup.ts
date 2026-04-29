import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecGlowup(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #FFE0EB;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-gu-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-gu-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Work Sans',sans-serif;font-size:15px;font-weight:600;color:#2D2D2D;">${f.question}</span>
        <span id="arr-gu-${i}" style="font-size:20px;color:#D4508B;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-gu-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Work Sans',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Work Sans',sans-serif;background:#FFF9FB;color:#2D2D2D;}
.gu-btn{background:linear-gradient(135deg,#D4508B,#E8729E);color:#fff;border:none;border-radius:20px;padding:17px 40px;font-family:'Work Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.gu-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(212,80,139,0.3);}
.gu-btn-alt{background:#FFF0F5;color:#D4508B;border:none;border-radius:20px;padding:15px 40px;font-family:'Work Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.gu-btn-alt:hover{background:#FFE0EB;}
@media(max-width:768px){.gu-hero{flex-direction:column!important;}.gu-hero-img{width:100%!important;height:460px!important;}.gu-hero-info{width:100%!important;padding:32px 20px!important;}.gu-grid3{grid-template-columns:1fr!important;}.gu-compare{flex-direction:column!important;}.gu-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:linear-gradient(90deg,#D4508B,#E8729E);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;">${data.urgency || 'Collection limitée — Offre beauté exclusive'}</div>
<nav style="background:#FFF9FB;border-bottom:1px solid #FFE0EB;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#BBB;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#BBB;">Beauté</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#2D2D2D;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#FFF9FB;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="gu-hero">
<div style="width:55%;position:relative;background:#FFF0F5;overflow:hidden;border-radius:0 20px 20px 0;" class="gu-hero-img"><img id="mi-gu" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#D4508B;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:20px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-gu').src='${img}';document.querySelectorAll('.th-gu').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #D4508B':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-gu" style="width:50px;height:50px;border-radius:50%;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#D4508B':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="gu-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.12em;color:#D4508B;text-transform:uppercase;margin-bottom:12px;">Beauté Premium</p>
<h1 style="font-family:'Marcellus',serif;font-size:42px;font-weight:400;color:#2D2D2D;line-height:1.12;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="background:#FFF0F5;border-radius:20px;padding:16px 24px;display:inline-flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#D4508B;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:20px;height:20px;border-radius:50%;background:#FFF0F5;color:#D4508B;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="gu-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="gu-btn-alt" style="flex:1;text-align:center;">Voir les avis</button></div>
<div style="display:flex;gap:20px;margin-top:20px;justify-content:center;"><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.truck(13)} Offerte</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.lock(13)} Sécurisé</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.return(13)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#FFF0F5;"><div style="max-width:1000px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.12em;color:#D4508B;text-align:center;text-transform:uppercase;margin-bottom:8px;">Résultats</p>
<h2 style="font-family:'Marcellus',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:56px;">Votre routine beauté</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="gu-grid3">${[
  { t: benefits[0]||'Éclat naturel', d: 'Révèle votre beauté naturelle avec des ingrédients premium' },
  { t: benefits[1]||'Longue tenue', d: 'Une formule qui dure toute la journée sans retouche' },
  { t: benefits[2]||'Peau protégée', d: 'Enrichi en actifs qui nourrissent et protègent votre peau' },
].map(s => `<div style="background:#FFF9FB;border-radius:20px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:600;color:#2D2D2D;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFF9FB;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Marcellus',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">Avant / Après</h2>
<div style="display:flex;gap:20px;" class="gu-compare"><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Avant"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Avant</p></div></div><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Après"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Après</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#FFF0F5;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Marcellus',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">Elles en parlent</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="gu-reviews">${[
  { name:'Léa M.', text:`Le ${data.product_name} a transformé ma routine beauté. Mon teint est lumineux et le rendu est incroyable.`, date:'2 jours' },
  { name:'Camille R.', text:'Je suis conquise ! La texture est divine et ça tient toute la journée. Mon must-have beauté.', date:'5 jours' },
  { name:'Sofia T.', text:`Enfin un produit qui tient ses promesses. Ma peau n'a jamais été aussi belle. Merci !`, date:'1 semaine' },
].map(r => `<div style="background:#FFF9FB;border-radius:20px;padding:28px 24px;"><div style="color:#D4508B;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#D4508B,#E8729E);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#2D2D2D;">${r.name}</p><p style="font-size:11px;color:#BBB;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFF9FB;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Marcellus',serif;font-size:32px;font-weight:400;color:#2D2D2D;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#FFF0F5;border-radius:20px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:linear-gradient(135deg,#D4508B,#E8729E);"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Marcellus',serif;font-size:40px;font-weight:400;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:52px;font-weight:700;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#D4508B;border:none;border-radius:20px;padding:18px 52px;font-family:'Work Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Je craque maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Livraison offerte · Satisfaite ou remboursée · Paiement sécurisé</p>
</div></section></body></html>`
}
