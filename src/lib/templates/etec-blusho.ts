import type { LandingPageData } from '@/types'

// ─── FALLBACK IMAGES — cosmetics / skincare Unsplash ─────────────────────────

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
]

const HERO_IMG = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80'

const CAT_IMGS = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
]

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────

const C = {
  bg:          '#FFFFFF',
  bgLight:     '#F8F6F3',
  olive:       '#7A8C6E',
  oliveDark:   '#4A5C3E',
  oliveLight:  '#EBF0E6',
  text:        '#1A1A1A',
  muted:       '#6B7280',
  border:      '#E5E7EB',
  sale:        '#C8A96E',
  star:        '#F59E0B',
  footer:      '#1A1A1A',
}

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const ICON_SEARCH    = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
const ICON_HEART     = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
const ICON_CART      = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
const ICON_USER      = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_INSTAGRAM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
const ICON_TWITTER   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
const ICON_FACEBOOK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
const ICON_TIKTOK    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>`

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function starsHtml(count: number, total = 5): string {
  return Array.from({ length: total }, (_, i) =>
    `<span style="color:${i < count ? C.star : '#D1D5DB'};font-size:13px;">&#9733;</span>`
  ).join('')
}

function avatarCircle(name: string, size = 48): string {
  const colors = ['#7A8C6E', '#C8A96E', '#4A5C3E', '#9CA87E', '#B8856A']
  const idx    = name.charCodeAt(0) % colors.length
  const init   = name.slice(0, 1).toUpperCase()
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${colors[idx]};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${Math.round(size * 0.38)}px;font-family:'Inter',sans-serif;flex-shrink:0;">${init}</div>`
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function templateEtecBlusho(data: LandingPageData): string {
  const imgs = (data.images && data.images.filter(Boolean).length >= 4)
    ? data.images.slice(0, 4)
    : FALLBACK_IMGS

  const price         = data.price         || '29.90'
  const originalPrice = data.original_price || '59.90'
  const savePct       = price && originalPrice
    ? Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)
    : 50

  const benefits = [
    data.benefits?.[0] || '100% Natural Ingredients',
    data.benefits?.[1] || 'Dermatologist Tested',
    data.benefits?.[2] || 'Cruelty Free',
    data.benefits?.[3] || 'Vegan Formula',
    data.benefits?.[4] || 'Paraben Free',
  ]

  const productName = data.product_name || 'Blusho Skincare'

  // produit cards — 6 entrées
  const productCards = [
    { name: productName,                      img: imgs[0], price, orig: originalPrice, rating: 4.8, reviews: 89,  badge: 'SALE'  },
    { name: `${productName} — Radiance Serum`,img: imgs[1], price: (parseFloat(price)+5).toFixed(2), orig:'', rating: 4.9, reviews: 134, badge: 'NEW'   },
    { name: `${productName} — Glow Mask`,     img: imgs[2], price: (parseFloat(price)+8).toFixed(2), orig:'', rating: 4.7, reviews: 62,  badge: ''      },
    { name: `${productName} — Eye Cream`,     img: imgs[3], price: (parseFloat(price)+3).toFixed(2), orig:'', rating: 4.6, reviews: 47,  badge: 'SALE'  },
    { name: `${productName} — Toner Mist`,    img: imgs[0], price: (parseFloat(price)-2).toFixed(2), orig:'', rating: 4.8, reviews: 105, badge: ''      },
    { name: `${productName} — Night Repair`,  img: imgs[1], price: (parseFloat(price)+12).toFixed(2),orig:'', rating: 5.0, reviews: 218, badge: 'NEW'   },
  ]

  const testimonials = [
    { name: 'Sophie M.',   rating: 5, quote: 'Absolutely love this brand. My skin has never felt so hydrated and glowy. I get compliments every single day!' },
    { name: 'Amara K.',    rating: 5, quote: 'The quality is outstanding. Clean ingredients, beautiful packaging, and it actually works. Worth every penny.' },
    { name: 'Isabelle R.', rating: 5, quote: 'Finally found a skincare brand I trust 100%. The serum transformed my skin within two weeks. Highly recommend!' },
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${productName} — Beauty & Skincare</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  /* ── RESET ── */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  img{display:block;max-width:100%;height:auto;}
  a{color:inherit;text-decoration:none;}
  button{cursor:pointer;border:none;background:none;font-family:inherit;}

  /* ── MARQUEE ANIMATION ── */
  @keyframes marqueeb{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes marquee-reverseb{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}

  /* ── NAVBAR ── */
  .navb{position:sticky;top:0;z-index:1000;background:${C.bg};border-bottom:1px solid ${C.border};padding:0 40px;}
  .nav-innerb{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;}
  .nav-leftb{display:flex;align-items:center;gap:20px;}
  .hamburgerb{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
  .hamburgerb span{display:block;width:22px;height:1.5px;background:${C.text};}
  .logob{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:28px;font-weight:600;color:${C.text};letter-spacing:-.5px;}
  .nav-linksb{display:flex;align-items:center;gap:28px;list-style:none;}
  .nav-linksb a{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:${C.text};transition:color .2s;}
  .nav-linksb a:hover{color:${C.olive};}
  .nav-rightb{display:flex;align-items:center;gap:16px;color:${C.text};}
  .nav-iconb{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;transition:background .2s;position:relative;cursor:pointer;}
  .nav-iconb:hover{background:${C.oliveLight};}
  .cart-badgeb{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:${C.olive};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;}

  /* ── ANNOUNCEMENT BAR ── */
  .announce-barb{background:${C.olive};color:#fff;padding:10px 0;overflow:hidden;position:relative;}
  .announce-trackb{display:flex;white-space:nowrap;animation:marqueeb 30s linear infinite;}
  .announce-itemb{font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:0 48px;}
  .announce-sepb{opacity:.6;margin:0 4px;}

  /* ── HERO ── */
  .herob{background:${C.bg};padding:80px 40px;max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
  .hero-textb{display:flex;flex-direction:column;gap:24px;}
  .hero-badgeb{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.olive};}
  .hero-badgeb::before{content:'';display:block;width:28px;height:1.5px;background:${C.olive};}
  .hero-h1b{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,5vw,72px);font-weight:700;line-height:1.05;color:${C.text};letter-spacing:-.02em;}
  .hero-subtitleb{font-size:15px;line-height:1.7;color:${C.muted};max-width:400px;}
  .hero-ctab{display:inline-flex;align-items:center;gap:10px;border:1.5px solid ${C.text};padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.text};transition:background .25s,color .25s;align-self:flex-start;}
  .hero-ctab:hover{background:${C.text};color:#fff;}
  .hero-imgb{position:relative;display:flex;justify-content:center;align-items:center;}
  .hero-img-wrapb{width:100%;max-width:520px;aspect-ratio:4/5;border-radius:40% 60% 60% 40% / 55% 45% 55% 45%;overflow:hidden;position:relative;}
  .hero-img-wrapb img{width:100%;height:100%;object-fit:cover;object-position:center top;}
  .hero-img-wrapb::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(122,140,110,.12));border-radius:inherit;}
  .hero-floatb{position:absolute;bottom:32px;left:-24px;background:${C.bg};border:1px solid ${C.border};padding:14px 20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.08);}
  .hero-float-numbb{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:${C.olive};line-height:1;}
  .hero-float-labelb{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:${C.muted};margin-top:2px;}

  /* ── STATS BAR ── */
  .stats-barb{border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:20px 40px;}
  .stats-innerb{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:0;}
  .statb{display:flex;align-items:center;gap:12px;padding:0 48px;}
  .statb:not(:last-child){border-right:1px solid ${C.border};}
  .stat-numbb{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:${C.text};}
  .stat-labelb{font-size:12px;color:${C.muted};font-weight:400;}

  /* ── CATEGORIES ── */
  .categoriesb{padding:80px 40px;background:${C.bg};}
  .section-headerb{max-width:1400px;margin:0 auto 40px;display:flex;align-items:flex-end;justify-content:space-between;}
  .section-tagsb{display:flex;flex-direction:column;gap:8px;}
  .section-overlineb{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.olive};}
  .section-titleb{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,40px);font-weight:700;color:${C.text};line-height:1.1;}
  .section-linkb{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${C.text};border-bottom:1.5px solid ${C.text};padding-bottom:2px;transition:color .2s,border-color .2s;white-space:nowrap;margin-bottom:4px;}
  .section-linkb:hover{color:${C.olive};border-color:${C.olive};}
  .cat-gridb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr);gap:20px;}
  .cat-cardb{display:flex;flex-direction:column;align-items:center;gap:16px;padding:28px 16px;border-radius:16px;border:1px solid ${C.border};background:${C.bg};cursor:pointer;transition:transform .25s,box-shadow .25s;}
  .cat-cardb:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(122,140,110,.15);}
  .cat-imgb{width:100px;height:100px;border-radius:50%;object-fit:cover;border:2px solid ${C.oliveLight};}
  .cat-nameb{font-size:13px;font-weight:600;color:${C.text};text-align:center;letter-spacing:.03em;}
  .cat-countb{font-size:11px;color:${C.muted};}

  /* ── BRAND STATEMENT ── */
  .brand-stmtb{background:${C.bgLight};padding:80px 40px;text-align:center;}
  .brand-stmt-innerb{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
  .brand-quoteb{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(22px,2.8vw,30px);line-height:1.6;color:${C.text};font-weight:400;}
  .brand-quote-subbb{font-size:14px;color:${C.muted};line-height:1.7;}

  /* ── PRODUCTS + SALE BANNER ── */
  .products-sectionb{padding:80px 40px;background:${C.bg};}
  .products-innerb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:40px;align-items:start;}
  .products-colb{display:flex;flex-direction:column;gap:28px;}
  .products-gridb{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  .pcardb{background:${C.bg};border:1px solid ${C.border};border-radius:12px;overflow:hidden;position:relative;transition:box-shadow .25s;}
  .pcardb:hover{box-shadow:0 8px 32px rgba(0,0,0,.09);}
  .pcard-imgwrapb{position:relative;aspect-ratio:1;overflow:hidden;background:${C.bgLight};}
  .pcard-imgwrapb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
  .pcardb:hover .pcard-imgwrapb img{transform:scale(1.05);}
  .pcard-badgeb{position:absolute;top:10px;left:10px;background:${C.olive};color:#fff;font-size:9px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .pcard-bodyb{padding:16px;}
  .pcard-nameb{font-size:13px;font-weight:500;color:${C.text};line-height:1.4;margin-bottom:8px;}
  .pcard-priceb{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .pcard-price-currentb{font-size:15px;font-weight:700;color:${C.text};}
  .pcard-price-origb{font-size:13px;color:${C.muted};text-decoration:line-through;}
  .pcard-ratingb{display:flex;align-items:center;gap:6px;font-size:11px;color:${C.muted};}
  .pcard-atcb{position:absolute;bottom:0;left:0;right:0;background:${C.text};color:#fff;padding:12px;text-align:center;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transform:translateY(100%);transition:transform .25s;}
  .pcardb:hover .pcard-atcb{transform:translateY(0);}

  /* ── SALE BANNER ── */
  .sale-bannerb{background:${C.olive};border-radius:16px;padding:40px 28px;display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden;}
  .sale-bannerb::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.06);}
  .sale-bannerb::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.04);}
  .sale-bigb{font-family:'Cormorant Garamond',serif;font-size:clamp(56px,6vw,84px);font-weight:700;color:#fff;line-height:.9;letter-spacing:-.02em;position:relative;z-index:1;}
  .sale-sublabelb{font-size:13px;font-weight:500;color:rgba(255,255,255,.8);letter-spacing:.1em;text-transform:uppercase;position:relative;z-index:1;}
  .sale-timerb{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;position:relative;z-index:1;}
  .timer-unitb{background:rgba(255,255,255,.15);border-radius:8px;padding:10px 6px;text-align:center;backdrop-filter:blur(4px);}
  .timer-numbb{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#fff;line-height:1;display:block;}
  .timer-labelb{font-size:8px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:2px;display:block;}
  .sale-imgb{width:100%;aspect-ratio:1;border-radius:12px;object-fit:cover;position:relative;z-index:1;}
  .sale-ctab{display:block;background:#fff;color:${C.olive};text-align:center;padding:13px;border-radius:8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:opacity .2s;position:relative;z-index:1;}
  .sale-ctab:hover{opacity:.92;}

  /* ── BEST SELLERS ── */
  .bestsellersb{padding:80px 40px;background:${C.bgLight};}
  .bs-innerb{max-width:1400px;margin:0 auto;}
  .bs-tabsb{display:flex;align-items:center;gap:4px;margin-bottom:32px;background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:4px;width:fit-content;}
  .bs-tabb{padding:8px 20px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};cursor:pointer;transition:background .2s,color .2s;border:none;background:transparent;}
  .bs-tabb.activebb{background:${C.olive};color:#fff;}
  .bs-gridb{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
  .bscardb{background:${C.bg};border-radius:12px;overflow:hidden;position:relative;transition:box-shadow .25s;}
  .bscardb:hover{box-shadow:0 8px 32px rgba(0,0,0,.09);}
  .bscard-imgwrapb{position:relative;aspect-ratio:3/4;overflow:hidden;background:${C.bgLight};}
  .bscard-imgwrapb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
  .bscardb:hover .bscard-imgwrapb img{transform:scale(1.04);}
  .bscard-badgeb{position:absolute;top:10px;left:10px;background:${C.olive};color:#fff;font-size:9px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .bscard-wishlistb{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;color:${C.muted};}
  .bscard-wishlistb:hover{background:#fff;color:${C.olive};}
  .bscard-bodyb{padding:16px;}
  .bscard-nameb{font-size:13px;font-weight:500;color:${C.text};margin-bottom:8px;line-height:1.4;}
  .bscard-priceb{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .bscard-price-currentb{font-size:15px;font-weight:700;color:${C.text};}
  .bscard-price-origb{font-size:12px;color:${C.muted};text-decoration:line-through;}
  .bscard-ratingb{display:flex;align-items:center;gap:5px;font-size:11px;color:${C.muted};}

  /* ── MARQUEE PRODUITS ── */
  .product-marqueeb{background:${C.oliveLight};padding:32px 0;overflow:hidden;}
  .pm-trackb{display:flex;white-space:nowrap;animation:marquee-reverseb 25s linear infinite;gap:0;}
  .pm-itemb{display:inline-flex;align-items:center;gap:16px;padding:0 40px;}
  .pm-imgb{width:56px;height:56px;border-radius:8px;object-fit:cover;flex-shrink:0;}
  .pm-nameb{font-size:13px;font-weight:500;color:${C.oliveDark};letter-spacing:.04em;}
  .pm-dotb{width:4px;height:4px;border-radius:50%;background:${C.olive};flex-shrink:0;}

  /* ── TESTIMONIALS ── */
  .testimonialsb{padding:80px 40px;background:${C.bg};}
  .testi-innerb{max-width:1400px;margin:0 auto;}
  .testi-ratingb{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
  .testi-avg-scoreb{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${C.text};}
  .testi-avg-labelb{font-size:12px;color:${C.muted};}
  .testi-gridb{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px;}
  .tcardb{background:${C.bgLight};border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:16px;}
  .tcard-starb{display:flex;gap:2px;}
  .tcard-quoteb{font-size:14px;line-height:1.75;color:${C.text};font-style:italic;}
  .tcard-authorb{display:flex;align-items:center;gap:12px;margin-top:auto;}
  .tcard-nameb{font-size:13px;font-weight:600;color:${C.text};}
  .tcard-verifiedb{font-size:11px;color:${C.olive};}

  /* ── NEWSLETTER ── */
  .newsletterb{background:${C.olive};padding:80px 40px;text-align:center;}
  .nl-innerb{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:20px;align-items:center;}
  .nl-titleb{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,40px);font-weight:700;color:#fff;line-height:1.15;}
  .nl-subtitleb{font-size:14px;color:rgba(255,255,255,.8);line-height:1.6;}
  .nl-formb{display:flex;width:100%;max-width:420px;gap:0;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.3);}
  .nl-inputb{flex:1;padding:14px 18px;background:rgba(255,255,255,.15);border:none;outline:none;font-size:14px;color:#fff;font-family:'Inter',sans-serif;}
  .nl-inputb::placeholder{color:rgba(255,255,255,.6);}
  .nl-btnb{padding:14px 24px;background:#fff;color:${C.olive};border:none;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:opacity .2s;white-space:nowrap;}
  .nl-btnb:hover{opacity:.92;}
  .nl-noteb{font-size:11px;color:rgba(255,255,255,.6);}

  /* ── FOOTER ── */
  .footerb{background:${C.footer};padding:60px 40px 32px;color:rgba(255,255,255,.7);}
  .footer-gridbb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.1);}
  .footer-logob{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:32px;font-weight:600;color:#fff;margin-bottom:12px;}
  .footer-taglineb{font-size:13px;line-height:1.7;color:rgba(255,255,255,.55);margin-bottom:20px;max-width:240px;}
  .footer-socialsb{display:flex;gap:12px;}
  .footer-social-iconb{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);transition:border-color .2s,color .2s;cursor:pointer;}
  .footer-social-iconb:hover{border-color:${C.olive};color:${C.olive};}
  .footer-col-titleb{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin-bottom:20px;}
  .footer-linksb{list-style:none;display:flex;flex-direction:column;gap:10px;}
  .footer-linksb a{font-size:13px;color:rgba(255,255,255,.55);transition:color .2s;}
  .footer-linksb a:hover{color:#fff;}
  .footer-contact-itemb{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:12px;line-height:1.5;}
  .footer-copyrightb{max-width:1400px;margin:24px auto 0;text-align:center;font-size:12px;color:rgba(255,255,255,.3);}

  /* ── RESPONSIVE ── */
  @media(max-width:1024px){
    .nav-linksb{display:none;}
    .cat-gridb{grid-template-columns:repeat(3,1fr);}
    .bs-gridb{grid-template-columns:repeat(2,1fr);}
    .footer-gridbb{grid-template-columns:1fr 1fr;}
  }
  @media(max-width:768px){
    .navb{padding:0 20px;}
    .herob{padding:48px 20px;grid-template-columns:1fr;gap:40px;}
    .hero-img-wrapb{max-width:380px;margin:0 auto;}
    .hero-floatb{display:none;}
    .stats-barb{padding:20px;}
    .stats-innerb{gap:0;flex-wrap:wrap;}
    .statb{padding:12px 20px;width:50%;border-right:none !important;border-bottom:1px solid ${C.border};}
    .categoriesb,.products-sectionb,.bestsellersb,.testimonialsb,.newsletterb{padding:56px 20px;}
    .cat-gridb{grid-template-columns:repeat(2,1fr);}
    .products-innerb{grid-template-columns:1fr;}
    .products-gridb{grid-template-columns:repeat(2,1fr);}
    .bs-gridb{grid-template-columns:repeat(2,1fr);}
    .testi-gridb{grid-template-columns:1fr;}
    .footer-gridbb{grid-template-columns:1fr;gap:32px;padding:0 20px 40px;}
    .footerb{padding:40px 20px 24px;}
    .sale-timerb{grid-template-columns:repeat(4,1fr);}
  }
  @media(max-width:480px){
    .products-gridb{grid-template-columns:1fr;}
    .bs-gridb{grid-template-columns:1fr;}
    .cat-gridb{grid-template-columns:repeat(2,1fr);}
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 1. ANNOUNCEMENT BAR                                        -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="announce-barb" role="marquee" aria-live="off">
  <div class="announce-trackb">
    <span class="announce-itemb">WEEKEND SALE! GET UP TO ${savePct}% OFF<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">FREE SHIPPING AND RETURN POLICY<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">LIMITED TIME OFFER! HURRY UP!<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">GRAND OPENING OFFERS<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">WEEKEND SALE! GET UP TO ${savePct}% OFF<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">FREE SHIPPING AND RETURN POLICY<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">LIMITED TIME OFFER! HURRY UP!<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">GRAND OPENING OFFERS<span class="announce-sepb"> ✦</span></span>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 2. NAVBAR                                                   -->
<!-- ══════════════════════════════════════════════════════════ -->
<header class="navb" role="banner">
  <div class="nav-innerb">
    <!-- Left -->
    <div class="nav-leftb">
      <div class="hamburgerb" aria-label="Menu" role="button" tabindex="0">
        <span></span><span></span><span></span>
      </div>
      <a href="javascript:void(0)" onclick="event.preventDefault()" class="logob" aria-label="${productName} home">blusho</a>
    </div>
    <!-- Center nav -->
    <nav aria-label="Main navigation">
      <ul class="nav-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Home</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Shop</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Pages</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Features</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Blogs</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Contact</a></li>
      </ul>
    </nav>
    <!-- Right icons -->
    <div class="nav-rightb">
      <button class="nav-iconb" aria-label="Search">${ICON_SEARCH}</button>
      <button class="nav-iconb" aria-label="Wishlist">${ICON_HEART}</button>
      <button class="nav-iconb" aria-label="Account">${ICON_USER}</button>
      <button class="nav-iconb" aria-label="Cart, 2 items" style="position:relative;">
        ${ICON_CART}
        <span class="cart-badgeb" aria-hidden="true">2</span>
      </button>
    </div>
  </div>
</header>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 3. HERO SECTION                                             -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="herob" aria-label="Hero">
  <div class="hero-textb">
    <span class="hero-badgeb">A Beauty &amp; Skin Care</span>
    <h1 class="hero-h1b">${data.headline || 'High Cosmetics<br/>Product For You'}</h1>
    <p class="hero-subtitleb">${data.subtitle || 'Discover our curated collection of premium skincare essentials crafted for your unique skin.'}</p>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="hero-ctab">${data.cta || 'See All Collection'} &rarr;</a>
  </div>
  <div class="hero-imgb">
    <div class="hero-img-wrapb">
      <img src="${HERO_IMG}" alt="${productName} hero model" loading="eager" width="520" height="650"/>
    </div>
    <div class="hero-floatb" aria-hidden="true">
      <div class="hero-float-numbb">50K+</div>
      <div class="hero-float-labelb">Happy Clients</div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 4. STATS BAR                                                -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="stats-barb" aria-label="Key stats">
  <div class="stats-innerb">
    <div class="statb">
      <span class="stat-numbb">2500+</span>
      <span class="stat-labelb">Products</span>
    </div>
    <div class="statb">
      <span class="stat-numbb">100%</span>
      <span class="stat-labelb">Natural</span>
    </div>
    <div class="statb">
      <span class="stat-numbb">50K+</span>
      <span class="stat-labelb">Happy Clients</span>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 5. SHOP BY CATEGORIES                                       -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="categoriesb" aria-label="Shop by categories">
  <div class="section-headerb">
    <div class="section-tagsb">
      <span class="section-overlineb">Top Search Favorites</span>
      <h2 class="section-titleb">Shop by Categories</h2>
    </div>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="section-linkb">All Categories &rarr;</a>
  </div>
  <div class="cat-gridb">
    ${[
      { name: 'Beauty Glow', count: 48 },
      { name: 'Body Lotion', count: 32 },
      { name: 'Cosmetics',   count: 75 },
      { name: 'Face Wash',   count: 29 },
      { name: 'Hair Style',  count: 41 },
    ].map((cat, i) => `
    <div class="cat-cardb" role="button" tabindex="0" aria-label="${cat.name} category">
      <img class="cat-imgb" src="${CAT_IMGS[i]}" alt="${cat.name}" loading="lazy" width="100" height="100"/>
      <span class="cat-nameb">${cat.name}</span>
      <span class="cat-countb">${cat.count} Products</span>
    </div>`).join('')}
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 6. BRAND STATEMENT                                          -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="brand-stmtb" aria-label="Brand statement">
  <div class="brand-stmt-innerb">
    <p class="brand-quoteb">
      &ldquo;${productName} Is A Cosmetic Brand Dedicated To Beauty &#127807; Innovation, Offering High-Quality &#128142; Skin-Friendly Makeup And Skincare &#127800; Products&rdquo;
    </p>
    <p class="brand-quote-subbb">${data.subtitle || 'Premium formulas, visible results. Designed for every skin type.'}</p>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 7. FEATURED PRODUCTS + SALE BANNER                         -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="products-sectionb" aria-label="Featured products">
  <div class="products-innerb">
    <!-- Left: products grid -->
    <div class="products-colb">
      <div class="section-headerb" style="margin-bottom:0;">
        <div class="section-tagsb">
          <h2 class="section-titleb">Explore Products</h2>
        </div>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="section-linkb">View All &rarr;</a>
      </div>
      <div class="products-gridb">
        ${productCards.map(p => `
        <article class="pcardb">
          <div class="pcard-imgwrapb">
            <img src="${p.img}" alt="${p.name}" loading="lazy" width="300" height="300"/>
            ${p.badge ? `<span class="pcard-badgeb">${p.badge}</span>` : ''}
          </div>
          <div class="pcard-bodyb">
            <p class="pcard-nameb">${p.name}</p>
            <div class="pcard-priceb">
              <span class="pcard-price-currentb">$${p.price}</span>
              ${p.orig ? `<span class="pcard-price-origb">$${p.orig}</span>` : ''}
            </div>
            <div class="pcard-ratingb">
              ${starsHtml(Math.floor(p.rating))}
              <span>${p.rating} (${p.reviews})</span>
            </div>
          </div>
          <button class="pcard-atcb" aria-label="Add ${p.name} to cart">Add to Cart</button>
        </article>`).join('')}
      </div>
    </div>
    <!-- Right: sale banner -->
    <aside class="sale-bannerb" aria-label="Sale promotion">
      <div class="sale-bigb">${savePct}%<br/>SALE!</div>
      <p class="sale-sublabelb">Limited time offer &mdash; don't miss out</p>
      <div class="sale-timerb" id="countdown-blusho" aria-live="polite">
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-d">00</span><span class="timer-labelb">Days</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-h">00</span><span class="timer-labelb">Hrs</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-m">00</span><span class="timer-labelb">Mns</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-s">00</span><span class="timer-labelb">Secs</span></div>
      </div>
      <img class="sale-imgb" src="${imgs[2]}" alt="Sale product" loading="lazy" width="320" height="320"/>
      <a href="javascript:void(0)" onclick="event.preventDefault()" class="sale-ctab">Shop the Sale &rarr;</a>
    </aside>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 8. BEST SELLERS                                             -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="bestsellersb" aria-label="Best sellers">
  <div class="bs-innerb">
    <div class="section-headerb" style="margin-bottom:24px;">
      <div class="section-tagsb">
        <span class="section-overlineb">Customer Favorites</span>
        <h2 class="section-titleb">Best Sellers</h2>
      </div>
    </div>
    <!-- Tabs -->
    <div class="bs-tabsb" role="tablist" aria-label="Product categories">
      <button class="bs-tabb activebb" role="tab" aria-selected="true"  onclick="bsTabs(this,'all')">All</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'skincare')">Skincare</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'makeup')">Makeup</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'hair')">Hair</button>
    </div>
    <div class="bs-gridb">
      ${productCards.slice(0, 4).map((p, i) => `
      <article class="bscardb" data-cat="${['all','skincare','makeup','hair'][i % 4]}">
        <div class="bscard-imgwrapb">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="320" height="426"/>
          ${p.badge ? `<span class="bscard-badgeb">${p.badge}</span>` : ''}
          <button class="bscard-wishlistb" aria-label="Add ${p.name} to wishlist">${ICON_HEART}</button>
        </div>
        <div class="bscard-bodyb">
          <p class="bscard-nameb">${p.name}</p>
          <div class="bscard-priceb">
            <span class="bscard-price-currentb">$${p.price}</span>
            ${p.orig ? `<span class="bscard-price-origb">$${p.orig}</span>` : ''}
          </div>
          <div class="bscard-ratingb">
            ${starsHtml(Math.floor(p.rating))}
            <span>${p.reviews} reviews</span>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 9. MARQUEE PRODUITS DÉFILANTS                              -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="product-marqueeb" aria-hidden="true">
  <div class="pm-trackb">
    ${[...productCards, ...productCards].map(p => `
    <span class="pm-itemb">
      <img class="pm-imgb" src="${p.img}" alt="${p.name}" loading="lazy" width="56" height="56"/>
      <span class="pm-nameb">${p.name}</span>
      <span class="pm-dotb"></span>
    </span>`).join('')}
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 10. TESTIMONIALS                                            -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="testimonialsb" aria-label="Customer reviews">
  <div class="testi-innerb">
    <div class="section-headerb">
      <div class="section-tagsb">
        <span class="section-overlineb">Real Stories</span>
        <h2 class="section-titleb">What Our Clients Say</h2>
      </div>
      <div>
        <div class="testi-ratingb">
          ${starsHtml(5)}
          <span class="testi-avg-scoreb">4.9/5</span>
        </div>
        <span class="testi-avg-labelb">from 2,847 verified reviews</span>
      </div>
    </div>
    <div class="testi-gridb">
      ${testimonials.map(t => `
      <div class="tcardb">
        <div class="tcard-starb">${starsHtml(t.rating)}</div>
        <p class="tcard-quoteb">&ldquo;${t.quote}&rdquo;</p>
        <div class="tcard-authorb">
          ${avatarCircle(t.name, 40)}
          <div>
            <div class="tcard-nameb">${t.name}</div>
            <div class="tcard-verifiedb">&#10003; Verified Purchase</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 11. NEWSLETTER                                              -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="newsletterb" aria-label="Newsletter signup">
  <div class="nl-innerb">
    <h2 class="nl-titleb">Subscribe &amp; Get 10% Off Your First Order</h2>
    <p class="nl-subtitleb">Join 50,000+ beauty lovers and be the first to hear about new products, exclusive offers, and skincare tips.</p>
    <form class="nl-formb" onsubmit="return false;" aria-label="Email subscription form">
      <input class="nl-inputb" type="email" placeholder="Enter your email address" aria-label="Email address" autocomplete="email"/>
      <button class="nl-btnb" type="submit">Subscribe</button>
    </form>
    <p class="nl-noteb">No spam. Unsubscribe anytime.</p>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 12. FOOTER                                                  -->
<!-- ══════════════════════════════════════════════════════════ -->
<footer class="footerb" role="contentinfo">
  <div class="footer-gridbb">
    <!-- Col 1: Brand -->
    <div>
      <div class="footer-logob">blusho</div>
      <p class="footer-taglineb">Your trusted beauty companion. Premium skincare crafted with nature's finest ingredients.</p>
      <div class="footer-socialsb" aria-label="Social media links">
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Instagram">${ICON_INSTAGRAM}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="TikTok">${ICON_TIKTOK}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Twitter">${ICON_TWITTER}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Facebook">${ICON_FACEBOOK}</a>
      </div>
    </div>
    <!-- Col 2: Quick Links -->
    <div>
      <p class="footer-col-titleb">Quick Links</p>
      <ul class="footer-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Home</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">About Us</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Shop</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Blog</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Contact</a></li>
      </ul>
    </div>
    <!-- Col 3: Help -->
    <div>
      <p class="footer-col-titleb">Help</p>
      <ul class="footer-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">FAQ</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Shipping &amp; Returns</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Track Order</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Privacy Policy</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">Terms of Service</a></li>
      </ul>
    </div>
    <!-- Col 4: Contact -->
    <div>
      <p class="footer-col-titleb">Contact</p>
      <div class="footer-contact-itemb">
        <span>&#9993;</span>
        <span>hello@blusho.com</span>
      </div>
      <div class="footer-contact-itemb">
        <span>&#9742;</span>
        <span>+1 (800) 555-GLOW</span>
      </div>
      <div class="footer-contact-itemb">
        <span>&#9679;</span>
        <span>Mon–Fri, 9am–6pm EST</span>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        ${benefits.slice(0, 3).map(b => `<span style="background:rgba(255,255,255,.08);border-radius:20px;padding:4px 12px;font-size:11px;color:rgba(255,255,255,.6);">${b}</span>`).join('')}
      </div>
    </div>
  </div>
  <p class="footer-copyrightb">&copy; ${new Date().getFullYear()} ${productName}. All rights reserved. Crafted with care for your skin.</p>
</footer>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- SCRIPTS                                                     -->
<!-- ══════════════════════════════════════════════════════════ -->
<script>
(function () {
  'use strict';

  // ── COUNTDOWN TIMER ──────────────────────────────────────
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(23, 59, 59, 0);

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    var now  = new Date();
    var diff = endDate - now;
    if (diff <= 0) {
      document.getElementById('cddb-d').textContent = '00';
      document.getElementById('cddb-h').textContent = '00';
      document.getElementById('cddb-m').textContent = '00';
      document.getElementById('cddb-s').textContent = '00';
      return;
    }
    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000)  / 60000);
    var seconds = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cddb-d').textContent = pad(days);
    document.getElementById('cddb-h').textContent = pad(hours);
    document.getElementById('cddb-m').textContent = pad(minutes);
    document.getElementById('cddb-s').textContent = pad(seconds);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── BEST SELLERS TABS ─────────────────────────────────────
  window.bsTabs = function (btn, cat) {
    var tabs = document.querySelectorAll('.bs-tabb');
    tabs.forEach(function (t) {
      t.classList.remove('activebb');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('activebb');
    btn.setAttribute('aria-selected', 'true');
    var cards = document.querySelectorAll('.bscardb');
    cards.forEach(function (c) {
      var cardCat = c.getAttribute('data-cat');
      c.style.display = (cat === 'all' || cardCat === cat) ? 'block' : 'none';
    });
  };

})();
</script>
</body>
</html>`
}
