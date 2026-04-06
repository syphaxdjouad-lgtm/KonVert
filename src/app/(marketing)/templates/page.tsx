'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, TrendingUp, Zap, Star, Filter,
  ChevronDown, ArrowRight, Sparkles, LayoutTemplate,
} from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface TemplateCard {
  id: string
  name: string
  category: string
  objective: string
  style: string
  convRate: number
  badge: string | null
  description: string
  colors: [string, string, string]
  isNew?: boolean
  isHot?: boolean
  isSeasonal?: boolean
}

const ALL_TEMPLATES: TemplateCard[] = [
  {
    id: 'shein-pro',
    name: 'Shein Pro',
    category: 'E-commerce',
    objective: 'Ventes',
    style: 'Mobile',
    convRate: 18.2,
    badge: 'Populaire',
    description: 'E-commerce mobile-first avec CTA sticky et galerie photos',
    colors: ['#7c3aed', '#16a34a', '#f8f8fc'],
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'Lead Gen',
    objective: 'Leads',
    style: 'Dark',
    convRate: 14.7,
    badge: 'Trending',
    description: 'Fond sombre, typographie bold, accents rouges pour le lifestyle',
    colors: ['#0f0f0f', '#ef4444', '#1a1a1a'],
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    category: 'SaaS',
    objective: 'Inscription',
    style: 'Light',
    convRate: 11.3,
    badge: null,
    description: 'Fond blanc épuré, violet, conversion optimisée SaaS',
    colors: ['#ffffff', '#7c3aed', '#f8fafc'],
  },
  {
    id: 'bold-sales',
    name: 'Bold Sales',
    category: 'Promotions',
    objective: 'Ventes',
    style: 'Bold',
    convRate: 22.1,
    badge: 'Populaire',
    description: 'Orange brûlant, gradient agressif, urgence dropshipping',
    colors: ['#ea580c', '#fbbf24', '#fff7ed'],
  },
  {
    id: 'luxury',
    name: 'Luxury Premium',
    category: 'Services',
    objective: 'Leads',
    style: 'Luxury',
    convRate: 9.8,
    badge: null,
    description: 'Typographie serif, or, premium haute gamme',
    colors: ['#faf9f7', '#c9993a', '#1a1714'],
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    category: 'E-commerce',
    objective: 'Ventes',
    style: 'Mobile',
    convRate: 16.4,
    badge: null,
    description: 'Max 480px, bleu, trafic Facebook et TikTok mobile',
    colors: ['#2563eb', '#eff6ff', '#ffffff'],
  },
  {
    id: 'saas-hero',
    name: 'SaaS Hero',
    category: 'SaaS',
    objective: 'Inscription',
    style: 'Dark',
    convRate: 13.2,
    badge: 'Nouveau',
    description: 'Mesh background animé, mockup dashboard, AI-Native UI',
    colors: ['#0f172a', '#6366f1', '#1e293b'],
    isNew: true,
  },
  {
    id: 'agency-pro',
    name: 'Agency Pro',
    category: 'Services',
    objective: 'Leads',
    style: 'Light',
    convRate: 11.8,
    badge: 'Nouveau',
    description: 'Portfolio agence, case studies, témoignages clients',
    colors: ['#0f172a', '#f59e0b', '#1e293b'],
    isNew: true,
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'Promotions',
    objective: 'Ventes',
    style: 'Bold',
    convRate: 24.6,
    badge: 'Chaud',
    description: 'Countdown 72h, barre de stock, urgence absolue, noir + rouge',
    colors: ['#000000', '#ef4444', '#1a0000'],
    isHot: true,
  },
  {
    id: 'event-signup',
    name: 'Event Signup',
    category: 'Evenements',
    objective: 'Inscription',
    style: 'Light',
    convRate: 19.3,
    badge: null,
    description: 'Page événement, timer, speakers, programme détaillé',
    colors: ['#4f46e5', '#e0e7ff', '#f8fafc'],
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    category: 'Lead Gen',
    objective: 'Leads',
    style: 'Light',
    convRate: 21.7,
    badge: 'Populaire',
    description: 'Formulaire email central, mockup PDF, preuve sociale inline',
    colors: ['#10b981', '#d1fae5', '#f8fafc'],
  },
  {
    id: 'webinar-pro',
    name: 'Webinar Pro',
    category: 'Evenements',
    objective: 'Inscription',
    style: 'Dark',
    convRate: 17.9,
    badge: null,
    description: 'Page webinar avec speaker card, replay, inscription rapide',
    colors: ['#1e1b4b', '#818cf8', '#312e81'],
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'E-commerce',
    objective: 'Ventes',
    style: 'Bold',
    convRate: 20.4,
    badge: 'Nouveau',
    description: 'Lancement produit, waitlist, countdown pre-launch, viral',
    colors: ['#18181b', '#d946ef', '#27272a'],
    isNew: true,
  },
  {
    id: 'consultation',
    name: 'Consultation',
    category: 'Services',
    objective: 'Leads',
    style: 'Light',
    convRate: 15.6,
    badge: null,
    description: 'Réservation appel découverte, calendrier intégré, expertise',
    colors: ['#ffffff', '#0ea5e9', '#f0f9ff'],
  },
  {
    id: 'portfolio-dark',
    name: 'Portfolio Dark',
    category: 'Portfolio',
    objective: 'Leads',
    style: 'Dark',
    convRate: 8.9,
    badge: null,
    description: 'Portfolio créatif dark, galerie projets, contact minimal',
    colors: ['#09090b', '#71717a', '#18181b'],
  },
  {
    id: 'app-download',
    name: 'App Download',
    category: 'SaaS',
    objective: 'Telechargement',
    style: 'Dark',
    convRate: 25.1,
    badge: 'Top',
    description: 'Mockup smartphone CSS, store badges, cyan + violet, ratings',
    colors: ['#1a1a2e', '#00d4ff', '#7b2ff7'],
    isHot: true,
  },
  {
    id: 'newsletter-pro',
    name: 'Newsletter Pro',
    category: 'Lead Gen',
    objective: 'Inscription',
    style: 'Light',
    convRate: 18.8,
    badge: null,
    description: 'Newsletter premium, aperçu édition, social proof énorme',
    colors: ['#fff7ed', '#f97316', '#ffffff'],
  },
  {
    id: 'black-friday',
    name: 'Black Friday',
    category: 'Promotions',
    objective: 'Ventes',
    style: 'Bold',
    convRate: 28.3,
    badge: 'Saisonnier',
    description: 'Noir absolu, offre exceptionnelle, animation glow, record CVR',
    colors: ['#000000', '#fbbf24', '#111111'],
    isSeasonal: true,
  },
]

const CATEGORIES = ['Tous', 'E-commerce', 'Lead Gen', 'Evenements', 'Services', 'SaaS', 'Portfolio', 'Promotions']
const OBJECTIVES = ['Tous', 'Ventes', 'Leads', 'Inscription', 'Telechargement']
const STYLES     = ['Tous', 'Dark', 'Light', 'Bold', 'Luxury', 'Minimal', 'Mobile']
const SORTS      = [
  { value: 'popular', label: 'Populaire' },
  { value: 'conv',    label: 'Meilleur taux' },
  { value: 'new',     label: 'Nouveau' },
]

// ─── BROWSER MOCKUP ───────────────────────────────────────────────────────────

function BrowserMockup({ colors, name, convRate }: { colors: [string, string, string]; name: string; convRate: number }) {
  const [c1, c2, c3] = colors

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ background: c3, border: `1px solid rgba(0,0,0,0.08)` }}>
      {/* Browser chrome */}
      <div className="h-8 flex items-center gap-1.5 px-3" style={{ background: 'rgba(0,0,0,0.12)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
        <div className="flex-1 mx-2 h-4 rounded-md" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Simulated page content */}
      <div className="p-4 space-y-3" style={{ minHeight: '160px', background: c3 }}>
        {/* Hero band */}
        <div className="rounded-lg p-3" style={{ background: c1 }}>
          <div className="h-2.5 w-3/5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.7)' }} />
          <div className="h-1.5 w-2/5 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded-md" style={{ background: c2 }} />
            <div className="h-6 w-14 rounded-md" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>

        {/* Feature row */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-lg p-2.5" style={{ background: `${c1}18`, border: `1px solid ${c1}20` }}>
              <div className="w-5 h-5 rounded mb-1.5" style={{ background: `${c2}40` }} />
              <div className="h-1.5 rounded-full mb-1" style={{ background: `${c1}50`, width: `${70 - i * 10}%` }} />
              <div className="h-1 rounded-full" style={{ background: `${c1}25`, width: '60%' }} />
            </div>
          ))}
        </div>

        {/* CTA band */}
        <div className="rounded-lg p-2 flex items-center gap-2" style={{ background: `${c2}20` }}>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: `${c2}40` }} />
          <div className="h-5 w-16 rounded-md" style={{ background: c2 }} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-5 flex items-center px-3 gap-2" style={{ background: 'rgba(0,0,0,0.08)' }}>
        <div className="h-1 w-8 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }} />
        <div className="h-1 w-12 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }} />
      </div>
    </div>
  )
}

// ─── TEMPLATE CARD ────────────────────────────────────────────────────────────

function TemplateCardItem({ tpl, index }: { tpl: TemplateCard; index: number }) {
  const [hovered, setHovered] = useState(false)

  const badgeStyle: Record<string, { bg: string; color: string }> = {
    'Populaire':  { bg: '#7c3aed', color: '#fff' },
    'Trending':   { bg: '#06b6d4', color: '#fff' },
    'Nouveau':    { bg: '#10b981', color: '#fff' },
    'Chaud':      { bg: '#ef4444', color: '#fff' },
    'Top':        { bg: '#f59e0b', color: '#fff' },
    'Saisonnier': { bg: '#8b5cf6', color: '#fff' },
  }

  const bs = tpl.badge ? badgeStyle[tpl.badge] ?? { bg: '#64748b', color: '#fff' } : null

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: '#ffffff',
        border: hovered ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0',
        boxShadow: hovered ? '0 16px 48px rgba(124,58,237,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview area */}
      <div className="relative overflow-hidden" style={{ background: '#f8fafc' }}>
        <div className="p-3">
          <BrowserMockup colors={tpl.colors} name={tpl.name} convRate={tpl.convRate} />
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-250"
          style={{ opacity: hovered ? 1 : 0, background: 'rgba(15,23,42,0.72)' }}
        >
          <Link
            href={`/templates/${tpl.id}`}
            className="flex items-center gap-1.5 font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all"
            style={{ background: '#ffffff', color: '#1a1a2e' }}
          >
            Aperçu
          </Link>
          <Link
            href={`/dashboard/new?template=${tpl.id}`}
            className="flex items-center gap-1.5 font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all"
            style={{ background: '#7c3aed', color: '#fff' }}
          >
            Utiliser
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Badge */}
        {bs && tpl.badge && (
          <div
            className="absolute top-4 left-4 text-[11px] font-black px-2.5 py-1 rounded-full"
            style={{ background: bs.bg, color: bs.color, letterSpacing: '0.04em' }}
          >
            {tpl.isHot ? '🔥 ' : ''}{tpl.badge}
          </div>
        )}

        {/* Conv rate badge */}
        <div
          className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.92)', color: '#0f172a' }}
        >
          <TrendingUp className="w-3 h-3 text-green-500" />
          {tpl.convRate}%
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-black text-[15px]" style={{ color: '#0f172a' }}>{tpl.name}</h3>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
            style={{ background: '#f1f5f9', color: '#64748b' }}
          >
            {tpl.style}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-md"
            style={{ background: '#f3f0ff', color: '#7c3aed' }}
          >
            {tpl.category}
          </span>
          <span
            className="text-[11px] font-medium"
            style={{ color: '#94a3b8' }}
          >
            {tpl.objective}
          </span>
        </div>

        <p className="text-[12px] leading-relaxed" style={{ color: '#64748b' }}>
          {tpl.description}
        </p>

        {/* Color dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {tpl.colors.map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border"
              style={{ background: c, borderColor: 'rgba(0,0,0,0.1)' }}
            />
          ))}
          <span className="text-[11px] ml-1" style={{ color: '#94a3b8' }}>
            Conv. moy. <strong style={{ color: '#0f172a' }}>{tpl.convRate}%</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: '250+',  label: 'Templates',            icon: LayoutTemplate },
    { value: '40+',   label: 'Catégories',            icon: Filter },
    { value: '5x',    label: 'Meilleur taux de conv.', icon: TrendingUp },
    { value: '30s',   label: 'Pour lancer ta page',   icon: Zap },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
      {stats.map(({ value, label, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 px-4 py-5 rounded-2xl"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          <Icon className="w-5 h-5 mb-1" style={{ color: '#7c3aed' }} />
          <div className="text-2xl font-black" style={{ color: '#0f172a' }}>{value}</div>
          <div className="text-[12px] font-medium text-center" style={{ color: '#64748b' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── FILTER PILL ──────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap"
      style={
        active
          ? { background: '#7c3aed', color: '#fff' }
          : { background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }
      }
    >
      {label}
    </button>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('Tous')
  const [objective, setObjective] = useState('Tous')
  const [style,     setStyle]     = useState('Tous')
  const [sort,      setSort]      = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = ALL_TEMPLATES

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }
    if (category !== 'Tous')  list = list.filter(t => t.category  === category)
    if (objective !== 'Tous') list = list.filter(t => t.objective === objective)
    if (style !== 'Tous')     list = list.filter(t => t.style     === style)

    list = [...list].sort((a, b) => {
      if (sort === 'conv') return b.convRate - a.convRate
      if (sort === 'new')  return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      // popular: badge Populaire + convRate
      const ap = a.badge === 'Populaire' || a.badge === 'Top' ? 1 : 0
      const bp = b.badge === 'Populaire' || b.badge === 'Top' ? 1 : 0
      return bp - ap || b.convRate - a.convRate
    })

    return list
  }, [search, category, objective, style, sort])

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.92)', borderColor: '#e2e8f0' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-[18px] tracking-tight" style={{ color: '#0f172a' }}>
            Konvert<span style={{ color: '#7c3aed' }}>.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-[13px] font-semibold transition-colors"
              style={{ color: '#64748b' }}
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-[13px] font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: '#0f172a', color: '#ffffff' }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div
        className="border-b"
        style={{ background: 'linear-gradient(160deg, #ffffff 0%, #faf5ff 100%)', borderColor: '#e2e8f0' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold mb-6"
            style={{ background: '#f3f0ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Nouveaux templates chaque semaine
          </div>

          <h1
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            style={{ color: '#0f172a', letterSpacing: '-0.03em' }}
          >
            250+ templates qui{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              convertissent
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#64748b' }}>
            Chaque template est optimisé pour maximiser le taux de conversion. Choisis, personnalise avec l'IA, publie en 30 secondes.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Rechercher un template... (Flash Sale, SaaS, Lead Magnet...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-[14px] font-medium outline-none transition-all"
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#0f172a',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onFocus={e => { e.target.style.borderColor = '#7c3aed' }}
              onBlur={e  => { e.target.style.borderColor = '#e2e8f0' }}
            />
          </div>

          <StatsBar />
        </div>
      </div>

      {/* FILTERS + GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-8">

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[12px] font-bold flex-shrink-0" style={{ color: '#94a3b8' }}>CATÉGORIE</span>
            {CATEGORIES.map(c => (
              <FilterPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>

          {/* Second row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={{ background: showFilters ? '#f3f0ff' : '#ffffff', color: showFilters ? '#7c3aed' : '#64748b', border: '1px solid #e2e8f0' }}
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className="w-3.5 h-3.5" style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>

              {/* Result count */}
              <span className="text-[13px] font-medium" style={{ color: '#94a3b8' }}>
                {filtered.length} template{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold" style={{ color: '#94a3b8' }}>TRIER</span>
              <div className="flex gap-1">
                {SORTS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                    style={sort === s.value
                      ? { background: '#0f172a', color: '#fff' }
                      : { background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced filters (collapsible) */}
          {showFilters && (
            <div
              className="rounded-2xl p-5 flex flex-col md:flex-row gap-5"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="flex-1">
                <div className="text-[11px] font-black tracking-widest mb-3" style={{ color: '#94a3b8' }}>OBJECTIF</div>
                <div className="flex flex-wrap gap-2">
                  {OBJECTIVES.map(o => (
                    <FilterPill key={o} label={o} active={objective === o} onClick={() => setObjective(o)} />
                  ))}
                </div>
              </div>
              <div className="w-px" style={{ background: '#f1f5f9' }} />
              <div className="flex-1">
                <div className="text-[11px] font-black tracking-widest mb-3" style={{ color: '#94a3b8' }}>STYLE</div>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <FilterPill key={s} label={s} active={style === s} onClick={() => setStyle(s)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black mb-2" style={{ color: '#0f172a' }}>Aucun résultat</h3>
            <p className="text-[14px] mb-6" style={{ color: '#64748b' }}>Essaie un autre terme ou réinitialise les filtres.</p>
            <button
              onClick={() => { setSearch(''); setCategory('Tous'); setObjective('Tous'); setStyle('Tous') }}
              className="font-semibold px-5 py-2.5 rounded-xl text-[13px]"
              style={{ background: '#7c3aed', color: '#fff' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tpl, i) => (
              <TemplateCardItem key={tpl.id} tpl={tpl} index={i} />
            ))}
          </div>
        )}

        {/* CTA BOTTOM */}
        <div
          className="mt-16 rounded-3xl p-10 md:p-14 text-center"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold mb-5"
            style={{ background: 'rgba(124,58,237,0.2)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <Star className="w-3.5 h-3.5" />
            Template sur mesure
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-3" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
            Vous ne trouvez pas ce qu'il vous faut ?
          </h2>
          <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: '#94a3b8' }}>
            Notre équipe design crée un template 100% custom pour votre secteur et votre marque en 48h.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 font-black text-[15px] px-8 py-4 rounded-2xl transition-all"
            style={{ background: '#7c3aed', color: '#fff', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}
          >
            <Sparkles className="w-5 h-5" />
            Demander un template custom
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-[12px]" style={{ color: '#64748b' }}>
            Réponse sous 24h · Devis gratuit · Satisfaction garantie
          </p>
        </div>
      </div>
    </div>
  )
}
