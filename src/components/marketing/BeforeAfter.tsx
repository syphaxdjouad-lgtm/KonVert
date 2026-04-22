'use client'

import { useState, useRef, useCallback } from 'react'

/* ── Avant / Après — slider réaliste mobile-first ─────────────────────────── */

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 20 20" fill={filled ? '#f59e0b' : '#d1d5db'}>
    <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

/* ── BEFORE — fiche AliExpress réaliste ────────────────────────────────────── */
function BeforeSide() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Topbar AliExpress */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5" style={{ background: '#1a1a1a' }}>
        <div className="flex items-center gap-1">
          <span className="text-[10px] sm:text-xs font-black" style={{ color: '#ff4747' }}>Ali</span>
          <span className="text-[10px] sm:text-xs font-black text-white">Express</span>
        </div>
        <div className="flex-1 mx-2 px-2 py-1 rounded text-[8px] sm:text-[10px] text-gray-400" style={{ background: '#2a2a2a' }}>
          Xiaomi Earbuds Original
        </div>
        <div className="w-4 h-4 rounded bg-white/10" />
      </div>

      {/* Product image — style AliExpress */}
      <div className="relative bg-gray-100" style={{ minHeight: '35%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80"
          alt="Ecouteurs generiques sur fond gris"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.6) brightness(0.92)' }}
        />
        {/* Thumbnails AliExpress */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm border" style={{ background: '#e5e5e5', borderColor: i === 1 ? '#333' : '#ddd' }} />
          ))}
        </div>
      </div>

      {/* Product info */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-hidden">
        {/* Welcome deal banner */}
        <div className="flex items-center justify-between mb-2 px-2 py-1.5 rounded-sm" style={{ background: '#fff0f0', border: '1px solid #ffcccc' }}>
          <span className="text-[9px] sm:text-[11px] font-bold" style={{ color: '#ff4747' }}>Welcome deal</span>
          <span className="text-[7px] sm:text-[9px]" style={{ color: '#ff8c8c' }}>New shoppers</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[9px] sm:text-[10px] text-gray-400">US $</span>
          <span className="text-lg sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>2.40</span>
          <div className="flex flex-col ml-1">
            <span className="text-[8px] sm:text-[9px] font-semibold" style={{ color: '#ff4747' }}>Save US $3.50</span>
            <span className="text-[8px] sm:text-[9px] text-gray-400 line-through">US $5.90</span>
          </div>
        </div>
        <p className="text-[8px] sm:text-[9px] text-gray-400 mb-2">Price includes VAT ; Extra 4% off with coins</p>

        {/* Title — long ugly */}
        <h3 className="text-[10px] sm:text-xs text-gray-800 leading-relaxed mb-2 font-normal">
          Xiaomi Wireless Sports Bluetooth headphones TWS In-Ear with Mic Comfortable Stereo Sound Earbuds
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">{[1, 2, 3, 4].map((i) => <Star key={i} />)}<Star filled={false} /></div>
          <span className="text-[9px] sm:text-[10px] text-gray-500">4.0</span>
          <span className="text-[9px] sm:text-[10px] text-gray-400">24 Reviews</span>
          <span className="text-[9px] sm:text-[10px] text-gray-400">| 353 sold</span>
        </div>

        {/* Color selection */}
        <div className="mb-2 sm:mb-3" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 6 }}>
          <p className="text-[9px] sm:text-[10px] text-gray-700 font-semibold mb-1">Color: <span className="font-normal">white</span></p>
          <div className="flex gap-1.5">
            {['#1a1a1a', '#f5f5f5', '#87CEEB', '#FFB6C1'].map((c) => (
              <div key={c} className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm border border-gray-200" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="flex items-center gap-1 mb-2 text-[8px] sm:text-[9px] text-gray-400">
          <span>Shipping: Free</span>
          <span>|</span>
          <span>Est. delivery: 15-45 days</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 py-1.5 sm:py-2.5 rounded-sm text-[10px] sm:text-xs font-medium text-white" style={{ background: '#ff4747' }}>Buy Now</button>
          <button className="flex-1 py-1.5 sm:py-2.5 rounded-sm text-[10px] sm:text-xs font-medium border text-orange-500 bg-white" style={{ borderColor: '#ff8c00' }}>Add to Cart</button>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 flex items-center justify-center text-[6px] sm:text-[7px] text-gray-400">S</div>
          <span className="text-[8px] sm:text-[9px] text-gray-500">ShenZhen Digital Store</span>
          <span className="text-[7px] sm:text-[8px] text-gray-400">96.2% positive</span>
        </div>
      </div>
    </div>
  )
}

/* ── AFTER — landing page KONVERT ──────────────────────────────────────────── */
function AfterSide() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Navbar KONVERT */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5" style={{ background: '#08080f' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white" style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}>K</div>
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide">SoundPro</span>
        </div>
        <span className="text-[8px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-full font-bold text-white" style={{ background: '#5B47F5' }}>Commander</span>
      </div>

      {/* Promo bar */}
      <div className="text-center py-1 sm:py-1.5" style={{ background: 'linear-gradient(90deg,#5B47F5,#7c6af7)' }}>
        <span className="text-[8px] sm:text-[10px] text-white font-semibold">Livraison GRATUITE + Garantie 2 ans</span>
      </div>

      {/* Product image hero */}
      <div className="relative" style={{ minHeight: '32%', background: 'linear-gradient(160deg,#f0edff,#e8e3ff)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80"
          alt="Ecouteurs sans fil haut de gamme"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className="text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-white" style={{ background: '#ef4444' }}>-40%</span>
        </div>
        {/* Thumbnails */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-5 h-5 sm:w-7 sm:h-7 rounded-md border-2 overflow-hidden" style={{ borderColor: i === 1 ? '#5B47F5' : 'rgba(255,255,255,0.7)', background: i === 1 ? '#5B47F5' : 'rgba(255,255,255,0.8)' }} />
          ))}
        </div>
      </div>

      {/* Product info */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-hidden">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} />)}</div>
          <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">4.9 (2 847 avis)</span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-tight mb-1 sm:mb-1.5">
          SoundPro X5 — 40h de musique sans recharger
        </h3>
        <p className="text-[9px] sm:text-[10px] text-gray-400 mb-2 leading-relaxed">
          Le son studio dans votre poche. Reduction de bruit active -35dB, Bluetooth 5.3.
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
          <span className="text-base sm:text-xl font-black text-gray-900">29,90€</span>
          <span className="text-[10px] sm:text-sm text-gray-400 line-through">49,90€</span>
          <span className="text-[8px] sm:text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Economisez 20€</span>
        </div>

        {/* Benefits */}
        <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
          {[
            '40h d\'autonomie — 1 semaine sans charger',
            'Reduction de bruit active -35dB',
            'Waterproof IPX5 — sport & pluie',
            'Charge rapide — 10min = 3h',
          ].map((b) => (
            <div key={b} className="flex items-center gap-1.5">
              <CheckIcon />
              <span className="text-[9px] sm:text-[10px] text-gray-600">{b}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-2 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs text-white mt-auto"
          style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 16px rgba(91,71,245,0.35)' }}
        >
          Commander maintenant — Livraison gratuite
        </button>

        {/* Trust */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
          {['Paiement securise', 'Garanti 2 ans', 'Retour 30j'].map((b) => (
            <span key={b} className="flex items-center gap-0.5 text-[7px] sm:text-[9px] text-gray-400">
              <CheckIcon />{b}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function BeforeAfter() {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => { if (dragging) move(e.clientX) },
    [dragging, move],
  )
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => move(e.touches[0].clientX),
    [move],
  )

  return (
    <section style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-24">

        {/* Titre */}
        <div className="text-center mb-8 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.1)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.2)' }}
          >
            Transformation visuelle
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-3 sm:mb-4">
            Avant vs Apres KONVERT
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 max-w-xl mx-auto">
            Glisse le curseur pour voir la difference entre une fiche AliExpress et une landing page KONVERT.
          </p>
        </div>

        {/* Slider container — mobile-first aspect ratio */}
        <div
          ref={containerRef}
          className="relative mx-auto rounded-2xl sm:rounded-3xl overflow-hidden select-none cursor-col-resize"
          style={{
            maxWidth: 900,
            height: 'clamp(480px, 75vw, 600px)',
            border: '1px solid #e4daff',
            boxShadow: '0 25px 80px rgba(91,71,245,0.12), 0 8px 30px rgba(0,0,0,0.08)',
          }}
          onMouseMove={onMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDragging(false)}
        >
          {/* AFTER — full background */}
          <div className="absolute inset-0">
            <AfterSide />
          </div>

          {/* BEFORE — clipped */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <BeforeSide />
          </div>

          {/* Drag separator */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{ left: `${position}%`, transform: 'translateX(-50%)', width: 3, background: '#fff', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
              style={{ background: '#fff', border: '3px solid #5B47F5', boxShadow: '0 4px 20px rgba(91,71,245,0.3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#5B47F5' }}>
                <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md pointer-events-none"
               style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[9px] sm:text-xs font-bold text-white">Avant</span>
          </div>
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md pointer-events-none"
               style={{ background: 'rgba(91,71,245,0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[9px] sm:text-xs font-bold text-white">Apres KONVERT</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
          ← Glisse le curseur pour comparer →
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl mx-auto mt-6 sm:mt-12">
          {[
            { value: '+340%', label: 'Taux de conversion' },
            { value: '30 sec', label: 'Temps de creation' },
            { value: '+89%', label: 'Temps sur la page' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg sm:text-3xl font-black" style={{ color: '#5B47F5' }}>{s.value}</p>
              <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
