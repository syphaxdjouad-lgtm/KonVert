'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const SESSION_KEY = 'konvert-exit-intent-shown'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Desktop uniquement
    if (window.innerWidth < 768) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true)
        sessionStorage.setItem(SESSION_KEY, '1')
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  function close() {
    setVisible(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes exitFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .exit-intent-modal {
          animation: exitFadeIn 0.28s cubic-bezier(.16,1,.3,1) forwards;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      >
        {/* Modal */}
        <div
          className="exit-intent-modal relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Emoji */}
          <div className="text-4xl mb-4">✋</div>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                Attends ! Avant de partir...
              </h2>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                Lance ton essai gratuit de <strong>14 jours</strong> — sans carte bancaire.
                Des centaines de e-commerçants ont déjà boosté leur CVR avec Konvert.
              </p>

              {/* Trust */}
              <div
                className="rounded-xl p-4 mb-6 border"
                style={{ background: '#f5f3ff', borderColor: '#e0d9ff' }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: '#5B47F5' }}>
                  Ce que tu obtiens gratuitement :
                </p>
                <ul className="text-sm space-y-1" style={{ color: '#4a3fa0' }}>
                  <li>✓ 17 templates haute conversion</li>
                  <li>✓ Génération IA illimitée pendant 14 jours</li>
                  <li>✓ Aucune carte bancaire requise</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B47F5] focus:ring-2 focus:ring-[#5B47F5]/20 transition-all"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl font-bold text-white py-3.5 text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
                >
                  Démarrer mon essai gratuit →
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">
                Sans engagement · Annulation en 1 clic
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">C&apos;est parti !</h2>
              <p className="text-gray-500 text-sm">
                Check tes emails — ton accès arrive dans quelques secondes.
              </p>
              <button
                onClick={close}
                className="mt-6 text-sm font-medium underline underline-offset-2"
                style={{ color: '#5B47F5' }}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
