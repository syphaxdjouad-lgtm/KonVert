import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'À propos de KONVERT — La solution des e-commerçants qui veulent vendre',
  description:
    "KONVERT est né d'une obsession : que chaque e-commerçant puisse avoir des pages produit aussi bonnes que les grandes marques, sans agence, sans freelance, en 30 secondes.",
  path: '/about',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
