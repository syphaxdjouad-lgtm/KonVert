'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const emailParam   = searchParams.get('email') || ''

  const [email,    setEmail]    = useState(emailParam)
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message,  setMessage]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res  = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#fff' }}>

          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(22,163,74,0.08)' }}>
                <CheckCircle2 className="w-7 h-7" style={{ color: '#16a34a' }} />
              </div>
              <h2 className="text-xl font-black mb-2" style={{ color: '#111' }}>Désinscription confirmée</h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
                Tu ne recevras plus d'emails de KonVert à cette adresse.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold py-2.5 px-5 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
                  <Mail className="w-5 h-5" style={{ color: '#7c3aed' }} />
                </div>
                <div>
                  <h1 className="text-lg font-black" style={{ color: '#111' }}>Se désabonner</h1>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>Tu ne recevras plus nos emails</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>
                    Adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
                    onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full font-bold py-2.5 rounded-xl text-sm transition-all text-white"
                  style={{ background: status === 'loading' ? '#c4b5fd' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </span>
                  ) : 'Confirmer la désinscription'}
                </button>

                <p className="text-center text-xs" style={{ color: '#9ca3af' }}>
                  Conformément au RGPD, ta demande sera traitée sous 72h.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/" className="hover:underline">KonVert</Link> · <Link href="/legal" className="hover:underline">Mentions légales</Link>
        </p>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  )
}
