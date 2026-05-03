import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, ArrowRight, Calendar, Tag } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles, getAllSlugs } from '@/lib/blog'
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from '@/lib/blog/jsonld'
import { safeJsonLd } from '@/lib/security/json-ld'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

/* ── Static params for SSG ────────────────────────────────────────────────── */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

/* ── Dynamic metadata per article ─────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article introuvable' }

  const url = `${APP_URL}/blog/${article.slug}`

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url,
      siteName: 'KONVERT',
      type: 'article',
      publishedTime: article.dateISO,
      modifiedTime: article.updatedISO,
      section: article.category,
      tags: article.keywords,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt }],
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.image],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
      'max-video-preview': -1,
    },
  }
}

/* ── Page component ───────────────────────────────────────────────────────── */

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(slug, 3)

  // JSON-LD structured data
  const articleJsonLd = generateArticleJsonLd(article)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(article)
  const faqJsonLd = generateFaqJsonLd(article)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      )}

      {/* ── HERO ARTICLE ─────────────────────────────────────────────────── */}
      <section
        className="pt-28 pb-12"
        style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-xs" style={{ color: '#6b6b8a' }}>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/60 truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: '#8b8baa' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: '#5B47F5' }}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: '#6b6b8a' }}>
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} de lecture
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: '#6b6b8a' }}>
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-snug mb-5">
            {article.title}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#8b8baa' }}>
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* ── HERO IMAGE ───────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 -mt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-64 sm:h-96 object-cover rounded-b-3xl shadow-lg"
          />
        </div>
      </section>

      {/* ── CONTENU ARTICLE ───────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {/* Auteur */}
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-100">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #8b77ff)' }}
            >
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Equipe KONVERT</p>
              <p className="text-xs text-gray-400">Experts e-commerce & conversion</p>
            </div>
          </div>

          {/* Tags / Keywords */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {article.keywords.slice(0, 5).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500"
              >
                <Tag className="w-3 h-3" />
                {kw}
              </span>
            ))}
          </div>

          {/* Corps de l'article (HTML) */}
          <article
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA inline */}
          <div
            className="mt-14 p-8 rounded-3xl text-center"
            style={{ background: 'linear-gradient(135deg, #0a0a1a, #0f0f2e)' }}
          >
            <p className="text-white font-black text-xl mb-2">
              Testez sur vos produits maintenant
            </p>
            <p className="text-sm mb-6" style={{ color: '#8b8baa' }}>
              1 page gratuite - Aucune carte de credit requise
            </p>
            <Link
              href="/essai"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
            >
              Generer ma premiere page gratuite
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARTICLES LIES ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-14" style={{ background: '#fafafa' }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-6">
              Articles qui pourraient vous interesser
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#5B47F5]/8 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#5B47F5] mb-2 block">
                      {r.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm leading-snug group-hover:text-[#5B47F5] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {r.readTime}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#5B47F5] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0a0a1a' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            La newsletter e-commerce
            <br />
            qui convertit.
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            1 conseil actionnable par semaine. Stratégies, analyses, outils. Rejoignez 4 200+
            e-commerçants.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none text-white"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
            <button
              className="px-6 py-3.5 rounded-full text-sm font-bold text-white whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
            >
              Je m&apos;abonne
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a4a66' }}>
            Zero spam. Desabonnement en 1 clic.
          </p>
        </div>
      </section>
    </>
  )
}
