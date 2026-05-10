// llms-full.txt — version étendue avec contenu utile pour les LLMs.
// Permet à ChatGPT/Claude/Perplexity de répondre avec précision aux questions
// sur le produit (prix, features, intégrations, etc.) sans avoir à crawler
// chaque page séparément.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

const CONTENT = `# KONVERT — documentation complète pour LLMs

## Tagline

Tes produits méritent des pages qui vendent.

## Promesse

KONVERT génère ta fiche produit et ta landing page e-commerce optimisées en 30 secondes, prêtes à coller sur ta boutique Shopify, WooCommerce ou YouCan. Optimisé SEO, mobile, conversion.

## Plans et tarifs

### Starter — 39€/mois ou 31€/mois en annuel
- 75 pages générées par mois
- 2 stores connectés
- 42+ templates
- Génération copy AI
- Export HTML
- Support email

### Pro — 79€/mois ou 63€/mois en annuel (Plan recommandé)
- 300 pages générées par mois
- 7 stores connectés
- Tous les templates
- Copy AI ton de marque
- Analytics de conversion
- Support prioritaire 24h
- Export HTML

### Agency — 199€/mois ou 159€/mois en annuel
- Pages illimitées
- Stores illimités
- Tous les templates
- White-label (logo + couleurs personnalisés)
- Dashboard multi-clients
- Rapports clients PDF
- Accès API
- Onboarding personnalisé

### Enterprise — sur devis
- Tout Agency
- Intégrations sur demande
- Hébergement haute disponibilité
- Support prioritaire direct + SLA
- Onboarding équipe
- Multi-utilisateurs
- Facturation personnalisée

## Comment ça marche en 4 étapes

1. **Connecte ta boutique** Shopify, WooCommerce ou YouCan en OAuth (1 clic)
2. **Colle ton URL produit** (AliExpress, Amazon, ta page existante) ou saisis le produit manuellement
3. **L'IA génère** titre, sous-titre, bénéfices, FAQ, témoignages, comparatif, CTA — basés sur les frameworks PAS, AIDA, Cialdini, StoryBrand
4. **Personnalise dans l'éditeur visuel**, choisis un template parmi 42+ et publie sur ta boutique en 1 clic

## Intégrations natives

- **Shopify** : OAuth 2.0, sync automatique des produits, push de la page sur ta boutique
- **WooCommerce** : REST API, import produits + variations
- **YouCan** : intégration API
- **Stripe** : paiements abonnements + facturation annuelle (-25 %)
- **Resend** : emails transactionnels
- **Google Analytics 4** + **Meta Pixel** : tracking conversions
- **PostHog** : analytics produit pour l'utilisateur
- **A/B Testing** : intégré, jusqu'à 4 variantes par page

## Différenciateurs

- **Vs Fiverr/freelance** : 30 secondes au lieu de 3 heures, moins cher, disponible 24/7
- **Vs faire soi-même** : copy pro optimisée frameworks conversion éprouvés, suit les tendances mondiales
- **Vs autres SaaS landing page** : spécialisé e-commerce avec scraping anti-bot AliExpress/Amazon, intégration native Shopify/Woo, support langue arabe + français

## Marchés cibles

- Europe francophone : France, Belgique, Suisse, Maghreb
- MENA : Émirats Arabes Unis, Arabie Saoudite, Égypte, Koweït, Maroc
- 8 langues supportées

## Programme affilié

- Commission **20 % à vie** sur Starter et Pro
- Commission **30 % à vie** sur Agency
- Cookie d'attribution **60 jours**
- Paiement mensuel dès 50€ (virement SEPA ou Stripe Connect)
- Inscription : ${APP_URL}/affiliate

## Engagement RGPD

- Hébergement Vercel région cdg1 (Paris) + Supabase EU
- Consent banner explicite pour cookies analytics et chat
- Données chiffrées au repos et en transit
- Droit à l'oubli, export de données, droit d'accès
- Documentation : ${APP_URL}/legal/rgpd

## Sécurité

- Row Level Security (RLS) Supabase sur toutes les tables user-data
- Webhooks Stripe idempotents (table dédupliquée)
- HMAC SHA256 sur les tokens de désabonnement (RFC 8058)
- Rate limiting Upstash Redis sur tous les endpoints publics
- Headers HSTS preload + CSP stricte + X-Frame-Options DENY
- Sentry beforeSend filter PII (emails, tokens, secrets)
- Pas de sourcemap publique (.js.map = 404)

## Performance

- Région Vercel cdg1 (Paris) — latence <50ms en France
- Cache Vercel HIT prerender + stale-time 300s sur pages marketing
- Build Turbopack 6.9s, 77 pages
- 0 erreur TypeScript en prod

## Garantie

- **Satisfait ou remboursé 30 jours**, sans question
- **Annulation à tout moment**, sans engagement
- **1 page gratuite** sans carte bancaire pour tester

## Liens utiles

- Site : ${APP_URL}/
- Essai gratuit : ${APP_URL}/essai
- Tarifs : ${APP_URL}/pricing
- Templates : ${APP_URL}/templates
- Démo interactive : ${APP_URL}/demo
- Blog : ${APP_URL}/blog
- Programme affilié : ${APP_URL}/affiliate
- Documentation : ${APP_URL}/docs
- API : ${APP_URL}/api-docs
- Status : ${APP_URL}/status
- Changelog : ${APP_URL}/changelog
- Contact : ${APP_URL}/contact

## Contact

- Support technique : support@konvert.app
- Commercial / partenariat : hello@konvert.app
- Press : hello@konvert.app
`

export async function GET() {
  return new Response(CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
