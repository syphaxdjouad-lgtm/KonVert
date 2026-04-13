'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'konvert-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [])

  function handleChoice(accepted: boolean) {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Consentement cookies"
    >
      <div
        className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-2xl bg-white"
        style={{ boxShadow: '0 -2px 20px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}
      >
        <p className="text-sm text-gray-600 flex-1 leading-relaxed">
          🍪 On utilise des cookies pour améliorer votre expérience.{' '}
          <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">
            En savoir plus
          </Link>
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleChoice(false)}
            className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors"
            style={{ background: '#5B47F5' }}
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
