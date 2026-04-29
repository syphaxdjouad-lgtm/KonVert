import type { LandingPageData } from '@/types'
import { ico } from './icons'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80',
]
const BEFORE_IMG = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80'
const AFTER_IMG  = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80'

const C = {
  bg:          '#FFF8F8',
  card:        '#FFFFFF',
  accent:      '#D63370',
  accentLight: '#FFE8F2',
  text:        '#1C0A0E',
  muted:       '#9B6E7E',
  border:      '#F2D6E0',
}

export function templateEtecRose(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  // ── Galerie thumbnails ──
  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('mi3').src='${img}';document.querySelectorAll('.th3').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${C.accent}':'2px solid transparent';t.style.opacity=j===${i}?'1':'.6';});"
      class="th3"
      style="border-radius:12px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `2px solid ${C.accent}` : '2px solid transparent'};opacity:${i === 0 ? 1 : .6};transition:all .2s;"
    >
      <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>`).join('')

  // ── Avantages ──
  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid ${C.border};">
      <span style="width:20px;height:20px;border-radius:50%;background:${C.accentLight};color:${C.accent};font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">✓</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.6;font-family:'Inter',sans-serif;">${b}</span>
    </li>`).join('')

  // ── Features alternées ──
  const featData = [
    {
      label: 'Formule & Efficacité',
      title: data.benefits[0] || `${data.product_name} — La science au service de la beauté`,
      desc:  data.subtitle || `Chaque ingrédient de ${data.product_name} a été soigneusement sélectionné pour maximiser les résultats visibles dès les premières applications.`,
      img:   imgs[0],
    },
    {
      label: 'Texture & Sensorialité',
      title: data.benefits[1] || 'Une texture qui fond sur la peau',
      desc:  data.benefits[3] || `La formule légère et non grasse de ${data.product_name} s'absorbe instantanément, laissant la peau douce, lumineuse et parfaitement hydratée.`,
      img:   imgs[1],
    },
    {
      label: 'Résultats durables',
      title: data.benefits[2] || 'Des résultats visibles en 7 jours',
      desc:  data.benefits[4] || `Cliniquement testé et approuvé par des dermatologues. ${data.product_name} améliore durablement le teint, l'éclat et la texture de votre peau.`,
      img:   imgs[2],
    },
  ]

  const featuresHTML = featData.map((f, i) => {
    const reversed = i % 2 === 1
    return `
    <div class="feat-row3" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${reversed ? 2 : 1};border-radius:24px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 8px 32px rgba(214,51,112,0.12);">
        <img src="${f.img}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="order:${reversed ? 1 : 2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'Inter',sans-serif;margin-bottom:14px;">${f.label}</p>
        <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;line-height:1.25;letter-spacing:-.01em;color:${C.text};margin-bottom:16px;">${f.title}</h3>
        <p style="font-size:15px;color:${C.muted};line-height:1.85;font-family:'Inter',sans-serif;">${f.desc}</p>
      </div>
    </div>`
  }).join('')

  // ── Reviews beauté ──
  const reviewsData = [
    {
      text:  'Un coup de cœur absolu. Ma peau est transformée en moins de 2 semaines. Le teint est lumineux, les pores resserrés — je ne peux plus m\'en passer. La texture est un vrai plaisir chaque matin.',
      name:  'Emma D.',
      date:  'Il y a 4 jours',
    },
    {
      text:  'J\'ai essayé une dizaine de produits similaires et rien n\'approche ce résultat. Mon fond de teint tient toute la journée, mes imperfections sont atténuées. Livraison express, emballage magnifique.',
      name:  'Léa M.',
      date:  'Il y a 1 semaine',
    },
    {
      text:  'Résultats visibles dès la première application. Ma peau est plus douce, plus uniforme. Je l\'offre aussi à ma sœur tellement je suis convaincue. Rapport qualité/prix vraiment excellent.',
      name:  'Camille R.',
      date:  'Il y a 2 semaines',
    },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:20px;padding:28px;box-shadow:0 2px 16px rgba(214,51,112,0.06);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <span style="color:${C.accent};font-size:15px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:11px;color:#b45e7a;font-weight:600;background:${C.accentLight};padding:3px 10px;border-radius:20px;">✓ Achat vérifié</span>
      </div>
      <p style="font-size:14px;color:${C.muted};line-height:1.85;margin-bottom:20px;font-family:'Inter',sans-serif;font-style:italic;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:${C.accentLight};color:${C.accent};font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:700;color:${C.text};font-family:'Inter',sans-serif;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'Inter',sans-serif;">${r.date}</p>
        </div>
      </div>
    </div>`).join('')

  // ── FAQ accordion ──
  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp3').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi3').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='240px';p.style.padding='0 0 18px 0';this.querySelector('.fi3').textContent='−';}"
        style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:600;color:${C.text};font-family:'Inter',sans-serif;">${item.question}</span>
        <span class="fi3" style="color:${C.accent};font-size:24px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fp3"
        style="max-height:${i === 0 ? '240px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 18px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.85;font-family:'Inter',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;}
  @media(max-width:768px){
    .pg3,.feat-row3,.rg3,.ba3{grid-template-columns:1fr!important;gap:24px!important;}
    .feat-row3>div{order:unset!important;}
    .h1-rose{font-size:30px!important;}
    .hiw3{grid-template-columns:1fr!important;gap:20px!important;}
  }
</style>
</head>
<body>

<!-- ═══ BREADCRUMB ═══════════════════════════════════════════════════════════ -->
<div style="background:${C.card};border-bottom:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:13px 24px;font-size:13px;color:${C.muted};font-family:'Inter',sans-serif;">
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="color:${C.accent};text-decoration:none;">Accueil</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="color:${C.accent};text-decoration:none;">Boutique</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <span style="color:${C.muted};">${data.product_name}</span>
  </div>
</div>

<!-- ═══ HERO ══════════════════════════════════════════════════════════════════ -->
<div style="max-width:1100px;margin:0 auto;padding:0 24px;">
  <div class="pg3" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:48px 0 88px;align-items:start;">

    <!-- Galerie gauche -->
    <div>
      <div style="background:${C.card};border-radius:24px;overflow:hidden;aspect-ratio:1;border:1px solid ${C.border};margin-bottom:12px;box-shadow:0 4px 24px rgba(214,51,112,0.08);">
        <img id="mi3" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>

    <!-- Info droite -->
    <div>
      <!-- Label niche -->
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};margin-bottom:14px;">Beauté · Skincare · Premium</p>

      <!-- H1 Cormorant Garamond -->
      <h1 class="h1-rose" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:600;line-height:1.1;letter-spacing:-.01em;color:${C.text};margin-bottom:10px;">${data.product_name}</h1>

      <!-- Sous-titre élégant -->
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-style:italic;font-weight:400;color:${C.muted};margin-bottom:16px;line-height:1.5;">${data.subtitle || 'Votre rituel beauté, réinventé.'}</p>

      <!-- Note clients -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
        <span style="color:${C.accent};font-size:14px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'Inter',sans-serif;">4.9/5 · <a href="#reviews3" style="color:${C.accent};text-decoration:none;">127 avis clients</a></span>
      </div>

      <!-- Prix -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px;flex-wrap:wrap;padding:22px 24px;background:${C.accentLight};border-radius:16px;border:1px solid ${C.border};">
        ${data.price ? `<span style="font-size:44px;font-weight:700;letter-spacing:-.03em;color:${C.text};font-family:'Cormorant Garamond',Georgia,serif;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:22px;color:${C.muted};text-decoration:line-through;font-family:'Inter',sans-serif;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:${C.accent};color:#fff;padding:5px 14px;border-radius:100px;font-size:13px;font-weight:700;font-family:'Inter',sans-serif;">-${savePct}%</span>` : ''}
      </div>

      <!-- Description courte -->
      <p style="font-size:14px;color:${C.muted};line-height:1.85;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${C.border};font-family:'Inter',sans-serif;">${data.subtitle || ''}</p>

      <!-- Avantages -->
      <ul style="list-style:none;margin-bottom:28px;">
        ${benefitsHTML}
      </ul>

      <!-- CTA principal -->
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:${C.accent};color:#fff;padding:17px 32px;border-radius:100px;font-size:15px;font-weight:700;text-decoration:none;margin-bottom:12px;letter-spacing:.01em;font-family:'Inter',sans-serif;box-shadow:0 4px 20px rgba(214,51,112,0.35);transition:opacity .2s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
        ${data.cta || 'Ajouter au panier'} →
      </a>

      <!-- CTA secondaire -->
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:transparent;color:${C.accent};padding:15px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid ${C.accent};margin-bottom:22px;font-family:'Inter',sans-serif;transition:all .2s;" onmouseover="this.style.background='${C.accentLight}'" onmouseout="this.style.background='transparent'">
        En savoir plus
      </a>

      <!-- Urgence -->
      ${data.urgency ? `
      <div style="display:flex;align-items:center;gap:10px;background:#FFF3F7;border:1px solid #F4B8D0;border-radius:12px;padding:12px 16px;margin-bottom:24px;">
        <span style="color:${C.accent};">${ico.star(16)}</span>
        <p style="font-size:13px;color:${C.accent};font-weight:600;font-family:'Inter',sans-serif;">${data.urgency}</p>
      </div>` : ''}

      <!-- Trust badges fond rosé -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};border-radius:16px;overflow:hidden;margin-bottom:24px;">
        ${[
          [ico.star(22), 'Formule certifiée', 'Dermatologiquement testé'],
          [ico.truck(22), 'Livraison offerte', 'Dès 50€ d\'achat'],
          [ico.return(22), 'Retour 30 jours', 'Satisfaite ou remboursée'],
        ].map(([icon, title, sub]) => `
          <div style="background:${C.accentLight};padding:14px 10px;text-align:center;">
            <div style="color:${C.accent};display:flex;justify-content:center;margin-bottom:6px;">${icon}</div>
            <div style="font-size:11px;font-weight:700;color:${C.text};margin-bottom:2px;font-family:'Inter',sans-serif;">${title}</div>
            <div style="font-size:11px;color:${C.muted};font-family:'Inter',sans-serif;">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Tabs Garantie / Livraison / Support -->
      <div style="border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
        <div style="display:flex;border-bottom:1px solid ${C.border};">
          ${['Garantie', 'Livraison', 'Support'].map((tab, i) => `
            <button
              onclick="document.querySelectorAll('.tp3').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb3').forEach(function(b,j){b.style.background=j===${i}?'${C.accentLight}':'transparent';b.style.color=j===${i}?'${C.accent}':'${C.muted}';b.style.fontWeight=j===${i}?'700':'500';});"
              class="tb3"
              style="flex:1;padding:13px 8px;background:${i === 0 ? C.accentLight : 'transparent'};border:none;cursor:pointer;font-size:13px;font-weight:${i === 0 ? '700' : '500'};color:${i === 0 ? C.accent : C.muted};transition:all .2s;font-family:'Inter',sans-serif;"
            >${tab}</button>`).join('')}
        </div>
        <div class="tp3" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;background:${C.card};font-family:'Inter',sans-serif;">
          Tous nos produits sont couverts par une <strong style="color:${C.text};">garantie satisfaite ou remboursée 30 jours</strong>. Si vous n'êtes pas entièrement convaincue des résultats, nous remboursons sans question ni frais.
        </div>
        <div class="tp3" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;display:none;background:${C.card};font-family:'Inter',sans-serif;">
          Livraison <strong style="color:${C.text};">2–4 jours ouvrés</strong> partout en France. Expédition le jour même si commande avant 13h. Suivi par SMS. <strong style="color:${C.text};">Livraison offerte dès 50€.</strong>
        </div>
        <div class="tp3" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;display:none;background:${C.card};font-family:'Inter',sans-serif;">
          Notre équipe beauté est disponible <strong style="color:${C.text};">7j/7 par chat et email</strong>. Des conseillères expertes répondent en moins de 2h. Votre satisfaction est notre priorité absolue.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ FEATURES ALTERNÉES ════════════════════════════════════════════════════ -->
<div style="background:${C.card};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'Inter',sans-serif;margin-bottom:14px;">Caractéristiques</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;line-height:1.2;">${data.headline || data.product_name}</h2>
      <p style="color:${C.muted};font-size:15px;max-width:520px;margin:0 auto;font-family:'Inter',sans-serif;line-height:1.75;">${data.subtitle || 'Une formule d\'exception pensée pour sublimer votre peau au quotidien.'}</p>
    </div>
    ${featuresHTML}
  </div>
</div>

<!-- ═══ AVANT / APRÈS ════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'Inter',sans-serif;margin-bottom:14px;">Transformation</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;">Avant · Après</h2>
      <p style="color:${C.muted};font-size:15px;max-width:480px;margin:0 auto;font-family:'Inter',sans-serif;">Des milliers de femmes ont transformé leur peau avec ${data.product_name}. Voici leur vérité.</p>
    </div>
    <div class="ba3" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <!-- Avant -->
      <div style="background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 2px 16px rgba(214,51,112,0.06);">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${BEFORE_IMG}" alt="Avant" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(28,10,14,0.65);color:#fff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:.06em;font-family:'Inter',sans-serif;">AVANT</div>
        </div>
        <div style="padding:22px;">
          <p style="font-size:15px;font-weight:600;color:${C.text};margin-bottom:8px;font-family:'Inter',sans-serif;">Avant notre produit</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'Inter',sans-serif;">Teint terne, pores visibles, hydratation insuffisante. La peau manque d'éclat et de vitalité au quotidien.</p>
        </div>
      </div>
      <!-- Après -->
      <div style="background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 2px 16px rgba(214,51,112,0.06);">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${AFTER_IMG}" alt="Après" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(214,51,112,0.85);color:#fff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:.06em;font-family:'Inter',sans-serif;">APRÈS</div>
        </div>
        <div style="padding:22px;">
          <p style="font-size:15px;font-weight:600;color:${C.text};margin-bottom:8px;font-family:'Inter',sans-serif;">Après ${data.product_name}</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'Inter',sans-serif;">Peau lumineuse, texture lissée, hydratation optimale. Un éclat naturel retrouvé dès les premières applications.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ AVIS CLIENTS ═════════════════════════════════════════════════════════ -->
<div id="reviews3" style="background:${C.card};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'Inter',sans-serif;margin-bottom:14px;">Témoignages</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:16px;">Elles en parlent mieux que nous</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">
        <span style="color:${C.accent};font-size:16px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:14px;color:${C.muted};font-family:'Inter',sans-serif;">4.9/5 · Plus de 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${reviewsHTML}
    </div>
  </div>
</div>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'Inter',sans-serif;margin-bottom:14px;">FAQ</p>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:600;letter-spacing:-.01em;color:${C.text};">Questions fréquentes</h2>
    </div>
    ${faqHTML}
  </div>
</div>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════════ -->
<div style="background:linear-gradient(135deg,${C.accent},#EC4899);padding:88px 24px;text-align:center;">
  <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.65);font-family:'Inter',sans-serif;margin-bottom:16px;">Offre exclusive</p>
  <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:600;color:#fff;letter-spacing:-.01em;margin-bottom:16px;line-height:1.15;">${data.headline || 'Sublimez votre beauté dès aujourd\'hui'}</h2>
  <p style="color:rgba(255,255,255,.8);font-size:16px;margin-bottom:14px;max-width:480px;margin-left:auto;margin-right:auto;font-family:'Inter',sans-serif;line-height:1.75;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="color:rgba(255,255,255,.95);font-size:14px;font-weight:600;margin-bottom:36px;font-family:'Inter',sans-serif;">${data.urgency}</p>` : '<div style="margin-bottom:36px;"></div>'}
  <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:inline-block;background:#fff;color:${C.accent};padding:18px 52px;border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;font-family:'Inter',sans-serif;letter-spacing:.01em;box-shadow:0 8px 32px rgba(0,0,0,0.2);transition:transform .2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
    ${data.cta || 'Commander maintenant'} →
  </a>
  <p style="margin-top:22px;font-size:13px;color:rgba(255,255,255,.5);font-family:'Inter',sans-serif;">Paiement sécurisé · Livraison offerte · Retour 30 jours · Satisfaite ou remboursée</p>
</div>

</body>
</html>`
}
