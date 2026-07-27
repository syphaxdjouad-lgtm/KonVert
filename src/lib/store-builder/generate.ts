import { generateObject, NoObjectGeneratedError } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import type { ScrapedProduct } from '@/types'
import { buildStoreBuilderOutputSchema, type StoreBuilderOutput, type Vertical } from './schema'
import { buildSystemPrompt, buildUserPrompt } from './prompts'
import type { MerchantFacts } from './merchant-facts'
import { DEFAULT_TEMPLATE_CONTENT } from './default-content'
import { assertNoForbiddenKeys, ForbiddenKeyError } from './guardrails'

// ─── Générateur Store Builder — deepseek-chat + generateObject (spec §6.1) ──
//
// Même pattern que src/lib/ai/deepseek-v3.ts (déjà en prod) : generateObject
// (Vercel AI SDK) + Zod, PAS le fetch brut + JSON.parse de generate.ts.
// maxRetries: 2 côté SDK gère les JSON malformés/hors-schéma automatiquement.
//
// Un retry structurel SUPPLÉMENTAIRE (2 tentatives complètes au total) est
// ajouté ici : si la sortie validée par Zod contient malgré tout une clé R5
// interdite (ne devrait jamais arriver — `.strict()` l'exclut par
// construction, cf. schema.ts), on retente une génération complète avant de
// basculer sur le fallback figé plutôt que de laisser fuiter une sortie
// suspecte.

const TIMEOUT_MS = 50_000
const MAX_ATTEMPTS = 2

export interface GenerateStoreBuilderResult {
  output: StoreBuilderOutput
  /** true si la génération LLM a échoué après tous les retries — fallback figé utilisé. */
  usedFallback: boolean
  usage?: {
    promptTokens?: number
    completionTokens?: number
  }
}

async function runGeneration(
  product: ScrapedProduct,
  vertical: Vertical,
  merchantFacts: MerchantFacts | undefined,
  apiKey: string,
) {
  const deepseek = createDeepSeek({ apiKey })
  const schema = buildStoreBuilderOutputSchema(vertical)

  const { object, usage } = await generateObject({
    model: deepseek('deepseek-chat'),
    schema,
    // 100% statique par vertical → cache DeepSeek automatique sur le prefix.
    system: buildSystemPrompt(vertical),
    // 100% dynamique (données produit scrapées) → jamais mis en cache.
    prompt: buildUserPrompt(product, vertical, merchantFacts),
    maxRetries: 2,
    abortSignal: AbortSignal.timeout(TIMEOUT_MS),
  })

  return { object, usage }
}

function logGenerationFailure(vertical: Vertical, err: unknown): void {
  // Jamais de secret/PII dans les logs (cf. feedback_agents_no_secrets_in_logs).
  console.error('[store-builder/generate] generation failed after retries, using fallback', {
    vertical,
    cause: err instanceof Error ? err.message : 'unknown',
  })
}

/**
 * Génère le contenu textuel des 8 blocs Store Builder pour un produit scrapé
 * + un vertical déjà déterminé. Ne lève JAMAIS d'exception pour un aléa LLM
 * (JSON malformé, dérive de schéma) — bascule sur `DEFAULT_TEMPLATE_CONTENT`
 * et signale `usedFallback: true`. Lève uniquement si `DEEPSEEK_API_KEY` est
 * absente (erreur de configuration, pas un aléa runtime).
 */
export async function generateStoreBuilderContent(
  product: ScrapedProduct,
  vertical: Vertical,
  merchantFacts?: MerchantFacts,
): Promise<GenerateStoreBuilderResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY manquante dans les variables d\'environnement')
  }

  let lastError: unknown = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { object, usage } = await runGeneration(product, vertical, merchantFacts, apiKey)
      // Filet de sécurité R5 — ne devrait jamais déclencher (cf. guardrails.ts).
      assertNoForbiddenKeys(object)
      return {
        output: object,
        usedFallback: false,
        usage: { promptTokens: usage?.inputTokens, completionTokens: usage?.outputTokens },
      }
    } catch (err) {
      lastError = err
      const isRecoverable = NoObjectGeneratedError.isInstance(err) || err instanceof ForbiddenKeyError
      if (!isRecoverable) throw err
      // Retente une fois de plus si ce n'est pas la dernière tentative.
    }
  }

  logGenerationFailure(vertical, lastError)
  return { output: DEFAULT_TEMPLATE_CONTENT[vertical], usedFallback: true }
}
