'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CONSENT_KEY, setConsent } from '@/lib/consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) setVisible(true)
  }, [])

  function handleChoice(accepted: boolean) {
    setConsent(accepted ? 'accepted' : 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pb-4 md:pb-6"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      role="dialog"
      aria-label="Consentement cookies"
    >
      <div
        className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-sm"
        style={{ boxShadow: '0 -2px 20px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}
      >
        <p className="text-sm text-gray-600 flex-1 leading-relaxed">
          On utilise des cookies pour améliorer ton expérience.{' '}
          <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">
            En savoir plus
          </Link>
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Touch targets ≥ 44px sur mobile (WCAG 2.1 AA + Apple HIG).
              min-h-[44px] obligatoire car px-4 py-2 + text-sm = ~36px en hauteur. */}
          <button
            onClick={() => handleChoice(false)}
            className="px-4 min-h-[44px] text-sm font-semibold text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B47F5]"
            aria-label="Refuser les cookies"
          >
            Refuser
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="px-5 min-h-[44px] text-sm font-bold text-white rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ background: '#5B47F5' }}
            aria-label="Accepter les cookies"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#4a38e0' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#5B47F5' }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
