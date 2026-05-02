import type { LandingPageData } from '@/types'
import { ico } from './icons'
import {
  renderStorySection,
  renderSocialProofBar,
  renderTestimonialsSection,
  renderComparisonSection,
  renderBonusesSection,
  renderGuaranteeSection,
  type SectionTheme,
} from './sections'

const NOIR_THEME: SectionTheme = {
  primary:    '#C8FF00',
  accent:     'rgba(200,255,0,0.10)',
  text:       '#ffffff',
  textMuted:  '#8A8A8A',
  bg:         '#000000',
  bgAlt:      '#0a0a0a',
  border:     'rgba(255,255,255,0.06)',
  fontFamily: "'Space Grotesk',sans-serif",
  radius:     '8px',
}

// Casque audio premium — direction Apple Store / Bose / Sony
// Palette : #000 fond unique, #FFFFFF accent principal, #C8FF00 accent secondaire sobre
const IMGS = [
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3587477/pexels-photo-3587477.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecNoir(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid rgba(255,255,255,0.06);overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq2-${i}');var a=document.getElementById('arr2-${i}');var open=c.style.maxHeight!==''&&c.style.maxHeight!=='0px';c.style.maxHeight=open?'0px':'500px';c.style.paddingBottom=open?'0':'20px';a.style.transform=open?'rotate(0deg)':'rotate(45deg)';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:22px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;">
        <span style="font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:#ffffff;line-height:1.4;">${f.question}</span>
        <span id="arr2-${i}" style="font-size:20px;color:#8A8A8A;transition:transform .3s cubic-bezier(0.4,0,0.2,1);flex-shrink:0;font-weight:300;line-height:1;">+</span>
      </button>
      <div id="faq2-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-bottom .35s ease;padding-bottom:0;">
        <p style="font-family:'Space Grotesk',sans-serif;font-size:14px;color:#8A8A8A;line-height:1.8;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const tabContents = [
    { id: 'tab2-garantie', label: 'Garantie', content: `<p style="font-size:15px;color:#8A8A8A;line-height:1.8;margin:0;">Satisfait ou remboursé pendant 30 jours. Garantie constructeur 12 mois couvrant tous les défauts de fabrication. Support technique prioritaire inclus.</p>` },
    { id: 'tab2-livraison', label: 'Livraison', content: `<p style="font-size:15px;color:#8A8A8A;line-height:1.8;margin:0;">Expédition sous 24h. Livraison express disponible. Emballage sécurisé anti-choc. Suivi en temps réel. Livraison internationale disponible.</p>` },
    { id: 'tab2-support', label: 'Support', content: `<p style="font-size:15px;color:#8A8A8A;line-height:1.8;margin:0;">Support 7j/7 via chat et email. Temps de réponse garanti sous 1h. Hotline dédiée pour les membres premium. Discord communautaire actif.</p>` },
  ]

  const specRows = [
    ['Matériau', benefits[0] || data.product_name],
    ['Performance', benefits[1] || 'Grade professionnel'],
    ['Compatibilité', benefits[2] || 'Universel'],
    ['Finition', benefits[3] || 'Premium'],
    ['Garantie', '12 mois constructeur'],
  ]

  const stats = [
    { value: '4.9/5', label: 'Note moyenne' },
    { value: '2 847', label: 'Clients satisfaits' },
    { value: '30j', label: 'Garantie retour' },
    { value: '24h', label: 'Livraison express' },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Space Grotesk',sans-serif;background:#000000;color:#ffffff;}

/* CTA principal — blanc sur noir, net, fort */
.noir-cta-main{
  background:#ffffff;color:#000000;border:none;border-radius:3px;
  padding:16px 36px;font-family:'Space Grotesk',sans-serif;font-size:15px;
  font-weight:700;cursor:pointer;letter-spacing:0.02em;
  transition:opacity .2s ease, transform .2s ease;
}
.noir-cta-main:hover{opacity:0.88;transform:translateY(-1px);}
.noir-cta-main:active{transform:translateY(0);opacity:1;}

/* CTA ghost — border subtil, texte blanc */
.noir-cta-ghost{
  background:transparent;color:#ffffff;
  border:1px solid rgba(255,255,255,0.2);border-radius:3px;
  padding:15px 36px;font-family:'Space Grotesk',sans-serif;
  font-size:15px;font-weight:600;cursor:pointer;
  transition:border-color .2s ease, background .2s ease;
}
.noir-cta-ghost:hover{border-color:rgba(255,255,255,0.45);background:rgba(255,255,255,0.04);}

/* Thumbnails */
.th2{transition:outline .15s ease, opacity .15s ease;}
.th2:hover{opacity:1 !important;}

/* Avis cards — glassmorphism très léger, zéro border solide */
.noir-review-card{
  background:rgba(255,255,255,0.04);border-radius:6px;
  padding:28px;position:relative;overflow:hidden;
  transition:background .25s ease, transform .25s ease;
}
.noir-review-card:hover{background:rgba(255,255,255,0.07);transform:translateY(-2px);}

/* Spec rows */
.noir-spec-row{transition:background .2s ease;}
.noir-spec-row:hover{background:rgba(255,255,255,0.04) !important;}

/* Tabs buttons */
.tbtn2{
  padding:14px 28px;background:none;border:none;
  border-bottom:1px solid transparent;
  font-family:'Space Grotesk',sans-serif;font-size:14px;
  font-weight:600;cursor:pointer;margin-bottom:-1px;
  transition:color .2s ease, border-color .2s ease;
  letter-spacing:0.01em;
}

/* Responsive */
@media(max-width:768px){
  .noir-hero-info{flex-direction:column !important;}
  .noir-thumbs{flex-direction:row !important;position:static !important;width:100% !important;}
  .noir-reviews-grid{grid-template-columns:1fr !important;}
  .noir-ba-grid{flex-direction:column !important;}
  .noir-stats-row{grid-template-columns:repeat(2,1fr) !important;}
  .noir-hero-h1{font-size:38px !important;letter-spacing:-0.02em !important;}
  .noir-purchase-card{width:100% !important;}
}
</style>
</head>
<body>

<!-- URGENCY BANNER -->
<div style="background:#C8FF00;color:#000000;text-align:center;padding:10px 20px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
  <span style="display:inline-flex;align-items:center;gap:8px;">${ico.flash(14)} ${data.urgency || 'Stock limité — Commandez avant rupture'}</span>
</div>

<!-- BREADCRUMB NAV -->
<nav style="background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:14px 24px;position:sticky;top:0;z-index:50;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:10px;">
    <span style="font-size:12px;color:#3A3A3A;cursor:pointer;transition:color .15s;" onmouseover="this.style.color='#8A8A8A'" onmouseout="this.style.color='#3A3A3A'">Accueil</span>
    <span style="font-size:12px;color:#3A3A3A;">›</span>
    <span style="font-size:12px;color:#3A3A3A;cursor:pointer;transition:color .15s;" onmouseover="this.style.color='#8A8A8A'" onmouseout="this.style.color='#3A3A3A'">Catalogue</span>
    <span style="font-size:12px;color:#3A3A3A;">›</span>
    <span style="font-size:12px;color:#ffffff;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO — IMAGE PLEINE LARGEUR -->
<section style="background:#000000;">
  <div style="position:relative;width:100%;height:600px;overflow:hidden;">
    <img id="mi2" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.55);transition:opacity .3s ease;" alt="${data.product_name}">
    <!-- Gradient vers #000 strict — pas de gris intermédiaire -->
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 70%, #000000 100%);pointer-events:none;"></div>
    <!-- Badge remise + titre centré -->
    <div style="position:absolute;bottom:56px;left:0;right:0;text-align:center;padding:0 24px;">
      ${savePct > 0 ? `<span style="display:inline-block;background:#C8FF00;color:#000000;font-size:10px;font-weight:700;padding:5px 16px;border-radius:2px;letter-spacing:0.12em;margin-bottom:20px;text-transform:uppercase;">-${savePct}% · Offre limitée</span>` : ''}
      <h1 class="noir-hero-h1" style="font-size:64px;font-weight:700;color:#ffffff;line-height:1.05;letter-spacing:-0.03em;">${data.headline}</h1>
    </div>
    <!-- Thumbnails bas droite -->
    <div style="position:absolute;bottom:24px;right:24px;display:flex;gap:8px;">
      ${imgs.slice(0,4).map((img, i) => `
      <div onclick="(function(){document.getElementById('mi2').src='${img}';document.querySelectorAll('.th2').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #ffffff':'2px solid rgba(255,255,255,0.12)';t.style.opacity=j===${i}?'1':'.35';});})()" class="th2" style="width:50px;height:50px;border-radius:4px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#ffffff':'rgba(255,255,255,0.12)'};opacity:${i===0?1:.35};">
        <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>`).join('')}
    </div>
  </div>

  <!-- SPLIT LAYOUT : description gauche / card achat droite -->
  <div style="max-width:1040px;margin:0 auto;padding:56px 24px 72px;display:flex;gap:60px;align-items:flex-start;" class="noir-hero-info">
    <!-- Gauche : sous-titre + avantages -->
    <div style="flex:1;padding-top:4px;">
      <p style="font-size:16px;color:#8A8A8A;line-height:1.8;margin-bottom:36px;">${data.subtitle}</p>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:14px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:flex-start;gap:14px;">
          <span style="color:#C8FF00;font-size:13px;flex-shrink:0;margin-top:4px;">▸</span>
          <span style="font-size:14px;color:#8A8A8A;line-height:1.65;">${b}</span>
        </li>`).join('')}
      </ul>
    </div>
    <!-- Droite : card achat — #111 comme unique surface foncée isolée -->
    <div class="noir-purchase-card" style="width:340px;flex-shrink:0;background:#111111;border-radius:6px;padding:36px;">
      <!-- Prix -->
      <div style="margin-bottom:28px;">
        ${data.price ? `<span style="font-size:52px;font-weight:700;color:#C8FF00;letter-spacing:-0.03em;line-height:1;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:20px;color:#3A3A3A;text-decoration:line-through;margin-left:14px;">${data.original_price}€</span>` : ''}
      </div>
      <!-- CTAs -->
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
        <button class="noir-cta-main" style="width:100%;font-size:15px;padding:17px 36px;">${data.cta || 'Ajouter au panier'}</button>
        <button class="noir-cta-ghost" style="width:100%;">Acheter maintenant</button>
      </div>
      <!-- Trust signals -->
      <div style="display:flex;flex-direction:column;gap:0;">
        <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="color:#C8FF00;opacity:0.9;">${ico.truck(15)}</span>
          <span style="font-size:12px;color:#3A3A3A;">Livraison express disponible</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="color:#C8FF00;opacity:0.9;">${ico.lock(15)}</span>
          <span style="font-size:12px;color:#3A3A3A;">Paiement 100% sécurisé</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:11px 0;">
          <span style="color:#C8FF00;opacity:0.9;">${ico.return(15)}</span>
          <span style="font-size:12px;color:#3A3A3A;">Retour gratuit 30 jours</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS — 4 métriques sur fond transparent, séparées par lignes verticales -->
<section style="padding:72px 24px;background:#000000;">
  <div style="max-width:960px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#C8FF00;text-transform:uppercase;margin-bottom:10px;text-align:center;">En chiffres</p>
    <h2 style="font-size:48px;font-weight:700;color:#ffffff;margin-bottom:56px;text-align:center;letter-spacing:-0.025em;">Ce que disent les données</h2>
    <!-- Grid stats : lignes verticales uniquement entre colonnes -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);" class="noir-stats-row">
      ${stats.map((s, i) => `
      <div style="text-align:center;padding:0 32px;${i < stats.length - 1 ? 'border-right:1px solid rgba(255,255,255,0.08);' : ''}">
        <p style="font-size:48px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;line-height:1;margin-bottom:12px;">${s.value}</p>
        <p style="font-size:11px;color:#8A8A8A;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">${s.label}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- SPECS TABLE — sobre, lignes subtiles -->
<section style="padding:80px 24px;background:#000000;">
  <div style="max-width:860px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#C8FF00;text-transform:uppercase;margin-bottom:10px;">Spécifications</p>
    <h2 style="font-size:48px;font-weight:700;color:#ffffff;margin-bottom:48px;letter-spacing:-0.025em;">Specs Techniques</h2>
    <div style="border-radius:6px;overflow:hidden;background:rgba(255,255,255,0.03);">
      ${specRows.map((row, i) => `
      <div class="noir-spec-row" style="display:flex;border-bottom:${i < specRows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'};">
        <div style="width:38%;padding:18px 24px;border-right:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:11px;font-weight:700;color:#ffffff;letter-spacing:0.08em;text-transform:uppercase;">${row[0]}</span>
        </div>
        <div style="flex:1;padding:18px 24px;">
          <span style="font-size:14px;color:#8A8A8A;">${row[1]}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS — Garantie / Livraison / Support -->
<section style="padding:72px 24px;background:#000000;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:40px;">
      ${tabContents.map((t, i) => `
      <button id="tbtn2-${i}" onclick="(function(){document.querySelectorAll('.tp2').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn2').forEach(function(b,j){b.style.borderBottom=j===${i}?'1px solid #ffffff':'1px solid transparent';b.style.color=j===${i}?'#ffffff':'#3A3A3A';b.style.marginBottom='-1px';});})()" class="tbtn2" style="padding:14px 28px;background:none;border:none;border-bottom:${i===0?'1px solid #ffffff':'1px solid transparent'};color:${i===0?'#ffffff':'#3A3A3A'};font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:-1px;transition:color .2s ease,border-color .2s ease;letter-spacing:0.01em;">${t.label}</button>`).join('')}
    </div>
    ${tabContents.map((t, i) => `
    <div id="${t.id}" class="tp2" style="display:${i===0?'block':'none'};">${t.content}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRÈS — images côte à côte, zéro border de card -->
<section style="padding:80px 24px;background:#000000;">
  <div style="max-width:960px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#C8FF00;text-transform:uppercase;margin-bottom:10px;">Transformation</p>
    <h2 style="font-size:48px;font-weight:700;color:#ffffff;margin-bottom:48px;letter-spacing:-0.025em;">Avant / Après</h2>
    <div style="display:flex;gap:16px;" class="noir-ba-grid">
      <!-- Avant -->
      <div style="flex:1;position:relative;border-radius:6px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:grayscale(100%) brightness(0.5);" alt="Avant">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%);pointer-events:none;"></div>
        <div style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.08);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#8A8A8A;font-size:10px;font-weight:700;padding:6px 14px;border-radius:2px;letter-spacing:0.1em;text-transform:uppercase;">Avant</div>
      </div>
      <!-- Après -->
      <div style="flex:1;position:relative;border-radius:6px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.3), transparent 60%);pointer-events:none;"></div>
        <div style="position:absolute;top:16px;left:16px;background:#C8FF00;color:#000000;font-size:10px;font-weight:700;padding:6px 14px;border-radius:2px;letter-spacing:0.1em;text-transform:uppercase;">Après</div>
      </div>
    </div>
  </div>
</section>

<!-- SECTIONS DYNAMIQUES — story / social_proof / comparison / testimonials / bonuses / guarantee -->
${renderSocialProofBar(data, NOIR_THEME)}
${renderStorySection(data, NOIR_THEME)}
${renderComparisonSection(data, NOIR_THEME)}
${renderTestimonialsSection(data, NOIR_THEME)}
${renderBonusesSection(data, NOIR_THEME)}
${renderGuaranteeSection(data, NOIR_THEME)}

<!-- FAQ ACCORDION -->
<section style="padding:80px 24px;background:#000000;">
  <div style="max-width:680px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#C8FF00;text-transform:uppercase;margin-bottom:10px;">FAQ</p>
    <h2 style="font-size:48px;font-weight:700;color:#ffffff;margin-bottom:48px;letter-spacing:-0.025em;">Questions fréquentes</h2>
    <div>${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL — fond #C8FF00, titres noirs, bouton noir -->
<section style="padding:96px 24px;background:#C8FF00;">
  <div style="max-width:680px;margin:0 auto;text-align:center;">
    <h2 style="font-size:52px;font-weight:700;color:#000000;letter-spacing:-0.03em;margin-bottom:16px;line-height:1.05;">${data.headline}</h2>
    <p style="font-size:16px;color:rgba(0,0,0,0.5);margin-bottom:36px;line-height:1.7;">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:60px;font-weight:700;color:#000000;margin-bottom:36px;letter-spacing:-0.03em;line-height:1;">${data.price}€</p>` : ''}
    <button style="background:#000000;color:#ffffff;border:none;border-radius:3px;padding:20px 60px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.04em;transition:opacity .2s ease,transform .2s ease;" onmouseover="this.style.opacity='0.85';this.style.transform='translateY(-1px)'" onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">${data.cta || 'Commander maintenant'}</button>
    <p style="font-size:11px;color:rgba(0,0,0,0.4);margin-top:20px;letter-spacing:0.04em;text-transform:uppercase;">Livraison express · Paiement sécurisé · 30j satisfait ou remboursé</p>
  </div>
</section>

</body>
</html>`
}
