import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Tarifs KONVERT — Starter 39€/mois, Pro 79€/mois, Agency 199€/mois',
  description:
    'Plans Starter (39€/mois), Pro (79€/mois) et Agency (199€/mois). Générez des landing pages e-commerce haute conversion et publiez directement sur Shopify ou WooCommerce. 1 page gratuite.',
  path: '/pricing',
})

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
