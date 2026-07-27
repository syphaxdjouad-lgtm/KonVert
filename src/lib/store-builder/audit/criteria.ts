// Store Builder for Shopify — Re-audit CRO J+7/J+30 : moteur de scoring pur.
// Cf. spec KAKASHI §B.1-B.3 (docs/store-builder-sprint8-spec.md) pour le
// détail des 18 critères, poids (Σ=100), seuils et wording des
// recommandations (R5 obligatoire sur avis/preuve sociale — jamais
// "génère", toujours "ajoute tes VRAIS avis/chiffres").
//
// Pur : ne fait AUCUN accès réseau/DB. Consomme `AuditInputs`, déjà
// collectées par la couche impure (fetch-inputs.ts).

import type { AuditCriterionResult, AuditInputs } from './types'
import { countWordsFromHtml, hasUnresolvedBracketToken, isRealTestimonial } from './helpers'

// Garde-fou de cohérence : la somme des poids DOIT valoir 100 (vérifié par
// un test dédié — un critère ajouté/retiré sans ajuster les poids casserait
// silencieusement l'échelle 0-100 du score).
export function evaluateAuditCriteria(inputs: AuditInputs): AuditCriterionResult[] {
  const results: AuditCriterionResult[] = []

  // ── Groupe 1 — contenu jamais généré par l'IA (vrais gaps) — Σ 47 ────────

  // #1 — Avis clients réels (tiered : 0→0%, 1-2→60%, ≥3→100%)
  {
    const realCount = inputs.testimonials.filter(isRealTestimonial).length
    const credit = realCount === 0 ? 0 : realCount <= 2 ? 0.6 : 1
    results.push({
      id: 1,
      label: 'Avis clients réels',
      weight: 14,
      pass: credit === 1,
      credit,
      measuredValue: realCount,
      measurable: true,
      recommendation:
        credit < 1
          ? "Ajoute au moins 3 vrais avis clients dans la section Avis — jamais générés, toujours réels."
          : undefined,
    })
  }

  // #2 — Preuve sociale renseignée
  {
    const pass = inputs.socialProofNumber.trim() !== '' || inputs.socialProofCustomText.trim() !== ''
    results.push({
      id: 2,
      label: 'Preuve sociale renseignée',
      weight: 12,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: { number: inputs.socialProofNumber, customText: inputs.socialProofCustomText },
      measurable: true,
      recommendation: pass
        ? undefined
        : "Renseigne un vrai chiffre de preuve sociale (ex. nombre de commandes) dans la section Preuve sociale — jamais inventé.",
    })
  }

  // #3 — Nom du fondateur renseigné
  {
    const pass = inputs.founderName.trim() !== ''
    results.push({
      id: 3,
      label: 'Nom du fondateur renseigné',
      weight: 7,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.founderName,
      measurable: true,
      recommendation: pass ? undefined : "Ajoute ton vrai nom dans la section Notre histoire pour humaniser la page.",
    })
  }

  // #4 — Histoire fondateur personnalisée (aucun token [...] restant)
  {
    const pass = inputs.founderStoryHtml.trim() !== '' && !hasUnresolvedBracketToken(inputs.founderStoryHtml)
    results.push({
      id: 4,
      label: 'Histoire fondateur personnalisée',
      weight: 7,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.founderStoryHtml,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Remplace les [crochets] restants dans ton histoire de marque par tes vraies infos (ville, année, etc.).",
    })
  }

  // #5 — Photo fondateur ajoutée
  {
    const pass = inputs.founderPhoto.trim() !== ''
    results.push({
      id: 5,
      label: 'Photo fondateur ajoutée',
      weight: 4,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.founderPhoto,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Ajoute une photo dans la section Notre histoire — les visages augmentent la confiance.",
    })
  }

  // #6 — Popup exit-intent personnalisée (promo_code renseigné)
  {
    const pass = inputs.exitIntentPromoCode.trim() !== ''
    results.push({
      id: 6,
      label: 'Popup exit-intent personnalisée',
      weight: 3,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.exitIntentPromoCode,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Ajoute un vrai code promo actif à ta popup de sortie, ou laisse-la telle quelle en connaissance de cause.",
    })
  }

  // ── Groupe 2 — contenu généré par l'IA, vérif défensive — Σ 23 ───────────

  // #7 — FAQ ≥ 3 Q/R non vides
  {
    const filled = inputs.faqItems.filter((f) => f.question.trim() !== '' && f.answer.trim() !== '').length
    const pass = filled >= 3
    results.push({
      id: 7,
      label: 'FAQ ≥ 3 Q/R non vides',
      weight: 6,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: filled,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Vérifie que ta FAQ a bien au moins 3 questions remplies — un bloc a peut-être été supprimé.",
    })
  }

  // #8 — Garanties ≥ 3
  {
    const pass = inputs.guaranteesFilledCount >= 3
    results.push({
      id: 8,
      label: 'Garanties ≥ 3',
      weight: 5,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.guaranteesFilledCount,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Vérifie que tes garanties (livraison, retour...) sont bien au moins 3 et remplies.",
    })
  }

  // #9 — Tableau comparatif ≥ 4 lignes
  {
    const pass = inputs.comparisonRowsFilledCount >= 4
    results.push({
      id: 9,
      label: 'Tableau comparatif ≥ 4 lignes',
      weight: 4,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.comparisonRowsFilledCount,
      measurable: true,
      recommendation: pass ? undefined : "Complète ton tableau comparatif — au moins 4 lignes remplies recommandées.",
    })
  }

  // #10 — Barre d'urgence remplie
  {
    const pass = inputs.urgencyMessageDefault.trim() !== ''
    results.push({
      id: 10,
      label: "Barre d'urgence remplie",
      weight: 3,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.urgencyMessageDefault,
      measurable: true,
      recommendation: pass ? undefined : "Ta barre d'urgence est vide — ajoute un message (ex. délai de livraison).",
    })
  }

  // #11 — Sticky ATC mobile actif
  {
    const pass = inputs.stickyAtcSectionPresent
    results.push({
      id: 11,
      label: 'Sticky ATC mobile actif',
      weight: 2,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.stickyAtcSectionPresent,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Active la barre d'achat fixe mobile — elle améliore la conversion sur mobile.",
    })
  }

  // #12 — Description produit ≥ 150 mots
  {
    const wordCount = countWordsFromHtml(inputs.productDescriptionHtml)
    const pass = wordCount >= 150
    results.push({
      id: 12,
      label: 'Description produit ≥ 150 mots',
      weight: 3,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: wordCount,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Ta description produit est courte — vise au moins 150 mots pour le SEO et la conversion.",
    })
  }

  // ── Groupe 3 — Produit / SEO / Perf, indépendant du générateur — Σ 30 ────

  // #13 — Images produit ≥ 4
  {
    const pass = inputs.productImagesCount >= 4
    results.push({
      id: 13,
      label: 'Images produit ≥ 4',
      weight: 10,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.productImagesCount,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Ajoute plus de photos produit — vise au moins 4 (angles, contexte d'usage, packaging).",
    })
  }

  // #14 — Meta title 30-60 caractères
  {
    const len = inputs.metaTitle.trim().length
    const pass = len >= 30 && len <= 60
    results.push({
      id: 14,
      label: 'Meta title 30-60 caractères',
      weight: 5,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: len,
      measurable: true,
      recommendation: pass
        ? undefined
        : "Ton titre SEO est mal calibré (trop court/long) — vise 30 à 60 caractères.",
    })
  }

  // #15 — Meta description 70-160 caractères
  {
    const len = inputs.metaDescription.trim().length
    const pass = len >= 70 && len <= 160
    results.push({
      id: 15,
      label: 'Meta description 70-160 caractères',
      weight: 5,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: len,
      measurable: true,
      recommendation: pass ? undefined : "Ta meta description est mal calibrée — vise 70 à 160 caractères.",
    })
  }

  // #16 — Schema JSON-LD Product présent (nécessite un fetch public — peut
  // être non mesurable si le fetch échoue ou n'a jamais été tenté)
  {
    const measurable = inputs.jsonLdProductPresent !== null
    const pass = inputs.jsonLdProductPresent === true
    results.push({
      id: 16,
      label: 'Schema JSON-LD Product présent',
      weight: 3,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.jsonLdProductPresent,
      measurable,
      recommendation: pass
        ? undefined
        : "Les données structurées produit sont absentes — pénalise ta visibilité Google Shopping.",
    })
  }

  // #17 — Perf mobile Lighthouse (tiered : <50→0%, 50-89→60%, ≥90→100%) —
  // nécessite GOOGLE_PSI_API_KEY, non mesurable sans clé.
  {
    const measurable = inputs.pageSpeedPerformanceScore !== null
    const scorePct = measurable ? (inputs.pageSpeedPerformanceScore as number) * 100 : null
    const credit = !measurable ? 0 : scorePct! < 50 ? 0 : scorePct! < 90 ? 0.6 : 1
    results.push({
      id: 17,
      label: 'Perf mobile Lighthouse',
      weight: 5,
      pass: credit === 1,
      credit,
      measuredValue: scorePct,
      measurable,
      recommendation: credit < 1 ? "Ta boutique est lente sur mobile — vérifie les images trop lourdes en premier." : undefined,
    })
  }

  // #18 — LCP mobile < 4000ms — nécessite GOOGLE_PSI_API_KEY.
  {
    const measurable = inputs.pageSpeedLcpMs !== null
    const pass = measurable && (inputs.pageSpeedLcpMs as number) < 4000
    results.push({
      id: 18,
      label: 'LCP mobile',
      weight: 2,
      pass,
      credit: pass ? 1 : 0,
      measuredValue: inputs.pageSpeedLcpMs,
      measurable,
      recommendation: pass
        ? undefined
        : "Ton chargement mobile est lent (LCP > 4s) — compresse tes images ci-dessus du pli.",
    })
  }

  return results
}

/** Somme des poids déclarés — utilisée en test de non-régression (doit
 * toujours valoir 100, cf. spec §B.1). */
export const AUDIT_TOTAL_WEIGHT = 100
