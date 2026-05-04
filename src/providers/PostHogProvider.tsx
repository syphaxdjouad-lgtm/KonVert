'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { getConsent, onConsentChange } from '@/lib/consent'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initedRef = useRef(false)

  useEffect(() => {
    function initIfAccepted() {
      if (initedRef.current) return
      if (getConsent() !== 'accepted') return
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
      if (!key) return
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      })
      initedRef.current = true
    }

    initIfAccepted()
    const off = onConsentChange((v) => {
      if (v === 'accepted') initIfAccepted()
      else if (v === 'refused' && initedRef.current) {
        try { posthog.opt_out_capturing() } catch {}
      }
    })
    return off
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
