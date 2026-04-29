import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecHue(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #FFE0CC;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-hu-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-hu-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Sora',sans-serif;font-size:15px;font-weight:600;color:#1A1A1A;">${f.question}</span>
        <span id="arr-hu-${i}" style="font-size:20px;color:#FF6B35;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-hu-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Sora',sans-serif;font-size:14px;color:#888;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;background:#FFFEF9;color:#1A1A1A;}
.hu-btn{background:linear-gradient(135deg,#FF6B35,#FF8F5E);color:#fff;border:none;border-radius:16px;padding:17px 40px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.hu-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(255,107,53,0.3);}
.hu-btn-alt{background:#FFF4EC;color:#FF6B35;border:none;border-radius:16px;padding:15px 40px;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.hu-btn-alt:hover{background:#FFE8D9;}
@media(max-width:768px){.hu-hero{flex-direction:column!important;}.hu-hero-img{width:100%!important;height:460px!important;}.hu-hero-info{width:100%!important;padding:32px 20px!important;}.hu-grid3{grid-template-columns:1fr!important;}.hu-compare{flex-direction:column!important;}.hu-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:linear-gradient(90deg,#FF6B35,#FF8F5E,#FFB347);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:600;">${data.urgency || 'Édition créative — Stock limité !'}</div>
<nav style="background:#FFFEF9;border-bottom:1px solid #FFE0CC;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#AAA;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#AAA;">Collection</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#1A1A1A;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#FFFEF9;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="hu-hero">
<div style="width:55%;position:relative;background:#FFF4EC;overflow:hidden;border-radius:0 16px 16px 0;" class="hu-hero-img"><img id="mi-hu" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#FF6B35;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:16px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-hu').src='${img}';document.querySelectorAll('.th-hu').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #FF6B35':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-hu" style="width:52px;height:52px;border-radius:16px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#FF6B35':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="hu-hero-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#FF6B35;text-transform:uppercase;margin-bottom:12px;">Édition Créative</p>
<h1 style="font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;color:#1A1A1A;line-height:1.1;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#888;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#FF6B35;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:20px;height:20px;border-radius:8px;background:#FFF4EC;color:#FF6B35;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="hu-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="hu-btn-alt" style="flex:1;text-align:center;">Découvrir</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #FFE0CC;"><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Offerte</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#AAA;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#FFF4EC;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#FF6B35;text-align:center;text-transform:uppercase;margin-bottom:8px;">Créativité</p>
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:56px;">Ce qui le rend spécial</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="hu-grid3">${[
  { t: benefits[0]||'Design unique', d: 'Chaque pièce est pensée pour exprimer votre personnalité créative' },
  { t: benefits[1]||'Couleurs vibrantes', d: 'Des teintes soigneusement choisies qui captivent le regard' },
  { t: benefits[2]||'Qualité artisanale', d: `Un savoir-faire minutieux pour un résultat d'exception` },
].map(s => `<div style="background:#FFFEF9;border-radius:16px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:600;color:#1A1A1A;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#888;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFFEF9;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">Galerie</h2>
<div style="display:flex;gap:20px;" class="hu-compare"><div style="flex:1;position:relative;border-radius:16px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Style 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Style Audacieux</p></div></div><div style="flex:1;position:relative;border-radius:16px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Style 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Style Raffiné</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#FFF4EC;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">Avis clients</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="hu-reviews">${[
  { name:'Lucas V.', text:`Le ${data.product_name} est une pépite ! Les couleurs sont magnifiques et la qualité est au top.`, date:'3 jours' },
  { name:'Emma B.', text:'Original et bien fait. Ça change des produits classiques. Je suis fan du concept.', date:'1 semaine' },
  { name:'Maxime C.', text:'Commandé pour offrir, tout le monde a adoré. Packaging soigné et produit fidèle aux photos.', date:'2 semaines' },
].map(r => `<div style="background:#FFFEF9;border-radius:16px;padding:28px 24px;"><div style="color:#FF6B35;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#FFB347);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#1A1A1A;">${r.name}</p><p style="font-size:11px;color:#AAA;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FFFEF9;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:#1A1A1A;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#FFF4EC;border-radius:16px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:linear-gradient(135deg,#FF6B35,#FF8F5E,#FFB347);"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Space Grotesk',sans-serif;font-size:38px;font-weight:700;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#FF6B35;border:none;border-radius:16px;padding:18px 52px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Commander maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Livraison offerte · Retour gratuit · Paiement sécurisé</p>
</div></section></body></html>`
}
