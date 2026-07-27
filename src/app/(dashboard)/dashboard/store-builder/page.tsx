'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Link2, Plus, CheckCircle, AlertCircle, Trash2, X, ExternalLink,
  RefreshCw, Sparkles, SplitSquareHorizontal, Gauge,
} from 'lucide-react'
import { PlatformLogo } from '@/components/ui/platform-logo'
import { useStoreBuilderConnections } from './_lib/useConnections'
import { hasStoreBuilderScopes, hasReadOrdersScope, normalizeShopDomain, formatDateFr } from './_lib/format'
import { StatusPill } from './_components/ConnectionPicker'
import { EmptyState } from './_components/EmptyState'
import type { StoreBuilderConnection } from './_lib/types'

const SB_ERROR_MESSAGES: Record<string, string> = {
  invalid_shop: "L'adresse de boutique fournie est invalide.",
  oauth_state_invalid: 'La session de connexion a expiré — réessaie.',
  oauth_hmac_invalid: 'Réponse Shopify non authentifiée — réessaie.',
  oauth_missing_code: 'Shopify n\'a pas renvoyé de code d\'autorisation — réessaie.',
  oauth_token_failed: "Échec de l'échange du jeton avec Shopify — réessaie dans quelques minutes.",
  store_save_failed: 'La connexion a réussi côté Shopify mais l\'enregistrement a échoué — réessaie.',
}

function ConfirmModal({
  open, title, message, onConfirm, onCancel, loading,
}: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; loading?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: '#9ca3af' }}
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(220,38,38,0.08)' }}>
          <Trash2 className="w-5 h-5" style={{ color: '#dc2626' }} />
        </div>
        <h3 className="text-center font-black text-base mb-1" style={{ color: '#111' }}>{title}</h3>
        <p className="text-center text-sm mb-6" style={{ color: '#6b7280' }}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
            style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
            style={{ background: '#dc2626' }}
          >
            {loading ? 'Déconnexion...' : 'Déconnecter'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConnectForm({ onCancel }: { onCancel?: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const domain = normalizeShopDomain(value)
    if (!domain) {
      setError('Format invalide. Utilise ton sous-domaine .myshopify.com (ex : maboutique.myshopify.com).')
      return
    }
    window.location.href = `/api/shopify/store-builder/connect?shop=${encodeURIComponent(domain)}`
  }

  return (
    <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.08)' }}>
          <Link2 className="w-4 h-4" style={{ color: '#16a34a' }} />
        </div>
        <div>
          <h3 className="font-black" style={{ color: '#111' }}>Connecter ma boutique Shopify</h3>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Sous-domaine .myshopify.com de ta boutique</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold mb-1.5" htmlFor="sb-shop-domain" style={{ color: '#374151' }}>
          Sous-domaine
        </label>
        <input
          id="sb-shop-domain"
          type="text"
          required
          autoFocus
          placeholder="maboutique.myshopify.com"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null) }}
          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
        />
        <p className="text-[11px] mt-1.5" style={{ color: '#9ca3af' }}>
          Tu seras redirigé vers Shopify pour autoriser KONVERT (accès thème + produits, jamais tes clients ni tes commandes à ce stade).
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
            style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
        >
          Connecter ma boutique Shopify
        </button>
      </div>
    </form>
  )
}

function ConnectionCard({ c, onRevoke }: { c: StoreBuilderConnection; onRevoke: () => void }) {
  const scopesOk = hasStoreBuilderScopes(c.scopes)
  const readOrdersOk = hasReadOrdersScope(c.scopes)
  const themeInstalled = !!c.theme_installed_at
  const productInstalled = !!c.product_id

  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(22,163,74,0.08)' }}>
            <PlatformLogo platform="shopify" size={26} />
          </div>
          <div>
            <div className="font-black text-sm flex items-center gap-1.5" style={{ color: '#111' }}>
              {c.shop_domain}
              <a
                href={`https://${c.shop_domain}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir ${c.shop_domain}`}
                style={{ color: '#9ca3af' }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>Connectée le {formatDateFr(c.created_at)}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <StatusPill tone={scopesOk ? 'green' : 'orange'}>{scopesOk ? 'Permissions OK' : 'Permissions insuffisantes'}</StatusPill>
              <StatusPill tone={themeInstalled ? 'green' : 'gray'}>{themeInstalled ? 'Thème installé' : 'Thème non installé'}</StatusPill>
              <StatusPill tone={productInstalled ? 'green' : 'gray'}>{productInstalled ? 'Produit installé' : 'Aucun produit'}</StatusPill>
              {themeInstalled && (
                <StatusPill tone={readOrdersOk ? 'green' : 'gray'}>
                  {readOrdersOk ? 'Attribution commandes active' : 'Attribution commandes inactive'}
                </StatusPill>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onRevoke}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#d1d5db' }}
          title="Déconnecter cette boutique"
          aria-label={`Déconnecter ${c.shop_domain}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {!scopesOk && (
        <div
          className="flex items-start gap-2 rounded-xl p-3 text-xs mt-4"
          style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}
        >
          <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Cette connexion date d&apos;avant un élargissement de permissions.{' '}
            <a
              href={`/api/shopify/store-builder/connect?shop=${encodeURIComponent(c.shop_domain)}`}
              className="font-bold underline"
            >
              Reconnecter maintenant
            </a>
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
        <Link
          href="/dashboard/store-builder/generate"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: '#f3f0ff', color: '#7c3aed' }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Générer une page produit
        </Link>
        <Link
          href="/dashboard/store-builder/ab-tests"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: '#f3f4f6', color: '#374151' }}
        >
          <SplitSquareHorizontal className="w-3.5 h-3.5" /> Tests A/B
        </Link>
        <Link
          href="/dashboard/store-builder/audit"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: '#f3f4f6', color: '#374151' }}
        >
          <Gauge className="w-3.5 h-3.5" /> Score CRO
        </Link>
      </div>
    </div>
  )
}

function ConnexionContent() {
  const { connections, loading, error, refresh } = useStoreBuilderConnections()
  const [addingNew, setAddingNew] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<StoreBuilderConnection | null>(null)
  const [revoking, setRevoking] = useState(false)
  const searchParams = useSearchParams()
  const justConnected = searchParams.get('store_builder_connected')
  const sbError = searchParams.get('sb_error')

  async function confirmRevoke() {
    if (!revokeTarget) return
    setRevoking(true)
    try {
      const res = await fetch('/api/shopify/store-builder/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection_id: revokeTarget.id }),
      })
      if (!res.ok) throw new Error('Échec de la déconnexion')
      await refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setRevoking(false)
      setRevokeTarget(null)
    }
  }

  return (
    <div>
      <ConfirmModal
        open={!!revokeTarget}
        title="Déconnecter cette boutique ?"
        message={`"${revokeTarget?.shop_domain ?? ''}" ne pourra plus recevoir de génération ni de test A/B tant qu'elle n'est pas reconnectée. Le contenu déjà publié sur Shopify n'est pas supprimé.`}
        onConfirm={confirmRevoke}
        onCancel={() => setRevokeTarget(null)}
        loading={revoking}
      />

      {justConnected && (
        <div className="flex items-center gap-3 rounded-2xl p-4 mb-6" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
          <span className="font-semibold text-sm" style={{ color: '#166534' }}>Boutique connectée avec succès au Store Builder.</span>
        </div>
      )}

      {sbError && (
        <div className="flex items-center gap-3 rounded-2xl p-4 mb-6" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
          <span className="font-semibold text-sm" style={{ color: '#991b1b' }}>
            {SB_ERROR_MESSAGES[sbError] ?? 'La connexion à Shopify a échoué — réessaie.'}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm mb-6" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', color: '#9a3412' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Impossible de charger tes connexions pour le moment ({error}). Si c&apos;est la première utilisation, la migration Supabase du Store Builder n&apos;a peut-être pas encore été appliquée.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: '#f3f4f6' }} />)}
        </div>
      ) : connections.length === 0 && !addingNew ? (
        <EmptyState
          icon={Link2}
          title="Aucune boutique connectée au Store Builder"
          description="Connecte ta boutique Shopify pour générer et installer une page produit CRO-optimisée en un clic."
          action={
            <button
              onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
            >
              <Plus className="w-4 h-4" /> Connecter ma boutique Shopify
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {connections.map((c) => (
              <ConnectionCard key={c.id} c={c} onRevoke={() => setRevokeTarget(c)} />
            ))}
          </div>
          {!addingNew && (
            <button
              onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
              style={{ border: '2px dashed rgba(22,163,74,0.3)', background: 'rgba(22,163,74,0.04)', color: '#16a34a' }}
            >
              <Plus className="w-4 h-4" /> Connecter une autre boutique
            </button>
          )}
        </>
      )}

      {addingNew && (
        <div className="mt-4">
          <ConnectForm onCancel={() => setAddingNew(false)} />
        </div>
      )}
    </div>
  )
}

export default function StoreBuilderConnexionPage() {
  return (
    <Suspense fallback={<div className="text-sm" style={{ color: '#9ca3af' }}>Chargement...</div>}>
      <ConnexionContent />
    </Suspense>
  )
}
