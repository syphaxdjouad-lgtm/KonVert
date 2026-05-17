'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Download,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Clock,
  DollarSign,
  Globe,
  Plug,
  Newspaper,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'

/* ─── CSS injecté (identique à /about) ──────────────────────────────────── */
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

/* ─── Contenus ───────────────────────────────────────────────────────────── */

const ONE_LINER = `KONVERT génère une page produit e-commerce qui vend en 30 secondes.`

const ONE_PARA = `KONVERT est un SaaS européen qui transforme un simple lien produit (AliExpress, Amazon, ou saisie manuelle) en page e-commerce optimisée conversion — copy IA personnalisé, structure éprouvée AIDA/PAS/Cialdini, prêt à coller sur Shopify, WooCommerce ou YouCan. 30 secondes au lieu de 3 jours chez un freelance. Pricing dès 39 €/mois, premier essai gratuit sans CB. Développé par Luna Corporation Ltd (London).`

const ONE_PAGE = `L'e-commerce a un problème invisible : la majorité des boutiques perdent entre 60 et 80 % de leurs visiteurs à cause de pages produit mal conçues. Pas de copywriting, pas de structure de persuasion, pas d'adaptation au contexte de l'acheteur. Résultat : des milliers d'euros de trafic qui ne convertissent pas. Le problème n'est pas le produit — c'est la page.

KONVERT résout ce problème en 30 secondes. L'e-commerçant colle un lien produit (AliExpress, Amazon, URL quelconque) ou saisit son produit manuellement. KONVERT analyse le produit, génère un copy optimisé conversion en utilisant les frameworks éprouvés — AIDA, PAS, principes de Cialdini — et produit une landing page prête à être importée sur Shopify, WooCommerce ou YouCan. Ce qui prenait 3 à 5 jours et coûtait 400 € chez un freelance se fait en une demi-minute pour 39 €/mois.

Le marché cible est double et délibérément underserved par les outils US : les e-commerçants francophones d'Europe et les marchands arabophones du MENA. KONVERT supporte 8 langues dont l'arabe natif — un angle que personne n'adresse sérieusement. La plateforme cible aussi les agences SMMA qui gèrent plusieurs clients et ont besoin de livrables volumétriques sans sacrifier la qualité.

KONVERT est un projet indie, bootstrappé, développé par Luna Corporation Ltd (London) avec une philosophie de produit minimaliste : faire une seule chose parfaitement, pour les gens qui ont besoin de résultats aujourd'hui, pas dans six mois. La vision long terme est de devenir l'infrastructure copywriting de l'e-commerce en Europe et au MENA — démocratiser l'accès à l'optimisation conversion pour n'importe quelle boutique, quelle que soit sa taille ou son budget.`

const BIO_SHORT = `KONVERT est un SaaS développé par Luna Corporation Ltd (London), spécialisé dans la génération automatique de pages produit e-commerce optimisées conversion. Lancé officiellement en mai 2026, il cible les e-commerçants francophones et arabophones MENA.`

const BIO_LONG = `KONVERT est né d'une frustration concrète : créer une bonne page produit e-commerce prenait des heures, nécessitait un designer, un copywriter et un développeur, et coûtait plusieurs centaines d'euros par unité. La plupart des marchands s'en passaient — et perdaient des ventes en silence.

Luna Corporation Ltd (London) a fondé KONVERT avec une conviction simple : l'optimisation conversion ne doit pas être un luxe réservé aux grandes enseignes. En combinant de l'IA générative et des frameworks de copywriting éprouvés (AIDA, PAS, Cialdini), KONVERT automatise en 30 secondes ce qu'un freelance facture 400 € et livre en 5 jours.

Le produit supporte 8 langues dont l'arabe natif, cible un marché double FR + MENA gigantesque et ignoré par les SaaS américains, et s'intègre directement à Shopify, WooCommerce et YouCan. Bootstrappé, sans levée de fonds, KONVERT est construit sur la philosophie indie : être profondément utile à une cible précise plutôt que médiocrement généraliste pour tous. Lancé en mai 2026, pricing dès 39 €/mois, premier essai gratuit sans carte de crédit.`

const QUOTES = [
  {
    id: 'vision',
    text: `« Tes produits méritent des pages qui vendent. C'est la phrase qui résume notre obsession : aucun e-commerçant ne devrait perdre une vente à cause d'une page mal foutue. »`,
    label: 'Vision produit',
  },
  {
    id: 'usp',
    text: `« Là où un freelance prend 3 à 5 jours et facture 400 euros, KONVERT livre une page optimisée en 30 secondes pour 39 euros par mois. La différence n'est pas marginale, elle est structurelle. »`,
    label: 'Positionnement',
  },
  {
    id: 'market',
    text: `« Le marché MENA arabophone est gigantesque et complètement ignoré par les SaaS US. C'est exactement là qu'un acteur européen peut faire la différence. »`,
    label: 'Vision marché',
  },
]

const STATS = [
  {
    icon: Clock,
    value: '30 sec',
    label: 'pour générer une page',
    sub: 'vs 3–5 jours chez un freelance',
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.08)',
  },
  {
    icon: DollarSign,
    value: '39 €/mois',
    label: 'pricing entry-level',
    sub: 'vs 400 €+ pour une page sur-mesure',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: Globe,
    value: '8 langues',
    label: 'supportées',
    sub: 'FR, EN, ES, DE, IT, PT, AR, NL',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    icon: Plug,
    value: '3 intégrations',
    label: 'natives',
    sub: 'Shopify, WooCommerce, YouCan',
    color: '#8b77ff',
    bg: 'rgba(139,119,255,0.08)',
  },
]

const LOGOS = [
  {
    id: 'color-light',
    label: 'Couleur — fond clair',
    bg: '#f8f8f8',
    href: '/press-kit/logos/konvert-color-light.svg',
    preview: (
      <svg viewBox="0 0 600 180" width="240" height="72">
        <text x="300" y="120" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="96" textAnchor="middle" letterSpacing="-2.88">
          <tspan fill="#111827">KON</tspan><tspan fill="#5B47F5">VERT</tspan>
        </text>
      </svg>
    ),
  },
  {
    id: 'color-dark',
    label: 'Couleur — fond sombre',
    bg: '#0f0f1e',
    href: '/press-kit/logos/konvert-color-dark.svg',
    preview: (
      <svg viewBox="0 0 600 180" width="240" height="72">
        <text x="300" y="120" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="96" textAnchor="middle" letterSpacing="-2.88">
          <tspan fill="#ffffff">KON</tspan><tspan fill="#a78bfa">VERT</tspan>
        </text>
      </svg>
    ),
  },
  {
    id: 'mono-black',
    label: 'Monochrome noir',
    bg: '#f8f8f8',
    href: '/press-kit/logos/konvert-mono-black.svg',
    preview: (
      <svg viewBox="0 0 600 180" width="240" height="72">
        <text x="300" y="120" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="96" textAnchor="middle" letterSpacing="-2.88" fill="#000000">
          KONVERT
        </text>
      </svg>
    ),
  },
  {
    id: 'wordmark',
    label: 'Wordmark violet',
    bg: '#f8f8f8',
    href: '/press-kit/logos/konvert-wordmark.svg',
    preview: (
      <svg viewBox="0 0 600 180" width="240" height="72">
        <text x="300" y="120" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="96" textAnchor="middle" letterSpacing="-2.88" fill="#5B47F5">
          KONVERT
        </text>
      </svg>
    ),
  },
]

const SCREENSHOTS = [
  { n: 1, label: 'Homepage hero — AliExpress. Ta page est prête en 30s' },
  { n: 2, label: 'Wizard étape 3 — saisie du lien produit' },
  { n: 3, label: 'Page générée — preview en temps réel' },
  { n: 4, label: 'Dashboard — liste des pages créées' },
  { n: 5, label: 'Templates — galerie 42 designs' },
  { n: 6, label: 'Pricing — toggle annuel -20 %' },
]

/* ─── Composant CopyButton ───────────────────────────────────────────────── */
function CopyButton({ text, label = 'Copier' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copié !', { duration: 2000 })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier')
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copier : ${label}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
      style={{
        background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(91,71,245,0.08)',
        color: copied ? '#10b981' : '#5B47F5',
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copié !' : label}
    </button>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function PressKitPage() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
            style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Newspaper className="w-3.5 h-3.5" />
            PRESS KIT
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Tout ce qu&apos;il faut<br />
            <span style={{ color: '#8b77ff' }}>pour parler de KONVERT.</span>
          </h1>

          <p className="reveal delay-2 text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ color: '#8b8baa' }}>
            Launch officiel le 20 mai 2026. Assets, pitches, logos, stats — tout est ici, prêt à utiliser.
          </p>

          <div className="reveal delay-3 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/press-kit/konvert-press-kit.zip"
              download
              aria-label="Télécharger le kit complet en zip"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white font-bold text-sm"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              <Download className="w-4 h-4" />
              Télécharger le kit complet (.zip)
            </a>
            <a
              href="mailto:press@konvertpilot.com"
              aria-label="Envoyer un email à l'équipe presse"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold border text-sm transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <Mail className="w-4 h-4" />
              Email presse
            </a>
          </div>
        </div>
      </section>

      {/* ── PITCHES ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Pitches prêts à copier</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Trois formats, zéro réécriture.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-lg mx-auto">
              Tweeter, article, newsletter — prenez le format qui correspond à votre espace.
            </p>
          </div>

          <div className="space-y-6">

            {/* 1-liner */}
            <div className="reveal rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2"
                    style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5' }}>
                    1 liner — 15 mots
                  </span>
                  <p className="text-lg font-semibold text-gray-900 leading-snug">{ONE_LINER}</p>
                </div>
                <CopyButton text={ONE_LINER} label="Copier" />
              </div>
            </div>

            {/* 1-paragraphe */}
            <div className="reveal delay-1 rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full self-start"
                  style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5' }}>
                  1 paragraphe — 80 mots
                </span>
                <CopyButton text={ONE_PARA} label="Copier" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{ONE_PARA}</p>
            </div>

            {/* 1-page */}
            <div className="reveal delay-2 rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full self-start"
                  style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5' }}>
                  1 page — ~250 mots
                </span>
                <CopyButton text={ONE_PAGE} label="Copier" />
              </div>
              <div className="space-y-4">
                {ONE_PAGE.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS CLÉS ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Stats clés</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Des chiffres citables, vérifiables.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Toutes les données ci-dessous sont factuelles et libres d&apos;utilisation dans vos articles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label, sub, color, bg }, idx) => (
              <div
                key={value}
                className={`reveal delay-${idx + 1} bg-white rounded-2xl p-6 border border-gray-100`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-2xl font-black mb-1" style={{ color }}>{value}</p>
                <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIOS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">À propos</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Bios officielles.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Utilisez ces textes tels quels dans vos articles, épisodes ou fiches produit.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Bio courte */}
            <div className="reveal rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5' }}>
                  Bio courte — 50 mots
                </span>
                <CopyButton text={BIO_SHORT} label="Copier" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{BIO_SHORT}</p>
            </div>

            {/* Bio longue */}
            <div className="reveal delay-1 rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5' }}>
                  Bio longue — 150 mots
                </span>
                <CopyButton text={BIO_LONG} label="Copier" />
              </div>
              <div className="space-y-3">
                {BIO_LONG.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── LOGOS ────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf8ff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Logos</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Assets téléchargeables.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Format SVG vectoriel. Utilisez les variantes selon votre fond (clair / sombre / noir et blanc).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOGOS.map(({ id, label, bg, href, preview }, idx) => (
              <div
                key={id}
                className={`reveal delay-${idx + 1} rounded-2xl border border-gray-100 overflow-hidden`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="h-28 flex items-center justify-center"
                  style={{ background: bg }}
                >
                  {preview}
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-semibold text-gray-700 mb-3 leading-snug">{label}</p>
                  <a
                    href={href}
                    download
                    aria-label={`Télécharger ${label}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: '#5B47F5' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger .svg
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOTS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Screenshots</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Captures d&apos;écran officielles.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Les screenshots finaux seront disponibles dès le 20 mai au lancement. Téléchargez les placeholders en attendant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREENSHOTS.map(({ n, label }, idx) => (
              <div
                key={n}
                className={`reveal delay-${Math.min(idx + 1, 4)} rounded-2xl border border-gray-100 overflow-hidden`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* 16/9 aspect placeholder */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    aspectRatio: '16/9',
                    background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0533 100%)',
                  }}
                >
                  <div className="text-center px-4">
                    <ImageIcon className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: '#a78bfa' }} />
                    <p className="text-xs font-medium leading-snug" style={{ color: '#8b77ff' }}>{label}</p>
                  </div>
                  <div
                    className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}
                  >
                    #{n}
                  </div>
                </div>
                <div className="p-4 bg-white flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500 leading-snug flex-1">{label}</p>
                  <a
                    href={`/press-kit/screenshots/screenshot-${n}.png`}
                    download
                    aria-label={`Télécharger screenshot ${n}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: '#5B47F5' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    .png
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTES ───────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Quotes citables</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Phrases prêtes pour vos articles.</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Librement citables, attribuées à &ldquo;L&apos;équipe KONVERT&rdquo;.
            </p>
          </div>

          <div className="space-y-5">
            {QUOTES.map(({ id, text, label }, idx) => (
              <div
                key={id}
                className={`reveal delay-${idx + 1} bg-white rounded-2xl border border-gray-100 p-6`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-1 rounded-full self-stretch"
                    style={{ background: '#5B47F5', minHeight: '100%' }}
                  />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium mb-3">{text}</p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">L&apos;équipe KONVERT</span>
                        {' · '}
                        <span className="text-[#5B47F5]">{label}</span>
                      </p>
                      <CopyButton text={`${text}\n— L'équipe KONVERT`} label="Copier" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT PRESSE ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-10">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Contact presse</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Vous avez des questions ?</h2>
          </div>

          <div
            className="reveal delay-2 rounded-3xl border-2 p-8 sm:p-10"
            style={{ borderColor: 'rgba(91,71,245,0.15)', background: 'rgba(91,71,245,0.02)' }}
          >
            <div className="grid sm:grid-cols-2 gap-8">

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  <a
                    href="mailto:press@konvertpilot.com"
                    className="text-base font-semibold text-[#5B47F5] hover:underline"
                  >
                    press@konvertpilot.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Disponibilité</p>
                  <p className="text-sm text-gray-700">Réponse sous 24h en semaine</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Format</p>
                  <p className="text-sm text-gray-700">
                    Démo Loom 2 min disponible sur demande.<br />
                    Interview 15 min possible en visio.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Adresse légale</p>
                  <address className="not-italic text-sm text-gray-700 leading-relaxed">
                    Luna Corporation Ltd<br />
                    71-75 Shelton Street<br />
                    Covent Garden<br />
                    London WC2H 9JQ, UK
                  </address>
                </div>
                <div>
                  <a
                    href="mailto:press@konvertpilot.com"
                    aria-label="Envoyer un email presse"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 16px rgba(91,71,245,0.3)' }}
                  >
                    <Mail className="w-4 h-4" />
                    Écrire à l&apos;équipe presse
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#111827' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
            style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            Launch · 20 mai 2026
          </div>

          <h2 className="reveal delay-1 text-3xl sm:text-4xl font-black text-white mb-4">
            Tu couvres le launch ?
          </h2>
          <p className="reveal delay-2 text-base mb-10" style={{ color: '#8b8baa' }}>
            Préviens-nous, on te file le scoop et un accès preview avant lundi 9h.
          </p>

          <div className="reveal delay-3">
            <a
              href="mailto:press@konvertpilot.com"
              aria-label="Écrire à l'équipe presse pour le launch"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.4)' }}
            >
              Écris à press@konvertpilot.com
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="reveal delay-4 mt-10 text-xs" style={{ color: '#4b5563' }}>
            KONVERT · édité par{' '}
            <span className="text-gray-500 font-medium">Luna Corporation Ltd</span>
            {' · '}
            <Link href="/legal" className="hover:text-gray-400 transition-colors">Mentions légales</Link>
            {' · '}
            <Link href="/about" className="hover:text-gray-400 transition-colors">À propos</Link>
          </p>
        </div>
      </section>
    </>
  )
}
