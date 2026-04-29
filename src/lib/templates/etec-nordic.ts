import type { LandingPageData } from '@/types'
import { ico } from './icons'

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80',
]

const C = {
  bg:          '#FAFAF8',
  bgAlt:       '#F2EFE9',
  card:        '#FFFFFF',
  accent:      '#2C2C2C',
  accentWarm:  '#8B7355',
  accentLight: '#EDE8E0',
  text:        '#1A1A1A',
  muted:       '#6B6560',
  border:      '#E0DBD4',
  sand:        '#C4AD8F',
}

function starsNd(n: number): string {
  return [1,2,3,4,5].map(i =>
    `<span style="color:${i <= n ? C.accentWarm : C.border};font-size:13px;">★</span>`
  ).join('')
}

export function templateEtecNordic(data: LandingPageData): string {
  const imgAt = (i: number) =>
    (data.images && data.images[i] && data.images[i].length > 0)
      ? data.images[i]
      : FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const productName = data.product_name   || 'Nordic Object'
  const subtitle    = data.subtitle       || 'Designed for quiet living.'
  const ctaText     = data.cta            || 'Shop Now'
  const price       = data.price          || null
  const origPrice   = data.original_price || null
  const urgency     = data.urgency        || null
  const bens        = data.benefits       || []

  const savePct = price && origPrice
    ? Math.round((1 - parseFloat(price) / parseFloat(origPrice)) * 100)
    : 0

  const materials = [bens[0] || 'Chêne massif', bens[1] || 'Lin naturel', bens[2] || 'Laiton brossé']
  const materialsHTML = materials.map(m =>
    `<span style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;color:${C.muted};border:1px solid ${C.border};padding:4px 12px;">${m}</span>`
  ).join('')

  const thumbsHTML = [imgAt(0), imgAt(1), imgAt(2), imgAt(3)].map((src, i) => `
    <div onclick="document.getElementById('main-img-nd').src='${src}';document.querySelectorAll('.th-nd').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${C.accent}':'2px solid transparent';t.style.opacity=j===${i}?'1':'0.5';});"
      class="th-nd"
      style="overflow:hidden;aspect-ratio:1;cursor:pointer;outline:${i === 0 ? `2px solid ${C.accent}` : '2px solid transparent'};opacity:${i === 0 ? 1 : 0.5};transition:all .18s;"
    ><img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>`).join('')

  const colNames  = [bens[0]||'Linen Cushion', bens[1]||'Oak Side Table', bens[2]||'Brass Pendant', bens[3]||'Ceramic Vase', bens[4]||'Wool Throw', bens[5]||'Stoneware Bowl']
  const colPrices = ['€49','€189','€129','€74','€95','€38']
  const collectionHTML = [0,1,2,3,4,5].map(i => `
    <div style="position:relative;overflow:hidden;cursor:pointer;background:${C.bgAlt};"
      onmouseenter="this.querySelector('.ov-nd').style.opacity='1';"
      onmouseleave="this.querySelector('.ov-nd').style.opacity='0';">
      <img src="${imgAt(i % 4)}" alt="${colNames[i]}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;"/>
      <div class="ov-nd" style="position:absolute;inset:0;background:rgba(26,26,26,.58);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;opacity:0;transition:opacity .25s;">
        <span style="color:#fff;font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;text-align:center;padding:0 16px;">${colNames[i]}</span>
        <span style="color:${C.sand};font-family:'Manrope',sans-serif;font-size:12px;">${colPrices[i]}</span>
        <a href="javascript:void(0)" onclick="event.preventDefault()" style="background:transparent;border:1px solid rgba(255,255,255,.6);color:#fff;font-family:'Manrope',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;padding:7px 20px;text-decoration:none;">Add</a>
      </div>
    </div>`).join('')

  const craftsData = [
    { img: imgAt(1), title: 'Le bois qui dure',     desc: "Chaque pièce commence par la sélection rigoureuse d'une essence noble, séchée lentement pour éviter toute déformation. Le grain unique de chaque planche en fait un objet singulier, inimitable." },
    { img: imgAt(2), title: 'Le toucher du lin',    desc: 'Tissé sur des métiers traditionnels, notre lin est lavé à l\'eau douce pour révéler son caractère naturel. Sa texture légèrement texturée évolue avec le temps et les usages.' },
    { img: imgAt(3), title: 'Le détail qui compte', desc: 'Les finitions en laiton brossé sont usinées à la main, puis patinées pour obtenir une teinte chaude et mate. Chaque pièce métallique est assemblée avec une précision d\'horlogerie.' },
  ]

  const craftsHTML = craftsData.map((c, i) => {
    const rev = i % 2 === 1
    return `
    <div class="craft-row-nd" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;">
      <div style="order:${rev ? 2 : 1};overflow:hidden;aspect-ratio:4/3;">
        <img src="${c.img}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
      </div>
      <div style="order:${rev ? 1 : 2};">
        <div style="width:32px;height:1px;background:${C.accentWarm};margin-bottom:20px;"></div>
        <h3 style="font-family:'Fraunces',serif;font-size:26px;font-weight:400;color:${C.text};line-height:1.3;margin-bottom:16px;">${c.title}</h3>
        <p style="font-family:'Manrope',sans-serif;font-size:14px;color:${C.muted};line-height:1.85;">${c.desc}</p>
      </div>
    </div>`
  }).join('')

  const reviewsData = [
    { name:'Camille R.', stars:5, text:'Qualité exceptionnelle. La finition est parfaite, le bois est exactement tel que décrit. Un objet qui va durer des années. Je recommande sans hésiter.', date:'Il y a 4 jours' },
    { name:'Jonas B.',   stars:5, text:"Reçu en parfait état, bien emballé. Le produit correspond en tous points aux photos. Simple, élégant, bien fait. C'est rare de nos jours.", date:'Il y a 2 semaines' },
    { name:'Léa M.',     stars:4, text:'Très satisfaite de mon achat. Le matériau est agréable au toucher, la couleur est fidèle. Je l\'utilise tous les jours et il reste impeccable.', date:'Il y a 1 mois' },
  ]

  const reviewsHTML = reviewsData.map(r => `
    <div style="padding:28px 0;border-bottom:1px solid ${C.border};">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
        <div>
          <span style="font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:${C.text};">${r.name}</span>
          <div style="display:flex;align-items:center;gap:2px;margin-top:4px;">${starsNd(r.stars)}</div>
        </div>
        <span style="font-family:'Manrope',sans-serif;font-size:11px;color:${C.muted};white-space:nowrap;margin-left:12px;">${r.date}</span>
      </div>
      <p style="font-family:'Manrope',sans-serif;font-size:13px;color:${C.muted};line-height:1.75;">${r.text}</p>
    </div>`).join('')

  const faqItems = (data.faq && data.faq.length > 0) ? data.faq : [
    { question:"Quelle est la matière utilisée ?",             answer:"Nous utilisons uniquement des matières naturelles et durables : bois massif certifié FSC, lin lavé et laiton brossé. Chaque pièce est fabriquée à la main par des artisans sélectionnés." },
    { question:"Quels sont les délais de livraison ?",          answer:"Les commandes sont expédiées sous 2 à 3 jours ouvrés. La livraison prend 4 à 6 jours en France métropolitaine. Une confirmation par email vous est envoyée dès l'expédition." },
    { question:"Comment entretenir le produit ?",               answer:"Nettoyage délicat avec un chiffon légèrement humide. Éviter les produits abrasifs. Le bois peut être légèrement huilé une fois par an pour conserver son éclat naturel." },
    { question:"Acceptez-vous les retours ?",                   answer:"Nous acceptons les retours dans les 30 jours suivant la réception pour tout article non utilisé dans son emballage d'origine. Les frais de retour sont à la charge du client sauf défaut." },
  ]

  const faqHTML = faqItems.map((item, i) => `
    <div style="border-bottom:1px solid ${C.border};">
      <button onclick="var p=this.nextElementSibling,open=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fpnd').forEach(function(x){x.style.maxHeight='0';x.style.paddingBottom='0';});document.querySelectorAll('.find').forEach(function(x){x.style.transform='rotate(0deg)';});if(!open){p.style.maxHeight='240px';p.style.paddingBottom='20px';this.querySelector('.find').style.transform='rotate(45deg)';}"
        style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;font-family:inherit;">
        <span style="font-family:'Manrope',sans-serif;font-size:14px;font-weight:500;color:${C.text};line-height:1.4;">${item.question}</span>
        <span class="find" style="color:${C.accent};font-size:22px;font-weight:300;line-height:1;flex-shrink:0;transition:transform .25s ease;transform:${i === 0 ? 'rotate(45deg)' : 'rotate(0deg)'};">+</span>
      </button>
      <div class="fpnd" style="max-height:${i === 0 ? '240px' : '0'};overflow:hidden;transition:max-height .3s ease,padding-bottom .3s ease;padding-bottom:${i === 0 ? '20px' : '0'};">
        <p style="font-family:'Manrope',sans-serif;font-size:13px;color:${C.muted};line-height:1.8;">${item.answer}</p>
      </div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${productName} — Nordic Living</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Manrope',sans-serif;background:${C.bg};color:${C.text};-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  img{display:block;max-width:100%;} a{text-decoration:none;color:inherit;}
  @media(max-width:768px){
    .nav-links-nd{display:none!important;}
    .hero-nd{flex-direction:column!important;min-height:auto!important;}
    .hero-left-nd{flex:none!important;padding:48px 20px 40px!important;}
    .hero-right-nd{flex:none!important;min-height:60vw!important;}
    .hero-h1-nd{font-size:36px!important;}
    .values-nd{flex-wrap:wrap!important;}
    .val-item-nd{flex:0 0 50%!important;border-right:none!important;border-bottom:1px solid ${C.border}!important;padding:16px!important;}
    .product-grid-nd{grid-template-columns:1fr!important;gap:40px!important;padding:48px 20px!important;}
    .craft-row-nd{grid-template-columns:1fr!important;gap:32px!important;}
    .craft-row-nd>div{order:unset!important;}
    .col-grid-nd{grid-template-columns:1fr 1fr!important;}
    .rev-grid-nd{grid-template-columns:1fr!important;}
    .footer-nd{grid-template-columns:1fr 1fr!important;gap:28px!important;}
    .section-pad-nd{padding:64px 20px!important;}
  }
</style>
</head>
<body>

<!-- NAVBAR -->
<nav style="background:${C.card};border-bottom:1px solid ${C.border};position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 64px;height:64px;gap:32px;">
  <span style="font-family:'Fraunces',serif;font-size:22px;font-weight:400;color:${C.text};letter-spacing:.3em;text-transform:uppercase;flex-shrink:0;">NORDIC</span>
  <div class="nav-links-nd" style="display:flex;align-items:center;gap:36px;">
    ${['Objects','Living','Stories','About'].map(l => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Manrope',sans-serif;font-size:12px;font-weight:500;color:${C.muted};letter-spacing:.15em;text-transform:uppercase;transition:color .2s;" onmouseover="this.style.color='${C.text}'" onmouseout="this.style.color='${C.muted}'">${l}</a>`).join('')}
  </div>
  <a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Manrope',sans-serif;font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};border:1px solid ${C.accent};padding:9px 20px;flex-shrink:0;transition:background .2s,color .2s;" onmouseover="this.style.background='${C.accent}';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='${C.accent}'">${ctaText}</a>
</nav>

<!-- HERO -->
<section class="hero-nd" style="display:flex;min-height:90vh;overflow:hidden;">
  <div class="hero-left-nd" style="flex:0 0 40%;display:flex;flex-direction:column;justify-content:center;padding:80px 64px;position:relative;">
    <span style="font-family:'Fraunces',serif;font-size:120px;font-weight:300;color:${C.text};opacity:.07;line-height:1;position:absolute;top:40px;left:48px;pointer-events:none;user-select:none;" aria-hidden="true">01</span>
    <div style="display:inline-flex;align-items:center;gap:8px;font-family:'Manrope',sans-serif;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.accentWarm};margin-bottom:28px;"><span style="display:block;width:20px;height:1px;background:${C.accentWarm};"></span>Slow Design · Made to Last</div>
    <h1 class="hero-h1-nd" style="font-family:'Fraunces',serif;font-size:68px;font-weight:400;line-height:1.05;letter-spacing:-.02em;color:${C.text};margin-bottom:24px;">Objects That Tell<br>Your Story</h1>
    <p style="font-family:'Manrope',sans-serif;font-size:15px;color:${C.muted};line-height:1.75;max-width:340px;margin-bottom:40px;">${subtitle}</p>
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:inline-block;background:${C.accent};color:#fff;font-family:'Manrope',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:14px 32px;transition:opacity .2s;" onmouseover="this.style.opacity='.82'" onmouseout="this.style.opacity='1'">${ctaText}</a>
  </div>
  <div class="hero-right-nd" style="flex:0 0 60%;position:relative;overflow:hidden;">
    <img src="${imgAt(0)}" alt="${productName}" style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;"/>
  </div>
</section>

<!-- VALUES -->
<div class="values-nd" style="background:${C.accentLight};padding:28px 64px;display:flex;align-items:center;justify-content:center;">
  ${['Handcrafted','Sustainable','Timeless','Minimal'].map(v => `
  <div class="val-item-nd" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 32px;border-right:1px solid ${C.border};">
    <div style="width:24px;height:1px;background:${C.accentWarm};"></div>
    <span style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.text};">${v}</span>
  </div>`).join('')}
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 32px;">
    <div style="width:24px;height:1px;background:${C.accentWarm};"></div>
    <span style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.text};">Natural</span>
  </div>
</div>

<!-- PRODUIT -->
<section style="background:${C.bg};">
  <div class="product-grid-nd" style="display:grid;grid-template-columns:1fr 1fr;gap:80px;max-width:1280px;margin:0 auto;padding:96px 64px;align-items:start;">
    <div>
      <div style="overflow:hidden;aspect-ratio:4/5;margin-bottom:12px;">
        <img id="main-img-nd" src="${imgAt(0)}" alt="${productName}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${thumbsHTML}</div>
    </div>
    <div>
      <p style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:500;letter-spacing:.12em;color:${C.muted};text-transform:uppercase;margin-bottom:12px;">Ref. 00${Math.floor(Math.random() * 99) + 1}</p>
      <h2 style="font-family:'Fraunces',serif;font-size:36px;font-weight:400;line-height:1.15;color:${C.text};margin-bottom:14px;">${productName}</h2>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
        <div>${starsNd(4)}</div>
        <span style="font-family:'Manrope',sans-serif;font-size:12px;color:${C.muted};">4.0 · 847 reviews</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
        ${price    ? `<span style="font-family:'Fraunces',serif;font-size:28px;font-weight:400;color:${C.text};">${price}€</span>` : ''}
        ${origPrice? `<span style="font-family:'Manrope',sans-serif;font-size:16px;color:${C.muted};text-decoration:line-through;">${origPrice}€</span>` : ''}
        ${savePct > 0 ? `<span style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.accentWarm};background:${C.accentLight};padding:3px 10px;">−${savePct}%</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:20px;">${materialsHTML}</div>
      <p style="font-family:'Manrope',sans-serif;font-size:14px;color:${C.muted};line-height:1.8;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid ${C.border};">${subtitle}</p>
      ${urgency ? `<p style="font-family:'Manrope',sans-serif;font-size:12px;font-weight:600;color:${C.accentWarm};letter-spacing:.08em;text-transform:uppercase;margin-bottom:20px;">${urgency}</p>` : ''}
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:${C.accent};color:#fff;font-family:'Manrope',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:16px 32px;margin-bottom:10px;transition:opacity .2s;" onmouseover="this.style.opacity='.82'" onmouseout="this.style.opacity='1'">${ctaText}</a>
      <a href="javascript:void(0)" onclick="event.preventDefault()" style="display:block;text-align:center;background:transparent;color:${C.text};font-family:'Manrope',sans-serif;font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;padding:14px 32px;border:1px solid ${C.border};margin-bottom:24px;transition:border-color .2s,color .2s;" onmouseover="this.style.borderColor='${C.accent}';this.style.color='${C.accent}'" onmouseout="this.style.borderColor='${C.border}';this.style.color='${C.text}'">Save for later</a>
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:6px;color:${C.muted};"><span style="color:${C.accentWarm};">${ico.truck(14)}</span><span style="font-family:'Manrope',sans-serif;font-size:11px;">Livraison offerte</span></div>
        <div style="display:flex;align-items:center;gap:6px;color:${C.muted};"><span style="color:${C.accentWarm};">${ico.return(14)}</span><span style="font-family:'Manrope',sans-serif;font-size:11px;">Retour 30 jours</span></div>
        <div style="display:flex;align-items:center;gap:6px;color:${C.muted};"><span style="color:${C.accentWarm};">${ico.shield(14)}</span><span style="font-family:'Manrope',sans-serif;font-size:11px;">Paiement sécurisé</span></div>
      </div>
    </div>
  </div>
</section>

<!-- CRAFTS -->
<section class="section-pad-nd" style="background:${C.bgAlt};padding:96px 64px;">
  <h2 style="font-family:'Fraunces',serif;font-size:40px;font-weight:400;color:${C.text};margin-bottom:64px;text-align:center;">Crafted with Intention</h2>
  <div style="max-width:1100px;margin:0 auto;">${craftsHTML}</div>
</section>

<!-- COLLECTION -->
<section class="section-pad-nd" style="padding:96px 64px;background:${C.bg};">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;max-width:1280px;margin-left:auto;margin-right:auto;">
    <h2 style="font-family:'Fraunces',serif;font-size:36px;font-weight:400;color:${C.text};">Complete the Look</h2>
    <a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Manrope',sans-serif;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:${C.muted};border-bottom:1px solid ${C.border};padding-bottom:2px;" onmouseover="this.style.color='${C.text}'" onmouseout="this.style.color='${C.muted}'">View all</a>
  </div>
  <div class="col-grid-nd" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1280px;margin:0 auto;">${collectionHTML}</div>
</section>

<!-- QUOTE -->
<section class="section-pad-nd" style="background:${C.bgAlt};padding:100px 64px;text-align:center;">
  <blockquote style="font-family:'Fraunces',serif;font-size:32px;font-weight:300;font-style:italic;line-height:1.5;color:${C.text};max-width:760px;margin:0 auto 36px;">
    Good design is about making things that last, not things that trend.
  </blockquote>
  <div style="width:40px;height:1px;background:${C.accentWarm};margin:0 auto;"></div>
</section>

<!-- REVIEWS -->
<section class="section-pad-nd" style="padding:96px 64px;background:${C.bg};">
  <div style="text-align:center;margin-bottom:52px;">
    <h2 style="font-family:'Fraunces',serif;font-size:40px;font-weight:400;color:${C.text};margin-bottom:10px;">What Our Customers Say</h2>
    <p style="font-family:'Manrope',sans-serif;font-size:14px;color:${C.muted};">4.8 out of 5 · 847 reviews</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:2px;margin-top:8px;">${starsNd(5)}</div>
  </div>
  <div class="rev-grid-nd" style="display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1100px;margin:0 auto;">${reviewsHTML}</div>
</section>

<!-- FAQ -->
<section class="section-pad-nd" style="padding:96px 64px;background:${C.bgAlt};">
  <div style="max-width:680px;margin:0 auto;">
    <h2 style="font-family:'Fraunces',serif;font-size:40px;font-weight:400;color:${C.text};margin-bottom:48px;text-align:center;">Questions fréquentes</h2>
    ${faqHTML}
  </div>
</section>

<!-- NEWSLETTER -->
<section class="section-pad-nd" style="background:${C.accent};padding:80px 64px;text-align:center;">
  <h2 style="font-family:'Fraunces',serif;font-size:34px;font-weight:400;color:#fff;margin-bottom:12px;">Stay in the Loop</h2>
  <p style="font-family:'Manrope',sans-serif;font-size:14px;color:rgba(255,255,255,.6);margin-bottom:32px;">Nouvelles collections, histoires d'artisans, parutions éditoriales.</p>
  <form style="display:flex;max-width:460px;margin:0 auto;" onsubmit="event.preventDefault()">
    <input type="email" placeholder="votre@email.com" style="flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);border-right:none;color:#fff;font-family:'Manrope',sans-serif;font-size:13px;padding:14px 20px;outline:none;" autocomplete="email"/>
    <button type="submit" style="background:${C.sand};color:${C.text};font-family:'Manrope',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:14px 22px;border:1px solid ${C.sand};cursor:pointer;white-space:nowrap;transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Subscribe</button>
  </form>
</section>

<!-- FOOTER -->
<footer style="background:${C.bg};border-top:1px solid ${C.sand};padding:64px 64px 40px;">
  <div class="footer-nd" style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;padding-bottom:48px;border-bottom:1px solid ${C.border};margin-bottom:28px;">
    <div>
      <p style="font-family:'Fraunces',serif;font-size:20px;font-weight:400;letter-spacing:.3em;text-transform:uppercase;color:${C.text};margin-bottom:12px;">NORDIC</p>
      <p style="font-family:'Manrope',sans-serif;font-size:13px;color:${C.muted};line-height:1.7;max-width:220px;">Objects designed for quiet living. Made to last, made with intention.</p>
    </div>
    ${[['Collection',['Objects','Living','Papeterie','New arrivals']],['Informations',['À propos','Livraison','Retours','FAQ']],['Contact',['Instagram','Pinterest','Newsletter','hello@nordic.studio']]].map(([title, links]) => `
    <div>
      <p style="font-family:'Manrope',sans-serif;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${C.text};margin-bottom:16px;">${title}</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${(links as string[]).map(l => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Manrope',sans-serif;font-size:13px;color:${C.muted};transition:color .2s;" onmouseover="this.style.color='${C.text}'" onmouseout="this.style.color='${C.muted}'">${l}</a>`).join('')}
      </div>
    </div>`).join('')}
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
    <p style="font-family:'Manrope',sans-serif;font-size:11px;color:${C.muted};">© ${new Date().getFullYear()} Nordic Studio. All rights reserved.</p>
    <div style="display:flex;gap:20px;">
      ${['Privacy','Terms'].map(l => `<a href="javascript:void(0)" onclick="event.preventDefault()" style="font-family:'Manrope',sans-serif;font-size:11px;color:${C.muted};transition:color .2s;" onmouseover="this.style.color='${C.text}'" onmouseout="this.style.color='${C.muted}'">${l}</a>`).join('')}
    </div>
  </div>
</footer>

</body>
</html>`
}
