'use client'

import { useState } from 'react'
import type { V3PageData, MaterialEntry } from '@/types/v3'

interface Props {
  data: V3PageData
  onContinue: (data: V3PageData) => void
  onBack: () => void
}

export function DataValidationStep({ data, onContinue, onBack }: Props) {
  const [materials, setMaterials] = useState<MaterialEntry[]>(data.copy.materials ?? [])
  const [showReviews, setShowReviews] = useState(Boolean(data.copy.reviews_summary))

  const lowConfMaterials = materials.filter((m) => m.confidence < 0.6)
  const hasReviews = Boolean(data.copy.reviews_summary)

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-2">Vérifie les infos extraites</h1>
      <p className="text-neutral-600 mb-6">
        L'AI a extrait ces données automatiquement. Confirme ou complète avant publication.
      </p>

      <div className="space-y-4">
        <ValidatedRow status="ok" label="Nom" value={data.product.title} />
        <ValidatedRow status="ok" label="Prix" value={data.product.price ?? '—'} />

        <div
          className={`p-4 rounded-lg border ${
            lowConfMaterials.length > 0
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-green-200 bg-green-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden>{lowConfMaterials.length > 0 ? '⚠️' : '✅'}</span>
            <strong>Matériaux extraits</strong>
            {lowConfMaterials.length > 0 && (
              <span className="text-sm">(confidence basse — confirme ou complète)</span>
            )}
          </div>
          {materials.length === 0 && (
            <p className="text-sm text-neutral-500 mb-2">Aucun matériau détecté</p>
          )}
          {materials.map((m, i) => (
            <MaterialEditor
              key={i}
              material={m}
              onUpdate={(newM) => {
                const next = [...materials]
                next[i] = newM
                setMaterials(next)
              }}
              onDelete={() => setMaterials(materials.filter((_, j) => j !== i))}
            />
          ))}
          <button
            onClick={() =>
              setMaterials([...materials, { name: '', benefit: '', confidence: 1 }])
            }
            className="text-sm text-purple-600 mt-2 hover:text-purple-700"
          >
            + Ajouter un matériau
          </button>
        </div>

        {!hasReviews && (
          <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!showReviews}
                onChange={() => setShowReviews((prev) => !prev)}
                className="rounded"
              />
              <span>Ne pas afficher la section reviews (aucun avis trouvé sur la source)</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg"
        >
          ← Retour
        </button>
        <button
          onClick={() =>
            onContinue({
              ...data,
              copy: {
                ...data.copy,
                materials: materials.filter((m) => m.name && m.benefit),
                reviews_summary: showReviews ? data.copy.reviews_summary : undefined,
              },
            })
          }
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Publier ma page →
        </button>
      </div>
    </div>
  )
}

function ValidatedRow({
  status,
  label,
  value,
}: {
  status: 'ok' | 'warn'
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg border-green-200 bg-green-50">
      <span aria-hidden>{status === 'ok' ? '✅' : '⚠️'}</span>
      <span className="text-neutral-500">{label} :</span>
      <strong className="flex-1">{value}</strong>
    </div>
  )
}

function MaterialEditor({
  material,
  onUpdate,
  onDelete,
}: {
  material: MaterialEntry
  onUpdate: (m: MaterialEntry) => void
  onDelete: () => void
}) {
  return (
    <div className="flex gap-2 mb-2">
      <input
        value={material.name}
        onChange={(e) => onUpdate({ ...material, name: e.target.value, confidence: 1 })}
        placeholder="Nom du matériau"
        className="flex-1 px-3 py-2 border rounded focus:border-purple-600 focus:outline-none"
      />
      <input
        value={material.benefit}
        onChange={(e) => onUpdate({ ...material, benefit: e.target.value, confidence: 1 })}
        placeholder="Bénéfice"
        className="flex-1 px-3 py-2 border rounded focus:border-purple-600 focus:outline-none"
      />
      <button
        onClick={onDelete}
        aria-label="Supprimer"
        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
      >
        ✕
      </button>
    </div>
  )
}

/** Helper exporté pour décider si afficher cette étape (au moins 1 champ low conf). */
export function needsValidation(data: V3PageData): boolean {
  const lowConfMaterials = (data.copy.materials ?? []).some((m) => m.confidence < 0.6)
  const missingReviews = !data.copy.reviews_summary
  return lowConfMaterials || missingReviews
}
