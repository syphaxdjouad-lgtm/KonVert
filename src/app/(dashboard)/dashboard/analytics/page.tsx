import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Eye, MousePointerClick, TrendingUp, BarChart2 } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Pages avec stats
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, views, cta_clicks, status, created_at')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('views', { ascending: false })

  const list = pages || []

  const totalViews  = list.reduce((s, p) => s + (p.views || 0), 0)
  const totalClicks = list.reduce((s, p) => s + (p.cta_clicks || 0), 0)
  const avgCtr      = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0'

  // Events des 7 derniers jours par page (scroll depth)
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: scrollEvents } = await supabase
    .from('analytics_events')
    .select('page_id, event_type')
    .gte('created_at', since)
    .in('event_type', ['scroll_25', 'scroll_50', 'scroll_75', 'scroll_100'])

  // Grouper scroll events par page
  const scrollByPage: Record<string, Record<string, number>> = {}
  for (const ev of scrollEvents || []) {
    if (!scrollByPage[ev.page_id]) scrollByPage[ev.page_id] = {}
    scrollByPage[ev.page_id][ev.event_type] = (scrollByPage[ev.page_id][ev.event_type] || 0) + 1
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Performance de tes pages publiées</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Eye className="w-5 h-5 text-blue-600" />} label="Vues totales" value={totalViews} bg="bg-blue-50" />
        <StatCard icon={<MousePointerClick className="w-5 h-5 text-purple-600" />} label="Clics CTA" value={totalClicks} bg="bg-purple-50" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} label="CTR moyen" value={`${avgCtr}%`} bg="bg-green-50" />
      </div>

      {/* Tableau pages */}
      {list.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <BarChart2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune page publiée pour l'instant</p>
          <p className="text-gray-400 text-sm mt-1">Publie une page sur Shopify ou WooCommerce pour voir les stats</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Page</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Vues</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Clics CTA</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">CTR</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Scroll 7j</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map(page => {
                const views  = page.views || 0
                const clicks = page.cta_clicks || 0
                const ctr    = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0'
                const scroll = scrollByPage[page.id] || {}

                return (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 text-sm truncate max-w-xs">{page.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(page.created_at).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900 text-sm">{views.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right font-bold text-purple-700 text-sm">{clicks.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                        parseFloat(ctr) >= 5 ? 'bg-green-100 text-green-700' :
                        parseFloat(ctr) >= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {ctr}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ScrollBar scroll={scroll} views={views} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string | number; bg: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-sm font-semibold text-gray-600 mt-0.5">{label}</div>
    </div>
  )
}

function ScrollBar({ scroll, views }: { scroll: Record<string, number>; views: number }) {
  if (views === 0) return <span className="text-xs text-gray-300">—</span>

  const steps = [
    { key: 'scroll_25',  label: '25%',  color: 'bg-blue-200' },
    { key: 'scroll_50',  label: '50%',  color: 'bg-blue-400' },
    { key: 'scroll_75',  label: '75%',  color: 'bg-blue-600' },
    { key: 'scroll_100', label: '100%', color: 'bg-blue-800' },
  ]

  return (
    <div className="flex items-center gap-1">
      {steps.map(({ key, label, color }) => {
        const pct = views > 0 ? Math.round(((scroll[key] || 0) / views) * 100) : 0
        return (
          <div key={key} className="flex flex-col items-center gap-0.5" title={`${label}: ${pct}%`}>
            <div className="w-6 h-6 bg-gray-100 rounded relative overflow-hidden">
              <div className={`absolute bottom-0 left-0 right-0 ${color} transition-all`} style={{ height: `${pct}%` }} />
            </div>
            <span className="text-[9px] text-gray-400 font-medium">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
