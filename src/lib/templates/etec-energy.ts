import type { LandingPageData } from '@/types'
import { ico } from './icons'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
]
const BEFORE_IMG = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'
const AFTER_IMG  = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'

const C = {
  bg:          '#F5F5F5',
  card:        '#FFFFFF',
  accent:      '#E63000',
  accentLight: '#FFE8E0',
  text:        '#111111',
  muted:       '#666666',
  border:      '#E0E0E0',
}

export function templateEtecEnergy(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  // ── Galerie thumbnails ──
  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('mi6').src='${img}';document.querySelectorAll('.th6').forEach(function(t,j){t.style.outline=j===${i}?'3px solid ${C.accent}':'3px solid transparent';t.style.opacity=j===${i}?'1':'.5';});"
      class="th6"
      style="border-radius:6px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `3px solid ${C.accent}` : '3px solid transparent'};opacity:${i === 0 ? 1 : .5};transition:all .15s;"
    >
      <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>`).join('')

  // ── Avantages ──
  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid ${C.border};">
      <span style="width:22px;height:22px;background:${C.accent};color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">✓</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.6;font-family:'Barlow',sans-serif;">${b}</span>
    </li>`).join('')

  // ── Features alternées ──
  const featData = [
    {
      label: 'Performance & Résultats',
      title: data.benefits[0] || `${data.product_name} — CONÇU POUR GAGNER`,
      desc:  data.subtitle || `${data.product_name} a été développé avec des athlètes de haut niveau pour vous offrir les meilleures performances possibles. Chaque composant est optimisé pour maximiser vos résultats.`,
      img:   imgs[0],
    },
    {
      label: 'Récupération & Endurance',
      title: data.benefits[1] || 'RÉCUPÈRE PLUS VITE. VA PLUS LOIN.',
      desc:  data.benefits[3] || `Notre formule unique accélère la récupération musculaire et repousse vos limites. Moins de douleurs, plus de sessions, des résultats qui s'accumulent.`,
      img:   imgs[1],
    },
    {
      label: 'Qualité & Certification',
      title: data.benefits[2] || 'QUALITÉ CERTIFIÉE. RÉSULTATS GARANTIS.',
      desc:  data.benefits[4] || `Testé et certifié par des laboratoires indépendants. Aucun additif interdit. ${data.product_name} répond aux standards les plus exigeants de l'industrie du sport.`,
      img:   imgs[2],
    },
  ]

  const featuresHTML = featData.map((f, i) => {
    const reversed = i % 2 === 1
    return `
    <div class="feat-row6" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${reversed ? 2 : 1};border-radius:8px;overflow:hidden;aspect-ratio:4/3;">
        <img src="${f.img}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="order:${reversed ? 1 : 2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};font-family:'Barlow Condensed',sans-serif;margin-bottom:14px;">${f.label}</p>
        <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:800;line-height:1.1;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};margin-bottom:16px;">${f.title}</h3>
        <p style="font-size:15px;color:${C.muted};line-height:1.8;font-family:'Barlow',sans-serif;">${f.desc}</p>
      </div>
    </div>`
  }).join('')

  // ── Reviews sport ──
  const reviewsData = [
    {
      text:  'J\'utilise ce produit depuis 8 semaines et les gains sont réels. Mes performances en salle ont augmenté de façon mesurable. Récupération plus rapide, meilleure concentration pendant l\'entraînement. Indispensable dans ma routine.',
      name:  'Kevin M.',
      date:  'Il y a 3 jours',
    },
    {
      text:  'En tant que compétiteur, j\'ai testé beaucoup de produits. Celui-ci se distingue clairement. Pas de crash énergétique, pas de goût artificiel. Les résultats parlent d\'eux-mêmes au bout de 3 semaines. Je commande pour 3 mois.',
      name:  'Jordan T.',
      date:  'Il y a 1 semaine',
    },
    {
      text:  'Je cherchais quelque chose pour mes entraînements HIIT matinaux. Depuis que j\'utilise ce produit, mes séances sont plus intenses et ma récupération est nettement améliorée. Je sens une vraie différence. Livraison impeccable aussi.',
      name:  'Sarah K.',
      date:  'Il y a 2 semaines',
    },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:26px;border-left:4px solid ${C.accent};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <span style="color:${C.accent};font-size:14px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:11px;color:#16a34a;font-weight:700;background:#dcfce7;padding:3px 10px;border-radius:4px;font-family:'Barlow',sans-serif;">✓ Achat vérifié</span>
      </div>
      <p style="font-size:14px;color:${C.muted};line-height:1.8;margin-bottom:20px;font-family:'Barlow',sans-serif;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;background:${C.accentLight};color:${C.accent};font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:700;color:${C.text};font-family:'Barlow',sans-serif;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'Barlow',sans-serif;">${r.date}</p>
        </div>
      </div>
    </div>`).join('')

  // ── FAQ accordion ──
  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:2px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp6').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi6').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='240px';p.style.padding='0 0 18px 0';this.querySelector('.fi6').textContent='−';}"
        style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:700;color:${C.text};font-family:'Barlow',sans-serif;text-transform:uppercase;letter-spacing:.02em;">${item.question}</span>
        <span class="fi6" style="color:${C.accent};font-size:26px;font-weight:900;line-height:1;flex-shrink:0;font-family:'Barlow Condensed',sans-serif;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fp6"
        style="max-height:${i === 0 ? '240px' : '0'};overflow:hidden;transition:max-height .3s ease,padding .3s ease;padding:${i === 0 ? '0 0 18px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.8;font-family:'Barlow',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Barlow',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;}
  @media(max-width:768px){
    .pg6,.feat-row6,.rg6,.ba6{grid-template-columns:1fr!important;gap:24px!important;}
    .feat-row6>div{order:unset!important;}
    .h1-energy{font-size:36px!important;line-height:1!important;}
    .hiw6{grid-template-columns:1fr!important;gap:20px!important;}
    .countdown-bar{flex-direction:column!important;gap:12px!important;}
  }
</style>
</head>
<body>

<!-- ═══ BREADCRUMB ═══════════════════════════════════════════════════════════ -->
<div style="background:${C.card};border-bottom:2px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:13px 24px;font-size:12px;color:${C.muted};font-family:'Barlow',sans-serif;letter-spacing:.03em;text-transform:uppercase;">
    <a href="#" style="color:${C.accent};text-decoration:none;font-weight:600;">Accueil</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <a href="#" style="color:${C.accent};text-decoration:none;font-weight:600;">Boutique</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <span style="color:${C.muted};">${data.product_name}</span>
  </div>
</div>

<!-- ═══ HERO — 60% image / 40% info ══════════════════════════════════════════ -->
<div style="max-width:1100px;margin:0 auto;padding:0 24px;">
  <div class="pg6" style="display:grid;grid-template-columns:60% 40%;gap:48px;padding:44px 0 80px;align-items:start;">

    <!-- Galerie gauche — très dominante ──────────────────────── -->
    <div>
      <div style="background:${C.card};border-radius:8px;overflow:hidden;aspect-ratio:4/3;border:1px solid ${C.border};margin-bottom:10px;position:relative;">
        <img id="mi6" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
        <!-- Badge performance -->
        <div style="position:absolute;top:16px;right:16px;background:${C.accent};color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;padding:6px 14px;border-radius:4px;">#1 PERFORMANCE</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>

    <!-- Info droite (40%) ──────────────────────────────────────── -->
    <div>
      <!-- Label niche -->
      <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};margin-bottom:12px;font-family:'Barlow Condensed',sans-serif;">Sport · Fitness · Nutrition</p>

      <!-- H1 Barlow Condensed UPPERCASE -->
      <h1 class="h1-energy" style="font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;line-height:1;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};margin-bottom:14px;">${data.product_name}</h1>

      <!-- Sous-titre -->
      <p style="font-size:15px;color:${C.muted};margin-bottom:16px;line-height:1.65;font-family:'Barlow',sans-serif;font-weight:500;">${data.subtitle || 'Dépasse tes limites. Chaque jour.'}</p>

      <!-- Note clients -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px;">
        <span style="color:${C.accent};font-size:14px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'Barlow',sans-serif;">4.9/5 · <a href="#reviews6" style="color:${C.accent};text-decoration:none;font-weight:600;">127 avis</a></span>
      </div>

      <!-- Prix -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap;padding:18px 20px;background:${C.accentLight};border-left:4px solid ${C.accent};">
        ${data.price ? `<span style="font-size:40px;font-weight:900;letter-spacing:-.025em;color:${C.text};font-family:'Barlow Condensed',sans-serif;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:${C.muted};text-decoration:line-through;font-family:'Barlow',sans-serif;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:${C.accent};color:#fff;padding:5px 12px;font-size:13px;font-weight:900;font-family:'Barlow Condensed',sans-serif;letter-spacing:.05em;text-transform:uppercase;">SAVE ${savePct}%</span>` : ''}
      </div>

      <!-- Description courte -->
      <p style="font-size:14px;color:${C.muted};line-height:1.8;margin-bottom:18px;padding-bottom:18px;border-bottom:2px solid ${C.border};font-family:'Barlow',sans-serif;">${data.subtitle || ''}</p>

      <!-- Avantages -->
      <ul style="list-style:none;margin-bottom:24px;">
        ${benefitsHTML}
      </ul>

      <!-- CTA principal — Barlow Condensed UPPERCASE bold -->
      <a href="#" style="display:block;text-align:center;background:${C.accent};color:#fff;padding:18px 32px;border-radius:100px;font-size:16px;font-weight:900;text-decoration:none;margin-bottom:10px;letter-spacing:.06em;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;box-shadow:0 4px 20px rgba(230,48,0,0.40);transition:opacity .15s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
        ${data.cta || 'COMMANDER MAINTENANT'} →
      </a>

      <!-- CTA secondaire -->
      <a href="#" style="display:block;text-align:center;background:transparent;color:${C.text};padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid ${C.border};margin-bottom:20px;font-family:'Barlow',sans-serif;transition:border-color .15s;" onmouseover="this.style.borderColor='${C.accent}';this.style.color='${C.accent}';" onmouseout="this.style.borderColor='${C.border}';this.style.color='${C.text}';">
        Ajouter au panier
      </a>

      <!-- Urgence + COUNTDOWN TIMER — élément unique Energy -->
      ${data.urgency ? `
      <div style="background:#111;color:#fff;padding:14px 16px;margin-bottom:20px;border-left:4px solid ${C.accent};">
        <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-family:'Barlow Condensed',sans-serif;color:${C.accent};margin-bottom:10px;display:flex;align-items:center;gap:6px;">${ico.flash(14)} ${data.urgency}</p>
        <div class="countdown-bar" style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#aaa;font-family:'Barlow',sans-serif;font-weight:500;margin-right:4px;">L'offre expire dans :</span>
          <div style="display:flex;align-items:center;gap:4px;">
            <div style="background:#222;border:1px solid #333;padding:6px 10px;text-align:center;min-width:44px;">
              <span id="countdown-h" style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#fff;display:block;line-height:1;">02</span>
              <span style="font-family:'Barlow',sans-serif;font-size:9px;color:#666;text-transform:uppercase;letter-spacing:.06em;">HRS</span>
            </div>
            <span style="color:${C.accent};font-size:20px;font-weight:900;font-family:'Barlow Condensed',sans-serif;">:</span>
            <div style="background:#222;border:1px solid #333;padding:6px 10px;text-align:center;min-width:44px;">
              <span id="countdown-m" style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#fff;display:block;line-height:1;">47</span>
              <span style="font-family:'Barlow',sans-serif;font-size:9px;color:#666;text-transform:uppercase;letter-spacing:.06em;">MIN</span>
            </div>
            <span style="color:${C.accent};font-size:20px;font-weight:900;font-family:'Barlow Condensed',sans-serif;">:</span>
            <div style="background:#222;border:1px solid #333;padding:6px 10px;text-align:center;min-width:44px;">
              <span id="countdown-s" style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#fff;display:block;line-height:1;">33</span>
              <span style="font-family:'Barlow',sans-serif;font-size:9px;color:#666;text-transform:uppercase;letter-spacing:.06em;">SEC</span>
            </div>
          </div>
        </div>
      </div>` : ''}

      <!-- Trust badges -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};margin-bottom:22px;">
        ${[
          [ico.trophy(22), 'Certifié', 'Anti-dopage'],
          [ico.truck(22), 'Livraison', 'Express 48h'],
          [ico.return(22), 'Retour', '30 jours'],
        ].map(([icon, title, sub]) => `
          <div style="background:${C.card};padding:12px 8px;text-align:center;">
            <div style="color:${C.accent};display:flex;justify-content:center;margin-bottom:5px;">${icon}</div>
            <div style="font-size:11px;font-weight:700;color:${C.text};margin-bottom:1px;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.04em;">${title}</div>
            <div style="font-size:11px;color:${C.muted};font-family:'Barlow',sans-serif;">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Tabs Garantie / Livraison / Support -->
      <div style="border:2px solid ${C.border};">
        <div style="display:flex;border-bottom:2px solid ${C.border};">
          ${['Garantie', 'Livraison', 'Support'].map((tab, i) => `
            <button
              onclick="document.querySelectorAll('.tp6').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb6').forEach(function(b,j){b.style.background=j===${i}?'${C.accentLight}':'transparent';b.style.color=j===${i}?'${C.accent}':'${C.muted}';b.style.fontWeight=j===${i}?'700':'500';b.style.borderBottom=j===${i}?'3px solid ${C.accent}':'3px solid transparent';});"
              class="tb6"
              style="flex:1;padding:12px 8px;background:${i === 0 ? C.accentLight : 'transparent'};border:none;cursor:pointer;font-size:12px;font-weight:${i === 0 ? '700' : '500'};color:${i === 0 ? C.accent : C.muted};transition:all .15s;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.06em;border-bottom:${i === 0 ? `3px solid ${C.accent}` : '3px solid transparent'};"
            >${tab}</button>`).join('')}
        </div>
        <div class="tp6" style="padding:16px;font-size:13px;color:${C.muted};line-height:1.8;background:${C.card};font-family:'Barlow',sans-serif;">
          <strong style="color:${C.text};">Satisfait ou remboursé 30 jours.</strong> Si tu ne vois pas de résultats après 30 jours d'utilisation conforme, on te rembourse intégralement. Sans question, sans frais. Notre confiance en nos produits est totale.
        </div>
        <div class="tp6" style="padding:16px;font-size:13px;color:${C.muted};line-height:1.8;display:none;background:${C.card};font-family:'Barlow',sans-serif;">
          Livraison <strong style="color:${C.text};">express 24–48h</strong> partout en France. Commande avant 14h = expédition le jour même. Suivi en temps réel par SMS. <strong style="color:${C.text};">Offerte dès 50€.</strong>
        </div>
        <div class="tp6" style="padding:16px;font-size:13px;color:${C.muted};line-height:1.8;display:none;background:${C.card};font-family:'Barlow',sans-serif;">
          Notre équipe de coachs est disponible <strong style="color:${C.text};">7j/7</strong>. Conseils personnalisés, protocoles d'entraînement, suivi nutrition. Répond en moins d'1h en semaine.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ FEATURES ALTERNÉES ════════════════════════════════════════════════════ -->
<div style="background:${C.card};padding:88px 0;border-top:2px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};font-family:'Barlow Condensed',sans-serif;margin-bottom:14px;">Caractéristiques</p>
      <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};margin-bottom:14px;">${data.headline || data.product_name}</h2>
      <p style="color:${C.muted};font-size:15px;max-width:520px;margin:0 auto;font-family:'Barlow',sans-serif;line-height:1.75;">${data.subtitle || 'Tout a été pensé pour maximiser tes performances, sans compromis.'}</p>
    </div>
    ${featuresHTML}
  </div>
</div>

<!-- ═══ AVANT / APRÈS ════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:2px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};font-family:'Barlow Condensed',sans-serif;margin-bottom:14px;">Transformation</p>
      <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};margin-bottom:14px;">Avant · Après</h2>
      <p style="color:${C.muted};font-size:15px;max-width:480px;margin:0 auto;font-family:'Barlow',sans-serif;">Des milliers d'athlètes ont changé leur niveau avec ${data.product_name}. Voici la preuve.</p>
    </div>
    <div class="ba6" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <!-- Avant -->
      <div style="background:${C.card};border:1px solid ${C.border};overflow:hidden;border-radius:8px;">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${BEFORE_IMG}" alt="Avant" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.75);color:#fff;font-size:12px;font-weight:900;padding:5px 14px;letter-spacing:.1em;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;">AVANT</div>
        </div>
        <div style="padding:22px;border-top:2px solid ${C.border};">
          <p style="font-size:15px;font-weight:700;color:${C.text};margin-bottom:8px;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.03em;">Avant notre produit</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'Barlow',sans-serif;">Stagnation, récupération lente, performances plafonnées. Le corps peine à s'adapter et à progresser malgré les efforts.</p>
        </div>
      </div>
      <!-- Après -->
      <div style="background:${C.card};border:1px solid ${C.border};overflow:hidden;border-radius:8px;border-top:4px solid ${C.accent};">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${AFTER_IMG}" alt="Après" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:${C.accent};color:#fff;font-size:12px;font-weight:900;padding:5px 14px;letter-spacing:.1em;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;">APRÈS</div>
        </div>
        <div style="padding:22px;border-top:2px solid ${C.border};">
          <p style="font-size:15px;font-weight:700;color:${C.text};margin-bottom:8px;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.03em;">Après ${data.product_name}</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'Barlow',sans-serif;">Performances décuplées, récupération accélérée, énergie durable. Les résultats s'accumulent semaine après semaine.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ AVIS CLIENTS ═════════════════════════════════════════════════════════ -->
<div id="reviews6" style="background:${C.card};padding:88px 0;border-top:2px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};font-family:'Barlow Condensed',sans-serif;margin-bottom:14px;">Témoignages</p>
      <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};margin-bottom:16px;">Ils en parlent</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">
        <span style="color:${C.accent};font-size:16px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:14px;color:${C.muted};font-family:'Barlow',sans-serif;">4.9/5 · Plus de 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg6" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${reviewsHTML}
    </div>
  </div>
</div>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:2px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};font-family:'Barlow Condensed',sans-serif;margin-bottom:14px;">FAQ</p>
      <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;letter-spacing:-.01em;text-transform:uppercase;color:${C.text};">Questions fréquentes</h2>
    </div>
    ${faqHTML}
  </div>
</div>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════════ -->
<div style="background:${C.accent};padding:88px 24px;text-align:center;">
  <p style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.65);font-family:'Barlow Condensed',sans-serif;margin-bottom:16px;">Offre limitée</p>
  <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;color:#fff;letter-spacing:-.01em;text-transform:uppercase;margin-bottom:16px;line-height:1.05;">${data.headline || 'PRÊT À PASSER AU NIVEAU SUPÉRIEUR ?'}</h2>
  <p style="color:rgba(255,255,255,.85);font-size:16px;margin-bottom:14px;max-width:480px;margin-left:auto;margin-right:auto;font-family:'Barlow',sans-serif;line-height:1.75;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="color:rgba(255,255,255,.95);font-size:14px;font-weight:700;margin-bottom:36px;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.06em;">${data.urgency}</p>` : '<div style="margin-bottom:36px;"></div>'}
  <a href="#" style="display:inline-block;background:#fff;color:${C.accent};padding:20px 56px;border-radius:100px;font-size:18px;font-weight:900;text-decoration:none;font-family:'Barlow Condensed',sans-serif;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 32px rgba(0,0,0,0.25);transition:transform .15s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
    ${data.cta || 'COMMANDER MAINTENANT'} →
  </a>
  <p style="margin-top:24px;font-size:13px;color:rgba(255,255,255,.5);font-family:'Barlow',sans-serif;">Paiement sécurisé · Livraison express · Retour 30 jours · Certifié anti-dopage</p>
</div>

<!-- ═══ COUNTDOWN JS ══════════════════════════════════════════════════════════ -->
<script>
  (function() {
    var totalSeconds = 2 * 3600 + 47 * 60 + 33;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      if (totalSeconds <= 0) {
        var h = document.getElementById('countdown-h');
        var m = document.getElementById('countdown-m');
        var s = document.getElementById('countdown-s');
        if (h) h.textContent = '00';
        if (m) m.textContent = '00';
        if (s) s.textContent = '00';
        return;
      }
      totalSeconds--;
      var hrs  = Math.floor(totalSeconds / 3600);
      var mins = Math.floor((totalSeconds % 3600) / 60);
      var secs = totalSeconds % 60;
      var eh = document.getElementById('countdown-h');
      var em = document.getElementById('countdown-m');
      var es = document.getElementById('countdown-s');
      if (eh) eh.textContent = pad(hrs);
      if (em) em.textContent = pad(mins);
      if (es) es.textContent = pad(secs);
      setTimeout(tick, 1000);
    }
    setTimeout(tick, 1000);
  })();
</script>

</body>
</html>`
}
