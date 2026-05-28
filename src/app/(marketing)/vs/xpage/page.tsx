import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import ComparisonTable from '@/components/marketing/comparison/ComparisonTable'
import TrustpilotCard from '@/components/marketing/comparison/TrustpilotCard'
import SideBySideMockup from '@/components/marketing/comparison/SideBySideMockup'
import FAQComparison from '@/components/marketing/comparison/FAQComparison'
import { safeJsonLd } from '@/lib/security/json-ld'

export const metadata: Metadata = {
  title: 'Konvert vs xPage — The Real Alternative',
  description:
    'Konvert vs xPage: a factual comparison. xPage uses basic template mapping (Trustpilot 2.7/5). Konvert generates unique AI copy with DeepSeek, supports WooCommerce and FR/MENA markets.',
  keywords: [
    'xpage alternative',
    'konvert vs xpage',
    'xpage competitor',
    'best xpage alternative',
    'ai product landing page generator',
    'aliexpress landing page shopify',
    'aliexpress landing page woocommerce',
  ],
  alternates: {
    canonical: 'https://konvertpilot.com/vs/xpage',
    languages: {
      fr: 'https://konvertpilot.com/alternative-a-xpage',
      en: 'https://konvertpilot.com/vs/xpage',
    },
  },
  openGraph: {
    title: 'Konvert vs xPage — Full Comparison',
    description:
      'xPage: Trustpilot 2.7/5, basic template mapping. Konvert: unique AI copy, WooCommerce, French-speaking market. Free trial — results in 30 seconds.',
    url: 'https://konvertpilot.com/vs/xpage',
    siteName: 'Konvert',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konvert vs xPage — The Factual Comparison',
    description:
      'xPage generates templates, Konvert generates copy. xPage Trustpilot: 2.7/5. Try Konvert for free.',
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
    'AI product landing page generator for Shopify and WooCommerce. Generates unique copy with DeepSeek and PAS/AIDA/Cialdini conversion frameworks.',
  url: 'https://konvertpilot.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    description: '1 free page, no account required',
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
      name: 'What is the real difference between Konvert and xPage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'xPage uses template mapping: scraped fields inserted into a fixed model. Konvert uses DeepSeek with conversion frameworks (PAS, AIDA, Cialdini, StoryBrand) to generate 100% unique copy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Konvert work with WooCommerce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Konvert natively integrates both WooCommerce and Shopify. xPage is limited to Shopify only.',
      },
    },
    {
      '@type': 'Question',
      name: "What is xPage's Trustpilot score?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'xPage has a Trustpilot score of 2.7/5 (source: Trustpilot, 2026). Documented complaints include mobile bugs, poor support, and an AI described as basic template mapping.',
      },
    },
  ],
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

export default function VsXPagePage() {
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
              Factual comparison — verified sources
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              The xPage alternative{' '}
              <br />
              <span style={{ color: '#5B47F5' }}>that actually generates.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              xPage inserts your product data into a fixed template.{' '}
              <strong className="text-gray-700">Konvert generates unique copy</strong>{' '}
              with DeepSeek and proven conversion frameworks — in 30 seconds.
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
              <span className="text-xs text-red-400">Documented bugs · Poor support</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAPrimary href="/essai">
                Try for free
              </CTAPrimary>
              <CTASecondary href="/demo">
                Watch the demo
              </CTASecondary>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              1 free page · No account · No credit card · Results in 30 seconds
            </p>
          </div>
        </section>

        <section className="py-16 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">Visual comparison</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                Fixed template vs{' '}
                <span style={{ color: '#5B47F5' }}>page that converts</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                Same AliExpress product, generated by both tools. The difference is visible at a glance.
              </p>
            </div>
            <SideBySideMockup />
          </div>
        </section>

        <section className="py-20 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">Full comparison</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                12 criteria, one clear winner
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                Data collected from verified third-party sources (Trustpilot, independent reviews, product documentation).
                Updated: May 2026.
              </p>
            </div>
            <ComparisonTable />
            <p className="text-center text-xs text-gray-400 mt-4">
              Sources: Trustpilot · Aichief.com · Skywork.ai · AppSumo reviews · xPage official documentation (2026)
            </p>
          </div>
        </section>

        <section className="py-16 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">User reviews</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                2.7/5 — What xPage customers say
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
                These reviews are extracted from Trustpilot. Score confirmed by independent third-party sources.
                <a
                  href="https://www.trustpilot.com/review/xpage.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5B47F5] ml-1 hover:underline"
                >
                  View on Trustpilot
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
                Transparency
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
                When xPage might be enough
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                We believe in commercial honesty. xPage has strengths: lower entry price,
                simple onboarding, quick Shopify integration. If the following criteria match your profile,
                xPage can be a starting point.
              </p>
              <div className="space-y-2.5">
                {[
                  "You're strictly looking for the lowest price (xPage starts at $23/month)",
                  'You work exclusively in English, on Shopify only',
                  "You don't need enriched sections (testimonials, guarantee, story)",
                  "You're comfortable handling mobile rendering bugs yourself",
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
                  If any of these don&apos;t match — if you want copy that converts, WooCommerce support,
                  the French-speaking market or responsive support — <strong className="text-gray-900">Konvert is for you.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 sm:px-8 bg-gray-50/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                Everything you need to know{' '}
                <span style={{ color: '#5B47F5' }}>before choosing</span>
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
                Free trial
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
                Generate your first page
                <br />
                in 30 seconds.
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Paste an AliExpress URL. Konvert generates the headline, description, selling points,
                and design — ready to publish on Shopify or WooCommerce.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {[
                  '1 free page',
                  'No account',
                  'No credit card',
                  'Shopify + WooCommerce',
                  '100% unique copy',
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
                  Try for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border-2 border-white/30 text-white transition-all hover:bg-white/10"
                >
                  Watch the demo first
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
            Try for free — 1 page on us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
