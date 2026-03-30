'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TEMPLATES } from '@/lib/templates'
import { Link2, Pencil, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { LandingPageData } from '@/types'

const BuilderLoader = dynamic(() => import('@/components/builder/BuilderLoader'), { ssr: false })

type Mode = 'form' | 'generating' | 'editor'
type InputMode = 'url' | 'manual'

export default function NewPage() {
  const router = useRouter()

  const [mode, setMode]             = useState<Mode>('form')
  const [inputMode, setInputMode]   = useState<InputMode>('url')
  const [url, setUrl]               = useState('')
  const [templateId, setTemplateId] = useState('clean-white')
  const [title, setTitle]           = useState('')
  const [html, setHtml]             = useState('')
  const [landingData, setLandingData] = useState<LandingPageData | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)

  // Champs formulaire manuel
  const [manual, setManual] = useState({
    product_name: '', headline: '', subtitle: '',
    price: '', cta: 'Commander maintenant',
  })

  async function generate() {
    setMode('generating')
    setError(null)
    try {
      const body = inputMode === 'url'
        ? { url }
        : { product: { ...manual, benefits: [], faq: [], urgency: '', images: [] } }

      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const data: LandingPageData = json.data
      setLandingData(data)
      setTitle(data.product_name || 'Nouvelle page')

      const { renderTemplate } = await import('@/lib/templates')
      setHtml(renderTemplate(templateId, data))
      setMode('editor')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      setMode('form')
    }
  }

  async function savePage(savedHtml: string) {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data: page, error } = await supabase
        .from('pages')
        .insert({
          user_id:      user.id,
          title:        title || 'Nouvelle page',
          product_url:  inputMode === 'url' ? url : null,
          html_content: savedHtml,
          json_content: landingData,
          template_id:  templateId,
          status:       'draft',
        })
        .select()
        .single()

      if (error) throw error
      router.push('/dashboard/pages')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur sauvegarde')
    } finally {
      setSaving(false)
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

  // ── Vue éditeur ──
  if (mode === 'editor') {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('form')} className="text-xs font-semibold text-gray-400 hover:text-gray-700">
              ← Retour
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-sm font-bold text-gray-700 bg-transparent focus:outline-none focus:border-b border-purple-400"
              placeholder="Titre de la page"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Switch template */}
            <div className="flex gap-1">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => changeTemplate(t.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    templateId === t.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <BuilderLoader
            html={html}
            onSave={(savedHtml) => savePage(savedHtml)}
          />
        </div>
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}
      </div>
    )
  }

  // ── Vue formulaire ──
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xs font-semibold text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Nouvelle landing page</h1>
        <p className="text-gray-500 mt-1">Génère une page optimisée avec l'IA en quelques secondes</p>
      </div>

      {/* Toggle URL / Manuel */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setInputMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Link2 className="w-4 h-4" /> URL produit
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Pencil className="w-4 h-4" /> Saisie manuelle
        </button>
      </div>

      {inputMode === 'url' ? (
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">URL du produit</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://aliexpress.com/item/..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
          <p className="text-xs text-gray-400 mt-1.5">Compatible AliExpress, Amazon, Alibaba et la plupart des boutiques</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {[
            { key: 'product_name', label: 'Nom du produit', placeholder: 'Montre connectée sport Pro' },
            { key: 'headline',     label: 'Accroche principale', placeholder: 'Transforme ta routine fitness' },
            { key: 'subtitle',     label: 'Sous-titre', placeholder: 'Suivi santé avancé, GPS intégré...' },
            { key: 'price',        label: 'Prix', placeholder: '49,99€' },
            { key: 'cta',          label: 'Bouton CTA', placeholder: 'Commander maintenant' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
              <input
                value={manual[key as keyof typeof manual]}
                onChange={e => setManual({ ...manual, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          ))}
        </div>
      )}

      {/* Choix template */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Template</label>
        <div className="grid grid-cols-1 gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left ${
                templateId === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                <span className="text-xs text-gray-400 ml-2 capitalize">{t.category}</span>
              </div>
              {templateId === t.id && (
                <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>
      )}

      <button
        onClick={generate}
        disabled={mode === 'generating' || (inputMode === 'url' && !url)}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {mode === 'generating' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours...</>
        ) : (
          'Générer avec l\'IA'
        )}
      </button>
    </div>
  )
}
