'use client'

import { useEffect, useRef } from 'react'
import { getConsent, onConsentChange } from '@/lib/consent'

declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
  }
}

export default function CrispChat() {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!websiteId) return

    function inject() {
      if (scriptRef.current) return
      window.$crisp = []
      window.CRISP_WEBSITE_ID = websiteId!
      const s = document.createElement('script')
      s.src = 'https://client.crisp.chat/l.js'
      s.async = true
      document.head.appendChild(s)
      scriptRef.current = s
    }

    if (getConsent() === 'accepted') inject()
    const off = onConsentChange((v) => { if (v === 'accepted') inject() })
    return () => {
      off()
      if (scriptRef.current) {
        scriptRef.current.remove()
        scriptRef.current = null
      }
    }
  }, [])

  return null
}
