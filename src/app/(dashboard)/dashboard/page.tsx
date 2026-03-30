import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLAN_LIMITS } from '@/types'
import Link from 'next/link'
import { FileText, Store, Plus, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer profil + stats en parallèle
  const [profileRes, pagesRes, storesRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('pages').select('id, status, created_at').eq('user_id', user.id),
    supabase.from('stores').select('id, name, platform').eq('user_id', user.id),
  ])

  const profile = profileRes.data
  const pages   = pagesRes.data   || []
  const stores  = storesRes.data  || []

  const plan      = profile?.plan || 'starter'
  const limits    = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const used      = profile?.pages_used_this_month || 0
  const pct       = Math.min(Math.round((used / limits.pages) * 100), 100)
  const published = pages.filter(p => p.status === 'published').length

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de ton activité sur KONVERT</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          label="Pages créées"
          value={pages.length}
          sub={`${published} publiées`}
          bg="bg-purple-50"
        />
        <StatCard
          icon={<Store className="w-5 h-5 text-blue-600" />}
          label="Stores connectés"
          value={stores.length}
          sub={`/${limits.stores} max`}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          label="Pages ce mois"
          value={used}
          sub={`/${limits.pages} incluses`}
          bg="bg-green-50"
        />
      </div>

      {/* Quota mensuel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-bold text-gray-900 text-sm">Quota mensuel</div>
            <div className="text-xs text-gray-400 mt-0.5">Plan <span className="font-semibold capitalize text-purple-600">{plan}</span></div>
          </div>
          <span className="text-sm font-bold text-gray-700">{used} / {limits.pages} pages</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-purple-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct >= 90 && (
          <p className="text-xs text-red-600 mt-2 font-medium">
            ⚠️ Tu approches de ta limite — <Link href="/pricing" className="underline">upgrader ton plan</Link>
          </p>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/new"
          className="flex items-center gap-4 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-2xl p-5 transition-all group"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Créer une page</div>
            <div className="text-xs text-gray-400 mt-0.5">Colle une URL produit ou saisis manuellement</div>
          </div>
        </Link>

        <Link
          href="/dashboard/stores"
          className="flex items-center gap-4 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-2xl p-5 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Connecter un store</div>
            <div className="text-xs text-gray-400 mt-0.5">Shopify ou WooCommerce</div>
          </div>
        </Link>
      </div>

    </div>
  )
}

function StatCard({ icon, label, value, sub, bg }: {
  icon: React.ReactNode
  label: string
  value: number
  sub: string
  bg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-0.5">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </div>
  )
}
