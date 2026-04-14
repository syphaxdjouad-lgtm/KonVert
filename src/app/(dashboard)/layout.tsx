'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Store, Plus, Zap, LogOut,
  BarChart2, Users, Bell, Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { href: '/dashboard/pages',     icon: FileText,         label: 'Mes pages'       },
  { href: '/dashboard/stores',    icon: Store,            label: 'Mes stores'      },
  { href: '/dashboard/analytics', icon: BarChart2,        label: 'Analytics'       },
  { href: '/dashboard/agency',    icon: Users,            label: 'Mode Agence'     },
]

const TOP_TABS = [
  { href: '/dashboard',           label: 'Vue d\'ensemble' },
  { href: '/dashboard/analytics', label: 'Analytics'       },
  { href: '/dashboard/pages',     label: 'Mes pages'       },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
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

      {/* ── SIDEBAR ── */}
      <aside
        className="flex flex-col flex-shrink-0 border-r"
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
        <nav className="flex-1 flex flex-col items-center py-3 gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isNavActive(href)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={active ? {
                  background: '#f3f0ff',
                  color: '#7c3aed',
                } : {
                  color: '#9090a8',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = '#F5F4FA'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <Icon className="w-[18px] h-[18px]" />
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div
          className="flex flex-col items-center py-3 gap-1 border-t"
          style={{ borderColor: '#E4E2EE' }}
        >
          <Link
            href="/dashboard/new"
            title="Créer une page"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ color: '#9090a8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F4FA')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <Plus className="w-[18px] h-[18px]" />
          </Link>

          <Link
            href="/pricing"
            title="Upgrader mon plan"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ color: '#7c3aed' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f0ff')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <Zap className="w-[18px] h-[18px]" />
          </Link>

          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ color: '#9090a8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F4FA')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOPBAR ── */}
        <header
          className="flex items-center justify-between px-6 flex-shrink-0 border-b sticky top-0 z-10"
          style={{
            height: '60px',
            background: '#FFFFFF',
            borderColor: '#E4E2EE',
          }}
        >
          {/* Onglets pill-style */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
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
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: '#6b6b84' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F4FA')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: '#6b6b84' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F5F4FA')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Settings className="w-4 h-4" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
            >
              K
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
