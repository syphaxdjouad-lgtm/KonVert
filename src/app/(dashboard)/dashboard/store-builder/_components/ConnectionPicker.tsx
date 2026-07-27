import { PlatformLogo } from '@/components/ui/platform-logo'
import { ChevronDown } from 'lucide-react'
import type { StoreBuilderConnection } from '../_lib/types'

// Store Builder — sélecteur de boutique connectée, partagé par les écrans
// Générateur / A/B tests / Score CRO. Affiche un simple badge si une seule
// connexion, un <select> stylé sinon.

export function ConnectionPicker({
  connections,
  activeId,
  onChange,
}: {
  connections: StoreBuilderConnection[]
  activeId: string | null
  onChange: (id: string) => void
}) {
  if (connections.length === 0) return null

  if (connections.length === 1) {
    const c = connections[0]
    return (
      <div
        className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2"
        style={{ background: '#fff', border: '1px solid #e5e7eb' }}
      >
        <PlatformLogo platform="shopify" size={18} />
        <span className="text-sm font-bold" style={{ color: '#111' }}>{c.shop_domain}</span>
      </div>
    )
  }

  return (
    <div className="relative inline-flex">
      <label className="sr-only" htmlFor="store-builder-connection-picker">Choisir une boutique</label>
      <PlatformLogo platform="shopify" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <select
        id="store-builder-connection-picker"
        value={activeId ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl pl-9 pr-8 py-2 text-sm font-bold focus:outline-none"
        style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111' }}
      >
        {connections.map((c) => (
          <option key={c.id} value={c.id}>{c.shop_domain}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
    </div>
  )
}

export function StatusPill({
  tone,
  children,
}: {
  tone: 'green' | 'orange' | 'red' | 'gray'
  children: React.ReactNode
}) {
  const map: Record<typeof tone, { bg: string; text: string; dot: string }> = {
    green: { bg: 'rgba(22,163,74,0.08)', text: '#166534', dot: '#16a34a' },
    orange: { bg: 'rgba(249,115,22,0.08)', text: '#9a3412', dot: '#f97316' },
    red: { bg: 'rgba(220,38,38,0.08)', text: '#991b1b', dot: '#dc2626' },
    gray: { bg: '#f3f4f6', text: '#4b5563', dot: '#9ca3af' },
  }
  const c = map[tone]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {children}
    </span>
  )
}
