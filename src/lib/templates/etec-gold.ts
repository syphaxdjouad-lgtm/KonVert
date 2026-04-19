import type { LandingPageData } from '@/types'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
  'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
]
const BEFORE_IMG = 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80'
const AFTER_IMG  = 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'

const C = {
  bg:          '#0A0806',
  card:        '#130F09',
  accent:      '#D4A853',
  accentLight: 'rgba(212,168,83,0.10)',
  text:        '#EDE0C4',
  muted:       '#7A6A4E',
  border:      '#2A2010',
  divider:     'rgba(212,168,83,0.20)',
}

export function templateEtecGold(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  // ── Galerie thumbnails — galerie DROITE ──
  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('mi5').src='${img}';document.querySelectorAll('.th5').forEach(function(t,j){t.style.outline=j===${i}?'1px solid ${C.accent}':'1px solid transparent';t.style.opacity=j===${i}?'1':'.5';});"
      class="th5"
      style="border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `1px solid ${C.accent}` : '1px solid transparent'};opacity:${i === 0 ? 1 : .5};transition:all .25s;"
    >
      <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>`).join('')

  // ── Avantages ──
  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid ${C.divider};">
      <span style="color:${C.accent};font-size:14px;flex-shrink:0;margin-top:1px;letter-spacing:1px;">◆</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.7;font-family:'Montserrat',sans-serif;">${b}</span>
    </li>`).join('')

  // ── Features — texte inverse pour Gold (info gauche, image droite dans les deux cas) ──
  const featData = [
    {
      label: 'Savoir-faire & Matière',
      title: data.benefits[0] || `${data.product_name} — L'art de l'excellence`,
      desc:  data.subtitle || `Chaque pièce de ${data.product_name} est façonnée à la main par des artisans d'exception, selon des techniques ancestrales transmises de génération en génération.`,
      img:   imgs[0],
    },
    {
      label: 'Détails & Finitions',
      title: data.benefits[1] || 'L\'obsession du détail',
      desc:  data.benefits[3] || `De la sélection des matières premières à l'emballage final, chaque étape de création de ${data.product_name} est soumise à un contrôle qualité rigoureux.`,
      img:   imgs[1],
    },
    {
      label: 'Héritage & Prestige',
      title: data.benefits[2] || 'Un objet de transmission',
      desc:  data.benefits[4] || `${data.product_name} n'est pas un simple achat — c'est un investissement dans un objet qui traversera le temps, un symbole de raffinement que l'on transmet.`,
      img:   imgs[2],
    },
  ]

  const featuresHTML = featData.map((f, i) => {
    const reversed = i % 2 === 1
    return `
    <div class="feat-row5" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${reversed ? 2 : 1};border-radius:4px;overflow:hidden;aspect-ratio:4/3;border:1px solid ${C.divider};">
        <img src="${f.img}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="order:${reversed ? 1 : 2};">
        <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};font-family:'Montserrat',sans-serif;margin-bottom:14px;">${f.label}</p>
        <div style="width:40px;height:1px;background:${C.divider};margin-bottom:20px;"></div>
        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:600;line-height:1.3;letter-spacing:-.01em;color:${C.text};margin-bottom:18px;">${f.title}</h3>
        <p style="font-size:14px;color:${C.muted};line-height:1.9;font-family:'Montserrat',sans-serif;">${f.desc}</p>
      </div>
    </div>`
  }).join('')

  // ── Reviews luxe ──
  const reviewsData = [
    {
      text:  'Un niveau d\'excellence rare. La qualité des matières est irréprochable, l\'emballage est un cadeau en lui-même. Je possède plusieurs pièces de la maison et chacune justifie pleinement son prix. Une acquisition dont on ne se lasse pas.',
      name:  'Isabelle de M.',
      date:  'Il y a 6 jours',
    },
    {
      text:  'J\'offre exclusivement cette maison pour les occasions importantes. La présentation est somptueuse, la qualité parle d\'elle-même dès la première prise en main. Mon entourage est systématiquement impressionné. Service client à la hauteur du produit.',
      name:  'Charles F.',
      date:  'Il y a 2 semaines',
    },
    {
      text:  'Collectionneuse depuis des années, je suis très exigeante. Cette pièce dépasse mes attentes sur tous les points — la qualité, la finition, les détails invisibles qui font la différence. Un investissement qui prend de la valeur avec le temps.',
      name:  'Marguerite L.',
      date:  'Il y a 1 mois',
    },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="background:${C.card};border:1px solid ${C.divider};border-radius:4px;padding:32px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
        <span style="color:${C.accent};font-size:13px;letter-spacing:4px;">★★★★★</span>
        <span style="font-size:11px;color:${C.accent};font-weight:600;background:${C.accentLight};padding:3px 10px;border-radius:2px;font-family:'Montserrat',sans-serif;letter-spacing:.06em;">✓ Achat vérifié</span>
      </div>
      <div style="width:100%;height:1px;background:${C.divider};margin-bottom:20px;"></div>
      <p style="font-size:14px;color:${C.muted};line-height:1.9;margin-bottom:24px;font-family:'Montserrat',sans-serif;font-style:italic;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:36px;height:36px;border-radius:2px;background:${C.accentLight};border:1px solid ${C.divider};color:${C.accent};font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',Georgia,serif;">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:600;color:${C.text};font-family:'Montserrat',sans-serif;letter-spacing:.03em;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'Montserrat',sans-serif;">${r.date}</p>
        </div>
      </div>
    </div>`).join('')

  // ── FAQ accordion ──
  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${C.divider};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp5').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi5').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='240px';p.style.padding='0 0 20px 0';this.querySelector('.fi5').textContent='−';}"
        style="width:100%;background:none;border:none;padding:22px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:500;color:${C.text};font-family:'Montserrat',sans-serif;letter-spacing:.01em;">${item.question}</span>
        <span class="fi5" style="color:${C.accent};font-size:20px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fp5"
        style="max-height:${i === 0 ? '240px' : '0'};overflow:hidden;transition:max-height .4s ease,padding .4s ease;padding:${i === 0 ? '0 0 20px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.9;font-family:'Montserrat',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Montserrat',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;}
  a:hover{opacity:.8;}
  @media(max-width:768px){
    .pg5,.feat-row5,.rg5,.ba5{grid-template-columns:1fr!important;gap:24px!important;}
    .feat-row5>div{order:unset!important;}
    .h1-gold{font-size:28px!important;}
    .hiw5{grid-template-columns:1fr!important;gap:20px!important;}
    .pg5-inner{flex-direction:column!important;}
  }
</style>
</head>
<body>

<!-- ═══ BREADCRUMB ═══════════════════════════════════════════════════════════ -->
<div style="background:${C.card};border-bottom:1px solid ${C.divider};">
  <div style="max-width:1100px;margin:0 auto;padding:14px 24px;font-size:12px;color:${C.muted};font-family:'Montserrat',sans-serif;letter-spacing:.04em;">
    <a href="#" style="color:${C.accent};text-decoration:none;">Accueil</a>
    <span style="margin:0 10px;opacity:.35;">›</span>
    <a href="#" style="color:${C.accent};text-decoration:none;">Collection</a>
    <span style="margin:0 10px;opacity:.35;">›</span>
    <span style="color:${C.muted};">${data.product_name}</span>
  </div>
</div>

<!-- ═══ HERO — galerie DROITE (55%), info GAUCHE (45%) ═══════════════════════ -->
<div style="max-width:1100px;margin:0 auto;padding:0 24px;">
  <div class="pg5" style="display:grid;grid-template-columns:45% 55%;gap:60px;padding:52px 0 96px;align-items:start;">

    <!-- Info gauche -->
    <div>
      <!-- Ligne décorative dorée -->
      <div style="width:48px;height:1px;background:${C.accent};margin-bottom:20px;"></div>

      <!-- Label niche -->
      <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};margin-bottom:16px;font-family:'Montserrat',sans-serif;">Luxe · Haute Gamme · Prestige</p>

      <!-- H1 Playfair Display -->
      <h1 class="h1-gold" style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:700;line-height:1.2;letter-spacing:-.01em;color:${C.text};margin-bottom:12px;">${data.product_name}</h1>

      <!-- Sous-titre -->
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:16px;font-style:italic;font-weight:400;color:${C.muted};margin-bottom:22px;line-height:1.6;">${data.subtitle || 'L\'excellence à l\'état pur.'}</p>

      <!-- Séparateur doré fin -->
      <div style="width:100%;height:1px;background:${C.divider};margin-bottom:22px;"></div>

      <!-- Note clients — étoiles dorées -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
        <span style="color:${C.accent};font-size:13px;letter-spacing:4px;">★★★★★</span>
        <span style="font-size:12px;color:${C.muted};font-family:'Montserrat',sans-serif;">4.9/5 · <a href="#reviews5" style="color:${C.accent};text-decoration:none;">127 avis clients</a></span>
      </div>

      <!-- Prix -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap;padding:22px 24px;background:${C.accentLight};border:1px solid ${C.divider};">
        ${data.price ? `<span style="font-size:42px;font-weight:700;letter-spacing:-.02em;color:${C.text};font-family:'Playfair Display',Georgia,serif;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:${C.muted};text-decoration:line-through;font-family:'Montserrat',sans-serif;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="border:1px solid ${C.accent};color:${C.accent};padding:5px 14px;font-size:12px;font-weight:600;font-family:'Montserrat',sans-serif;letter-spacing:.06em;">-${savePct}%</span>` : ''}
      </div>

      <!-- Description courte -->
      <p style="font-size:14px;color:${C.muted};line-height:1.9;margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid ${C.divider};font-family:'Montserrat',sans-serif;">${data.subtitle || ''}</p>

      <!-- Avantages -->
      <ul style="list-style:none;margin-bottom:32px;">
        ${benefitsHTML}
      </ul>

      <!-- CTA principal — outline doré, background transparent avec hover ──
           Comportement hover simulé via onmouseover/onmouseout -->
      <a href="#"
        onmouseover="this.style.background='${C.accent}';this.style.color='${C.bg}';"
        onmouseout="this.style.background='transparent';this.style.color='${C.accent}';"
        style="display:block;text-align:center;background:transparent;color:${C.accent};padding:17px 32px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;margin-bottom:12px;letter-spacing:.1em;text-transform:uppercase;font-family:'Montserrat',sans-serif;border:2px solid ${C.accent};transition:all .25s;"
      >
        ${data.cta || 'Acquérir cette pièce'} →
      </a>

      <!-- CTA secondaire -->
      <a href="#"
        style="display:block;text-align:center;background:transparent;color:${C.muted};padding:15px 32px;border-radius:100px;font-size:13px;font-weight:500;text-decoration:none;border:1px solid ${C.border};margin-bottom:24px;letter-spacing:.06em;font-family:'Montserrat',sans-serif;transition:all .2s;"
        onmouseover="this.style.borderColor='${C.divider}';this.style.color='${C.text}';"
        onmouseout="this.style.borderColor='${C.border}';this.style.color='${C.muted}';"
      >
        Ajouter à ma liste de souhaits
      </a>

      <!-- Urgence -->
      ${data.urgency ? `
      <div style="display:flex;align-items:center;gap:10px;background:${C.accentLight};border:1px solid ${C.divider};padding:13px 16px;margin-bottom:24px;">
        <span style="color:${C.accent};font-size:14px;">◆</span>
        <p style="font-size:12px;color:${C.accent};font-weight:600;font-family:'Montserrat',sans-serif;letter-spacing:.04em;">${data.urgency}</p>
      </div>` : ''}

      <!-- Trust badges fond card sombre -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.divider};border:1px solid ${C.divider};margin-bottom:24px;">
        ${[
          ['◆', 'Authenticité', 'Certification d\'origine'],
          ['✦', 'Livraison privée', 'Emballage luxe'],
          ['⟳', 'Retour 30 jours', 'Sans condition'],
        ].map(([icon, title, sub]) => `
          <div style="background:${C.card};padding:16px 10px;text-align:center;">
            <div style="font-size:14px;color:${C.accent};margin-bottom:6px;letter-spacing:2px;">${icon}</div>
            <div style="font-size:11px;font-weight:600;color:${C.text};margin-bottom:3px;font-family:'Montserrat',sans-serif;letter-spacing:.04em;">${title}</div>
            <div style="font-size:11px;color:${C.muted};font-family:'Montserrat',sans-serif;">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Séparateur -->
      <div style="width:100%;height:1px;background:${C.divider};margin-bottom:20px;"></div>

      <!-- Tabs Garantie / Livraison / Support -->
      <div style="border:1px solid ${C.divider};">
        <div style="display:flex;border-bottom:1px solid ${C.divider};">
          ${['Garantie', 'Livraison', 'Service'].map((tab, i) => `
            <button
              onclick="document.querySelectorAll('.tp5').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb5').forEach(function(b,j){b.style.background=j===${i}?'${C.accentLight}':'transparent';b.style.color=j===${i}?'${C.accent}':'${C.muted}';b.style.fontWeight=j===${i}?'600':'400';});"
              class="tb5"
              style="flex:1;padding:13px 8px;background:${i === 0 ? C.accentLight : 'transparent'};border:none;cursor:pointer;font-size:12px;font-weight:${i === 0 ? '600' : '400'};color:${i === 0 ? C.accent : C.muted};transition:all .2s;font-family:'Montserrat',sans-serif;letter-spacing:.05em;text-transform:uppercase;"
            >${tab}</button>`).join('')}
        </div>
        <div class="tp5" style="padding:20px;font-size:13px;color:${C.muted};line-height:1.9;background:${C.card};font-family:'Montserrat',sans-serif;">
          Toutes nos pièces bénéficient d'une <strong style="color:${C.text};">garantie authenticité et qualité 2 ans</strong>. En cas de défaillance, nous remplaçons ou remboursons intégralement. Notre réputation repose sur votre satisfaction totale.
        </div>
        <div class="tp5" style="padding:20px;font-size:13px;color:${C.muted};line-height:1.9;display:none;background:${C.card};font-family:'Montserrat',sans-serif;">
          Livraison <strong style="color:${C.text};">express 24h</strong> en coffret luxe signé. Signature obligatoire, assurance incluse. Livraison internationale disponible. Discrétion et soin garantis pour chaque expédition.
        </div>
        <div class="tp5" style="padding:20px;font-size:13px;color:${C.muted};line-height:1.9;display:none;background:${C.card};font-family:'Montserrat',sans-serif;">
          Un <strong style="color:${C.text};">conseiller dédié</strong> est attribué à chaque client. Disponible par téléphone, email et WhatsApp. Conseil personnalisé, retouches et services sur mesure disponibles sur demande.
        </div>
      </div>
    </div>

    <!-- Galerie droite (55%) -->
    <div>
      <div style="background:${C.card};border-radius:4px;overflow:hidden;aspect-ratio:1;border:1px solid ${C.divider};margin-bottom:12px;">
        <img id="mi5" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>
  </div>
</div>

<!-- ═══ FEATURES ALTERNÉES ════════════════════════════════════════════════════ -->
<div style="background:${C.card};padding:96px 0;border-top:1px solid ${C.divider};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:72px;">
      <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};font-family:'Montserrat',sans-serif;margin-bottom:16px;">Maison de Luxe</p>
      <div style="width:48px;height:1px;background:${C.divider};margin:0 auto 24px;"></div>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:16px;line-height:1.3;">${data.headline || data.product_name}</h2>
      <p style="color:${C.muted};font-size:14px;max-width:480px;margin:0 auto;font-family:'Montserrat',sans-serif;line-height:1.9;">${data.subtitle || 'Chaque détail raconte une histoire d\'excellence et de tradition séculaire.'}</p>
    </div>
    ${featuresHTML}
  </div>
</div>

<!-- ═══ AVANT / APRÈS ════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.divider};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};font-family:'Montserrat',sans-serif;margin-bottom:16px;">Transformation</p>
      <div style="width:48px;height:1px;background:${C.divider};margin:0 auto 24px;"></div>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:14px;">Avant · Après</h2>
      <p style="color:${C.muted};font-size:14px;max-width:480px;margin:0 auto;font-family:'Montserrat',sans-serif;">L'élégance transforme. Découvrez l'effet ${data.product_name} sur ceux qui l'ont adopté.</p>
    </div>
    <div class="ba5" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <!-- Avant -->
      <div style="background:${C.card};border:1px solid ${C.divider};overflow:hidden;">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${BEFORE_IMG}" alt="Avant" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(10,8,6,0.75);color:${C.muted};font-size:11px;font-weight:600;padding:5px 14px;letter-spacing:.1em;font-family:'Montserrat',sans-serif;">AVANT</div>
        </div>
        <div style="padding:24px;border-top:1px solid ${C.divider};">
          <p style="font-size:14px;font-weight:600;color:${C.text};margin-bottom:8px;font-family:'Montserrat',sans-serif;">Avant ${data.product_name}</p>
          <p style="font-size:13px;color:${C.muted};line-height:1.85;font-family:'Montserrat',sans-serif;">Un manque d'éclat, une silhouette qui ne reflète pas encore votre ambition. Le quotidien sans la touche d'exception.</p>
        </div>
      </div>
      <!-- Après -->
      <div style="background:${C.card};border:1px solid ${C.divider};overflow:hidden;">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${AFTER_IMG}" alt="Après" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(212,168,83,0.85);color:${C.bg};font-size:11px;font-weight:700;padding:5px 14px;letter-spacing:.1em;font-family:'Montserrat',sans-serif;">APRÈS</div>
        </div>
        <div style="padding:24px;border-top:1px solid ${C.divider};">
          <p style="font-size:14px;font-weight:600;color:${C.text};margin-bottom:8px;font-family:'Montserrat',sans-serif;">Après ${data.product_name}</p>
          <p style="font-size:13px;color:${C.muted};line-height:1.85;font-family:'Montserrat',sans-serif;">Une présence affirmée, une distinction naturelle. L'objet d'exception qui complète et révèle qui vous êtes.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ AVIS CLIENTS ═════════════════════════════════════════════════════════ -->
<div id="reviews5" style="background:${C.card};padding:96px 0;border-top:1px solid ${C.divider};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};font-family:'Montserrat',sans-serif;margin-bottom:16px;">Témoignages</p>
      <div style="width:48px;height:1px;background:${C.divider};margin:0 auto 24px;"></div>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:600;letter-spacing:-.01em;color:${C.text};margin-bottom:18px;">La parole de nos clients</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">
        <span style="color:${C.accent};font-size:14px;letter-spacing:4px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'Montserrat',sans-serif;">4.9/5 · Plus de 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg5" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${reviewsHTML}
    </div>
  </div>
</div>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:96px 0;border-top:1px solid ${C.divider};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:60px;">
      <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};font-family:'Montserrat',sans-serif;margin-bottom:16px;">Questions</p>
      <div style="width:48px;height:1px;background:${C.divider};margin:0 auto 24px;"></div>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:600;letter-spacing:-.01em;color:${C.text};">Questions fréquentes</h2>
    </div>
    ${faqHTML}
  </div>
</div>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════════ -->
<div style="background:linear-gradient(135deg,#1A1206,#2D1E08);padding:96px 24px;text-align:center;border-top:1px solid rgba(212,168,83,0.30);">
  <p style="font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.accent};opacity:.7;font-family:'Montserrat',sans-serif;margin-bottom:20px;">Collection exclusive</p>
  <div style="width:48px;height:1px;background:${C.divider};margin:0 auto 28px;"></div>
  <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:40px;font-weight:600;color:${C.text};letter-spacing:-.01em;margin-bottom:18px;line-height:1.2;">${data.headline || 'L\'excellence mérite votre attention'}</h2>
  <p style="color:${C.muted};font-size:15px;margin-bottom:16px;max-width:480px;margin-left:auto;margin-right:auto;font-family:'Montserrat',sans-serif;line-height:1.85;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="color:${C.accent};font-size:13px;font-weight:600;margin-bottom:40px;font-family:'Montserrat',sans-serif;letter-spacing:.04em;">${data.urgency}</p>` : '<div style="margin-bottom:40px;"></div>'}
  <a href="#"
    onmouseover="this.style.background='${C.accent}';this.style.color='${C.bg}';"
    onmouseout="this.style.background='transparent';this.style.color='${C.accent}';"
    style="display:inline-block;background:transparent;color:${C.accent};padding:18px 56px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;font-family:'Montserrat',sans-serif;letter-spacing:.1em;text-transform:uppercase;border:2px solid ${C.accent};transition:all .25s;"
  >
    ${data.cta || 'Acquérir cette pièce'} →
  </a>
  <p style="margin-top:24px;font-size:12px;color:${C.muted};font-family:'Montserrat',sans-serif;letter-spacing:.04em;">Livraison privée · Authenticité garantie · Retour 30 jours · Service exclusif</p>
</div>

</body>
</html>`
}
