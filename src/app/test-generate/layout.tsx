import { notFound } from 'next/navigation'

// Page de test interne — accessible uniquement en dev.
// En prod, /test-generate renvoie 404 (évite la consommation du quota Anthropic
// par n'importe quel visiteur authentifié qui tomberait sur l'URL).
export default function TestGenerateLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return <>{children}</>
}
