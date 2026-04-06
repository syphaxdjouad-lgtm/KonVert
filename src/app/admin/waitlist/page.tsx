'use client'

import { useState, useEffect } from 'react'
import { Check, Mail, RefreshCw, Copy, Lock } from 'lucide-react'

type WaitlistEntry = {
  id: string
  email: string
  name: string | null
  context: string | null
  status: 'pending' | 'invited' | 'registered'
  created_at: string
  invited_at: string | null
}

type Invitation = {
  id: string
  email: string
  token: string
  used: boolean
  expires_at: string
  created_at: string
}

export default function AdminWaitlist() {
  const [secret, setSecret]           = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError]     = useState(false)
  const [waitlist, setWaitlist]       = useState<WaitlistEntry[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading]         = useState(false)
  const [inviting, setInviting]       = useState<string | null>(null)
  const [copied, setCopied]           = useState<string | null>(null)
  const [tab, setTab]                 = useState<'waitlist' | 'invitations'>('waitlist')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAuthError(false)
    const res = await fetch('/api/admin/waitlist', {
      headers: { 'x-admin-secret': secret },
    })
    if (res.status === 401) {
      setAuthError(true)
      setLoading(false)
      return
    }
    const data = await res.json()
    setWaitlist(data.waitlist || [])
    setInvitations(data.invitations || [])
    setAuthenticated(true)
    setLoading(false)
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/waitlist', {
      headers: { 'x-admin-secret': secret },
    })
    const data = await res.json()
    setWaitlist(data.waitlist || [])
    setInvitations(data.invitations || [])
    setLoading(false)
  }

  useEffect(() => { /* chargement déclenché après login */ }, [])

  async function invite(entry: WaitlistEntry) {
    setInviting(entry.id)
    const res = await fetch('/api/admin/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ email: entry.email, waitlist_id: entry.id }),
    })
    const data = await res.json()
    if (data.url) {
      await navigator.clipboard.writeText(data.url)
      setCopied(entry.id)
      setTimeout(() => setCopied(null), 3000)
    }
    await load()
    setInviting(null)
  }

  async function copyInviteLink(token: string) {
    const url = `${window.location.origin}/signup?token=${token}`
    await navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const pending    = waitlist.filter(w => w.status === 'pending')
  const invited    = waitlist.filter(w => w.status === 'invited')
  const registered = waitlist.filter(w => w.status === 'registered')

  if (!authenticated) {
    return (
      <div style={{ background: '#F6F6F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <form onSubmit={login} className="bg-white rounded-2xl p-8 w-full max-w-sm" style={{ border: '1px solid #E3E3E8' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[15px] font-black" style={{ color: '#1a1a2e' }}>Admin · KonVert</div>
              <div className="text-[12px]" style={{ color: '#8b8b9e' }}>Accès restreint</div>
            </div>
          </div>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-[14px] mb-3 outline-none"
            style={{ border: `1px solid ${authError ? '#e11d48' : '#E3E3E8'}`, color: '#1a1a2e' }}
          />
          {authError && (
            <p className="text-[12px] mb-3" style={{ color: '#e11d48' }}>Mot de passe incorrect.</p>
          )}
          <button
            type="submit"
            disabled={loading || !secret}
            className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', opacity: loading || !secret ? 0.6 : 1 }}
          >
            {loading ? 'Vérification...' : 'Accéder'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ background: '#F6F6F7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E3E3E8' }}>
        <div>
          <h1 className="text-xl font-black" style={{ color: '#1a1a2e' }}>Admin · Waitlist</h1>
          <p className="text-[13px]" style={{ color: '#8b8b9e' }}>Gestion des inscriptions bêta fermée</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold"
          style={{ background: '#fff', border: '1px solid #E3E3E8', color: '#5c5c7a' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'En attente', value: pending.length,    color: '#f59e0b' },
            { label: 'Invités',    value: invited.length,    color: '#7c3aed' },
            { label: 'Inscrits',   value: registered.length, color: '#16a34a' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E3E3E8' }}>
              <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-[13px]" style={{ color: '#8b8b9e' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['waitlist', 'invitations'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl text-[13px] font-bold transition-all"
              style={tab === t
                ? { background: '#7c3aed', color: '#fff' }
                : { background: '#fff', color: '#5c5c7a', border: '1px solid #E3E3E8' }
              }
            >
              {t === 'waitlist' ? `Waitlist (${waitlist.length})` : `Invitations (${invitations.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-[13px]" style={{ color: '#8b8b9e' }}>Chargement...</div>
        ) : tab === 'waitlist' ? (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E3E3E8' }}>
            {waitlist.length === 0 ? (
              <div className="text-center py-12 text-[13px]" style={{ color: '#8b8b9e' }}>Aucune inscription pour l&apos;instant</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E3E3E8', background: '#F6F6F7' }}>
                    {['Nom / Email', 'Profil', 'Inscrit le', 'Statut', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8b8b9e' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry, i) => (
                    <tr key={entry.id} style={{ borderBottom: i < waitlist.length - 1 ? '1px solid #F0F0F5' : 'none' }}>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[13px]" style={{ color: '#1a1a2e' }}>{entry.name || '—'}</div>
                        <div className="text-[12px]" style={{ color: '#8b8b9e' }}>{entry.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12px] px-2 py-1 rounded-lg" style={{ background: '#F6F6F7', color: '#5c5c7a' }}>
                          {entry.context || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px]" style={{ color: '#8b8b9e' }}>
                        {new Date(entry.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: entry.status === 'pending' ? '#fffbeb' : entry.status === 'invited' ? '#f3f0ff' : '#f0fdf4',
                            color:      entry.status === 'pending' ? '#d97706' : entry.status === 'invited' ? '#7c3aed' : '#16a34a',
                          }}
                        >
                          {entry.status === 'pending' ? '⏳ En attente' : entry.status === 'invited' ? '📧 Invité' : '✓ Inscrit'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.status === 'pending' && (
                          <button
                            onClick={() => invite(entry)}
                            disabled={inviting === entry.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff' }}
                          >
                            {copied === entry.id
                              ? <><Check className="w-3 h-3" /> Copié !</>
                              : inviting === entry.id
                                ? 'Envoi...'
                                : <><Mail className="w-3 h-3" /> Inviter</>
                            }
                          </button>
                        )}
                        {entry.status === 'invited' && (
                          <span className="text-[12px]" style={{ color: '#8b8b9e' }}>
                            {entry.invited_at ? new Date(entry.invited_at).toLocaleDateString('fr-FR') : '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E3E3E8' }}>
            {invitations.length === 0 ? (
              <div className="text-center py-12 text-[13px]" style={{ color: '#8b8b9e' }}>Aucune invitation générée</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E3E3E8', background: '#F6F6F7' }}>
                    {['Email', 'Token', 'Expire le', 'Statut', 'Lien'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8b8b9e' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv, i) => (
                    <tr key={inv.id} style={{ borderBottom: i < invitations.length - 1 ? '1px solid #F0F0F5' : 'none' }}>
                      <td className="px-4 py-3.5 text-[13px]" style={{ color: '#1a1a2e' }}>{inv.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px]" style={{ color: '#8b8b9e' }}>{inv.token.slice(0, 12)}...</span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px]" style={{ color: '#8b8b9e' }}>
                        {new Date(inv.expires_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[11px] font-bold px-2 py-1 rounded-full"
                          style={{
                            background: inv.used ? '#f0fdf4' : new Date(inv.expires_at) < new Date() ? '#fff1f2' : '#f3f0ff',
                            color:      inv.used ? '#16a34a' : new Date(inv.expires_at) < new Date() ? '#e11d48' : '#7c3aed',
                          }}
                        >
                          {inv.used ? '✓ Utilisé' : new Date(inv.expires_at) < new Date() ? '⏰ Expiré' : '⏳ Actif'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {!inv.used && (
                          <button
                            onClick={() => copyInviteLink(inv.token)}
                            className="flex items-center gap-1 text-[12px] font-semibold"
                            style={{ color: '#7c3aed' }}
                          >
                            {copied === inv.token ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied === inv.token ? 'Copié' : 'Copier'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
