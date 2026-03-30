'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Mot de passe minimum 8 caractères'); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-black text-2xl text-gray-900">KONVERT</span>
          <p className="text-gray-500 text-sm mt-2">Crée ton compte gratuitement</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Alex"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Mot de passe</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <p className="text-center text-xs text-gray-400">
            En créant un compte tu acceptes nos conditions d'utilisation
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="font-bold text-purple-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
