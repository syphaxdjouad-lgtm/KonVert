'use client'

import { useEffect } from 'react'

const GLOBAL_CSS = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }
  @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
  .btn-shimmer { background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%); background-size: 200% 100%; animation: shimmer 2.4s linear infinite; }
  .btn-shimmer:hover { animation-play-state: paused; }
  @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`

/**
 * Injects the reveal-on-scroll CSS + wires an IntersectionObserver that adds
 * `.visible` to any `.reveal` element already present in the (server-rendered) DOM.
 * Renders nothing — purely a side-effect component so the surrounding page
 * can stay a Server Component while keeping the scroll-reveal animation.
 */
export default function RevealController() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    // Timeout de sécurité : si l'observer ne fire pas après 800ms,
    // on révèle tout (page déjà scrollée ou problème de viewport)
    const safetyTimeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
    }, 800)
    return () => { obs.disconnect(); clearTimeout(safetyTimeout) }
  }, [])

  return null
}
