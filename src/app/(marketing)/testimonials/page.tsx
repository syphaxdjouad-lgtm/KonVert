'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ArrowRight } from '@phosphor-icons/react'

interface Testimonial {
  name: string
  role: string
  avatar: string
  color: string
  stars: number
  niche: string
  quote: string
  stat: string
}

const ALL: Testimonial[] = [
  // Mode
  {
    name: 'Camille L.',
    role: 'Mode Femme · Shopify',
    avatar: 'CL',
    color: '#ec4899',
    stars: 5,
    niche: 'mode',
    quote: 'En mode, l\'image c\'est tout. KONVERT m\'a permis de créer des pages produit qui respirent le luxe sans passer des heures sur Figma. Mes bounces ont chuté de 62% et mon panier moyen a grimpé de 28€ en 2 semaines.',
    stat: '-62% bounce',
  },
  {
    name: 'Lucas M.',
    role: 'Streetwear · WooCommerce',
    avatar: 'LM',
    color: '#f97316',
    stars: 5,
    niche: 'mode',
    quote: 'Je vends des sneakers en édition limitée. La vitesse c\'est tout — mes drops durent moins de 30 min. Avec KONVERT, ma page est prête avant même que le produit soit annoncé. CVR passé de 1.8% à 5.1% sur mes derniers drops.',
    stat: '5.1% CVR',
  },
  {
    name: 'Inès T.',
    role: 'Bijoux & Accessoires · Shopify',
    avatar: 'IT',
    color: '#a78bfa',
    stars: 5,
    niche: 'mode',
    quote: 'Mes pièces ont une histoire derrière chacune. KONVERT génère un storytelling produit qui reflète vraiment ma marque. J\'ai abandonné mon agence à 2 000€/mois — je fais mieux seule maintenant avec KONVERT.',
    stat: 'x3.8 ROAS',
  },
  // Beauté
  {
    name: 'Julien R.',
    role: 'Cosmétiques · Beauté',
    avatar: 'JR',
    color: '#f97316',
    stars: 5,
    niche: 'beauté',
    quote: 'Mon ROAS est passé de x1.4 à x4.2 en 3 semaines. Les templates beauté sont absolument parfaits pour ma niche. Je ne reviendrai jamais en arrière.',
    stat: 'ROAS x4.2',
  },
  {
    name: 'Marie-Anne P.',
    role: 'Skincare · Shopify',
    avatar: 'MP',
    color: '#ec4899',
    stars: 5,
    niche: 'beauté',
    quote: 'J\'avais du mal à communiquer les bénéfices de mes sérums. KONVERT structure le copy de façon tellement claire que mes clientes comprennent instantanément la valeur. Chiffre d\'affaires x3.2 en 45 jours.',
    stat: 'CA x3.2',
  },
  {
    name: 'Romain F.',
    role: 'Soins naturels · WooCommerce',
    avatar: 'RF',
    color: '#10b981',
    stars: 5,
    niche: 'beauté',
    quote: 'Produits naturels = arguments complexes. KONVERT simplifie mes argumentaires sans perdre le fond scientifique. Mon taux de conversion sur ma crème anti-âge phare est passé de 1.1% à 4.9%.',
    stat: '+4.1% CVR',
  },
  // Tech
  {
    name: 'Thomas M.',
    role: 'Dropshipping · Shopify',
    avatar: 'TM',
    color: '#5B47F5',
    stars: 5,
    niche: 'tech',
    quote: 'J\'ai généré ma première landing page en 45 secondes. Mon taux de conversion a grimpé de 5.2% dès le lendemain. KONVERT est l\'outil que j\'attendais depuis 2 ans.',
    stat: '+5.2% CVR',
  },
  {
    name: 'Kevin N.',
    role: 'High-tech · Shopify Plus',
    avatar: 'KN',
    color: '#0ea5e9',
    stars: 5,
    niche: 'tech',
    quote: 'Je vends du matériel informatique à 300-800€ l\'unité. Le copy technique généré est vraiment précis — specs, compatibilité, FAQ. Les objections sont traitées avant même que l\'acheteur les formule. -40% de chats support.',
    stat: '-40% support',
  },
  {
    name: 'Alix B.',
    role: 'Gaming · WooCommerce',
    avatar: 'AB',
    color: '#5B47F5',
    stars: 5,
    niche: 'tech',
    quote: 'La communauté gaming est exigeante. KONVERT capture le bon ton — technique mais passionné. Mes landing pages pour périphériques gaming convertissent à 6.2%, contre 1.8% avant. Et ça marche sur mobile, ce qui est clé pour cette cible.',
    stat: '6.2% CVR',
  },
  // Agences
  {
    name: 'Sarah K.',
    role: 'Agence SMMA · 23 clients',
    avatar: 'SK',
    color: '#10b981',
    stars: 5,
    niche: 'agence',
    quote: 'On gère 23 boutiques clients depuis un seul dashboard. La fonctionnalité white-label nous a permis de vendre KONVERT comme un service premium à 500€/mois. C\'est notre meilleure marge.',
    stat: '23 clients',
  },
  {
    name: 'Baptiste G.',
    role: 'Web Agency · 40 boutiques',
    avatar: 'BG',
    color: '#3b82f6',
    stars: 5,
    niche: 'agence',
    quote: 'En agence, le temps c\'est de l\'argent. KONVERT nous a permis de livrer 40 boutiques en 3 mois au lieu de 6. Les clients sont bluffés par la qualité des pages. On a doublé notre capacité sans embaucher.',
    stat: '40 boutiques',
  },
  {
    name: 'Laetitia M.',
    role: 'Freelance e-commerce',
    avatar: 'LM',
    color: '#a78bfa',
    stars: 5,
    niche: 'agence',
    quote: 'Freelance solo, je gère 15 clients e-commerce. KONVERT me permet de livrer en 24h ce qui prenait une semaine. J\'ai pu augmenter mes tarifs de 40% en justifiant des résultats mesurables. C\'est mon meilleur investissement.',
    stat: '+40% tarifs',
  },
  // Déco
  {
    name: 'Nora H.',
    role: 'Déco & Maison · WooCommerce',
    avatar: 'NH',
    color: '#78716c',
    stars: 5,
    niche: 'déco',
    quote: 'En décoration, l\'acte d\'achat est émotionnel. KONVERT comprend ça — les pages générées racontent une ambiance, un style de vie. Mon taux de conversion est passé de 1.2% à 3.8% en 7 jours. Exactement ce dont j\'avais besoin.',
    stat: '1.2%→3.8% CVR',
  },
  // Sport & Santé
  {
    name: 'Mathieu C.',
    role: 'Équipement Sport · Shopify',
    avatar: 'MC',
    color: '#22c55e',
    stars: 5,
    niche: 'sport',
    quote: 'Je vends du matériel de fitness premium. Les clients sont exigeants sur les specs et la garantie. KONVERT génère un copy exhaustif et rassurant. ROAS passé de x1.9 à x4.7 sur mes campagnes Meta. Je suis fan.',
    stat: 'x4.7 ROAS',
  },
  {
    name: 'Sophie V.',
    role: 'Nutrition & Santé · WooCommerce',
    avatar: 'SV',
    color: '#f59e0b',
    stars: 5,
    niche: 'santé',
    quote: 'Le marché nutrition est ultra-réglementé — pas de claims médicaux, arguments de santé encadrés. KONVERT gère ça parfaitement. Mes pages restent dans les clous légaux tout en étant ultra-convaincantes. CA +180% en 2 mois.',
    stat: '+180% CA',
  },
]

const NICHES = ['tous', 'mode', 'beauté', 'tech', 'agence', 'déco', 'sport', 'santé']

const NICHE_LABELS: Record<string, string> = {
  tous: 'Tous',
  mode: 'Mode',
  beauté: 'Beauté',
  tech: 'Tech',
  agence: 'Agences',
  déco: 'Déco',
  sport: 'Sport',
  santé: 'Santé',
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} weight="fill" className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="break-inside-avoid mb-5 p-5 rounded-2xl flex flex-col gap-4"
      style={{
        background: '#ffffff',
        border: '1px solid #ede8ff',
        boxShadow: '0 2px 12px rgba(91,71,245,0.06)',
      }}
    >
      <StarRow count={t.stars} />
      <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid #f0ebff' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
            style={{ background: t.color }}
          >
            {t.avatar}
          </div>
          <div>
            <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
            <div className="text-gray-400 text-xs">{t.role}</div>
          </div>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: `${t.color}15`, color: t.color }}
        >
          {t.stat}
        </span>
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  const [activeNiche, setActiveNiche] = useState('tous')

  const filtered = activeNiche === 'tous'
    ? ALL
    : ALL.filter((t) => t.niche === activeNiche)

  return (
    <div style={{ background: '#faf8ff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="pt-32 pb-16 px-5 sm:px-8 text-center"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,71,245,0.12) 0%, transparent 70%), #faf8ff',
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{ background: 'rgba(91,71,245,0.1)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.2)' }}
        >
          <Star weight="fill" className="w-3.5 h-3.5" />
          Wall of Love
        </div>
        <h1
          className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4 max-w-2xl mx-auto"
          style={{ letterSpacing: '-0.02em' }}
        >
          Ils utilisent KONVERT.
          <span style={{ color: '#5B47F5' }}> Ils convertissent.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          {ALL.length} témoignages d&apos;e-commerçants et agences qui ont transformé leurs résultats.
        </p>

        {/* Stats rapides */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          {[
            { label: 'avis clients', value: `${ALL.length}` },
            { label: 'note moyenne', value: '4.9/5' },
            { label: 'niches couvertes', value: '8' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black" style={{ color: '#5B47F5' }}>{value}</div>
              <div className="text-xs text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {NICHES.map((niche) => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={
                activeNiche === niche
                  ? { background: '#5B47F5', color: '#fff', boxShadow: '0 2px 10px rgba(91,71,245,0.35)' }
                  : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >
              {NICHE_LABELS[niche]}
              {niche === 'tous' && (
                <span
                  className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-black"
                  style={
                    activeNiche === niche
                      ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                      : { background: '#ede8ff', color: '#5B47F5' }
                  }
                >
                  {ALL.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Grille masonry */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <p className="text-xs text-gray-400 font-medium mb-6">
          {filtered.length} avis — {activeNiche === 'tous' ? 'toutes niches' : NICHE_LABELS[activeNiche]}
        </p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filtered.map((t) => (
            <TestimonialCard key={`${t.name}-${t.role}`} t={t} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Aucun avis pour cette niche pour l&apos;instant.
          </div>
        )}
      </section>

      {/* CTA bottom */}
      <section
        className="py-20 px-5 sm:px-8 text-center"
        style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}
      >
        <h2 className="text-3xl font-black text-white mb-4">
          Prêt à rejoindre ces résultats ?
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          14 jours gratuits. Aucune carte de crédit. Annulation en 1 clic.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
        >
          Commencer gratuitement <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
