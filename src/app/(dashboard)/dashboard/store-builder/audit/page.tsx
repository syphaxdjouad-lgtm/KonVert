'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Gauge, AlertCircle, CheckCircle2, Info, Eye, EyeOff, TrendingUp, TrendingDown, Minus, Link2, Rocket,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useStoreBuilderConnections } from '../_lib/useConnections'
import { auditCriterionGroup, AUDIT_GROUP_LABELS, formatDateFr, scoreBand } from '../_lib/format'
import { EmptyState, MockDataBanner } from '../_components/EmptyState'
import { ScoreGauge, BandBadge } from '../_components/ScoreGauge'
import { ConnectionPicker } from '../_components/ConnectionPicker'
import type { AuditCriterionResult, StoreBuilderAudit } from '../_lib/types'

// Fixture d'exemple — clairement marquée comme placeholder à l'écran (jamais
// affichée sans bannière). Sert uniquement à montrer à quoi ressemblera
// l'audit avant que le premier vrai checkpoint J+7 n'arrive (cron
// GET /api/cron/store-builder-audit, cf. docs/store-builder-sprint8-spec.md §B.4).
const MOCK_CRITERIA: AuditCriterionResult[] = [
  { id: 1, label: 'Avis clients réels', weight: 14, pass: false, credit: 0, measuredValue: 0, measurable: true, recommendation: 'Ajoute au moins 3 vrais avis clients dans la section Avis — jamais générés, toujours réels.' },
  { id: 2, label: 'Preuve sociale renseignée', weight: 12, pass: false, credit: 0, measuredValue: '', measurable: true, recommendation: 'Renseigne un vrai chiffre de preuve sociale (ex. nombre de commandes) — jamais inventé.' },
  { id: 3, label: 'Nom du fondateur renseigné', weight: 7, pass: false, credit: 0, measuredValue: '', measurable: true, recommendation: 'Ajoute ton vrai nom dans la section Notre histoire pour humaniser la page.' },
  { id: 4, label: 'Histoire fondateur personnalisée', weight: 7, pass: false, credit: 0, measuredValue: '', measurable: true, recommendation: 'Remplace les [crochets] restants par tes vraies infos.' },
  { id: 7, label: 'FAQ ≥ 3 Q/R non vides', weight: 6, pass: true, credit: 1, measuredValue: 5, measurable: true },
  { id: 13, label: 'Images produit ≥ 4', weight: 10, pass: false, credit: 0, measuredValue: 1, measurable: true, recommendation: 'Ajoute plus de photos produit — vise au moins 4.' },
  { id: 17, label: 'Perf mobile Lighthouse', weight: 5, pass: false, credit: 0.6, measuredValue: 72, measurable: true, recommendation: 'Ta boutique est lente sur mobile — vérifie les images trop lourdes en premier.' },
]
const MOCK_SCORE = MOCK_CRITERIA.reduce((sum, c) => sum + c.weight * c.credit, 0)

function CriteriaGroup({ group, criteria }: { group: 1 | 2 | 3; criteria: AuditCriterionResult[] }) {
  const items = criteria.filter((c) => auditCriterionGroup(c.id) === group)
  if (items.length === 0) return null
  const failing = items.filter((c) => c.credit < 1)

  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <h4 className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>{AUDIT_GROUP_LABELS[group]}</h4>
      <div className="space-y-2.5">
        {items.map((c) => (
          <div key={c.id} className="flex items-start gap-2.5">
            {c.credit === 1 ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
            ) : c.credit > 0 ? (
              <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f97316' }} />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: '#111' }}>{c.label}</span>
                <span className="text-[11px] font-bold" style={{ color: '#9ca3af' }}>{c.weight} pts</span>
              </div>
              {c.recommendation && (
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{c.recommendation}</p>
              )}
              {!c.measurable && (
                <p className="text-[11px] mt-0.5 italic" style={{ color: '#9ca3af' }}>Non mesurable pour l&apos;instant (donnée indisponible).</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {failing.length === 0 && (
        <p className="text-xs mt-3 font-semibold" style={{ color: '#16a34a' }}>Tout est en ordre sur ce groupe.</p>
      )}
    </div>
  )
}

function AuditView({ audit, previous }: { audit: StoreBuilderAudit; previous?: StoreBuilderAudit }) {
  const group1Failing = audit.criteria.filter((c) => auditCriterionGroup(c.id) === 1 && c.credit < 1).length
  const delta = previous ? audit.score - previous.score : null

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
        <ScoreGauge score={audit.score} band={audit.band} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5">
            <BandBadge band={audit.band} />
            <span className="text-xs font-bold" style={{ color: '#9ca3af' }}>
              Checkpoint {audit.checkpoint === 'j7' ? 'J+7' : 'J+30'} — {formatDateFr(audit.created_at)}
            </span>
          </div>
          <p className="text-sm" style={{ color: '#374151' }}>
            {group1Failing > 0
              ? `${group1Failing} élément${group1Failing > 1 ? 's' : ''} clé${group1Failing > 1 ? 's' : ''} (que seul toi peux ajouter) manque${group1Failing > 1 ? 'nt' : ''} encore.`
              : 'Tout le contenu qui te revient (avis, preuve sociale, histoire) est en place.'}
          </p>
          {delta !== null && (
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold justify-center sm:justify-start" style={{ color: delta >= 0 ? '#16a34a' : '#dc2626' }}>
              {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts depuis le checkpoint précédent
            </div>
          )}
        </div>
      </div>

      <CriteriaGroup group={1} criteria={audit.criteria} />
      <CriteriaGroup group={2} criteria={audit.criteria} />
      <CriteriaGroup group={3} criteria={audit.criteria} />
    </div>
  )
}

export default function StoreBuilderAuditPage() {
  const { connections, loading: loadingConnections } = useStoreBuilderConnections()
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeConnection = useMemo(
    () => connections.find((c) => c.id === activeId) ?? connections[0] ?? null,
    [connections, activeId]
  )

  const [audits, setAudits] = useState<StoreBuilderAudit[]>([])
  const [loadingAudits, setLoadingAudits] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [showMock, setShowMock] = useState(false)

  const loadAudits = useCallback(async (connectionId: string) => {
    setLoadingAudits(true)
    setFetchError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('store_builder_audits')
        .select('id, connection_id, checkpoint, score, band, criteria, created_at')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: false })
      if (error) {
        setFetchError(error.message)
        setAudits([])
        return
      }
      setAudits((data as StoreBuilderAudit[]) ?? [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Erreur réseau')
      setAudits([])
    } finally {
      setLoadingAudits(false)
    }
  }, [])

  useEffect(() => {
    if (activeConnection) loadAudits(activeConnection.id)
  }, [activeConnection, loadAudits])

  if (!loadingConnections && connections.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="Connecte d'abord une boutique"
        description="Le score CRO se calcule automatiquement 7 puis 30 jours après l'installation de ta page produit."
        action={
          <Link href="/dashboard/store-builder" className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            Aller à l&apos;onglet Connexion
          </Link>
        }
      />
    )
  }

  if (activeConnection && !activeConnection.theme_installed_at) {
    return (
      <div className="space-y-6">
        <ConnectionPicker connections={connections} activeId={activeConnection.id} onChange={setActiveId} />
        <EmptyState
          icon={Rocket}
          title="Installe d'abord ta page produit"
          description="Le premier audit se déclenche automatiquement 7 jours après l'installation du thème sur ta boutique."
          action={
            <Link href="/dashboard/store-builder/generate" className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              Aller au générateur
            </Link>
          }
        />
      </div>
    )
  }

  const latest = audits[0]
  const previous = latest?.checkpoint === 'j30' ? audits.find((a) => a.checkpoint === 'j7') : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ConnectionPicker connections={connections} activeId={activeConnection?.id ?? null} onChange={setActiveId} />
        {!latest && activeConnection?.theme_installed_at && (
          <button
            onClick={() => setShowMock((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ background: '#f3f4f6', color: '#374151' }}
          >
            {showMock ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showMock ? "Masquer l'exemple" : 'Voir un exemple'}
          </button>
        )}
      </div>

      {fetchError && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(249,115,22,0.06)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Impossible de charger l&apos;audit ({fetchError}). Si c&apos;est la première utilisation, la migration Supabase des audits n&apos;a peut-être pas encore été appliquée.
        </div>
      )}

      {loadingAudits ? (
        <div className="h-56 rounded-2xl animate-pulse" style={{ background: '#f3f4f6' }} />
      ) : latest ? (
        <AuditView audit={latest} previous={previous} />
      ) : showMock ? (
        <>
          <MockDataBanner label="Exemple — voici à quoi ressemblera ton audit, ce ne sont pas tes vraies données" />
          <AuditView audit={{ id: 'mock', connection_id: activeConnection?.id ?? '', checkpoint: 'j7', score: MOCK_SCORE, band: scoreBand(MOCK_SCORE), criteria: MOCK_CRITERIA, created_at: new Date().toISOString() }} />
        </>
      ) : (
        <EmptyState
          icon={Gauge}
          title="Aucun audit pour l'instant"
          description="Ton premier audit CRO (score sur 100 + recommandations) arrivera automatiquement 7 jours après l'installation, puis à nouveau à J+30 pour mesurer les progrès."
          action={
            <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
              <Info className="w-3.5 h-3.5" />
              Tu recevras aussi un email récap avec le top 3 des actions prioritaires.
            </div>
          }
        />
      )}
    </div>
  )
}
