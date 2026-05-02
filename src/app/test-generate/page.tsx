'use client'

import { useState } from 'react'
import type { LandingPageData } from '@/types'

export default function TestGeneratePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LandingPageData | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [duration, setDuration] = useState<number | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setResult(null)
    const start = Date.now()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // body vide → utilise le mock
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur API')
      setResult(json.data)
      setDuration(Date.now() - start)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold tracking-widest text-purple-600 uppercase mb-2">
            Pipeline IA — Test
          </div>
          <h1 className="text-3xl font-black text-gray-900">
            Génération Landing Page
          </h1>
          <p className="text-gray-500 mt-1">
            Teste la génération Claude avec le produit mock (montre connectée)
          </p>
        </div>

        {/* Produit mock info */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="text-2xl">⌚</div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Produit mock</div>
            <div className="font-semibold text-gray-800 text-sm">Montre Connectée Sport Pro — Étanche IP68, GPS</div>
            <div className="text-xs text-gray-400 mt-0.5">29.99€ → 59.99€ · 4.6/5 · 12 847 avis</div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full font-semibold">
              Mode mock
            </span>
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-4 rounded-xl transition-colors text-lg mb-8"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Claude génère la page...
            </span>
          ) : 'Générer la landing page'}
        </button>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="space-y-4">

            {/* Stats */}
            <div className="flex items-center gap-3 text-sm mb-6">
              <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-semibold">
                Généré en {duration}ms
              </span>
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-semibold">
                deepseek-chat
              </span>
            </div>

            {/* Headline */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Headline</div>
              <p className="text-2xl font-black text-gray-900 leading-tight">{result.headline}</p>
            </div>

            {/* Subtitle */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Sous-titre</div>
              <p className="text-lg text-gray-700">{result.subtitle}</p>
            </div>

            {/* CTA + Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-600 rounded-xl p-5 text-white">
                <div className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-2">CTA</div>
                <p className="text-lg font-bold">{result.cta}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">Urgence</div>
                <p className="text-base font-semibold text-orange-700">{result.urgency}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Bénéfices (×5)</div>
              <ul className="space-y-2">
                {result.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">FAQ (×5)</div>
              <div className="space-y-4">
                {result.faq.map((item, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-gray-800 text-sm mb-1">{item.question}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON brut */}
            <details className="bg-gray-900 rounded-xl overflow-hidden">
              <summary className="text-gray-400 text-xs font-mono px-5 py-3 cursor-pointer hover:text-gray-200">
                JSON brut (debug)
              </summary>
              <pre className="text-green-400 text-xs font-mono px-5 pb-5 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>

          </div>
        )}
      </div>
    </div>
  )
}
