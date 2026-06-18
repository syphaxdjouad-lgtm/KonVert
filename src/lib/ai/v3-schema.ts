import { z } from 'zod'

// ─── Schema V3 DTC copy — source unique de vérité ──────────────────────────
// Remplace l'interface DeepSeekV3Output. Validation runtime via generateObject
// du Vercel AI SDK : toute réponse LLM hors-schema est rejetée → retry auto.
//
// Tous les champs sont optionnels : DeepSeek peut renvoyer une réponse partielle
// (section non extractible depuis le scrape). renderPageV3 sait gérer null.

export const heroSchema = z.object({
  tagline: z.string().min(1),
  subtagline: z.string().min(1),
})

export const featureSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  isPropriety: z.boolean().optional(),
})

export const materialSchema = z.object({
  name: z.string().min(1),
  benefit: z.string().min(1),
  confidence: z.number().min(0).max(1),
})

export const faqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
})

export const manifestoSchema = z.object({
  headline: z.string().min(1),
  pillars: z.array(z.string().min(1)),
})

export const pressQuoteSchema = z.object({
  quote: z.string().min(1),
  source: z.string().min(1),
})

export const howItWorksStepSchema = z.object({
  step: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
})

// Sprint 2 — Reviews avec photos (P3)
// photo_url: null pour MVP — la validation strip toute URL non-null pour sécurité
export const reviewSchema = z.object({
  author:    z.string().min(1),
  initials:  z.string().min(1).max(3),
  rating:    z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  title:     z.string().min(1),
  text:      z.string().min(1),
  date:      z.string().min(1),
  // MVP : photo_url toujours null. Si DeepSeek génère une URL non-null → on la supprime (guard ci-dessous)
  photo_url: z.null().optional(),
  variant:   z.string().optional().nullable(),
  verified:  z.boolean(),
})

export const deepseekV3OutputSchema = z.object({
  // Brand name — affiché en haut du hero + dans le manifesto. Si l'user n'a
  // pas saisi de nom, DeepSeek propose un nom cohérent avec le produit
  // (ex: "Atelier Forêt" pour un sac en cuir artisanal). 2-40 chars.
  brand: z.string().min(2).max(40).optional(),
  hero: heroSchema.optional(),
  why_we_love: z.string().min(1).optional(),
  features: z.array(featureSchema).optional(),
  best_for: z.array(z.string().min(1)).optional(),
  materials: z.array(materialSchema).optional(),
  care: z.string().min(1).optional(),
  faq: z.array(faqSchema).optional(),
  manifesto: manifestoSchema.optional(),
  press_quote: pressQuoteSchema.optional(),
  reviews_summary: z.string().min(1).optional(),
  how_it_works: z.array(howItWorksStepSchema).optional(),
  // Sprint 2 — avis clients individuels
  reviews: z.array(reviewSchema).optional(),
})

export type DeepSeekV3Output = z.infer<typeof deepseekV3OutputSchema>
