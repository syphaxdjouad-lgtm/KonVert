import type { LucideIcon } from 'lucide-react'

// Store Builder — état vide générique, réutilisé sur les 4 écrans (connexion,
// générateur, A/B tests, audit). Reprend le pattern visuel de
// EmptyStores (src/app/(dashboard)/dashboard/stores/page.tsx) pour rester
// cohérent avec la charte existante — fond blanc, bordure pointillée claire.

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-16 px-6 rounded-2xl" style={{ border: '2px dashed #e5e7eb', background: '#fff' }}>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(124,58,237,0.08)' }}
      >
        <Icon className="w-7 h-7" style={{ color: '#7c3aed' }} />
      </div>
      <h3 className="font-black text-base mb-1.5" style={{ color: '#111' }}>{title}</h3>
      <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#6b7280' }}>{description}</p>
      {action}
    </div>
  )
}

/** Bannière "placeholder" — marque explicitement une donnée mock/exemple à
 * l'écran (contrainte NEXARA : jamais de mock non-marqué). */
export function MockDataBanner({ label = 'Exemple — données fictives, pas encore ta vraie boutique' }: { label?: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4 text-xs font-bold"
      style={{ background: 'rgba(124,58,237,0.06)', border: '1px dashed rgba(124,58,237,0.35)', color: '#6d28d9' }}
    >
      <span aria-hidden>✦</span>
      {label}
    </div>
  )
}
