import { generateObject, NoObjectGeneratedError } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { deepseekV3OutputSchema, type DeepSeekV3Output } from './v3-schema'

// ─── Wrapper structured generation V3 ──────────────────────────────────────
// Remplace l'ancien fetch manuel + JSON.parse + string-replace ```json``` brut.
//
// Bénéfices vs ancien code :
// - Validation runtime Zod : 0 chance de "merde au client" (format invalide → retry auto)
// - Retry intégré du SDK (maxRetries=2) si la réponse échoue à valider le schema
// - Type-safe end-to-end (z.infer<typeof schema>)
// - Timeout 50s préservé (cohérent avec maxDuration 90s de Vercel Pro)
// - Préserve DEEPSEEK_API_KEY (lue automatiquement par le provider)

const TIMEOUT_MS = 50_000

/**
 * Génère une copie DTC V3 structurée via DeepSeek + Vercel AI SDK.
 *
 * Le SDK garantit que `object` respecte le schema Zod : si DeepSeek renvoie un
 * JSON malformé ou hors-schema, le SDK retry (jusqu'à maxRetries fois) avant
 * de throw NoObjectGeneratedError.
 *
 * @throws Error si DEEPSEEK_API_KEY manquante
 * @throws NoObjectGeneratedError si toutes les tentatives échouent à produire un objet valide
 */
export async function generateV3Copy(systemPrompt: string): Promise<DeepSeekV3Output> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY manquante dans les variables d\'environnement')
  }

  const deepseek = createDeepSeek({ apiKey })

  try {
    const { object } = await generateObject({
      model: deepseek('deepseek-chat'),
      schema: deepseekV3OutputSchema,
      system: systemPrompt,
      prompt: 'Génère le JSON V3 de la page produit en respectant strictement le schema.',
      maxRetries: 2,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    })

    return object
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
      throw new Error(
        `DeepSeek V3 : JSON invalide après retries — ${err.cause instanceof Error ? err.cause.message : 'format hors-schema'}`,
      )
    }
    throw err
  }
}
