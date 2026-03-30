import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ExternalLink, Pencil, Globe, Clock, FileText } from 'lucide-react'

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = pages || []

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mes pages</h1>
          <p className="text-gray-500 mt-1">{list.length} page{list.length !== 1 ? 's' : ''} créée{list.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle page
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {list.map((page) => (
            <PageRow key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  )
}

function PageRow({ page }: { page: any }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    draft:     { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
    published: { label: 'Publié',    color: 'bg-green-100 text-green-700' },
    archived:  { label: 'Archivé',   color: 'bg-yellow-100 text-yellow-700' },
  }
  const st = statusConfig[page.status] || statusConfig.draft

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-gray-900 text-sm truncate">{page.title || 'Sans titre'}</div>
          {page.product_url && (
            <div className="text-xs text-gray-400 truncate mt-0.5">{page.product_url}</div>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
              {st.label}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(page.created_at).toLocaleDateString('fr-FR')}
            </span>
            {(page.views || 0) > 0 && (
              <span className="text-xs text-gray-400">{page.views} vues</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        {page.published_url && (
          <a
            href={page.published_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voir la page"
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
        <Link
          href={`/dashboard/new?page_id=${page.id}`}
          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">Aucune page encore</h3>
      <p className="text-gray-500 text-sm mb-6">Crée ta première landing page en collant une URL produit</p>
      <Link
        href="/dashboard/new"
        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Créer ma première page
      </Link>
    </div>
  )
}
