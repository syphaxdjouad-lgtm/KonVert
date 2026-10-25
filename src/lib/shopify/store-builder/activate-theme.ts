// Store Builder for Shopify — activation d'un thème (role: "main").
//
// ⚠️ CODÉ MAIS NON VALIDÉ EN CONDITIONS RÉELLES — aucun appel n'a encore
// touché un vrai store Shopify (Sprint 4, 2026-07-27).
//
// ─────────────────────────────────────────────────────────────────────────
// QUESTION OUVERTE DU SPIKE (cf. plan Sprint 0 / dependencies critiques) :
// activer un thème = `PUT /themes/{id}.json` avec `{ theme: { role: "main" } }`.
// La doc publique Shopify liste cet endpoint sous le scope `write_themes`,
// mais plusieurs devs communautaires rapportent avoir eu besoin en plus de
// `write_publications` pour que le changement de rôle soit accepté sur
// certains plans/stores (comportement pas 100% cohérent dans la doc).
// PAS CONFIRMÉ ici — à valider par ANNA sur un dev store réel au spike
// Sprint 6 (cf. SPIKE_REPORT à produire à ce moment-là). En attendant : le
// scope `write_publications` est documenté comme recommandé en commentaire
// ci-dessous, pas encore ajouté à `SHOPIFY_SCOPES` (src/lib/shopify/index.ts)
// pour ne pas changer le comportement OAuth prod du page-builder existant
// sans validation. Si le spike confirme le besoin, il faudra : (1) ajouter
// `write_publications` aux scopes Store Builder (probablement un scope OAuth
// séparé de celui du page-builder, cf. Sprint 6), (2) forcer une reconnexion
// des boutiques déjà connectées via l'ancien flow OAuth.
// ─────────────────────────────────────────────────────────────────────────

import type { ActivateThemeInput, ShopifyTheme, ShopifyThemeRole, StoreBuilderContext, StoreBuilderResult } from './types'
import { shopifyAdminRequestWithRetry } from './client'

interface ShopifyThemeApiResponse {
  theme: {
    id: number
    name: string
    role: ShopifyThemeRole
    created_at: string
  }
}

export async function activateTheme(
  ctx: StoreBuilderContext,
  input: ActivateThemeInput
): Promise<StoreBuilderResult<ShopifyTheme>> {
  if (!Number.isInteger(input.themeId) || input.themeId <= 0) {
    return { ok: false, error: { code: 'INVALID_PAYLOAD', message: 'themeId invalide.' } }
  }

  const result = await shopifyAdminRequestWithRetry<ShopifyThemeApiResponse>(
    ctx,
    `/themes/${input.themeId}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({ theme: { id: input.themeId, role: 'main' } }),
    }
  )

  if (!result.ok) {
    // Si Shopify renvoie 403 ici précisément, c'est le signal le plus probable
    // que write_publications manque — on enrichit le message sans changer le
    // code d'erreur (déjà FORBIDDEN_SCOPE côté client.ts).
    if (result.error.code === 'FORBIDDEN_SCOPE') {
      return {
        ok: false,
        error: {
          ...result.error,
          message:
            result.error.message +
            ' (activation de thème : essayer avec le scope write_publications en plus de write_themes — cf. question ouverte du spike Sprint 6).',
        },
      }
    }
    return result
  }

  const { theme } = result.data
  return { ok: true, data: { id: theme.id, name: theme.name, role: theme.role, createdAt: theme.created_at } }
}
