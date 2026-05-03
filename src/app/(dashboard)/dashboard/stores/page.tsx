'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Store, Trash2, CheckCircle, AlertCircle, Zap, ExternalLink, Link2, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/* ── Modale de confirmation ─────────────────────────────────────────────── */
function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f4f6')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
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
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Contenu principal ──────────────────────────────────────────────────── */
function StoresContent() {
  const [stores, setStores]               = useState<any[]>([])
  const [loading, setLoading]             = useState(true)
  const [wooForm, setWooForm]             = useState(false)
  const [wooData, setWooData]             = useState({ store_url: '', consumer_key: '', consumer_secret: '' })
  const [youcanForm, setYoucanForm]       = useState(false)
  const [youcanToken, setYoucanToken]     = useState('')
  const [shopifyForm, setShopifyForm]     = useState(false)
  const [shopifyDomain, setShopifyDomain] = useState('')
  const [connecting, setConnecting]       = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const searchParams                      = useSearchParams()
  const justConnected                     = searchParams.get('connected')

  // State pour la modale de suppression
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting]         = useState(false)

  useEffect(() => { loadStores() }, [])

  async function loadStores() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setStores(data || [])
    setLoading(false)
  }

  async function connectYouCan(e: React.FormEvent) {
    e.preventDefault()
    setConnecting(true)
    setError(null)
    try {
      const res  = await fetch('/api/youcan/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_token: youcanToken }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setYoucanForm(false)
      setYoucanToken('')
      loadStores()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setConnecting(false)
    }
  }

  function startShopifyInstall(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    let raw = shopifyDomain.trim().toLowerCase()
    raw = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!raw) {
      setError('Entre le sous-domaine de ta boutique Shopify.')
      return
    }
    // Normalise : "maboutique" → "maboutique.myshopify.com"
    if (!raw.includes('.')) raw = `${raw}.myshopify.com`
    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(raw)) {
      setError('Format invalide. Utilise ton sous-domaine .myshopify.com (ex : maboutique.myshopify.com).')
      return
    }
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(raw)}`
  }

  async function connectWoo(e: React.FormEvent) {
    e.preventDefault()
    setConnecting(true)
    setError(null)
    try {
      const res  = await fetch('/api/woocommerce/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wooData),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setWooForm(false)
      setWooData({ store_url: '', consumer_key: '', consumer_secret: '' })
      loadStores()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setConnecting(false)
    }
  }

  async function confirmDeleteStore() {
    if (!deleteTarget) return
    setDeleting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setDeleting(false); return }
    const { error: delErr } = await supabase
      .from('stores')
      .delete()
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id)
    if (!delErr) setStores(stores.filter(s => s.id !== deleteTarget.id))
    setDeleteTarget(null)
    setDeleting(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* Modale de confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce store ?"
        message={`Le store "${deleteTarget?.name || ''}" sera déconnecté. Tes pages existantes ne seront pas supprimées.`}
        onConfirm={confirmDeleteStore}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#111' }}>Mes stores</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {stores.length > 0 ? `${stores.length} boutique${stores.length > 1 ? 's' : ''} connectée${stores.length > 1 ? 's' : ''}` : 'Connecte tes boutiques Shopify, WooCommerce ou YouCan'}
          </p>
        </div>
      </div>

      {/* Notification connexion réussie */}
      {justConnected && (
        <div className="flex items-center gap-3 rounded-2xl p-4 mb-6" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
          <span className="font-semibold text-sm" style={{ color: '#166534' }}>
            Store {justConnected} connecté avec succès !
          </span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#f3f4f6' }} />
          ))}
        </div>
      ) : stores.length === 0 && !wooForm && !youcanForm ? (
        <EmptyStores
          onAddShopify={() => setShopifyForm(true)}
          onAddWoo={() => setWooForm(true)}
          onAddYouCan={() => setYoucanForm(true)}
        />
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {stores.map(store => (
              <StoreCard key={store.id} store={store} onDelete={() => setDeleteTarget({ id: store.id, name: store.name })} />
            ))}
          </div>

          {/* Boutons ajouter */}
          {!wooForm && !youcanForm && !shopifyForm && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShopifyForm(true)}
                className="flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold transition-all hover:scale-105"
                style={{ border: '2px dashed rgba(22,163,74,0.3)', background: 'rgba(22,163,74,0.04)', color: '#16a34a' }}
              >
                <Plus className="w-4 h-4" /> Ajouter Shopify
              </button>
              <button
                onClick={() => setWooForm(true)}
                className="flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold transition-all hover:scale-105"
                style={{ border: '2px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.04)', color: '#7c3aed' }}
              >
                <Plus className="w-4 h-4" /> Ajouter WooCommerce
              </button>
              <button
                onClick={() => setYoucanForm(true)}
                className="flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold transition-all hover:scale-105"
                style={{ border: '2px dashed rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.04)', color: '#f97316' }}
              >
                <Plus className="w-4 h-4" /> Ajouter YouCan
              </button>
            </div>
          )}
        </>
      )}

      {/* Formulaire Shopify */}
      {shopifyForm && (
        <form onSubmit={startShopifyInstall} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.08)' }}>
              <Link2 className="w-4 h-4" style={{ color: '#16a34a' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#111' }}>Connecter Shopify</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Entre le sous-domaine .myshopify.com de ta boutique</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>Sous-domaine</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="maboutique.myshopify.com"
              value={shopifyDomain}
              onChange={e => setShopifyDomain(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
              onFocus={e => (e.target.style.borderColor = '#16a34a')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#9ca3af' }}>
              Tu seras redirigé vers Shopify pour autoriser KONVERT.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setShopifyForm(false); setShopifyDomain(''); setError(null) }}
              className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
              style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              Continuer vers Shopify
            </button>
          </div>
        </form>
      )}

      {/* Formulaire YouCan */}
      {youcanForm && (
        <form onSubmit={connectYouCan} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.08)' }}>
              <Link2 className="w-4 h-4" style={{ color: '#f97316' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#111' }}>Connecter YouCan</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>YouCan Admin → Paramètres → API → Générer un token</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>Token API</label>
            <input
              type="password"
              required
              placeholder="Colle ton token API YouCan ici"
              value={youcanToken}
              onChange={e => setYoucanToken(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
              onFocus={e => (e.target.style.borderColor = '#f97316')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setYoucanForm(false); setError(null) }}
              className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
              style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={connecting}
              className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              style={{ background: connecting ? '#fed7aa' : 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              {connecting ? 'Connexion...' : 'Connecter'}
            </button>
          </div>
        </form>
      )}

      {/* Formulaire WooCommerce */}
      {wooForm && (
        <form onSubmit={connectWoo} className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
              <Link2 className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#111' }}>Connecter WooCommerce</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>WP Admin → WooCommerce → Paramètres → Avancé → REST API</p>
            </div>
          </div>

          {[
            { key: 'store_url',       type: 'url',      placeholder: 'https://mon-store.com',     label: 'URL du store' },
            { key: 'consumer_key',    type: 'text',     placeholder: 'Consumer Key (ck_...)',     label: 'Consumer Key' },
            { key: 'consumer_secret', type: 'password', placeholder: 'Consumer Secret (cs_...)', label: 'Consumer Secret' },
          ].map(({ key, type, placeholder, label }) => (
            <div key={key}>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#374151' }}>{label}</label>
              <input
                type={type}
                required
                placeholder={placeholder}
                value={wooData[key as keyof typeof wooData]}
                onChange={e => setWooData({ ...wooData, [key]: e.target.value })}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ border: '1px solid #e5e7eb', background: '#fafafa' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setWooForm(false); setError(null) }}
              className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
              style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={connecting}
              className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              style={{ background: connecting ? '#c4b5fd' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              {connecting ? 'Connexion...' : 'Connecter'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function StoreCard({ store, onDelete }: { store: any; onDelete: () => void }) {
  const isShopify  = store.platform === 'shopify'
  const isYouCan   = store.platform === 'youcan'
  const color      = isShopify ? '#16a34a' : isYouCan ? '#f97316' : '#7c3aed'
  const bgColor    = isShopify ? 'rgba(22,163,74,0.08)' : isYouCan ? 'rgba(249,115,22,0.08)' : 'rgba(124,58,237,0.08)'
  const badgeBg    = isShopify ? 'rgba(22,163,74,0.1)' : isYouCan ? 'rgba(249,115,22,0.1)' : 'rgba(124,58,237,0.1)'
  const label      = isShopify ? 'Shopify' : isYouCan ? 'YouCan' : 'WooCommerce'

  return (
    <div className="rounded-2xl p-5 flex items-center justify-between transition-colors hover:shadow-sm" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bgColor }}>
          <Store className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="font-black text-sm" style={{ color: '#111' }}>{store.name}</div>
          <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#9ca3af' }}>
            <ExternalLink className="w-3 h-3" />
            {store.store_url}
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ background: badgeBg, color }}>
            {label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#16a34a' }}>
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Connecté
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg transition-colors ml-2"
          style={{ color: '#d1d5db' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#dc2626'; (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#d1d5db'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function EmptyStores({ onAddShopify, onAddWoo, onAddYouCan }: { onAddShopify: () => void; onAddWoo: () => void; onAddYouCan: () => void }) {
  return (
    <div className="text-center py-20 rounded-2xl" style={{ border: '2px dashed #e5e7eb', background: '#fff' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <Zap className="w-8 h-8" style={{ color: '#7c3aed' }} />
      </div>
      <h3 className="font-black text-lg mb-2" style={{ color: '#111' }}>Aucun store connecté</h3>
      <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
        Connecte ta boutique pour publier tes pages directement depuis le dashboard
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onAddShopify}
          className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Shopify
        </button>
        <button
          onClick={onAddWoo}
          className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
        >
          <Plus className="w-4 h-4" /> WooCommerce
        </button>
        <button
          onClick={onAddYouCan}
          className="inline-flex items-center gap-2 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}
        >
          <Plus className="w-4 h-4" /> YouCan
        </button>
      </div>
    </div>
  )
}

export default function StoresPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm" style={{ color: '#9ca3af' }}>Chargement...</div>}>
      <StoresContent />
    </Suspense>
  )
}
