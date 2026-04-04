'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard, FileText, Store, Plus, Zap, LogOut,
  BarChart2, Users, ChevronRight, Sparkles, Bell, Search,
  Settings, X, TrendingUp, CheckCircle, Info, Star,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard',           label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/pages',     label: 'Mes pages',       icon: FileText },
  { href: '/dashboard/stores',    label: 'Mes stores',      icon: Store },
  { href: '/dashboard/analytics', label: 'Analytics',       icon: BarChart2 },
  { href: '/dashboard/agency',    label: 'Mode Agence',     icon: Users },
]

const NOTIFICATIONS = [
  {
    id: 1,
    icon: <Star className="w-3.5 h-3.5" />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Bienvenue dans KONVERT !',
    desc: 'Crée ta première page en collant une URL produit.',
    time: "À l'instant",
    unread: true,
  },
  {
    id: 2,
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.1)',
    title: 'Nouveau template disponible',
    desc: 'Le template "Bold Sales" vient d\'être mis à jour.',
    time: 'Il y a 2h',
    unread: true,
  },
  {
    id: 3,
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.1)',
    title: 'Astuce performance',
    desc: 'Ajoute des photos Avant/Après pour +35% de CTR.',
    time: 'Hier',
    unread: false,
  },
  {
    id: 4,
    icon: <Info className="w-3.5 h-3.5" />,
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.1)',
    title: 'Connecte ton store Shopify',
    desc: 'Publie tes pages directement en 1 clic.',
    time: 'Il y a 3j',
    unread: false,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [notifOpen, setNotifOpen]   = useState(false)
  const [readIds, setReadIds]       = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [userInitial, setUserInitial] = useState('K')
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.includes(n.id)).length

  // Fetch user initial
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const name  = data.user?.user_metadata?.name as string | undefined
      const email = data.user?.email
      const initial = name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'K'
      setUserInitial(initial)
    })
  }, [])

  // Ferme le dropdown notif au clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openNotif() {
    setNotifOpen(o => !o)
    // Marque tout comme lu quand on ouvre
    setReadIds(NOTIFICATIONS.map(n => n.id))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/dashboard/pages?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F6F6F7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] flex flex-col flex-shrink-0 border-r" style={{ background: '#ffffff', borderColor: '#E3E3E8' }}>

        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b" style={{ borderColor: '#E3E3E8' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-[15px] tracking-tight" style={{ color: '#1a1a2e' }}>Konvert</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#f3f0ff', color: '#7c3aed' }}>beta</span>
          </div>
        </div>

        {/* CTA Nouvelle page */}
        <div className="p-3">
          <Link
            href="/dashboard/new"
            className="flex items-center justify-center gap-2 w-full font-bold text-[13px] py-2.5 px-3 rounded-lg transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#ffffff', boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Créer une page
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                  style={active ? { background: '#f3f0ff', color: '#7c3aed' } : { color: '#5c5c7a' }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F6F6F7' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="w-3 h-3 opacity-40" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer sidebar */}
        <div className="p-2 border-t space-y-0.5" style={{ borderColor: '#E3E3E8' }}>
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={{ color: '#7c3aed' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f0ff')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <Zap className="w-4 h-4" />
            Upgrader mon plan
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all w-full text-left"
            style={{ color: '#8b8b9e' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F6F6F7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">

        {/* Top bar */}
        <div className="h-14 flex items-center justify-between px-6 border-b bg-white sticky top-0 z-10" style={{ borderColor: '#E3E3E8' }}>

          {/* Recherche */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#8b8b9e' }} />
            <input
              type="text"
              placeholder="Rechercher une page..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{ color: '#1a1a2e' }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5" style={{ color: '#8b8b9e' }} />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2">

            {/* Cloche notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={openNotif}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative"
                style={{ background: notifOpen ? '#f3f0ff' : 'transparent' }}
                onMouseEnter={e => { if (!notifOpen) (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
                onMouseLeave={e => { if (!notifOpen) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Bell className="w-4 h-4" style={{ color: notifOpen ? '#7c3aed' : '#5c5c7a' }} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {/* Dropdown notifications */}
              {notifOpen && (
                <div
                  className="absolute right-0 top-10 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <span className="text-sm font-black" style={{ color: '#111' }}>Notifications</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f3f0ff', color: '#7c3aed' }}>
                      {NOTIFICATIONS.length} total
                    </span>
                  </div>

                  {/* Liste */}
                  <div className="divide-y divide-gray-50">
                    {NOTIFICATIONS.map(n => {
                      const isUnread = n.unread && !readIds.includes(n.id)
                      return (
                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 cursor-default"
                          style={{ background: isUnread ? 'rgba(124,58,237,0.02)' : 'transparent' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.bg, color: n.color }}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[13px] font-bold truncate" style={{ color: '#111' }}>{n.title}</span>
                              {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />}
                            </div>
                            <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: '#6b7280' }}>{n.desc}</p>
                            <span className="text-[11px] mt-1 block" style={{ color: '#9ca3af' }}>{n.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid #f3f4f6' }}>
                    <span className="text-[12px] font-semibold" style={{ color: '#9ca3af' }}>
                      Toutes les notifications sont affichées
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f4f6')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Settings className="w-4 h-4" style={{ color: '#5c5c7a' }} />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              {userInitial}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
