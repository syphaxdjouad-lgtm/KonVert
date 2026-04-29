import type { LandingPageData } from '@/types'
import { ico } from './icons'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
]

const C = {
  bg:          '#0A0A0A',
  bgAlt:       '#111111',
  card:        '#161616',
  accent:      '#C9A84C',
  accentLight: '#F5E6B8',
  text:        '#F0EAD6',
  muted:       '#8A8070',
  border:      '#2A2420',
}

export function templateEtecLuxe(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('miLx').src='${img}';document.querySelectorAll('.thlx').forEach(function(t,j){t.style.outline=j===${i}?'1px solid ${C.accent}':'1px solid transparent';t.style.opacity=j===${i}?'1':'.4';});"
      class="thlx"
      style="overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `1px solid ${C.accent}` : '1px solid transparent'};opacity:${i === 0 ? 1 : .4};transition:all .25s;"
    ><img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>`).join('')

  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:14px;align-items:flex-start;padding:11px 0;border-bottom:1px solid ${C.border};">
      <span style="color:${C.accent};font-size:12px;flex-shrink:0;margin-top:3px;letter-spacing:1px;">—</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'Inter',sans-serif;">${b}</span>
    </li>`).join('')

  const savoirFaire = [
    { icon: '◆', title: 'Master Craftsmanship', desc: data.benefits[0] || 'Every piece passes through the hands of artisans with decades of experience, trained in techniques refined over generations.' },
    { icon: '✦', title: 'Rare Materials',        desc: data.benefits[1] || "Sourced from the world's finest estates. Only materials that meet our exacting standards for provenance and quality are selected." },
    { icon: '♾', title: 'Lifetime Guarantee',   desc: data.benefits[2] || 'We stand behind every creation with an unconditional lifetime guarantee. Our commitment to excellence has no expiry date.' },
  ]

  const savoirFaireHTML = savoirFaire.map(item => `
    <div style="text-align:center;padding:40px 28px;background:${C.bgAlt};">
      <div style="font-size:22px;color:${C.accent};margin-bottom:20px;letter-spacing:2px;">${item.icon}</div>
      <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${C.text};margin-bottom:14px;letter-spacing:.02em;">${item.title}</h3>
      <p style="font-size:13px;color:${C.muted};line-height:1.9;font-family:'Inter',sans-serif;">${item.desc}</p>
    </div>`).join('')

  const reviewsData = [
    { name: 'Isabelle de M.', date: '6 days ago',  text: 'A level of excellence rarely encountered. The quality of the materials is irreproachable, the packaging itself is a gift. I own several pieces from this house and each one fully justifies its price.' },
    { name: 'Charles F.',     date: '2 weeks ago', text: 'I exclusively gift from this house for important occasions. The presentation is sumptuous, the quality speaks for itself from the very first touch. My circle is always impressed.' },
    { name: 'Marguerite L.',  date: '1 month ago', text: 'A collector for years, I am very demanding. This piece surpasses my expectations on every level — quality, finish, the invisible details that make all the difference.' },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="border:1px solid ${C.accent};padding:32px;position:relative;">
      <span style="color:${C.accent};font-size:13px;letter-spacing:4px;display:block;margin-bottom:18px;">★★★★★</span>
      <p style="font-size:16px;color:${C.muted};line-height:1.9;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;margin-bottom:24px;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:34px;height:34px;border:1px solid ${C.border};color:${C.accent};font-weight:600;font-size:13px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',Georgia,serif;">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:500;color:${C.text};font-family:'Inter',sans-serif;letter-spacing:.04em;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'Inter',sans-serif;">${r.date}</p>
        </div>
      </div>
    </div>`).join('')

  const collectionHTML = [0, 1, 2].map(i => {
    const names   = [data.product_name, `${data.product_name} — Edition Noir`, `${data.product_name} — Edition Or`]
    const prices  = [
      data.price || '—',
      data.price ? String(parseFloat(data.price) + 80)  : '—',
      data.price ? String(parseFloat(data.price) + 150) : '—',
    ]
    return `
    <div style="background:${C.bgAlt};border:1px solid ${C.border};overflow:hidden;position:relative;" onmouseover="this.style.borderColor='${C.accent}';this.querySelector('.ctalx${i}').style.opacity='1'" onmouseout="this.style.borderColor='${C.border}';this.querySelector('.ctalx${i}').style.opacity='0'">
      <div style="aspect-ratio:3/4;overflow:hidden;">
        <img src="${imgs[i] || imgs[0]}" alt="${names[i]}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div style="padding:20px;">
        <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};margin-bottom:6px;font-family:'Inter',sans-serif;">Limited Edition</p>
        <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:600;color:${C.text};margin-bottom:10px;">${names[i]}</h4>
        <p style="font-size:16px;color:${C.accent};font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;">${prices[i]}€</p>
      </div>
      <div class="ctalx${i}" style="position:absolute;bottom:0;left:0;right:0;background:${C.accent};padding:14px;text-align:center;opacity:0;transition:opacity .25s;">
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:12px;font-weight:600;color:${C.bg};font-family:'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Discover →</a>
      </div>
    </div>`
  }).join('')

  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fplx').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.filx').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='280px';p.style.padding='0 0 20px 0';this.querySelector('.filx').textContent='−';}"
        style="width:100%;background:none;border:none;padding:22px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:400;color:${C.text};font-family:'Inter',sans-serif;letter-spacing:.01em;">${item.question}</span>
        <span class="filx" style="color:${C.accent};font-size:20px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div class="fplx" style="max-height:${i === 0 ? '280px' : '0'};overflow:hidden;transition:max-height .4s ease,padding .4s ease;padding:${i === 0 ? '0 0 20px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.9;font-family:'Inter',sans-serif;">${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;} a{text-decoration:none;}
  @keyframes marqueelx{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @media(max-width:768px){
    .grid2-lx{grid-template-columns:1fr!important;gap:28px!important;}
    .h1-lx{font-size:44px!important;}
    .grid3-lx{grid-template-columns:1fr!important;gap:16px!important;}
    .grid4-lx{grid-template-columns:1fr 1fr!important;gap:12px!important;}
    .footer-lx{grid-template-columns:1fr!important;gap:32px!important;}
    .nav-links-lx{display:none!important;}
    .logobar-lx{gap:24px!important;}
  }
</style>
</head>
<body>

<!-- ═══ BARRE TOP MARQUEE ════════════════════════════════════════════════ -->
<div style="background:${C.accent};overflow:hidden;padding:10px 0;">
  <div style="display:flex;white-space:nowrap;">
    <div style="display:flex;animation:marqueelx 24s linear infinite;white-space:nowrap;">
      ${Array(10).fill(`<span style="font-size:12px;font-weight:500;color:${C.bg};font-family:'Inter',sans-serif;letter-spacing:.08em;padding:0 32px;">Complimentary shipping on orders above 150€</span><span style="font-size:12px;color:${C.bg};opacity:.4;padding:0 8px;">·</span>`).join('')}
    </div>
    <div style="display:flex;animation:marqueelx 24s linear infinite;white-space:nowrap;" aria-hidden="true">
      ${Array(10).fill(`<span style="font-size:12px;font-weight:500;color:${C.bg};font-family:'Inter',sans-serif;letter-spacing:.08em;padding:0 32px;">Complimentary shipping on orders above 150€</span><span style="font-size:12px;color:${C.bg};opacity:.4;padding:0 8px;">·</span>`).join('')}
    </div>
  </div>
</div>

<!-- ═══ NAVBAR ══════════════════════════════════════════════════════════ -->
<nav style="background:${C.bg};border-bottom:1px solid ${C.border};position:sticky;top:0;z-index:100;">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:70px;">
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;color:${C.text};letter-spacing:.18em;text-transform:uppercase;">LUXE</a>
    <div class="nav-links-lx" style="display:flex;align-items:center;gap:36px;">
      ${['Collection','Maison','Atelier','Héritage'].map(l => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:13px;font-weight:300;color:${C.muted};font-family:'Inter',sans-serif;letter-spacing:.06em;transition:color .2s;" onmouseover="this.style.color='${C.text}'" onmouseout="this.style.color='${C.muted}'">${l}</a>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:18px;">
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="color:${C.accent};" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </a>
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="color:${C.accent};" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.501 5.501 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </a>
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="color:${C.accent};" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </a>
    </div>
  </div>
</nav>

<!-- ═══ HERO CINÉMATIQUE ════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:80px 0 72px;position:relative;overflow:hidden;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 70%);pointer-events:none;"></div>
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:20px;">Maison de Haute Joaillerie</p>
      <h1 class="h1-lx" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:80px;font-weight:300;line-height:1.05;letter-spacing:-.01em;color:${C.text};margin-bottom:20px;">Crafted for the<br/><em style="font-style:italic;color:${C.accent};">Exceptional</em></h1>
      <p style="font-size:16px;font-weight:300;color:${C.muted};max-width:520px;margin:0 auto 36px;font-family:'Inter',sans-serif;line-height:1.75;letter-spacing:.02em;">${data.subtitle || 'Where centuries of savoir-faire meet the pursuit of absolute perfection. Each creation, a singular testament to excellence.'}</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:${C.accent};color:${C.bg};padding:16px 40px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;display:inline-block;transition:opacity .2s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">${data.cta || 'Discover the Collection'}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:transparent;color:${C.accent};padding:16px 40px;font-size:12px;font-weight:400;font-family:'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;border:1px solid ${C.accent};display:inline-block;transition:all .2s;" onmouseover="this.style.background='${C.accent}';this.style.color='${C.bg}'" onmouseout="this.style.background='transparent';this.style.color='${C.accent}'">Our Story</a>
      </div>
    </div>
    <div style="max-width:560px;margin:0 auto;position:relative;">
      <div style="position:absolute;inset:-20px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.1) 0%,transparent 70%);pointer-events:none;"></div>
      <div style="aspect-ratio:4/3;overflow:hidden;border:1px solid ${C.border};box-shadow:0 0 80px rgba(201,168,76,.12),0 40px 100px rgba(0,0,0,.5);">
        <img src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
      </div>
    </div>
  </div>
</section>

<!-- ═══ LOGO BAR ════════════════════════════════════════════════════════ -->
<section style="background:${C.bgAlt};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:28px 0;">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <p style="text-align:center;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:22px;">As Seen In</p>
    <div class="logobar-lx" style="display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap;">
      ${["VOGUE","Harper's Bazaar","Forbes","Elle","Vanity Fair"].map(p => `<span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:500;color:${C.muted};letter-spacing:.12em;opacity:.55;">${p}</span>`).join('')}
    </div>
  </div>
</section>

<!-- ═══ PRODUIT ══════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div class="grid2-lx" style="display:grid;grid-template-columns:55% 45%;gap:64px;align-items:start;">
      <div>
        <div style="overflow:hidden;aspect-ratio:1;border:1px solid ${C.border};margin-bottom:12px;background:${C.bgAlt};">
          <img id="miLx" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'"/>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${thumbsHTML}</div>
      </div>
      <div>
        <div style="width:40px;height:1px;background:${C.accent};margin-bottom:20px;"></div>
        <span style="display:inline-block;border:1px solid ${C.accent};color:${C.accent};font-size:10px;font-weight:500;padding:4px 14px;font-family:'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px;">Limited Edition</span>
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;font-weight:500;line-height:1.15;letter-spacing:-.01em;color:${C.text};margin-bottom:12px;">${data.product_name}</h1>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px;">
          <span style="color:${C.accent};font-size:13px;letter-spacing:4px;">★★★★★</span>
          <span style="font-size:12px;color:${C.muted};font-family:'Inter',sans-serif;">4.9/5 · 127 reviews</span>
        </div>
        <div style="margin-bottom:24px;padding:22px 24px;border:1px solid ${C.border};background:${C.bgAlt};">
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
            ${data.price ? `<span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;font-weight:600;color:${C.accent};line-height:1;">${data.price}€</span>` : ''}
            ${data.original_price ? `<span style="font-size:20px;color:${C.muted};text-decoration:line-through;font-family:'Inter',sans-serif;">${data.original_price}€</span>` : ''}
            ${savePct > 0 ? `<span style="border:1px solid ${C.accent};color:${C.accent};padding:4px 12px;font-size:11px;font-weight:500;font-family:'Inter',sans-serif;letter-spacing:.08em;">-${savePct}%</span>` : ''}
          </div>
        </div>
        <p style="font-size:14px;color:${C.muted};line-height:1.9;margin-bottom:22px;font-family:'Inter',sans-serif;font-weight:300;">${data.subtitle || 'An object of rare beauty, meticulously crafted to endure through generations.'}</p>
        <ul style="list-style:none;margin-bottom:32px;">${benefitsHTML}</ul>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:${C.accent};color:${C.bg};padding:18px 32px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;transition:opacity .2s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">${data.cta || 'Acquire this piece'}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:transparent;color:${C.accent};padding:16px 32px;font-size:12px;font-weight:400;font-family:'Inter',sans-serif;letter-spacing:.12em;text-transform:uppercase;border:1px solid ${C.border};margin-bottom:24px;transition:border-color .2s;" onmouseover="this.style.borderColor='${C.accent}'" onmouseout="this.style.borderColor='${C.border}'">Add to Private Wishlist</a>
        ${data.urgency ? `<div style="display:flex;align-items:center;gap:10px;border:1px solid ${C.border};padding:13px 16px;margin-bottom:24px;"><span style="color:${C.accent};">◆</span><p style="font-size:12px;color:${C.accent};font-weight:500;font-family:'Inter',sans-serif;letter-spacing:.04em;">${data.urgency}</p></div>` : ''}
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};">
          <div style="background:${C.bgAlt};padding:16px 10px;text-align:center;"><div style="color:${C.accent};margin-bottom:6px;display:flex;justify-content:center;">${ico.shield(16)}</div><div style="font-size:11px;font-weight:500;color:${C.text};margin-bottom:2px;font-family:'Inter',sans-serif;letter-spacing:.04em;">Authenticity</div><div style="font-size:10px;color:${C.muted};font-family:'Inter',sans-serif;">Certificate</div></div>
          <div style="background:${C.bgAlt};padding:16px 10px;text-align:center;"><div style="color:${C.accent};margin-bottom:6px;display:flex;justify-content:center;">${ico.truck(16)}</div><div style="font-size:11px;font-weight:500;color:${C.text};margin-bottom:2px;font-family:'Inter',sans-serif;letter-spacing:.04em;">Private Delivery</div><div style="font-size:10px;color:${C.muted};font-family:'Inter',sans-serif;">Luxury packaging</div></div>
          <div style="background:${C.bgAlt};padding:16px 10px;text-align:center;"><div style="color:${C.accent};margin-bottom:6px;display:flex;justify-content:center;">${ico.lock(16)}</div><div style="font-size:11px;font-weight:500;color:${C.text};margin-bottom:2px;font-family:'Inter',sans-serif;letter-spacing:.04em;">Returns 60 Days</div><div style="font-size:10px;color:${C.muted};font-family:'Inter',sans-serif;">No conditions</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SAVOIR-FAIRE ════════════════════════════════════════════════════ -->
<section style="background:${C.bgAlt};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:72px;">
      <p style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:16px;">Our Commitment</p>
      <div style="width:40px;height:1px;background:${C.accent};margin:0 auto 22px;"></div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:400;color:${C.text};letter-spacing:.02em;line-height:1.2;">The Art of Perfection</h2>
    </div>
    <div class="grid3-lx" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};">${savoirFaireHTML}</div>
  </div>
</section>

<!-- ═══ COLLECTION ══════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:16px;">La Collection</p>
      <div style="width:40px;height:1px;background:${C.accent};margin:0 auto 22px;"></div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:400;color:${C.text};letter-spacing:.02em;">Explore the Collection</h2>
    </div>
    <div class="grid3-lx" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">${collectionHTML}</div>
  </div>
</section>

<!-- ═══ TESTIMONIALS ════════════════════════════════════════════════════ -->
<section style="background:${C.bgAlt};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:16px;">Clientèle</p>
      <div style="width:40px;height:1px;background:${C.accent};margin:0 auto 22px;"></div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:400;color:${C.text};letter-spacing:.02em;">Voices of Distinction</h2>
    </div>
    <div class="grid3-lx" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${reviewsHTML}</div>
  </div>
</section>

<!-- ═══ GARANTIES ════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:72px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div class="grid4-lx" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};">
      ${[['◆','Lifetime Warranty','Our guarantee has no expiry'],['✦','Authenticity Certificate','Every piece documented'],['⟳','Free Returns 60 Days','No questions asked'],['🔒','Secure Payment','256-bit encryption']].map(([icon, title, sub]) => `
      <div style="background:${C.bgAlt};padding:32px 20px;text-align:center;">
        <div style="font-size:18px;color:${C.accent};margin-bottom:14px;letter-spacing:2px;">${icon}</div>
        <p style="font-size:14px;font-weight:500;color:${C.text};margin-bottom:6px;font-family:'Cormorant Garamond',Georgia,serif;letter-spacing:.04em;">${title}</p>
        <p style="font-size:12px;color:${C.muted};font-family:'Inter',sans-serif;">${sub}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════ -->
<section style="background:${C.bgAlt};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:60px;">
      <div style="width:40px;height:1px;background:${C.accent};margin:0 auto 22px;"></div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:38px;font-weight:400;color:${C.text};">Frequently Asked</h2>
    </div>
    ${faqHTML}
  </div>
</section>

<!-- ═══ NEWSLETTER ════════════════════════════════════════════════════ -->
<section style="background:${C.accent};padding:72px 24px;text-align:center;">
  <p style="font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${C.bg};opacity:.6;font-family:'Inter',sans-serif;margin-bottom:14px;">Cercle Privé</p>
  <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:400;color:${C.bg};letter-spacing:.02em;margin-bottom:12px;">Join Our Inner Circle</h2>
  <p style="font-size:14px;color:${C.bg};opacity:.7;margin-bottom:36px;max-width:420px;margin-left:auto;margin-right:auto;font-family:'Inter',sans-serif;font-weight:300;line-height:1.75;">Receive exclusive access to new collections, private events and the stories behind each creation.</p>
  <div style="display:flex;gap:0;max-width:420px;margin:0 auto;border:1px solid ${C.bg};">
    <input type="email" placeholder="Your email address" style="flex:1;padding:16px 20px;background:transparent;border:none;outline:none;color:${C.bg};font-family:'Inter',sans-serif;font-size:13px;font-weight:300;" />
    <button style="background:${C.bg};color:${C.accent};padding:16px 28px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">Join</button>
  </div>
</section>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════ -->
<section style="background:linear-gradient(135deg,#050505,#1A1208,#050505);padding:96px 24px;text-align:center;border-top:1px solid rgba(201,168,76,.2);">
  <div style="width:40px;height:1px;background:rgba(201,168,76,.3);margin:0 auto 26px;"></div>
  <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;font-weight:400;color:${C.text};letter-spacing:-.01em;margin-bottom:18px;line-height:1.1;">${data.product_name}</h2>
  <p style="color:${C.muted};font-size:15px;margin-bottom:40px;max-width:460px;margin-left:auto;margin-right:auto;font-family:'Inter',sans-serif;font-weight:300;line-height:1.85;">${data.subtitle || 'Excellence merits your attention.'}</p>
  <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:inline-block;background:transparent;color:${C.accent};padding:18px 56px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;letter-spacing:.14em;text-transform:uppercase;border:1px solid ${C.accent};transition:all .25s;" onmouseover="this.style.background='${C.accent}';this.style.color='${C.bg}'" onmouseout="this.style.background='transparent';this.style.color='${C.accent}'">${data.cta || 'Acquire this piece'} →</a>
  <p style="margin-top:24px;font-size:12px;color:${C.muted};font-family:'Inter',sans-serif;letter-spacing:.04em;">Private delivery · Authenticity guaranteed · Returns 60 days</p>
</section>

<!-- ═══ FOOTER ════════════════════════════════════════════════════════ -->
<footer style="background:#050505;padding:64px 0 32px;border-top:1px solid ${C.accent};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div class="footer-lx" style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;">
      <div>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:600;color:${C.text};letter-spacing:.2em;text-transform:uppercase;margin-bottom:16px;">LUXE</p>
        <p style="font-size:13px;color:${C.muted};line-height:1.85;font-family:'Inter',sans-serif;font-weight:300;max-width:240px;">A house dedicated to the art of exceptional living. Each creation a declaration of refined taste.</p>
        <div style="display:flex;gap:10px;margin-top:22px;">
          ${['IG','FB','TT','PT'].map(s => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="width:34px;height:34px;border:1px solid ${C.border};color:${C.muted};font-size:10px;font-weight:500;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;transition:all .2s;" onmouseover="this.style.borderColor='${C.accent}';this.style.color='${C.accent}'" onmouseout="this.style.borderColor='${C.border}';this.style.color='${C.muted}'">${s}</a>`).join('')}
        </div>
      </div>
      <div>
        <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:18px;opacity:.6;">Collection</p>
        ${['Joaillerie','Parfums','Maroquinerie','Accessoires'].map(l => `<p style="margin-bottom:10px;"><a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:13px;color:${C.muted};font-family:'Inter',sans-serif;font-weight:300;transition:color .2s;" onmouseover="this.style.color='${C.accent}'" onmouseout="this.style.color='${C.muted}'">${l}</a></p>`).join('')}
      </div>
      <div>
        <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:18px;opacity:.6;">Maison</p>
        ${['Notre Histoire','Atelier','Héritage','Presse'].map(l => `<p style="margin-bottom:10px;"><a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:13px;color:${C.muted};font-family:'Inter',sans-serif;font-weight:300;transition:color .2s;" onmouseover="this.style.color='${C.accent}'" onmouseout="this.style.color='${C.muted}'">${l}</a></p>`).join('')}
      </div>
      <div>
        <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};font-family:'Inter',sans-serif;margin-bottom:18px;opacity:.6;">Services</p>
        ${['Contact','Livraison','Retours','FAQ','Mentions légales'].map(l => `<p style="margin-bottom:10px;"><a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:13px;color:${C.muted};font-family:'Inter',sans-serif;font-weight:300;transition:color .2s;" onmouseover="this.style.color='${C.accent}'" onmouseout="this.style.color='${C.muted}'">${l}</a></p>`).join('')}
      </div>
    </div>
    <div style="border-top:1px solid ${C.border};padding-top:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <p style="font-size:11px;color:${C.muted};font-family:'Inter',sans-serif;font-weight:300;opacity:.6;">© 2026 LUXE — ${data.product_name}. All rights reserved.</p>
      <p style="font-size:11px;color:${C.muted};font-family:'Inter',sans-serif;font-weight:300;opacity:.6;">Excellence has no compromise.</p>
    </div>
  </div>
</footer>

</body>
</html>`
}
