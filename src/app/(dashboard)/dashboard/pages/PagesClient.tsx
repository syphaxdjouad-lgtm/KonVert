'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Plus, Pencil, Clock, FileText, Eye, Zap, Download,
  FlaskConical, Search, X, ChevronDown, SlidersHorizontal, Globe,
} from 'lucide-react'
import type { Page, Store } from '@/types'

type SortKey = 'created_desc' | 'created_asc' | 'views_desc' | 'title_asc'
type StatusFilter = 'all' | 'draft' | 'published' | 'archived'

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'Toutes' },
  { key: 'published', label: 'Publiées' },
  { key: 'draft',     label: 'Brouillons' },
  { key: 'archived',  label: 'Archivées' },
]

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'created_desc', label: 'Plus récentes' },
  { key: 'created_asc',  label: 'Plus anciennes' },
  { key: 'views_desc',   label: 'Plus vues' },
  { key: 'title_asc',    label: 'Nom A → Z' },
]

export default function PagesClient({ pages, stores }: { pages: Page[]; stores: Store[] }) {
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState<StatusFilter>('all')
  const [storeId,    setStoreId]    = useState<string>('all')
  const [sort,       setSort]       = useState<SortKey>('created_desc')
  const [sortOpen,   setSortOpen]   = useState(false)
  const [storeOpen,  setStoreOpen]  = useState(false)

  const hasFilters = search !== '' || status !== 'all' || storeId !== 'all' || sort !== 'created_desc'

  const filtered = useMemo(() => {
    let list = [...pages]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => (p.title || '').toLowerCase().includes(q))
    }

    if (status !== 'all') {
      list = list.filter(p => p.status === status)
    }

    if (storeId !== 'all') {
      list = list.filter(p => p.store_id === storeId)
    }

    switch (sort) {
      case 'created_asc':  list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'views_desc':   list.sort((a, b) => (b.views || 0) - (a.views || 0)); break
      case 'title_asc':    list.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break
      default:             list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
    }

    return list
  }, [pages, search, status, storeId, sort])

  const published  = pages.filter(p => p.status === 'published').length
  const totalViews = pages.reduce((s, p) => s + (p.views || 0), 0)

  function resetFilters() {
    setSearch('')
    setStatus('all')
    setStoreId('all')
    setSort('created_desc')
  }

  const selectedStore = stores.find(s => s.id === storeId)
  const selectedSort  = SORT_OPTIONS.find(o => o.key === sort)!

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#111' }}>Mes pages</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {filtered.length} / {pages.length} page{pages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all hover:opacity-90 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle page
        </Link>
      </div>

      {/* Stats */}
      {pages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <FileText className="w-4 h-4" />, label: 'Total', value: pages.length, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
            { icon: <Globe    className="w-4 h-4" />, label: 'Publiées', value: published, color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
            { icon: <Eye      className="w-4 h-4" />, label: 'Vues totales', value: totalViews.toLocaleString(), color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: '#111' }}>{s.value}</div>
                <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barre filtres */}
      {pages.length > 0 && (
        <div className="flex flex-col gap-3 mb-5">
          {/* Ligne 1 : recherche + store + tri */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une page..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  color: '#111',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#7c3aed')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Store filter */}
            {stores.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => { setStoreOpen(o => !o); setSortOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: storeId !== 'all' ? 'rgba(124,58,237,0.08)' : '#fff',
                    border: `1px solid ${storeId !== 'all' ? '#7c3aed' : '#e5e7eb'}`,
                    color: storeId !== 'all' ? '#7c3aed' : '#374151',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {selectedStore ? selectedStore.name : 'Tous les stores'}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {storeOpen && (
                  <div
                    className="absolute top-11 right-0 rounded-xl overflow-hidden z-50"
                    style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180 }}
                  >
                    {[{ id: 'all', name: 'Tous les stores' }, ...stores].map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setStoreId(s.id); setStoreOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                        style={{ color: storeId === s.id ? '#7c3aed' : '#374151', fontWeight: storeId === s.id ? 700 : 500 }}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => { setSortOpen(o => !o); setStoreOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: sort !== 'created_desc' ? 'rgba(124,58,237,0.08)' : '#fff',
                  border: `1px solid ${sort !== 'created_desc' ? '#7c3aed' : '#e5e7eb'}`,
                  color: sort !== 'created_desc' ? '#7c3aed' : '#374151',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedSort.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {sortOpen && (
                <div
                  className="absolute top-11 right-0 rounded-xl overflow-hidden z-50"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 160 }}
                >
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.key}
                      onClick={() => { setSort(o.key); setSortOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: sort === o.key ? '#7c3aed' : '#374151', fontWeight: sort === o.key ? 700 : 500 }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-red-50"
                style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Ligne 2 : onglets statut */}
          <div className="flex items-center gap-1">
            {STATUS_TABS.map(tab => {
              const count = tab.key === 'all' ? pages.length : pages.filter(p => p.status === tab.key).length
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatus(tab.key)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: status === tab.key ? '#7c3aed' : 'transparent',
                    color: status === tab.key ? '#fff' : '#6b7280',
                  }}
                >
                  {tab.label}
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-black"
                    style={{
                      background: status === tab.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                      color: status === tab.key ? '#fff' : '#9ca3af',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Liste / Empty */}
      {pages.length === 0 ? (
        <EmptyStateNoPages />
      ) : filtered.length === 0 ? (
        <EmptyStateFiltered onReset={resetFilters} search={search} />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e5e7eb', background: '#fff' }}>
          <div className="grid px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6', gridTemplateColumns: '1fr 100px 80px 80px 120px' }}>
            <span>Page</span>
            <span className="text-center">Statut</span>
            <span className="text-right">Vues</span>
            <span className="text-right">Clics</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.map((page, i) => (
            <PageRow key={page.id} page={page} last={i === filtered.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function PageRow({ page, last }: { page: Page; last: boolean }) {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft:     { label: 'Brouillon', color: '#92400e', bg: 'rgba(251,191,36,0.12)' },
    published: { label: 'Publié',    color: '#166534', bg: 'rgba(22,163,74,0.1)' },
    archived:  { label: 'Archivé',   color: '#374151', bg: 'rgba(107,114,128,0.1)' },
  }
  const st  = statusConfig[page.status] || statusConfig.draft
  const ctr = (page.views || 0) > 0
    ? (((page.cta_clicks || 0) / page.views) * 100).toFixed(1)
    : null

  return (
    <div
      className="grid px-5 py-4 items-center hover:bg-gray-50 transition-colors"
      style={{ gridTemplateColumns: '1fr 100px 80px 80px 120px', borderBottom: last ? 'none' : '1px solid #f3f4f6' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.08)' }}>
          <FileText className="w-4 h-4" style={{ color: '#7c3aed' }} />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm truncate" style={{ color: '#111' }}>{page.title || 'Sans titre'}</div>
          <div className="text-xs truncate mt-0.5 flex items-center gap-1" style={{ color: '#9ca3af' }}>
            <Clock className="w-3 h-3" />
            {new Date(page.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
          {st.label}
        </span>
      </div>

      <div className="text-right font-bold text-sm" style={{ color: '#374151' }}>
        {(page.views || 0).toLocaleString()}
      </div>

      <div className="text-right">
        <div className="font-bold text-sm" style={{ color: '#7c3aed' }}>{(page.cta_clicks || 0).toLocaleString()}</div>
        {ctr && <div className="text-[10px] font-semibold" style={{ color: '#9ca3af' }}>CTR {ctr}%</div>}
      </div>

      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/dashboard/pages/${page.id}/ab-test`}
          className="p-2 rounded-lg transition-colors text-gray-400 hover:text-purple-600 hover:bg-purple-50"
          title="A/B Test"
        >
          <FlaskConical className="w-4 h-4" />
        </Link>
        <Link
          href={`/dashboard/new?page_id=${page.id}`}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#9ca3af' }}
          title="Modifier"
        >
          <Pencil className="w-4 h-4" />
        </Link>
        {page.html_content && (
          <button
            onClick={() => {
              const blob = new Blob([page.html_content!], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `konvert-${(page.title || 'page').replace(/\s+/g, '-').toLowerCase()}.html`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="p-2 rounded-lg transition-colors text-gray-400 hover:text-purple-600 hover:bg-purple-50"
            title="Exporter HTML"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function EmptyStateNoPages() {
  return (
    <div className="text-center py-24 rounded-2xl" style={{ border: '2px dashed #e5e7eb', background: '#fff' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <Zap className="w-8 h-8" style={{ color: '#7c3aed' }} />
      </div>
      <h3 className="font-black text-lg mb-2" style={{ color: '#111' }}>Aucune page encore</h3>
      <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
        Colle une URL produit AliExpress, Amazon ou Alibaba et génère ta landing en 30 secondes.
      </p>
      <Link
        href="/dashboard/new"
        className="inline-flex items-center gap-2 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      >
        <Plus className="w-4 h-4" />
        Créer ma première page
      </Link>
    </div>
  )
}

function EmptyStateFiltered({ onReset, search }: { onReset: () => void; search: string }) {
  return (
    <div className="text-center py-20 rounded-2xl" style={{ border: '2px dashed #e5e7eb', background: '#fff' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(107,114,128,0.08)' }}>
        <Search className="w-7 h-7" style={{ color: '#9ca3af' }} />
      </div>
      <h3 className="font-black text-base mb-1.5" style={{ color: '#111' }}>Aucun résultat</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
        {search ? `Aucune page ne correspond à "${search}".` : 'Aucune page ne correspond aux filtres sélectionnés.'}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 font-bold text-sm py-2.5 px-5 rounded-xl transition-all hover:opacity-80"
        style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)' }}
      >
        <X className="w-4 h-4" />
        Réinitialiser les filtres
      </button>
    </div>
  )
}
