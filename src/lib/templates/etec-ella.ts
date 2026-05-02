import type { LandingPageData } from '@/types'
import { ico } from './icons'

import {
  renderStorySection,
  renderSocialProofBar,
  renderTestimonialsSection,
  renderComparisonSection,
  renderBonusesSection,
  renderGuaranteeSection,
  type SectionTheme,
} from './sections'
const IMGS = [
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=600'

const ELLA_THEME: SectionTheme = {
  primary:    '#c77dba',
  accent:     '#fbf5f9',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#fdf8fc',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecElla(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `<div style="border-bottom:1px solid #F0E4F0;overflow:hidden;"><button onclick="(function(){var c=document.getElementById('faq-el-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-el-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;"><span style="font-family:'Quicksand',sans-serif;font-size:15px;font-weight:600;color:#2D2D2D;">${f.question}</span><span id="arr-el-${i}" style="font-size:20px;color:#C77DBA;flex-shrink:0;margin-left:16px;">+</span></button><div id="faq-el-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;"><p style="font-family:'Quicksand',sans-serif;font-size:14px;color:#999;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p></div></div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Quicksand',sans-serif;background:#FDF8FC;color:#2D2D2D;}
.el-btn{background:#C77DBA;color:#fff;border:none;border-radius:50px;padding:17px 40px;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;}.el-btn:hover{background:#A8619D;transform:translateY(-1px);box-shadow:0 6px 20px rgba(199,125,186,0.3);}
.el-btn-soft{background:#F8EDF6;color:#C77DBA;border:none;border-radius:50px;padding:15px 40px;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .3s;}.el-btn-soft:hover{background:#F0DEF0;}
@media(max-width:768px){.el-hero{flex-direction:column!important;}.el-img{width:100%!important;height:460px!important;}.el-info{width:100%!important;padding:32px 20px!important;}.el-grid3{grid-template-columns:1fr!important;}.el-compare{flex-direction:column!important;}.el-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:linear-gradient(90deg,#C77DBA,#E8A0D0);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:600;">${data.urgency || 'Vente privée — Jusqu\'à -40% sur la sélection'}</div>
<nav style="background:#FDF8FC;border-bottom:1px solid #F0E4F0;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#BBB;">Accueil</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#BBB;">Mode Femme</span><span style="font-size:12px;color:#DDD;">›</span><span style="font-size:12px;color:#2D2D2D;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#FDF8FC;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="el-hero">
<div style="width:55%;position:relative;overflow:hidden;border-radius:0 24px 24px 0;" class="el-img"><img id="mi-el" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#C77DBA;color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:50px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-el').src='${img}';document.querySelectorAll('.th-el').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #C77DBA':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-el" style="width:50px;height:50px;border-radius:50%;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#C77DBA':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="el-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#C77DBA;text-transform:uppercase;margin-bottom:12px;">Mode Féminine</p>
<h1 style="font-family:'Playfair Display',serif;font-size:42px;font-weight:600;color:#2D2D2D;line-height:1.12;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="background:#F8EDF6;border-radius:16px;padding:16px 24px;display:inline-flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#C77DBA;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CCC;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:20px;height:20px;border-radius:50%;background:#F8EDF6;color:#C77DBA;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✓</span><span style="font-size:14px;color:#555;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;flex-direction:column;gap:10px;"><button class="el-btn" style="width:100%;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="el-btn-soft" style="width:100%;text-align:center;">Ajouter à ma wishlist</button></div>
<div style="display:flex;gap:20px;margin-top:20px;justify-content:center;"><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.truck(13)} Offerte</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.lock(13)} Sécurisé</span><span style="font-size:11px;color:#BBB;display:flex;align-items:center;gap:5px;">${ico.return(13)} Retour 30j</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F8EDF6;"><div style="max-width:1000px;margin:0 auto;"><p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#C77DBA;text-align:center;text-transform:uppercase;margin-bottom:8px;">Détails</p><h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#2D2D2D;text-align:center;margin-bottom:56px;">Ce qui le rend unique</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="el-grid3">${[{t:benefits[0]||'Coupe flatteuse',d:'Silhouette étudiée pour sublimer chaque morphologie'},{t:benefits[1]||'Tissu premium',d:'Matières douces et respirantes, confort toute la journée'},{t:benefits[2]||'Style intemporel',d:'Pièce versatile du matin au soir, saison après saison'}].map(s => `<div style="background:#FDF8FC;border-radius:20px;padding:36px 28px;text-align:center;"><h3 style="font-size:18px;font-weight:700;color:#2D2D2D;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#999;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FDF8FC;"><div style="max-width:1000px;margin:0 auto;"><h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#2D2D2D;text-align:center;margin-bottom:48px;">Inspirations</h2>
<div style="display:flex;gap:20px;" class="el-compare"><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Daily Chic</p></div></div><div style="flex:1;position:relative;border-radius:20px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.5));"><p style="color:#fff;font-size:14px;font-weight:600;">Evening Glam</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F8EDF6;"><div style="max-width:1100px;margin:0 auto;"><h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#2D2D2D;text-align:center;margin-bottom:48px;">Elles adorent</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="el-reviews">${[{name:'Amandine S.',text:`Le ${data.product_name} est une merveille. La coupe est parfaite, le tissu est doux. Ma nouvelle pièce préférée !`,date:'3 jours'},{name:'Clémence B.',text:'Je l\'ai porté pour un mariage, j\'ai reçu tellement de compliments. Élégant et super confortable.',date:'1 semaine'},{name:'Zoé L.',text:'Commande reçue en 2 jours, emballage adorable. La qualité est vraiment au rendez-vous. Je recommande.',date:'2 semaines'}].map(r => `<div style="background:#FDF8FC;border-radius:20px;padding:28px 24px;"><div style="color:#C77DBA;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C77DBA,#E8A0D0);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#2D2D2D;">${r.name}</p><p style="font-size:11px;color:#BBB;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#FDF8FC;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#2D2D2D;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F8EDF6;border-radius:20px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:linear-gradient(135deg,#C77DBA,#E8A0D0);"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Playfair Display',serif;font-size:40px;font-weight:600;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:52px;font-weight:700;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#fff;color:#C77DBA;border:none;border-radius:50px;padding:18px 52px;font-family:'Quicksand',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Shopper maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:20px;">Livraison offerte · Retour gratuit · Paiement sécurisé</p>
</div></section>
<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, ELLA_THEME)}
${renderStorySection(data, ELLA_THEME)}
${renderComparisonSection(data, ELLA_THEME)}
${renderTestimonialsSection(data, ELLA_THEME)}
${renderBonusesSection(data, ELLA_THEME)}
${renderGuaranteeSection(data, ELLA_THEME)}

</body></html>`
}
