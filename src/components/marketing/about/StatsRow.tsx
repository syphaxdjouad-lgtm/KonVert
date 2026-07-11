'use client'

import { useEffect, useRef, useState } from 'react'

type StatDatum = { raw: number; display: string; label: string; prefix?: string; suffix?: string }

const STATS_DATA: StatDatum[] = [
  { raw: 50000, display: '50 000+', label: 'pages générées', suffix: '+' },
  { raw: 2800, display: '2 800+', label: 'boutiques connectées', suffix: '+' },
  { raw: 40, display: '+40%', label: 'de conversion en moyenne', prefix: '+', suffix: '%' },
  { raw: 8, display: '8', label: 'langues supportées', suffix: '' },
]

// Animated counter hook
function useCounter(target: number, started: boolean, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return count
}

function StatCard({ raw, display, label, prefix, suffix }: StatDatum) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCounter(raw, started)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const formatNum = (n: number) => {
    if (raw >= 1000) return n.toLocaleString('fr-FR')
    return n.toString()
  }

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-black text-[#5B47F5] mb-1" style={{ animation: started ? 'count-up .4s ease forwards' : 'none' }}>
        {started ? `${prefix ?? ''}${formatNum(count)}${suffix ?? ''}` : display}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

export default function StatsRow() {
  return (
    <>
      {STATS_DATA.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </>
  )
}
