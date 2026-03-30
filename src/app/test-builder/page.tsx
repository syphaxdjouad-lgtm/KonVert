'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { LandingPageData } from '@/types'
import { TEMPLATES } from '@/lib/templates'

const BuilderLoader = dynamic(() => import('@/components/builder/BuilderLoader'), { ssr: false })

type Step = 'select' | 'generate' | 'edit'

export default function TestBuilderPage() {
  const [step, setStep]             = useState<Step>('select')
  const [templateId, setTemplateId] = useState('clean-white')
  const [generating, setGenerating] = useState(false)
  const [landingData, setLandingData] = useState<LandingPageData | null>(null)
  const [html, setHtml]             = useState<string>('')
  const [genTime, setGenTime]       = useState<number | null>(null)
  const [error, setError]           = useState<string | null>(null)

  async function generate() {
    setGenerating(true)
    setError(null)
    const start = Date.now()
    try {
      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const data: LandingPageData = json.data
      setLandingData(data)

      // Générer le HTML du template sélectionné
      const { renderTemplate } = await import('@/lib/templates')
      const rendered = renderTemplate(templateId, data)
      setHtml(rendered)
      setGenTime(Date.now() - start)
      setStep('edit')
    } catch(e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setGenerating(false)
    }
  }

  function changeTemplate(id: string) {
    setTemplateId(id)
    if (landingData) {
      import('@/lib/templates').then(({ renderTemplate }) => {
        setHtml(renderTemplate(id, landingData))
      })
    }
  }

  // ── STEP 1 : Sélection template ──
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-purple-600 uppercase mb-2">Tâche 05 — Builder</div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Choisis un template</h1>
          <p className="text-gray-400 mb-8">Le contenu sera généré par Claude depuis le produit mock</p>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                  templateId === t.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 capitalize">{t.category}</div>
                </div>
                {templateId === t.id && (
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

          <button
            onClick={generate}
            disabled={generating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Génération en cours...
              </span>
            ) : `Générer avec "${TEMPLATES.find(t => t.id === templateId)?.name}"`}
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 2 : Éditeur ──
  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep('select')} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
            ← Changer de template
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-sm font-bold text-gray-700">
            {landingData?.product_name} · {TEMPLATES.find(t => t.id === templateId)?.name}
          </span>
          {genTime && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
              Généré en {genTime}ms
            </span>
          )}
        </div>

        {/* Switch template en live */}
        <div className="flex gap-1">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => changeTemplate(t.id)}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                templateId === t.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Builder — prend tout l'espace */}
      <div className="flex-1 overflow-hidden">
        {html && (
          <BuilderLoader
            html={html}
            onSave={(savedHtml) => {
              console.log('Sauvegardé — longueur HTML:', savedHtml.length)
              alert('Sauvegardé ! (voir console pour le HTML)')
            }}
          />
        )}
      </div>
    </div>
  )
}
