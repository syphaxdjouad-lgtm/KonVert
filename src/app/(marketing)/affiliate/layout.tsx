import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

// Server Component layout — fournit la metadata propre à la route /affiliate.
// Sans ça, les recruteurs d'affiliés voient le title homepage et un OG
// générique en partageant le lien.

export const metadata: Metadata = genMeta({
  title: 'Programme affilié — gagne 20-30 % récurrents',
  description:
    'Recommande KONVERT et touche 20 à 30 % de commission récurrente sur chaque abonnement actif. Inscription gratuite, sans plafond.',
  path: '/affiliate',
})

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children
}
