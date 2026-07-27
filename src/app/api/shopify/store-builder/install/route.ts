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
// ⚠️ OAuth Store Builder dédié = Sprint 6 (table `shopify_store_connections`,
// scopes write_themes/write_products/write_publications). En attendant, cette
// route réutilise la connexion existante `stores` (platform='shopify') du
// page-builder — dont les scopes OAuth actuels (write_pages,read_pages,
// write_content,read_content, cf. src/lib/shopify/index.ts) NE COUVRENT PAS
// write_themes/write_products. Toute tentative réelle échouera donc en
// FORBIDDEN_SCOPE tant que Sprint 6 n'a pas élargi les scopes + forcé une
// reconnexion. C'est un TODO explicite, pas un oubli.

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decryptToken } from '@/lib/shopify'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import {
  DEFAULT_STORE_BUILDER_API_VERSION,
  activateTheme,
  createProduct,
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
  store_id: z.string().uuid('store_id doit être un UUID'),
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
    const { store_id, product, theme } = parsed.data

    const { data: store, error: storeErr } = await supabase
      .from('stores')
      .select('*')
      .eq('id', store_id)
      .eq('user_id', user.id)
      .eq('platform', 'shopify')
      .single()

    if (storeErr || !store) {
      return NextResponse.json({ success: false, error: 'Boutique Shopify introuvable' }, { status: 404 })
    }
    if (!store.access_token) {
      return NextResponse.json(
        { success: false, error: 'Boutique non connectée à Shopify (token manquant) — reconnecte la boutique.' },
        { status: 409 }
      )
    }

    const ctx: StoreBuilderContext = {
      shopDomain: store.store_url.replace(/^https?:\/\//, ''),
      accessToken: decryptToken(store.access_token),
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
