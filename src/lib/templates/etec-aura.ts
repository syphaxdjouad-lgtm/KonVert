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
const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
]

const C = {
  bg:          '#F7F5FB',
  bgAlt:       '#EEE9F8',
  hero:        '#2D1B69',
  card:        '#FFFFFF',
  accent:      '#7C5CBF',
  accentDark:  '#2D1B69',
  accentLight: '#E8DEFF',
  text:        '#1A1030',
  muted:       '#6B5B8A',
  border:      '#D5C8F0',
  gold:        '#C9A84C',
}

const AURA_THEME: SectionTheme = {
  primary:    '#e8deff',
  accent:     '#fdfcff',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#ffffff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecAura(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('miAu').src='${img}';document.querySelectorAll('.thau').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${C.accent}':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});"
      class="thau"
      style="border-radius:10px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `2px solid ${C.accent}` : '2px solid transparent'};opacity:${i === 0 ? 1 : .5};transition:all .25s;"
    ><img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>`).join('')

  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid ${C.border};">
      <span style="color:${C.accent};font-size:15px;flex-shrink:0;margin-top:2px;">✦</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.75;font-family:'DM Sans',sans-serif;">${b}</span>
    </li>`).join('')

  const ritualSteps = [
    { num: '01', title: data.benefits[0] || data.how_it_works?.[0] || `Étape 1 — ${data.product_name}`, desc: data.features?.[0]?.description || `Intégrez ${data.product_name} dans votre routine quotidienne pour des résultats visibles.` },
    { num: '02', title: data.benefits[1] || data.how_it_works?.[1] || 'Ressentez la différence', desc: data.features?.[1]?.description || `La formule de ${data.product_name} agit progressivement. Constatez des améliorations durables.` },
    { num: '03', title: data.benefits[2] || data.how_it_works?.[2] || 'Transformez votre quotidien', desc: data.features?.[2]?.description || `Après 30 jours, profitez de tous les bénéfices de ${data.product_name} — un équilibre parfait et durable.` },
  ]

  const ritualHTML = ritualSteps.map(s => `
    <div style="background:${C.card};border-radius:18px;padding:32px 28px;border:1px solid ${C.border};position:relative;overflow:hidden;">
      <div style="position:absolute;top:14px;right:18px;font-size:52px;font-weight:800;color:${C.accentLight};font-family:'Playfair Display',Georgia,serif;line-height:1;user-select:none;">${s.num}</div>
      <div style="width:44px;height:44px;border-radius:12px;background:${C.accentLight};display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <span style="color:${C.accent};font-size:20px;">✦</span>
      </div>
      <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:600;color:${C.text};margin-bottom:10px;line-height:1.3;">${s.title}</h3>
      <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">${s.desc}</p>
    </div>`).join('')

  const ingredients = [
    { emoji: '✦', name: data.features?.[0]?.title || data.benefits[3]?.split(' ').slice(0,3).join(' ') || 'Ingrédient clé 1', desc: data.benefits[3] || `${data.product_name} — composant actif sélectionné pour son efficacité.` },
    { emoji: '✦', name: data.features?.[1]?.title || data.benefits[4]?.split(' ').slice(0,3).join(' ') || 'Ingrédient clé 2', desc: data.benefits[4] || `Composant actif qui soutient les effets durables de ${data.product_name}.` },
    { emoji: '✦', name: data.features?.[2]?.title || data.unique_mechanism?.name || 'Complexe actif', desc: data.features?.[2]?.description || `Association synergique au cœur de la formule ${data.product_name}.` },
    { emoji: '✦', name: data.features?.[3]?.title || 'Ingrédient clé 4', desc: data.features?.[3]?.description || `Composant essentiel pour des résultats visibles et durables.` },
  ]

  const ingredientsHTML = ingredients.map(ing => `
    <div style="background:${C.card};border-radius:18px;padding:28px 22px;border:1px solid ${C.border};text-align:center;transition:box-shadow .25s;" onmouseover="this.style.boxShadow='0 10px 36px rgba(44,27,105,.12)'" onmouseout="this.style.boxShadow='none'">
      <div style="font-size:38px;margin-bottom:16px;line-height:1;">${ing.emoji}</div>
      <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:600;color:${C.text};margin-bottom:10px;">${ing.name}</h4>
      <p style="font-size:13px;color:${C.muted};line-height:1.75;font-family:'DM Sans',sans-serif;">${ing.desc}</p>
    </div>`).join('')

  const reviewsData = [
    { name: 'Sophie M.', date: '3 days ago',   init: 'S', bg: '#7C5CBF', text: 'I have tried dozens of wellness products and nothing compares. After two weeks I noticed a visible difference in my energy and skin glow. This is now a non-negotiable part of my morning routine.' },
    { name: 'Léa T.',    date: '1 week ago',   init: 'L', bg: '#9B6EC9', text: "Honestly life-changing. The formula is incredibly clean — no fillers, no junk, just pure ingredients that actually work. My whole family is now on it and we all feel the difference." },
    { name: 'Emma R.',   date: '2 weeks ago',  init: 'E', bg: '#6B4BA8', text: 'My sleep quality improved dramatically in the first week. I wake up refreshed and calm. The ritual aspect of taking it every morning has also transformed my mindset for the entire day.' },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="background:${C.card};border-radius:18px;padding:28px;border:1px solid ${C.border};">
      <div style="display:flex;gap:3px;margin-bottom:14px;">
        <span style="color:${C.gold};font-size:15px;">★★★★★</span>
      </div>
      <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;font-style:italic;margin-bottom:22px;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:38px;height:38px;border-radius:50%;background:${r.bg};color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',Georgia,serif;flex-shrink:0;">${r.init}</div>
        <div>
          <p style="font-size:13px;font-weight:600;color:${C.text};font-family:'DM Sans',sans-serif;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'DM Sans',sans-serif;">${r.date} · Verified Purchase</p>
        </div>
      </div>
    </div>`).join('')

  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fpau').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fiau').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='280px';p.style.padding='0 0 20px 0';this.querySelector('.fiau').textContent='−';}"
        style="width:100%;background:none;border:none;padding:22px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:500;color:${C.text};font-family:'DM Sans',sans-serif;">${item.question}</span>
        <span class="fiau" style="color:${C.accent};font-size:22px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div class="fpau" style="max-height:${i === 0 ? '280px' : '0'};overflow:hidden;transition:max-height .4s ease,padding .4s ease;padding:${i === 0 ? '0 0 20px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.85;font-family:'DM Sans',sans-serif;">${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;} a{text-decoration:none;}
  @media(max-width:768px){
    .grid2-au,.hero-inner-au{grid-template-columns:1fr!important;gap:28px!important;}
    .hero-imgcol-au{display:none!important;}
    .h1-au{font-size:34px!important;}
    .grid3-au{grid-template-columns:1fr!important;gap:16px!important;}
    .grid4-au{grid-template-columns:1fr 1fr!important;gap:14px!important;}
    .grid2-ba{grid-template-columns:1fr!important;gap:16px!important;}
    .footer-au{grid-template-columns:1fr!important;gap:32px!important;}
    .nav-links-au{display:none!important;}
  }
</style>
</head>
<body>

<!-- ═══ NAVBAR ══════════════════════════════════════════════════════════════ -->
<nav style="background:${C.card};border-bottom:1px solid ${C.border};position:sticky;top:0;z-index:100;box-shadow:0 1px 14px rgba(44,27,105,.07);">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:68px;">
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:600;font-style:italic;color:${C.accentDark};">${data.product_name || 'Aura'}</a>
    <div class="nav-links-au" style="display:flex;align-items:center;gap:32px;">
      ${['Discover','Wellness','Rituals','About','Contact'].map(l => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:14px;color:${C.muted};font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='${C.accent}'" onmouseout="this.style.color='${C.muted}'">${l}</a>`).join('')}
    </div>
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:${C.accent};color:#fff;padding:11px 24px;border-radius:100px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;transition:opacity .2s;" onmouseover="this.style.opacity='.87'" onmouseout="this.style.opacity='1'">Start your ritual</a>
  </div>
</nav>

<!-- ═══ HERO ════════════════════════════════════════════════════════════════ -->
<section style="background:${C.hero};padding:80px 0 72px;position:relative;overflow:hidden;min-height:560px;display:flex;align-items:center;">
  <svg xmlns="http://www.w3.org/2000/svg" width="580" height="580" style="position:absolute;right:-60px;top:-60px;opacity:.07;pointer-events:none;" viewBox="0 0 580 580">
    <circle cx="290" cy="290" r="260" stroke="#E8DEFF" stroke-width="1" fill="none"/>
    <circle cx="290" cy="290" r="190" stroke="#E8DEFF" stroke-width="0.6" fill="none"/>
    <circle cx="290" cy="290" r="120" stroke="#E8DEFF" stroke-width="0.6" fill="none"/>
    <circle cx="108" cy="420" r="5" fill="#E8DEFF" opacity=".45"/>
    <circle cx="475" cy="148" r="3" fill="#E8DEFF" opacity=".38"/>
    <circle cx="62"  cy="270" r="2" fill="#E8DEFF" opacity=".55"/>
    <circle cx="520" cy="300" r="4" fill="#E8DEFF" opacity=".30"/>
  </svg>
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;width:100%;position:relative;z-index:1;">
    <div class="hero-inner-au" style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;">
      <div>
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(232,222,255,.1);border:1px solid rgba(232,222,255,.2);border-radius:100px;padding:7px 18px;margin-bottom:28px;">
          <span style="width:6px;height:6px;border-radius:50%;background:${C.gold};display:inline-block;"></span>
          <span style="font-size:12px;color:rgba(232,222,255,.8);font-family:'DM Sans',sans-serif;letter-spacing:.04em;">Pure Wellness · Since 2020</span>
        </div>
        <h1 class="h1-au" style="font-family:'Playfair Display',Georgia,serif;font-size:56px;font-weight:700;line-height:1.1;letter-spacing:-.025em;color:#FFFFFF;margin-bottom:12px;">${data.headline || `Discover<br/><em style="font-style:italic;color:${C.accentLight};">${data.product_name}</em>`}</h1>
        <p style="font-family:'Playfair Display',Georgia,serif;font-size:17px;font-style:italic;color:rgba(232,222,255,.7);margin-bottom:10px;">${data.product_name}</p>
        <p style="font-size:15px;color:rgba(232,222,255,.6);line-height:1.8;margin-bottom:36px;max-width:440px;font-family:'DM Sans',sans-serif;">${data.subtitle || `${data.product_name} — une formulation d'exception pour votre quotidien.`}</p>
        <div style="display:flex;gap:14px;flex-wrap:wrap;">
          <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:${C.accent};color:#fff;padding:16px 34px;border-radius:100px;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;display:inline-block;transition:opacity .2s;" onmouseover="this.style.opacity='.87'" onmouseout="this.style.opacity='1'">${data.cta || 'Begin your ritual'}</a>
          <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:transparent;color:${C.accentLight};padding:16px 32px;border-radius:100px;font-size:14px;font-family:'DM Sans',sans-serif;border:1px solid rgba(232,222,255,.28);display:inline-block;transition:border-color .2s;" onmouseover="this.style.borderColor='rgba(232,222,255,.6)'" onmouseout="this.style.borderColor='rgba(232,222,255,.28)'">Learn more</a>
        </div>
      </div>
      <div class="hero-imgcol-au" style="display:flex;justify-content:center;position:relative;">
        <div style="width:100%;max-width:420px;aspect-ratio:4/5;border-radius:40% 60% 55% 45% / 50% 45% 55% 50%;overflow:hidden;box-shadow:0 28px 90px rgba(0,0,0,.38);">
          <img src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
        <div style="position:absolute;bottom:24px;left:-10px;background:${C.card};border-radius:16px;padding:14px 18px;box-shadow:0 8px 36px rgba(44,27,105,.22);border:1px solid ${C.border};">
          <p style="font-size:10px;color:${C.muted};font-family:'DM Sans',sans-serif;margin-bottom:3px;letter-spacing:.05em;">TRUSTED BY</p>
          <p style="font-size:20px;font-weight:700;color:${C.text};font-family:'Playfair Display',Georgia,serif;line-height:1;">50,000+</p>
          <p style="font-size:11px;color:${C.muted};font-family:'DM Sans',sans-serif;">happy customers</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ TRUST PILLS ════════════════════════════════════════════════════════ -->
<section style="background:${C.card};border-bottom:1px solid ${C.border};padding:16px 0;">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">
    ${([['✓', data.hero_badges?.[0] || 'Certifié'],['🌿', data.hero_badges?.[1] || 'Qualité Premium'],['💜', data.hero_badges?.[2] || 'Testé & Approuvé'],['♻️', data.hero_badges?.[3] || 'Éco Responsable']] as [string,string][]).map(([icon, label]) => `
    <div style="display:inline-flex;align-items:center;gap:8px;background:${C.accentLight};border-radius:100px;padding:8px 18px;">
      <span>${icon}</span><span style="font-size:13px;font-weight:500;color:${C.accent};font-family:'DM Sans',sans-serif;">${label}</span>
    </div>`).join('')}
  </div>
</section>

<!-- ═══ RITUAL EN 3 ÉTAPES ══════════════════════════════════════════════════ -->
<section style="padding:96px 0;background:${C.bg};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">How it works</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:${C.text};letter-spacing:-.02em;margin-bottom:14px;">Your Daily Ritual</h2>
      <p style="font-size:15px;color:${C.muted};max-width:460px;margin:0 auto;font-family:'DM Sans',sans-serif;line-height:1.75;">Three intentional steps to unlock your full potential and feel your best every single day.</p>
    </div>
    <div class="grid3-au" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;">${ritualHTML}</div>
  </div>
</section>

<!-- ═══ PRODUIT DETAIL ══════════════════════════════════════════════════════ -->
<section style="background:${C.card};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div class="grid2-au" style="display:grid;grid-template-columns:55% 45%;gap:64px;align-items:start;">
      <div>
        <div style="border-radius:22px;overflow:hidden;aspect-ratio:1;border:1px solid ${C.border};margin-bottom:14px;background:${C.bgAlt};">
          <img id="miAu" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">${thumbsHTML}</div>
      </div>
      <div>
        <span style="display:inline-block;background:${C.accentLight};color:${C.accent};font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;font-family:'DM Sans',sans-serif;letter-spacing:.06em;margin-bottom:16px;">${data.hero_badges?.[0] || data.unique_mechanism || 'Premium'}</span>
        <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:34px;font-weight:700;line-height:1.2;letter-spacing:-.02em;color:${C.text};margin-bottom:12px;">${data.product_name}</h1>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <span style="color:${C.gold};font-size:14px;letter-spacing:3px;">★★★★★</span>
          <span style="font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">4.8/5 · 214 reviews</span>
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:22px;flex-wrap:wrap;padding:18px 20px;background:${C.accentLight};border-radius:14px;border:1px solid ${C.border};">
          ${data.price ? `<span style="font-size:38px;font-weight:700;letter-spacing:-.02em;color:${C.text};font-family:'Playfair Display',Georgia,serif;">${data.price}€</span>` : ''}
          ${data.original_price ? `<span style="font-size:18px;color:${C.muted};text-decoration:line-through;font-family:'DM Sans',sans-serif;">${data.original_price}€</span>` : ''}
          ${savePct > 0 ? `<span style="background:${C.gold};color:#fff;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;">-${savePct}%</span>` : ''}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
          <span style="background:${C.bg};border:1px solid ${C.border};border-radius:100px;padding:5px 12px;font-size:12px;color:${C.muted};font-family:'DM Sans',sans-serif;">🌿 Organic</span>
          <span style="background:${C.bg};border:1px solid ${C.border};border-radius:100px;padding:5px 12px;font-size:12px;color:${C.muted};font-family:'DM Sans',sans-serif;">✓ Vegan</span>
          <span style="background:${C.bg};border:1px solid ${C.border};border-radius:100px;padding:5px 12px;font-size:12px;color:${C.muted};font-family:'DM Sans',sans-serif;">💜 Cruelty Free</span>
        </div>
        <ul style="list-style:none;margin-bottom:28px;">${benefitsHTML}</ul>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:${C.accent};color:#fff;padding:17px 32px;border-radius:100px;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;margin-bottom:12px;transition:opacity .2s;" onmouseover="this.style.opacity='.87'" onmouseout="this.style.opacity='1'">${data.cta || 'Add to Ritual'}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:transparent;color:${C.accent};padding:15px 32px;border-radius:100px;font-size:14px;font-family:'DM Sans',sans-serif;border:1px solid ${C.border};margin-bottom:22px;transition:border-color .2s;" onmouseover="this.style.borderColor='${C.accent}'" onmouseout="this.style.borderColor='${C.border}'">Save to Wishlist</a>
        ${data.urgency ? `<div style="display:flex;align-items:center;gap:10px;background:${C.accentLight};border:1px solid ${C.border};border-radius:12px;padding:13px 16px;margin-bottom:22px;"><span style="color:${C.gold};font-size:16px;">⚡</span><p style="font-size:13px;color:${C.accent};font-weight:500;font-family:'DM Sans',sans-serif;">${data.urgency}</p></div>` : ''}
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};border-radius:14px;overflow:hidden;">
          <div style="background:${C.card};padding:14px 8px;text-align:center;"><div style="color:${C.accent};margin-bottom:5px;display:flex;justify-content:center;">${ico.truck(16)}</div><div style="font-size:11px;font-weight:600;color:${C.text};margin-bottom:2px;font-family:'DM Sans',sans-serif;">Free Shipping</div><div style="font-size:10px;color:${C.muted};font-family:'DM Sans',sans-serif;">Orders 60€+</div></div>
          <div style="background:${C.card};padding:14px 8px;text-align:center;"><div style="color:${C.accent};margin-bottom:5px;display:flex;justify-content:center;">${ico.shield(16)}</div><div style="font-size:11px;font-weight:600;color:${C.text};margin-bottom:2px;font-family:'DM Sans',sans-serif;">30-Day Guarantee</div><div style="font-size:10px;color:${C.muted};font-family:'DM Sans',sans-serif;">Full refund</div></div>
          <div style="background:${C.card};padding:14px 8px;text-align:center;"><div style="color:${C.accent};margin-bottom:5px;display:flex;justify-content:center;">${ico.lock(16)}</div><div style="font-size:11px;font-weight:600;color:${C.text};margin-bottom:2px;font-family:'DM Sans',sans-serif;">Secure Payment</div><div style="font-size:10px;color:${C.muted};font-family:'DM Sans',sans-serif;">256-bit SSL</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ INGRÉDIENTS ══════════════════════════════════════════════════════════ -->
<section style="background:${C.bgAlt};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">Formulation</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:${C.text};letter-spacing:-.02em;margin-bottom:14px;">Key Ingredients</h2>
      <p style="font-size:15px;color:${C.muted};max-width:460px;margin:0 auto;font-family:'DM Sans',sans-serif;line-height:1.75;">Each ingredient is carefully sourced and scientifically validated for maximum bioavailability.</p>
    </div>
    <div class="grid4-au" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">${ingredientsHTML}</div>
  </div>
</section>

<!-- ═══ BEFORE / AFTER ════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">Transformation</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:${C.text};letter-spacing:-.02em;margin-bottom:14px;">Real Results</h2>
      <p style="font-size:15px;color:${C.muted};max-width:460px;margin:0 auto;font-family:'DM Sans',sans-serif;line-height:1.75;">See what a consistent 30-day ritual can do for your wellbeing and radiance.</p>
    </div>
    <div class="grid2-ba" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:760px;margin:0 auto;">
      <div style="background:${C.card};border-radius:20px;border:1px solid ${C.border};overflow:hidden;">
        <div style="aspect-ratio:3/4;overflow:hidden;position:relative;"><img src="${imgs[1]}" alt="Before" style="width:100%;height:100%;object-fit:cover;display:block;"/><div style="position:absolute;top:14px;left:14px;background:rgba(26,16,48,.72);color:rgba(232,222,255,.85);font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;letter-spacing:.08em;font-family:'DM Sans',sans-serif;">BEFORE</div></div>
        <div style="padding:20px 22px;"><p style="font-size:13px;font-weight:600;color:${C.text};margin-bottom:6px;font-family:'DM Sans',sans-serif;">Week 0</p><p style="font-size:13px;color:${C.muted};line-height:1.75;font-family:'DM Sans',sans-serif;">Low energy, dull skin and restless sleep — before discovering the ritual.</p></div>
      </div>
      <div style="background:${C.card};border-radius:20px;border:1px solid ${C.border};overflow:hidden;">
        <div style="aspect-ratio:3/4;overflow:hidden;position:relative;"><img src="${imgs[2]}" alt="After" style="width:100%;height:100%;object-fit:cover;display:block;"/><div style="position:absolute;top:14px;left:14px;background:${C.accent};color:#fff;font-size:11px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:.08em;font-family:'DM Sans',sans-serif;">AFTER 30 DAYS</div></div>
        <div style="padding:20px 22px;"><p style="font-size:13px;font-weight:600;color:${C.text};margin-bottom:6px;font-family:'DM Sans',sans-serif;">Week 4</p><p style="font-size:13px;color:${C.muted};line-height:1.75;font-family:'DM Sans',sans-serif;">"My skin is glowing, I sleep deeply and wake up full of energy. This changed everything." — Camille V.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ TESTIMONIALS ══════════════════════════════════════════════════════ -->
<section style="background:${C.card};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">Testimonials</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:${C.text};letter-spacing:-.02em;margin-bottom:14px;">What Our Community Says</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
        <span style="color:${C.gold};font-size:15px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">4.8/5 · 214 verified reviews</span>
      </div>
    </div>
    <div class="grid3-au" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;">${reviewsHTML}</div>
  </div>
</section>


<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, AURA_THEME)}
${renderStorySection(data, AURA_THEME)}
${renderComparisonSection(data, AURA_THEME)}
${renderTestimonialsSection(data, AURA_THEME)}
${renderBonusesSection(data, AURA_THEME)}
${renderGuaranteeSection(data, AURA_THEME)}

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════ -->
<section style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:60px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:12px;">FAQ</p>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:${C.text};letter-spacing:-.02em;">Common Questions</h2>
    </div>
    ${faqHTML}
  </div>
</section>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════ -->
<section style="background:${C.hero};padding:96px 24px;text-align:center;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(124,92,191,.2) 0%,transparent 70%);pointer-events:none;"></div>
  <div style="position:relative;z-index:1;">
    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:48px;font-weight:700;color:#FFFFFF;letter-spacing:-.025em;margin-bottom:18px;line-height:1.12;">Your Ritual Awaits</h2>
    <p style="color:rgba(232,222,255,.65);font-size:16px;margin-bottom:14px;max-width:460px;margin-left:auto;margin-right:auto;font-family:'DM Sans',sans-serif;line-height:1.75;">${data.subtitle || 'Join 50,000+ people who transformed their wellness with a simple, daily ritual.'}</p>
    ${data.urgency ? `<p style="color:${C.gold};font-size:13px;font-weight:500;margin-bottom:36px;font-family:'DM Sans',sans-serif;">${data.urgency}</p>` : '<div style="margin-bottom:36px;"></div>'}
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:inline-block;background:#fff;color:${C.accentDark};padding:18px 54px;border-radius:100px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;transition:opacity .2s;" onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">${data.cta || 'Begin your ritual'} →</a>
    <p style="margin-top:20px;font-size:12px;color:rgba(232,222,255,.4);font-family:'DM Sans',sans-serif;">Free shipping · 30-day guarantee · Cancel anytime</p>
  </div>
</section>

<!-- ═══ FOOTER ════════════════════════════════════════════════════════════ -->
<footer style="background:${C.accentDark};padding:64px 0 32px;">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px;">
    <div class="footer-au" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;margin-bottom:48px;">
      <div>
        <p style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:600;font-style:italic;color:#fff;margin-bottom:14px;">${data.product_name || 'Aura'}</p>
        <p style="font-size:14px;color:rgba(232,222,255,.5);line-height:1.8;font-family:'DM Sans',sans-serif;max-width:280px;">Crafted with intention. Formulated for modern wellness. Your daily ritual for a radiant life.</p>
        <div style="display:flex;gap:10px;margin-top:22px;">
          ${['IG','FB','TT','YT'].map(s => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(232,222,255,.18);color:rgba(232,222,255,.5);font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;transition:all .2s;" onmouseover="this.style.borderColor='${C.accent}';this.style.color='${C.accentLight}'" onmouseout="this.style.borderColor='rgba(232,222,255,.18)';this.style.color='rgba(232,222,255,.5)'">${s}</a>`).join('')}
        </div>
      </div>
      <div>
        <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.accentLight};opacity:.5;font-family:'DM Sans',sans-serif;margin-bottom:18px;">Explore</p>
        ${['Wellness','Rituals','Ingredients','Science','Blog'].map(l => `<p style="margin-bottom:10px;"><a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:14px;color:rgba(232,222,255,.5);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='${C.accentLight}'" onmouseout="this.style.color='rgba(232,222,255,.5)'">${l}</a></p>`).join('')}
      </div>
      <div>
        <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.accentLight};opacity:.5;font-family:'DM Sans',sans-serif;margin-bottom:18px;">Support</p>
        ${['Contact','FAQ','Shipping','Returns','Privacy'].map(l => `<p style="margin-bottom:10px;"><a href="javascript:void(0)" onclick="event.preventDefault()" style="font-size:14px;color:rgba(232,222,255,.5);font-family:'DM Sans',sans-serif;transition:color .2s;" onmouseover="this.style.color='${C.accentLight}'" onmouseout="this.style.color='rgba(232,222,255,.5)'">${l}</a></p>`).join('')}
      </div>
    </div>
    <div style="border-top:1px solid rgba(232,222,255,.1);padding-top:26px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:rgba(232,222,255,.3);font-family:'DM Sans',sans-serif;">© 2026 ${data.product_name || 'Aura'}. All rights reserved.</p>
      <p style="font-size:12px;color:rgba(232,222,255,.3);font-family:'DM Sans',sans-serif;">Crafted with care for your wellness</p>
    </div>
  </div>
</footer>

</body>
</html>`
}
