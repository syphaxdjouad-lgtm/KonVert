import Link from 'next/link'
import { ArrowRight, Bot, Palette, BarChart3, Link2, FlaskConical, Globe, Zap, Shield, Clock, Check, Sparkles, TrendingUp } from 'lucide-react'

const FEATURES_MAIN = [
  {
    id: 'ia',
    icon: Bot,
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
    visual: 'templates',
    accent: '#ec4899',
    accentBg: 'bg-pink-50',
    accentText: 'text-pink-500',
    gradient: 'from-pink-500/15 to-pink-500/5',
    reversed: true,
  },
  {
    id: 'analytics',
    icon: BarChart3,
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
    visual: 'analytics',
    accent: '#10b981',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-500',
    gradient: 'from-emerald-500/15 to-emerald-500/5',
    reversed: false,
  },
  {
    id: 'integrations',
    icon: Link2,
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
    visual: 'integrations',
    accent: '#f97316',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-500',
    gradient: 'from-orange-500/15 to-orange-500/5',
    reversed: true,
  },
  {
    id: 'abtesting',
    icon: FlaskConical,
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
    visual: 'langues',
    accent: '#14b8a6',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-500',
    gradient: 'from-teal-500/15 to-teal-500/5',
    reversed: true,
  },
]

const OTHER_FEATURES = [
  { icon: Zap,        title: 'Builder drag & drop',       desc: 'Éditez chaque section visuellement après la génération.' },
  { icon: Shield,     title: 'Sécurité enterprise',        desc: 'OAuth, chiffrement AES-256, conformité RGPD.' },
  { icon: Clock,      title: 'Génération en 30 secondes',  desc: "Le record absolu vs n'importe quel outil concurrent." },
  { icon: TrendingUp, title: 'Optimisé Core Web Vitals',   desc: 'LCP < 2s, CLS = 0, INP optimal. Score SEO maximal.' },
  { icon: Sparkles,   title: 'Scraper multi-sources',      desc: 'AliExpress, Amazon, Alibaba, Temu, Shein et plus.' },
  { icon: BarChart3,  title: 'Rapports PDF auto',          desc: 'Générés et envoyés automatiquement à vos clients.' },
]

export default function FeaturesPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalités
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Tout ce qu'il faut pour<br />
            <span style={{ color: '#8b77ff' }}>vendre plus. Dès aujourd'hui.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
            KONVERT combine IA générative, templates optimisés, analytics temps réel et intégrations natives pour vous donner un avantage concurrentiel immédiat.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
          >
            Voir la démo live
            <ArrowRight className="w-4 h-4" />
          </Link>
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
                <div className={f.reversed ? 'lg:col-start-2' : ''}>
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                        style={{ background: `${f.accent}15`, color: f.accent }}>
                    {f.badge}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{f.title}</h2>
                  <p className="text-[#5B47F5] font-semibold text-sm mb-4">{f.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2.5">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Check className={`w-4 h-4 flex-shrink-0 ${f.accentText}`} strokeWidth={2.5} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={`${f.reversed ? 'lg:col-start-1 lg:row-start-1' : ''} rounded-3xl p-10 min-h-[280px] flex items-center justify-center relative overflow-hidden`}
                     style={{ background: `linear-gradient(135deg, ${f.accent}15 0%, ${f.accent}06 100%)` }}>
                  <div className={`w-20 h-20 rounded-3xl ${f.accentBg} flex items-center justify-center`}
                       style={{ boxShadow: `0 20px 60px ${f.accent}25` }}>
                    <Icon className={`w-10 h-10 ${f.accentText}`} />
                  </div>
                  {/* Décoration */}
                  <div className="absolute top-5 right-5 text-4xl opacity-20 select-none">{f.badge.split(' ')[0]}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── AUTRES FEATURES ──────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Et bien plus encore</p>
            <h2 className="text-3xl font-black text-gray-900">Chaque détail compte.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OTHER_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center mb-4">
                  <Icon className="w-4.5 h-4.5 text-[#5B47F5]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Prêt à tester toutes ces fonctionnalités ?
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            14 jours d'accès complet. Sans carte de crédit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
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
