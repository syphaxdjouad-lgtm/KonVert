'use client'

import { useState, useEffect, useRef } from 'react'

interface Stat {
  value: number
  prefix: string
  suffix: string
  label: string
  isFloat?: boolean
}

const STATS: Stat[] = [
  { value: 50000, prefix: '',  suffix: '+',  label: 'pages générées' },
  { value: 2.1,   prefix: '€', suffix: 'M',  label: 'générés par nos clients', isFloat: true },
  { value: 98,    prefix: '',  suffix: '%',  label: 'de satisfaction' },
  { value: 2800,  prefix: '',  suffix: '+',  label: 'e-commerçants actifs' },
  { value: 47,    prefix: '',  suffix: '',   label: 'pays' },
]

function fmt(n: number, stat: Stat): string {
  if (stat.isFloat) return `${stat.prefix}${n.toFixed(1)}${stat.suffix}`
  return `${stat.prefix}${n >= 1000 ? n.toLocaleString('fr-FR') : n}${stat.suffix}`
}

function CounterItem({ stat, triggered }: { stat: Stat; triggered: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return
    const duration = 1800
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const raw = eased * stat.value
      setCount(stat.isFloat ? parseFloat(raw.toFixed(2)) : Math.floor(raw))
      if (p < 1) requestAnimationFrame(step)
      else setCount(stat.value)
    }
    requestAnimationFrame(step)
  }, [triggered, stat.value, stat.isFloat])

  return (
    <div className="text-center px-2">
      <div
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums"
        style={{ letterSpacing: '-0.02em' }}
      >
        {triggered ? fmt(count, stat) : fmt(stat.value, stat)}
      </div>
      <div className="text-sm font-medium" style={{ color: '#c4b5fd' }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function StatsCounter() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ background: 'linear-gradient(135deg, #3730a3 0%, #5B47F5 50%, #7c3aed 100%)' }}
    >
      {/* Orbs décoratifs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '360px', height: '360px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '360px', height: '360px',
          background: 'rgba(167,139,250,0.18)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <p
          className="text-center text-xs font-bold uppercase tracking-widest mb-12"
          style={{ color: '#c4b5fd' }}
        >
          KONVERT en chiffres
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {STATS.map((stat) => (
            <CounterItem key={stat.label} stat={stat} triggered={triggered} />
          ))}
        </div>
      </div>
    </section>
  )
}
