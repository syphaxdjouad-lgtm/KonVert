// Store Builder for Shopify — Re-audit CRO : helpers purs partagés par
// criteria.ts et par la couche de collecte (fetch-inputs.ts).

// Placeholders exacts posés par défaut dans konvert-dawn/sections/
// konvert-testimonials-carousel.liquid (schema JSON, blocks "testimonial")
// — cf. spec §Partie B constat §0. Un bloc dont author_name/quote sont
// encore égaux à ces valeurs par défaut n'a jamais été rempli par le
// marchand (donc ne compte pas comme "vrai avis").
export const TESTIMONIAL_AUTHOR_PLACEHOLDER = '[Remplacez par un prénom/nom de client réel]'
export const TESTIMONIAL_QUOTE_PLACEHOLDER =
  '[Remplacez par un avis client réel — ne publiez jamais un témoignage fictif]'

export function isRealTestimonial(t: { authorName: string; quote: string; rating: number }): boolean {
  return (
    t.authorName.trim() !== '' &&
    t.authorName.trim() !== TESTIMONIAL_AUTHOR_PLACEHOLDER &&
    t.quote.trim() !== '' &&
    t.quote.trim() !== TESTIMONIAL_QUOTE_PLACEHOLDER &&
    t.rating > 0
  )
}

/** Token `[...]` non résolu — même regex que le schéma Zod du générateur
 * (assemble.ts `refine(s => /\[[^\]]+\]/.test(s))`). */
const BRACKET_TOKEN_PATTERN = /\[[^\]]+\]/

export function hasUnresolvedBracketToken(text: string): boolean {
  return BRACKET_TOKEN_PATTERN.test(text)
}

/** Compte les mots d'un fragment HTML — strip les balises avant de splitter
 * sur les espaces. Pas une tokenisation NLP, juste un budget approximatif
 * (cohérent avec l'usage "vise au moins 150 mots"). */
export function countWordsFromHtml(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

/** Détecte un bloc `<script type="application/ld+json">` avec `"@type":"Product"`
 * dans le HTML public de la page produit — recherche textuelle simple (pas
 * de parsing JSON strict : le schema JSON-LD peut être un tableau ou un
 * objet unique, la présence de la paire clé/valeur suffit comme signal). */
export function htmlContainsProductJsonLd(html: string): boolean {
  const scriptBlocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  if (!scriptBlocks) return false
  return scriptBlocks.some((block) => /"@type"\s*:\s*"Product"/.test(block))
}
