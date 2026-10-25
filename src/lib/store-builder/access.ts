// Store Builder — wiring serveur du gating (session Supabase + plan user).
// Logique de décision pure dans ./flag.ts. Server-only : importe
// next/headers via le client Supabase serveur — ne jamais importer depuis
// un composant client.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PlanType } from '@/types'
import {
  canConnectShop,
  hasStoreBuilderAdmins,
  isStoreBuilderEnabled,
  resolveStoreBuilderAccess,
  type StoreBuilderAccess,
} from './flag'

export interface StoreBuilderSession {
  access: StoreBuilderAccess
  userId: string | null
}

export async function getStoreBuilderSession(): Promise<StoreBuilderSession> {
  // Court-circuit sans I/O : flag OFF et aucun admin configuré → personne
  // n'a accès, inutile de payer un aller-retour Supabase Auth.
  if (!isStoreBuilderEnabled() && !hasStoreBuilderAdmins()) {
    return { access: { kind: 'hidden' }, userId: null }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { access: { kind: 'hidden' }, userId: null }

  const preAccess = resolveStoreBuilderAccess({ email: user.email, plan: null })
  // Admin (granted) ou flag OFF (hidden) : le plan ne change rien.
  if (preAccess.kind !== 'upgrade') return { access: preAccess, userId: user.id }

  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle<{ plan: PlanType }>()

  return {
    access: resolveStoreBuilderAccess({ email: user.email, plan: profile?.plan }),
    userId: user.id,
  }
}

const notFoundJson = () =>
  NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Not found' } }, { status: 404 })

// Routes publiques (snippet thème, webhook Shopify) : aucune session user,
// gating sur le seul flag global. Renvoie la 404 à retourner, ou null.
export function guardStoreBuilderPublicRoute(): NextResponse | null {
  return isStoreBuilderEnabled() ? null : notFoundJson()
}

type GrantedAccess = Extract<StoreBuilderAccess, { kind: 'granted' }>
type VisibleAccess = Exclude<StoreBuilderAccess, { kind: 'hidden' }>

export type StoreBuilderUserGuard<A extends VisibleAccess = GrantedAccess> =
  | { ok: true; access: A; userId: string }
  | { ok: false; response: NextResponse }

// Routes dashboard (user loggé). Par défaut exige un plan éligible ;
// `allowUpgrade` laisse passer un user sans plan éligible (ex. revoke :
// un Pro redescendu en Starter doit pouvoir déconnecter sa boutique).
export async function guardStoreBuilderUserRoute(): Promise<StoreBuilderUserGuard>
export async function guardStoreBuilderUserRoute(opts: { allowUpgrade: true }): Promise<StoreBuilderUserGuard<VisibleAccess>>
export async function guardStoreBuilderUserRoute(
  opts: { allowUpgrade?: boolean } = {},
): Promise<StoreBuilderUserGuard<VisibleAccess>> {
  const { access, userId } = await getStoreBuilderSession()

  // Pas d'accès ou pas de session : 404 (on ne révèle pas l'existence du
  // module tant qu'il n'est pas ouvert ; quand il l'est, le proxy renvoie
  // déjà les non-loggés vers /login sur le dashboard).
  if (access.kind === 'hidden' || !userId) return { ok: false, response: notFoundJson() }

  if (access.kind === 'upgrade' && !opts.allowUpgrade) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: 'PLAN_REQUIRED', message: 'Le Store Builder est inclus à partir du plan Pro.' } },
        { status: 403 },
      ),
    }
  }

  return { ok: true, access, userId }
}

// Quota de boutiques (PLAN_LIMITS[plan].storeBuilderStores) appliqué au
// connect (UX : échec avant le détour Shopify) ET au callback (point
// d'écriture autoritatif, avant l'échange de token). Lecture via le client
// session (RLS "auth.uid() = user_id").
export async function canUserConnectShop(userId: string, maxStores: number, shop: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shopify_store_connections')
    .select('shop_domain')
    .eq('user_id', userId)
  if (error) throw error
  const connectedShops = ((data ?? []) as { shop_domain: string }[]).map((r) => r.shop_domain)
  return canConnectShop({ maxStores, connectedShops, shop })
}
