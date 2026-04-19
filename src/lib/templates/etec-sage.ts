import type { LandingPageData } from '@/types'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
  'https://images.unsplash.com/photo-1509803874385-db7a23559082?w=800&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
]
const BEFORE_IMG = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'
const AFTER_IMG  = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80'

const C = {
  bg:          '#F2F7F2',
  card:        '#FFFFFF',
  accent:      '#2D6A4F',
  accentLight: '#D4EDDA',
  text:        '#1B3A2D',
  muted:       '#5A7A65',
  border:      '#C8E6C9',
}

export function templateEtecSage(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  // ── Galerie thumbnails ──
  const thumbsHTML = imgs.map((img, i) => `
    <div
      onclick="document.getElementById('mi4').src='${img}';document.querySelectorAll('.th4').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${C.accent}':'2px solid transparent';t.style.opacity=j===${i}?'1':'.6';});"
      class="th4"
      style="border-radius:10px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `2px solid ${C.accent}` : '2px solid transparent'};opacity:${i === 0 ? 1 : .6};transition:all .2s;"
    >
      <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>`).join('')

  // ── Avantages ──
  const benefitsHTML = data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid ${C.border};">
      <span style="width:20px;height:20px;border-radius:6px;background:${C.accentLight};color:${C.accent};font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">✓</span>
      <span style="font-size:14px;color:${C.muted};line-height:1.65;font-family:'DM Sans',sans-serif;">${b}</span>
    </li>`).join('')

  // ── Features alternées ──
  const featData = [
    {
      label: 'Ingrédients & Origine',
      title: data.benefits[0] || `${data.product_name} — 100% d'origine naturelle`,
      desc:  data.subtitle || `Chaque ingrédient de ${data.product_name} est soigneusement sélectionné pour son origine biologique certifiée et son efficacité prouvée.`,
      img:   imgs[0],
    },
    {
      label: 'Nutrition & Bien-être',
      title: data.benefits[1] || 'Nourrit votre corps en profondeur',
      desc:  data.benefits[3] || `Riche en nutriments essentiels et en antioxydants naturels, ${data.product_name} soutient votre vitalité au quotidien sans compromis.`,
      img:   imgs[1],
    },
    {
      label: 'Éco-responsabilité',
      title: data.benefits[2] || 'Bon pour vous, bon pour la planète',
      desc:  data.benefits[4] || `Emballage 100% recyclable, production à faible empreinte carbone. Chaque achat de ${data.product_name} contribue à une agriculture durable.`,
      img:   imgs[2],
    },
  ]

  const featuresHTML = featData.map((f, i) => {
    const reversed = i % 2 === 1
    return `
    <div class="feat-row4" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${reversed ? 2 : 1};border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 8px 32px rgba(45,106,79,0.10);">
        <img src="${f.img}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="order:${reversed ? 1 : 2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">${f.label}</p>
        <h3 style="font-family:'DM Sans',sans-serif;font-size:24px;font-weight:800;line-height:1.25;letter-spacing:-.02em;color:${C.text};margin-bottom:16px;">${f.title}</h3>
        <p style="font-size:15px;color:${C.muted};line-height:1.85;font-family:'DM Sans',sans-serif;">${f.desc}</p>
      </div>
    </div>`
  }).join('')

  // ── Reviews wellness ──
  const reviewsData = [
    {
      text:  'Je consomme ce produit depuis 3 mois et la différence est flagrante. Mon énergie est au top, ma digestion s\'est améliorée et je dors mieux. Un vrai produit naturel qui tient ses promesses. Je ne peux plus m\'en passer.',
      name:  'Marie C.',
      date:  'Il y a 5 jours',
    },
    {
      text:  'Enfin un produit bio qui goûte vraiment bon ! Pas d\'amertume, pas d\'additifs suspects. Je l\'incorpore à mes smoothies chaque matin. Livraison soignée dans un emballage recyclable — tout est cohérent avec les valeurs de la marque.',
      name:  'Julia B.',
      date:  'Il y a 10 jours',
    },
    {
      text:  'J\'étais sceptique au départ mais les ingrédients m\'ont convaincu. Résultats visibles après 2 semaines. Ma femme l\'a aussi adopté. On est devenus de vrais fidèles. Rapport qualité/prix imbattable pour du 100% bio.',
      name:  'Antoine L.',
      date:  'Il y a 3 semaines',
    },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:18px;padding:28px;box-shadow:0 2px 16px rgba(45,106,79,0.06);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <span style="color:#4CAF50;font-size:15px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:11px;color:${C.accent};font-weight:600;background:${C.accentLight};padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;">✓ Achat vérifié</span>
      </div>
      <p style="font-size:14px;color:${C.muted};line-height:1.85;margin-bottom:20px;font-family:'DM Sans',sans-serif;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:${C.accentLight};color:${C.accent};font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:700;color:${C.text};font-family:'DM Sans',sans-serif;">${r.name}</p>
          <p style="font-size:11px;color:${C.muted};font-family:'DM Sans',sans-serif;">${r.date}</p>
        </div>
      </div>
    </div>`).join('')

  // ── FAQ accordion ──
  const faqHTML = data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button
        onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp4').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi4').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='240px';p.style.padding='0 0 18px 0';this.querySelector('.fi4').textContent='−';}"
        style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;"
      >
        <span style="font-size:15px;font-weight:700;color:${C.text};font-family:'DM Sans',sans-serif;">${item.question}</span>
        <span class="fi4" style="color:${C.accent};font-size:24px;font-weight:300;line-height:1;flex-shrink:0;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div
        class="fp4"
        style="max-height:${i === 0 ? '240px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 18px 0' : '0'};font-size:14px;color:${C.muted};line-height:1.85;font-family:'DM Sans',sans-serif;"
      >${item.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;line-height:1.6;font-size:15px;}
  img{display:block;}
  @media(max-width:768px){
    .pg4,.feat-row4,.rg4,.ba4{grid-template-columns:1fr!important;gap:24px!important;}
    .feat-row4>div{order:unset!important;}
    .h1-sage{font-size:26px!important;}
    .hiw4{grid-template-columns:1fr!important;gap:20px!important;}
  }
</style>
</head>
<body>

<!-- ═══ BREADCRUMB ═══════════════════════════════════════════════════════════ -->
<div style="background:${C.card};border-bottom:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:13px 24px;font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">
    <a href="#" style="color:${C.accent};text-decoration:none;">Accueil</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <a href="#" style="color:${C.accent};text-decoration:none;">Boutique</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <span style="color:${C.muted};">${data.product_name}</span>
  </div>
</div>

<!-- ═══ HERO ══════════════════════════════════════════════════════════════════ -->
<div style="max-width:1100px;margin:0 auto;padding:0 24px;">
  <div class="pg4" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:48px 0 88px;align-items:start;">

    <!-- Galerie gauche -->
    <div>
      <div style="background:${C.card};border-radius:20px;overflow:hidden;aspect-ratio:1;border:1px solid ${C.border};margin-bottom:12px;box-shadow:0 4px 24px rgba(45,106,79,0.08);">
        <img id="mi4" src="${imgs[0]}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>

    <!-- Info droite -->
    <div>
      <!-- Label niche -->
      <p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.accent};margin-bottom:14px;font-family:'DM Sans',sans-serif;">Bio · Naturel · Bien-être</p>

      <!-- H1 DM Sans 800 -->
      <h1 class="h1-sage" style="font-family:'DM Sans',sans-serif;font-size:34px;font-weight:800;line-height:1.15;letter-spacing:-.02em;color:${C.text};margin-bottom:12px;">${data.product_name}</h1>

      <!-- Sous-titre -->
      <p style="font-size:15px;color:${C.muted};margin-bottom:18px;line-height:1.7;font-family:'DM Sans',sans-serif;">${data.subtitle || 'La nature au service de votre bien-être.'}</p>

      <!-- Note clients -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:26px;">
        <span style="color:#4CAF50;font-size:14px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:13px;color:${C.muted};font-family:'DM Sans',sans-serif;">4.9/5 · <a href="#reviews4" style="color:${C.accent};text-decoration:none;">127 avis</a></span>
      </div>

      <!-- Prix -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap;padding:20px 22px;background:${C.accentLight};border-radius:14px;border:1px solid ${C.border};">
        ${data.price ? `<span style="font-size:40px;font-weight:800;letter-spacing:-.025em;color:${C.text};font-family:'DM Sans',sans-serif;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:${C.muted};text-decoration:line-through;font-family:'DM Sans',sans-serif;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:${C.accent};color:#fff;padding:5px 14px;border-radius:100px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;">-${savePct}%</span>` : ''}
      </div>

      <!-- Badges certifications BIO — élément unique Sage -->
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:22px;">
        <span style="display:inline-flex;align-items:center;gap:5px;background:#E8F5E9;color:${C.accent};font-size:12px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid ${C.border};font-family:'DM Sans',sans-serif;">🌿 Bio</span>
        <span style="display:inline-flex;align-items:center;gap:5px;background:#E8F5E9;color:${C.accent};font-size:12px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid ${C.border};font-family:'DM Sans',sans-serif;">🧪 Sans additifs</span>
        <span style="display:inline-flex;align-items:center;gap:5px;background:#E8F5E9;color:${C.accent};font-size:12px;font-weight:700;padding:5px 12px;border-radius:100px;border:1px solid ${C.border};font-family:'DM Sans',sans-serif;">♻️ Éco-responsable</span>
      </div>

      <!-- Description courte -->
      <p style="font-size:14px;color:${C.muted};line-height:1.85;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${C.border};font-family:'DM Sans',sans-serif;">${data.subtitle || ''}</p>

      <!-- Avantages -->
      <ul style="list-style:none;margin-bottom:28px;">
        ${benefitsHTML}
      </ul>

      <!-- CTA principal -->
      <a href="#" style="display:block;text-align:center;background:${C.accent};color:#fff;padding:17px 32px;border-radius:100px;font-size:15px;font-weight:700;text-decoration:none;margin-bottom:12px;letter-spacing:.01em;font-family:'DM Sans',sans-serif;box-shadow:0 4px 20px rgba(45,106,79,0.30);transition:opacity .2s;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
        ${data.cta || 'Commander maintenant'} →
      </a>

      <!-- CTA secondaire -->
      <a href="#" style="display:block;text-align:center;background:transparent;color:${C.accent};padding:15px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid ${C.accent};margin-bottom:22px;font-family:'DM Sans',sans-serif;transition:all .2s;" onmouseover="this.style.background='${C.accentLight}'" onmouseout="this.style.background='transparent'">
        Ajouter au panier
      </a>

      <!-- Urgence -->
      ${data.urgency ? `
      <div style="display:flex;align-items:center;gap:10px;background:#F1F8F2;border:1px solid ${C.border};border-radius:12px;padding:12px 16px;margin-bottom:24px;">
        <span style="font-size:16px;">🌱</span>
        <p style="font-size:13px;color:${C.accent};font-weight:600;font-family:'DM Sans',sans-serif;">${data.urgency}</p>
      </div>` : ''}

      <!-- Trust badges fond vert clair -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};border-radius:14px;overflow:hidden;margin-bottom:24px;">
        ${[
          ['🌿', 'Certifié bio', 'Agriculture raisonnée'],
          ['🚚', 'Livraison offerte', 'Dès 40€ d\'achat'],
          ['↩️', 'Retour 30 jours', 'Sans frais'],
        ].map(([icon, title, sub]) => `
          <div style="background:${C.accentLight};padding:14px 10px;text-align:center;">
            <div style="font-size:20px;margin-bottom:5px;">${icon}</div>
            <div style="font-size:11px;font-weight:700;color:${C.text};margin-bottom:2px;font-family:'DM Sans',sans-serif;">${title}</div>
            <div style="font-size:11px;color:${C.muted};font-family:'DM Sans',sans-serif;">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Tabs Garantie / Livraison / Support -->
      <div style="border:1px solid ${C.border};border-radius:14px;overflow:hidden;">
        <div style="display:flex;border-bottom:1px solid ${C.border};">
          ${['Garantie', 'Livraison', 'Support'].map((tab, i) => `
            <button
              onclick="document.querySelectorAll('.tp4').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb4').forEach(function(b,j){b.style.background=j===${i}?'${C.accentLight}':'transparent';b.style.color=j===${i}?'${C.accent}':'${C.muted}';b.style.fontWeight=j===${i}?'700':'500';});"
              class="tb4"
              style="flex:1;padding:13px 8px;background:${i === 0 ? C.accentLight : 'transparent'};border:none;cursor:pointer;font-size:13px;font-weight:${i === 0 ? '700' : '500'};color:${i === 0 ? C.accent : C.muted};transition:all .2s;font-family:'DM Sans',sans-serif;"
            >${tab}</button>`).join('')}
        </div>
        <div class="tp4" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;background:${C.card};font-family:'DM Sans',sans-serif;">
          Satisfait ou remboursé <strong style="color:${C.text};">sous 30 jours</strong>, sans condition. Notre produit est certifié bio et contrôlé en laboratoire indépendant. Votre santé, notre priorité.
        </div>
        <div class="tp4" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;display:none;background:${C.card};font-family:'DM Sans',sans-serif;">
          Livraison <strong style="color:${C.text};">sous 2–4 jours ouvrés</strong>. Expédition en emballage éco-responsable. Numéro de suivi par email. <strong style="color:${C.text};">Gratuit dès 40€.</strong>
        </div>
        <div class="tp4" style="padding:18px;font-size:13px;color:${C.muted};line-height:1.85;display:none;background:${C.card};font-family:'DM Sans',sans-serif;">
          Notre équipe bien-être répond <strong style="color:${C.text};">7j/7</strong> par chat et email. Conseils nutritionnels personnalisés inclus avec votre commande. Réponse sous 12h.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ FEATURES ALTERNÉES ════════════════════════════════════════════════════ -->
<div style="background:${C.card};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:64px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Caractéristiques</p>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.02em;color:${C.text};margin-bottom:14px;">${data.headline || data.product_name}</h2>
      <p style="color:${C.muted};font-size:15px;max-width:520px;margin:0 auto;font-family:'DM Sans',sans-serif;line-height:1.75;">${data.subtitle || 'Découvrez ce qui fait la différence avec une approche naturelle et responsable.'}</p>
    </div>
    ${featuresHTML}
  </div>
</div>

<!-- ═══ AVANT / APRÈS ════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Transformation</p>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.02em;color:${C.text};margin-bottom:14px;">Avant · Après</h2>
      <p style="color:${C.muted};font-size:15px;max-width:480px;margin:0 auto;font-family:'DM Sans',sans-serif;">Découvrez comment ${data.product_name} transforme le quotidien de nos clients.</p>
    </div>
    <div class="ba4" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <!-- Avant -->
      <div style="background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 2px 16px rgba(45,106,79,0.06);">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${BEFORE_IMG}" alt="Avant" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(27,58,45,0.7);color:#fff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:.06em;font-family:'DM Sans',sans-serif;">AVANT</div>
        </div>
        <div style="padding:22px;">
          <p style="font-size:15px;font-weight:700;color:${C.text};margin-bottom:8px;font-family:'DM Sans',sans-serif;">Avant notre produit</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">Manque d'énergie, troubles digestifs, alimentation déséquilibrée. Le corps peine à trouver ses ressources naturelles.</p>
        </div>
      </div>
      <!-- Après -->
      <div style="background:${C.card};border-radius:20px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 2px 16px rgba(45,106,79,0.06);">
        <div style="aspect-ratio:4/3;overflow:hidden;position:relative;">
          <img src="${AFTER_IMG}" alt="Après" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;top:14px;left:14px;background:rgba(45,106,79,0.9);color:#fff;font-size:12px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:.06em;font-family:'DM Sans',sans-serif;">APRÈS</div>
        </div>
        <div style="padding:22px;">
          <p style="font-size:15px;font-weight:700;color:${C.text};margin-bottom:8px;font-family:'DM Sans',sans-serif;">Après ${data.product_name}</p>
          <p style="font-size:14px;color:${C.muted};line-height:1.8;font-family:'DM Sans',sans-serif;">Vitalité retrouvée, digestion apaisée, alimentation naturelle et savoureuse. Le bien-être de l'intérieur se voit de l'extérieur.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ AVIS CLIENTS ═════════════════════════════════════════════════════════ -->
<div id="reviews4" style="background:${C.card};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">Témoignages</p>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.02em;color:${C.text};margin-bottom:16px;">Ce que nos clients en disent</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">
        <span style="color:#4CAF50;font-size:16px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:14px;color:${C.muted};font-family:'DM Sans',sans-serif;">4.9/5 · Plus de 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg4" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${reviewsHTML}
    </div>
  </div>
</div>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════════ -->
<div style="background:${C.bg};padding:88px 0;border-top:1px solid ${C.border};">
  <div style="max-width:720px;margin:0 auto;padding:0 24px;">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};font-family:'DM Sans',sans-serif;margin-bottom:14px;">FAQ</p>
      <h2 style="font-family:'DM Sans',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.02em;color:${C.text};">Questions fréquentes</h2>
    </div>
    ${faqHTML}
  </div>
</div>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════════ -->
<div style="background:${C.accent};padding:88px 24px;text-align:center;">
  <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);font-family:'DM Sans',sans-serif;margin-bottom:16px;">Offre naturelle</p>
  <h2 style="font-family:'DM Sans',sans-serif;font-size:38px;font-weight:800;color:#fff;letter-spacing:-.02em;margin-bottom:16px;line-height:1.15;">${data.headline || 'Prenez soin de vous naturellement'}</h2>
  <p style="color:rgba(255,255,255,.8);font-size:16px;margin-bottom:14px;max-width:480px;margin-left:auto;margin-right:auto;font-family:'DM Sans',sans-serif;line-height:1.75;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="color:rgba(255,255,255,.95);font-size:14px;font-weight:700;margin-bottom:36px;font-family:'DM Sans',sans-serif;">${data.urgency}</p>` : '<div style="margin-bottom:36px;"></div>'}
  <a href="#" style="display:inline-block;background:#fff;color:${C.accent};padding:18px 52px;border-radius:100px;font-size:16px;font-weight:800;text-decoration:none;font-family:'DM Sans',sans-serif;letter-spacing:.01em;box-shadow:0 8px 32px rgba(0,0,0,0.2);transition:transform .2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
    ${data.cta || 'Commander maintenant'} →
  </a>
  <p style="margin-top:22px;font-size:13px;color:rgba(255,255,255,.5);font-family:'DM Sans',sans-serif;">Paiement sécurisé · Livraison offerte · Retour 30 jours · 100% Bio garanti</p>
</div>

</body>
</html>`
}
