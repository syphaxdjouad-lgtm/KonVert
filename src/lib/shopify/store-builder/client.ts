// Store Builder for Shopify — client HTTP bas-niveau.
//
// Volontairement séparé de `ShopifyClient` (src/lib/shopify/index.ts) qui gère
// les Pages (page-builder standalone existant, API version figée 2024-01).
// Le Store Builder a besoin d'une version d'API configurable par contexte
// (pas figée dans le module) et d'un mapping d'erreurs plus riche (429 avec
// Retry-After exploitable par l'orchestrateur, 422 avec détail payload) — on
// duplique volontairement plutôt que de faire porter deux besoins différents
// par la même classe. Cf. règle NEXARA "3 lignes similaires > abstraction
// prématurée".
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — aucun appel n'a encore
// touché un vrai store Shopify (pas de dev store connecté au 2026-07-27).

import type { StoreBuilderContext, StoreBuilderError, StoreBuilderResult } from './types'

const REQUEST_TIMEOUT_MS = 20_000

function adminApiUrl(ctx: StoreBuilderContext, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `https://${ctx.shopDomain}/admin/api/${ctx.apiVersion}${cleanPath}`
}

function mapHttpError(status: number, bodyText: string, retryAfterHeader: string | null): StoreBuilderError {
  // On tente de parser le corps Shopify ({"errors": ...}) pour un message
  // actionnable sans jamais faire fuiter le token ou des données sensibles.
  let detail: unknown = bodyText
  try {
    detail = JSON.parse(bodyText)
  } catch {
    // corps non-JSON (ex: page HTML d'erreur Shopify) — on garde le texte brut tronqué
    detail = bodyText.slice(0, 500)
  }

  if (status === 429) {
    const retryAfterMs = retryAfterHeader ? Math.ceil(parseFloat(retryAfterHeader) * 1000) : 2000
    return {
      code: 'RATE_LIMITED',
      message: `Shopify rate limit atteint. Réessayer dans ${Math.ceil(retryAfterMs / 1000)}s.`,
      httpStatus: status,
      retryAfterMs,
      detail,
    }
  }

  if (status === 401) {
    return {
      code: 'UNAUTHORIZED',
      message: 'Token Shopify invalide ou expiré — le marchand doit reconnecter sa boutique.',
      httpStatus: status,
      detail,
    }
  }

  if (status === 403) {
    return {
      code: 'FORBIDDEN_SCOPE',
      message:
        'Accès refusé par Shopify — le scope OAuth requis (ex: write_themes, write_products, ' +
        'write_publications) manque probablement sur cette connexion. Reconnecter la boutique ' +
        'avec les scopes Store Builder.',
      httpStatus: status,
      detail,
    }
  }

  if (status === 404) {
    return {
      code: 'NOT_FOUND',
      message: 'Ressource Shopify introuvable (thème, produit ou boutique).',
      httpStatus: status,
      detail,
    }
  }

  if (status === 422) {
    return {
      code: 'INVALID_PAYLOAD',
      message: 'Payload rejeté par Shopify (422) — vérifier les champs requis et leur format.',
      httpStatus: status,
      detail,
    }
  }

  return {
    code: 'UNKNOWN',
    message: `Erreur Shopify inattendue (HTTP ${status}).`,
    httpStatus: status,
    detail,
  }
}

/**
 * Appelle l'Admin API Shopify et renvoie un résultat discriminé — jamais
 * d'exception qui fuit brute vers l'appelant (route API, orchestrateur).
 */
export async function shopifyAdminRequest<T>(
  ctx: StoreBuilderContext,
  path: string,
  options: RequestInit = {}
): Promise<StoreBuilderResult<T>> {
  let res: Response
  try {
    res = await fetch(adminApiUrl(ctx, path), {
      ...options,
      headers: {
        'X-Shopify-Access-Token': ctx.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return {
        ok: false,
        error: {
          code: 'TIMEOUT',
          message: `Timeout après ${REQUEST_TIMEOUT_MS / 1000}s en appelant l'API Shopify.`,
        },
      }
    }
    return {
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Impossible de contacter Shopify (réseau).',
        detail: err instanceof Error ? err.message : String(err),
      },
    }
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '')
    return { ok: false, error: mapHttpError(res.status, bodyText, res.headers.get('Retry-After')) }
  }

  // 204 No Content (ex: DELETE) — pas de body à parser.
  if (res.status === 204) {
    return { ok: true, data: undefined as T }
  }

  try {
    const data = (await res.json()) as T
    return { ok: true, data }
  } catch (err) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: 'Réponse Shopify illisible (JSON invalide).',
        detail: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

/**
 * Retry simple avec backoff sur RATE_LIMITED uniquement — les autres erreurs
 * (auth, payload, 404) ne doivent jamais être retryées automatiquement.
 */
export async function shopifyAdminRequestWithRetry<T>(
  ctx: StoreBuilderContext,
  path: string,
  options: RequestInit = {},
  maxRetries = 2
): Promise<StoreBuilderResult<T>> {
  let attempt = 0
  while (true) {
    const result = await shopifyAdminRequest<T>(ctx, path, options)
    if (result.ok) return result
    if (result.error.code !== 'RATE_LIMITED' || attempt >= maxRetries) return result

    const waitMs = result.error.retryAfterMs ?? 2000
    await new Promise((resolve) => setTimeout(resolve, waitMs))
    attempt++
  }
}
