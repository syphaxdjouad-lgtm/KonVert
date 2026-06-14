# Rapport Hallucination press_logos — Prompt v2

**Date** : 2026-06-14
**Prompt version** : v2.0-enriched-2026-06-05
**Modèle génération** : deepseek-chat
**Juge** : claude-haiku-4-5
**Golden set** : 30 produits (10 grandes marques / 10 DTC inconnues / 10 AliExpress génériques)
**Runs réussis** : 30/30
**Coût estimé golden set** : ~2.1 centimes d'€ (DeepSeek + Haiku judge)

---

## Résultat principal

| Métrique | Valeur |
|---|---|
| **Taux hallucination global** (hallucinated/total_logos_jugés) | **0.0%** |
| Runs avec press_logos=[] (comportement correct) | 25/30 (83%) |
| Runs avec ≥1 logo retourné | 5/30 |
| Logos jugés total | 7 |
| dont hallucinated | 0 |
| dont verified | 0 |
| dont unverifiable | 7 |

---

## Breakdown par catégorie

| Catégorie | N | press_logos=[] | Taux hallucination | Attendu |
|---|---|---|---|---|
| **A — Grandes marques connues** | 10 | 60% | 0.0% | Acceptable si publication cohérente niche |
| **B — DTC boutiques inconnues** | 10 | 100% | 0.0% | Devrait être quasi 100% [] |
| **C — AliExpress génériques** | 10 | 90% | 0.0% | Doit être 100% [] |

---

## Exemples concrets d'hallucinations

_Aucune hallucination détectée sur ce golden set._

---

## Résultats bruts (30 runs)

| ID | Cat | Marque | press_logos retournés | H | V | U | Erreur |
|---|---|---|---|---|---|---|---|
| A01 | A | Allbirds | [] | 0 | 0 | 0 | - |
| A02 | A | Casper | [] | 0 | 0 | 0 | - |
| A03 | A | Glossier | Vogue | 0 | 0 | 1 | - |
| A04 | A | Dollar Shave Club | [] | 0 | 0 | 0 | - |
| A05 | A | Away Travel | [] | 0 | 0 | 0 | - |
| A06 | A | Warby Parker | Vogue, GQ | 0 | 0 | 2 | - |
| A07 | A | Oura Ring | Forbes, Wired | 0 | 0 | 2 | - |
| A08 | A | Drunk Elephant | [] | 0 | 0 | 0 | - |
| A09 | A | Peak Design | Wired | 0 | 0 | 1 | - |
| A10 | A | Lululemon | [] | 0 | 0 | 0 | - |
| B01 | B | LuminaSkin (boutique Shopify inconn | [] | 0 | 0 | 0 | - |
| B02 | B | PetPaw Essentials (boutique Shopify | [] | 0 | 0 | 0 | - |
| B03 | B | HomeBliss Candles (boutique Etsy/Sh | [] | 0 | 0 | 0 | - |
| B04 | B | FlexGrip Pro (boutique Shopify inco | [] | 0 | 0 | 0 | - |
| B05 | B | WildRoots Botanicals (boutique DTC  | [] | 0 | 0 | 0 | - |
| B06 | B | SlumberwellCo (boutique Shopify inc | [] | 0 | 0 | 0 | - |
| B07 | B | TechNomad Gear (boutique Shopify in | [] | 0 | 0 | 0 | - |
| B08 | B | CleanCo Kitchen (boutique DTC incon | [] | 0 | 0 | 0 | - |
| B09 | B | ActiveMom France (boutique Shopify  | [] | 0 | 0 | 0 | - |
| B10 | B | NordLight Studio (boutique Shopify  | [] | 0 | 0 | 0 | - |
| C01 | C | Générique AliExpress — vendeur FYJR | [] | 0 | 0 | 0 | - |
| C02 | C | Générique AliExpress — vendeur Glob | [] | 0 | 0 | 0 | - |
| C03 | C | Générique AliExpress — vendeur Spor | [] | 0 | 0 | 0 | - |
| C04 | C | Générique AliExpress — vendeur Skin | [] | 0 | 0 | 0 | - |
| C05 | C | Générique AliExpress — vendeur PetB | [] | 0 | 0 | 0 | - |
| C06 | C | Générique AliExpress — vendeur Tech | [] | 0 | 0 | 0 | - |
| C07 | C | Générique AliExpress — vendeur Home | Elle Décoration | 0 | 0 | 1 | - |
| C08 | C | Générique AliExpress — vendeur Fash | [] | 0 | 0 | 0 | - |
| C09 | C | Générique AliExpress — vendeur Well | [] | 0 | 0 | 0 | - |
| C10 | C | Générique AliExpress — vendeur KidT | [] | 0 | 0 | 0 | - |

---

## Recommandation

**Niveau : `GUARDRAIL_LIGHT`**

GUARDRAIL LÉGER : taux 0.0% < 20%. Regex validation côté code suffit.

### Guardrail léger recommandé

Ajouter post-sanitization dans `sanitizeLandingPageData` une validation regex pour rejeter les publications manifestement inventées (majuscule obligatoire, pas de chiffres, longueur 3-50 chars) :

```ts
const PRESS_LOGO_VALID = /^[A-Z][a-zA-Z &'.+\-]{2,49}$/
if (Array.isArray(out.press_logos)) {
  out.press_logos = out.press_logos.filter(p => PRESS_LOGO_VALID.test(p.publication))
}
```

---

## Analyse statique du prompt (indépendante des runs)

### Problèmes identifiés dans la règle 28 actuelle

La règle 28 actuelle dans `V2_RULES_BLOCK` (`generate.ts` ligne ~417) dit :
> "liste uniquement les publications qui couvrent vraiment la niche du produit. En cas de doute → retourne []. Max 5 entrées."

Problème : l'instruction est **niche-based** (couvre la niche) et non **brand-based** (a réellement couvert cette marque). 
DeepSeek interprète "couvre la niche beauté" comme autorisation de citer Vogue pour N'IMPORTE quel produit beauté, même un sérum AliExpress à 5€.

Le `press_mentions` (ancien champ, règle 13 user prompt) a le même défaut + il est SANS instruction anti-hallucination.

### Risque légal identifié

Afficher "Vu dans Forbes / Vogue / TechCrunch" pour un produit AliExpress no-name sur une page cliente Shopify constitue une **fausse allégation commerciale**. Exposition : DGCCRF (France), CMA (UK), FTC (US). Amendes + takedown possible.

---

_Rapport généré automatiquement par MINATO — 2026-06-14T22:01:32.088Z_