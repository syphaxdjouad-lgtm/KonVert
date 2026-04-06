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

// ─── TEMPLATE 7 — SAAS HERO ───────────────────────────────────────────────────

export function templateSaasHero(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#0f172a;--card:#1e293b;--text:#f8fafc;--accent:#6366f1;--muted:#94a3b8;--border:#334155;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;line-height:1.6;overflow-x:hidden;}

  /* MESH BACKGROUND */
  .mesh{position:fixed;inset:0;z-index:0;background:
    radial-gradient(ellipse 80% 50% at 20% -20%,rgba(99,102,241,.18) 0%,transparent 70%),
    radial-gradient(ellipse 60% 40% at 80% 110%,rgba(139,92,246,.14) 0%,transparent 70%),
    #0f172a;}

  .wrap{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:0 32px;}

  /* NAV */
  nav{position:sticky;top:0;z-index:100;backdrop-filter:blur(16px);background:rgba(15,23,42,.8);border-bottom:1px solid var(--border);padding:0 32px;}
  .nav-inner{max-width:1100px;margin:0 auto;height:64px;display:flex;align-items:center;justify-content:space-between;}
  .nav-logo{font-weight:900;font-size:1.1rem;letter-spacing:-.02em;background:linear-gradient(135deg,#a5b4fc,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .nav-cta{background:var(--accent);color:#fff;font-weight:700;font-size:.82rem;padding:8px 20px;border-radius:8px;border:none;cursor:pointer;transition:opacity .2s;}
  .nav-cta:hover{opacity:.85;}

  /* HERO */
  .hero{padding:100px 0 80px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
  @media(max-width:768px){.hero{grid-template-columns:1fr;gap:48px;padding:64px 0 48px;}}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:24px;}
  .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:#6366f1;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  h1{font-size:clamp(2.2rem,4.5vw,3.4rem);font-weight:900;line-height:1.08;letter-spacing:-.03em;margin-bottom:20px;}
  h1 span{background:linear-gradient(135deg,#a5b4fc,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .hero-sub{font-size:1.05rem;color:var(--muted);max-width:440px;margin-bottom:36px;line-height:1.7;}
  .hero-ctas{display:flex;gap:14px;flex-wrap:wrap;}
  .btn-primary{background:var(--accent);color:#fff;font-weight:800;font-size:.9rem;padding:14px 28px;border-radius:10px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;}
  .btn-primary:hover{background:#4f46e5;transform:translateY(-1px);}
  .btn-ghost{background:transparent;color:var(--muted);font-weight:600;font-size:.9rem;padding:14px 24px;border-radius:10px;border:1px solid var(--border);cursor:pointer;transition:all .2s;}
  .btn-ghost:hover{border-color:#6366f1;color:#a5b4fc;}

  /* DASHBOARD MOCKUP */
  .mockup-wrap{position:relative;}
  .mockup-browser{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.5),0 0 0 1px rgba(99,102,241,.1);}
  .mockup-bar{height:40px;background:#0f172a;display:flex;align-items:center;gap:6px;padding:0 16px;border-bottom:1px solid var(--border);}
  .dot{width:10px;height:10px;border-radius:50%;}
  .mockup-content{padding:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
  .mock-card{background:#0f172a;border-radius:10px;padding:14px;border:1px solid var(--border);}
  .mock-stat{font-size:1.5rem;font-weight:900;color:#a5b4fc;margin-bottom:4px;}
  .mock-label{font-size:.7rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
  .mock-bar-wrap{margin-top:16px;}
  .mock-bar{height:6px;border-radius:3px;background:var(--border);overflow:hidden;margin-bottom:8px;}
  .mock-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6);}
  .glow{position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(99,102,241,.25),transparent 70%);pointer-events:none;}

  /* FEATURES */
  .section{padding:80px 0;}
  .section-tag{font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;}
  .section-title{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:900;letter-spacing:-.02em;margin-bottom:12px;}
  .section-sub{color:var(--muted);font-size:1rem;max-width:520px;margin:0 auto 56px;}
  .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  @media(max-width:768px){.features-grid{grid-template-columns:1fr;}}
  .feature-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;transition:border-color .2s;}
  .feature-card:hover{border-color:rgba(99,102,241,.4);}
  .feature-icon{width:44px;height:44px;border-radius:10px;background:rgba(99,102,241,.12);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;}
  .feature-title{font-size:1rem;font-weight:800;margin-bottom:8px;}
  .feature-desc{font-size:.88rem;color:var(--muted);line-height:1.6;}

  /* PRICING */
  .pricing-card{max-width:420px;margin:0 auto;background:var(--card);border:1px solid rgba(99,102,241,.4);border-radius:20px;padding:36px;text-align:center;}
  .pricing-plan{font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;}
  .pricing-price{font-size:3rem;font-weight:900;letter-spacing:-.03em;margin-bottom:4px;}
  .pricing-period{color:var(--muted);font-size:.9rem;margin-bottom:28px;}
  .pricing-features{list-style:none;text-align:left;margin-bottom:28px;space-y:10px;}
  .pricing-features li{display:flex;align-items:center;gap:10px;font-size:.9rem;padding:8px 0;border-bottom:1px solid var(--border);}
  .pricing-features li:last-child{border:none;}
  .check-icon{width:18px;height:18px;border-radius:50%;background:rgba(99,102,241,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;}

  /* TESTIMONIALS */
  .testimonials{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  @media(max-width:768px){.testimonials{grid-template-columns:1fr;}}
  .testi-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;}
  .testi-stars{color:#fbbf24;font-size:12px;letter-spacing:2px;margin-bottom:12px;}
  .testi-text{font-size:.88rem;color:var(--muted);line-height:1.6;margin-bottom:16px;}
  .testi-author{display:flex;align-items:center;gap:10px;}
  .testi-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;flex-shrink:0;}
  .testi-name{font-size:.85rem;font-weight:700;}
  .testi-role{font-size:.75rem;color:var(--muted);}

  /* CTA FINAL */
  .cta-section{text-align:center;padding:80px 0;}
  .cta-box{background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1));border:1px solid rgba(99,102,241,.3);border-radius:24px;padding:64px 48px;}
</style>
</head>
<body>
<div class="mesh"></div>

<nav>
  <div class="nav-inner">
    <div class="nav-logo">${data.product_name}</div>
    <button class="nav-cta">Commencer gratuitement</button>
  </div>
</nav>

<div class="wrap">
  <!-- HERO -->
  <div class="hero">
    <div>
      <div class="hero-badge"><span class="hero-badge-dot"></span>Nouveau · IA-Native</div>
      <h1>${data.headline || 'La plateforme qui <span>multiplie vos conversions</span>'}</h1>
      <p class="hero-sub">${data.subtitle || 'Créez des landing pages haute performance avec l\'IA. Lancez en 30 secondes, convertissez 5x plus.'}</p>
      <div class="hero-ctas">
        <button class="btn-primary">${data.cta || 'Démarrer gratuitement'} →</button>
        <button class="btn-ghost">Voir la démo</button>
      </div>
    </div>
    <div class="mockup-wrap">
      <div class="glow"></div>
      <div class="mockup-browser">
        <div class="mockup-bar">
          <div class="dot" style="background:#ef4444"></div>
          <div class="dot" style="background:#fbbf24"></div>
          <div class="dot" style="background:#22c55e"></div>
        </div>
        <div class="mockup-content">
          <div class="mock-card"><div class="mock-stat">18.4%</div><div class="mock-label">Conv. Rate</div></div>
          <div class="mock-card"><div class="mock-stat">2.4k</div><div class="mock-label">Visiteurs</div></div>
          <div class="mock-card"><div class="mock-stat">+34%</div><div class="mock-label">Revenue</div></div>
        </div>
        <div style="padding:0 20px 20px;">
          <div class="mock-bar-wrap">
            <div style="font-size:.7rem;color:#64748b;margin-bottom:6px;font-weight:600;">Performance IA</div>
            <div class="mock-bar"><div class="mock-fill" style="width:84%"></div></div>
            <div class="mock-bar"><div class="mock-fill" style="width:67%;background:linear-gradient(90deg,#8b5cf6,#ec4899)"></div></div>
            <div class="mock-bar"><div class="mock-fill" style="width:92%"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="section" style="text-align:center;">
    <div class="section-tag">Fonctionnalités</div>
    <h2 class="section-title">Tout ce dont vous avez besoin</h2>
    <p class="section-sub">Une suite complète pensée pour les équipes qui veulent convertir plus, plus vite.</p>
    <div class="features-grid">
      ${data.benefits.slice(0, 6).map((b, i) => `
      <div class="feature-card">
        <div class="feature-icon">${['⚡','🎯','📊','🔒','🚀','💡'][i % 6]}</div>
        <div class="feature-title">${b.split(' ').slice(0, 4).join(' ')}</div>
        <div class="feature-desc">${b}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- PRICING -->
  <div class="section" style="text-align:center;">
    <div class="section-tag">Tarifs</div>
    <h2 class="section-title">Simple et transparent</h2>
    <p class="section-sub">Un seul plan, toutes les fonctionnalités incluses.</p>
    <div class="pricing-card">
      <div class="pricing-plan">Plan Pro</div>
      <div class="pricing-price">${data.price ? data.price + '€' : '49€'}</div>
      <div class="pricing-period">/mois · Annulation à tout moment</div>
      <ul class="pricing-features">
        ${data.benefits.slice(0, 5).map(b => `<li><div class="check-icon">✓</div>${b}</li>`).join('')}
      </ul>
      <button class="btn-primary" style="width:100%;justify-content:center;">${data.cta || 'Commencer maintenant'}</button>
    </div>
  </div>

  <!-- TESTIMONIALS -->
  <div class="section" style="text-align:center;">
    <div class="section-tag">Témoignages</div>
    <h2 class="section-title">Ils nous font confiance</h2>
    <p class="section-sub" style="margin-bottom:40px;">+2 400 équipes utilisent notre plateforme chaque jour.</p>
    <div class="testimonials">
      <div class="testi-card">
        <div class="testi-stars">★★★★★</div>
        <p class="testi-text">"Les résultats ont dépassé toutes nos attentes. Notre taux de conversion a bondi de 34% dès le premier mois."</p>
        <div class="testi-author">
          <div class="testi-avatar" style="background:rgba(99,102,241,.2);color:#a5b4fc;">ML</div>
          <div><div class="testi-name">Marie L.</div><div class="testi-role">CMO · Startup Paris</div></div>
        </div>
      </div>
      <div class="testi-card">
        <div class="testi-stars">★★★★★</div>
        <p class="testi-text">"Interface magnifique, setup en 10 minutes, ROI visible en 48h. Je recommande à tous mes clients."</p>
        <div class="testi-author">
          <div class="testi-avatar" style="background:rgba(139,92,246,.2);color:#c4b5fd;">TR</div>
          <div><div class="testi-name">Thomas R.</div><div class="testi-role">Fondateur · Agence digitale</div></div>
        </div>
      </div>
      <div class="testi-card">
        <div class="testi-stars">★★★★★</div>
        <p class="testi-text">"L'IA génère des pages en 30 secondes qui convertissent mieux que tout ce que j'ai construit en 3 ans."</p>
        <div class="testi-author">
          <div class="testi-avatar" style="background:rgba(236,72,153,.2);color:#f9a8d4;">SB</div>
          <div><div class="testi-name">Sofia B.</div><div class="testi-role">E-commerce Manager</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA FINAL -->
  <div class="cta-section">
    <div class="cta-box">
      <h2 style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:900;letter-spacing:-.02em;margin-bottom:16px;">${data.headline || 'Prêt à convertir 5x plus ?'}</h2>
      <p style="color:var(--muted);margin-bottom:32px;">${data.urgency || 'Rejoignez 2 400+ équipes. Sans carte bancaire requise.'}</p>
      <button class="btn-primary" style="font-size:1rem;padding:16px 40px;">${data.cta || 'Démarrer gratuitement'} →</button>
    </div>
  </div>
</div>
</body>
</html>`
}

// ─── TEMPLATE 8 — FLASH SALE ──────────────────────────────────────────────────

export function templateFlashSale(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#000;--text:#fff;--red:#ef4444;--yellow:#fbbf24;--border:#1a1a1a;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;line-height:1.5;overflow-x:hidden;}

  /* URGENCY BAR */
  .urgency-bar{background:var(--red);color:#fff;text-align:center;padding:10px 20px;font-size:.82rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;}

  /* HERO */
  .hero{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 24px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 50%,rgba(239,68,68,.08),transparent);}
  .promo-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.5);color:var(--red);font-size:.75rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;padding:8px 18px;border-radius:4px;margin-bottom:28px;position:relative;z-index:1;}
  .promo-dot{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blink 1s infinite;}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
  h1{font-size:clamp(2.5rem,7vw,5rem);font-weight:900;line-height:1.0;letter-spacing:-.03em;margin-bottom:16px;position:relative;z-index:1;}
  h1 span{color:var(--yellow);}
  .hero-sub{font-size:1.1rem;color:#a1a1aa;max-width:520px;margin:0 auto 32px;position:relative;z-index:1;}

  /* PRIX */
  .price-block{display:flex;align-items:center;gap:16px;justify-content:center;margin-bottom:32px;position:relative;z-index:1;}
  .price-old{font-size:1.5rem;color:#52525b;text-decoration:line-through;font-weight:700;}
  .price-new{font-size:3.5rem;font-weight:900;color:var(--yellow);letter-spacing:-.03em;}
  .price-off{background:var(--red);color:#fff;font-size:.9rem;font-weight:900;padding:6px 14px;border-radius:6px;}

  /* CTA */
  .cta-btn{display:inline-block;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-weight:900;font-size:1.1rem;padding:20px 52px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 0 40px rgba(239,68,68,.35);transition:all .2s;position:relative;z-index:1;}
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(239,68,68,.5);}
  .cta-sub{margin-top:14px;font-size:.8rem;color:#52525b;position:relative;z-index:1;}

  /* COUNTDOWN */
  .countdown-section{background:#0a0a0a;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:32px 24px;text-align:center;}
  .countdown-label{font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--red);margin-bottom:20px;}
  .countdown-grid{display:flex;gap:12px;justify-content:center;}
  .count-box{min-width:80px;background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:16px 12px;text-align:center;}
  .count-num{font-size:2.5rem;font-weight:900;letter-spacing:-.02em;color:var(--yellow);line-height:1;font-variant-numeric:tabular-nums;}
  .count-sep{font-size:2rem;font-weight:900;color:#3f3f46;align-self:center;padding-bottom:8px;}
  .count-unit{font-size:.65rem;color:#52525b;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-top:4px;}

  /* STOCK */
  .stock-section{max-width:480px;margin:0 auto;padding:32px 24px;text-align:center;}
  .stock-label{font-size:.8rem;color:#a1a1aa;margin-bottom:10px;}
  .stock-bar{height:8px;background:#1a1a1a;border-radius:4px;overflow:hidden;margin-bottom:8px;}
  .stock-fill{height:100%;background:linear-gradient(90deg,#ef4444,#f97316);border-radius:4px;width:23%;position:relative;}
  .stock-fill::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:12px;height:12px;background:#ef4444;border-radius:50%;box-shadow:0 0 8px #ef4444;}
  .stock-text{font-size:.85rem;color:var(--red);font-weight:800;}

  /* PRODUCT IMAGE ZONE */
  .product-zone{max-width:600px;margin:0 auto;padding:0 24px 48px;}
  ${data.images?.[0] ? '' : '.product-placeholder{background:linear-gradient(135deg,#0f0f0f,#1a1a1a);border:1px solid #1f1f1f;border-radius:20px;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;font-size:4rem;}'}

  /* BENEFITS */
  .benefits-section{max-width:680px;margin:0 auto;padding:48px 24px;}
  .benefits-title{font-size:1.5rem;font-weight:900;margin-bottom:28px;text-align:center;}
  .benefit-row{display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
  .benefit-row:last-child{border:none;}
  .benefit-icon{width:32px;height:32px;border-radius:8px;background:rgba(239,68,68,.1);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .benefit-text{font-size:.92rem;color:#a1a1aa;line-height:1.5;}

  /* FAQ */
  .faq-section{max-width:600px;margin:0 auto;padding:0 24px 64px;}
  .faq-title{font-size:1.3rem;font-weight:900;margin-bottom:24px;}
  .faq-item{border-bottom:1px solid var(--border);padding:16px 0;}
  .faq-q{font-size:.92rem;font-weight:700;margin-bottom:8px;}
  .faq-a{font-size:.85rem;color:#71717a;line-height:1.6;}

  /* FINAL CTA */
  .final-cta{background:#0a0a0a;border-top:1px solid var(--border);padding:60px 24px;text-align:center;}
</style>
</head>
<body>

<div class="urgency-bar">VENTE FLASH — Offre limitée · Jusqu'à -70% aujourd'hui seulement</div>

<div class="hero">
  <div class="promo-badge"><span class="promo-dot"></span>Promo éclair</div>
  <h1>${data.headline || 'L\'offre qui <span>change tout</span>'}</h1>
  <p class="hero-sub">${data.subtitle || 'Profitez de cette remise exceptionnelle avant la fin du compte à rebours.'}</p>
  <div class="price-block">
    ${data.original_price ? `<span class="price-old">${data.original_price}€</span>` : ''}
    <span class="price-new">${data.price || '29'}€</span>
    ${data.original_price ? `<span class="price-off">-${Math.round((1 - parseFloat(data.price || '29') / parseFloat(data.original_price)) * 100)}%</span>` : '<span class="price-off">-60%</span>'}
  </div>
  <button class="cta-btn" onclick="document.querySelector('.final-cta').scrollIntoView({behavior:'smooth'})">${data.cta || 'Je profite de l\'offre'} →</button>
  <p class="cta-sub">Livraison express incluse · Satisfait ou remboursé 30 jours</p>
</div>

<!-- COUNTDOWN -->
<div class="countdown-section">
  <div class="countdown-label">L'offre expire dans</div>
  <div class="countdown-grid">
    <div class="count-box"><div class="count-num" id="cd-h">71</div><div class="count-unit">Heures</div></div>
    <div class="count-sep">:</div>
    <div class="count-box"><div class="count-num" id="cd-m">59</div><div class="count-unit">Minutes</div></div>
    <div class="count-sep">:</div>
    <div class="count-box"><div class="count-num" id="cd-s">47</div><div class="count-unit">Secondes</div></div>
  </div>
</div>

<!-- STOCK -->
<div class="stock-section">
  <div class="stock-label">Stock disponible</div>
  <div class="stock-bar"><div class="stock-fill"></div></div>
  <div class="stock-text">Attention — seulement 23 unités restantes !</div>
</div>

<!-- PRODUCT -->
<div class="product-zone">
  ${data.images?.[0]
    ? `<img src="${data.images[0]}" alt="${data.product_name}" style="width:100%;border-radius:20px;border:1px solid #1f1f1f;" />`
    : `<div class="product-placeholder">🛍️</div>`}
</div>

<!-- BENEFITS -->
<div class="benefits-section">
  <h2 class="benefits-title">Pourquoi c'est la meilleure offre du moment</h2>
  ${data.benefits.map((b, i) => `
  <div class="benefit-row">
    <div class="benefit-icon">${['🔥','⚡','✓','🎯','💎','🚀'][i % 6]}</div>
    <span class="benefit-text">${b}</span>
  </div>`).join('')}
</div>

<!-- FAQ -->
<div class="faq-section">
  <h2 class="faq-title">Questions fréquentes</h2>
  ${data.faq.map(item => `
  <div class="faq-item">
    <div class="faq-q">${item.question}</div>
    <div class="faq-a">${item.answer}</div>
  </div>`).join('')}
</div>

<!-- FINAL CTA -->
<div class="final-cta">
  <div style="font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--red);margin-bottom:12px;">Ne ratez pas cette offre</div>
  <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:12px;">${data.urgency || 'Plus que quelques heures — agissez maintenant'}</h2>
  <div class="price-block" style="margin-bottom:24px;">
    ${data.original_price ? `<span class="price-old" style="font-size:1.2rem;">${data.original_price}€</span>` : ''}
    <span class="price-new" style="font-size:2.5rem;">${data.price || '29'}€</span>
  </div>
  <button class="cta-btn">${data.cta || 'Commander maintenant'} →</button>
  <p style="margin-top:16px;font-size:.78rem;color:#52525b;">Paiement sécurisé SSL · Livraison sous 24/48h · SAV 7j/7</p>
</div>

<script>
(function() {
  var end = Date.now() + 72 * 3600 * 1000;
  function tick() {
    var diff = Math.max(0, end - Date.now());
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
    if (diff > 0) setTimeout(tick, 1000);
  }
  tick();
})();
</script>
</body>
</html>`
}

// ─── TEMPLATE 9 — LEAD MAGNET ─────────────────────────────────────────────────

export function templateLeadMagnet(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg:#f8fafc;--white:#fff;--text:#0f172a;--accent:#10b981;--accent-light:#d1fae5;--muted:#64748b;--border:#e2e8f0;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;line-height:1.6;}

  /* HEADER */
  header{background:var(--white);border-bottom:1px solid var(--border);padding:16px 24px;text-align:center;}
  .logo{font-weight:900;font-size:1.1rem;letter-spacing:-.02em;color:var(--text);}
  .logo span{color:var(--accent);}

  /* HERO */
  .hero{max-width:680px;margin:0 auto;padding:72px 24px 56px;text-align:center;}
  .hero-tag{display:inline-block;background:var(--accent-light);color:#065f46;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:6px 16px;border-radius:20px;margin-bottom:24px;}
  h1{font-size:clamp(1.9rem,4vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:16px;}
  h1 em{color:var(--accent);font-style:normal;}
  .hero-sub{font-size:1rem;color:var(--muted);max-width:480px;margin:0 auto 40px;line-height:1.7;}

  /* PDF MOCKUP */
  .pdf-mockup{position:relative;max-width:320px;margin:0 auto 48px;}
  .pdf-shadow{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);width:80%;height:20px;background:rgba(16,185,129,.15);border-radius:50%;filter:blur(12px);}
  .pdf-cover{background:linear-gradient(135deg,#10b981,#059669);border-radius:16px;padding:32px 28px;color:#fff;position:relative;overflow:hidden;}
  .pdf-cover::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(255,255,255,.08);border-radius:50%;}
  .pdf-cover::after{content:'';position:absolute;bottom:-20px;left:-20px;width:80px;height:80px;background:rgba(255,255,255,.06);border-radius:50%;}
  .pdf-icon{font-size:2rem;margin-bottom:12px;}
  .pdf-title{font-size:1.1rem;font-weight:900;margin-bottom:6px;position:relative;z-index:1;}
  .pdf-sub{font-size:.8rem;opacity:.85;position:relative;z-index:1;}
  .pdf-pages{position:absolute;bottom:16px;right:16px;background:rgba(255,255,255,.2);border-radius:6px;padding:4px 10px;font-size:.7rem;font-weight:800;}

  /* FORM */
  .form-section{max-width:480px;margin:0 auto;}
  .form-box{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,.06);}
  .form-title{font-size:1.1rem;font-weight:800;margin-bottom:6px;text-align:center;}
  .form-sub{font-size:.85rem;color:var(--muted);text-align:center;margin-bottom:24px;}
  .social-proof-inline{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:24px;}
  .avatars{display:flex;}
  .avatar{width:28px;height:28px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.6rem;margin-left:-8px;}
  .avatar:first-child{margin-left:0;}
  .sp-text{font-size:.78rem;color:var(--muted);}
  .sp-text strong{color:var(--accent);}
  label{display:block;font-size:.82rem;font-weight:700;margin-bottom:6px;color:var(--text);}
  input[type=text],input[type=email]{width:100%;padding:12px 16px;border:1.5px solid var(--border);border-radius:10px;font-size:.92rem;color:var(--text);outline:none;transition:border-color .2s;background:#fff;}
  input[type=text]:focus,input[type=email]:focus{border-color:var(--accent);}
  .form-group{margin-bottom:16px;}
  .submit-btn{width:100%;background:var(--accent);color:#fff;font-weight:800;font-size:1rem;padding:16px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;}
  .submit-btn:hover{background:#059669;transform:translateY(-1px);}
  .form-privacy{font-size:.72rem;color:#94a3b8;text-align:center;margin-top:12px;}

  /* BENEFITS */
  .benefits-section{max-width:680px;margin:0 auto;padding:64px 24px;}
  .benefits-title{font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;text-align:center;}
  .benefits-h2{font-size:1.5rem;font-weight:900;text-align:center;margin-bottom:40px;}
  .benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  @media(max-width:640px){.benefits-grid{grid-template-columns:1fr;}}
  .benefit-card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:24px;text-align:center;}
  .benefit-icon-wrap{width:48px;height:48px;border-radius:12px;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 14px;}
  .benefit-card h3{font-size:.95rem;font-weight:800;margin-bottom:6px;}
  .benefit-card p{font-size:.83rem;color:var(--muted);line-height:1.6;}

  /* SOCIAL PROOF */
  .social-section{max-width:680px;margin:0 auto;padding:0 24px 64px;text-align:center;}
  .social-count{font-size:2.5rem;font-weight:900;color:var(--accent);margin-bottom:4px;}
  .social-label{color:var(--muted);font-size:.9rem;}
  .ratings{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:12px;}
  .stars-big{color:#fbbf24;font-size:1.2rem;letter-spacing:2px;}
</style>
</head>
<body>

<header>
  <div class="logo">${data.product_name.split(' ').slice(0,-1).join(' ')} <span>${data.product_name.split(' ').slice(-1)}</span></div>
</header>

<div class="hero">
  <div class="hero-tag">Gratuit · Téléchargement instantané</div>
  <h1>${data.headline || 'Le guide <em>complet</em> pour transformer vos visiteurs en clients'}</h1>
  <p class="hero-sub">${data.subtitle || 'Découvrez les 27 stratégies utilisées par les top e-commerçants pour multiplier leurs conversions.'}</p>

  <!-- PDF MOCKUP -->
  <div class="pdf-mockup">
    <div class="pdf-cover">
      <div class="pdf-icon">📘</div>
      <div class="pdf-title">${data.product_name}</div>
      <div class="pdf-sub">Le guide complet • Édition 2026</div>
      <div class="pdf-pages">48 pages</div>
    </div>
    <div class="pdf-shadow"></div>
  </div>

  <!-- FORM -->
  <div class="form-section">
    <div class="form-box">
      <div class="form-title">Accès gratuit immédiat</div>
      <div class="form-sub">Rejoignez 12 840 professionnels qui l'ont déjà téléchargé</div>
      <div class="social-proof-inline">
        <div class="avatars">
          <div class="avatar" style="background:#6366f1;color:#fff;">ML</div>
          <div class="avatar" style="background:#10b981;color:#fff;">TR</div>
          <div class="avatar" style="background:#f59e0b;color:#fff;">SB</div>
          <div class="avatar" style="background:#ef4444;color:#fff;">JD</div>
        </div>
        <div class="sp-text"><strong>+12 840</strong> téléchargements ce mois</div>
      </div>
      <div class="form-group">
        <label>Prénom</label>
        <input type="text" placeholder="Marie" />
      </div>
      <div class="form-group">
        <label>Email professionnel</label>
        <input type="email" placeholder="marie@monemailing.com" />
      </div>
      <button class="submit-btn">
        <span>📥</span>
        ${data.cta || 'Télécharger le guide gratuitement'}
      </button>
      <div class="form-privacy">🔒 Vos données sont protégées. Zéro spam, promis.</div>
    </div>
  </div>
</div>

<!-- BENEFITS -->
<div class="benefits-section">
  <div class="benefits-title">Ce que vous allez découvrir</div>
  <h2 class="benefits-h2">3 raisons de le lire maintenant</h2>
  <div class="benefits-grid">
    ${data.benefits.slice(0, 3).map((b, i) => `
    <div class="benefit-card">
      <div class="benefit-icon-wrap">${['🎯','⚡','📊'][i]}</div>
      <h3>${b.split(' ').slice(0, 5).join(' ')}</h3>
      <p>${b}</p>
    </div>`).join('')}
  </div>
</div>

<!-- SOCIAL PROOF -->
<div class="social-section">
  <div class="social-count">12 840+</div>
  <div class="social-label">professionnels ont déjà téléchargé ce guide</div>
  <div class="ratings">
    <span class="stars-big">★★★★★</span>
    <span style="font-size:.9rem;color:#64748b;">4.9 / 5 · 847 avis</span>
  </div>
</div>

</body>
</html>`
}

// ─── TEMPLATE 10 — APP DOWNLOAD ───────────────────────────────────────────────

export function templateAppDownload(data: LandingPageData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<style>
  :root{--bg-from:#1a1a2e;--bg-to:#16213e;--text:#f1f5f9;--cyan:#00d4ff;--violet:#7b2ff7;--muted:#94a3b8;--border:rgba(255,255,255,.08);}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:linear-gradient(160deg,var(--bg-from) 0%,var(--bg-to) 100%);min-height:100vh;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;line-height:1.6;overflow-x:hidden;}

  /* NAV */
  nav{padding:20px 32px;display:flex;align-items:center;justify-content:space-between;max-width:1100px;margin:0 auto;}
  .nav-logo{font-weight:900;font-size:1.15rem;letter-spacing:-.02em;background:linear-gradient(135deg,var(--cyan),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .nav-links{display:flex;gap:8px;}
  .nav-link{color:var(--muted);font-size:.85rem;font-weight:600;padding:8px 16px;border-radius:8px;border:none;background:transparent;cursor:pointer;transition:color .2s;}
  .nav-link:hover{color:#fff;}
  .nav-cta{background:rgba(123,47,247,.2);border:1px solid rgba(123,47,247,.4);color:#c4b5fd;font-size:.85rem;font-weight:700;padding:8px 20px;border-radius:8px;cursor:pointer;transition:all .2s;}
  .nav-cta:hover{background:rgba(123,47,247,.35);}

  /* HERO */
  .hero{max-width:1100px;margin:0 auto;padding:60px 32px 80px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
  @media(max-width:768px){.hero{grid-template-columns:1fr;gap:48px;padding:40px 24px 60px;}}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);color:var(--cyan);font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:24px;}
  h1{font-size:clamp(2rem,4vw,3rem);font-weight:900;line-height:1.1;letter-spacing:-.03em;margin-bottom:18px;}
  h1 .grad{background:linear-gradient(135deg,var(--cyan),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .hero-sub{font-size:1rem;color:var(--muted);max-width:420px;margin-bottom:36px;line-height:1.7;}

  /* STORE BADGES */
  .store-badges{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;}
  .store-badge{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:12px;padding:12px 20px;cursor:pointer;transition:all .2s;}
  .store-badge:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);}
  .store-icon{font-size:1.5rem;}
  .store-text-top{font-size:.6rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
  .store-text-bot{font-size:.88rem;font-weight:800;color:#fff;}

  /* RATING INLINE */
  .rating-inline{display:flex;align-items:center;gap:10px;}
  .stars-sm{color:#fbbf24;font-size:.9rem;letter-spacing:1px;}
  .rating-text{font-size:.82rem;color:var(--muted);}

  /* PHONE MOCKUP */
  .phone-wrap{display:flex;justify-content:center;position:relative;}
  .phone-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:260px;background:radial-gradient(circle,rgba(123,47,247,.35),transparent 70%);pointer-events:none;}
  .phone{width:220px;background:#0d0d1a;border-radius:36px;border:2px solid rgba(255,255,255,.12);box-shadow:0 40px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.1);overflow:hidden;position:relative;}
  .phone-notch{height:24px;background:#000;display:flex;align-items:center;justify-content:center;}
  .notch-inner{width:80px;height:16px;background:#111;border-radius:0 0 14px 14px;}
  .phone-screen{padding:16px;min-height:380px;background:linear-gradient(160deg,#1a1a2e,#16213e);}
  .phone-app-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
  .phone-app-name{font-size:.75rem;font-weight:800;background:linear-gradient(135deg,#00d4ff,#7b2ff7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .phone-notif{width:18px;height:18px;border-radius:50%;background:rgba(0,212,255,.15);border:1px solid rgba(0,212,255,.3);display:flex;align-items:center;justify-content:center;font-size:8px;}
  .phone-stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:12px;margin-bottom:10px;}
  .phone-stat-num{font-size:1.2rem;font-weight:900;background:linear-gradient(135deg,#00d4ff,#7b2ff7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .phone-stat-label{font-size:.6rem;color:var(--muted);font-weight:600;text-transform:uppercase;}
  .phone-chart{height:60px;display:flex;align-items:flex-end;gap:4px;padding-top:8px;}
  .bar{flex:1;border-radius:3px 3px 0 0;background:linear-gradient(180deg,rgba(0,212,255,.5),rgba(123,47,247,.3));}
  .phone-bottom{height:16px;background:#000;display:flex;align-items:center;justify-content:center;}
  .home-bar{width:80px;height:4px;background:rgba(255,255,255,.3);border-radius:2px;}

  /* FEATURES */
  .features-section{max-width:1100px;margin:0 auto;padding:64px 32px;}
  .section-center{text-align:center;margin-bottom:48px;}
  .section-tag{font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:10px;}
  .section-title{font-size:clamp(1.5rem,2.5vw,2rem);font-weight:900;letter-spacing:-.02em;}
  .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  @media(max-width:640px){.features-grid{grid-template-columns:1fr;}}
  .feat-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:16px;padding:28px;transition:border-color .2s;}
  .feat-card:hover{border-color:rgba(0,212,255,.2);}
  .feat-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(0,212,255,.12),rgba(123,47,247,.12));display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;}
  .feat-title{font-size:.95rem;font-weight:800;margin-bottom:8px;}
  .feat-desc{font-size:.85rem;color:var(--muted);line-height:1.6;}

  /* SCREENSHOTS CAROUSEL SIMULÉ */
  .screenshots{max-width:1100px;margin:0 auto;padding:0 32px 64px;}
  .screenshots-track{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;padding-bottom:8px;}
  .screenshots-track::-webkit-scrollbar{display:none;}
  .screenshot{min-width:160px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:16px;padding:16px;flex-shrink:0;}
  .screenshot-label{font-size:.7rem;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;}
  .screenshot-bar{height:5px;background:rgba(255,255,255,.05);border-radius:3px;margin-bottom:6px;overflow:hidden;}
  .screenshot-fill{height:100%;border-radius:3px;}

  /* CTA FINAL */
  .cta-final{max-width:700px;margin:0 auto;padding:0 32px 80px;text-align:center;}
  .cta-box{background:linear-gradient(135deg,rgba(0,212,255,.06),rgba(123,47,247,.1));border:1px solid rgba(123,47,247,.3);border-radius:24px;padding:56px 40px;}
</style>
</head>
<body>

<nav>
  <div class="nav-logo">${data.product_name}</div>
  <div class="nav-links">
    <button class="nav-link">Fonctionnalités</button>
    <button class="nav-link">Tarifs</button>
    <button class="nav-cta">Télécharger</button>
  </div>
</nav>

<div class="hero">
  <div>
    <div class="hero-badge">Disponible iOS & Android</div>
    <h1>${data.headline || 'L\'app qui <span class="grad">transforme</span> votre quotidien'}</h1>
    <p class="hero-sub">${data.subtitle || 'Téléchargée par +150 000 utilisateurs. Notée 4.9/5 sur les stores. Essayez gratuitement.'}</p>
    <div class="store-badges">
      <div class="store-badge">
        <div class="store-icon">🍎</div>
        <div>
          <div class="store-text-top">Télécharger sur l'</div>
          <div class="store-text-bot">App Store</div>
        </div>
      </div>
      <div class="store-badge">
        <div class="store-icon">▶</div>
        <div>
          <div class="store-text-top">Disponible sur</div>
          <div class="store-text-bot">Google Play</div>
        </div>
      </div>
    </div>
    <div class="rating-inline">
      <span class="stars-sm">★★★★★</span>
      <span class="rating-text">4.9 · +8 400 avis · #1 dans sa catégorie</span>
    </div>
  </div>

  <!-- PHONE -->
  <div class="phone-wrap">
    <div class="phone-glow"></div>
    <div class="phone">
      <div class="phone-notch"><div class="notch-inner"></div></div>
      <div class="phone-screen">
        <div class="phone-app-bar">
          <div class="phone-app-name">${data.product_name}</div>
          <div class="phone-notif">🔔</div>
        </div>
        <div class="phone-stat">
          <div class="phone-stat-num">+247%</div>
          <div class="phone-stat-label">Croissance ce mois</div>
        </div>
        <div class="phone-stat" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:none;border:none;padding:0;">
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px;">
            <div style="font-size:1rem;font-weight:900;color:#00d4ff;">12.4k</div>
            <div style="font-size:.55rem;color:#64748b;font-weight:600;text-transform:uppercase;">Utilisateurs</div>
          </div>
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px;">
            <div style="font-size:1rem;font-weight:900;color:#7b2ff7;">98%</div>
            <div style="font-size:.55rem;color:#64748b;font-weight:600;text-transform:uppercase;">Satisfaction</div>
          </div>
        </div>
        <div class="phone-chart">
          ${[40,60,45,80,65,90,75,95,70,85,100,88].map(h => `<div class="bar" style="height:${h}%"></div>`).join('')}
        </div>
      </div>
      <div class="phone-bottom"><div class="home-bar"></div></div>
    </div>
  </div>
</div>

<!-- SCREENSHOTS -->
<div class="screenshots">
  <div class="screenshots-track">
    ${['Dashboard', 'Analytics', 'Settings', 'Reports', 'Profile'].map((label, i) => `
    <div class="screenshot">
      <div class="screenshot-label">${label}</div>
      ${[80,60,90,45,70].map((w, j) => `<div class="screenshot-bar"><div class="screenshot-fill" style="width:${w}%;background:linear-gradient(90deg,${i%2===0?'#00d4ff':'#7b2ff7'},rgba(255,255,255,.1))"></div></div>`).join('')}
    </div>`).join('')}
  </div>
</div>

<!-- FEATURES -->
<div class="features-section">
  <div class="section-center">
    <div class="section-tag">Fonctionnalités</div>
    <h2 class="section-title">Tout ce qu'il vous faut, dans votre poche</h2>
  </div>
  <div class="features-grid">
    ${data.benefits.slice(0, 6).map((b, i) => `
    <div class="feat-card">
      <div class="feat-icon">${['📊','⚡','🔔','🔒','🌐','🎯'][i % 6]}</div>
      <div class="feat-title">${b.split(' ').slice(0, 4).join(' ')}</div>
      <div class="feat-desc">${b}</div>
    </div>`).join('')}
  </div>
</div>

<!-- CTA FINAL -->
<div class="cta-final">
  <div class="cta-box">
    <h2 style="font-size:clamp(1.6rem,3vw,2.2rem);font-weight:900;letter-spacing:-.02em;margin-bottom:14px;">${data.headline || 'Prêt à passer à la vitesse supérieure ?'}</h2>
    <p style="color:var(--muted);margin-bottom:32px;">${data.urgency || 'Téléchargez gratuitement. Disponible sur iOS et Android.'}</p>
    <div class="store-badges" style="justify-content:center;">
      <div class="store-badge"><div class="store-icon">🍎</div><div><div class="store-text-top">Télécharger sur l'</div><div class="store-text-bot">App Store</div></div></div>
      <div class="store-badge"><div class="store-icon">▶</div><div><div class="store-text-top">Disponible sur</div><div class="store-text-bot">Google Play</div></div></div>
    </div>
  </div>
</div>

</body>
</html>`
}

// ─── EXPORT REGISTRY ──────────────────────────────────────────────────────────

export type TemplateCategory =
  | 'ecommerce' | 'dark' | 'light' | 'bold' | 'luxury' | 'mobile'
  | 'saas' | 'promotions' | 'lead-gen' | 'app'

export interface TemplateEntry {
  id: string
  name: string
  category: TemplateCategory
  style: string
  objective: string
  convRate: number
  badge: string | null
  description: string
  colors: string[]
  fn: (data: LandingPageData) => string
}

export const TEMPLATES: TemplateEntry[] = [
  {
    id: 'shein-pro',
    name: 'Shein Pro',
    category: 'ecommerce',
    style: 'mobile',
    objective: 'sales',
    convRate: 18.2,
    badge: 'Populaire',
    description: 'Template e-commerce mobile-first avec CTA sticky et galerie photos. Inspiré des meilleurs stores fashion.',
    colors: ['#7c3aed', '#16a34a', '#ffffff'],
    fn: templateSheinPro,
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'dark',
    style: 'dark',
    objective: 'sales',
    convRate: 14.7,
    badge: 'Trending',
    description: 'Fond sombre, typographie bold, accents rouges. Idéal pour les produits tech et lifestyle premium.',
    colors: ['#0f0f0f', '#ef4444', '#f5f5f5'],
    fn: templateMinimalDark,
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    category: 'light',
    style: 'light',
    objective: 'sales',
    convRate: 11.3,
    badge: null,
    description: 'Fond blanc, violet épuré, conversion optimisée. Le standard SaaS et produits numériques.',
    colors: ['#ffffff', '#7c3aed', '#111111'],
    fn: templateCleanWhite,
  },
  {
    id: 'bold-sales',
    name: 'Bold Sales',
    category: 'bold',
    style: 'bold',
    objective: 'sales',
    convRate: 22.1,
    badge: 'Populaire',
    description: 'Orange brûlant, gradient agressif, urgence maximale. Le roi du dropshipping haute performance.',
    colors: ['#fff7ed', '#ea580c', '#fbbf24'],
    fn: templateBoldSales,
  },
  {
    id: 'luxury',
    name: 'Luxury Premium',
    category: 'luxury',
    style: 'luxury',
    objective: 'sales',
    convRate: 9.8,
    badge: null,
    description: 'Typographie serif, or, premium. Pour les marques qui veulent positionner haut de gamme.',
    colors: ['#faf9f7', '#c9993a', '#1a1714'],
    fn: templateLuxury,
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    category: 'mobile',
    style: 'mobile',
    objective: 'sales',
    convRate: 16.4,
    badge: null,
    description: 'Optimisé 480px max-width, bleu, pensé trafic mobile Facebook/TikTok. CTA pleine largeur.',
    colors: ['#ffffff', '#2563eb', '#eff6ff'],
    fn: templateMobileFirst,
  },
  {
    id: 'saas-hero',
    name: 'SaaS Hero',
    category: 'saas',
    style: 'dark',
    objective: 'leads',
    convRate: 13.2,
    badge: 'Nouveau',
    description: 'Slate-950, indigo, mesh background animé, mockup dashboard, features grid, témoignages. IA-Native.',
    colors: ['#0f172a', '#6366f1', '#a5b4fc'],
    fn: templateSaasHero,
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'promotions',
    style: 'bold',
    objective: 'sales',
    convRate: 24.6,
    badge: 'Chaud',
    description: 'Fond noir, rouge + jaune, countdown JS 72h, barre de stock, urgence absolue. Taux record.',
    colors: ['#000000', '#ef4444', '#fbbf24'],
    fn: templateFlashSale,
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    category: 'lead-gen',
    style: 'light',
    objective: 'leads',
    convRate: 21.7,
    badge: 'Populaire',
    description: 'Blanc/vert, formulaire email central, mockup PDF, preuve sociale inline. Zero friction.',
    colors: ['#f8fafc', '#10b981', '#0f172a'],
    fn: templateLeadMagnet,
  },
  {
    id: 'app-download',
    name: 'App Download',
    category: 'app',
    style: 'dark',
    objective: 'downloads',
    convRate: 25.1,
    badge: 'Top',
    description: 'Gradient navy/bleu nuit, cyan + violet, mockup smartphone CSS, store badges, carousel.',
    colors: ['#1a1a2e', '#00d4ff', '#7b2ff7'],
    fn: templateAppDownload,
  },
]

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    case 'shein-pro':     return templateSheinPro(data)
    case 'premium-glass': return templateSheinPro(data)
    case 'minimal-dark':  return templateMinimalDark(data)
    case 'clean-white':   return templateCleanWhite(data)
    case 'bold-sales':    return templateBoldSales(data)
    case 'bold-orange':   return templateBoldSales(data)
    case 'luxury':        return templateLuxury(data)
    case 'mobile-first':  return templateMobileFirst(data)
    case 'saas-hero':     return templateSaasHero(data)
    case 'flash-sale':    return templateFlashSale(data)
    case 'lead-magnet':   return templateLeadMagnet(data)
    case 'app-download':  return templateAppDownload(data)
    default:              return templateCleanWhite(data)
  }
}
