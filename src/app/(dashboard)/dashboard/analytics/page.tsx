import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Eye, MousePointerClick, TrendingUp, BarChart2, ArrowUpRight } from 'lucide-react'
import AnalyticsCharts, { type DailyPoint } from '@/components/dashboard/AnalyticsCharts'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
  const bestPage    = list[0] || null

  // Events 30 jours pour : scroll-bar (table) + courbes timeseries.
  // On filtre sur les pages de l'user (RLS s'en charge déjà, mais double sécurité).
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const since7  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const pageIds = list.map(p => p.id)

  const { data: events } = pageIds.length > 0
    ? await supabase
        .from('analytics_events')
        .select('page_id, event_type, created_at')
        .in('page_id', pageIds)
        .gte('created_at', since30.toISOString())
    : { data: [] }

  // Scroll-bar : ne garder que les 7 derniers jours (cohérent avec l'ancien comportement)
  const scrollByPage: Record<string, Record<string, number>> = {}
  for (const ev of events || []) {
    if (new Date(ev.created_at) < since7) continue
    if (!ev.event_type.startsWith('scroll_')) continue
    if (!scrollByPage[ev.page_id]) scrollByPage[ev.page_id] = {}
    scrollByPage[ev.page_id][ev.event_type] = (scrollByPage[ev.page_id][ev.event_type] || 0) + 1
  }

  // Agrégat journalier (vues + clics) sur 30 jours pour le chart.
  // On pré-remplit chaque jour à 0 pour avoir une courbe continue, même les jours sans event.
  const daily: DailyPoint[] = []
  const dayMap: Record<string, DailyPoint> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const point: DailyPoint = { date: key, views: 0, clicks: 0 }
    daily.push(point)
    dayMap[key] = point
  }
  for (const ev of events || []) {
    const key = ev.created_at.slice(0, 10)
    const point = dayMap[key]
    if (!point) continue
    if (ev.event_type === 'view')      point.views++
    else if (ev.event_type === 'cta_click') point.clicks++
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: '#111' }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Performance de tes pages publiées
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <Eye className="w-5 h-5" />,
            label: 'Vues totales',
            value: totalViews.toLocaleString(),
            color: '#2563eb',
            bg: 'rgba(37,99,235,0.08)',
            sub: `${list.length} page${list.length !== 1 ? 's' : ''} publiée${list.length !== 1 ? 's' : ''}`,
          },
          {
            icon: <MousePointerClick className="w-5 h-5" />,
            label: 'Clics CTA',
            value: totalClicks.toLocaleString(),
            color: '#7c3aed',
            bg: 'rgba(124,58,237,0.08)',
            sub: 'Total boutons cliqués',
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: 'CTR moyen',
            value: `${avgCtr}%`,
            color: parseFloat(avgCtr) >= 3 ? '#16a34a' : parseFloat(avgCtr) >= 1 ? '#d97706' : '#dc2626',
            bg: parseFloat(avgCtr) >= 3 ? 'rgba(22,163,74,0.08)' : parseFloat(avgCtr) >= 1 ? 'rgba(217,119,6,0.08)' : 'rgba(220,38,38,0.08)',
            sub: 'Clics / Vues',
          },
          {
            icon: <BarChart2 className="w-5 h-5" />,
            label: 'Meilleure page',
            value: bestPage ? `${(bestPage.views || 0).toLocaleString()} vues` : '—',
            color: '#0891b2',
            bg: 'rgba(8,145,178,0.08)',
            sub: bestPage?.title ? bestPage.title.slice(0, 20) + (bestPage.title.length > 20 ? '…' : '') : 'Aucune page',
          },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <ArrowUpRight className="w-4 h-4" style={{ color: '#e5e7eb' }} />
            </div>
            <div className="text-2xl font-black mb-1" style={{ color: '#111' }}>{s.value}</div>
            <div className="text-xs font-bold mb-0.5" style={{ color: '#374151' }}>{s.label}</div>
            <div className="text-xs truncate" style={{ color: '#9ca3af' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart timeseries vues/clics */}
      {list.length > 0 && <AnalyticsCharts daily={daily} />}

      {/* Tableau pages */}
      {list.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: '#fff', border: '2px dashed #e5e7eb' }}>
          <BarChart2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="font-bold" style={{ color: '#374151' }}>Aucune page publiée pour l&apos;instant</p>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Publie une page sur Shopify ou WooCommerce pour voir les stats</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
          {/* Thead */}
          <div className="grid px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6', gridTemplateColumns: '1fr 80px 80px 80px 120px' }}>
            <span>Page</span>
            <span className="text-right">Vues</span>
            <span className="text-right">Clics</span>
            <span className="text-right">CTR</span>
            <span className="text-center">Scroll 7j</span>
          </div>
          {list.map((page, i) => {
            const views  = page.views || 0
            const clicks = page.cta_clicks || 0
            const ctr    = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0'
            const ctrNum = parseFloat(ctr)
            const scroll = scrollByPage[page.id] || {}

            return (
              <div
                key={page.id}
                className="grid px-5 py-4 items-center hover:bg-gray-50 transition-colors"
                style={{
                  gridTemplateColumns: '1fr 80px 80px 80px 120px',
                  borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div>
                  <div className="font-bold text-sm truncate max-w-xs" style={{ color: '#111' }}>{page.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{new Date(page.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <div className="text-right font-bold text-sm" style={{ color: '#374151' }}>{views.toLocaleString()}</div>
                <div className="text-right font-bold text-sm" style={{ color: '#7c3aed' }}>{clicks.toLocaleString()}</div>
                <div className="text-right">
                  <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{
                    background: ctrNum >= 5 ? 'rgba(22,163,74,0.1)' : ctrNum >= 2 ? 'rgba(217,119,6,0.1)' : 'rgba(107,114,128,0.1)',
                    color:      ctrNum >= 5 ? '#16a34a'              : ctrNum >= 2 ? '#d97706'              : '#6b7280',
                  }}>
                    {ctr}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <ScrollBar scroll={scroll} views={views} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ScrollBar({ scroll, views }: { scroll: Record<string, number>; views: number }) {
  if (views === 0) return <span className="text-xs" style={{ color: '#d1d5db' }}>—</span>

  const steps = [
    { key: 'scroll_25',  label: '25',  color: '#bfdbfe' },
    { key: 'scroll_50',  label: '50',  color: '#60a5fa' },
    { key: 'scroll_75',  label: '75',  color: '#3b82f6' },
    { key: 'scroll_100', label: '100', color: '#1d4ed8' },
  ]

  return (
    <div className="flex items-end gap-1">
      {steps.map(({ key, label, color }) => {
        const pct = views > 0 ? Math.round(((scroll[key] || 0) / views) * 100) : 0
        return (
          <div key={key} className="flex flex-col items-center gap-0.5" title={`${label}%: ${pct}%`}>
            <div className="w-5 rounded-sm relative overflow-hidden" style={{ height: '24px', background: '#f3f4f6' }}>
              <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all" style={{ height: `${pct}%`, background: color }} />
            </div>
            <span className="text-[9px] font-semibold" style={{ color: '#9ca3af' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
