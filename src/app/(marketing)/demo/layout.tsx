import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Démo KONVERT — Génère une page produit en 30 secondes sans inscription',
  description:
    "Essaie KONVERT gratuitement sans compte. Colle une URL AliExpress, Amazon ou Alibaba et vois la magie opérer : ta landing page haute conversion générée par l'IA en 30 secondes.",
  path: '/demo',
})

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
