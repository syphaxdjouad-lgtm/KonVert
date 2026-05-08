'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, CheckCircle } from 'lucide-react'

const SESSION_KEY = 'konvert-exit-intent-shown'
const EXCLUDED_PATHS = ['/essai', '/signup', '/login']

export default function ExitIntentPopup() {
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Desktop uniquement, exclut funnel & dashboard
    if (window.innerWidth < 768) return
    if (sessionStorage.getItem(SESSION_KEY)) return
    if (EXCLUDED_PATHS.includes(pathname) || pathname?.startsWith('/dashboard')) return

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true)
        sessionStorage.setItem(SESSION_KEY, '1')
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [pathname])

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

          {/* Hero — logo KONVERT sur gradient */}
          <div
            className="relative w-full rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
            style={{
              height: '160px',
              background: 'linear-gradient(135deg, #4c3ce0 0%, #5B47F5 45%, #7c6af7 100%)',
            }}
          >
            {/* blobs décoratifs */}
            <div
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-40"
              style={{ background: 'radial-gradient(circle, #b5f23d 0%, transparent 70%)', filter: 'blur(28px)' }}
            />
            <div
              className="absolute -bottom-12 -right-8 w-44 h-44 rounded-full opacity-50"
              style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', filter: 'blur(32px)' }}
            />
            {/* grille subtile */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Logo + wordmark */}
            <div className="relative flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 52 52" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))' }}>
                <rect width="52" height="52" rx="14" fill="#7c3aed" />
                <rect x="14" y="12" width="6" height="28" rx="2" fill="white" />
                <path d="M20 26 L35 13" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M20 26 L33 39" stroke="#b5f23d" strokeWidth="5.5" strokeLinecap="round" />
                <polygon points="33,39 24,37 31,30" fill="#b5f23d" />
              </svg>
              <span
                className="font-black text-white text-3xl tracking-tight leading-none"
                style={{ letterSpacing: '-0.03em', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span style={{ color: '#b5f23d' }}>K</span>ONVERT
              </span>
            </div>

            {/* badge gratuit */}
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: '#b5f23d', color: '#1a1a2e' }}
            >
              Gratuit
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
