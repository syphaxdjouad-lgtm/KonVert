'use client'

import { useState, useRef, useCallback } from 'react'

/* ── Avant / Après — slider réaliste ──────────────────────────────────────── */

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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">

        {/* Titre */}
        <div className="text-center mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.1)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.2)' }}
          >
            Transformation visuelle
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Avant vs Apres KONVERT
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Glisse le curseur pour voir la difference entre une fiche AliExpress et une landing page KONVERT.
          </p>
        </div>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative mx-auto rounded-3xl overflow-hidden select-none cursor-col-resize"
          style={{ maxWidth: 960, aspectRatio: '16/10', border: '1px solid #e4daff', boxShadow: '0 25px 80px rgba(91,71,245,0.12), 0 8px 30px rgba(0,0,0,0.08)' }}
          onMouseMove={onMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDragging(false)}
        >

          {/* ── AFTER (full background — page KONVERT) ─────────────────── */}
          <div className="absolute inset-0" style={{ background: '#fff' }}>
            <div className="absolute inset-0 flex flex-col">

              {/* Topbar */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3" style={{ background: '#08080f' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>K</div>
                  <span className="text-white text-[10px] sm:text-xs font-bold tracking-wide">KONVERT</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="hidden sm:block text-[10px] text-white/40">Accueil</span>
                  <span className="hidden sm:block text-[10px] text-white/40">Produits</span>
                  <span className="text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full font-semibold text-white" style={{ background: '#5B47F5' }}>Commander</span>
                </div>
              </div>

              {/* Promo bar */}
              <div className="text-center py-1.5" style={{ background: 'linear-gradient(90deg, #5B47F5, #7c6af7)' }}>
                <span className="text-[9px] sm:text-[11px] text-white font-semibold">Livraison GRATUITE aujourd&apos;hui — Offre limitee</span>
              </div>

              {/* Hero section */}
              <div className="flex-1 flex flex-col sm:flex-row">
                {/* Product image */}
                <div className="sm:w-[48%] relative" style={{ background: 'linear-gradient(160deg, #f0edff, #e8e3ff)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80"
                    alt="Ecouteurs sans fil haut de gamme"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 40%' }}
                  />
                  {/* Badge promo */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="text-[9px] sm:text-[11px] font-black px-2.5 py-1 rounded-full text-white" style={{ background: '#ef4444' }}>-40%</span>
                  </div>
                  {/* Thumbnails */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border-2 overflow-hidden" style={{ borderColor: i === 1 ? '#5B47F5' : 'rgba(255,255,255,0.6)' }}>
                        <div className="w-full h-full" style={{ background: i === 1 ? '#5B47F5' : 'rgba(255,255,255,0.8)' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product info */}
                <div className="sm:w-[52%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-hidden">
                  {/* Stars */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 20 20" fill="#f59e0b"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z"/></svg>
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">4.9 (2 847 avis)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-lg lg:text-xl font-black text-gray-900 leading-tight mb-1.5 sm:mb-2">
                    SoundPro X5 — 40h de musique<br className="hidden sm:block" /> sans recharger
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3 leading-relaxed hidden sm:block">Le son studio dans votre poche. Reduction de bruit active, Bluetooth 5.3, etui de charge magnetique.</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2.5 sm:mb-4">
                    <span className="text-lg sm:text-2xl font-black text-gray-900">29,90€</span>
                    <span className="text-sm sm:text-base text-gray-400 line-through">49,90€</span>
                    <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Economisez 20€</span>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
                    {[
                      { icon: '🎵', text: '40h d\'autonomie — 1 semaine sans recharger' },
                      { icon: '🔇', text: 'Reduction de bruit active -35dB' },
                      { icon: '💧', text: 'Waterproof IPX5 — sport & pluie' },
                      { icon: '⚡', text: 'Charge rapide — 10min = 3h de musique' },
                    ].map((b) => (
                      <div key={b.text} className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-sm">{b.icon}</span>
                        <span className="text-[10px] sm:text-xs text-gray-600">{b.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full py-2 sm:py-3 rounded-xl font-black text-[11px] sm:text-sm text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 20px rgba(91,71,245,0.35)' }}
                  >
                    Commander maintenant — Livraison gratuite
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3">
                    {['Paiement securise', 'Satisfait ou rembourse', 'Support 24/7'].map(b => (
                      <span key={b} className="flex items-center gap-1 text-[8px] sm:text-[10px] text-gray-400">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BEFORE (clipped — fiche AliExpress) ────────────────────── */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, background: '#fff' }}
          >
            <div className="absolute inset-0 flex flex-col">

              {/* Topbar AliExpress-style */}
              <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5" style={{ background: '#f5f5f5', borderBottom: '1px solid #e5e5e5' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-orange-500 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white">Ali</div>
                  <span className="text-gray-500 text-[10px] sm:text-xs">Top produits tendance &gt; Electronique &gt; ...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                  <div className="w-4 h-4 rounded bg-gray-200" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">

                {/* Image placeholder aliexpress style */}
                <div className="sm:w-[48%] relative bg-white flex items-center justify-center" style={{ borderRight: '1px solid #eee' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80"
                    alt="Photo produit basique sans mise en scene"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.7) brightness(0.95)' }}
                  />
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl sm:text-5xl font-black rotate-[-20deg] opacity-[0.07]" style={{ color: '#000' }}>SAMPLE</span>
                  </div>
                </div>

                {/* Product info aliexpress style */}
                <div className="sm:w-[52%] p-3 sm:p-5 flex flex-col overflow-hidden" style={{ background: '#fff' }}>
                  {/* Price ugly */}
                  <div className="flex items-baseline gap-1.5 mb-1.5 sm:mb-2" style={{ background: '#fff4f0', margin: '0 -12px 8px -12px', padding: '6px 12px', marginTop: '-1px' }}>
                    <span className="text-[10px] sm:text-xs text-gray-400">US $</span>
                    <span className="text-base sm:text-xl font-bold" style={{ color: '#e53e3e' }}>14.99</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through ml-1">$24.99</span>
                    <span className="text-[9px] sm:text-[10px] text-orange-500 font-semibold ml-1">-40%</span>
                  </div>

                  {/* Title long & ugly */}
                  <h3 className="text-[10px] sm:text-xs text-gray-700 leading-relaxed mb-2 sm:mb-3 font-normal">
                    2024 New Bluetooth 5.0 Wireless Earbuds TWS Headset Stereo Noise Cancelling Waterproof IPX5 In-Ear Earphone With Mic For iPhone Samsung Xiaomi
                  </h3>

                  {/* Ratings small */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4].map(i => (
                        <svg key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 20 20" fill="#f59e0b"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z"/></svg>
                      ))}
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 20 20" fill="#d1d5db"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.34L10 13.27l-4.77 2.46.91-5.34L2.27 6.62l5.34-.78L10 1z"/></svg>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">4.1 | 238 sold</span>
                  </div>

                  {/* Specs ugly table */}
                  <div className="space-y-1 mb-2 sm:mb-3 text-[9px] sm:text-[10px]" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 6 }}>
                    <div className="flex"><span className="text-gray-400 w-20 sm:w-24 flex-shrink-0">Color:</span><span className="text-gray-600">Black / White / Blue</span></div>
                    <div className="flex"><span className="text-gray-400 w-20 sm:w-24 flex-shrink-0">Bluetooth:</span><span className="text-gray-600">V5.0</span></div>
                    <div className="flex"><span className="text-gray-400 w-20 sm:w-24 flex-shrink-0">Battery:</span><span className="text-gray-600">300mAh charging case</span></div>
                    <div className="flex"><span className="text-gray-400 w-20 sm:w-24 flex-shrink-0">Shipping:</span><span className="text-gray-600">Free · Est. 15-45 days</span></div>
                  </div>

                  {/* Ugly buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-medium text-white" style={{ background: '#e53e3e' }}>
                      Buy Now
                    </button>
                    <button className="flex-1 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-medium border border-orange-400 text-orange-500 bg-white">
                      Add to Cart
                    </button>
                  </div>

                  {/* Seller info */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-3 pt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[7px] text-gray-400">S</div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] text-gray-500">ShenZhen Digital Store</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-400 ml-2">96.2% positive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Separateur drag ─────────────────────────────────────────── */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{ left: `${position}%`, transform: 'translateX(-50%)', width: 3, background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.15)' }}
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
          >
            {/* Handle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: '#fff', border: '3px solid #5B47F5', boxShadow: '0 4px 20px rgba(91,71,245,0.3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#5B47F5' }}>
                <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg pointer-events-none"
               style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[10px] sm:text-xs font-bold text-white">Avant</span>
          </div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg pointer-events-none"
               style={{ background: 'rgba(91,71,245,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] sm:text-xs font-bold text-white">Apres KONVERT</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-400 mt-6">
          ← Glisse le curseur pour comparer →
        </p>

        {/* Stats underneath */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-8 sm:mt-12">
          {[
            { value: '+340%', label: 'Taux de conversion' },
            { value: '30 sec', label: 'Temps de creation' },
            { value: '+89%', label: 'Temps sur la page' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl sm:text-3xl font-black" style={{ color: '#5B47F5' }}>{s.value}</p>
              <p className="text-[11px] sm:text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
