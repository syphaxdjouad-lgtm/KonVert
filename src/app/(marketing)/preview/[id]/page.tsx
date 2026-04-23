'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Sparkles, Clock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PreviewData {
  id: string
  product_title: string
  html_content: string
  expires_at: string
  converted: boolean
}

function useCountdown(expiresAt: string | null) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!expiresAt) return

    function update() {
      const diff = new Date(expiresAt!).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Expirée'); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${days}j ${hours}h ${mins}m`)
    }

    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [expiresAt])

  return timeLeft
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timeLeft = useCountdown(data?.expires_at ?? null)

  useEffect(() => {
    if (!id) return

    fetch(`/api/preview/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) { setError(json.error); return }
        setData(json)
      })
      .catch(() => setError('Erreur réseau.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#a78bfa' }} />
          <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>Chargement de ta page...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0d1a' }}>
        <div className="text-center max-w-sm">
          <p className="text-lg font-bold mb-2" style={{ color: '#fff' }}>
            {error === 'Cette preview a expiré.' ? 'Cette page a expiré.' : 'Page introuvable'}
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(196,181,253,0.6)' }}>
            {error === 'Cette preview a expiré.'
              ? 'Les pages gratuites sont conservées 7 jours. Génère-en une nouvelle.'
              : 'Ce lien n\'existe pas ou a déjà été utilisé.'}
          </p>
          <Link
            href="/essai"
            className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff' }}
          >
            <Sparkles className="w-4 h-4" />
            Générer une nouvelle page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh' }}>

      {/* ── Barre de conversion (sticky top) ──────────────────────────── */}
      <div
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          background: 'rgba(13,13,26,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">

          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#fff' }}>KON</span>
              <span style={{ color: '#a78bfa' }}>VERT</span>
            </span>
            <span
              className="hidden sm:block text-sm"
              style={{ color: 'rgba(196,181,253,0.6)', borderLeft: '1px solid rgba(139,92,246,0.2)', paddingLeft: 12 }}
            >
              {data.product_title}
            </span>
          </div>

          {/* Countdown + Lock badge */}
          <div className="flex items-center gap-3">
            {timeLeft && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>
                  {timeLeft}
                </span>
              </div>
            )}

            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
              <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>Page verrouillée</span>
            </div>

            <Link
              href="/pricing"
              className="flex items-center gap-1.5 font-bold text-sm px-4 py-2 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              }}
            >
              Débloquer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Preview iframe ──────────────────────────────────────────────── */}
      <div className="relative">
        {/* Overlay de blocage sur les interactions */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: 'not-allowed' }}
          onClick={(e) => {
            e.preventDefault()
            router.push('/pricing')
          }}
        />

        <iframe
          srcDoc={data.html_content}
          className="w-full"
          style={{
            height: '100vh',
            border: 'none',
            pointerEvents: 'none',
          }}
          title={`Preview — ${data.product_title}`}
          sandbox="allow-scripts"
        />
      </div>

      {/* ── Barre CTA bas (sticky bottom) ──────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
        style={{
          background: 'rgba(13,13,26,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-sm" style={{ color: '#fff' }}>
                Cette page t&apos;appartient. Débloque-la pour l&apos;utiliser.
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.5)' }}>
                Modifier · Publier sur Shopify · Télécharger le HTML
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                color: '#fff',
                fontSize: 15,
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              }}
            >
              Choisir mon plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
