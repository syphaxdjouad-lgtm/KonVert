import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Contact — KONVERT',
  description: 'Une question sur KONVERT ? Contactez-nous par email ou chat. Réponse garantie sous 24h, en français.',
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
