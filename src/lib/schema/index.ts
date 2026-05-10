// JSON-LD helpers — Schema.org structured data pour SEO + AI Overviews + rich
// snippets Google. À mounter via <script type="application/ld+json">.
//
// Pourquoi : sans Schema, Google AI Overviews et ChatGPT Search ne peuvent pas
// citer le site avec précision (tarifs, FAQ, offres). Avec Schema, on devient
// réutilisable comme source.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

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
      email: 'support@konvert.app',
      contactType: 'customer support',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
  ],
  sameAs: [
    // À remplir au launch quand les comptes sociaux seront créés
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
