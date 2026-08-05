'use client'

import { useState } from 'react'

// Bouton "play" déclenchant la modal démo — seul fragment interactif de la
// section "Comment ça marche" (le reste : header + steps, reste statique
// côté Server Component parent).
export default function VideoDemoTrigger() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
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
            <div
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-8"
              style={{ background: 'linear-gradient(135deg,#0a0a1a,#1a1233)' }}
            >
              <div className="text-white/90 text-xl sm:text-2xl font-bold mb-3">
                Démo vidéo bientôt disponible
              </div>
              <p className="text-white/60 text-sm sm:text-base max-w-md mb-6">
                En attendant, teste KONVERT sur ton vrai produit en 30 secondes.
              </p>
              <a
                href="/essai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
              >
                Génère ta première page (30s, sans compte)
              </a>
            </div>
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
