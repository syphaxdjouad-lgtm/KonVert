import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { TEMPLATE_COUNT } from '@/lib/templates'

export const metadata: Metadata = generateMetadata({
  title: `${TEMPLATE_COUNT} Templates de pages produit haute conversion`,
  description:
    `${TEMPLATE_COUNT} templates de landing pages e-commerce testés sur 50 000+ pages. Choisissez votre style, copiez-collez sur Shopify ou WooCommerce. Minimal, luxe, beauty, gaming et plus.`,
  path: '/templates',
})

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
