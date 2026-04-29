import type { LandingPageData } from '@/types'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
]

const LIFESTYLE_IMGS = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',
]

const C = {
  bg:       '#FAF8F5',
  bgAlt:    '#F2EDE6',
  white:    '#FFFFFF',
  terra:    '#B5541B',
  terraHov: '#963F10',
  sand:     '#C9A96E',
  sandLight:'#F5EDD8',
  text:     '#1C1510',
  muted:    '#7A6A5A',
  border:   '#E5DDD4',
  dark:     '#1A1009',
  gold:     '#D4A853',
}

const ICON_CHECK   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_STAR    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const ICON_PLUS    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_TRUCK   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
const ICON_LEAF    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
const ICON_SHIELD  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const ICON_RECYCLE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`

function stars(n: number) {
  return Array.from({length:5}, (_,i) => `<span style="color:${i<n?C.gold:'#D5C9BB'}">${ICON_STAR}</span>`).join('')
}

const MATERIALS = [
  { icon: '🪵', name: 'Natural Wood',   desc: 'Solid oak and walnut sourced from sustainable FSC-certified forests. Each piece is unique.' },
  { icon: '🪡', name: 'Linen & Cotton', desc: 'OEKO-TEX certified fabric — soft, breathable, and designed to age beautifully over time.' },
  { icon: '🏺', name: 'Handmade Ceramic', desc: 'Hand-thrown by artisans. Slight variations in glaze make every piece one of a kind.' },
]

const REASSURANCE = [
  { icon: ICON_TRUCK,   label: 'Free Delivery',    sub: 'On all orders' },
  { icon: ICON_LEAF,    label: 'Handcrafted',      sub: 'By artisans' },
  { icon: ICON_RECYCLE, label: 'Eco Packaging',    sub: '100% recyclable' },
  { icon: ICON_SHIELD,  label: '30-Day Returns',   sub: 'No hassle' },
]

const REVIEWS_DATA = [
  { name: 'Marie L.',    rating: 5, text: 'The quality is beyond anything I expected. It transformed my living room completely. Friends keep asking where I got it.' },
  { name: 'Thomas B.',   rating: 5, text: 'Packaging was incredible — zero plastic, all recycled kraft. The piece arrived perfectly. Will order again.' },
  { name: 'Sophie R.',   rating: 5, text: 'I\'ve been searching for this style for years. Slow living, timeless design. This is exactly it. Worth every cent.' },
  { name: 'Lucas M.',    rating: 5, text: 'The grain of the wood is stunning in real life. Photos don\'t do it justice. This is true craftsmanship.' },
]

export function templateEtecCasa(data: LandingPageData): string {
  const img = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName   = data.product_name   || 'Artisan Oak Side Table'
  const headline      = data.headline       || 'Your home should tell your story.'
  const subtitle      = data.subtitle       || 'Handcrafted from sustainably sourced oak. Designed to last a lifetime — and look better with every year that passes.'
  const ctaText       = data.cta            || 'Shop Now — Free Delivery'
  const urgency       = data.urgency        || '🌿 Limited batch — Handcrafted in small quantities'
  const price         = data.price          || '189'
  const originalPrice = data.original_price || '249'

  const benefitsRaw = data.benefits || []
  const benefitsList = [
    benefitsRaw[0] || 'Sustainably sourced FSC-certified wood',
    benefitsRaw[1] || 'Handcrafted by skilled artisans — no mass production',
    benefitsRaw[2] || 'Unique grain pattern — every piece is one of a kind',
    benefitsRaw[3] || 'Ships fully assembled — ready to place in your home',
    benefitsRaw[4] || '30-day return policy — no questions asked',
  ]

  const faqRaw = data.faq || []
  const faqs = faqRaw.length > 0 ? faqRaw : [
    { question: 'Where is it made?',           answer: 'Handcrafted in our atelier in Portugal by a team of 12 artisans. Each piece takes 3–4 hours to complete.' },
    { question: 'How is it shipped?',           answer: 'Ships fully assembled in plastic-free packaging. Delivered in 5–8 days with white-glove delivery option.' },
    { question: 'Can I return it?',             answer: '30-day hassle-free returns. Just contact us and we\'ll arrange a free pickup.' },
    { question: 'Are dimensions customizable?', answer: 'Yes! Custom sizes available with a 3–4 week lead time. Contact us for a quote.' },
  ]

  const materialsHTML = MATERIALS.map(m => `
    <div class="mat-card">
      <div class="mat-icon">${m.icon}</div>
      <h3 class="mat-name">${m.name}</h3>
      <p class="mat-desc">${m.desc}</p>
    </div>`).join('')

  const reassHTML = REASSURANCE.map(r => `
    <div class="reass-item">
      <div class="reass-icon">${r.icon}</div>
      <div class="reass-label">${r.label}</div>
      <div class="reass-sub">${r.sub}</div>
    </div>`).join('')

  const reviewsHTML = REVIEWS_DATA.map((r, i) => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-av" style="background:${['#B5541B','#C9A96E','#7A6A5A','#1A1009'][i%4]}">${r.name[0]}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-stars">${stars(r.rating)}</div>
        </div>
        <div class="review-badge">${ICON_CHECK} Verified</div>
      </div>
      <p class="review-text">"${r.text}"</p>
    </div>`).join('')

  const thumbsHTML = Array.from({length:4}, (_,i) => `
    <div class="thumb${i===0?' active':''}" onclick="selectImg(this,'${img(i)}')" role="button" tabindex="0">
      <img src="${img(i)}" alt="Vue ${i+1}" loading="lazy">
    </div>`).join('')

  const benefitsHTML = benefitsList.map(b => `<li class="hero-b">${ICON_CHECK} ${b}</li>`).join('')

  const faqHTML = faqs.map((f,i) => `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(${i})" id="fq${i}" aria-expanded="false">
        <span>${f.question}</span>
        <span class="faq-ico" id="fi${i}">${ICON_PLUS}</span>
      </button>
      <div class="faq-a" id="fa${i}" style="display:none"><p>${f.answer}</p></div>
    </div>`).join('')

  const priceSave = Math.round((1 - parseFloat(price.replace(/[^0-9.]/g,'')) / parseFloat(originalPrice.replace(/[^0-9.]/g,'')||'1')) * 100)

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${productName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.text};line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3,.serif{font-family:'Cormorant Garamond',Georgia,serif}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,248,245,0.92);backdrop-filter:blur(16px);border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;transition:box-shadow .3s}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${C.terra};letter-spacing:0.02em}
.nav-links{display:flex;gap:28px}
.nav-link{font-size:13px;font-weight:400;color:${C.muted};text-decoration:none;transition:color .2s}
.nav-link:hover{color:${C.text}}
.nav-cta{background:${C.terra};color:#fff;font-size:13px;font-weight:500;padding:9px 22px;border-radius:100px;text-decoration:none;transition:background .2s;letter-spacing:0.01em}
.nav-cta:hover{background:${C.terraHov}}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 64px);margin-top:64px;background:${C.bg}}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 56px 80px 80px}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:${C.sandLight};border:1px solid rgba(185,84,27,0.2);color:${C.terra};font-size:10.5px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:6px 14px;border-radius:100px;margin-bottom:20px;width:fit-content}
.hero-h1{font-size:clamp(36px,4vw,56px);font-weight:700;line-height:1.1;color:${C.text};margin-bottom:18px;letter-spacing:-0.01em}
.hero-sub{font-size:16px;color:${C.muted};line-height:1.7;margin-bottom:28px;max-width:440px;font-weight:300}
.hero-list{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:28px}
.hero-b{display:flex;align-items:center;gap:9px;font-size:13.5px;color:${C.text};font-weight:400}
.hero-b svg{color:${C.terra};flex-shrink:0}
.hero-rating{display:flex;align-items:center;gap:8px;margin-bottom:20px}
.hero-stars{display:flex;gap:2px}
.hero-rating-text{font-size:12px;color:${C.muted}}
.hero-urgency{background:${C.sandLight};border:1px solid rgba(185,84,27,0.15);color:${C.terra};font-size:12px;font-weight:500;padding:8px 16px;border-radius:8px;margin-bottom:24px}
.hero-btns{display:flex;gap:12px}
.btn-main{display:inline-flex;align-items:center;gap:8px;background:${C.terra};color:#fff;font-size:14px;font-weight:500;padding:15px 32px;border-radius:100px;text-decoration:none;transition:all .2s;border:none;cursor:pointer;letter-spacing:0.01em}
.btn-main:hover{background:${C.terraHov};transform:translateY(-1px);box-shadow:0 6px 20px rgba(181,84,27,0.25)}
.btn-sec{display:inline-flex;align-items:center;gap:8px;background:transparent;color:${C.text};font-size:14px;font-weight:400;padding:15px 24px;border-radius:100px;text-decoration:none;transition:all .2s;border:1.5px solid ${C.border};cursor:pointer}
.btn-sec:hover{border-color:${C.terra};color:${C.terra}}

/* HERO RIGHT */
.hero-right{position:relative;overflow:hidden}
.hero-img-main{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.hero-right:hover .hero-img-main{transform:scale(1.03)}
.hero-chip{position:absolute;bottom:32px;left:32px;background:rgba(250,248,245,0.92);backdrop-filter:blur(12px);border:1px solid ${C.border};border-radius:16px;padding:16px 20px}
.hero-chip-name{font-size:11px;color:${C.muted};margin-bottom:4px}
.hero-chip-price{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:700;color:${C.terra};line-height:1}
.hero-chip-orig{font-size:12px;color:${C.muted};text-decoration:line-through}
.hero-chip-save{font-size:11px;font-weight:600;color:${C.terra};margin-top:2px}

/* REASSURANCE */
.reass-bar{background:${C.white};border-bottom:1px solid ${C.border};padding:24px 40px}
.reass-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.reass-item{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}
.reass-icon{color:${C.terra};width:36px;height:36px;border-radius:10px;background:${C.sandLight};display:flex;align-items:center;justify-content:center}
.reass-label{font-size:13px;font-weight:600;color:${C.text}}
.reass-sub{font-size:11px;color:${C.muted}}

/* MATERIALS */
.mat-section{background:${C.bgAlt};padding:80px 40px}
.mat-inner{max-width:960px;margin:0 auto}
.section-eyebrow{font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${C.terra};text-align:center;margin-bottom:10px}
.section-h{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,42px);font-weight:700;text-align:center;margin-bottom:48px;color:${C.text}}
.mat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.mat-card{background:${C.white};border:1px solid ${C.border};border-radius:20px;padding:32px 28px;text-align:center;transition:transform .2s,box-shadow .2s}
.mat-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.07)}
.mat-icon{font-size:36px;margin-bottom:14px;display:block}
.mat-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${C.text};margin-bottom:8px}
.mat-desc{font-size:13px;color:${C.muted};line-height:1.65;font-weight:300}

/* GALLERY */
.gallery-section{background:${C.white};padding:80px 40px}
.gallery-grid{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.main-img{width:100%;border-radius:20px;object-fit:cover;aspect-ratio:4/5;display:block;transition:opacity .3s}
.thumbs{display:flex;gap:10px;margin-top:12px}
.thumb{flex:1;border-radius:10px;overflow:hidden;border:2px solid transparent;cursor:pointer;aspect-ratio:1;transition:border-color .2s}
.thumb.active,.thumb:hover{border-color:${C.terra}}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.prod-name{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:${C.text};margin-bottom:6px}
.prod-sub{font-size:13px;color:${C.muted};margin-bottom:18px;font-weight:300}
.prod-rating{display:flex;align-items:center;gap:8px;margin-bottom:24px}
.prod-stars{display:flex;gap:2px}
.prod-rating-text{font-size:12px;color:${C.muted}}
.price-row{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.price-main{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:${C.text}}
.price-orig{font-size:18px;color:${C.muted};text-decoration:line-through}
.price-save{font-size:12px;font-weight:600;color:${C.terra};background:${C.sandLight};padding:3px 10px;border-radius:100px}
.price-note{font-size:11px;color:${C.muted};margin-bottom:22px}
.add-btn{width:100%;padding:16px;background:${C.terra};color:#fff;font-size:14px;font-weight:500;border:none;border-radius:100px;cursor:pointer;transition:all .2s;letter-spacing:0.01em;margin-bottom:10px}
.add-btn:hover{background:${C.terraHov};transform:translateY(-1px);box-shadow:0 6px 20px rgba(181,84,27,0.25)}
.sec-btn{width:100%;padding:14px;background:transparent;color:${C.text};font-size:14px;border:1.5px solid ${C.border};border-radius:100px;cursor:pointer;transition:all .2s;margin-bottom:22px}
.sec-btn:hover{border-color:${C.terra};color:${C.terra}}
.trust-row{display:flex;gap:16px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:5px;font-size:12px;color:${C.muted}}
.trust-item svg{color:${C.terra}}

/* LIFESTYLE */
.lifestyle-section{background:${C.bg};padding:80px 40px}
.lifestyle-inner{max-width:960px;margin:0 auto}
.lifestyle-grid{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;gap:12px;height:500px}
.lifestyle-img{width:100%;height:100%;object-fit:cover;border-radius:16px;display:block}
.lifestyle-img-main{grid-row:1/3}
.lifestyle-tag{position:absolute;bottom:12px;left:12px;background:rgba(250,248,245,0.88);backdrop-filter:blur(8px);color:${C.text};font-size:11px;font-weight:600;padding:5px 12px;border-radius:100px}
.lifestyle-wrap{position:relative}

/* REVIEWS */
.reviews-section{background:${C.white};padding:80px 40px}
.reviews-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;max-width:900px;margin:40px auto 0}
.review-card{background:${C.bg};border-radius:16px;padding:24px;border:1px solid ${C.border}}
.review-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.review-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;font-family:'Cormorant Garamond',serif}
.review-name{font-size:13px;font-weight:600;color:${C.text}}
.review-stars{display:flex;gap:2px;margin-top:2px}
.review-badge{margin-left:auto;font-size:10px;font-weight:600;color:${C.terra};display:flex;align-items:center;gap:3px}
.review-badge svg{color:${C.terra}}
.review-text{font-size:13px;color:${C.muted};line-height:1.7;font-style:italic;font-weight:300}

/* BUNDLE */
.bundle-section{background:${C.bgAlt};padding:80px 40px}
.bundle-inner{max-width:720px;margin:0 auto}
.bundle-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:40px}
.bundle-card{background:${C.white};border:2px solid ${C.border};border-radius:20px;padding:28px;text-align:center;transition:border-color .2s,transform .2s}
.bundle-card:hover{border-color:${C.terra};transform:translateY(-3px)}
.bundle-card.featured{border-color:${C.terra};background:${C.sandLight}}
.bundle-badge{display:inline-block;background:${C.terra};color:#fff;font-size:10px;font-weight:700;padding:3px 12px;border-radius:100px;margin-bottom:12px}
.bundle-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${C.text};margin-bottom:4px}
.bundle-desc{font-size:12px;color:${C.muted};margin-bottom:16px}
.bundle-price{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:${C.terra}}
.bundle-orig{font-size:14px;color:${C.muted};text-decoration:line-through;margin-left:6px}
.bundle-btn{margin-top:16px;width:100%;padding:12px;background:${C.terra};color:#fff;border:none;border-radius:100px;font-size:13px;cursor:pointer;font-weight:500;transition:background .2s}
.bundle-btn:hover{background:${C.terraHov}}
.bundle-btn.outline{background:transparent;color:${C.terra};border:1.5px solid ${C.terra}}
.bundle-btn.outline:hover{background:${C.terra};color:#fff}

/* FAQ */
.faq-section{background:${C.white};padding:80px 40px}
.faq-inner{max-width:680px;margin:0 auto}
.faq-item{border-bottom:1px solid ${C.border}}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 0;font-size:14px;font-weight:500;color:${C.text};background:none;border:none;cursor:pointer;text-align:left;gap:16px;transition:color .2s}
.faq-q:hover{color:${C.terra}}
.faq-ico{color:${C.muted};flex-shrink:0;transition:transform .2s}
.faq-a{padding-bottom:16px}
.faq-a p{font-size:13.5px;color:${C.muted};line-height:1.65;font-weight:300}

/* FOOTER */
.footer{background:${C.dark};padding:60px 40px 28px}
.footer-inner{max-width:960px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-brand{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:${C.sand};margin-bottom:10px}
.footer-tagline{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.65;max-width:200px;font-weight:300}
.footer-col-title{font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:14px}
.footer-link{display:block;font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;margin-bottom:9px;transition:color .2s;font-weight:300}
.footer-link:hover{color:rgba(255,255,255,0.7)}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:11px;color:rgba(255,255,255,0.18)}

@media(max-width:900px){
  .nav-links{display:none}
  .hero{grid-template-columns:1fr}
  .hero-right{height:360px}
  .hero-left{padding:56px 28px}
  .mat-grid{grid-template-columns:1fr}
  .gallery-grid{grid-template-columns:1fr;gap:32px}
  .reviews-grid,.bundle-grid{grid-template-columns:1fr}
  .reass-inner{grid-template-columns:repeat(2,1fr)}
  .footer-top{grid-template-columns:1fr 1fr;gap:28px}
  .lifestyle-grid{height:300px}
}
@media(max-width:600px){
  .hero-btns{flex-direction:column}
  .footer-top{grid-template-columns:1fr}
  .reass-inner{grid-template-columns:1fr 1fr}
}
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-logo">Casa</div>
  <div class="nav-links">
    <a class="nav-link" href="javascript:void(0)">Collection</a>
    <a class="nav-link" href="javascript:void(0)">Materials</a>
    <a class="nav-link" href="javascript:void(0)">Reviews</a>
    <a class="nav-link" href="javascript:void(0)">About</a>
  </div>
  <a class="nav-cta" href="javascript:void(0)">Shop Now</a>
</nav>

<section class="hero">
  <div class="hero-left">
    <div class="hero-badge">🪵 Handcrafted</div>
    <h1 class="hero-h1">${headline}</h1>
    <p class="hero-sub">${subtitle}</p>
    <ul class="hero-list">${benefitsHTML}</ul>
    <div class="hero-rating">
      <div class="hero-stars">${stars(5)}</div>
      <span class="hero-rating-text"><strong>4.8/5</strong> · 2,400+ happy homes</span>
    </div>
    <div class="hero-urgency">${urgency}</div>
    <div class="hero-btns">
      <a href="javascript:void(0)" class="btn-main">${ctaText}</a>
      <a href="javascript:void(0)" class="btn-sec">View Details</a>
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-img-main" src="${img(0)}" alt="${productName}">
    <div class="hero-chip">
      <div class="hero-chip-name">${productName}</div>
      <div class="hero-chip-price">€${price.replace(/[^0-9.]/g,'')}</div>
      <div class="hero-chip-orig">€${originalPrice.replace(/[^0-9.]/g,'')}</div>
      <div class="hero-chip-save">Save ${priceSave}%</div>
    </div>
  </div>
</section>

<div class="reass-bar">
  <div class="reass-inner">${reassHTML}</div>
</div>

<section class="mat-section">
  <div class="mat-inner">
    <div class="section-eyebrow">Our Materials</div>
    <h2 class="section-h">Only the finest natural materials.</h2>
    <div class="mat-grid">${materialsHTML}</div>
  </div>
</section>

<section class="gallery-section">
  <div class="gallery-grid">
    <div>
      <img src="${img(0)}" alt="${productName}" class="main-img" id="main-img">
      <div class="thumbs">${thumbsHTML}</div>
    </div>
    <div>
      <div class="prod-name">${productName}</div>
      <div class="prod-sub">Handcrafted · Sustainably sourced · Ships assembled</div>
      <div class="prod-rating">
        <div class="prod-stars">${stars(5)}</div>
        <span class="prod-rating-text">4.8 · 2,400+ reviews</span>
      </div>
      <div class="price-row">
        <span class="price-main">€${price.replace(/[^0-9.]/g,'')}</span>
        <span class="price-orig">€${originalPrice.replace(/[^0-9.]/g,'')}</span>
        <span class="price-save">−${priceSave}%</span>
      </div>
      <p class="price-note">Free delivery · Fully assembled · 30-day returns</p>
      <button class="add-btn">${ctaText}</button>
      <button class="sec-btn">Add to Wishlist</button>
      <div class="trust-row">
        <div class="trust-item">${ICON_TRUCK} Free delivery</div>
        <div class="trust-item">${ICON_LEAF} FSC certified</div>
        <div class="trust-item">${ICON_SHIELD} 30-day returns</div>
      </div>
    </div>
  </div>
</section>

<section class="lifestyle-section">
  <div class="lifestyle-inner">
    <div class="section-eyebrow">In Your Home</div>
    <h2 class="section-h" style="margin-bottom:32px">See how it transforms a space.</h2>
    <div class="lifestyle-grid">
      <div class="lifestyle-wrap">
        <img src="${LIFESTYLE_IMGS[0]}" alt="Lifestyle 1" class="lifestyle-img lifestyle-img-main">
        <span class="lifestyle-tag">Living Room</span>
      </div>
      <div class="lifestyle-wrap">
        <img src="${LIFESTYLE_IMGS[1]}" alt="Lifestyle 2" class="lifestyle-img">
        <span class="lifestyle-tag">Bedroom</span>
      </div>
      <div class="lifestyle-wrap">
        <img src="${LIFESTYLE_IMGS[2]}" alt="Lifestyle 3" class="lifestyle-img">
        <span class="lifestyle-tag">Study</span>
      </div>
    </div>
  </div>
</section>

<section class="reviews-section">
  <div style="max-width:900px;margin:0 auto">
    <div class="section-eyebrow">Reviews</div>
    <h2 class="section-h">2,400+ happy homes.</h2>
    <div class="reviews-grid">${reviewsHTML}</div>
  </div>
</section>

<section class="bundle-section">
  <div class="bundle-inner">
    <div class="section-eyebrow">Bundles</div>
    <h2 class="section-h">Better together.</h2>
    <div class="bundle-grid">
      <div class="bundle-card">
        <div class="bundle-name">${productName}</div>
        <div class="bundle-desc">Single piece · Ready to ship</div>
        <div>
          <span class="bundle-price">€${price.replace(/[^0-9.]/g,'')}</span>
          <span class="bundle-orig">€${originalPrice.replace(/[^0-9.]/g,'')}</span>
        </div>
        <button class="bundle-btn outline">Add to Cart</button>
      </div>
      <div class="bundle-card featured">
        <div class="bundle-badge">Best Value</div>
        <div class="bundle-name">${productName} Duo</div>
        <div class="bundle-desc">2 pieces · Matching set · Extra saving</div>
        <div>
          <span class="bundle-price">€${Math.round(parseFloat(price.replace(/[^0-9.]/g,'')||'189') * 1.7)}</span>
          <span class="bundle-orig">€${Math.round(parseFloat(price.replace(/[^0-9.]/g,'')||'189') * 2)}</span>
        </div>
        <button class="bundle-btn">Get the Duo</button>
      </div>
    </div>
  </div>
</section>

<section class="faq-section">
  <div class="faq-inner">
    <div class="section-eyebrow">FAQ</div>
    <h2 class="section-h" style="margin-bottom:36px">Frequently asked.</h2>
    ${faqHTML}
  </div>
</section>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand">Casa</div>
        <p class="footer-tagline">Handcrafted pieces for homes that tell a story.</p>
      </div>
      <div>
        <div class="footer-col-title">Shop</div>
        <a class="footer-link" href="javascript:void(0)">Furniture</a>
        <a class="footer-link" href="javascript:void(0)">Textiles</a>
        <a class="footer-link" href="javascript:void(0)">Ceramics</a>
        <a class="footer-link" href="javascript:void(0)">Bundles</a>
      </div>
      <div>
        <div class="footer-col-title">About</div>
        <a class="footer-link" href="javascript:void(0)">Our Story</a>
        <a class="footer-link" href="javascript:void(0)">Materials</a>
        <a class="footer-link" href="javascript:void(0)">Artisans</a>
        <a class="footer-link" href="javascript:void(0)">Press</a>
      </div>
      <div>
        <div class="footer-col-title">Help</div>
        <a class="footer-link" href="javascript:void(0)">FAQ</a>
        <a class="footer-link" href="javascript:void(0)">Delivery</a>
        <a class="footer-link" href="javascript:void(0)">Returns</a>
        <a class="footer-link" href="javascript:void(0)">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© ${new Date().getFullYear()} Casa. All rights reserved.</span>
      <span class="footer-copy">FSC Certified · OEKO-TEX · Handmade in EU</span>
    </div>
  </div>
</footer>

<script>
function selectImg(el, src) {
  document.getElementById('main-img').src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function toggleFaq(i) {
  const a = document.getElementById('fa' + i);
  const ico = document.getElementById('fi' + i);
  const btn = document.getElementById('fq' + i);
  const open = a.style.display !== 'none';
  a.style.display = open ? 'none' : 'block';
  ico.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
  btn.setAttribute('aria-expanded', String(!open));
}
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.boxShadow = window.scrollY > 10 ? '0 2px 16px rgba(28,21,16,0.08)' : 'none';
});
</script>
</body>
</html>`
}
