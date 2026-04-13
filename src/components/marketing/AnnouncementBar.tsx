'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'konvert-announcement-dismissed'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="relative z-50 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white"
      style={{ background: '#5B47F5' }}
    >
      <p className="text-center leading-snug">
        🎉 14 jours d&apos;essai gratuit — Sans carte bancaire&nbsp;&nbsp;·&nbsp;&nbsp;
        <Link href="/signup" className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold">
          Lancer maintenant →
        </Link>
      </p>
      <button
        onClick={dismiss}
        aria-label="Fermer l'annonce"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
