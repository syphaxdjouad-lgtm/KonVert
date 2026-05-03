'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Link2, Pencil, Sparkles } from 'lucide-react'
import { Turnstile } from '@/components/Turnstile'
import { track } from '@/lib/analytics'

type Step = 'email' | 'product' | 'generating'
type InputMode = 'url' | 'manual'
type Locale = 'fr' | 'en'

// ── i18n minimaliste — pas de lib pour ne pas alourdir une page d'acquisition.
// Si on ajoute une 3e langue, on extrait dans /lib/i18n.
const T: Record<Locale, {
  switchTo: string
  emailTitle: string
  emailSubtitle: string
  firstName: string
  firstNamePh: string
  emailLabel: string
  emailPh: string
  emailHelp: string
  generateBtn: string
  productTitle: string
  productSubtitle: string
  modeUrl: string
  modeManual: string
  urlLabel: string
  urlPh: string
  urlHelp: string
  productNameLabel: string
  productNamePh: string
  productDescLabel: string
  productDescOptional: string
  productDescPh: string
  generateBtnFinal: string
  back: string
  loadingTexts: string[]
  loadingDuration: string
  trust: string[]
  // erreurs
  errEmail: string
  errUrl: string
  errProductName: string
  errCaptcha: string
  errNetwork: string
  errGeneric: string
}> = {
  fr: {
    switchTo: 'EN',
    emailTitle: 'Génère ta première page gratuitement',
    emailSubtitle: 'Aucune CB. Résultat en 30 secondes.',
    firstName: 'Ton prénom',
    firstNamePh: 'Ex : Ahmed',
    emailLabel: 'Où on envoie ta page ?',
    emailPh: 'ton@email.com',
    emailHelp: 'On t\u2019envoie aussi le lien pour la modifier.',
    generateBtn: 'Générer ma page',
    productTitle: 'Ton produit',
    productSubtitle: 'Colle un lien ou entre les infos manuellement.',
    modeUrl: 'Lien produit',
    modeManual: 'Saisie manuelle',
    urlLabel: 'URL du produit',
    urlPh: 'https://aliexpress.com/item/...',
    urlHelp: 'AliExpress, Amazon, Shopify — KONVERT scrape automatiquement.',
    productNameLabel: 'Nom du produit',
    productNamePh: 'Ex : Montre connectée sport',
    productDescLabel: 'Description courte',
    productDescOptional: '(optionnel)',
    productDescPh: 'Ce que fait le produit, pour qui, bénéfices...',
    generateBtnFinal: 'Générer ma page en 30 secondes',
    back: '← Retour',
    loadingTexts: [
      'Analyse du produit...',
      'Rédaction du copy de vente...',
      'Optimisation SEO...',
      'Finalisation de la page...',
    ],
    loadingDuration: 'Ça prend environ 30 secondes.',
    trust: ['Aucune CB', 'Résultat immédiat', '100% gratuit'],
    errEmail: 'Entre un email valide.',
    errUrl: 'Colle l\u2019URL du produit.',
    errProductName: 'Entre le nom du produit.',
    errCaptcha: 'Patiente quelques secondes — vérification anti-bot en cours.',
    errNetwork: 'Erreur réseau. Vérifie ta connexion et réessaie.',
    errGeneric: 'Une erreur est survenue. Réessaie.',
  },
  en: {
    switchTo: 'FR',
    emailTitle: 'Generate your first page for free',
    emailSubtitle: 'No credit card. Result in 30 seconds.',
    firstName: 'Your first name',
    firstNamePh: 'E.g. Ahmed',
    emailLabel: 'Where do we send your page?',
    emailPh: 'you@email.com',
    emailHelp: 'We\u2019ll also send the link to edit it.',
    generateBtn: 'Generate my page',
    productTitle: 'Your product',
    productSubtitle: 'Paste a link or enter the info manually.',
    modeUrl: 'Product link',
    modeManual: 'Manual entry',
    urlLabel: 'Product URL',
    urlPh: 'https://aliexpress.com/item/...',
    urlHelp: 'AliExpress, Amazon, Shopify — KONVERT scrapes automatically.',
    productNameLabel: 'Product name',
    productNamePh: 'E.g. Smart sports watch',
    productDescLabel: 'Short description',
    productDescOptional: '(optional)',
    productDescPh: 'What the product does, who it\u2019s for, benefits...',
    generateBtnFinal: 'Generate my page in 30 seconds',
    back: '\u2190 Back',
    loadingTexts: [
      'Analyzing the product...',
      'Writing sales copy...',
      'Optimizing SEO...',
      'Finalizing the page...',
    ],
    loadingDuration: 'This takes about 30 seconds.',
    trust: ['No card', 'Instant result', '100% free'],
    errEmail: 'Enter a valid email.',
    errUrl: 'Paste the product URL.',
    errProductName: 'Enter the product name.',
    errCaptcha: 'Hang on a few seconds — anti-bot check in progress.',
    errNetwork: 'Network error. Check your connection and try again.',
    errGeneric: 'Something went wrong. Try again.',
  },
}

const LOCALE_KEY = 'konvert-locale'

function detectLocale(searchParams: URLSearchParams): Locale {
  // Priorité : ?lang=xx → localStorage → navigator.language → 'fr'
  const fromQuery = searchParams.get('lang')
  if (fromQuery === 'en' || fromQuery === 'fr') return fromQuery
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_KEY)
    if (stored === 'en' || stored === 'fr') return stored
    const nav = navigator.language?.toLowerCase() ?? ''
    if (nav.startsWith('fr')) return 'fr'
    return 'en'  // par défaut anglais hors francophone (acquisition internationale)
  }
  return 'fr'
}

export default function EssaiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0d0d1a' }} />}>
      <EssaiContent />
    </Suspense>
  )
}

function EssaiContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('email')
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [locale, setLocale] = useState<Locale>('fr')
  const t = T[locale]

  // Champs
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [productName, setProductName] = useState('')
  const [productDesc, setProductDesc] = useState('')

  // Détection locale + pré-remplissage email — combiné dans le même effet
  // pour éviter une race entre les deux setStates initiaux.
  useEffect(() => {
    setLocale(detectLocale(searchParams))
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setStep('product')
    }
  }, [searchParams])

  function toggleLocale() {
    const next: Locale = locale === 'fr' ? 'en' : 'fr'
    setLocale(next)
    try { localStorage.setItem(LOCALE_KEY, next) } catch { /* quota / private mode */ }
  }

  const [error, setError] = useState<string | null>(null)
  const [loadingText, setLoadingText] = useState<string>('')
  // Captcha — vide tant que Turnstile n'a pas validé. En dev sans clé, le composant
  // appelle onToken('') immédiatement et le serveur bypass aussi.
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // ── Étape 1 : email ──────────────────────────────────────────────────────
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError(t.errEmail)
      return
    }
    setError(null)
    setStep('product')
  }

  // ── Étape 2 : produit + génération ───────────────────────────────────────
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (inputMode === 'url' && !url.trim()) {
      setError(t.errUrl)
      return
    }
    if (inputMode === 'manual' && !productName.trim()) {
      setError(t.errProductName)
      return
    }
    if (captchaRequired && !captchaToken) {
      setError(t.errCaptcha)
      return
    }

    setStep('generating')
    setLoadingText(t.loadingTexts[0])
    track.essaiEmailCaptured()
    track.generateStarted('public')
    const startedAt = Date.now()

    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % t.loadingTexts.length
      setLoadingText(t.loadingTexts[i])
    }, 1800)

    try {
      const body: Record<string, unknown> = {
        email,
        name: name || undefined,
        turnstileToken: captchaToken ?? '',
        // Propage la langue → la landing générée sera dans cette langue ET
        // <html lang="..."> sera correctement posé par le template.
        language: locale,
      }

      if (inputMode === 'url') {
        body.url = url.trim()
      } else {
        body.product = {
          title: productName.trim(),
          description: productDesc.trim() || productName.trim(),
          price: null,
          original_price: null,
          images: [],
          variants: [],
          rating: null,
          reviews_count: null,
          features: [],
          source_url: null,
        }
      }

      const res = await fetch('/api/generate/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      clearInterval(interval)

      if (!res.ok) {
        if (res.status === 409 && data.preview_id) {
          // Page déjà générée → rediriger vers l'existante
          router.push(`/preview/${data.preview_id}`)
          return
        }
        track.generateFailed('public', data.error || `HTTP ${res.status}`)
        setStep('product')
        setError(data.error || t.errGeneric)
        return
      }

      track.generateCompleted('public', Date.now() - startedAt)
      track.pageGenerated('public')
      router.push(`/preview/${data.preview_id}`)
    } catch (err) {
      track.generateFailed('public', err instanceof Error ? err.message : 'network')
      clearInterval(interval)
      setStep('product')
      setError(t.errNetwork)
    }
  }

  // ── Loader ───────────────────────────────────────────────────────────────
  if (step === 'generating') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: '#0d0d1a' }}
      >
        <div className="text-center max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ color: '#a78bfa' }}>VERT</span>
            </span>
          </div>

          {/* Spinner */}
          <div className="relative mb-8 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              <Sparkles className="w-8 h-8 animate-pulse" style={{ color: '#a78bfa' }} />
            </div>
          </div>

          {/* Texte animé */}
          <p
            key={loadingText}
            className="text-base font-medium transition-all"
            style={{ color: 'rgba(196,181,253,0.85)' }}
          >
            {loadingText}
          </p>
          <p className="text-sm mt-2" style={{ color: 'rgba(167,139,250,0.4)' }}>
            {t.loadingDuration}
          </p>
        </div>
      </div>
    )
  }

  // ── Layout commun ────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: '#0d0d1a' }}
    >
      <div className="w-full max-w-md">

        {/* Top bar — logo + toggle langue */}
        <div className="flex items-center justify-between mb-10">
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>KON</span>
            <span style={{ color: '#a78bfa' }}>VERT</span>
          </span>
          <button
            onClick={toggleLocale}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: 'rgba(196,181,253,0.85)',
              letterSpacing: '0.05em',
            }}
            aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {t.switchTo}
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {(['email', 'product'] as Step[]).map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                background: step === 'email' && i === 0
                  ? '#7c3aed'
                  : step === 'product' && i <= 1
                  ? '#7c3aed'
                  : 'rgba(139,92,246,0.15)',
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >

          {/* ── STEP EMAIL ── */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <h1
                  className="text-2xl font-black mb-2"
                  style={{ color: '#fff', lineHeight: 1.2 }}
                >
                  {t.emailTitle}
                </h1>
                <p className="text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>
                  {t.emailSubtitle}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                  {t.firstName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.firstNamePh}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    color: '#fff',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.emailPh}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    color: '#fff',
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: 'rgba(167,139,250,0.4)' }}>
                  {t.emailHelp}
                </p>
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                  color: '#fff',
                  fontSize: 15,
                }}
              >
                {t.generateBtn} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── STEP PRODUCT ── */}
          {step === 'product' && (
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <h2
                  className="text-xl font-black mb-1"
                  style={{ color: '#fff', lineHeight: 1.2 }}
                >
                  {t.productTitle}
                </h2>
                <p className="text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>
                  {t.productSubtitle}
                </p>
              </div>

              {/* Toggle URL / Manuel */}
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {([['url', t.modeUrl, Link2], ['manual', t.modeManual, Pencil]] as const).map(
                  ([mode, label, Icon]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setInputMode(mode)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: inputMode === mode ? 'rgba(124,58,237,0.25)' : 'transparent',
                        color: inputMode === mode ? '#a78bfa' : 'rgba(167,139,250,0.5)',
                        border: inputMode === mode ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  )
                )}
              </div>

              {inputMode === 'url' ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                    {t.urlLabel}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder={t.urlPh}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: '#fff',
                    }}
                  />
                  <p className="text-xs mt-1.5" style={{ color: 'rgba(167,139,250,0.4)' }}>
                    {t.urlHelp}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                      {t.productNameLabel}
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      placeholder={t.productNamePh}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                      {t.productDescLabel} <span style={{ color: 'rgba(167,139,250,0.4)' }}>{t.productDescOptional}</span>
                    </label>
                    <textarea
                      value={productDesc}
                      onChange={e => setProductDesc(e.target.value)}
                      placeholder={t.productDescPh}
                      rows={3}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
              )}

              {/* Captcha anti-bot — invisible si l'env var n'est pas posée */}
              <Turnstile
                onToken={setCaptchaToken}
                onError={() => setCaptchaToken(null)}
                onExpire={() => setCaptchaToken(null)}
              />

              <button
                type="submit"
                disabled={captchaRequired && !captchaToken}
                className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                  color: '#fff',
                  fontSize: 15,
                }}
              >
                <Sparkles className="w-4 h-4" />
                {t.generateBtnFinal}
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(null) }}
                className="w-full text-sm text-center"
                style={{ color: 'rgba(167,139,250,0.5)' }}
              >
                {t.back}
              </button>
            </form>
          )}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {t.trust.map(label => (
            <span key={label} className="text-xs" style={{ color: 'rgba(167,139,250,0.45)' }}>
              ✓ {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
