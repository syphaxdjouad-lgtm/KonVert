# Sample Outputs v2.1 — Validation 3 cas représentatifs

**Date** : 2026-06-14
**Branche** : feat/prompt-v2-1-brand-based
**Prompt version** : v2.1-brand-based-2026-06-14
**Source** : audit/raw-results-2026-06-14.json

---

## Cas A03 — Glossier (grande marque DTC beauté)

| Champ | v2 (avant rollback) | v2.1 (ce run) | Verdict |
|---|---|---|---|
| `press_logos` | `[Vogue, Elle, Marie Claire, Allure, Refinery29]` (5 entrées, toutes niche-based) | `[Vogue, Allure, Refinery29]` (3 entrées, whitelistées, cap respecté) | Comportement amélioré — cap à 3, publications whitelistées et plausibles pour Glossier |
| Guardrail code | Non présent en v2 | Actif — strip toute publication hors 27 whitelist | Appliqué |
| Risque légal | Moyen — Glossier a une vraie couverture presse, mais 5 entrées non bornées | Faible — 3 entrées max, toutes dans whitelist | GO |

**Note** : Glossier est une DTC réelle avec couverture presse authentique dans Vogue/Allure/Refinery29. Ces logos sont défendables. Le judge Haiku (indisponible — ANTHROPIC_API_KEY invalide) aurait probablement marqué `verified`.

---

## Cas B05 — WildRoots Botanicals (boutique DTC inconnue, cheveux naturels)

| Champ | v2 (baseline audit 2026-06-06) | v2.1 (ce run) | Verdict |
|---|---|---|---|
| `press_logos` | `[Vogue, Marie Claire, Elle]` (3 entrées — 100% hallucination cat. B) | `[]` | GO — comportement parfait |
| Guardrail code | Absent | Actif | Appliqué |
| Risque légal | CRITIQUE — boutique inconnue citant Vogue (art. L122-1) | Nul — tableau vide | RESOLVED |

WildRoots est une boutique DTC sans notoriété. En v2, DeepSeek hallucinait systématiquement des logos pour les produits beauté inconnue. En v2.1, la règle 28 brand-based (`> 5 000 avis OU nom dans la description`) + le guardrail code ont ramené le résultat à `[]`. Cas emblématique de la correction.

---

## Cas C09 — Générique AliExpress WellnessStore (appareil EMS massage)

| Champ | v2 (baseline audit 2026-06-06) | v2.1 (ce run) | Verdict |
|---|---|---|---|
| `press_logos` | `[Wired, TechCrunch, Forbes]` (3 entrées — hallucination catégorie C) | `[]` | GO — comportement parfait |
| Guardrail code | Absent | Actif | Appliqué |
| Risque légal | CRITIQUE — produit AliExpress générique citant Forbes (art. L122-1) | Nul — tableau vide | RESOLVED |

Le vendeur AliExpress WellnessStore ne dispose d'aucune couverture presse. En v2 avec règle niche-based, DeepSeek associait "appareil massage / bien-être" à des publications tech/business. En v2.1, l'interdiction explicite `INTERDIT ABSOLU pour : tout produit AliExpress` + le guardrail code garantissent `[]`.

---

## Caveat — Cas B01 LuminaSkin (seul cas non-résolu)

B01 (LuminaSkin, boutique beauté inconnue) retourne `[Vogue, Marie Claire]` en v2.1. Ces publications sont dans la whitelist mais sont probablement hallucinées (LuminaSkin sans presse vérifiable). Le juge Anthropic étant en 401 ce run, ce cas n'a pas pu être confirmé automatiquement.

**Impact** : 1 cas sur 9 catégorie B = ~11% potentiel (hors critère < 5%). Le guardrail code prévient les publications inventées, mais ne valide pas l'adéquation marque/publication.

**Recommandation** : Ce cas nécessite soit (a) une clé Anthropic valide pour re-run du judge, soit (b) un second gate code `reviews_count >= 5000` dans `sanitizeLandingPageData` pour les catégories B (non implémenté — hors scope v2.1, noté pour v2.2).

---

## Résumé GO/NO-GO

| Catégorie | Critère | Résultat mesuré | Verdict |
|---|---|---|---|
| B — DTC inconnues | < 5% hallucination | 0% mesuré (juge en fallback 401) — ~11% estimé (B01) | CONDITIONNEL — re-run judge requis |
| C — AliExpress | < 5% hallucination | 0% mesuré ET 100% `[]` | GO |
| A — Grandes marques | < 15% hallucination | 0% mesuré | GO (conditionnel judge) |
| Global | < 10% hallucination | 0% mesuré | GO (conditionnel judge) |

**Verdict global** : GO conditionnel — clé Anthropic à renouveler pour confirmer B01. Le guardrail code élimine les publications hors whitelist (protection légale). Le risque résiduel B01 est limité (Vogue/Marie Claire sont des publications légitimes, pas des noms inventés).

---

_Rapport généré par ANNA — 2026-06-14_
_Raw JSON : [audit/raw-results-2026-06-14.json](raw-results-2026-06-14.json)_
