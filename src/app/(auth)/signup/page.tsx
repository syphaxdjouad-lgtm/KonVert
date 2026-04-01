'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Lock, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

function SignupContent() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [name, setName]             = useState('')
  const [loading, setLoading]       = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenEmail, setTokenEmail] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // Valide le token au chargement
  useEffect(() => {
    if (!token) { setTokenValid(false); return }
    setValidating(true)
    fetch(`/api/invitations/validate?token=${token}`)
      .then(r => r.json())
      .then(data => {
        setTokenValid(data.valid)
        if (data.email) { setTokenEmail(data.email); setEmail(data.email) }
      })
      .catch(() => setTokenValid(false))
      .finally(() => setValidating(false))
  }, [token])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Mot de passe minimum 8 caractères'); return }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Marque le token comme utilisé
    if (token) {
      await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    }

    router.push('/dashboard')
  }

  // Loading token validation
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#a78bfa' }} />
          <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>Vérification de l&apos;invitation...</p>
        </div>
      </div>
    )
  }

  // Token invalide / absent → page waitlist
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
            </span>
          </div>

          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Lock className="w-7 h-7" style={{ color: '#a78bfa' }} />
            </div>

            <h1 className="text-2xl font-black text-white mb-2">Bêta fermée</h1>
            <p className="text-sm mb-8" style={{ color: 'rgba(196,181,253,0.6)' }}>
              KONVERT est actuellement en bêta privée. Rejoins la liste d&apos;attente pour être invité en priorité.
            </p>

            <WaitlistMiniForm />

            <p className="mt-6 text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
              Déjà une invitation ?{' '}
              <Link href="/login" className="font-semibold" style={{ color: '#a78bfa' }}>Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Token valide → formulaire signup
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>KON</span>
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
          </span>
        </div>

        {/* Badge invitation */}
        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#16a34a' }}>
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>
            Invitation valide — Bienvenue dans la bêta
          </span>
        </div>

        <form onSubmit={handleSignup} className="rounded-3xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div>
            <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Prénom</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              readOnly={!!tokenEmail}
              placeholder="toi@exemple.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: tokenEmail ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${tokenEmail ? 'rgba(74,222,128,0.3)' : 'rgba(139,92,246,0.2)'}`,
                color: '#fff',
              }}
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
            />
          </div>

          {error && (
            <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            }}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
              : <><Sparkles className="w-4 h-4" /> Créer mon compte</>
            }
          </button>

          <p className="text-center text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
            En créant un compte tu acceptes nos <Link href="/legal/cgu" className="underline">CGU</Link>
          </p>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'rgba(167,139,250,0.5)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" className="font-bold" style={{ color: '#a78bfa' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

function WaitlistMiniForm() {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'exists'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, context }),
    })
    const data = await res.json()
    setStatus(data.message === 'already_registered' ? 'exists' : 'success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
        <div className="text-3xl mb-3">🎉</div>
        <p className="font-bold text-white mb-1">Tu es sur la liste !</p>
        <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>On t&apos;envoie ton invitation dès qu&apos;une place se libère.</p>
      </div>
    )
  }

  if (status === 'exists') {
    return (
      <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
        <p className="text-sm font-semibold" style={{ color: '#fbbf24' }}>✓ Tu es déjà inscrit sur la waitlist !</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ton prénom"
        required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="ton@email.com"
        required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
      />
      <select
        value={context}
        onChange={e => setContext(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', color: context ? '#fff' : 'rgba(167,139,250,0.5)' }}
      >
        <option value="" style={{ background: '#1a0533' }}>Mon profil...</option>
        <option value="dropshippeur" style={{ background: '#1a0533' }}>Dropshippeur</option>
        <option value="ecommerce" style={{ background: '#1a0533' }}>E-commerçant</option>
        <option value="agence" style={{ background: '#1a0533' }}>Agence / Freelance</option>
        <option value="autre" style={{ background: '#1a0533' }}>Autre</option>
      </select>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
      >
        {status === 'loading'
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <><ArrowRight className="w-4 h-4" /> Rejoindre la bêta</>
        }
      </button>
    </form>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#a78bfa' }} />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
