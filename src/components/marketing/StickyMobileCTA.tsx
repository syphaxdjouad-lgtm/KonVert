'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StickyMobileCTA() {
  const pathname = usePathname()

  if (pathname === '/signup' || pathname?.startsWith('/dashboard')) return null

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="px-4 py-3">
        <Link
          href="/signup"
          className="flex items-center justify-center w-full rounded-xl font-bold text-white text-base py-3.5 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
        >
          Essayer gratuitement — 14 jours
        </Link>
      </div>
    </div>
  )
}
