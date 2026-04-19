import type { LandingPageData } from '@/types'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
  'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80',
]

const C = {
  bg:       '#F5F5F7',
  white:    '#FFFFFF',
  dark:     '#1D1D1F',
  blue:     '#0066CC',
  blueHov:  '#0055AA',
  cyan:     '#00C7BE',
  text:     '#1D1D1F',
  muted:    '#6E6E73',
  border:   '#D2D2D7',
  gold:     '#F5A623',
}

const ICON_CHECK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_X      = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
const ICON_STAR   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const ICON_TRUCK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
const ICON_SHIELD = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const ICON_BOLT   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
const ICON_PLUS   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`

function stars(n: number) {
  return Array.from({length:5}, (_,i) => `<span style="color:${i<n?C.gold:'#D2D2D7'}">${ICON_STAR}</span>`).join('')
}

const SPECS = [
  { label: 'Battery Life',   value: '36h',     unit: 'continuous' },
  { label: 'Weight',         value: '28g',      unit: 'ultra-light' },
  { label: 'Water Resist.',  value: 'IP68',     unit: 'certified'  },
  { label: 'Connectivity',   value: 'BT 5.3',   unit: 'ultra-low latency' },
  { label: 'Charging',       value: '45min',    unit: 'to full charge' },
  { label: 'Warranty',       value: '2 years',  unit: 'worldwide' },
]

const FEATURES = [
  { icon: ICON_BOLT,   title: 'Unmatched Performance', desc: 'Next-gen chip delivers 40% more processing power with zero thermal throttling.' },
  { icon: ICON_SHIELD, title: 'Built to Last',          desc: 'Military-grade durability. Tested to survive 1.5m drops, dust, and water.' },
  { icon: ICON_TRUCK,  title: 'Precision Engineered',   desc: 'Sub-millimeter tolerances. Every component crafted for perfect fit and feel.' },
]

const COLORS = [
  { name: 'Midnight Black', hex: '#1D1D1F' },
  { name: 'Arctic White',   hex: '#F5F5F7' },
  { name: 'Ocean Blue',     hex: '#0066CC' },
]

const COMPARE = [
  { feature: 'Battery Life',        ours: '36h',    comp1: '20h',   comp2: '24h'   },
  { feature: 'Water Resistance',    ours: 'IP68',   comp1: 'IP54',  comp2: 'IP67'  },
  { feature: 'Charging Speed',      ours: '45min',  comp1: '2h',    comp2: '90min' },
  { feature: 'Warranty',            ours: '2 years',comp1: '1 year',comp2: '1 year'},
  { feature: 'App Compatibility',   ours: '✓',      comp1: '✓',     comp2: '✗'     },
  { feature: 'Price',               ours: 'Best',   comp1: '+20%',  comp2: '+35%'  },
]

const REVIEWS = [
  { name: 'Alex T.',    rating: 5, text: 'The battery life is absolutely insane. 3 days without charging on normal use. Never seen anything like it.' },
  { name: 'Sarah M.',   rating: 5, text: 'I dropped it on concrete twice. Not a scratch. The build quality puts Apple to shame honestly.' },
  { name: 'James K.',   rating: 5, text: 'Setup took 30 seconds. Bluetooth is rock solid — no dropouts at the gym. My previous pair cut out constantly.' },
  { name: 'Priya S.',   rating: 5, text: 'I\'m a tech reviewer and this is genuinely impressive for the price point. Competitors charge 2x for less.' },
]

export function templateEtecGadget(data: LandingPageData): string {
  const img = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName   = data.product_name   || 'ProTech X1 Ultra'
  const headline      = data.headline       || 'Technology that disappears. Performance that doesn\'t.'
  const subtitle      = data.subtitle       || 'The most advanced wearable tech we\'ve ever built. Engineered to the millimeter. Designed to last a decade.'
  const ctaText       = data.cta            || 'Order Now — Ships in 24h'
  const urgency       = data.urgency        || '⚡ Launch offer — Save 30% · Only 247 units left'
  const price         = data.price          || '149'
  const originalPrice = data.original_price || '219'

  const benefitsRaw = data.benefits || []
  const benefitsList = [
    benefitsRaw[0] || '36-hour battery — charge once, use all week',
    benefitsRaw[1] || 'IP68 waterproof — swim, sweat, shower',
    benefitsRaw[2] || 'Military-grade drop protection — tested to 1.5m',
    benefitsRaw[3] || 'Bluetooth 5.3 — zero latency, zero dropouts',
    benefitsRaw[4] || '2-year worldwide warranty included',
  ]

  const faqRaw = data.faq || []
  const faqs = faqRaw.length > 0 ? faqRaw : [
    { question: 'Which devices is it compatible with?', answer: 'Works with iOS 14+ and Android 8+. Full feature support on both platforms via our free companion app.' },
    { question: 'How long does the warranty last?',     answer: '2 years worldwide warranty. If anything goes wrong, we replace it — no questions asked.' },
    { question: 'What\'s the return policy?',           answer: '30-day risk-free trial. Don\'t love it? Return for a full refund. Free return shipping included.' },
    { question: 'How fast is shipping?',                answer: 'Express shipping in 1–3 business days. Order before 2pm for same-day dispatch.' },
  ]

  const specsHTML = SPECS.map(s => `
    <div class="spec-card">
      <div class="spec-value">${s.value}</div>
      <div class="spec-label">${s.label}</div>
      <div class="spec-unit">${s.unit}</div>
    </div>`).join('')

  const featuresHTML = FEATURES.map(f => `
    <div class="feature-card">
      <div class="feature-icon">${f.icon}</div>
      <h3 class="feature-title">${f.title}</h3>
      <p class="feature-desc">${f.desc}</p>
    </div>`).join('')

  const compareHTML = COMPARE.map(r => `
    <tr class="compare-row">
      <td class="compare-feature">${r.feature}</td>
      <td class="compare-ours"><span class="compare-ours-val">${r.ours} ${ICON_CHECK}</span></td>
      <td class="compare-other">${r.comp1}</td>
      <td class="compare-other">${r.comp2}</td>
    </tr>`).join('')

  const reviewsHTML = REVIEWS.map((r, i) => `
    <div class="review-card">
      <div class="review-head">
        <div class="review-av" style="background:${['#0066CC','#6E6E73','#00C7BE','#1D1D1F'][i%4]}">${r.name[0]}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-stars">${stars(r.rating)}</div>
        </div>
        <div class="review-verified">${ICON_CHECK} Verified</div>
      </div>
      <p class="review-text">"${r.text}"</p>
    </div>`).join('')

  const colorsHTML = COLORS.map((c, i) => `
    <button class="color-swatch${i===0?' active':''}" onclick="pickColor(this,'${c.name}')" title="${c.name}" style="background:${c.hex};${c.hex==='#F5F5F7'?'border:2px solid #D2D2D7;':''}" aria-label="${c.name}"></button>`).join('')

  const thumbsHTML = Array.from({length:4}, (_,i) => `
    <div class="thumb${i===0?' active':''}" onclick="selectImg(this,'${img(i)}')" role="button" tabindex="0">
      <img src="${img(i)}" alt="View ${i+1}" loading="lazy">
    </div>`).join('')

  const benefitsHTML = benefitsList.map(b => `<li class="hero-benefit">${ICON_CHECK} ${b}</li>`).join('')
  const faqHTML = faqs.map((f,i) => `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(${i})" aria-expanded="false" id="faq-btn-${i}">
        <span>${f.question}</span>
        <span class="faq-ico" id="faq-ico-${i}">${ICON_PLUS}</span>
      </button>
      <div class="faq-a" id="faq-a-${i}" style="display:none"><p>${f.answer}</p></div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${productName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;background:${C.white};color:${C.text};line-height:1.5;-webkit-font-smoothing:antialiased}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:56px}
.nav-logo{font-size:17px;font-weight:700;color:${C.dark};letter-spacing:-0.02em}
.nav-links{display:flex;gap:28px}
.nav-link{font-size:13px;color:${C.muted};text-decoration:none;transition:color .2s}
.nav-link:hover{color:${C.dark}}
.nav-cta{background:${C.blue};color:#fff;font-size:13px;font-weight:600;padding:8px 20px;border-radius:20px;text-decoration:none;transition:background .2s}
.nav-cta:hover{background:${C.blueHov}}

/* ANNOUNCE */
.announce{background:${C.dark};color:#fff;text-align:center;padding:10px;font-size:12px;font-weight:500;margin-top:56px}
.announce span{color:${C.cyan}}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 90px);background:${C.bg}}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,102,204,0.08);border:1px solid rgba(0,102,204,0.2);color:${C.blue};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:20px;width:fit-content}
.hero-h1{font-size:clamp(32px,4vw,52px);font-weight:700;letter-spacing:-0.04em;line-height:1.06;color:${C.dark};margin-bottom:16px}
.hero-sub{font-size:16px;color:${C.muted};line-height:1.65;margin-bottom:24px;max-width:440px}
.hero-benefits{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:28px}
.hero-benefit{display:flex;align-items:center;gap:8px;font-size:13.5px;color:${C.dark}}
.hero-benefit svg{color:${C.blue};flex-shrink:0}
.hero-rating{display:flex;align-items:center;gap:8px;margin-bottom:24px}
.hero-stars{display:flex;gap:2px}
.hero-rating-text{font-size:12px;color:${C.muted}}
.hero-urgency{background:rgba(0,102,204,0.06);border:1px solid rgba(0,102,204,0.15);color:${C.blue};font-size:12px;font-weight:600;padding:8px 16px;border-radius:8px;margin-bottom:20px}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:${C.blue};color:#fff;font-size:15px;font-weight:600;padding:16px 32px;border-radius:12px;border:none;cursor:pointer;text-decoration:none;transition:all .2s;letter-spacing:-0.01em}
.btn-primary:hover{background:${C.blueHov};transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,102,204,0.3)}
.btn-secondary{display:inline-flex;align-items:center;gap:8px;background:transparent;color:${C.dark};font-size:15px;font-weight:500;padding:16px 24px;border-radius:12px;border:1.5px solid ${C.border};cursor:pointer;text-decoration:none;transition:all .2s}
.btn-secondary:hover{border-color:${C.dark}}

/* HERO RIGHT */
.hero-right{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:${C.white}}
.hero-img{width:85%;max-width:480px;object-fit:contain;display:block;transition:transform .4s ease;filter:drop-shadow(0 32px 64px rgba(0,0,0,0.15))}
.hero-img:hover{transform:scale(1.03)}
.hero-chip{position:absolute;bottom:40px;right:32px;background:${C.dark};color:#fff;border-radius:16px;padding:14px 20px}
.hero-chip-price{font-size:26px;font-weight:700;letter-spacing:-0.03em}
.hero-chip-orig{font-size:12px;color:rgba(255,255,255,0.4);text-decoration:line-through}
.hero-chip-save{font-size:11px;font-weight:700;color:${C.cyan};margin-top:2px}

/* FEATURES */
.features-section{background:${C.bg};padding:80px 40px}
.features-inner{max-width:960px;margin:0 auto}
.section-label{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.blue};margin-bottom:10px;text-align:center}
.section-title{font-size:clamp(26px,3vw,40px);font-weight:700;letter-spacing:-0.03em;text-align:center;margin-bottom:48px}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.feature-card{background:${C.white};border-radius:20px;padding:32px 28px;border:1px solid ${C.border};transition:transform .2s,box-shadow .2s}
.feature-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.07)}
.feature-icon{width:44px;height:44px;border-radius:12px;background:rgba(0,102,204,0.08);display:flex;align-items:center;justify-content:center;margin-bottom:18px;color:${C.blue}}
.feature-title{font-size:16px;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
.feature-desc{font-size:13.5px;color:${C.muted};line-height:1.6}

/* SPECS */
.specs-section{background:${C.dark};padding:80px 40px}
.specs-inner{max-width:960px;margin:0 auto}
.specs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;margin-top:48px}
.spec-card{background:#2C2C2E;padding:36px 24px;text-align:center}
.spec-value{font-size:38px;font-weight:700;color:${C.cyan};letter-spacing:-0.04em;line-height:1}
.spec-label{font-size:13px;font-weight:600;color:#fff;margin:8px 0 4px}
.spec-unit{font-size:11px;color:rgba(255,255,255,0.4)}

/* GALLERY */
.gallery-section{background:${C.white};padding:80px 40px}
.gallery-grid{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.gallery-left .main-img{width:100%;border-radius:20px;object-fit:contain;aspect-ratio:1;background:${C.bg};display:block}
.thumbs{display:flex;gap:10px;margin-top:12px}
.thumb{flex:1;border-radius:10px;overflow:hidden;border:2px solid transparent;cursor:pointer;aspect-ratio:1;transition:border-color .2s}
.thumb.active,.thumb:hover{border-color:${C.blue}}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.gallery-right .product-name{font-size:30px;font-weight:700;letter-spacing:-0.03em;margin-bottom:6px}
.gallery-right .product-sub{font-size:14px;color:${C.muted};margin-bottom:20px}
.gallery-right .rating-row{display:flex;align-items:center;gap:8px;margin-bottom:24px}
.gallery-right .stars{display:flex;gap:2px}
.gallery-right .rating-text{font-size:12px;color:${C.muted}}
.color-row{margin-bottom:20px}
.color-label{font-size:12px;font-weight:600;color:${C.dark};margin-bottom:10px}
.color-swatches{display:flex;gap:8px}
.color-swatch{width:28px;height:28px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .2s;outline:none}
.color-swatch.active{box-shadow:0 0 0 2px #fff,0 0 0 4px ${C.blue}}
.color-name-display{font-size:11px;color:${C.muted};margin-top:6px}
.price-block{margin-bottom:20px}
.price-main{font-size:36px;font-weight:700;letter-spacing:-0.03em}
.price-orig{font-size:18px;color:${C.muted};text-decoration:line-through;margin-left:8px}
.price-save{display:inline-block;background:rgba(0,199,190,0.12);color:${C.cyan};font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;margin-left:8px}
.add-btn{width:100%;padding:17px;background:${C.blue};color:#fff;font-size:15px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all .2s;margin-bottom:10px;letter-spacing:-0.01em}
.add-btn:hover{background:${C.blueHov};transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,102,204,0.3)}
.trust-badges{display:flex;gap:16px;flex-wrap:wrap}
.trust-badge{display:flex;align-items:center;gap:5px;font-size:11.5px;color:${C.muted}}
.trust-badge svg{color:${C.blue}}

/* COMPARE */
.compare-section{background:${C.bg};padding:80px 40px}
.compare-inner{max-width:800px;margin:0 auto}
.compare-table{width:100%;border-collapse:collapse;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);margin-top:40px}
.compare-table th{padding:16px 20px;font-size:12px;font-weight:700;text-align:center;background:${C.bg};color:${C.muted};letter-spacing:0.05em;text-transform:uppercase}
.compare-table th:first-child{text-align:left}
.compare-table th.ours{background:${C.blue};color:#fff}
.compare-row td{padding:14px 20px;font-size:13px;border-top:1px solid ${C.border};text-align:center;color:${C.muted}}
.compare-row td:first-child{text-align:left;color:${C.dark};font-weight:500}
.compare-ours-val{display:inline-flex;align-items:center;gap:5px;color:${C.blue};font-weight:700}
.compare-ours-val svg{color:${C.blue}}
.compare-other{color:#B0B0B5}

/* REVIEWS */
.reviews-section{background:${C.white};padding:80px 40px}
.reviews-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;max-width:900px;margin:40px auto 0}
.review-card{background:${C.bg};border-radius:16px;padding:24px}
.review-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.review-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
.review-name{font-size:13px;font-weight:700;color:${C.dark}}
.review-stars{display:flex;gap:2px;margin-top:2px}
.review-verified{margin-left:auto;font-size:10px;font-weight:700;color:${C.blue};display:flex;align-items:center;gap:3px}
.review-verified svg{color:${C.blue}}
.review-text{font-size:13px;color:${C.muted};line-height:1.65;font-style:italic}

/* FAQ */
.faq-section{background:${C.bg};padding:80px 40px}
.faq-inner{max-width:680px;margin:0 auto}
.faq-item{border-bottom:1px solid ${C.border}}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 0;font-size:14px;font-weight:600;color:${C.dark};background:none;border:none;cursor:pointer;text-align:left;gap:16px;transition:color .2s}
.faq-q:hover{color:${C.blue}}
.faq-ico{color:${C.muted};flex-shrink:0;transition:transform .2s}
.faq-a{padding-bottom:16px}
.faq-a p{font-size:13.5px;color:${C.muted};line-height:1.65}

/* CTA STRIP */
.cta-strip{background:${C.blue};padding:64px 40px;text-align:center}
.cta-strip h2{font-size:clamp(24px,3vw,36px);font-weight:700;color:#fff;letter-spacing:-0.03em;margin-bottom:12px}
.cta-strip p{font-size:15px;color:rgba(255,255,255,0.65);margin-bottom:32px}
.cta-strip a{display:inline-flex;align-items:center;gap:8px;background:#fff;color:${C.blue};font-size:15px;font-weight:700;padding:16px 36px;border-radius:12px;text-decoration:none;transition:transform .2s,box-shadow .2s}
.cta-strip a:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15)}

/* FOOTER */
.footer{background:${C.dark};padding:56px 40px 28px}
.footer-inner{max-width:960px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-brand{font-size:17px;font-weight:700;color:#fff;margin-bottom:10px;letter-spacing:-0.02em}
.footer-tagline{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;max-width:200px}
.footer-col-title{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:14px}
.footer-link{display:block;font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;margin-bottom:8px;transition:color .2s}
.footer-link:hover{color:rgba(255,255,255,0.75)}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:11px;color:rgba(255,255,255,0.2)}

/* RESPONSIVE */
@media(max-width:900px){
  .nav-links{display:none}
  .hero{grid-template-columns:1fr}
  .hero-right{height:380px}
  .hero-left{padding:60px 28px}
  .features-grid,.specs-grid{grid-template-columns:1fr 1fr}
  .gallery-grid{grid-template-columns:1fr;gap:32px}
  .reviews-grid{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr 1fr;gap:28px}
}
@media(max-width:600px){
  .features-grid,.specs-grid{grid-template-columns:1fr}
  .hero-btns{flex-direction:column}
  .footer-top{grid-template-columns:1fr}
}
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-logo">${productName.split(' ')[0]}</div>
  <div class="nav-links">
    <a class="nav-link" href="javascript:void(0)">Features</a>
    <a class="nav-link" href="javascript:void(0)">Specs</a>
    <a class="nav-link" href="javascript:void(0)">Reviews</a>
    <a class="nav-link" href="javascript:void(0)">Compare</a>
  </div>
  <a class="nav-cta" href="javascript:void(0)">Order Now</a>
</nav>

<div class="announce">
  ${urgency.replace(/⚡\s?/,'<span>⚡</span> ')}
</div>

<section class="hero">
  <div class="hero-left">
    <div class="hero-badge">${ICON_BOLT} 2025 Award Winner</div>
    <h1 class="hero-h1">${headline}</h1>
    <p class="hero-sub">${subtitle}</p>
    <ul class="hero-benefits">${benefitsHTML}</ul>
    <div class="hero-rating">
      <div class="hero-stars">${stars(5)}</div>
      <span class="hero-rating-text"><strong>4.9/5</strong> · 8,400+ verified reviews</span>
    </div>
    <div class="hero-urgency">${urgency}</div>
    <div class="hero-btns">
      <a href="javascript:void(0)" class="btn-primary">${ctaText}</a>
      <a href="javascript:void(0)" class="btn-secondary">See Full Specs</a>
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-img" src="${img(0)}" alt="${productName}" id="hero-main-img">
    <div class="hero-chip">
      <div class="hero-chip-price">$${price.replace(/[^0-9.]/g,'')}</div>
      <div class="hero-chip-orig">$${originalPrice.replace(/[^0-9.]/g,'')}</div>
      <div class="hero-chip-save">Save ${Math.round((1-parseFloat(price.replace(/[^0-9.]/g,''))/parseFloat(originalPrice.replace(/[^0-9.]/g,'')||'1'))*100)}%</div>
    </div>
  </div>
</section>

<section class="features-section">
  <div class="features-inner">
    <div class="section-label">Why It's Different</div>
    <h2 class="section-title">Engineered for the extraordinary.</h2>
    <div class="features-grid">${featuresHTML}</div>
  </div>
</section>

<section class="specs-section">
  <div class="specs-inner">
    <div class="section-label" style="color:${C.cyan};text-align:center">Technical Specs</div>
    <h2 class="section-title" style="color:#fff;text-align:center">The numbers speak for themselves.</h2>
    <div class="specs-grid">${specsHTML}</div>
  </div>
</section>

<section class="gallery-section">
  <div class="gallery-grid">
    <div class="gallery-left">
      <img src="${img(0)}" alt="${productName}" class="main-img" id="main-img">
      <div class="thumbs">${thumbsHTML}</div>
    </div>
    <div class="gallery-right">
      <div class="product-name">${productName}</div>
      <div class="product-sub">Next-generation performance · Built to last</div>
      <div class="rating-row">
        <div class="stars">${stars(5)}</div>
        <span class="rating-text">4.9 · 8,400+ reviews</span>
      </div>
      <div class="color-row">
        <div class="color-label">Color: <span id="color-name-display">${COLORS[0].name}</span></div>
        <div class="color-swatches">${colorsHTML}</div>
      </div>
      <div class="price-block">
        <span class="price-main">$${price.replace(/[^0-9.]/g,'')}</span>
        <span class="price-orig">$${originalPrice.replace(/[^0-9.]/g,'')}</span>
        <span class="price-save">Save ${Math.round((1-parseFloat(price.replace(/[^0-9.]/g,''))/parseFloat(originalPrice.replace(/[^0-9.]/g,'')||'1'))*100)}%</span>
      </div>
      <button class="add-btn">${ctaText}</button>
      <div class="trust-badges">
        <div class="trust-badge">${ICON_TRUCK} Free shipping</div>
        <div class="trust-badge">${ICON_SHIELD} 2-year warranty</div>
        <div class="trust-badge">${ICON_CHECK} 30-day returns</div>
      </div>
    </div>
  </div>
</section>

<section class="compare-section">
  <div class="compare-inner">
    <div class="section-label" style="text-align:center">Comparison</div>
    <h2 class="section-title" style="text-align:center">See why we win.</h2>
    <table class="compare-table">
      <thead>
        <tr>
          <th style="text-align:left">Feature</th>
          <th class="ours">${productName.split(' ')[0]}</th>
          <th>Competitor A</th>
          <th>Competitor B</th>
        </tr>
      </thead>
      <tbody>${compareHTML}</tbody>
    </table>
  </div>
</section>

<section class="reviews-section">
  <div style="max-width:900px;margin:0 auto">
    <div class="section-label" style="text-align:center">Reviews</div>
    <h2 class="section-title" style="text-align:center">8,400+ happy customers.</h2>
    <div class="reviews-grid">${reviewsHTML}</div>
  </div>
</section>

<section class="faq-section">
  <div class="faq-inner">
    <div class="section-label" style="text-align:center">FAQ</div>
    <h2 class="section-title" style="text-align:center;margin-bottom:40px">Common questions.</h2>
    ${faqHTML}
  </div>
</section>

<div class="cta-strip">
  <h2>Ready to upgrade?</h2>
  <p>Join 200,000+ customers who made the switch. Free shipping, 30-day returns, 2-year warranty.</p>
  <a href="javascript:void(0)">${ctaText}</a>
</div>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand">${productName.split(' ')[0]}</div>
        <p class="footer-tagline">Technology engineered for real life. No compromises.</p>
      </div>
      <div>
        <div class="footer-col-title">Product</div>
        <a class="footer-link" href="javascript:void(0)">Features</a>
        <a class="footer-link" href="javascript:void(0)">Specs</a>
        <a class="footer-link" href="javascript:void(0)">Compare</a>
        <a class="footer-link" href="javascript:void(0)">Accessories</a>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <a class="footer-link" href="javascript:void(0)">About</a>
        <a class="footer-link" href="javascript:void(0)">Blog</a>
        <a class="footer-link" href="javascript:void(0)">Press</a>
        <a class="footer-link" href="javascript:void(0)">Careers</a>
      </div>
      <div>
        <div class="footer-col-title">Support</div>
        <a class="footer-link" href="javascript:void(0)">FAQ</a>
        <a class="footer-link" href="javascript:void(0)">Shipping</a>
        <a class="footer-link" href="javascript:void(0)">Returns</a>
        <a class="footer-link" href="javascript:void(0)">Warranty</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© ${new Date().getFullYear()} ${productName}. All rights reserved.</span>
      <span class="footer-copy">IP68 · BT 5.3 · NSF Certified</span>
    </div>
  </div>
</footer>

<script>
function selectImg(el, src) {
  document.getElementById('main-img').src = src;
  document.getElementById('hero-main-img').src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function pickColor(el, name) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('color-name-display').textContent = name;
}
function toggleFaq(i) {
  const a = document.getElementById('faq-a-' + i);
  const ico = document.getElementById('faq-ico-' + i);
  const btn = document.getElementById('faq-btn-' + i);
  const open = a.style.display !== 'none';
  a.style.display = open ? 'none' : 'block';
  ico.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
  btn.setAttribute('aria-expanded', String(!open));
}
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
});
</script>
</body>
</html>`
}
