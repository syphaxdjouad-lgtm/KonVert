// ─── Sanitizer richtext restreint — defense in depth ───────────────────────
//
// Les champs `description_html`, `faq[].answer_html`, `guarantees[].text_html`,
// `founder_story.story_html`, `exit_intent.text_html` sont volontairement des
// champs HTML (Shopify Admin `body_html` / settings `richtext`) — contrairement
// aux autres champs texte de la sortie du générateur, on NE PEUT PAS les
// échapper avec `escapeHtmlText` (ça afficherait "&lt;p&gt;" en clair sur la
// boutique au lieu de rendre un paragraphe).
//
// Le system prompt (prompts.ts) contraint le LLM à ne produire QUE des balises
// `<p>` — mais un prompt n'est pas un guardrail structurel (doctrine NEXARA :
// la robustesse vient du code, pas du prompt seul, cf. incident press_logos
// du 2026-06-06). Ce sanitizer applique donc une whitelist stricte : toute
// balise qui n'est pas exactement `<p>`/`</p>` est neutralisée (échappée en
// texte visible, jamais supprimée silencieusement — une dérive doit rester
// visible en review plutôt que disparaître).

const TAG_PATTERN = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g

function escapeAngleBrackets(raw: string): string {
  return raw.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Neutralise toute balise HTML autre que `<p>`/`</p>` dans un champ richtext
 * généré par le LLM (ou par le fallback statique). Les attributs éventuels
 * sur une balise `<p>` autorisée (ex. `<p onclick="...">`) sont supprimés —
 * seule la forme minimale `<p>`/`</p>` survit.
 */
export function sanitizeRichTextP(input: string): string {
  return input.replace(TAG_PATTERN, (match, tagName: string) => {
    const isClosing = match.startsWith('</')
    if (tagName.toLowerCase() === 'p') {
      return isClosing ? '</p>' : '<p>'
    }
    return escapeAngleBrackets(match)
  })
}
