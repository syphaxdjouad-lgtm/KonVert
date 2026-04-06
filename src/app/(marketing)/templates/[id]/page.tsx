'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, TrendingUp, Monitor, Smartphone, Tablet,
  Tag, ExternalLink, Sparkles, Star, Check,
  ChevronRight, ArrowRight,
} from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface TemplateDetail {
  id: string
  name: string
  category: string
  objective: string
  style: string
  convRate: number
  badge: string | null
  description: string
  longDesc: string
  colors: [string, string, string]
  tags: string[]
  industries: string[]
  devices: string[]
  stats: { label: string; value: string }[]
  isNew?: boolean
  isHot?: boolean
}

const TEMPLATES_MAP: Record<string, TemplateDetail> = {
  'shein-pro': {
    id: 'shein-pro', name: 'Shein Pro', category: 'E-commerce', objective: 'Ventes', style: 'Mobile',
    convRate: 18.2, badge: 'Populaire', colors: ['#7c3aed', '#16a34a', '#f8f8fc'],
    description: 'E-commerce mobile-first avec CTA sticky et galerie photos',
    longDesc: 'Template inspiré des meilleurs stores fashion et e-commerce asiatiques. Navigation sticky, galerie de produits swipeable, sélecteur de quantité, avis clients et FAQ intégrée. Optimisé pour les conversions mobiles depuis Facebook Ads et TikTok.',
    tags: ['#ecommerce', '#mobile', '#shopify', '#fashion', '#sticky-cta'],
    industries: ['Mode', 'Accessoires', 'Beauté', 'Lifestyle'],
    devices: ['Mobile', 'Tablette', 'Desktop'],
    stats: [{ label: 'Conv. moyenne', value: '18.2%' }, { label: 'CTA sticky', value: 'Oui' }, { label: 'Galerie', value: '5 photos' }, { label: 'FAQ intégrée', value: 'Oui' }],
  },
  'minimal-dark': {
    id: 'minimal-dark', name: 'Minimal Dark', category: 'Lead Gen', objective: 'Leads', style: 'Dark',
    convRate: 14.7, badge: 'Trending', colors: ['#0f0f0f', '#ef4444', '#1a1a1a'],
    description: 'Fond sombre, typographie bold, accents rouges lifestyle',
    longDesc: 'Design sombre et épuré, typographie bold, accents rouges pour les produits tech et lifestyle premium. Split layout avec image à droite, card bénéfices, FAQ. Idéal pour les produits qui veulent projeter force et autorité.',
    tags: ['#dark', '#lifestyle', '#tech', '#minimal', '#bold'],
    industries: ['Tech', 'Gaming', 'Sport', 'Lifestyle'],
    devices: ['Desktop', 'Tablette', 'Mobile'],
    stats: [{ label: 'Conv. moyenne', value: '14.7%' }, { label: 'Layout', value: 'Split 2 col.' }, { label: 'Mode', value: 'Dark' }, { label: 'FAQ', value: 'Incluse' }],
  },
  'clean-white': {
    id: 'clean-white', name: 'Clean White', category: 'SaaS', objective: 'Inscription', style: 'Light',
    convRate: 11.3, badge: null, colors: ['#ffffff', '#7c3aed', '#f8fafc'],
    description: 'Fond blanc épuré, violet, standard SaaS et produits numériques',
    longDesc: 'Le standard du SaaS. Fond blanc, accent violet, hiérarchie typographique claire. Section bénéfices, FAQ, double CTA. Optimisé pour les produits numériques, formations et abonnements.',
    tags: ['#light', '#saas', '#violet', '#epure', '#conversion'],
    industries: ['SaaS', 'Formation', 'Digital', 'Abonnement'],
    devices: ['Desktop', 'Mobile', 'Tablette'],
    stats: [{ label: 'Conv. moyenne', value: '11.3%' }, { label: 'Mode', value: 'Light' }, { label: 'CTA', value: 'Double' }, { label: 'Animation', value: 'Subtile' }],
  },
  'bold-sales': {
    id: 'bold-sales', name: 'Bold Sales', category: 'Promotions', objective: 'Ventes', style: 'Bold',
    convRate: 22.1, badge: 'Populaire', colors: ['#ea580c', '#fbbf24', '#fff7ed'],
    description: 'Orange brûlant, gradient agressif, urgence dropshipping maximale',
    longDesc: 'Le template roi du dropshipping. Orange + jaune, gradient hero, prix barré visible, urgence textuelle. Hero plein écran, section bénéfices, double CTA. Taux de conversion record pour les offres limitées et promotions flash.',
    tags: ['#bold', '#orange', '#dropshipping', '#urgence', '#promo'],
    industries: ['Dropshipping', 'E-commerce', 'Promotions', 'Flash sales'],
    devices: ['Mobile', 'Desktop', 'Tablette'],
    stats: [{ label: 'Conv. moyenne', value: '22.1%' }, { label: 'Mode', value: 'Bold' }, { label: 'Urgence', value: 'Intégrée' }, { label: 'Gradient', value: 'Orange/Rouge' }],
    isHot: true,
  },
  'luxury': {
    id: 'luxury', name: 'Luxury Premium', category: 'Services', objective: 'Leads', style: 'Luxury',
    convRate: 9.8, badge: null, colors: ['#faf9f7', '#c9993a', '#1a1714'],
    description: 'Typographie serif, or, premium haute gamme',
    longDesc: 'Positionnement haut de gamme. Typographie Georgia/serif, accents or, espacement généreux. Layout centré élégant, liste bénéfices avec losanges dorés, FAQ stylisée. Pour les marques qui veulent justifier un prix premium.',
    tags: ['#luxury', '#gold', '#serif', '#premium', '#high-end'],
    industries: ['Luxe', 'Bijoux', 'Cosmétiques premium', 'Coaching'],
    devices: ['Desktop', 'Tablette', 'Mobile'],
    stats: [{ label: 'Conv. moyenne', value: '9.8%' }, { label: 'Typographie', value: 'Serif' }, { label: 'Accent', value: 'Or #c9993a' }, { label: 'Layout', value: 'Centré' }],
  },
  'mobile-first': {
    id: 'mobile-first', name: 'Mobile First', category: 'E-commerce', objective: 'Ventes', style: 'Mobile',
    convRate: 16.4, badge: null, colors: ['#2563eb', '#eff6ff', '#ffffff'],
    description: 'Max 480px, bleu, trafic Facebook et TikTok mobile',
    longDesc: 'Conçu pour le trafic mobile pur. Max-width 480px, CTA pleine largeur, typographie compacte. Optimisé pour les campagnes Facebook et TikTok avec des landing pages ultra-légères et rapides.',
    tags: ['#mobile', '#facebook-ads', '#tiktok', '#bleu', '#compact'],
    industries: ['E-commerce', 'Dropshipping', 'B2C'],
    devices: ['Mobile', 'Tablette'],
    stats: [{ label: 'Conv. moyenne', value: '16.4%' }, { label: 'Max-width', value: '480px' }, { label: 'CTA', value: 'Full width' }, { label: 'Poids', value: 'Ultra léger' }],
  },
  'saas-hero': {
    id: 'saas-hero', name: 'SaaS Hero', category: 'SaaS', objective: 'Inscription', style: 'Dark',
    convRate: 13.2, badge: 'Nouveau', colors: ['#0f172a', '#6366f1', '#1e293b'],
    description: 'Mesh background animé CSS, mockup dashboard, AI-Native UI',
    longDesc: 'Design AI-Native avec mesh background animé CSS, mockup dashboard simulé, features grid 3 colonnes, pricing card et témoignages. Slate-950 + indigo pour un look SaaS moderne. Idéal pour les produits tech et plateformes IA.',
    tags: ['#saas', '#dark', '#indigo', '#ai-native', '#mesh-bg'],
    industries: ['SaaS', 'IA', 'Productivité', 'B2B'],
    devices: ['Desktop', 'Tablette', 'Mobile'],
    stats: [{ label: 'Conv. moyenne', value: '13.2%' }, { label: 'Mode', value: 'Dark SaaS' }, { label: 'Mockup', value: 'Dashboard CSS' }, { label: 'Sections', value: '5 incluses' }],
    isNew: true,
  },
  'flash-sale': {
    id: 'flash-sale', name: 'Flash Sale', category: 'Promotions', objective: 'Ventes', style: 'Bold',
    convRate: 24.6, badge: 'Chaud', colors: ['#000000', '#ef4444', '#1a0000'],
    description: 'Countdown 72h JS, barre de stock, urgence absolue, CVR record',
    longDesc: 'L\'arme secrète des ventes flash. Countdown JavaScript 72h, barre de stock animée, urgency bar en haut, pulse rouge. Fond noir absolu pour maximiser le contraste et l\'impact émotionnel. Taux de conversion parmi les plus élevés du marché.',
    tags: ['#flash-sale', '#noir', '#countdown', '#urgence', '#stock-bar'],
    industries: ['E-commerce', 'Promotions', 'Black Friday', 'Flash sales'],
    devices: ['Mobile', 'Desktop', 'Tablette'],
    stats: [{ label: 'Conv. moyenne', value: '24.6%' }, { label: 'Countdown', value: '72h JS' }, { label: 'Urgence', value: 'Maximale' }, { label: 'Mode', value: 'Noir' }],
    isHot: true,
  },
  'lead-magnet': {
    id: 'lead-magnet', name: 'Lead Magnet', category: 'Lead Gen', objective: 'Leads', style: 'Light',
    convRate: 21.7, badge: 'Populaire', colors: ['#10b981', '#d1fae5', '#f8fafc'],
    description: 'Formulaire email central, mockup PDF CSS, preuve sociale inline',
    longDesc: 'Conçu pour la capture email. Formulaire 2 champs centré, mockup PDF simulé en CSS, avatars preuve sociale inline, compteur de téléchargements. Vert emerald, fond blanc cassé. Idéal pour les guides, e-books et newsletters.',
    tags: ['#lead-gen', '#email', '#pdf', '#vert', '#formulaire'],
    industries: ['Marketing', 'Formation', 'Newsletter', 'Lead gen'],
    devices: ['Desktop', 'Mobile', 'Tablette'],
    stats: [{ label: 'Conv. moyenne', value: '21.7%' }, { label: 'Formulaire', value: '2 champs' }, { label: 'Social proof', value: 'Inline' }, { label: 'Objectif', value: 'Email' }],
  },
  'app-download': {
    id: 'app-download', name: 'App Download', category: 'SaaS', objective: 'Telechargement', style: 'Dark',
    convRate: 25.1, badge: 'Top', colors: ['#1a1a2e', '#00d4ff', '#7b2ff7'],
    description: 'Mockup smartphone CSS, store badges, cyan + violet, screenshots',
    longDesc: 'Template de référence pour les apps mobiles. Gradient navy, mockup iPhone/Android en pur CSS, store badges App Store + Google Play stylisés, carousel screenshots simulé, features grid. Cyan + violet pour un look tech premium.',
    tags: ['#app', '#mobile', '#ios', '#android', '#store'],
    industries: ['App mobile', 'SaaS', 'Tech', 'Productivité'],
    devices: ['Desktop', 'Tablette', 'Mobile'],
    stats: [{ label: 'Conv. moyenne', value: '25.1%' }, { label: 'Store badges', value: 'iOS + Android' }, { label: 'Mockup', value: 'Smartphone CSS' }, { label: 'Screenshots', value: 'Carousel' }],
    isHot: true,
  },
}

const RELATED: Record<string, string[]> = {
  'shein-pro':    ['mobile-first', 'bold-sales', 'flash-sale'],
  'minimal-dark': ['saas-hero', 'app-download', 'flash-sale'],
  'clean-white':  ['saas-hero', 'lead-magnet', 'luxury'],
  'bold-sales':   ['flash-sale', 'shein-pro', 'mobile-first'],
  'luxury':       ['clean-white', 'consultation', 'minimal-dark'],
  'mobile-first': ['shein-pro', 'bold-sales', 'flash-sale'],
  'saas-hero':    ['app-download', 'minimal-dark', 'clean-white'],
  'flash-sale':   ['bold-sales', 'shein-pro', 'app-download'],
  'lead-magnet':  ['clean-white', 'saas-hero', 'newsletter-pro'],
  'app-download': ['saas-hero', 'minimal-dark', 'lead-magnet'],
}

// ─── BROWSER PREVIEW ──────────────────────────────────────────────────────────

function FullPreview({ tpl }: { tpl: TemplateDetail }) {
  const [c1, c2, c3] = tpl.colors

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ background: c3, border: '1.5px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
    >
      {/* Browser chrome */}
      <div className="h-10 flex items-center gap-2 px-4" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
        </div>
        <div className="flex-1 mx-3 h-5 rounded-lg flex items-center px-3 gap-2" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.2)' }} />
          <div className="h-1.5 w-32 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }} />
        </div>
      </div>

      {/* Page content simulation */}
      <div className="p-8 space-y-6" style={{ minHeight: '480px', background: c3 }}>

        {/* Nav bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-16 rounded-full" style={{ background: c1 }} />
          <div className="flex gap-2">
            <div className="h-2.5 w-10 rounded-full" style={{ background: `${c1}30` }} />
            <div className="h-2.5 w-10 rounded-full" style={{ background: `${c1}30` }} />
            <div className="h-7 w-20 rounded-lg" style={{ background: c2 }} />
          </div>
        </div>

        {/* Hero */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{ background: c1, minHeight: '200px' }}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 80% 20%, ${c2}, transparent)` }} />
          <div className="relative z-10 max-w-sm">
            <div className="h-3 w-24 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <div className="h-5 w-4/5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.8)' }} />
            <div className="h-5 w-3/5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.7)' }} />
            <div className="h-3 w-full rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.35)' }} />
            <div className="h-3 w-4/5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.25)' }} />
            <div className="flex gap-3">
              <div className="h-9 w-28 rounded-xl" style={{ background: c2 }} />
              <div className="h-9 w-20 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>
          {/* Decorative card right */}
          <div className="absolute right-8 top-8 w-40 rounded-xl p-4 hidden md:block" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="h-6 w-16 rounded mb-2" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="h-2 w-full rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="h-2 w-3/4 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-4">
          {[80, 65, 90].map((w, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: `${c1}12`, border: `1px solid ${c1}20` }}
            >
              <div className="w-8 h-8 rounded-lg mb-3" style={{ background: `${c2}40` }} />
              <div className="h-2.5 rounded-full mb-2" style={{ background: `${c1}50`, width: `${w}%` }} />
              <div className="h-2 rounded-full mb-1" style={{ background: `${c1}25`, width: '90%' }} />
              <div className="h-2 rounded-full" style={{ background: `${c1}20`, width: '70%' }} />
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: `linear-gradient(135deg, ${c1}20, ${c2}15)`, border: `1px solid ${c1}25` }}
        >
          <div className="h-4 w-48 rounded-full mx-auto mb-3" style={{ background: `${c1}50` }} />
          <div className="h-3 w-64 rounded-full mx-auto mb-5" style={{ background: `${c1}25` }} />
          <div className="h-10 w-36 rounded-xl mx-auto" style={{ background: c2 }} />
        </div>
      </div>
    </div>
  )
}

// ─── RELATED CARD ─────────────────────────────────────────────────────────────

function RelatedCard({ id }: { id: string }) {
  const tpl = TEMPLATES_MAP[id]
  if (!tpl) return null

  return (
    <Link
      href={`/templates/${id}`}
      className="block rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: '#ffffff', border: '1.5px solid #e2e8f0' }}
    >
      {/* Mini preview */}
      <div className="p-3" style={{ background: '#f8fafc' }}>
        <div className="w-full rounded-lg overflow-hidden" style={{ background: tpl.colors[2], border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="h-5 flex items-center gap-1 px-2" style={{ background: 'rgba(0,0,0,0.08)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-70" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70" />
          </div>
          <div className="p-2.5 space-y-1.5">
            <div className="h-10 rounded-lg" style={{ background: tpl.colors[0] }} />
            <div className="grid grid-cols-3 gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="h-6 rounded-md" style={{ background: `${tpl.colors[0]}18`, border: `1px solid ${tpl.colors[0]}20` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-between mb-1">
          <div className="font-black text-[14px]" style={{ color: '#0f172a' }}>{tpl.name}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#0f172a' }}>
            <TrendingUp className="w-3 h-3 text-green-500" />
            {tpl.convRate}%
          </div>
        </div>
        <div className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
          {tpl.category} · {tpl.style}
        </div>
      </div>
    </Link>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TemplateDetailPage() {
  const params = useParams()
  const id     = typeof params?.id === 'string' ? params.id : ''

  const tpl     = TEMPLATES_MAP[id]
  const related = (RELATED[id] ?? Object.keys(TEMPLATES_MAP).filter(k => k !== id).slice(0, 3))

  const [deviceTab, setDeviceTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!tpl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#0f172a' }}>Template introuvable</h2>
        <p className="text-[14px] mb-6" style={{ color: '#64748b' }}>Cet identifiant ne correspond à aucun template disponible.</p>
        <Link
          href="/templates"
          className="flex items-center gap-2 font-bold text-[14px] px-5 py-3 rounded-xl"
          style={{ background: '#7c3aed', color: '#fff' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux templates
        </Link>
      </div>
    )
  }

  const badgeStyle: Record<string, { bg: string; color: string }> = {
    'Populaire':  { bg: '#7c3aed', color: '#fff' },
    'Trending':   { bg: '#06b6d4', color: '#fff' },
    'Nouveau':    { bg: '#10b981', color: '#fff' },
    'Chaud':      { bg: '#ef4444', color: '#fff' },
    'Top':        { bg: '#f59e0b', color: '#fff' },
    'Saisonnier': { bg: '#8b5cf6', color: '#fff' },
  }
  const bs = tpl.badge ? badgeStyle[tpl.badge] : null

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderColor: '#e2e8f0' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
              style={{ color: '#64748b' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Templates
            </Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#cbd5e1' }} />
            <span className="text-[13px] font-black" style={{ color: '#0f172a' }}>{tpl.name}</span>
          </div>
          <Link
            href="/login"
            className="text-[13px] font-bold"
            style={{ color: '#64748b' }}
          >
            Se connecter
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Preview (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Breadcrumb + title */}
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {tpl.name}
                </h1>
                {tpl.badge && bs && (
                  <span className="text-[12px] font-black px-3 py-1 rounded-full" style={{ background: bs.bg, color: bs.color }}>
                    {tpl.isHot ? '🔥 ' : ''}{tpl.badge}
                  </span>
                )}
                <span
                  className="text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: '#f3f0ff', color: '#7c3aed' }}
                >
                  {tpl.category}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed" style={{ color: '#64748b' }}>
                {tpl.longDesc}
              </p>
            </div>

            {/* Device tabs */}
            <div className="flex items-center gap-2">
              {([
                { id: 'desktop', label: 'Desktop', icon: Monitor },
                { id: 'tablet',  label: 'Tablette', icon: Tablet },
                { id: 'mobile',  label: 'Mobile',   icon: Smartphone },
              ] as const).map(({ id: dId, label, icon: Icon }) => (
                <button
                  key={dId}
                  onClick={() => setDeviceTab(dId)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                  style={deviceTab === dId
                    ? { background: '#0f172a', color: '#fff' }
                    : { background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div
              className="transition-all duration-300"
              style={deviceTab === 'mobile' ? { maxWidth: '375px', margin: '0 auto' } : deviceTab === 'tablet' ? { maxWidth: '768px', margin: '0 auto' } : {}}
            >
              <FullPreview tpl={tpl} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tpl.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ background: '#f1f5f9', color: '#64748b' }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Panel (1/3) */}
          <div className="space-y-5">

            {/* Main CTA card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
            >
              {/* Color strip */}
              <div
                className="h-2"
                style={{ background: `linear-gradient(90deg, ${tpl.colors[0]}, ${tpl.colors[1]})` }}
              />

              <div className="p-6">
                {/* Conv badge */}
                <div
                  className="flex items-center gap-2 p-3 rounded-xl mb-5"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: '#16a34a' }} />
                  <div>
                    <div className="font-black text-[18px]" style={{ color: '#0f172a' }}>{tpl.convRate}%</div>
                    <div className="text-[11px] font-medium" style={{ color: '#16a34a' }}>Taux de conversion moyen</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-6">
                  {tpl.stats.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#f1f5f9' }}>
                      <span className="text-[12px] font-medium" style={{ color: '#94a3b8' }}>{label}</span>
                      <span className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Use button */}
                <Link
                  href={`/dashboard/new?template=${tpl.id}`}
                  className="w-full flex items-center justify-center gap-2 font-black text-[15px] py-4 rounded-2xl transition-all mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  Utiliser ce template
                </Link>

                {/* Preview full */}
                <button
                  className="w-full flex items-center justify-center gap-2 font-semibold text-[13px] py-3 rounded-xl transition-all"
                  style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Aperçu plein écran
                </button>

                <p className="text-[11px] text-center mt-3" style={{ color: '#94a3b8' }}>
                  Personnalisé en 30 secondes avec l'IA
                </p>
              </div>
            </div>

            {/* Details card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="text-[11px] font-black tracking-widest mb-4" style={{ color: '#94a3b8' }}>INFORMATIONS</div>

              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-bold mb-2" style={{ color: '#94a3b8' }}>INDUSTRIES</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.industries.map(ind => (
                      <span
                        key={ind}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: '#f3f0ff', color: '#7c3aed' }}
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold mb-2" style={{ color: '#94a3b8' }}>DEVICES</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.devices.map(d => (
                      <span
                        key={d}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: '#f0fdf4', color: '#16a34a' }}
                      >
                        <Check className="w-3 h-3" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold mb-2" style={{ color: '#94a3b8' }}>COULEURS</div>
                  <div className="flex items-center gap-2">
                    {tpl.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ background: c, borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                        <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
            >
              <div className="text-2xl font-black" style={{ color: '#0f172a' }}>4.8</div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-[12px] font-medium" style={{ color: '#78716c' }}>
                  Note moyenne · 120+ utilisateurs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: '#0f172a' }}>Templates similaires</h2>
            <Link
              href="/templates"
              className="flex items-center gap-1.5 text-[13px] font-semibold"
              style={{ color: '#7c3aed' }}
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map(relId => (
              <RelatedCard key={relId} id={relId} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
