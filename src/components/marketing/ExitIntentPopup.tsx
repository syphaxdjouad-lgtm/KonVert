'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, CheckCircle } from 'lucide-react'

const SESSION_KEY = 'konvert-exit-intent-shown'

export default function ExitIntentPopup() {
  const router = useRouter()
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
    // Redirige vers /essai après un court délai pour montrer la confirmation
    setTimeout(() => {
      router.push(`/essai?email=${encodeURIComponent(email)}`)
    }, 1200)
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

          {/* Hero image — mockup landing page */}
          <div className="w-full rounded-xl overflow-hidden mb-5" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', padding: '20px 24px 0' }}>
            <div className="rounded-t-lg overflow-hidden shadow-lg" style={{ background: '#fff' }}>
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: '#f3f3f6' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#28c840' }} />
                <div className="flex-1 mx-2 h-4 rounded-md" style={{ background: '#e4e4e9' }} />
              </div>
              {/* Page content mockup */}
              <div className="px-4 py-3 space-y-2">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e0d9ff, #c4b5fd)' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded-full w-3/4" style={{ background: '#1a1a2e' }} />
                    <div className="h-2 rounded-full w-full" style={{ background: '#e4e4e9' }} />
                    <div className="h-2 rounded-full w-2/3" style={{ background: '#e4e4e9' }} />
                  </div>
                </div>
                <div className="h-7 rounded-lg w-full" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }} />
              </div>
            </div>
          </div>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                Attends ! Avant de partir...
              </h2>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                Génère ta première page produit <strong>gratuitement</strong> — sans carte bancaire.
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
                  <li>✓ 42 templates haute conversion</li>
                  <li>✓ 1 page produit générée par l'IA — résultat immédiat</li>
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
                  Générer ma page gratuite →
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">
                Sans engagement · Annulation en 1 clic
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(91,71,245,0.12)' }}>
                <CheckCircle className="w-7 h-7 text-[#5B47F5]" />
              </div>
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
