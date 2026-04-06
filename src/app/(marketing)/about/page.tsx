'use client'

import Link from 'next/link'
import { ArrowRight, Target, Heart, Zap, Globe, Users, TrendingUp } from 'lucide-react'

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
    title: 'Vitesse d\'exécution',
    desc: '30 secondes, pas 3 heures. On croit que le temps de votre équipe est votre ressource la plus précieuse. On l\'automatise.',
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
    desc: "L'e-commerce ne connaît pas de frontières. KONVERT supporte 8 langues et s'adapte à toutes les plateformes mondiales.",
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
]

const TEAM = [
  {
    name: 'Équipe Produit',
    role: 'Design & Développement',
    avatar: '👨‍💻',
    desc: "Passionnés d'e-commerce, ils construisent les fonctionnalités qui font la différence.",
  },
  {
    name: 'Équipe Growth',
    role: 'Marketing & Data',
    avatar: '📈',
    desc: "Ils analysent les 50 000+ pages générées pour identifier ce qui convertit vraiment.",
  },
  {
    name: 'Équipe Support',
    role: 'Customer Success',
    avatar: '🎯',
    desc: "Disponibles 7j/7, ils s'assurent que chaque utilisateur atteint ses objectifs.",
  },
]

const STATS = [
  { num: '50 000+', label: 'pages générées' },
  { num: '2 800+', label: 'boutiques connectées' },
  { num: '+40%', label: 'de conversion en moyenne' },
  { num: '8', label: 'langues supportées' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Users className="w-3.5 h-3.5" />
            À propos de nous
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            On a construit l'outil<br />
            <span style={{ color: '#8b77ff' }}>qu'on voulait utiliser.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#8b8baa' }}>
            KONVERT est né d'une frustration : créer une bonne page produit prenait des heures, nécessitait un designer,
            un copywriter et un développeur. On a automatisé tout ça en 30 secondes.
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <p className="text-3xl font-black text-[#5B47F5] mb-1">{num}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTOIRE ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-4">Notre histoire</p>
              <h2 className="text-3xl font-black text-gray-900 mb-5">
                De dropshippers frustrés à une équipe d'une centaine d'utilisateurs.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En 2024, après avoir géré plusieurs boutiques dropshipping, on s'est retrouvés face au même problème en boucle :
                créer des pages produit qui convertissent prenait trop de temps et coûtait trop cher.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                On passait 3 à 4 heures par page. On externalisait à des freelances qui ne comprenaient pas l'e-commerce.
                On utilisait des outils génériques qui ne savaient pas ce qu'était un bon taux de conversion.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Alors on a construit KONVERT. D'abord pour nous. Puis on l'a partagé. Aujourd'hui, 2 800+ boutiques l'utilisent chaque semaine.
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
            <div className="space-y-6">
              {[
                { year: '2024 T1', event: "Création de KONVERT en interne pour nos propres boutiques.", col: '#5B47F5' },
                { year: '2024 T2', event: 'Premiers bêta-testeurs. 100 pages générées en 2 semaines.', col: '#10b981' },
                { year: '2024 T3', event: 'Lancement public. Intégration Shopify & WooCommerce native.', col: '#f97316' },
                { year: '2024 T4', event: '2 800 boutiques connectées. 50 000 pages générées.', col: '#ec4899' },
                { year: '2025', event: "Lancement des 17 templates, de l'A/B testing et du mode Agence.", col: '#8b77ff' },
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Nos valeurs</p>
            <h2 className="text-3xl font-black text-gray-900">Ce qui guide chaque décision.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
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

      {/* ── ÉQUIPE ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">L'équipe</p>
            <h2 className="text-3xl font-black text-gray-900">Des e-commerçants qui ont construit pour d'autres e-commerçants.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, avatar, desc }) => (
              <div key={name} className="text-center p-8 rounded-3xl border border-gray-100 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all">
                <div className="text-5xl mb-4">{avatar}</div>
                <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
                <p className="text-xs font-semibold text-[#5B47F5] mb-3">{role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Rejoignez les 2 800+ boutiques<br />qui convertissent avec KONVERT.
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b8baa' }}>
            14 jours d'essai gratuit. Aucune carte de crédit. Annulation en 1 clic.
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
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border text-sm transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
