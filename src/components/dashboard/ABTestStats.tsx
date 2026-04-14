'use client'

import type { ABVariantRow, ABTestStatus, ABVariantLetter } from '@/types'
import { Trophy } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────
   Calcule le taux (sécurisé division par zéro)
───────────────────────────────────────────────────────────────── */
function rate(num: number, den: number): number {
  return den > 0 ? (num / den) * 100 : 0
}

/* ─────────────────────────────────────────────────────────────────
   Confiance statistique simplifiée
   Règle : différence > 5pts ET variante dominante a > 100 vues
───────────────────────────────────────────────────────────────── */
function confidence(a: ABVariantRow, b: ABVariantRow): {
  level: 'none' | 'low' | 'significant'
  leader: ABVariantLetter | null
  diffPts: number
} {
  const ctrA = rate(a.clics, a.vues)
  const ctrB = rate(b.clics, b.vues)
  const diff = Math.abs(ctrA - ctrB)
  const leader: ABVariantLetter | null = diff < 0.5 ? null : ctrA > ctrB ? 'A' : 'B'
  const minVues = Math.min(a.vues, b.vues)

  if (minVues < 30) return { level: 'none', leader, diffPts: diff }
  if (diff >= 5 && minVues >= 100) return { level: 'significant', leader, diffPts: diff }
  return { level: 'low', leader, diffPts: diff }
}

/* ─────────────────────────────────────────────────────────────────
   PROPS
───────────────────────────────────────────────────────────────── */
interface Props {
  variants: ABVariantRow[]
  status: ABTestStatus
  winner: ABVariantLetter | null
  onDeclareWinner: (winner: ABVariantLetter) => void
  onStatusChange: (status: 'running' | 'paused') => void
  declaring: boolean
}

/* ─────────────────────────────────────────────────────────────────
   COMPOSANT
───────────────────────────────────────────────────────────────── */
export default function ABTestStats({
  variants,
  status,
  winner,
  onDeclareWinner,
  onStatusChange,
  declaring,
}: Props) {
  const va = variants.find(v => v.variant === 'A')
  const vb = variants.find(v => v.variant === 'B')

  if (!va || !vb) {
    return (
      <div className="text-sm text-gray-400 py-8 text-center">
        Les deux variantes ne sont pas encore disponibles.
      </div>
    )
  }

  const conf = confidence(va, vb)
  const ctrA = rate(va.clics, va.vues)
  const ctrB = rate(vb.clics, vb.vues)
  const cvrA = rate(va.conversions, va.vues)
  const cvrB = rate(vb.conversions, vb.vues)

  const isCompleted = status === 'completed'

  return (
    <div className="flex flex-col gap-6">

      {/* ── Confidence banner ───────────────────────────────────── */}
      {!isCompleted && (
        <ConfidenceBanner conf={conf} />
      )}

      {/* ── Tableau A vs B ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { v: va, letter: 'A' as ABVariantLetter, ctr: ctrA, cvr: cvrA },
          { v: vb, letter: 'B' as ABVariantLetter, ctr: ctrB, cvr: cvrB },
        ].map(({ v, letter, ctr, cvr }) => {
          const isWinner = winner === letter
          const isLeader = conf.leader === letter && !isCompleted
          const isPaused = status === 'paused'

          return (
            <div
              key={letter}
              className="rounded-2xl p-5 flex flex-col gap-4 relative"
              style={{
                background: isWinner ? 'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))' : '#fff',
                border: isWinner
                  ? '1.5px solid rgba(16,185,129,0.3)'
                  : isLeader
                  ? '1.5px solid rgba(124,58,237,0.3)'
                  : '1.5px solid #e5e7eb',
              }}
            >
              {/* Badge gagnant */}
              {isWinner && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#10b981' }}
                >
                  <Trophy className="inline w-3 h-3 mr-1" /> Gagnant
                </div>
              )}

              {/* Header variante */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
                    style={{
                      background: letter === 'A'
                        ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                        : 'linear-gradient(135deg,#1d4ed8,#2563eb)',
                    }}
                  >
                    {letter}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Variante {letter}</div>
                    <div className="text-[10px] text-gray-400">
                      {letter === 'A' ? 'Original' : 'Challanger'}
                    </div>
                  </div>
                </div>
                {isLeader && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}
                  >
                    En tête
                  </span>
                )}
              </div>

              {/* Métriques */}
              <div className="flex flex-col gap-3">
                <Metric label="Visiteurs uniques" value={v.vues.toLocaleString('fr-FR')} />
                <Metric
                  label="Taux de clic CTA"
                  value={`${ctr.toFixed(1)}%`}
                  bar={ctr}
                  barMax={Math.max(ctrA, ctrB, 1)}
                  color="#7c3aed"
                />
                <Metric
                  label="Taux de conversion"
                  value={`${cvr.toFixed(1)}%`}
                  bar={cvr}
                  barMax={Math.max(cvrA, cvrB, 1)}
                  color="#10b981"
                />
              </div>

              {/* Bouton déclarer gagnant */}
              {!isCompleted && !isPaused && (
                <button
                  onClick={() => onDeclareWinner(letter)}
                  disabled={declaring}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: letter === 'A'
                      ? 'rgba(124,58,237,0.08)'
                      : 'rgba(37,99,235,0.08)',
                    color: letter === 'A' ? '#7c3aed' : '#2563eb',
                    border: `1px solid ${letter === 'A' ? 'rgba(124,58,237,0.2)' : 'rgba(37,99,235,0.2)'}`,
                  }}
                >
                  {declaring ? '...' : <><Trophy className="inline w-3 h-3 mr-1" />Déclarer {letter} gagnant</>}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Barre de confiance ──────────────────────────────────── */}
      <ConfidenceBar va={va} vb={vb} ctrA={ctrA} ctrB={ctrB} />

      {/* ── Contrôles test ──────────────────────────────────────── */}
      {!isCompleted && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onStatusChange(status === 'running' ? 'paused' : 'running')}
            className="px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            {status === 'running' ? '⏸ Mettre en pause' : '▶ Reprendre'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Sous-composants ─────────────────────────────────────────── */

function Metric({
  label,
  value,
  bar,
  barMax,
  color,
}: {
  label: string
  value: string
  bar?: number
  barMax?: number
  color?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-gray-400 font-medium">{label}</span>
        <span className="text-sm font-black text-gray-900">{value}</span>
      </div>
      {bar !== undefined && barMax !== undefined && (
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(bar / barMax) * 100}%`, background: color }}
          />
        </div>
      )}
    </div>
  )
}

function ConfidenceBanner({
  conf,
}: {
  conf: ReturnType<typeof confidence>
}) {
  const configs = {
    none: {
      bg: 'rgba(107,114,128,0.06)',
      border: '#e5e7eb',
      color: '#6b7280',
      icon: '⏳',
      text: 'Pas encore assez de données (min. 30 vues par variante)',
    },
    low: {
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.2)',
      color: '#d97706',
      icon: '📊',
      text: `Tendance en faveur de la variante ${conf.leader ?? '—'} (+${conf.diffPts.toFixed(1)}pts CTR) — pas encore significatif`,
    },
    significant: {
      bg: 'rgba(16,185,129,0.06)',
      border: 'rgba(16,185,129,0.2)',
      color: '#059669',
      icon: '✅',
      text: `Résultat significatif — variante ${conf.leader} en tête de +${conf.diffPts.toFixed(1)}pts`,
    },
  }
  const cfg = configs[conf.level]
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <span className="text-base">{cfg.icon}</span>
      {cfg.text}
    </div>
  )
}

function ConfidenceBar({
  va, vb, ctrA, ctrB,
}: {
  va: ABVariantRow
  vb: ABVariantRow
  ctrA: number
  ctrB: number
}) {
  const total = va.vues + vb.vues
  const pctA  = total > 0 ? (va.vues / total) * 100 : 50

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Répartition du trafic</span>
        <span className="text-[11px] text-gray-400">{total.toLocaleString('fr-FR')} visiteurs totaux</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden flex">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pctA}%`, background: 'linear-gradient(90deg,#7c3aed,#6d28d9)' }}
        />
        <div
          className="h-full flex-1"
          style={{ background: 'linear-gradient(90deg,#2563eb,#1d4ed8)' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">A — {pctA.toFixed(0)}% · CTR {ctrA.toFixed(1)}%</span>
        <span className="text-[10px] text-gray-400">CTR {ctrB.toFixed(1)}% · {(100 - pctA).toFixed(0)}% — B</span>
      </div>
    </div>
  )
}
