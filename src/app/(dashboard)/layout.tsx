'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Store, Plus, Zap, LogOut,
  BarChart2, Users, ChevronRight, Sparkles, Bell, Search,
  Settings
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard',            label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/pages',      label: 'Mes pages',       icon: FileText },
  { href: '/dashboard/stores',     label: 'Mes stores',      icon: Store },
  { href: '/dashboard/analytics',  label: 'Analytics',       icon: BarChart2 },
  { href: '/dashboard/agency',     label: 'Mode Agence',     icon: Users },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

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
            <span className="font-black text-[15px] tracking-tight" style={{ color: '#1a1a2e' }}>
              Konvert
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#f3f0ff', color: '#7c3aed' }}>beta</span>
          </div>
        </div>

        {/* CTA Nouvelle page */}
        <div className="p-3">
          <Link
            href="/dashboard/new"
            className="flex items-center justify-center gap-2 w-full font-bold text-[13px] py-2.5 px-3 rounded-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
            }}
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group"
                  style={active ? {
                    background: '#f3f0ff',
                    color: '#7c3aed',
                  } : {
                    color: '#5c5c7a',
                  }}
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

        {/* Footer */}
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
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4" style={{ color: '#8b8b9e' }} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{ color: '#1a1a2e' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100">
              <Bell className="w-4 h-4" style={{ color: '#5c5c7a' }} />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100">
              <Settings className="w-4 h-4" style={{ color: '#5c5c7a' }} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              K
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
