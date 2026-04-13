'use client'

import { useEffect, useState } from 'react'

const TARGET = 'KONVERT'

export default function KonvertEasterEgg() {
  const [buffer, setBuffer] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const next = (buffer + e.key.toUpperCase()).slice(-TARGET.length)
      setBuffer(next)
      if (next === TARGET) {
        setShow(true)
        setBuffer('')
        setTimeout(() => setShow(false), 6000)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [buffer])

  if (!show) return null

  return (
    <>
      <style>{`
        @keyframes easterFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes confettiDrop {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120px) rotate(720deg); opacity: 0; }
        }
        .easter-toast {
          animation: easterFadeIn 0.4s cubic-bezier(.16,1,.3,1) forwards;
        }
        .confetti-piece {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          pointer-events: none;
          animation: confettiDrop 1.2s ease-in forwards;
        }
      `}</style>

      {/* Confetti */}
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 30}%`,
            background: ['#5B47F5', '#f59e0b', '#10b981', '#ef4444', '#8b77ff', '#fbbf24'][i % 6],
            animationDelay: `${Math.random() * 0.6}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
          }}
        />
      ))}

      {/* Toast */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] easter-toast">
        <div
          className="rounded-2xl shadow-2xl px-6 py-4 flex items-start gap-3 max-w-sm w-full"
          style={{ background: '#1a1a2e', border: '1px solid #5B47F5' }}
        >
          <span className="text-2xl mt-0.5">👀</span>
          <div>
            <p className="font-black text-white text-sm mb-1">
              Tu es curieux, j&apos;aime ça !
            </p>
            <p className="text-xs" style={{ color: '#a0a0c0' }}>
              Code promo :{' '}
              <span className="font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: '#5B47F5', color: '#fff' }}>
                KONVERT20
              </span>
              {' '}— 20% sur le premier mois 🎉
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
