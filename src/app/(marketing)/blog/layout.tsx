import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Blog KONVERT — Conseils e-commerce, conversion, landing pages',
  description:
    'Guides pratiques, analyses data et stratégies testées pour booster vos conversions e-commerce. Shopify, dropshipping, A/B testing, fiches produit — tout ce dont vous avez besoin pour vendre plus.',
  path: '/blog',
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
