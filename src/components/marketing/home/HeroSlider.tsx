'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback, type TouchEvent } from 'react'
import { TEMPLATE_COUNT } from '@/lib/templates'
import { addRipple } from '@/lib/ui/ripple'
import BrandLogo from './BrandLogo'
import {
  CaretLeft,
  CaretRight,
  ArrowRight,
  Sparkle,
  TrendUp,
  Palette,
  ChartBar,
  LinkSimple,
  Lightning,
  ShoppingCart,
  Trophy,
  Handbag,
  Headphones,
  Flower,
  Barbell,
  TrendUp as TrendUpBadge,
} from '@phosphor-icons/react'

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
// Slide 1 — Génération IA
function Slide1() {
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        {/* Texte gauche */}
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Sparkle className="w-3.5 h-3.5" />
            Tes produits méritent des pages qui vendent
          </div>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5"
            style={{ animation: 'slideUp .7s cubic-bezier(.16,1,.3,1) both' }}
          >
            Votre page produit ne devrait{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              jamais freiner un lancement.
            </span>
          </h1>
          <p
            className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0"
            style={{ animation: 'slideUp .7s .1s cubic-bezier(.16,1,.3,1) both' }}
          >
            KONVERT publie une page produit optimisée conversion en 30 secondes, à partir d&apos;une simple URL. Pas de ticket design. Pas d&apos;attente agence.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            style={{ animation: 'slideUp .7s .2s cubic-bezier(.16,1,.3,1) both' }}
          >
            <Link
              href="/essai"
              className="btn-shimmer btn-ripple inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
              onClick={addRipple}
            >
              Génère ta première page (30s, sans compte) <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="btn-ripple inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
              onClick={addRipple}
            >
              Vois un exemple avant de coller ton URL
            </Link>
          </div>

          {/* ── Trust signals (réels uniquement) ───────────────────── */}
          <div
            className="mt-6 flex flex-col items-center lg:items-start gap-2.5"
            style={{ animation: 'slideUp .7s .35s cubic-bezier(.16,1,.3,1) both' }}
          >
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { dot: '#96BF48', label: 'Shopify Partner' },
                { dot: '#635BFF', label: 'Stripe sécurisé' },
                { dot: '#16a34a', label: 'Gratuit à tester · Aucune carte bancaire requise' },
              ].map(({ dot, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                  <span className="text-xs text-white/40 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visuel droite */}
        <div className="flex items-center justify-center relative mt-6 lg:mt-0">
          <div
            className="orb-anim absolute w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(91,71,245,0.35) 0%, transparent 70%)', zIndex: 0 }}
          />
          <div
            className="float-anim relative z-10 w-full max-w-sm rounded-2xl shadow-2xl"
            style={{ border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 24px 60px rgba(0,0,0,0.13), 0 0 0 1px #e2e8f0', overflow: 'visible' }}
          >
            {/* Chrome blanc */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-t-2xl" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
              </div>
              <div
                className="flex-1 rounded-md px-3 py-1 text-xs text-gray-400 font-mono"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                konvertpilot.com/p/nike-runner-pro
              </div>
            </div>

            {/* Hero produit — image réelle sneaker */}
            <div
              className="relative flex flex-col justify-end"
              style={{ height: '195px', overflow: 'hidden' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85"
                alt="Air Jordan Pro"
                fill
                priority
                sizes="(max-width: 640px) 90vw, 384px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {/* Overlay gradient sombre en bas */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
              {/* Badge promo */}
              <div style={{ position: 'absolute', top: 8, left: 10, background: 'rgba(16,185,129,0.92)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
                PROMO -36%
              </div>
              {/* Étoiles */}
              <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="10" height="10" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Contenu produit */}
            <div className="p-4 rounded-b-2xl" style={{ background: '#ffffff' }}>
              <h4 className="font-black text-gray-900 text-sm mb-0.5 leading-snug">Nike Runner Pro</h4>
              <p className="text-xs text-gray-400 mb-2.5">Amorti gel · Mesh respirant · Semelle carbone</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-black" style={{ color: '#5B47F5' }}>89€</span>
                <span className="text-sm line-through" style={{ color: '#94a3b8' }}>139€</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: '#fee2e2', color: '#ef4444' }}>-36%</span>
              </div>
              <div
                className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.35)' }}
              >
                Ajouter au panier
              </div>
            </div>

            {/* Stat 1 — CVR droite */}
            <div
              className="absolute hidden lg:flex"
              style={{
                bottom: 52, right: -20,
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 14,
                background: '#10b981', color: '#fff',
                fontSize: 13, fontWeight: 800,
                boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                animation: 'popOut 0.55s 0.5s cubic-bezier(.16,1,.3,1) both',
                whiteSpace: 'nowrap', zIndex: 20,
              }}
            >
              <TrendUp className="w-3.5 h-3.5" />
              +5.2% CVR
            </div>

            {/* Stat 2 — Ventes gauche haut */}
            <div
              className="absolute hidden lg:flex"
              style={{
                top: 72, left: -28,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderRadius: 12,
                background: '#ffffff', border: '1.5px solid #ede9fe',
                boxShadow: '0 6px 20px rgba(91,71,245,0.18)',
                animation: 'popOut 0.55s 0.8s cubic-bezier(.16,1,.3,1) both',
                whiteSpace: 'nowrap', zIndex: 20,
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(91,71,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lightning className="w-3.5 h-3.5" style={{ color: '#5B47F5' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>Ventes aujourd&apos;hui</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>+38 commandes</div>
              </div>
            </div>

            {/* Stat 3 — Score gauche bas */}
            <div
              className="absolute hidden lg:flex"
              style={{
                bottom: 14, left: -24,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderRadius: 12,
                background: '#ffffff', border: '1.5px solid #dcfce7',
                boxShadow: '0 6px 20px rgba(16,185,129,0.15)',
                animation: 'popOut 0.55s 1.05s cubic-bezier(.16,1,.3,1) both',
                whiteSpace: 'nowrap', zIndex: 20,
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>Score KONVERT</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>94 / 100</div>
              </div>
            </div>
          </div>
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
const TEMPLATE_CARDS = [
  {
    name: 'Mode & Fashion',
    accent: '#7c6af7',
    bg: 'linear-gradient(160deg,#1a1040 0%,#2d1f6e 100%)',
    heroColor: 'linear-gradient(135deg,#5B47F5,#7c6af7)',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
    price: '49,90€',
    oldPrice: '89€',
    label: 'Nouvelle collection',
    cta: 'Acheter maintenant',
    Icon: Handbag,
    BadgeIcon: TrendUpBadge,
    badge: { color: '#7c6af7', text: '+38% CVR', icon: '↑' },
    delay: '0s',
    shapes: [
      { w: 48, h: 64, top: '10%', left: '10%', r: 8, bg: 'rgba(255,255,255,0.08)' },
      { w: 32, h: 32, top: '10%', right: '12%', r: 999, bg: 'rgba(124,106,247,0.35)' },
    ],
  },
  {
    name: 'Tech & Gadgets',
    accent: '#38bdf8',
    bg: 'linear-gradient(160deg,#0a0f1a 0%,#0f1f35 100%)',
    heroColor: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    price: '129€',
    oldPrice: '199€',
    label: 'Meilleure vente',
    cta: 'Commander',
    Icon: Headphones,
    BadgeIcon: Lightning,
    badge: { color: '#0ea5e9', text: 'ROAS ×4.2', icon: '⚡' },
    delay: '0.15s',
    shapes: [
      { w: 52, h: 40, top: '8%', left: '50%', r: 6, bg: 'rgba(14,165,233,0.15)' },
      { w: 20, h: 20, top: '30%', left: '12%', r: 999, bg: 'rgba(56,189,248,0.3)' },
    ],
  },
  {
    name: 'Beauté & Bien-être',
    accent: '#fb923c',
    bg: 'linear-gradient(160deg,#1f0d00 0%,#3d1f05 100%)',
    heroColor: 'linear-gradient(135deg,#f97316,#fb923c)',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    price: '34,90€',
    oldPrice: '59€',
    label: '-41% ce week-end',
    cta: 'J\'en profite',
    Icon: Flower,
    BadgeIcon: ShoppingCart,
    badge: { color: '#f97316', text: '+52% Add to cart', icon: '🛒' },
    delay: '0.3s',
    shapes: [
      { w: 36, h: 56, top: '5%', right: '10%', r: 999, bg: 'rgba(249,115,22,0.2)' },
      { w: 22, h: 22, top: '35%', left: '15%', r: 999, bg: 'rgba(251,146,60,0.3)' },
    ],
  },
  {
    name: 'Sport & Outdoor',
    accent: '#2dd4bf',
    bg: 'linear-gradient(160deg,#001a18 0%,#04312d 100%)',
    heroColor: 'linear-gradient(135deg,#0d9488,#2dd4bf)',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
    price: '79,90€',
    oldPrice: '119€',
    label: 'Top performance',
    cta: 'Découvrir',
    Icon: Barbell,
    BadgeIcon: Trophy,
    badge: { color: '#0d9488', text: '×3.8 ROAS', icon: '🏆' },
    delay: '0.45s',
    shapes: [
      { w: 44, h: 44, top: '8%', left: '20%', r: 8, bg: 'rgba(45,212,191,0.12)' },
      { w: 18, h: 18, top: '20%', right: '15%', r: 999, bg: 'rgba(13,148,136,0.4)' },
    ],
  },
]
function Slide2() {
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            {TEMPLATE_COUNT}+ templates premium
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Tes visiteurs jugent ta page{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              en 3 secondes.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
            {TEMPLATE_COUNT}+ templates premium — chaque design suit les tendances mondiales et est calibré pour déclencher l&apos;achat. Mode, Tech, Beauté, Luxe, Streetwear, Joaillerie et plus.
          </p>
          <Link
            href="/templates"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Explorer les templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille 2×2 de mini mockups */}
        <div className="grid grid-cols-2 gap-3 mt-4 lg:mt-0">
          {TEMPLATE_CARDS.map((t, cardIdx) => (
            <div
              key={t.name}
              className="float-anim relative rounded-2xl overflow-hidden"
              style={{
                background: t.bg,
                boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
                animationDelay: t.delay,
                height: 'clamp(140px, 22vw, 188px)',
              }}
            >
              {/* Formes décoratives en fond */}
              {t.shapes.map((s, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    width: s.w, height: s.h,
                    top: s.top,
                    left: 'left' in s ? s.left : undefined,
                    right: 'right' in s ? s.right : undefined,
                    borderRadius: s.r,
                    background: s.bg,
                  }}
                />
              ))}

              {/* Header KONVERT dans chaque card */}
              <div
                className="mx-3 mt-3 flex items-center justify-between px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                    style={{ background: '#5B47F5' }}
                  >
                    K
                  </div>
                  <span className="text-[9px] font-black text-white/80" style={{ letterSpacing: '0.03em' }}>KONVERT</span>
                </div>
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(16,185,129,0.3)', color: '#4ade80' }}
                >
                  Live
                </span>
              </div>

              {/* Zone hero produit — image réelle */}
              <div
                className="mx-3 mt-1.5 rounded-xl relative overflow-hidden"
                style={{ height: '72px', background: t.heroColor }}
              >
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  sizes="280px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                {/* Badge label */}
                <div
                  className="absolute top-1.5 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  {t.label}
                </div>
              </div>

              {/* Corps de la landing page simulée */}
              <div className="px-3 pt-2.5 pb-2">
                {/* Prix */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-white font-black text-sm">{t.price}</span>
                  <span className="text-white/40 text-[10px] line-through">{t.oldPrice}</span>
                </div>
                {/* Lignes de texte simulées */}
                <div className="flex flex-col gap-1 mb-2.5">
                  <div className="h-1.5 rounded-full w-4/5" style={{ background: 'rgba(255,255,255,0.12)' }} />
                  <div className="h-1.5 rounded-full w-3/5" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
                {/* CTA button */}
                <div
                  className="w-full py-1.5 rounded-lg text-center text-[10px] font-black text-white"
                  style={{ background: t.heroColor, boxShadow: `0 2px 8px ${t.accent}55` }}
                >
                  {t.cta}
                </div>
              </div>

              {/* Badge métrique flottant — durée déterministe par index pour
                  éviter Math.random() au render (hydration mismatch SSR/CSR).
                  Longhands séparées pour ne pas mixer animation + animationDelay
                  (warning React "conflicting property"). */}
              <div
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black text-white shadow-lg"
                style={{
                  background: t.badge.color,
                  boxShadow: `0 4px 14px ${t.badge.color}66`,
                  animationName: 'float-card',
                  animationDuration: `${3.4 + cardIdx * 0.2}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: t.delay,
                }}
              >
                <t.BadgeIcon size={9} weight="bold" />
                <span>{t.badge.text}</span>
              </div>

              {/* Nom de la niche en bas à gauche */}
              <div className="absolute bottom-2.5 left-3 text-[9px] font-bold text-white/40">
                {t.name}
              </div>
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
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <ChartBar className="w-3.5 h-3.5" />
            Analytics temps réel
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Sais-tu pourquoi tes clients{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              n&apos;achètent pas ?
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
            CVR, ROAS, scroll depth en temps réel. Arrête de deviner — commence à optimiser avec des données qui parlent d&apos;elles-mêmes.
          </p>
          <Link
            href="/dashboard/analytics"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Voir l&apos;analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col relative mt-4 lg:mt-0">
          {/* Dashboard HTML généré */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#0f1020' }}
          >
            {/* Barre URL navigateur */}
            <div
              className="flex items-center gap-2.5 px-4 py-2.5"
              style={{ background: '#1a1b2e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
              </div>
              <div
                className="flex-1 rounded-md px-3 py-1 text-[11px] font-mono"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                app.konvertpilot.com/analytics
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                Live
              </div>
            </div>

            {/* Métriques top — 3 cards */}
            <div className="grid grid-cols-3 gap-px p-3 gap-3">
              {[
                { label: 'CVR', value: '4.8%', delta: '+1.2pts', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                { label: 'ROAS', value: 'x4.2', delta: '+0.8', color: '#a78bfa', bg: 'rgba(124,106,247,0.12)' },
                { label: 'Views', value: '12K', delta: '+23%', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-3 rounded-2xl"
                  style={{ background: m.bg, border: `1px solid ${m.color}25` }}
                >
                  <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{m.label}</span>
                  <span className="text-white font-black text-lg leading-none">{m.value}</span>
                  <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.delta}</span>
                </div>
              ))}
            </div>

            {/* Graphe en barres */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Conversions — 7 derniers jours</span>
              </div>
              <div className="flex items-end gap-2" style={{ height: '80px' }}>
                {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-md"
                      style={{
                        height: `${h}%`,
                        background: i === 5
                          ? 'linear-gradient(to top, #5B47F5, #a78bfa)'
                          : i === 6
                          ? 'linear-gradient(to top, #7c3aed, #a78bfa)'
                          : 'rgba(91,71,245,0.22)',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge TrendUp */}
          <div
            className="float-anim absolute -top-3 -right-3 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-2xl"
            style={{ background: 'rgba(16,185,129,0.92)', backdropFilter: 'blur(8px)' }}
          >
            <TrendUp className="w-3.5 h-3.5" />
            +1.2pts CVR cette semaine
          </div>
        </div>
      </div>
    </div>
  )
}
// Slide 4 — Intégrations
function Slide4() {
  const integrations = [
    { name: 'Shopify',     color: '#96BF48' },
    { name: 'WooCommerce', color: '#7F54B3' },
    { name: 'Klaviyo',     color: '#006BFF' },
    { name: 'Stripe',      color: '#635BFF' },
    { name: 'Meta Ads',    color: '#1877F2' },
    { name: 'Zapier',      color: '#FF4A00' },
  ]
  return (
    <div className="slide-item flex items-center justify-center px-5 sm:px-8">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <LinkSimple className="w-3.5 h-3.5" />
            Connecté à votre stack
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Prêt à coller sur ta boutique.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              En 1 clic.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
            Shopify, WooCommerce, Klaviyo — KONVERT s&apos;intègre avec les outils que tu utilises déjà. Zéro développeur, zéro galère.
          </p>
          <Link
            href="/integrations"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Voir les intégrations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 lg:mt-0">
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
              <div className="w-10 h-10">
                <BrandLogo name={item.name} color={item.color} />
              </div>
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
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Lightning className="w-3.5 h-3.5" />
            Pour les agences SMMA
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Livre plus de pages.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sans recruter.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
            Dashboard agence, white-label, rapports PDF automatiques. Scale ta livraison client sans ajouter une seule personne à ton équipe.
          </p>
          <Link
            href="/agence"
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg"
          >
            Découvrir le plan Agence <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-4 lg:mt-0">
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

export default function HeroSlider() {
  const { slide, goTo, pause, resume } = useSlider(SLIDES.length, 5000)
  const touchStartX = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? slide + 1 : slide - 1)
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #08091a 0%, #0d0b20 50%, #0a0a1a 100%)', minHeight: '100vh' }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gradient radial violet en bas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 110%, rgba(91,71,245,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Background glow image subtile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/images/hero-bg-glow.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
        }}
      />
      {/* Grain overlay très subtil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
          backgroundSize: '256px 256px',
        }}
      />

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
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        aria-label="Slide précédent"
      >
        <CaretLeft className="w-5 h-5 text-white" />
      </button>

      {/* Flèche droite */}
      <button
        onClick={() => goTo(slide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 z-20"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        aria-label="Slide suivant"
      >
        <CaretRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots — style pill */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === slide ? 28 : 8,
              height: 8,
              background: i === slide
                ? 'linear-gradient(90deg,#7c6af7,#a78bfa)'
                : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </section>
  )
}