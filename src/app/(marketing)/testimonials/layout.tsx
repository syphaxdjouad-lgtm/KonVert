import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Témoignages Clients | KONVERT',
  description: 'Découvrez comment nos clients augmentent leurs conversions avec KONVERT. Résultats chiffrés et études de cas.',
  path: '/testimonials',
})

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children
}
