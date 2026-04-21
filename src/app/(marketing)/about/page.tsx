'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Zap, Globe, Users, TrendingUp, Store, Building2, Bot, Mail, type LucideIcon } from 'lucide-react'

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
`

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
    desc: "L'e-commerce ne connaît pas de frontières. KONVERT supporte 8 langues et s'adapte à toutes les plateformes mondiales.",
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
]

const TEAM_NEW: { Icon: LucideIcon; iconBg: string; iconColor: string; name: string; role: string; desc: string; link?: string }[] = [
  {
    Icon: Building2,
    iconBg: 'rgba(91,71,245,0.1)',
    iconColor: '#5B47F5',
    name: 'KONVERT',
    role: 'Fondé en 2024',
    desc: "Né de la frustration de perdre des heures sur des pages médiocres. KONVERT est construit par une équipe passionnée par l'e-commerce et obsédée par les conversions.",
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

const STATS_DATA = [
  { raw: 50000, display: '50 000+', label: 'pages générées', suffix: '+' },
  { raw: 2800, display: '2 800+', label: 'boutiques connectées', suffix: '+' },
  { raw: 40, display: '+40%', label: 'de conversion en moyenne', prefix: '+', suffix: '%' },
  { raw: 8, display: '8', label: 'langues supportées', suffix: '' },
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
    desc: "De 2 800 à 10 000 boutiques actives. Un réseau d'e-commerçants qui partagent les mêmes templates, les mêmes insights, le même avantage.",
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
  },
]

// Animated counter hook
function useCounter(target: number, started: boolean, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return count
}

function StatCard({ raw, display, label, prefix, suffix }: { raw: number; display: string; label: string; prefix?: string; suffix?: string }) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCounter(raw, started)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const formatNum = (n: number) => {
    if (raw >= 1000) return n.toLocaleString('fr-FR')
    return n.toString()
  }

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-black text-[#5B47F5] mb-1" style={{ animation: started ? 'count-up .4s ease forwards' : 'none' }}>
        {started ? `${prefix ?? ''}${formatNum(count)}${suffix ?? ''}` : display}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

export default function AboutPage() {
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

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Users className="w-3.5 h-3.5" />
            À propos de nous
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            On a construit l'outil<br />
            <span style={{ color: '#8b77ff' }}>qu'on voulait utiliser.</span>
          </h1>
          <p className="reveal delay-2 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#8b8baa' }}>
            KONVERT est né d'une frustration : créer une bonne page produit prenait des heures, nécessitait un designer,
            un copywriter et un développeur. On a automatisé tout ça en 30 secondes.
          </p>
        </div>
      </section>

      {/* ── STATS ANIMÉES ────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS_DATA.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
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
            <div className="reveal delay-2 space-y-6">
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
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">On ne construit pas juste un outil. On construit l'infrastructure copywriting de l'e-commerce mondial.</p>
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
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">L'équipe</p>
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
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" style={{ borderTop: '1px solid #f0ebff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Cas clients</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">
              Des résultats mesurables, pas des promesses.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">

            {/* Case study 1 — Décoration */}
            <div className="reveal delay-1 rounded-3xl overflow-hidden border border-[#ede8ff]" style={{ boxShadow: '0 4px 20px rgba(91,71,245,0.07)' }}>
              <div
                className="h-40 flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #faf5ff, #ede8ff)' }}
              >
                🏡
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#78716c15', color: '#78716c' }}>Déco & Maison</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#10b98115', color: '#10b981' }}>WooCommerce</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Boutique Décoration : CVR x3 en 7 jours</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#ef4444' }}>!</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Problème</p>
                      <p className="text-sm text-gray-700">Pages produit génériques, 78% de taux de rebond, taux de conversion bloqué à 1.2% depuis 8 mois.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#5B47F5' }}>K</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Solution KONVERT</p>
                      <p className="text-sm text-gray-700">Génération de landing pages émotionnelles avec storytelling ambiance, photos lifestyle optimisées et FAQ conversationnelle.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#10b981' }}>✓</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Résultat</p>
                      <p className="text-sm font-semibold text-gray-900">Taux de conversion <span style={{ color: '#10b981' }}>1.2% → 3.8%</span> en 7 jours. CA mensuel +€4 200. Taux de rebond -41%.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case study 2 — Agence SMMA */}
            <div className="reveal delay-2 rounded-3xl overflow-hidden border border-[#ede8ff]" style={{ boxShadow: '0 4px 20px rgba(91,71,245,0.07)' }}>
              <div
                className="h-40 flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
              >
                📈
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#10b98115', color: '#10b981' }}>Agence SMMA</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#5B47F515', color: '#5B47F5' }}>White-label</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Agence 23 clients : livrables x4, marge x2</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#ef4444' }}>!</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Problème</p>
                      <p className="text-sm text-gray-700">2 jours/page, 8 clients maximum, impossible de scaler sans embaucher. Marge brute à 42%.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#5B47F5' }}>K</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Solution KONVERT</p>
                      <p className="text-sm text-gray-700">Dashboard multi-workspace white-label, génération en 30 sec/page, rapport mensuel automatisé pour chaque client.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5" style={{ background: '#10b981' }}>✓</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Résultat</p>
                      <p className="text-sm font-semibold text-gray-900">8 → <span style={{ color: '#10b981' }}>23 clients</span> en 3 mois. Marge 42% → 78%. Service KONVERT revendu <span style={{ color: '#10b981' }}>500€/mois/client</span>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="reveal text-3xl font-black text-white mb-4">
            Rejoignez les 2 800+ boutiques<br />qui convertissent avec KONVERT.
          </h2>
          <p className="reveal delay-1 text-sm mb-8" style={{ color: '#8b8baa' }}>
            1 page gratuite. Aucune carte de crédit. Résultat immédiat.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-3 justify-center">
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
