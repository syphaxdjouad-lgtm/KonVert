'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sparkle, ArrowRight, Check } from '@phosphor-icons/react'

export default function FinalCTA() {
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