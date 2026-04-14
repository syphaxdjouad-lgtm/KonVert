'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileName, sendPasswordReset, deleteAccount } from './actions'
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react'

interface Props {
  initialName: string
  email: string
  showPasswordOnly?: boolean
  showDeleteOnly?: boolean
}

export default function SettingsClient({ initialName, showPasswordOnly, showDeleteOnly }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // ── Profil
  const [name, setName]           = useState(initialName)
  const [nameMsg, setNameMsg]     = useState<{ ok: boolean; text: string } | null>(null)

  // ── Password
  const [pwMsg, setPwMsg]         = useState<{ ok: boolean; text: string } | null>(null)

  // ── Delete
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null)

  // ─── Handlers ────────────────────────────────────────────────────

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name)
    startTransition(async () => {
      const res = await updateProfileName(fd)
      if ('error' in res) setNameMsg({ ok: false, text: res.error ?? 'Erreur' })
      else setNameMsg({ ok: true, text: 'Nom mis à jour ✓' })
      setTimeout(() => setNameMsg(null), 3000)
    })
  }

  async function handlePasswordReset() {
    startTransition(async () => {
      const res = await sendPasswordReset()
      if ('error' in res) setPwMsg({ ok: false, text: res.error ?? 'Erreur' })
      else setPwMsg({ ok: true, text: 'Email envoyé — vérifie ta boîte mail' })
      setTimeout(() => setPwMsg(null), 5000)
    })
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'SUPPRIMER') {
      setDeleteMsg('Tape exactement "SUPPRIMER" pour confirmer')
      return
    }
    startTransition(async () => {
      const res = await deleteAccount()
      if ('error' in res) setDeleteMsg(res.error ?? 'Erreur')
      else router.push('/')
    })
  }

  // ─── Password only ───────────────────────────────────────────────

  if (showPasswordOnly) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handlePasswordReset}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
          style={{ background: '#F5F4FA', color: '#0f0f1e' }}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Réinitialiser
        </button>
        {pwMsg && (
          <span className="text-[12px] font-medium" style={{ color: pwMsg.ok ? '#16a34a' : '#ef4444' }}>
            {pwMsg.text}
          </span>
        )}
      </div>
    )
  }

  // ─── Delete only ─────────────────────────────────────────────────

  if (showDeleteOnly) {
    return (
      <>
        <button
          onClick={() => setDeleteOpen(true)}
          className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
        >
          Supprimer
        </button>

        {/* Modal confirmation */}
        {deleteOpen && (
          <div
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDeleteOpen(false)}
          >
            <div
              className="rounded-2xl p-6 w-full max-w-md"
              style={{ background: '#fff', border: '1px solid #fecaca' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <div className="font-black text-[15px]" style={{ color: '#0f0f1e' }}>Supprimer mon compte</div>
                  <div className="text-[12px]" style={{ color: '#6b6b84' }}>Action irréversible</div>
                </div>
              </div>

              <p className="text-[13px] mb-4" style={{ color: '#374151' }}>
                Toutes tes pages, stores et données seront définitivement supprimés. Tape <strong>SUPPRIMER</strong> pour confirmer.
              </p>

              <input
                type="text"
                value={deleteConfirm}
                onChange={e => { setDeleteConfirm(e.target.value); setDeleteMsg(null) }}
                placeholder="SUPPRIMER"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none mb-3"
                style={{ border: '1px solid #fecaca', background: '#fff5f5' }}
              />

              {deleteMsg && (
                <p className="text-[12px] mb-3 font-medium" style={{ color: '#ef4444' }}>{deleteMsg}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); setDeleteMsg(null) }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ background: '#F5F4FA', color: '#6b6b84' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ─── Profil form (default) ────────────────────────────────────────

  return (
    <form onSubmit={handleUpdateName} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ton nom"
        className="flex-1 px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
        style={{ border: '1px solid #E4E2EE', background: '#F5F4FA', color: '#0f0f1e' }}
        onFocus={e => (e.currentTarget.style.borderColor = '#7c3aed')}
        onBlur={e => (e.currentTarget.style.borderColor = '#E4E2EE')}
      />
      <button
        type="submit"
        disabled={isPending || name === initialName}
        className="px-4 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all"
        style={{
          background: name !== initialName ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#F5F4FA',
          color: name !== initialName ? '#fff' : '#9090a8',
        }}
      >
        {isPending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : nameMsg?.ok
            ? <CheckCircle className="w-4 h-4" />
            : null
        }
        {nameMsg ? nameMsg.text : 'Sauvegarder'}
      </button>
    </form>
  )
}
