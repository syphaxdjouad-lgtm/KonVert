// ─── Séquence email "Preview page gratuite" ─────────────────────────────────
// 5 emails sur 7 jours — objectif : convertir en plan payant
// Déclencheur : génération d'une page gratuite sans compte

import { generateUnsubscribeToken } from './unsubscribe-token'

function unsubscribeUrl(email: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app').trim()
  try {
    const token = generateUnsubscribeToken(email)
    const qs = new URLSearchParams({ email, token })
    return `${appUrl}/api/email/unsubscribe?${qs.toString()}`
  } catch {
    return `${appUrl}/unsubscribe?email=${encodeURIComponent(email)}`
  }
}

function layout(content: string, recipientEmail: string) {
  const unsubUrl = unsubscribeUrl(recipientEmail)
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
            Tu reçois cet email car tu as généré une page gratuite sur KONVERT.<br/>
            <a href="${unsubUrl}" style="color:rgba(167,139,250,0.6);">Se désabonner</a>
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

function badge(text: string) {
  return `<div style="display:inline-block;background:rgba(124,58,237,0.15);border:1px solid rgba(139,92,246,0.3);border-radius:8px;padding:6px 14px;margin-bottom:20px;">
    <span style="font-size:12px;font-weight:700;color:#a78bfa;text-transform:uppercase;letter-spacing:0.05em;">${text}</span>
  </div>`
}

// ─── EMAIL J+0 — Livraison immédiate ─────────────────────────────────────────
export function emailPreviewDelivery(name: string, previewUrl: string, productTitle: string, email: string) {
  return {
    subject: `Voici ta page produit — ${productTitle}`,
    html: layout(`
      ${badge('Ta page est prête')}
      ${h1(`${name}, ta page est générée.`)}
      ${p(`Ta landing page pour <strong style="color:#a78bfa;">${productTitle}</strong> est prête. Clique pour la voir :`)}

      <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:13px;color:rgba(167,139,250,0.7);">CE QUE TU VAS TROUVER</p>
        ${['Titre de vente percutant', 'Copy bénéfices optimisé conversion', 'Section FAQ prête à l\'emploi', 'CTA et urgence inclus'].map(item =>
          `<p style="margin:0 0 6px;font-size:14px;color:rgba(196,181,253,0.85);">✓ ${item}</p>`
        ).join('')}
      </div>

      ${p(`Pour l'utiliser sur ta boutique, débloque-la en choisissant un plan. La page t'attend.`)}

      <div style="text-align:center;margin-top:28px;">
        ${btn('Voir ma page →', previewUrl)}
      </div>
      ${p(`<small style="color:rgba(167,139,250,0.5);">Ta page est sauvegardée pendant 7 jours.</small>`)}
    `, email),
  }
}

// ─── EMAIL J+1 — Valeur pédagogique ──────────────────────────────────────────
export function emailPreviewDay1(name: string, previewUrl: string, productTitle: string, email: string) {
  return {
    subject: `Pourquoi cette page va mieux convertir que la tienne`,
    html: layout(`
      ${h1(`${name}, voilà ce que fait ta page.`)}
      ${p(`Ta landing page pour <strong style="color:#a78bfa;">${productTitle}</strong> n'est pas une page ordinaire. Voilà ce qui la différencie :`)}

      <table style="width:100%;margin:20px 0;">
        ${[
          ['Le titre', 'Formulé pour déclencher l\'achat, pas juste décrire le produit'],
          ['Les bénéfices', 'Ce que ça change dans la vie du client — pas les features'],
          ['Le CTA', 'Placé au bon endroit, avec le bon verbe d\'action'],
        ].map(([element, desc]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(139,92,246,0.1);">
            <strong style="color:#a78bfa;font-size:14px;">${element}</strong><br/>
            <span style="font-size:13px;color:rgba(196,181,253,0.7);">${desc}</span>
          </td>
        </tr>`).join('')}
      </table>

      ${p(`Une page Shopify basique affiche le produit. Ta page KONVERT vend le produit. La différence, c'est le taux de conversion.`)}

      <div style="text-align:center;margin-top:28px;">
        ${btn('Publier cette page →', previewUrl)}
      </div>
    `, email),
  }
}

// ─── EMAIL J+3 — Social proof ─────────────────────────────────────────────────
export function emailPreviewDay3(name: string, previewUrl: string, productTitle: string, email: string) {
  return {
    subject: `${name}, il a fait pareil que toi — voilà ce qui s'est passé`,
    html: layout(`
      ${h1(`Il a généré sa page gratuite. Puis il a upgradé.`)}

      <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 12px;font-size:15px;color:rgba(196,181,253,0.9);font-style:italic;line-height:1.6;">
          "J'ai généré ma première page comme toi, gratuitement. Le résultat était tellement meilleur que ce que j'avais avant que j'ai pris le plan Starter le jour même."
        </p>
        <p style="margin:0;font-size:12px;color:rgba(167,139,250,0.6);">— E-commerçant dropshipping, plan Starter</p>
      </div>

      ${p(`Ta page pour <strong style="color:#a78bfa;">${productTitle}</strong> t'attend encore. Mais on la garde seulement jusqu'à dans <strong style="color:#f59e0b;">4 jours</strong>.`)}

      <div style="text-align:center;margin-top:28px;">
        ${btn('Activer mon compte Starter →', 'https://konvert.app/pricing')}
      </div>
      ${p(`<small style="color:rgba(167,139,250,0.5);">Ou <a href="${previewUrl}" style="color:#a78bfa;">revoir ma page d'abord</a>.</small>`)}
    `, email),
  }
}

// ─── EMAIL J+5 — Mathématiques de la douleur ─────────────────────────────────
export function emailPreviewDay5(name: string, previewUrl: string, email: string) {
  return {
    subject: `39€ vs ce que tu perds chaque semaine`,
    html: layout(`
      ${h1(`${name}, fais le calcul.`)}
      ${p(`Si tu tournes avec 50€/jour de pub et ta page convertit à 1% :`)}

      <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:16px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:14px;color:rgba(252,165,165,0.9);">Taux actuel à 1% → 50 ventes / 5000 visiteurs</p>
        <p style="margin:0;font-size:14px;color:rgba(74,222,128,0.9);">Page optimisée à 3% → 150 ventes / 5000 visiteurs</p>
      </div>

      ${p(`<strong style="color:#fff;">3x plus de ventes. Même budget pub.</strong> KONVERT coûte moins qu'une heure de freelance.`)}

      <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:rgba(167,139,250,0.7);">PLAN STARTER</p>
        <p style="margin:0;font-size:32px;font-weight:900;color:#fff;">39€<span style="font-size:16px;font-weight:400;color:rgba(167,139,250,0.6);">/mois</span></p>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(196,181,253,0.6);">Moins qu'un repas au restaurant</p>
      </div>

      <div style="text-align:center;margin-top:24px;">
        ${btn('Débloquer pour 39€/mois →', 'https://konvert.app/pricing')}
      </div>
      ${p(`<small style="color:rgba(167,139,250,0.5);">Ta page attend encore : <a href="${previewUrl}" style="color:#a78bfa;">la voir</a>.</small>`)}
    `, email),
  }
}

// ─── EMAIL J+7 — Dernière chance ──────────────────────────────────────────────
export function emailPreviewDay7(name: string, previewUrl: string, productTitle: string, email: string) {
  return {
    subject: `On supprime ta page dans 24h`,
    html: layout(`
      ${h1(`${name}, dernière chance.`)}
      ${p(`Ta page pour <strong style="color:#a78bfa;">${productTitle}</strong> est supprimée dans <strong style="color:#ef4444;">24 heures</strong>.`)}
      ${p(`Si tu veux la garder et l'utiliser sur ta boutique, c'est maintenant ou jamais.`)}

      <div style="text-align:center;margin:28px 0;">
        ${btn('Sauvegarder ma page →', 'https://konvert.app/pricing')}
      </div>

      ${p(`<small style="color:rgba(167,139,250,0.5);">Ou <a href="${previewUrl}" style="color:#a78bfa;">revoir ma page une dernière fois</a>.</small>`)}
    `, email),
  }
}
