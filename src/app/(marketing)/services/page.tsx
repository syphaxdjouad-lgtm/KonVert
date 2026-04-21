import Link from 'next/link'
import { ArrowRight, Search, BarChart3, Zap, Check, TrendingUp, Clock, Star, ChevronDown } from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'seo',
    icon: Search,
    badge: 'Audit SEO',
    title: 'Votre boutique perd du trafic chaque jour.',
    subtitle: 'On identifie exactement pourquoi — et comment l\'arrêter.',
    desc: 'La plupart des boutiques Shopify et WooCommerce ont des problèmes SEO invisibles à l\'oeil nu. Vitesse dégradée, balises en double, pages orphelines, structured data manquantes. Chaque problème non réglé, c\'est du trafic qui part chez le concurrent.',
    price: '299€',
    priceSub: 'Paiement unique · Livré en 5 jours',
    features: [
      'Audit 100+ points techniques — zéro approximation',
      'Core Web Vitals : score exact + corrections identifiées',
      'Fiches produit analysées : title, meta, contenu, maillage',
      'Backlinks & autorité domaine : où vous en êtes réellement',
      'Plan d\'action classé par impact — ce qu\'il faut faire en premier',
      'Call de restitution 60 min pour tout comprendre et appliquer',
    ],
    cta: 'Commander l\'audit',
    ctaHref: '/contact?subject=Audit+SEO',
    accent: '#5B47F5',
  },
  {
    id: 'reporting',
    icon: BarChart3,
    badge: 'Reporting Mensuel',
    title: 'Vous investissez en pub sans savoir ce qui rapporte.',
    subtitle: 'Un dashboard qui vous dit où mettre l\'argent — et où l\'arrêter.',
    desc: 'ROAS qui varie, CAC qui monte, taux de retour qui grimpe : sans dashboard fiable, vous pilotez à l\'aveugle. Chaque mois, vous recevez vos KPIs commentés par un expert — pas un export brut, une analyse avec des recommandations actionnables.',
    price: '149€',
    priceSub: '/mois · Sans engagement',
    features: [
      'Dashboard temps réel : ROAS, CVR, CAC, LTV, panier moyen',
      'Rapport mensuel commenté — pas un tableur, une analyse',
      'Suivi par canal : Meta, TikTok, Google, organic — comparé',
      'Pages les plus rentables identifiées — et les moins performantes',
      'Alertes automatiques si un KPI sort du seuil normal',
      'Call mensuel 30 min pour décider ensemble des prochains moves',
    ],
    cta: 'Démarrer le suivi',
    ctaHref: '/contact?subject=Suivi+Reporting',
    accent: '#10b981',
  },
  {
    id: 'coaching',
    icon: TrendingUp,
    badge: 'Coaching E-commerce',
    title: 'Vous travaillez beaucoup. Vos chiffres n\'avancent pas.',
    subtitle: 'Deux heures pour débloquer ce que des semaines n\'ont pas résolu.',
    desc: 'Produit qui ne se vend pas, pub qui ne convertit pas, boutique qui tourne mais ne décolle pas. Ce n\'est pas un problème de travail — c\'est un problème de méthode. Chaque session est préparée sur votre situation réelle.',
    price: '199€',
    priceSub: 'Par session · 2h préparation incluse',
    features: [
      'Audit rapide de votre boutique avant la session — on arrive préparés',
      'Stratégie produit : sélection, positionnement, pricing',
      'Analyse de vos campagnes Meta/TikTok — ce qui peut être sauvé',
      'CRO : les 5 points qui tuent votre conversion et comment les corriger',
      'Sélection fournisseurs : sourcer mieux pour mieux marger',
      'Accès à la communauté privée d\'e-commerçants',
    ],
    cta: 'Réserver une session',
    ctaHref: '/contact?subject=Coaching',
    accent: '#f97316',
  },
]

const PROCESS = [
  { num: '01', title: 'Appel de 20 minutes', desc: 'Pas un entretien de vente. On comprend votre situation réelle — chiffres, problèmes, ce que vous avez déjà essayé.' },
  { num: '02', title: 'Proposition claire', desc: 'Périmètre exact, prix fixe, délai garanti. Pas de surprise, pas de devis qui gonfle en cours de route.' },
  { num: '03', title: 'Exécution sans friction', desc: 'On démarre dans les 48h. Accès direct à votre expert — pas un ticket support, une conversation.' },
  { num: '04', title: 'Résultats mesurés', desc: 'Chaque livrable s\'accompagne de métriques de référence. Dans 30 jours, vous mesurez l\'impact réel.' },
]

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Boutique mode Shopify',
    quote: 'J\'avais 38 000 visites par mois et 1,4% de conversion. L\'audit a trouvé 11 problèmes critiques que j\'avais depuis l\'ouverture. Trois mois après les corrections : 2,9% de conversion et mon trafic organique a doublé sans toucher aux pubs.',
    stars: 5,
    metric: '+112% trafic · CVR x2',
    avatar: 'ML',
    accent: '#5B47F5',
  },
  {
    name: 'Kevin B.',
    role: 'Dropshipping niche sport',
    quote: 'Mon ROAS était à 1.8 depuis 4 mois. J\'avais essayé de tout changer sauf ce qu\'il fallait changer. Après deux sessions, on a revu le positionnement produit et les angles d\'accroche. Six semaines plus tard : ROAS à 4.2 sur les mêmes budgets.',
    stars: 5,
    metric: 'ROAS 1.8 → 4.2',
    avatar: 'KB',
    accent: '#10b981',
  },
  {
    name: 'Thomas R.',
    role: 'Agence SMMA · 19 clients',
    quote: 'On passait 20h par mois à faire les reportings manuellement. Maintenant le dashboard se met à jour automatiquement et le rapport commenté part aux clients le 5 de chaque mois. On a réinvesti ce temps en prospection — de 12 à 19 clients en 3 mois.',
    stars: 5,
    metric: '20h récupérées/mois',
    avatar: 'TR',
    accent: '#f97316',
  },
]

const HERO_STATS = [
  { value: '2 800+', label: 'Boutiques' },
  { value: '4.9/5', label: 'Satisfaction' },
  { value: '<48h', label: 'Démarrage' },
]

// ─── SVG ILLUSTRATIONS ───────────────────────────────────────────────────────

function SeoVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full h-auto">
      {/* Browser frame */}
      <rect x="20" y="16" width="280" height="208" rx="12" fill="#0d0d1a" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <rect x="20" y="16" width="280" height="32" rx="12" fill="rgba(91,71,245,0.08)" />
      <circle cx="40" cy="32" r="4" fill="rgba(239,68,68,0.6)" />
      <circle cx="54" cy="32" r="4" fill="rgba(245,158,11,0.6)" />
      <circle cx="68" cy="32" r="4" fill="rgba(74,222,128,0.6)" />
      {/* Score circle */}
      <circle cx="90" cy="130" r="40" stroke="rgba(91,71,245,0.15)" strokeWidth="6" />
      <circle cx="90" cy="130" r="40" stroke="#5B47F5" strokeWidth="6" strokeDasharray="201" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 90 130)" />
      <text x="90" y="126" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">84</text>
      <text x="90" y="142" textAnchor="middle" fill="rgba(167,139,250,0.6)" fontSize="9" fontWeight="600">/100</text>
      {/* Audit bars */}
      {[
        { y: 80, w: 120, color: '#5B47F5', label: 'Performance' },
        { y: 102, w: 100, color: '#8b77ff', label: 'SEO' },
        { y: 124, w: 135, color: '#5B47F5', label: 'Best Practices' },
        { y: 146, w: 80, color: '#f59e0b', label: 'Accessibility' },
        { y: 168, w: 110, color: '#10b981', label: 'Core Vitals' },
        { y: 190, w: 60, color: '#ef4444', label: 'Links' },
      ].map((bar) => (
        <g key={bar.label}>
          <text x="155" y={bar.y + 10} fill="rgba(196,181,253,0.5)" fontSize="8">{bar.label}</text>
          <rect x="155" y={bar.y + 14} width="130" height="5" rx="2.5" fill="rgba(255,255,255,0.05)" />
          <rect x="155" y={bar.y + 14} width={bar.w} height="5" rx="2.5" fill={bar.color} opacity="0.8" />
        </g>
      ))}
    </svg>
  )
}

function ReportingVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full h-auto">
      {/* Dashboard frame */}
      <rect x="20" y="16" width="280" height="208" rx="12" fill="#0d0d1a" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {/* KPI cards row */}
      {[
        { x: 32, label: 'ROAS', value: '4.2x', color: '#10b981' },
        { x: 106, label: 'CVR', value: '3.1%', color: '#5B47F5' },
        { x: 180, label: 'CAC', value: '12€', color: '#f59e0b' },
        { x: 254, label: 'AOV', value: '67€', color: '#10b981' },
      ].map((kpi) => (
        <g key={kpi.label}>
          <rect x={kpi.x} y="30" width="62" height="44" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <text x={kpi.x + 8} y="46" fill="rgba(167,139,250,0.5)" fontSize="7" fontWeight="600">{kpi.label}</text>
          <text x={kpi.x + 8} y="64" fill="#fff" fontSize="14" fontWeight="800">{kpi.value}</text>
          <circle cx={kpi.x + 54} cy="42" r="3" fill={kpi.color} opacity="0.4" />
        </g>
      ))}
      {/* Chart bars */}
      {[40, 65, 50, 80, 70, 95, 85, 60, 75, 90, 55, 70].map((h, i) => (
        <rect
          key={i}
          x={36 + i * 22}
          y={200 - h}
          width="14"
          height={h}
          rx="3"
          fill={i === 9 ? '#10b981' : 'rgba(16,185,129,0.2)'}
        />
      ))}
      {/* Chart baseline */}
      <line x1="32" y1="200" x2="300" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <text x="32" y="216" fill="rgba(167,139,250,0.4)" fontSize="7">Jan</text>
      <text x="164" y="216" fill="rgba(167,139,250,0.4)" fontSize="7">Jul</text>
      <text x="278" y="216" fill="rgba(167,139,250,0.4)" fontSize="7">Dec</text>
    </svg>
  )
}

function CoachingVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full h-auto">
      {/* Frame */}
      <rect x="20" y="16" width="280" height="208" rx="12" fill="#0d0d1a" stroke="rgba(249,115,22,0.2)" strokeWidth="1" />
      {/* Before / After */}
      <text x="40" y="44" fill="rgba(249,115,22,0.7)" fontSize="9" fontWeight="700" letterSpacing="0.1em">AVANT</text>
      <text x="180" y="44" fill="rgba(74,222,128,0.7)" fontSize="9" fontWeight="700" letterSpacing="0.1em">APRÈS</text>
      <line x1="160" y1="34" x2="160" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
      {/* Before metrics */}
      {[
        { y: 64, label: 'ROAS', value: '1.8x', color: 'rgba(239,68,68,0.6)' },
        { y: 96, label: 'CVR', value: '1.1%', color: 'rgba(239,68,68,0.6)' },
        { y: 128, label: 'CAC', value: '38€', color: 'rgba(245,158,11,0.6)' },
        { y: 160, label: 'Marge', value: '22%', color: 'rgba(239,68,68,0.6)' },
      ].map((m) => (
        <g key={'before-' + m.label}>
          <text x="40" y={m.y} fill="rgba(196,181,253,0.5)" fontSize="8">{m.label}</text>
          <text x="40" y={m.y + 18} fill={m.color} fontSize="16" fontWeight="800">{m.value}</text>
        </g>
      ))}
      {/* After metrics */}
      {[
        { y: 64, label: 'ROAS', value: '4.2x', color: '#10b981' },
        { y: 96, label: 'CVR', value: '3.4%', color: '#10b981' },
        { y: 128, label: 'CAC', value: '14€', color: '#10b981' },
        { y: 160, label: 'Marge', value: '41%', color: '#10b981' },
      ].map((m) => (
        <g key={'after-' + m.label}>
          <text x="180" y={m.y} fill="rgba(196,181,253,0.5)" fontSize="8">{m.label}</text>
          <text x="180" y={m.y + 18} fill={m.color} fontSize="16" fontWeight="800">{m.value}</text>
        </g>
      ))}
      {/* Arrow */}
      <path d="M140 120 L155 120" stroke="rgba(74,222,128,0.4)" strokeWidth="2" markerEnd="url(#arrowGreen)" />
      <defs>
        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="rgba(74,222,128,0.5)" />
        </marker>
      </defs>
    </svg>
  )
}

const SERVICE_VISUALS = [SeoVisual, ReportingVisual, CoachingVisual]

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      {/* ── CSS Animations ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes float-slow { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-30px); } }
        @keyframes float-mid  { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,20px); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(91,71,245,0.4); } 70% { box-shadow: 0 0 0 20px rgba(91,71,245,0); } 100% { box-shadow: 0 0 0 0 rgba(91,71,245,0); } }
        .float-slow { animation: float-slow 11s ease-in-out infinite; }
        .float-mid  { animation: float-mid 7s ease-in-out infinite; }
        .pulse-ring  { animation: pulse-ring 2.5s ease-out infinite; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: '#08080f' }}>
        {/* Grille de fond */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.1) 0 1px,transparent 1px 48px),repeating-linear-gradient(90deg,rgba(255,255,255,0.1) 0 1px,transparent 1px 48px)',
        }} />
        {/* Blobs */}
        <div className="float-slow absolute top-20 left-[15%] w-72 h-72 rounded-full opacity-20 blur-[100px]" style={{ background: '#5B47F5' }} />
        <div className="float-mid absolute bottom-10 right-[10%] w-60 h-60 rounded-full opacity-15 blur-[80px]" style={{ background: '#10b981' }} />
        <div className="float-slow absolute top-1/2 right-[30%] w-48 h-48 rounded-full opacity-10 blur-[60px]" style={{ background: '#f97316' }} />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
            style={{ background: 'rgba(91,71,245,0.12)', borderColor: 'rgba(91,71,245,0.25)', color: '#a78bfa' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Services & Accompagnement
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.08]"
            style={{ letterSpacing: '-0.03em', color: '#fff' }}
          >
            Votre boutique tourne.
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #8b77ff, #a78bfa, #c4b5fd)' }}>
              Mais elle peut faire beaucoup mieux.
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: '#8b8baa' }}>
            SEO technique, pilotage par les données, stratégie e-commerce — trois services pour arrêter de perdre de l&apos;argent là où vous ne regardez pas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm pulse-ring"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Parler à un expert — gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#seo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-white/5"
              style={{ color: '#8b8baa', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Voir les services
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black" style={{ color: '#fff' }}>{value}</p>
                <p className="text-xs font-medium mt-1" style={{ color: 'rgba(167,139,250,0.5)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {SERVICES.map((service, idx) => {
            const Visual = SERVICE_VISUALS[idx]
            const isReversed = idx % 2 === 1
            return (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 ${idx > 0 ? 'border-t border-gray-100' : ''} ${isReversed ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Contenu */}
                <div className={isReversed ? 'lg:col-start-2' : ''}>
                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                    style={{ background: `${service.accent}12`, color: service.accent }}
                  >
                    {service.badge}
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
                    {service.title}
                  </h2>
                  <p className="font-semibold text-sm mb-4" style={{ color: service.accent }}>
                    {service.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
                    {service.desc}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: service.accent }} strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-5">
                    <Link
                      href={service.ctaHref}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${service.accent}, ${service.accent}cc)`, boxShadow: `0 4px 14px ${service.accent}30` }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{service.price}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{service.priceSub}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual SVG */}
                <div
                  className={`${isReversed ? 'lg:col-start-1 lg:row-start-1' : ''} rounded-2xl p-6 sm:p-8 relative overflow-hidden`}
                  style={{ background: `linear-gradient(135deg, ${service.accent}0a, ${service.accent}04)`, border: `1px solid ${service.accent}15` }}
                >
                  <Visual />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PROCESSUS ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#08080f' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>
              Notre processus
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              De l&apos;appel au résultat.
            </h2>
            <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: '#8b8baa' }}>
              Pas de devis qui traîne, pas de réunions inutiles. Un processus court conçu pour des résultats rapides.
            </p>
          </div>

          {/* Timeline desktop */}
          <div className="hidden lg:grid grid-cols-4 gap-0 relative">
            {/* Ligne de connexion */}
            <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg, #5B47F5, #5B47F5 50%, rgba(91,71,245,0.2) 50%)' }} />

            {PROCESS.map(({ num, title, desc }, i) => (
              <div key={num} className="relative text-center px-4">
                {/* Node */}
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center text-sm font-bold relative z-10"
                  style={{
                    background: i < 2 ? 'linear-gradient(135deg, #5B47F5, #7c6af7)' : 'rgba(91,71,245,0.1)',
                    color: i < 2 ? '#fff' : 'rgba(167,139,250,0.5)',
                    border: `2px solid ${i < 2 ? '#5B47F5' : 'rgba(91,71,245,0.2)'}`,
                    boxShadow: i < 2 ? '0 4px 16px rgba(91,71,245,0.3)' : 'none',
                  }}
                >
                  {num}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#8b8baa' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline mobile */}
          <div className="lg:hidden space-y-0 relative pl-8">
            {/* Ligne verticale */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, #5B47F5, rgba(91,71,245,0.1))' }} />

            {PROCESS.map(({ num, title, desc }, i) => (
              <div key={num} className="relative pb-8 last:pb-0">
                {/* Node */}
                <div
                  className="absolute left-[-8px] top-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10"
                  style={{
                    background: i < 2 ? 'linear-gradient(135deg, #5B47F5, #7c6af7)' : '#0d0d1a',
                    color: i < 2 ? '#fff' : 'rgba(167,139,250,0.5)',
                    border: `2px solid ${i < 2 ? '#5B47F5' : 'rgba(91,71,245,0.2)'}`,
                  }}
                >
                  {num}
                </div>
                <div className="ml-10">
                  <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#8b8baa' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0d0d1a' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>
              Résultats réels
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Ce que ça change concrètement.
            </h2>
            <p className="text-sm mt-3" style={{ color: '#8b8baa' }}>
              Des e-commerçants qui avaient exactement vos problèmes, il y a quelques semaines.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote, stars, metric, avatar, accent }) => (
              <div
                key={name}
                className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `2px solid ${accent}`,
                }}
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Metric */}
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-4"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  {metric}
                </span>

                {/* Quote */}
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(196,181,253,0.75)' }}>
                  &ldquo;{quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: accent }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{name}</p>
                    <p className="text-xs" style={{ color: 'rgba(167,139,250,0.5)' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ background: '#08080f' }}>
        {/* Blobs */}
        <div className="float-slow absolute top-10 left-[20%] w-48 h-48 rounded-full opacity-20 blur-[80px]" style={{ background: '#5B47F5' }} />
        <div className="float-mid absolute bottom-10 right-[20%] w-40 h-40 rounded-full opacity-15 blur-[60px]" style={{ background: '#10b981' }} />
        <div className="float-slow absolute top-1/2 left-1/2 w-36 h-36 rounded-full opacity-10 blur-[50px]" style={{ background: '#f97316' }} />

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
            style={{ background: 'rgba(91,71,245,0.12)', borderColor: 'rgba(91,71,245,0.25)', color: '#a78bfa' }}
          >
            Premier pas gratuit
          </div>

          <h2
            className="text-3xl sm:text-4xl font-black mb-4 leading-tight"
            style={{ letterSpacing: '-0.02em', color: '#fff' }}
          >
            Vous avez des questions.
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #8b77ff, #a78bfa)' }}>
              On a probablement les réponses.
            </span>
          </h2>

          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#8b8baa' }}>
            Un appel de 20 minutes — pas un pitch de vente. On regarde votre boutique, on identifie ce qui bloque, et on vous dit franchement si on peut vous aider.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm pulse-ring"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
          >
            Réserver l&apos;appel gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs mt-4" style={{ color: '#4a4a66' }}>
            20 minutes · Gratuit · Sans engagement · Réponse sous 24h
          </p>
        </div>
      </section>
    </>
  )
}
