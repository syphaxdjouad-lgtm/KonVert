import type { LandingPageData } from '@/types'

// ─── FALLBACK IMAGES — health / supplements premium ───────────────────────────

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
  'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
  'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&q=80',
  'https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=800&q=80',
]

const INGREDIENT_IMGS = [
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', // turmeric
  'https://images.unsplash.com/photo-1605289355680-75fb41239154?w=400&q=80', // ashwagandha
  'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=400&q=80', // spirulina
]

const C = {
  bg:         '#F8F7F4',
  white:      '#FFFFFF',
  dark:       '#0A0F0A',
  darkCard:   '#111811',
  green:      '#2D7A22',
  greenBright:'#3CB043',
  greenLight: '#EBF5E9',
  greenGlow:  '#C8F135',
  lime:       '#A8E63D',
  text:       '#1A1A1A',
  muted:      '#6B7280',
  border:     '#E5E7EB',
  gold:       '#F59E0B',
  cream:      '#FDFCF8',
}

const ICON_CHECK   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_STAR    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const ICON_LEAF    = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
const ICON_SHIELD  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const ICON_FLASK   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6m-5 6l-4.5 9A2 2 0 0 0 7 21h10a2 2 0 0 0 1.84-2.76L14 9M9 3v6m6-6v6"/></svg>`
const ICON_TRUCK   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
const ICON_LOCK    = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_RECYCLE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`
const ICON_HEART   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
const ICON_PLUS    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_MINUS   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_ARROW   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
const ICON_INFO    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`

function stars(count: number): string {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < count ? C.gold : '#D1D5DB'}">${ICON_STAR}</span>`
  ).join('')
}

const BADGE_BRANDS = ['Forbes', 'Vogue', 'Men\'s Health', 'Healthline', 'TIME']

const CERTIFICATIONS = [
  { icon: ICON_LEAF,    label: 'Vegan Certified'   },
  { icon: ICON_SHIELD,  label: 'NSF Tested'        },
  { icon: ICON_FLASK,   label: 'Lab Verified'      },
  { icon: ICON_RECYCLE, label: 'Eco Packaging'     },
]

const INGREDIENTS = [
  { name: 'Ashwagandha KSM-66®', dose: '600mg', benefit: 'Reduce cortisol & manage stress', color: '#F3F0E8' },
  { name: 'Magnesium Glycinate',  dose: '300mg', benefit: 'Deep sleep & muscle recovery',   color: '#EBF5E9' },
  { name: 'Lion\'s Mane Extract', dose: '500mg', benefit: 'Focus, memory & brain health',   color: '#EEF2F8' },
  { name: 'CoQ10 Ubiquinol',      dose: '100mg', benefit: 'Cellular energy & antioxidant',  color: '#FEF3EE' },
  { name: 'Vitamin D3 + K2',      dose: '2000IU', benefit: 'Immune, bone & heart support',  color: '#FFF8E7' },
  { name: 'Omega-3 EPA/DHA',      dose: '1000mg', benefit: 'Heart health & inflammation',   color: '#EDF4FF' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Take 2 capsules daily',   desc: 'Best with your morning meal. No prep, no powder — just 2 capsules.' },
  { step: '02', title: 'Your body absorbs',        desc: 'Bioavailable forms of each ingredient ensure maximum absorption rate.' },
  { step: '03', title: 'Feel the difference',      desc: 'Most users notice improved energy & focus within the first 2 weeks.' },
]

const BENEFITS_ICONS = [
  { emoji: '⚡', label: 'All-Day Energy',   desc: 'No crash, no jitters — sustained vitality through your entire day.' },
  { emoji: '🧠', label: 'Sharp Focus',      desc: 'Nootropic stack that clears brain fog and sharpens cognitive function.' },
  { emoji: '😴', label: 'Deep Sleep',       desc: 'Adaptogenic blend that calms your nervous system for restorative rest.' },
  { emoji: '💪', label: 'Faster Recovery',  desc: 'Anti-inflammatory nutrients that help your body rebuild after effort.' },
  { emoji: '🛡️', label: 'Immune Support',   desc: 'Clinically dosed vitamins that strengthen your body\'s defense system.' },
  { emoji: '🌱', label: '100% Clean',       desc: 'No fillers, no artificial colors, no hidden additives. Just pure nutrients.' },
]

const RESULTS_STATS = [
  { value: '94%', label: 'reported more energy after 2 weeks' },
  { value: '89%', label: 'noticed better focus within 14 days' },
  { value: '91%', label: 'would recommend to a friend' },
  { value: '4.9★', label: 'average rating from 12,000+ reviews' },
]

export function templateEtecPrime(data: LandingPageData): string {
  const img  = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName   = data.product_name   || 'Daily Prime Formula'
  const headline      = data.headline       || 'Feel extraordinary. Every single day.'
  const subtitle      = data.subtitle       || '75 science-backed nutrients in one daily supplement. No guesswork, no compromise — just everything your body needs to thrive.'
  const ctaText       = data.cta            || 'Start Your Transformation →'
  const urgency       = data.urgency        || '🔥 Save 20% on first order · Free shipping · Cancel anytime'
  const price         = data.price          || '79'
  const originalPrice = data.original_price || '99'
  const benefits      = data.benefits       || []

  const rawFaq = data.faq || []
  const faqItems = rawFaq.length > 0 ? rawFaq : [
    { question: 'When will I see results?',         answer: 'Most users notice improved energy and focus within 7–14 days. Optimal results are typically seen after 30–60 days of consistent use.' },
    { question: 'Is it safe with medications?',     answer: 'Our formula is generally well-tolerated. However, consult your healthcare provider if you take any medications or have underlying conditions.' },
    { question: 'Can I cancel my subscription?',   answer: 'Yes, you can cancel anytime before your next billing date with no fees. We offer a 30-day money-back guarantee no questions asked.' },
    { question: 'Is it vegan and allergen-free?',  answer: 'Yes. Prime Formula is 100% vegan, gluten-free, dairy-free and soy-free. Made in a GMP-certified facility in the USA.' },
    { question: 'How many capsules per day?',       answer: 'Just 2 capsules per day with your morning meal. Each bottle contains a 30-day supply (60 capsules).' },
  ]

  const reviewsData = [
    { name: 'Marcus T.',     rating: 5, time: '3 weeks ago',  verified: true, text: 'I\'ve tried every supplement brand out there. Prime Formula is the real deal. Energy is through the roof, sleep is deeper, and I\'m crushing my morning workouts. Worth every penny.' },
    { name: 'Sophia R.',     rating: 5, time: '1 month ago',  verified: true, text: 'I was skeptical at first — I\'ve been burned by "wellness" products before. Two weeks in and I had to come back and leave this review. My brain fog is gone. Like, actually gone.' },
    { name: 'James K.',      rating: 5, time: '2 months ago', verified: true, text: 'As a physician I\'m very selective about supplements. The ingredient quality and dosages here are clinically meaningful. This isn\'t a prop-up product — it actually works.' },
    { name: 'Aisha M.',      rating: 5, time: '3 weeks ago',  verified: true, text: 'I\'ve been using this for 6 weeks. My skin is clearer, I sleep like a baby and the afternoon slump I had every single day is completely gone. My husband started taking it too.' },
    { name: 'Oliver P.',     rating: 5, time: '5 weeks ago',  verified: true, text: 'The packaging is premium, the capsules go down easy, and most importantly — it works. I noticed a difference within the first week. Subscribed indefinitely.' },
    { name: 'Camille D.',    rating: 4, time: '1 month ago',  verified: true, text: 'Love the formula transparency — they show every ingredient with clinical doses. Takes about 2 weeks to feel it but then the difference is undeniable.' },
  ]

  const reviewsHTML = reviewsData.map((r, i) => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-avatar" style="background:${['#2D7A22','#0891B2','#7C3AED','#D97706','#DC2626','#059669'][i % 6]}">
          ${r.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-stars">${stars(r.rating)}</div>
        </div>
        <div class="review-meta-right">
          <div class="review-time">${r.time}</div>
          ${r.verified ? `<div class="review-verified">${ICON_CHECK} Verified</div>` : ''}
        </div>
      </div>
      <p class="review-text">"${r.text}"</p>
    </div>`).join('')

  const ingredientsHTML = INGREDIENTS.map(ing => `
    <div class="ingredient-card" style="background:${ing.color}">
      <div class="ingredient-top">
        <span class="ingredient-name">${ing.name}</span>
        <span class="ingredient-dose">${ing.dose}</span>
      </div>
      <p class="ingredient-benefit">${ICON_CHECK} ${ing.benefit}</p>
    </div>`).join('')

  const benefitsHTML = BENEFITS_ICONS.map(b => `
    <div class="benefit-card">
      <span class="benefit-emoji">${b.emoji}</span>
      <h4 class="benefit-title">${b.label}</h4>
      <p class="benefit-desc">${b.desc}</p>
    </div>`).join('')

  const certsHTML = CERTIFICATIONS.map(c => `
    <div class="cert-badge">
      <div class="cert-icon">${c.icon}</div>
      <span>${c.label}</span>
    </div>`).join('')

  const statsHTML = RESULTS_STATS.map(s => `
    <div class="stat-item">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('')

  const stepsHTML = HOW_IT_WORKS.map(s => `
    <div class="step-item">
      <div class="step-num">${s.step}</div>
      <div class="step-body">
        <h4 class="step-title">${s.title}</h4>
        <p class="step-desc">${s.desc}</p>
      </div>
    </div>`).join('')

  const faqHTML = faqItems.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFaq(${i})">
        <span>${f.question}</span>
        <span class="faq-icon" id="faq-icon-${i}">${ICON_PLUS}</span>
      </button>
      <div class="faq-a" id="faq-a-${i}" style="display:none">
        <p>${f.answer}</p>
      </div>
    </div>`).join('')

  const mediaHTML = BADGE_BRANDS.map(b => `
    <div class="media-logo">${b}</div>`).join('')

  const benefitsListHTML = (benefits.length > 0 ? benefits : [
    'Clinically dosed — no proprietary blends, ever',
    '75 nutrients in one capsule — simplify your routine',
    'Third-party tested for purity and potency',
    'Ships in sustainable, plastic-neutral packaging',
    'Backed by a 30-day money-back guarantee',
  ]).map(b => `<li class="hero-benefit">${ICON_CHECK} ${b}</li>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${productName}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: -apple-system, 'Inter', 'Helvetica Neue', sans-serif; background: ${C.bg}; color: ${C.text}; line-height: 1.6; }

  /* ── NAV ────────────────────────────────────────────────── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,15,10,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
  }
  .nav-logo { font-size: 18px; font-weight: 900; color: ${C.greenGlow}; letter-spacing: -0.03em; }
  .nav-links { display: flex; gap: 28px; }
  .nav-link { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); text-decoration: none; transition: color .2s; }
  .nav-link:hover { color: #fff; }
  .nav-cta { background: ${C.greenBright}; color: #fff; font-weight: 700; font-size: 13px; padding: 8px 20px; border-radius: 8px; text-decoration: none; transition: opacity .2s; }
  .nav-cta:hover { opacity: 0.85; }

  /* ── TICKER ─────────────────────────────────────────────── */
  .ticker { background: ${C.greenBright}; color: #fff; text-align: center; padding: 10px 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; overflow: hidden; }
  .ticker-track { display: inline-flex; gap: 80px; animation: ticker 22s linear infinite; white-space: nowrap; }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── HERO ────────────────────────────────────────────────── */
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 64px); margin-top: 64px; background: ${C.dark}; }
  .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 80px 60px 80px 80px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(168,230,61,0.12); border: 1px solid rgba(168,230,61,0.25); color: ${C.greenGlow}; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; width: fit-content; }
  .hero-headline { font-size: clamp(36px, 4.5vw, 58px); font-weight: 900; line-height: 1.07; color: #fff; letter-spacing: -0.03em; margin-bottom: 20px; }
  .hero-headline span { color: ${C.lime}; }
  .hero-subtitle { font-size: 16px; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 32px; max-width: 460px; }
  .hero-benefits-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }
  .hero-benefit { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.8); }
  .hero-benefit svg { color: ${C.lime}; flex-shrink: 0; }
  .hero-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .hero-stars { display: flex; gap: 2px; }
  .hero-rating-text { font-size: 13px; color: rgba(255,255,255,0.45); }
  .hero-rating-text strong { color: rgba(255,255,255,0.8); }
  .hero-cta { display: flex; flex-direction: column; gap: 12px; }
  .hero-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: ${C.lime}; color: ${C.dark}; font-weight: 900; font-size: 16px; padding: 18px 40px; border-radius: 14px; border: none; cursor: pointer; text-decoration: none; transition: transform .2s, box-shadow .2s; box-shadow: 0 4px 24px rgba(168,230,61,0.35); }
  .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,230,61,0.45); }
  .hero-sub { font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; }
  .hero-urgency { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: #F59E0B; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 8px; text-align: center; }

  /* ── HERO RIGHT ─────────────────────────────────────────── */
  .hero-right { position: relative; overflow: hidden; }
  .hero-img-main { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,15,10,0.4) 0%, transparent 60%); }
  .hero-float-badge { position: absolute; bottom: 40px; left: 32px; background: rgba(10,15,10,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 20px; }
  .hero-float-title { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
  .hero-float-val { font-size: 28px; font-weight: 900; color: ${C.lime}; line-height: 1; }
  .hero-float-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }

  /* ── MEDIA ───────────────────────────────────────────────── */
  .media-section { background: ${C.cream}; border-bottom: 1px solid ${C.border}; padding: 28px 40px; }
  .media-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; gap: 32px; justify-content: center; flex-wrap: wrap; }
  .media-as { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.muted}; flex-shrink: 0; }
  .media-logo { font-size: 14px; font-weight: 700; color: #9CA3AF; letter-spacing: -0.01em; padding: 0 12px; border-left: 1px solid ${C.border}; }
  .media-logo:first-of-type { border-left: none; }

  /* ── STATS ───────────────────────────────────────────────── */
  .stats-section { background: ${C.dark}; padding: 64px 40px; }
  .stats-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
  .stat-item { background: #111811; padding: 40px 24px; text-align: center; }
  .stat-value { font-size: 42px; font-weight: 900; color: ${C.lime}; letter-spacing: -0.03em; line-height: 1; margin-bottom: 8px; }
  .stat-label { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.5; }

  /* ── BENEFITS ────────────────────────────────────────────── */
  .benefits-section { background: ${C.bg}; padding: 100px 40px; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${C.greenBright}; margin-bottom: 12px; }
  .section-title { font-size: clamp(28px, 3vw, 40px); font-weight: 900; letter-spacing: -0.03em; color: ${C.text}; line-height: 1.15; margin-bottom: 16px; }
  .section-subtitle { font-size: 16px; color: ${C.muted}; max-width: 480px; line-height: 1.65; margin-bottom: 56px; }
  .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
  .benefit-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 20px; padding: 32px 28px; transition: transform .2s, box-shadow .2s; }
  .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .benefit-emoji { font-size: 32px; display: block; margin-bottom: 16px; }
  .benefit-title { font-size: 16px; font-weight: 800; color: ${C.text}; margin-bottom: 8px; letter-spacing: -0.01em; }
  .benefit-desc { font-size: 13.5px; color: ${C.muted}; line-height: 1.65; }

  /* ── PRODUCT SECTION ─────────────────────────────────────── */
  .product-section { background: ${C.white}; padding: 100px 40px; }
  .product-grid { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .product-gallery { position: relative; }
  .product-main-img { width: 100%; border-radius: 24px; display: block; object-fit: cover; aspect-ratio: 4/5; }
  .product-thumbs { display: flex; gap: 10px; margin-top: 12px; }
  .product-thumb { flex: 1; border-radius: 12px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: border-color .2s; aspect-ratio: 1; }
  .product-thumb.active, .product-thumb:hover { border-color: ${C.greenBright}; }
  .product-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .product-info { display: flex; flex-direction: column; gap: 0; }
  .product-name { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: ${C.text}; margin-bottom: 8px; }
  .product-tagline { font-size: 14px; color: ${C.muted}; margin-bottom: 20px; }
  .product-rating-row { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .product-stars { display: flex; gap: 2px; }
  .product-rating-text { font-size: 13px; color: ${C.muted}; }
  .plan-toggle { display: flex; background: #F5F5F5; border-radius: 12px; padding: 4px; margin-bottom: 20px; }
  .plan-btn { flex: 1; padding: 10px 16px; border-radius: 9px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; background: transparent; color: ${C.muted}; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .plan-btn.active { background: ${C.white}; color: ${C.text}; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .plan-save { background: ${C.greenBright}; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
  .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
  .price-main { font-size: 40px; font-weight: 900; color: ${C.text}; letter-spacing: -0.03em; }
  .price-orig { font-size: 20px; color: ${C.muted}; text-decoration: line-through; }
  .price-note { font-size: 12px; color: ${C.muted}; margin-bottom: 24px; }
  .qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .qty-label { font-size: 13px; font-weight: 600; color: ${C.text}; }
  .qty-ctrl { display: flex; align-items: center; gap: 0; border: 1.5px solid ${C.border}; border-radius: 10px; overflow: hidden; }
  .qty-btn { width: 36px; height: 36px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${C.text}; transition: background .15s; }
  .qty-btn:hover { background: #F5F5F5; }
  .qty-val { width: 40px; text-align: center; font-size: 15px; font-weight: 700; color: ${C.text}; border: none; outline: none; }
  .add-btn { width: 100%; padding: 18px; background: ${C.dark}; color: #fff; font-size: 16px; font-weight: 900; border: none; border-radius: 14px; cursor: pointer; transition: all .2s; letter-spacing: -0.01em; margin-bottom: 12px; }
  .add-btn:hover { background: #1F2E1F; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
  .wishlist-btn { width: 100%; padding: 15px; background: transparent; color: ${C.text}; font-size: 14px; font-weight: 600; border: 1.5px solid ${C.border}; border-radius: 14px; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
  .wishlist-btn:hover { border-color: ${C.text}; }
  .trust-row { display: flex; gap: 16px; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: ${C.muted}; }
  .trust-item svg { color: ${C.greenBright}; }

  /* ── CERTS ───────────────────────────────────────────────── */
  .certs-bar { background: ${C.greenLight}; border-top: 1px solid rgba(45,122,34,0.15); border-bottom: 1px solid rgba(45,122,34,0.15); padding: 20px 40px; }
  .certs-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; }
  .cert-badge { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${C.green}; }
  .cert-icon { color: ${C.greenBright}; }

  /* ── INGREDIENTS ─────────────────────────────────────────── */
  .ingredients-section { background: ${C.bg}; padding: 100px 40px; }
  .ingredients-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1000px; margin: 0 auto; }
  .ingredient-card { border-radius: 16px; padding: 24px; border: 1px solid rgba(0,0,0,0.06); transition: transform .2s; }
  .ingredient-card:hover { transform: translateY(-3px); }
  .ingredient-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .ingredient-name { font-size: 14px; font-weight: 700; color: ${C.text}; }
  .ingredient-dose { font-size: 12px; font-weight: 700; color: ${C.greenBright}; background: rgba(60,176,67,0.1); padding: 3px 10px; border-radius: 100px; }
  .ingredient-benefit { font-size: 12.5px; color: ${C.muted}; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
  .ingredient-benefit svg { color: ${C.greenBright}; flex-shrink: 0; margin-top: 2px; }

  /* ── HOW IT WORKS ────────────────────────────────────────── */
  .how-section { background: ${C.dark}; padding: 100px 40px; }
  .how-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .how-img { border-radius: 24px; width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block; }
  .how-steps { display: flex; flex-direction: column; gap: 36px; }
  .step-item { display: flex; gap: 24px; align-items: flex-start; }
  .step-num { font-size: 13px; font-weight: 900; color: ${C.lime}; background: rgba(168,230,61,0.1); border: 1px solid rgba(168,230,61,0.2); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-title { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 6px; letter-spacing: -0.01em; }
  .step-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.65; }

  /* ── REVIEWS ─────────────────────────────────────────────── */
  .reviews-section { background: ${C.bg}; padding: 100px 40px; }
  .reviews-header { max-width: 1000px; margin: 0 auto 48px; display: flex; align-items: flex-end; justify-content: space-between; }
  .reviews-score { display: flex; align-items: center; gap: 16px; }
  .reviews-big-num { font-size: 56px; font-weight: 900; color: ${C.text}; letter-spacing: -0.04em; line-height: 1; }
  .reviews-score-right { display: flex; flex-direction: column; gap: 4px; }
  .reviews-stars-big { display: flex; gap: 3px; }
  .reviews-count { font-size: 13px; color: ${C.muted}; }
  .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1000px; margin: 0 auto; }
  .review-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 20px; padding: 24px; }
  .review-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .review-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .review-name { font-size: 14px; font-weight: 700; color: ${C.text}; }
  .review-stars { display: flex; gap: 2px; margin-top: 2px; }
  .review-meta-right { margin-left: auto; text-align: right; }
  .review-time { font-size: 11px; color: ${C.muted}; }
  .review-verified { font-size: 10px; font-weight: 700; color: ${C.greenBright}; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
  .review-verified svg { color: ${C.greenBright}; }
  .review-text { font-size: 13.5px; color: ${C.muted}; line-height: 1.7; font-style: italic; }

  /* ── GUARANTEE ───────────────────────────────────────────── */
  .guarantee-section { background: ${C.greenLight}; border-top: 1px solid rgba(45,122,34,0.15); border-bottom: 1px solid rgba(45,122,34,0.15); padding: 80px 40px; }
  .guarantee-inner { max-width: 700px; margin: 0 auto; text-align: center; }
  .guarantee-badge { font-size: 64px; margin-bottom: 20px; }
  .guarantee-title { font-size: 32px; font-weight: 900; color: ${C.green}; letter-spacing: -0.03em; margin-bottom: 16px; }
  .guarantee-text { font-size: 15px; color: ${C.green}; opacity: 0.75; line-height: 1.7; margin-bottom: 28px; max-width: 500px; margin-left: auto; margin-right: auto; }
  .guarantee-tags { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .guarantee-tag { display: flex; align-items: center; gap: 6px; background: rgba(45,122,34,0.12); color: ${C.green}; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 100px; }
  .guarantee-tag svg { color: ${C.greenBright}; }

  /* ── FAQ ─────────────────────────────────────────────────── */
  .faq-section { background: ${C.white}; padding: 100px 40px; }
  .faq-inner { max-width: 720px; margin: 0 auto; }
  .faq-item { border-bottom: 1px solid ${C.border}; }
  .faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 20px 0; font-size: 15px; font-weight: 700; color: ${C.text}; background: none; border: none; cursor: pointer; text-align: left; gap: 16px; transition: color .2s; }
  .faq-q:hover { color: ${C.greenBright}; }
  .faq-icon { color: ${C.muted}; flex-shrink: 0; transition: transform .2s; }
  .faq-a { padding-bottom: 20px; }
  .faq-a p { font-size: 14px; color: ${C.muted}; line-height: 1.7; }

  /* ── FINAL CTA ───────────────────────────────────────────── */
  .final-cta { background: ${C.dark}; padding: 100px 40px; text-align: center; }
  .final-inner { max-width: 600px; margin: 0 auto; }
  .final-title { font-size: clamp(32px, 4vw, 52px); font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1.08; margin-bottom: 20px; }
  .final-title span { color: ${C.lime}; }
  .final-sub { font-size: 16px; color: rgba(255,255,255,0.45); margin-bottom: 40px; line-height: 1.6; }
  .final-btn { display: inline-flex; align-items: center; gap: 10px; background: ${C.lime}; color: ${C.dark}; font-weight: 900; font-size: 17px; padding: 20px 48px; border-radius: 16px; border: none; cursor: pointer; text-decoration: none; transition: all .2s; box-shadow: 0 4px 32px rgba(168,230,61,0.4); }
  .final-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(168,230,61,0.5); }
  .final-note { margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.2); }

  /* ── FOOTER ─────────────────────────────────────────────── */
  .footer { background: #060B06; padding: 60px 40px 32px; }
  .footer-inner { max-width: 1000px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
  .footer-brand { font-size: 20px; font-weight: 900; color: ${C.lime}; letter-spacing: -0.03em; margin-bottom: 12px; }
  .footer-tagline { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.6; max-width: 220px; }
  .footer-col-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 16px; }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; margin-bottom: 10px; transition: color .2s; }
  .footer-link:hover { color: rgba(255,255,255,0.7); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
  .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }
  .footer-certs { display: flex; gap: 16px; }
  .footer-cert { font-size: 11px; color: rgba(255,255,255,0.2); }

  /* ── SECTION WRAPPERS ─────────────────────────────────────── */
  .section-header { text-align: center; margin-bottom: 56px; }
  .section-header.left { text-align: left; }

  /* ── RESPONSIVE ─────────────────────────────────────────── */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .hero-left { padding: 60px 28px; }
    .hero-right { height: 400px; }
    .stats-inner { grid-template-columns: repeat(2, 1fr); }
    .benefits-grid, .reviews-grid, .ingredients-grid { grid-template-columns: 1fr 1fr; }
    .product-grid, .how-inner { grid-template-columns: 1fr; gap: 40px; }
    .how-img { max-height: 320px; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    .nav-links { display: none; }
  }
  @media (max-width: 600px) {
    .benefits-grid, .reviews-grid, .ingredients-grid { grid-template-columns: 1fr; }
    .stats-inner { grid-template-columns: 1fr 1fr; }
    .footer-top { grid-template-columns: 1fr; }
    .hero-btn { font-size: 14px; padding: 16px 28px; }
    .hero-headline { font-size: 34px; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav class="nav">
  <div class="nav-logo">◆ Prime</div>
  <div class="nav-links">
    <a class="nav-link" href="#">Science</a>
    <a class="nav-link" href="#">Ingredients</a>
    <a class="nav-link" href="#">Reviews</a>
    <a class="nav-link" href="#">FAQ</a>
  </div>
  <a class="nav-cta" href="#">Get Started →</a>
</nav>

<!-- TICKER -->
<div class="ticker" style="margin-top:64px">
  <div class="ticker-track">
    <span>✦ Free shipping on all orders</span>
    <span>✦ 30-day money-back guarantee</span>
    <span>✦ 12,000+ five-star reviews</span>
    <span>✦ NSF Certified & Third-Party Tested</span>
    <span>✦ Free shipping on all orders</span>
    <span>✦ 30-day money-back guarantee</span>
    <span>✦ 12,000+ five-star reviews</span>
    <span>✦ NSF Certified & Third-Party Tested</span>
  </div>
</div>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <div class="hero-badge">${ICON_LEAF} Science-Backed Formula</div>
    <h1 class="hero-headline">${headline.replace(/(every|extraordinary|thrive|daily)/gi, '<span>$1</span>')}</h1>
    <p class="hero-subtitle">${subtitle}</p>
    <ul class="hero-benefits-list">
      ${benefitsListHTML}
    </ul>
    <div class="hero-rating">
      <div class="hero-stars">${stars(5)}</div>
      <span class="hero-rating-text"><strong>4.9/5</strong> · 12,000+ verified reviews</span>
    </div>
    <div class="hero-urgency">${urgency}</div>
    <div style="height:16px"></div>
    <div class="hero-cta">
      <a href="#" class="hero-btn">${ctaText}</a>
      <p class="hero-sub">Free shipping · Cancel anytime · 30-day guarantee</p>
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-img-main" src="${img(0)}" alt="${productName}">
    <div class="hero-overlay"></div>
    <div class="hero-float-badge">
      <div class="hero-float-title">CLINICAL DOSING</div>
      <div class="hero-float-val">75</div>
      <div class="hero-float-sub">science-backed nutrients</div>
    </div>
  </div>
</section>

<!-- MEDIA -->
<div class="media-section">
  <div class="media-inner">
    <span class="media-as">As seen in</span>
    ${mediaHTML}
  </div>
</div>

<!-- STATS -->
<section class="stats-section">
  <div class="stats-inner">${statsHTML}</div>
</section>

<!-- BENEFITS -->
<section class="benefits-section">
  <div style="max-width:1000px;margin:0 auto">
    <div class="section-header">
      <div class="section-label">Why Prime Works</div>
      <h2 class="section-title">Everything you need.<br>Nothing you don't.</h2>
      <p class="section-subtitle">Built from the ground up with clinically studied ingredients at doses that actually make a difference.</p>
    </div>
    <div class="benefits-grid">${benefitsHTML}</div>
  </div>
</section>

<!-- CERTS BAR -->
<div class="certs-bar">
  <div class="certs-inner">${certsHTML}</div>
</div>

<!-- PRODUCT -->
<section class="product-section" id="product">
  <div class="product-grid">
    <div class="product-gallery">
      <img class="product-main-img" id="main-img" src="${img(0)}" alt="${productName}">
      <div class="product-thumbs">
        ${Array.from({length:4}, (_,i) => `
        <div class="product-thumb${i===0?' active':''}" onclick="switchImg(this,'${img(i)}')" >
          <img src="${img(i)}" alt="View ${i+1}">
        </div>`).join('')}
      </div>
    </div>
    <div class="product-info">
      <h2 class="product-name">${productName}</h2>
      <p class="product-tagline">Daily supplement · 60 capsules · 30-day supply</p>
      <div class="product-rating-row">
        <div class="product-stars">${stars(5)}</div>
        <span class="product-rating-text">4.9 (12,847 reviews)</span>
      </div>

      <div class="plan-toggle">
        <button class="plan-btn active" onclick="setPlan(this,'subscribe')">
          Subscribe &amp; Save <span class="plan-save">−20%</span>
        </button>
        <button class="plan-btn" onclick="setPlan(this,'once')">
          One-time purchase
        </button>
      </div>

      <div class="price-row">
        <span class="price-main" id="price-main">${price.includes('$') ? price : '$' + price}</span>
        <span class="price-orig" id="price-orig">${originalPrice.includes('$') ? originalPrice : '$' + originalPrice}</span>
      </div>
      <p class="price-note" id="price-note">Billed monthly · Free shipping · Cancel anytime</p>

      <div class="qty-row">
        <span class="qty-label">Qty</span>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(-1)">${ICON_MINUS}</button>
          <span class="qty-val" id="qty-val">1</span>
          <button class="qty-btn" onclick="changeQty(1)">${ICON_PLUS}</button>
        </div>
      </div>

      <button class="add-btn">Add to Cart — $${price.replace(/[^0-9.]/g, '')}/mo</button>
      <button class="wishlist-btn">${ICON_HEART} Save to Wishlist</button>

      <div class="trust-row">
        <div class="trust-item">${ICON_TRUCK} Free shipping</div>
        <div class="trust-item">${ICON_LOCK} Secure checkout</div>
        <div class="trust-item">${ICON_SHIELD} 30-day guarantee</div>
      </div>
    </div>
  </div>
</section>

<!-- INGREDIENTS -->
<section class="ingredients-section">
  <div style="max-width:1000px;margin:0 auto">
    <div class="section-header">
      <div class="section-label">Transparent Formula</div>
      <h2 class="section-title">Every ingredient. Every dose. No secrets.</h2>
      <p class="section-subtitle">We show you exactly what's in each capsule — and why it's there.</p>
    </div>
    <div class="ingredients-grid">${ingredientsHTML}</div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="how-section">
  <div class="how-inner" style="max-width:1000px;margin:0 auto">
    <img class="how-img" src="${img(1)}" alt="How it works">
    <div>
      <div class="section-label" style="color:${C.lime}">How It Works</div>
      <h2 class="section-title" style="color:#fff;margin-bottom:12px">Simple routine.<br>Real results.</h2>
      <p class="section-subtitle" style="color:rgba(255,255,255,0.4);margin-bottom:48px">No complicated protocols. No 12-step morning routine. Just 2 capsules and you're done.</p>
      <div class="how-steps">${stepsHTML}</div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews-section">
  <div class="reviews-header">
    <div class="reviews-score">
      <div class="reviews-big-num">4.9</div>
      <div class="reviews-score-right">
        <div class="reviews-stars-big">${stars(5)}</div>
        <div class="reviews-count">Based on 12,847 reviews</div>
      </div>
    </div>
    <a href="#" style="font-size:13px;font-weight:700;color:${C.greenBright};text-decoration:none">Read all reviews →</a>
  </div>
  <div class="reviews-grid">${reviewsHTML}</div>
</section>

<!-- GUARANTEE -->
<section class="guarantee-section">
  <div class="guarantee-inner">
    <div class="guarantee-badge">🛡️</div>
    <h2 class="guarantee-title">30-Day Money-Back Guarantee</h2>
    <p class="guarantee-text">Try Prime Formula for a full month. If you're not completely satisfied — for any reason — contact us and we'll refund every cent. No questions. No hassle. No fine print.</p>
    <div class="guarantee-tags">
      <div class="guarantee-tag">${ICON_CHECK} Full refund</div>
      <div class="guarantee-tag">${ICON_CHECK} No return required</div>
      <div class="guarantee-tag">${ICON_CHECK} No questions asked</div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <div class="faq-inner">
    <div class="section-header">
      <div class="section-label">FAQ</div>
      <h2 class="section-title">Common questions</h2>
    </div>
    ${faqHTML}
  </div>
</section>

<!-- FINAL CTA -->
<section class="final-cta">
  <div class="final-inner">
    <h2 class="final-title">Ready to feel <span>extraordinary?</span></h2>
    <p class="final-sub">Join 200,000+ people who made Prime Formula part of their daily routine. Your best self starts here.</p>
    <a href="#" class="final-btn">${ctaText}</a>
    <p class="final-note">Free shipping · 30-day guarantee · Cancel anytime</p>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand">◆ Prime</div>
        <p class="footer-tagline">Premium supplements crafted for people who refuse to settle for average.</p>
      </div>
      <div>
        <div class="footer-col-title">Product</div>
        <a class="footer-link" href="#">Daily Formula</a>
        <a class="footer-link" href="#">Ingredients</a>
        <a class="footer-link" href="#">Certifications</a>
        <a class="footer-link" href="#">Subscribe & Save</a>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <a class="footer-link" href="#">Our Science</a>
        <a class="footer-link" href="#">About Us</a>
        <a class="footer-link" href="#">Reviews</a>
        <a class="footer-link" href="#">Affiliates</a>
      </div>
      <div>
        <div class="footer-col-title">Support</div>
        <a class="footer-link" href="#">FAQ</a>
        <a class="footer-link" href="#">Shipping</a>
        <a class="footer-link" href="#">Returns</a>
        <a class="footer-link" href="#">Contact Us</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© 2025 Prime Formula. All rights reserved.</span>
      <div class="footer-certs">
        <span class="footer-cert">NSF Certified</span>
        <span class="footer-cert">GMP Facility</span>
        <span class="footer-cert">Third-Party Tested</span>
      </div>
    </div>
  </div>
</footer>

<script>
  // Gallery
  function switchImg(el, src) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  // Plan toggle
  let currentPlan = 'subscribe';
  const basePrice = ${JSON.stringify(price.replace(/[^0-9.]/g, '') || '79')};
  const origPrice = ${JSON.stringify(originalPrice.replace(/[^0-9.]/g, '') || '99')};

  function setPlan(btn, plan) {
    currentPlan = plan;
    document.querySelectorAll('.plan-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pm = document.getElementById('price-main');
    const po = document.getElementById('price-orig');
    const pn = document.getElementById('price-note');
    if (plan === 'subscribe') {
      pm.textContent = '$' + basePrice;
      po.textContent = '$' + origPrice;
      po.style.display = '';
      pn.textContent = 'Billed monthly · Free shipping · Cancel anytime';
    } else {
      const oneTime = Math.round(parseFloat(origPrice));
      pm.textContent = '$' + oneTime;
      po.style.display = 'none';
      pn.textContent = 'One-time purchase · Free shipping';
    }
  }

  // Qty
  let qty = 1;
  function changeQty(delta) {
    qty = Math.max(1, Math.min(10, qty + delta));
    document.getElementById('qty-val').textContent = qty;
  }

  // FAQ
  function toggleFaq(i) {
    const ans = document.getElementById('faq-a-' + i);
    const icon = document.getElementById('faq-icon-' + i);
    const isOpen = ans.style.display !== 'none';
    ans.style.display = isOpen ? 'none' : 'block';
    icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
  }

  // Scroll nav
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(6,11,6,0.98)';
    } else {
      nav.style.background = 'rgba(10,15,10,0.95)';
    }
  });
</script>
</body>
</html>`
}
