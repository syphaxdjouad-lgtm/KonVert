// POST /api/shopify/store-builder/install
//
// Orchestrateur du flux "1 clic install" du Store Builder Shopify :
// upload thème → create produit → activer thème. Retourne un statut par
// étape pour permettre au dashboard d'afficher une progression et de savoir
// où reprendre en cas d'échec partiel (le thème peut être uploadé mais le
// produit non créé, etc. — pas de rollback automatique dans ce Sprint 4).
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 4, 2026-07-27) :
// aucun appel de cette route n'a encore touché un vrai store Shopify.
//
// Sprint 6 (2026-07-27) : branchée sur l'OAuth Store Builder dédié — la
// connexion vient désormais de `shopify_store_connections` (scopes
// write_themes/write_products/read_products, cf.
// src/lib/shopify/store-builder/oauth.ts), plus jamais de `stores`
// (page-builder). Si le store n'a pas encore d'entrée Store Builder, ou que
// ses scopes sont insuffisants (ex: connecté avant un élargissement de
// scope), la route renvoie une erreur actionnable NOT_CONNECTED /
// FORBIDDEN_SCOPE plutôt que de tenter un appel Shopify voué à échouer.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decryptToken } from '@/lib/shopify'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import {
  DEFAULT_STORE_BUILDER_API_VERSION,
  activateTheme,
  createProduct,
  hasRequiredStoreBuilderScopes,
  uploadTheme,
  type StoreBuilderContext,
} from '@/lib/shopify/store-builder'

export const maxDuration = 60

const variantSchema = z.object({
  title: z.string().min(1),
  price: z.string().min(1),
  compareAtPrice: z.string().optional(),
  sku: z.string().optional(),
  inventoryQuantity: z.number().int().nonnegative().optional(),
  optionValues: z.array(z.string()).default([]),
})

const imageSchema = z.object({
  src: z.string().url(),
  alt: z.string().optional(),
  position: z.number().int().positive().optional(),
})

const productSchema = z.object({
  title: z.string().min(1, 'Titre produit requis'),
  descriptionHtml: z.string().default(''),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  optionNames: z.array(z.string()).max(3).optional(),
  variants: z.array(variantSchema).min(1, 'Au moins une variante requise'),
  images: z.array(imageSchema).default([]),
  status: z.enum(['active', 'draft']).optional(),
})

const installBodySchema = z.object({
  // uuid de `shopify_store_connections` (PAS `stores` — cf. Sprint 6).
  connection_id: z.string().uuid('connection_id doit être un UUID'),
  product: productSchema,
  theme: z
    .object({
      name: z.string().min(1).default('Konvert CRO - V1'),
      zipUrl: z.string().url().optional(),
    })
    .default({ name: 'Konvert CRO - V1' }),
})

type InstallStep = 'upload_theme' | 'create_product' | 'activate_theme'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentification requise' }, { status: 401 })
    }

    // Flow d'installation coûteux côté Shopify (plusieurs appels API
    // enchaînés) — throttle par user pour éviter qu'un double-clic ou un
    // retry client agressif ne déclenche des installs en boucle.
    const rl = await rateLimitAsync(`store-builder-install:${user.id}`, 5, 60_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { success: false, error: `Trop de tentatives d'installation. Réessaie dans ${retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const rawBody = await req.json().catch(() => null)
    const parsed = installBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Payload invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const { connection_id, product, theme } = parsed.data

    const { data: connection, error: connErr } = await supabase
      .from('shopify_store_connections')
      .select('*')
      .eq('id', connection_id)
      .eq('user_id', user.id)
      .single()

    if (connErr || !connection) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_CONNECTED',
            message:
              'Boutique non connectée au Store Builder — lance le flow de connexion ' +
              '(/api/shopify/store-builder/connect) avant d’installer.',
          },
        },
        { status: 409 }
      )
    }

    if (!hasRequiredStoreBuilderScopes(connection.scopes)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN_SCOPE',
            message:
              'Scopes insuffisants sur cette connexion Store Builder — reconnecte la boutique via ' +
              '/api/shopify/store-builder/connect pour élargir les permissions (write_themes, ' +
              'write_products, read_products).',
          },
        },
        { status: 403 }
      )
    }

    const ctx: StoreBuilderContext = {
      shopDomain: connection.shop_domain,
      accessToken: decryptToken(connection.access_token),
      apiVersion: DEFAULT_STORE_BUILDER_API_VERSION,
    }

    let currentStep: InstallStep = 'upload_theme'

    const themeResult = await uploadTheme(ctx, { name: theme.name, zipUrl: theme.zipUrl })
    if (!themeResult.ok) {
      return NextResponse.json(
        { success: false, step: currentStep, error: themeResult.error },
        { status: 502 }
      )
    }

    currentStep = 'create_product'
    const productResult = await createProduct(ctx, product)
    if (!productResult.ok) {
      return NextResponse.json(
        {
          success: false,
          step: currentStep,
          error: productResult.error,
          // Le thème est déjà uploadé — on le renvoie pour permettre un
          // retry manuel côté dashboard sans re-uploader.
          partial: { theme: themeResult.data },
        },
        { status: 502 }
      )
    }

    currentStep = 'activate_theme'
    const activateResult = await activateTheme(ctx, { themeId: themeResult.data.id })
    if (!activateResult.ok) {
      return NextResponse.json(
        {
          success: false,
          step: currentStep,
          error: activateResult.error,
          partial: { theme: themeResult.data, product: productResult.data },
        },
        { status: 502 }
      )
    }

    // Best-effort — mémorise le thème installé sur la connexion (utile pour
    // un futur "resume"/dashboard). Ne doit jamais faire échouer un install
    // par ailleurs réussi.
    const { error: themeIdUpdateErr } = await supabase
      .from('shopify_store_connections')
      .update({ theme_id: activateResult.data.id })
      .eq('id', connection.id)
      .eq('user_id', user.id)
    if (themeIdUpdateErr) {
      console.error('[shopify/store-builder/install] theme_id update failed (non-blocking):', themeIdUpdateErr)
    }

    return NextResponse.json({
      success: true,
      data: {
        theme: activateResult.data,
        product: productResult.data,
      },
    })
  } catch (err) {
    console.error('[shopify/store-builder/install]', err)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/shopify/store-builder/install' } })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Erreur installation Store Builder' },
      { status: 500 }
    )
  }
}
