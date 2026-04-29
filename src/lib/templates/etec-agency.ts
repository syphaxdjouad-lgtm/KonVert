import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecAgency(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E2E8F0;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-ag-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-ag-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:#1E293B;">${f.question}</span>
        <span id="arr-ag-${i}" style="font-size:20px;color:#334FB4;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-ag-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Inter',sans-serif;font-size:14px;color:#94A3B8;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',sans-serif;background:#FFFFFF;color:#1E293B;}
.ag-btn{background:#1E293B;color:#fff;border:none;border-radius:0;padding:17px 40px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;}.ag-btn:hover{background:#334FB4;transform:translateY(-1px);}
.ag-btn-alt{background:#F1F5F9;color:#1E293B;border:1px solid #E2E8F0;border-radius:0;padding:15px 40px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;}.ag-btn-alt:hover{background:#E2E8F0;}
@media(max-width:768px){.ag-hero{flex-direction:column!important;}.ag-hero-img{width:100%!important;height:460px!important;}.ag-hero-info{width:100%!important;padding:32px 20px!important;}.ag-grid3{grid-template-columns:1fr!important;}.ag-compare{flex-direction:column!important;}.ag-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#1E293B;color:#CBD5E1;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;letter-spacing:0.06em;">${data.urgency || 'Offre professionnelle — Consultation gratuite incluse'}</div>
<nav style="background:#fff;border-bottom:1px solid #E2E8F0;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:#94A3B8;">Accueil</span><span style="font-size:12px;color:#CBD5E1;">›</span><span style="font-size:12px;color:#94A3B8;">Services</span><span style="font-size:12px;color:#CBD5E1;">›</span><span style="font-size:12px;color:#1E293B;font-weight:600;">${data.product_name}</span></div></nav>
<section style="background:#fff;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="ag-hero">
<div style="width:55%;position:relative;background:#F1F5F9;overflow:hidden;" class="ag-hero-img"><img id="mi-ag" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#334FB4;color:#fff;font-size:12px;font-weight:600;padding:7px 16px;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-ag').src='${img}';document.querySelectorAll('.th-ag').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #334FB4':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-ag" style="width:52px;height:52px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#334FB4':'transparent'};opacity:${i===0?1:.5};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="ag-hero-info">
<p style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#334FB4;text-transform:uppercase;margin-bottom:12px;">Professionnel</p>
<h1 style="font-family:'Poppins',sans-serif;font-size:38px;font-weight:700;color:#1E293B;line-height:1.12;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#94A3B8;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-size:36px;font-weight:700;color:#1E293B;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#CBD5E1;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#334FB4;font-size:14px;font-weight:700;">✓</span><span style="font-size:14px;color:#64748B;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="ag-btn" style="flex:1;text-align:center;">${data.cta || 'Commander'}</button><button class="ag-btn-alt" style="flex:1;text-align:center;">En savoir plus</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #E2E8F0;"><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Offerte</span><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Sécurisé</span><span style="font-size:11px;color:#94A3B8;display:flex;align-items:center;gap:5px;">${ico.shield(14)} Garanti</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#F1F5F9;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#334FB4;text-align:center;text-transform:uppercase;margin-bottom:8px;">Expertise</p>
<h2 style="font-family:'Poppins',sans-serif;font-size:32px;font-weight:700;color:#1E293B;text-align:center;margin-bottom:56px;">Nos engagements</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="ag-grid3">${[
  { t: benefits[0]||'Expertise reconnue', d: `Plus de 10 ans d'expérience au service de votre réussite` },
  { t: benefits[1]||'Résultats mesurables', d: 'Des KPIs clairs et un suivi transparent de chaque action' },
  { t: benefits[2]||'Support dédié', d: 'Un interlocuteur unique disponible pour répondre à vos besoins' },
].map(s => `<div style="background:#fff;padding:36px 28px;text-align:center;border:1px solid #E2E8F0;"><h3 style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:600;color:#1E293B;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#94A3B8;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Poppins',sans-serif;font-size:32px;font-weight:700;color:#1E293B;text-align:center;margin-bottom:48px;">En situation</h2>
<div style="display:flex;gap:20px;" class="ag-compare"><div style="flex:1;position:relative;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">En équipe</p></div></div><div style="flex:1;position:relative;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Vue 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.6));"><p style="color:#fff;font-size:14px;font-weight:600;">En action</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#F1F5F9;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Poppins',sans-serif;font-size:32px;font-weight:700;color:#1E293B;text-align:center;margin-bottom:48px;">Ils nous font confiance</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="ag-reviews">${[
  { name:'Marc T.', text:`Le ${data.product_name} a transformé notre approche. Résultats concrets dès le premier mois.`, date:'1 semaine' },
  { name:'Sophie B.', text:`Professionnalisme exemplaire. L'accompagnement est personnalisé et les résultats sont au rendez-vous.`, date:'2 semaines' },
  { name:'Laurent F.', text:'ROI excellent. On a doublé nos performances en 3 mois. Je recommande sans hésitation.', date:'1 mois' },
].map(r => `<div style="background:#fff;padding:28px 24px;border:1px solid #E2E8F0;"><div style="color:#334FB4;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#64748B;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#1E293B;color:#CBD5E1;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">${r.name[0]}</div><div><p style="font-size:13px;font-weight:600;color:#1E293B;">${r.name}</p><p style="font-size:11px;color:#94A3B8;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#fff;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Poppins',sans-serif;font-size:32px;font-weight:700;color:#1E293B;text-align:center;margin-bottom:48px;">FAQ</h2><div style="background:#F1F5F9;padding:8px 32px;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#1E293B;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Poppins',sans-serif;font-size:38px;font-weight:700;color:#fff;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.5);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-size:48px;font-weight:700;color:#334FB4;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#334FB4;color:#fff;border:none;padding:18px 52px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;">${data.cta || 'Démarrer maintenant'}</button>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:20px;">Satisfaction garantie · Support dédié · Paiement sécurisé</p>
</div></section></body></html>`
}
