import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Mode Agence — White-Label | KONVERT',
  description: 'Gérez plus de clients sans agrandir l\'équipe. Dashboard multi-clients, white-label, rapports PDF automatiques.',
  path: '/agence',
})

export default function AgenceLayout({ children }: { children: React.ReactNode }) {
  return children
}
