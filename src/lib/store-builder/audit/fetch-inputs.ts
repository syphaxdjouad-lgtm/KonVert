// Store Builder for Shopify — Re-audit CRO : collecte des `AuditInputs`
// depuis Shopify (Theme Asset API + Admin API produit) + PageSpeed Insights
// + fetch public de la page produit (JSON-LD). Impure — orchestre du réseau,
// contrairement à criteria.ts/score.ts qui restent purs et testables.
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — jamais exécuté contre un
// vrai store Shopify (Sprint 8, 2026-07-27). L'asset key exact du template
// produit live (`templates/product.json` — hypothèse : Shopify utilise le
// nom de template par défaut, pas le nom vertical `product.<vertical>.json`
// du repo source) n'a jamais été vérifié sur un store réel. Si le nom
// d'asset diverge, le fetch échoue proprement (tous les critères Theme
// Asset API sont marqués non-mesurables, jamais de crash).

import type { StoreBuilderContext } from '@/lib/shopify/store-builder/types'
import { shopifyAdminRequest } from '@/lib/shopify/store-builder/client'
import { parseThemeTemplate, type ThemeTemplate } from './parse-template'
import {
  countFilledComparisonRows,
  countFilledGuarantees,
  extractExitIntentPromoCode,
  extractFaqItems,
  extractFounderStory,
  extractSocialProof,
  extractTestimonials,
  extractUrgencyMessage,
  isStickyAtcMobileActive,
} from './extract-sections'
import { htmlContainsProductJsonLd } from './helpers'
import { fetchPageSpeedMobile } from './pagespeed'
import type { AuditInputs } from './types'

const PUBLIC_FETCH_TIMEOUT_MS = 15_000

interface ShopifyProductAdminResponse {
  product: {
    body_html: string | null
    images: { id: number }[]
    handle: string
    metafields_global_title_tag?: string | null
    metafields_global_description_tag?: string | null
  }
}

async function fetchThemeTemplate(ctx: StoreBuilderContext, themeId: number): Promise<ThemeTemplate | null> {
  const result = await shopifyAdminRequest<{ asset: { value: string } }>(
    ctx,
    `/themes/${themeId}/assets.json?asset[key]=templates/product.json`
  )
  if (!result.ok) return null
  return parseThemeTemplate(result.data.asset.value)
}

async function fetchProductPublicHtml(publicProductUrl: string): Promise<string | null> {
  try {
    const res = await fetch(publicProductUrl, { signal: AbortSignal.timeout(PUBLIC_FETCH_TIMEOUT_MS) })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export interface FetchAuditInputsParams {
  ctx: StoreBuilderContext
  themeId: number
  productId: number
  /** URL publique complète de la page produit (ex: https://shop.myshopify.com/products/handle). */
  publicProductUrl: string
}

/**
 * Assemble `AuditInputs` best-effort : chaque source qui échoue dégrade
 * gracieusement (champs vides / `measurable: false` côté criteria.ts),
 * jamais de throw qui interromprait tout l'audit d'une connexion pour un
 * problème isolé (ex: PageSpeed timeout ne doit pas bloquer les 16 autres
 * critères).
 */
export async function fetchAuditInputs({
  ctx,
  themeId,
  productId,
  publicProductUrl,
}: FetchAuditInputsParams): Promise<AuditInputs> {
  const [template, productResult, publicHtml, pageSpeed] = await Promise.all([
    fetchThemeTemplate(ctx, themeId),
    shopifyAdminRequest<ShopifyProductAdminResponse>(ctx, `/products/${productId}.json`),
    fetchProductPublicHtml(publicProductUrl),
    fetchPageSpeedMobile(publicProductUrl),
  ])

  const socialProof = template ? extractSocialProof(template) : { number: '', customText: '' }
  const founderStory = template ? extractFounderStory(template) : { founderName: '', storyHtml: '', founderPhoto: '' }

  const product = productResult.ok ? productResult.data.product : null

  return {
    testimonials: template ? extractTestimonials(template) : [],
    socialProofNumber: socialProof.number,
    socialProofCustomText: socialProof.customText,
    founderName: founderStory.founderName,
    founderStoryHtml: founderStory.storyHtml,
    founderPhoto: founderStory.founderPhoto,
    exitIntentPromoCode: template ? extractExitIntentPromoCode(template) : '',
    faqItems: template ? extractFaqItems(template) : [],
    guaranteesFilledCount: template ? countFilledGuarantees(template) : 0,
    comparisonRowsFilledCount: template ? countFilledComparisonRows(template) : 0,
    urgencyMessageDefault: template ? extractUrgencyMessage(template) : '',
    stickyAtcSectionPresent: template ? isStickyAtcMobileActive(template) : false,
    productDescriptionHtml: product?.body_html ?? '',
    productImagesCount: product?.images.length ?? 0,
    metaTitle: product?.metafields_global_title_tag ?? '',
    metaDescription: product?.metafields_global_description_tag ?? '',
    jsonLdProductPresent: publicHtml === null ? null : htmlContainsProductJsonLd(publicHtml),
    pageSpeedPerformanceScore: pageSpeed?.performanceScore ?? null,
    pageSpeedLcpMs: pageSpeed?.lcpMs ?? null,
  }
}
