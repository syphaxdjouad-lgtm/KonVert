'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Zap } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
      {/* Glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VERT</span>
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'rgba(167,139,250,0.6)' }}>Connecte-toi à ton compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="rounded-3xl p-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>

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
            <label className="block text-[13px] font-bold mb-1.5" style={{ color: 'rgba(196,181,253,0.8)' }}>Mot de passe</label>
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
            <div className="rounded-xl p-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
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
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
              : <><ArrowRight className="w-4 h-4" /> Se connecter</>
            }
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'rgba(167,139,250,0.5)' }}>
          Pas encore de compte ?{' '}
          <Link href="/signup" className="font-bold" style={{ color: '#a78bfa' }}>
            Rejoindre la bêta
          </Link>
        </p>
      </div>
    </div>
  )
}
