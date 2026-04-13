import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Fonctionnalités KONVERT — Génération IA, A/B Testing, Analytics',
  description:
    'Découvrez toutes les fonctionnalités KONVERT : génération de pages produit par IA en 30s, 17 templates haute conversion, A/B testing, analytics temps réel et intégration Shopify / WooCommerce.',
  path: '/features',
})

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children
}
