import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecPlatina(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E8E4DC;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-pl-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-pl-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:600;color:#2D2D2D;">${f.question}</span>
        <span id="arr-pl-${i}" style="font-size:20px;color:#B8860B;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-pl-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Montserrat',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Montserrat',sans-serif;background:#FDFDFB;color:#2D2D2D;}
.pl-btn{background:#B8860B;color:#fff;border:none;border-radius:4px;padding:17px 40px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.06em;cursor:pointer;transition:all .3s;}.pl-btn:hover{background:#9A7209;transform:translateY(-1px);}
.pl-btn-alt{background:#F7F5EF;color:#B8860B;border:1px solid #E8E4DC;border-radius:4px;padding:15px 40px;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.06em;cursor:pointer;transition:all .3s;}.pl-btn-alt:hover{background:#EDE9DF;}
@media(max-width:768px){.pl-hero{flex-direction:column!important;}.pl-hero-img{width:100%!important;height:460px!important;}.pl-hero-info{width:100%!important;padding:32px 20px!important;}.pl-grid3{grid-template-columns:1fr!important;}.pl-compare{flex-direction:column!important;}.pl-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#2D2D2D;color:#B8860B;text-align:center;padding:11px 20px;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;">${data.urgency || 'Collection exclusive — Pièces numérotées'}</div>
<nav style="background:#FDFDFB;border-bottom:1px solid #E8E4DC;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Bijoux</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#2D2D2D;font-weight:500;">${data.product_name}</span></div></nav>
<section style="background:#FDFDFB;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="pl-hero">
<div style="width:55%;position:relative;background:#F7F5EF;overflow:hidden;border-radius:0 4px 4px 0;" class="pl-hero-img"><img id="mi-pl" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#B8860B;color:#fff;font-size:11px;font-weight:600;padding:7px 16px;border-radius:4px;letter-spacing:0.06em;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-pl').src='${img}';document.querySelectorAll('.th-pl').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #B8860B':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-pl" style="width:52px;height:52px;border-radius:4px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#B8860B':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="pl-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#B8860B;text-transform:uppercase;margin-bottom:12px;">Joaillerie Fine</p>
<h1 style="font-family:'Cormorant',serif;font-size:44px;font-weight:500;color:#2D2D2D;line-height:1.1;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #E8E4DC;">${data.price ? `<span style="font-size:36px;font-weight:600;color:#2D2D2D;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#B8860B;font-size:14px;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="pl-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="pl-btn-alt" style="flex:1;text-align:center;">Guide des tailles</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #E8E4DC;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Écrin offert</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.shield(14)} Certifié</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F7F5EF;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#B8860B;text-align:center;text-transform:uppercase;margin-bottom:8px;">Savoir-faire</p>
<h2 style="font-family:'Cormorant',serif;font-size:32px;font-weight:500;color:#2D2D2D;text-align:center;margin-bottom:56px;">L'excellence en détail</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="pl-grid3">${[
  { t: benefits[0]||'Or 18 carats', d: 'Métaux précieux certifiés, travaillés avec la plus grande précision' },
  { t: benefits[1]||'Pierres naturelles', d: 'Gemmes soigneusement sélectionnées pour leur éclat et leur pureté' },
  { t: benefits[2]||'Fait main', d: 'Chaque bijou est façonné à la main par nos artisans joailliers' },
].map(s => `<div style="background:#FDFDFB;border-radius:4px;padding:36px 28px;text-align:center;border:1px solid #E8E4DC;"><h3 style="font-family:'Cormorant',serif;font-size:20px;font-weight:600;color:#2D2D2D;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FDFDFB;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Cormorant',serif;font-size:32px;font-weight:500;color:#2D2D2D;text-align:center;margin-bottom:48px;">Porté au quotidien</h2>
<div style="display:flex;gap:20px;" class="pl-compare"><div style="flex:1;position:relative;border-radius:4px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Élégance Jour</p></div></div><div style="flex:1;position:relative;border-radius:4px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Éclat Soir</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F7F5EF;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Cormorant',serif;font-size:32px;font-weight:500;color:#2D2D2D;text-align:center;margin-bottom:48px;">Elles témoignent</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="pl-reviews">${[
  { name:'Charlotte L.', text:`Le ${data.product_name} est d'une finesse incroyable. L'écrin de présentation est magnifique. Un vrai bijou.`, date:'4 jours' },
  { name:'Marie-Anne D.', text:`Reçu pour mon anniversaire, c'est exactement ce que j'espérais. La qualité est exceptionnelle.`, date:'1 semaine' },
  { name:'Élodie S.', text:'Service client au top, livraison rapide dans un superbe écrin. Le bijou brille de mille feux.', date:'2 semaines' },
].map(r => `<div style="background:#FDFDFB;border-radius:4px;padding:28px 24px;border:1px solid #E8E4DC;"><div style="color:#B8860B;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#2D2D2D;color:#B8860B;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#2D2D2D;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FDFDFB;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Cormorant',serif;font-size:32px;font-weight:500;color:#2D2D2D;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F7F5EF;border-radius:4px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#2D2D2D;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Cormorant',serif;font-size:40px;font-weight:500;color:#FDFDFB;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(253,253,251,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:600;color:#B8860B;margin-bottom:36px;">${data.price}€</p>` : ''}
<button class="pl-btn" style="font-size:14px;padding:18px 52px;">${data.cta || 'Offrir ce bijou'}</button>
<p style="font-size:12px;color:rgba(253,253,251,0.3);margin-top:20px;">Écrin offert · Certificat d'authenticité · Retour gratuit</p>
</div></section></body></html>`
}
