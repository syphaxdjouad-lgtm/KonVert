'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Clock, Tag, Search, TrendingUp, BookOpen, Zap, BarChart3 } from 'lucide-react'

/* ── DONNÉES ───────────────────────────────────────────────────────────────── */

const CATEGORIES = ['Tous', 'E-commerce', 'Conversion', 'Shopify', 'Marketing', 'IA & Tech', 'Tutoriels']

const FEATURED = {
  slug:      'comment-tripler-taux-conversion-landing-page',
  title:     'Comment tripler votre taux de conversion avec une landing page optimisée',
  excerpt:   "Le taux de conversion moyen d'un e-commerce est de 2,3%. Les meilleurs atteignent 8-12%. On vous explique exactement ce qui fait la différence — et comment le reproduire en 30 minutes.",
  category:  'Conversion',
  readTime:  '8 min',
  date:      '2 janvier 2025',
  image:     'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80',
  tag:       'Guide complet',
  tagColor:  'bg-[#5B47F5] text-white',
}

const ARTICLES = [
  {
    slug:     'aliexpress-a-shopify-en-30-secondes',
    title:    'D\'AliExpress à Shopify en 30 secondes — le guide complet',
    excerpt:  'Comment importer, générer et publier une page produit haute conversion depuis AliExpress sans aucune compétence technique.',
    category: 'Tutoriels',
    readTime: '6 min',
    date:     '28 décembre 2024',
    icon:     Zap,
    iconBg:   'bg-[#5B47F5]/10',
    iconCol:  'text-[#5B47F5]',
  },
  {
    slug:     'meilleurs-templates-dropshipping-2025',
    title:    'Les 5 templates qui convertissent le mieux en dropshipping (2025)',
    excerpt:  'Analyse de 50 000 pages générées avec KONVERT : quels templates donnent les meilleurs résultats par niche.',
    category: 'Conversion',
    readTime: '5 min',
    date:     '22 décembre 2024',
    icon:     TrendingUp,
    iconBg:   'bg-emerald-50',
    iconCol:  'text-emerald-500',
  },
  {
    slug:     'shopify-vs-woocommerce-2025',
    title:    'Shopify vs WooCommerce en 2025 — lequel choisir pour votre boutique ?',
    excerpt:  'Comparatif exhaustif des deux plateformes : coûts, fonctionnalités, SEO, intégrations. Verdict selon votre situation.',
    category: 'Shopify',
    readTime: '9 min',
    date:     '18 décembre 2024',
    icon:     BookOpen,
    iconBg:   'bg-blue-50',
    iconCol:  'text-blue-500',
  },
  {
    slug:     'ia-ecommerce-claude-vs-chatgpt',
    title:    'Claude AI vs ChatGPT pour l\'e-commerce — quel modèle génère le meilleur copy ?',
    excerpt:  "On a testé les deux sur 200 fiches produit. Les résultats sont sans appel — voici pourquoi KONVERT utilise Claude.",
    category: 'IA & Tech',
    readTime: '7 min',
    date:     '15 décembre 2024',
    icon:     BarChart3,
    iconBg:   'bg-purple-50',
    iconCol:  'text-purple-500',
  },
  {
    slug:     'ab-testing-pages-produit',
    title:    'A/B testing sur vos pages produit — le guide pratique pour non-data scientists',
    excerpt:  "Vous n'avez pas besoin d'un data scientist pour faire de l'A/B testing. Voici comment tester et interpréter les résultats simplement.",
    category: 'Marketing',
    readTime: '6 min',
    date:     '10 décembre 2024',
    icon:     Zap,
    iconBg:   'bg-orange-50',
    iconCol:  'text-orange-500',
  },
  {
    slug:     'seo-pages-produit-dropshipping',
    title:    'SEO pour pages produit dropshipping — comment ranker sans stock',
    excerpt:  "Le dropshipping a mauvaise réputation en SEO. C'est faux. Voici comment générer du trafic organique gratuit sur vos pages produit.",
    category: 'E-commerce',
    readTime: '8 min',
    date:     '5 décembre 2024',
    icon:     TrendingUp,
    iconBg:   'bg-teal-50',
    iconCol:  'text-teal-500',
  },
]

/* ── COMPOSANT ─────────────────────────────────────────────────────────────── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [search, setSearch] = useState('')

  const filtered = ARTICLES.filter((a) => {
    const matchCat    = activeCategory === 'Tous' || a.category === activeCategory
    const matchSearch = search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <BookOpen className="w-3.5 h-3.5" />
            Blog & Ressources
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Apprenez à vendre plus,<br />
            <span style={{ color: '#8b77ff' }}>sans travailler plus.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#8b8baa' }}>
            Guides pratiques, analyses data et stratégies testées pour booster vos conversions e-commerce.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b6b8a' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none border transition-all"
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#fff',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── ARTICLE VEDETTE ───────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-5">Article à la une</p>

          <Link
            href={`/blog/${FEATURED.slug}`}
            className="group grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-[#5B47F5]/10 transition-all duration-300"
          >
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURED.image}
              alt={FEATURED.title}
              className="w-full h-64 lg:h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Contenu */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${FEATURED.tagColor}`}>{FEATURED.tag}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{FEATURED.category}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4 leading-snug group-hover:text-[#5B47F5] transition-colors">
                {FEATURED.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{FEATURED.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{FEATURED.readTime} de lecture</span>
                  <span>·</span>
                  <span>{FEATURED.date}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-[#5B47F5] group-hover:translate-x-1 transition-transform">
                  Lire <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FILTRES + GRID ────────────────────────────────────────────────── */}
      <section className="py-12" style={{ background: '#fafafa' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Filtres catégories */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                style={
                  activeCategory === cat
                    ? { background: '#5B47F5', color: '#fff', borderColor: '#5B47F5' }
                    : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid articles */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Aucun article trouvé.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('Tous') }} className="mt-3 text-sm text-[#5B47F5] font-semibold hover:underline">
                Réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => {
                const { icon: Icon } = article
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#5B47F5]/8 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                  >
                    {/* Visual header */}
                    <div className="h-36 relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a, #0f0f2e)' }}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${article.iconBg}`}>
                        <Icon className={`w-6 h-6 ${article.iconCol}`} />
                      </div>
                      <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 font-medium">
                        {article.category}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug text-sm group-hover:text-[#5B47F5] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />{article.readTime}
                        </span>
                        <span className="text-xs text-gray-400">{article.date}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0a0a1a' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="text-3xl mb-3">📬</div>
          <h2 className="text-3xl font-black text-white mb-3">
            La newsletter e-commerce<br />qui convertit.
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            1 conseil actionnable par semaine. Stratégies, analyses, outils. Rejoignez 4 200+ e-commerçants.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <button
              className="px-6 py-3.5 rounded-full text-sm font-bold text-white whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
            >
              Je m'abonne →
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a4a66' }}>Zéro spam. Désabonnement en 1 clic.</p>
        </div>
      </section>
    </>
  )
}
