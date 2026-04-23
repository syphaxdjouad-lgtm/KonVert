import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Mode Agence — White-Label | KONVERT',
  description: 'Gérez 50 clients avec une équipe de 4. Dashboard multi-clients, white-label, rapports PDF automatiques.',
  path: '/agence',
})

export default function AgenceLayout({ children }: { children: React.ReactNode }) {
  return children
}
