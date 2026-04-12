'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Robot, Palette, ChartBar, LinkSimple, Flask, Globe,
  Lightning, ShieldCheck, Clock, Check, Sparkle, TrendUp, ArrowRight
} from '@phosphor-icons/react'
import Tooltip from '@/components/ui/Tooltip'

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
  @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
`

const FEATURES_MAIN = [
  {
    id: 'ia',
    icon: Robot,
    badge: '🤖 IA Native',
    title: 'Génération IA avec Claude',
    subtitle: 'Le copy parfait. En 30 secondes.',
    desc: "KONVERT utilise Claude AI d'Anthropic — le modèle de langage le plus avancé pour le copywriting e-commerce. Accroche percutante, proposition de valeur unique, liste de bénéfices, FAQ personnalisée, CTA optimisés. Tout en 30 secondes.",
    details: [
      'Copy entièrement personnalisé par produit',
      'Adapté à votre niche et audience cible',
      'Optimisé pour la conversion (pas juste beau)',
      'Rééditable manuellement dans le builder',
    ],
    stats: [
      { value: '30s', label: 'Génération' },
      { value: '98%', label: 'Satisfaction' },
      { value: '4.9★', label: 'Note moyenne' },
    ],
    visual: 'ai',
    accent: '#5B47F5',
    accentBg: 'bg-[#5B47F5]/10',
    accentText: 'text-[#5B47F5]',
    gradient: 'from-[#5B47F5]/15 to-[#5B47F5]/5',
    reversed: false,
  },
  {
    id: 'templates',
    icon: Palette,
    badge: '🎨 17 Templates',
    title: '17 Templates Premium',
    subtitle: 'Un design pour chaque niche.',
    desc: "17 templates conçus par des experts e-commerce et testés sur des milliers de boutiques. Mode, Tech, Beauté, Sport, Gaming, Alimentation, Animaux... Chaque template est optimisé pour maximiser les conversions dans sa niche.",
    details: [
      '17 templates niches exclusifs',
      'Testé sur +50 000 pages générées',
      'Personnalisable dans le builder',
      'Nouveaux templates chaque mois',
    ],
    stats: [
      { value: '17', label: 'Templates' },
      { value: '8', label: 'Niches' },
      { value: '+4.8%', label: 'CVR moyen' },
    ],
    visual: 'templates',
    accent: '#ec4899',
    accentBg: 'bg-pink-50',
    accentText: 'text-pink-500',
    gradient: 'from-pink-500/15 to-pink-500/5',
    reversed: true,
  },
  {
    id: 'analytics',
    icon: ChartBar,
    badge: '📊 Analytics',
    title: 'Analytics Temps Réel',
    subtitle: 'Vos données. Vos décisions.',
    desc: "Suivez chaque interaction sur vos pages : scroll depth, clics CTA, temps passé, taux de rebond, conversions, ROAS. Un tableau de bord en temps réel pour prendre des décisions basées sur les données — pas sur des intuitions.",
    details: [
      'Scroll depth & heatmap par section',
      'Tracking conversions Shopify/WooCommerce',
      'Comparaison entre pages A/B',
      'Export CSV et rapports PDF automatiques',
    ],
    stats: [
      { value: '100%', label: 'Temps réel' },
      { value: '12+', label: 'Métriques' },
      { value: 'PDF', label: 'Auto-rapports' },
    ],
    visual: 'analytics',
    accent: '#10b981',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-500',
    gradient: 'from-emerald-500/15 to-emerald-500/5',
    reversed: false,
  },
  {
    id: 'integrations',
    icon: LinkSimple,
    badge: '🔗 Intégrations',
    title: 'Shopify & WooCommerce Natifs',
    subtitle: 'Publiez en 1 clic.',
    desc: "Connexion OAuth sécurisée avec Shopify et WooCommerce. Une fois connecté, publiez n'importe quelle page directement sur votre boutique sans copier-coller de code. Synchronisation automatique des prix et stocks.",
    details: [
      'OAuth sécurisé — pas de mot de passe stocké',
      'Publication directe sans copier-coller',
      'Sync automatique prix et disponibilité',
      'Compatible toutes les versions de thèmes',
    ],
    stats: [
      { value: '1 clic', label: 'Publication' },
      { value: 'OAuth', label: 'Sécurité' },
      { value: '100%', label: 'Compatibilité' },
    ],
    visual: 'integrations',
    accent: '#f97316',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-500',
    gradient: 'from-orange-500/15 to-orange-500/5',
    reversed: true,
  },
  {
    id: 'abtesting',
    icon: Flask,
    badge: '🧪 A/B Testing',
    title: 'A/B Testing Intégré',
    subtitle: 'Testez. Apprenez. Optimisez.',
    desc: "Créez des variantes de vos pages en quelques clics et testez-les en parallèle. KONVERT distribue le trafic automatiquement et identifie la version gagnante avec une significativité statistique. Gardez ce qui performe.",
    details: [
      'Variantes illimitées par page',
      'Distribution trafic automatique 50/50',
      'Significativité statistique (95%)',
      'Auto-winner après 1 000 visiteurs',
    ],
    stats: [
      { value: '∞', label: 'Variantes' },
      { value: '95%', label: 'Confiance stat.' },
      { value: '1k', label: 'Visiteurs seuil' },
    ],
    visual: 'abtesting',
    accent: '#3b82f6',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-500',
    gradient: 'from-blue-500/15 to-blue-500/5',
    reversed: false,
  },
  {
    id: 'langues',
    icon: Globe,
    badge: '🌍 8 Langues',
    title: 'Génération Multi-langues',
    subtitle: 'Vendez partout dans le monde.',
    desc: "Générez vos pages en français, anglais, espagnol, allemand, italien, portugais, arabe et chinois. Chaque copy est natif — pas une traduction mécanique. Atteignez des marchés internationaux sans agence de traduction.",
    details: [
      'FR, EN, ES, DE, IT, PT, AR, ZH',
      'Copy natif, pas une traduction Google',
      'Adapté aux habitudes culturelles de chaque marché',
      'Sélection de la langue en 1 clic',
    ],
    stats: [
      { value: '8', label: 'Langues' },
      { value: 'Natif', label: 'Qualité copy' },
      { value: '1 clic', label: 'Changement' },
    ],
    visual: 'langues',
    accent: '#14b8a6',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-500',
    gradient: 'from-teal-500/15 to-teal-500/5',
    reversed: true,
  },
]

const OTHER_FEATURES = [
  { icon: Lightning,   title: 'Builder drag & drop',       desc: 'Éditez chaque section visuellement après la génération.',  tooltip: 'Glissez-déposez chaque bloc sans coder' },
  { icon: ShieldCheck, title: 'Sécurité enterprise',        desc: 'OAuth, chiffrement AES-256, conformité RGPD.',             tooltip: 'Données chiffrées AES-256, conformité RGPD' },
  { icon: Clock,       title: 'Génération en 30 secondes',  desc: "Le record absolu vs n'importe quel outil concurrent.",     tooltip: 'De l\'URL au copy complet en 30 secondes' },
  { icon: TrendUp,     title: 'Optimisé Core Web Vitals',   desc: 'LCP < 2s, CLS = 0, INP optimal. Score SEO maximal.',      tooltip: 'LCP < 2s · CLS 0 · Score SEO optimal' },
  { icon: Sparkle,     title: 'Scraper multi-sources',      desc: 'AliExpress, Amazon, Alibaba, Temu, Shein et plus.',        tooltip: 'Scrape AliExpress, Amazon, Alibaba et plus' },
  { icon: ChartBar,    title: 'Rapports PDF auto',          desc: 'Générés et envoyés automatiquement à vos clients.',        tooltip: 'PDF brandés envoyés automatiquement aux clients' },
]

const COMPARE_ROWS = [
  { label: 'Temps pour créer une page', konvert: '30 secondes', diy: '4–6 heures', freelance: '2–5 jours' },
  { label: 'Coût', konvert: 'Dès 29€/mois', diy: '0€ (mais votre temps)', freelance: '300–1500€/page' },
  { label: 'Qualité copy', konvert: 'IA spécialisée e-com', diy: 'Variable, souvent faible', freelance: 'Dépend du freelance' },
  { label: 'Intégration Shopify', konvert: 'Native, 1 clic', diy: 'Manuelle, copier-coller', freelance: 'Parfois incluse' },
  { label: 'A/B Testing', konvert: 'Intégré & automatisé', diy: 'Impossible sans dev', freelance: 'En option payante' },
  { label: 'Support', konvert: '24h, en français', diy: 'Forum, articles, YouTube', freelance: 'Selon dispo' },
]

const DEEP_DIVE_TABS = [
  {
    id: 'ia',
    label: 'Génération IA',
    icon: '🤖',
    title: 'Comment fonctionne la génération IA ?',
    desc: "KONVERT utilise Claude AI d'Anthropic, entraîné sur des millions de pages e-commerce performantes. En analysant votre URL produit, il extrait les informations clés et génère un copy optimisé pour la conversion.",
    steps: [
      { num: '1', title: 'Vous collez l\'URL produit', detail: 'KONVERT scrape automatiquement le titre, les images, le prix, la description et les avis.' },
      { num: '2', title: 'L\'IA analyse et génère', detail: 'Claude identifie les arguments de vente clés, les objections possibles et rédige une page complète en 30 secondes.' },
      { num: '3', title: 'Vous personnalisez et publiez', detail: 'Éditez chaque bloc dans le builder, choisissez un template et publiez en 1 clic sur votre boutique.' },
    ],
    metrics: [
      { value: '30s', label: 'Temps moyen de génération' },
      { value: '+62%', label: 'Meilleur copy vs rédaction manuelle' },
      { value: '8', label: 'Langues supportées' },
    ],
  },
  {
    id: 'abtesting',
    label: 'A/B Testing',
    icon: '🧪',
    title: 'Un A/B testing qui travaille pour vous',
    desc: "L'A/B testing manuel est chronophage et statistiquement risqué. KONVERT automatise tout : distribution du trafic, calcul de la significativité, et déclaration du gagnant — sans intervention de votre part.",
    steps: [
      { num: '1', title: 'Créez une variante en 1 clic', detail: 'Dupliquez une page existante, modifiez le titre, le CTA ou le layout. Chaque changement est tracké séparément.' },
      { num: '2', title: 'KONVERT distribue le trafic', detail: 'Le trafic est divisé 50/50 automatiquement. Aucun code à ajouter, aucun plugin externe.' },
      { num: '3', title: 'Le gagnant est déclaré automatiquement', detail: 'Après 1 000 visiteurs ou 95% de confiance statistique, KONVERT déclare la version gagnante et redirige tout le trafic.' },
    ],
    metrics: [
      { value: '95%', label: 'Seuil de confiance statistique' },
      { value: '1000', label: 'Visiteurs pour déclaration auto' },
      { value: '+23%', label: 'Gain moyen après optimisation' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📊',
    title: 'Des analytics qui révèlent ce qui convertit',
    desc: "Les analytics KONVERT vont au-delà des simples pages vues. Chaque section de votre page est tracée : où les visiteurs décrochent, quels CTA fonctionnent, et quel segment d'audience convertit le mieux.",
    steps: [
      { num: '1', title: 'Tracking automatique à l\'installation', detail: 'Dès que votre page est publiée, KONVERT commence à collecter les données. Aucun tag Google Analytics à configurer.' },
      { num: '2', title: 'Tableau de bord en temps réel', detail: 'Scroll depth par section, taux de clic CTA, temps passé, taux de rebond et conversions — tout en live.' },
      { num: '3', title: 'Rapports PDF automatiques', detail: 'Chaque semaine, un rapport PDF brandé est généré et envoyé par email. Parfait pour les agences qui gèrent plusieurs clients.' },
    ],
    metrics: [
      { value: '12+', label: 'Métriques trackées par page' },
      { value: '100%', label: 'Temps réel, 0 délai' },
      { value: 'Auto', label: 'Rapports PDF hebdomadaires' },
    ],
  },
]

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('ia')

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const currentTab = DEEP_DIVE_TABS.find(t => t.id === activeTab)!

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="features" className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Sparkle className="w-3.5 h-3.5" weight="fill" />
            Fonctionnalités
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Tout ce qu'il faut pour<br />
            <span style={{ color: '#8b77ff' }}>vendre plus. Dès aujourd'hui.</span>
          </h1>
          <p className="reveal delay-2 text-lg max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
            KONVERT combine IA générative, templates optimisés, analytics temps réel et intégrations natives pour vous donner un avantage concurrentiel immédiat.
          </p>
          <div className="reveal delay-3">
            <Link
              href="/demo"
              className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Voir la démo live
              <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES DÉTAILLÉES ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-24">
          {FEATURES_MAIN.map((f) => {
            const { icon: Icon } = f
            return (
              <div key={f.id} id={f.id} className={`grid lg:grid-cols-2 gap-14 items-center ${f.reversed ? 'lg:grid-flow-dense' : ''}`}>

                {/* Contenu */}
                <div className={`reveal ${f.reversed ? 'lg:col-start-2' : ''}`}>
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                        style={{ background: `${f.accent}15`, color: f.accent }}>
                    {f.badge}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{f.title}</h2>
                  <p className="text-[#5B47F5] font-semibold text-sm mb-4">{f.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Check className={`w-4 h-4 flex-shrink-0 ${f.accentText}`} weight="bold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {/* Mini-stats */}
                  <div className="flex gap-4 mt-4">
                    {f.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-xl font-black" style={{ color: f.accent }}>{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={`reveal delay-2 ${f.reversed ? 'lg:col-start-1 lg:row-start-1' : ''} rounded-3xl p-10 min-h-[280px] flex flex-col items-center justify-center relative overflow-hidden gap-6`}
                     style={{ background: `linear-gradient(135deg, ${f.accent}15 0%, ${f.accent}06 100%)` }}>
                  <Tooltip content={f.subtitle} position="top">
                    <div className={`w-20 h-20 rounded-3xl ${f.accentBg} flex items-center justify-center cursor-default transition-transform duration-200 hover:scale-110`}
                         style={{ boxShadow: `0 20px 60px ${f.accent}25` }}>
                      <Icon className={`w-10 h-10 ${f.accentText}`} weight="duotone" />
                    </div>
                  </Tooltip>
                  {/* Preview mock card */}
                  <div className="w-full max-w-xs rounded-2xl bg-white/70 border border-white/80 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${f.accent}20` }}>
                        <Icon className={`w-4 h-4 ${f.accentText}`} weight="duotone" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">{f.badge}</div>
                        <div className="text-xs text-gray-400">{f.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {f.stats.map((s) => (
                        <div key={s.label} className="flex-1 rounded-xl p-2 text-center" style={{ background: `${f.accent}10` }}>
                          <p className="text-sm font-black" style={{ color: f.accent }}>{s.value}</p>
                          <p className="text-[10px] text-gray-400">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Décoration */}
                  <div className="absolute top-5 right-5 text-4xl opacity-20 select-none">{f.badge.split(' ')[0]}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── COMPARATIF ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Comparatif</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">KONVERT vs les alternatives</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">Pourquoi passer des heures à bricoler ou payer une fortune en freelances, quand KONVERT fait tout en 30 secondes ?</p>
          </div>

          {/* Header colonnes */}
          <div className="reveal grid grid-cols-4 gap-3 mb-3 px-2">
            <div />
            <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
              <p className="text-white font-black text-sm">KONVERT</p>
              <p className="text-white/70 text-xs mt-0.5">La solution IA</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Faire soi-même</p>
              <p className="text-gray-400 text-xs mt-0.5">DIY</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Freelance</p>
              <p className="text-gray-400 text-xs mt-0.5">Agence / Indépendant</p>
            </div>
          </div>

          {/* Lignes */}
          <div className="reveal delay-1 rounded-2xl overflow-hidden border border-gray-100">
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-4 gap-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-4 py-4 flex items-center">
                  <span className="text-xs font-semibold text-gray-600">{row.label}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center" style={{ background: 'rgba(91,71,245,0.06)' }}>
                  <span className="text-xs font-bold text-[#5B47F5] text-center">{row.konvert}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">{row.diy}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">{row.freelance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTRES FEATURES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Et bien plus encore</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Chaque détail compte.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OTHER_FEATURES.map(({ icon: Icon, title, desc, tooltip }, idx) => (
              <div key={title} className={`reveal delay-${Math.min(idx + 1, 4)} card-hover-violet bg-white p-6 rounded-2xl border border-gray-100`}>
                <Tooltip content={tooltip} position="top">
                  <div className="w-9 h-9 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center mb-4 cursor-default">
                    <Icon className="w-5 h-5 text-[#5B47F5]" weight="duotone" />
                  </div>
                </Tooltip>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf8ff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Deep dive</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Comment ça marche vraiment ?</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">Plongez dans les détails techniques de chaque fonctionnalité clé.</p>
          </div>

          {/* Tabs */}
          <div className="reveal flex gap-2 justify-center mb-10 flex-wrap">
            {DEEP_DIVE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 bg-white border border-gray-200 hover:border-[#5B47F5]/40 hover:text-[#5B47F5]'
                }`}
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' } : {}}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="reveal delay-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-3">{currentTab.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">{currentTab.desc}</p>

            {/* Steps */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {currentTab.steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black mb-3"
                       style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
                    {step.num}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1.5 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>

            {/* Métriques */}
            <div className="flex gap-6 pt-6 border-t border-gray-100 flex-wrap">
              {currentTab.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-2xl font-black text-[#5B47F5]">{m.value}</p>
                  <p className="text-xs text-gray-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="reveal text-3xl font-black text-white mb-4">
            Prêt à tester toutes ces fonctionnalités ?
          </h2>
          <p className="reveal delay-1 text-sm mb-8" style={{ color: '#8b8baa' }}>
            14 jours d'accès complet. Sans carte de crédit.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Voir les tarifs
              <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
