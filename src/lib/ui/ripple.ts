import type { MouseEvent } from 'react'

// Ripple click effect (button/link press feedback) — DOM-only helper.
// Must only ever run inside a browser event handler (Client Component),
// never during render, so it's safe to import from any 'use client' module.
export function addRipple(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  Object.assign(wave.style, { width: `${size}px`, height: `${size}px`, left: `${x}px`, top: `${y}px` })
  el.appendChild(wave)
  setTimeout(() => wave.remove(), 600)
}
