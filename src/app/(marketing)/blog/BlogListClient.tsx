'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Clock, Search, BookOpen } from 'lucide-react'
import type { BlogArticle } from '@/lib/blog/types'

/* ── Props ────────────────────────────────────────────────────────────────── */

interface Props {
  articles: BlogArticle[]
  categories: string[]
}

/* ── Composant ────────────────────────────────────────────────────────────── */

export default function BlogListClient({ articles, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [search, setSearch] = useState('')

  const featured = articles[0]
  const rest = articles.slice(1)

  const filtered = rest.filter((a) => {
    const matchCat =
      activeCategory === 'Tous' || a.category === activeCategory
    const matchSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="pt-24 pb-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #ffffff 0%, #f5f3ff 45%, #f0fdf4 100%)' }}
      >
        {/* Halo droit subtil */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(91,71,245,0.06) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        {/* Halo gauche subtil */}
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Colonne texte + search */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
                style={{
                  background: 'rgba(91,71,245,0.08)',
                  borderColor: 'rgba(91,71,245,0.2)',
                  color: '#5B47F5',
                }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Blog & Ressources
              </div>

              <h1
                className="text-4xl sm:text-5xl font-black mb-5 leading-tight"
                style={{ color: '#0f0f2e' }}
              >
                Apprenez a vendre plus,
                <br />
                <span style={{ color: '#5B47F5' }}>sans travailler plus.</span>
              </h1>
              <p
                className="text-lg max-w-xl mb-10 leading-relaxed"
                style={{ color: '#6b7280' }}
              >
                Guides SEO, tutoriels Shopify, strategies de conversion et conseils
                dropshipping pour booster vos ventes e-commerce.
              </p>

              {/* Search */}
              <div className="max-w-md relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: '#9ca3af' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none border transition-all"
                  style={{
                    background: '#ffffff',
                    borderColor: '#e0e7ff',
                    color: '#0f0f2e',
                    boxShadow: '0 2px 12px rgba(91,71,245,0.08)',
                  }}
                />
              </div>
            </div>

            {/* Colonne illustration SVG */}
            <div className="hidden lg:flex justify-center items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/blog-hero.svg"
                alt="Dashboard e-commerce avec graphiques de croissance"
                className="w-full max-w-[580px]"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(91,71,245,0.12))' }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── ARTICLE VEDETTE ───────────────────────────────────────────────── */}
      {featured && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-5">
              Article a la une
            </p>

            <Link
              href={`/blog/${featured.slug}`}
              className="group grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-[#5B47F5]/10 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="w-full h-64 lg:h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#5B47F5] text-white">
                    Nouveau
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {featured.category}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 leading-snug group-hover:text-[#5B47F5] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime} de lecture
                    </span>
                    <span>-</span>
                    <span>{featured.date}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-[#5B47F5] group-hover:translate-x-1 transition-transform">
                    Lire <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── FILTRES + GRID ────────────────────────────────────────────────── */}
      <section className="py-12" style={{ background: '#fafafa' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Filtres categories */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                style={
                  activeCategory === cat
                    ? {
                        background: '#5B47F5',
                        color: '#fff',
                        borderColor: '#5B47F5',
                      }
                    : {
                        background: '#fff',
                        color: '#6b7280',
                        borderColor: '#e5e7eb',
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid articles */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Aucun article trouve.</p>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('Tous')
                }}
                className="mt-3 text-sm text-[#5B47F5] font-semibold hover:underline"
              >
                Reinitialiser
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#5B47F5]/8 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />

                  {/* Contenu */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-[#5B47F5] mb-2">
                      {article.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug text-sm group-hover:text-[#5B47F5] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                      <span className="text-xs text-gray-400">{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0a0a1a' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            La newsletter e-commerce
            <br />
            qui convertit.
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            1 conseil actionnable par semaine. Strategies, analyses, outils.
            Rejoignez 4 200+ e-commercants.
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
