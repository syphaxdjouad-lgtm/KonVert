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
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function buildBenefits(data: LandingPageData, muted: string, accent: string): string {
  return data.benefits.slice(0, 5).map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;font-size:14px;color:${muted};">
      <span style="color:${accent};font-weight:900;flex-shrink:0;line-height:1.6;">✓</span>
      <span>${b}</span>
    </li>`).join('')
}

function buildFaq(data: LandingPageData, txt: string, muted: string, border: string, accent: string): string {
  return data.faq.map((item, i) => `
    <div style="border-bottom:1px solid ${border};">
      <button onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp').forEach(function(x){x.style.maxHeight='0';x.style.padding='0';});document.querySelectorAll('.fi').forEach(function(x){x.textContent='+';});if(!open){p.style.maxHeight='200px';p.style.padding='0 0 16px 0';this.querySelector('.fi').textContent='−';}" style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;">
        <span style="font-size:15px;font-weight:700;color:${txt};">${item.question}</span>
        <span class="fi" style="color:${accent};font-size:22px;font-weight:300;flex-shrink:0;line-height:1;">${i === 0 ? '−' : '+'}</span>
      </button>
      <div class="fp" style="max-height:${i === 0 ? '200px' : '0'};overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:${i === 0 ? '0 0 16px 0' : '0'};font-size:14px;color:${muted};line-height:1.75;">${item.answer}</div>
    </div>`).join('')
}

function buildReviews(data: LandingPageData, card: string, txt: string, muted: string): string {
  const reviews = [
    { q: data.benefits[0] || 'Produit incroyable, exactement ce que je cherchais. Livraison rapide et emballage soigné.', n: 'Alexandre M.' },
    { q: data.benefits[1] || 'Très satisfait de la qualité. Le produit est conforme à la description. Je recommande.', n: 'Sophie L.' },
    { q: data.benefits[2] || 'Je suis agréablement surpris par la qualité. Le SAV est réactif, service 5 étoiles.', n: 'Thomas R.' },
  ]
  return reviews.map(r => `
    <div style="background:${card};border-radius:14px;padding:28px;">
      <div style="color:#FFB800;font-size:14px;margin-bottom:14px;letter-spacing:3px;">★★★★★</div>
      <p style="font-size:14px;color:${muted};line-height:1.75;margin-bottom:20px;font-style:italic;">"${r.q}"</p>
      <p style="font-size:13px;font-weight:700;color:${txt};">${r.n}</p>
    </div>`).join('')
}

function buildFeatures(data: LandingPageData, bg: string, card: string, txt: string, muted: string, accent: string, isDark: boolean): string {
  const mainImg = data.images?.[0] || ''
  const feats = [
    {
      label: 'Qualité & Performance',
      title: data.benefits[0] || `${data.product_name} — Conçu pour durer`,
      desc: data.subtitle || `Chaque détail de ${data.product_name} a été pensé pour vous offrir la meilleure expérience possible.`,
    },
    {
      label: 'Confort & Praticité',
      title: data.benefits[1] || 'Pensé pour votre quotidien',
      desc: data.benefits[3] || `${data.product_name} s'adapte à votre style de vie. Simple, efficace et élégant.`,
    },
    {
      label: 'Design & Durabilité',
      title: data.benefits[2] || 'Finitions premium, résultat garanti',
      desc: data.benefits[4] || `Des matériaux sélectionnés pour un rendu premium et une durabilité optimale.`,
    },
  ]
  return feats.map((f, i) => {
    const rev = i % 2 === 1
    const imgBg = isDark ? 'rgba(255,255,255,0.04)' : (i % 2 === 0 ? bg : card)
    return `
    <div class="fr" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${rev ? 2 : 1};background:${imgBg};border-radius:16px;overflow:hidden;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;">
        ${mainImg ? `<img src="${mainImg}" alt="${f.title}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-size:64px;opacity:.15;">📦</span>`}
      </div>
      <div style="order:${rev ? 1 : 2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:14px;">${f.label}</p>
        <h3 style="font-size:22px;font-weight:800;line-height:1.3;letter-spacing:-.01em;color:${txt};margin-bottom:14px;">${f.title}</h3>
        <p style="font-size:14px;color:${muted};line-height:1.75;">${f.desc}</p>
      </div>
    </div>`
  }).join('')
}

// ─── CORE TEMPLATE BUILDER ────────────────────────────────────────────────────

function buildModernTemplate(data: LandingPageData, theme: ThemeConfig): string {
  const { accent, accentLight, accentText, bg, card, text, muted, border, isDark = false } = theme

  const mainImg = data.images?.[0] || ''
  const imgs = [...(data.images || []), '', '', ''].slice(0, 4)

  const thumbsHTML = imgs.map((img, i) => `
    <div onclick="document.getElementById('mi').src='${img || mainImg}';document.querySelectorAll('.th').forEach(function(t,j){t.style.borderColor=j===${i}?'${accent}':'transparent';});" class="th" style="border-radius:10px;overflow:hidden;aspect-ratio:1;cursor:pointer;border:2px solid ${i === 0 ? accent : 'transparent'};transition:border-color .2s;background:${isDark ? 'rgba(255,255,255,0.06)' : '#efefef'};">
      ${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;" />` : ''}
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
  @media(max-width:768px){
    .pg,.fr,.rg{grid-template-columns:1fr!important;gap:28px!important;}
    .fr>div{order:unset!important;}
    h1{font-size:26px!important;}
  }
</style>
</head>
<body>

<!-- BREADCRUMB -->
<div style="background:${card};border-bottom:1px solid ${border};">
  <div class="wrap" style="padding-top:12px;padding-bottom:12px;font-size:13px;color:${muted};">
    <a href="#" style="color:${accent};text-decoration:none;">Accueil</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <a href="#" style="color:${accent};text-decoration:none;">Boutique</a>
    <span style="margin:0 8px;opacity:.4;">›</span>
    <span>${data.product_name}</span>
  </div>
</div>

<!-- HERO PRODUCT -->
<div class="wrap">
  <div class="pg" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:44px 0 80px;align-items:start;">

    <!-- Gallery -->
    <div>
      <div style="background:${card};border-radius:18px;overflow:hidden;aspect-ratio:1;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
        ${mainImg
          ? `<img id="mi" src="${mainImg}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />`
          : `<div id="mi" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:90px;opacity:.12;">📦</div>`}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        ${thumbsHTML}
      </div>
    </div>

    <!-- Product info -->
    <div>
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${accent};margin-bottom:12px;">Nouveau</p>
      <h1 style="font-size:34px;font-weight:900;line-height:1.15;letter-spacing:-.025em;color:${text};margin-bottom:16px;">${data.product_name}</h1>
      <p style="font-size:15px;color:${muted};line-height:1.75;margin-bottom:28px;">${data.subtitle || ''}</p>

      <!-- Price -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:32px;flex-wrap:wrap;">
        ${data.price ? `<span style="font-size:40px;font-weight:900;letter-spacing:-.025em;color:${text};">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:${muted};text-decoration:line-through;">${data.original_price}€</span>` : ''}
        ${savePct > 0 ? `<span style="background:${accentLight};color:${accent};padding:5px 14px;border-radius:100px;font-size:13px;font-weight:700;">-${savePct}%</span>` : ''}
      </div>

      <!-- Benefits -->
      <ul style="list-style:none;margin-bottom:32px;">
        ${buildBenefits(data, muted, accent)}
      </ul>

      <!-- CTA primary -->
      <a href="#" style="display:block;text-align:center;background:${accent};color:${accentText};padding:16px 32px;border-radius:100px;font-size:15px;font-weight:700;text-decoration:none;margin-bottom:12px;letter-spacing:.01em;transition:opacity .2s;" onmouseover="this.style.opacity='.87'" onmouseout="this.style.opacity='1'">
        ${data.cta || 'Commander maintenant'}
      </a>
      <!-- CTA secondary -->
      <a href="#" style="display:block;text-align:center;background:transparent;color:${text};padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid ${border};margin-bottom:20px;transition:border-color .2s;" onmouseover="this.style.borderColor='${accent}'" onmouseout="this.style.borderColor='${border}'">
        Ajouter au panier
      </a>

      ${data.urgency ? `<p style="text-align:center;font-size:13px;color:${muted};margin-bottom:28px;">${data.urgency}</p>` : ''}

      <!-- Trust badges -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);background:${border};border:1px solid ${border};border-radius:14px;overflow:hidden;gap:1px;margin-bottom:24px;">
        ${[['🚚', 'Livraison offerte', 'Dès 50€ d\'achat'], ['🔒', 'Paiement sécurisé', 'Crypté SSL'], ['↩️', 'Retour 30 jours', 'Sans frais']].map(([icon, title, sub]) => `
          <div style="background:${card};padding:16px 10px;text-align:center;">
            <div style="font-size:18px;margin-bottom:6px;">${icon}</div>
            <div style="font-size:11px;font-weight:700;color:${text};margin-bottom:2px;">${title}</div>
            <div style="font-size:11px;color:${muted};">${sub}</div>
          </div>`).join('')}
      </div>

      <!-- Info tabs -->
      <div style="border:1px solid ${border};border-radius:14px;overflow:hidden;">
        <div style="display:flex;border-bottom:1px solid ${border};">
          ${['Garantie', 'Livraison', 'Support'].map((tab, i) => `
            <button onclick="document.querySelectorAll('.tp').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb').forEach(function(b,j){b.style.background=j===${i}?'${accentLight}':'transparent';b.style.color=j===${i}?'${accent}':'${muted}';});" class="tb" style="flex:1;padding:13px 8px;background:${i === 0 ? accentLight : 'transparent'};border:none;cursor:pointer;font-size:13px;font-weight:600;color:${i === 0 ? accent : muted};transition:all .2s;font-family:inherit;">
              ${tab}
            </button>`).join('')}
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.75;background:${card};">
          Nos produits sont garantis 1 an. En cas de défaut de fabrication, nous remplaçons ou remboursons sans frais.
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.75;display:none;background:${card};">
          Livraison en 2–4 jours ouvrés. Expédition le jour même si commande avant 14h. Suivi inclus par email.
        </div>
        <div class="tp" style="padding:18px;font-size:13px;color:${muted};line-height:1.75;display:none;background:${card};">
          Notre équipe est disponible 7j/7 par email et chat. Réponse garantie sous 24h. Satisfaction assurée.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FEATURES SECTION -->
<div style="background:${card};padding:80px 0;">
  <div class="wrap">
    <h2 style="text-align:center;font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:12px;">${data.headline || data.product_name}</h2>
    <p style="text-align:center;color:${muted};font-size:15px;max-width:540px;margin:0 auto 60px;">${data.subtitle || 'Découvrez ce qui fait de ce produit un choix unique.'}</p>
    ${buildFeatures(data, bg, card, text, muted, accent, isDark)}
  </div>
</div>

<!-- REVIEWS SECTION -->
<div style="background:${bg};padding:80px 0;">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:48px;">
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:10px;">Ce que disent nos clients</h2>
      <p style="color:${muted};font-size:15px;">Des milliers de clients satisfaits — avis vérifiés.</p>
    </div>
    <div class="rg" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      ${buildReviews(data, card, text, muted)}
    </div>
  </div>
</div>

<!-- FAQ SECTION -->
<div style="background:${card};padding:80px 0;">
  <div class="wrap">
    <div style="max-width:680px;margin:0 auto;">
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.025em;color:${text};margin-bottom:48px;text-align:center;">Questions fréquentes</h2>
      ${buildFaq(data, text, muted, border, accent)}
    </div>
  </div>
</div>

<!-- CTA FINAL -->
<div style="background:${accent};padding:80px 24px;text-align:center;">
  <h2 style="font-size:34px;font-weight:900;color:${accentText};letter-spacing:-.025em;margin-bottom:14px;">${data.headline || 'Prêt à commander ?'}</h2>
  <p style="color:${accentText};opacity:.75;font-size:16px;margin-bottom:36px;max-width:480px;margin-left:auto;margin-right:auto;">${data.urgency || 'Livraison rapide · Paiement sécurisé · Satisfait ou remboursé'}</p>
  <a href="#" style="display:inline-block;background:${accentText};color:${accent};padding:16px 44px;border-radius:100px;font-size:16px;font-weight:800;text-decoration:none;letter-spacing:.01em;">
    ${data.cta || 'Commander maintenant'} →
  </a>
  <p style="margin-top:18px;font-size:13px;color:${accentText};opacity:.5;">Paiement sécurisé · Livraison offerte · Retour 30 jours</p>
</div>

</body>
</html>`
}

// ─── TEMPLATE 1 — ETEC BLUE (Tech · Modern · Universel) ──────────────────────

export function templateEtecBlue(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#0057FF',
    accentLight: '#DEE8FF',
    accentText:  '#FFFFFF',
    bg:          '#F9F9F9',
    card:        '#FFFFFF',
    text:        '#191919',
    muted:       '#6B6B6B',
    border:      '#E8E8E8',
  })
}

// ─── TEMPLATE 2 — ETEC NOIR (Dark · Premium · Élégant) ───────────────────────

export function templateEtecNoir(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#FFFFFF',
    accentLight: 'rgba(255,255,255,0.08)',
    accentText:  '#0D0D0D',
    bg:          '#0D0D0D',
    card:        '#181818',
    text:        '#F2F2F2',
    muted:       '#888888',
    border:      '#2A2A2A',
    isDark:      true,
  })
}

// ─── TEMPLATE 3 — ETEC ROSE (Beauté · Makeup · Skincare) ─────────────────────

export function templateEtecRose(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#E91E8C',
    accentLight: '#FFE4F4',
    accentText:  '#FFFFFF',
    bg:          '#FFF9FC',
    card:        '#FFFFFF',
    text:        '#1A0A12',
    muted:       '#8B5A72',
    border:      '#F0D6E6',
  })
}

// ─── TEMPLATE 4 — ETEC SAGE (Organic · Bio · Bien-être) ──────────────────────

export function templateEtecSage(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#1E6B3C',
    accentLight: '#D4EDDA',
    accentText:  '#FFFFFF',
    bg:          '#F4F8F4',
    card:        '#FFFFFF',
    text:        '#0F1E14',
    muted:       '#5A7A62',
    border:      '#D8ECD8',
  })
}

// ─── TEMPLATE 5 — ETEC GOLD (Luxe · Haute Gamme · Édition Limitée) ───────────

export function templateEtecGold(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#C8971C',
    accentLight: 'rgba(200,151,28,0.12)',
    accentText:  '#0C0A06',
    bg:          '#0C0A06',
    card:        '#161309',
    text:        '#F0E8D0',
    muted:       '#8A7E60',
    border:      '#2A2410',
    isDark:      true,
  })
}

// ─── TEMPLATE 6 — ETEC ENERGY (Sport · Fitness · Action) ─────────────────────

export function templateEtecEnergy(data: LandingPageData): string {
  return buildModernTemplate(data, {
    accent:      '#FF4500',
    accentLight: '#FFE8E0',
    accentText:  '#FFFFFF',
    bg:          '#F9F9F9',
    card:        '#FFFFFF',
    text:        '#191919',
    muted:       '#6B6B6B',
    border:      '#E8E8E8',
  })
}

// ─── BACKWARD COMPAT ALIASES (anciens IDs) ────────────────────────────────────

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
  {
    id: 'etec-blue',
    name: 'ETEC Blue',
    category: 'modern' as const,
    fn: templateEtecBlue,
    label: 'Tech · Moderne · Universel',
    accent: '#0057FF',
    badge: 'Populaire',
  },
  {
    id: 'etec-noir',
    name: 'ETEC Noir',
    category: 'dark' as const,
    fn: templateEtecNoir,
    label: 'Premium · Élégant · Dark',
    accent: '#FFFFFF',
    badge: '',
  },
  {
    id: 'etec-rose',
    name: 'ETEC Rose',
    category: 'beauty' as const,
    fn: templateEtecRose,
    label: 'Beauté · Makeup · Skincare',
    accent: '#E91E8C',
    badge: 'Top conversion',
  },
  {
    id: 'etec-sage',
    name: 'ETEC Sage',
    category: 'organic' as const,
    fn: templateEtecSage,
    label: 'Organic · Bio · Bien-être',
    accent: '#1E6B3C',
    badge: '',
  },
  {
    id: 'etec-gold',
    name: 'ETEC Gold',
    category: 'luxury' as const,
    fn: templateEtecGold,
    label: 'Luxe · Haute Gamme · Or',
    accent: '#C8971C',
    badge: 'Exclusif',
  },
  {
    id: 'etec-energy',
    name: 'ETEC Energy',
    category: 'sport' as const,
    fn: templateEtecEnergy,
    label: 'Sport · Fitness · Action',
    accent: '#FF4500',
    badge: 'Nouveau',
  },
]

// ─── RENDER FUNCTION ──────────────────────────────────────────────────────────

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    // New ETEC templates
    case 'etec-blue':    return templateEtecBlue(data)
    case 'etec-noir':    return templateEtecNoir(data)
    case 'etec-rose':    return templateEtecRose(data)
    case 'etec-sage':    return templateEtecSage(data)
    case 'etec-gold':    return templateEtecGold(data)
    case 'etec-energy':  return templateEtecEnergy(data)
    // Legacy aliases
    case 'minimal-dark':    return templateEtecNoir(data)
    case 'clean-white':     return templateEtecBlue(data)
    case 'bold-sales':
    case 'bold-orange':     return templateEtecEnergy(data)
    case 'luxury':
    case 'luxe-noir':       return templateEtecGold(data)
    case 'mobile-first':    return templateEtecBlue(data)
    case 'shein-pro':       return templateEtecRose(data)
    case 'sportif-energie': return templateEtecEnergy(data)
    case 'natural-organic': return templateEtecSage(data)
    case 'tech-gadget':     return templateEtecBlue(data)
    case 'beauty-studio':   return templateEtecRose(data)
    case 'home-deco':       return templateEtecSage(data)
    case 'kids-colorful':   return templateEtecEnergy(data)
    case 'foodie-gourmet':  return templateEtecEnergy(data)
    case 'travel-nomad':    return templateEtecBlue(data)
    case 'automotive-pro':  return templateEtecNoir(data)
    case 'gaming-zone':     return templateEtecNoir(data)
    case 'pet-love':        return templateEtecRose(data)
    case 'premium-glass':   return templateEtecGold(data)
    default:                return templateEtecBlue(data)
  }
}
