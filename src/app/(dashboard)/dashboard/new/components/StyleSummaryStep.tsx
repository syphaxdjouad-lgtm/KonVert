'use client'

import { useState } from 'react'
import { suggestStyle } from '@/lib/styles/auto-pick'
import { autoPickTone } from '@/lib/ai/auto-pick-tone'
import { STYLE_LABELS } from '@/lib/styles'
import type { StyleId } from '@/lib/styles/types'
import type { CopyTone } from '@/types/v3'
import { StylePickerModal } from './StylePickerModal'
import { TonePickerModal } from './TonePickerModal'

interface Props {
  product: { title: string; description?: string; price?: number }
  imagesCount: number
  onContinue: (config: { styleId: StyleId; tone: CopyTone }) => void
  onBack: () => void
}

const TONE_LABELS: Record<CopyTone, string> = {
  auto:         'Auto',
  friendly:     'Friendly & accessible',
  premium:      'Premium & élégant',
  bold:         'Bold & punchy',
  storytelling: 'Storytelling émotionnel',
  educational:  'Éducatif & expert',
}

export function StyleSummaryStep({ product, imagesCount, onContinue, onBack }: Props) {
  const [styleId, setStyleId] = useState<StyleId>(() => suggestStyle(product))
  const [tone, setTone] = useState<CopyTone>('auto')
  const [showStyleModal, setShowStyleModal] = useState(false)
  const [showToneModal, setShowToneModal] = useState(false)

  const effectiveTone = tone === 'auto' ? autoPickTone(product) : tone
  const toneDisplay = tone === 'auto'
    ? `Auto (${TONE_LABELS[effectiveTone]})`
    : TONE_LABELS[tone]

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-2">Étape 4/8 — Style de ta page</h1>
      <p className="text-neutral-600 mb-6">
        On a tout préparé pour toi. Tu peux personnaliser si tu veux, ou cliquer directement Générer.
      </p>

      <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span aria-hidden>✨</span> Voici ce qu&apos;on va créer pour toi
        </h2>

        <Field icon="🛍️" label="Produit">
          <strong>{product.title}</strong>
        </Field>

        <Field icon="🎨" label="Style auto-sélectionné">
          <strong>{STYLE_LABELS[styleId]}</strong>
        </Field>

        <Field icon="🗣️" label="Ton de la copy">
          <strong>{toneDisplay}</strong>
        </Field>

        <Field icon="📐" label="Page générée">
          13 sections premium, mobile-first
          <div className="text-sm text-neutral-600 mt-1">
            Hero · Galerie · Story · Features · Best for · Materials · Reviews · FAQ · Manifesto…
          </div>
        </Field>

        <Field icon="🖼️" label="Images">
          {imagesCount} (finalisées étape précédente)
        </Field>

        <Field icon="✍️" label="Copy">
          Générée par AI, éditable après publication
        </Field>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={() => setShowStyleModal(true)}
          className="px-6 py-3 border border-neutral-200 rounded-lg text-left
                     hover:border-neutral-400 transition-colors"
        >
          🎨 Choisir une template manuellement
        </button>
        <button
          onClick={() => setShowToneModal(true)}
          className="px-6 py-3 border border-neutral-200 rounded-lg text-left
                     hover:border-neutral-400 transition-colors"
        >
          🗣️ Personnaliser le ton de la copy
        </button>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg">
          ← Retour
        </button>
        <button
          onClick={() => onContinue({ styleId, tone })}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Générer ma page →
        </button>
      </div>

      {showStyleModal && (
        <StylePickerModal
          currentStyle={styleId}
          product={product}
          onSelect={(id) => {
            setStyleId(id)
            setShowStyleModal(false)
          }}
          onClose={() => setShowStyleModal(false)}
        />
      )}
      {showToneModal && (
        <TonePickerModal
          currentTone={tone}
          onSelect={(t) => {
            setTone(t)
            setShowToneModal(false)
          }}
          onClose={() => setShowToneModal(false)}
        />
      )}
    </div>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="text-2xl shrink-0" aria-hidden>{icon}</span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{label}</div>
        <div className="text-neutral-900">{children}</div>
      </div>
    </div>
  )
}
