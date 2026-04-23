import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Services — Audit, Suivi, Coaching | KONVERT',
  description: 'Audit e-commerce, suivi de performance et coaching business. Boostez les conversions de votre boutique avec nos experts.',
  path: '/services',
})

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
