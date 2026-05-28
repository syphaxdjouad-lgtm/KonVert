import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import ComparisonTable from '@/components/marketing/comparison/ComparisonTable'
import TrustpilotCard from '@/components/marketing/comparison/TrustpilotCard'
import SideBySideMockup from '@/components/marketing/comparison/SideBySideMockup'
import FAQComparison from '@/components/marketing/comparison/FAQComparison'
import { safeJsonLd } from '@/lib/security/json-ld'

export const metadata: Metadata = {
  title: 'Alternative à xPage — Pourquoi Konvert génère mieux',
  description:
    'Konvert vs xPage : comparaison factuelle. xPage utilise du template mapping (Trustpilot 2.7/5). Konvert génère du copy unique avec DeepSeek, supporte WooCommerce et le marché francophone.',
  keywords: [
    'alternative xpage',
    'xpage alternative',
    'meilleure alternative xpage',
    'xpage concurrent',
    'konvert vs xpage',
    'générateur landing page produit IA',
    'landing page aliexpress shopify',
    'landing page woocommerce',
  ],
  alternates: {
    canonical: 'https://konvertpilot.com/alternative-a-xpage',
    languages: {
      fr: 'https://konvertpilot.com/alternative-a-xpage',
      en: 'https://konvertpilot.com/vs/xpage',
    },
  },
  openGraph: {
    title: 'Konvert vs xPage — Comparaison complète',
    description:
      'xPage : Trustpilot 2.7/5, template mapping basique. Konvert : copy unique IA, WooCommerce, francophone. Essai gratuit — résultat en 30 secondes.',
    url: 'https://konvertpilot.com/alternative-a-xpage',
    siteName: 'Konvert',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konvert vs xPage — La comparaison factuelle',
    description:
      'xPage génère du template, Konvert génère du copy. Trustpilot xPage : 2.7/5. Essaie Konvert gratuitement.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'KONVERT',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Générateur de landing pages produit IA pour Shopify et WooCommerce. Génère du copy unique avec DeepSeek et des frameworks de conversion PAS/AIDA/Cialdini.',
  url: 'https://konvertpilot.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    description: '1 page gratuite sans compte',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '1',
  },
  creator: {
    '@type': 'Organization',
    name: 'Luna Corporation LTD',
    url: 'https://konvertpilot.com',
  },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle est la vraie différence entre Konvert et xPage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "xPage utilise du template mapping : il insère les champs scrapés dans un modèle fixe. Konvert utilise DeepSeek avec des frameworks de conversion (PAS, AIDA, Cialdini, StoryBrand) pour générer du copy 100 % unique.",
      },
    },
    {
      '@type': 'Question',
      name: 'Konvert fonctionne-t-il avec WooCommerce ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Konvert intègre nativement WooCommerce et Shopify. xPage est limité à Shopify.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le score Trustpilot de xPage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'xPage a un score Trustpilot de 2.7/5 (source : Trustpilot, 2026). Les plaintes documentées incluent des bugs mobiles, un support défaillant et une IA décrite comme du template mapping basique.',
      },
    },
  ],
}

function SectionBadge({ label }: { label: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">
      {label}
    </p>
  )
}

function CTAPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, #5B47F5, #7c6af7)',
        boxShadow: '0 4px 20px rgba(91,71,245,0.35)',
      }}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}

function CTASecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold border transition-all hover:bg-gray-50"
      style={{ borderColor: '#5B47F5', color: '#5B47F5' }}
    >
      {children}
    </Link>
  )
}

export default function AlternativeXPagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdFaq) }}
      />

      <div className="bg-white">
        <section className="pt-28 pb-20 px-5 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border mb-6"
              style={{ borderColor: '#5B47F5', color: '#5B47F5', background: 'rgba(91,71,245,0.05)' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Comparaison factuelle — Sources vérifiées
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              L&apos;alternative à xPage{' '}
              <br />
              <span style={{ color: '#5B47F5' }}>qui génère vraiment.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              xPage insère tes données produit dans un template fixe.{' '}
              <strong className="text-gray-700">Konvert génère du copy unique</strong>{' '}
              avec DeepSeek et des frameworks de conversion éprouvés — en 30 secondes.
            </p>

            <div className="inline-flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-3 mb-10">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill={i < 2 ? '#ef4444' : i === 2 ? '#ef444450' : '#e5e7eb'}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-red-600">
                xPage — Trustpilot 2.7/5
              </span>
              <span className="text-xs text-red-400">Bugs documentés · Support défaillant</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAPrimary href="/essai">
                Essayer gratuitement
              </CTAPrimary>
              <CTASecondary href="/demo">
                Voir la démo
              </CTASecondary>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              1 page gratuite · Sans compte · Sans carte bancaire · Résultat en 30 secondes
            </p>
          </div>
        </section>

        <section className="py-16 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge label="Comparaison visuelle" />
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                Template fixe vs{' '}
                <span style={{ color: '#5B47F5' }}>page qui convertit</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                Le même produit AliExpress, généré par les deux outils. La différence est visible en un coup d&apos;œil.
              </p>
            </div>
            <SideBySideMockup />
          </div>
        </section>

        <section className="py-20 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge label="Comparaison complète" />
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                12 critères, une conclusion évidente
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                Données collectées sur sources tierces vérifiées (Trustpilot, reviews indépendants, documentation produit).
                Mise à jour : mai 2026.
              </p>
            </div>
            <ComparisonTable />
            <p className="text-center text-xs text-gray-400 mt-4">
              Sources : Trustpilot · Aichief.com · Skywork.ai · AppSumo reviews · Documentation officielle xPage (2026)
            </p>
          </div>
        </section>

        <section className="py-16 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge label="Avis utilisateurs" />
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                2.7/5 — ce que disent les clients xPage
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                Ces avis sont extraits de Trustpilot. Score confirmé par des sources tierces indépendantes.
                <a
                  href="https://www.trustpilot.com/review/xpage.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5B47F5] ml-1 hover:underline"
                >
                  Voir sur Trustpilot
                </a>
              </p>
            </div>
            <TrustpilotCard />
          </div>
        </section>

        <section className="py-14 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl border p-8"
              style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Transparence
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
                Quand xPage peut suffire
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                On croit à la honnêteté commerciale. xPage a des points forts : pricing entry plus bas,
                onboarding simple, intégration Shopify rapide. Si les critères suivants correspondent
                à ton profil, xPage peut être un point de départ.
              </p>
              <div className="space-y-2.5">
                {[
                  'Tu cherches exclusivement le tarif le plus bas (xPage commence à 23$/mois)',
                  'Tu travailles uniquement en anglais, sur Shopify uniquement',
                  "Tu n'as pas besoin de sections enrichies (témoignages, garantie, story)",
                  'Tu acceptes de gérer les bugs mobiles toi-même',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Si l&apos;un de ces points ne correspond pas — si tu veux du copy qui vend, WooCommerce, le marché
                  francophone ou un support réactif — <strong className="text-gray-900">Konvert est fait pour toi.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge label="Questions fréquentes" />
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                Tout ce qu&apos;il faut savoir{' '}
                <span style={{ color: '#5B47F5' }}>avant de choisir</span>
              </h2>
            </div>
            <FAQComparison />
          </div>
        </section>

        <section className="py-24 px-5 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-3xl p-10 sm:p-16 text-center"
              style={{
                background: 'linear-gradient(135deg, #5B47F5 0%, #7c6af7 50%, #4a38e0 100%)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                Essai gratuit
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
                Génère ta première page
                <br />
                en 30 secondes.
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Colle une URL AliExpress. Konvert génère le titre, la description, les arguments de vente,
                et le design — prêt à publier sur Shopify ou WooCommerce.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {[
                  '1 page gratuite',
                  'Sans compte',
                  'Sans carte bancaire',
                  'Shopify + WooCommerce',
                  'Copy 100 % unique',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/essai"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-black transition-all hover:scale-105"
                  style={{ background: '#b5f23d', color: '#1a1a1a' }}
                >
                  Essayer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border-2 border-white/30 text-white transition-all hover:bg-white/10"
                >
                  Voir la démo d&apos;abord
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 sm:hidden">
          <Link
            href="/essai"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-black text-white"
            style={{
              background: 'linear-gradient(135deg, #5B47F5, #7c6af7)',
              boxShadow: '0 4px 20px rgba(91,71,245,0.4)',
            }}
          >
            Essayer gratuitement — 1 page offerte
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
