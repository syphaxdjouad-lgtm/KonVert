import type { LandingPageData } from '@/types'

// ─── THEME CONFIG ─────────────────────────────────────────────────────────────

interface ThemeConfig {
  accent: string
  accentLight: string
  accentText: string
  bg: string
  card: string
  text: string
  muted: string
  border: string
  isDark?: boolean
  fallbackImages: string[]
  beforeImg: string
  afterImg: string
}

// ─── SHARED SECTION BUILDERS ──────────────────────────────────────────────────

function secBenefits(data: LandingPageData, muted: string, accent: string): string {
  return data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;font-size:14px;color:${muted};">
      <span style="width:20px;height:20px;border-radius:50%;background:${accent};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;margin-top:1px;">✓</span>
      <span>${b}</span>
    </li>`).join('')
}

function secFaq(data: LandingPageData, txt: string, muted: string, border: string, accent: string): string {
  return data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${border};">
      <button onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='200px';p.style.padding='0 0 16px 0';this.querySelector('.fi').textContent='−';}" style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;">
        <span style="font-size:15px;font-weight:700;color:${txt};">${item.question}</span>
        <span class="fi" style="color:${accent};font-size:22px;font-weight:300;flex-shrink:0;line-height:1;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div class="fp" style="max-height:${i === 0 ? '200px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 16px 0' : '0'};font-size:14px;color:${muted};line-height:1.8;">${item.answer}</div>
    </div>`).join('')
}

function secReviews(card: string, txt: string, muted: string, border: string): string {
  const reviews = [
    {
      stars: '★★★★★',
      text: 'Franchement bluffant. Le produit dépasse mes attentes — la qualité est là, la livraison était rapide et le service client a répondu en moins d\'une heure. Je recommande sans hésiter.',
      name: 'Alexandre M.',
      date: 'Il y a 3 jours',
      verified: true,
    },
    {
      stars: '★★★★★',
      text: 'J\'hésitais à commander mais après avoir vu les avis j\'ai sauté le pas. Vraiment contente ! Le produit est exactement comme décrit, bien emballé et livré en 2 jours. Top !',
      name: 'Sophie L.',
      date: 'Il y a 1 semaine',
      verified: true,
    },
    {
      stars: '★★★★☆',
      text: 'Très bon produit, rapport qualité/prix imbattable. J\'ai commandé pour faire un cadeau et la personne était ravie. Seul petit bémol : l\'emballage était légèrement froissé mais le produit impeccable.',
      name: 'Thomas R.',
      date: 'Il y a 2 semaines',
      verified: true,
    },
  ]
  return reviews.map(r => `
    <div style="background:${card};border-radius:16px;padding:28px;border:1px solid ${border};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <span style="color:#FFB800;font-size:15px;letter-spacing:2px;">${r.stars}</span>
        ${r.verified ? `<span style="font-size:11px;color:#16a34a;font-weight:600;background:#dcfce7;padding:3px 8px;border-radius:20px;">✓ Achat vérifié</span>` : ''}
      </div>
      <p style="font-size:14px;color:${muted};line-height:1.8;margin-bottom:18px;">"${r.text}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:${card === '#ffffff' || card === '#FFFFFF' ? '#e5e7eb' : 'rgba(255,255,255,0.1)'};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${txt};">${r.name[0]}</div>
        <div>
          <p style="font-size:13px;font-weight:700;color:${txt};">${r.name}</p>
          <p style="font-size:11px;color:${muted};">${r.date}</p>
        </div>
      </div>
    </div>`).join('')
}

function secHowItWorks(txt: string, muted: string, accent: string, accentLight: string, card: string, border: string): string {
  const steps = [
    { n: '01', title: 'Entrez l\'URL de votre produit', desc: 'Collez simplement le lien de votre produit Shopify, AliExpress ou Amazon. Notre IA analyse tout automatiquement.' },
    { n: '02', title: 'L\'IA génère votre page', desc: 'En 30 secondes, KONVERT crée un copy optimisé, structure les sections et adapte le design à votre niche.' },
    { n: '03', title: 'Publiez et convertissez', desc: 'Exportez ou connectez directement à votre boutique. Vos visiteurs passent à l\'action dès la première visite.' },
  ]
  return steps.map((s, i) => `
    <div style="text-align:center;padding:32px 24px;background:${card};border-radius:16px;border:1px solid ${border};position:relative;">
      ${i < 2 ? `<div style="position:absolute;top:50%;right:-20px;transform:translateY(-50%);font-size:20px;color:${muted};z-index:2;display:none;" class="arrow-step">→</div>` : ''}
      <div style="width:52px;height:52px;border-radius:50%;background:${accentLight};color:${accent};font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        ${s.n}
      </div>
      <h4 style="font-size:16px;font-weight:800;color:${txt};margin-bottom:10px;line-height:1.3;">${s.title}</h4>
      <p style="font-size:13px;color:${muted};line-height:1.7;">${s.desc}</p>
    </div>`).join('')
}

function secBeforeAfter(beforeImg: string, afterImg: string, txt: string, muted: string, card: string, border: string): string {
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="ba-grid">
    <div style="background:${card};border-radius:16px;overflow:hidden;border:1px solid ${border};">
      <div style="background:#f3f4f6;aspect-ratio:4/3;overflow:hidden;position:relative;">
        <img src="${beforeImg}" alt="Avant" style="width:100%;height:100%;object-fit:cover;" />
        <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:.05em;">AVANT</div>
      </div>
      <div style="padding:20px;">
        <p style="font-size:14px;font-weight:700;color:${txt};margin-bottom:6px;">Avant notre produit</p>
        <p style="font-size:13px;color:${muted};line-height:1.7;">Résultats limités, effort constant, frustration garantie. Vous avancez mais vous stagnez.</p>
      </div>
    </div>
    <div style="background:${card};border-radius:16px;overflow:hidden;border:1px solid ${border};">
      <div style="background:#f0fdf4;aspect-ratio:4/3;overflow:hidden;position:relative;">
        <img src="${afterImg}" alt="Après" style="width:100%;height:100%;object-fit:cover;" />
        <div style="position:absolute;top:12px;left:12px;background:rgba(22,163,74,0.9);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:.05em;">APRÈS</div>
      </div>
      <div style="padding:20px;">
        <p style="font-size:14px;font-weight:700;color:${txt};margin-bottom:6px;">Après notre produit</p>
        <p style="font-size:13px;color:${muted};line-height:1.7;">Résultats visibles dès les premières utilisations. Performance décuplée, confiance retrouvée.</p>
      </div>
    </div>
  </div>`
}

function secFeatures(data: LandingPageData, imgs: string[], txt: string, muted: string, accent: string, bg: string, card: string, border: string): string {
  const feats = [
    {
      label: 'Performance & Qualité',
      title: data.benefits[0] || `${data.product_name} — Conçu pour durer`,
      desc: data.subtitle || `Chaque détail de ${data.product_name} a été pensé pour vous offrir la meilleure expérience possible.`,
      img: imgs[0] || imgs[0],
    },
    {
      label: 'Confort au quotidien',
      title: data.benefits[1] || 'Pensé pour s\'adapter à votre vie',
      desc: data.benefits[3] || `Une utilisation simple et intuitive. ${data.product_name} s'intègre parfaitement dans votre routine sans effort.`,
      img: imgs[1] || imgs[0],
    },
    {
      label: 'Design & Durabilité',
      title: data.benefits[2] || 'Finitions premium, résultat garanti',
      desc: data.benefits[4] || `Des matériaux premium sélectionnés pour leur résistance. Conçu pour durer dans le temps et garder son aspect comme au premier jour.`,
      img: imgs[2] || imgs[0],
    },
  ]
  return feats.map((f, i) => {
    const rev = i % 2 === 1
    const imgBg = i % 2 === 0 ? bg : card
    return `
    <div class="feat-row" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${rev ? 2 : 1};background:${imgBg};border-radius:20px;overflow:hidden;aspect-ratio:4/3;border:1px solid ${border};">
        <img src="${f.img}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="order:${rev ? 1 : 2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:14px;">${f.label}</p>
        <h3 style="font-size:24px;font-weight:800;line-height:1.25;letter-spacing:-.015em;color:${txt};margin-bottom:16px;">${f.title}</h3>
        <p style="font-size:15px;color:${muted};line-height:1.8;">${f.desc}</p>
      </div>
    </div>`
  }).join('')
}

// ─── CORE TEMPLATE BUILDER ────────────────────────────────────────────────────

function buildModernTemplate(data: LandingPageData, theme: ThemeConfig): string {
  const { accent, accentLight, accentText, bg, card, text, muted, border, isDark = false, fallbackImages, beforeImg, afterImg } = theme

  const imgs = (data.images && data.images.length > 0)
    ? [...data.images, ...fallbackImages].slice(0, 4)
    : fallbackImages.slice(0, 4)

  const mainImg = imgs[0]

  const thumbsHTML = imgs.map((img, i) => `
    <div onclick="document.getElementById('mi').src='${img}';document.querySelectorAll('.th').forEach(function(t,j){t.style.borderColor=j===${i}?'${accent}':'transparent';t.style.opacity=j===${i}?'1':'.65';});" class="th" style="border-radius:10px;overflow:hidden;aspect-ratio:1;cursor:pointer;border:2px solid ${i === 0 ? accent : 'transparent'};transition:all .2s;opacity:${i === 0 ? '1' : '.65'};">
      <img src="${img}" style="width:100%;height:100%;object-fit:cover;" />
    </div>`).join('')

  const savePct = data.price && data.original_price
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.original_price)) * 100)
    : 0

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${bg};color:${text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;line-height:1.6;font-size:15px;}
  .wrap{max-width:1100px;margin:0 auto;padding:0 24px;}
  img{display:block;}
  @media(max-width:768px){
    .pg,.feat-row,.rg,.ba-grid,.hiw{grid-template-columns:1fr!important;gap:24px!important;}
    .feat-row>div{order:unset!important;}
    h1{font-size:26px!important;}
    .arrow-step{display:none!important;}
  }
</style>
</head>
<body>

<!-- ═══ BREADCRUMB ═══════════════════════════════════════════════════════════ -->
<div style="background:${card};border-bottom:1px solid ${border};">
  <div class="wrap" style="padding-top:12px;padding-bottom:12px;font-size:13px;color:${muted};">
    <a href="#" style="color:${accent};text-decoration:none;">Accueil</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <a href="#" style="color:${accent};text-decoration:none;">Boutique</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <span>${data.product_name}</span>
  </div>
</div>

<!-- ═══ HERO PRODUIT ═════════════════════════════════════════════════════════ -->
<div class="wrap">
  <div class="pg" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:44px 0 80px;align-items:start;">

    <!-- Galerie -->
    <div>
      <div style="background:${card};border-radius:20px;overflow:hidden;aspect-ratio:1;border:1px solid ${border};margin-bottom:12px;">
        <img id="mi" src="${mainImg}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>

    <!-- Infos produit -->
    <div>
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Nouveau · Tendance</p>
      <h1 style="font-size:34px;font-weight:900;line-height:1.15;letter-spacing:-.025em;color:${text};margin-bottom:16px;">${data.product_name}</h1>
      <p style="font-size:15px;color:${muted};line-height:1.8;margin-bottom:8px;">${data.subtitle || ''}</p>

      <!-- Note clients -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
        <span style="color:#FFB800;font-size:14px;letter-spacing:2px;">★★★★★</span>
        <span style="font-size:13px;color:${muted};">4.9/5 · <a href="#reviews" style="color:${accent};text-decoration:none;">127 avis</a></span>
      </div>

      <!-- Prix -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:32px;flex-wrap:wrap;padding:20px;background:${accentLight};border-radius:14px;">
        ${data.price ? `<span style="font-size:40px;font-weight:900;letter-spacing:-.025em;color:${text};">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:${muted};text-decoration:line-through;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:${accent};color:${accentText};padding:5px 14px;border-radius:100px;font-size:13px;font-weight:700;">-${savePct}%</span>` : ''}
      </div>

      <!-- Description courte -->
      <p style="font-size:14px;color:${muted};line-height:1.8;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${border};">${data.subtitle || ''}</p>

      <!-- Avantages -->
      <ul style="list-style:none;margin-bottom:32px;">
        ${secBenefits(data, muted, accent)}
      </ul>

      <!-- CTA principal -->
      <a href="#" style="display:block;text-align:center;background:${accent};color:${accentText};padding:17px 32px;border-radius:100px;font-size:15px;font-weight:800;text-decoration:none;margin-bottom:12px;letter-spacing:.01em;transition:opacity .2s;" onmouseover="this.style.opacity='.87'" onmouseout="this.style.opacity='1'">
        ${data.cta || 'Commander maintenant'}
      </a>
      <!-- CTA secondaire -->
      <a href="#" style="display:block;text-align:center;background:transparent;color:${text};padding:15px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid ${border};margin-bottom:20px;transition:border-color .2s;" onmouseover="this.style.borderColor='${accent}'" onmouseout="this.style.borderColor='${border}'">
        Ajouter au panier
      </a>

      ${data.urgency ? `
      <div style="display:flex;align-items:center;gap:8px;background:${isDark ? 'rgba(255,255,255,0.05)' : '#fff7ed'};border:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#fed7aa'};border-radius:10px;padding:12px 16px;margin-bottom:24px;">
        <span style="font-size:16px;">⚡</span>
        <p style="font-size:13px;color:${isDark ? '#fbbf24' : '#c2410c'};font-weight:600;">${data.urgency}</p>
      </div>` : ''}

      <!-- Trust badges -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);background:${border};border:1px solid ${border};border-radius:14px;overflow:hidden;gap:1px;margin-bottom:24px;">
        ${[
          ['🚚', 'Livraison offerte', 'Dès 50€ d\'achat'],
          ['🔒', 'Paiement sécurisé', 'SSL 256-bit'],
          ['↩️', 'Retour 30 jours', 'Sans frais'],
        ].map(([icon, title, sub]) => `
          <div style="background:${card};padding:14px 10px;text-align:center;">
            <div style="font-size:20px;margin-bottom:5px;">${icon}</div>
            <div style="font-size:11px;font-weight:700;color:${text};margin-bottom:2px;">${title}</div>
            <div style="font-size:11px;color:${muted};">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Tabs info -->
      <div style="border:1px solid ${border};border-radius:14px;overflow:hidden;">
        <div style="display:flex;border-bottom:1px solid ${border};">
          ${['Garantie', 'Livraison', 'Support'].map((tab, i) => `
            <button onclick="document.querySelectorAll('.tp').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb').forEach(function(b,j){b.style.background=j===${i}?'${accentLight}':'transparent';b.style.color=j===${i}?'${accent}':'${muted}';b.style.fontWeight=j===${i}?'700':'500';});" class="tb" style="flex:1;padding:13px 8px;background:${i === 0 ? accentLight : 'transparent'};border:none;cursor:pointer;font-size:13px;font-weight:${i === 0 ? '700' : '500'};color:${i === 0 ? accent : muted};transition:all .2s;font-family:inherit;">
              ${tab}
            </button>`).join('')}
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.8;background:${card};">
          Tous nos produits sont garantis <strong style="color:${text};">1 an pièces et main d'œuvre</strong>. En cas de défaut de fabrication, nous remplaçons ou remboursons intégralement sans frais supplémentaires.
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.8;display:none;background:${card};">
          Livraison <strong style="color:${text};">2–4 jours ouvrés</strong>. Expédition le jour même si commande avant 14h. Numéro de suivi envoyé par email. Livraison offerte dès 50€.
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.8;display:none;background:${card};">
          Notre équipe est disponible <strong style="color:${text};">7j/7 par email et chat</strong>. Réponse garantie sous 24h. Satisfaction client assurée ou remboursement complet.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══ COMMENT ÇA MARCHE ════════════════════════════════════════════════════ -->
<div style="background:${card};padding:80px 0;border-top:1px solid ${border};border-bottom:1px solid ${border};">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:52px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Processus</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:12px;">Comment ça marche ?</h2>
      <p style="color:${muted};font-size:15px;max-width:480px;margin:0 auto;">Simple, rapide, efficace. Résultats visibles dès la première utilisation.</p>
    </div>
    <div class="hiw" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative;">
      ${secHowItWorks(text, muted, accent, accentLight, card, border)}
    </div>
  </div>
</div>

<!-- ═══ FONCTIONNEMENT DÉTAILLÉ (FEATURES) ══════════════════════════════════ -->
<div style="background:${bg};padding:80px 0;">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:60px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Caractéristiques</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:12px;">${data.headline || data.product_name}</h2>
      <p style="color:${muted};font-size:15px;max-width:540px;margin:0 auto;">${data.subtitle || 'Découvrez ce qui fait de ce produit un choix unique sur le marché.'}</p>
    </div>
    ${secFeatures(data, imgs, text, muted, accent, bg, card, border)}
  </div>
</div>

<!-- ═══ AVANT / APRÈS ════════════════════════════════════════════════════════ -->
<div style="background:${card};padding:80px 0;border-top:1px solid ${border};border-bottom:1px solid ${border};">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Transformation</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:12px;">Avant / Après</h2>
      <p style="color:${muted};font-size:15px;max-width:480px;margin:0 auto;">Des milliers de clients ont transformé leur quotidien avec ${data.product_name}.</p>
    </div>
    ${secBeforeAfter(beforeImg, afterImg, text, muted, card, border)}
  </div>
</div>

<!-- ═══ AVIS CLIENTS ═════════════════════════════════════════════════════════ -->
<div id="reviews" style="background:${bg};padding:80px 0;">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Témoignages</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:12px;">Ce que disent nos clients</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;">
        <span style="color:#FFB800;font-size:16px;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:14px;color:${muted};">4.9/5 · Plus de 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${secReviews(card, text, muted, border)}
    </div>
  </div>
</div>

<!-- ═══ FAQ ══════════════════════════════════════════════════════════════════ -->
<div style="background:${card};padding:80px 0;border-top:1px solid ${border};">
  <div class="wrap">
    <div style="max-width:720px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:52px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">FAQ</p>
        <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};">Questions fréquentes</h2>
      </div>
      ${secFaq(data, text, muted, border, accent)}
    </div>
  </div>
</div>

<!-- ═══ CTA FINAL ════════════════════════════════════════════════════════════ -->
<div style="background:${accent};padding:80px 24px;text-align:center;">
  <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accentText};opacity:.6;margin-bottom:16px;">Offre limitée</p>
  <h2 style="font-size:36px;font-weight:900;color:${accentText};letter-spacing:-.025em;margin-bottom:16px;line-height:1.2;">${data.headline || 'Prêt à passer à l\'action ?'}</h2>
  <p style="color:${accentText};opacity:.75;font-size:16px;margin-bottom:12px;max-width:480px;margin-left:auto;margin-right:auto;">${data.subtitle || ''}</p>
  ${data.urgency ? `<p style="color:${accentText};opacity:.9;font-size:14px;font-weight:700;margin-bottom:32px;">${data.urgency}</p>` : '<div style="margin-bottom:32px;"></div>'}
  <a href="#" style="display:inline-block;background:${accentText};color:${accent};padding:17px 48px;border-radius:100px;font-size:16px;font-weight:800;text-decoration:none;letter-spacing:.01em;transition:transform .2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
    ${data.cta || 'Commander maintenant'} →
  </a>
  <p style="margin-top:20px;font-size:13px;color:${accentText};opacity:.45;">Paiement sécurisé · Livraison offerte · Retour 30 jours · Satisfait ou remboursé</p>
</div>

</body>
</html>`
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

// ETEC BLUE — Tech · Moderne · Universel
export function templateEtecBlue(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#0057FF', accentLight: '#DEE8FF', accentText: '#FFFFFF',
    bg: '#F9F9F9', card: '#FFFFFF', text: '#191919', muted: '#6B6B6B', border: '#E8E8E8',
    fallbackImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80',
  })
}

// ETEC NOIR — Dark · Premium · Élégant
export function templateEtecNoir(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#E0E0E0', accentLight: 'rgba(255,255,255,0.07)', accentText: '#0D0D0D',
    bg: '#0D0D0D', card: '#181818', text: '#F2F2F2', muted: '#888888', border: '#2A2A2A',
    isDark: true,
    fallbackImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  })
}

// ETEC ROSE — Beauté · Makeup · Skincare
export function templateEtecRose(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#E91E8C', accentLight: '#FFE4F4', accentText: '#FFFFFF',
    bg: '#FFF9FC', card: '#FFFFFF', text: '#1A0A12', muted: '#8B5A72', border: '#F0D6E6',
    fallbackImages: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
      'https://images.unsplash.com/photo-1574181611642-1b9dd7b71c00?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
  })
}

// ETEC SAGE — Organic · Bio · Bien-être
export function templateEtecSage(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#1E6B3C', accentLight: '#D4EDDA', accentText: '#FFFFFF',
    bg: '#F4F8F4', card: '#FFFFFF', text: '#0F1E14', muted: '#5A7A62', border: '#D8ECD8',
    fallbackImages: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
      'https://images.unsplash.com/photo-1509803874385-db7a23559082?w=800&q=80',
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  })
}

// ETEC GOLD — Luxe · Haute Gamme · Or
export function templateEtecGold(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#C8971C', accentLight: 'rgba(200,151,28,0.13)', accentText: '#0C0A06',
    bg: '#0C0A06', card: '#161309', text: '#F0E8D0', muted: '#8A7E60', border: '#2A2410',
    isDark: true,
    fallbackImages: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
  })
}

// ETEC ENERGY — Sport · Fitness · Action
export function templateEtecEnergy(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent: '#FF4500', accentLight: '#FFE8E0', accentText: '#FFFFFF',
    bg: '#F9F9F9', card: '#FFFFFF', text: '#191919', muted: '#6B6B6B', border: '#E8E8E8',
    fallbackImages: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    ],
    beforeImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    afterImg:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  })
}

// ─── BACKWARD COMPAT ALIASES ──────────────────────────────────────────────────

export const templateMinimalDark    = templateEtecNoir
export const templateCleanWhite     = templateEtecBlue
export const templateBoldSales      = templateEtecEnergy
export const templateLuxury         = templateEtecGold
export const templateMobileFirst    = templateEtecBlue
export const templateSheinPro       = templateEtecRose
export const templateSportifEnergie = templateEtecEnergy
export const templateNaturalOrganic = templateEtecSage
export const templateTechGadget     = templateEtecBlue
export const templateBeautyStudio   = templateEtecRose
export const templateHomeDeco       = templateEtecSage
export const templateKidsColorful   = templateEtecEnergy
export const templateFoodieGourmet  = templateEtecEnergy
export const templateTravelNomad    = templateEtecBlue
export const templateAutomotivePro  = templateEtecNoir
export const templateGamingZone     = templateEtecNoir
export const templatePetLove        = templateEtecRose
export const templatePremiumGlass   = templateEtecGold

// ─── TEMPLATES REGISTRY ───────────────────────────────────────────────────────

export const TEMPLATES = [
  { id: 'etec-blue',   name: 'ETEC Blue',   category: 'modern'  as const, fn: templateEtecBlue,   label: 'Tech · Moderne · Universel',     accent: '#0057FF', badge: 'Populaire'     },
  { id: 'etec-noir',   name: 'ETEC Noir',   category: 'dark'    as const, fn: templateEtecNoir,   label: 'Premium · Élégant · Dark',       accent: '#E0E0E0', badge: ''              },
  { id: 'etec-rose',   name: 'ETEC Rose',   category: 'beauty'  as const, fn: templateEtecRose,   label: 'Beauté · Makeup · Skincare',     accent: '#E91E8C', badge: 'Top conversion' },
  { id: 'etec-sage',   name: 'ETEC Sage',   category: 'organic' as const, fn: templateEtecSage,   label: 'Organic · Bio · Bien-être',      accent: '#1E6B3C', badge: ''              },
  { id: 'etec-gold',   name: 'ETEC Gold',   category: 'luxury'  as const, fn: templateEtecGold,   label: 'Luxe · Haute Gamme · Or',        accent: '#C8971C', badge: 'Exclusif'      },
  { id: 'etec-energy', name: 'ETEC Energy', category: 'sport'   as const, fn: templateEtecEnergy, label: 'Sport · Fitness · Action',       accent: '#FF4500', badge: 'Nouveau'       },
]

// ─── RENDER ───────────────────────────────────────────────────────────────────

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    case 'etec-blue':       return templateEtecBlue(data)
    case 'etec-noir':       return templateEtecNoir(data)
    case 'etec-rose':       return templateEtecRose(data)
    case 'etec-sage':       return templateEtecSage(data)
    case 'etec-gold':       return templateEtecGold(data)
    case 'etec-energy':     return templateEtecEnergy(data)
    case 'minimal-dark':
    case 'gaming-zone':
    case 'automotive-pro':  return templateEtecNoir(data)
    case 'clean-white':
    case 'mobile-first':
    case 'tech-gadget':
    case 'travel-nomad':    return templateEtecBlue(data)
    case 'bold-sales':
    case 'bold-orange':
    case 'sportif-energie':
    case 'kids-colorful':
    case 'foodie-gourmet':  return templateEtecEnergy(data)
    case 'luxury':
    case 'luxe-noir':
    case 'premium-glass':   return templateEtecGold(data)
    case 'shein-pro':
    case 'beauty-studio':
    case 'pet-love':        return templateEtecRose(data)
    case 'natural-organic':
    case 'home-deco':       return templateEtecSage(data)
    default:                return templateEtecBlue(data)
  }
}
