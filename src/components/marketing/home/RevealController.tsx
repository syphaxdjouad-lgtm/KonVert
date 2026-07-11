'use client'

import { useEffect } from 'react'

/**
 * Wires the scroll-reveal IntersectionObserver for all `.reveal` elements
 * already present in the (server-rendered) DOM. Renders nothing — purely a
 * side-effect component so the home page can stay a Server Component while
 * keeping the exact same reveal-on-scroll behavior as before.
 */
export default function RevealController() {
  useEffect(() => {
    function observe() {
      const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)')
      if (!els.length) return
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach((el) => io.observe(el))
      return io
    }

    const io = observe()

    // Fallback : force visible après 1.5s pour les éléments jamais déclenchés
    const fallback = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible')
      })
    }, 1500)

    return () => {
      io?.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return null
}
