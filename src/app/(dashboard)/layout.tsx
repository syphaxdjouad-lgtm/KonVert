'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Store, Plus, Zap, LogOut,
  BarChart2, Users, Settings, X, Menu,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import NotificationBell from '@/components/dashboard/NotificationBell'
import { identifyUser, resetUser } from '@/lib/analytics'

const NAV_ITEMS = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { href: '/dashboard/pages',     icon: FileText,         label: 'Mes pages'       },
  { href: '/dashboard/stores',    icon: Store,            label: 'Mes stores'      },
  { href: '/dashboard/analytics', icon: BarChart2,        label: 'Analytics'       },
  { href: '/dashboard/agency',    icon: Users,            label: 'Mode Agence'     },
]

// Items affichés dans la bottom nav mobile (les plus utilisés)
const MOBILE_NAV = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Accueil'    },
  { href: '/dashboard/pages',     icon: FileText,         label: 'Pages'      },
  { href: '/dashboard/new',       icon: Plus,             label: 'Créer'      },
  { href: '/dashboard/analytics', icon: BarChart2,        label: 'Analytics'  },
]

const TOP_TABS = [
  { href: '/dashboard',           label: 'Vue d\'ensemble' },
  { href: '/dashboard/analytics', label: 'Analytics'       },
  { href: '/dashboard/pages',     label: 'Mes pages'       },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userInitial, setUserInitial] = useState('K')

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Récupérer l'initiale et identifier l'utilisateur dans PostHog
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || ''
      const initial = name.charAt(0).toUpperCase()
      if (initial) setUserInitial(initial)
      identifyUser(user.id, {
        email: user.email,
        created_at: user.created_at,
      })
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    resetUser()
    router.push('/login')
  }

  function isNavActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function isTabActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F5F4FA', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >

      {/* ── SIDEBAR (desktop only) ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r"
        style={{
          width: '68px',
          background: '#FFFFFF',
          borderColor: '#E4E2EE',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center border-b"
          style={{ height: '68px', borderColor: '#E4E2EE' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 52 52" fill="none" aria-label="KONVERT">
            <rect width="52" height="52" rx="12" fill="#7c3aed"/>
            <rect x="14" y="12" width="6" height="28" rx="2" fill="white"/>
            <path d="M20 26 L35 13" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M20 26 L33 39" stroke="#b5f23d" strokeWidth="5.5" strokeLinecap="round"/>
            <polygon points="33,39 24,37 31,30" fill="#b5f23d"/>
          </svg>
        </div>

        {/* Nav principale */}
        <nav className="flex-1 flex flex-col items-center py-4 gap-1.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isNavActive(href)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={active ? {
                  background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                } : {
                  color: '#a0a0b8',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = '#F0EDF8'
                    ;(e.currentTarget as HTMLElement).style.color = '#7c3aed'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#a0a0b8'
                  }
                }}
              >
                <Icon className="w-[19px] h-[19px]" strokeWidth={active ? 2.2 : 1.8} />
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div
          className="flex flex-col items-center py-3 gap-1.5 border-t"
          style={{ borderColor: '#E4E2EE' }}
        >
          <Link
            href="/dashboard/new"
            title="Créer une page"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{ color: '#a0a0b8', background: 'transparent' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#F0EDF8'
              ;(e.currentTarget as HTMLElement).style.color = '#7c3aed'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#a0a0b8'
            }}
          >
            <Plus className="w-[19px] h-[19px]" strokeWidth={1.8} />
          </Link>

          <Link
            href="/pricing"
            title="Upgrader mon plan"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{ background: '#f3f0ff', color: '#7c3aed' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#ede9fe'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(124,58,237,0.2)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#f3f0ff'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <Zap className="w-[18px] h-[18px]" strokeWidth={2} />
          </Link>

          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{ color: '#a0a0b8', background: 'transparent' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#fff0f0'
              ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#a0a0b8'
            }}
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </button>
        </div>
      </aside>

      {/* ── MOBILE SLIDE-OUT MENU (overlay) ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel */}
          <div
            className="relative w-72 max-w-[80vw] flex flex-col h-full"
            style={{ background: '#FFFFFF' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 border-b" style={{ height: '60px', borderColor: '#E4E2EE' }}>
              <div className="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 52 52" fill="none">
                  <rect width="52" height="52" rx="12" fill="#7c3aed"/>
                  <rect x="14" y="12" width="6" height="28" rx="2" fill="white"/>
                  <path d="M20 26 L35 13" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
                  <path d="M20 26 L33 39" stroke="#b5f23d" strokeWidth="5.5" strokeLinecap="round"/>
                  <polygon points="33,39 24,37 31,30" fill="#b5f23d"/>
                </svg>
                <span className="font-black text-base tracking-tight">
                  <span style={{ color: '#1a1a2e' }}>KON</span>
                  <span style={{ color: '#7c3aed' }}>VERT</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ color: '#6b6b84', background: '#F5F4FA' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 py-3 px-3 space-y-1 overflow-auto">
              {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                const active = isNavActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={active ? {
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: '#ffffff',
                    } : {
                      color: '#6b6b84',
                    }}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                    {label}
                  </Link>
                )
              })}

              <div className="my-3 border-t" style={{ borderColor: '#E4E2EE' }} />

              <Link
                href="/dashboard/new"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: '#7c3aed', background: '#f3f0ff' }}
              >
                <Plus className="w-[18px] h-[18px]" strokeWidth={2} />
                Créer une page
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: '#6b6b84' }}
              >
                <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
                Paramètres
              </Link>

              <Link
                href="/pricing"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: '#7c3aed' }}
              >
                <Zap className="w-[18px] h-[18px]" strokeWidth={2} />
                Upgrader mon plan
              </Link>
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t" style={{ borderColor: '#E4E2EE' }}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full transition-colors"
                style={{ color: '#ef4444' }}
              >
                <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOPBAR ── */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 flex-shrink-0 border-b sticky top-0 z-10"
          style={{
            height: '60px',
            background: '#FFFFFF',
            borderColor: '#E4E2EE',
          }}
        >
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ color: '#6b6b84', background: '#F5F4FA' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-sm tracking-tight">
              <span style={{ color: '#1a1a2e' }}>KON</span>
              <span style={{ color: '#7c3aed' }}>VERT</span>
            </span>
          </div>

          {/* Desktop: onglets pill-style */}
          <div
            className="hidden lg:flex items-center gap-1 p-1 rounded-xl"
            style={{ background: '#F5F4FA' }}
          >
            {TOP_TABS.map(({ href, label }) => {
              const active = isTabActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
                  style={active ? {
                    background: '#7c3aed',
                    color: '#ffffff',
                  } : {
                    color: '#6b6b84',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <NotificationBell />
            </div>
            <Link
              href="/dashboard/settings"
              title="Paramètres"
              className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center transition-colors"
              style={{ color: '#6b6b84' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F4FA')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Settings className="w-4 h-4" />
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className={`flex-1 ${pathname.startsWith('/dashboard/new') ? 'overflow-hidden' : 'overflow-auto pb-20 lg:pb-0'}`}>
          {children}
        </div>
      </main>

      {/* ── BOTTOM NAV (mobile only) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around"
        style={{
          background: '#FFFFFF',
          borderColor: '#E4E2EE',
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = isNavActive(href)
          const isCreate = href === '/dashboard/new'
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
              style={{ color: active ? '#7c3aed' : '#a0a0b8' }}
            >
              {isCreate ? (
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center -mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
              ) : (
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.6} />
              )}
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}
        {/* More button → opens slide-out */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
          style={{ color: '#a0a0b8' }}
        >
          <Menu className="w-5 h-5" strokeWidth={1.6} />
          <span className="text-[10px] font-semibold">Plus</span>
        </button>
      </nav>
    </div>
  )
}
