import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { getStoreBuilderSession } from '@/lib/store-builder/access'

// Layout SERVEUR du dashboard : calcule la visibilité de l'onglet Store
// Builder (flag + admin + plan, cf. src/lib/store-builder/flag.ts) puis
// délègue l'UI au shell client. Starter voit l'onglet (écran d'upgrade) ;
// seul le cas "hidden" (flag OFF hors admin) le retire.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let showStoreBuilder = false
  try {
    const { access } = await getStoreBuilderSession()
    showStoreBuilder = access.kind !== 'hidden'
  } catch (err) {
    // Une panne Supabase ne doit jamais casser tout le dashboard pour un
    // onglet : on le masque simplement.
    console.error('[dashboard/layout] store builder access check failed:', err)
  }

  return <DashboardShell showStoreBuilder={showStoreBuilder}>{children}</DashboardShell>
}
