'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot    = dotRef.current
    if (!cursor || !dot) return

    // Masquer jusqu'au premier mouvement
    let visible = false

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        cursor.style.opacity = '1'
        dot.style.opacity    = '1'
        visible = true
      }
      cursor.style.left = `${e.clientX}px`
      cursor.style.top  = `${e.clientY}px`
      dot.style.left    = `${e.clientX}px`
      dot.style.top     = `${e.clientY}px`
    }

    const onDown = () => dot.classList.add('pressed')
    const onUp   = () => dot.classList.remove('pressed')

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={dotRef}    className="custom-cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  )
}
