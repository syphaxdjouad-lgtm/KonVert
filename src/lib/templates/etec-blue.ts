import type { LandingPageData } from '@/types'

const IMGS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
]

export function templateEtecBlue(data: LandingPageData): string {
  const imgs = (data.images?.filter(Boolean).length ?? 0) >= 4 ? data.images! : IMGS
  const main = imgs[0]
  const savePct = data.price && data.original_price
    ? Math.round((1 - +data.price / +data.original_price) * 100) : 0
  const benefits = data.benefits.slice(0, 5)
  const acc = '#0057FF', accL = '#EEF3FF', accT = '#fff'

  const thumbs = imgs.slice(0, 4).map((img, i) => `
    <div onclick="document.getElementById('mi').src='${img}';document.querySelectorAll('.th').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${acc}':'2px solid transparent';t.style.opacity=j===${i}?'1':'.55';});" class="th" style="border-radius:10px;overflow:hidden;aspect-ratio:1;cursor:pointer;outline:2px solid ${i === 0 ? acc : 'transparent'};opacity:${i === 0 ? 1 : .55};transition:all .2s;">
      <img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>`).join('')

  const bens = benefits.map(b => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;">
      <span style="width:22px;height:22px;border-radius:50%;background:${acc};color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">✓</span>
      <span style="font-size:14px;color:#444;line-height:1.6;">${b}</span>
    </li>`).join('')

  const feats = [
    { label: 'Performance', title: benefits[0] || data.product_name, desc: data.subtitle || '', img: imgs[0] },
    { label: 'Confort', title: benefits[1] || 'Conçu pour vous', desc: benefits[3] || '', img: imgs[1] },
    { label: 'Durabilité', title: benefits[2] || 'Fait pour durer', desc: benefits[4] || '', img: imgs[2] },
  ].map((f, i) => `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;margin-bottom:72px;" class="fr">
      <div style="order:${i%2?2:1};border-radius:20px;overflow:hidden;aspect-ratio:4/3;">
        <img src="${f.img}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="order:${i%2?1:2};">
        <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${acc};margin-bottom:12px;">${f.label}</p>
        <h3 style="font-size:22px;font-weight:800;line-height:1.25;letter-spacing:-.02em;color:#0D0D0D;margin-bottom:14px;">${f.title}</h3>
        <p style="font-size:14px;color:#666;line-height:1.8;">${f.desc || 'Un avantage clé qui fait toute la différence au quotidien.'}</p>
      </div>
    </div>`).join('')

  const reviews = [
    { t: '"Franchement bluffant. La qualité est là, livraison en 2 jours, emballage soigné. Je recommande sans hésiter à tout le monde."', n: 'Alexandre M.', d: 'Il y a 3 jours' },
    { t: '"J\'hésitais mais après les avis j\'ai sauté le pas. Vraiment contente ! Conforme à la description, bien emballé. Top qualité."', n: 'Sophie L.', d: 'Il y a 1 semaine' },
    { t: '"Rapport qualité/prix imbattable. Commandé pour un cadeau, la personne était ravie. Service client très réactif aussi."', n: 'Thomas R.', d: 'Il y a 2 semaines' },
  ].map(r => `
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:26px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="color:#FBBF24;font-size:14px;letter-spacing:2px;">★★★★★</span>
        <span style="font-size:11px;color:#16a34a;font-weight:600;background:#dcfce7;padding:3px 8px;border-radius:20px;">✓ Achat vérifié</span>
      </div>
      <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:18px;font-style:italic;">${r.t}</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#EEF3FF;color:${acc};font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;">${r.n[0]}</div>
        <div><p style="font-size:13px;font-weight:700;color:#111;">${r.n}</p><p style="font-size:11px;color:#999;">${r.d}</p></div>
      </div>
    </div>`).join('')

  const faqs = data.faq.map((f, i) => `
    <div style="border-bottom:1px solid #E5E7EB;">
      <button onclick="var p=this.nextElementSibling,o=p.style.maxHeight&&p.style.maxHeight!=='0px';document.querySelectorAll('.fp').forEach(function(x){x.style.maxHeight='0';x.style.paddingBottom='0';});document.querySelectorAll('.fi').forEach(function(x){x.textContent='+';x.style.transform='rotate(0deg)';});if(!o){p.style.maxHeight='220px';p.style.paddingBottom='16px';this.querySelector('.fi').textContent='−';}" style="width:100%;background:none;border:none;padding:20px 0;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;">
        <span style="font-size:15px;font-weight:600;color:#111;">${f.question}</span>
        <span class="fi" style="color:${acc};font-size:22px;font-weight:300;line-height:1;flex-shrink:0;">${i===0?'−':'+'}</span>
      </button>
      <div class="fp" style="max-height:${i===0?'220px':'0'};overflow:hidden;transition:max-height .3s ease,padding-bottom .3s;padding-bottom:${i===0?'16px':'0'};font-size:14px;color:#666;line-height:1.8;">${f.answer}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${data.product_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#F8F9FA;color:#0D0D0D;font-family:'Inter',sans-serif;line-height:1.6;font-size:15px;}
  .w{max-width:1100px;margin:0 auto;padding:0 24px;}
  img{display:block;}
  @media(max-width:768px){.pg,.fr,.rg{grid-template-columns:1fr!important;gap:24px!important;}.fr>div{order:unset!important;}h1{font-size:26px!important;}.hiw{grid-template-columns:1fr!important;}}
</style>
</head>
<body>

<!-- breadcrumb -->
<div style="background:#fff;border-bottom:1px solid #E5E7EB;">
  <div class="w" style="padding:12px 24px;font-size:13px;color:#999;">
    <a href="#" style="color:${acc};text-decoration:none;">Accueil</a> <span style="margin:0 6px;">›</span>
    <a href="#" style="color:${acc};text-decoration:none;">Boutique</a> <span style="margin:0 6px;">›</span>
    ${data.product_name}
  </div>
</div>

<!-- hero -->
<div class="w">
  <div class="pg" style="display:grid;grid-template-columns:55% 45%;gap:56px;padding:44px 0 80px;align-items:start;">

    <!-- gallery -->
    <div>
      <div style="background:#fff;border-radius:20px;overflow:hidden;aspect-ratio:1;border:1px solid #E5E7EB;margin-bottom:12px;">
        <img id="mi" src="${main}" alt="${data.product_name}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${thumbs}</div>
    </div>

    <!-- info -->
    <div style="padding-top:8px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${acc};margin-bottom:10px;">Nouveau · Bestseller</p>
      <h1 style="font-size:34px;font-weight:900;line-height:1.1;letter-spacing:-.03em;margin-bottom:14px;">${data.product_name}</h1>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
        <span style="color:#FBBF24;font-size:14px;letter-spacing:2px;">★★★★★</span>
        <a href="#reviews" style="font-size:13px;color:${acc};text-decoration:none;">127 avis clients</a>
      </div>
      <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:24px;">${data.subtitle||''}</p>

      <!-- price -->
      <div style="background:${accL};border-radius:14px;padding:18px 20px;margin-bottom:28px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
        ${data.price?`<span style="font-size:38px;font-weight:900;letter-spacing:-.03em;">${data.price}€</span>`:''}
        ${data.original_price?`<span style="font-size:18px;color:#999;text-decoration:line-through;">${data.original_price}€</span>`:''}
        ${savePct>0?`<span style="background:${acc};color:#fff;padding:5px 12px;border-radius:100px;font-size:12px;font-weight:700;">-${savePct}%</span>`:''}
      </div>

      <ul style="list-style:none;margin-bottom:28px;">${bens}</ul>

      <!-- CTAs -->
      <a href="#" style="display:block;text-align:center;background:${acc};color:${accT};padding:16px;border-radius:100px;font-size:15px;font-weight:700;text-decoration:none;margin-bottom:10px;" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">${data.cta||'Commander maintenant'}</a>
      <a href="#" style="display:block;text-align:center;background:transparent;color:#111;padding:14px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;border:2px solid #E5E7EB;margin-bottom:18px;" onmouseover="this.style.borderColor='${acc}'" onmouseout="this.style.borderColor='#E5E7EB'">Ajouter au panier</a>

      ${data.urgency?`<div style="display:flex;align-items:center;gap:8px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:11px 14px;margin-bottom:22px;"><span style="font-size:16px;">⚡</span><p style="font-size:13px;color:#c2410c;font-weight:600;">${data.urgency}</p></div>`:''}

      <!-- trust -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#E5E7EB;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:20px;">
        ${[['🚚','Livraison offerte','Dès 50€'],['🔒','Paiement sécurisé','SSL 256-bit'],['↩️','Retour 30 jours','Sans frais']].map(([ic,ti,su])=>`
          <div style="background:#fff;padding:14px 8px;text-align:center;">
            <div style="font-size:18px;margin-bottom:5px;">${ic}</div>
            <div style="font-size:11px;font-weight:700;margin-bottom:2px;">${ti}</div>
            <div style="font-size:11px;color:#999;">${su}</div>
          </div>`).join('')}
      </div>

      <!-- tabs -->
      <div style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
        <div style="display:flex;border-bottom:1px solid #E5E7EB;">
          ${['Garantie','Livraison','Support'].map((t,i)=>`<button onclick="document.querySelectorAll('.tp').forEach(function(p,j){p.style.display=j===${i}?'block':'none';});document.querySelectorAll('.tb').forEach(function(b,j){b.style.background=j===${i}?'${accL}':'transparent';b.style.color=j===${i}?'${acc}':'#999';b.style.fontWeight=j===${i}?'700':'500';});" class="tb" style="flex:1;padding:12px 6px;background:${i===0?accL:'transparent'};border:none;cursor:pointer;font-size:13px;font-weight:${i===0?'700':'500'};color:${i===0?acc:'#999'};font-family:inherit;">${t}</button>`).join('')}
        </div>
        <div class="tp" style="padding:16px;font-size:13px;color:#666;line-height:1.8;background:#fff;">Garantie <strong>1 an</strong> pièces et main d'œuvre. Remplacement ou remboursement intégral en cas de défaut.</div>
        <div class="tp" style="padding:16px;font-size:13px;color:#666;line-height:1.8;display:none;background:#fff;">Livraison <strong>2–4 jours</strong> ouvrés. Expédition le jour même avant 14h. Suivi par email.</div>
        <div class="tp" style="padding:16px;font-size:13px;color:#666;line-height:1.8;display:none;background:#fff;">Équipe disponible <strong>7j/7</strong>. Réponse sous 24h garantie. Satisfait ou remboursé.</div>
      </div>
    </div>
  </div>
</div>

<!-- features -->
<div style="background:#fff;padding:80px 0;border-top:1px solid #E5E7EB;">
  <div class="w">
    <div style="text-align:center;margin-bottom:56px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${acc};margin-bottom:10px;">Caractéristiques</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.03em;margin-bottom:10px;">${data.headline||data.product_name}</h2>
      <p style="font-size:15px;color:#666;max-width:500px;margin:0 auto;">${data.subtitle||''}</p>
    </div>
    ${feats}
  </div>
</div>

<!-- avant/après -->
<div style="background:#F8F9FA;padding:80px 0;">
  <div class="w">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${acc};margin-bottom:10px;">Transformation</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.03em;">Avant / Après</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="rg">
      <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
        <div style="position:relative;aspect-ratio:4/3;overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" style="width:100%;height:100%;object-fit:cover;" />
          <span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">AVANT</span>
        </div>
        <div style="padding:20px;"><p style="font-weight:700;margin-bottom:6px;">Avant ${data.product_name}</p><p style="font-size:13px;color:#666;line-height:1.7;">Résultats limités malgré les efforts. Frustration et perte de temps au quotidien.</p></div>
      </div>
      <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid ${acc}20;">
        <div style="position:relative;aspect-ratio:4/3;overflow:hidden;">
          <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80" style="width:100%;height:100%;object-fit:cover;" />
          <span style="position:absolute;top:12px;left:12px;background:rgba(22,163,74,.9);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">APRÈS</span>
        </div>
        <div style="padding:20px;"><p style="font-weight:700;margin-bottom:6px;color:${acc};">Après ${data.product_name}</p><p style="font-size:13px;color:#666;line-height:1.7;">Résultats visibles dès la première utilisation. Performance et confiance décuplées.</p></div>
      </div>
    </div>
  </div>
</div>

<!-- reviews -->
<div id="reviews" style="background:#fff;padding:80px 0;border-top:1px solid #E5E7EB;">
  <div class="w">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${acc};margin-bottom:10px;">Avis clients</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.03em;margin-bottom:10px;">Ce que disent nos clients</h2>
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
        <span style="color:#FBBF24;letter-spacing:3px;">★★★★★</span>
        <span style="font-size:14px;color:#666;">4.9/5 · 127 avis vérifiés</span>
      </div>
    </div>
    <div class="rg" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${reviews}</div>
  </div>
</div>

<!-- faq -->
<div style="background:#F8F9FA;padding:80px 0;">
  <div class="w" style="max-width:700px;">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${acc};margin-bottom:10px;">FAQ</p>
      <h2 style="font-size:30px;font-weight:900;letter-spacing:-.03em;">Questions fréquentes</h2>
    </div>
    ${faqs}
  </div>
</div>

<!-- cta final -->
<div style="background:${acc};padding:80px 24px;text-align:center;">
  <h2 style="font-size:36px;font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:14px;">${data.headline||'Prêt à commander ?'}</h2>
  <p style="color:rgba(255,255,255,.75);font-size:16px;margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto;">${data.urgency||'Livraison offerte · Paiement sécurisé · Retour 30 jours'}</p>
  <a href="#" style="display:inline-block;background:#fff;color:${acc};padding:16px 48px;border-radius:100px;font-size:16px;font-weight:800;text-decoration:none;" onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">${data.cta||'Commander maintenant'} →</a>
  <p style="margin-top:18px;font-size:13px;color:rgba(255,255,255,.4);">Paiement sécurisé · Satisfait ou remboursé · Livraison offerte</p>
</div>

</body>
</html>`
}
