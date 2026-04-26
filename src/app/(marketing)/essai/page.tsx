'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2, Link2, Pencil, Sparkles } from 'lucide-react'
import { Turnstile } from '@/components/Turnstile'

type Step = 'email' | 'product' | 'generating'
type InputMode = 'url' | 'manual'

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

  // Champs
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  // Pré-remplir l'email si passé en query param (ex: depuis ExitIntentPopup)
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setStep('product')
    }
  }, [searchParams])
  const [url, setUrl] = useState('')
  const [productName, setProductName] = useState('')
  const [productDesc, setProductDesc] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loadingText, setLoadingText] = useState('Analyse du produit...')
  // Captcha — vide tant que Turnstile n'a pas validé. En dev sans clé, le composant
  // appelle onToken('') immédiatement et le serveur bypass aussi.
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // ── Étape 1 : email ──────────────────────────────────────────────────────
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Entre un email valide.')
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
      setError('Colle l\'URL du produit.')
      return
    }
    if (inputMode === 'manual' && !productName.trim()) {
      setError('Entre le nom du produit.')
      return
    }
    if (captchaRequired && !captchaToken) {
      setError('Patiente quelques secondes — vérification anti-bot en cours.')
      return
    }

    setStep('generating')

    // Textes animés pendant la génération
    const texts = [
      'Analyse du produit...',
      'Rédaction du copy de vente...',
      'Optimisation SEO...',
      'Finalisation de la page...',
    ]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % texts.length
      setLoadingText(texts[i])
    }, 1800)

    try {
      const body: Record<string, unknown> = {
        email,
        name: name || undefined,
        turnstileToken: captchaToken ?? '',
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
        setStep('product')
        setError(data.error || 'Une erreur est survenue. Réessaie.')
        return
      }

      router.push(`/preview/${data.preview_id}`)
    } catch {
      clearInterval(interval)
      setStep('product')
      setError('Erreur réseau. Vérifie ta connexion et réessaie.')
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
            Ça prend environ 30 secondes.
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

        {/* Logo */}
        <div className="text-center mb-10">
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>KON</span>
            <span style={{ color: '#a78bfa' }}>VERT</span>
          </span>
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
                  Génère ta première page gratuitement
                </h1>
                <p className="text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>
                  Aucune CB. Résultat en 30 secondes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                  Ton prénom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex : Ahmed"
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
                  Où on envoie ta page ?
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    color: '#fff',
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: 'rgba(167,139,250,0.4)' }}>
                  On t&apos;envoie aussi le lien pour la modifier.
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
                Générer ma page <ArrowRight className="w-4 h-4" />
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
                  Ton produit
                </h2>
                <p className="text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>
                  Colle un lien ou entre les infos manuellement.
                </p>
              </div>

              {/* Toggle URL / Manuel */}
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {([['url', 'Lien produit', Link2], ['manual', 'Saisie manuelle', Pencil]] as const).map(
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
                    URL du produit
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://aliexpress.com/item/..."
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: '#fff',
                    }}
                  />
                  <p className="text-xs mt-1.5" style={{ color: 'rgba(167,139,250,0.4)' }}>
                    AliExpress, Amazon, Shopify — KONVERT scrape automatiquement.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>
                      Nom du produit
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      placeholder="Ex : Montre connectée sport"
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
                      Description courte <span style={{ color: 'rgba(167,139,250,0.4)' }}>(optionnel)</span>
                    </label>
                    <textarea
                      value={productDesc}
                      onChange={e => setProductDesc(e.target.value)}
                      placeholder="Ce que fait le produit, pour qui, bénéfices..."
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
                Générer ma page en 30 secondes
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(null) }}
                className="w-full text-sm text-center"
                style={{ color: 'rgba(167,139,250,0.5)' }}
              >
                ← Retour
              </button>
            </form>
          )}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {['Aucune CB', 'Résultat immédiat', '100% gratuit'].map(t => (
            <span key={t} className="text-xs" style={{ color: 'rgba(167,139,250,0.45)' }}>
              ✓ {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
