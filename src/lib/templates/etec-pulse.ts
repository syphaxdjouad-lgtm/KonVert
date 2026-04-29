import type { LandingPageData } from '@/types'

// ─── FALLBACK IMAGES ──────────────────────────────────────────────────────────

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
  'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
]

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────

const C = {
  bg:        '#080B12',
  surface:   '#0D1117',
  surfaceAlt:'#111827',
  cyan:      '#00D4FF',
  cyanDim:   'rgba(0,212,255,0.12)',
  cyanGlow:  'rgba(0,212,255,0.35)',
  violet:    '#7B2FBE',
  violetDim: 'rgba(123,47,190,0.15)',
  violetGlow:'rgba(123,47,190,0.4)',
  white:     '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.55)',
  border:    'rgba(0,212,255,0.18)',
  borderSub: 'rgba(255,255,255,0.07)',
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

const ICON_CHECK  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_X      = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
const ICON_STAR   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const ICON_BOLT   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
const ICON_SHIELD = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const ICON_TRUCK  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
const ICON_CHIP   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`
const ICON_WIFI   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`
const ICON_PLUS   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_ZAP    = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
const ICON_ROTATE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>`

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const SPECS = [
  { icon: ICON_CHIP,   label: 'Processeur', value: 'Gen 3 AI',  desc: 'Puce neural intégrée' },
  { icon: ICON_BOLT,   label: 'Autonomie',  value: '72h',       desc: 'Usage continu certifié' },
  { icon: ICON_SHIELD, label: 'Protection', value: 'IP68',      desc: 'Eau & poussière' },
  { icon: ICON_WIFI,   label: 'Connexion',  value: 'BT 5.4',    desc: 'Latence < 20ms' },
  { icon: ICON_ZAP,    label: 'Charge',     value: '30 min',    desc: 'Charge complète rapide' },
  { icon: ICON_ROTATE, label: 'Garantie',   value: '2 ans',     desc: 'Retours gratuits' },
]

const FEATURES_TABS = [
  {
    id: 'performance',
    label: 'Performance',
    items: [
      { title: 'Puce Neural Gen 3',      desc: 'Intelligence artificielle embarquée — traitement local, zéro latence, zéro données envoyées.' },
      { title: 'Batterie Longue Durée',  desc: '72 heures d\'autonomie réelle. Charge en 30 minutes via USB-C. Compatible charge sans fil.' },
      { title: 'Thermal Control',        desc: 'Système de dissipation thermique breveté. Performances maximales sans throttling même en usage intensif.' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    items: [
      { title: 'Aluminium Aerospace',    desc: 'Alliage 7075-T6 usiné CNC. Le même matériau que les coques de satellites.' },
      { title: 'Verre Saphir',           desc: 'Indice de dureté 9/10 sur l\'échelle Mohs. Résistant aux rayures de clés et couteaux.' },
      { title: 'Épaisseur 6.2mm',        desc: 'Le plus fin de sa catégorie. 28 grammes seulement — on oublie qu\'on le porte.' },
    ],
  },
  {
    id: 'connectivity',
    label: 'Connectivité',
    items: [
      { title: 'Bluetooth 5.4 Ultra',    desc: 'Portée 100m en champ libre. Connexion instantanée multi-appareils. Zéro coupure au sport.' },
      { title: 'App Ecosystem',          desc: 'Compatible iOS 15+ et Android 10+. Intégration native HomeKit, Google Home et Alexa.' },
      { title: 'OTA Updates',            desc: 'Mises à jour automatiques over-the-air. Chaque update améliore les performances.' },
    ],
  },
]

const COMPARE = [
  { feature: 'Autonomie',          ours: '72h',         comp1: '36h',        comp2: '48h'         },
  { feature: 'Certification eau',  ours: 'IP68',         comp1: 'IP54',       comp2: 'IP67'        },
  { feature: 'Charge rapide',      ours: '30 min',       comp1: '2h',         comp2: '1h30'        },
  { feature: 'Puce IA intégrée',   ours: true,           comp1: false,        comp2: false         },
  { feature: 'Verre Saphir',       ours: true,           comp1: false,        comp2: true          },
  { feature: 'Garantie',           ours: '2 ans',        comp1: '1 an',       comp2: '1 an'        },
  { feature: 'Prix',               ours: 'Meilleur',     comp1: '+22%',       comp2: '+40%'        },
]

const REVIEWS = [
  { name: 'Mehdi B.',   rating: 5, text: 'Je suis testeur tech depuis 8 ans. Ce produit m\'a sincèrement surpris — qualité de build digne du double du prix.' },
  { name: 'Laure D.',   rating: 5, text: 'Autonomie de 3 jours vérifiée. Je l\'ai testé en voyage sans chargeur. Bluffant pour ce tarif.' },
  { name: 'Karim R.',   rating: 5, text: 'Le bluetooth ne coupe plus au sport. Problème résolu après des années de galère avec d\'autres marques.' },
  { name: 'Sophie V.',  rating: 5, text: 'Design ultra soigné. Le verre saphir — j\'ai fait un test avec mes clés. Aucune trace. Qualité de horlogerie.' },
]

// ─── HELPER ───────────────────────────────────────────────────────────────────

function stars(n: number): string {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < n ? C.cyan : 'rgba(255,255,255,0.2)'}">${ICON_STAR}</span>`
  ).join('')
}

function calcDiscount(price: string, orig: string): number {
  const p = parseFloat(price.replace(/[^0-9.]/g, ''))
  const o = parseFloat(orig.replace(/[^0-9.]/g, '') || '1')
  if (!p || !o || o <= p) return 0
  return Math.round((1 - p / o) * 100)
}

// ─── TEMPLATE ─────────────────────────────────────────────────────────────────

export function templateEtecPulse(data: LandingPageData): string {
  const benefits = data.benefits ?? []
  const faq      = data.faq      ?? []
  const images   = data.images   ?? []

  const img = (i: number) => images[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName   = data.product_name   || 'Gadget Pro X'
  const headline      = data.headline       || 'La technologie du futur. Disponible maintenant.'
  const subtitle      = data.subtitle       || 'La technologie qui change tout'
  const ctaText       = data.cta            || 'Commander maintenant'
  const urgency       = data.urgency        || 'Offre de lancement — Stock limité à 300 unités'
  const price         = data.price          || '89'
  const originalPrice = data.original_price || '149'
  const discount      = calcDiscount(price, originalPrice)

  const benefitsList = benefits.length > 0 ? benefits : [
    'Puce Neural Gen 3 — IA embarquée, zéro latence',
    '72h d\'autonomie — charge en 30 minutes',
    'IP68 certifié — eau, poussière, chocs',
    'Bluetooth 5.4 — connexion ultra-stable',
    'Verre saphir — résistant aux rayures',
  ]

  const faqs = faq.length > 0 ? faq : [
    { question: 'Avec quels appareils est-il compatible ?',  answer: 'Compatible iOS 15+ et Android 10+. Toutes les fonctionnalités sont disponibles sur les deux plateformes via notre application gratuite.' },
    { question: 'Quelle est la durée de la garantie ?',      answer: '2 ans de garantie mondiale. Si un problème survient, nous le remplaçons sans question. Retour gratuit inclus.' },
    { question: 'Quelle est la politique de retour ?',       answer: '30 jours d\'essai sans risque. Pas satisfait ? Retour intégral remboursé. Frais de retour offerts.' },
    { question: 'Quel est le délai de livraison ?',          answer: 'Expédition express en 24h ouvrées. Commande avant 14h = expédition le jour même.' },
    { question: 'La charge sans fil est-elle incluse ?',     answer: 'Oui, compatible Qi 15W. Le chargeur USB-C rapide (30min) est inclus dans la boîte.' },
  ]

  // ─── HTML FRAGMENTS ─────────────────────────────────────────────────────────

  const benefitsHTML = benefitsList.map(b =>
    `<li class="fpls-benefit"><span class="fpls-benefit-ico">${ICON_CHECK}</span><span>${b}</span></li>`
  ).join('')

  const specsHTML = SPECS.map(s => `
    <div class="fpls-spec-card">
      <div class="fpls-spec-icon">${s.icon}</div>
      <div class="fpls-spec-value">${s.value}</div>
      <div class="fpls-spec-label">${s.label}</div>
      <div class="fpls-spec-desc">${s.desc}</div>
    </div>`).join('')

  const tabsNavHTML = FEATURES_TABS.map((t, i) =>
    `<button class="fpls-tab${i === 0 ? ' fpls-tab-active' : ''}" onclick="switchTab('${t.id}')" data-tab="${t.id}">${t.label}</button>`
  ).join('')

  const tabsPanelsHTML = FEATURES_TABS.map((t, i) => `
    <div class="fpls-tab-panel${i === 0 ? ' fpls-tab-panel-active' : ''}" id="tab-panel-${t.id}">
      ${t.items.map(item => `
        <div class="fpls-feature-item">
          <div class="fpls-feature-dot"></div>
          <div>
            <div class="fpls-feature-title">${item.title}</div>
            <div class="fpls-feature-desc">${item.desc}</div>
          </div>
        </div>`).join('')}
    </div>`).join('')

  const compareHTML = COMPARE.map(r => {
    const oursVal   = typeof r.ours  === 'boolean' ? (r.ours  ? `<span class="fpls-check">${ICON_CHECK}</span>` : `<span class="fpls-cross">${ICON_X}</span>`) : `<span class="fpls-compare-ours-val">${r.ours} ${ICON_CHECK}</span>`
    const comp1Val  = typeof r.comp1 === 'boolean' ? (r.comp1 ? `<span class="fpls-check-dim">${ICON_CHECK}</span>` : `<span class="fpls-cross">${ICON_X}</span>`) : `<span class="fpls-compare-dim">${r.comp1}</span>`
    const comp2Val  = typeof r.comp2 === 'boolean' ? (r.comp2 ? `<span class="fpls-check-dim">${ICON_CHECK}</span>` : `<span class="fpls-cross">${ICON_X}</span>`) : `<span class="fpls-compare-dim">${r.comp2}</span>`
    return `
    <tr class="fpls-compare-row">
      <td class="fpls-compare-feature">${r.feature}</td>
      <td class="fpls-compare-ours">${oursVal}</td>
      <td class="fpls-compare-other">${comp1Val}</td>
      <td class="fpls-compare-other">${comp2Val}</td>
    </tr>`
  }).join('')

  const reviewsHTML = REVIEWS.map((r, i) => `
    <div class="fpls-review-card fils-review-${i}">
      <div class="fpls-review-head">
        <div class="fpls-review-av" style="background:${['#00D4FF','#7B2FBE','#0891b2','#6d28d9'][i % 4]};color:#fff">${r.name[0]}</div>
        <div>
          <div class="fpls-review-name">${r.name}</div>
          <div class="fpls-review-stars">${stars(r.rating)}</div>
        </div>
        <div class="fpls-review-verified">${ICON_CHECK} Vérifié</div>
      </div>
      <p class="fpls-review-text">"${r.text}"</p>
    </div>`).join('')

  const faqHTML = faqs.map((f, i) => `
    <div class="fpls-faq-item" id="faq-item-${i}">
      <button class="fpls-faq-q" onclick="toggleFaq(${i})" aria-expanded="false" id="faq-btn-${i}">
        <span>${f.question}</span>
        <span class="fpls-faq-ico" id="faq-ico-${i}">${ICON_PLUS}</span>
      </button>
      <div class="fpls-faq-a" id="faq-a-${i}" style="display:none"><p>${f.answer}</p></div>
    </div>`).join('')

  const thumbsHTML = Array.from({ length: Math.min(4, Math.max(images.length, 1)) }, (_, i) => `
    <div class="fpls-thumb${i === 0 ? ' fpls-thumb-active' : ''}" onclick="selectImg(this,'${img(i)}')" role="button" tabindex="0">
      <img src="${img(i)}" alt="Vue ${i + 1}" loading="lazy">
    </div>`).join('')

  // ─── FINAL TEMPLATE ─────────────────────────────────────────────────────────

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${productName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* ─── RESET & BASE ──────────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:'Space Grotesk',system-ui,sans-serif;
  background:${C.bg};
  color:${C.white};
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
img{max-width:100%;display:block}
button{font-family:inherit}

/* ─── KEYFRAMES ─────────────────────────────────────────────── */
@keyframes blink{
  0%,100%{opacity:1}
  50%{opacity:0.25}
}
@keyframes float{
  0%,100%{transform:translateY(0px)}
  50%{transform:translateY(-18px)}
}
@keyframes pulseGlow{
  0%,100%{box-shadow:0 0 20px ${C.cyanGlow},0 0 40px rgba(0,212,255,0.15)}
  50%{box-shadow:0 0 35px ${C.cyanGlow},0 0 70px rgba(0,212,255,0.25),0 0 120px rgba(123,47,190,0.2)}
}
@keyframes marquee{
  0%{transform:translateX(0)}
  100%{transform:translateX(-50%)}
}
@keyframes fadeInUp{
  from{opacity:0;transform:translateY(28px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes gridPulse{
  0%,100%{opacity:0.4}
  50%{opacity:0.7}
}

/* ─── TOP BAR MARQUEE ───────────────────────────────────────── */
.fpls-topbar{
  background:${C.cyan};
  color:#080B12;
  height:36px;
  overflow:hidden;
  position:relative;
  display:flex;
  align-items:center;
}
.fpls-marquee-track{
  display:flex;
  align-items:center;
  white-space:nowrap;
  animation:marquee 22s linear infinite;
  will-change:transform;
}
.fpls-marquee-item{
  font-size:12px;
  font-weight:700;
  letter-spacing:0.08em;
  text-transform:uppercase;
  padding:0 48px;
}
.fpls-marquee-sep{
  font-size:10px;
  opacity:0.5;
}

/* ─── NAV ───────────────────────────────────────────────────── */
.fpls-nav{
  position:sticky;
  top:0;
  z-index:100;
  background:rgba(8,11,18,0.8);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid ${C.borderSub};
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 40px;
  height:60px;
  transition:border-color 0.3s;
}
.fpls-nav-logo{
  font-size:18px;
  font-weight:700;
  letter-spacing:-0.03em;
  background:linear-gradient(90deg,${C.cyan},${C.violet});
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.fpls-nav-links{
  display:flex;
  gap:32px;
}
.fpls-nav-link{
  font-size:13px;
  font-weight:500;
  color:${C.textMuted};
  text-decoration:none;
  transition:color 0.2s;
  letter-spacing:0.01em;
}
.fpls-nav-link:hover{color:${C.cyan}}
.fpls-nav-cta{
  background:linear-gradient(135deg,${C.cyan},${C.violet});
  color:#fff;
  font-size:13px;
  font-weight:600;
  padding:8px 22px;
  border-radius:100px;
  text-decoration:none;
  letter-spacing:0.01em;
  transition:opacity 0.2s,transform 0.2s;
}
.fpls-nav-cta:hover{opacity:0.85;transform:translateY(-1px)}

/* ─── HERO ──────────────────────────────────────────────────── */
.fpls-hero{
  position:relative;
  min-height:calc(100vh - 96px);
  display:grid;
  grid-template-columns:1fr 1fr;
  align-items:center;
  overflow:hidden;
  background:${C.bg};
}
.fpls-hero-bg{
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none;
}
.fpls-hero-bg svg{
  width:100%;
  height:100%;
  opacity:0.35;
  animation:gridPulse 6s ease-in-out infinite;
}
.fpls-hero-glow-1{
  position:absolute;
  width:500px;
  height:500px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(123,47,190,0.18) 0%,transparent 70%);
  top:-100px;
  left:-100px;
  pointer-events:none;
}
.fpls-hero-glow-2{
  position:absolute;
  width:400px;
  height:400px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(0,212,255,0.12) 0%,transparent 70%);
  bottom:-80px;
  right:10%;
  pointer-events:none;
}
.fpls-hero-left{
  position:relative;
  z-index:1;
  padding:80px 60px 80px 80px;
  display:flex;
  flex-direction:column;
  gap:0;
}
.fpls-badge-new{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:${C.cyanDim};
  border:1px solid ${C.border};
  color:${C.cyan};
  font-size:10px;
  font-weight:700;
  letter-spacing:0.12em;
  text-transform:uppercase;
  padding:5px 14px;
  border-radius:100px;
  margin-bottom:22px;
  width:fit-content;
}
.fpls-badge-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  background:${C.cyan};
  animation:blink 1.4s ease-in-out infinite;
}
.fpls-hero-h1{
  font-size:clamp(30px,3.8vw,56px);
  font-weight:700;
  letter-spacing:-0.04em;
  line-height:1.05;
  margin-bottom:18px;
  background:linear-gradient(135deg,${C.cyan} 0%,#a78bfa 55%,${C.violet} 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.fpls-hero-sub{
  font-size:16px;
  font-weight:400;
  color:${C.textMuted};
  line-height:1.65;
  margin-bottom:28px;
  max-width:480px;
}
.fpls-price-row{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.fpls-price-main{
  font-size:42px;
  font-weight:700;
  letter-spacing:-0.04em;
  color:${C.white};
}
.fpls-price-orig{
  font-size:20px;
  color:${C.textMuted};
  text-decoration:line-through;
  font-weight:400;
}
.fpls-price-badge{
  background:linear-gradient(135deg,${C.cyan},${C.violet});
  color:#fff;
  font-size:12px;
  font-weight:700;
  padding:4px 12px;
  border-radius:100px;
  letter-spacing:0.02em;
}
.fpls-hero-benefits{
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom:32px;
}
.fpls-benefit{
  display:flex;
  align-items:flex-start;
  gap:10px;
  font-size:13.5px;
  color:rgba(255,255,255,0.8);
  font-weight:400;
}
.fpls-benefit-ico{
  color:${C.cyan};
  flex-shrink:0;
  margin-top:1px;
}
.fpls-cta-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:linear-gradient(135deg,${C.cyan},${C.violet});
  color:#fff;
  font-family:'Space Grotesk',sans-serif;
  font-size:16px;
  font-weight:600;
  padding:17px 40px;
  border-radius:12px;
  border:none;
  cursor:pointer;
  text-decoration:none;
  letter-spacing:-0.01em;
  animation:pulseGlow 3s ease-in-out infinite;
  transition:transform 0.2s,opacity 0.2s;
  margin-bottom:14px;
  width:fit-content;
}
.fpls-cta-btn:hover{transform:translateY(-2px);opacity:0.92}
.fpls-urgency{
  font-size:12px;
  font-weight:500;
  color:${C.cyan};
  letter-spacing:0.02em;
  display:flex;
  align-items:center;
  gap:6px;
}
.fpls-urgency-dot{
  width:6px;
  height:6px;
  background:${C.cyan};
  border-radius:50%;
  animation:blink 1.2s ease-in-out infinite;
  flex-shrink:0;
}
.fpls-trust-row{
  display:flex;
  gap:20px;
  margin-top:20px;
  flex-wrap:wrap;
}
.fpls-trust-item{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:12px;
  color:${C.textMuted};
  font-weight:400;
}
.fpls-trust-item svg{color:${C.cyan}}

/* ─── HERO RIGHT ────────────────────────────────────────────── */
.fpls-hero-right{
  position:relative;
  z-index:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 40px;
}
.fpls-hero-img-wrap{
  position:relative;
}
.fpls-hero-img{
  width:100%;
  max-width:440px;
  object-fit:contain;
  filter:drop-shadow(0 0 60px rgba(0,212,255,0.25)) drop-shadow(0 30px 60px rgba(0,0,0,0.6));
  animation:float 5s ease-in-out infinite;
}
.fpls-hero-ring{
  position:absolute;
  inset:-40px;
  border-radius:50%;
  border:1px solid rgba(0,212,255,0.1);
  pointer-events:none;
}
.fpls-hero-ring-2{
  position:absolute;
  inset:-80px;
  border-radius:50%;
  border:1px solid rgba(123,47,190,0.08);
  pointer-events:none;
}

/* ─── SPECS GRID ────────────────────────────────────────────── */
.fpls-specs-section{
  background:${C.surface};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-section-inner{max-width:1080px;margin:0 auto}
.fpls-section-label{
  font-size:11px;
  font-weight:700;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color:${C.cyan};
  text-align:center;
  margin-bottom:10px;
}
.fpls-section-title{
  font-size:clamp(26px,3vw,42px);
  font-weight:700;
  letter-spacing:-0.03em;
  text-align:center;
  margin-bottom:48px;
  color:${C.white};
}
.fpls-specs-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}
.fpls-spec-card{
  background:${C.bg};
  border:1px solid ${C.border};
  border-radius:16px;
  padding:28px 24px;
  text-align:center;
  transition:border-color 0.25s,box-shadow 0.25s,transform 0.25s;
}
.fpls-spec-card:hover{
  border-color:${C.cyan};
  box-shadow:0 0 30px ${C.cyanDim};
  transform:translateY(-3px);
}
.fpls-spec-icon{
  width:40px;
  height:40px;
  border-radius:10px;
  background:${C.cyanDim};
  border:1px solid ${C.border};
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto 14px;
  color:${C.cyan};
}
.fpls-spec-value{
  font-size:28px;
  font-weight:700;
  letter-spacing:-0.04em;
  color:${C.cyan};
  line-height:1;
  margin-bottom:6px;
}
.fpls-spec-label{
  font-size:13px;
  font-weight:600;
  color:${C.white};
  margin-bottom:4px;
}
.fpls-spec-desc{
  font-size:11px;
  color:${C.textMuted};
  font-weight:400;
}

/* ─── FEATURES TABS ─────────────────────────────────────────── */
.fpls-features-section{
  background:${C.bg};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-tabs-nav{
  display:flex;
  gap:4px;
  background:${C.surface};
  border:1px solid ${C.borderSub};
  border-radius:12px;
  padding:4px;
  margin-bottom:36px;
  width:fit-content;
  margin-left:auto;
  margin-right:auto;
}
.fpls-tab{
  font-family:'Space Grotesk',sans-serif;
  font-size:13px;
  font-weight:600;
  color:${C.textMuted};
  background:transparent;
  border:none;
  border-radius:9px;
  padding:9px 22px;
  cursor:pointer;
  transition:all 0.2s;
  letter-spacing:0.01em;
}
.fpls-tab:hover{color:${C.white}}
.fpls-tab-active{
  background:linear-gradient(135deg,${C.cyanDim},${C.violetDim});
  color:${C.cyan};
  border:1px solid ${C.border};
}
.fpls-tab-panel{display:none}
.fpls-tab-panel-active{display:flex;flex-direction:column;gap:16px}
.fpls-feature-item{
  display:flex;
  align-items:flex-start;
  gap:16px;
  background:${C.surface};
  border:1px solid ${C.borderSub};
  border-radius:12px;
  padding:20px 24px;
  transition:border-color 0.2s,box-shadow 0.2s;
}
.fpls-feature-item:hover{
  border-color:${C.border};
  box-shadow:0 0 20px ${C.cyanDim};
}
.fpls-feature-dot{
  width:8px;
  height:8px;
  border-radius:50%;
  background:${C.cyan};
  box-shadow:0 0 8px ${C.cyanGlow};
  flex-shrink:0;
  margin-top:6px;
}
.fpls-feature-title{
  font-size:15px;
  font-weight:600;
  color:${C.white};
  margin-bottom:4px;
  letter-spacing:-0.01em;
}
.fpls-feature-desc{
  font-size:13px;
  color:${C.textMuted};
  line-height:1.6;
  font-weight:400;
}

/* ─── COMPARE TABLE ─────────────────────────────────────────── */
.fpls-compare-section{
  background:${C.surface};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-compare-table{
  width:100%;
  border-collapse:collapse;
  background:${C.bg};
  border-radius:16px;
  overflow:hidden;
  border:1px solid ${C.borderSub};
  margin-top:40px;
}
.fpls-compare-table th{
  padding:14px 20px;
  font-size:11px;
  font-weight:700;
  text-align:center;
  background:${C.surfaceAlt};
  color:${C.textMuted};
  letter-spacing:0.08em;
  text-transform:uppercase;
}
.fpls-compare-table th:first-child{text-align:left}
.fpls-compare-table th.fpls-th-ours{
  background:linear-gradient(135deg,${C.cyanDim},${C.violetDim});
  color:${C.cyan};
  border-bottom:1px solid ${C.border};
}
.fpls-compare-row td{
  padding:13px 20px;
  font-size:13px;
  border-top:1px solid ${C.borderSub};
  text-align:center;
  color:${C.textMuted};
}
.fpls-compare-row td:first-child{
  text-align:left;
  color:${C.white};
  font-weight:500;
}
.fpls-compare-feature{color:${C.white};font-weight:500}
.fpls-compare-ours{background:rgba(0,212,255,0.04)}
.fpls-compare-other{color:${C.textMuted}}
.fpls-compare-ours-val{
  display:inline-flex;
  align-items:center;
  gap:5px;
  color:${C.cyan};
  font-weight:700;
}
.fpls-compare-dim{color:${C.textMuted}}
.fpls-check{color:${C.cyan};display:inline-flex;align-items:center}
.fpls-check-dim{color:rgba(255,255,255,0.35);display:inline-flex;align-items:center}
.fpls-cross{color:rgba(255,80,80,0.7);display:inline-flex;align-items:center}

/* ─── COUNTDOWN ─────────────────────────────────────────────── */
.fpls-countdown-section{
  background:linear-gradient(135deg,rgba(0,212,255,0.08) 0%,rgba(123,47,190,0.15) 50%,rgba(8,11,18,0.95) 100%);
  border-top:1px solid ${C.border};
  border-bottom:1px solid ${C.border};
  padding:56px 40px;
  text-align:center;
}
.fpls-countdown-label{
  font-size:12px;
  font-weight:700;
  letter-spacing:0.12em;
  text-transform:uppercase;
  color:${C.cyan};
  margin-bottom:12px;
}
.fpls-countdown-title{
  font-size:clamp(20px,2.5vw,30px);
  font-weight:700;
  letter-spacing:-0.02em;
  color:${C.white};
  margin-bottom:32px;
}
.fpls-countdown-digits{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
}
.fpls-digit-block{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
}
.fpls-digit{
  background:${C.surface};
  border:1px solid ${C.border};
  border-radius:12px;
  width:72px;
  height:72px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:32px;
  font-weight:700;
  letter-spacing:-0.04em;
  color:${C.cyan};
  box-shadow:0 0 20px ${C.cyanDim};
}
.fpls-digit-label{
  font-size:10px;
  font-weight:600;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:${C.textMuted};
}
.fpls-countdown-sep{
  font-size:28px;
  font-weight:700;
  color:${C.textMuted};
  margin-bottom:20px;
}

/* ─── BENEFITS ──────────────────────────────────────────────── */
.fpls-benefits-section{
  background:${C.bg};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-benefits-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
  max-width:800px;
  margin:0 auto;
}
.fils-benefit-card{
  display:flex;
  align-items:flex-start;
  gap:12px;
  background:${C.surface};
  border:1px solid ${C.borderSub};
  border-radius:12px;
  padding:18px 20px;
  transition:border-color 0.2s;
}
.fils-benefit-card:hover{border-color:${C.border}}
.fils-benefit-ico{
  width:32px;
  height:32px;
  border-radius:8px;
  background:${C.cyanDim};
  display:flex;
  align-items:center;
  justify-content:center;
  color:${C.cyan};
  flex-shrink:0;
}
.fils-benefit-text{
  font-size:13.5px;
  color:rgba(255,255,255,0.85);
  line-height:1.55;
  font-weight:400;
}

/* ─── TESTIMONIALS ──────────────────────────────────────────── */
.fpls-reviews-section{
  background:${C.surface};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-reviews-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px;
  max-width:900px;
  margin:40px auto 0;
}
.fpls-review-card{
  background:${C.bg};
  border:1px solid ${C.borderSub};
  border-radius:16px;
  padding:24px;
  transition:border-color 0.2s,box-shadow 0.2s;
}
.fpls-review-card:hover{
  border-color:${C.border};
  box-shadow:0 0 24px ${C.cyanDim};
}
.fpls-review-head{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}
.fpls-review-av{
  width:38px;
  height:38px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:14px;
  font-weight:700;
  flex-shrink:0;
}
.fpls-review-name{
  font-size:13px;
  font-weight:700;
  color:${C.white};
}
.fpls-review-stars{
  display:flex;
  gap:2px;
  margin-top:2px;
}
.fpls-review-verified{
  margin-left:auto;
  font-size:10px;
  font-weight:700;
  color:${C.cyan};
  display:flex;
  align-items:center;
  gap:3px;
  white-space:nowrap;
}
.fpls-review-verified svg{color:${C.cyan}}
.fpls-review-text{
  font-size:13px;
  color:${C.textMuted};
  line-height:1.65;
  font-style:italic;
  font-weight:400;
}

/* ─── FAQ ───────────────────────────────────────────────────── */
.fpls-faq-section{
  background:${C.surface};
  padding:80px 40px;
  border-top:1px solid ${C.borderSub};
}
.fpls-faq-inner{max-width:680px;margin:0 auto}
.fpls-faq-item{
  border-bottom:1px solid ${C.borderSub};
  transition:border-color 0.2s;
}
.fpls-faq-item:hover{border-bottom-color:${C.border}}
.fpls-faq-q{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:18px 0;
  font-family:'Space Grotesk',sans-serif;
  font-size:14px;
  font-weight:600;
  color:${C.white};
  background:none;
  border:none;
  cursor:pointer;
  text-align:left;
  gap:16px;
  transition:color 0.2s;
  letter-spacing:-0.01em;
}
.fpls-faq-q:hover{color:${C.cyan}}
.fpls-faq-ico{
  color:${C.textMuted};
  flex-shrink:0;
  transition:transform 0.25s,color 0.2s;
}
.fpls-faq-a{padding-bottom:16px}
.fpls-faq-a p{
  font-size:13.5px;
  color:${C.textMuted};
  line-height:1.65;
  font-weight:400;
}

/* ─── CTA FINAL ─────────────────────────────────────────────── */
.fpls-final-cta{
  position:relative;
  background:radial-gradient(ellipse at 50% 0%,rgba(123,47,190,0.3) 0%,rgba(0,212,255,0.08) 40%,${C.bg} 70%);
  padding:100px 40px;
  text-align:center;
  border-top:1px solid ${C.border};
  overflow:hidden;
}
.fpls-final-glow{
  position:absolute;
  width:600px;
  height:600px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(123,47,190,0.2) 0%,transparent 60%);
  top:50%;
  left:50%;
  transform:translate(-50%,-60%);
  pointer-events:none;
}
.fpls-final-cta-inner{position:relative;z-index:1}
.fpls-final-cta h2{
  font-size:clamp(28px,4vw,52px);
  font-weight:700;
  letter-spacing:-0.04em;
  margin-bottom:16px;
  background:linear-gradient(135deg,${C.cyan},#a78bfa,${C.violet});
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.fpls-final-cta p{
  font-size:16px;
  color:${C.textMuted};
  margin-bottom:36px;
  max-width:560px;
  margin-left:auto;
  margin-right:auto;
  line-height:1.65;
}
.fpls-final-trust{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:28px;
  margin-top:24px;
  flex-wrap:wrap;
}
.fpls-final-trust-item{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:12px;
  color:${C.textMuted};
  font-weight:500;
}
.fpls-final-trust-item svg{color:${C.cyan}}

/* ─── FOOTER ────────────────────────────────────────────────── */
.fpls-footer{
  background:${C.surface};
  padding:48px 40px 24px;
  border-top:1px solid ${C.borderSub};
}
.fpls-footer-inner{max-width:1080px;margin:0 auto}
.fpls-footer-top{
  display:grid;
  grid-template-columns:2fr 1fr 1fr;
  gap:40px;
  margin-bottom:40px;
}
.fpls-footer-brand{
  font-size:18px;
  font-weight:700;
  letter-spacing:-0.03em;
  background:linear-gradient(90deg,${C.cyan},${C.violet});
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  margin-bottom:10px;
}
.fpls-footer-tagline{
  font-size:12px;
  color:${C.textMuted};
  line-height:1.65;
  max-width:220px;
  font-weight:400;
}
.fpls-footer-col-title{
  font-size:10px;
  font-weight:700;
  letter-spacing:0.12em;
  text-transform:uppercase;
  color:rgba(255,255,255,0.3);
  margin-bottom:14px;
}
.fpls-footer-link{
  display:block;
  font-size:12px;
  color:${C.textMuted};
  text-decoration:none;
  margin-bottom:8px;
  transition:color 0.2s;
  font-weight:400;
}
.fpls-footer-link:hover{color:${C.cyan}}
.fpls-footer-bottom{
  border-top:1px solid ${C.borderSub};
  padding-top:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
}
.fpls-footer-copy{
  font-size:11px;
  color:rgba(255,255,255,0.2);
  font-weight:400;
}

/* ─── FADE IN OBSERVER ──────────────────────────────────────── */
.fpls-fade{
  opacity:0;
  transform:translateY(24px);
  transition:opacity 0.65s cubic-bezier(0.4,0,0.2,1),transform 0.65s cubic-bezier(0.4,0,0.2,1);
}
.fpls-fade.fpls-visible{
  opacity:1;
  transform:translateY(0);
}

/* ─── RESPONSIVE ────────────────────────────────────────────── */
@media(max-width:960px){
  .fpls-hero{grid-template-columns:1fr}
  .fpls-hero-right{
    padding:40px;
    order:-1;
    min-height:300px;
  }
  .fpls-hero-img{max-width:280px}
  .fpls-hero-left{padding:48px 28px}
  .fpls-nav{padding:0 20px}
  .fpls-nav-links{display:none}
  .fpls-specs-grid{grid-template-columns:repeat(2,1fr)}
  .fpls-reviews-grid{grid-template-columns:1fr}
  .fpls-footer-top{grid-template-columns:1fr 1fr;gap:28px}
  .fpls-benefits-grid{grid-template-columns:1fr}
}
@media(max-width:600px){
  .fpls-specs-grid{grid-template-columns:1fr 1fr}
  .fpls-countdown-digits{gap:6px}
  .fpls-digit{width:56px;height:56px;font-size:24px}
  .fpls-footer-top{grid-template-columns:1fr}
  .fpls-reviews-grid{grid-template-columns:1fr}
  .fpls-benefits-grid{grid-template-columns:1fr}
  .fpls-final-trust{gap:16px}
}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms !important;transition-duration:0.01ms !important}
}
</style>
</head>
<body>

<!-- TOP BAR MARQUEE -->
<div class="fpls-topbar" aria-hidden="true">
  <div class="fpls-marquee-track">
    <span class="fpls-marquee-item">LIVRAISON GRATUITE</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">PAIEMENT SÉCURISÉ</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">RETOURS 30 JOURS</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">GARANTIE 2 ANS</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">LIVRAISON GRATUITE</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">PAIEMENT SÉCURISÉ</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">RETOURS 30 JOURS</span>
    <span class="fpls-marquee-sep">·</span>
    <span class="fpls-marquee-item">GARANTIE 2 ANS</span>
    <span class="fpls-marquee-sep">·</span>
  </div>
</div>

<!-- NAV -->
<nav class="fpls-nav">
  <div class="fpls-nav-logo">${productName.split(' ')[0]}</div>
  <div class="fpls-nav-links">
    <a class="fpls-nav-link" href="javascript:void(0)" onclick="event.preventDefault()">Specs</a>
    <a class="fpls-nav-link" href="javascript:void(0)" onclick="event.preventDefault()">Features</a>
    <a class="fpls-nav-link" href="javascript:void(0)" onclick="event.preventDefault()">Comparatif</a>
    <a class="fpls-nav-link" href="javascript:void(0)" onclick="event.preventDefault()">Avis</a>
  </div>
  <a class="fpls-nav-cta" href="javascript:void(0)" onclick="event.preventDefault()">Commander</a>
</nav>

<!-- HERO -->
<section class="fpls-hero">
  <div class="fpls-hero-bg">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="${C.cyan}" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)"/>
    </svg>
  </div>
  <div class="fpls-hero-glow-1"></div>
  <div class="fpls-hero-glow-2"></div>

  <div class="fpls-hero-left">
    <div class="fpls-badge-new">
      <span class="fpls-badge-dot"></span>
      NOUVEAU
    </div>
    <h1 class="fpls-hero-h1">${headline}</h1>
    <p class="fpls-hero-sub">${subtitle}</p>
    <div class="fpls-price-row">
      <span class="fpls-price-main">${price.replace(/[^0-9.,]/g, '')}€</span>
      ${originalPrice ? `<span class="fpls-price-orig">${originalPrice.replace(/[^0-9.,]/g, '')}€</span>` : ''}
      ${discount > 0 ? `<span class="fpls-price-badge">-${discount}%</span>` : ''}
    </div>
    <ul class="fpls-hero-benefits">${benefitsHTML}</ul>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="fpls-cta-btn">
      ${ICON_BOLT} ${ctaText}
    </a>
    <div class="fpls-urgency">
      <span class="fpls-urgency-dot"></span>
      ${urgency}
    </div>
    <div class="fpls-trust-row">
      <div class="fpls-trust-item">${ICON_TRUCK} Livraison gratuite</div>
      <div class="fpls-trust-item">${ICON_SHIELD} Paiement sécurisé</div>
      <div class="fpls-trust-item">${ICON_ROTATE} Retours 30 jours</div>
    </div>
  </div>

  <div class="fpls-hero-right">
    <div class="fpls-hero-img-wrap">
      <div class="fpls-hero-ring"></div>
      <div class="fpls-hero-ring-2"></div>
      <img
        class="fpls-hero-img"
        src="${img(0)}"
        alt="${productName}"
        id="fpls-hero-main-img"
        width="440"
        height="440"
      >
    </div>
  </div>
</section>

<!-- SPECS GRID -->
<section class="fpls-specs-section" aria-label="Spécifications techniques">
  <div class="fpls-section-inner">
    <div class="fpls-section-label fpls-fade">Spécifications</div>
    <h2 class="fpls-section-title fpls-fade">Les chiffres parlent d'eux-mêmes.</h2>
    <div class="fpls-specs-grid">
      ${specsHTML}
    </div>
  </div>
</section>

<!-- FEATURES TABS -->
<section class="fpls-features-section" aria-label="Fonctionnalités">
  <div class="fpls-section-inner">
    <div class="fpls-section-label fpls-fade">Fonctionnalités</div>
    <h2 class="fpls-section-title fpls-fade">Conçu pour dépasser vos attentes.</h2>
    <div class="fpls-tabs-nav fpls-fade" role="tablist">
      ${tabsNavHTML}
    </div>
    <div class="fpls-tabs-content fpls-fade">
      ${tabsPanelsHTML}
    </div>
  </div>
</section>

<!-- COMPARISON TABLE -->
<section class="fpls-compare-section" aria-label="Comparatif">
  <div class="fpls-section-inner" style="max-width:820px">
    <div class="fpls-section-label fpls-fade">Comparatif</div>
    <h2 class="fpls-section-title fpls-fade">Pourquoi nous gagnons.</h2>
    <table class="fpls-compare-table fpls-fade" role="table">
      <thead>
        <tr>
          <th style="text-align:left">Critère</th>
          <th class="fpls-th-ours">${productName.split(' ')[0]}</th>
          <th>Concurrent A</th>
          <th>Concurrent B</th>
        </tr>
      </thead>
      <tbody>
        ${compareHTML}
      </tbody>
    </table>
  </div>
</section>

<!-- COUNTDOWN -->
<section class="fpls-countdown-section" aria-label="Offre limitée">
  <div class="fpls-countdown-label fpls-fade">Offre limitée</div>
  <h2 class="fpls-countdown-title fpls-fade">Cette offre expire dans</h2>
  <div class="fpls-countdown-digits fpls-fade" id="fpls-countdown" aria-live="polite">
    <div class="fpls-digit-block">
      <div class="fpls-digit" id="cd-h">00</div>
      <div class="fpls-digit-label">Heures</div>
    </div>
    <div class="fpls-countdown-sep">:</div>
    <div class="fpls-digit-block">
      <div class="fpls-digit" id="cd-m">00</div>
      <div class="fpls-digit-label">Minutes</div>
    </div>
    <div class="fpls-countdown-sep">:</div>
    <div class="fpls-digit-block">
      <div class="fpls-digit" id="cd-s">00</div>
      <div class="fpls-digit-label">Secondes</div>
    </div>
  </div>
</section>

<!-- BENEFITS -->
<section class="fpls-benefits-section" aria-label="Avantages">
  <div class="fpls-section-inner" style="max-width:860px">
    <div class="fpls-section-label fpls-fade">Pourquoi nous choisir</div>
    <h2 class="fpls-section-title fpls-fade">Tout ce dont vous avez besoin.</h2>
    <div class="fpls-benefits-grid fpls-fade">
      ${benefitsList.map(b => `
      <div class="fils-benefit-card">
        <div class="fils-benefit-ico">${ICON_CHECK}</div>
        <span class="fils-benefit-text">${b}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="fpls-reviews-section" aria-label="Avis clients">
  <div class="fpls-section-inner" style="max-width:940px">
    <div class="fpls-section-label fpls-fade">Avis clients</div>
    <h2 class="fpls-section-title fpls-fade">Ils ont sauté le pas.</h2>
    <div class="fpls-reviews-grid">
      ${reviewsHTML}
    </div>
  </div>
</section>

<!-- FAQ ACCORDION -->
<section class="fpls-faq-section" aria-label="Questions fréquentes">
  <div class="fpls-faq-inner">
    <div class="fpls-section-label fpls-fade" style="text-align:center">FAQ</div>
    <h2 class="fpls-section-title fpls-fade" style="margin-bottom:40px">Questions fréquentes.</h2>
    ${faqHTML}
  </div>
</section>

<!-- CTA FINAL -->
<section class="fpls-final-cta" aria-label="Commande finale">
  <div class="fpls-final-glow"></div>
  <div class="fpls-final-cta-inner fpls-fade">
    <h2>Prêt à passer au niveau supérieur ?</h2>
    <p>Rejoignez des milliers de clients satisfaits. Livraison gratuite, retours 30 jours, garantie 2 ans — sans condition.</p>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="fpls-cta-btn" style="margin:0 auto">
      ${ICON_BOLT} ${ctaText}
    </a>
    <div class="fpls-final-trust">
      <div class="fpls-final-trust-item">${ICON_TRUCK} Livraison offerte</div>
      <div class="fpls-final-trust-item">${ICON_SHIELD} Paiement 100% sécurisé</div>
      <div class="fpls-final-trust-item">${ICON_ROTATE} Retour gratuit 30j</div>
      <div class="fpls-final-trust-item">${ICON_CHECK} Garantie 2 ans</div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="fpls-footer">
  <div class="fpls-footer-inner">
    <div class="fpls-footer-top">
      <div>
        <div class="fpls-footer-brand">${productName.split(' ')[0]}</div>
        <p class="fpls-footer-tagline">Technologie de pointe conçue pour la vie réelle. Aucun compromis.</p>
      </div>
      <div>
        <div class="fpls-footer-col-title">Produit</div>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Fonctionnalités</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Spécifications</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Comparatif</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Accessoires</a>
      </div>
      <div>
        <div class="fpls-footer-col-title">Support</div>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">FAQ</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Livraison</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Retours</a>
        <a class="fpls-footer-link" href="javascript:void(0)" onclick="event.preventDefault()">Garantie</a>
      </div>
    </div>
    <div class="fpls-footer-bottom">
      <span class="fpls-footer-copy">© ${new Date().getFullYear()} ${productName}. Tous droits réservés.</span>
      <span class="fpls-footer-copy">IP68 · BT 5.4 · Puce Neural Gen 3</span>
    </div>
  </div>
</footer>

<script>
// ─── TABS ──────────────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.fpls-tab').forEach(function(t) {
    t.classList.toggle('fpls-tab-active', t.dataset.tab === id);
  });
  document.querySelectorAll('.fpls-tab-panel').forEach(function(p) {
    p.classList.toggle('fpls-tab-panel-active', p.id === 'tab-panel-' + id);
  });
}

// ─── FAQ ACCORDION ─────────────────────────────────────────────
function toggleFaq(i) {
  var a   = document.getElementById('faq-a-' + i);
  var ico = document.getElementById('faq-ico-' + i);
  var btn = document.getElementById('faq-btn-' + i);
  var open = a.style.display !== 'none';
  a.style.display = open ? 'none' : 'block';
  ico.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
  ico.style.color = open ? 'rgba(255,255,255,0.55)' : '${C.cyan}';
  btn.setAttribute('aria-expanded', String(!open));
}

// ─── COUNTDOWN ─────────────────────────────────────────────────
(function() {
  function getNextMidnight() {
    var now = new Date();
    var midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime();
  }
  var target = getNextMidnight();
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) { target = getNextMidnight(); return; }
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var eh = document.getElementById('cd-h');
    var em = document.getElementById('cd-m');
    var es = document.getElementById('cd-s');
    if (eh) eh.textContent = pad(h);
    if (em) em.textContent = pad(m);
    if (es) es.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();

// ─── INTERSECTION OBSERVER FADE IN ─────────────────────────────
(function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fpls-fade').forEach(function(el) {
      el.classList.add('fpls-visible');
    });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fpls-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fpls-fade').forEach(function(el) {
    obs.observe(el);
  });
})();

// ─── NAV SCROLL SHADOW ─────────────────────────────────────────
window.addEventListener('scroll', function() {
  var nav = document.querySelector('.fpls-nav');
  if (nav) {
    nav.style.borderBottomColor = window.scrollY > 10
      ? 'rgba(0,212,255,0.18)'
      : 'rgba(255,255,255,0.07)';
  }
}, { passive: true });
</script>
</body>
</html>`
}
