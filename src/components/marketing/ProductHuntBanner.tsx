'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Gift, Sparkles } from 'lucide-react'

// Banner sticky qui s'affiche quand l'utilisateur arrive depuis ProductHunt :
// - via ?ref=ph ou ?utm_source=producthunt
// - via referrer producthunt.com
// - persisté en cookie pour ne pas re-afficher à chaque pageview
//
// Affiché en haut de page (au-dessus de la Navbar), avec un X pour fermer.
// Mounted dans le root layout.

const PH_COOKIE = '_konvert_ph_seen'
const PH_COOKIE_DAYS = 7

function isFromProductHunt(): boolean {
  if (typeof window === 'undefined') return false
  // 1. Query params explicites
  const params = new URLSearchParams(window.location.search)
  const refValues = ['ph', 'producthunt', 'product-hunt']
  if (refValues.includes(params.get('ref') ?? '')) return true
  if (refValues.includes(params.get('utm_source') ?? '')) return true
  // 2. Referrer
  const ref = document.referrer.toLowerCase()
  if (ref.includes('producthunt.com')) return true
  return false
}

function hasBeenDismissed(): boolean {
  if (typeof document === 'undefined') return true
  return document.cookie.includes(`${PH_COOKIE}=`)
}

function dismiss() {
  document.cookie = `${PH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * PH_COOKIE_DAYS}; SameSite=Lax`
}

export default function ProductHuntBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Petit délai pour laisser la page se rendre — évite de pousser le LCP
    // et un flash si l'user a déjà fermé. Pas d'impact tracking puisque le
    // pixel/PostHog ont déjà capturé la pageview avant qu'on s'affiche.
    const t = setTimeout(() => {
      if (isFromProductHunt() && !hasBeenDismissed()) setVisible(true)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  function handleClose() {
    dismiss()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] py-3 px-4"
      style={{ background: 'linear-gradient(135deg, #ff6154, #da552f)', boxShadow: '0 4px 20px rgba(218,85,47,0.25)' }}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              Bienvenue depuis ProductHunt — code <code className="font-black bg-white/20 px-2 py-0.5 rounded">LAUNCH50</code> activé
            </p>
            <p className="text-xs text-white/80 hidden sm:block">
              50 % de réduction sur ton premier mois, tous plans confondus.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/producthunt"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-white text-[#da552f] hover:bg-white/90 transition-colors min-h-[40px]"
            onClick={() => dismiss()}
          >
            <Gift className="w-3.5 h-3.5" />
            Voir l&apos;offre
          </Link>
          <Link
            href="/producthunt"
            className="sm:hidden inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-white text-[#da552f] min-h-[40px]"
            onClick={() => dismiss()}
            aria-label="Voir l'offre ProductHunt"
          >
            <Sparkles className="w-3 h-3" /> Voir
          </Link>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/15 transition-colors"
            aria-label="Fermer le bandeau ProductHunt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
