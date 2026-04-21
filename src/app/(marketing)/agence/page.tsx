import Link from 'next/link'
import { ArrowRight, Check, Users, BarChart3, Zap, Shield, Globe, FileText, Building2, Star } from 'lucide-react'

const FEATURES_AGENCE = [
  {
    icon: Users,
    title: 'Dashboard Multi-clients',
    desc: 'Gérez tous vos clients depuis une seule interface. Switchez entre les comptes en un clic. Vue consolidée de tous vos KPIs.',
    color: 'text-[#5B47F5]',
    bg: 'bg-[#5B47F5]/10',
  },
  {
    icon: Zap,
    title: 'Génération illimitée',
    desc: 'Pages illimitées pour tous vos clients. Pas de quota par compte client. Facturez à votre tarif, pas au nôtre.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    title: 'Rapports PDF automatiques',
    desc: 'Générez des rapports de performance brandés à votre image. Envoi automatique mensuel à vos clients.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Globe,
    title: 'White-label complet',
    desc: "Interface rebrandée à votre nom et logo. URL personnalisée. Vos clients voient votre marque, pas KONVERT.",
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Accès équipe illimité',
    desc: 'Ajoutez autant de membres à votre équipe que nécessaire. Rôles et permissions granulaires par client.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: FileText,
    title: 'Facturation centralisée',
    desc: 'Une seule facture mensuelle pour toute votre agence. Export comptable compatible Sage, QuickBooks.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'Directrice, Agence Boost Digital',
    clients: '23 clients',
    quote: "On a réduit notre temps de production de pages de 80%. KONVERT nous permet de gérer 23 clients avec une équipe de 4 personnes. Le white-label est parfait.",
    stars: 5,
    metric: '-80% temps production',
    avatar: 'SK',
    bg: 'bg-[#5B47F5]',
  },
  {
    name: 'Marc T.',
    role: 'Fondateur, SMMA eCom Pro',
    clients: '15 clients',
    quote: "Les rapports PDF automatiques ont changé notre relation client. Ils reçoivent leurs stats chaque mois et ça renforce la confiance. On a réduit le churn de 60%.",
    stars: 5,
    metric: '-60% churn client',
    avatar: 'MT',
    bg: 'bg-emerald-500',
  },
]

const PRICING_AGENCE = [
  { label: 'Clients inclus',       value: 'Illimité' },
  { label: 'Pages / mois',         value: 'Illimitées' },
  { label: 'Membres équipe',       value: 'Illimité' },
  { label: 'White-label',          value: 'Inclus' },
  { label: 'Rapports PDF',         value: 'Auto' },
  { label: 'Support prioritaire',  value: 'Dédié' },
  { label: 'Onboarding guidé',     value: 'Offert' },
  { label: 'Appel mensuel',        value: '60 min' },
]

export default function AgencePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
                   style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
                <Building2 className="w-3.5 h-3.5" />
                Plan Agence & SMMA
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
                Gérez 50 clients.<br />
                <span style={{ color: '#8b77ff' }}>Avec une équipe de 4.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
                Dashboard multi-clients, white-label, rapports automatiques. KONVERT Agence vous permet de livrer plus de résultats en moins de temps.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
                >
                  Commencer gratuitement →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                >
                  Voir les tarifs
                </Link>
              </div>
              <p className="text-xs mt-4" style={{ color: '#4a4a66' }}>Démo 30 min gratuite · Sans engagement · Réponse sous 2h</p>
            </div>

            {/* Visual — dashboard mockup */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                {/* Fausse top bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="text-xs font-bold text-white/80">🏢 Dashboard Agence</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>23 clients actifs</span>
                </div>
                {/* Clients list */}
                <div className="p-4 space-y-3">
                  {[
                    { name: 'Boutique Mode Paris',  cvr: '5.2%', pages: 24, color: '#5B47F5' },
                    { name: 'TechGadgets FR',        cvr: '4.8%', pages: 18, color: '#10b981' },
                    { name: 'BeautyShop Lyon',       cvr: '6.1%', pages: 31, color: '#ec4899' },
                    { name: 'Sport & Équipement',    cvr: '3.9%', pages: 12, color: '#f97316' },
                  ].map(({ name, cvr, pages, color }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                           style={{ background: color }}>
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{name}</p>
                        <p className="text-xs" style={{ color: '#6b6b8a' }}>{pages} pages publiées</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                        CVR {cvr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Tout inclus</p>
            <h2 className="text-3xl font-black text-gray-900">Conçu pour les agences qui scalent.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_AGENCE.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARAISON ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Plan Agence</p>
            <h2 className="text-3xl font-black text-gray-900">149€/mois. Tout compris.</h2>
            <p className="text-gray-500 mt-2 text-sm">Ou 119€/mois en annuel — soit 2 mois offerts.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {PRICING_AGENCE.map(({ label, value }, i) => (
              <div key={label} className={`flex items-center justify-between px-7 py-4 ${i < PRICING_AGENCE.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-sm font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/essai"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Générer ma première page — gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-gray-400 mt-3">Sans CB · Annulation en 1 clic · Onboarding offert</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0a0a1a' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#5B47F5' }}>Témoignages agences</p>
            <h2 className="text-3xl font-black text-white">Ils ont transformé leur agence.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {TESTIMONIALS.map(({ name, role, clients, quote, stars, metric, avatar, bg }) => (
              <div key={name} className="p-8 rounded-3xl border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block mb-5">
                  {metric}
                </span>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#c0c0d8' }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs" style={{ color: '#6b6b8a' }}>{role} · {clients}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="text-4xl mb-5">🏢</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Prêt à scaler votre agence ?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Prêt à scaler votre agence ? Générez votre première page gratuitement — sans engagement, sans carte bancaire.
          </p>
          <Link
            href="/essai"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
          >
            Générer ma première page →
          </Link>
        </div>
      </section>
    </>
  )
}
