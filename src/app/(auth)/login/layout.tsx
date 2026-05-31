import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connecte-toi à ton espace KONVERT pour générer et publier tes landing pages e-commerce.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konvertpilot.com'}/login`,
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
