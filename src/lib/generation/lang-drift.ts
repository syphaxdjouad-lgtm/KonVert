// Détection de dérive de langue — filet de sécurité pour le Bug C (repro
// 2026-07/08 : sur langue cible non-FR, DeepSeek revient parfois en français
// sur les champs narratifs précoces, malgré la consigne explicite et le
// prompt engineering appliqué — cf commentaire buildSystemPrompt). Neutraliser
// le prompt réduit le drift de 100% → 25% (mesuré sur ~30 runs réels) mais ne
// l'élimine pas : ce module fournit le signal pour déclencher 1 retry
// automatique côté generateLandingPage.
//
// Pas une vraie détection de langue générique (pas de dépendance lourde type
// franc/cld3) — un signal ciblé, suffisant pour retry, jamais bloquant.

// Scripts non-latins qu'on sait détecter de façon fiable par plage Unicode.
// 'ar'/'zh' sont les cibles actuellement supportées (cf ALLOWED_LANGS) ;
// 'ru'/'he' ajoutés en prévision d'un futur élargissement de langues.
const NON_LATIN_SCRIPTS: Record<string, RegExp> = {
  ar: /[؀-ۿ]/g,
  zh: /[一-鿿]/g,
  ru: /[Ѐ-ӿ]/g,
  he: /[֐-׿]/g,
}

const LATIN_RE = /[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/g

// Cibles latines pour lesquelles on tente une heuristique best-effort. Le
// drift observé en pratique est presque toujours "reste en français par
// défaut" (langue système-prompt la plus fréquente) — on cherche donc une
// densité de stopwords FR anormalement élevée. Ce n'est PAS une détection de
// langue fiable à 100% — juste un signal pour déclencher 1 retry, jamais
// bloquant, jamais une erreur utilisateur.
const LATIN_TARGET_LANGS = new Set(['en', 'es', 'de', 'it', 'pt', 'nl'])
const FR_STOPWORDS_RE = /\b(le|la|les|des|une|un|est|pour|avec|dans|sur|vous|votre|qui|que|nous|notre)\b/gi

/**
 * Retourne true si `text` semble ne PAS être dans `targetLanguage`.
 *
 * - Cible non-latine (ar, zh, ru, he) : ratio caractères du script attendu
 *   vs caractères latins. Majorité latine → drift.
 * - Cible latine non-FR (en, es, de, it, pt, nl) : densité de stopwords FR
 *   au-delà d'un seuil → drift probable (heuristique best-effort).
 * - Cible 'fr' ou langue non reconnue : jamais de drift signalé (pas de
 *   vérif fiable disponible) — dégrade proprement, ne bloque jamais.
 * - Texte vide/trop court : jamais de drift signalé (pas assez de signal).
 */
export function detectLangDrift(text: string, targetLanguage: string): boolean {
  const trimmed = (text ?? '').trim()
  if (!trimmed) return false

  const scriptRe = NON_LATIN_SCRIPTS[targetLanguage]
  if (scriptRe) {
    const scriptCount = (trimmed.match(scriptRe) ?? []).length
    const latinCount = (trimmed.match(LATIN_RE) ?? []).length
    if (scriptCount + latinCount === 0) return false
    return latinCount > scriptCount
  }

  if (LATIN_TARGET_LANGS.has(targetLanguage)) {
    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length < 4) return false
    const frHits = (trimmed.match(FR_STOPWORDS_RE) ?? []).length
    return frHits / words.length > 0.15
  }

  return false
}
