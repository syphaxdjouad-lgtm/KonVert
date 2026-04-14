import Link from 'next/link'
import { ArrowRight, Search, BarChart3, Users, Zap, Check, TrendingUp, Globe, Shield, Clock, Star } from 'lucide-react'

const SERVICES = [
  {
    id: 'seo',
    icon: Search,
    badge: 'Audit SEO',
    title: 'Audit SEO Complet',
    subtitle: 'Pour les boutiques qui veulent du trafic organique gratuit.',
    desc: "Analyse technique de votre boutique Shopify ou WooCommerce : vitesse, Core Web Vitals, maillage interne, balises méta, structured data. On identifie précisément ce qui freine votre positionnement Google.",
    price: 'À partir de 299€',
    duration: '5 jours ouvrés',
    features: [
      'Audit technique complet (100+ points)',
      'Analyse des Core Web Vitals',
      'Audit du contenu & fiches produit',
      'Analyse backlinks & autorité domaine',
      'Plan d\'action priorisé',
      'Call de restitution 60 min',
    ],
    cta: 'Demander un audit',
    ctaHref: '/contact?subject=Audit+SEO',
    accentColor: '#5B47F5',
    accentBg: 'bg-[#5B47F5]/10',
    accentText: 'text-[#5B47F5]',
    gradient: 'from-[#5B47F5]/20 to-[#5B47F5]/5',
  },
  {
    id: 'reporting',
    icon: BarChart3,
    badge: 'Reporting',
    title: 'Suivi & Reporting Mensuel',
    subtitle: 'Pour piloter votre croissance avec des données fiables.',
    desc: "Dashboard personnalisé avec vos KPIs e-commerce : ROAS, CVR, CAC, LTV, taux de retour. Un rapport mensuel commenté avec des recommandations actionnables. Vous savez exactement où investir.",
    price: 'À partir de 149€/mois',
    duration: 'Abonnement mensuel',
    features: [
      'Dashboard KPIs en temps réel',
      'Rapport mensuel commenté',
      'Suivi ROAS & CAC par canal',
      'Analyse des pages les plus rentables',
      'Alertes automatiques anomalies',
      'Call mensuel 30 min',
    ],
    cta: 'Démarrer le suivi',
    ctaHref: '/contact?subject=Suivi+Reporting',
    accentColor: '#10b981',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    id: 'coaching',
    icon: TrendingUp,
    badge: 'Coaching',
    title: 'Coaching E-commerce',
    subtitle: 'Pour les entrepreneurs qui veulent aller plus vite.',
    desc: "Accompagnement personnalisé par un expert e-commerce : stratégie produit, optimisation des ads, CRO, sélection de fournisseurs. Des sessions pratiques focalisées sur votre situation réelle.",
    price: 'À partir de 199€/session',
    duration: '2h par session',
    features: [
      'Diagnostic de votre boutique',
      'Stratégie produit personnalisée',
      'Optimisation campagnes Meta/TikTok',
      'CRO & optimisation de conversion',
      'Sélection fournisseurs AliExpress',
      'Accès à la communauté privée',
    ],
    cta: 'Réserver une session',
    ctaHref: '/contact?subject=Coaching',
    accentColor: '#f97316',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-500',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
]

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'E-commerçante mode',
    quote: "L'audit SEO a révélé des problèmes que j'avais depuis 2 ans sans le savoir. En 3 mois, mon trafic organique a doublé.",
    stars: 5,
    metric: '+112% trafic organique',
    avatar: 'ML',
    bg: 'bg-[#5B47F5]',
  },
  {
    name: 'Kevin B.',
    role: 'Dropshipper',
    quote: "Le coaching a complètement changé ma façon de sélectionner les produits. Mon ROAS est passé de 1.8 à 4.2 en 6 semaines.",
    stars: 5,
    metric: 'ROAS x4.2',
    avatar: 'KB',
    bg: 'bg-emerald-500',
  },
  {
    name: 'Agence Boost',
    role: 'Agence SMMA (12 clients)',
    quote: "Le reporting mensuel nous fait gagner 20h/mois. Nos clients voient leurs données claires et nous font plus confiance.",
    stars: 5,
    metric: '20h économisées/mois',
    avatar: 'AB',
    bg: 'bg-orange-500',
  },
]

const PROCESS = [
  { num: '01', title: 'Diagnostic gratuit', desc: "Un appel de 30 minutes pour comprendre votre situation et définir le service adapté." },
  { num: '02', title: 'Proposition sur mesure', desc: "On vous envoie une proposition détaillée avec le périmètre, le prix et le planning." },
  { num: '03', title: 'Exécution & Suivi', desc: "On démarre le travail. Vous avez un accès direct à votre responsable de compte." },
  { num: '04', title: 'Résultats mesurables', desc: "Chaque livrable est accompagné de métriques pour mesurer l'impact de notre travail." },
]

export default function ServicesPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Zap className="w-3.5 h-3.5" />
            Services & Accompagnement
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Plus qu'un outil.<br />
            <span style={{ color: '#8b77ff' }}>Un partenaire de croissance.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
            KONVERT automatise la création de pages. Nos experts vous accompagnent pour aller encore plus loin : SEO, analytics, coaching e-commerce.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
          >
            Diagnostic gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
          {SERVICES.map((service, idx) => {
            const { icon: Icon } = service
            const isReversed = idx % 2 === 1
            return (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Contenu */}
                <div className={isReversed ? 'lg:col-start-2' : ''}>
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                        style={{ background: `${service.accentColor}15`, color: service.accentColor }}>
                    {service.badge}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{service.title}</h2>
                  <p className="text-[#5B47F5] font-semibold text-sm mb-4">{service.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>

                  <ul className="space-y-2.5 mb-7">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Check className={`w-4 h-4 flex-shrink-0 ${service.accentText}`} strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4">
                    <Link
                      href={service.ctaHref}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${service.accentColor}, ${service.accentColor}dd)`, boxShadow: `0 4px 14px ${service.accentColor}30` }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{service.price}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{service.duration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual */}
                <div className={`${isReversed ? 'lg:col-start-1 lg:row-start-1' : ''} rounded-3xl p-10 flex items-center justify-center min-h-[300px] relative overflow-hidden`}
                     style={{ background: `linear-gradient(135deg, ${service.accentColor}18 0%, ${service.accentColor}06 100%)` }}>
                  <div className={`w-24 h-24 rounded-3xl ${service.accentBg} flex items-center justify-center`}
                       style={{ boxShadow: `0 20px 60px ${service.accentColor}25` }}>
                    <Icon className={`w-12 h-12 ${service.accentText}`} />
                  </div>
                  {/* Décoratif */}
                  <div className="absolute top-6 right-8 px-3 py-2 rounded-xl text-xs font-bold"
                       style={{ background: 'rgba(255,255,255,0.9)', color: service.accentColor, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    {service.price}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PROCESSUS ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Notre processus</p>
            <h2 className="text-3xl font-black text-gray-900">Comment ça se passe.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map(({ num, title, desc }) => (
              <div key={num} className="bg-white p-6 rounded-2xl border border-gray-100">
                <span className="text-3xl font-black text-[#5B47F5]/20 block mb-3">{num}</span>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Résultats réels</p>
            <h2 className="text-3xl font-black text-gray-900">Ce que nos clients disent.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote, stars, metric, avatar, bg }) => (
              <div key={name} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-4">
                  {metric}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(91,71,245,0.25)' }}>
            <Zap className="w-7 h-7 text-[#a78bfa]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">
            Prêt à accélérer votre croissance ?
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            Commencez par un diagnostic gratuit de 30 minutes. Sans engagement.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
          >
            Réserver mon diagnostic gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs mt-4" style={{ color: '#4a4a66' }}>
            30 minutes · Gratuit · Sans engagement
          </p>
        </div>
      </section>
    </>
  )
}
