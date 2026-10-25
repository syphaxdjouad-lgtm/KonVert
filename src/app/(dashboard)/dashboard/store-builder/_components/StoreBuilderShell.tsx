'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link2, Sparkles, SplitSquareHorizontal, Gauge } from 'lucide-react'

// Store Builder — shell client de l'onglet dashboard (rendu par le layout
// serveur ../layout.tsx après vérification flag + plan), sous-navigation à 4 écrans
// (Connexion / Générateur / A/B tests / Score CRO). Reprend le pattern
// "pills" du TOP_TABS de src/app/(dashboard)/layout.tsx pour rester cohérent
// avec la charte existante (fond off-white hérité, cartes blanches, accent
// violet #7c3aed — jamais de fond noir, cf. contrainte design NEXARA).

const SUB_TABS = [
  { href: '/dashboard/store-builder',           label: 'Connexion',   icon: Link2 },
  { href: '/dashboard/store-builder/generate',   label: 'Générateur',  icon: Sparkles },
  { href: '/dashboard/store-builder/ab-tests',   label: 'Tests A/B',   icon: SplitSquareHorizontal },
  { href: '/dashboard/store-builder/audit',      label: 'Score CRO',   icon: Gauge },
]

export function StoreBuilderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    if (href === '/dashboard/store-builder') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#111' }}>Store Builder</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Génère et pilote une boutique Shopify complète depuis un simple lien produit.
        </p>
      </div>

      <nav
        className="flex items-center gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
        style={{ background: '#EDEBF7', width: 'fit-content' }}
        aria-label="Sections Store Builder"
      >
        {SUB_TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all"
              style={active ? { background: '#7c3aed', color: '#fff' } : { color: '#5b5b73' }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {children}
    </div>
  )
}
