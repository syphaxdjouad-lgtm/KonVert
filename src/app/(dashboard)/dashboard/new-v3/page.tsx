'use client'

/**
 * Nouveau wizard V3 (Sprint 6 — Task 6.9 finalisation)
 *
 * Wizard léger autonome, NE PAS confondre avec /dashboard/new (legacy 1537 lignes).
 * Quand V3 est validé en prod, on remplace progressivement le wizard legacy.
 *
 * Flow :
 *   1. URL    → input + scrape
 *   2. Produit → review images + édition titre/desc/prix
 *   3. Style  → StyleSummaryStep (auto-pick + options)
 *   4. Génère → POST /api/generate engine=v3
 *   5. Valide → DataValidationStep si needsValidation
 *   6. Preview HTML rendu
 */

import { useState } from 'react'
import { StyleSummaryStep } from '../new/components/StyleSummaryStep'
import { DataValidationStep, needsValidation } from '../new/components/DataValidationStep'
import { ImageManager } from '../new/components/ImageManager'
import type { V3PageData, CopyTone } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'

type Step = 'url' | 'product' | 'style' | 'generating' | 'validate' | 'preview'

interface ScrapedProduct {
  title: string
  description: string
  price?: string
  images: string[]
}

export default function NewV3Page() {
  const [step, setStep] = useState<Step>('url')
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [product, setProduct] = useState<ScrapedProduct | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [generatedData, setGeneratedData] = useState<V3PageData | null>(null)
  const [renderedHtml, setRenderedHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  async function handleScrape() {
    setScraping(true)
    setError(null)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error(`Scraping failed (${res.status})`)
      const data = await res.json()
      const scraped: ScrapedProduct = {
        title: data.title ?? data.name ?? 'Produit',
        description: data.description ?? '',
        price: data.price,
        images: data.images ?? [],
      }
      setProduct(scraped)
      setImages(scraped.images)
      setStep('product')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur scraping')
    } finally {
      setScraping(false)
    }
  }

  async function handleGenerate(config: { styleId: StyleId; tone: CopyTone }) {
    if (!product) return
    setStep('generating')
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: 'v3',
          url,
          styleId: config.styleId,
          tone: config.tone,
          images,
          product,
        }),
      })
      if (!res.ok) throw new Error(`Generation failed (${res.status})`)
      const json = await res.json()
      setGeneratedData(json.data as V3PageData)
      setRenderedHtml(json.html as string)
      setStep(needsValidation(json.data as V3PageData) ? 'validate' : 'preview')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur génération')
      setStep('style')
    }
  }

  async function handleValidationContinue(validated: V3PageData) {
    setGeneratedData(validated)
    // Re-render via API ou directement côté client si on a la fonction (besoin de serveur car renderPageV3 utilise tokens importés)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: 'v3',
          url,
          styleId: validated.styleId,
          tone: validated.tone,
          images: validated.images,
          product,
          overrideCopy: validated.copy,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setRenderedHtml(json.html as string)
      }
    } catch {
      // garder html existant
    }
    setStep('preview')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {error && (
        <div className="bg-red-100 border-b border-red-200 p-4 text-red-800 text-center">
          {error} <button onClick={() => setError(null)} className="ml-3 underline">Fermer</button>
        </div>
      )}

      {step === 'url' && (
        <div className="max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wide text-purple-600 mb-2">Konvert V3 (preview)</div>
            <h1 className="text-3xl font-semibold mb-2">Étape 1 — Lien produit</h1>
            <p className="text-neutral-600">URL Shopify, AliExpress, Amazon ou tout produit e-commerce.</p>
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 border rounded-lg focus:border-purple-600 focus:outline-none"
          />
          <button
            onClick={handleScrape}
            disabled={!url || scraping}
            className="mt-4 px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-purple-700"
          >
            {scraping ? 'Scraping...' : 'Analyser le produit →'}
          </button>
        </div>
      )}

      {step === 'product' && product && (
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-3xl font-semibold mb-6">Étape 2 — Ton produit</h1>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-500">Nom</label>
              <input
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full px-3 py-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-500">Prix</label>
              <input
                value={product.price ?? ''}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="79€"
                className="w-full px-3 py-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-500">Description (alimente l'AI)</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-2">
                Images du produit
              </label>
              <ImageManager images={images} onChange={setImages} />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep('url')}
              className="px-6 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg"
            >
              ← Retour
            </button>
            <button
              onClick={() => setStep('style')}
              disabled={!product.title}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-purple-700"
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 'style' && product && (
        <StyleSummaryStep
          product={{
            title: product.title,
            description: product.description,
            price: product.price ? parseFloat(product.price) || undefined : undefined,
          }}
          imagesCount={images.length}
          onBack={() => setStep('product')}
          onContinue={handleGenerate}
        />
      )}

      {step === 'generating' && (
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Génération en cours…</h2>
          <p className="text-neutral-600">
            On crée ta page produit avec les 13 sections premium.
            Ça prend 15-25 secondes (DeepSeek).
          </p>
        </div>
      )}

      {step === 'validate' && generatedData && (
        <DataValidationStep
          data={generatedData}
          onBack={() => setStep('style')}
          onContinue={handleValidationContinue}
        />
      )}

      {step === 'preview' && renderedHtml && (
        <div>
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <div>
              <strong>Preview V3</strong>
              <span className="ml-3 text-sm text-neutral-500">
                Style : {generatedData?.styleId} · Ton : {generatedData?.tone}
              </span>
            </div>
            <button
              onClick={() => setStep('url')}
              className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded"
            >
              Nouvelle page
            </button>
          </div>
          <iframe
            srcDoc={renderedHtml}
            title="Preview page produit V3"
            className="w-full"
            style={{ height: 'calc(100vh - 60px)', border: 0 }}
          />
        </div>
      )}
    </div>
  )
}
