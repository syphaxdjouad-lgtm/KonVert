import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLAN_LIMITS } from '@/types'
import Link from 'next/link'
import { FileText, Store, Plus, TrendingUp, ArrowUpRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, pagesRes, storesRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('pages').select('id, status, created_at').eq('user_id', user.id),
    supabase.from('stores').select('id, name, platform').eq('user_id', user.id),
  ])

  const profile   = profileRes.data
  const pages     = pagesRes.data   || []
  const stores    = storesRes.data  || []
  const plan      = profile?.plan || 'starter'
  const limits    = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const used      = profile?.pages_used_this_month || 0
  const pct       = Math.min(Math.round((used / limits.pages) * 100), 100)
  const published = pages.filter(p => p.status === 'published').length

  const barFill =
    pct >= 90 ? '#ef4444' :
    pct >= 70 ? '#f97316' :
    undefined // gradient via SVG inline

  return (
    <div className="p-8" style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-black leading-tight"
            style={{ color: '#0f0f1e' }}
          >
            Vue d&apos;ensemble
          </h1>
          <p
            className="mt-1 text-[14px]"
            style={{ color: '#6b6b84' }}
          >
            Voici tes performances KONVERT
          </p>
        </div>
        <span
          className="mt-1 px-3 py-1.5 rounded-full text-[12px] font-bold capitalize"
          style={{ background: '#f3f0ff', color: '#7c3aed' }}
        >
          Plan {plan}
        </span>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Card 1 — Hero dark */}
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{ background: '#0f0f1e', border: '1px solid #1e1e2e' }}
        >
          {/* Badge arrow haut droite */}
          <div className="absolute top-4 right-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#b5f23d' }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#0f0f1e' }} />
            </div>
          </div>

          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <FileText className="w-5 h-5 text-white" />
          </div>

          <div
            className="text-5xl font-black leading-none mb-2"
            style={{ color: '#ffffff' }}
          >
            {pages.length}
          </div>
          <div className="text-[14px] font-semibold text-white mb-1">
            Pages créées
          </div>
          <div className="text-[12px]" style={{ color: '#9090a8' }}>
            {published} publiées
          </div>
        </div>

        {/* Card 2 — Stores */}
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E4E2EE' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#f3f0ff' }}
          >
            <Store className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>

          <div
            className="text-5xl font-black leading-none mb-2"
            style={{ color: '#0f0f1e' }}
          >
            {stores.length}
          </div>
          <div className="text-[14px] font-semibold mb-1" style={{ color: '#0f0f1e' }}>
            Stores connectés
          </div>
          <div className="text-[12px]" style={{ color: '#6b6b84' }}>
            /{limits.stores} max
          </div>

          {/* Barre décorative bas */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #b5f23d)' }}
          />
        </div>

        {/* Card 3 — Pages ce mois */}
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E4E2EE' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#f7ffe0' }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: '#b5f23d' }} />
            </div>
            {/* Mini barres décoratives SVG */}
            <svg width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
              <rect x="0"  y="20" width="8" height="12" rx="2" fill="#b5f23d" opacity="0.5" />
              <rect x="13" y="12" width="8" height="20" rx="2" fill="#b5f23d" opacity="0.7" />
              <rect x="26" y="6"  width="8" height="26" rx="2" fill="#b5f23d" opacity="0.9" />
              <rect x="39" y="0"  width="8" height="32" rx="2" fill="#b5f23d" />
            </svg>
          </div>

          <div
            className="text-5xl font-black leading-none mb-2"
            style={{ color: '#0f0f1e' }}
          >
            {used}
          </div>
          <div className="text-[14px] font-semibold mb-1" style={{ color: '#0f0f1e' }}>
            Pages ce mois
          </div>
          <div className="text-[12px]" style={{ color: '#6b6b84' }}>
            /{limits.pages} incluses
          </div>
        </div>
      </div>

      {/* ── QUOTA MENSUEL ── */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: '#FFFFFF', border: '1px solid #E4E2EE' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="text-[15px] font-black"
              style={{ color: '#0f0f1e' }}
            >
              Quota mensuel
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize"
              style={{ background: '#f3f0ff', color: '#7c3aed' }}
            >
              {plan}
            </span>
          </div>
          <span
            className="text-[14px] font-black"
            style={{ color: '#0f0f1e' }}
          >
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2.5 rounded-full overflow-hidden"
          style={{ background: '#F0EDF8' }}
        >
          {barFill ? (
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: barFill }}
            />
          ) : (
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #7c3aed, #b5f23d)',
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[12px]" style={{ color: '#6b6b84' }}>
            {used} pages utilisées sur {limits.pages}
          </span>
          {pct >= 90 && (
            <Link
              href="/pricing"
              className="text-[12px] font-semibold underline"
              style={{ color: '#ef4444' }}
            >
              Limite proche — upgrader
            </Link>
          )}
        </div>
      </div>

      {/* ── ACTIONS RAPIDES ── */}
      <div className="mb-2">
        <span
          className="text-[13px] font-black uppercase tracking-widest"
          style={{ color: '#6b6b84' }}
        >
          Démarrer
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Action 1 — Créer une page (dark) */}
        <Link
          href="/dashboard/new"
          className="relative group rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all hover:shadow-[0_0_0_2px_rgba(124,58,237,0.4),0_8px_32px_rgba(124,58,237,0.15)]"
          style={{
            background: '#0f0f1e',
            border: '1px solid #1e1e2e',
          }}
        >
          {/* Flèche haut droite */}
          <div className="absolute top-4 right-4">
            <ArrowUpRight className="w-4 h-4" style={{ color: '#b5f23d' }} />
          </div>

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(181,242,61,0.12)' }}
          >
            <Plus className="w-5 h-5" style={{ color: '#b5f23d' }} />
          </div>

          <div>
            <div className="text-[15px] font-black text-white mb-1">
              Créer une page
            </div>
            <div className="text-[13px]" style={{ color: '#9090a8' }}>
              Colle une URL produit ou saisis manuellement
            </div>
          </div>
        </Link>

        {/* Action 2 — Connecter un store (blanc) */}
        <Link
          href="/dashboard/stores"
          className="relative group rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all hover:border-purple-400 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.2)]"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E2EE',
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: '#f3f0ff' }}
          >
            <Store className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>

          <div>
            <div
              className="text-[15px] font-black mb-1"
              style={{ color: '#0f0f1e' }}
            >
              Connecter un store
            </div>
            <div className="text-[13px]" style={{ color: '#6b6b84' }}>
              Shopify ou WooCommerce
            </div>
          </div>
        </Link>
      </div>

    </div>
  )
}
