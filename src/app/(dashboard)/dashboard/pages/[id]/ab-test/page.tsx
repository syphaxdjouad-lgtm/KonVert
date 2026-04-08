'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ABTestStats from '@/components/dashboard/ABTestStats'
import type { ABTest, ABVariantRow, ABVariantLetter } from '@/types'
import { ArrowLeft, FlaskConical, Play } from 'lucide-react'

interface PageData {
  id: string
  title: string
  status: string
}

export default function ABTestPage() {
  const { id: pageId } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [page,      setPage]      = useState<PageData | null>(null)
  const [abTest,    setAbTest]    = useState<ABTest | null>(null)
  const [variants,  setVariants]  = useState<ABVariantRow[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [declaring, setDeclaring] = useState(false)
  const [creating,  setCreating]  = useState(false)

  /* ─── Chargement initial ────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Page
    const { data: pageData, error: pageErr } = await supabase
      .from('pages')
      .select('id, title, status')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (pageErr || !pageData) {
      setError('Page introuvable')
      setLoading(false)
      return
    }
    setPage(pageData)

    // Test actif
    const { data: testData } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setAbTest(testData ?? null)

    if (testData) {
      const { data: variantData } = await supabase
        .from('ab_variants')
        .select('*')
        .eq('ab_test_id', testData.id)
        .order('variant', { ascending: true })

      setVariants(variantData ?? [])
    }

    setLoading(false)
  }, [pageId])

  useEffect(() => { fetchData() }, [fetchData])

  /* ─── Créer un test A/B ─────────────────────────────────────── */
  async function handleCreate() {
    setCreating(true)
    setError(null)
    const res = await fetch('/api/ab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', page_id: pageId }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Erreur lors de la création')
    } else {
      await fetchData()
    }
    setCreating(false)
  }

  /* ─── Déclarer gagnant ──────────────────────────────────────── */
  async function handleDeclareWinner(winner: ABVariantLetter) {
    if (!abTest) return
    setDeclaring(true)
    await fetch('/api/ab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'winner', test_id: abTest.id, winner }),
    })
    await fetchData()
    setDeclaring(false)
  }

  /* ─── Changer statut ────────────────────────────────────────── */
  async function handleStatusChange(status: 'running' | 'paused') {
    if (!abTest) return
    await fetch('/api/ab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', test_id: abTest.id, status }),
    })
    await fetchData()
  }

  /* ─── Render ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-gray-400 py-24">
        Page introuvable.{' '}
        <Link href="/dashboard/pages" className="text-purple-600 font-semibold underline">
          Retour
        </Link>
      </div>
    )
  }

  const testStatus = abTest?.status ?? null
  const isCompleted = testStatus === 'completed'

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* ── Breadcrumb + header ────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard/pages"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Mes pages
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500 truncate max-w-[200px]">{page.title || 'Sans titre'}</span>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-700">A/B Test</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)' }}
            >
              <FlaskConical className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">A/B Testing</h1>
          </div>
          <p className="text-sm text-gray-400">
            Teste deux versions de ta page et laisse les données décider.
          </p>
        </div>

        {/* Badge statut */}
        {abTest && (
          <StatusBadge status={abTest.status} winner={abTest.winner} />
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-100">
          {error}
        </div>
      )}

      {/* ── Pas de test → CTA création ───────────────────────── */}
      {!abTest && (
        <CreateTestCard onCreate={handleCreate} creating={creating} />
      )}

      {/* ── Test existant ─────────────────────────────────────── */}
      {abTest && (
        <div className="flex flex-col gap-6">

          {/* Infos du test */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: '#fff', border: '1px solid #e5e7eb' }}
          >
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Test créé le</div>
              <div className="font-semibold text-gray-700 text-sm">
                {new Date(abTest.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trafic splitté</div>
              <div className="font-black text-gray-900">50 / 50</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total vues</div>
              <div className="font-black text-gray-900">
                {variants.reduce((s, v) => s + v.vues, 0).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Stats A vs B */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e5e7eb' }}
          >
            <h2 className="font-black text-gray-900 mb-5">Résultats comparatifs</h2>
            <ABTestStats
              variants={variants}
              status={abTest.status}
              winner={abTest.winner}
              onDeclareWinner={handleDeclareWinner}
              onStatusChange={handleStatusChange}
              declaring={declaring}
            />
          </div>

          {/* Résumé gagnant si terminé */}
          {isCompleted && abTest.winner && (
            <WinnerSummary winner={abTest.winner} variants={variants} />
          )}

          {/* Créer un nouveau test si terminé */}
          {isCompleted && (
            <div
              className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.25)' }}
            >
              <div>
                <div className="font-bold text-sm text-gray-700 mb-0.5">Test terminé</div>
                <div className="text-xs text-gray-400">Tu peux lancer un nouveau test avec une nouvelle variante B.</div>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
              >
                <Play className="w-3 h-3" />
                {creating ? 'Création...' : 'Nouveau test'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Sous-composants ─────────────────────────────────────────── */

function StatusBadge({ status, winner }: { status: string; winner: string | null }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    running:   { label: '● En cours',  color: '#166534', bg: 'rgba(22,163,74,0.1)' },
    paused:    { label: '⏸ En pause', color: '#92400e', bg: 'rgba(251,191,36,0.12)' },
    completed: { label: winner ? `🏆 Terminé — ${winner} gagne` : '✓ Terminé', color: '#1e40af', bg: 'rgba(37,99,235,0.1)' },
  }
  const c = cfg[status] ?? cfg.running
  return (
    <span
      className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  )
}

function CreateTestCard({ onCreate, creating }: { onCreate: () => void; creating: boolean }) {
  return (
    <div
      className="rounded-2xl p-10 text-center flex flex-col items-center gap-5"
      style={{ background: '#fff', border: '2px dashed #e5e7eb' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(124,58,237,0.08)' }}
      >
        <FlaskConical className="w-8 h-8" style={{ color: '#7c3aed' }} />
      </div>
      <div>
        <h3 className="font-black text-lg text-gray-900 mb-2">Lance ton premier A/B Test</h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
          KONVERT va créer automatiquement une variante B (copie de ta page actuelle).
          Tu pourras ensuite modifier la variante B dans le builder pour tester une nouvelle approche.
        </p>
      </div>
      <div className="flex flex-col gap-2 text-xs text-gray-400 text-left">
        {[
          'Trafic splitté 50/50 automatiquement',
          'Même visiteur → toujours la même variante',
          'Résultats mis à jour en temps réel',
          'Déclare le gagnant quand tu as assez de données',
        ].map(item => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3 5.5L6.5 2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {item}
          </div>
        ))}
      </div>
      <button
        onClick={onCreate}
        disabled={creating}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      >
        <FlaskConical className="w-4 h-4" />
        {creating ? 'Création du test...' : 'Créer le test A/B'}
      </button>
    </div>
  )
}

function WinnerSummary({ winner, variants }: { winner: ABVariantLetter; variants: ABVariantRow[] }) {
  const vw = variants.find(v => v.variant === winner)
  const vl = variants.find(v => v.variant !== winner)
  if (!vw || !vl) return null

  const winCtr = vl.vues > 0 ? ((vw.clics / vw.vues) * 100).toFixed(1) : '—'
  const losCtr = vl.vues > 0 ? ((vl.clics / vl.vues) * 100).toFixed(1) : '—'

  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-5"
      style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))', border: '1.5px solid rgba(16,185,129,0.25)' }}
    >
      <div className="text-3xl">🏆</div>
      <div>
        <div className="font-black text-gray-900 mb-0.5">
          Variante {winner} déclarée gagnante
        </div>
        <div className="text-sm text-gray-500">
          CTR {winCtr}% vs {losCtr}% — {vw.vues.toLocaleString('fr-FR')} visiteurs analysés
        </div>
      </div>
    </div>
  )
}
