import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Essai Gratuit — 1 Page Offerte | KONVERT',
  description: 'Génère ta première landing page e-commerce gratuitement. Aucune inscription, aucune carte bancaire. Résultat en 30 secondes.',
  path: '/essai',
})

export default function EssaiLayout({ children }: { children: React.ReactNode }) {
  return children
}
