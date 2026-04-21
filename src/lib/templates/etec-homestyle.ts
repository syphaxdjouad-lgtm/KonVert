import type { LandingPageData } from '@/types'
import { ico } from './icons'

const IMGS = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=800',
]
const BEFORE_IMG = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'
const AFTER_IMG  = 'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600'

export function templateEtecHomestyle(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)

  const faqHtml = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E8E0D8;overflow:hidden;">
      <button onclick="(function(){var c=document.getElementById('faq-hs-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'500px';c.style.paddingTop=open?'0':'12px';var a=document.getElementById('arr-hs-${i}');a.textContent=open?'+':'−';})()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;background:none;border:none;cursor:pointer;text-align:left;">
        <span style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#2C2420;">${f.question}</span>
        <span id="arr-hs-${i}" style="font-size:20px;color:#8B6914;flex-shrink:0;margin-left:16px;">+</span>
      </button>
      <div id="faq-hs-${i}" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding-top .35s ease;padding-top:0;">
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#7A7067;line-height:1.8;padding-bottom:20px;margin:0;">${f.answer}</p>
      </div>
    </div>`).join('')

  const qualities = [
    { icon: ico.leaf(24), title: benefits[0] || 'Bois massif', desc: data.subtitle || 'Matériaux nobles et durables sélectionnés avec soin' },
    { icon: ico.shield(24), title: benefits[1] || 'Fait main', desc: 'Chaque pièce est assemblée par nos artisans experts' },
    { icon: ico.trophy(24), title: benefits[2] || 'Design intemporel', desc: 'Des lignes épurées qui traversent les tendances' },
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.product_name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FAF7F2;color:#2C2420;}
.hs-btn{background:#2C2420;color:#FAF7F2;border:none;border-radius:6px;padding:17px 40px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.04em;cursor:pointer;transition:all .3s;}
.hs-btn:hover{background:#8B6914;transform:translateY(-1px);}
.hs-btn-outline{background:transparent;color:#2C2420;border:1.5px solid #2C2420;border-radius:6px;padding:15px 40px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.04em;cursor:pointer;transition:all .3s;}
.hs-btn-outline:hover{background:#2C2420;color:#FAF7F2;}
@media(max-width:768px){
  .hs-hero{flex-direction:column!important;}
  .hs-hero-img{width:100%!important;height:460px!important;}
  .hs-hero-info{width:100%!important;padding:32px 20px!important;}
  .hs-qual-grid{grid-template-columns:1fr!important;}
  .hs-compare{flex-direction:column!important;}
  .hs-reviews{grid-template-columns:1fr!important;}
}
</style>
</head>
<body>

<!-- TOP BAR -->
<div style="background:#2C2420;color:#D4C5A9;text-align:center;padding:11px 20px;font-size:12px;font-weight:500;letter-spacing:0.06em;">
  ${data.urgency || 'Livraison offerte — Pièces artisanales en édition limitée'}
</div>

<!-- BREADCRUMB -->
<nav style="background:#FAF7F2;border-bottom:1px solid #E8E0D8;padding:14px 24px;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;color:#A09688;">Maison</span>
    <span style="font-size:12px;color:#D4C5A9;">›</span>
    <span style="font-size:12px;color:#A09688;">Mobilier</span>
    <span style="font-size:12px;color:#D4C5A9;">›</span>
    <span style="font-size:12px;color:#2C2420;font-weight:500;">${data.product_name}</span>
  </div>
</nav>

<!-- HERO -->
<section style="background:#FAF7F2;padding:0;">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:stretch;min-height:620px;" class="hs-hero">
    <div style="width:56%;position:relative;overflow:hidden;border-radius:0 16px 16px 0;" class="hs-hero-img">
      <img id="mi-hs" src="${imgs[0]}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;min-height:500px;" alt="${data.product_name}">
      ${savePct > 0 ? `<div style="position:absolute;top:20px;left:20px;background:#8B6914;color:#fff;font-size:12px;font-weight:700;padding:7px 16px;border-radius:6px;">-${savePct}%</div>` : ''}
      <div style="position:absolute;bottom:20px;left:20px;display:flex;gap:8px;">
        ${imgs.slice(0,4).map((img, i) => `
        <div onclick="document.getElementById('mi-hs').src='${img}';document.querySelectorAll('.th-hs').forEach(function(t,j){t.style.outline=j===${i}?'2px solid #8B6914':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});" class="th-hs" style="width:52px;height:52px;border-radius:6px;overflow:hidden;cursor:pointer;outline:2px solid ${i===0?'#8B6914':'transparent'};opacity:${i===0?1:.5};transition:all .2s;">
          <img src="${img}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>`).join('')}
      </div>
    </div>

    <div style="width:44%;padding:52px 48px;display:flex;flex-direction:column;justify-content:center;" class="hs-hero-info">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#8B6914;text-transform:uppercase;margin-bottom:12px;">Collection Intérieur</p>
      <h1 style="font-family:'Lora',serif;font-size:40px;font-weight:600;color:#2C2420;line-height:1.15;letter-spacing:-0.02em;margin-bottom:14px;">${data.headline}</h1>
      <p style="font-size:15px;color:#7A7067;line-height:1.7;margin-bottom:28px;">${data.subtitle}</p>

      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #E8E0D8;">
        ${data.price ? `<span style="font-family:'Lora',serif;font-size:36px;font-weight:600;color:#2C2420;">${data.price}€</span>` : ''}
        ${data.original_price ? `<span style="font-size:18px;color:#A09688;text-decoration:line-through;">${data.original_price}€</span>` : ''}
      </div>

      <ul style="list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:10px;">
        ${benefits.map(b => `
        <li style="display:flex;align-items:center;gap:10px;">
          <span style="width:6px;height:6px;background:#8B6914;border-radius:50%;flex-shrink:0;"></span>
          <span style="font-size:14px;color:#555;line-height:1.5;">${b}</span>
        </li>`).join('')}
      </ul>

      <div style="display:flex;gap:12px;">
        <button class="hs-btn" style="flex:1;text-align:center;">${data.cta || 'Ajouter au panier'}</button>
        <button class="hs-btn-outline" style="flex:1;text-align:center;">Voir en 3D</button>
      </div>

      <div style="display:flex;gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid #E8E0D8;">
        <span style="font-size:11px;color:#A09688;display:flex;align-items:center;gap:5px;">${ico.truck(14)} Livraison soignée</span>
        <span style="font-size:11px;color:#A09688;display:flex;align-items:center;gap:5px;">${ico.shield(14)} Garantie 5 ans</span>
        <span style="font-size:11px;color:#A09688;display:flex;align-items:center;gap:5px;">${ico.return(14)} Retour 30j</span>
      </div>
    </div>
  </div>
</section>

<!-- QUALITIES — 3 COL -->
<section style="padding:80px 24px;background:#F0EBE3;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#8B6914;text-align:center;text-transform:uppercase;margin-bottom:8px;">Savoir-faire</p>
    <h2 style="font-family:'Lora',serif;font-size:32px;font-weight:600;color:#2C2420;text-align:center;letter-spacing:-0.02em;margin-bottom:56px;">Ce qui fait la différence</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="hs-qual-grid">
      ${qualities.map(q => `
      <div style="background:#FAF7F2;border-radius:12px;padding:36px 28px;text-align:center;">
        <div style="width:52px;height:52px;border-radius:50%;background:#F0EBE3;display:flex;align-items:center;justify-content:center;color:#8B6914;margin:0 auto 20px;">${q.icon}</div>
        <h3 style="font-family:'Lora',serif;font-size:18px;font-weight:600;color:#2C2420;margin-bottom:10px;">${q.title}</h3>
        <p style="font-size:14px;color:#7A7067;line-height:1.7;">${q.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- TABS -->
<section style="padding:60px 24px;background:#FAF7F2;">
  <div style="max-width:800px;margin:0 auto;">
    <div style="display:flex;border-bottom:1px solid #E8E0D8;margin-bottom:32px;">
      ${[
        { label: 'Matériaux', content: `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Bois massif certifié FSC, finitions huilées naturelles. Assemblages traditionnels à tenon et mortaise. Chaque pièce est unique grâce aux veines naturelles du bois.</p>` },
        { label: 'Dimensions', content: `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Dimensions standards adaptées aux intérieurs modernes. Sur demande : dimensions personnalisées disponibles. Poids optimisé pour faciliter la livraison et l'installation.</p>` },
        { label: 'Livraison', content: `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Livraison offerte en France métropolitaine. Emballage renforcé sur mesure. Installation possible (supplément). Délai : 5-10 jours ouvrés.</p>` },
      ].map((t, i) => `
      <button onclick="(function(){document.querySelectorAll('.tp-hs').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tbtn-hs').forEach(function(b,j){b.style.borderBottom=j===${i}?'2px solid #8B6914':'2px solid transparent';b.style.color=j===${i}?'#2C2420':'#A09688';b.style.marginBottom='-1px';});})()" class="tbtn-hs" style="padding:14px 28px;background:none;border:none;border-bottom:${i===0?'2px solid #8B6914':'2px solid transparent'};color:${i===0?'#2C2420':'#A09688'};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:-1px;transition:all .2s;">${t.label}</button>`).join('')}
    </div>
    ${[
      `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Bois massif certifié FSC, finitions huilées naturelles. Assemblages traditionnels à tenon et mortaise. Chaque pièce est unique grâce aux veines naturelles du bois.</p>`,
      `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Dimensions standards adaptées aux intérieurs modernes. Sur demande : dimensions personnalisées disponibles. Poids optimisé pour faciliter la livraison et l'installation.</p>`,
      `<p style="font-size:14px;color:#7A7067;line-height:1.8;">Livraison offerte en France métropolitaine. Emballage renforcé sur mesure. Installation possible (supplément). Délai : 5-10 jours ouvrés.</p>`,
    ].map((c, i) => `<div class="tp-hs" style="display:${i===0?'block':'none'};">${c}</div>`).join('')}
  </div>
</section>

<!-- AVANT / APRES -->
<section style="padding:80px 24px;background:#F0EBE3;">
  <div style="max-width:1000px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#8B6914;text-align:center;text-transform:uppercase;margin-bottom:8px;">Transformation</p>
    <h2 style="font-family:'Lora',serif;font-size:32px;font-weight:600;color:#2C2420;text-align:center;margin-bottom:48px;">Avant / Après installation</h2>
    <div style="display:flex;gap:20px;" class="hs-compare">
      <div style="flex:1;position:relative;border-radius:12px;overflow:hidden;">
        <img src="${BEFORE_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;filter:saturate(0.4) brightness(0.85);" alt="Avant">
        <div style="position:absolute;top:16px;left:16px;background:rgba(44,36,32,0.7);color:#FAF7F2;font-size:11px;font-weight:600;padding:6px 16px;border-radius:6px;">AVANT</div>
      </div>
      <div style="flex:1;position:relative;border-radius:12px;overflow:hidden;">
        <img src="${AFTER_IMG}" crossorigin="anonymous" style="width:100%;height:340px;object-fit:cover;display:block;" alt="Après">
        <div style="position:absolute;top:16px;left:16px;background:#8B6914;color:#fff;font-size:11px;font-weight:600;padding:6px 16px;border-radius:6px;">APRÈS</div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="padding:80px 24px;background:#FAF7F2;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#8B6914;text-align:center;text-transform:uppercase;margin-bottom:8px;">Avis clients</p>
    <h2 style="font-family:'Lora',serif;font-size:32px;font-weight:600;color:#2C2420;text-align:center;margin-bottom:48px;">Ils ont transformé leur intérieur</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="hs-reviews">
      ${[
        { name: 'François D.', text: `Le ${data.product_name} est superbe. La qualité du bois est exceptionnelle, les finitions sont parfaites. Il trône dans notre salon depuis un mois.`, date: '5 jours' },
        { name: 'Émilie G.', text: `Exactement ce que je cherchais pour mon appartement. Le style est intemporel, la livraison était impeccable. Très contente de mon achat.`, date: '2 semaines' },
        { name: 'Marc L.', text: `Troisième meuble que je commande chez eux. Toujours la même qualité irréprochable. Le bois vieillit magnifiquement bien.`, date: '3 semaines' },
      ].map(r => `
      <div style="background:#F0EBE3;border-radius:12px;padding:28px 24px;">
        <div style="color:#8B6914;font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div>
        <p style="font-size:14px;color:#555;line-height:1.75;margin-bottom:20px;">"${r.text}"</p>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#2C2420;color:#D4C5A9;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${r.name[0]}</div>
          <div>
            <p style="font-size:13px;font-weight:600;color:#2C2420;">${r.name}</p>
            <p style="font-size:11px;color:#A09688;">Il y a ${r.date}</p>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:80px 24px;background:#F0EBE3;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-family:'Lora',serif;font-size:32px;font-weight:600;color:#2C2420;text-align:center;margin-bottom:48px;">Questions fréquentes</h2>
    <div style="background:#FAF7F2;border-radius:12px;padding:8px 32px;">${faqHtml}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="padding:100px 24px;background:#2C2420;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <h2 style="font-family:'Lora',serif;font-size:38px;font-weight:600;color:#FAF7F2;letter-spacing:-0.02em;margin-bottom:16px;">${data.headline}</h2>
    <p style="font-size:15px;color:rgba(250,247,242,0.5);margin-bottom:36px;line-height:1.7;">${data.subtitle}</p>
    ${data.price ? `<p style="font-family:'Lora',serif;font-size:48px;font-weight:600;color:#D4C5A9;margin-bottom:36px;">${data.price}€</p>` : ''}
    <button style="background:#8B6914;color:#fff;border:none;border-radius:6px;padding:18px 52px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;">${data.cta || 'Commander maintenant'}</button>
    <p style="font-size:12px;color:rgba(250,247,242,0.3);margin-top:20px;">Livraison offerte · Garantie 5 ans · Retour 30 jours</p>
  </div>
</section>

</body>
</html>`
}
