'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Store, Plus, Zap, LogOut, BarChart2, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard',        label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/pages',  label: 'Mes pages',       icon: FileText },
  { href: '/dashboard/stores',    label: 'Mes stores',    icon: Store },
  { href: '/dashboard/analytics', label: 'Analytics',     icon: BarChart2 },
  { href: '/dashboard/agency',    label: 'Mode Agence',   icon: Users },
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <span className="font-black text-xl text-gray-900">KONVERT</span>
          <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">beta</span>
        </div>

        {/* CTA Nouvelle page */}
        <div className="p-3">
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-2.5 px-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle page
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 hover:bg-yellow-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Upgrader mon plan
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  )
}
