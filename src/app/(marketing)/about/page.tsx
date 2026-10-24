import Link from 'next/link'
import { ArrowRight, Target, Heart, Zap, Globe, Users, TrendingUp, Store, Building2, Bot, Mail, type LucideIcon } from 'lucide-react'
import RevealController from '@/components/marketing/shared/RevealController'
import { TEMPLATE_COUNT } from '@/lib/templates'
import { ALLOWED_LANGS } from '@/lib/i18n/languages'
import StatsRow from '@/components/marketing/about/StatsRow'

const VALUES = [
  {
    icon: Target,
    title: 'Résultats avant tout',
    desc: "Chaque fonctionnalité de KONVERT est conçue avec un seul objectif : augmenter vos conversions. Pas d'effets visuels inutiles, pas de feature gadget.",
    color: 'text-[#5B47F5]',
    bg: 'bg-[#5B47F5]/10',
  },
  {
    icon: Zap,
    title: "Vitesse d'exécution",
    desc: "30 secondes, pas 3 heures. On croit que le temps de votre équipe est votre ressource la plus précieuse. On l'automatise.",
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Heart,
    title: 'Simplicité radicale',
    desc: "Si ça demande une formation pour l'utiliser, c'est trop compliqué. KONVERT doit être utilisable par n'importe qui dès la première minute.",
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: Globe,
    title: 'Accessibilité globale',
    desc: "L'e-commerce ne connaît pas de frontières. KONVERT supporte 9 langues et s'adapte à toutes les plateformes mondiales.",
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
]

const TEAM_NEW: { Icon: LucideIcon; iconBg: string; iconColor: string; name: string; role: string; desc: string; link?: string }[] = [
  {
    Icon: Building2,
    iconBg: 'rgba(91,71,245,0.1)',
    iconColor: '#5B47F5',
    name: 'KONVERT × NEXARA',
    role: 'Studio NEXARA · 2024',
    desc: "KONVERT est l'un des produits du studio NEXARA, qui construit les outils SaaS que les e-commerçants et agences attendent. Une équipe obsédée par la conversion et l'automatisation, basée en France.",
  },
  {
    Icon: Bot,
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10b981',
    name: 'Équipe IA',
    role: 'Design, Dev, Contenu',
    desc: "Une équipe d'agents IA s'occupe de tout : génération de copy, tests, optimisations, rapports. Disponible 24h/24, jamais en vacances.",
  },
  {
    Icon: Mail,
    iconBg: 'rgba(249,115,22,0.1)',
    iconColor: '#f97316',
    name: 'On recrute',
    role: "Rejoindre l'aventure",
    desc: "Tu veux construire le futur de l'e-commerce ? On cherche des profils passionnés. Écris-nous directement.",
    link: '/contact',
  },
]

const VISION_CARDS: { Icon: LucideIcon; title: string; desc: string; color: string; bg: string }[] = [
  {
    Icon: TrendingUp,
    title: '1M€ ARR',
    desc: "L'objectif : devenir le standard du copywriting e-commerce en Europe. 1 million d'euros de revenu annuel récurrent d'ici 2027.",
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.1)',
  },
  {
    Icon: Globe,
    title: '10 langues',
    desc: "Expansion vers le marché anglophone, hispanophone et arabe. Chaque e-commerçant dans le monde mérite d'avoir KONVERT dans sa langue.",
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    Icon: Store,
    title: '10 000 boutiques',
    desc: "Atteindre 10 000 boutiques actives. Un réseau d'e-commerçants qui partagent les mêmes templates, les mêmes insights, le même avantage.",
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
  },
]

export default function AboutPage() {
  return (
    <>
      <RevealController />
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
               style={{ background: 'rgba(91,71,245,0.10)', borderColor: 'rgba(91,71,245,0.25)', color: '#5B47F5' }}>
            <Users className="w-3.5 h-3.5" />
            À propos de nous
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
            On a construit l&apos;outil<br />
            <span style={{ color: '#5B47F5' }}>qu&apos;on voulait utiliser.</span>
          </h1>
          <p className="reveal delay-2 text-lg max-w-2xl mx-auto leading-relaxed text-slate-600">
            KONVERT est né d&apos;une frustration : créer une bonne page produit prenait des heures, nécessitait un designer,
            un copywriter et un développeur. On a automatisé tout ça en 30 secondes.
          </p>
        </div>
      </section>

      {/* ── STATS ANIMÉES ────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <StatsRow templateCount={TEMPLATE_COUNT} languageCount={ALLOWED_LANGS.size} />
          </div>
        </div>
      </section>

      {/* ── HISTOIRE ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">Notre histoire</p>
              <h2 className="text-3xl font-black text-gray-900 mb-5">
                De dropshippers frustrés à un outil ouvert à tous les e-commerçants.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Après avoir géré plusieurs boutiques dropshipping, on s&apos;est retrouvés face au même problème en boucle :
                créer des pages produit qui convertissent prenait trop de temps et coûtait trop cher.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                On passait 3 à 4 heures par page. On externalisait à des freelances qui ne comprenaient pas l&apos;e-commerce.
                On utilisait des outils génériques qui ne savaient pas ce qu&apos;était un bon taux de conversion.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Alors on a construit KONVERT. D&apos;abord pour nous. Puis on a décidé de l&apos;ouvrir à tous les e-commerçants.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
              >
                Voir la démo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Timeline visuelle */}
            <div className="reveal delay-2 space-y-6">
              {[
                { year: 'Avant', event: "Création de KONVERT en interne pour nos propres boutiques.", col: '#5B47F5' },
                { year: '2026', event: 'Lancement public. Intégration Shopify & WooCommerce native.', col: '#10b981' },
                { year: 'Ensuite', event: `${TEMPLATE_COUNT} templates, A/B testing et mode Agence.`, col: '#f97316' },
              ].map(({ year, event, col }) => (
                <div key={year} className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 pt-0.5">
                    <span className="text-xs font-bold" style={{ color: col }}>{year}</span>
                  </div>
                  <div className="flex-1 pb-5 border-b border-gray-100 last:border-0">
                    <p className="text-sm text-gray-700 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALEURS ──────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Nos valeurs</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Ce qui guide chaque décision.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }, idx) => (
              <div key={title} className={`reveal delay-${Math.min(idx + 1, 4)} bg-white rounded-2xl p-6 border border-gray-100`}>
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

      {/* ── VISION 2027 ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf8ff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Vision</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Notre vision 2027</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">On ne construit pas juste un outil. On construit l&apos;infrastructure copywriting de l&apos;e-commerce mondial.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {VISION_CARDS.map((card, idx) => (
              <div
                key={card.title}
                className={`reveal delay-${idx + 1} rounded-3xl p-8 border-2 transition-all hover:-translate-y-1`}
                style={{ background: '#fff', borderColor: `${card.color}30` }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: card.bg }}>
                  <card.Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <h3 className="text-2xl font-black mb-3" style={{ color: card.color }}>{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">L&apos;équipe</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Une équipe, une obsession : vos conversions.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {TEAM_NEW.map(({ name, role, Icon, iconBg, iconColor, desc, link }, idx) => (
              <div key={name} className={`reveal delay-${idx + 1} text-center p-8 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: iconBg }}>
                  <Icon className="w-7 h-7" style={{ color: iconColor }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
                <p className="text-xs font-semibold text-[#5B47F5] mb-3">{role}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                {link && (
                  <Link href={link} className="text-xs font-bold text-[#5B47F5] hover:underline">
                    Nous contacter →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="reveal mt-12 text-center text-xs text-gray-400">
            KONVERT est édité par <span className="font-semibold text-gray-500">LUNAnCO</span>, studio du groupe NEXARA. Pour toute question légale ou commerciale, passe par notre <Link href="/contact" className="underline hover:text-[#5B47F5]">formulaire de contact</Link>.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #F0EDFF 0%, #F8F7FF 100%)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="reveal text-3xl font-black text-slate-900 mb-4">
            Créez votre première page<br />produit avec KONVERT.
          </h2>
          <p className="reveal delay-1 text-sm mb-8 text-slate-600">
            1 page gratuite. Aucune carte de crédit. Résultat immédiat.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/essai"
              className="focus-konvert inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="focus-konvert inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border text-sm transition-colors"
              style={{ borderColor: 'rgba(91,71,245,0.3)', color: '#5B47F5' }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
