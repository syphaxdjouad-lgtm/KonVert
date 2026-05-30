import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

// Server Component layout — fournit la metadata propre à la route /launch-day.
// Sans ça, Next.js fallback sur la metadata du root layout (title homepage,
// canonical = "/") → SEO + previews sociales catastrophiques le jour J.

export const metadata: Metadata = genMeta({
  title: 'KONVERT est LIVE — Product Hunt 2 juin 2026',
  description:
    'KONVERT lance officiellement le 2 juin sur Product Hunt. Code LAUNCH50 = -50 % sur le premier mois. Génère ta première landing page IA en 30 secondes.',
  path: '/launch-day',
})

export default function LaunchDayLayout({ children }: { children: React.ReactNode }) {
  return children
}
