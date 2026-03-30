'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Store, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function StoresContent() {
  const [stores, setStores]       = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [wooForm, setWooForm]     = useState(false)
  const [wooData, setWooData]     = useState({ store_url: '', consumer_key: '', consumer_secret: '' })
  const [connecting, setConnecting] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const searchParams              = useSearchParams()
  const justConnected             = searchParams.get('connected')

  useEffect(() => {
    loadStores()
  }, [])

  async function loadStores() {
    const supabase = createClient()
    const { data } = await supabase.from('stores').select('*').order('created_at', { ascending: false })
    setStores(data || [])
    setLoading(false)
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

  async function deleteStore(id: string) {
    if (!confirm('Supprimer ce store ?')) return
    const supabase = createClient()
    await supabase.from('stores').delete().eq('id', id)
    setStores(stores.filter(s => s.id !== id))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mes stores</h1>
          <p className="text-gray-500 mt-1">Connecte tes boutiques Shopify ou WooCommerce</p>
        </div>
      </div>

      {/* Notification connexion réussie */}
      {justConnected && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">Store {justConnected} connecté avec succès !</span>
        </div>
      )}

      {/* Liste des stores */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : stores.length === 0 && !wooForm ? (
        <EmptyStores onAddWoo={() => setWooForm(true)} />
      ) : (
        <div className="space-y-3 mb-6">
          {stores.map(store => (
            <StoreRow key={store.id} store={store} onDelete={() => deleteStore(store.id)} />
          ))}
        </div>
      )}

      {/* Boutons ajouter */}
      {!wooForm && stores.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link
            href="/api/shopify/install"
            className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-2xl p-4 text-sm font-semibold text-gray-500 hover:text-purple-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Ajouter Shopify
          </Link>
          <button
            onClick={() => setWooForm(true)}
            className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-2xl p-4 text-sm font-semibold text-gray-500 hover:text-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Ajouter WooCommerce
          </button>
        </div>
      )}

      {/* Formulaire WooCommerce */}
      {wooForm && (
        <form onSubmit={connectWoo} className="bg-white border border-gray-200 rounded-2xl p-6 mt-4 space-y-4">
          <h3 className="font-bold text-gray-900">Connecter WooCommerce</h3>
          <p className="text-xs text-gray-500">
            WP Admin → WooCommerce → Paramètres → Avancé → REST API → Créer une clé (Read/Write)
          </p>
          <input
            type="url" required placeholder="https://mon-store.com"
            value={wooData.store_url}
            onChange={e => setWooData({ ...wooData, store_url: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          />
          <input
            type="text" required placeholder="Consumer Key (ck_...)"
            value={wooData.consumer_key}
            onChange={e => setWooData({ ...wooData, consumer_key: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          />
          <input
            type="password" required placeholder="Consumer Secret (cs_...)"
            value={wooData.consumer_secret}
            onChange={e => setWooData({ ...wooData, consumer_secret: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          />
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={() => { setWooForm(false); setError(null) }}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={connecting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              {connecting ? 'Connexion...' : 'Connecter'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function StoreRow({ store, onDelete }: { store: any; onDelete: () => void }) {
  const isShopify = store.platform === 'shopify'
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isShopify ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Store className={`w-5 h-5 ${isShopify ? 'text-green-700' : 'text-blue-700'}`} />
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">{store.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{store.store_url}</div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${isShopify ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {isShopify ? 'Shopify' : 'WooCommerce'}
          </span>
        </div>
      </div>
      <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function StoresPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Chargement...</div>}>
      <StoresContent />
    </Suspense>
  )
}

function EmptyStores({ onAddWoo }: { onAddWoo: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Store className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">Aucun store connecté</h3>
      <p className="text-gray-500 text-sm mb-6">Connecte ta boutique pour publier tes pages directement</p>
      <div className="flex gap-3 justify-center">
        <Link href="/api/shopify/install"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Shopify
        </Link>
        <button onClick={onAddWoo}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> WooCommerce
        </button>
      </div>
    </div>
  )
}
