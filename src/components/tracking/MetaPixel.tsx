'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsent, onConsentChange } from '@/lib/consent'

// Meta Pixel — gated par consent RGPD. No-op si NEXT_PUBLIC_META_PIXEL_ID
// absent. Le snippet officiel Meta charge `fbevents.js` puis envoie le
// PageView initial. Pas de <noscript> beacon : la version `noscript=1` du
// pixel ne peut PAS être gatée par consent (HTML pur) et viole l'ePrivacy
// Directive Art. 5(3) — on l'omet volontairement.

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!pixelId) return
    // Sync initial entre localStorage (consent persisté) et state React au mount.
    // Pattern identique à TikTokPixel/GoogleTag. Le setState immédiat est ici
    // intentionnel : on lit une source externe (localStorage) qui n'est pas
    // accessible côté serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(getConsent() === 'accepted')
    return onConsentChange((v) => setEnabled(v === 'accepted'))
  }, [pixelId])

  if (!pixelId || !enabled) return null

  return (
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
  )
}
