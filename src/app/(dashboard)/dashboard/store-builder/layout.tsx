import { notFound } from 'next/navigation'
import { getStoreBuilderSession } from '@/lib/store-builder/access'
import { StoreBuilderShell } from './_components/StoreBuilderShell'
import { UpgradeState } from './_components/UpgradeState'

// Layout SERVEUR : gate unique pour toutes les pages du module.
// - flag OFF (hors admin) → 404, le module n'existe pas pour l'utilisateur ;
// - plan sans Store Builder (free/starter) → écran d'upgrade à la place des
//   pages (même pattern que Mode Agence) ;
// - sinon → shell client + pages.
// Les routes API sont gatées indépendamment (cf. src/lib/store-builder/access.ts).
export default async function StoreBuilderLayout({ children }: { children: React.ReactNode }) {
  const { access } = await getStoreBuilderSession()
  if (access.kind === 'hidden') notFound()
  if (access.kind === 'upgrade') return <UpgradeState />
  return <StoreBuilderShell>{children}</StoreBuilderShell>
}
