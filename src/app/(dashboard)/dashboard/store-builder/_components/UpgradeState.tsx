import Link from 'next/link'
import { Lock } from 'lucide-react'

// Écran affiché aux plans sans Store Builder (free/starter) quand le flag
// est ON — calqué sur l'état "Fonctionnalité Agency" de /dashboard/agency.
export function UpgradeState() {
  return (
    <div className="p-8 max-w-lg mx-auto text-center py-24">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <Lock className="w-8 h-8" style={{ color: '#7c3aed' }} />
      </div>
      <h2 className="text-2xl font-black mb-3" style={{ color: '#111' }}>Store Builder — plan Pro</h2>
      <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: '#6b7280' }}>
        Génère et pilote une boutique Shopify complète depuis un lien produit. Inclus dès le plan Pro
        (1 boutique), multi-boutiques en Agency.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      >
        Passer au plan Pro
      </Link>
    </div>
  )
}
