import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: '17 Templates de pages produit haute conversion — KONVERT',
  description:
    '17 templates de landing pages e-commerce testés sur 50 000+ pages. Choisissez votre style, copiez-collez sur Shopify ou WooCommerce. Minimal, luxe, beauty, gaming et plus.',
  path: '/templates',
})

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
