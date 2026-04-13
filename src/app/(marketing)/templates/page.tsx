'use client'

import { useState, useEffect } from 'react'
import {
  templateMinimalDark,
  templateCleanWhite,
  templateBoldSales,
  templateLuxury,
  templateMobileFirst,
  templateSheinPro,
  templateSportifEnergie,
  templateNaturalOrganic,
  templateTechGadget,
  templateBeautyStudio,
  templateHomeDeco,
  templateKidsColorful,
  templateFoodieGourmet,
  templateTravelNomad,
  templateAutomotivePro,
  templateGamingZone,
  templatePetLove,
} from '@/lib/templates'
import type { LandingPageData } from '@/types'

const GLOBAL_CSS = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }
  @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
  .btn-shimmer { background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%); background-size: 200% 100%; animation: shimmer 2.4s linear infinite; }
  .btn-shimmer:hover { animation-play-state: paused; }
`

// ---------------------------------------------------------------------------
// Sample data pour les previews
// ---------------------------------------------------------------------------

const SAMPLE_DATA: LandingPageData = {
  product_name: 'ProRunner X5',
  headline: 'Les chaussures qui transforment ta course',
  subtitle: 'Technologie carbone légère. 47% plus rapide. Approuvé par 12 000 athlètes.',
  cta: 'Commander maintenant — Livraison offerte',
  urgency: '⚡ Stock limité — Il reste 23 paires',
  benefits: [
    'Semelle carbone ultra-légère (-40% vs standard)',
    'Amorti réactif pour chaque foulée',
    'Respirant mesh technique 360°',
    'Semelle antidérapante tout terrain',
  ],
  faq: [
    { question: 'Quelle taille choisir ?', answer: 'Prenez votre taille habituelle. En cas de doute entre deux tailles, choisissez la plus grande.' },
    { question: 'Délai de livraison ?', answer: 'Livraison en 2-4 jours ouvrés. Suivi inclus.' },
  ],
  price: '79',
  original_price: '129',
  images: [],
}

// ---------------------------------------------------------------------------
// Mapping template id → fonction HTML
// ---------------------------------------------------------------------------

const TEMPLATE_FN_MAP: Record<string, (data: LandingPageData) => string> = {
  'minimal-dark':    templateMinimalDark,
  'clean-white':     templateCleanWhite,
  'bold-orange':     templateBoldSales,
  'luxe-noir':       templateLuxury,
  'mobile-first':    templateMobileFirst,
  'shein-pro':       templateSheinPro,
  'sportif-energie': templateSportifEnergie,
  'natural-organic': templateNaturalOrganic,
  'tech-gadget':     templateTechGadget,
  'beauty-studio':   templateBeautyStudio,
  'home-deco':       templateHomeDeco,
  'kids-colorful':   templateKidsColorful,
  'foodie-gourmet':  templateFoodieGourmet,
  'travel-nomad':    templateTravelNomad,
  'automotive-pro':  templateAutomotivePro,
  'gaming-zone':     templateGamingZone,
  'pet-love':        templatePetLove,
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Template {
  id: string
  name: string
  category: string
  tag: string
  tagColor: string
  desc: string
  gradient: string
  textColor: string
  conversionRate: string
  bestFor: string
  features: string[]
  border?: string
  badge?: 'Nouveau' | 'Populaire' | 'Top conversion'
  type: string
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TEMPLATES: Template[] = [
  {
    id: 'shein-pro',
    name: 'Shein Pro',
    category: 'Mode',
    tag: 'Bestseller',
    tagColor: 'bg-[#5B47F5] text-white',
    desc: 'Inspiré des codes visuels de la mode fast-fashion. CTA agressifs, urgence, social proof.',
    gradient: 'from-[#5B47F5] via-[#7c6af7] to-[#a78bfa]',
    textColor: 'text-white',
    conversionRate: '5.2%',
    bestFor: 'Vêtements, Accessoires, Mode',
    features: ['Compte à rebours', 'Social proof live', 'Gallery produit', 'FAQ accordéon'],
    badge: 'Populaire',
    type: 'upsell',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'Tech & Premium',
    tag: 'Élégant',
    tagColor: 'bg-white/20 text-white',
    desc: 'Fond noir, typographie fine, espaces généreux. Parfait pour les produits premium et tech.',
    gradient: 'from-gray-900 via-gray-800 to-gray-700',
    textColor: 'text-white',
    conversionRate: '4.8%',
    bestFor: 'Électronique, Montres, Gadgets',
    features: ['Dark mode natif', 'Animations smooth', 'Specs techniques', 'Trust badges'],
    type: 'fiche-produit',
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    category: 'Universel',
    tag: 'Classique',
    tagColor: 'bg-gray-200 text-gray-700',
    desc: 'Fond blanc pur, typographie forte, rassurant. Fonctionne pour tous types de produits.',
    gradient: 'from-gray-50 to-white',
    textColor: 'text-gray-900',
    conversionRate: '4.1%',
    bestFor: 'Tous produits, Débutants',
    features: ['Ultra-lisible', 'SEO optimisé', 'Chargement rapide', 'Mobile-first'],
    border: 'border border-gray-200',
    type: 'fiche-produit',
  },
  {
    id: 'bold-orange',
    name: 'Bold Orange',
    category: 'Direct Response',
    tag: 'Impact Max',
    tagColor: 'bg-white/25 text-white',
    desc: 'Orange vif, CTA massifs, urgence maximale. Taux de clics records en direct response.',
    gradient: 'from-orange-500 via-orange-400 to-amber-400',
    textColor: 'text-white',
    conversionRate: '6.1%',
    bestFor: 'Dropshipping, Offres limitées',
    features: ['Urgence timer', 'CTA géant', 'Garantie prominente', 'Promo prix barré'],
    badge: 'Top conversion',
    type: 'bundle',
  },
  {
    id: 'premium-glass',
    name: 'Premium Glass',
    category: 'Luxe',
    tag: 'Glassmorphism',
    tagColor: 'bg-white/20 text-white',
    desc: 'Effet verre sur gradient bleu-indigo. Positionne le produit comme luxueux et désirable.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    textColor: 'text-white',
    conversionRate: '4.9%',
    bestFor: 'Parfums, Bijoux, Cosmétiques',
    features: ['Glassmorphism', 'Animations 3D', 'Galerie immersive', 'Avis clients'],
    type: 'landing-page',
  },
  {
    id: 'luxe-noir',
    name: 'Luxe Noir',
    category: 'Haute Gamme',
    tag: 'Exclusif',
    tagColor: 'bg-yellow-400/80 text-black',
    desc: 'Noir profond, accents or, typographie serif. Pour les produits haut de gamme et éditions limitées.',
    gradient: 'from-black via-zinc-900 to-stone-900',
    textColor: 'text-white',
    conversionRate: '4.5%',
    bestFor: 'Maroquinerie, Montres luxe, Éditions limitées',
    features: ['Accents dorés', 'Serif premium', 'Video produit', 'Certificat auth'],
    type: 'landing-page',
  },
  {
    id: 'sportif-energie',
    name: 'Sportif Énergie',
    category: 'Sport & Fitness',
    tag: 'Dynamique',
    tagColor: 'bg-lime-400 text-black',
    desc: 'Vert fluo, angles dynamiques, énergie pure. Conçu pour les équipements sportifs et suppléments.',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    textColor: 'text-white',
    conversionRate: '5.5%',
    bestFor: 'Sport, Fitness, Suppléments',
    features: ['Avant/Après', 'Résultats prouvés', 'Comparateur', 'Pack builder'],
    badge: 'Populaire',
    type: 'bundle',
  },
  {
    id: 'natural-organic',
    name: 'Natural Organic',
    category: 'Bien-être',
    tag: 'Éco-friendly',
    tagColor: 'bg-green-800/80 text-white',
    desc: 'Tons naturels, textures organiques, certifications éco. Rassure et inspire confiance.',
    gradient: 'from-green-800 via-emerald-700 to-lime-700',
    textColor: 'text-white',
    conversionRate: '4.3%',
    bestFor: 'Bio, Cosmétiques naturels, Alimentation',
    features: ['Certifications', 'Ingrédients liste', 'Valeurs marque', 'Impact eco'],
    type: 'landing-page',
  },
  {
    id: 'tech-gadget',
    name: 'Tech Gadget',
    category: 'Électronique',
    tag: 'High-Tech',
    tagColor: 'bg-cyan-400 text-black',
    desc: "Bleu cyan, specs techniques détaillées, comparatifs. Idéal pour l'électronique et IoT.",
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    textColor: 'text-white',
    conversionRate: '4.7%',
    bestFor: 'Gadgets, Domotique, Électronique',
    features: ['Specs tableau', 'Comparateur modèles', 'Vidéo démo', 'Q&A produit'],
    type: 'fiche-produit',
  },
  {
    id: 'beauty-studio',
    name: 'Beauty Studio',
    category: 'Beauté',
    tag: 'Féminin',
    tagColor: 'bg-pink-200 text-pink-800',
    desc: 'Tons rose et nude, galerie UGC, avis influenceurs. Maximise les ventes beauté et makeup.',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    textColor: 'text-white',
    conversionRate: '5.8%',
    bestFor: 'Makeup, Skincare, Beauté',
    features: ['Galerie UGC', 'Before/After', 'Shades selector', 'Influenceur quotes'],
    badge: 'Top conversion',
    type: 'upsell',
  },
  {
    id: 'home-deco',
    name: 'Home Deco',
    category: 'Maison',
    tag: 'Lifestyle',
    tagColor: 'bg-amber-100 text-amber-800',
    desc: 'Tons chauds, ambiance cosy, photos lifestyle. Transforme un objet en élément de décor désiré.',
    gradient: 'from-amber-700 via-orange-700 to-amber-600',
    textColor: 'text-white',
    conversionRate: '4.2%',
    bestFor: 'Déco, Cuisine, Maison',
    features: ['Photos ambiance', 'Dimensions produit', 'Matières info', 'Similaires'],
    type: 'landing-page',
  },
  {
    id: 'kids-colorful',
    name: 'Kids Colorful',
    category: 'Enfants',
    tag: 'Fun & Safe',
    tagColor: 'bg-yellow-300 text-yellow-900',
    desc: 'Couleurs vives, formes rondes, badges sécurité. Rassure les parents et attire les enfants.',
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    textColor: 'text-white',
    conversionRate: '4.6%',
    bestFor: 'Jouets, Puériculture, Enfants',
    features: ['Certif sécurité', "Tranches d'âge", 'Couleurs selector', 'Cadeau idéal'],
    type: 'landing-page',
  },
  {
    id: 'foodie-gourmet',
    name: 'Foodie Gourmet',
    category: 'Alimentation',
    tag: 'Appétissant',
    tagColor: 'bg-red-100 text-red-700',
    desc: 'Photos HD alléchantes, infos nutritionnelles, recettes. Fait saliver et convertit.',
    gradient: 'from-red-600 via-orange-500 to-yellow-500',
    textColor: 'text-white',
    conversionRate: '5.0%',
    bestFor: 'Food, Épicerie fine, Boissons',
    features: ['Infos nutri', 'Recettes liées', 'Origine traçée', 'Avis gustatifs'],
    type: 'landing-page',
  },
  {
    id: 'travel-nomad',
    name: 'Travel Nomad',
    category: 'Voyage',
    tag: 'Adventure',
    tagColor: 'bg-sky-200 text-sky-800',
    desc: "Bleu ciel, photos voyage immersives, listes de cas d'usage. Vend le rêve d'aventure.",
    gradient: 'from-sky-500 via-blue-500 to-cyan-600',
    textColor: 'text-white',
    conversionRate: '4.4%',
    bestFor: 'Bagages, Accessoires voyage, Outdoor',
    features: ["Cas d'usage voyage", 'Résistance specs', 'Poids & taille', 'Pack multi'],
    type: 'landing-page',
  },
  {
    id: 'automotive-pro',
    name: 'Automotive Pro',
    category: 'Auto & Moto',
    tag: 'Puissance',
    tagColor: 'bg-zinc-700 text-white',
    desc: 'Sombre et technique, specs détaillées, compatibilité. Parfait pour les accessoires auto.',
    gradient: 'from-zinc-800 via-gray-800 to-zinc-700',
    textColor: 'text-white',
    conversionRate: '4.0%',
    bestFor: 'Accessoires auto, Pièces, Moto',
    features: ['Compatibilité checker', 'Specs techniques', 'Installation guide', 'Garantie'],
    type: 'fiche-produit',
  },
  {
    id: 'gaming-zone',
    name: 'Gaming Zone',
    category: 'Gaming',
    tag: 'GG',
    tagColor: 'bg-purple-400 text-white',
    desc: 'Néon violet/cyan sur fond dark, effets glow, énergie gaming. Pour tous les accessoires gamer.',
    gradient: 'from-purple-700 via-violet-700 to-indigo-800',
    textColor: 'text-white',
    conversionRate: '5.3%',
    bestFor: 'Périphériques, Gaming gear, LED',
    features: ['RGB preview', 'Specs perf', 'Comparateur', 'Streamer-ready'],
    badge: 'Nouveau',
    type: 'landing-page',
  },
  {
    id: 'pet-love',
    name: 'Pet Love',
    category: 'Animaux',
    tag: 'Mignon',
    tagColor: 'bg-pink-100 text-pink-700',
    desc: "Tons pastel chaleureux, photos adorables, sécurité vétérinaire. Irrésistible pour les propriétaires d'animaux.",
    gradient: 'from-pink-500 via-purple-400 to-indigo-400',
    textColor: 'text-white',
    conversionRate: '5.6%',
    bestFor: 'Accessoires animaux, Nourriture, Hygène',
    features: ['Avis véto', 'Tailles guide', 'Compatible races', 'Pack multi-animaux'],
    badge: 'Nouveau',
    type: 'landing-page',
  },
]

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

const FILTER_TABS: string[] = [
  'Tous',
  'Mode',
  'Tech & Premium',
  'Beauté',
  'Sport & Fitness',
  'Alimentation',
  'Gaming',
  'Maison',
  'Animaux',
  'Enfants',
  'Voyage',
  'Auto & Moto',
  'Luxe',
]

const TYPE_TABS: { value: string; label: string }[] = [
  { value: 'tous', label: 'Tous les types' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'fiche-produit', label: 'Fiche produit' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'upsell', label: 'Upsell' },
]

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

function getBadgeStyle(badge: Template['badge']): string {
  if (badge === 'Top conversion') return 'bg-emerald-500 text-white'
  if (badge === 'Populaire') return 'bg-orange-500 text-white'
  if (badge === 'Nouveau') return 'bg-[#5B47F5] text-white'
  return ''
}

// ---------------------------------------------------------------------------
// Mockup fallback — gradient CSS
// ---------------------------------------------------------------------------

function TemplateMockupFallback({ gradient, textColor, border }: { gradient: string; textColor: string; border?: string }) {
  const isLight = textColor === 'text-gray-900'
  const barColor = isLight ? 'bg-gray-300' : 'bg-white/30'
  const blockColor = isLight ? 'bg-gray-200' : 'bg-white/20'
  const blockColorAlt = isLight ? 'bg-gray-300/70' : 'bg-white/10'
  const ctaColor = isLight ? 'bg-gray-800' : 'bg-white/90'

  return (
    <div className={`h-52 bg-gradient-to-br ${gradient} ${border ?? ''} relative overflow-hidden`}>
      <div className={`absolute top-4 left-4 right-4 h-2 rounded-full ${barColor}`} />
      <div className={`absolute top-9 right-5 w-16 h-20 rounded-lg ${blockColor}`} />
      <div className={`absolute top-9 left-5 w-20 h-2.5 rounded-full ${barColor}`} />
      <div className={`absolute top-14 left-5 w-14 h-2 rounded-full ${blockColorAlt}`} />
      <div className={`absolute top-20 left-5 w-10 h-3 rounded-full ${barColor}`} />
      <div className={`absolute top-28 left-5 w-24 h-1.5 rounded-full ${blockColorAlt}`} />
      <div className={`absolute left-5 w-20 h-1.5 rounded-full ${blockColorAlt}`} style={{ top: '7.5rem' }} />
      <div className={`absolute bottom-5 left-5 w-24 h-6 rounded-lg ${ctaColor}`} />
      <div className="absolute bottom-5 right-5 flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full ${blockColor}`} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preview iframe
// ---------------------------------------------------------------------------

function TemplatePreview({ id, gradient, textColor, border }: { id: string; gradient: string; textColor: string; border?: string }) {
  const templateFn = TEMPLATE_FN_MAP[id]

  if (!templateFn) {
    return <TemplateMockupFallback gradient={gradient} textColor={textColor} border={border} />
  }

  const html = templateFn(SAMPLE_DATA)

  return (
    <div className="relative overflow-hidden h-52" style={{ background: '#f9fafb' }}>
      <iframe
        srcDoc={html}
        title="Template preview"
        style={{
          width: '900px',
          height: '600px',
          transform: 'scale(0.42)',
          transformOrigin: 'top left',
          border: 'none',
          pointerEvents: 'none',
          display: 'block',
        }}
        sandbox="allow-same-origin"
      />
      <div className="absolute inset-0" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal plein écran
// ---------------------------------------------------------------------------

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const templateFn = TEMPLATE_FN_MAP[template.id]
  const html = templateFn ? templateFn(SAMPLE_DATA) : null

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(8,8,15,0.92)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Header modal */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="text-white font-black text-lg">{template.name}</h2>
          <p className="text-white/50 text-sm">{template.desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
          >
            Utiliser ce template →
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-lg"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Iframe fullscreen */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        {html ? (
          <iframe
            srcDoc={html}
            title={`Preview ${template.name}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            sandbox="allow-same-origin"
          />
        ) : (
          <div className={`h-full bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
            <p className="text-white/60 text-sm">Aperçu non disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Template card
// ---------------------------------------------------------------------------

function TemplateCard({ t, onOpen }: { t: Template; onOpen: (t: Template) => void }) {
  return (
    <div
      className="reveal group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-[#5B47F5]/10 transition-all duration-300 hover:-translate-y-1"
      onClick={() => onOpen(t)}
    >
      {/* Aperçu visuel */}
      <div className="relative">
        <TemplatePreview id={t.id} gradient={t.gradient} textColor={t.textColor} border={t.border} />

        {/* Badge haut-gauche */}
        {t.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${getBadgeStyle(t.badge)}`}>
            {t.badge}
          </span>
        )}

        {/* Tag — haut droite */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${t.tagColor}`}
        >
          {t.tag}
        </span>

        {/* CVR badge — bas gauche */}
        <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
          CVR moy. {t.conversionRate}
        </span>
      </div>

      {/* Infos */}
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-base">{t.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-2 whitespace-nowrap">
            {t.category}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{t.desc}</p>

        <div className="text-xs text-gray-400 mb-4">Pour : {t.bestFor}</div>

        {/* Features chips */}
        <div className="flex gap-2 flex-wrap mb-4">
          {t.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-600">
              &#10003; {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold text-[#5B47F5] border-2 border-[#5B47F5]/20 hover:bg-[#5B47F5] hover:text-white hover:border-[#5B47F5] transition-all duration-200"
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
  const [activeFilter, setActiveFilter] = useState<string>('Tous')
  const [activeType, setActiveType] = useState<string>('tous')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(6)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [activeFilter, activeType])

  const filtered = TEMPLATES.filter((t) => {
    const categoryMatch = activeFilter === 'Tous' || t.category === activeFilter
    const typeMatch = activeType === 'tous' || t.type === activeType
    return categoryMatch && typeMatch
  })
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleFilterChange(filter: string) {
    setActiveFilter(filter)
    setVisibleCount(6)
  }
  function handleTypeChange(type: string) {
    setActiveType(type)
    setVisibleCount(6)
  }

  return (
    <main>
      {/* Modal */}
      {selectedTemplate && (
        <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HERO — fond dark                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: '#0a0a1a' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-white/70 mb-6">
            <span>17 templates exclusifs</span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
            Le bon template pour{' '}
            <span style={{ color: '#5B47F5' }}>chaque produit.</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Des templates conçus par des experts e-commerce. Chaque design est optimisé pour
            maximiser les conversions dans sa niche.
          </p>

          {/* Stats inline */}
          <div className="flex items-center justify-center gap-3 text-sm text-white/40 mb-12">
            <span className="text-white/70 font-medium">17 templates</span>
            <span>·</span>
            <span className="text-white/70 font-medium">8 niches</span>
            <span>·</span>
            <span className="text-white/70 font-medium">CVR moyen +4.8%</span>
          </div>

          {/* Filtre catégorie */}
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#5B47F5] text-white border-[#5B47F5]'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/90 hover:border-white/20'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Filtre type de page */}
          <div className="flex gap-2 flex-wrap justify-center">
            {TYPE_TABS.map((tab) => {
              const isActive = activeType === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GRID TEMPLATES — fond blanc                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Compteur de résultats */}
          <p className="text-sm text-gray-400 mb-8">
            17 templates disponibles — mis à jour chaque semaine
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((t) => (
              <TemplateCard key={t.id} t={t} onOpen={setSelectedTemplate} />
            ))}
          </div>

          {/* Voir plus */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:border-[#5B47F5] hover:text-[#5B47F5]"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
              >
                Voir plus de templates ({filtered.length - visibleCount} restants)
              </button>
            </div>
          )}

          {/* État vide */}
          {filtered.length === 0 && (
            <div className="py-24 text-center text-gray-400 text-sm">
              Aucun template dans cette catégorie pour l&apos;instant.
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA FINAL — dark                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: '#0f0f1a' }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Tous les templates sont inclus dans le plan{' '}
            <span style={{ color: '#5B47F5' }}>Pro.</span>
          </h2>
          <p className="reveal delay-1 text-white/50 text-base mb-8">
            Accédez aux 17 templates, aux mises à jour futures et aux nouvelles niches dès la sortie.
          </p>

          <div className="reveal delay-2">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: '#5B47F5' }}
            >
              Commencer l&apos;essai gratuit
              <span aria-hidden="true">&#8594;</span>
            </a>
          </div>

          <p className="mt-4 text-sm text-white/30">
            14 jours gratuits &nbsp;·&nbsp; Aucune CB &nbsp;·&nbsp; Annulez quand vous voulez
          </p>
        </div>
      </section>
    </main>
  )
}
