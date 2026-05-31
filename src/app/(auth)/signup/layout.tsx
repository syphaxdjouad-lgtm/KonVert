import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer mon compte',
  description: 'Crée ton compte KONVERT et génère des landing pages e-commerce haute conversion en 30 secondes. Sans engagement, satisfait ou remboursé 30 jours.',
  openGraph: {
    title: 'Créer mon compte KONVERT — Landing pages e-commerce IA',
    description: 'Génère des pages produit qui convertissent en 30 secondes. Starter à 39€/mois, satisfait ou remboursé.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konvertpilot.com'}/signup`,
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
