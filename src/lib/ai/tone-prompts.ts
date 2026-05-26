import type { CopyTone } from '@/types/v3'

/**
 * Prompts système injectés dans l'AI pour adapter le ton de la copy générée.
 * Le ton 'auto' est résolu via autoPickTone() avant injection.
 */
export const TONE_PROMPTS: Record<CopyTone, string> = {
  auto: '',
  friendly: `
Voice: tutoiement chaleureux. Phrases courtes et accessibles. Exemples concrets de la vie quotidienne.
Évite : jargon marketing, superlatifs creux, ton corporate. Va droit au but.
Exemple ton : "T'as déjà ressenti ce moment où tu voulais juste un truc qui marche, sans chichis ?"`.trim(),
  premium: `
Voice: vouvoiement. Vocabulaire raffiné, peu d'exclamations, phrases riches mais lisibles.
Évite : tutoiement, emojis, langage familier, fausses urgences.
Exemple ton : "Conçu pour celles qui savent reconnaître la qualité d'un geste simple."`.trim(),
  bold: `
Voice: direct, phrases courtes, claims forts. Énergie palpable. Verbe d'action en premier.
Évite : circonlocutions, hedging ("peut-être", "souvent"), longueurs.
Exemple ton : "Tu veux du résultat. Voilà. Pas de bla-bla."`.trim(),
  storytelling: `
Voice: narratif. Ouvre par une scène ou un moment précis. Voyage émotionnel.
Évite : bullet points secs, données chiffrées comme argument unique.
Exemple ton : "Tout commence un matin de juin, quand Sarah cherchait le sac parfait..."`.trim(),
  educational: `
Voice: pédagogique mais accessible. Explique le pourquoi avant le quoi. Référence scientifique si pertinent.
Évite : jargon non expliqué, suractivation marketing.
Exemple ton : "Le rétinol fonctionne en stimulant le renouvellement cellulaire — voici pourquoi c'est efficace."`.trim(),
}
