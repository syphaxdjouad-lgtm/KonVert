'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsent, onConsentChange } from '@/lib/consent'

// Google Tag (gtag.js) — supporte Google Ads + GA4 via le même tag.
// NEXT_PUBLIC_GOOGLE_TAG_ID au format "AW-XXXXXXXX" (Ads), "G-XXXXXXX" (GA4)
// ou les deux séparés par virgule. Le composant les charge tous.

export default function GoogleTag() {
  const tagIds = (process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (tagIds.length === 0) return
    setEnabled(getConsent() === 'accepted')
    return onConsentChange((v) => setEnabled(v === 'accepted'))
  }, [tagIds.length])

  if (tagIds.length === 0 || !enabled) return null

  // Premier tag = celui chargé par le script `gtag.js`, les autres sont
  // initialisés via gtag('config', ...) dans le snippet inline.
  const primaryId = tagIds[0]
  const configCalls = tagIds.map((id) => `gtag('config', '${id}');`).join('\n')

  return (
    <>
      <Script
        id="google-tag-base"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <Script
        id="google-tag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${configCalls}
          `,
        }}
      />
    </>
  )
}
