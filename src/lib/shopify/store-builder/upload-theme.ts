// Store Builder for Shopify — upload du thème "Konvert CRO - V1".
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES (Sprint 4, 2026-07-27).
//
// ─────────────────────────────────────────────────────────────────────────
// DÉCISION D'ARCHITECTURE — hébergement du .zip du thème (À CONFIRMER FOUNDER)
// ─────────────────────────────────────────────────────────────────────────
// Le thème vit dans le repo privé `konvert-dawn` (fork Dawn 15.4), pas dans
// ce repo Next.js. L'endpoint Shopify Themes API `POST /themes.json` avec
// `src` = URL d'un .zip exige une URL PUBLIQUE HTTPS sans auth : Shopify va
// télécharger le fichier lui-même, il n'y a aucun moyen de lui passer un
// header d'autorisation ou une query signée à durée de vie infinie.
//
// Options évaluées :
//   (a) Zip public temporaire (ex: release GitHub publique du repo, ou fichier
//       exposé via un CDN) — simple mais expose publiquement le code du thème
//       (marque déposée Konvert CRO, mais pas un secret critique en soi).
//   (b) GitHub Release sur `konvert-dawn` marqué "public" uniquement pour
//       l'asset .zip (repo peut rester privé, seul l'asset de la release est
//       accessible via URL signée — mais GitHub exige d'authentifier même les
//       assets de release sur repo privé, donc il faudrait un repo public
//       dédié ou un miroir public "konvert-dawn-dist").
//   (c) Vercel Blob (déjà utilisé ailleurs dans Konvert, cf. project stack) :
//       un job CI/CD sur `konvert-dawn` package le thème en .zip et le pousse
//       vers Vercel Blob à chaque release, expose une URL publique stable.
//       → Option la PLUS PROPRE : pas de nouveau repo public, contrôle total
//       sur la durée de vie de l'URL, cohérent avec la stack déjà en place.
//   (d) Fallback (b) de ce module : upload asset-par-asset après création
//       d'un thème vide (`POST /themes.json` sans `src`, puis
//       `PUT /themes/{id}/assets.json` fichier par fichier) — plus lent (des
//       dizaines d'appels API, un par fichier Liquid/JSON/CSS/JS), mais ne
//       dépend d'aucun hébergement public. Utile en dev/debug ou si le CI
//       Vercel Blob n'est pas encore en place.
//
// DÉCISION PRISE POUR CE SPRINT : coder les deux chemins (src zip + fallback
// asset-par-asset), piloter le choix via l'env var KONVERT_THEME_ZIP_URL —
// si elle est définie, on utilise la stratégie (a)/(c) (peu importe qui
// héberge tant que l'URL est publique) ; sinon, fallback (d) avec les assets
// fournis en paramètre.
//
// CE QUI RESTE À TRANCHER PAR LE FOUNDER : quelle option d'hébergement retenir
// entre (a)/(b)/(c) pour la prod, et qui configure le pipeline qui régénère le
// .zip à chaque changement du thème (CI GitHub Actions sur `konvert-dawn` →
// Vercel Blob recommandé par ANNA, mais décision finale founder + à valider
// avec SASORI côté CI/CD).
// ─────────────────────────────────────────────────────────────────────────

import type {
  ShopifyTheme,
  ShopifyThemeRole,
  StoreBuilderContext,
  StoreBuilderResult,
  UploadThemeInput,
} from './types'
import { shopifyAdminRequestWithRetry } from './client'

interface ShopifyThemeApiResponse {
  theme: {
    id: number
    name: string
    role: ShopifyThemeRole
    created_at: string
  }
}

interface ShopifyAssetApiResponse {
  asset: { key: string }
}

function toShopifyTheme(raw: ShopifyThemeApiResponse['theme']): ShopifyTheme {
  return { id: raw.id, name: raw.name, role: raw.role, createdAt: raw.created_at }
}

/**
 * Crée le thème sur la boutique. Stratégie (a) "src zip" si `input.zipUrl`
 * (ou la fallback env var KONVERT_THEME_ZIP_URL) est disponible — un seul
 * appel API, Shopify télécharge et dézippe lui-même. Sinon, fallback (b)
 * "thème vide + assets un par un" à partir de `input.assets`.
 */
export async function uploadTheme(
  ctx: StoreBuilderContext,
  input: UploadThemeInput
): Promise<StoreBuilderResult<ShopifyTheme>> {
  const zipUrl = input.zipUrl ?? process.env.KONVERT_THEME_ZIP_URL

  if (zipUrl) {
    return uploadThemeFromZip(ctx, input.name, zipUrl)
  }

  if (input.assets && Object.keys(input.assets).length > 0) {
    return uploadThemeFromAssets(ctx, input.name, input.assets)
  }

  return {
    ok: false,
    error: {
      code: 'INVALID_PAYLOAD',
      message:
        'Aucune source de thème fournie : ni zipUrl (ou env var KONVERT_THEME_ZIP_URL) ni assets. ' +
        "Décision d'hébergement du .zip pas encore prise — voir commentaire en tête de upload-theme.ts.",
    },
  }
}

async function uploadThemeFromZip(
  ctx: StoreBuilderContext,
  name: string,
  zipUrl: string
): Promise<StoreBuilderResult<ShopifyTheme>> {
  const result = await shopifyAdminRequestWithRetry<ShopifyThemeApiResponse>(ctx, '/themes.json', {
    method: 'POST',
    body: JSON.stringify({
      theme: {
        name,
        src: zipUrl,
        // "unpublished" = installé mais pas actif — activateTheme() bascule
        // ensuite en "main" une fois le produit créé et le thème vérifié.
        role: 'unpublished',
      },
    }),
  })

  if (!result.ok) return result
  return { ok: true, data: toShopifyTheme(result.data.theme) }
}

async function uploadThemeFromAssets(
  ctx: StoreBuilderContext,
  name: string,
  assets: Record<string, string>
): Promise<StoreBuilderResult<ShopifyTheme>> {
  // 1) Créer un thème vide (sans `src`).
  const created = await shopifyAdminRequestWithRetry<ShopifyThemeApiResponse>(ctx, '/themes.json', {
    method: 'POST',
    body: JSON.stringify({ theme: { name, role: 'unpublished' } }),
  })
  if (!created.ok) return created

  const theme = toShopifyTheme(created.data.theme)

  // 2) Upload asset par asset. TODO Sprint 5/6 : gérer les assets binaires
  // (images du thème, favicons) via `attachment` (base64) — ce module ne gère
  // que le texte (Liquid/JSON/CSS/JS) pour l'instant, suffisant pour un thème
  // Dawn dont les images sont soit en CDN Shopify (uploadées séparément), soit
  // absentes du fork custom.
  const failedAssets: string[] = []
  for (const [key, value] of Object.entries(assets)) {
    const assetResult = await shopifyAdminRequestWithRetry<ShopifyAssetApiResponse>(
      ctx,
      `/themes/${theme.id}/assets.json`,
      {
        method: 'PUT',
        body: JSON.stringify({ asset: { key, value } }),
      }
    )
    if (!assetResult.ok) {
      failedAssets.push(key)
    }
  }

  if (failedAssets.length > 0) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message:
          `Thème créé (id ${theme.id}) mais ${failedAssets.length} asset(s) ont échoué à l'upload : ` +
          `${failedAssets.slice(0, 5).join(', ')}${failedAssets.length > 5 ? '…' : ''}. ` +
          'Le thème est probablement incomplet/cassé — ne pas activer.',
        detail: { themeId: theme.id, failedAssets },
      },
    }
  }

  return { ok: true, data: theme }
}
