'use client'

import Link from 'next/link'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { templateEtecBeauty } from '@/lib/templates'
import LeadEnrichmentDemo from '@/components/marketing/LeadEnrichmentDemo'
import KonvertEasterEgg from '@/components/marketing/KonvertEasterEgg'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import LogoMarquee from '@/components/marketing/LogoMarquee'
import StatsCounter from '@/components/marketing/StatsCounter'
import FAQ from '@/components/marketing/FAQ'
import Tooltip from '@/components/ui/Tooltip'
import {
  Robot,
  Palette,
  ChartBar,
  LinkSimple,
  Flask,
  Globe,
  CaretLeft,
  CaretRight,
  ArrowRight,
  Check,
  Star,
  Lightning,
  TrendUp,
  Sparkle,
  File as FileText2,
  PencilSimple as Pencil2,
  Image as Image2,
  Gear as Settings2,
  ShoppingCart,
  Trophy,
  Handbag,
  Headphones,
  Flower,
  Barbell,
  TrendUp as TrendUpBadge,
} from '@phosphor-icons/react'

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
  @keyframes float-card {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-8px) rotate(0.5deg); }
    66%       { transform: translateY(-4px) rotate(-0.3deg); }
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
  @keyframes popOut {
    from { opacity: 0; transform: scale(0.7) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes wave-move {
    0%   { transform: scaleY(1); }
    50%  { transform: scaleY(1.15); }
    100% { transform: scaleY(1); }
  }

  .marquee-track { display: flex; flex-shrink: 0; animation: marquee 40s linear infinite; }
  .marquee-wrap  { display: flex; overflow: hidden; }
  .float-anim    { animation: float 4s ease-in-out infinite; }
  .float-card    { animation: float-card 5s ease-in-out infinite; }
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
    will-change: transform;
  }
  .slide-item {
    width: 100%;
    min-width: 100%;
    flex-shrink: 0;
  }
`

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITAIRE — addRipple
═══════════════════════════════════════════════════════════════════════════ */
function addRipple(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  Object.assign(wave.style, { width: `${size}px`, height: `${size}px`, left: `${x}px`, top: `${y}px` })
  el.appendChild(wave)
  setTimeout(() => wave.remove(), 600)
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK — useReveal
═══════════════════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    function observe() {
      const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)')
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
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach((el) => io.observe(el))
      return io
    }

    const io = observe()

    // Fallback : force visible après 1.5s pour les éléments jamais déclenchés
    const fallback = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible')
      })
    }, 1500)

    return () => {
      io?.disconnect()
      clearTimeout(fallback)
    }
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
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 pb-20 sm:py-24 sm:pt-36">
        {/* Texte gauche */}
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Sparkle className="w-3.5 h-3.5" />
            Pages produit · Landing pages · SEO
          </div>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5"
            style={{ animation: 'slideUp .7s cubic-bezier(.16,1,.3,1) both' }}
          >
            Colle ton lien AliExpress.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ta page est prête en 30 secondes.
            </span>
          </h1>
          <p
            className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0"
            style={{ animation: 'slideUp .7s .1s cubic-bezier(.16,1,.3,1) both' }}
          >
            L&apos;IA génère ton titre, tes bénéfices, ta FAQ et ton CTA — optimisés SEO et mobile. Prêt à coller sur Shopify.
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
              Essaie avec ton produit — gratuit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="btn-ripple inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
              onClick={addRipple}
            >
              Voir la démo
            </Link>
          </div>

          {/* ── TRUSTPILOT + 3 badges ──────────────────────────────── */}
          <div
            className="mt-6 flex flex-col items-center lg:items-start gap-2.5"
            style={{ animation: 'slideUp .7s .35s cubic-bezier(.16,1,.3,1) both' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#00B67A"/>
                  <path d="M12 16.5L7.5 19l1.2-5.1L5 10.5l5.2-.4L12 5l1.8 5.1 5.2.4-3.7 3.4 1.2 5.1z" fill="white"/>
                </svg>
                <span className="text-xs font-black" style={{ color: '#00B67A' }}>Trustpilot</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="3" fill="#00B67A"/>
                    <path d="M12 16.5L7.5 19l1.2-5.1L5 10.5l5.2-.4L12 5l1.8 5.1 5.2.4-3.7 3.4 1.2 5.1z" fill="white"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-white">4.9</span>
              <span className="text-sm text-white/35">· 127 avis</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { dot: '#96BF48', label: 'Shopify Partner' },
                { dot: '#635BFF', label: 'Stripe sécurisé' },
                { dot: '#16a34a', label: '1 page gratuite · Aucune CB' },
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
                konvert.app/p/nike-runner-pro
              </div>
            </div>

            {/* Hero produit — image réelle sneaker */}
            <div
              className="relative flex flex-col justify-end"
              style={{ height: '195px', overflow: 'hidden' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85"
                alt="Air Jordan Pro"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
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
            38+ templates premium
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Tes visiteurs jugent ta page{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              en 3 secondes.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
            38+ templates premium — chaque design suit les tendances mondiales et est calibré pour déclencher l&apos;achat. Mode, Tech, Beauté, Luxe, Streetwear, Joaillerie et plus.
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
          {TEMPLATE_CARDS.map((t) => (
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.img}
                  alt={t.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
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

              {/* Badge métrique flottant */}
              <div
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black text-white shadow-lg"
                style={{
                  background: t.badge.color,
                  boxShadow: `0 4px 14px ${t.badge.color}66`,
                  animation: `float-card ${3 + Math.random()}s ease-in-out infinite`,
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Sais-tu pourquoi tes clients{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              n&apos;achètent pas ?
            </span>
          </h1>
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
                app.konvert.app/analytics
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Prêt à coller sur ta boutique.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              En 1 clic.
            </span>
          </h1>
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-5">
            Livre 10x plus de pages.{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sans recruter.
            </span>
          </h1>
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

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST BAR — Logo marquee style
═══════════════════════════════════════════════════════════════════════════ */
const TRUST_BRANDS = [
  { name: 'SoundCloud',               style: { fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' } },
  { name: 'Harvard Business Review',  style: { fontWeight: 800, fontSize: '13px', lineHeight: '1.2', maxWidth: '90px', textAlign: 'center' as const } },
  { name: 'CHOMPS',                   style: { fontWeight: 900, fontSize: '26px', letterSpacing: '1.5px' } },
  { name: 'ebay',                     style: { fontWeight: 800, fontSize: '26px', letterSpacing: '-1px', color: '#4b5563' } },
  { name: 'vimeo',                    style: { fontWeight: 700, fontSize: '22px', fontStyle: 'italic' } },
  { name: 'Zapier',                   style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'Shopify',                  style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'Stripe',                   style: { fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' } },
  { name: 'Klaviyo',                  style: { fontWeight: 700, fontSize: '18px' } },
]

function TrustBar() {
  const doubled = [...TRUST_BRANDS, ...TRUST_BRANDS]
  return (
    <section style={{ background: '#f0eeff', borderTop: '1px solid #e4daff', borderBottom: '1px solid #e4daff' }}>
      <div className="py-3">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#b8aee8' }}>
          Utilisé par des marques qui convertissent
        </p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {doubled.map((brand, i) => (
              <span
                key={i}
                className="flex items-center gap-8 sm:gap-12 px-6 sm:px-10 flex-shrink-0"
                style={{ color: '#374151', ...brand.style }}
              >
                {brand.name}
                <span style={{ color: '#d1c7f5', fontSize: '20px', fontWeight: 300 }}>|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROOF SECTION — Leadpages-style, fond lavande clair
═══════════════════════════════════════════════════════════════════════════ */
function ProofSection() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); io.disconnect() } },
      { threshold: 0.3 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const pages  = useCounter(50000, 1800, triggered)
  const cvr    = useCounter(48,    1400, triggered)
  const stores = useCounter(2800,  1600, triggered)

  const stats = [
    { value: pages,  suffix: '+',  label: 'pages générées en production' },
    { value: cvr,    suffix: '%',  label: 'taux de conversion moyen' },
    { value: stores, suffix: '+',  label: 'boutiques actives et en croissance' },
  ]

  return (
    <section
      ref={ref}
      style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdfbff 55%, #ede8ff 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Gauche — titre + description */}
          <div>
            <h2 className="reveal text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-gray-900 mb-6">
              La preuve est dans les{' '}
              <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                résultats.
              </span>
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed max-w-lg">
              KONVERT propulse les e-commerçants vers plus de conversions, avec des données actionnables et des résultats prouvés. Des milliers de pages actives — les chiffres parlent d&apos;eux-mêmes.
            </p>
          </div>

          {/* Droite — 3 stats empilées */}
          <div className="flex flex-col">
            {stats.map((s, i) => (
              <div
                key={i}
                className="reveal py-8"
                style={{
                  transitionDelay: `${i * 0.15}s`,
                  borderTop: i > 0 ? '1px solid rgba(91,71,245,0.12)' : 'none',
                }}
              >
                <div
                  className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none mb-2"
                  style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {s.value.toLocaleString('fr-FR')}{s.suffix}
                </div>
                <div className="text-gray-500 text-base font-medium">{s.label}</div>
              </div>
            ))}
          </div>

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
    Icon: Robot,
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.08)',
    title: 'Page générée en 30 secondes',
    desc: 'Colle l\'URL du produit. L\'IA analyse, rédige le titre, les bénéfices, la FAQ et le CTA. Ta page est prête avant ton café.',
    tooltip: 'IA Claude génère titre, bénéfices, FAQ et CTA',
  },
  {
    Icon: Palette,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    title: '42+ templates qui convertissent',
    desc: 'Chaque template suit les tendances mondiales. Tech, Beauté, Luxe, Streetwear, Joaillerie, Maison — le bon design pour chaque niche.',
    tooltip: '42 designs optimisés par niche e-commerce',
  },
  {
    Icon: ChartBar,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    title: 'Sais-tu ce qui bloque tes ventes ?',
    desc: 'Scroll depth, CVR, ROAS en temps réel. Tu vois exactement où tes clients décrochent — et tu corriges.',
    tooltip: 'Scroll depth, CVR et ROAS en temps réel',
  },
  {
    Icon: LinkSimple,
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.08)',
    title: 'Publish Shopify en 1 clic',
    desc: 'Pas de copier-coller de code. Connecte ta boutique une fois, publie en un clic. Zéro développeur requis.',
    tooltip: 'Connexion OAuth Shopify & WooCommerce directe',
  },
  {
    Icon: Flask,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    title: 'A/B Testing automatique',
    desc: 'Lance 2 variantes de ta page. L\'algorithme identifie la gagnante et bascule le trafic dessus. Tu te concentres sur le reste.',
    tooltip: 'Gagnant détecté automatiquement à 95% de signif.',
  },
  {
    Icon: Globe,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    title: 'Vends dans 8 langues',
    desc: 'Français, anglais, espagnol, allemand, portugais et plus. Chaque marché, une page optimisée dans sa langue.',
    tooltip: 'FR, EN, ES, DE, IT, PT, AR, ZH — copy natif',
  },
]

function FeaturesSection() {
  return (
    <section id="features" style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-16">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Lightning className="w-3.5 h-3.5" />
            Fonctionnalités
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Arrête de perdre de l&apos;argent<br />sur tes pages.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            KONVERT donne à chaque e-commerçant les outils pro qui coûtaient 5 000€/mois à une agence. Résultats immédiats, sans intermédiaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal card-hover-violet p-6 rounded-2xl"
              style={{
                background: '#ffffff',
                border: '1.5px solid #ede8ff',
                boxShadow: '0 2px 12px rgba(91,71,245,0.05)',
                transitionDelay: `${i * 0.07}s`,
              }}
            >
              <Tooltip content={f.tooltip} position="top">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 cursor-default"
                  style={{ background: f.bg }}
                >
                  <f.Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
              </Tooltip>
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
   A/B TESTING SECTION
═══════════════════════════════════════════════════════════════════════════ */
function ABTestingSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Left */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Ta meilleure page, trouvée par les données.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Lance deux versions de ta page. KONVERT mesure les clics, les scrolls, les conversions — et te dit laquelle gagne. Plus de suppositions, que des résultats.
            </p>
            <Link href="/features" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Optimiser les performances</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — mockup A/B */}
          <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: '360px' }}>

            {/* Page variant B (arrière) */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-xl"
              style={{
                width: '300px',
                top: '10px',
                right: '10px',
                background: '#1a2535',
                border: '1px solid rgba(255,255,255,0.08)',
                transform: 'rotate(3deg)',
                zIndex: 1,
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 rounded px-2 py-0.5 text-xs text-white/30 font-mono" style={{ background: 'rgba(255,255,255,0.05)' }}>konvert.app/p/variant-b</div>
              </div>
              <div className="p-4" style={{ background: '#1a2535' }}>
                <div className="h-20 rounded-lg mb-3" style={{ background: 'linear-gradient(135deg,#0d9488,#2dd4bf)' }} />
                <div className="h-2 rounded w-3/4 mb-2" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <div className="h-2 rounded w-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-2 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            </div>

            {/* Page variant A (avant) — page produit KONVERT */}
            <div
              className="float-anim absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: '320px',
                top: '20px',
                left: '0px',
                background: '#fff',
                border: '1.5px solid #e5e7eb',
                zIndex: 2,
              }}
            >
              {/* Chrome navigateur */}
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 rounded px-2 py-0.5 text-xs text-gray-400 font-mono bg-white border border-gray-200">konvert.app/p/air-max-pro</div>
              </div>
              {/* Hero produit — image sneaker */}
              <div style={{ background: 'linear-gradient(135deg,#5B47F5 0%,#7c6af7 100%)', padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, position: 'relative', zIndex: 2 }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>NOUVEAUTÉ</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <svg key={i} width="9" height="9" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/></svg>)}
                  </div>
                </div>
                {/* Image produit */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
                    alt="Air Max Pro sneaker"
                    style={{ width: 140, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
                  />
                </div>
                {/* Halo lumineux derrière le produit */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
              </div>
              {/* Info produit */}
              <div className="p-4 bg-white">
                <p className="font-black text-gray-900 text-sm mb-1">Air Max Pro — Édition limitée</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: '#5B47F5' }}>89€</span>
                  <span style={{ fontSize: 12, textDecoration: 'line-through', color: '#94a3b8' }}>139€</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#fee2e2', color: '#ef4444' }}>-36%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: '#f1f5f9', marginBottom: 6, width: '100%' }} />
                <div style={{ height: 6, borderRadius: 4, background: '#f1f5f9', marginBottom: 12, width: '75%' }} />
                <div style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', borderRadius: 10, padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>
                  Ajouter au panier →
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
                  {['🔒 Paiement sécurisé', '🚚 Livraison offerte'].map(t => (
                    <span key={t} style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre "Add Variant" */}
            <div
              className="absolute flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl px-6 py-3 z-10"
              style={{
                bottom: '30px',
                left: '0',
                right: '80px',
                background: '#1f2937',
              }}
            >
              <span className="text-lg">+</span> Add Variant
            </div>

            {/* Floating stats card — le carré qui bouge */}
            <div
              className="float-card absolute rounded-2xl p-4 shadow-2xl z-20"
              style={{
                bottom: '80px',
                right: '-10px',
                background: 'rgba(20,22,38,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '155px',
              }}
            >
              <p className="text-white/50 text-xs font-bold tracking-widest mb-1">A/B TEST</p>
              <p className="text-white font-black text-4xl mb-3">+45%</p>
              <svg viewBox="0 0 120 44" className="w-full">
                <defs>
                  <linearGradient id="abGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c6af7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="abFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c6af7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,44 0,38 15,32 30,34 45,22 60,24 75,14 90,16 105,7 120,4 120,44"
                  fill="url(#abFill)"
                />
                <polyline
                  points="0,38 15,32 30,34 45,22 60,24 75,14 90,16 105,7 120,4"
                  fill="none"
                  stroke="url(#abGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
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
    Icon: LinkSimple,
    title: 'Colle ton lien produit',
    desc: 'AliExpress, Amazon, Alibaba. Tu colles l\'URL — KONVERT scrape tout automatiquement.',
  },
  {
    num: '02',
    Icon: Sparkle,
    title: 'L\'IA rédige en 30 secondes',
    desc: 'Titre accrocheur, bénéfices, FAQ, CTA — tout généré et optimisé pour convertir.',
  },
  {
    num: '03',
    Icon: TrendUp,
    title: 'Publie sur Shopify en 1 clic',
    desc: 'Choisis un template, connecte ta boutique, publie. Pas de dev, pas d\'attente.',
  },
]

function HowItWorks() {
  const [videoOpen, setVideoOpen] = React.useState(false)

  return (
    <>
      <section id="how-it-works" style={{ background: 'radial-gradient(ellipse 90% 50% at 50% -5%, rgba(91,71,245,0.28) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 85% 110%, rgba(124,106,247,0.15) 0%, transparent 60%), #0b0b1c' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
          <div className="text-center mb-10 sm:mb-16">
            <div
              className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
            >
              <Lightning className="w-3.5 h-3.5" />
              Comment ça marche
            </div>
            <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Un lien AliExpress. Une page qui vend.
            </h2>
            <p className="reveal delay-2 text-lg text-white/60 max-w-xl mx-auto">
              Personne d&apos;autre ne fait ça. Tu colles un lien — l&apos;IA scrape, rédige, structure. Ta page est prête en 30 secondes.
            </p>
          </div>

          {/* ── Bloc vidéo ─────────────────────────────────────────────── */}
          <div className="reveal mb-14 sm:mb-20 max-w-3xl mx-auto">
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative w-full rounded-2xl overflow-hidden focus:outline-none"
              style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #3b2fa8, #5B47F5, #7c6af7)' }}
            >
              {/* Grille décorative */}
              <div className="absolute inset-0 opacity-20"
                   style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              {/* Glow central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: '#7c6af7' }} />
              </div>
              {/* Icône play */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 ml-1" style={{ color: '#5B47F5' }}>
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-white font-bold text-base sm:text-lg text-center px-4"
                   style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  Voir KONVERT en action — 45 sec
                </p>
              </div>
              {/* Badge */}
              <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                   style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                Démo live
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
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
                    className="text-4xl sm:text-6xl font-black"
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

      {/* ── Modal vidéo ──────────────────────────────────────────────────── */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9' }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="KONVERT en action"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
            />
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND LOGOS — SVG inline (Simple Icons)
═══════════════════════════════════════════════════════════════════════════ */
const BrandLogo = ({ name, color }: { name: string; color: string }) => {
  const logos: Record<string, React.ReactNode> = {
    Shopify: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
      </svg>
    ),
    Zapier: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M4.157 0A4.151 4.151 0 0 0 0 4.161v15.678A4.151 4.151 0 0 0 4.157 24h15.682A4.152 4.152 0 0 0 24 19.839V4.161A4.152 4.152 0 0 0 19.839 0H4.157Zm10.61 8.761h.03a.577.577 0 0 1 .23.038.585.585 0 0 1 .201.124.63.63 0 0 1 .162.431.612.612 0 0 1-.162.435.58.58 0 0 1-.201.128.58.58 0 0 1-.23.042.529.529 0 0 1-.235-.042.585.585 0 0 1-.332-.328.559.559 0 0 1-.038-.235.613.613 0 0 1 .17-.431.59.59 0 0 1 .405-.162Zm2.853 1.572c.03.004.061.004.095.004.325-.011.646.064.937.219.238.144.431.355.552.609.128.279.189.582.185.888v.193a2 2 0 0 1 0 .219h-2.498c.003.227.075.45.204.642a.78.78 0 0 0 .646.265.714.714 0 0 0 .484-.136.642.642 0 0 0 .23-.318l.915.257a1.398 1.398 0 0 1-.28.537c-.14.159-.321.284-.521.355a2.234 2.234 0 0 1-.836.136 1.923 1.923 0 0 1-1.001-.245 1.618 1.618 0 0 1-.665-.703 2.221 2.221 0 0 1-.227-1.036 1.95 1.95 0 0 1 .48-1.398 1.9 1.9 0 0 1 1.3-.488Zm-9.607.023c.162.004.325.026.48.079.207.065.4.174.563.314.26.302.393.692.366 1.088v2.276H8.53l-.109-.711h-.065c-.064.163-.155.31-.272.439a1.122 1.122 0 0 1-.374.264 1.023 1.023 0 0 1-.453.083 1.334 1.334 0 0 1-.866-.264.965.965 0 0 1-.329-.801.993.993 0 0 1 .076-.431 1.02 1.02 0 0 1 .242-.363 1.478 1.478 0 0 1 1.043-.303h.952v-.181a.696.696 0 0 0-.136-.454.553.553 0 0 0-.438-.154.695.695 0 0 0-.378.086.48.48 0 0 0-.193.254l-.99-.144a1.26 1.26 0 0 1 .257-.563c.14-.174.321-.302.533-.378.261-.091.54-.136.82-.129.053-.003.106-.007.163-.007Zm4.384.007c.174 0 .347.038.506.114.182.083.34.211.458.374.257.423.377.911.351 1.406a2.53 2.53 0 0 1-.355 1.448 1.148 1.148 0 0 1-1.009.517c-.204 0-.401-.045-.582-.136a1.052 1.052 0 0 1-.48-.457 1.298 1.298 0 0 1-.114-.234h-.045l.004 1.784h-1.059v-4.713h.904l.117.805h.057c.068-.208.177-.401.328-.56a1.129 1.129 0 0 1 .843-.344h.076v-.004Zm7.559.084h.903l.113.805h.053a1.37 1.37 0 0 1 .235-.484.813.813 0 0 1 .313-.242.82.82 0 0 1 .39-.076h.234v1.051h-.401a.662.662 0 0 0-.313.008.623.623 0 0 0-.272.155.663.663 0 0 0-.174.26.683.683 0 0 0-.027.314v1.875h-1.054v-3.666Zm-17.515.003h3.262v.896L3.73 13.104l.034.113h1.973l.042.9H2.4v-.9l1.931-1.754-.045-.117H2.441v-.896Zm11.815 0h1.055v3.659h-1.055V10.45Zm3.443.684.019.016a.69.69 0 0 0-.351.045.756.756 0 0 0-.287.204c-.11.155-.174.336-.189.522h1.545c-.034-.526-.257-.787-.74-.787h.003Zm-5.718.163c-.026 0-.057 0-.083.004a.78.78 0 0 0-.31.053.746.746 0 0 0-.257.189 1.016 1.016 0 0 0-.204.695v.064c-.015.257.057.507.204.711a.634.634 0 0 0 .253.196.638.638 0 0 0 .314.061.644.644 0 0 0 .578-.265c.14-.223.204-.48.189-.74a1.216 1.216 0 0 0-.181-.711.677.677 0 0 0-.503-.257Zm-4.509 1.266a.464.464 0 0 0-.268.102.373.373 0 0 0-.114.276c0 .053.008.106.027.155a.375.375 0 0 0 .087.132.576.576 0 0 0 .397.11v.004a.863.863 0 0 0 .563-.182.573.573 0 0 0 .211-.457v-.14h-.903Z"/>
      </svg>
    ),
    HubSpot: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/>
      </svg>
    ),
    Klaviyo: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M3 2h3.5v20H3V2zm3.5 10L19 2h4L14 12l9 10h-4L6.5 12z"/>
      </svg>
    ),
    Stripe: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
      </svg>
    ),
    'Meta Ads': (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
      </svg>
    ),
    WooCommerce: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M21.994 9.28a2.19 2.19 0 0 0-1.818-.98H2.805A2.19 2.19 0 0 0 .628 10.46l1.34 7.993a2.19 2.19 0 0 0 2.157 1.822h15.74a2.19 2.19 0 0 0 2.157-1.822l1.34-7.994a2.19 2.19 0 0 0-.368-1.178zM6.129 16.27c-.37 0-.7-.218-.855-.556l-1.312-2.842-.29 2.27a.938.938 0 0 1-.929.816.938.938 0 0 1-.937-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.95-4.223a.938.938 0 0 1 1.793.231l.572 4.478a.938.938 0 0 1-.928 1.066.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm7.5 0c-.37 0-.7-.218-.855-.556l-1.311-2.842-.291 2.27a.938.938 0 0 1-.928.816.938.938 0 0 1-.938-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.949-4.223a.938.938 0 0 1 1.793.231l.573 4.478a.929.929 0 0 1 .009.128.938.938 0 0 1-.938.938.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm6.57-.468a2.104 2.104 0 1 1 0-4.209 2.104 2.104 0 0 1 0 4.21z"/>
      </svg>
    ),
    Mailchimp: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill={color}>
        <path d="M11.267 0C6.791-.015-1.82 10.246 1.397 12.964l.79.669a3.88 3.88 0 0 0-.22 1.792c.084.84.518 1.644 1.22 2.266.666.59 1.542.964 2.392.964 1.406 3.24 4.62 5.228 8.386 5.34 4.04.12 7.433-1.776 8.854-5.182.093-.24.488-1.316.488-2.267 0-.956-.54-1.352-.885-1.352-.01-.037-.078-.286-.172-.586-.093-.3-.19-.51-.19-.51.375-.563.382-1.065.332-1.35-.053-.353-.2-.653-.496-.964-.296-.311-.902-.63-1.753-.868l-.446-.124c-.002-.019-.024-1.053-.043-1.497-.014-.32-.042-.822-.197-1.315-.186-.668-.508-1.253-.911-1.627 1.112-1.152 1.806-2.422 1.804-3.511-.003-2.095-2.576-2.729-5.746-1.416l-.672.285A678.22 678.22 0 0 0 12.7.504C12.304.159 11.817.002 11.267 0zm.073.873c.166 0 .322.019.465.058.297.084 1.28 1.224 1.28 1.224s-1.826 1.013-3.52 2.426c-2.28 1.757-4.005 4.311-5.037 7.082-.811.158-1.526.618-1.963 1.253-.261-.218-.748-.64-.834-.804-.698-1.326.761-3.902 1.781-5.357C5.834 3.44 9.37.867 11.34.873zm3.286 3.273c.04-.002.06.05.028.074-.143.11-.299.26-.413.414a.04.04 0 0 0 .031.064c.659.004 1.587.235 2.192.574.041.023.012.103-.034.092-.915-.21-2.414-.369-3.97.01-1.39.34-2.45.863-3.224 1.426-.04.028-.086-.023-.055-.06.896-1.035 1.999-1.935 2.987-2.44.034-.018.07.019.052.052-.079.143-.23.447-.278.678-.007.035.032.063.062.042.615-.42 1.684-.868 2.622-.926zm3.023 3.205l.056.001a.896.896 0 0 1 .456.146c.534.355.61 1.216.638 1.845.015.36.059 1.229.074 1.478.034.571.184.651.487.751.17.057.33.098.563.164.706.198 1.125.4 1.39.658.157.162.23.333.253.497.083.608-.472 1.36-1.942 2.041-1.607.746-3.557.935-4.904.785l-.471-.053c-1.078-.145-1.693 1.247-1.046 2.201.417.615 1.552 1.015 2.688 1.015 2.604 0 4.605-1.111 5.35-2.072a.987.987 0 0 0 .06-.085c.036-.055.006-.085-.04-.054-.608.416-3.31 2.069-6.2 1.571 0 0-.351-.057-.672-.182-.255-.1-.788-.344-.853-.891 2.333.72 3.801.039 3.801.039a.072.072 0 0 0 .042-.072.067.067 0 0 0-.074-.06s-1.911.283-3.718-.378c.197-.64.72-.408 1.51-.345a11.045 11.045 0 0 0 3.647-.394c.818-.234 1.892-.697 2.727-1.356.281.618.38 1.299.38 1.299s.219-.04.4.073c.173.106.299.326.213.895-.176 1.063-.628 1.926-1.387 2.72a5.714 5.714 0 0 1-1.666 1.244c-.34.18-.704.334-1.087.46-2.863.935-5.794-.093-6.739-2.3a3.545 3.545 0 0 1-.189-.522c-.403-1.455-.06-3.2 1.008-4.299.065-.07.132-.153.132-.256 0-.087-.055-.179-.102-.243-.374-.543-1.669-1.466-1.409-3.254.187-1.284 1.31-2.189 2.357-2.135.089.004.177.01.266.015.453.027.85.085 1.223.1.625.028 1.187-.063 1.853-.618.225-.187.405-.35.71-.401.028-.005.092-.028.215-.028zm.022 2.18a.42.42 0 0 0-.06.005c-.335.054-.347.468-.228 1.04.068.32.187.595.32.765.175-.02.343-.022.498 0 .089-.205.104-.557.024-.942-.112-.535-.261-.872-.554-.868zm-3.66 1.546a1.724 1.724 0 0 0-1.016.326c-.16.117-.311.28-.29.378.008.032.031.056.088.063.131.015.592-.217 1.122-.25.374-.023.684.094.923.2.239.104.386.173.443.113.037-.038.026-.11-.031-.204-.118-.192-.36-.387-.618-.497a1.601 1.601 0 0 0-.621-.129zm4.082.81c-.171-.003-.313.186-.317.42-.004.236.131.43.303.432.172.003.314-.185.318-.42.004-.236-.132-.429-.304-.432zm-3.58.172c-.05 0-.102.002-.155.008-.311.05-.483.152-.593.247-.094.082-.152.173-.152.237a.075.075 0 0 0 .075.076c.07 0 .228-.063.228-.063a1.98 1.98 0 0 1 1.001-.104c.157.018.23.027.265-.026.01-.016.022-.049-.01-.1-.063-.103-.311-.269-.66-.275zm2.26.4c-.127 0-.235.051-.283.148-.075.154.035.363.246.466.21.104.443.063.52-.09.075-.155-.035-.364-.246-.467a.542.542 0 0 0-.237-.058zm-11.635.024c.048 0 .098 0 .149.003.73.04 1.806.6 2.052 2.19.217 1.41-.128 2.843-1.449 3.069-.123.02-.248.029-.374.026-1.22-.033-2.539-1.132-2.67-2.435-.145-1.44.591-2.548 1.894-2.811.117-.024.252-.04.398-.042zm-.07.927a1.144 1.144 0 0 0-.847.364c-.38.418-.439.988-.366 1.19.027.073.07.094.1.098.064.008.16-.039.22-.2a1.2 1.2 0 0 0 .017-.052 1.58 1.58 0 0 1 .157-.37.689.689 0 0 1 .955-.199c.266.174.369.5.255.81-.058.161-.154.469-.133.721.043.511.357.717.64.738.274.01.466-.143.515-.256.029-.067.005-.107-.011-.125-.043-.053-.113-.037-.18-.021a.638.638 0 0 1-.16.022.347.347 0 0 1-.294-.148c-.078-.12-.073-.3.013-.504.011-.028.025-.058.04-.092.138-.308.368-.825.11-1.317-.195-.37-.513-.602-.894-.65a1.135 1.135 0 0 0-.138-.01z"/>
      </svg>
    ),
  }
  return <>{logos[name] ?? null}</>
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTEGRATIONS SECTION — dark marketing stack
═══════════════════════════════════════════════════════════════════════════ */
const INTEGRATION_APPS = [
  { name: 'Shopify',      color: '#96BF48' },
  { name: 'Zapier',       color: '#FF4A00' },
  { name: 'HubSpot',      color: '#FF7A59' },
  { name: 'Klaviyo',      color: '#006BFF' },
  { name: 'Stripe',       color: '#635BFF' },
  { name: 'Meta Ads',     color: '#1877F2' },
  { name: 'WooCommerce',  color: '#7F54B3' },
  { name: 'Mailchimp',    color: '#FFE01B' },
]

function IntegrationsSection() {
  return (
    <section style={{ background: '#12131f', position: 'relative', overflow: 'hidden' }}>
      {/* Glow violet haut-droite — renforcé */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-5%',
          top: '-10%',
          width: '55%',
          height: '90%',
          background: 'radial-gradient(ellipse, rgba(91,71,245,0.38) 0%, transparent 65%)',
        }}
      />
      {/* Glow centre */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          width: '70%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(124,106,247,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Glow bas-gauche */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-5%',
          bottom: '0',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-0 text-center relative z-10">
        <h2 className="reveal text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
          Connecte KONVERT à ce que<br />tu utilises déjà
        </h2>
        <p className="reveal delay-1 text-lg text-white/55 max-w-2xl mx-auto mb-10">
          Shopify, Klaviyo, Meta Ads, Stripe — tes outils restent en place. KONVERT s&apos;y branche en quelques secondes et commence à travailler pour toi.
        </p>
        <Link href="/integrations" className="reveal delay-2 inline-flex items-center gap-4 mb-20 group">
          <span className="text-white font-bold text-sm">Intégrations</span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: '#b5f23d' }}
          >
            <ArrowRight className="w-5 h-5 text-gray-900" />
          </div>
        </Link>

        {/* App icons — grille isométrique */}
        <div className="flex justify-center pb-0">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-5">
            {INTEGRATION_APPS.map((app, i) => (
              <div
                key={app.name}
                className="float-anim flex flex-col items-center gap-2"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(145deg, ${app.color}28 0%, #1e2035 100%)`,
                    border: `1px solid ${app.color}33`,
                    boxShadow: `0 8px 32px ${app.color}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
                  }}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11">
                    <BrandLogo name={app.name} color={app.color} />
                  </div>
                </div>
                <span className="text-white/40 text-[10px] sm:text-xs font-semibold">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DARK FEATURE CARDS — 2 rangées de 3 cartes
═══════════════════════════════════════════════════════════════════════════ */
const DARK_CARDS = [
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Toolkit de conversion',
    desc: 'Chaque visiteur qui part sans acheter, c\'est de l\'argent perdu. KONVERT centralise tout ce qu\'il faut pour inverser la tendance.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <path d="M7 15h2M12 15h5"/>
        <path d="M7 15v1.5M9 15v1.5"/>
      </svg>
    ),
    title: 'Vente directe sur la page',
    desc: 'Transforme chaque visiteur en acheteur sans qu\'il quitte ta landing page. Le funnel le plus court = le plus rentable.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
    ),
    title: 'Mobile-first par défaut',
    desc: '73% des achats e-commerce se font sur mobile. Tes pages KONVERT sont pensées mobile dès le départ — pas adaptées après.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635l-4 1 1-4 12.008-12.013z"/>
        <path d="m14.5 6.5 3 3"/>
        <circle cx="4.5" cy="4.5" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M3 3l2 2"/>
      </svg>
    ),
    title: 'Copy IA qui vend vraiment',
    desc: 'Titre accrocheur, bénéfices, FAQ, CTA — l\'IA rédige un copy haute conversion en 30s, adapté à ton produit et à ton audience.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M8 11h6M11 8v6" strokeDasharray="3 1"/>
      </svg>
    ),
    title: 'SEO intégré, trafic gratuit',
    desc: 'Tes pages sont optimisées SEO dès la génération — balises, vitesse, structure. Chaque page travaille pour toi même quand tu dors.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="8.5" cy="10" r="2"/>
        <path d="M13 9h5M13 13h5M8.5 16h8"/>
      </svg>
    ),
    title: 'Leads capturés, argent gardé',
    desc: 'Capture les leads qui ne convertissent pas tout de suite. Relance-les avec Klaviyo ou ton CRM. Rien ne se perd.',
  },
]

function DarkFeatureCards() {
  return (
    <section style={{ background: 'radial-gradient(ellipse 70% 60% at 10% 50%, rgba(91,71,245,0.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 50%, rgba(124,106,247,0.14) 0%, transparent 55%), #0b0b1c', paddingTop: '0', paddingBottom: '96px' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DARK_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="reveal flex flex-col items-center text-center px-8 py-12 rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, background 0.2s ease-out',
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px) scale(1.015)'
                el.style.background = 'rgba(255,255,255,0.06)'
                el.style.boxShadow = '0 12px 40px rgba(91,71,245,0.22)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.background = 'rgba(255,255,255,0.035)'
                el.style.boxShadow = ''
              }}
            >
              <div className="mb-7 text-white" style={{ opacity: 0.75 }}>
                {card.icon}
              </div>
              <h3 className="text-white font-semibold text-xl mb-4 leading-snug">
                {card.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7' }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI BUILDER DEMO — iframe template réelle + AI chat overlay + A/B test
═══════════════════════════════════════════════════════════════════════════ */
const DEMO_BEAUTY_DATA = {
  product_name: 'LuxHair Pro',
  headline: 'Des cheveux transformés, une confiance retrouvée',
  subtitle: 'Formule kératine premium enrichie aux huiles botaniques. Sans sulfates, sans parabènes. Résultats visibles en 7 jours.',
  cta: 'Découvrir la routine — Livraison offerte',
  urgency: '🌿 Édition limitée — Stock faible',
  benefits: [
    'Formule kératine premium — lissage naturel durable',
    'Huiles botaniques bio — argan, ricin, jojoba',
    'Sans sulfates, sans parabènes — respecte le cuir chevelu',
    'Résultats visibles en 7 jours — testé et approuvé',
    'Convient à tous les types de cheveux — même colorés',
  ],
  faq: [
    { question: 'Convient aux cheveux colorés ?', answer: 'Oui, notre formule est spécialement conçue pour respecter les cheveux colorés et traités chimiquement.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–3 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Garantie satisfait ou remboursé ?', answer: 'Satisfait ou remboursé sous 30 jours. Aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80',
    'https://images.unsplash.com/photo-1527799820374-87591a16f5e6?w=800&q=80',
  ],
}

function AIBuilderDemoSection() {
  const html = useMemo(() => templateEtecBeauty(DEMO_BEAUTY_DATA), [])

  return (
    <section style={{ background: '#08080f', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ background: 'rgba(181,242,61,0.08)', color: '#b5f23d', border: '1px solid rgba(181,242,61,0.18)' }}
          >
            ✦ Propulsé par Claude AI
          </div>
          <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Génère. Modifie. Teste.<br />
            <span style={{ color: '#b5f23d' }}>Tout depuis un seul outil.</span>
          </h2>
          <p className="reveal delay-1 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Dis à l&apos;IA ce que tu veux changer. Elle le fait en secondes.
            Le A/B test tourne en fond et te dit quelle version gagne.
          </p>
        </div>

        {/* Demo grid */}
        <div className="reveal delay-2 flex flex-col lg:flex-row gap-5 items-stretch">

          {/* ── LEFT : Browser window avec vraie template ── */}
          <div className="flex-1 min-w-0 relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#111122',
                border: '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Chrome bar */}
              <div
                className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                style={{ background: '#0d0e1e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex gap-1.5">
                  {['#ef4444','#f59e0b','#22c55e'].map(c => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div
                  className="flex-1 mx-3 flex items-center gap-2 px-3 py-1 rounded-md text-xs"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  konvert.app/p/phantom-watch-x
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(91,71,245,0.85)', color: '#fff' }}
                >
                  ✦ Éditer avec l&apos;IA
                </span>
              </div>

              {/* Template iframe scalée */}
              <div style={{ position: 'relative', overflow: 'hidden', height: '480px' }}>
                <iframe
                  srcDoc={html}
                  title="Template KONVERT — Phantom Watch X"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '1280px',
                    height: '960px',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    border: 'none',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                  sandbox="allow-scripts"
                />
                {/* Dégradé bas pour fondre proprement */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(to bottom, transparent, #111122)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* ── AI Chat overlay ── */}
            <div
              className="absolute z-20 rounded-2xl overflow-hidden"
              style={{
                bottom: '28px',
                right: '24px',
                width: '300px',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.5)',
              }}
            >
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs"
                    style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
                  >K</div>
                  <span className="font-black text-sm text-gray-900">KONVERT IA</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#f3f4f6', color: '#6b7280' }}>⚡ 2.1k</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                  <span className="cursor-pointer">↺</span>
                  <span className="cursor-pointer">✕</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-3 flex flex-col gap-2.5">
                <div
                  className="self-end px-3.5 py-2 rounded-2xl text-white text-xs leading-relaxed"
                  style={{ background: '#5B47F5', maxWidth: '90%' }}
                >
                  Rends le fond plus sombre et le CTA plus lumineux
                </div>
                <p className="text-xs text-gray-500 leading-relaxed px-1">
                  Fond passé en noir profond #08080f. CTA changé en violet électrique avec halo lumineux.
                </p>
                <div
                  className="self-end px-3.5 py-2 rounded-2xl text-white text-xs leading-relaxed"
                  style={{ background: '#5B47F5', maxWidth: '90%' }}
                >
                  Ajoute un badge &quot;Édition Limitée&quot; en rouge
                </div>
                {/* Typing dots */}
                <div className="flex items-center gap-1.5 px-1 py-1">
                  {[0,1,2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#d1d5db', animation: `wave-move ${0.5 + i * 0.15}s ease-in-out infinite` }}
                    />
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-3 pb-3">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400"
                  style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}
                >
                  Demande à l&apos;IA de modifier la page...
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT : A/B Test panel ── */}
          <div
            className="lg:w-72 xl:w-80 flex-shrink-0 rounded-2xl flex flex-col"
            style={{
              background: '#0f1020',
              border: '1.5px solid rgba(255,255,255,0.07)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="font-black text-white text-sm">A/B Test</span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                En cours
              </span>
            </div>

            {/* Test label */}
            <div
              className="px-5 py-3 text-xs"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
            >
              CTA lumineux vs CTA original
            </div>

            {/* Stats */}
            <div className="px-5 py-5 flex flex-col gap-5">
              <p className="text-xs font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.22)' }}>
                TAUX DE CONVERSION
              </p>

              {/* Variant A */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#5B47F5' }} />
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Variante A — original</span>
                  </div>
                  <span className="text-xs font-bold text-white/50">2.1%</span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: '35%', background: '#5B47F5' }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>32 / 1 505 visites</p>
              </div>

              {/* Variant B */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#b5f23d' }} />
                    <span className="text-xs font-semibold" style={{ color: '#b5f23d' }}>Variante B — CTA lumineux</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#b5f23d' }}>4.7%</span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: 'rgba(181,242,61,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: '78%', background: '#b5f23d' }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(181,242,61,0.4)' }}>71 / 1 505 visites</p>
              </div>

              {/* Winner card */}
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(181,242,61,0.07)', border: '1px solid rgba(181,242,61,0.18)' }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: '#b5f23d' }}>
                  ✓ Variante B — 91% confiance
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  +124% de conversions — Smart Traffic redirige automatiquement
                </p>
              </div>

              {/* Smart Traffic */}
              <div
                className="flex items-center justify-between px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(91,71,245,0.1)', border: '1px solid rgba(91,71,245,0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: '#a78bfa', fontSize: '13px' }}>⚡</span>
                  <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Smart Traffic</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#10b981' }}>Actif</span>
              </div>

              {/* Heatmap preview */}
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-bold mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Heatmap clics</p>
                <div className="flex gap-1 items-end h-10">
                  {[30,55,40,80,95,70,85,60,90,75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: h > 80
                          ? 'rgba(239,68,68,0.7)'
                          : h > 60
                          ? 'rgba(251,146,60,0.5)'
                          : 'rgba(91,71,245,0.35)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Zone CTA — haute densité</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 mt-auto">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
              >
                Voir les Insights →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILDER SECTION — laptop mockup + swatches flottants
═══════════════════════════════════════════════════════════════════════════ */
const SWATCHES = ['#d1d5db', '#ef4444', '#f97316', '#eab308', '#22c55e', '#a78bfa', '#5B47F5']

function BuilderSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Fini les pages qui font fuir tes clients.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Zéro dev, zéro designer. Tu colles ton lien AliExpress, tu choisis un template, tu personnalises en 2 clics. Ta page convertit — aujourd&apos;hui.
            </p>
            <Link href="/demo" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Créer des pages optimisées</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — Laptop mockup */}
          <div className="flex items-start justify-center relative pt-6 lg:pt-8">

            {/* Swatches flottants au dessus */}
            <div
              className="float-card absolute hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl z-20"
              style={{
                top: '-8px',
                right: '20px',
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {SWATCHES.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ background: color, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>

            {/* Écran laptop */}
            <div className="w-full max-w-lg">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: '#1a1b2e',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  aspectRatio: '16/10',
                  position: 'relative',
                  display: 'flex',
                }}
              >
                {/* Sidebar builder */}
                <div
                  className="flex flex-col gap-1.5 py-3 px-1.5 flex-shrink-0"
                  style={{ width: '52px', background: '#111120', borderRight: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {[
                    { Icon: FileText2, label: 'Pages' },
                    { Icon: Pencil2, label: 'Edit' },
                    { Icon: Image2, label: 'Images' },
                    { Icon: Lightning, label: 'Actions' },
                    { Icon: ChartBar, label: 'Stats' },
                    { Icon: Settings2, label: 'Settings' },
                  ].map(({ Icon, label }, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: idx === 0 ? 'rgba(91,71,245,0.35)' : 'transparent', opacity: idx === 0 ? 1 : 0.35 }}
                      title={label}
                    >
                      <Icon size={16} weight="bold" color={idx === 0 ? '#b5f23d' : '#ffffff'} />
                    </div>
                  ))}
                </div>

                {/* Canvas */}
                <div className="flex-1 flex flex-col">
                  {/* Topbar */}
                  <div
                    className="flex items-center justify-between px-3 py-2 flex-shrink-0"
                    style={{ background: '#16172a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-xs font-semibold">Leadmeter</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}
                      >
                        Excellent
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {['#ef4444','#f59e0b','#10b981'].map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Page preview — produit KONVERT */}
                  <div
                    className="flex-1 relative overflow-hidden"
                    style={{ background: '#ffffff' }}
                  >
                    {/* Hero bannière produit — image réelle headphone */}
                    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 90 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85"
                        alt="Casque Pro Studio X"
                        style={{ width: '100%', height: 90, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,10,78,0.88) 0%, rgba(91,71,245,0.55) 100%)' }} />
                      <div style={{ position: 'absolute', inset: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 99, backdropFilter: 'blur(4px)' }}>-42% CE WEEK-END</span>
                          <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(i=><svg key={i} width="8" height="8" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/></svg>)}</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 12, color: '#fff', lineHeight: 1.3, marginBottom: 2 }}>Casque Pro Studio X</div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Son cristallin · Réduction de bruit active</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>79€</span>
                            <span style={{ fontSize: 10, textDecoration: 'line-through', color: 'rgba(255,255,255,0.45)' }}>139€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* CTA et avis */}
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ height: 5, borderRadius: 3, background: '#f1f5f9', marginBottom: 4, width: '90%' }} />
                      <div style={{ height: 5, borderRadius: 3, background: '#f1f5f9', marginBottom: 10, width: '65%' }} />
                      <div style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                        Acheter maintenant →
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['✓ Retour 30j', '✓ Garanti 2 ans', '🚚 48h'].map(t => (
                          <span key={t} style={{ fontSize: 8, color: '#94a3b8', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Add Variant floating pill */}
                    <div
                      className="float-anim absolute bottom-5 right-4 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white shadow-2xl"
                      style={{
                        background: 'rgba(15,17,32,0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <span className="text-base">+</span> Add Variant
                    </div>
                  </div>
                </div>
              </div>

              {/* Socle laptop */}
              <div className="flex flex-col items-center">
                <div style={{ height: '14px', width: '70%', background: 'linear-gradient(to bottom,#252537,#1a1a2e)', borderRadius: '0 0 8px 8px' }} />
                <div style={{ height: '6px', width: '88%', background: '#0f0f1e', borderRadius: '0 0 10px 10px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS SECTION — dashboard mockup, image à gauche
═══════════════════════════════════════════════════════════════════════════ */
const ANALYTICS_BARS = [55, 72, 48, 88, 64, 95, 79]
const ANALYTICS_METRICS = [
  { label: 'Taux de conversion', value: '4.8%', delta: '+1.4pts', color: '#10b981' },
  { label: 'ROAS moyen',         value: 'x4.2',  delta: '+0.9',   color: '#7c6af7' },
  { label: 'Vues ce mois',       value: '28K',   delta: '+31%',   color: '#f59e0b' },
]

function AnalyticsShowcase() {
  return (
    <section style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left — dashboard mockup */}
          <div className="relative">
            <div
              className="reveal rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#ffffff', border: '1.5px solid #e8e2ff' }}
            >
              {/* Header — chrome sombre style navigateur */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: '#1a1b2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {['#ef4444','#f59e0b','#10b981'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs font-semibold">Analytics · Boutique Alpha</span>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(91,71,245,0.25)', color: '#a78bfa' }}
                >
                  Temps réel
                </span>
              </div>

              {/* Métriques — fond lavande clair */}
              <div className="grid grid-cols-3 gap-px" style={{ background: '#e8e2ff' }}>
                {ANALYTICS_METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col gap-1 px-5 py-5"
                    style={{ background: 'linear-gradient(135deg,#f8f6ff,#fdf9ff)' }}
                  >
                    <span className="text-gray-400 text-xs font-medium">{m.label}</span>
                    <span className="text-gray-900 font-black text-2xl">{m.value}</span>
                    <span
                      className="text-xs font-bold w-fit px-2 py-0.5 rounded-full"
                      style={{ background: `${m.color}18`, color: m.color }}
                    >
                      {m.delta}
                    </span>
                  </div>
                ))}
              </div>

              {/* Graphe barres — fond blanc */}
              <div className="px-5 pb-6 pt-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-xs font-semibold">Conversions — 7 derniers jours</span>
                  <span className="text-gray-300 text-xs">vs semaine préc.</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {ANALYTICS_BARS.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-lg"
                        style={{
                          height: `${h}%`,
                          background: i === ANALYTICS_BARS.length - 1
                            ? 'linear-gradient(to top,#5B47F5,#a78bfa)'
                            : 'rgba(91,71,245,0.15)',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => (
                    <span key={d} className="flex-1 text-center text-gray-300 text-xs">{d}</span>
                  ))}
                </div>
              </div>

              {/* Ligne heatmap — fond lavande très clair */}
              <div
                className="mx-5 mb-5 rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{ background: '#f5f3ff', border: '1px solid #e8e2ff' }}
              >
                <span className="text-gray-400 text-xs">Scroll depth moyen</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[100, 85, 70, 52, 38, 24].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-sm"
                        style={{
                          width: `${Math.max(w * 0.3, 6)}px`,
                          background: `rgba(91,71,245,${0.15 + i * 0.12})`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-bold text-sm">72%</span>
                </div>
              </div>
            </div>

            {/* Floating card CVR */}
            <div
              className="float-card absolute -bottom-4 -right-6 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(16,185,129,0.92)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <TrendUp className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-black text-lg leading-none">+5.2%</p>
                <p className="text-white/70 text-xs">CVR vs mois dernier</p>
              </div>
            </div>
          </div>

          {/* Right — texte */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Tu sais exactement où tu perds de l&apos;argent.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Scroll depth, CVR, ROAS par page — tout en temps réel. Tu vois où tes visiteurs décrochent, tu corriges en quelques secondes. Fini de dépenser en aveugle.
            </p>
            <Link href="/features" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Voir les analytics</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLISH SECTION — multi-plateforme, image à droite
═══════════════════════════════════════════════════════════════════════════ */
const PUBLISH_PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Shopify: (
    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: '#96BF48' }}>
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
    </svg>
  ),
  WooCommerce: (
    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: '#7F54B3' }}>
      <path d="M21.994 9.28a2.19 2.19 0 0 0-1.818-.98H2.805A2.19 2.19 0 0 0 .628 10.46l1.34 7.993a2.19 2.19 0 0 0 2.157 1.822h15.74a2.19 2.19 0 0 0 2.157-1.822l1.34-7.994a2.19 2.19 0 0 0-.368-1.178zM6.129 16.27c-.37 0-.7-.218-.855-.556l-1.312-2.842-.29 2.27a.938.938 0 0 1-.929.816.938.938 0 0 1-.937-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.95-4.223a.938.938 0 0 1 1.793.231l.572 4.478a.938.938 0 0 1-.928 1.066.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm7.5 0c-.37 0-.7-.218-.855-.556l-1.311-2.842-.291 2.27a.938.938 0 0 1-.928.816.938.938 0 0 1-.938-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.949-4.223a.938.938 0 0 1 1.793.231l.573 4.478a.929.929 0 0 1 .009.128.938.938 0 0 1-.938.938.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm6.57-.468a2.104 2.104 0 1 1 0-4.209 2.104 2.104 0 0 1 0 4.21z"/>
    </svg>
  ),
  'Export HTML': (
    <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,165,233,0.15)', borderRadius: 6 }}>
      <span style={{ color: '#5B47F5', fontWeight: 900, fontSize: 13, letterSpacing: '-0.5px', fontFamily: 'monospace' }}>&lt;/&gt;</span>
    </div>
  ),
}

const PUBLISH_PLATFORMS = [
  { name: 'Shopify',     color: '#96BF48', status: 'Publié',   time: 'Il y a 2 min' },
  { name: 'WooCommerce', color: '#7F54B3', status: 'En ligne',  time: 'Il y a 1h' },
  { name: 'Export HTML', color: '#0ea5e9', status: 'Prêt',      time: 'À télécharger' },
]

function PublishSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left — texte */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Ta page générée. Sur ta boutique. En 60 secondes.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Shopify, WooCommerce ou export HTML — un clic et c&apos;est en ligne. Pas de copier-coller, pas de développeur, pas d&apos;attente. Tu publies, tes clients achètent.
            </p>
            <Link href="/integrations" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Voir les intégrations</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — mockup publish */}
          <div className="flex items-center justify-center relative mt-6 lg:mt-0">
            <div
              className="reveal w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#ffffff', border: '1.5px solid #e8e2ff' }}
            >
              {/* Header — chrome sombre */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: '#1a1b2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {['#ef4444','#f59e0b','#10b981'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs font-semibold">Publier la page</span>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}
                >
                  1 clic
                </div>
              </div>

              {/* Aperçu page — mini page produit KONVERT */}
              <div className="mx-5 mt-5 rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e2ff' }}>
                {/* Bannière produit gradient violet */}
                <div
                  className="relative flex items-center justify-between px-4"
                  style={{ height: '90px', background: 'linear-gradient(135deg,#4c1d95 0%,#5B47F5 55%,#7c6af7 100%)' }}
                >
                  {/* Cercles déco */}
                  <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                  <div style={{ position: 'absolute', bottom: -10, left: 30, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                  {/* Contenu produit */}
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold text-white/60 mb-0.5">RUNNING PRO X</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-black text-base">€79.90</span>
                      <span className="text-white/40 text-xs line-through">€129</span>
                    </div>
                  </div>
                  {/* Bouton acheter */}
                  <div
                    className="relative z-10 px-3 py-1.5 rounded-lg text-[11px] font-black text-gray-900"
                    style={{ background: '#fff' }}
                  >
                    Acheter
                  </div>
                </div>
                {/* Barre URL */}
                <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#f8f6ff' }}>
                  <span className="text-gray-400 text-xs font-mono">konvert.app/p/running-pro</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Plateformes — fond clair */}
              <div className="px-5 py-5 flex flex-col gap-3">
                {PUBLISH_PLATFORMS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                    style={{ background: '#f8f6ff', border: '1px solid #ede8ff' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}28` }}
                    >
                      {PUBLISH_PLATFORM_ICONS[p.name]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-semibold">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.time}</div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                      {p.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton publish */}
              <div className="px-5 pb-5">
                <div
                  className="w-full py-3.5 rounded-2xl text-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 20px rgba(91,71,245,0.35)' }}
                >
                  Publier sur toutes les plateformes
                </div>
              </div>
            </div>

            {/* Floating success toast */}
            <div
              className="float-anim absolute -top-4 -left-6 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(15,17,30,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.2)' }}
              >
                <Check className="w-4 h-4" style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none mb-0.5">Publiée sur Shopify</p>
                <p className="text-white/40 text-xs">À l&apos;instant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATES PREVIEW
═══════════════════════════════════════════════════════════════════════════ */
const TEMPLATE_GRID = [
  { name: 'Blue',     gradient: 'linear-gradient(135deg,#0057FF,#3b82f6)', tag: 'Tech · Universal',    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Noir',     gradient: 'linear-gradient(135deg,#0D0D0D,#1f1f2e)', tag: 'Gaming · Premium',    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80' },
  { name: 'Rose',     gradient: 'linear-gradient(135deg,#D63370,#f472b6)', tag: 'Beauté · Skincare',   img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { name: 'Gold',     gradient: 'linear-gradient(135deg,#D4A853,#b8860b)', tag: 'Luxe · Haute Gamme',  img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&q=80' },
  { name: 'StreetZ',  gradient: 'linear-gradient(135deg,#E11D48,#f43f5e)', tag: 'Streetwear · Urban',  img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
  { name: 'GlowUp',   gradient: 'linear-gradient(135deg,#D4508B,#ec4899)', tag: 'Makeup · Glamour',    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80' },
  { name: 'Platina',  gradient: 'linear-gradient(135deg,#B8860B,#d4a853)', tag: 'Joaillerie · Raffiné',img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  { name: 'Starter',  gradient: 'linear-gradient(135deg,#4F46E5,#6366f1)', tag: 'Polyvalent · Clean',  img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
]

function TemplatesPreview() {
  return (
    <section id="templates" style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            Templates
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Chaque niche a son template.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            38+ designs calibrés pour convertir — Tech, Beauté, Luxe, Streetwear, Joaillerie, Maison et plus. Le bon design pour le bon produit, immédiatement.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {TEMPLATE_GRID.map((t, i) => (
            <div
              key={t.name}
              className="reveal group cursor-pointer rounded-2xl overflow-hidden card-hover-violet"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div
                className="h-36 flex items-end p-3 relative overflow-hidden"
                style={{ background: t.gradient }}
              >
                {t.img && (
                  <img
                    src={t.img}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                <span
                  className="relative z-10 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  {t.tag}
                </span>
              </div>
              <div className="p-3 bg-white border border-purple-50 border-t-0 rounded-b-2xl">
                <span className="text-gray-800 text-sm font-semibold">{t.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/templates"
            className="btn-shimmer btn-ripple inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 18px rgba(91,71,245,0.35)' }}
            onClick={addRipple}
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
  {
    name: 'Camille L.',
    role: 'Mode Femme · Shopify',
    avatar: 'C',
    color: '#ec4899',
    quote: 'En mode, l\'image c\'est tout. KONVERT m\'a permis de créer des pages produit qui respirent le luxe sans passer des heures sur Figma. Mes bounces ont chuté de 62%.',
    stars: 5,
    stat: '-62% bounce',
  },
]

function Testimonials() {
  return (
    <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,71,245,0.22) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 5% 100%, rgba(167,139,250,0.12) 0%, transparent 55%), #0e0d1e' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p className="text-white/75 leading-relaxed text-sm flex-1">&ldquo;{t.quote}&rdquo;</p>
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

        <div className="reveal text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#a78bfa' }}
          >
            Voir tous les avis <ArrowRight className="w-4 h-4" />
          </Link>
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
    monthly: 39,
    desc: 'Pour démarrer et tester',
    features: ['5 pages / mois', '42+ templates', 'Analytics basique', 'Export HTML'],
    cta: 'Démarrer',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthly: 79,
    desc: 'Pour scaler votre e-commerce',
    features: ['Pages illimitées', '38+ templates premium', 'Analytics avancé', 'A/B Testing', 'Publish Shopify & Woo', 'Support email prioritaire'],
    cta: 'Choisir Pro',
    highlighted: true,
  },
  {
    name: 'Agency',
    monthly: 199,
    desc: 'Pour les agences SMMA',
    features: ['Tout dans Pro', 'Multi-clients illimité', 'White-label (logo + couleurs)', 'Rapports clients', 'Accès API (bientôt)', 'Onboarding personnalisé'],
    cta: 'Contacter les ventes',
    highlighted: false,
  },
]

function PricingTeaser() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Lightning className="w-3.5 h-3.5" />
            Tarifs
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Moins cher qu&apos;un freelance. Disponible maintenant.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto mb-8">
            1 page gratuite, sans carte bancaire. Vois le résultat avant de payer.
          </p>
          <div className="reveal delay-3 inline-flex items-center gap-3 p-1 rounded-full" style={{ background: '#ede8ff' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: !annual ? '#ffffff' : 'transparent',
                color: !annual ? '#111827' : '#6b7280',
                boxShadow: !annual ? '0 1px 6px rgba(91,71,245,0.12)' : 'none',
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
                boxShadow: annual ? '0 1px 6px rgba(91,71,245,0.12)' : 'none',
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
                  border: plan.highlighted ? 'none' : '1.5px solid #ede8ff',
                  boxShadow: plan.highlighted ? '0 16px 48px rgba(91,71,245,0.35)' : '0 2px 12px rgba(91,71,245,0.05)',
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
    <section style={{ background: '#08091a', position: 'relative', overflow: 'hidden' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(91,71,245,0.25) 0%, transparent 70%)',
        }}
      />
      <div
        className="orb-anim absolute w-48 h-48 sm:w-96 sm:h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(91,71,245,0.2) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-28 text-center">
        <div
          className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
          style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
        >
          <Sparkle className="w-3.5 h-3.5" />
          1 page gratuite — sans compte
        </div>

        <h2
          className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5"
        >
          Colle un lien. Vois ta page en 30 secondes.
        </h2>

        <p
          className="reveal delay-2 text-lg text-white/60 mb-10 max-w-xl mx-auto"
        >
          AliExpress, Amazon, Alibaba — peu importe. L&apos;IA génère ta page de vente complète. Gratuit, sans carte bancaire.
        </p>

        <div
          className="reveal delay-3 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-5"
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://fr.aliexpress.com/item/ton-produit..."
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
            href={`/essai${urlInput ? `?url=${encodeURIComponent(urlInput)}` : ''}`}
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg flex-shrink-0"
          >
            Générer ma page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="reveal delay-4 text-white/35 text-sm">
          1 page gratuite · Aucune CB requise · Résiliation en 1 clic
        </p>
        <p className="mt-2 text-sm font-semibold" style={{ color: 'rgba(134,239,172,0.7)' }}>
          <Check size={14} weight="bold" className="inline mr-1" /> Satisfait ou remboursé 30 jours — Sans question
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
        <LogoMarquee />
        <TrustBar />
        <ProofSection />
        <StatsCounter />
        <FeaturesSection />
        <LeadEnrichmentDemo />
        <HowItWorks />
        <BeforeAfter />
        <AIBuilderDemoSection />
        <BuilderSection />
        <ABTestingSection />
        <AnalyticsShowcase />
        <IntegrationsSection />
        <DarkFeatureCards />
        <PublishSection />
        <TemplatesPreview />
        <Testimonials />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>
      <KonvertEasterEgg />
    </>
  )
}
