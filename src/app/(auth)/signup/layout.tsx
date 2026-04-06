import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rejoindre la bêta — KONVERT',
  description: 'Inscris-toi à la bêta KONVERT et génère ta première landing page e-commerce haute conversion en 30 secondes. Places limitées.',
  openGraph: {
    title: 'Rejoins la bêta KONVERT — Landing pages e-commerce IA',
    description: 'Accès anticipé à KONVERT. Génère des pages qui convertissent pour ton dropshipping en 30 secondes.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'}/signup`,
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
