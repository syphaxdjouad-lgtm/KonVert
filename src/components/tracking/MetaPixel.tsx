'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { getConsent, onConsentChange } from '@/lib/consent'

// Meta Pixel — gated par consent RGPD identique au pattern PostHog/Crisp.
// No-op si NEXT_PUBLIC_META_PIXEL_ID absent (cas dev local et avant créa pixel).
//
// Le pixel se charge uniquement après acceptation. Le PageView initial est
// envoyé une fois le script prêt. Les events suivants se font via fbqEvent()
// dans @/lib/tracking/pixels.

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const initedRef = useRef(false)

  useEffect(() => {
    if (!pixelId) return

    function initIfAccepted() {
      if (initedRef.current) return
      if (getConsent() !== 'accepted') return
      // Le script <Script> ci-dessous est mounted uniquement quand consent OK
      // via le re-render. Mais on définit l'init "fbq" stub pour que les
      // events appelés AVANT le chargement du script ne crashent pas.
      initedRef.current = true
    }

    initIfAccepted()
    return onConsentChange((v) => {
      if (v === 'accepted') initIfAccepted()
    })
  }, [pixelId])

  if (!pixelId) return null
  // On laisse Next/Script gérer le timing. Strategy "afterInteractive" pour ne
  // pas bloquer le LCP. Le snippet officiel Meta inclut son propre PageView.
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
