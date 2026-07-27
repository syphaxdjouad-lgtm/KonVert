'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Check, Shield, Globe, Palette, Copy, Sparkles, AlertCircle, Link2, Bot, Rocket } from 'lucide-react'

/* ── TEMPLATES DISPONIBLES ─────────────────────────────────────────── */
const DEMO_TEMPLATES = [
  { id: 'etec-blue',    name: 'Blue',           gradient: 'from-[#0057FF] to-[#3b82f6]', text: 'text-white' },
  { id: 'etec-noir',    name: 'Noir',           gradient: 'from-gray-900 to-gray-700',   text: 'text-white' },
  { id: 'etec-rose',    name: 'Rose',           gradient: 'from-pink-400 to-rose-500',   text: 'text-white' },
  { id: 'etec-gold',    name: 'Gold',           gradient: 'from-amber-400 to-yellow-600', text: 'text-white' },
  { id: 'etec-energy',  name: 'Energy',         gradient: 'from-orange-500 to-red-500',  text: 'text-white' },
]

const SUPPORTED = [
  { name: 'AliExpress', emoji: '📦', placeholder: 'https://fr.aliexpress.com/item/...' },
  { name: 'Amazon',     emoji: '📬', placeholder: 'https://www.amazon.fr/dp/...' },
  { name: 'Alibaba',    emoji: '🏭', placeholder: 'https://www.alibaba.com/product-detail/...' },
]

const DEMO_URLS = [
  { label: 'Écouteurs Bluetooth', url: 'https://fr.aliexpress.com/item/bluetooth-earbuds-demo', platform: 'AliExpress' },
  { label: 'Montre connectée',    url: 'https://www.amazon.fr/dp/smartwatch-demo',               platform: 'Amazon' },
  { label: 'Lampe LED gaming',    url: 'https://fr.aliexpress.com/item/led-lamp-gaming-demo',    platform: 'AliExpress' },
]

/* ── GÉNÉRER UN APERÇU FICTIF ────────────────────────────────────── */
function generateMockPage(url: string) {
  const products: Record<string, { title: string; price: string; desc: string; benefits: string[]; faq: { q: string; a: string }[] }> = {
    'aliexpress.com/item/bluetooth': {
      title:    'Écouteurs Bluetooth Pro 5.0 — Son Stéréo HD 40h Autonomie',
      price:    '29,90€',
      desc:     "Des écouteurs sans fil avec une qualité audio studio. Réduction de bruit active, connexion stable jusqu'à 15m, rechargement rapide USB-C.",
      benefits: ['40h d\'autonomie totale (boîtier inclus)', 'Réduction de bruit active -35dB', 'Waterproof IPX5 — sport sans souci', 'Compatible iOS & Android'],
      faq: [
        { q: 'Combien de temps dure la charge ?', a: 'Les écouteurs chargent en 1h30. Le boîtier se recharge en 2h via USB-C.' },
        { q: 'Fonctionnent-ils sous la pluie ?', a: 'Oui, ils sont certifiés IPX5 — résistants aux éclaboussures et à la transpiration.' },
      ],
    },
    default: {
      title:    'Produit Premium — Haute Qualité, Prix Compétitif',
      price:    '39,90€',
      desc:     'Un produit exceptionnel qui répond à vos besoins. Qualité premium, livraison rapide, satisfaction garantie.',
      benefits: ['Qualité supérieure testée et approuvée', 'Livraison rapide en 5-7 jours', 'Retour gratuit 30 jours', 'Service client réactif 24/7'],
      faq: [
        { q: 'Quelle est la politique de retour ?', a: "Retour gratuit sous 30 jours sans justification. Remboursement sous 5 jours ouvrés." },
        { q: 'La livraison est-elle rapide ?', a: 'Oui, expédition sous 24h. Livraison en 5-7 jours ouvrables en France.' },
      ],
    },
  }

  const productKey = Object.keys(products).find((k) => url.includes(k)) || 'default'
  return products[productKey]
}

/* ── COMPOSANT PAGE DÉMO ──────────────────────────────────────────────── */
export default function DemoPage() {
  const [url,          setUrl]         = useState('')
  const [selectedTpl,  setSelectedTpl] = useState('etec-blue')
  const [selectedLang, setLang]        = useState('fr')
  const [step,         setStep]        = useState<'idle' | 'loading' | 'result'>('idle')
  const [progress,     setProgress]    = useState(0)
  const [result,       setResult]      = useState<ReturnType<typeof generateMockPage> | null>(null)
  const [copiedUrl,    setCopiedUrl]   = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const LANGS = [
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'de', label: '🇩🇪 Deutsch' },
  ]

  const selectedTemplate = DEMO_TEMPLATES.find((t) => t.id === selectedTpl) || DEMO_TEMPLATES[0]

  async function handleGenerate() {
    if (!url.trim()) return
    setStep('loading')
    setProgress(0)

    // Simulation du scraping + génération IA
    const steps = [
      { progress: 15, msg: 'Analyse de l\'URL...' },
      { progress: 35, msg: 'Scraping des données produit...' },
      { progress: 55, msg: 'Extraction des images et prix...' },
      { progress: 75, msg: 'Génération du copy avec Claude AI...' },
      { progress: 90, msg: 'Application du template...' },
      { progress: 100, msg: 'Page générée !' },
    ]

    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
      setProgress(s.progress)
    }

    await new Promise((r) => setTimeout(r, 300))
    const mockResult = generateMockPage(url)
    setResult(mockResult)
    setStep('result')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  function handleReset() {
    setStep('idle')
    setUrl('')
    setResult(null)
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 text-center px-5" style={{ background: 'linear-gradient(180deg, #faf9ff 0%, #ffffff 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
             style={{ background: 'rgba(91,71,245,0.08)', borderColor: 'rgba(91,71,245,0.2)', color: '#5B47F5' }}>
          <Sparkles className="w-3.5 h-3.5" />
          Démo interactive
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 max-w-2xl mx-auto leading-tight">
          Colle un lien produit. <span style={{ color: '#5B47F5' }}>Regarde la magie opérer.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Aucune inscription requise. Teste KONVERT avec un vrai produit en 30 secondes.
        </p>
      </section>

      {step === 'idle' && (
        <section className="pb-24 px-5">
          <div className="max-w-2xl mx-auto">
            {/* Sources supportées */}
            <div className="flex justify-center gap-3 mb-6">
              {SUPPORTED.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  {s.emoji} {s.name}
                </span>
              ))}
            </div>

            {/* Input URL */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Lien du produit</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://fr.aliexpress.com/item/..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#5B47F5]/20 focus:border-[#5B47F5] transition-all"
                  />
                </div>
              </div>

              {/* URLs de démo rapide */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Ou essaie avec un produit démo :</p>
                <div className="flex flex-wrap gap-2">
                  {DEMO_URLS.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setUrl(d.url)}
                      className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélecteur template */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Style de template</label>
                <div className="flex gap-2">
                  {DEMO_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTpl(t.id)}
                      className={`flex-1 h-10 rounded-xl bg-gradient-to-r ${t.gradient} transition-all ${
                        selectedTpl === t.id ? 'ring-2 ring-offset-2 ring-[#5B47F5] scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sélecteur langue */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Langue</label>
                <div className="flex gap-2 flex-wrap">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                        selectedLang === l.code ? 'bg-[#5B47F5] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!url.trim()}
                className="w-full mt-6 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' }}
              >
                <Bot className="w-4 h-4" />
                Générer ma page
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 'loading' && (
        <section className="pb-24 px-5">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(91,71,245,0.08)' }}>
              <Rocket className="w-9 h-9 animate-pulse" style={{ color: '#5B47F5' }} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Génération en cours...</h2>
            <p className="text-sm text-gray-500 mb-6">{progress}%</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5B47F5, #7c6af7)' }}
              />
            </div>
          </div>
        </section>
      )}

      {step === 'result' && result && (
        <section ref={resultRef} className="pb-24 px-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <Check className="w-4 h-4" /> Page générée avec succès
              </div>
              <button onClick={handleReset} className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                ← Nouvelle démo
              </button>
            </div>

            {/* Preview mockup */}
            <div className={`rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${selectedTemplate.gradient} p-8 sm:p-12`}>
              <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${selectedTemplate.text}`}>{result.title}</h2>
              <p className={`text-sm sm:text-base mb-6 opacity-90 ${selectedTemplate.text}`}>{result.desc}</p>
              <div className={`text-3xl font-black mb-6 ${selectedTemplate.text}`}>{result.price}</div>
              <ul className="space-y-2 mb-6">
                {result.benefits.map((b) => (
                  <li key={b} className={`flex items-center gap-2 text-sm ${selectedTemplate.text}`}>
                    <Check className="w-4 h-4 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <button className="bg-white text-gray-900 font-bold px-8 py-3.5 rounded-xl text-sm">
                Ajouter au panier
              </button>
            </div>

            {/* FAQ preview */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Questions fréquentes générées</h3>
              <div className="space-y-3">
                {result.faq.map((f) => (
                  <div key={f.q}>
                    <p className="text-sm font-semibold text-gray-800">{f.q}</p>
                    <p className="text-xs text-gray-500 mt-1">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA final */}
            <div className="mt-8 text-center bg-gray-50 rounded-2xl p-8">
              <h3 className="font-black text-gray-900 mb-2">Impressionné ? C'est ta boutique qui pourrait avoir ça.</h3>
              <p className="text-sm text-gray-500 mb-5">Génère ta vraie première page gratuitement, sans CB.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/essai"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' }}
                >
                  Créer ma vraie page <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border border-gray-200 text-gray-700"
                >
                  <Copy className="w-4 h-4" /> {copiedUrl ? 'Copié !' : "Copier l'URL"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES BAR ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: Zap, label: '30 secondes', desc: 'De la génération' },
              { icon: Shield, label: 'Sécurisé', desc: 'OAuth + chiffrement' },
              { icon: Globe, label: '8 langues', desc: 'Copy natif' },
              { icon: Palette, label: '42+ templates', desc: 'Toutes niches' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#5B47F5]" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
