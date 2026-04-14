'use client'

import { useState, useRef, useCallback } from 'react'

export default function BeforeAfter() {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct  = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) move(e.clientX)
  }, [dragging, move])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    move(e.touches[0].clientX)
  }, [move])

  return (
    <section style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">

        {/* Titre */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
               style={{ background: 'rgba(91,71,245,0.1)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.2)' }}>
            Transformation visuelle
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Avant vs Après KONVERT
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Glisse le curseur pour voir la différence entre une page basique et une page générée par KONVERT.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          className="relative mx-auto rounded-3xl overflow-hidden select-none cursor-col-resize shadow-2xl"
          style={{ maxWidth: 900, aspectRatio: '16/9', border: '1px solid #e4daff' }}
          onMouseMove={onMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDragging(false)}
        >
          {/* ── AFTER (droite — page KONVERT) ────────────────────────── */}
          <div className="absolute inset-0 flex"
               style={{ background: 'linear-gradient(135deg, #3b2fa8 0%, #5B47F5 50%, #7c6af7 100%)' }}>
            {/* Contenu page KONVERT */}
            <div className="absolute inset-0 flex flex-col p-6 sm:p-10">
              {/* Badge */}
              <span className="inline-block self-start text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-5"
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                OFFRE -40% — Aujourd&apos;hui seulement
              </span>
              <h3 className="text-white font-black text-base sm:text-2xl leading-tight mb-2 sm:mb-3 max-w-xs">
                Écouteurs Pro 5.0<br />Son Studio HD
              </h3>
              <div className="flex items-center gap-3 mb-3 sm:mb-5">
                <span className="text-white font-black text-xl sm:text-3xl">29,90€</span>
                <span className="line-through text-white/50 text-sm sm:text-lg">49,90€</span>
              </div>
              <div className="space-y-1.5 mb-4 sm:mb-6">
                {['40h d\'autonomie totale', 'Réduction bruit -35dB', 'Waterproof IPX5'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-[11px] sm:text-sm text-white/80">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                          style={{ background: 'rgba(255,255,255,0.2)' }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
              <button className="self-start px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-black text-[11px] sm:text-sm shadow-xl"
                      style={{ background: '#fff', color: '#5B47F5' }}>
                🛒 Commander maintenant →
              </button>
              {/* Label KONVERT */}
              <div className="absolute bottom-4 right-4 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                KONVERT
              </div>
            </div>
          </div>

          {/* ── BEFORE (gauche — page basique) ───────────────────────── */}
          <div
            className="absolute inset-0 flex"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, background: '#f5f5f5' }}
          >
            <div className="absolute inset-0 flex flex-col p-6 sm:p-10">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-xl mb-3 sm:mb-4"
                   style={{ background: '#ddd' }} />
              <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2 max-w-[180px]">
                Écouteurs bluetooth 5.0 qualité supérieure
              </p>
              <p className="text-gray-500 text-sm sm:text-base font-bold mb-3">29.90 EUR</p>
              <p className="text-gray-400 text-[10px] sm:text-xs mb-3 sm:mb-5 max-w-[200px] leading-relaxed">
                Produit de qualité. Livraison 7-14 jours. Retours acceptés.
              </p>
              <button className="self-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-md text-white text-[11px] sm:text-sm font-medium"
                      style={{ background: '#888' }}>
                Add to cart
              </button>
              {/* Label AVANT */}
              <div className="absolute bottom-4 left-4 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg"
                   style={{ background: '#e5e7eb', color: '#6b7280' }}>
                Page basique
              </div>
            </div>
          </div>

          {/* ── Séparateur drag ───────────────────────────────────────── */}
          <div
            className="absolute top-0 bottom-0 w-1 z-10"
            style={{ left: `${position}%`, transform: 'translateX(-50%)', background: '#fff' }}
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
          >
            {/* Handle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: '#fff', border: '2px solid #5B47F5' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: '#5B47F5' }}>
                <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels flottants */}
          <div className="absolute top-4 left-4 z-20 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md pointer-events-none"
               style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
            Avant
          </div>
          <div className="absolute top-4 right-4 z-20 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md pointer-events-none"
               style={{ background: 'rgba(91,71,245,0.7)', color: '#fff' }}>
            Après
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-gray-400 mt-5">
          ← Glisse le curseur →
        </p>
      </div>
    </section>
  )
}
