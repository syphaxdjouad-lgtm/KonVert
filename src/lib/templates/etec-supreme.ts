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
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600'

const SUPREME_THEME: SectionTheme = {
  primary:    '#fe0100',
  accent:     'rgba(255,255,255,0.06)',
  text:       '#ffffff',
  textMuted:  'rgba(255,255,255,0.6)',
  bg:         '#000',
  bgAlt:      'rgba(255,255,255,0.04)',
  border:     'rgba(255,255,255,0.10)',
  fontFamily: "'Inter',sans-serif",
  radius:     '12px',
}

export function templateEtecSupreme(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #333;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-sp-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';document.getElementById('arr-sp-${i}').textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Inconsolata',monospace;font-size:15px;font-weight:700;color:#fff;">${f.question}</span>
        <span id="arr-sp-${i}" style="font-size:20px;color:#FE0100;flex-shrink:0;margin-left:16px;font-family:'Inconsolata',monospace;">+</span>
      </button>
      <div id="faq-sp-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Anonymous Pro',monospace;font-size:14px;color:#777;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html><html lang="${data.language || 'fr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700;900&family=Anonymous+Pro:wght@400;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Anonymous Pro',monospace;background:#000;color:#fff;}
.sp-btn{background:#FE0100;color:#fff;border:none;border-radius:0;padding:17px 40px;font-family:'Inconsolata',monospace;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;transition:all .3s;}.sp-btn:hover{background:#fff;color:#000;transform:translateY(-1px);}
.sp-btn-alt{background:transparent;color:#fff;border:1px solid #555;border-radius:0;padding:15px 40px;font-family:'Inconsolata',monospace;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;transition:all .3s;}.sp-btn-alt:hover{border-color:#FE0100;color:#FE0100;}
@media(max-width:768px){.sp-hero{flex-direction:column!important;}.sp-hero-img{width:100%!important;height:460px!important;}.sp-hero-info{width:100%!important;padding:32px 20px!important;}.sp-grid3{grid-template-columns:1fr!important;}.sp-compare{flex-direction:column!important;}.sp-reviews{grid-template-columns:1fr!important;}}</style></head><body>
<div style="background:#FE0100;color:#fff;text-align:center;padding:11px 20px;font-family:'Inconsolata',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">${data.urgency || 'Exclusive drop — Members only'}</div>
<nav style="background:#000;border-bottom:1px solid #222;padding:14px 24px;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;"><span style="font-family:'Inconsolata',monospace;font-size:12px;color:#555;">Home</span><span style="font-size:12px;color:#333;">›</span><span style="font-family:'Inconsolata',monospace;font-size:12px;color:#555;">Drop</span><span style="font-size:12px;color:#333;">›</span><span style="font-family:'Inconsolata',monospace;font-size:12px;color:#fff;font-weight:700;">${data.product_name}</span></div></nav>
<section style="background:#000;padding:0;"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="sp-hero">
<div style="width:55%;position:relative;background:#111;overflow:hidden;" class="sp-hero-img"><img id="mi-sp" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:520px;" alt="${data.product_name}">
${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#FE0100;color:#fff;font-family:'Inconsolata',monospace;font-size:12px;font-weight:700;padding:8px 18px;text-transform:uppercase;letter-spacing:0.06em;">-${savePct}%</div>` : ''}
<div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">${imgs.slice(0,4).map((img, i) => `<div onclick="document.getElementById('mi-sp').src='${img}';document.querySelectorAll('.th-sp').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #FE0100':'2px solid transparent';t.style.opacity=j===${i}?'1':'.4';});" class="th-sp" style="width:52px;height:52px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#FE0100':'transparent'};opacity:${i===0?1:.4};transition:all .2s;"><img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`).join('')}</div></div>
<div style="width:45%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;background:#000;" class="sp-hero-info">
<p style="font-family:'Inconsolata',monospace;font-size:11px;font-weight:700;letter-spacing:0.2em;color:#FE0100;text-transform:uppercase;margin-bottom:12px;">Exclusive</p>
<h1 style="font-family:'Inconsolata',monospace;font-size:44px;font-weight:900;color:#fff;line-height:1.05;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:14px;">${data.headline}</h1>
<p style="font-size:15px;color:#777;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;">${data.price ? `<span style="font-family:'Inconsolata',monospace;font-size:42px;font-weight:900;color:#fff;">${data.price}€</span>` : ''}${data.original_price ? `<span style="font-size:18px;color:#555;text-decoration:line-through;">${data.original_price}€</span>` : ''}</div>
<ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">${benefits.map(b => `<li style="display:flex;align-items:center;gap:10px;"><span style="color:#FE0100;font-family:'Inconsolata',monospace;font-size:14px;font-weight:700;">→</span><span style="font-size:14px;color:#AAA;">${b}</span></li>`).join('')}</ul>
<div style="display:flex;gap:12px;"><button class="sp-btn" style="flex:1;text-align:center;">${data.cta || 'Cop now'}</button><button class="sp-btn-alt" style="flex:1;text-align:center;">Details</button></div>
<div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #222;"><span style="font-family:'Inconsolata',monospace;font-size:11px;color:#555;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Express</span><span style="font-family:'Inconsolata',monospace;font-size:11px;color:#555;display:flex;align-items:center;gap:5px;">${ico.lock(14)} Secure</span><span style="font-family:'Inconsolata',monospace;font-size:11px;color:#555;display:flex;align-items:center;gap:5px;">${ico.return(14)} Returns</span></div>
</div></div></section>
<section style="padding:80px 24px;background:#111;"><div style="max-width:1100px;margin:0 auto;">
<p style="font-family:'Inconsolata',monospace;font-size:11px;font-weight:700;letter-spacing:0.2em;color:#FE0100;text-align:center;text-transform:uppercase;margin-bottom:8px;">Details</p>
<h2 style="font-family:'Inconsolata',monospace;font-size:32px;font-weight:900;color:#fff;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:56px;">Why this piece</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="sp-grid3">${[
  { t: benefits[0]||'Premium materials', d: 'Heavyweight fabric, built to last through every season' },
  { t: benefits[1]||'Limited run', d: 'Numbered pieces, once gone they are gone forever' },
  { t: benefits[2]||'Exclusive design', d: 'Original artwork and graphics you will not find anywhere else' },
].map(s => `<div style="background:#1A1A1A;padding:36px 28px;text-align:center;border:1px solid #333;"><h3 style="font-family:'Inconsolata',monospace;font-size:16px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;">${s.t}</h3><p style="font-size:14px;color:#777;line-height:1.7;">${s.d}</p></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#000;"><div style="max-width:1000px;margin:0 auto;">
<h2 style="font-family:'Inconsolata',monospace;font-size:32px;font-weight:900;color:#fff;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">Lookbook</h2>
<div style="display:flex;gap:20px;" class="sp-compare"><div style="flex:1;position:relative;overflow:hidden;"><img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 1"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.8));"><p style="color:#fff;font-family:'Inconsolata',monospace;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Street</p></div></div><div style="flex:1;position:relative;overflow:hidden;"><img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:360px;object-fit:cover;display:block;" alt="Look 2"><div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.8));"><p style="color:#fff;font-family:'Inconsolata',monospace;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Night</p></div></div></div></div></section>
<section style="padding:80px 24px;background:#111;"><div style="max-width:1100px;margin:0 auto;">
<h2 style="font-family:'Inconsolata',monospace;font-size:32px;font-weight:900;color:#fff;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">Community</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="sp-reviews">${[
  { name:'Alex K.', text:`${data.product_name} is insane. Quality is next level, fit is perfect. Best cop this year.`, date:'2 jours' },
  { name:'Jordan W.', text:'The fabric weight is crazy. Feels premium from the second you put it on. 10/10.', date:'5 jours' },
  { name:'Chris M.', text:'Shipped fast, packed clean. This piece is a grail. Already waiting for the next drop.', date:'1 semaine' },
].map(r => `<div style="background:#1A1A1A;padding:28px 24px;border:1px solid #333;"><div style="color:#FE0100;font-family:'Inconsolata',monospace;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div><p style="font-size:14px;color:#AAA;line-height:1.75;margin-bottom:20px;">"${r.text}"</p><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:#FE0100;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Inconsolata',monospace;font-weight:700;font-size:14px;">${r.name[0]}</div><div><p style="font-family:'Inconsolata',monospace;font-size:13px;font-weight:700;color:#fff;">${r.name}</p><p style="font-family:'Inconsolata',monospace;font-size:11px;color:#555;">Il y a ${r.date}</p></div></div></div>`).join('')}</div></div></section>
<section style="padding:80px 24px;background:#000;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-family:'Inconsolata',monospace;font-size:32px;font-weight:900;color:#fff;text-align:center;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:48px;">FAQ</h2><div style="background:#111;padding:8px 32px;border:1px solid #222;">${faqHtml}</div></div></section>
<section style="padding:100px 24px;background:#FE0100;"><div style="max-width:700px;margin:0 auto;text-align:center;">
<h2 style="font-family:'Inconsolata',monospace;font-size:44px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:16px;">${data.headline}</h2>
<p style="font-size:15px;color:rgba(255,255,255,0.6);margin-bottom:36px;">${data.subtitle}</p>
${data.price ? `<p style="font-family:'Inconsolata',monospace;font-size:56px;font-weight:900;color:#fff;margin-bottom:36px;">${data.price}€</p>` : ''}
<button style="background:#000;color:#fff;border:none;padding:18px 52px;font-family:'Inconsolata',monospace;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">${data.cta || 'Cop now'}</button>
<p style="font-family:'Inconsolata',monospace;font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;">Limited edition · Express shipping · Free returns</p>
</div></section>
<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, SUPREME_THEME)}
${renderStorySection(data, SUPREME_THEME)}
${renderComparisonSection(data, SUPREME_THEME)}
${renderTestimonialsSection(data, SUPREME_THEME)}
${renderBonusesSection(data, SUPREME_THEME)}
${renderGuaranteeSection(data, SUPREME_THEME)}

</body></html>`
}
