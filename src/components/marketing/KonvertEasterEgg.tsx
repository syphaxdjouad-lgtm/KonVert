'use client'

import { useEffect, useState } from 'react'

const TARGET = 'KONVERT'
const CONFETTI_COLORS = ['#5B47F5', '#f59e0b', '#10b981', '#ef4444', '#8b77ff', '#fbbf24']

type ConfettiPiece = { left: number; top: number; color: string; delay: number; duration: number }

// Génère les positions/couleurs du confetti une seule fois par activation
// (dans le handler keydown, pas pendant le render). Avant ce fix, Math.random()
// était appelé directement dans le JSX : le confetti se re-randomisait à
// chaque frappe pendant que le toast était affiché (violation react-hooks/purity
// ET bug visuel — confetti qui saute au lieu de rester stable).
function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: 20 }, (_, i) => ({
    left: 10 + Math.random() * 80,
    top: 10 + Math.random() * 30,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.6,
    duration: 0.8 + Math.random() * 0.8,
  }))
}

export default function KonvertEasterEgg() {
  const [buffer, setBuffer] = useState('')
  const [show, setShow] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const next = (buffer + e.key.toUpperCase()).slice(-TARGET.length)
      setBuffer(next)
      if (next === TARGET) {
        setShow(true)
        setConfetti(generateConfetti())
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
      {confetti.map((c, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
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
