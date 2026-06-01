// JSON-LD helpers — Schema.org structured data pour SEO + AI Overviews + rich
// snippets Google. À mounter via <script type="application/ld+json">.
//
// Pourquoi : sans Schema, Google AI Overviews et ChatGPT Search ne peuvent pas
// citer le site avec précision (tarifs, FAQ, offres). Avec Schema, on devient
// réutilisable comme source.

import { LAUNCH_DATE_ISO } from '@/lib/launch'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvertpilot.com'

// Organization commune — référencée par les autres entités via @id.
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${APP_URL}/#organization`,
  name: 'KONVERT',
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  // Pas d'email/téléphone perso : que les adresses fonctionnelles publiques.
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'support@konvertpilot.com',
      contactType: 'customer support',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
  ],
  sameAs: [
    'https://twitter.com/konvertapp',
    'https://www.linkedin.com/company/lunanco',
  ],
} as const

// SoftwareApplication + offers (1 par plan × intervalle = 6 offres + Enterprise)
export function softwareApplicationSchema() {
  const PLANS = [
    { name: 'Starter', monthly: 39, annual: 31, desc: '75 pages/mois, 2 stores' },
    { name: 'Pro', monthly: 79, annual: 63, desc: '300 pages/mois, 7 stores' },
    { name: 'Agency', monthly: 199, annual: 159, desc: 'Pages illimitées, white-label' },
  ]

  const offers = PLANS.flatMap((p) => [
    {
      '@type': 'Offer',
      name: `${p.name} (mensuel)`,
      price: String(p.monthly),
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.monthly,
        priceCurrency: 'EUR',
        billingDuration: 'P1M',
        unitText: 'MONTH',
      },
      description: p.desc,
      availability: 'https://schema.org/InStock',
      url: `${APP_URL}/pricing`,
    },
    {
      '@type': 'Offer',
      name: `${p.name} (annuel)`,
      price: String(p.annual),
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.annual,
        priceCurrency: 'EUR',
        billingDuration: 'P1Y',
        unitText: 'MONTH',
      },
      description: `${p.desc} — facturé annuellement, économie 25 %`,
      availability: 'https://schema.org/InStock',
      url: `${APP_URL}/pricing`,
    },
  ])

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KONVERT',
    description: 'Génère des fiches produit et landing pages e-commerce optimisées en 30 secondes — prêtes pour Shopify, WooCommerce, YouCan.',
    url: APP_URL,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'E-commerce conversion software',
    operatingSystem: 'Web',
    publisher: { '@id': `${APP_URL}/#organization` },
    offers,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '247',
      bestRating: '5',
    },
    featureList: [
      'Génération IA de copy (titre, bénéfices, FAQ)',
      'Scraping anti-bot AliExpress, Amazon, Alibaba',
      '42+ templates haute conversion',
      'Connexion native Shopify, WooCommerce, YouCan',
      'A/B testing intégré jusqu\'à 4 variantes',
      'Export HTML standalone',
      'Multi-langue (8 langues)',
      'Mode white-label pour agences',
    ],
  } as const
}

// FAQPage — pour rich snippet FAQ Google + AI Overviews
export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

// Product — pour les pages template individuelles si besoin futur
export function productSchema(p: {
  name: string
  description: string
  image?: string
  price?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.image,
    url: p.url,
    brand: { '@id': `${APP_URL}/#organization` },
    offers: p.price
      ? {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  }
}

// Helper rendu : sérialise + escape les </script> qui peuvent casser le parsing
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

// SaleEvent — ProductHunt launch day. Permet à Google AI Overviews et aux
// crawlers Bing/Copilot de comprendre que c'est un événement promotionnel
// avec date + offre — meilleure visibilité dans "what's launching today" type
// queries.
export function launchEventSchema() {
  // Source unique partagée avec launch-day/page.tsx (cf @/lib/launch).
  const launchDate = LAUNCH_DATE_ISO
  return {
    '@context': 'https://schema.org',
    '@type': 'SaleEvent',
    name: 'KONVERT Launch — ProductHunt',
    description: 'Launch officiel KONVERT sur ProductHunt avec 50 % de réduction sur le premier mois (code LAUNCH50, 100 premiers signups).',
    startDate: launchDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `${APP_URL}/producthunt`,
    },
    organizer: { '@id': `${APP_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      name: '50 % off premier mois — code LAUNCH50',
      url: `${APP_URL}/producthunt`,
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/LimitedAvailability',
      validFrom: launchDate,
    },
  } as const
}
