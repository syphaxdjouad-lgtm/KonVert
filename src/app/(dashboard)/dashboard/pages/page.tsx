import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Globe, Clock, FileText, Eye, Zap, FlaskConical } from 'lucide-react'

export default async function PagesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { q } = await searchParams

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const all  = pages || []
  const list = q ? all.filter(p => (p.title || '').toLowerCase().includes(q.toLowerCase())) : all

  const published  = all.filter(p => p.status === 'published').length
  const totalViews = all.reduce((s, p) => s + (p.views || 0), 0)

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#111' }}>
            {q ? `Résultats pour "${q}"` : 'Mes pages'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {q ? `${list.length} page${list.length !== 1 ? 's' : ''} trouvée${list.length !== 1 ? 's' : ''}` : `${all.length} page${all.length !== 1 ? 's' : ''} créée${all.length !== 1 ? 's' : ''}`}
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

      {/* Stats bar */}
      {list.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FileText className="w-4 h-4" />, label: 'Total', value: list.length, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
            { icon: <Globe className="w-4 h-4" />, label: 'Publiées', value: published, color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
            { icon: <Eye className="w-4 h-4" />, label: 'Vues totales', value: totalViews.toLocaleString(), color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
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

      {/* Liste */}
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e5e7eb', background: '#fff' }}>
          {/* Thead */}
          <div className="grid px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6', gridTemplateColumns: '1fr 100px 80px 80px 120px' }}>
            <span>Page</span>
            <span className="text-center">Statut</span>
            <span className="text-right">Vues</span>
            <span className="text-right">Clics</span>
            <span className="text-right">Actions</span>
          </div>
          {list.map((page, i) => (
            <PageRow key={page.id} page={page} last={i === list.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function PageRow({ page, last }: { page: any; last: boolean }) {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft:     { label: 'Brouillon', color: '#92400e', bg: 'rgba(251,191,36,0.12)' },
    published: { label: 'Publié',    color: '#166534', bg: 'rgba(22,163,74,0.1)' },
    archived:  { label: 'Archivé',   color: '#374151', bg: 'rgba(107,114,128,0.1)' },
  }
  const st = statusConfig[page.status] || statusConfig.draft
  const ctr = (page.views || 0) > 0
    ? (((page.cta_clicks || 0) / page.views) * 100).toFixed(1)
    : null

  return (
    <div
      className="grid px-5 py-4 items-center hover:bg-gray-50 transition-colors"
      style={{
        gridTemplateColumns: '1fr 100px 80px 80px 120px',
        borderBottom: last ? 'none' : '1px solid #f3f4f6',
      }}
    >
      {/* Titre */}
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

      {/* Statut */}
      <div className="flex justify-center">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
          {st.label}
        </span>
      </div>

      {/* Vues */}
      <div className="text-right font-bold text-sm" style={{ color: '#374151' }}>
        {(page.views || 0).toLocaleString()}
      </div>

      {/* Clics + CTR */}
      <div className="text-right">
        <div className="font-bold text-sm" style={{ color: '#7c3aed' }}>{(page.cta_clicks || 0).toLocaleString()}</div>
        {ctr && <div className="text-[10px] font-semibold" style={{ color: '#9ca3af' }}>CTR {ctr}%</div>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        {page.published_url && (
          <a
            href={page.published_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#9ca3af' }}
            title="Voir la page"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
        <Link
          href={`/dashboard/pages/${page.id}/ab-test`}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#9ca3af' }}
          title="A/B Test"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7c3aed'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.06)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
      </div>
    </div>
  )
}

function EmptyState() {
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
