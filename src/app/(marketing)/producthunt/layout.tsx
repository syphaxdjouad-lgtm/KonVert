import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

// Server Component layout — fournit la metadata propre à la route /producthunt.
// Sans ça, le partage social pendant le launch montrerait le title et le
// visuel de la homepage au lieu de l'offre PH.

export const metadata: Metadata = genMeta({
  title: 'Offre Product Hunt — 50 % sur le premier mois',
  description:
    'Tu viens de Product Hunt ? Code LAUNCH50 pour -50 % sur ton premier mois KONVERT. 100 places, tous plans confondus.',
  path: '/producthunt',
})

export default function ProductHuntLayout({ children }: { children: React.ReactNode }) {
  return children
}
