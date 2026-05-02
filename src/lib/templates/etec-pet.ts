import type { LandingPageData } from '@/types'

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
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
]

const C = {
  bg:       '#FFFCF7',
  bgWarm:   '#FEF6EC',
  white:    '#FFFFFF',
  orange:   '#E8722A',
  orangeHov:'#C85D1A',
  orangeLight:'#FEF0E4',
  mustard:  '#F0A500',
  text:     '#1E1206',
  muted:    '#7A6355',
  border:   '#EDE0D4',
  dark:     '#1A0F05',
  gold:     '#F0A500',
}

const ICON_CHECK  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_STAR   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const ICON_PLUS   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_MINUS  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_TRUCK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
const ICON_SHIELD = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const ICON_LEAF   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
const ICON_HEART  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`

function stars(n: number) {
  return Array.from({length:5}, (_,i) => `<span style="color:${i<n?C.gold:'#DDD'}">${ICON_STAR}</span>`).join('')
}

const BENEFITS_GRID = [
  { emoji: '🌱', title: 'All Natural',      desc: 'Zero artificial ingredients. Every component is safe if your pet chews on it.' },
  { emoji: '🛡️', title: 'Vet Approved',    desc: 'Reviewed and recommended by 200+ licensed veterinarians across North America.' },
  { emoji: '💪', title: 'Ultra Durable',    desc: 'Tested to withstand 10,000+ uses. Built for the most energetic dogs and cats.' },
  { emoji: '♻️', title: 'Eco-Friendly',    desc: 'Sustainable materials and packaging. Good for your pet and good for the planet.' },
  { emoji: '🎯', title: 'Perfect Fit',      desc: 'Available in 4 sizes. Our fit guide ensures your pet\'s perfect match every time.' },
  { emoji: '❤️', title: 'Made with Love',   desc: 'Designed by pet parents, for pet parents. We have a dog and 2 cats ourselves.' },
]

const HOW_STEPS = [
  { num: '01', title: 'Choose your size',  desc: 'Use our fit guide to find the perfect size for your pet\'s weight and breed.' },
  { num: '02', title: 'We deliver fast',   desc: 'Ships in 24h. Arrives in 2–4 days in eco-friendly, plastic-free packaging.' },
  { num: '03', title: 'Happy pet, happy you', desc: 'Watch your pet go wild. Not satisfied? We\'ll refund every cent.' },
]

const REVIEWS_DATA = [
  { name: 'Sarah L.',  pet: '🐕 Labrador owner',  rating: 5, text: 'My Lab destroys everything. This is the first toy that survived a full week — he\'s obsessed with it. Worth every penny.' },
  { name: 'Marc D.',   pet: '🐈 Cat mom',          rating: 5, text: 'My cat is picky about EVERYTHING. She was playing with this within 5 minutes of opening the box. I\'m genuinely shocked.' },
  { name: 'Julia R.',  pet: '🐕 Golden owner',     rating: 5, text: 'Super soft materials, love that it\'s all natural. My puppy chewed on it and I had zero worries about toxins. Reordering now.' },
  { name: 'Tom K.',    pet: '🐈 Tabby owner',      rating: 5, text: 'Our vet actually recommended this brand. Fantastic quality, fast shipping, and my cat hasn\'t stopped playing with it. 5 stars.' },
  { name: 'Anna M.',   pet: '🐕 Beagle owner',     rating: 5, text: 'I\'ve tried 12 different toys for my beagle. This is the only one she didn\'t destroy in 24 hours. We now have 3 of them.' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const PET_THEME: SectionTheme = {
  primary:    '#f0a500',
  accent:     '#fef8eb',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#ffffff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecPet(data: LandingPageData): string {
  const img = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName   = data.product_name   || 'BarkBuddy Pro Chew Toy'
  const headline      = data.headline       || 'Because your pet deserves the best.'
  const subtitle      = data.subtitle       || '100% natural materials, vet-approved, built to last. The toy your dog or cat won\'t be able to put down.'
  const ctaText       = data.cta            || 'Get Yours — Free Shipping 🐾'
  const urgency       = data.urgency        || '🐾 Free shipping on all orders · 30-day guarantee'
  const price         = data.price          || '34'
  const originalPrice = data.original_price || '49'

  const benefitsRaw = data.benefits || []
  const benefitsList = [
    benefitsRaw[0] || '100% natural, non-toxic materials — vet certified safe',
    benefitsRaw[1] || 'Ultra durable — tested to 10,000+ uses',
    benefitsRaw[2] || 'Available in 5 sizes — from chihuahua to great dane',
    benefitsRaw[3] || 'Easy to clean — dishwasher safe',
    benefitsRaw[4] || '30-day money-back guarantee if your pet doesn\'t love it',
  ]

  const faqRaw = data.faq || []
  const faqs = faqRaw.length > 0 ? faqRaw : [
    { question: 'Is it safe if my pet swallows pieces?', answer: 'Yes. Made from 100% natural, non-toxic rubber and organic cotton. All materials are food-grade safe and vet-approved.' },
    { question: 'Which size should I choose?',           answer: 'XS (under 5kg), S (5–10kg), M (10–20kg), L (20–35kg), XL (35kg+). When in doubt, size up for safety.' },
    { question: 'How long does shipping take?',          answer: 'Ships within 24h. Delivered in 2–4 business days. Free shipping on all orders.' },
    { question: 'What if my pet doesn\'t like it?',     answer: '30-day happiness guarantee. If your pet doesn\'t go crazy for it, contact us for a full refund — no questions asked.' },
  ]

  const benefitsHTML = benefitsList.map(b => `<li class="hero-b">${ICON_CHECK} ${b}</li>`).join('')
  const benefitsGridHTML = BENEFITS_GRID.map(b => `
    <div class="ben-card">
      <div class="ben-emoji">${b.emoji}</div>
      <h3 class="ben-title">${b.title}</h3>
      <p class="ben-desc">${b.desc}</p>
    </div>`).join('')

  const stepsHTML = HOW_STEPS.map(s => `
    <div class="step">
      <div class="step-num">${s.num}</div>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    </div>`).join('')

  const reviewsHTML = REVIEWS_DATA.map((r,i) => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-av" style="background:${['#E8722A','#F0A500','#7A6355','#1A0F05','#C85D1A'][i%5]}">${r.name[0]}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-pet">${r.pet}</div>
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

  const sizesHTML = SIZES.map((s,i) => `
    <button class="size-btn${i===2?' active':''}" onclick="pickSize(this,'${s}')">${s}</button>`).join('')

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
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,'Inter','Helvetica Neue',sans-serif;background:${C.bg};color:${C.text};line-height:1.6;-webkit-font-smoothing:antialiased}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,252,247,0.92);backdrop-filter:blur(16px);border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:60px;transition:box-shadow .3s}
.nav-logo{font-size:18px;font-weight:800;color:${C.orange};display:flex;align-items:center;gap:6px}
.nav-links{display:flex;gap:24px}
.nav-link{font-size:13px;color:${C.muted};text-decoration:none;font-weight:500;transition:color .2s}
.nav-link:hover{color:${C.text}}
.nav-cta{background:${C.orange};color:#fff;font-size:13px;font-weight:700;padding:9px 20px;border-radius:10px;text-decoration:none;transition:background .2s}
.nav-cta:hover{background:${C.orangeHov}}

/* ANNOUNCE */
.announce{background:${C.orange};color:#fff;text-align:center;padding:10px;font-size:12px;font-weight:600;margin-top:60px}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 94px);background:${C.bg}}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 56px 80px 72px}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:${C.orangeLight};border:1px solid rgba(232,114,42,0.2);color:${C.orange};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:18px;width:fit-content}
.hero-h1{font-size:clamp(34px,4vw,52px);font-weight:800;line-height:1.1;color:${C.text};margin-bottom:16px;letter-spacing:-0.03em}
.hero-sub{font-size:16px;color:${C.muted};line-height:1.65;margin-bottom:24px;max-width:440px}
.hero-list{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
.hero-b{display:flex;align-items:center;gap:8px;font-size:13.5px;color:${C.text};font-weight:500}
.hero-b svg{color:${C.orange};flex-shrink:0}
.hero-rating{display:flex;align-items:center;gap:8px;margin-bottom:16px}
.hero-stars{display:flex;gap:2px}
.hero-rating-text{font-size:12px;color:${C.muted}}
.hero-urgency{background:${C.orangeLight};border:1px solid rgba(232,114,42,0.2);color:${C.orange};font-size:12px;font-weight:600;padding:8px 16px;border-radius:8px;margin-bottom:22px}
.hero-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${C.orange};color:#fff;font-size:15px;font-weight:700;padding:17px 36px;border-radius:14px;border:none;cursor:pointer;text-decoration:none;transition:all .2s;box-shadow:0 4px 20px rgba(232,114,42,0.3)}
.hero-cta:hover{background:${C.orangeHov};transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,114,42,0.4)}

/* HERO RIGHT */
.hero-right{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:${C.bgWarm}}
.hero-img{width:80%;max-width:440px;object-fit:contain;border-radius:24px;display:block;filter:drop-shadow(0 24px 48px rgba(30,18,6,0.15));transition:transform .4s}
.hero-img:hover{transform:scale(1.03)}
.hero-chip{position:absolute;top:32px;right:28px;background:${C.white};border:1px solid ${C.border};border-radius:14px;padding:14px 18px;text-align:center;box-shadow:0 4px 20px rgba(30,18,6,0.07)}
.hero-chip-emoji{font-size:28px;margin-bottom:4px}
.hero-chip-text{font-size:11px;font-weight:700;color:${C.text}}
.hero-chip-sub{font-size:10px;color:${C.muted}}

/* MEDIA */
.media-bar{background:${C.white};border-bottom:1px solid ${C.border};padding:20px 40px}
.media-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap}
.media-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};margin-right:20px}
.media-logo{font-size:12px;font-weight:700;color:#C4B5A8;padding:0 16px;border-left:1px solid ${C.border}}
.media-logo:first-of-type{border-left:none}

/* BENEFITS */
.ben-section{background:${C.bgWarm};padding:80px 40px}
.ben-inner{max-width:960px;margin:0 auto}
.section-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.orange};text-align:center;margin-bottom:10px}
.section-h{font-size:clamp(26px,3vw,40px);font-weight:800;letter-spacing:-0.03em;text-align:center;margin-bottom:48px}
.ben-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.ben-card{background:${C.white};border-radius:20px;padding:28px 24px;text-align:center;border:1px solid ${C.border};transition:transform .2s,box-shadow .2s}
.ben-card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(30,18,6,0.07)}
.ben-emoji{font-size:32px;margin-bottom:12px;display:block}
.ben-title{font-size:15px;font-weight:700;color:${C.text};margin-bottom:6px}
.ben-desc{font-size:12.5px;color:${C.muted};line-height:1.6}

/* GALLERY + BUY */
.buy-section{background:${C.white};padding:80px 40px}
.buy-grid{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.main-img{width:100%;border-radius:20px;object-fit:cover;aspect-ratio:1;display:block}
.thumbs{display:flex;gap:10px;margin-top:12px}
.thumb{flex:1;border-radius:10px;overflow:hidden;border:2px solid transparent;cursor:pointer;aspect-ratio:1;transition:border-color .2s}
.thumb.active,.thumb:hover{border-color:${C.orange}}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.prod-name{font-size:28px;font-weight:800;letter-spacing:-0.03em;color:${C.text};margin-bottom:6px}
.prod-sub{font-size:13px;color:${C.muted};margin-bottom:16px}
.prod-rating{display:flex;align-items:center;gap:8px;margin-bottom:20px}
.prod-stars{display:flex;gap:2px}
.prod-rating-text{font-size:12px;color:${C.muted}}
.size-label{font-size:12px;font-weight:700;color:${C.text};margin-bottom:8px}
.size-guide{font-size:11px;color:${C.orange};text-decoration:none;margin-left:8px}
.sizes{display:flex;gap:8px;margin-bottom:20px}
.size-btn{width:48px;height:48px;border-radius:10px;border:2px solid ${C.border};background:transparent;font-size:12px;font-weight:700;cursor:pointer;color:${C.text};transition:all .2s}
.size-btn.active,.size-btn:hover{border-color:${C.orange};color:${C.orange}}
.price-row{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.price-main{font-size:36px;font-weight:800;letter-spacing:-0.03em;color:${C.text}}
.price-orig{font-size:18px;color:${C.muted};text-decoration:line-through}
.price-save{font-size:12px;font-weight:700;color:${C.orange};background:${C.orangeLight};padding:3px 10px;border-radius:100px}
.price-note{font-size:11px;color:${C.muted};margin-bottom:20px}
.qty-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.qty-label{font-size:12px;font-weight:700;color:${C.text}}
.qty-ctrl{display:flex;align-items:center;border:1.5px solid ${C.border};border-radius:10px;overflow:hidden}
.qty-btn{width:36px;height:36px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${C.text};transition:background .15s}
.qty-btn:hover{background:${C.bgWarm}}
.qty-val{width:40px;text-align:center;font-size:15px;font-weight:700;color:${C.text};border:none;outline:none}
.add-btn{width:100%;padding:17px;background:${C.orange};color:#fff;font-size:15px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.add-btn:hover{background:${C.orangeHov};transform:translateY(-1px);box-shadow:0 6px 20px rgba(232,114,42,0.3)}
.wish-btn{width:100%;padding:15px;background:transparent;color:${C.text};font-size:13px;border:1.5px solid ${C.border};border-radius:12px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:20px}
.wish-btn:hover{border-color:${C.orange};color:${C.orange}}
.trust-row{display:flex;gap:16px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:5px;font-size:12px;color:${C.muted}}
.trust-item svg{color:${C.orange}}

/* HOW IT WORKS */
.how-section{background:${C.dark};padding:80px 40px}
.how-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.how-img{width:100%;border-radius:20px;object-fit:cover;aspect-ratio:4/5;display:block}
.how-steps{display:flex;flex-direction:column;gap:32px}
.step{display:flex;gap:20px;align-items:flex-start}
.step-num{font-size:12px;font-weight:800;color:${C.orange};background:rgba(232,114,42,0.15);border:1px solid rgba(232,114,42,0.25);width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-title{font-size:16px;font-weight:700;color:#fff;margin-bottom:4px}
.step-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6}

/* REVIEWS */
.reviews-section{background:${C.bg};padding:80px 40px}
.reviews-inner{max-width:960px;margin:0 auto}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px}
.review-card{background:${C.white};border:1px solid ${C.border};border-radius:16px;padding:22px}
.review-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.review-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.review-name{font-size:13px;font-weight:700;color:${C.text}}
.review-pet{font-size:10.5px;color:${C.muted};margin-top:1px}
.review-stars{display:flex;gap:2px;margin-top:2px}
.review-badge{margin-left:auto;font-size:9.5px;font-weight:700;color:${C.orange};display:flex;align-items:center;gap:3px}
.review-badge svg{color:${C.orange}}
.review-text{font-size:12.5px;color:${C.muted};line-height:1.65;font-style:italic}

/* GUARANTEE */
.guarantee{background:${C.orangeLight};border-top:1px solid rgba(232,114,42,0.15);border-bottom:1px solid rgba(232,114,42,0.15);padding:64px 40px;text-align:center}
.guar-inner{max-width:600px;margin:0 auto}
.guar-emoji{font-size:56px;margin-bottom:16px;display:block}
.guar-title{font-size:28px;font-weight:800;color:${C.orange};letter-spacing:-0.03em;margin-bottom:12px}
.guar-text{font-size:15px;color:${C.muted};line-height:1.7;max-width:480px;margin:0 auto 24px}
.guar-tags{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.guar-tag{display:flex;align-items:center;gap:6px;background:rgba(232,114,42,0.1);color:${C.orange};font-size:12px;font-weight:700;padding:7px 16px;border-radius:100px}
.guar-tag svg{color:${C.orange}}

/* FAQ */
.faq-section{background:${C.white};padding:80px 40px}
.faq-inner{max-width:680px;margin:0 auto}
.faq-item{border-bottom:1px solid ${C.border}}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 0;font-size:14px;font-weight:600;color:${C.text};background:none;border:none;cursor:pointer;text-align:left;gap:16px;transition:color .2s}
.faq-q:hover{color:${C.orange}}
.faq-ico{color:${C.muted};flex-shrink:0;transition:transform .2s}
.faq-a{padding-bottom:16px}
.faq-a p{font-size:13.5px;color:${C.muted};line-height:1.65}

/* CTA */
.cta-section{background:${C.orange};padding:72px 40px;text-align:center}
.cta-title{font-size:clamp(28px,4vw,44px);font-weight:800;color:#fff;letter-spacing:-0.04em;margin-bottom:12px}
.cta-sub{font-size:16px;color:rgba(255,255,255,0.75);margin-bottom:32px}
.cta-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:${C.orange};font-size:15px;font-weight:800;padding:17px 40px;border-radius:14px;text-decoration:none;transition:all .2s}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15)}

/* FOOTER */
.footer{background:${C.dark};padding:56px 40px 28px}
.footer-inner{max-width:960px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-brand{font-size:18px;font-weight:800;color:${C.orange};margin-bottom:10px}
.footer-tagline{font-size:12px;color:rgba(255,255,255,0.3);line-height:1.65;max-width:200px}
.footer-col-title{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:14px}
.footer-link{display:block;font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;margin-bottom:9px;transition:color .2s}
.footer-link:hover{color:rgba(255,255,255,0.7)}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:11px;color:rgba(255,255,255,0.18)}

@media(max-width:900px){
  .nav-links{display:none}
  .hero{grid-template-columns:1fr}
  .hero-right{height:360px;order:-1}
  .hero-left{padding:48px 28px}
  .ben-grid{grid-template-columns:1fr 1fr}
  .buy-grid{grid-template-columns:1fr;gap:32px}
  .how-inner{grid-template-columns:1fr;gap:32px}
  .how-img{max-height:280px}
  .reviews-grid{grid-template-columns:1fr 1fr}
  .footer-top{grid-template-columns:1fr 1fr;gap:28px}
}
@media(max-width:600px){
  .ben-grid{grid-template-columns:1fr}
  .reviews-grid{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr}
}
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-logo">🐾 PetCo</div>
  <div class="nav-links">
    <a class="nav-link" href="javascript:void(0)">Why We're Different</a>
    <a class="nav-link" href="javascript:void(0)">Reviews</a>
    <a class="nav-link" href="javascript:void(0)">Sizes</a>
    <a class="nav-link" href="javascript:void(0)">FAQ</a>
  </div>
  <a class="nav-cta" href="javascript:void(0)">Shop Now 🐾</a>
</nav>

<div class="announce">
  🐾 Free shipping on all orders · 30-day money-back guarantee · Vet approved
</div>

<section class="hero">
  <div class="hero-left">
    <div class="hero-badge">🏥 Vet Approved</div>
    <h1 class="hero-h1">${headline}</h1>
    <p class="hero-sub">${subtitle}</p>
    <ul class="hero-list">${benefitsHTML}</ul>
    <div class="hero-rating">
      <div class="hero-stars">${stars(5)}</div>
      <span class="hero-rating-text"><strong>4.9/5</strong> · 12,000+ happy pets</span>
    </div>
    <div class="hero-urgency">${urgency}</div>
    <a href="javascript:void(0)" class="hero-cta">${ctaText}</a>
  </div>
  <div class="hero-right">
    <img src="${img(0)}" alt="${productName}" class="hero-img">
    <div class="hero-chip">
      <div class="hero-chip-emoji">🐾</div>
      <div class="hero-chip-text">12,000+</div>
      <div class="hero-chip-sub">happy pets</div>
    </div>
  </div>
</section>

<div class="media-bar">
  <div class="media-inner">
    <span class="media-label">As seen in</span>
    <span class="media-logo">Cosmopolitan Pets</span>
    <span class="media-logo">BuzzFeed</span>
    <span class="media-logo">Good Morning America</span>
    <span class="media-logo">Dog Fancy</span>
    <span class="media-logo">Petco Blog</span>
  </div>
</div>

<section class="ben-section">
  <div class="ben-inner">
    <div class="section-eyebrow">Why Pets Love It</div>
    <h2 class="section-h">Everything your pet needs. Nothing they don't.</h2>
    <div class="ben-grid">${benefitsGridHTML}</div>
  </div>
</section>

<section class="buy-section" id="buy">
  <div class="buy-grid">
    <div>
      <img src="${img(0)}" alt="${productName}" class="main-img" id="main-img">
      <div class="thumbs">${thumbsHTML}</div>
    </div>
    <div>
      <div class="prod-name">${productName}</div>
      <div class="prod-sub">Natural · Vet Approved · Ultra Durable</div>
      <div class="prod-rating">
        <div class="prod-stars">${stars(5)}</div>
        <span class="prod-rating-text">4.9 · 12,000+ reviews</span>
      </div>
      <div class="size-label">Size: <span id="size-selected">M</span> <a href="javascript:void(0)" class="size-guide">Size guide →</a></div>
      <div class="sizes">${sizesHTML}</div>
      <div class="price-row">
        <span class="price-main">$${price.replace(/[^0-9.]/g,'')}</span>
        <span class="price-orig">$${originalPrice.replace(/[^0-9.]/g,'')}</span>
        <span class="price-save">Save ${priceSave}%</span>
      </div>
      <p class="price-note">Free shipping · 30-day guarantee</p>
      <div class="qty-row">
        <span class="qty-label">Qty</span>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(-1)">${ICON_MINUS}</button>
          <span class="qty-val" id="qty">1</span>
          <button class="qty-btn" onclick="changeQty(1)">${ICON_PLUS}</button>
        </div>
      </div>
      <button class="add-btn">${ctaText}</button>
      <button class="wish-btn">${ICON_HEART} Add to Wishlist</button>
      <div class="trust-row">
        <div class="trust-item">${ICON_TRUCK} Free shipping</div>
        <div class="trust-item">${ICON_SHIELD} 30-day guarantee</div>
        <div class="trust-item">${ICON_LEAF} Natural materials</div>
      </div>
    </div>
  </div>
</section>

<section class="how-section">
  <div class="how-inner" style="max-width:1000px;margin:0 auto">
    <img src="${img(1)}" alt="Happy pet" class="how-img">
    <div>
      <div class="section-eyebrow" style="color:${C.orange}">How It Works</div>
      <h2 style="font-size:clamp(28px,3vw,40px);font-weight:800;color:#fff;letter-spacing:-0.03em;margin-bottom:12px">Happy pet in 3 steps.</h2>
      <p style="font-size:14px;color:rgba(255,255,255,0.4);margin-bottom:40px;line-height:1.6">No assembly. No complicated instructions. Just pure joy for your furry friend.</p>
      <div class="how-steps">${stepsHTML}</div>
    </div>
  </div>
</section>

<section class="reviews-section">
  <div class="reviews-inner">
    <div class="section-eyebrow">Reviews</div>
    <h2 class="section-h">12,000+ happy pets can't be wrong.</h2>
    <div class="reviews-grid">${reviewsHTML}</div>
  </div>
</section>

<div class="guarantee">
  <div class="guar-inner">
    <span class="guar-emoji">🛡️</span>
    <h2 class="guar-title">30-Day Pet Happiness Guarantee</h2>
    <p class="guar-text">If your pet doesn't absolutely love it — for any reason — contact us within 30 days and we'll give you a full refund. No photos needed. No hassle. We trust you.</p>
    <div class="guar-tags">
      <div class="guar-tag">${ICON_CHECK} Full refund</div>
      <div class="guar-tag">${ICON_CHECK} No return required</div>
      <div class="guar-tag">${ICON_CHECK} No questions asked</div>
    </div>
  </div>
</div>

<section class="faq-section">
  <div class="faq-inner">
    <div class="section-eyebrow">FAQ</div>
    <h2 style="font-size:clamp(24px,2.5vw,36px);font-weight:800;letter-spacing:-0.03em;margin-bottom:36px">Common questions.</h2>
    ${faqHTML}
  </div>
</section>

<div class="cta-section">
  <h2 class="cta-title">Your pet is waiting. 🐾</h2>
  <p class="cta-sub">Join 12,000+ pet parents who made the switch. Free shipping, 30-day guarantee.</p>
  <a href="javascript:void(0)" class="cta-btn">${ctaText}</a>
</div>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand">🐾 PetCo</div>
        <p class="footer-tagline">Premium pet products made by pet parents, for pet parents.</p>
      </div>
      <div>
        <div class="footer-col-title">Products</div>
        <a class="footer-link" href="javascript:void(0)">Toys</a>
        <a class="footer-link" href="javascript:void(0)">Accessories</a>
        <a class="footer-link" href="javascript:void(0)">Nutrition</a>
        <a class="footer-link" href="javascript:void(0)">Bundles</a>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <a class="footer-link" href="javascript:void(0)">About Us</a>
        <a class="footer-link" href="javascript:void(0)">Our Story</a>
        <a class="footer-link" href="javascript:void(0)">Reviews</a>
        <a class="footer-link" href="javascript:void(0)">Affiliates</a>
      </div>
      <div>
        <div class="footer-col-title">Support</div>
        <a class="footer-link" href="javascript:void(0)">FAQ</a>
        <a class="footer-link" href="javascript:void(0)">Shipping</a>
        <a class="footer-link" href="javascript:void(0)">Returns</a>
        <a class="footer-link" href="javascript:void(0)">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© ${new Date().getFullYear()} PetCo. All rights reserved.</span>
      <span class="footer-copy">Vet Approved · Natural Materials · Made with ❤️</span>
    </div>
  </div>
</footer>

<script>
function selectImg(el, src) {
  document.getElementById('main-img').src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function pickSize(el, s) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('size-selected').textContent = s;
}
let qty = 1;
function changeQty(d) {
  qty = Math.max(1, Math.min(10, qty + d));
  document.getElementById('qty').textContent = qty;
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
  document.querySelector('.nav').style.boxShadow = window.scrollY > 10 ? '0 2px 16px rgba(30,18,6,0.08)' : 'none';
});
</script>

<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderSocialProofBar(data, PET_THEME)}
${renderStorySection(data, PET_THEME)}
${renderComparisonSection(data, PET_THEME)}
${renderTestimonialsSection(data, PET_THEME)}
${renderBonusesSection(data, PET_THEME)}
${renderGuaranteeSection(data, PET_THEME)}

</body>
</html>`
}
