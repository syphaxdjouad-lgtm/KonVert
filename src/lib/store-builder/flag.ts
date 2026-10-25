// Store Builder — feature flag + gating plan (logique PURE, sans I/O).
//
// Le module est mergé en prod mais masqué tant que `STORE_BUILDER_ENABLED`
// n'est pas à 'true' (migrations + env vars Shopify Store Builder pas encore
// posées en prod). Les emails listés dans `STORE_BUILDER_ADMIN_EMAILS`
// bypassent flag ET plan pour que le founder teste en prod flag OFF.
//
// Pourquoi pas `isAdmin` (src/lib/security/admin-auth.ts) : il compare un
// header `x-admin-secret`, qu'un navigateur n'envoie pas sur une navigation
// de page — inutilisable pour afficher la nav / les pages au founder. On
// s'appuie donc sur l'email de la session Supabase (vérifiée côté serveur
// via `auth.getUser()`), jamais sur une valeur fournie par le client.
//
// Le wiring serveur (session, lookup plan) est dans ./access.ts.

import { PLAN_LIMITS, type PlanType } from '@/types'

export function isStoreBuilderEnabled(): boolean {
  return process.env.STORE_BUILDER_ENABLED === 'true'
}

function getAdminEmails(): string[] {
  return (process.env.STORE_BUILDER_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function hasStoreBuilderAdmins(): boolean {
  return getAdminEmails().length > 0
}

export function isStoreBuilderAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}

export type StoreBuilderAccess =
  // Flag OFF et pas admin : le module n'existe pas pour ce user (404).
  | { kind: 'hidden' }
  // Flag ON mais plan sans Store Builder (free/starter) : onglet visible,
  // écran d'upgrade à la place du module (même pattern que Mode Agence).
  | { kind: 'upgrade'; plan: PlanType }
  | { kind: 'granted'; maxStores: number; viaAdmin: boolean }

export function resolveStoreBuilderAccess(input: {
  email: string | null | undefined
  plan: PlanType | null | undefined
}): StoreBuilderAccess {
  if (isStoreBuilderAdmin(input.email)) {
    return { kind: 'granted', maxStores: PLAN_LIMITS.agency.storeBuilderStores, viaAdmin: true }
  }
  if (!isStoreBuilderEnabled()) return { kind: 'hidden' }

  const plan: PlanType = input.plan && input.plan in PLAN_LIMITS ? input.plan : 'free'
  const maxStores = PLAN_LIMITS[plan].storeBuilderStores
  if (maxStores <= 0) return { kind: 'upgrade', plan }
  return { kind: 'granted', maxStores, viaAdmin: false }
}

// Quota de connexions : une reconnexion d'un shop déjà connecté (upsert
// user_id+shop_domain, ex. élargir les scopes) ne consomme pas de slot.
export function canConnectShop(input: {
  maxStores: number
  connectedShops: readonly string[]
  shop: string
}): boolean {
  const shop = input.shop.toLowerCase()
  const others = input.connectedShops.filter((s) => s.toLowerCase() !== shop)
  return others.length < input.maxStores
}
