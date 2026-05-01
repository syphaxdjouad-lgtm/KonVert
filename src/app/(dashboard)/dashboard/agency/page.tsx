'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, FileText, Store, ExternalLink, Palette, Mail, Zap, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AgencyPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [plan, setPlan]             = useState<string>('starter')
  const [showForm, setShowForm]     = useState(false)
  const [creating, setCreating]     = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', client_name: '', client_email: '', brand_name: '', brand_color: '#7c3aed',
  })

  useEffect(() => {
    loadWorkspaces()
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('users').select('plan').eq('id', user.id).single().then(({ data }) => {
        if (data?.plan) setPlan(data.plan)
      })
    })
  }, [])

  async function loadWorkspaces() {
    const res  = await fetch('/api/workspaces')
    const json = await res.json()
    if (json.error === 'Non authentifié') { window.location.href = '/login'; return }
    setWorkspaces(json.data || [])
    setLoading(false)
  }

  async function createWorkspace(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    const res  = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error); setCreating(false); return }
    setShowForm(false)
    setForm({ name: '', client_name: '', client_email: '', brand_name: '', brand_color: '#7c3aed' })
    loadWorkspaces()
    setCreating(false)
  }

  if (!loading && plan !== 'agency') {
    return (
      <div className="p-8 max-w-lg mx-auto text-center py-24">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
          <Lock className="w-8 h-8" style={{ color: '#7c3aed' }} />
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: '#111' }}>Fonctionnalité Agency</h2>
        <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
          Les workspaces clients et le mode white-label sont réservés au plan Agency.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
        >
          Passer au plan Agency — 199€/mois
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#111' }}>Mode Agence</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {workspaces.length > 0 ? `${workspaces.length} client${workspaces.length > 1 ? 's' : ''} actif${workspaces.length > 1 ? 's' : ''}` : 'Gère tes clients dans des workspaces dédiés'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all hover:opacity-90 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
        >
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={createWorkspace} className="rounded-2xl p-6 mb-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
              <Users className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <h3 className="font-black" style={{ color: '#111' }}>Nouveau workspace client</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name',         label: 'Nom du workspace *',              placeholder: 'Client Beauté Paris' },
              { key: 'client_name',  label: 'Nom du client',                   placeholder: 'Sophie Martin' },
              { key: 'client_email', label: 'Email du client',                 placeholder: 'sophie@boutique.fr' },
              { key: 'brand_name',   label: 'Nom de ta marque (white-label)',  placeholder: 'Mon Agence' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required={key === 'name'}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
                  onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>Couleur de marque</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brand_color}
                onChange={e => setForm({ ...form, brand_color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer"
                style={{ border: '1px solid #e5e7eb' }}
              />
              <span className="text-sm font-mono" style={{ color: '#6b7280' }}>{form.brand_color}</span>
              <div className="w-6 h-6 rounded-lg" style={{ background: form.brand_color }} />
            </div>
          </div>

          {error && (
            <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => { setShowForm(false); setError(null) }}
              className="flex-1 font-bold py-2.5 rounded-xl text-sm"
              style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}>
              Annuler
            </button>
            <button type="submit" disabled={creating}
              className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              style={{ background: creating ? '#c4b5fd' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {creating ? 'Création...' : 'Créer le workspace'}
            </button>
          </div>
        </form>
      )}

      {/* Liste workspaces */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: '#f3f4f6' }} />)}
        </div>
      ) : workspaces.length === 0 && !showForm ? (
        <EmptyAgency onNew={() => setShowForm(true)} />
      ) : (
        <div className="space-y-4">
          {workspaces.map(ws => <WorkspaceCard key={ws.id} workspace={ws} />)}
        </div>
      )}
    </div>
  )
}

function WorkspaceCard({ workspace: ws }: { workspace: any }) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState('viewer')
  const [inviting, setInviting]       = useState(false)
  const color = ws.brand_color || '#7c3aed'

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    await fetch(`/api/workspaces/${ws.id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    })
    setInviteEmail('')
    setShowInvite(false)
    setInviting(false)
  }

  const initials = ws.name?.slice(0, 2).toUpperCase() || 'WS'

  return (
    <div className="rounded-2xl overflow-hidden transition-shadow hover:shadow-sm" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      {/* Bande couleur marque */}
      <div className="h-1.5" style={{ background: color }} />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar workspace */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ background: color }}>
              {initials}
            </div>
            <div>
              <div className="font-black" style={{ color: '#111' }}>{ws.name}</div>
              {ws.client_name && (
                <div className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Client : {ws.client_name}</div>
              )}
              {ws.brand_name && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Palette className="w-3 h-3" style={{ color: '#9ca3af' }} />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>White-label : {ws.brand_name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`/api/workspaces/${ws.id}/report`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
            >
              <ExternalLink className="w-3 h-3" /> Rapport PDF
            </a>
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: '1px solid rgba(124,58,237,0.3)', color: '#7c3aed', background: 'rgba(124,58,237,0.05)' }}
            >
              <Mail className="w-3 h-3" />
              Inviter
              {showInvite ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mt-5 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          {[
            { icon: <FileText className="w-3.5 h-3.5" />, value: ws.pages?.[0]?.count || 0, label: 'pages' },
            { icon: <Store className="w-3.5 h-3.5" />,    value: ws.stores?.[0]?.count || 0, label: 'stores' },
            { icon: <Users className="w-3.5 h-3.5" />,    value: ws.members?.[0]?.count || 0, label: 'membres' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
              {s.icon}
              <span className="text-sm font-black" style={{ color: '#374151' }}>{s.value}</span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Formulaire invitation */}
        {showInvite && (
          <form onSubmit={invite} className="mt-4 pt-4 flex gap-2" style={{ borderTop: '1px solid #f3f4f6' }}>
            <input
              type="email" required value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="email@client.com"
              className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={{ border: '1px solid #e5e7eb', background: '#fff', color: '#374151' }}
            >
              <option value="viewer">Lecteur</option>
              <option value="editor">Éditeur</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={inviting}
              className="text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
              style={{ background: inviting ? '#c4b5fd' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {inviting ? '...' : 'Inviter'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function EmptyAgency({ onNew }: { onNew: () => void }) {
  return (
    <div className="text-center py-24 rounded-2xl" style={{ border: '2px dashed #e5e7eb', background: '#fff' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <Zap className="w-8 h-8" style={{ color: '#7c3aed' }} />
      </div>
      <h3 className="font-black text-lg mb-2" style={{ color: '#111' }}>Aucun client encore</h3>
      <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
        Crée un workspace par client et gère leurs pages, stores et membres depuis ici
      </p>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      >
        <Plus className="w-4 h-4" /> Créer mon premier client
      </button>
    </div>
  )
}
