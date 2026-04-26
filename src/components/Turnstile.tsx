'use client'

import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, opts: TurnstileOptions) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

interface TurnstileOptions {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact'
  appearance?: 'always' | 'execute' | 'interaction-only'
}

export interface TurnstileProps {
  onToken: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: TurnstileOptions['theme']
  size?: TurnstileOptions['size']
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('turnstile script failed')))
      return
    }
    const s = document.createElement('script')
    s.src = `${SCRIPT_SRC}?render=explicit`
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile script failed'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile widget.
 * Si NEXT_PUBLIC_TURNSTILE_SITE_KEY n'est pas configurée, on appelle directement
 * onToken('') pour ne pas bloquer le flow en dev local.
 */
export function Turnstile({ onToken, onError, onExpire, theme = 'dark', size = 'flexible' }: TurnstileProps) {
  const containerId = useId()
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) {
      // Dev sans clé : bypass — le serveur bypass aussi côté verifyTurnstile.
      onToken('')
      return
    }

    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return
        const el = document.getElementById(containerId)
        if (!el) return
        widgetIdRef.current = window.turnstile.render(el, {
          sitekey: siteKey,
          callback: (token: string) => onToken(token),
          'error-callback': () => onError?.(),
          'expired-callback': () => onExpire?.(),
          theme,
          size,
        })
      })
      .catch(() => onError?.())

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, siteKey])

  if (!siteKey) return null

  return <div id={containerId} className="cf-turnstile" />
}
