# Adaptive Sections — sélection intelligente des sections par produit

**Date** : 2026-07-27
**Statut** : design validé (founder), spec à approuver avant plan
**Auteur** : Claude (diagnostic + design), founder (décisions)

## 1. Problème

Les pages générées sont **trop longues et pas adaptées au produit**. DeepSeek remplit *toutes* les sections possibles pour *tous* les produits ; chaque section s'affiche dès qu'elle a du contenu (legacy : `if (!d.story) return ''` ; V3 : `shouldRenderSection`). Résultat : un avant/après pour des écouteurs, une story artisanale pour un gadget tech, ~20 sections là où 7 suffiraient.

Constat clé : le rendu filtre déjà les sections vides — **le vrai levier est en amont**, dans ce que la génération décide de remplir.

## 2. Objectif

Générer des pages **adaptées** : les bonnes sections pour le type de produit, une longueur proportionnée, jamais de section hors-sujet. Mesure de succès : plus aucune section absurde (avant/après sur produit non pertinent), longueur médiane divisée par ~2 sur les produits simples, ressenti « page pro et ciblée ».

## 3. Décisions (validées founder)

1. **Approche hybride** : socle de sections par catégorie (best practices) + l'IA affine selon le produit précis.
2. **Longueur variable** : fourchette par produit (simple/pas cher → court 6-8 ; premium/complexe → 10-13), avec un **plafond dur**.
3. **Socle établi par benchmark réel** des meilleures pages DTC par catégorie + concurrents.

## 4. Architecture

Trois briques, additives, greffées sur l'existant.

### 4.1 Détection produit (réutilise l'existant)
`src/lib/templates/detect-product-type.ts` classe déjà via `ProductType` (skincare, cosmetics, supplements, electronics, jewelry, apparel, home… `universal` en fallback) + le prix scrapé. Aucune nouvelle détection nécessaire ; on ajoute au besoin quelques catégories manquantes (ex : audio séparé d'electronics si le benchmark le justifie).

### 4.2 Section Policy — le « playbook » *(nouveau module)*
`src/lib/generation/section-policy.ts` : fonction pure
```
getSectionPolicy(input: { productType: ProductType; price?: number }) => {
  recommended: SectionKey[]   // socle à remplir en priorité
  discouraged: SectionKey[]   // à ne PAS générer pour ce type
  min: number                 // plancher de sections
  max: number                 // plafond dur (garde-fou anti-pavé)
}
```
- Table de politiques par catégorie, **remplie à partir du benchmark** (Phase 0). Une entrée `universal` sert de défaut sûr.
- La fourchette `[min,max]` module la longueur selon prix/complexité (produit cher → max plus haut).
- Module sans I/O, 100% testable en isolation.

### 4.3 Génération guidée *(modif des prompts existants)*
Les builders de prompt (`buildSystemPrompt`/`buildUserPrompt` legacy dans `generation/generate.ts` ; `buildV3SystemPrompt` dans `api/generate/route.ts`) reçoivent la policy et injectent une consigne :
> « Ce produit est de type X. Remplis en priorité ces sections : [recommended]. NE GÉNÈRE PAS : [discouraged]. Vise [min]-[max] sections. Tu peux retirer une section du socle si non pertinente, ou en ajouter une hors socle si le produit le justifie clairement. »

L'IA **affine** dans le cadre. Le rendu (déjà) n'affiche que les sections remplies → aucune modif renderer nécessaire, hormis un **garde-fou** qui tronque au `max` si l'IA déborde.

### 4.4 Garde-fou longueur
Après génération, si le nombre de sections rendues dépasse `max`, on tronque en gardant l'ordre de priorité de la policy. Filet déterministe indépendant de l'IA.

## 5. Data flow
```
scrape → detectProductType(+price) → getSectionPolicy → prompt guidé → DeepSeek
       → sections remplies (pertinentes) → renderer (filtre vides) → garde-fou max → page
```

## 6. Périmètre
- **Les deux moteurs** : legacy (`renderRichSections`, 21 sections) ET V3 (14 sections). Le point commun est le prompt → une seule policy alimente les deux, avec un mapping des clés vers chaque moteur.
- **Hors-scope** (traité séparément) : les libellés FR résiduels (titre/bouton/footer) = fignolage i18n, ticket distinct.

## 7. Phases de réalisation
- **Phase 0 — Benchmark DTC** : analyser les meilleures pages produit par catégorie (Allbirds, Ridge, Oura, marques skincare/bijoux premium…) + concurrents ; livrable = les tables de policy documentées.
- **Phase 1 — Module `section-policy.ts`** + tests unitaires (chaque catégorie → sections attendues, fourchettes, fallback `universal`).
- **Phase 2 — Branchement prompts** (legacy + V3) + résolution de la policy dans `/api/generate`.
- **Phase 3 — Garde-fou `max`** au rendu + tests.
- **Phase 4 — Vérif end-to-end** : générer écouteurs (court, pas d'avant/après), skincare (avant/après présent), bijoux (matières/story) et comparer.

## 8. Tests
- Unitaires policy : catégorie connue → `recommended`/`discouraged` corrects ; prix bas → `max` bas ; catégorie inconnue → `universal`.
- Garde-fou : liste de sections > max → tronquée à max, ordre préservé.
- Smoke génération (mockée) : la consigne de policy est bien injectée dans le prompt.

## 9. Risques / garde-fous
- **L'IA ignore la consigne** → le garde-fou `max` + le filtre `discouraged` (on peut aussi *strip* côté serveur les sections `discouraged` même si générées) rattrapent.
- **Benchmark subjectif** → documenter la source de chaque choix de policy pour pouvoir réviser.
- **Régression longueur sur produits premium** → la fourchette `max` haute par catégorie premium évite d'amputer les pages qui méritent d'être longues.
