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

// ─── EXPORT REGISTRY ──────────────────────────────────────────────────────────

export const TEMPLATES = [
  { id: 'shein-pro',    name: 'Shein Pro',    category: 'ecommerce' as const, fn: templateSheinPro    },
  { id: 'minimal-dark', name: 'Minimal Dark', category: 'dark'      as const, fn: templateMinimalDark },
  { id: 'clean-white',  name: 'Clean White',  category: 'light'     as const, fn: templateCleanWhite  },
  { id: 'bold-sales',   name: 'Bold Sales',   category: 'bold'      as const, fn: templateBoldSales   },
  { id: 'luxury',       name: 'Luxury',       category: 'luxury'    as const, fn: templateLuxury      },
  { id: 'mobile-first', name: 'Mobile First', category: 'mobile'    as const, fn: templateMobileFirst },
]

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    case 'shein-pro':    return templateSheinPro(data)
    case 'premium-glass': return templateSheinPro(data)
    case 'minimal-dark': return templateMinimalDark(data)
    case 'clean-white':  return templateCleanWhite(data)
    case 'bold-sales':   return templateBoldSales(data)
    case 'bold-orange':  return templateBoldSales(data)
    case 'luxury':       return templateLuxury(data)
    case 'mobile-first': return templateMobileFirst(data)
    default:             return templateCleanWhite(data)
  }
}
