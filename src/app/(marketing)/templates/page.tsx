'use client'

import { useState, useEffect } from 'react'
import {
  templateEtecBlue,
  templateEtecNoir,
  templateEtecRose,
  templateEtecSage,
  templateEtecBeauty,
  templateEtecStyle,
  templateEtecShopz,
} from '@/lib/templates'
import type { LandingPageData } from '@/types'

// ---------------------------------------------------------------------------
// Sample data — images adaptées à la niche de chaque template
// ---------------------------------------------------------------------------

const SAMPLE_BLUE: LandingPageData = {
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
    { question: 'Quelle taille choisir ?', answer: 'Prenez votre taille habituelle. En cas de doute entre deux tailles, prenez la plus grande.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–4 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Retours ?', answer: 'Retours acceptés sous 30 jours. Remboursement complet sous 5 jours.' },
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

const SAMPLE_NOIR: LandingPageData = {
  product_name: 'Phantom Watch X',
  headline: 'L\'heure n\'attend pas. Et vous non plus.',
  subtitle: 'Mouvement automatique suisse. Boîtier titane 42mm. Verre saphir anti-reflets. Édition limitée à 500 exemplaires.',
  cta: 'Réserver la mienne — Stock limité',
  urgency: '🖤 Édition limitée — 47 pièces restantes',
  benefits: [
    'Mouvement automatique certifié COSC — précision Swiss Made',
    'Boîtier titane grade 5 — ultra-léger, anti-allergie',
    'Verre saphir 3 couches anti-reflets — lisibilité parfaite',
    'Étanchéité 200m — conçu pour l\'aventure et le prestige',
    'Bracelet cuir vegan premium — confort toute la journée',
  ],
  faq: [
    { question: 'Garantie ?', answer: 'Garantie 3 ans pièces et main d\'œuvre. Service après-vente dédié.' },
    { question: 'Livraison ?', answer: 'Livraison sécurisée en écrin premium sous 5–7 jours ouvrés.' },
    { question: 'Retours ?', answer: 'Retours acceptés sous 14 jours si produit intact.' },
  ],
  price: '899',
  original_price: '1299',
  images: [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
  ],
}

const SAMPLE_ROSE: LandingPageData = {
  product_name: 'Velvet Glow Serum',
  headline: 'Ta peau mérite le meilleur',
  subtitle: 'Sérum éclat à l\'acide hyaluronique et vitamine C. Testé dermatologiquement. Résultats visibles en 14 jours.',
  cta: 'Adopter le Velvet Glow →',
  urgency: '💕 -30% ce weekend seulement — offre limitée',
  benefits: [
    'Acide hyaluronique triple poids — hydratation 72h',
    'Vitamine C stabilisée 15% — éclat et anti-taches',
    'Niacinamide 5% — pores resserrés, teint unifié',
    'Testé dermatologiquement — convient aux peaux sensibles',
    'Formule vegan & cruelty-free — certifiée ECOCERT',
  ],
  faq: [
    { question: 'Convient aux peaux sensibles ?', answer: 'Oui, notre formule est testée dermatologiquement et convient à tous les types de peau.' },
    { question: 'Résultats en combien de temps ?', answer: 'Première amélioration visible en 7 jours. Résultats optimaux en 28 jours.' },
    { question: 'Satisfait ou remboursé ?', answer: '30 jours pour changer d\'avis. Remboursement complet, aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80',
  ],
}

const SAMPLE_SAGE: LandingPageData = {
  product_name: 'Pure Roots Detox',
  headline: 'Retourne à l\'essentiel. La nature sait ce qui est bon pour toi.',
  subtitle: 'Complément alimentaire 100% bio. 23 plantes adaptogènes. Certifié Agriculture Biologique Europe.',
  cta: 'Commencer ma cure detox →',
  urgency: '🌿 Livraison offerte dès 2 boîtes',
  benefits: [
    '23 plantes adaptogènes bio — sélectionnées par des phytothérapeutes',
    'Certifié Agriculture Biologique Europe — aucun pesticide',
    'Gélules végétales — convient aux vegans et végétariens',
    'Fabriqué en France — contrôle qualité à chaque étape',
    'Sans gluten, sans lactose, sans OGM — pour tous',
  ],
  faq: [
    { question: 'Durée d\'une cure ?', answer: 'Cure recommandée de 3 mois pour des résultats durables. Peut se prendre en continu.' },
    { question: 'Effets secondaires ?', answer: 'Aucun effet secondaire connu. Consultez votre médecin si vous êtes sous traitement.' },
    { question: 'Livraison ?', answer: 'Livraison en 3–5 jours ouvrés. Offerte dès 2 boîtes commandées.' },
  ],
  price: '39',
  original_price: '59',
  images: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    'https://images.unsplash.com/photo-1505471768190-275e2ad070d9?w=800&q=80',
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
    'https://images.unsplash.com/photo-1510622216446-1435f0f20bd2?w=800&q=80',
  ],
}

const SAMPLE_HAIRGLOW: LandingPageData = {
  product_name: 'LuxHair Pro',
  headline: 'Des cheveux transformés, une confiance retrouvée',
  subtitle: 'Formule kératine premium enrichie aux huiles botaniques. Sans sulfates, sans parabènes. Résultats visibles en 7 jours.',
  cta: 'Découvrir la routine — Livraison offerte',
  urgency: '🌿 Édition limitée — Stock faible',
  benefits: [
    'Formule kératine premium — lissage naturel durable',
    'Huiles botaniques bio — argan, ricin, jojoba',
    'Sans sulfates, sans parabènes — respecte le cuir chevelu',
    'Résultats visibles en 7 jours — testé et approuvé',
    'Convient à tous les types de cheveux — même colorés',
  ],
  faq: [
    { question: 'Convient aux cheveux colorés ?', answer: 'Oui, notre formule est spécialement conçue pour respecter les cheveux colorés et traités chimiquement.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–3 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Garantie satisfait ou remboursé ?', answer: 'Satisfait ou remboursé sous 30 jours. Aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80',
    'https://images.unsplash.com/photo-1527799820374-87591a16f5e6?w=800&q=80',
  ],
}

const SAMPLE_STYLEPRO: LandingPageData = {
  product_name: 'Style Studio',
  headline: 'Discover your style with a professional stylist',
  subtitle: 'Your personal fashion consultant who understands your vision and brings it to life. Join 34K+ members.',
  cta: 'Start your journey',
  urgency: '✨ Limited spots available this month',
  benefits: [
    'Ongoing support from certified stylists',
    'Expert advice tailored to your body type',
    'Personalized shopping assistance',
    'Complete wardrobe revitalization',
    'Exclusive brand partnerships — BOSS, Paco, WM',
  ],
  faq: [
    { question: 'How does the consultation work?', answer: 'Book your initial session online. Your stylist will analyze your style goals and create a personalized fashion plan.' },
    { question: 'Can I cancel anytime?', answer: 'Yes. Cancel your membership at any time from your account settings. No commitment required.' },
    { question: 'What styles do you cover?', answer: 'From casual to elegant, sportswear to techwear — our team covers all styles and occasions.' },
  ],
  price: '89',
  original_price: '149',
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  ],
}

// ---------------------------------------------------------------------------
// Templates registry
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: 'etec-blue',
    name: 'ETEC Blue',
    tagline: 'Tech · Sport · Universel',
    desc: 'Design épuré fond blanc cassé et bleu électrique. Idéal pour les produits tech, sport et lifestyle universel. Le template le plus polyvalent.',
    accent: '#0057FF',
    badgeBg: '#0057FF',
    badge: 'Populaire',
    cvr: '4.9%',
    niches: ['Tech', 'Sport', 'Accessoires', 'Universel'],
    fn: templateEtecBlue,
    sample: SAMPLE_BLUE,
    preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: 'etec-noir',
    name: 'ETEC Noir',
    tagline: 'Montres · Électronique · Luxe Dark',
    desc: 'Fond sombre profond, contrastes parfaits. Positionne instantanément le produit comme haut de gamme. Parfait pour montres, électronique et gaming.',
    accent: '#7C3AED',
    badgeBg: '#7C3AED',
    badge: 'Premium',
    cvr: '4.7%',
    niches: ['Montres', 'Électronique', 'Gaming', 'Auto'],
    fn: templateEtecNoir,
    sample: SAMPLE_NOIR,
    preview: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
  },
  {
    id: 'etec-rose',
    name: 'ETEC Rose',
    tagline: 'Beauté · Skincare · Makeup',
    desc: 'Tons rose chauds et féminins. Galerie produit et avis UGC mis en avant. Maximise les ventes dans l\'univers beauté et skincare.',
    accent: '#D63370',
    badgeBg: '#D63370',
    badge: 'Top CVR',
    cvr: '5.8%',
    niches: ['Beauté', 'Skincare', 'Makeup', 'Femme'],
    fn: templateEtecRose,
    sample: SAMPLE_ROSE,
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'etec-sage',
    name: 'ETEC Sage',
    tagline: 'Bio · Organic · Bien-être',
    desc: 'Vert forêt naturel, tons organiques, certifications visibles. Inspire confiance. Parfait pour les produits bio, compléments alimentaires et bien-être.',
    accent: '#2D6A4F',
    badgeBg: '#2D6A4F',
    badge: 'Bio',
    cvr: '4.3%',
    niches: ['Bio', 'Alimentation', 'Cosmétiques naturels', 'Bien-être'],
    fn: templateEtecSage,
    sample: SAMPLE_SAGE,
    preview: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  },
  {
    id: 'etec-beauty',
    name: 'Hair Glow',
    tagline: 'Hair Care · Capillaire · Beauté Premium',
    desc: 'Design élégant tons crème et orange brûlé inspiré des meilleures marques hair care. Sections produit, bienfaits, témoignages et routine capillaire.',
    accent: '#E8622A',
    badgeBg: '#E8622A',
    badge: 'Hair Care',
    cvr: '5.2%',
    niches: ['Hair Care', 'Capillaire', 'Beauté', 'Organic'],
    fn: templateEtecBeauty,
    sample: SAMPLE_HAIRGLOW,
    preview: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: 'etec-shopz',
    name: 'Shopz',
    tagline: 'E-commerce · Clothing · Mode Urbaine',
    desc: 'Page produit e-commerce complète style Shopz. Galerie interactive, sélecteur couleur/taille, avis avec barres de distribution, section "You might like" et footer dark.',
    accent: '#1A5C30',
    badgeBg: '#1A5C30',
    badge: 'E-commerce',
    cvr: '5.6%',
    niches: ['Clothing', 'E-commerce', 'Mode', 'Streetwear'],
    fn: templateEtecShopz,
    sample: SAMPLE_BLUE,
    preview: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
  },
  {
    id: 'etec-style',
    name: 'Style Pro',
    tagline: 'Fashion · Personal Styling · Mode',
    desc: 'Minimaliste et élégant, fond beige caramel et blanc. Inspiré des meilleurs sites de personal styling. Parfait pour mode, conseil en image et lifestyle premium.',
    accent: '#C9B49A',
    badgeBg: '#C9B49A',
    badge: 'Fashion',
    cvr: '4.8%',
    niches: ['Mode', 'Fashion', 'Lifestyle', 'Luxe'],
    fn: templateEtecStyle,
    sample: SAMPLE_STYLEPRO,
    preview: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
]

// ---------------------------------------------------------------------------
// Modal fullscreen preview
// ---------------------------------------------------------------------------

function TemplateModal({ t, onClose }: { t: typeof TEMPLATES[0]; onClose: () => void }) {
  const html = t.fn(t.sample)

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
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-black text-lg">{t.name}</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: t.badgeBg }}>
              {t.badge}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: t.accent }}
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
      <div className="relative" style={{ height: '240px', overflow: 'hidden', background: '#f3f3f3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.preview}
          alt={`Preview ${t.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
          className="group-hover:scale-105"
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <span className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full">
            Voir en plein écran
          </span>
        </div>
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: t.badgeBg }}>
          {t.badge}
        </span>
        <span className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
          CVR moy. {t.cvr}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-black text-gray-900 text-base">{t.name}</h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: t.accent }}>
              {t.tagline}
            </p>
          </div>
          <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" style={{ background: t.accent }} />
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{t.desc}</p>
        <div className="flex gap-1.5 flex-wrap mb-4">
          {t.niches.map(n => (
            <span key={n} className="text-xs px-2 py-0.5 rounded-md text-gray-500" style={{ background: '#f5f5f5' }}>
              {n}
            </span>
          ))}
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ background: `${t.accent}18`, color: t.accent, border: `2px solid ${t.accent}30` }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = `${t.accent}18`; e.currentTarget.style.color = t.accent }}
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
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState('Tous')

  const FILTERS = ['Tous', 'Tech', 'Beauté', 'Bio', 'Luxe', 'Fashion', 'Hair Care']

  const filtered = TEMPLATES.filter(t => {
    if (activeFilter === 'Tous') return true
    return t.niches.some(n => n.toLowerCase().includes(activeFilter.toLowerCase()))
  })

  return (
    <main>
      {selected && <TemplateModal t={selected} onClose={() => setSelected(null)} />}

      {/* HERO */}
      <section className="pt-32 pb-16 px-6" style={{ background: '#08080f' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            6 templates · chaque niche a son design
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            Le bon design pour{' '}
            <span style={{ color: '#5B47F5' }}>chaque niche.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Chaque template est inspiré des meilleures landing pages mondiales,
            optimisé pour convertir dans sa niche spécifique.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {FILTERS.map(tab => (
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

      {/* GRID */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-400 mb-8">
            {filtered.length} template{filtered.length > 1 ? 's' : ''} — cliquez pour voir en plein écran avec données réelles par niche
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <TemplateCard key={t.id} t={t} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: '#0f0f1a' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Tous les templates inclus dans le plan{' '}
            <span style={{ color: '#5B47F5' }}>Pro.</span>
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Accédez aux 6 templates, aux mises à jour futures et aux nouveaux designs dès leur sortie.
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
