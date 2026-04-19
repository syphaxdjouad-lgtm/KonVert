// ─── Base layout ────────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KONVERT</title>
</head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-size:24px;font-weight:900;letter-spacing:-0.03em;">
            <span style="color:#fff;">KON</span><span style="color:#a78bfa;">VERT</span>
          </span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.25);border-radius:24px;padding:40px 36px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(167,139,250,0.4);">
            Tu reçois cet email car tu as créé un compte KONVERT.<br/>
            <a href="https://konvert.app/dashboard/settings" style="color:rgba(167,139,250,0.6);">Se désabonner</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:14px;text-decoration:none;box-shadow:0 4px 20px rgba(124,58,237,0.4);">${text}</a>`
}

function h1(text: string) {
  return `<h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#fff;line-height:1.2;">${text}</h1>`
}

function p(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;color:rgba(196,181,253,0.8);line-height:1.6;">${text}</p>`
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function emailWelcome(name: string) {
  return {
    subject: `Bienvenue dans la bêta KONVERT, ${name} 🎉`,
    html: layout(`
      ${h1(`Bienvenue ${name}, t'es dans la place.`)}
      ${p(`Ton essai de <strong style="color:#a78bfa;">14 jours</strong> commence maintenant. Voilà par où démarrer :`)}

      <table style="width:100%;margin:24px 0;">
        ${['Colle un lien AliExpress/Amazon → KONVERT scrape le produit', 'L\'IA génère le copy de ta landing page en 30 secondes', 'Connecte ton Shopify et publie en 1 clic'].map((step, i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.1);">
            <span style="display:inline-flex;align-items:center;gap:12px;">
              <span style="display:inline-block;width:28px;height:28px;background:rgba(124,58,237,0.2);border:1px solid rgba(139,92,246,0.4);border-radius:8px;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#a78bfa;">${i + 1}</span>
              <span style="font-size:14px;color:rgba(196,181,253,0.9);">${step}</span>
            </span>
          </td>
        </tr>`).join('')}
      </table>

      <div style="text-align:center;margin-top:28px;">
        ${btn('Créer ma première page →', 'https://konvert.app/dashboard/new')}
      </div>
    `),
  }
}

export function emailDay1(name: string) {
  return {
    subject: `${name}, comment créer ta première page en 60 secondes`,
    html: layout(`
      ${h1(`T'as pas encore créé ta première page.`)}
      ${p(`Pas de pression — voilà exactement comment faire en moins de 60 secondes :`)}

      <table style="width:100%;margin:24px 0;">
        ${[
          ['1', 'Va sur <strong style="color:#a78bfa;">dashboard → Nouvelle page</strong>'],
          ['2', 'Colle un lien produit AliExpress, Amazon ou Shopify'],
          ['3', 'Choisis ta langue et ton style — l\'IA génère tout'],
        ].map(([num, step]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.1);">
            <span style="display:inline-flex;align-items:center;gap:12px;">
              <span style="display:inline-block;width:28px;height:28px;background:rgba(124,58,237,0.2);border:1px solid rgba(139,92,246,0.4);border-radius:8px;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#a78bfa;">${num}</span>
              <span style="font-size:14px;color:rgba(196,181,253,0.9);">${step}</span>
            </span>
          </td>
        </tr>`).join('')}
      </table>

      ${p(`Il te reste <strong style="color:#a78bfa;">13 jours</strong> d'essai. La page est générée en moins d'une minute.`)}
      <div style="text-align:center;margin-top:28px;">
        ${btn('Créer ma première page →', 'https://konvert.app/dashboard/new')}
      </div>
    `),
  }
}

export function emailDay3(name: string) {
  return {
    subject: `${name}, t'as essayé le scraper ? ⚡`,
    html: layout(`
      ${h1(`Il reste 11 jours sur ton essai.`)}
      ${p(`La fonctionnalité que nos bêta-testeurs adorent le plus : <strong style="color:#a78bfa;">le scraper automatique</strong>.`)}
      ${p(`Colle un lien produit AliExpress ou Amazon → KONVERT récupère le titre, les images, le prix et génère une landing page complète en moins de 60 secondes.`)}
      ${p(`Teste-le maintenant sur n'importe quel produit de ton catalogue.`)}
      <div style="text-align:center;margin-top:28px;">
        ${btn('Essayer le scraper →', 'https://konvert.app/dashboard/new')}
      </div>
    `),
  }
}

export function emailDay7(name: string) {
  return {
    subject: `${name}, à mi-chemin de ton essai — bilan ?`,
    html: layout(`
      ${h1(`7 jours. Qu'est-ce que tu en penses ?`)}
      ${p(`Tu es à la moitié de ton essai KONVERT. On veut savoir ce qui marche et ce qui peut être amélioré pour toi.`)}

      <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:20px;margin:20px 0;">
        <p style="margin:0;font-size:14px;color:rgba(196,181,253,0.9);font-style:italic;">
          "Les landing pages KONVERT convertissent mieux que tout ce qu'on avait fait avant. Le scraper fait gagner 2h par produit."
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:rgba(167,139,250,0.6);">— Bêta testeur, e-commerçant dropshipping</p>
      </div>

      ${p(`Si t'as des questions ou des blocages, réponds directement à cet email — je réponds personnellement.`)}
      <div style="text-align:center;margin-top:28px;">
        ${btn('Voir mon dashboard →', 'https://konvert.app/dashboard')}
      </div>
    `),
  }
}

export function emailDay10(name: string) {
  return {
    subject: `⏳ ${name}, il reste 4 jours sur ton essai`,
    html: layout(`
      ${h1(`4 jours restants.`)}
      ${p(`Ton essai gratuit se termine dans <strong style="color:#f59e0b;">4 jours</strong>. Pour ne pas perdre tes pages et continuer à convertir :`)}

      <table style="width:100%;margin:20px 0;border-collapse:collapse;">
        ${[
          ['Starter — 39€/mois', 'Jusqu\'à 10 pages actives, scraper inclus'],
          ['Pro — 79€/mois', '50 pages, multi-boutiques, analytics avancés'],
          ['Agency — 199€/mois', 'Pages illimitées, clients illimités, mode agence'],
        ].map(([plan, desc]) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid rgba(139,92,246,0.1);">
            <strong style="color:#a78bfa;font-size:14px;">${plan}</strong><br/>
            <span style="font-size:13px;color:rgba(196,181,253,0.7);">${desc}</span>
          </td>
        </tr>`).join('')}
      </table>

      <div style="text-align:center;margin-top:28px;">
        ${btn('Choisir mon plan →', 'https://konvert.app/pricing')}
      </div>
    `),
  }
}

export function emailDay12(name: string) {
  return {
    subject: `⚠️ ${name}, encore 2 jours sur ton essai KONVERT`,
    html: layout(`
      ${h1(`2 jours restants.`)}
      ${p(`Ton essai KONVERT se termine dans <strong style="color:#f59e0b;">48 heures</strong>.`)}
      ${p(`Souscris maintenant pour garder l'accès à toutes tes pages et continuer à convertir sans interruption.`)}

      <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:rgba(167,139,250,0.9);">CE QUE TU GARDES</p>
        ${['Toutes tes pages créées pendant l\'essai', 'Accès au scraper IA 24h/7j', 'Push direct vers Shopify &amp; WooCommerce'].map(item => `
        <p style="margin:0 0 8px;font-size:14px;color:rgba(196,181,253,0.85);">✓ ${item}</p>
        `).join('')}
      </div>

      <div style="text-align:center;margin-top:24px;">
        ${btn('Activer mon abonnement →', 'https://konvert.app/pricing')}
      </div>
      ${p(`<small style="color:rgba(167,139,250,0.5);">Questions ? Réponds directement à cet email.</small>`)}
    `),
  }
}

export function emailDay13(name: string) {
  return {
    subject: `🚨 ${name}, dernière chance — ton essai expire demain`,
    html: layout(`
      ${h1(`Demain, ton essai se termine.`)}
      ${p(`Dans <strong style="color:#ef4444;">24 heures</strong>, tu perdras l'accès à tes pages et au scraper KONVERT.`)}
      ${p(`Souscris maintenant pour conserver tout ce que tu as créé pendant ta période d'essai.`)}

      <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);border-radius:16px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:rgba(74,222,128,0.8);font-weight:700;">OFFRE DE LANCEMENT</p>
        <p style="margin:0;font-size:26px;font-weight:900;color:#fff;">1er mois à -30%</p>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(196,181,253,0.6);">Code automatique à la checkout</p>
      </div>

      <div style="text-align:center;margin-top:20px;">
        ${btn('Activer mon abonnement →', 'https://konvert.app/pricing')}
      </div>
    `),
  }
}

export function emailDay14(name: string) {
  return {
    subject: `${name}, ton essai KONVERT est terminé`,
    html: layout(`
      ${h1(`Ton essai est terminé.`)}
      ${p(`Merci d'avoir testé KONVERT pendant ces 14 jours. Tes pages sont en pause mais pas supprimées — elles t'attendent.`)}
      ${p(`Si tu veux continuer à convertir avec des landing pages IA, il suffit de choisir un plan. Tes données sont intactes.`)}
      ${p(`Si l'expérience n'a pas été à la hauteur, réponds à cet email et dis-moi pourquoi — je veux comprendre.`)}
      <div style="text-align:center;margin-top:28px;">
        ${btn('Réactiver mon compte →', 'https://konvert.app/pricing')}
      </div>
      ${p(`<small style="color:rgba(167,139,250,0.5);">P.S. Si tu veux un accès prolongé gratuitement, réponds à cet email en me disant comment KONVERT pourrait mieux coller à tes besoins.</small>`)}
    `),
  }
}
