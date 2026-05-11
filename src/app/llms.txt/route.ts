// llms.txt — format standard pour aider les LLMs (ChatGPT search, Perplexity,
// Claude, Bing Copilot, Google AI Overviews) à comprendre le site.
// Spec : https://llmstxt.org

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvertpilot.com'

const CONTENT = `# KONVERT

> Tes produits méritent des pages qui vendent. KONVERT génère des fiches produit et landing pages e-commerce optimisées en 30 secondes — prêtes à coller sur Shopify, WooCommerce ou YouCan. SEO, mobile, conversion.

## Pour qui

E-commerçants débutants à avancés (17-38 ans) sur les marchés francophone (FR, BE, CH, Maghreb) et arabophone (EAU, Arabie Saoudite, Égypte, Koweït, Maroc). Boutiques Shopify, WooCommerce, YouCan, Wix.

## Ce que fait KONVERT

- Scrape une URL produit (AliExpress, Amazon, Alibaba, votre site) et génère automatiquement une fiche produit + landing page complète
- Copy IA (DeepSeek) optimisée frameworks PAS, AIDA, Cialdini, StoryBrand
- 42+ templates produit haute conversion (Beauté, Tech, Fashion, Gaming, Bundle, Apple-style)
- A/B testing intégré jusqu'à 4 variantes
- Connexion OAuth Shopify, WooCommerce REST API, YouCan
- Analytics conversion en temps réel
- Export HTML pour usage standalone
- Génération en 30 secondes contre 3 heures avec un freelance

## Pages clés

- [Accueil](${APP_URL}/) : présentation du produit + démo interactive
- [Essai gratuit](${APP_URL}/essai) : 1 page générée gratuitement sans carte bancaire
- [Tarifs](${APP_URL}/pricing) : Starter 39€/mo, Pro 79€/mo, Agency 199€/mo, Enterprise sur devis
- [Templates](${APP_URL}/templates) : galerie des 42+ templates par industrie
- [Démo](${APP_URL}/demo) : démo interactive en direct
- [Fonctionnalités](${APP_URL}/features) : détail des features
- [Affilié](${APP_URL}/affiliate) : programme 20-30 % commission récurrente
- [Blog](${APP_URL}/blog) : guides e-commerce, dropshipping, copywriting

## Documentation

- [Documentation produit](${APP_URL}/docs)
- [API docs](${APP_URL}/api-docs)
- [Changelog](${APP_URL}/changelog)
- [Status](${APP_URL}/status)

## Légal

- [CGU](${APP_URL}/legal/cgu)
- [CGV](${APP_URL}/legal/cgv)
- [Confidentialité](${APP_URL}/legal/privacy)
- [Mentions légales](${APP_URL}/legal/mentions)
- [Cookies](${APP_URL}/legal/cookies)
- [RGPD](${APP_URL}/legal/rgpd)

## Stack technique (pour curieux)

Next.js 16 + TypeScript + Tailwind CSS + Supabase (auth + DB + RLS + Storage) + Stripe (paiements + webhooks idempotents) + DeepSeek (génération copy) + Firecrawl (scraping anti-bot AliExpress/Amazon) + Resend (email transactionnel) + Sentry (observabilité) + PostHog (analytics produit) + Vercel (déploiement région cdg1).

## Contact

- Support : support@konvertpilot.com
- Hello : hello@konvertpilot.com
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
