'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Zap, Star, TrendingUp, MousePointerClick } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0d1a' }}>

      {/* ── PANNEAU GAUCHE — Formulaire ── */}
      <div className="flex flex-col justify-center px-8 py-12 w-full md:w-[480px] md:min-w-[480px] relative z-10">
        {/* Glow derrière le form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-sm mx-auto relative">
          {/* Logo */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                <Zap className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="font-black text-xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                <span style={{ color: '#fff' }}>KON</span>
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
              </span>
            </Link>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-black text-white mb-1">Bon retour.</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(167,139,250,0.6)' }}>Connecte-toi pour accéder à ton dashboard.</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-bold" style={{ color: 'rgba(196,181,253,0.8)' }}>Mot de passe</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
              />
            </div>

            {error && (
              <div className="rounded-xl p-3 text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
                : <><ArrowRight className="w-4 h-4" /> Se connecter</>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(167,139,250,0.5)' }}>
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-bold" style={{ color: '#a78bfa' }}>Rejoindre la bêta</Link>
          </p>
        </div>
      </div>

      {/* ── PANNEAU DROIT — Social proof ── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(13,13,26,1) 60%)' }}>

        {/* Grille de fond */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glow central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-md w-full space-y-6">
          {/* Mockup dashboard */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
            {/* Browser bar */}
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              </div>
              <div className="flex-1 mx-3 py-1 px-3 rounded-md text-[11px] font-mono text-center" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(167,139,250,0.6)' }}>
                app.konvert.io/dashboard
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=400&fit=crop&q=80"
              alt="Dashboard KONVERT"
              className="w-full object-cover"
              style={{ height: '220px' }}
            />
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <TrendingUp className="w-4 h-4" />, value: '+300%', label: 'CTR moyen', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
              { icon: <MousePointerClick className="w-4 h-4" />, value: '28s', label: 'Génération', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
              { icon: <Star className="w-4 h-4" />, value: '4.9/5', label: '247 avis', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
            ].map(m => (
              <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: m.bg, border: `1px solid ${m.bg.replace('0.08', '0.2')}` }}>
                <div className="flex justify-center mb-1" style={{ color: m.color }}>{m.icon}</div>
                <div className="text-base font-black" style={{ color: m.color }}>{m.value}</div>
                <div className="text-[10px] font-semibold" style={{ color: 'rgba(167,139,250,0.5)' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Témoignage */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(196,181,253,0.8)' }}>
              &ldquo;Mon CTR est passé de 1.2% à 4.8% sur ma première page générée. En 30 secondes j&apos;avais un résultat meilleur que 4 heures de travail.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="Karim B."
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: '2px solid rgba(139,92,246,0.3)' }}
              />
              <div>
                <div className="text-xs font-bold text-white">Karim B.</div>
                <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.5)' }}>Dropshippeur · 3 stores Shopify</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
