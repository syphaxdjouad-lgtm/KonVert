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
  'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600'

const ELECTRO_THEME: SectionTheme = {
  primary:    '#00b4d8',
  accent:     '#ebf9fc',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#f0fdfa',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecElectro(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #1E293B;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-ec-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-ec-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Nunito Sans',sans-serif;font-size:15px;font-weight:600;color:#F0FDFA;">${f.question}</span>
        <span id="arr-ec-${i}" style="font-size:20px;color:#00B4D8;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-ec-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Nunito Sans',sans-serif;font-size:14px;color:#64748B;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Nunito Sans',sans-serif;background:#F0FDFA;color:#0F172A;}
.ec-btn{background:linear-gradient(135deg,#00B4D8,#0077B6);color:#fff;border:none;border-radius:10px;padding:17px 40px;font-family:'Nunito Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;}.ec-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,180,216,0.3);}
.ec-btn-alt{background:#E0F7FA;color:#00B4D8;border:none;border-radius:10px;padding:15px 40px;font-family:'Nunito Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .3s;}.ec-btn-alt:hover{background:#B2EBF2;}
@media(max-width:768px){.ec-hero{flex-direction:column!important;}.ec-hero-img{width:100%!important;height:460px!important;}.ec-hero-info{width:100%!important;padding:32px 20px!important;}.ec-grid3{grid-template-columns:1fr!important;}.ec-compare{flex-direction:column!important;}.ec-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:linear-gradient(90deg,#00B4D8,#0077B6);color:#fff;text-align:center;padding:11px 20px;font-size:12px;font-weight:700;">${data.urgency || 'Offre lancement — -20% avec le code POWER20'}</div>
<nav style="background:#F0FDFA;border-bottom:1px solid #B2EBF2;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#94A3B8;">Accueil</span><span style="font-size:12px;color:#CBD5E1;">›</span><span style="font-size:12px;color:#94A3B8;">Nutrition</span><span style="font-size:12px;color:#CBD5E1;">›</span><span style="font-size:12px;color:#0F172A;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#F0FDFA;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="ec-hero">
<div style="width:55%;position:relative;background:#E0F7FA;overflow:hidden;border-radius:0 10px 10px 0;" class="ec-hero-img"><img id="mi-ec" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:linear-gradient(135deg,#00B4D8,#0077B6);color:#fff;font-size:12px;font-weight:700;padding:8px 18px;border-radius:10px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-ec').src='${img}';document.querySelectorAll('.th-ec').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #00B4D8':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-ec" style="width:52px;height:52px;border-radius:10px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#00B4D8':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="ec-hero-info">
<p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#00B4D8;text-transform:uppercase;margin-bottom:12px;">Performance</p>
<h1 style="font-family:'Rajdhani',sans-serif;font-size:44px;font-weight:700;color:#0F172A;line-height:1.08;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#64748B;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-family:'Rajdhani',sans-serif;font-size:40px;font-weight:700;color:#0F172A;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CBD5E1;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="width:20px;height:20px;border-radius:6px;background:#E0F7FA;color:#00B4D8;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ico.flash(12)}</span><span style="font-size:14px;color:#475569;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="ec-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button><button class="ec-btn-alt" style="flex:1;text-align:center;">Composition</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #B2EBF2;"><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Express</span><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.shield(14)} Certifié</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#E0F7FA;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#00B4D8;text-align:center;text-transform:uppercase;margin-bottom:8px;">Science</p>
<h2 style="font-family:'Rajdhani',sans-serif;font-size:32px;font-weight:700;color:#0F172A;text-align:center;margin-bottom:56px;">La formule qui fait la différence</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="ec-grid3">${[
  { t: benefits[0]||'Électrolytes essentiels', d: 'Sodium, potassium et magnésium en doses optimales pour la performance' },
  { t: benefits[1]||'Zéro sucre ajouté', d: 'Formule clean sans sucre, sans colorant artificiel, sans compromis' },
  { t: benefits[2]||'Absorption rapide', d: `Technologie d'hydratation avancée pour une récupération express` },
].map(s => `<div style="background:#F0FDFA;border-radius:10px;padding:36px 28px;text-align:center;"><h3 style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:#0F172A;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#64748B;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#F0FDFA;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Rajdhani',sans-serif;font-size:32px;font-weight:700;color:#0F172A;text-align:center;margin-bottom:48px;">En action</h2>
<div style="display:flex;gap:20px;" class="ec-compare"><div style="flex:1;position:relative;border-radius:10px;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Training"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Entraînement</p></div></div><div style="flex:1;position:relative;border-radius:10px;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Recovery"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">Récupération</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#E0F7FA;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Rajdhani',sans-serif;font-size:32px;font-weight:700;color:#0F172A;text-align:center;margin-bottom:48px;">Avis athlètes</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="ec-reviews">${[
  { name:'Kévin R.', text:`Le ${data.product_name} a changé mes sessions. Plus d'énergie, meilleure récup. C'est devenu indispensable.`, date:'3 jours' },
  { name:'Sarah L.', text:'Enfin un produit clean qui marche vraiment. Le goût est top et je sens la différence dès la première utilisation.', date:'1 semaine' },
  { name:'Matthieu D.', text:`Je l'utilise avant et après chaque séance. Fini les crampes et la fatigue. Game changer total.`, date:'2 semaines' },
].map(r => `<div style="background:#F0FDFA;border-radius:10px;padding:28px 24px;"><div style="color:#00B4D8;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#475569;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#00B4D8,#0077B6);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#0F172A;">${r.name}</p><p style="font-size:11px;color:#94A3B8;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#0F172A;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Rajdhani',sans-serif;font-size:32px;font-weight:700;color:#F0FDFA;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#1E293B;border-radius:10px;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#0F172A;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Rajdhani',sans-serif;font-size:42px;font-weight:700;color:#F0FDFA;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(240,253,250,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-family:'Rajdhani',sans-serif;font-size:52px;font-weight:700;color:#00B4D8;margin-bottom:36px;">${data.price}€</p>` : ''}
<button class="ec-btn" style="font-size:15px;padding:18px 52px;">${data.cta || 'Booster ma perf'}</button>
<p style="font-size:12px;color:rgba(240,253,250,0.3);margin-top:20px;">Formule clean · Livraison express · Satisfait ou remboursé</p>
</div></section>
<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, ELECTRO_THEME)}
${renderStorySection(data, ELECTRO_THEME)}
${renderComparisonSection(data, ELECTRO_THEME)}
${renderTestimonialsSection(data, ELECTRO_THEME)}
${renderBonusesSection(data, ELECTRO_THEME)}
${renderGuaranteeSection(data, ELECTRO_THEME)}

</body></html>`
}
