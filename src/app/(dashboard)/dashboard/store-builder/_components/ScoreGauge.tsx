import { bandColors, bandLabel } from '../_lib/format'
import type { AuditBand } from '../_lib/types'

// Store Builder — jauge circulaire 0-100 pour le score CRO (cf. spec KAKASHI
// §B.2). SVG pur, pas de dépendance de charting — accessible via role="img"
// + aria-label descriptif.

export function ScoreGauge({ score, band, size = 140 }: { score: number; band: AuditBand; size?: number }) {
  const colors = bandColors(band)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score CRO ${Math.round(clamped)} sur 100 — ${bandLabel(band)}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F0EDF8" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.fg}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color: '#111' }}>{Math.round(clamped)}</span>
        <span className="text-[11px] font-bold" style={{ color: '#9ca3af' }}>/ 100</span>
      </div>
    </div>
  )
}

export function BandBadge({ band }: { band: AuditBand }) {
  const colors = bandColors(band)
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.fg }} />
      {bandLabel(band)}
    </span>
  )
}
