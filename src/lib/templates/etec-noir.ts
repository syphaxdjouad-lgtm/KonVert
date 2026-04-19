import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecNoir(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid rgba(0,255,135,0.12);overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq2-${i}');var a=document.getElementById('arr2-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(0deg)':'rotate(45deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:#fff;">${f.question}</span>
        <span id="arr2-${i}" style="font-size:20px;color:#00FF87;transition:transform .3s;flex-shrink:0;margin-left:16px;font-weight:300;">+</span>
      </button>
      <div id="faq2-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'Space Grotesk',sans-serif;font-size:14px;color:#999;line-height:1.7;padding-bottom:18px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const tabContents = [
    { id: 'tab2-garantie', label: 'Garantie', content: `<p style="font-size:14px;color:#999;line-height:1.7;margin:0;">Satisfait ou remboursé pendant 30 jours. Garantie constructeur 12 mois couvrant tous les défauts de fabrication. Support technique prioritaire inclus.</p>` },
    { id: 'tab2-livraison', label: 'Livraison', content: `<p style="font-size:14px;color:#999;line-height:1.7;margin:0;">Expédition sous 24h. Livraison express disponible. Emballage sécurisé anti-choc. Suivi en temps réel. Livraison internationale disponible.</p>` },
    { id: 'tab2-support', label: 'Support', content: `<p style="font-size:14px;color:#999;line-height:1.7;margin:0;">Support 7j/7 via chat et email. Temps de réponse garanti sous 1h. Hotline dédiée pour les membres premium. Discord communautaire actif.</p>` },
  ]

  const specRows = [
    ['Matériau', benefits[0] || data.product_name],
    ['Performance', benefits[1] || 'Grade professionnel'],
    ['Compatibilité', benefits[2] || 'Universel'],
    ['Finition', benefits[3] || 'Premium'],
    ['Garantie', '12 mois constructeur'],
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Space Grotesk',sans-serif;background:#0A0A0A;color:#fff;}
.noir-cta-main{background:#00FF87;color:#0A0A0A;border:none;border-radius:4px;padding:16px 36px;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:0.03em;transition:all .2s;box-shadow:0 0 24px rgba(0,255,135,0.35);}
.noir-cta-main:hover{box-shadow:0 0 40px rgba(0,255,135,0.55);transform:translateY(-2px);}
.noir-cta-ghost{background:transparent;color:#00FF87;border:1.5px solid #00FF87;border-radius:4px;padding:14px 36px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;}
.noir-cta-ghost:hover{background:rgba(0,255,135,0.08);}
@media(max-width:768px){
  .noir-hero-info{flex-direction:column!important;}
  .noir-thumbs{flex-direction:row!important;position:static!important;width:100%!important;}
  .noir-reviews-grid{grid-template-columns:1fr!important;}
  .noir-trust-grid{grid-template-columns:1fr!important;gap:0!important;}
  .noir-ba-grid{flex-direction:column!important;}
}
</style>
</head>
<body>

<!-- URGENCY BANNER -->
<div style="background:#00FF87;color:#0A0A0A;text-align:center;padding:10px 20px;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">
  <span style="display:inline-flex;align-items:center;gap:8px;">${ico.flash(16)} ${data.urgency || 'Stock limité — Commandez avant rupture'}</span>
</div>

<!-- BREADCRUMB -->
<nav style="background:#111;border-bottom:1px solid rgba(255,255,255,0.06);padding:12px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#666;cursor:pointer;">Accueil</span>
    <span style="font-size:12px;color:#333;">›</span>
    <span style="font-size:12px;color:#666;cursor:pointer;">Catalogue</span>
    <span style="font-size:12px;color:#333;">›</span>
    <span style="font-size:12px;color:#00FF87;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — FULL WIDTH IMAGE + INFO DESSOUS -->
<section style="position:relative;overflow:hidden;background:#0A0A0A;">
  <!-- Image grande largeur -->
  <div style="position:relative;width:100%;height:520px;overflow:hidden;">
    <img id="mi2" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.55);" alt="${data.product_name}">
    <!-- Overlay gradient -->
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom, transparent 30%, #0A0A0A 100%);pointer-events:none;"></div>
    <!-- Titre centré sur l'image -->
    <div style="position:absolute;bottom:40px;left:0;right:0;text-align:center;padding:0 24px;">
      ${savePct > 0 ? `<span style="display:inline-block;background:#00FF87;color:#0A0A0A;font-size:11px;font-weight:700;padding:4px 12px;border-radius:2px;letter-spacing:0.08em;margin-bottom:16px;">-${savePct}% · OFFRE LIMITÉE</span>` : ''}
      <h1 style="font-size:52px;font-weight:700;color:#fff;line-height:1.1;letter-spacing:-0.02em;text-shadow:0 2px 20px rgba(0,0,0,0.5);">${data.headline}</h1>
    </div>
    <!-- Thumbnails coins bas droite -->
    <div style="position:absolute;bottom:20px;right:20px;display:flex;gap:8px;">
      ${imgs.slice(0,4).map((img, i) => `
      <div onclick="document.getElementById('mi2').src='${img}';document.querySelectorAll('.th2').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #00FF87':'2px solid rgba(255,255,255,0.2)';t.style.opacity=j===${i}?'1':'.5';});" class="th2" style="width:48px;height:48px;border-radius:4px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#00FF87':'rgba(255,255,255,0.2)'};opacity:${i===0?1:.5};transition:all .2s;">
        <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>`).join('')}
    </div>
  </div>

  <!-- INFO SECTION SOUS L'IMAGE -->
  <div style="max-width:1000px;margin:0 auto;padding:40px 24px;display:flex;gap:48px;align-items:flex-start;" class="noir-hero-info">
    <!-- Gauche : description + benefits -->
    <div style="flex:1;">
      <p style="font-size:15px;color:#999;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:#00FF87;font-size:16px;flex-shrink:0;margin-top:1px;">▸</span>
          <span style="font-size:14px;color:#ccc;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>
    </div>
    <!-- Droite : prix + CTAs -->
    <div style="width:320px;flex-shrink:0;background:#111;border:1px solid rgba(0,255,135,0.15);border-radius:8px;padding:28px;">
      <div style="margin-bottom:20px;">
        ${data.price ? `<span style="font-size:42px;font-weight:700;color:#00FF87;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:#555;text-decoration:line-through;margin-left:10px;">${data.original_price}€</span>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button class="noir-cta-main" style="width:100%;">${data.cta || 'Ajouter au panier'}</button>
        <button class="noir-cta-ghost" style="width:100%;">Acheter maintenant</button>
      </div>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;" class="noir-trust-grid">
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="color:#00FF87;">${ico.truck(16)}</span>
          <span style="font-size:12px;color:#666;">Livraison express disponible</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="color:#00FF87;">${ico.lock(16)}</span>
          <span style="font-size:12px;color:#666;">Paiement 100% sécurisé</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
          <span style="color:#00FF87;">${ico.return(16)}</span>
          <span style="font-size:12px;color:#666;">Retour gratuit 30 jours</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SPECS TABLE — GAMING STYLE -->
<section style="padding:72px 24px;background:#0D0D0D;">
  <div style="max-width:900px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#00FF87;text-transform:uppercase;margin-bottom:8px;">Spécifications</p>
    <h2 style="font-size:34px;font-weight:700;color:#fff;margin-bottom:40px;letter-spacing:-0.02em;">Specs Techniques</h2>
    <div style="border:1px solid rgba(0,255,135,0.12);border-radius:8px;overflow:hidden;">
      ${specRows.map((row, i) => `
      <div style="display:flex;background:${i%2===0?'#111':'#0F0F0F'};border-bottom:1px solid rgba(0,255,135,0.06);">
        <div style="width:40%;padding:16px 24px;border-right:1px solid rgba(0,255,135,0.08);">
          <span style="font-size:13px;font-weight:600;color:#00FF87;letter-spacing:0.05em;text-transform:uppercase;">${row[0]}</span>
        </div>
        <div style="flex:1;padding:16px 24px;">
          <span style="font-size:14px;color:#ccc;">${row[1]}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#0A0A0A;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:1px solid rgba(0,255,135,0.15);margin-bottom:32px;gap:0;">
      ${tabContents.map((t, i) => `
      <button id="tbtn2-${i}" onclick="(function(){document.querySelectorAll('.tp2').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn2').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #00FF87':'2px solid transparent';b.style.color=j===${i}?'#00FF87':'#555';b.style.marginBottom='-1px';});})()" class="tbtn2" style="padding:12px 24px;background:none;border:none;border-bottom:${i===0?'2px solid #00FF87':'2px solid transparent'};color:${i===0?'#00FF87':'#555'};font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:-1px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${tabContents.map((t, i) => `
    <div id="${t.id}" class="tp2" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:72px 24px;background:#111;">
  <div style="max-width:960px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#00FF87;text-transform:uppercase;margin-bottom:8px;">Transformation</p>
    <h2 style="font-size:34px;font-weight:700;color:#fff;margin-bottom:40px;">Avant / Après</h2>
    <div style="display:flex;gap:16px;" class="noir-ba-grid">
      <div style="flex:1;position:relative;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:300px;object-fit:cover;display:block;filter:grayscale(80%) brightness(0.7);" alt="Avant">
        <div style="position:absolute;top:12px;left:12px;background:#1A1A1A;border:1px solid rgba(255,255,255,0.15);color:#999;font-size:11px;font-weight:700;padding:5px 12px;border-radius:3px;letter-spacing:0.1em;text-transform:uppercase;">Avant</div>
      </div>
      <div style="flex:1;position:relative;border-radius:8px;overflow:hidden;border:1px solid rgba(0,255,135,0.2);">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:300px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:12px;left:12px;background:#00FF87;color:#0A0A0A;font-size:11px;font-weight:700;padding:5px 12px;border-radius:3px;letter-spacing:0.1em;text-transform:uppercase;">Après</div>
      </div>
    </div>
  </div>
</section>

<!-- AVIS -->
<section style="padding:72px 24px;background:#0A0A0A;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#00FF87;text-transform:uppercase;margin-bottom:8px;">Retours clients</p>
    <h2 style="font-size:34px;font-weight:700;color:#fff;margin-bottom:40px;">Avis vérifiés</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="noir-reviews-grid">
      ${[
        { name: 'Alex R.', text: `Le ${data.product_name} est une bête. Qualité de build incroyable, les finitions sont au top. Aucun regret.`, stars: 5 },
        { name: 'Mathieu P.', text: `J'ai comparé avec d'autres produits. Celui-ci les surpasse largement. Parfait pour un usage intensif.`, stars: 5 },
        { name: 'Kevin D.', text: `Livraison ultra rapide, emballage soigné. Le produit est exactement comme décrit. Je recommande.`, stars: 5 },
      ].map(r => `
      <div style="background:#111;border:1px solid rgba(0,255,135,0.1);border-radius:8px;padding:24px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-1px;left:0;right:0;height:2px;background:linear-gradient(to right,#00FF87,transparent);"></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <div style="width:36px;height:36px;border-radius:4px;background:#00FF87;color:#0A0A0A;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:14px;font-weight:600;color:#fff;">${r.name}</p>
            <div style="color:#00FF87;font-size:11px;letter-spacing:2px;">${'★'.repeat(r.stars)}</div>
          </div>
        </div>
        <p style="font-size:13px;color:#888;line-height:1.7;">"${r.text}"</p>
        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(0,255,135,0.2);padding:3px 8px;border-radius:3px;">
          <span style="font-size:10px;color:#00FF87;font-weight:600;letter-spacing:0.05em;">✓ ACHAT VÉRIFIÉ</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:72px 24px;background:#0D0D0D;">
  <div style="max-width:700px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#00FF87;text-transform:uppercase;margin-bottom:8px;">FAQ</p>
    <h2 style="font-size:34px;font-weight:700;color:#fff;margin-bottom:40px;">Questions fréquentes</h2>
    <div>${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:72px 24px;background:#00FF87;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <h2 style="font-size:40px;font-weight:700;color:#0A0A0A;letter-spacing:-0.02em;margin-bottom:12px;">${data.headline}</h2>
    <p style="font-size:16px;color:rgba(0,0,0,0.6);margin-bottom:28px;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:52px;font-weight:700;color:#0A0A0A;margin-bottom:28px;">${data.price}€</p>` : ''}
    <button style="background:#0A0A0A;color:#00FF87;border:none;border-radius:4px;padding:18px 48px;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:0.03em;">${data.cta || 'Commander maintenant'}</button>
    <p style="font-size:12px;color:rgba(0,0,0,0.5);margin-top:14px;">Livraison express · Paiement sécurisé · 30j satisfait ou remboursé</p>
  </div>
</section>

</body>
</html>`
}
