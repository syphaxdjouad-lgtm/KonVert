'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Check, Shield, Globe, Palette, BarChart3, Copy, ExternalLink, Sparkles, Clock, AlertCircle, Link2, Bot, Rocket } from 'lucide-react'

/* ── TEMPLATES DISPONIBLES ─────────────────────────────────────────────────── */
const DEMO_TEMPLATES = [
  { id: 'shein-pro',    name: 'Shein Pro',      gradient: 'from-[#5B47F5] to-[#8b77ff]', text: 'text-white' },
  { id: 'bold-orange',  name: 'Bold Orange',    gradient: 'from-orange-500 to-amber-400', text: 'text-white' },
  { id: 'minimal-dark', name: 'Minimal Dark',   gradient: 'from-gray-900 to-gray-700',   text: 'text-white' },
  { id: 'clean-white',  name: 'Clean White',    gradient: 'from-gray-50 to-white',        text: 'text-gray-900', border: 'border border-gray-300' },
  { id: 'beauty',       name: 'Beauty Studio',  gradient: 'from-pink-400 to-rose-500',   text: 'text-white' },
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

/* ── GÉNÉRER UN APERÇU FICTIF ───────────────────────────────────────────────── */
function generateMockPage(url: string, templateId: string, lang: string) {
  const isAliExpress = url.includes('aliexpress')
  const isAmazon     = url.includes('amazon')

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

/* ── COMPOSANT PAGE DÉMO ────────────────────────────────────────────────────── */
export default function DemoPage() {
  const [url,          setUrl]         = useState('')
  const [selectedTpl,  setSelectedTpl] = useState('shein-pro')
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
    const mockResult = generateMockPage(url, selectedTpl, selectedLang)
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
    <>
      {/* ── BANDEAU SANS INSCRIPTION ─────────────────────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 flex items-center justify-center gap-2 py-2 text-xs font-bold"
           style={{ background: 'linear-gradient(90deg, #5B47F5, #7c6af7)', color: '#fff' }}>
        <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
        Aucune inscription requise — teste KONVERT maintenant
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-10" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Démo interactive — Essayez gratuitement
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Collez une URL.<br />
            <span style={{ color: '#8b77ff' }}>Obtenez une page en 30s.</span>
          </h1>
          <p className="text-base leading-relaxed mb-2" style={{ color: '#8b8baa' }}>
            Pas de compte requis. Testez avec n'importe quelle URL AliExpress, Amazon ou Alibaba.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            {SUPPORTED.map(({ name, emoji }) => (
              <span key={name} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#8b8baa' }}>
                {emoji} {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE GÉNÉRATION ────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          {/* URLs démo prêtes */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 mb-2">Essayer avec :</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_URLS.map(({ label, url: demoUrl, platform }) => (
                <button
                  key={label}
                  onClick={() => setUrl(demoUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:border-[#5B47F5] hover:text-[#5B47F5]"
                  style={{ borderColor: url === demoUrl ? '#5B47F5' : '#e5e7eb', color: url === demoUrl ? '#5B47F5' : '#6b7280', background: url === demoUrl ? '#f3f0ff' : '#fff' }}
                >
                  {label} <span className="opacity-60">({platform})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Label URL */}
          <p className="text-sm font-bold text-gray-800 mb-2">
            Colle l&apos;URL de ton produit &rarr;
          </p>

          {/* Input URL */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="https://mon-exemple.myshopify.com/products/mon-produit"
              disabled={step === 'loading'}
              className="flex-1 min-w-0 px-5 py-4 rounded-full border text-sm outline-none transition-all"
              style={{ borderColor: '#e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            />
            <button
              onClick={handleGenerate}
              disabled={!url.trim() || step === 'loading'}
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white font-bold text-sm whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 16px rgba(91,71,245,0.35)' }}
            >
              {step === 'loading' ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Génération...</>
              ) : (
                <><Zap className="w-4 h-4" />Générer ma page</>
              )}
            </button>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Choix template */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />Template
              </p>
              <div className="flex gap-2 flex-wrap">
                {DEMO_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTpl(tpl.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all`}
                    style={
                      selectedTpl === tpl.id
                        ? { borderColor: '#5B47F5', background: '#f3f0ff', color: '#5B47F5' }
                        : { borderColor: '#e5e7eb', color: '#6b7280' }
                    }
                  >
                    <div className={`w-3 h-3 rounded-sm bg-gradient-to-br ${tpl.gradient}`} />
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Choix langue */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />Langue
              </p>
              <div className="flex gap-2 flex-wrap">
                {LANGS.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={
                      selectedLang === code
                        ? { borderColor: '#5B47F5', background: '#f3f0ff', color: '#5B47F5' }
                        : { borderColor: '#e5e7eb', color: '#6b7280' }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOADING STATE ────────────────────────────────────────────────── */}
      {step === 'loading' && (
        <section className="py-16 bg-white">
          <div className="max-w-md mx-auto px-5 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 32px rgba(91,71,245,0.35)' }}>
              <Sparkles className="w-9 h-9 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Claude AI génère votre page...</h2>
            <p className="text-sm text-gray-500 mb-6">Scraping des données, analyse produit, rédaction du copy.</p>
            {/* Barre de progression */}
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5B47F5, #8b77ff)' }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-3">{progress}% — Génération en cours</p>
          </div>
        </section>
      )}

      {/* ── RÉSULTAT ─────────────────────────────────────────────────────── */}
      {step === 'result' && result && (
        <section ref={resultRef} className="py-10" style={{ background: '#fafafa' }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">

            {/* Header résultat */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Page générée en 28 secondes</p>
                  <p className="text-xs text-gray-400">Template : {selectedTemplate.name} · Langue : {LANGS.find(l => l.code === selectedLang)?.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCopyUrl} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold text-gray-600 hover:border-[#5B47F5] hover:text-[#5B47F5] transition-all">
                  {copiedUrl ? <><Check className="w-3.5 h-3.5 text-emerald-500" />Copié !</> : <><Copy className="w-3.5 h-3.5" />Copier l'URL</>}
                </button>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
                  <Zap className="w-3.5 h-3.5" />Nouvelle page
                </button>
              </div>
            </div>

            {/* Preview page générée */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">

              {/* Barre navigateur */}
              <div className="bg-[#f5f5f7] border-b border-gray-100 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-1.5 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-gray-400 font-mono truncate">konvert.app/preview/demo-{Date.now()}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: '#f3f0ff', color: '#5B47F5' }}>
                  Démo
                </span>
              </div>

              {/* Contenu de la page générée */}
              <div className="overflow-auto max-h-[600px]">

                {/* Hero produit */}
                <div className={`bg-gradient-to-br ${selectedTemplate.gradient} p-8 sm:p-12`}>
                  <div className="max-w-2xl">
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                      OFFRE LIMITÉE — -40% aujourd'hui
                    </span>
                    <h1 className={`text-2xl sm:text-3xl font-black mb-4 leading-tight ${selectedTemplate.text}`}>
                      {result.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-6">
                      <span className={`text-3xl font-black ${selectedTemplate.text}`}>{result.price}</span>
                      <span className="line-through text-lg opacity-50" style={{ color: selectedTemplate.id === 'clean-white' ? '#9ca3af' : 'rgba(255,255,255,0.5)' }}>
                        {parseFloat(result.price) > 0 ? (parseFloat(result.price) * 1.6).toFixed(2).replace('.', ',') + '€' : ''}
                      </span>
                    </div>
                    <button className="px-8 py-4 rounded-full font-black text-sm shadow-lg transition-all hover:scale-[1.02]"
                            style={{ background: '#fff', color: '#5B47F5' }}>
                      🛒 J'en profite maintenant →
                    </button>
                  </div>
                </div>

                {/* Description & Bénéfices */}
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-lg font-black text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{result.desc}</p>
                  <h2 className="text-lg font-black text-gray-900 mb-3">Pourquoi vous allez l'adorer</h2>
                  <ul className="space-y-2.5">
                    {result.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avis clients */}
                <div className="p-8 border-b border-gray-100" style={{ background: '#fafafa' }}>
                  <h2 className="text-lg font-black text-gray-900 mb-5">Ce qu'ils en pensent</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Sophie M.', note: '⭐⭐⭐⭐⭐', text: 'Produit parfait, livraison rapide. Je recommande les yeux fermés !' },
                      { name: 'Pierre D.', note: '⭐⭐⭐⭐⭐', text: 'Qualité supérieure au prix. Exactement comme décrit.' },
                    ].map(({ name, note, text }) => (
                      <div key={name} className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm mb-1">{note}</p>
                        <p className="text-xs font-bold text-gray-900 mb-1">{name}</p>
                        <p className="text-xs text-gray-500">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <div className="p-8">
                  <h2 className="text-lg font-black text-gray-900 mb-5">Questions fréquentes</h2>
                  <div className="space-y-4">
                    {result.faq.map(({ q, a }) => (
                      <div key={q} className="border border-gray-100 rounded-xl p-5">
                        <p className="font-bold text-gray-900 text-sm mb-2">{q}</p>
                        <p className="text-gray-600 text-xs leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notice démo */}
            <div className="mt-5 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(91,71,245,0.06)', border: '1px solid rgba(91,71,245,0.15)' }}>
              <AlertCircle className="w-4 h-4 text-[#5B47F5] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#5B47F5] mb-1">Démo simulée</p>
                <p className="text-xs text-gray-600">
                  Cette démo illustre le type de page générée par KONVERT. En version complète, la vraie URL produit est scrapée et le copy est entièrement personnalisé.
                  {' '}<Link href="/signup" className="text-[#5B47F5] font-bold hover:underline">Créez un compte gratuit →</Link>
                </p>
              </div>
            </div>

            {/* CTA upgrade */}
            <div className="mt-6 p-8 rounded-3xl text-center" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
              <p className="text-white font-black text-xl mb-2">Publiez cette page sur votre boutique.</p>
              <p className="text-sm mb-6" style={{ color: '#8b8baa' }}>Connexion Shopify ou WooCommerce en 1 clic. 1 page gratuite pour tester.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
                >
                  Publier sur Shopify
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                >
                  <Palette className="w-4 h-4" />
                  Voir les 42 templates
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES DÉMO (si idle) ───────────────────────────────────────── */}
      {step === 'idle' && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Comment ça marche</p>
              <h2 className="text-3xl font-black text-gray-900">3 étapes, 30 secondes.</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: '01', Icon: Link2, color: '#5B47F5', bg: 'rgba(91,71,245,0.1)', title: 'Collez une URL', desc: 'AliExpress, Amazon ou Alibaba. KONVERT scrape automatiquement les données produit.' },
                { step: '02', Icon: Bot, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'IA génère le copy', desc: 'Claude AI rédige accroche, bénéfices, FAQ et CTA optimisés pour la conversion.' },
                { step: '03', Icon: Rocket, color: '#f97316', bg: 'rgba(249,115,22,0.1)', title: 'Publiez en 1 clic', desc: 'Connectez votre Shopify ou WooCommerce et publiez directement depuis KONVERT.' },
              ].map(({ step: s, Icon, color, bg, title, desc }) => (
                <div key={s} className="text-center p-8 rounded-2xl border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: bg }}>
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <span className="text-xs font-black text-[#5B47F5]/40 block mb-2">{s}</span>
                  <h3 className="font-black text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
