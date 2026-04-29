import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecBlue(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E8E8ED;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq1-${i}');var a=document.getElementById('arr1-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(0deg)':'rotate(180deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:#1D1D1F;">${f.question}</span>
        <span id="arr1-${i}" style="font-size:18px;color:#6E6E73;transition:transform .3s;flex-shrink:0;margin-left:16px;">›</span>
      </button>
      <div id="faq1-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Inter',sans-serif;font-size:14px;color:#6E6E73;line-height:1.7;padding-bottom:18px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const tabContents = [
    { id: 'tab1-garantie', label: 'Garantie', content: `<p style="font-size:14px;color:#6E6E73;line-height:1.7;margin:0;">Satisfait ou remboursé pendant 30 jours. Si vous n'êtes pas entièrement satisfait de votre achat, retournez-le dans son emballage d'origine pour un remboursement complet. Garantie fabricant 12 mois incluse.</p>` },
    { id: 'tab1-livraison', label: 'Livraison', content: `<p style="font-size:14px;color:#6E6E73;line-height:1.7;margin:0;">Livraison gratuite dès 50€. Expédition sous 24–48h ouvrées. Livraison standard 3–5 jours, express 24h disponible. Suivi en temps réel par SMS et email. Livraison dans toute l'Europe.</p>` },
    { id: 'tab1-support', label: 'Support', content: `<p style="font-size:14px;color:#6E6E73;line-height:1.7;margin:0;">Notre équipe support est disponible du lundi au samedi, 9h–19h. Chat en ligne, email sous 2h, téléphone disponible. Nous parlons français, anglais et espagnol.</p>` },
  ]

  const specItems = [
    { num: benefits[0] ? '01' : '—', title: benefits[0] || 'Performance', desc: data.subtitle || 'Conçu pour dépasser vos attentes' },
    { num: benefits[1] ? '02' : '—', title: benefits[1] || 'Qualité', desc: 'Matériaux premium sélectionnés avec soin' },
    { num: benefits[2] ? '03' : '—', title: benefits[2] || 'Design', desc: 'Esthétique épurée, finitions premium' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#FAFAFA;color:#1D1D1F;}
.blue-btn-primary{background:#0055D4;color:#fff;border:none;border-radius:12px;padding:16px 32px;font-family:'Inter',sans-serif;font-size:16px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .2s,transform .15s;}
.blue-btn-primary:hover{background:#0040A8;transform:translateY(-1px);}
.blue-btn-secondary{background:transparent;color:#0055D4;border:2px solid #0055D4;border-radius:12px;padding:14px 32px;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;}
.blue-btn-secondary:hover{background:#EEF3FF;}
@media(max-width:768px){
  .blue-hero-grid{flex-direction:column!important;}
  .blue-hero-img-col{width:100%!important;}
  .blue-hero-info-col{width:100%!important;padding:24px 20px!important;}
  .blue-specs-grid{grid-template-columns:1fr!important;}
  .blue-before-after{flex-direction:column!important;}
  .blue-reviews-grid{grid-template-columns:1fr!important;}
  .blue-trust-grid{grid-template-columns:1fr 1fr!important;gap:12px!important;}
  .blue-hero-img-col img{border-radius:0!important;}
  .blue-tabs{flex-wrap:wrap!important;}
}
</style>
</head>
<body>

<!-- BREADCRUMB -->
<nav style="background:#fff;border-bottom:1px solid #E8E8ED;padding:12px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#6E6E73;cursor:pointer;">Accueil</span>
    <span style="font-size:12px;color:#C7C7CC;">›</span>
    <span style="font-size:12px;color:#6E6E73;cursor:pointer;">Catalogue</span>
    <span style="font-size:12px;color:#C7C7CC;">›</span>
    <span style="font-size:12px;color:#1D1D1F;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- URGENCY BANNER -->
<div style="background:#0055D4;color:#fff;text-align:center;padding:10px 20px;font-size:13px;font-weight:600;letter-spacing:0.02em;">
  ${data.urgency || 'Offre limitée — Stock en cours d\'épuisement'}
</div>

<!-- HERO — 60/40 SPLIT -->
<section style="background:#fff;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:580px;" class="blue-hero-grid">

    <!-- IMAGE COLUMN -->
    <div style="width:60%;position:relative;background:#F5F5F7;" class="blue-hero-img-col">
      <img id="mi1" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:0 24px 24px 0;min-height:480px;" alt="${data.product_name}">
      <!-- Thumbnails overlay -->
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi1').src='${img}';document.querySelectorAll('.th1').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #0055D4':'2px solid transparent';t.style.opacity=j===${i}?'1':'.6';});" class="th1" style="width:52px;height:52px;border-radius:8px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#0055D4':'transparent'};opacity:${i===0?1:.6};transition:all .2s;background:#fff;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <!-- INFO COLUMN -->
    <div style="width:40%;padding:48px 40px;display:flex;flex-direction:column;justify-content:center;" class="blue-hero-info-col">
      ${savePct > 0 ? `<div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:16px;"><span style="background:#EEF3FF;color:#0055D4;font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;letter-spacing:0.05em;">ÉCONOMISEZ ${savePct}%</span></div>` : ''}
      <h1 style="font-size:38px;font-weight:900;color:#1D1D1F;line-height:1.1;letter-spacing:-0.04em;margin-bottom:12px;">${data.headline}</h1>
      <p style="font-size:15px;color:#6E6E73;line-height:1.6;margin-bottom:24px;">${data.subtitle}</p>

      <!-- PRICE BLOCK -->
      <div style="background:#F5F5F7;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:inline-block;">
        <div style="display:flex;align-items:baseline;gap:12px;">
          ${data.price ? `<span style="font-size:32px;font-weight:800;color:#1D1D1F;">${data.price}€</span>` : ''}
          ${data.original_price ? `<span style="font-size:18px;color:#8E8E93;text-decoration:line-through;">${data.original_price}€</span>` : ''}
        </div>
        ${savePct > 0 ? `<p style="font-size:12px;color:#0055D4;font-weight:600;margin-top:4px;">Vous économisez ${+data.original_price! - +data.price!}€</p>` : ''}
      </div>

      <!-- BENEFITS -->
      <ul style="list-style:none;margin-bottom:28px;display:flex;flex-direction:column;gap:8px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:flex-start;gap:10px;">
          <span style="width:20px;height:20px;border-radius:50%;background:#0055D4;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">✓</span>
          <span style="font-size:14px;color:#444;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <!-- CTAs -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button class="blue-btn-primary" style="width:100%;justify-content:center;font-size:16px;padding:18px 32px;">
          ${data.cta || 'Ajouter au panier'} →
        </button>
        <button class="blue-btn-secondary" style="width:100%;justify-content:center;">
          Acheter maintenant
        </button>
      </div>

      <!-- TRUST MINI -->
      <div style="display:flex;gap:20px;margin-top:20px;padding-top:16px;border-top:1px solid #E8E8ED;" class="blue-trust-grid">
        <span style="font-size:12px;color:#6E6E73;display:flex;align-items:center;gap:6px;">${ico.truck(16)} Livraison offerte</span>
        <span style="font-size:12px;color:#6E6E73;display:flex;align-items:center;gap:6px;">${ico.lock(16)} Paiement sécurisé</span>
        <span style="font-size:12px;color:#6E6E73;display:flex;align-items:center;gap:6px;">${ico.return(16)} Retour 30j</span>
      </div>
    </div>
  </div>
</section>

<!-- SPECS SECTION — APPLE STYLE 3 COLONNES -->
<section style="padding:80px 24px;background:#F5F5F7;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#6E6E73;text-align:center;text-transform:uppercase;margin-bottom:8px;">Caractéristiques</p>
    <h2 style="font-size:32px;font-weight:800;color:#1D1D1F;text-align:center;letter-spacing:-0.03em;margin-bottom:56px;">${data.product_name} en chiffres</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:#E8E8ED;border-radius:20px;overflow:hidden;" class="blue-specs-grid">
      ${specItems.map(s => `
      <div style="background:#fff;padding:40px 32px;display:flex;flex-direction:column;gap:12px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:#0055D4;text-transform:uppercase;">${s.num}</span>
        <h3 style="font-size:20px;font-weight:700;color:#1D1D1F;line-height:1.3;">${s.title}</h3>
        <p style="font-size:14px;color:#6E6E73;line-height:1.6;">${s.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS — GARANTIE / LIVRAISON / SUPPORT -->
<section style="padding:60px 24px;background:#fff;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:2px solid #E8E8ED;margin-bottom:32px;gap:0;" class="blue-tabs">
      ${tabContents.map((t, i) => `
      <button id="tbtn1-${i}" onclick="(function(){document.querySelectorAll('.tp1').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn1').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #0055D4':'2px solid transparent';b.style.color=j===${i}?'#0055D4':'#6E6E73';b.style.marginBottom='-2px';});})()" class="tbtn1" style="padding:14px 24px;background:none;border:none;border-bottom:${i===0?'2px solid #0055D4':'2px solid transparent'};color:${i===0?'#0055D4':'#6E6E73'};font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:-2px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${tabContents.map((t, i) => `
    <div id="${t.id}" class="tp1" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#FAFAFA;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#6E6E73;text-align:center;text-transform:uppercase;margin-bottom:8px;">La différence</p>
    <h2 style="font-size:32px;font-weight:800;color:#1D1D1F;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Avant / Après</h2>
    <div style="display:flex;gap:24px;" class="blue-before-after">
      <div style="flex:1;position:relative;border-radius:20px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:320px;object-fit:cover;display:block;filter:saturate(0.6);" alt="Avant">
        <div style="position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.6);color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:100px;letter-spacing:0.05em;">AVANT</div>
      </div>
      <div style="flex:1;position:relative;border-radius:20px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:320px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:16px;left:16px;background:#0055D4;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:100px;letter-spacing:0.05em;">APRÈS</div>
      </div>
    </div>
  </div>
</section>

<!-- AVIS CLIENTS -->
<section style="padding:80px 24px;background:#fff;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#6E6E73;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-size:32px;font-weight:800;color:#1D1D1F;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Ce qu'ils en pensent</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="blue-reviews-grid">
      ${[
        { name: 'Marie T.', text: `Exactement ce que je cherchais. Qualité irréprochable, livraison rapide. Je recommande les yeux fermés !`, date: 'Il y a 3 jours' },
        { name: 'Lucas B.', text: `Franchement impressionné. Le ${data.product_name} dépasse mes attentes. La qualité est là, le design aussi.`, date: 'Il y a 1 semaine' },
        { name: 'Sophie M.', text: `Acheté pour offrir. La personne l'adore ! Emballage soigné, produit impeccable. Parfait.`, date: 'Il y a 2 semaines' },
      ].map(r => `
      <div style="background:#FAFAFA;border-radius:16px;padding:28px 24px;border:1px solid #F0F0F5;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#0055D4;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;">${r.name[0]}</div>
          <div>
            <p style="font-size:14px;font-weight:700;color:#1D1D1F;">${r.name}</p>
            <p style="font-size:11px;color:#6E6E73;">${r.date}</p>
          </div>
        </div>
        <div style="color:#0055D4;font-size:14px;letter-spacing:2px;margin-bottom:12px;">★★★★★</div>
        <p style="font-size:14px;color:#444;line-height:1.7;">"${r.text}"</p>
        <div style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;background:#EEF3FF;padding:4px 10px;border-radius:100px;">
          <span style="font-size:11px;color:#0055D4;font-weight:600;">✓ Achat vérifié</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F5F5F7;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#6E6E73;text-align:center;text-transform:uppercase;margin-bottom:8px;">FAQ</p>
    <h2 style="font-size:32px;font-weight:800;color:#1D1D1F;text-align:center;letter-spacing:-0.03em;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="background:#fff;border-radius:20px;padding:8px 28px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:80px 24px;background:#0055D4;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <h2 style="font-size:36px;font-weight:900;color:#fff;letter-spacing:-0.03em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:32px;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:48px;font-weight:900;color:#fff;margin-bottom:32px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:#0055D4;border:none;border-radius:12px;padding:18px 48px;font-family:'Inter',sans-serif;font-size:17px;font-weight:800;cursor:pointer;">${data.cta || 'Commander maintenant'} →</button>
    <p style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:16px;">Livraison gratuite · Paiement sécurisé · Retour 30 jours</p>
  </div>
</section>

</body>
</html>`
}
