'use client'

import { useState, useEffect } from 'react'
import {
  templateEtecBlue,
  templateEtecNoir,
  templateEtecRose,
  templateEtecSage,
  templateEtecGold,
  templateEtecEnergy,
} from '@/lib/templates'
import type { LandingPageData } from '@/types'

// ---------------------------------------------------------------------------
// Sample data pour les previews
// ---------------------------------------------------------------------------

const SAMPLE: LandingPageData = {
  product_name: 'ProRunner X5 Carbon',
  headline: 'Les chaussures qui transforment ta course',
  subtitle: 'Technologie carbone ultra-légère. Amorti réactif breveté. Approuvé par 12 000 athlètes dans 47 pays.',
  cta: 'Commander maintenant — Livraison offerte',
  urgency: '⚡ Stock limité — Il reste 23 paires en taille 42',
  benefits: [
    'Semelle carbone ultra-légère (-40% vs chaussure standard)',
    'Amorti réactif breveté — énergie restituée à chaque foulée',
    'Mesh respirant technique 360° — pieds au frais même à effort max',
    'Semelle antidérapante tout terrain — grip parfait sur toutes surfaces',
    'Conçu avec des podologues — adapté à toutes les morphologies de pied',
  ],
  faq: [
    { question: 'Quelle taille choisir ?', answer: 'Prenez votre taille habituelle. En cas de doute entre deux tailles, prenez la plus grande. Notre guide des tailles est disponible sur la page produit.' },
    { question: 'Quel est le délai de livraison ?', answer: 'Livraison express en 2–4 jours ouvrés. Expédition le jour même si commande avant 14h. Numéro de suivi envoyé par email dès l\'expédition.' },
    { question: 'Puis-je retourner le produit ?', answer: 'Retours acceptés sous 30 jours. Produit intact dans son emballage d\'origine. Remboursement complet sous 5 jours ouvrés après réception.' },
    { question: 'Sont-elles adaptées à la compétition ?', answer: 'Absolument. Les ProRunner X5 Carbon sont utilisées par des athlètes professionnels en compétition. Conformes aux règles World Athletics.' },
  ],
  price: '79',
  original_price: '129',
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  ],
}

// ---------------------------------------------------------------------------
// Templates data
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: 'etec-blue',
    name: 'ETEC Blue',
    tagline: 'Tech · Moderne · Universel',
    desc: 'Design épuré inspiré des meilleures pages produit du marché. Fond blanc cassé, bleu électrique, boutons ronds. Fonctionne pour tous types de produits.',
    accent: '#0057FF',
    accentLight: '#DEE8FF',
    bg: '#F9F9F9',
    textColor: '#191919',
    badge: 'Populaire',
    badgeBg: '#0057FF',
    cvr: '4.9%',
    niches: ['Tech', 'Mode', 'Accessoires', 'Universel'],
    fn: templateEtecBlue,
    preview: '/images/etec-blue.jpg',
  },
  {
    id: 'etec-noir',
    name: 'ETEC Noir',
    tagline: 'Premium · Élégant · Dark',
    desc: 'Fond sombre profond, textes blancs, contrastes parfaits. Positionne instantanément le produit comme haut de gamme et désirable.',
    accent: '#FFFFFF',
    accentLight: 'rgba(255,255,255,0.1)',
    bg: '#0D0D0D',
    textColor: '#F2F2F2',
    badge: '',
    badgeBg: '',
    cvr: '4.7%',
    niches: ['Électronique', 'Montres', 'Auto', 'Gaming'],
    fn: templateEtecNoir,
    preview: '/images/etec-noir.jpg',
  },
  {
    id: 'etec-rose',
    name: 'ETEC Rose',
    tagline: 'Beauté · Makeup · Skincare',
    desc: 'Tons rose chauds, doux et féminins. Galerie produit mise en avant, avis clients UGC. Maximise les ventes beauté et lifestyle.',
    accent: '#E91E8C',
    accentLight: '#FFE4F4',
    bg: '#FFF9FC',
    textColor: '#1A0A12',
    badge: 'Top conversion',
    badgeBg: '#E91E8C',
    cvr: '5.8%',
    niches: ['Beauté', 'Skincare', 'Makeup', 'Femme'],
    fn: templateEtecRose,
    preview: '/images/etec-rose.jpg',
  },
  {
    id: 'etec-sage',
    name: 'ETEC Sage',
    tagline: 'Organic · Bio · Bien-être',
    desc: 'Vert forêt naturel, tons organiques, certifications visibles. Inspire confiance et rassure. Parfait pour les produits naturels et bien-être.',
    accent: '#1E6B3C',
    accentLight: '#D4EDDA',
    bg: '#F4F8F4',
    textColor: '#0F1E14',
    badge: '',
    badgeBg: '',
    cvr: '4.3%',
    niches: ['Alimentation', 'Bio', 'Cosmétiques naturels', 'Maison'],
    fn: templateEtecSage,
    preview: '/images/etec-sage.jpg',
  },
  {
    id: 'etec-gold',
    name: 'ETEC Gold',
    tagline: 'Luxe · Haute Gamme · Or',
    desc: 'Fond noir profond, accents dorés, typographie raffinée. Réservé aux produits exclusifs, éditions limitées et haute gamme.',
    accent: '#C8971C',
    accentLight: 'rgba(200,151,28,0.12)',
    bg: '#0C0A06',
    textColor: '#F0E8D0',
    badge: 'Exclusif',
    badgeBg: '#C8971C',
    cvr: '4.5%',
    niches: ['Bijoux', 'Parfums', 'Maroquinerie', 'Luxe'],
    fn: templateEtecGold,
    preview: '/images/etec-gold.jpg',
  },
  {
    id: 'etec-energy',
    name: 'ETEC Energy',
    tagline: 'Sport · Fitness · Action',
    desc: 'Orange vif et énergique sur fond blanc. CTA percutant, urgence visible, dynamisme total. Conçu pour convertir dans les niches sport et fitness.',
    accent: '#FF4500',
    accentLight: '#FFE8E0',
    bg: '#F9F9F9',
    textColor: '#191919',
    badge: 'Nouveau',
    badgeBg: '#FF4500',
    cvr: '5.5%',
    niches: ['Sport', 'Fitness', 'Nutrition', 'Outdoor'],
    fn: templateEtecEnergy,
    preview: '/images/etec-energy.jpg',
  },
]

const FILTER_TABS = ['Tous', 'Tech', 'Beauté', 'Sport', 'Luxe', 'Organic', 'Mode']

// ---------------------------------------------------------------------------
// Preview image component
// ---------------------------------------------------------------------------

function TemplatePreview({ preview, name }: { preview: string; name: string }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#f3f3f3' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt={`Preview ${name}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal fullscreen preview
// ---------------------------------------------------------------------------

function TemplateModal({ t, onClose }: { t: typeof TEMPLATES[0]; onClose: () => void }) {
  const html = t.fn(SAMPLE)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5,5,12,0.94)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-black text-lg">{t.name}</h2>
            {t.badge && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: t.badgeBg }}>
                {t.badge}
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: t.accent === '#FFFFFF' ? '#5B47F5' : t.accent }}
          >
            Utiliser ce template →
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={html}
          title={t.name}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-popups"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Template card
// ---------------------------------------------------------------------------

function TemplateCard({ t, onOpen }: { t: typeof TEMPLATES[0]; onOpen: (t: typeof TEMPLATES[0]) => void }) {
  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ border: '1px solid #eaeaea', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      onClick={() => onOpen(t)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Preview */}
      <div className="relative">
        <TemplatePreview preview={t.preview} name={t.name} />

        {/* Overlay hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <span className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full">
            Voir en plein écran
          </span>
        </div>

        {/* Badge */}
        {t.badge && (
          <span
            className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: t.badgeBg }}
          >
            {t.badge}
          </span>
        )}

        {/* CVR */}
        <span className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
          CVR moy. {t.cvr}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-black text-gray-900 text-base">{t.name}</h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: t.accent === '#FFFFFF' ? '#888' : t.accent }}>
              {t.tagline}
            </p>
          </div>
          {/* Accent dot */}
          <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" style={{ background: t.accent === '#FFFFFF' ? '#0D0D0D' : t.accent }} />
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{t.desc}</p>

        {/* Niches */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {t.niches.map(n => (
            <span key={n} className="text-xs px-2 py-0.5 rounded-md text-gray-500" style={{ background: '#f5f5f5' }}>
              {n}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            background: t.accent === '#FFFFFF' ? '#0D0D0D' : `${t.accent}14`,
            color: t.accent === '#FFFFFF' ? '#fff' : t.accent,
            border: `2px solid ${t.accent === '#FFFFFF' ? '#0D0D0D' : `${t.accent}30`}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = t.accent === '#FFFFFF' ? '#333' : t.accent
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = t.accent === '#FFFFFF' ? '#0D0D0D' : `${t.accent}14`
            e.currentTarget.style.color = t.accent === '#FFFFFF' ? '#fff' : t.accent
          }}
          onClick={(e) => { e.stopPropagation(); onOpen(t) }}
        >
          Utiliser ce template
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null)

  const filtered = TEMPLATES.filter(t => {
    if (activeFilter === 'Tous') return true
    return t.niches.some(n => n.toLowerCase().includes(activeFilter.toLowerCase())) ||
           t.tagline.toLowerCase().includes(activeFilter.toLowerCase())
  })

  return (
    <main>
      {selected && <TemplateModal t={selected} onClose={() => setSelected(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6" style={{ background: '#08080f' }}>
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            6 templates — design ETEC · mis à jour régulièrement
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            Le bon design pour{' '}
            <span style={{ color: '#5B47F5' }}>chaque produit.</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Des templates conçus sur les meilleures product pages du marché.
            Chaque design est optimisé pour maximiser les conversions dans sa niche.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>6 templates</span>
            <span>·</span>
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>6 niches</span>
            <span>·</span>
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>CVR moyen +4.9%</span>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap justify-center">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
                style={{
                  background: activeFilter === tab ? '#5B47F5' : 'rgba(255,255,255,0.05)',
                  color: activeFilter === tab ? '#fff' : 'rgba(255,255,255,0.55)',
                  borderColor: activeFilter === tab ? '#5B47F5' : 'rgba(255,255,255,0.1)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-400 mb-8">
            {filtered.length} template{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} — cliquez pour voir en plein écran
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <TemplateCard key={t.id} t={t} onOpen={setSelected} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-24 text-center text-gray-400 text-sm">
              Aucun template dans cette catégorie pour l&apos;instant.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ background: '#0f0f1a' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Tous les templates sont inclus dans le plan{' '}
            <span style={{ color: '#5B47F5' }}>Pro.</span>
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Accédez aux 6 templates ETEC, aux mises à jour futures et aux nouvelles niches dès la sortie.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#5B47F5' }}
          >
            Commencer l&apos;essai gratuit →
          </a>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            14 jours gratuits &nbsp;·&nbsp; Aucune CB &nbsp;·&nbsp; Annulez quand vous voulez
          </p>
        </div>
      </section>
    </main>
  )
}
