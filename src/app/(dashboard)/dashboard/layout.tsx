// Force le rendu dynamique sur toutes les routes /dashboard/*.
// Sans ça, les pages 'use client' (new, stores, agency, analytics, settings)
// étaient générées en HTML statique au build → potentiellement servies depuis
// le cache CDN partagé, donc fuite possible de l'UI d'un user vers un autre
// au premier paint avant que le client component ne refetche les données.
export const dynamic = 'force-dynamic'

export default function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}
