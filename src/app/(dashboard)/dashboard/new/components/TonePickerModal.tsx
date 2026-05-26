'use client'

import { useState } from 'react'
import type { CopyTone } from '@/types/v3'

const TONES: Array<{ id: CopyTone; label: string; description: string; example: string }> = [
  {
    id: 'auto',
    label: 'Auto (recommandé)',
    description: "L'AI choisit selon ton produit",
    example: '—',
  },
  {
    id: 'friendly',
    label: 'Friendly & accessible',
    description: 'Tutoiement, exemples concrets, chaleureux',
    example: '"T\'as déjà ressenti ce moment où…"',
  },
  {
    id: 'premium',
    label: 'Premium & élégant',
    description: 'Vouvoiement, vocabulaire raffiné',
    example: '"Conçu pour celles qui savent…"',
  },
  {
    id: 'bold',
    label: 'Bold & punchy',
    description: 'Direct, court, claims forts',
    example: '"Tu veux du résultat. Voilà."',
  },
  {
    id: 'storytelling',
    label: 'Storytelling émotionnel',
    description: 'Narratif, voyage, sens',
    example: '"Tout commence un matin de juin…"',
  },
  {
    id: 'educational',
    label: 'Éducatif & expert',
    description: 'Pédagogique, jargon métier',
    example: '"Le rétinol fonctionne en stimulant…"',
  },
]

interface Props {
  currentTone: CopyTone
  onSelect: (t: CopyTone) => void
  onClose: () => void
}

export function TonePickerModal({ currentTone, onSelect, onClose }: Props) {
  const [picked, setPicked] = useState<CopyTone>(currentTone)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Choisis le ton de ta copy</h2>
            <p className="text-neutral-600 mt-1">
              Comment ta page doit-elle parler au client ?
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 hover:bg-neutral-100 rounded"
          >
            ✕
          </button>
        </header>

        <div className="space-y-3">
          {TONES.map((t) => {
            const isPicked = picked === t.id
            return (
              <button
                key={t.id}
                onClick={() => setPicked(t.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  isPicked
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <strong>{t.label}</strong>
                  {isPicked && <span className="text-purple-600">✓</span>}
                </div>
                <div className="text-sm text-neutral-600 mb-2">{t.description}</div>
                {t.example !== '—' && (
                  <div className="text-sm italic text-neutral-500">Ex : {t.example}</div>
                )}
              </button>
            )
          })}
        </div>

        <footer className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={() => onSelect(picked)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Appliquer
          </button>
        </footer>
      </div>
    </div>
  )
}
