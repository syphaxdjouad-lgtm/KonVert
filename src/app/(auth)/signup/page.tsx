'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Lock, Sparkles, ArrowRight, Loader2, Zap, Star, Users, FileText } from 'lucide-react'

function SignupContent() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [name, setName]             = useState('')
  const [loading, setLoading]       = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenEmail, setTokenEmail] = useState<string | null>(null)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get('token')

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
    if (authError) { setError(authError.message); setLoading(false); return }
    if (token) {
      await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    }
    router.push('/dashboard')
  }

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

  if (tokenValid === false) {
    return <WaitlistGate />
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0d1a' }}>

      {/* ── PANNEAU GAUCHE — Formulaire ── */}
      <div className="flex flex-col justify-center px-8 py-12 w-full md:w-[480px] md:min-w-[480px] relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-sm mx-auto relative">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                <Zap style={{ width: '18px', height: '18px', color: '#fff' }} />
              </div>
              <span className="font-black text-xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                <span style={{ color: '#fff' }}>KON</span>
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
              </span>
            </Link>
          </div>

          {/* Badge invitation */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#16a34a' }}>
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>Invitation valide — Bienvenue dans la bêta</span>
          </div>

          <h1 className="text-2xl font-black text-white mb-1">Crée ton compte.</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(167,139,250,0.6)' }}>Tu es à 30 secondes de ta première landing page.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Prénom</label>
              <input
                type="text" required value={name}
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
                type="email" required value={email}
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
                type="password" required value={password}
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
              type="submit" disabled={loading}
              className="w-full font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
                : <><Sparkles className="w-4 h-4" /> Créer mon compte</>}
            </button>

            <p className="text-center text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
              En créant un compte tu acceptes nos <Link href="/legal/cgu" className="underline hover:text-white transition-colors">CGU</Link>
            </p>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(167,139,250,0.5)' }}>
            Déjà un compte ?{' '}
            <Link href="/login" className="font-bold" style={{ color: '#a78bfa' }}>Se connecter</Link>
          </p>
        </div>
      </div>

      {/* ── PANNEAU DROIT — Visuel ── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(13,13,26,1) 60%)' }}>

        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-md w-full space-y-6">
          {/* Titre */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(167,139,250,0.6)' }}>Ce qui t&apos;attend</p>
            <h2 className="text-2xl font-black text-white leading-tight">
              Des landing pages qui convertissent.<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>En 30 secondes.</span>
            </h2>
          </div>

          {/* Features list */}
          <div className="space-y-3">
            {[
              { icon: <Zap className="w-4 h-4" />, title: 'Génération IA instantanée', desc: 'Colle une URL → page optimisée prête à publier' },
              { icon: <FileText className="w-4 h-4" />, title: '5 templates premium', desc: 'Shein Pro, Minimal Dark, Bold Sales et plus' },
              { icon: <Users className="w-4 h-4" />, title: 'Shopify & WooCommerce', desc: 'Publie en 1 clic directement dans ton store' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.12)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{f.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.55)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Note globale */}
          <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div>
              <div className="text-2xl font-black text-white">4.9</div>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(139,92,246,0.2)', paddingLeft: '16px' }}>
              <div className="text-sm font-bold text-white">247 utilisateurs</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.55)' }}>97% recommanderaient KONVERT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaitlistGate() {
  return (
    <div className="min-h-screen flex" style={{ background: '#0d0d1a' }}>
      <div className="flex flex-col justify-center px-8 py-12 w-full md:w-[480px] md:min-w-[480px] relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-sm mx-auto relative">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                <Zap style={{ width: '18px', height: '18px', color: '#fff' }} />
              </div>
              <span className="font-black text-xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                <span style={{ color: '#fff' }}>KON</span>
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
              </span>
            </Link>
          </div>

          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Lock className="w-6 h-6" style={{ color: '#a78bfa' }} />
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Bêta fermée</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(196,181,253,0.6)' }}>
            KONVERT est en bêta privée. Rejoins la liste d&apos;attente pour être invité en priorité.
          </p>

          <WaitlistMiniForm />

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(167,139,250,0.5)' }}>
            Déjà une invitation ?{' '}
            <Link href="/login" className="font-bold" style={{ color: '#a78bfa' }}>Se connecter</Link>
          </p>
        </div>
      </div>

      {/* Panneau droit bêta */}
      <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(13,13,26,1) 60%)' }}>
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-2xl font-black text-white mb-3">Sois parmi les premiers.</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,139,250,0.6)' }}>
            Les membres bêta obtiennent un accès prioritaire, des tarifs exclusifs et influencent directement les prochaines fonctionnalités.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex -space-x-2">
              {['photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330', 'photo-1472099645785-5658abf4ff4e'].map(id => (
                <img key={id} src={`https://images.unsplash.com/${id}?w=32&h=32&fit=crop&crop=face`}
                  className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid #0d0d1a' }} alt="" />
              ))}
            </div>
            <span className="text-sm font-semibold" style={{ color: 'rgba(196,181,253,0.8)' }}>+200 sur la liste d&apos;attente</span>
          </div>
        </div>
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
    const res  = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, context }),
    })
    const data = await res.json()
    setStatus(data.message === 'already_registered' ? 'exists' : 'success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(74,222,128,0.15)' }}>
          <Check className="w-6 h-6" style={{ color: '#4ade80' }} />
        </div>
        <p className="font-black text-white mb-1">Tu es sur la liste !</p>
        <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>On t&apos;envoie ton invitation dès qu&apos;une place se libère.</p>
      </div>
    )
  }

  if (status === 'exists') {
    return (
      <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <p className="text-sm font-semibold" style={{ color: '#fbbf24' }}>Tu es déjà inscrit sur la waitlist !</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton prénom" required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
        onFocus={e => (e.target.style.borderColor = '#7c3aed')}
        onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
      />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
        onFocus={e => (e.target.style.borderColor = '#7c3aed')}
        onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
      />
      <select value={context} onChange={e => setContext(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: context ? '#fff' : 'rgba(167,139,250,0.5)' }}>
        <option value="" style={{ background: '#1a0533' }}>Mon profil...</option>
        <option value="dropshippeur" style={{ background: '#1a0533' }}>Dropshippeur</option>
        <option value="ecommerce" style={{ background: '#1a0533' }}>E-commerçant</option>
        <option value="agence" style={{ background: '#1a0533' }}>Agence / Freelance</option>
        <option value="autre" style={{ background: '#1a0533' }}>Autre</option>
      </select>
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
        {status === 'loading'
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <><ArrowRight className="w-4 h-4" /> Rejoindre la bêta</>}
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
