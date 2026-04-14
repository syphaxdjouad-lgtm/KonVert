import type { LandingPageData } from '@/types'

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function benefits(data: LandingPageData): string {
  return data.benefits
    .map(b => `<li style="margin:10px 0;display:flex;align-items:flex-start;gap:10px;">
      <span style="color:var(--accent);font-weight:800;flex-shrink:0;margin-top:2px;">✓</span>
      <span>${b}</span>
    </li>`)
    .join('')
}

function faq(data: LandingPageData): string {
  return data.faq
    .map(item => `
    <div style="border-bottom:1px solid var(--border);padding:18px 0;">
      <p style="font-weight:700;margin-bottom:8px;font-size:1rem;">${item.question}</p>
      <p style="opacity:.7;line-height:1.6;font-size:.9rem;">${item.answer}</p>
    </div>`).join('')
}

function priceBlock(data: LandingPageData): string {
  if (!data.price) return ''
  const original = data.original_price
    ? `<span style="text-decoration:line-through;opacity:.5;font-size:1.2rem;margin-right:10px;">${data.original_price}€</span>`
    : ''
  return `<div style="margin:20px 0 10px;">
    ${original}
    <span style="font-size:2.2rem;font-weight:900;color:var(--accent);">${data.price}€</span>
  </div>`
}

function heroImage(data: LandingPageData, style = ''): string {
  if (!data.images?.[0]) return ''
  return `<img src="${data.images[0]}" alt="${data.product_name}" style="max-width:100%;border-radius:12px;${style}" />`
}

// ─── TEMPLATE 1 — MINIMAL DARK ────────────────────────────────────────────────

export function templateMinimalDark(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#0f0f0f;--card:#1a1a1a;--text:#f5f5f5;--accent:#ef4444;--border:#2a2a2a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:700px;margin:0 auto;padding:0 24px;}
  section{padding:60px 0;}
  .badge{display:inline-block;background:rgba(239,68,68,.15);color:var(--accent);border:1px solid rgba(239,68,68,.3);padding:6px 16px;border-radius:20px;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}
  h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:18px;}
  .subtitle{font-size:1.15rem;opacity:.7;max-width:500px;margin-bottom:30px;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:1rem;padding:16px 36px;border-radius:10px;text-decoration:none;cursor:pointer;border:none;transition:opacity .2s;}
  .cta:hover{opacity:.9;}
  .urgency{margin-top:14px;font-size:.85rem;opacity:.6;letter-spacing:.02em;}
  ul{list-style:none;margin:30px 0;}
  .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:32px;}
</style>
</head>
<body>
  <section>
    <div class="wrap">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
        <div>
          <span class="badge">${data.product_name}</span>
          <h1>${data.headline}</h1>
          <p class="subtitle">${data.subtitle}</p>
          ${priceBlock(data)}
          <button class="cta">${data.cta}</button>
          <p class="urgency">${data.urgency}</p>
        </div>
        <div>${heroImage(data, 'box-shadow:0 24px 80px rgba(0,0,0,.5);')}</div>
      </div>
    </div>
  </section>

  <section style="padding-top:0;">
    <div class="wrap">
      <div class="card">
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px;">Pourquoi vous allez l'adorer</h2>
        <ul>${benefits(data)}</ul>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:28px;">Questions fréquentes</h2>
      ${faq(data)}
    </div>
  </section>

  <section style="text-align:center;background:var(--card);border-radius:20px;margin:0 24px 60px;">
    <div class="wrap" style="padding:60px 24px;">
      <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
      <p style="opacity:.7;margin-bottom:30px;">${data.urgency}</p>
      ${priceBlock(data)}
      <button class="cta">${data.cta}</button>
    </div>
  </section>
</body>
</html>`
}

// ─── TEMPLATE 2 — CLEAN WHITE ─────────────────────────────────────────────────

export function templateCleanWhite(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#ffffff;--card:#f8f9fa;--text:#111;--accent:#7c3aed;--border:#e5e7eb;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:700px;margin:0 auto;padding:0 24px;}
  section{padding:64px 0;}
  h1{font-size:clamp(2rem,5vw,3rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:16px;}
  .subtitle{font-size:1.1rem;color:#6b7280;max-width:520px;margin-bottom:32px;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:15px 34px;border-radius:10px;text-decoration:none;cursor:pointer;border:none;font-size:.95rem;}
  .cta:hover{filter:brightness(1.1);}
  .urgency{margin-top:12px;font-size:.82rem;color:#9ca3af;}
  ul{list-style:none;margin:24px 0;}
  .divider{border:none;border-top:1px solid var(--border);margin:0;}
  .pill{background:rgba(124,58,237,.1);color:var(--accent);border-radius:20px;padding:5px 14px;font-size:.78rem;font-weight:700;display:inline-block;margin-bottom:18px;}
</style>
</head>
<body>
  <section>
    <div class="wrap">
      <span class="pill">${data.product_name}</span>
      <h1>${data.headline}</h1>
      <p class="subtitle">${data.subtitle}</p>
      ${priceBlock(data)}
      <button class="cta">${data.cta}</button>
      <p class="urgency">${data.urgency}</p>
    </div>
  </section>

  ${data.images?.[0] ? `<div style="background:var(--card);padding:40px 24px;text-align:center;">
    ${heroImage(data, 'max-height:420px;object-fit:cover;border-radius:16px;border:1px solid var(--border);')}
  </div>` : ''}

  <section>
    <div class="wrap">
      <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Ce que vous gagnez</p>
      <h2 style="font-size:1.75rem;font-weight:800;margin-bottom:28px;">Tout ce dont vous avez besoin</h2>
      <ul>${benefits(data)}</ul>
    </div>
  </section>

  <hr class="divider"/>

  <section>
    <div class="wrap">
      <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:28px;">Questions fréquentes</h2>
      ${faq(data)}
    </div>
  </section>

  <section style="background:var(--accent);color:#fff;text-align:center;border-radius:0;">
    <div class="wrap" style="padding:60px 24px;">
      <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
      ${data.price ? `<p style="font-size:2rem;font-weight:900;margin:16px 0;">${data.price}€</p>` : ''}
      <button style="background:#fff;color:var(--accent);font-weight:800;padding:15px 34px;border-radius:10px;border:none;cursor:pointer;font-size:.95rem;">${data.cta}</button>
    </div>
  </section>
</body>
</html>`
}

// ─── TEMPLATE 3 — BOLD SALES ──────────────────────────────────────────────────

export function templateBoldSales(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fff7ed;--text:#1a0a00;--accent:#ea580c;--yellow:#fbbf24;--border:#fed7aa;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:700px;margin:0 auto;padding:0 24px;}
  .hero{background:linear-gradient(135deg,#ea580c,#dc2626);color:#fff;padding:64px 24px;text-align:center;}
  h1{font-size:clamp(2.2rem,6vw,3.5rem);font-weight:900;line-height:1.05;letter-spacing:-.02em;margin-bottom:14px;}
  .subtitle{font-size:1.15rem;opacity:.9;max-width:500px;margin:0 auto 28px;}
  .cta{display:inline-block;background:var(--yellow);color:#7c2d12;font-weight:900;font-size:1.05rem;padding:18px 42px;border-radius:10px;text-decoration:none;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.25);}
  .urgency{margin-top:14px;font-size:.9rem;opacity:.85;font-weight:600;}
  section{padding:60px 0;}
  ul{list-style:none;margin:24px 0;}
  .strike{text-decoration:line-through;opacity:.5;}
</style>
</head>
<body>
  <div class="hero">
    <p style="font-size:.8rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;opacity:.8;margin-bottom:16px;">${data.product_name}</p>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${data.original_price ? `<p style="margin-bottom:8px;"><span class="strike">${data.original_price}€</span> <span style="font-size:2.5rem;font-weight:900;">${data.price}€</span></p>` : data.price ? `<p style="font-size:2.5rem;font-weight:900;margin-bottom:8px;">${data.price}€</p>` : ''}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>

  ${data.images?.[0] ? `<div style="text-align:center;padding:40px 24px;background:#fff8f0;">
    ${heroImage(data, 'max-height:380px;border-radius:12px;box-shadow:0 16px 60px rgba(234,88,12,.2);')}
  </div>` : ''}

  <section>
    <div class="wrap">
      <h2 style="font-size:1.6rem;font-weight:900;color:var(--accent);margin-bottom:24px;">Voici ce que vous obtenez :</h2>
      <ul>${benefits(data)}</ul>
      <div style="margin-top:32px;text-align:center;">
        <button class="cta">${data.cta}</button>
      </div>
    </div>
  </section>

  <section style="background:#fff;border-top:3px solid var(--border);">
    <div class="wrap">
      <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:24px;">Vos questions, nos réponses</h2>
      ${faq(data)}
    </div>
  </section>

  <div style="background:linear-gradient(135deg,#dc2626,#ea580c);color:#fff;padding:60px 24px;text-align:center;">
    <div class="wrap">
      <h2 style="font-size:2rem;font-weight:900;margin-bottom:16px;">${data.urgency}</h2>
      ${data.price ? `<p style="font-size:2.5rem;font-weight:900;margin-bottom:24px;">${data.price}€</p>` : ''}
      <button class="cta">${data.cta}</button>
    </div>
  </div>
</body>
</html>`
}

// ─── TEMPLATE 4 — LUXURY ──────────────────────────────────────────────────────

export function templateLuxury(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#faf9f7;--text:#1a1714;--gold:#c9993a;--border:#e8e0d5;--card:#f5f0e8;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:Georgia,'Times New Roman',serif;line-height:1.7;}
  .wrap{max-width:680px;margin:0 auto;padding:0 32px;}
  .hero{padding:80px 32px;text-align:center;border-bottom:1px solid var(--border);}
  .overline{font-size:.72rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;font-family:-apple-system,sans-serif;}
  h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:400;line-height:1.2;letter-spacing:-.01em;margin-bottom:20px;}
  .subtitle{font-size:1.05rem;color:#6b5d4e;max-width:480px;margin:0 auto 36px;font-family:-apple-system,sans-serif;}
  .cta{display:inline-block;background:var(--text);color:#fff;font-family:-apple-system,sans-serif;font-weight:600;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;padding:16px 40px;border-radius:0;text-decoration:none;border:none;cursor:pointer;transition:background .2s;}
  .cta:hover{background:var(--gold);}
  .urgency{margin-top:16px;font-size:.82rem;color:#9c8460;font-family:-apple-system,sans-serif;letter-spacing:.04em;}
  section{padding:70px 0;}
  ul{list-style:none;}
</style>
</head>
<body>
  <div class="hero">
    <p class="overline">${data.product_name}</p>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${data.price ? `<p style="font-size:1.6rem;color:var(--gold);margin-bottom:24px;letter-spacing:.02em;">${data.price}€ ${data.original_price ? `<span style="text-decoration:line-through;font-size:1rem;opacity:.5;">${data.original_price}€</span>` : ''}</p>` : ''}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>

  ${data.images?.[0] ? `<div style="text-align:center;padding:50px 32px;background:var(--card);">
    ${heroImage(data, 'max-height:440px;object-fit:cover;')}
  </div>` : ''}

  <section>
    <div class="wrap">
      <p class="overline" style="margin-bottom:16px;">L'essentiel</p>
      <ul>${data.benefits.map(b => `<li style="padding:16px 0;border-bottom:1px solid var(--border);font-size:.95rem;color:#3d2f20;display:flex;gap:16px;align-items:flex-start;">
        <span style="color:var(--gold);font-size:.75rem;margin-top:5px;">◆</span>${b}</li>`).join('')}</ul>
    </div>
  </section>

  <section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
    <div class="wrap">
      <p class="overline" style="margin-bottom:20px;">Questions</p>
      ${data.faq.map(item => `<div style="padding:20px 0;border-bottom:1px solid var(--border);">
        <p style="font-weight:700;margin-bottom:8px;font-size:.95rem;">${item.question}</p>
        <p style="color:#6b5d4e;font-size:.9rem;font-family:-apple-system,sans-serif;">${item.answer}</p>
      </div>`).join('')}
    </div>
  </section>

  <section style="text-align:center;">
    <div class="wrap">
      <p class="overline" style="margin-bottom:16px;">Commander</p>
      <h2 style="font-size:1.8rem;font-weight:400;margin-bottom:20px;">${data.headline}</h2>
      ${data.price ? `<p style="font-size:1.8rem;color:var(--gold);margin-bottom:28px;">${data.price}€</p>` : ''}
      <button class="cta">${data.cta}</button>
    </div>
  </section>
</body>
</html>`
}

// ─── TEMPLATE 5 — MOBILE FIRST ────────────────────────────────────────────────

export function templateMobileFirst(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fff;--text:#111;--accent:#2563eb;--light:#eff6ff;--border:#dbeafe;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;max-width:480px;margin:0 auto;}
  .hero{padding:32px 20px 28px;background:var(--light);border-bottom:2px solid var(--border);}
  .tag{background:var(--accent);color:#fff;font-size:.7rem;font-weight:800;padding:4px 12px;border-radius:20px;letter-spacing:.06em;display:inline-block;margin-bottom:14px;text-transform:uppercase;}
  h1{font-size:1.6rem;font-weight:900;line-height:1.15;letter-spacing:-.01em;margin-bottom:10px;}
  .subtitle{font-size:.9rem;color:#4b5563;margin-bottom:18px;}
  .cta{display:block;width:100%;background:var(--accent);color:#fff;font-weight:800;font-size:1rem;padding:16px;border-radius:12px;border:none;cursor:pointer;text-align:center;margin-bottom:10px;}
  .urgency{font-size:.78rem;color:#6b7280;text-align:center;}
  .img-wrap{padding:20px;background:#f9fafb;border-bottom:1px solid #f3f4f6;}
  section{padding:28px 20px;border-bottom:1px solid #f3f4f6;}
  h2{font-size:1.1rem;font-weight:800;margin-bottom:16px;}
  ul{list-style:none;}
  .price-big{font-size:2rem;font-weight:900;color:var(--accent);}
</style>
</head>
<body>
  <div class="hero">
    <span class="tag">${data.product_name}</span>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${data.price ? `<div style="margin-bottom:16px;">${data.original_price ? `<span style="text-decoration:line-through;color:#9ca3af;font-size:.9rem;margin-right:8px;">${data.original_price}€</span>` : ''}<span class="price-big">${data.price}€</span></div>` : ''}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>

  ${data.images?.[0] ? `<div class="img-wrap">${heroImage(data, 'width:100%;border-radius:10px;')}</div>` : ''}

  <section>
    <h2>Pourquoi le choisir ?</h2>
    <ul>${data.benefits.map(b => `<li style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;font-size:.9rem;">
      <span style="color:var(--accent);font-weight:900;flex-shrink:0;">✓</span>${b}</li>`).join('')}</ul>
  </section>

  <section>
    <h2>Questions fréquentes</h2>
    ${data.faq.map(item => `<div style="margin-bottom:16px;">
      <p style="font-weight:700;font-size:.9rem;margin-bottom:4px;">${item.question}</p>
      <p style="font-size:.85rem;color:#6b7280;">${item.answer}</p>
    </div>`).join('')}
  </section>

  <section style="text-align:center;">
    ${data.price ? `<div class="price-big" style="margin-bottom:14px;">${data.price}€</div>` : ''}
    <button class="cta">${data.cta}</button>
    <p class="urgency" style="margin-top:10px;">${data.urgency}</p>
  </section>
</body>
</html>`
}

// ─── TEMPLATE 6 — SHEIN PRO ───────────────────────────────────────────────────

export function templateSheinPro(data: LandingPageData): string {
  const imgs    = data.images || []
  const mainImg = imgs[0] || 'https://via.placeholder.com/800x800?text=Product'
  const thumbs  = imgs.slice(0, 5)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;background:#fff;color:#1a1a2e;line-height:1.6;}

  /* NAV */
  .nav{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #f0f0f5;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;}
  .nav-brand{font-weight:900;font-size:18px;color:#1a1a2e;letter-spacing:-.02em;}
  .nav-cart{background:#7c3aed;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;}

  /* HERO */
  .hero-image{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#f8f8fc;}
  .thumbs{display:flex;gap:8px;padding:12px 16px;overflow-x:auto;scrollbar-width:none;}
  .thumbs::-webkit-scrollbar{display:none;}
  .thumb{width:64px;height:64px;border-radius:8px;object-fit:cover;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:.2s;}
  .thumb.active,.thumb:hover{border-color:#7c3aed;}

  /* INFOS */
  .product-info{padding:20px 16px;}
  .badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
  .badge{font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;background:#f3f0ff;color:#7c3aed;}
  .badge.new{background:#fef3c7;color:#d97706;}
  .product-name{font-size:22px;font-weight:900;line-height:1.2;margin-bottom:8px;letter-spacing:-.02em;}
  .product-sub{font-size:14px;color:#5c5c7a;margin-bottom:16px;line-height:1.5;}

  /* PRIX */
  .price-block{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
  .price-main{font-size:28px;font-weight:900;color:#16a34a;}
  .price-old{font-size:16px;color:#9ca3af;text-decoration:line-through;}
  .price-badge{background:#fee2e2;color:#ef4444;font-size:12px;font-weight:800;padding:3px 8px;border-radius:6px;}

  /* REVIEWS */
  .reviews{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f0f0f5;}
  .stars{color:#fbbf24;font-size:14px;letter-spacing:1px;}
  .review-count{font-size:13px;color:#5c5c7a;}

  /* TRUST */
  .trust{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;}
  .trust-item{text-align:center;padding:12px 6px;border-radius:12px;background:#f8f8fc;}
  .trust-icon{font-size:20px;margin-bottom:4px;}
  .trust-label{font-size:10px;font-weight:700;color:#5c5c7a;line-height:1.3;}

  /* OPTIONS */
  .section-label{font-size:12px;font-weight:700;color:#8b8b9e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
  .qty-picker{display:flex;align-items:center;gap:0;border:1px solid #e3e3e8;border-radius:10px;overflow:hidden;width:fit-content;margin-bottom:20px;}
  .qty-btn{width:40px;height:40px;border:none;background:#f8f8fc;font-size:18px;cursor:pointer;font-weight:700;color:#1a1a2e;}
  .qty-val{width:48px;height:40px;text-align:center;border:none;border-left:1px solid #e3e3e8;border-right:1px solid #e3e3e8;font-weight:700;font-size:15px;background:#fff;}

  /* CTA STICKY */
  .cta-sticky{position:sticky;bottom:0;background:#fff;padding:12px 16px;border-top:1px solid #f0f0f5;box-shadow:0 -4px 20px rgba(0,0,0,.08);z-index:100;}
  .cta-btn{display:block;width:100%;padding:16px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:900;letter-spacing:.01em;cursor:pointer;text-align:center;transition:.2s;}
  .cta-btn:hover{opacity:.93;}
  .cta-sub{text-align:center;font-size:11px;color:#9ca3af;margin-top:6px;}

  /* SECTIONS */
  .section{padding:28px 16px;border-top:8px solid #f6f6f7;}
  .section h2{font-size:18px;font-weight:900;margin-bottom:16px;letter-spacing:-.01em;}

  /* BENEFICES */
  .benefits-list{list-style:none;}
  .benefits-list li{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f5;}
  .benefits-list li:last-child{border-bottom:none;}
  .benefit-icon{width:24px;height:24px;border-radius:6px;background:#f3f0ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;}
  .benefit-text{font-size:14px;color:#1a1a2e;line-height:1.4;}

  /* REVIEWS DETAIL */
  .review-card{background:#f8f8fc;border-radius:14px;padding:16px;margin-bottom:10px;}
  .review-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .reviewer{font-weight:700;font-size:13px;}
  .review-date{font-size:11px;color:#9ca3af;}
  .review-text{font-size:13px;color:#5c5c7a;line-height:1.5;}

  /* FAQ */
  .faq-item{border-bottom:1px solid #f0f0f5;}
  .faq-q{width:100%;text-align:left;background:none;border:none;padding:16px 0;font-size:14px;font-weight:700;color:#1a1a2e;cursor:pointer;display:flex;justify-content:space-between;align-items:center;}
  .faq-icon{font-size:20px;color:#7c3aed;transition:.3s;flex-shrink:0;}
  .faq-a{font-size:13px;color:#5c5c7a;line-height:1.6;max-height:0;overflow:hidden;transition:max-height .3s ease;}
  .faq-a.open{max-height:300px;padding-bottom:16px;}

  /* FOOTER */
  .footer{padding:20px 16px;border-top:1px solid #f0f0f5;text-align:center;}
  .payment-icons{display:flex;justify-content:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
  .payment-icon{background:#f8f8fc;border:1px solid #e3e3e8;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;color:#5c5c7a;}
  .footer-text{font-size:11px;color:#9ca3af;}
</style>
</head>
<body>

<!-- NAV -->
<nav class="nav">
  <span class="nav-brand">Shop</span>
  <button class="nav-cart" onclick="document.querySelector('.cta-btn').scrollIntoView({behavior:'smooth'})">Panier (0)</button>
</nav>

<!-- IMAGE HERO -->
<div style="position:relative;">
  <img id="mainImg" src="${mainImg}" alt="${data.product_name}" class="hero-image" />
</div>

<!-- THUMBNAILS -->
${thumbs.length > 1 ? `<div class="thumbs">
  ${thumbs.map((img, i) => `<img src="${img}" class="thumb${i === 0 ? ' active' : ''}" onclick="switchImg(this,'${img}')" />`).join('')}
</div>` : ''}

<!-- INFOS PRODUIT -->
<div class="product-info">
  <div class="badges">
    <span class="badge new">Tendance</span>
    <span class="badge">En stock</span>
    ${data.urgency ? `<span class="badge" style="background:#fee2e2;color:#ef4444;">${data.urgency}</span>` : ''}
  </div>

  <h1 class="product-name">${data.product_name}</h1>
  <p class="product-sub">${data.subtitle || data.headline || ''}</p>

  <div class="price-block">
    <span class="price-main">${data.price ? data.price + '\u20ac' : ''}</span>
    ${data.original_price ? `<span class="price-old">${data.original_price}\u20ac</span><span class="price-badge">-${Math.round((1 - parseFloat(data.price || '0') / parseFloat(data.original_price)) * 100)}%</span>` : ''}
  </div>

  <div class="reviews">
    <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
    <span class="review-count">4.9 &middot; 247 avis v&eacute;rifi&eacute;s</span>
  </div>

  <div class="trust">
    <div class="trust-item"><div class="trust-icon">&#128640;</div><div class="trust-label">Livraison express 24/48h</div></div>
    <div class="trust-item"><div class="trust-icon">&#128737;</div><div class="trust-label">Satisfait ou rembours&eacute;</div></div>
    <div class="trust-item"><div class="trust-icon">&#128274;</div><div class="trust-label">Paiement 100% s&eacute;curis&eacute;</div></div>
  </div>

  <div class="section-label">Quantit&eacute;</div>
  <div class="qty-picker">
    <button class="qty-btn" onclick="changeQty(-1)">&minus;</button>
    <input type="number" class="qty-val" id="qty" value="1" min="1" readonly />
    <button class="qty-btn" onclick="changeQty(1)">+</button>
  </div>
</div>

<!-- CTA STICKY -->
<div class="cta-sticky">
  <button class="cta-btn" onclick="alert('Redirection vers le paiement...')">${data.cta || 'Commander maintenant'} &rarr;</button>
  <p class="cta-sub">&#10003; Livraison gratuite &middot; &#10003; Retour 30j &middot; &#10003; Support 7j/7</p>
</div>

<!-- BENEFICES -->
<div class="section">
  <h2>Pourquoi choisir ce produit ?</h2>
  <ul class="benefits-list">
    ${data.benefits.map((b, i) => `
    <li>
      <div class="benefit-icon">${['&#10024;','&#9889;','&#127919;','&#128142;','&#128640;','&#9989;','&#128293;','&#128170;'][i % 8]}</div>
      <span class="benefit-text">${b}</span>
    </li>`).join('')}
  </ul>
</div>

<!-- AVIS CLIENTS -->
<div class="section">
  <h2>Ce que disent nos clients</h2>
  <div class="review-card">
    <div class="review-header">
      <span class="reviewer">Marie D. &#10003; Achat v&eacute;rifi&eacute;</span>
      <span class="review-date">Il y a 3 jours</span>
    </div>
    <div style="color:#fbbf24;font-size:13px;margin-bottom:6px;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p class="review-text">Vraiment impressionnant ! La qualit&eacute; d&eacute;passe mes attentes. Livraison rapide et emballage soign&eacute;. Je recommande &agrave; 100% !</p>
  </div>
  <div class="review-card">
    <div class="review-header">
      <span class="reviewer">Thomas R. &#10003; Achat v&eacute;rifi&eacute;</span>
      <span class="review-date">Il y a 1 semaine</span>
    </div>
    <div style="color:#fbbf24;font-size:13px;margin-bottom:6px;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p class="review-text">Top produit, exactement comme d&eacute;crit. Service client r&eacute;actif. N&apos;h&eacute;sitez pas !</p>
  </div>
</div>

<!-- FAQ -->
${data.faq && data.faq.length > 0 ? `
<div class="section">
  <h2>Questions fr&eacute;quentes</h2>
  ${data.faq.map((item, i) => `
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(${i})">
      <span>${item.question}</span>
      <span class="faq-icon" id="faq-icon-${i}">+</span>
    </button>
    <div class="faq-a" id="faq-a-${i}">${item.answer}</div>
  </div>`).join('')}
</div>` : ''}

<!-- FOOTER -->
<div class="footer">
  <div class="payment-icons">
    <span class="payment-icon">Visa</span>
    <span class="payment-icon">Mastercard</span>
    <span class="payment-icon">PayPal</span>
    <span class="payment-icon">Apple Pay</span>
  </div>
  <p class="footer-text">&copy; 2026 &middot; Tous droits r&eacute;serv&eacute;s &middot; Paiement 100% s&eacute;curis&eacute; SSL</p>
</div>

<script>
function switchImg(el, src) {
  document.getElementById('mainImg').src = src;
  document.querySelectorAll('.thumb').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
}
function changeQty(delta) {
  var input = document.getElementById('qty');
  var v = parseInt(input.value) + delta;
  if (v >= 1) input.value = v;
}
function toggleFaq(i) {
  var a    = document.getElementById('faq-a-' + i);
  var icon = document.getElementById('faq-icon-' + i);
  a.classList.toggle('open');
  icon.textContent = a.classList.contains('open') ? '\u2212' : '+';
}
</script>
</body>
</html>`
}

// ─── TEMPLATE 7 — SPORTIF ENERGIE ────────────────────────────────────────────

export function templateSportifEnergie(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#0d1a05;--text:#f0fdf4;--accent:#84cc16;--dark:#0a1203;--border:#1e3a0a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.6;}
  .wrap{max-width:720px;margin:0 auto;padding:0 24px;}
  .hero{position:relative;background:linear-gradient(135deg,#0d1a05 0%,#14290a 50%,#0d1a05 100%);padding:80px 24px 100px;overflow:hidden;}
  .hero::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:60px;background:var(--bg);clip-path:polygon(0 100%,100% 0,100% 100%);}
  .badge-pro{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#0d1a05;font-weight:900;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;padding:6px 16px;border-radius:4px;margin-bottom:20px;}
  h1{font-size:clamp(2.2rem,6vw,3.8rem);font-weight:900;line-height:1.05;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:16px;}
  h1 span{color:var(--accent);}
  .subtitle{font-size:1.05rem;opacity:.75;max-width:500px;margin-bottom:32px;}
  .timer{display:flex;gap:12px;margin-bottom:28px;}
  .timer-unit{background:rgba(132,204,22,.12);border:1px solid rgba(132,204,22,.25);border-radius:8px;padding:12px 16px;text-align:center;min-width:64px;}
  .timer-num{font-size:1.6rem;font-weight:900;color:var(--accent);line-height:1;display:block;}
  .timer-label{font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-top:4px;display:block;}
  .cta{display:inline-block;background:var(--accent);color:#0d1a05;font-weight:900;font-size:1rem;text-transform:uppercase;letter-spacing:.06em;padding:18px 40px;border-radius:6px;border:none;cursor:pointer;transition:filter .2s;}
  .cta:hover{filter:brightness(1.1);}
  .urgency{margin-top:14px;font-size:.82rem;opacity:.55;text-transform:uppercase;letter-spacing:.06em;}
  section{padding:64px 0;}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:32px 0;}
  .benefit-card{background:rgba(132,204,22,.06);border:1px solid rgba(132,204,22,.15);border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:8px;}
  .benefit-icon{font-size:1.6rem;}
  .benefit-title{font-weight:800;font-size:.95rem;text-transform:uppercase;letter-spacing:.04em;color:var(--accent);}
  .before-after{display:grid;grid-template-columns:1fr 1fr;gap:2px;border-radius:12px;overflow:hidden;margin:28px 0;}
  .ba-col{padding:32px 24px;}
  .ba-before{background:#1a0505;border:1px solid #3a1010;}
  .ba-after{background:#0a2010;border:1px solid #1a4020;}
  .ba-label{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em;opacity:.6;margin-bottom:12px;}
  .ba-item{display:flex;align-items:center;gap:8px;font-size:.88rem;padding:5px 0;opacity:.8;}
  .proof-row{display:flex;gap:16px;flex-wrap:wrap;margin:24px 0;}
  .proof-chip{background:rgba(132,204,22,.08);border:1px solid rgba(132,204,22,.2);border-radius:999px;padding:8px 18px;font-size:.82rem;font-weight:700;}
  h2{font-size:1.6rem;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:8px;}
  .accent{color:var(--accent);}
  ul{list-style:none;}
  .faq-wrap{margin-top:24px;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;font-size:.95rem;}
  .faq-a{font-size:.88rem;opacity:.65;line-height:1.65;}
  .cta-final{background:linear-gradient(135deg,#14290a,#1e3a0a);border:1px solid var(--accent);border-radius:16px;padding:56px 40px;text-align:center;margin:0 24px 64px;}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center;">
      <div>
        <div class="badge-pro">⚡ PRO EDITION</div>
        <h1>${data.headline.split(' ').slice(0,3).join(' ')} <span>${data.headline.split(' ').slice(3).join(' ')}</span></h1>
        <p class="subtitle">${data.subtitle}</p>
        <div class="timer">
          <div class="timer-unit"><span class="timer-num">02</span><span class="timer-label">Heures</span></div>
          <div class="timer-unit"><span class="timer-num">47</span><span class="timer-label">Minutes</span></div>
          <div class="timer-unit"><span class="timer-num">33</span><span class="timer-label">Secondes</span></div>
        </div>
        ${priceBlock(data)}
        <button class="cta">${data.cta}</button>
        <p class="urgency">${data.urgency}</p>
      </div>
      <div>${heroImage(data, 'max-width:280px;border-radius:12px;filter:drop-shadow(0 0 40px rgba(132,204,22,.3));')}</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:10px;">Avantages</p>
    <h2>POURQUOI LES PROS <span class="accent">CHOISISSENT</span> OURS</h2>
    <div class="grid-2">
      ${data.benefits.slice(0,4).map(b => `<div class="benefit-card"><div class="benefit-icon">⚡</div><div class="benefit-title">${b.split(' ').slice(0,4).join(' ')}</div><p style="font-size:.82rem;opacity:.65;">${b}</p></div>`).join('')}
    </div>
    ${data.benefits.length > 4 ? `<ul>${data.benefits.slice(4).map(b => `<li style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);font-size:.9rem;"><span style="color:var(--accent);font-weight:900;flex-shrink:0;">✓</span>${b}</li>`).join('')}</ul>` : ''}
  </div>
</section>

<section style="padding-top:0;">
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:10px;">Avant / Après</p>
    <h2>LA DIFFERENCE QUE <span class="accent">VOUS RESSENTIREZ</span></h2>
    <div class="before-after">
      <div class="ba-col ba-before">
        <div class="ba-label">Avant</div>
        <div class="ba-item"><span style="color:#ef4444;">✗</span> Performance limitée</div>
        <div class="ba-item"><span style="color:#ef4444;">✗</span> Récupération lente</div>
        <div class="ba-item"><span style="color:#ef4444;">✗</span> Manque d'énergie</div>
        <div class="ba-item"><span style="color:#ef4444;">✗</span> Résultats stagnants</div>
      </div>
      <div class="ba-col ba-after">
        <div class="ba-label">Après</div>
        <div class="ba-item"><span style="color:var(--accent);">✓</span> Performance décuplée</div>
        <div class="ba-item"><span style="color:var(--accent);">✓</span> Récupération express</div>
        <div class="ba-item"><span style="color:var(--accent);">✓</span> Énergie maximale</div>
        <div class="ba-item"><span style="color:var(--accent);">✓</span> Progression visible</div>
      </div>
    </div>
    <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin:40px 0 16px;">Approuvé par</p>
    <div class="proof-row">
      <div class="proof-chip">🏋️ Athlètes élite</div>
      <div class="proof-chip">🏃 Marathoniens</div>
      <div class="proof-chip">🚴 Cyclistes pro</div>
      <div class="proof-chip">⛹️ Basketballeurs</div>
    </div>
  </div>
</section>

<section style="background:#060e02;padding:64px 0;">
  <div class="wrap">
    <h2 style="margin-bottom:28px;">QUESTIONS <span class="accent">FRÉQUENTES</span></h2>
    <div class="faq-wrap">
      ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
    </div>
  </div>
</section>

<div class="cta-final">
  <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:12px;">Offre limitée</p>
  <h2 style="font-size:2rem;margin-bottom:10px;">${data.headline}</h2>
  <p style="opacity:.65;margin-bottom:24px;">${data.urgency}</p>
  ${priceBlock(data)}
  <button class="cta">${data.cta}</button>
</div>

</body>
</html>`
}

// ─── TEMPLATE 8 — NATURAL ORGANIC ─────────────────────────────────────────────

export function templateNaturalOrganic(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fefce8;--text:#1a2e0a;--accent:#166534;--mid:#fef9c3;--border:#bbf7d0;--muted:#4d7c0f;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:Georgia,'Times New Roman',serif;line-height:1.7;}
  .wrap{max-width:700px;margin:0 auto;padding:0 32px;}
  .hero{background:var(--mid);border-bottom:2px solid var(--border);padding:80px 32px;text-align:center;}
  .overline{font-family:system-ui,sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:20px;display:block;}
  h1{font-size:clamp(2rem,5vw,3rem);font-weight:400;line-height:1.2;letter-spacing:-.01em;margin-bottom:18px;color:var(--text);}
  .subtitle{font-size:1.05rem;color:#365314;max-width:480px;margin:0 auto 32px;font-family:system-ui,sans-serif;line-height:1.65;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-family:system-ui,sans-serif;font-weight:700;font-size:.9rem;letter-spacing:.04em;padding:15px 36px;border-radius:6px;border:none;cursor:pointer;transition:filter .2s;}
  .cta:hover{filter:brightness(1.1);}
  .urgency{margin-top:14px;font-size:.82rem;color:var(--muted);font-family:system-ui,sans-serif;}
  section{padding:70px 0;}
  .certif-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:36px 0;}
  .certif{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid var(--border);border-radius:999px;padding:10px 20px;font-family:system-ui,sans-serif;font-size:.82rem;font-weight:700;color:var(--accent);}
  .ingr-list{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:28px 0;}
  .ingr-item{background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px;font-family:system-ui,sans-serif;}
  .ingr-name{font-weight:800;font-size:.88rem;color:var(--accent);margin-bottom:4px;}
  .ingr-desc{font-size:.78rem;opacity:.7;}
  .testimonial{background:#fff;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:0 10px 10px 0;padding:24px;margin:16px 0;}
  .testimonial-text{font-size:.95rem;font-style:italic;margin-bottom:12px;color:#1a2e0a;line-height:1.7;}
  .testimonial-author{font-family:system-ui,sans-serif;font-size:.8rem;font-weight:700;color:var(--accent);}
  ul{list-style:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-family:system-ui,sans-serif;font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.9rem;opacity:.7;}
  .cta-section{background:var(--accent);color:#fff;text-align:center;padding:64px 32px;}
</style>
</head>
<body>

<div class="hero">
  <span class="overline">${data.product_name}</span>
  <h1>${data.headline}</h1>
  <p class="subtitle">${data.subtitle}</p>
  <div class="certif-row">
    <div class="certif">🌿 Bio certifié</div>
    <div class="certif">🐰 Vegan</div>
    <div class="certif">🚫 Sans parabènes</div>
    <div class="certif">♻️ Éco-conçu</div>
  </div>
  ${priceBlock(data)}
  <button class="cta">${data.cta}</button>
  <p class="urgency">${data.urgency}</p>
</div>

${data.images?.[0] ? `<div style="text-align:center;padding:50px 32px;background:#f7fee7;">
  ${heroImage(data, 'max-height:420px;border-radius:12px;box-shadow:0 20px 60px rgba(22,101,52,.12);')}
</div>` : ''}

<section>
  <div class="wrap">
    <span class="overline">Ingrédients naturels</span>
    <h2 style="font-size:1.8rem;font-weight:400;margin-bottom:8px;">La nature au service de votre bien-être</h2>
    <p style="font-family:system-ui,sans-serif;font-size:.9rem;opacity:.7;margin-bottom:28px;">Chaque ingrédient est sélectionné avec soin pour sa pureté et son efficacité.</p>
    <div class="ingr-list">
      ${data.benefits.slice(0,4).map(b => `<div class="ingr-item"><div class="ingr-name">${b.split(' ').slice(0,3).join(' ')}</div><div class="ingr-desc">${b}</div></div>`).join('')}
    </div>
    <ul>${data.benefits.slice(4).map(b => `<li style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-family:system-ui,sans-serif;font-size:.9rem;"><span style="color:var(--accent);font-weight:800;">✓</span>${b}</li>`).join('')}</ul>
  </div>
</section>

<section style="background:#f0fdf4;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <span class="overline">Témoignages</span>
    <h2 style="font-size:1.8rem;font-weight:400;margin-bottom:24px;">Ils ont fait confiance à la nature</h2>
    <div class="testimonial">
      <p class="testimonial-text">"Un produit exceptionnel. Je l'utilise depuis 3 mois et la différence est visible. Je ne pourrai plus m'en passer !"</p>
      <p class="testimonial-author">— Sophie M., 34 ans — Cliente vérifiée ⭐⭐⭐⭐⭐</p>
    </div>
    <div class="testimonial">
      <p class="testimonial-text">"Enfin un produit vraiment naturel, sans compromis sur l'efficacité. La texture, l'odeur, tout est parfait."</p>
      <p class="testimonial-author">— Lucas P., 28 ans — Cliente vérifiée ⭐⭐⭐⭐⭐</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="overline">FAQ</span>
    <h2 style="font-size:1.8rem;font-weight:400;margin-bottom:24px;">Vos questions</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-section">
  <div class="wrap">
    <span class="overline" style="color:rgba(255,255,255,.6);">Commandez maintenant</span>
    <h2 style="font-size:2rem;font-weight:400;margin-bottom:12px;color:#fff;">${data.headline}</h2>
    <p style="opacity:.8;margin-bottom:24px;font-family:system-ui,sans-serif;">${data.urgency}</p>
    ${data.price ? `<p style="font-size:2rem;margin-bottom:24px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:var(--accent);font-family:system-ui,sans-serif;font-weight:800;padding:15px 36px;border-radius:6px;border:none;cursor:pointer;">${data.cta}</button>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE 9 — TECH GADGET ─────────────────────────────────────────────────

export function templateTechGadget(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#040e1a;--text:#e0f2fe;--accent:#0891b2;--card:#071828;--border:#0e3a52;--mono:'Courier New',monospace;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.6;}
  .wrap{max-width:740px;margin:0 auto;padding:0 28px;}
  .hero{background:linear-gradient(135deg,#040e1a 0%,#071e33 60%,#040e1a 100%);padding:88px 28px;border-bottom:1px solid var(--border);}
  .badge-tech{display:inline-block;border:1px solid var(--accent);color:var(--accent);font-family:var(--mono);font-size:.72rem;letter-spacing:.12em;padding:5px 14px;border-radius:3px;margin-bottom:20px;}
  h1{font-size:clamp(2rem,5.5vw,3.4rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;margin-bottom:16px;}
  h1 em{color:var(--accent);font-style:normal;}
  .subtitle{font-size:1rem;opacity:.65;max-width:500px;margin-bottom:32px;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;letter-spacing:.04em;padding:16px 38px;border-radius:6px;border:none;cursor:pointer;transition:filter .2s;}
  .cta:hover{filter:brightness(1.15);}
  .urgency{margin-top:12px;font-size:.8rem;opacity:.5;font-family:var(--mono);}
  section{padding:64px 0;}
  .specs-table{width:100%;border-collapse:collapse;margin:24px 0;font-family:var(--mono);font-size:.85rem;}
  .specs-table th{text-align:left;padding:10px 16px;background:rgba(8,145,178,.1);color:var(--accent);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--border);}
  .specs-table td{padding:12px 16px;border-bottom:1px solid rgba(14,58,82,.6);}
  .specs-table tr:hover td{background:rgba(8,145,178,.04);}
  .specs-table td:first-child{opacity:.6;width:45%;}
  .specs-table td:last-child{color:var(--accent);font-weight:700;}
  .compare-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--border);border-radius:10px;overflow:hidden;margin:28px 0;}
  .compare-col{background:var(--card);padding:24px 16px;}
  .compare-col.featured{background:rgba(8,145,178,.1);border:1px solid var(--accent);}
  .compare-plan{font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.5;margin-bottom:8px;}
  .compare-name{font-size:1rem;font-weight:800;margin-bottom:16px;}
  .compare-name.accent{color:var(--accent);}
  .compare-item{font-size:.8rem;padding:5px 0;border-bottom:1px solid rgba(14,58,82,.4);opacity:.75;}
  .compare-item.yes{color:var(--accent);opacity:1;}
  .video-placeholder{background:var(--card);border:1px solid var(--border);border-radius:12px;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin:28px 0;}
  .play-btn{width:64px;height:64px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;}
  .play-icon{width:0;height:0;border-top:12px solid transparent;border-bottom:12px solid transparent;border-left:20px solid #fff;margin-left:4px;}
  ul{list-style:none;}
  .benefit-mono{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:.88rem;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.88rem;opacity:.6;line-height:1.65;}
  .cta-bar{background:var(--card);border-top:1px solid var(--border);text-align:center;padding:60px 28px;}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;">
      <div>
        <div class="badge-tech">// TECH SERIES 2026</div>
        <h1>${data.headline.split(' ').slice(0,4).join(' ')} <em>${data.headline.split(' ').slice(4).join(' ')}</em></h1>
        <p class="subtitle">${data.subtitle}</p>
        ${priceBlock(data)}
        <button class="cta">${data.cta}</button>
        <p class="urgency">$ ${data.urgency}</p>
      </div>
      <div>${heroImage(data, 'max-width:260px;border-radius:8px;box-shadow:0 0 60px rgba(8,145,178,.25);')}</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-family:var(--mono);font-size:.72rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">// specifications</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Fiche technique</h2>
    <table class="specs-table">
      <thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead>
      <tbody>
        ${data.benefits.slice(0,6).map(b => `<tr><td>${b.split(' ').slice(0,3).join(' ')}</td><td>${b.split(' ').slice(3).join(' ') || '✓ Inclus'}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-family:var(--mono);font-size:.72rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">// comparaison</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Pourquoi nous choisir</h2>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-plan">Concurrent A</div>
        <div class="compare-name">Standard</div>
        <div class="compare-item">Performance basique</div>
        <div class="compare-item">Support email</div>
        <div class="compare-item" style="text-decoration:line-through;opacity:.4;">Garantie 3 ans</div>
        <div class="compare-item" style="text-decoration:line-through;opacity:.4;">Mises à jour</div>
      </div>
      <div class="compare-col featured">
        <div class="compare-plan">Notre produit</div>
        <div class="compare-name accent">${data.product_name}</div>
        <div class="compare-item yes">✓ Haute performance</div>
        <div class="compare-item yes">✓ Support 24/7</div>
        <div class="compare-item yes">✓ Garantie 3 ans</div>
        <div class="compare-item yes">✓ Mises à jour incluses</div>
      </div>
      <div class="compare-col">
        <div class="compare-plan">Concurrent B</div>
        <div class="compare-name">Premium</div>
        <div class="compare-item">Performances correctes</div>
        <div class="compare-item">Support limité</div>
        <div class="compare-item">Garantie 1 an</div>
        <div class="compare-item" style="text-decoration:line-through;opacity:.4;">Mises à jour</div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-family:var(--mono);font-size:.72rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">// demo</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Voir en action</h2>
    <div class="video-placeholder">
      <div class="play-btn"><div class="play-icon"></div></div>
      <p style="font-family:var(--mono);font-size:.8rem;opacity:.4;">[ Démo vidéo — 2m 30s ]</p>
    </div>
    <ul>${data.benefits.map(b => `<li class="benefit-mono"><span style="color:var(--accent);font-family:var(--mono);flex-shrink:0;">→</span>${b}</li>`).join('')}</ul>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-family:var(--mono);font-size:.72rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">// faq</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Questions fréquentes</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-bar">
  <p style="font-family:var(--mono);font-size:.72rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;">// commande</p>
  <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
  <p style="opacity:.5;margin-bottom:24px;">${data.urgency}</p>
  ${priceBlock(data)}
  <button class="cta">${data.cta}</button>
</div>

</body>
</html>`
}

// ─── TEMPLATE 10 — BEAUTY STUDIO ──────────────────────────────────────────────

export function templateBeautyStudio(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fff;--pink:#fdf2f8;--rose:#fbcfe8;--accent:#ec4899;--text:#1a0a14;--border:#f9a8d4;--muted:#9d174d;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.65;}
  .wrap{max-width:700px;margin:0 auto;padding:0 28px;}
  .hero{background:var(--pink);padding:72px 28px;text-align:center;border-bottom:2px solid var(--border);}
  .bestseller{display:inline-block;background:var(--accent);color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:5px 16px;border-radius:999px;margin-bottom:18px;}
  h1{font-size:clamp(2rem,5.5vw,3.2rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;color:var(--text);}
  .subtitle{font-size:1rem;color:#6b2d5e;max-width:460px;margin:0 auto 28px;line-height:1.65;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;padding:16px 36px;border-radius:999px;border:none;cursor:pointer;box-shadow:0 8px 30px rgba(236,72,153,.3);transition:filter .2s;}
  .cta:hover{filter:brightness(1.08);}
  .urgency{margin-top:14px;font-size:.8rem;color:var(--muted);}
  section{padding:64px 0;}
  .ugc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:28px 0;}
  .ugc-item{background:var(--pink);border:1.5px solid var(--border);border-radius:12px;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;font-size:1.8rem;}
  .ba-row{display:grid;grid-template-columns:1fr 1fr;gap:2px;border-radius:14px;overflow:hidden;margin:28px 0;border:2px solid var(--border);}
  .ba-col{padding:28px 24px;text-align:center;}
  .ba-before-bg{background:#fff5f7;}
  .ba-after-bg{background:#fdf2f8;}
  .ba-label{font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
  .stars{color:var(--accent);font-size:1rem;letter-spacing:2px;}
  .review-card{background:var(--pink);border:1px solid var(--border);border-radius:16px;padding:24px;margin:12px 0;position:relative;}
  .review-card::before{content:'"';position:absolute;top:12px;left:20px;font-size:3rem;color:var(--border);line-height:1;font-family:Georgia,serif;}
  .review-text{font-size:.9rem;color:#4a1942;line-height:1.65;padding-top:20px;}
  .review-author{margin-top:12px;font-size:.8rem;font-weight:800;color:var(--accent);}
  .ingr-chips{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0;}
  .ingr-chip{background:#fff;border:1.5px solid var(--border);border-radius:999px;padding:8px 18px;font-size:.82rem;font-weight:700;color:var(--muted);}
  ul{list-style:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;color:var(--text);}
  .faq-a{font-size:.88rem;color:#6b2d5e;line-height:1.65;}
  .cta-section{background:linear-gradient(135deg,#fdf2f8,#fce7f3);border-top:2px solid var(--border);padding:64px 28px;text-align:center;}
</style>
</head>
<body>

<div class="hero">
  <span class="bestseller">⭐ Best Seller</span>
  <h1>${data.headline}</h1>
  <p class="subtitle">${data.subtitle}</p>
  ${priceBlock(data)}
  <button class="cta">${data.cta}</button>
  <p class="urgency">${data.urgency}</p>
</div>

${data.images?.[0] ? `<div style="text-align:center;padding:40px 28px;background:#fffbfe;">
  ${heroImage(data, 'max-height:400px;border-radius:20px;box-shadow:0 20px 60px rgba(236,72,153,.15);')}
</div>` : ''}

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Communauté</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:8px;">Elles l'adorent</h2>
    <p style="font-size:.9rem;color:#6b2d5e;margin-bottom:20px;">Rejoignez des milliers de clientes satisfaites.</p>
    <div class="ugc-grid">
      <div class="ugc-item">💄</div>
      <div class="ugc-item">✨</div>
      <div class="ugc-item">💅</div>
      <div class="ugc-item">🌸</div>
    </div>
  </div>
</section>

<section style="background:var(--pink);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Transformation</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Avant / Après</h2>
    <div class="ba-row">
      <div class="ba-col ba-before-bg">
        <div class="ba-label">Avant</div>
        <div style="font-size:2.5rem;margin-bottom:12px;">😔</div>
        <p style="font-size:.85rem;color:#9d174d;">Teint terne, pores visibles, manque d'éclat</p>
      </div>
      <div class="ba-col ba-after-bg">
        <div class="ba-label">Après</div>
        <div style="font-size:2.5rem;margin-bottom:12px;">✨</div>
        <p style="font-size:.85rem;color:var(--muted);">Peau lumineuse, lissée, rayonnante</p>
      </div>
    </div>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Avis vérifiés</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Ce qu'elles en disent</h2>
    <div class="review-card">
      <div class="stars">★★★★★</div>
      <p class="review-text">Vraiment bluffant ! Ma peau est transformée en 2 semaines. Je ne suis plus jamais sans lui. Le packaging est magnifique et l'odeur divine.</p>
      <p class="review-author">— Camille D., 29 ans ✓ Achat vérifié</p>
    </div>
    <div class="review-card">
      <div class="stars">★★★★★</div>
      <p class="review-text">Je suis exigeante sur les produits beauté, et celui-ci a tout de suite gagné ma confiance. Résultats visibles dès la première application !</p>
      <p class="review-author">— Amélie T., 35 ans ✓ Achat vérifié</p>
    </div>
  </div>
</section>

<section style="background:var(--pink);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Formule</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Ingrédients clés</h2>
    <div class="ingr-chips">
      <div class="ingr-chip">🌹 Huile de rose</div>
      <div class="ingr-chip">💧 Acide hyaluronique</div>
      <div class="ingr-chip">✨ Vitamine C</div>
      <div class="ingr-chip">🌿 Aloe vera</div>
      <div class="ingr-chip">🫚 Rétinol naturel</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Questions fréquentes</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-section">
  <span class="bestseller" style="margin-bottom:16px;display:inline-block;">Offre exclusive</span>
  <h2 style="font-size:2rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
  <p style="color:var(--muted);margin-bottom:24px;">${data.urgency}</p>
  ${priceBlock(data)}
  <button class="cta">${data.cta}</button>
</div>

</body>
</html>`
}

// ─── TEMPLATE 11 — HOME DECO ──────────────────────────────────────────────────

export function templateHomeDeco(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fffbeb;--text:#1c0a00;--accent:#d97706;--card:#fff8e1;--border:#fde68a;--warm:#92400e;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.65;}
  .wrap{max-width:720px;margin:0 auto;padding:0 28px;}
  .hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding:80px 28px;border-bottom:2px solid var(--border);}
  .hero-frame{background:var(--card);border:2px solid var(--border);border-radius:20px;padding:24px;box-shadow:0 16px 50px rgba(217,119,6,.1);}
  .tag{display:inline-block;background:rgba(217,119,6,.12);color:var(--accent);border:1px solid rgba(217,119,6,.25);font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:5px 14px;border-radius:6px;margin-bottom:18px;}
  h1{font-size:clamp(1.8rem,4.5vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;}
  .subtitle{font-size:.95rem;color:var(--warm);max-width:400px;margin-bottom:28px;line-height:1.65;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;padding:15px 34px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 6px 24px rgba(217,119,6,.25);transition:filter .2s;}
  .cta:hover{filter:brightness(1.08);}
  .urgency{margin-top:12px;font-size:.8rem;color:var(--warm);opacity:.8;}
  section{padding:64px 0;}
  .dims-table{width:100%;border-collapse:collapse;margin:24px 0;font-size:.9rem;}
  .dims-table th{text-align:left;padding:10px 16px;background:var(--card);color:var(--accent);font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid var(--border);}
  .dims-table td{padding:12px 16px;border-bottom:1px solid var(--border);}
  .dims-table td:first-child{font-weight:700;opacity:.7;}
  .matieres-row{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0;}
  .matiere-chip{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:.85rem;font-weight:700;color:var(--warm);}
  .spaces-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;}
  .space-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;text-align:center;}
  .space-icon{font-size:2rem;margin-bottom:8px;}
  .space-name{font-weight:800;font-size:.88rem;color:var(--text);}
  ul{list-style:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.88rem;opacity:.65;line-height:1.65;}
  .cta-warm{background:linear-gradient(135deg,#fef3c7,#fde68a);border-top:2px solid var(--border);padding:64px 28px;text-align:center;}
</style>
</head>
<body>

<div class="hero">
  <div>
    <span class="tag">Nouveauté</span>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>
  <div class="hero-frame">${heroImage(data, 'width:100%;border-radius:12px;')}</div>
</div>

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Caractéristiques</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Dimensions & Matières</h2>
    <table class="dims-table">
      <thead><tr><th>Dimension</th><th>Mesure</th></tr></thead>
      <tbody>
        <tr><td>Hauteur</td><td>45 cm</td></tr>
        <tr><td>Largeur</td><td>30 cm</td></tr>
        <tr><td>Profondeur</td><td>20 cm</td></tr>
        <tr><td>Poids</td><td>1,2 kg</td></tr>
      </tbody>
    </table>
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin:32px 0 12px;">Matériaux</p>
    <div class="matieres-row">
      <div class="matiere-chip">🪵 Bois naturel</div>
      <div class="matiere-chip">🧶 Tissu respirant</div>
      <div class="matiere-chip">🔩 Métal brossé</div>
      <div class="matiere-chip">♻️ Matières durables</div>
    </div>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Inspiration</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Parfait dans ces espaces</h2>
    <div class="spaces-grid">
      <div class="space-card"><div class="space-icon">🛋️</div><div class="space-name">Salon</div></div>
      <div class="space-card"><div class="space-icon">🛏️</div><div class="space-name">Chambre</div></div>
      <div class="space-card"><div class="space-icon">💼</div><div class="space-name">Bureau</div></div>
    </div>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Questions fréquentes</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-warm">
  <div class="wrap">
    <span class="tag" style="margin-bottom:16px;display:inline-block;">Offre chaleureuse</span>
    <h2 style="font-size:2rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
    <p style="color:var(--warm);margin-bottom:24px;">${data.urgency}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE 12 — KIDS COLORFUL ──────────────────────────────────────────────

export function templateKidsColorful(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fffde7;--yellow:#fbbf24;--red:#ef4444;--blue:#3b82f6;--text:#1a1a1a;--border:#fde68a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.6;}
  .wrap{max-width:720px;margin:0 auto;padding:0 24px;}
  .hero{background:linear-gradient(135deg,#fef08a,#fde68a,#fed7aa);padding:72px 24px;text-align:center;border-bottom:4px solid var(--yellow);}
  .fun-tag{display:inline-block;background:var(--red);color:#fff;font-size:.78rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:6px 18px;border-radius:999px;margin-bottom:16px;}
  h1{font-size:clamp(2rem,6vw,3.4rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;color:#1a0a00;}
  .subtitle{font-size:1rem;color:#78350f;max-width:480px;margin:0 auto 28px;line-height:1.65;}
  .cta{display:inline-block;background:var(--blue);color:#fff;font-weight:900;font-size:1.05rem;padding:18px 42px;border-radius:999px;border:none;cursor:pointer;box-shadow:0 8px 28px rgba(59,130,246,.35);transition:transform .15s;}
  .cta:hover{transform:scale(1.03);}
  .urgency{margin-top:14px;font-size:.82rem;color:#92400e;}
  section{padding:64px 0;}
  .certif-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:28px 0;}
  .certif-card{background:#fff;border:2px solid var(--yellow);border-radius:16px;padding:22px 16px;text-align:center;}
  .certif-icon{font-size:2rem;margin-bottom:8px;}
  .certif-title{font-weight:800;font-size:.82rem;color:#1a1a1a;margin-bottom:4px;}
  .certif-desc{font-size:.72rem;opacity:.6;}
  .age-row{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0;justify-content:center;}
  .age-chip{background:var(--blue);color:#fff;font-weight:800;font-size:.88rem;padding:10px 22px;border-radius:999px;}
  .parent-review{background:#fff;border:2px solid var(--yellow);border-radius:20px;padding:24px;margin:12px 0;}
  .parent-stars{color:var(--yellow);font-size:1rem;margin-bottom:8px;}
  .parent-text{font-size:.9rem;color:#1a1a1a;line-height:1.65;margin-bottom:10px;}
  .parent-name{font-size:.8rem;font-weight:800;color:var(--blue);}
  ul{list-style:none;}
  .faq-item{border-bottom:2px dashed var(--border);padding:20px 0;}
  .faq-q{font-weight:800;margin-bottom:8px;color:#1a1a1a;}
  .faq-a{font-size:.88rem;color:#78350f;line-height:1.65;}
  .cta-fun{background:linear-gradient(135deg,var(--yellow),#fbbf24);padding:64px 24px;text-align:center;border-top:4px solid var(--red);}
</style>
</head>
<body>

<div class="hero">
  <div class="fun-tag">🎉 Nouveauté enfants</div>
  <h1>${data.headline} 🌈</h1>
  <p class="subtitle">${data.subtitle}</p>
  ${priceBlock(data)}
  <button class="cta">${data.cta} 🎁</button>
  <p class="urgency">${data.urgency}</p>
</div>

${data.images?.[0] ? `<div style="text-align:center;padding:40px 24px;background:#fffde7;">
  ${heroImage(data, 'max-height:380px;border-radius:24px;box-shadow:0 16px 50px rgba(251,191,36,.3);')}
</div>` : ''}

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);margin-bottom:10px;text-align:center;">Sécurité &amp; Certifications</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;text-align:center;">Approuvé pour vos enfants</h2>
    <div class="certif-grid">
      <div class="certif-card"><div class="certif-icon">🛡️</div><div class="certif-title">Norme CE</div><div class="certif-desc">Conforme normes EU</div></div>
      <div class="certif-card"><div class="certif-icon">🌿</div><div class="certif-title">Non toxique</div><div class="certif-desc">Matériaux sûrs</div></div>
      <div class="certif-card"><div class="certif-icon">🔬</div><div class="certif-title">Testé en labo</div><div class="certif-desc">Certifié pédiatre</div></div>
    </div>
    <p style="font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:var(--red);margin:32px 0 16px;text-align:center;">Tranches d'âge</p>
    <div class="age-row">
      <div class="age-chip">👶 0-2 ans</div>
      <div class="age-chip">🧒 3-6 ans</div>
      <div class="age-chip">👧 7-12 ans</div>
    </div>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section style="background:#fff;border-top:3px dashed var(--yellow);border-bottom:3px dashed var(--yellow);">
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;text-align:center;">Les parents adorent 💛</h2>
    <div class="parent-review">
      <div class="parent-stars">★★★★★</div>
      <p class="parent-text">Mes enfants ne veulent plus jouer à rien d'autre ! Qualité remarquable, sécurisé, et le sourire sur leurs visages n'a pas de prix.</p>
      <p class="parent-name">— Nathalie V., maman de 2 enfants ✓ Achat vérifié</p>
    </div>
    <div class="parent-review">
      <div class="parent-stars">★★★★★</div>
      <p class="parent-text">Cadeau parfait ! Solide, coloré, et mon fils de 5 ans en parle encore 3 semaines après. Je recommande vivement.</p>
      <p class="parent-name">— Marc B., papa de 3 enfants ✓ Achat vérifié</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Vos questions</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-fun">
  <div class="wrap">
    <h2 style="font-size:2rem;font-weight:900;margin-bottom:12px;color:#1a0a00;">${data.headline} 🎉</h2>
    <p style="color:#78350f;margin-bottom:24px;">${data.urgency}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE 13 — FOODIE GOURMET ─────────────────────────────────────────────

export function templateFoodieGourmet(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#1a0a00;--text:#fef3c7;--accent:#d97706;--red:#991b1b;--card:#2a1200;--border:#3a1a00;--gold:#f59e0b;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.65;}
  .wrap{max-width:720px;margin:0 auto;padding:0 28px;}
  .hero{background:linear-gradient(160deg,#2a0a00,#1a0a00 40%,#0d0500);padding:88px 28px;border-bottom:1px solid var(--border);}
  .homemade{display:inline-flex;align-items:center;gap:8px;background:rgba(217,119,6,.15);border:1px solid rgba(217,119,6,.3);color:var(--gold);font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:6px 16px;border-radius:4px;margin-bottom:20px;}
  h1{font-size:clamp(2rem,5.5vw,3.4rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;}
  h1 span{color:var(--gold);}
  .subtitle{font-size:1rem;opacity:.7;max-width:500px;margin-bottom:32px;line-height:1.65;}
  .cta{display:inline-block;background:linear-gradient(135deg,var(--red),#b91c1c);color:#fef3c7;font-weight:800;font-size:.95rem;padding:16px 38px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 8px 28px rgba(153,27,27,.4);transition:filter .2s;}
  .cta:hover{filter:brightness(1.1);}
  .urgency{margin-top:14px;font-size:.82rem;opacity:.55;}
  section{padding:64px 0;}
  .nutri-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:28px 0;}
  .nutri-item{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center;}
  .nutri-val{font-size:1.4rem;font-weight:900;color:var(--gold);margin-bottom:4px;}
  .nutri-label{font-size:.7rem;opacity:.55;text-transform:uppercase;letter-spacing:.06em;}
  .ingr-list{margin:24px 0;}
  .ingr-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);font-size:.88rem;}
  .ingr-name{font-weight:700;}
  .ingr-origin{font-size:.75rem;opacity:.5;font-style:italic;}
  .recipe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:28px 0;}
  .recipe-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;text-align:center;}
  .recipe-emoji{font-size:2rem;margin-bottom:8px;}
  .recipe-name{font-weight:800;font-size:.85rem;color:var(--gold);margin-bottom:4px;}
  .recipe-time{font-size:.72rem;opacity:.5;}
  .star-review{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:22px;margin:12px 0;}
  .star-row{color:var(--gold);font-size:.95rem;margin-bottom:8px;}
  .star-text{font-size:.9rem;opacity:.75;line-height:1.65;margin-bottom:10px;}
  .star-author{font-size:.78rem;font-weight:700;color:var(--gold);}
  ul{list-style:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.88rem;opacity:.6;line-height:1.65;}
  .cta-footer{background:linear-gradient(160deg,var(--red),#7f1d1d);padding:64px 28px;text-align:center;}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;">
      <div>
        <div class="homemade">🍽️ Fait maison</div>
        <h1>${data.headline.split(' ').slice(0,3).join(' ')} <span>${data.headline.split(' ').slice(3).join(' ')}</span></h1>
        <p class="subtitle">${data.subtitle}</p>
        ${priceBlock(data)}
        <button class="cta">${data.cta}</button>
        <p class="urgency">${data.urgency}</p>
      </div>
      <div>${heroImage(data, 'max-width:260px;border-radius:12px;box-shadow:0 0 50px rgba(217,119,6,.2);')}</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;">Nutrition</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Valeurs nutritionnelles</h2>
    <div class="nutri-grid">
      <div class="nutri-item"><div class="nutri-val">245</div><div class="nutri-label">Calories</div></div>
      <div class="nutri-item"><div class="nutri-val">12g</div><div class="nutri-label">Protéines</div></div>
      <div class="nutri-item"><div class="nutri-val">8g</div><div class="nutri-label">Lipides</div></div>
      <div class="nutri-item"><div class="nutri-val">30g</div><div class="nutri-label">Glucides</div></div>
    </div>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;">Traçabilité</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Ingrédients &amp; Origines</h2>
    <div class="ingr-list">
      ${data.benefits.slice(0,5).map(b => `<div class="ingr-row"><span class="ingr-name">${b.split(' ').slice(0,4).join(' ')}</span><span class="ingr-origin">Origine France 🇫🇷</span></div>`).join('')}
    </div>
    <ul>${data.benefits.slice(5).map(b => `<li style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:.88rem;"><span style="color:var(--gold);flex-shrink:0;">✓</span>${b}</li>`).join('')}</ul>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;">Inspiration</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Recettes associées</h2>
    <div class="recipe-grid">
      <div class="recipe-card"><div class="recipe-emoji">🥗</div><div class="recipe-name">Salade gourmande</div><div class="recipe-time">15 min</div></div>
      <div class="recipe-card"><div class="recipe-emoji">🍝</div><div class="recipe-name">Pasta maison</div><div class="recipe-time">25 min</div></div>
      <div class="recipe-card"><div class="recipe-emoji">🥘</div><div class="recipe-name">Mijoté du chef</div><div class="recipe-time">45 min</div></div>
    </div>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Avis des gourmets</h2>
    <div class="star-review">
      <div class="star-row">★★★★★</div>
      <p class="star-text">"Un régal à chaque bouchée. La qualité des ingrédients est évidente, et le goût est incomparable. J'en commande chaque semaine !"</p>
      <p class="star-author">— Jean-Pierre M., Chef amateur ✓ Achat vérifié</p>
    </div>
    <div class="star-review">
      <div class="star-row">★★★★★</div>
      <p class="star-text">"Impressionnant. On sent vraiment le soin apporté aux ingrédients. Mes convives ont tous voulu la recette — je leur ai dit que c'était mon secret !"</p>
      <p class="star-author">— Isabelle C. ✓ Achat vérifié</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Questions fréquentes</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-footer">
  <div class="wrap">
    <h2 style="font-size:2rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
    <p style="opacity:.7;margin-bottom:24px;">${data.urgency}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE 14 — TRAVEL NOMAD ───────────────────────────────────────────────

export function templateTravelNomad(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fef3c7;--text:#0c2a4a;--accent:#0284c7;--card:#fff;--border:#bae6fd;--sand:#fde68a;--dark:#0c2a4a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.65;}
  .wrap{max-width:720px;margin:0 auto;padding:0 28px;}
  .hero{background:linear-gradient(160deg,#0284c7 0%,#0369a1 50%,#075985 100%);color:#fff;padding:88px 28px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;bottom:0;left:0;right:0;height:50px;background:var(--bg);clip-path:ellipse(55% 100% at 50% 100%);}
  .badge-nomad{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:6px 16px;border-radius:999px;margin-bottom:20px;}
  h1{font-size:clamp(2rem,5.5vw,3.2rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;}
  .subtitle{font-size:1rem;opacity:.85;max-width:500px;margin-bottom:32px;line-height:1.65;}
  .cta{display:inline-block;background:#fff;color:var(--accent);font-weight:900;font-size:.95rem;padding:16px 36px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.2);transition:filter .2s;}
  .cta:hover{filter:brightness(.96);}
  .urgency{margin-top:14px;font-size:.82rem;opacity:.7;}
  .cta-dark{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;padding:15px 34px;border-radius:8px;border:none;cursor:pointer;transition:filter .2s;}
  .cta-dark:hover{filter:brightness(1.1);}
  section{padding:64px 0;}
  .specs-table{width:100%;border-collapse:collapse;margin:24px 0;}
  .specs-table th{text-align:left;padding:10px 16px;background:var(--sand);color:var(--dark);font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid var(--border);}
  .specs-table td{padding:12px 16px;border-bottom:1px solid var(--border);}
  .specs-table td:first-child{font-weight:700;opacity:.65;width:45%;}
  .specs-table td:last-child{color:var(--accent);font-weight:700;}
  .use-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:28px 0;}
  .use-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;text-align:center;box-shadow:0 4px 16px rgba(2,132,199,.08);}
  .use-icon{font-size:2rem;margin-bottom:8px;}
  .use-name{font-weight:800;font-size:.85rem;color:var(--text);}
  .pack-row{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0;}
  .pack-chip{background:var(--card);border:2px solid var(--accent);border-radius:8px;padding:10px 20px;font-size:.85rem;font-weight:700;color:var(--accent);}
  ul{list-style:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-q{font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.88rem;opacity:.65;line-height:1.65;}
  .cta-adventure{background:linear-gradient(135deg,var(--accent),#075985);color:#fff;padding:64px 28px;text-align:center;}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;">
      <div>
        <div class="badge-nomad">✈ Testé sur 5 continents</div>
        <h1>${data.headline}</h1>
        <p class="subtitle">${data.subtitle}</p>
        ${data.price ? `<p style="font-size:2rem;font-weight:900;margin-bottom:20px;">${data.price}€ ${data.original_price ? `<span style="text-decoration:line-through;font-size:1.1rem;opacity:.55;margin-left:8px;">${data.original_price}€</span>` : ''}</p>` : ''}
        <button class="cta">${data.cta}</button>
        <p class="urgency">${data.urgency}</p>
      </div>
      <div>${heroImage(data, 'max-width:240px;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);')}</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Résistance</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Construit pour l'aventure</h2>
    <table class="specs-table">
      <thead><tr><th>Caractéristique</th><th>Valeur</th></tr></thead>
      <tbody>
        <tr><td>Résistance à l'eau</td><td>IPX7 — immersion 30min</td></tr>
        <tr><td>Résistance aux chocs</td><td>Certifié MIL-STD-810</td></tr>
        <tr><td>Températures</td><td>-20°C à +60°C</td></tr>
        <tr><td>Poids</td><td>Ultraléger — 380g</td></tr>
        <tr><td>Garantie</td><td>3 ans pièces & main d'œuvre</td></tr>
      </tbody>
    </table>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section style="background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Usages</p>
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Partout avec vous</h2>
    <div class="use-grid">
      <div class="use-card"><div class="use-icon">✈</div><div class="use-name">Voyage longue durée</div></div>
      <div class="use-card"><div class="use-icon">⛰</div><div class="use-name">Randonnée & Trek</div></div>
      <div class="use-card"><div class="use-icon">🌊</div><div class="use-name">Sports nautiques</div></div>
    </div>
    <p style="font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin:32px 0 12px;">Pack complet disponible</p>
    <div class="pack-row">
      <div class="pack-chip">Pack Solo</div>
      <div class="pack-chip">Pack Duo</div>
      <div class="pack-chip">Pack Famille</div>
      <div class="pack-chip">Pack Pro</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:24px;">Questions fréquentes</h2>
    ${data.faq.map(item => `<div class="faq-item"><p class="faq-q">${item.question}</p><p class="faq-a">${item.answer}</p></div>`).join('')}
  </div>
</section>

<div class="cta-adventure">
  <div class="wrap">
    <h2 style="font-size:2rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
    <p style="opacity:.75;margin-bottom:24px;">${data.urgency}</p>
    ${data.price ? `<p style="font-size:2rem;font-weight:900;margin-bottom:24px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:var(--accent);font-weight:900;padding:16px 36px;border-radius:8px;border:none;cursor:pointer;font-size:.95rem;">${data.cta}</button>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE — AUTOMOTIVE PRO ────────────────────────────────────────────────

export function templateAutomotivePro(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#09090b;--surface:#18181b;--text:#fafafa;--accent:#dc2626;--zinc:#71717a;--border:#27272a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:760px;margin:0 auto;padding:0 24px;}
  .hero{background:linear-gradient(160deg,#18181b 0%,#09090b 100%);border-bottom:1px solid var(--border);padding:72px 24px 56px;}
  .badge-oem{display:inline-flex;align-items:center;gap:6px;background:rgba(220,38,38,.12);color:var(--accent);border:1px solid rgba(220,38,38,.3);padding:5px 14px;border-radius:4px;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:20px;}
  h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px;}
  .subtitle{font-size:1rem;color:var(--zinc);max-width:520px;margin-bottom:28px;line-height:1.7;}
  .cta{display:inline-block;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;padding:14px 32px;border-radius:6px;text-decoration:none;cursor:pointer;border:none;letter-spacing:.02em;}
  .urgency{margin-top:12px;font-size:.82rem;color:var(--zinc);}
  section{padding:56px 0;}
  table{width:100%;border-collapse:collapse;margin-top:24px;}
  th{text-align:left;padding:10px 16px;background:var(--surface);font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--zinc);border-bottom:1px solid var(--border);}
  td{padding:12px 16px;font-size:.9rem;border-bottom:1px solid var(--border);}
  td:last-child{color:var(--accent);font-weight:700;font-family:monospace;}
  .steps{list-style:none;margin:28px 0;}
  .steps li{display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid var(--border);}
  .step-num{width:28px;height:28px;background:var(--accent);color:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.85rem;flex-shrink:0;margin-top:2px;}
  .warranty{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);padding:20px 24px;border-radius:6px;margin-top:32px;}
  ul{list-style:none;}
  li.benefit{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);}
  li.benefit span:first-child{color:var(--accent);font-weight:900;flex-shrink:0;}
</style>
</head>
<body>
<div class="hero">
  <div class="wrap">
    <div class="badge-oem">⚙ OEM Compatible · Pro Grade</div>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>
</div>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Spécifications techniques</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:4px;">Données constructeur</h2>
    <table>
      <thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead>
      <tbody>
        <tr><td>Matériau</td><td>Aluminium T6 + ABS renforcé</td></tr>
        <tr><td>Résistance</td><td>IP67 — Étanche & anti-poussière</td></tr>
        <tr><td>Compatibilité</td><td>Universal OBD2 / ISO 15765</td></tr>
        <tr><td>Poids</td><td>340g</td></tr>
        <tr><td>Garantie</td><td>24 mois constructeur</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Avantages produit</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:20px;">Pourquoi choisir ${data.product_name}</h2>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Installation</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;">Guide d'installation</h2>
    <ol class="steps">
      <li><div class="step-num">1</div><div><strong>Préparation</strong><br/><span style="color:var(--zinc);font-size:.9rem;">Coupez le contact. Localisez le port OBD2 sous le tableau de bord.</span></div></li>
      <li><div class="step-num">2</div><div><strong>Connexion</strong><br/><span style="color:var(--zinc);font-size:.9rem;">Branchez le module. Le voyant vert s'allume en 3 secondes.</span></div></li>
      <li><div class="step-num">3</div><div><strong>Configuration</strong><br/><span style="color:var(--zinc);font-size:.9rem;">Téléchargez l'app. Scan automatique du véhicule en 60 secondes.</span></div></li>
      <li><div class="step-num">4</div><div><strong>Utilisation</strong><br/><span style="color:var(--zinc);font-size:.9rem;">Profitez de toutes les fonctionnalités. Mise à jour OTA incluse.</span></div></li>
    </ol>
    <div class="warranty">
      <p style="font-weight:800;margin-bottom:6px;">🛡 Garantie 24 mois — SAV français</p>
      <p style="font-size:.88rem;color:var(--zinc);">Retour gratuit sous 30 jours. Remplacement immédiat en cas de défaut.</p>
    </div>
  </div>
</section>

<section style="background:var(--surface);border-top:1px solid var(--border);">
  <div class="wrap">
    <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;">Questions fréquentes</h2>
    ${faq(data)}
  </div>
</section>

<div style="background:var(--accent);padding:56px 24px;text-align:center;">
  <div class="wrap">
    <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
    <p style="opacity:.85;margin-bottom:24px;">${data.urgency}</p>
    ${data.price ? `<p style="font-size:2rem;font-weight:900;margin-bottom:20px;">${data.price}€</p>` : ''}
    <button style="background:#fff;color:var(--accent);font-weight:900;padding:14px 32px;border-radius:6px;border:none;cursor:pointer;font-size:.95rem;">${data.cta}</button>
  </div>
</div>
</body>
</html>`
}

// ─── TEMPLATE — GAMING ZONE ───────────────────────────────────────────────────

export function templateGamingZone(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#000000;--surface:#0a0010;--text:#ffffff;--violet:#a855f7;--cyan:#06b6d4;--border:rgba(168,85,247,0.2);}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:760px;margin:0 auto;padding:0 24px;}
  .hero{background:linear-gradient(160deg,#0a0010 0%,#000 100%);padding:72px 24px 56px;position:relative;overflow:hidden;border-bottom:1px solid var(--border);}
  .hero::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(168,85,247,0.2) 0%,transparent 70%);pointer-events:none;}
  .badge-gg{display:inline-flex;align-items:center;gap:6px;background:rgba(168,85,247,.15);color:var(--violet);border:1px solid rgba(168,85,247,.4);padding:5px 14px;border-radius:4px;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:20px;}
  h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:900;line-height:1.05;letter-spacing:-.02em;margin-bottom:14px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .subtitle{font-size:1rem;color:rgba(255,255,255,.6);max-width:520px;margin-bottom:28px;}
  .cta{display:inline-block;background:linear-gradient(135deg,var(--violet),var(--cyan));color:#fff;font-weight:900;font-size:.95rem;padding:14px 32px;border-radius:6px;text-decoration:none;cursor:pointer;border:none;box-shadow:0 0 24px rgba(168,85,247,.4);}
  .urgency{margin-top:12px;font-size:.82rem;color:rgba(255,255,255,.4);}
  section{padding:56px 0;}
  .specs-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px;}
  .spec-card{background:rgba(168,85,247,.08);border:1px solid var(--border);border-radius:8px;padding:16px 20px;}
  .spec-label{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:4px;}
  .spec-val{font-size:1.4rem;font-weight:900;font-family:monospace;color:#fff;}
  .rgb-bar{height:6px;border-radius:999px;background:linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#06b6d4,#a855f7,#ec4899);margin:24px 0;box-shadow:0 0 12px rgba(168,85,247,.5);}
  .streamer{display:flex;align-items:flex-start;gap:12px;padding:16px 0;border-bottom:1px solid var(--border);}
  .avatar{width:36px;height:36px;background:linear-gradient(135deg,var(--violet),var(--cyan));border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.85rem;}
  ul{list-style:none;}
  li.benefit{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);}
  li.benefit span:first-child{color:var(--cyan);font-weight:900;flex-shrink:0;}
</style>
</head>
<body>
<div class="hero">
  <div class="wrap">
    <div class="badge-gg">🎮 Gaming Grade · RGB Ready</div>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>
</div>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin-bottom:12px;">Performance</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:4px;">Specs qui font la différence</h2>
    <div class="specs-grid">
      <div class="spec-card"><div class="spec-label">Latence</div><div class="spec-val">0.5ms</div></div>
      <div class="spec-card"><div class="spec-label">DPI Max</div><div class="spec-val">25 600</div></div>
      <div class="spec-card"><div class="spec-label">Polling Rate</div><div class="spec-val">1000Hz</div></div>
      <div class="spec-card"><div class="spec-label">Boutons</div><div class="spec-val">8 + scroll</div></div>
    </div>
    <div class="rgb-bar"></div>
    <p style="font-size:.8rem;color:rgba(255,255,255,.4);text-align:center;">RGB 16.8M couleurs · Sync compatible ASUS AURA / MSI Mystic</p>
  </div>
</section>

<section style="background:rgba(168,85,247,.05);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--violet);margin-bottom:12px;">Avantages</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:20px;">Pourquoi les pros choisissent ${data.product_name}</h2>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin-bottom:12px;">Communauté</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:20px;">Approuvé par les streamers</h2>
    ${['XGameR_FR', 'ProPlay99', 'NightBot'].map((name, i) => `
    <div class="streamer">
      <div class="avatar">${name[0]}</div>
      <div>
        <p style="font-weight:700;font-size:.9rem;">${name} <span style="font-size:.75rem;color:var(--violet);margin-left:6px;">✓ Vérifié</span></p>
        <p style="font-size:.88rem;color:rgba(255,255,255,.6);margin-top:4px;">"${['Latence incroyable, mes kills ont explosé depuis que j\'utilise ça.', 'Le meilleur rapport qualité/prix du marché gamer. Je recommande à tous mes viewers.', 'RGB parfaitement synchro avec mon setup. Aucun bug depuis 6 mois.'][i]}"</p>
        <p style="font-size:.75rem;color:rgba(255,255,255,.3);margin-top:4px;">${['★★★★★', '★★★★★', '★★★★☆'][i]}</p>
      </div>
    </div>`).join('')}
  </div>
</section>

<section style="background:rgba(168,85,247,.05);border-top:1px solid var(--border);">
  <div class="wrap">
    <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;">FAQ Gamer</h2>
    ${faq(data)}
  </div>
</section>

<div style="background:linear-gradient(135deg,#1a0030,#000814);border-top:1px solid var(--border);padding:56px 24px;text-align:center;">
  <div class="wrap">
    <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${data.headline}</h2>
    <p style="color:rgba(255,255,255,.5);margin-bottom:24px;">${data.urgency}</p>
    ${data.price ? `<p style="font-size:2rem;font-weight:900;margin-bottom:20px;">${data.price}€</p>` : ''}
    <button style="background:linear-gradient(135deg,#a855f7,#06b6d4);color:#fff;font-weight:900;padding:14px 32px;border-radius:6px;border:none;cursor:pointer;font-size:.95rem;box-shadow:0 0 24px rgba(168,85,247,.4);">${data.cta}</button>
  </div>
</div>
</body>
</html>`
}

// ─── TEMPLATE — PET LOVE ──────────────────────────────────────────────────────

export function templatePetLove(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#fdf4ff;--surface:#fff;--text:#1a0a1f;--pink:#ec4899;--lavender:#a78bfa;--border:#f3e8ff;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;}
  .wrap{max-width:700px;margin:0 auto;padding:0 24px;}
  .hero{background:linear-gradient(160deg,#fdf4ff 0%,#f5f3ff 100%);padding:72px 24px 56px;text-align:center;border-bottom:1px solid var(--border);}
  .paw{font-size:3rem;margin-bottom:16px;display:block;}
  .badge-veto{display:inline-flex;align-items:center;gap:6px;background:rgba(167,139,250,.15);color:var(--lavender);border:1px solid rgba(167,139,250,.3);padding:5px 14px;border-radius:999px;font-size:.78rem;font-weight:700;margin-bottom:20px;}
  h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.15;letter-spacing:-.02em;margin-bottom:14px;}
  .subtitle{font-size:1rem;color:#6b6b8a;max-width:500px;margin:0 auto 28px;}
  .cta{display:inline-block;background:linear-gradient(135deg,var(--pink),var(--lavender));color:#fff;font-weight:800;font-size:.95rem;padding:14px 32px;border-radius:999px;text-decoration:none;cursor:pointer;border:none;box-shadow:0 4px 20px rgba(236,72,153,.25);}
  .urgency{margin-top:12px;font-size:.82rem;color:#9ca3af;}
  section{padding:56px 0;}
  .cert-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;}
  .cert{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);border-radius:999px;padding:8px 16px;font-size:.85rem;font-weight:600;}
  .cert-icon{width:24px;height:24px;background:linear-gradient(135deg,var(--pink),var(--lavender));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#fff;font-weight:900;}
  .size-table{width:100%;border-collapse:collapse;margin-top:20px;}
  .size-table th{background:var(--border);padding:10px 14px;text-align:left;font-size:.8rem;font-weight:700;}
  .size-table td{padding:10px 14px;border-bottom:1px solid var(--border);font-size:.88rem;}
  .review{background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:12px;}
  .stars{color:var(--pink);letter-spacing:2px;margin-bottom:8px;}
  ul{list-style:none;}
  li.benefit{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);}
  li.benefit span:first-child{color:var(--pink);font-weight:900;flex-shrink:0;}
</style>
</head>
<body>
<div class="hero">
  <div class="wrap">
    <span class="paw">🐾</span>
    <div class="badge-veto">✓ Approuvé par des vétérinaires</div>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subtitle}</p>
    ${priceBlock(data)}
    <button class="cta">${data.cta}</button>
    <p class="urgency">${data.urgency}</p>
  </div>
</div>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);margin-bottom:12px;">Certifications</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;">Sûr pour votre animal</h2>
    <div class="cert-row">
      <div class="cert"><div class="cert-icon">✓</div>Non toxique</div>
      <div class="cert"><div class="cert-icon">✓</div>Certifié vétérinaire</div>
      <div class="cert"><div class="cert-icon">✓</div>Sans BPA</div>
      <div class="cert"><div class="cert-icon">✓</div>Hypoallergénique</div>
    </div>
  </div>
</section>

<section style="background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--lavender);margin-bottom:12px;">Guide des tailles</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;">Trouvez la taille parfaite</h2>
    <table class="size-table">
      <thead><tr><th>Race / Gabarit</th><th>Poids</th><th>Taille recommandée</th></tr></thead>
      <tbody>
        <tr><td>Chihuahua, Yorkshire</td><td>&lt; 5 kg</td><td>XS</td></tr>
        <tr><td>Beagle, Cocker</td><td>5–15 kg</td><td>S / M</td></tr>
        <tr><td>Labrador, Border Collie</td><td>15–30 kg</td><td>L</td></tr>
        <tr><td>Berger Allemand, Husky</td><td>&gt; 30 kg</td><td>XL</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section>
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);margin-bottom:12px;">Avantages</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:20px;">Pourquoi votre animal va adorer</h2>
    <ul>${benefits(data)}</ul>
  </div>
</section>

<section style="background:#fff;border-top:1px solid var(--border);">
  <div class="wrap">
    <p style="font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--lavender);margin-bottom:12px;">Avis propriétaires</p>
    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:20px;">Ils ont adoré, leurs animaux aussi ❤️</h2>
    ${[
      { name: 'Sophie & Nala', animal: 'Golden Retriever 3 ans', text: 'Ma chienne refuse de sortir sans ! Qualité irréprochable, coutures solides.', stars: '★★★★★' },
      { name: 'Marc & Rex', animal: 'Berger Allemand 5 ans', text: 'Enfin un produit à la hauteur. Vétérinaire approuvé, mon chien est en pleine forme.', stars: '★★★★★' },
      { name: 'Léa & Mochi', animal: 'Chihuahua 2 ans', text: 'Taille XS parfaite pour Mochi. Livraison rapide, emballage soigné.', stars: '★★★★☆' },
    ].map(r => `
    <div class="review">
      <div class="stars">${r.stars}</div>
      <p style="font-weight:700;margin-bottom:4px;">${r.name}</p>
      <p style="font-size:.8rem;color:var(--lavender);margin-bottom:8px;">🐾 ${r.animal}</p>
      <p style="font-size:.9rem;color:#4b5563;">"${r.text}"</p>
    </div>`).join('')}
  </div>
</section>

<section style="background:var(--bg);border-top:1px solid var(--border);">
  <div class="wrap">
    <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:20px;">Vos questions</h2>
    ${faq(data)}
  </div>
</section>

<div style="background:linear-gradient(135deg,#fdf4ff,#f5f3ff);border-top:1px solid var(--border);padding:56px 24px;text-align:center;">
  <div class="wrap">
    <span style="font-size:2rem;display:block;margin-bottom:16px;">🐾❤️</span>
    <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.headline}</h2>
    <p style="color:#9ca3af;margin-bottom:24px;">${data.urgency}</p>
    ${data.price ? `<p style="font-size:2rem;font-weight:900;margin-bottom:20px;color:var(--pink);">${data.price}€</p>` : ''}
    <button style="background:linear-gradient(135deg,#ec4899,#a78bfa);color:#fff;font-weight:900;padding:14px 32px;border-radius:999px;border:none;cursor:pointer;font-size:.95rem;box-shadow:0 4px 20px rgba(236,72,153,.3);">${data.cta}</button>
  </div>
</div>
</body>
</html>`
}

// ─── TEMPLATE 18 — PREMIUM GLASS ──────────────────────────────────────────────

export function templatePremiumGlass(data: LandingPageData): string {
  const benefitCards = data.benefits
    .map((b, i) => {
      const icons = ['✦', '◈', '⬡', '✧', '◉', '⬟']
      return `
      <div class="glass-card benefit-card reveal delay-${(i % 4) + 1}">
        <span class="benefit-icon">${icons[i % icons.length]}</span>
        <p>${b}</p>
      </div>`
    })
    .join('')

  const testimonials = [
    { name: 'Amélie R.', stars: '★★★★★', text: `Incroyable qualité. Le ${data.product_name} a dépassé toutes mes attentes — je ne m'en sépare plus.` },
    { name: 'Thomas M.', stars: '★★★★★', text: 'Service impeccable, livraison rapide et un produit vraiment premium. Je recommande à 100%.' },
  ]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{
    --bg:#0f0f2e;
    --bg2:#0c0c26;
    --accent:#7c3aed;
    --accent-light:#a78bfa;
    --gold:#c9993a;
    --gold-light:#f0c060;
    --text:#f1f0ff;
    --muted:rgba(241,240,255,0.55);
    --glass-bg:rgba(255,255,255,0.07);
    --glass-border:rgba(255,255,255,0.12);
    --sep:rgba(255,255,255,0.08);
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    background:linear-gradient(135deg,#1e1b4b 0%,#0f0f2e 40%,#0c0c26 100%);
    color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    line-height:1.6;
    min-height:100vh;
  }
  .wrap{max-width:800px;margin:0 auto;padding:0 24px;}

  /* Glass card */
  .glass-card{
    background:var(--glass-bg);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid var(--glass-border);
    border-radius:20px;
    padding:28px;
  }

  /* Separators */
  .sep{border:none;border-top:1px solid var(--sep);margin:0;}
  section{padding:64px 0;}

  /* Hero */
  .hero{padding:80px 0 64px;}
  .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;}
  @media(max-width:640px){
    .hero-grid{grid-template-columns:1fr;}
    .hero-image-col{order:-1;}
  }
  .product-badge{
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(124,58,237,.2);border:1px solid rgba(124,58,237,.4);
    color:var(--accent-light);border-radius:999px;
    padding:6px 16px;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
    margin-bottom:20px;
  }
  h1{font-size:clamp(1.8rem,4.5vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:16px;}
  .subtitle{font-size:1rem;color:var(--muted);margin-bottom:28px;line-height:1.7;}

  /* Price */
  .price-block{margin:20px 0 24px;}
  .price-original{text-decoration:line-through;color:var(--muted);font-size:1rem;margin-right:10px;}
  .price-current{font-size:2.4rem;font-weight:900;color:var(--gold-light);}
  .price-badge{
    display:inline-block;
    background:linear-gradient(135deg,var(--gold),#a0722a);
    color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
    padding:4px 12px;border-radius:999px;margin-left:10px;vertical-align:middle;
  }

  /* CTA shimmer */
  @keyframes shimmer{from{background-position:-200% 0;}to{background-position:200% 0;}}
  .btn-shimmer{
    display:inline-block;width:100%;
    background:linear-gradient(90deg,var(--accent) 0%,var(--accent-light) 40%,var(--accent) 60%,#5b21b6 100%);
    background-size:200% 100%;
    animation:shimmer 2.6s linear infinite;
    color:#fff;font-weight:800;font-size:1rem;
    padding:16px 36px;border-radius:14px;
    text-decoration:none;cursor:pointer;border:none;
    text-align:center;
  }
  .btn-shimmer:hover{animation-play-state:paused;filter:brightness(1.1);}
  .urgency{margin-top:12px;font-size:.82rem;color:var(--muted);text-align:center;}

  /* Hero image glow */
  .hero-image-wrap{position:relative;text-align:center;}
  .hero-image-wrap::after{
    content:'';
    position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);
    width:70%;height:40px;
    background:radial-gradient(ellipse at center,rgba(124,58,237,.6) 0%,transparent 70%);
    filter:blur(12px);
    z-index:0;
  }
  .hero-image-wrap img{position:relative;z-index:1;max-width:100%;border-radius:16px;box-shadow:0 20px 60px rgba(124,58,237,.3);}
  .hero-image-placeholder{
    width:100%;height:280px;
    background:var(--glass-bg);border:1px solid var(--glass-border);
    border-radius:16px;display:flex;align-items:center;justify-content:center;
    font-size:4rem;
  }

  /* Benefits */
  .benefits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;}
  .benefit-card{display:flex;flex-direction:column;gap:10px;}
  .benefit-icon{font-size:1.4rem;color:var(--accent-light);}
  .benefit-card p{font-size:.88rem;color:var(--muted);line-height:1.5;}

  /* Testimonials */
  .reviews-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  @media(max-width:540px){.reviews-grid{grid-template-columns:1fr;}}
  .review-card{display:flex;flex-direction:column;gap:8px;}
  .stars{color:var(--gold-light);font-size:1rem;letter-spacing:2px;}
  .review-name{font-weight:700;font-size:.9rem;}
  .review-text{font-size:.85rem;color:var(--muted);line-height:1.6;font-style:italic;}

  /* FAQ accordion */
  .faq-item{border-bottom:1px solid var(--sep);}
  .faq-item:last-child{border-bottom:none;}
  .faq-q{
    width:100%;background:transparent;border:none;color:var(--text);
    font-size:.95rem;font-weight:700;padding:18px 0;text-align:left;
    cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px;
  }
  .faq-q .arrow{transition:transform .3s;font-size:.8rem;color:var(--accent-light);}
  .faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;}
  .faq-a.open{max-height:200px;}
  .faq-a p{padding:0 0 16px;font-size:.88rem;color:var(--muted);line-height:1.65;}

  /* Animate on scroll */
  .reveal{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1);}
  .reveal.visible{opacity:1;transform:translateY(0);}
  .delay-1{transition-delay:.1s}.delay-2{transition-delay:.2s}.delay-3{transition-delay:.3s}.delay-4{transition-delay:.4s}

  /* Section labels */
  .section-label{font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-light);margin-bottom:12px;}
  .section-title{font-size:clamp(1.4rem,3vw,2rem);font-weight:900;margin-bottom:28px;}
</style>
</head>
<body>

<!-- HERO -->
<section class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <span class="product-badge">✦ ${data.product_name}</span>
        <h1>${data.headline}</h1>
        <p class="subtitle">${data.subtitle}</p>

        ${data.price ? `<div class="price-block">
          ${data.original_price ? `<span class="price-original">${data.original_price}€</span>` : ''}
          <span class="price-current">${data.price}€</span>
          <span class="price-badge">Édition limitée</span>
        </div>` : ''}

        <button class="btn-shimmer">${data.cta}</button>
        <p class="urgency">${data.urgency}</p>
      </div>
      <div class="hero-image-col">
        <div class="hero-image-wrap">
          ${data.images?.[0]
            ? `<img src="${data.images[0]}" alt="${data.product_name}"/>`
            : `<div class="hero-image-placeholder">✦</div>`}
        </div>
      </div>
    </div>
  </div>
</section>

<hr class="sep"/>

<!-- BÉNÉFICES -->
<section>
  <div class="wrap">
    <p class="section-label reveal">Ce que vous gagnez</p>
    <h2 class="section-title reveal delay-1">Conçu pour l'excellence</h2>
    <div class="benefits-grid">
      ${benefitCards}
    </div>
  </div>
</section>

<hr class="sep"/>

<!-- TESTIMONIALS -->
<section>
  <div class="wrap">
    <p class="section-label reveal">Ils l'ont adopté</p>
    <h2 class="section-title reveal delay-1">Ce qu'en disent nos clients</h2>
    <div class="reviews-grid">
      ${testimonials.map((r, i) => `
      <div class="glass-card review-card reveal delay-${i + 1}">
        <div class="stars">${r.stars}</div>
        <p class="review-name">${r.name}</p>
        <p class="review-text">${r.text}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<hr class="sep"/>

<!-- FAQ -->
<section>
  <div class="wrap">
    <p class="section-label reveal">Vos questions</p>
    <h2 class="section-title reveal delay-1">Questions fréquentes</h2>
    <div class="glass-card reveal delay-2">
      ${data.faq.map((item, i) => `
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(${i})" aria-expanded="false" id="faq-btn-${i}">
          ${item.question}
          <span class="arrow" id="faq-arrow-${i}">▼</span>
        </button>
        <div class="faq-a" id="faq-a-${i}">
          <p>${item.answer}</p>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<hr class="sep"/>

<!-- CTA FINAL -->
<section style="text-align:center;padding:80px 0;">
  <div class="wrap">
    <div class="glass-card reveal" style="padding:56px 40px;">
      <p class="section-label" style="justify-content:center;display:block;">Dernière chance</p>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:900;margin-bottom:12px;">${data.headline}</h2>
      <p style="color:var(--muted);margin-bottom:24px;">${data.urgency}</p>
      ${data.price ? `<div class="price-block" style="margin-bottom:28px;">
        ${data.original_price ? `<span class="price-original">${data.original_price}€</span>` : ''}
        <span class="price-current">${data.price}€</span>
        <span class="price-badge">Édition limitée</span>
      </div>` : ''}
      <button class="btn-shimmer" style="max-width:320px;margin:0 auto;">${data.cta}</button>
    </div>
  </div>
</section>

<script>
function toggleFaq(i){
  var a=document.getElementById('faq-a-'+i);
  var arr=document.getElementById('faq-arrow-'+i);
  var btn=document.getElementById('faq-btn-'+i);
  var open=a.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(function(el){el.classList.remove('open');});
  document.querySelectorAll('.faq-q .arrow').forEach(function(el){el.style.transform='';});
  if(!open){
    a.classList.add('open');
    arr.style.transform='rotate(180deg)';
    btn.setAttribute('aria-expanded','true');
  }
}
(function(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
})();
</script>
</body>
</html>`
}

// ─── EXPORT REGISTRY ──────────────────────────────────────────────────────────

export const TEMPLATES = [
  { id: 'shein-pro',        name: 'Shein Pro',        category: 'ecommerce' as const, fn: templateSheinPro        },
  { id: 'minimal-dark',     name: 'Minimal Dark',     category: 'dark'      as const, fn: templateMinimalDark     },
  { id: 'clean-white',      name: 'Clean White',      category: 'light'     as const, fn: templateCleanWhite      },
  { id: 'bold-sales',       name: 'Bold Sales',       category: 'bold'      as const, fn: templateBoldSales       },
  { id: 'luxury',           name: 'Luxury',           category: 'luxury'    as const, fn: templateLuxury          },
  { id: 'mobile-first',     name: 'Mobile First',     category: 'mobile'    as const, fn: templateMobileFirst     },
  { id: 'sportif-energie',  name: 'Sportif Énergie',  category: 'sport'     as const, fn: templateSportifEnergie  },
  { id: 'natural-organic',  name: 'Natural Organic',  category: 'bio'       as const, fn: templateNaturalOrganic  },
  { id: 'tech-gadget',      name: 'Tech Gadget',      category: 'tech'      as const, fn: templateTechGadget      },
  { id: 'beauty-studio',    name: 'Beauty Studio',    category: 'beauty'    as const, fn: templateBeautyStudio    },
  { id: 'home-deco',        name: 'Home Deco',        category: 'home'      as const, fn: templateHomeDeco        },
  { id: 'kids-colorful',    name: 'Kids Colorful',    category: 'kids'      as const, fn: templateKidsColorful    },
  { id: 'foodie-gourmet',   name: 'Foodie Gourmet',   category: 'food'      as const, fn: templateFoodieGourmet   },
  { id: 'travel-nomad',     name: 'Travel Nomad',     category: 'travel'    as const, fn: templateTravelNomad     },
  { id: 'automotive-pro',   name: 'Automotive Pro',   category: 'auto'      as const, fn: templateAutomotivePro   },
  { id: 'gaming-zone',      name: 'Gaming Zone',      category: 'gaming'    as const, fn: templateGamingZone      },
  { id: 'pet-love',         name: 'Pet Love',         category: 'pets'      as const, fn: templatePetLove         },
  { id: 'premium-glass',   name: 'Premium Glass',   category: 'luxury'    as const, fn: templatePremiumGlass   },
]

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    case 'shein-pro':       return templateSheinPro(data)
    case 'premium-glass':   return templatePremiumGlass(data)
    case 'minimal-dark':    return templateMinimalDark(data)
    case 'clean-white':     return templateCleanWhite(data)
    case 'bold-sales':      return templateBoldSales(data)
    case 'bold-orange':     return templateBoldSales(data)
    case 'luxury':          return templateLuxury(data)
    case 'luxe-noir':       return templateLuxury(data)
    case 'mobile-first':    return templateMobileFirst(data)
    case 'sportif-energie': return templateSportifEnergie(data)
    case 'natural-organic': return templateNaturalOrganic(data)
    case 'tech-gadget':     return templateTechGadget(data)
    case 'beauty-studio':   return templateBeautyStudio(data)
    case 'home-deco':       return templateHomeDeco(data)
    case 'kids-colorful':   return templateKidsColorful(data)
    case 'foodie-gourmet':  return templateFoodieGourmet(data)
    case 'travel-nomad':    return templateTravelNomad(data)
    case 'automotive-pro':  return templateAutomotivePro(data)
    case 'gaming-zone':     return templateGamingZone(data)
    case 'pet-love':        return templatePetLove(data)
    default:                return templateCleanWhite(data)
  }
}
