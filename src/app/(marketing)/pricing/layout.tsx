import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs — Choisissez votre plan KONVERT',
  description: 'Plans Starter, Pro et Agence. Générez des landing pages e-commerce haute conversion à partir de 29€/mois. Essai gratuit inclus.',
  openGraph: {
    title: 'Tarifs KONVERT — Landing pages e-commerce à partir de 29€/mois',
    description: 'Choisissez le plan adapté à votre volume. Starter, Pro ou Agence — publiez directement sur Shopify ou WooCommerce.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'}/pricing`,
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
