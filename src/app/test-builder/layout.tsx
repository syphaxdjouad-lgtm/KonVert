import { notFound } from 'next/navigation'

// Page de test interne — accessible uniquement en dev.
export default function TestBuilderLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return <>{children}</>
}
