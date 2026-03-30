'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, FileText, Store, ExternalLink, Palette, Mail, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AgencyPage() {
  const [workspaces, setWorkspaces]   = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [creating, setCreating]       = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', client_name: '', client_email: '', brand_name: '', brand_color: '#7c3aed',
  })

  useEffect(() => { loadWorkspaces() }, [])

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
    if (!res.ok) {
      setError(json.error)
      setCreating(false)
      return
    }
    setShowForm(false)
    setForm({ name: '', client_name: '', client_email: '', brand_name: '', brand_color: '#7c3aed' })
    loadWorkspaces()
    setCreating(false)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mode Agence</h1>
          <p className="text-gray-500 mt-1">Gère tes clients dans des workspaces dédiés</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={createWorkspace} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-gray-900">Nouveau workspace client</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name',         label: 'Nom du workspace *', placeholder: 'Client Beauté Paris' },
              { key: 'client_name',  label: 'Nom du client',      placeholder: 'Sophie Martin' },
              { key: 'client_email', label: 'Email du client',    placeholder: 'sophie@boutique.fr' },
              { key: 'brand_name',   label: 'Nom de ta marque (white-label)', placeholder: 'Mon Agence' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required={key === 'name'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Couleur de marque</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brand_color}
                onChange={e => setForm({ ...form, brand_color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-sm text-gray-500 font-mono">{form.brand_color}</span>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setError(null) }}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={creating}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              {creating ? 'Création...' : 'Créer le workspace'}
            </button>
          </div>
        </form>
      )}

      {/* Liste workspaces */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header coloré */}
      <div className="h-2" style={{ background: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-black text-gray-900">{ws.name}</div>
            {ws.client_name && (
              <div className="text-sm text-gray-500 mt-0.5">Client : {ws.client_name}</div>
            )}
            {ws.brand_name && (
              <div className="flex items-center gap-1 mt-1">
                <Palette className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">White-label : {ws.brand_name}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <a
              href={`/api/workspaces/${ws.id}/report`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Rapport PDF
            </a>
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Mail className="w-3 h-3" /> Inviter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          <Stat icon={<FileText className="w-3.5 h-3.5" />} value={ws.pages?.[0]?.count || 0} label="pages" />
          <Stat icon={<Store className="w-3.5 h-3.5" />} value={ws.stores?.[0]?.count || 0} label="stores" />
          <Stat icon={<Users className="w-3.5 h-3.5" />} value={ws.members?.[0]?.count || 0} label="membres" />
        </div>

        {/* Formulaire invitation */}
        {showInvite && (
          <form onSubmit={invite} className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <input
              type="email" required value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="email@client.com"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white"
            >
              <option value="viewer">Lecteur</option>
              <option value="editor">Éditeur</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={inviting}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
              {inviting ? '...' : 'Inviter'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-gray-500">
      {icon}
      <span className="text-sm font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

function EmptyAgency({ onNew }: { onNew: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">Aucun client encore</h3>
      <p className="text-gray-500 text-sm mb-6">Crée un workspace pour chaque client et gère tout depuis ici</p>
      <button onClick={onNew}
        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors">
        <Plus className="w-4 h-4" /> Créer mon premier client
      </button>
    </div>
  )
}
