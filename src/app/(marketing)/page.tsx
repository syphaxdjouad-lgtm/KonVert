'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Bot,
  Palette,
  BarChart3,
  Link2,
  FlaskConical,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Star,
  Zap,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES GLOBAUX
═══════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.1); }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .marquee-track { display: flex; flex-shrink: 0; animation: marquee 32s linear infinite; }
  .marquee-wrap  { display: flex; overflow: hidden; }
  .float-anim    { animation: float 4s ease-in-out infinite; }
  .orb-anim      { animation: orb-pulse 3s ease-in-out infinite; }
  .btn-shimmer   {
    background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%);
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
  }
  .btn-shimmer:hover { animation-play-state: paused; }
  .reveal        { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible{ opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }

  .slide-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(.16,1,.3,1);
  }
  .slide-item {
    min-width: 100%;
    flex-shrink: 0;
  }
`

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK — useReveal
═══════════════════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK — useCounter
═══════════════════════════════════════════════════════════════════════════ */
function useCounter(target: number, duration: number, triggered: boolean): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!triggered) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [target, duration, triggered])
  return value
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK — useSlider
═══════════════════════════════════════════════════════════════════════════ */
function useSlider(count: number, autoPlayMs: number) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => {
    setSlide(((idx % count) + count) % count)
  }, [count])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % count)
    }, autoPlayMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, count, autoPlayMs])

  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  return { slide, goTo, pause, resume }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SOUS-COMPOSANTS HERO SLIDES
═══════════════════════════════════════════════════════════════════════════ */

// Slide 1 — Génération IA
function Slide1() {
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pt-36">
        {/* Texte gauche */}
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Claude AI
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6"
            style={{ animation: 'slideUp .7s cubic-bezier(.16,1,.3,1) both' }}
          >
            Des pages produit qui convertissent.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              En 30 secondes.
            </span>
          </h1>
          <p
            className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            style={{ animation: 'slideUp .7s .1s cubic-bezier(.16,1,.3,1) both' }}
          >
            Collez une URL AliExpress, Amazon ou Alibaba. KONVERT génère une landing page haute conversion prête à publier.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            style={{ animation: 'slideUp .7s .2s cubic-bezier(.16,1,.3,1) both' }}
          >
            <Link
              href="/dashboard"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
            >
              Générer ma page <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              Voir la démo
            </Link>
          </div>
        </div>

        {/* Visuel droite */}
        <div className="hidden lg:flex items-center justify-center relative">
          {/* Orbe violet */}
          <div
            className="orb-anim absolute w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(91,71,245,0.35) 0%, transparent 70%)', zIndex: 0 }}
          />
          {/* Browser mockup */}
          <div
            className="float-anim relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e' }}
          >
            {/* Barre browser */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#111127', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
              </div>
              <div
                className="flex-1 rounded-md px-3 py-1 text-xs text-white/40 font-mono"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                konvert.app/p/running-shoes-pro
              </div>
            </div>
            {/* Image produit */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Product landing page preview"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #1a1a2e 0%, transparent 60%)' }} />
            </div>
            {/* Contenu bas */}
            <div className="p-4">
              <div className="h-3 rounded-full mb-2 w-3/4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="h-2.5 rounded-full mb-1 w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-2.5 rounded-full w-5/6" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div
                className="mt-4 w-full py-2.5 rounded-xl text-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}
              >
                Acheter maintenant
              </div>
            </div>
            {/* Toast CVR */}
            <div
              className="absolute bottom-20 right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-xl"
              style={{ background: '#10b981', color: '#fff' }}
            >
              <TrendingUp className="w-3 h-3" />
              +5.2% CVR
            </div>
          </div>
          {/* Particules */}
          {[
            { top: '10%', left: '8%',  size: 8,  delay: '0s',   color: '#7c6af7' },
            { top: '20%', right: '5%', size: 6,  delay: '.8s',  color: '#a78bfa' },
            { top: '70%', left: '5%',  size: 10, delay: '1.4s', color: '#5B47F5' },
            { top: '80%', right: '8%', size: 7,  delay: '.4s',  color: '#818cf8' },
            { top: '45%', left: '2%',  size: 5,  delay: '2s',   color: '#c4b5fd' },
            { top: '55%', right: '2%', size: 9,  delay: '1s',   color: '#7c6af7' },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full float-anim"
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: 'left' in p ? p.left : undefined,
                right: 'right' in p ? p.right : undefined,
                background: p.color,
                animationDelay: p.delay,
                opacity: 0.7,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Slide 2 — Templates
function Slide2() {
  const templates = [
    { name: 'Mode & Fashion', gradient: 'linear-gradient(135deg,#5B47F5,#7c6af7)' },
    { name: 'Tech & Gadgets', gradient: 'linear-gradient(135deg,#111827,#374151)' },
    { name: 'Beauté & Bien-être', gradient: 'linear-gradient(135deg,#f97316,#fb923c)' },
    { name: 'Sport & Outdoor', gradient: 'linear-gradient(135deg,#0d9488,#2dd4bf)' },
  ]
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            17 templates premium
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            Le bon design pour{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              chaque produit.
            </span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            17 templates optimisés pour la conversion. Mode, Tech, Beauté, Sport, Gaming et plus.
          </p>
          <Link
            href="/templates"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Explorer les templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {templates.map((t) => (
            <div
              key={t.name}
              className="float-anim rounded-2xl p-6 flex flex-col justify-end h-36"
              style={{ background: t.gradient, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              <span className="text-white font-bold text-sm">{t.name}</span>
              <span
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
              >
                <Check className="w-3 h-3" /> Optimisé CVR
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Slide 3 — Analytics
function Slide3() {
  const bars = [40, 65, 50, 80, 60, 90, 75]
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics temps réel
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            Vos données.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vos décisions.
            </span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Scroll depth, taux de clics, conversions, ROAS. Optimisez en temps réel.
          </p>
          <Link
            href="/dashboard/analytics"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Voir l'analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          {[
            { label: 'Views', value: '12 847', delta: '+23%', color: '#5B47F5' },
            { label: 'CVR',   value: '4.8%',   delta: '+1.2pts', color: '#10b981' },
            { label: 'ROAS',  value: 'x4.2',   delta: '+0.8', color: '#f59e0b' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-white/60 text-sm font-medium">{s.label}</span>
              <span className="text-white font-black text-xl">{s.value}</span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${s.color}22`, color: s.color }}
              >
                {s.delta}
              </span>
            </div>
          ))}
          {/* Mini graphe barres SVG */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-white/40 text-xs mb-3">Conversions — 7 derniers jours</p>
            <svg viewBox="0 0 140 48" className="w-full h-12">
              {bars.map((h, i) => (
                <rect
                  key={i}
                  x={i * 20 + 2}
                  y={48 - h * 0.44}
                  width={14}
                  height={h * 0.44}
                  rx="3"
                  fill={i === bars.length - 1 ? '#7c6af7' : 'rgba(91,71,245,0.4)'}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// Slide 4 — Intégrations
function Slide4() {
  const integrations = [
    { emoji: '🛍️', name: 'Shopify' },
    { emoji: '🛒', name: 'WooCommerce' },
    { emoji: '📧', name: 'Klaviyo' },
    { emoji: '💳', name: 'Stripe' },
    { emoji: '🎯', name: 'Meta Ads' },
    { emoji: '⚡', name: 'Zapier' },
  ]
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Link2 className="w-3.5 h-3.5" />
            Connecté à votre stack
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            Shopify, Woo,{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Klaviyo & plus.
            </span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Publiez en 1 clic. Intégrations natives avec les outils que vous utilisez déjà.
          </p>
          <Link
            href="/integrations"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Voir les intégrations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden lg:grid grid-cols-3 gap-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-white/80 text-xs font-semibold">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Slide 5 — Agences
const FAKE_CLIENTS = [
  { name: 'Boutique Alpha', cvr: '5.1%', color: '#5B47F5', progress: 82 },
  { name: 'TechStore Pro',  cvr: '3.8%', color: '#10b981', progress: 65 },
  { name: 'FashionHub',     cvr: '6.2%', color: '#f97316', progress: 91 },
  { name: 'SportZone',      cvr: '4.5%', color: '#0d9488', progress: 74 },
]
function Slide5() {
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Pour les agences SMMA
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            Gérez tous vos clients depuis{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              un seul endroit.
            </span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Dashboard multi-clients, white-label, rapports PDF. Livrez plus, en moins de temps.
          </p>
          <Link
            href="/agence"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Découvrir le plan Agence <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden lg:flex flex-col gap-3">
          {FAKE_CLIENTS.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ background: c.color }}
              >
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-semibold truncate">{c.name}</span>
                  <span className="text-white/60 text-xs ml-2 flex-shrink-0">CVR {c.cvr}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.progress}%`, background: c.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SLIDER PRINCIPAL
═══════════════════════════════════════════════════════════════════════════ */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5]

function HeroSlider() {
  const { slide, goTo, pause, resume } = useSlider(SLIDES.length, 5000)
  const touchStartX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? slide + 1 : slide - 1)
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0a0a1a', minHeight: '100vh' }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track des slides */}
      <div
        className="slide-track"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {SLIDES.map((SlideComp, i) => (
          <SlideComp key={i} />
        ))}
      </div>

      {/* Flèche gauche */}
      <button
        onClick={() => goTo(slide - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 z-20"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Flèche droite */}
      <button
        onClick={() => goTo(slide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 z-20"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === slide ? 24 : 8,
              height: 8,
              background: i === slide ? '#7c6af7' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST BAR
═══════════════════════════════════════════════════════════════════════════ */
const TRUST_ITEMS = [
  'Shopify', 'WooCommerce', 'AliExpress', 'Amazon', 'Alibaba',
  'Claude AI', 'Stripe', 'Klaviyo', 'Zapier', 'Meta Ads',
]

function TrustBar() {
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS]
  return (
    <section style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
      <div className="py-5 marquee-wrap">
        <div className="marquee-track gap-0">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-6 text-sm font-semibold flex-shrink-0" style={{ color: '#94a3b8' }}>
              {item}
              <span style={{ color: '#cbd5e1' }}>•</span>
            </span>
          ))}
        </div>
        <div className="marquee-track gap-0" aria-hidden="true">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-6 text-sm font-semibold flex-shrink-0" style={{ color: '#94a3b8' }}>
              {item}
              <span style={{ color: '#cbd5e1' }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); io.disconnect() } },
      { threshold: 0.4 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const pages  = useCounter(50000, 1800, triggered)
  const cvr    = useCounter(40,    1400, triggered)
  const stores = useCounter(2800,  1600, triggered)

  return (
    <section ref={ref} style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: pages,  suffix: '+',  label: 'pages générées',     note: 'En production' },
            { value: cvr,    suffix: '%',  label: 'taux de conversion', note: 'En moyenne' },
            { value: stores, suffix: '+',  label: 'boutiques actives',  note: 'Et en croissance' },
          ].map((s, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div
                className="text-5xl lg:text-6xl font-black mb-2"
                style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {s.value.toLocaleString('fr-FR')}{s.suffix}
              </div>
              <div className="text-white font-semibold text-lg mb-1">{s.label}</div>
              <div className="text-white/40 text-sm">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    Icon: Bot,
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.08)',
    title: 'Génération IA en 30s',
    desc: 'Claude AI analyse votre produit et rédige un copy haute conversion adapté à votre audience cible.',
  },
  {
    Icon: Palette,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    title: '17 templates premium',
    desc: 'Un template pour chaque niche. Mode, tech, beauté, sport, gaming — chaque design est optimisé.',
  },
  {
    Icon: BarChart3,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    title: 'Analytics temps réel',
    desc: 'Scroll depth, heatmaps, conversions, ROAS. Visualisez ce qui convertit et optimisez immédiatement.',
  },
  {
    Icon: Link2,
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.08)',
    title: 'Publish sur Shopify',
    desc: 'Publiez en 1 clic sur Shopify, WooCommerce ou exportez le HTML. Zero friction, zero dev.',
  },
  {
    Icon: FlaskConical,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    title: 'A/B Testing intégré',
    desc: 'Testez 2 variantes de votre page, laissez l\'algorithme sélectionner le gagnant automatiquement.',
  },
  {
    Icon: Globe,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    title: '8 langues supportées',
    desc: 'Français, anglais, espagnol, allemand, portugais et plus. Atteignez tous vos marchés.',
  },
]

function FeaturesSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-16">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Fonctionnalités
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Tout ce dont vous avez besoin<br />pour convertir.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            Un outil pensé pour les e-commerçants et agences qui veulent des résultats, pas des configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: '#ffffff',
                border: '1.5px solid #f1f5f9',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transitionDelay: `${i * 0.07}s`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}
              >
                <f.Icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="text-gray-900 font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    num: '01',
    Icon: Link2,
    title: 'Collez une URL',
    desc: 'AliExpress, Amazon, Alibaba — n\'importe quel produit. Collez l\'URL dans KONVERT.',
  },
  {
    num: '02',
    Icon: Sparkles,
    title: 'L\'IA génère le copy',
    desc: 'Claude AI analyse le produit et crée le titre, accroche, bénéfices, FAQ et CTA en 30 secondes.',
  },
  {
    num: '03',
    Icon: TrendingUp,
    title: 'Publiez & convertissez',
    desc: 'Choisissez un template, personnalisez les couleurs, publiez sur votre boutique. C\'est tout.',
  },
]

function HowItWorks() {
  return (
    <section style={{ background: '#0a0a1a' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-16">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Comment ça marche
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            3 étapes, 30 secondes.
          </h2>
          <p className="reveal delay-2 text-lg text-white/60 max-w-xl mx-auto">
            De l'URL produit à la landing page publiée, tout se passe en moins d'une minute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Ligne de connexion desktop */}
          <div
            className="hidden lg:block absolute top-14 left-1/6 right-1/6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(91,71,245,0.4), transparent)' }}
          />
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="reveal text-center lg:text-left"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 mb-5">
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(91,71,245,0.15)', border: '1px solid rgba(91,71,245,0.3)' }}
                  >
                    <s.Icon className="w-6 h-6" style={{ color: '#7c6af7' }} />
                  </div>
                </div>
                <div
                  className="text-6xl font-black"
                  style={{ color: 'rgba(91,71,245,0.2)', lineHeight: 1 }}
                >
                  {s.num}
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-white/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATES PREVIEW
═══════════════════════════════════════════════════════════════════════════ */
const TEMPLATE_GRID = [
  { name: 'Impulse Dark',    gradient: 'linear-gradient(135deg,#5B47F5,#7c6af7)',  tag: 'Mode' },
  { name: 'Glacier Clean',   gradient: 'linear-gradient(135deg,#0f172a,#1e293b)',  tag: 'Tech' },
  { name: 'Ember Warm',      gradient: 'linear-gradient(135deg,#f97316,#fb923c)',  tag: 'Beauté' },
  { name: 'Teal Minimal',    gradient: 'linear-gradient(135deg,#0d9488,#2dd4bf)',  tag: 'Sport' },
  { name: 'Neon Gaming',     gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)',  tag: 'Gaming' },
  { name: 'Rose Luxury',     gradient: 'linear-gradient(135deg,#be185d,#db2777)',  tag: 'Luxe' },
  { name: 'Ocean Bold',      gradient: 'linear-gradient(135deg,#0369a1,#0ea5e9)',  tag: 'Lifestyle' },
  { name: 'Forest Organic',  gradient: 'linear-gradient(135deg,#166534,#16a34a)',  tag: 'Bio' },
]

function TemplatesPreview() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            Templates
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            17 templates qui vendent.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            Conçus par des experts e-commerce, optimisés pour chaque niche de produit.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {TEMPLATE_GRID.map((t, i) => (
            <div
              key={t.name}
              className="reveal group cursor-pointer rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div
                className="h-28 flex items-end p-3"
                style={{ background: t.gradient }}
              >
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
                >
                  {t.tag}
                </span>
              </div>
              <div className="p-3 bg-white border border-gray-100 border-t-0 rounded-b-2xl">
                <span className="text-gray-800 text-sm font-semibold">{t.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 18px rgba(91,71,245,0.35)' }}
          >
            Voir tous les templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Thomas M.',
    role: 'Dropshipper · Shopify',
    avatar: 'T',
    color: '#5B47F5',
    quote: 'J\'ai généré ma première landing page en 45 secondes. Mon taux de conversion a grimpé de 5.2% dès le lendemain. KONVERT est l\'outil que j\'attendais.',
    stars: 5,
    stat: '+5.2% CVR',
  },
  {
    name: 'Sarah K.',
    role: 'Agence SMMA · 23 clients',
    avatar: 'S',
    color: '#10b981',
    quote: 'On gère 23 boutiques clients depuis un seul dashboard. La fonctionnalité white-label nous a permis de vendre KONVERT comme un service premium à 500€/mois.',
    stars: 5,
    stat: '23 clients',
  },
  {
    name: 'Julien R.',
    role: 'E-commerce · Beauté',
    avatar: 'J',
    color: '#f97316',
    quote: 'Mon ROAS est passé de x1.4 à x4.2 en 3 semaines. Les templates beauté sont absolument parfaits pour ma niche. Je ne reviendrai jamais en arrière.',
    stars: 5,
    stat: 'ROAS x4.2',
  },
]

function Testimonials() {
  return (
    <section style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Star className="w-3.5 h-3.5" />
            Témoignages
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Ils ont transformé leurs résultats.
          </h2>
          <p className="reveal delay-2 text-lg text-white/60 max-w-xl mx-auto">
            Des e-commerçants et agences qui utilisent KONVERT au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="reveal p-6 rounded-2xl flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              {/* Quote */}
              <p className="text-white/75 leading-relaxed text-sm flex-1">"{t.quote}"</p>
              {/* Footer */}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${t.color}22`, color: t.color }}
                >
                  {t.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING TEASER
═══════════════════════════════════════════════════════════════════════════ */
const PLANS = [
  {
    name: 'Starter',
    monthly: 29,
    desc: 'Pour démarrer et tester',
    features: ['5 pages / mois', '5 templates', 'Analytics basique', 'Export HTML'],
    cta: 'Démarrer',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthly: 79,
    desc: 'Pour scaler votre e-commerce',
    features: ['Pages illimitées', '17 templates', 'Analytics avancé', 'A/B Testing', 'Publish Shopify & Woo', 'Support prioritaire'],
    cta: 'Choisir Pro',
    highlighted: true,
  },
  {
    name: 'Agence',
    monthly: 149,
    desc: 'Pour les agences SMMA',
    features: ['Tout dans Pro', 'Multi-clients illimité', 'White-label complet', 'Rapports PDF', 'API access', 'Account manager dédié'],
    cta: 'Contacter les ventes',
    highlighted: false,
  },
]

function PricingTeaser() {
  const [annual, setAnnual] = useState(false)

  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Tarifs
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Simple, transparent, scalable.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Commencez gratuitement pendant 14 jours. Sans carte bancaire.
          </p>
          {/* Toggle mensuel/annuel */}
          <div className="reveal delay-3 inline-flex items-center gap-3 p-1 rounded-full" style={{ background: '#f1f5f9' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: !annual ? '#ffffff' : 'transparent',
                color: !annual ? '#111827' : '#6b7280',
                boxShadow: !annual ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: annual ? '#ffffff' : 'transparent',
                color: annual ? '#111827' : '#6b7280',
                boxShadow: annual ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Annuel
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan, i) => {
            const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly
            return (
              <div
                key={plan.name}
                className="reveal rounded-2xl p-6 flex flex-col gap-5 relative"
                style={{
                  background: plan.highlighted ? 'linear-gradient(135deg,#5B47F5,#7c6af7)' : '#ffffff',
                  border: plan.highlighted ? 'none' : '1.5px solid #f1f5f9',
                  boxShadow: plan.highlighted ? '0 16px 48px rgba(91,71,245,0.35)' : '0 2px 12px rgba(0,0,0,0.04)',
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                {plan.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: '#f59e0b' }}
                  >
                    Le plus populaire
                  </div>
                )}
                <div>
                  <div
                    className="text-sm font-bold mb-1"
                    style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : '#5B47F5' }}
                  >
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="text-4xl font-black"
                      style={{ color: plan.highlighted ? '#fff' : '#111827' }}
                    >
                      {price}€
                    </span>
                    <span
                      className="text-sm pb-1.5"
                      style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}
                    >
                      /mois
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: plan.highlighted ? 'rgba(255,255,255,0.65)' : '#6b7280' }}
                  >
                    {plan.desc}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: plan.highlighted ? 'rgba(255,255,255,0.25)' : 'rgba(91,71,245,0.1)',
                        }}
                      >
                        <Check
                          className="w-2.5 h-2.5"
                          style={{ color: plan.highlighted ? '#fff' : '#5B47F5' }}
                        />
                      </div>
                      <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.85)' : '#374151' }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/pricing"
                  className="w-full py-3 rounded-xl text-center font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: plan.highlighted ? '#ffffff' : 'transparent',
                    color: plan.highlighted ? '#5B47F5' : '#5B47F5',
                    border: plan.highlighted ? 'none' : '1.5px solid #5B47F5',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
            style={{ color: '#5B47F5' }}
          >
            Voir les tarifs complets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const [urlInput, setUrlInput] = useState('')

  return (
    <section style={{ background: '#0a0a1a', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient violet background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(91,71,245,0.25) 0%, transparent 70%)',
        }}
      />
      <div
        className="orb-anim absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(91,71,245,0.2) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-28 text-center">
        <div
          className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
          style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Essai gratuit 14 jours
        </div>

        <h2
          className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5"
        >
          Prêt à booster vos conversions ?
        </h2>

        <p
          className="reveal delay-2 text-lg text-white/60 mb-10 max-w-xl mx-auto"
        >
          Collez une URL produit et voyez KONVERT générer votre landing page en temps réel.
        </p>

        {/* Input URL + CTA */}
        <div
          className="reveal delay-3 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-5"
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Collez une URL AliExpress, Amazon..."
            className="flex-1 px-5 py-3.5 rounded-full text-sm font-medium outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              color: '#fff',
              caretColor: '#7c6af7',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(124,106,247,0.6)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
          />
          <Link
            href={`/dashboard${urlInput ? `?url=${encodeURIComponent(urlInput)}` : ''}`}
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg flex-shrink-0"
          >
            Générer ma page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="reveal delay-4 text-white/35 text-sm">
          14 jours gratuit · Aucune CB requise · Résiliation en 1 clic
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  useReveal()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <main>
        <HeroSlider />
        <TrustBar />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <TemplatesPreview />
        <Testimonials />
        <PricingTeaser />
        <FinalCTA />
      </main>
    </>
  )
}
