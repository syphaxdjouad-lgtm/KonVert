import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Zap, Shield, Globe, FileText, Building2 } from 'lucide-react'

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
                Gérez plus de clients.<br />
                <span style={{ color: '#8b77ff' }}>Sans agrandir l&apos;équipe.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
                Dashboard multi-clients, white-label, rapports automatiques. KONVERT Agence vous permet de livrer plus de résultats en moins de temps.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/essai"
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
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>Aperçu de l&apos;interface</span>
                </div>
                {/* Clients list */}
                <div className="p-4 space-y-3">
                  {[
                    { name: 'Boutique Mode Paris',  status: 'Page prête',    color: '#5B47F5' },
                    { name: 'TechGadgets FR',        status: 'En génération', color: '#10b981' },
                    { name: 'BeautyShop Lyon',       status: 'Page prête',    color: '#ec4899' },
                    { name: 'Sport & Équipement',    status: 'En relecture',  color: '#f97316' },
                  ].map(({ name, status, color }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                           style={{ background: color }}>
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{name}</p>
                        <p className="text-xs" style={{ color: '#6b6b8a' }}>Client exemple</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                        {status}
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
            <h2 className="text-3xl font-black text-gray-900">199€/mois. Tout compris.</h2>
            <p className="text-gray-500 mt-2 text-sm">Ou 159€/mois en annuel — soit 2 mois offerts.</p>
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

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="text-4xl mb-5">🏢</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Prêt à scaler votre agence ?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Livrez plus de pages client sans recruter. Première page gratuite, sans carte bancaire.
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
