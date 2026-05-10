'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsent, onConsentChange } from '@/lib/consent'

// TikTok Pixel — gated par consent RGPD. No-op si NEXT_PUBLIC_TIKTOK_PIXEL_ID
// absent. Le snippet officiel TikTok charge le SDK + envoie le PageView initial.

export default function TikTokPixel() {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!pixelId) return
    setEnabled(getConsent() === 'accepted')
    return onConsentChange((v) => setEnabled(v === 'accepted'))
  }, [pixelId])

  if (!pixelId || !enabled) return null

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
            ttq.load('${pixelId}');
            ttq.page();
          }(window, document, 'ttq');
        `,
      }}
    />
  )
}
