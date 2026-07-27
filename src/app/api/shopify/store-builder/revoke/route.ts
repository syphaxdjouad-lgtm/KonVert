// POST /api/shopify/store-builder/revoke
// Body: { connection_id: string (uuid) }
//
// Déconnecte une boutique du Store Builder : supprime la ligne
// `shopify_store_connections` du user (garanti par RLS + filtre explicite
// user_id) et tente, en best-effort, de révoquer le token côté Shopify.
//
// Ne touche jamais à `stores` (page-builder) — une déconnexion Store Builder
// n'affecte pas le page-builder, et inversement.
//
// ⚠️ CODÉ MAIS NON VALIDÉ SANS DEV STORE RÉEL (2026-07-27). En particulier :
// l'existence et le comportement exact de `DELETE /admin/oauth/revoke` n'ont
// pas pu être confirmés contre un store réel (doc publique Shopify peu
// explicite sur cet endpoint spécifique à la date d'écriture). Le call est
// donc best-effort et n'empêche jamais la suppression locale de la
// connexion : même si Shopify refuse/ignore la requête, l'utilisateur ne
// doit jamais se retrouver bloqué avec une connexion "fantôme" qu'il ne
// peut pas supprimer.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decryptToken } from '@/lib/shopify'
import { rateLimitAsync } from '@/lib/security/ratelimit'

const revokeBodySchema = z.object({
  connection_id: z.string().uuid('connection_id doit être un UUID'),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentification requise' }, { status: 401 })
    }

    const rl = await rateLimitAsync(`store-builder-revoke:${user.id}`, 10, 60_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { success: false, error: `Trop de tentatives. Réessaie dans ${retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const rawBody = await req.json().catch(() => null)
    const parsed = revokeBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Payload invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { data: connection, error: fetchErr } = await supabase
      .from('shopify_store_connections')
      .select('id, shop_domain, access_token')
      .eq('id', parsed.data.connection_id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !connection) {
      return NextResponse.json({ success: false, error: 'Connexion introuvable' }, { status: 404 })
    }

    // Best-effort côté Shopify — ne doit jamais empêcher la suppression locale.
    try {
      const token = decryptToken(connection.access_token)
      await fetch(`https://${connection.shop_domain}/admin/oauth/revoke`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      })
    } catch (err) {
      console.error('[shopify/store-builder/revoke] best-effort Shopify revoke failed:', err)
    }

    const { error: deleteErr } = await supabase
      .from('shopify_store_connections')
      .delete()
      .eq('id', connection.id)
      .eq('user_id', user.id)

    if (deleteErr) {
      console.error('[shopify/store-builder/revoke] db delete error:', deleteErr)
      return NextResponse.json(
        { success: false, error: 'Échec de la suppression de la connexion' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[shopify/store-builder/revoke]', err)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/shopify/store-builder/revoke' } })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Erreur revoke Store Builder' },
      { status: 500 }
    )
  }
}
