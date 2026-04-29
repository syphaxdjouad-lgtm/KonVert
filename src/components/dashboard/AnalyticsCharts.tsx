'use client'

import { useMemo, useState } from 'react'
import { Eye, MousePointerClick } from 'lucide-react'

export interface DailyPoint {
  date: string  // ISO YYYY-MM-DD
  views: number
  clicks: number
}

type Range = 7 | 30

const FORMATTER = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' })

export default function AnalyticsCharts({ daily }: { daily: DailyPoint[] }) {
  const [range, setRange] = useState<Range>(7)

  const points = useMemo(() => daily.slice(-range), [daily, range])

  const totalViews  = points.reduce((s, d) => s + d.views, 0)
  const totalClicks = points.reduce((s, d) => s + d.clicks, 0)
  const ctrAvg = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

  return (
    <div
      className="rounded-2xl p-6 mb-8"
      style={{ background: '#fff', border: '1px solid #e5e7eb' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-base" style={{ color: '#111' }}>Évolution</h2>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            Vues et clics jour par jour
          </p>
        </div>

        {/* Toggle 7j / 30j */}
        <div className="flex rounded-xl p-1 gap-1" style={{ background: '#f3f4f6' }}>
          {([7, 30] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: range === r ? '#fff' : 'transparent',
                color: range === r ? '#7c3aed' : '#6b7280',
                boxShadow: range === r ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {r}j
            </button>
          ))}
        </div>
      </div>

      {/* Légende compacte */}
      <div className="flex items-center gap-5 mb-4">
        <LegendItem
          icon={<Eye className="w-3.5 h-3.5" />}
          label="Vues"
          value={totalViews}
          color="#2563eb"
        />
        <LegendItem
          icon={<MousePointerClick className="w-3.5 h-3.5" />}
          label="Clics"
          value={totalClicks}
          color="#7c3aed"
        />
        <div className="ml-auto text-xs" style={{ color: '#9ca3af' }}>
          CTR moyen <span className="font-bold" style={{ color: '#374151' }}>{ctrAvg}%</span>
        </div>
      </div>

      {/* Chart SVG */}
      <Chart points={points} />
    </div>
  )
}

function LegendItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${color}14`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-base font-black leading-tight" style={{ color: '#111' }}>{value.toLocaleString()}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>{label}</div>
      </div>
    </div>
  )
}

function Chart({ points }: { points: DailyPoint[] }) {
  // Dimensions du viewBox — on garde un aspect responsive via preserveAspectRatio.
  const W = 720
  const H = 220
  const PAD_X = 32
  const PAD_TOP = 16
  const PAD_BOT = 32

  const max = Math.max(1, ...points.flatMap(p => [p.views, p.clicks]))
  // Échelle Y arrondie à un palier sympa (10, 50, 100, 500, 1000…)
  const niceMax = niceCeil(max)

  const innerW = W - PAD_X * 2
  const innerH = H - PAD_TOP - PAD_BOT
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0

  const xAt = (i: number) => PAD_X + stepX * i
  const yAt = (v: number) => PAD_TOP + innerH * (1 - v / niceMax)

  function pathFor(key: 'views' | 'clicks') {
    if (points.length === 0) return ''
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(p[key]).toFixed(1)}`)
      .join(' ')
  }

  function areaFor(key: 'views' | 'clicks') {
    if (points.length === 0) return ''
    const top = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(p[key]).toFixed(1)}`)
      .join(' ')
    const lastX = xAt(points.length - 1).toFixed(1)
    const baseY = (PAD_TOP + innerH).toFixed(1)
    return `${top} L ${lastX} ${baseY} L ${PAD_X.toFixed(1)} ${baseY} Z`
  }

  // Lignes de grille (4 paliers) + labels Y
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(niceMax * t))

  // Labels X — montrer début, milieu, fin pour 7j, plus pour 30j
  const showEvery = points.length <= 7 ? 1 : Math.ceil(points.length / 6)

  if (points.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-xl text-sm"
        style={{ background: '#f9fafb', color: '#9ca3af' }}
      >
        Aucune donnée sur cette période.
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Graphique vues et clics par jour"
      >
        <defs>
          <linearGradient id="kv-views-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="kv-clicks-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grille horizontale + labels Y */}
        {yTicks.map((t, i) => {
          const y = yAt(t)
          return (
            <g key={i}>
              <line
                x1={PAD_X} x2={W - PAD_X}
                y1={y} y2={y}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={PAD_X - 8}
                y={y + 3}
                fontSize="10"
                textAnchor="end"
                fill="#9ca3af"
                fontFamily="system-ui, sans-serif"
              >
                {compactNumber(t)}
              </text>
            </g>
          )
        })}

        {/* Aires */}
        <path d={areaFor('views')}  fill="url(#kv-views-area)" />
        <path d={areaFor('clicks')} fill="url(#kv-clicks-area)" />

        {/* Lignes */}
        <path
          d={pathFor('views')}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={pathFor('clicks')}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={xAt(i)} cy={yAt(p.views)}  r={3} fill="#fff" stroke="#2563eb" strokeWidth={1.8}>
              <title>{`${formatDate(p.date)} — ${p.views} vues`}</title>
            </circle>
            <circle cx={xAt(i)} cy={yAt(p.clicks)} r={3} fill="#fff" stroke="#7c3aed" strokeWidth={1.8}>
              <title>{`${formatDate(p.date)} — ${p.clicks} clics`}</title>
            </circle>
          </g>
        ))}

        {/* Labels X */}
        {points.map((p, i) => {
          if (i % showEvery !== 0 && i !== points.length - 1) return null
          return (
            <text
              key={p.date}
              x={xAt(i)}
              y={H - 10}
              fontSize="10"
              textAnchor="middle"
              fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
            >
              {formatDate(p.date)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function niceCeil(n: number): number {
  if (n <= 5) return 5
  if (n <= 10) return 10
  const exp = Math.pow(10, Math.floor(Math.log10(n)))
  const f = n / exp
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * exp
}

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return FORMATTER.format(new Date(y, m - 1, d))
}
