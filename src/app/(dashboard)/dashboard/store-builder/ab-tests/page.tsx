'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  SplitSquareHorizontal, Plus, AlertCircle, Loader2, Info, X,
  TrendingUp, TrendingDown, Rocket, Sparkles, Link2,
} from 'lucide-react'
import { useStoreBuilderConnections } from '../_lib/useConnections'
import {
  formatPercent, formatPValue, daysRemainingInTest, formatDateFr,
} from '../_lib/format'
import { EmptyState } from '../_components/EmptyState'
import { ConnectionPicker, StatusPill } from '../_components/ConnectionPicker'
import type { AbField, AbTest, ApiResult } from '../_lib/types'
import {
  AB_MIN_VISITORS_PER_VARIANT, AB_MIN_DAYS_ELAPSED, AB_MIN_PURCHASES_PER_VARIANT, AB_MAX_DURATION_DAYS,
} from '../_lib/types'
import { readJson } from '@/lib/http/read-json'

const FIELD_LABELS: Record<AbField, string> = { h1_title: 'Titre H1', description: 'Description' }

function DecisionBadge({ test }: { test: AbTest }) {
  const d = test.stats.decision
  if (test.status === 'promoted') {
    return <StatusPill tone="green">Promue — variante {test.winner?.toUpperCase()}</StatusPill>
  }
  if (test.status === 'stopped') return <StatusPill tone="gray">Arrêtée</StatusPill>
  if (test.status === 'inconclusive' || d.status === 'inconclusive') return <StatusPill tone="gray">Non concluant</StatusPill>
  if (d.status === 'significant') {
    return <StatusPill tone="green">Gagnant détecté : variante {d.winner?.toUpperCase()} ({formatPValue(d.zTest.pValue)})</StatusPill>
  }
  return <StatusPill tone="orange">Collecte en cours</StatusPill>
}

function VariantColumn({ label, text, visitors, atc, purchases, isWinner }: {
  label: string; text: string; visitors: number; atc: number; purchases: number; isWinner: boolean
}) {
  const crAtc = visitors > 0 ? atc / visitors : 0
  const crPurchase = visitors > 0 ? purchases / visitors : 0
  return (
    <div
      className="rounded-xl p-3 flex-1 min-w-[180px]"
      style={isWinner ? { background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.25)' } : { background: '#F5F4FA' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-black uppercase" style={{ color: isWinner ? '#16a34a' : '#9ca3af' }}>{label}</span>
        {isWinner && <span className="text-[10px] font-black" style={{ color: '#16a34a' }}>★ Meilleur</span>}
      </div>
      <p className="text-sm mb-2 line-clamp-3" style={{ color: '#374151' }}>{text}</p>
      <div className="grid grid-cols-3 gap-1 text-center">
        <div>
          <div className="text-xs font-black" style={{ color: '#111' }}>{visitors}</div>
          <div className="text-[10px]" style={{ color: '#9ca3af' }}>visiteurs</div>
        </div>
        <div>
          <div className="text-xs font-black" style={{ color: '#111' }}>{formatPercent(crAtc, 1)}</div>
          <div className="text-[10px]" style={{ color: '#9ca3af' }}>panier</div>
        </div>
        <div>
          <div className="text-xs font-black" style={{ color: '#111' }}>{formatPercent(crPurchase, 1)}</div>
          <div className="text-[10px]" style={{ color: '#9ca3af' }}>achat ({purchases})</div>
        </div>
      </div>
    </div>
  )
}

function TestCard({ test, onAction }: { test: AbTest; onAction: () => void }) {
  const [busy, setBusy] = useState<'promote' | 'force' | 'stop' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmForce, setConfirmForce] = useState(false)

  const c = test.stats.counts
  const d = test.stats.decision
  const daysLeft = daysRemainingInTest(test.started_at)
  const isRunning = test.status === 'running'

  async function callAction(path: string, body: Record<string, unknown>, kind: 'promote' | 'force' | 'stop') {
    setBusy(kind)
    setActionError(null)
    try {
      const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await readJson(res)
      if (!json.ok) {
        setActionError(json.error?.message ?? "L'action a échoué.")
        return
      }
      onAction()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur réseau')
    } finally {
      setBusy(null)
      setConfirmForce(false)
    }
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <div className="text-xs font-bold uppercase" style={{ color: '#9ca3af' }}>{FIELD_LABELS[test.field]}</div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <DecisionBadge test={test} />
            {isRunning && <span className="text-[11px] font-bold" style={{ color: '#9ca3af' }}>J{test.stats.daysElapsed}/{AB_MAX_DURATION_DAYS}</span>}
          </div>
        </div>
        <div className="text-[11px]" style={{ color: '#9ca3af' }}>Lancé le {formatDateFr(test.started_at)}</div>
      </div>

      <div className="flex flex-wrap gap-3 mb-3">
        <VariantColumn label="Variante A (actuelle)" text={test.variant_a_text} visitors={c.visitorsA} atc={c.atcA} purchases={c.purchasesA} isWinner={d.winner === 'a'} />
        <VariantColumn label="Variante B (challenger)" text={test.variant_b_text} visitors={c.visitorsB} atc={c.atcB} purchases={c.purchasesB} isWinner={d.winner === 'b'} />
      </div>

      {test.stats.addToCartAlert.alert && isRunning && (
        <div className="flex items-start gap-2 rounded-xl p-2.5 text-xs mb-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <TrendingDown className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Variante B semble nuire à l&apos;ajout panier — envisage d&apos;arrêter le test avant terme.
        </div>
      )}

      {isRunning && d.status !== 'significant' && (
        <div className="flex items-start gap-2 rounded-xl p-2.5 text-xs mb-3" style={{ background: '#F5F4FA', color: '#6b7280' }}>
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Résultat fiable à partir de {AB_MIN_VISITORS_PER_VARIANT} visiteurs et {AB_MIN_PURCHASES_PER_VARIANT} achats par variante, sur au moins {AB_MIN_DAYS_ELAPSED} jours.
          {d.guardrails.reasons.length > 0 && (
            <span className="block mt-1 font-semibold">{d.guardrails.reasons.join(' · ')}</span>
          )}
          <span className="block mt-1">
            {daysLeft > 0
              ? `Clôture automatique dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} si non concluant.`
              : 'Ce test va être clos automatiquement (non concluant).'}
          </span>
        </div>
      )}

      {actionError && (
        <div className="flex items-start gap-2 rounded-xl p-2.5 text-xs mb-3" style={{ background: 'rgba(220,38,38,0.08)', color: '#991b1b' }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {actionError}
        </div>
      )}

      {confirmForce && (
        <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <p className="mb-2">
            Échantillon insuffisant pour une décision fiable (A: {c.visitorsA} visiteurs/{c.purchasesA} achats,
            B: {c.visitorsB} visiteurs/{c.purchasesB} achats). Tu peux forcer, mais le résultat n&apos;est pas garanti représentatif.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => callAction(`/api/shopify/ab-tests/${test.id}/promote`, { force: true, winner: 'a' }, 'force')}
              disabled={busy !== null}
              className="flex-1 font-bold py-1.5 rounded-lg text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}
            >
              Forcer variante A
            </button>
            <button
              onClick={() => callAction(`/api/shopify/ab-tests/${test.id}/promote`, { force: true, winner: 'b' }, 'force')}
              disabled={busy !== null}
              className="flex-1 font-bold py-1.5 rounded-lg text-xs text-white" style={{ background: '#f97316' }}
            >
              Forcer variante B
            </button>
            <button onClick={() => setConfirmForce(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ color: '#6b7280' }}>Annuler</button>
          </div>
        </div>
      )}

      {isRunning && (
        <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={() => callAction(`/api/shopify/ab-tests/${test.id}/promote`, {}, 'promote')}
            disabled={busy !== null || d.status !== 'significant'}
            className="flex-1 font-bold py-2 rounded-lg text-xs text-white disabled:opacity-40 flex items-center justify-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {busy === 'promote' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
            Promouvoir le gagnant
          </button>
          <button
            onClick={() => setConfirmForce(true)}
            disabled={busy !== null}
            className="font-bold py-2 px-3 rounded-lg text-xs" style={{ border: '1px solid #e5e7eb', color: '#374151' }}
          >
            Forcer maintenant
          </button>
          <button
            onClick={() => callAction(`/api/shopify/ab-tests/${test.id}/stop`, {}, 'stop')}
            disabled={busy !== null}
            className="font-bold py-2 px-3 rounded-lg text-xs" style={{ border: '1px solid #e5e7eb', color: '#dc2626' }}
          >
            {busy === 'stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Arrêter'}
          </button>
        </div>
      )}
    </div>
  )
}

function CreateTestForm({ connectionId, onCreated, onCancel }: { connectionId: string; onCreated: () => void; onCancel: () => void }) {
  const [field, setField] = useState<AbField>('h1_title')
  const [variantB, setVariantB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<{ message: string; reauthUrl?: string } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!variantB.trim()) return
    setSubmitting(true)
    setError(null)
    setWarning(null)
    try {
      const res = await fetch('/api/shopify/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection_id: connectionId, field, variant_b_text: variantB.trim() }),
      })
      const json = await readJson(res)
      if (!json.ok) {
        setError(json.error?.message ?? 'Impossible de créer le test.')
        return
      }
      if (json.warning) setWarning({ message: json.warning, reauthUrl: json.reauth_url })
      setVariantB('')
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-black text-sm" style={{ color: '#111' }}>Nouveau test A/B</h3>
        <button type="button" onClick={onCancel} style={{ color: '#9ca3af' }} aria-label="Fermer"><X className="w-4 h-4" /></button>
      </div>

      <div>
        <label className="block text-xs font-bold mb-1.5" htmlFor="sb-ab-field" style={{ color: '#374151' }}>Champ à tester</label>
        <select
          id="sb-ab-field" value={field} onChange={(e) => setField(e.target.value as AbField)}
          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
        >
          <option value="h1_title">Titre H1</option>
          <option value="description">Description</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold mb-1.5" htmlFor="sb-ab-variant-b" style={{ color: '#374151' }}>Variante B (challenger)</label>
        <textarea
          id="sb-ab-variant-b" required rows={4} placeholder="Ta nouvelle version à tester contre l'actuelle"
          value={variantB} onChange={(e) => setVariantB(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
        />
        <p className="text-[11px] mt-1.5" style={{ color: '#9ca3af' }}>
          La variante A est capturée automatiquement depuis le contenu actuellement en ligne sur Shopify — tu n&apos;as rien à saisir pour elle.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#991b1b' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {warning && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.08)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {warning.message}{' '}
            {warning.reauthUrl && <a href={warning.reauthUrl} className="font-bold underline">Reconnecter maintenant</a>}
          </span>
        </div>
      )}

      <button
        type="submit" disabled={submitting}
        className="w-full text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : 'Lancer le test A/B'}
      </button>
    </form>
  )
}

export default function StoreBuilderAbTestsPage() {
  const { connections, loading: loadingConnections } = useStoreBuilderConnections()
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeConnection = useMemo(
    () => connections.find((c) => c.id === activeId) ?? connections[0] ?? null,
    [connections, activeId]
  )

  const [tests, setTests] = useState<AbTest[]>([])
  const [loadingTests, setLoadingTests] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const loadTests = useCallback(async (connectionId: string) => {
    setLoadingTests(true)
    setFetchError(null)
    try {
      const res = await fetch(`/api/shopify/ab-tests?connection_id=${encodeURIComponent(connectionId)}`)
      const json: ApiResult<AbTest[]> = await readJson(res)
      if (!json.ok) {
        setFetchError(json.error.message)
        setTests([])
        return
      }
      setTests(json.data)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Erreur réseau')
      setTests([])
    } finally {
      setLoadingTests(false)
    }
  }, [])

  useEffect(() => {
    if (activeConnection) loadTests(activeConnection.id)
  }, [activeConnection, loadTests])

  if (!loadingConnections && connections.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="Connecte d'abord une boutique"
        description="Les tests A/B se lancent sur un produit déjà installé via le Store Builder."
        action={
          <Link href="/dashboard/store-builder" className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            Aller à l&apos;onglet Connexion
          </Link>
        }
      />
    )
  }

  if (activeConnection && !activeConnection.product_id) {
    return (
      <div className="space-y-6">
        <ConnectionPicker connections={connections} activeId={activeConnection.id} onChange={setActiveId} />
        <EmptyState
          icon={Rocket}
          title="Aucun produit installé sur cette boutique"
          description="Génère et installe une page produit avant de pouvoir lancer un test A/B dessus."
          action={
            <Link href="/dashboard/store-builder/generate" className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              <Sparkles className="w-4 h-4" /> Aller au générateur
            </Link>
          }
        />
      </div>
    )
  }

  const runningTest = (field: AbField) => tests.find((t) => t.field === field && t.status === 'running')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ConnectionPicker connections={connections} activeId={activeConnection?.id ?? null} onChange={setActiveId} />
        {activeConnection && !showCreate && !(runningTest('h1_title') && runningTest('description')) && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-white font-bold text-sm py-2 px-4 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
          >
            <Plus className="w-4 h-4" /> Nouveau test A/B
          </button>
        )}
      </div>

      {showCreate && activeConnection && (
        <CreateTestForm
          connectionId={activeConnection.id}
          onCreated={() => { setShowCreate(false); loadTests(activeConnection.id) }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {fetchError && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.06)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Impossible de charger les tests A/B ({fetchError}). Si c&apos;est la première utilisation, la migration Supabase A/B testing n&apos;a peut-être pas encore été appliquée.
        </div>
      )}

      {loadingTests ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: '#f3f4f6' }} />)}
        </div>
      ) : tests.length === 0 ? (
        <EmptyState
          icon={SplitSquareHorizontal}
          title="Aucun test A/B pour l'instant"
          description="Lance un test sur le titre H1 ou la description pour comparer deux versions et laisser tes vrais visiteurs trancher."
          action={!showCreate ? (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
            >
              <Plus className="w-4 h-4" /> Créer mon premier test
            </button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-4">
          {tests.map((t) => (
            <TestCard key={t.id} test={t} onAction={() => activeConnection && loadTests(activeConnection.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
