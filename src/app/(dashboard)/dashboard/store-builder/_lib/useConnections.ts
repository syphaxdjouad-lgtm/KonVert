'use client'

// Store Builder — hook client : charge les connexions Shopify Store Builder
// du user courant (table `shopify_store_connections`, RLS "auth.uid() =
// user_id" — lecture directe via le client Supabase anon-key, même pattern
// que src/app/(dashboard)/dashboard/stores/page.tsx). Ne sélectionne jamais
// `access_token` (chiffré, mais aucune raison de le faire transiter côté
// client pour un simple affichage).

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { StoreBuilderConnection } from './types'

export interface UseConnectionsResult {
  connections: StoreBuilderConnection[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useStoreBuilderConnections(): UseConnectionsResult {
  const [connections, setConnections] = useState<StoreBuilderConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setConnections([])
        return
      }
      const { data, error: fetchErr } = await supabase
        .from('shopify_store_connections')
        .select('id, shop_domain, scopes, theme_id, product_id, theme_installed_at, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchErr) {
        // La table peut ne pas encore exister si la migration Supabase n'a
        // pas été appliquée (tâche manuelle founder, cf. rapport) — on
        // dégrade en état vide plutôt que de crasher l'écran.
        console.error('[store-builder/useConnections]', fetchErr.message)
        setError(fetchErr.message)
        setConnections([])
        return
      }
      setConnections((data as StoreBuilderConnection[]) ?? [])
    } catch (err) {
      console.error('[store-builder/useConnections]', err)
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
      setConnections([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { connections, loading, error, refresh }
}
