'use client'

import { useState } from 'react'
import { STYLE_IDS, STYLE_LABELS } from '@/lib/styles'
import type { StyleId } from '@/lib/styles/types'

interface Props {
  currentStyle: StyleId
  product: { title: string; description?: string }
  onSelect: (id: StyleId) => void
  onClose: () => void
}

const STYLE_GRADIENTS: Record<StyleId, string> = {
  'soft':          'linear-gradient(135deg, #FAF7F2, #C9A77E)',
  'editorial':     'linear-gradient(135deg, #FFFFFF, #0A0A0A)',
  'apple-clean':   'linear-gradient(135deg, #FFFFFF, #0066CC)',
  'bold':          'linear-gradient(135deg, #FFFFFF, #FF2277)',
  'organic':       'linear-gradient(135deg, #F4F1ED, #4A7C59)',
  'luxe-noir':     'linear-gradient(135deg, #14110F, #C9A84C)',
  'brutalist':     'linear-gradient(135deg, #F5F5F0, #FF6B35)',
  'warm-neutral':  'linear-gradient(135deg, #F4ECE0, #B5854B)',
  'minimal-mono':  'linear-gradient(135deg, #FFFFFF, #000000)',
  'vibrant':       'linear-gradient(135deg, #FFF8E1, #FF4D88)',
}

export function StylePickerModal({ currentStyle, onSelect, onClose }: Props) {
  const [picked, setPicked] = useState<StyleId>(currentStyle)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Choisis une template</h2>
            <p className="text-neutral-600 mt-1">
              Style auto-sélectionné en fonction de ton produit. Tu peux en choisir une autre.
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STYLE_IDS.map((id) => {
            const [name, vibe] = STYLE_LABELS[id].split(' — ')
            const isPicked = picked === id
            return (
              <button
                key={id}
                onClick={() => setPicked(id)}
                className={`relative aspect-square rounded-lg border-2 p-3 text-left transition-all ${
                  isPicked
                    ? 'border-purple-600 ring-2 ring-purple-200'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {isPicked && (
                  <span className="absolute top-2 right-2 text-purple-600 text-xl font-bold">✓</span>
                )}
                <div
                  className="w-full h-3/5 rounded mb-2"
                  style={{ background: STYLE_GRADIENTS[id] }}
                  aria-hidden
                />
                <div className="text-sm font-semibold">{name}</div>
                {vibe && (
                  <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{vibe}</div>
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
            Utiliser cette template
          </button>
        </footer>
      </div>
    </div>
  )
}
