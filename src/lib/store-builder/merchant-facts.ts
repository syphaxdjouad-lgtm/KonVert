import { z } from 'zod'

// ─── Faits marchand optionnels — jamais inventés si absents (RÈGLE 2) ───────
//
// Si le marchand a déjà saisi ces informations réelles au moment de l'import,
// le générateur DOIT les utiliser telles quelles à la place d'un placeholder
// (cf. docs/store-builder-generator-spec.md §4). Tous les champs sont
// optionnels : par défaut, aucun fait n'est fourni et le LLM applique la
// RÈGLE 2 (placeholder à trous).

export const merchantFactsSchema = z.object({
  processing_delay: z.string().trim().min(1).max(120).optional(),
  shipping_delay: z.string().trim().min(1).max(120).optional(),
  return_policy: z.string().trim().min(1).max(300).optional(),
  warranty_duration: z.string().trim().min(1).max(120).optional(),
  support_response_time: z.string().trim().min(1).max(120).optional(),
  payment_methods: z.array(z.string().trim().min(1).max(60)).max(10).optional(),
  brand_name: z.string().trim().min(1).max(60).optional(),
}).strict()

export type MerchantFacts = z.infer<typeof merchantFactsSchema>
