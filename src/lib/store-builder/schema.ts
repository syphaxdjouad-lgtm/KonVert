import { z } from 'zod'

// ─── Store Builder — schéma de sortie du générateur IA (Sprint 7) ──────────
//
// Source de vérité : docs/store-builder-generator-spec.md §5 (MINATO, 2026-07-27).
//
// Guardrail R5 principal : les champs interdits (avis clients, chiffres de
// preuve sociale, code promo, nom du fondateur) sont STRUCTURELLEMENT ABSENTS
// de ce schéma — pas seulement proscrits par instruction de prompt. Le LLM
// ne peut pas halluciner un champ qu'il n'a jamais la possibilité de remplir :
// `generateObject` (Vercel AI SDK) rejette toute sortie hors-schéma avant même
// qu'elle atteigne ce code. Ne JAMAIS ajouter `founder_name`, `promo_code`,
// `cta_link`, ni quoi que ce soit lié à `konvert-testimonials-carousel` /
// `konvert-social-proof` / `konvert-sticky-atc-mobile` à ce schéma sans revue
// MADARA/OROCHIMARU (risque légal art. L122-1 — cf. incident presslogos du
// 2026-06-06, `project_konvert_prompt_v2_rollback.md`).

export type Vertical = 'dropshipping' | 'beaute' | 'tech'

export const VERTICALS: readonly Vertical[] = ['dropshipping', 'beaute', 'tech']

export function isVertical(value: unknown): value is Vertical {
  return typeof value === 'string' && (VERTICALS as readonly string[]).includes(value)
}

// ── Énumérations par vertical — injectées dans le schéma au moment de l'appel ──

export const GENERIC_COMPETITOR_LABELS: Record<Vertical, [string, ...string[]]> = {
  dropshipping: ['Boutique classique', 'Site concurrent générique', 'Boutique standard'],
  beaute: ['Alternative générique', 'Marque générique', 'Cosmétique standard'],
  tech: ['Marque générique', 'Accessoire premier prix', 'Marque standard'],
}

export const GUARANTEE_ICONS = [
  'none', 'truck', 'return', 'lock', 'chat_bubble', 'check_mark',
  'stopwatch', 'box', 'leaf', 'recycle', 'price_tag', 'plane',
] as const

const guaranteeIconEnum = z.enum(GUARANTEE_ICONS)

const comparisonValueEnum = z.enum(['yes', 'no', 'custom'])

const comparisonRowSchema = z.object({
  label: z.string().min(3).max(40),
  us_value: comparisonValueEnum,
  us_text: z.string().max(90).optional(),
  them_value: comparisonValueEnum,
  them_text: z.string().max(90).optional(),
}).strict().superRefine((row, ctx) => {
  if (row.us_value === 'custom' && !row.us_text) {
    ctx.addIssue({ code: 'custom', message: 'us_text requis si us_value = custom', path: ['us_text'] })
  }
  if (row.them_value === 'custom' && !row.them_text) {
    ctx.addIssue({ code: 'custom', message: 'them_text requis si them_value = custom', path: ['them_text'] })
  }
})

/**
 * Construit le schéma Zod de sortie du générateur, spécifique à un vertical
 * (uniquement pour contraindre `them_column_label` à l'énumération générique
 * du vertical — le reste de la forme est identique entre verticals).
 *
 * `.strict()` partout : toute clé supplémentaire renvoyée par le LLM fait
 * échouer la validation (donc retry SDK) plutôt que d'être silencieusement
 * acceptée. C'est le mécanisme structurel du guardrail R5.
 */
export function buildStoreBuilderOutputSchema(vertical: Vertical) {
  const themColumnLabelEnum = z.enum(GENERIC_COMPETITOR_LABELS[vertical])

  return z.object({
    hero: z.object({
      h1_title: z.string().min(10).max(90),
      subtitle: z.string().min(10).max(140),
    }).strict(),

    description_html: z.string().min(200).max(2200),

    faq: z.array(z.object({
      question: z.string().min(5).max(120),
      answer_html: z.string().min(20).max(400),
    }).strict()).min(4).max(6),

    guarantees: z.array(z.object({
      icon: guaranteeIconEnum,
      title: z.string().min(3).max(40),
      text_html: z.string().min(20).max(220),
    }).strict()).min(3).max(4),

    comparison_table: z.object({
      heading: z.string().min(5).max(70),
      subheading: z.string().max(90).optional(),
      criteria_column_label: z.string().max(30).default('Critère'),
      us_column_label: z.string().min(2).max(40),
      them_column_label: themColumnLabelEnum,
      rows: z.array(comparisonRowSchema).min(4).max(5),
    }).strict(),

    urgency_bar: z.object({
      message_default: z.string().min(10).max(90),
      message_with_stock: z.string().min(10).max(90)
        .refine(s => s.includes('[count]'), 'message_with_stock doit contenir le token littéral [count]'),
    }).strict(),

    founder_story: z.object({
      heading: z.string().min(5).max(60),
      story_html: z.string().min(80).max(700)
        .refine(s => /\[[^\]]+\]/.test(s), 'story_html doit contenir au moins un gabarit [entre crochets]'),
      founder_role: z.string().min(3).max(30),
    }).strict(),

    exit_intent: z.object({
      heading: z.string().min(5).max(40),
      text_html: z.string().min(20).max(220),
      cta_label: z.string().min(3).max(30),
    }).strict(),
  }).strict()
}

export type StoreBuilderOutput = z.infer<ReturnType<typeof buildStoreBuilderOutputSchema>>

// ── Champs interdits — liste exhaustive pour le filet de sécurité runtime ────
// (défense en profondeur : cf. guardrails.ts. Cette liste ne devrait jamais
// matcher en pratique puisque le schéma ci-dessus ne les modélise pas, mais un
// futur ajout de champ par erreur serait intercepté par `assertNoForbiddenKeys`
// avant même d'être testé unitairement.)
export const R5_FORBIDDEN_KEYS = [
  'founder_name',
  'promo_code',
  'cta_link',
  'reviews',
  'review',
  'testimonial',
  'testimonials',
  'social_proof',
  'proof_number',
  'proof_label',
  'rating',
  'reviews_count',
] as const
