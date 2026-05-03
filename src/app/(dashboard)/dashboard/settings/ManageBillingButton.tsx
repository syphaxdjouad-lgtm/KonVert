'use client'

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openPortal() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error || 'Erreur portail')
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={openPortal}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:opacity-90"
        style={{ background: '#fff', color: '#374151', border: '1px solid #E4E2EE' }}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
        Gérer
      </button>
      {error && <p className="text-[11px] mt-1" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}
