# Adaptive Sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Générer des pages produit dont les sections sont choisies selon le type de produit (socle par catégorie + affinage IA), avec une longueur proportionnée et un plafond dur — fini l'avant/après pour des écouteurs.

**Architecture:** Un module pur `section-policy.ts` traduit (catégorie détectée + prix) → { sections recommandées, sections bannies, min, max }. Cette policy est injectée dans les prompts de génération (legacy + V3) pour guider DeepSeek, puis un garde-fou de rendu strippe les sections bannies et tronque au `max`. Aucune nouvelle détection : on réutilise `detectProductType`.

**Tech Stack:** TypeScript, Next.js App Router, DeepSeek (via fetch legacy + Vercel AI SDK V3), Vitest.

## Global Constraints

- Travailler depuis `origin/main` dans le worktree `konvert-worktrees/adaptive-sections` (branche `feat/adaptive-sections`).
- `buildSystemPrompt` legacy (generate.ts) DOIT rester 100% statique par langue (prompt caching DeepSeek) → toute injection dynamique de policy va dans `buildUserPrompt`.
- Mac 8 Go RAM : `NODE_OPTIONS=--max-old-space-size=2048`, node_modules symlinké, PAS de `next build`.
- Fallback `universal` obligatoire pour toute catégorie inconnue.
- Ne pas régresser l'i18n déjà en prod (les libellés passent par `t(lang, ...)`).
- Vérif par `vitest run <fichier>` ciblé + `tsc --noEmit` cappé.
- Commits en français, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## File Structure

- Create: `docs/superpowers/research/2026-07-27-dtc-sections-benchmark.md` — livrable du benchmark, source des policies.
- Create: `src/lib/generation/section-policy.ts` — types + `getSectionPolicy()` + tables par catégorie + mapping vers clés legacy/V3.
- Create: `src/lib/generation/section-policy.test.ts` — tests unitaires.
- Modify: `src/lib/generation/generate.ts` — `buildUserPrompt` reçoit la policy ; `generateLandingPage` résout la policy ; strip `discouraged` + garde-fou `max` sur la sortie legacy.
- Modify: `src/app/api/generate/route.ts` — path V3 : résout la policy, l'injecte dans `buildV3SystemPrompt`, strip/tronque.
- Modify: `src/lib/sections-v3/render-page.ts` — accepte un plafond de sections optionnel (garde-fou V3).

---

### Task 1: Benchmark DTC → tables de policy documentées

**Files:**
- Create: `docs/superpowers/research/2026-07-27-dtc-sections-benchmark.md`

**But:** produire, pour chaque `ProductType` de `detect-product-type.ts` (skincare, cosmetics, supplements, electronics, jewelry, apparel, home, + `universal`), la liste `recommended` / `discouraged` de sections et la fourchette `min/max`, en s'appuyant sur les meilleures pages produit DTC par catégorie.

- [ ] **Step 1:** Lister les `ProductType` réels depuis `src/lib/templates/detect-product-type.ts` et l'inventaire des sections des deux moteurs : legacy (21, cf `src/lib/templates/sections.ts` `RICH_SECTION_ORDER`) et V3 (14, cf `src/types/v3.ts` `V3SectionKey`).
- [ ] **Step 2:** Pour chaque catégorie, analyser 2-3 pages produit DTC de référence (via WebSearch/firecrawl_scrape : ex electronics→Anker/Nothing ; skincare→The Ordinary/Typology ; jewelry→Mejuri ; apparel→Allbirds ; supplements→Oura/AG1 ; home→Our Place). Noter quelles sections elles utilisent réellement et lesquelles elles évitent.
- [ ] **Step 3:** Écrire le tableau final par catégorie : `recommended[]`, `discouraged[]`, `min`, `max`, avec 1 phrase justifiant chaque choix marquant (ex : « electronics → pas de before_after ni story artisanale »). Inclure la ligne `universal` (socle prudent : hero, features/why, social proof, reviews, faq, guarantee).
- [ ] **Step 4: Commit**
```bash
git add docs/superpowers/research/2026-07-27-dtc-sections-benchmark.md
git commit -m "docs(research): benchmark DTC sections par catégorie (source des policies)"
```

---

### Task 2: Module `section-policy.ts` (types + getSectionPolicy)

**Files:**
- Create: `src/lib/generation/section-policy.ts`
- Test: `src/lib/generation/section-policy.test.ts`

**Interfaces:**
- Consumes: `ProductType` depuis `@/lib/templates`, et le tableau de Task 1.
- Produces:
```ts
export type PolicySectionKey =
  | 'hero' | 'social_proof' | 'why' | 'features' | 'materials'
  | 'how_it_works' | 'before_after' | 'comparison' | 'reviews'
  | 'press' | 'faq' | 'guarantee' | 'story' | 'gallery'
// ^ clés neutres, mappées vers legacy/V3 en Task 3

export interface SectionPolicy {
  recommended: PolicySectionKey[]
  discouraged: PolicySectionKey[]
  min: number
  max: number
}

export function getSectionPolicy(input: {
  productType: ProductType | null
  price?: number
}): SectionPolicy
```
- Règle prix : au sein d'une catégorie, `max` effectif monte si `price` élevé (ex : `price >= 150` → `max` catégorie ; `price < 40` → `max` réduit de 2, plancher `min`). `productType` null/inconnu → policy `universal`.

- [ ] **Step 1: Écrire le test qui échoue** (`section-policy.test.ts`)
```ts
import { describe, it, expect } from 'vitest'
import { getSectionPolicy } from './section-policy'

describe('getSectionPolicy', () => {
  it('electronics bannit before_after et story', () => {
    const p = getSectionPolicy({ productType: 'electronics', price: 30 })
    expect(p.discouraged).toContain('before_after')
    expect(p.discouraged).toContain('story')
    expect(p.recommended).toContain('features')
  })
  it('skincare recommande before_after et materials', () => {
    const p = getSectionPolicy({ productType: 'skincare', price: 45 })
    expect(p.recommended).toContain('before_after')
    expect(p.recommended).toContain('materials')
  })
  it('produit pas cher → max plus court que produit premium', () => {
    const cheap = getSectionPolicy({ productType: 'electronics', price: 20 })
    const premium = getSectionPolicy({ productType: 'electronics', price: 300 })
    expect(cheap.max).toBeLessThan(premium.max)
  })
  it('catégorie inconnue → policy universal', () => {
    const p = getSectionPolicy({ productType: null })
    expect(p.recommended).toContain('hero')
    expect(p.recommended).toContain('reviews')
    expect(p.max).toBeGreaterThanOrEqual(p.min)
  })
})
```
- [ ] **Step 2: Run test → FAIL**
Run: `NODE_OPTIONS="--max-old-space-size=2048" node_modules/.bin/vitest run src/lib/generation/section-policy.test.ts`
Expected: FAIL (module introuvable).
- [ ] **Step 3: Implémenter** `section-policy.ts` : une `Record<ProductType, SectionPolicy>` remplie depuis le benchmark (Task 1), la fonction `getSectionPolicy` avec la règle prix, fallback `universal`. Utiliser les valeurs exactes du benchmark.
- [ ] **Step 4: Run test → PASS**
Run: `NODE_OPTIONS="--max-old-space-size=2048" node_modules/.bin/vitest run src/lib/generation/section-policy.test.ts`
Expected: PASS.
- [ ] **Step 5: Commit** `feat(generation): module section-policy (socle sections par catégorie + fourchette)`

---

### Task 3: Mapping PolicySectionKey → clés legacy & V3

**Files:**
- Modify: `src/lib/generation/section-policy.ts` (ajouter les mappings + helpers)
- Modify: `src/lib/generation/section-policy.test.ts` (tests mapping)

**Interfaces:**
- Produces:
```ts
export function policyToLegacyKeys(keys: PolicySectionKey[]): string[]   // vers RICH_SECTION_ORDER
export function policyToV3Keys(keys: PolicySectionKey[]): V3SectionKey[] // vers V3SectionKey
```
- Le mapping traduit chaque clé neutre vers 0..n clés du moteur cible (ex `reviews` → legacy `testimonials` + V3 `reviews`+`reviews_ai_summary`). Documenter chaque correspondance en commentaire.

- [ ] **Step 1: Test qui échoue** — `policyToV3Keys(['before_after'])` renvoie `[]` (V3 n'a pas de before_after) ; `policyToLegacyKeys(['before_after'])` contient `'before_after'` ; `policyToV3Keys(['reviews'])` contient `'reviews'`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implémenter les deux tables de mapping + fonctions.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `feat(generation): mapping policy → clés legacy/V3`

---

### Task 4: Injection policy dans le path legacy

**Files:**
- Modify: `src/lib/generation/generate.ts` (`buildUserPrompt` ~ligne 629 ; `generateLandingPage` ~ligne 706)
- Test: `src/lib/generation/generate.policy.test.ts` (create)

**Interfaces:**
- Consumes: `getSectionPolicy`, `policyToLegacyKeys`.
- `generateLandingPage(product, options)` : après détection du type (appeler `detectProductType` sur le product) et `getSectionPolicy`, passer la policy à `buildUserPrompt`.
- `buildUserPrompt(product, tone, priceLine, language, policy?)` — nouvel argument optionnel `policy`. Quand présent, ajouter un bloc :
```
CIBLAGE PRODUIT (type: <productType>) :
- Sections à REMPLIR en priorité : <policyToLegacyKeys(recommended)>
- Sections à NE PAS générer (hors-sujet pour ce produit) : <policyToLegacyKeys(discouraged)>
- Vise entre <min> et <max> sections. Tu peux retirer une section du socle si non pertinente, ou en ajouter une hors socle si le produit le justifie clairement.
```
- NE PAS toucher `buildSystemPrompt` (rester statique pour le cache).

- [ ] **Step 1: Test qui échoue** — un test qui appelle `buildUserPrompt(mockProduct, 'persuasif', '', 'fr', policy)` et assert que la string contient « NE PAS générer » et une des clés `discouraged`. (Extraire/exporter `buildUserPrompt` si nécessaire pour le test, ou tester via un export dédié.)
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implémenter l'argument `policy` + le bloc, et brancher la résolution dans `generateLandingPage` (detect + getSectionPolicy + strip côté serveur des sections `discouraged` réellement présentes dans la sortie parsée, avant retour).
- [ ] **Step 4:** Run → PASS + `tsc --noEmit`.
- [ ] **Step 5: Commit** `feat(generation): injecter la section-policy dans le prompt legacy + strip discouraged`

---

### Task 5: Injection policy dans le path V3

**Files:**
- Modify: `src/app/api/generate/route.ts` (path `engine==='v3'`, `buildV3SystemPrompt`)
- Test: `src/app/api/generate/route.policy.test.ts` (create, tests unitaires sur le helper de prompt extrait)

**Interfaces:**
- Consumes: `getSectionPolicy`, `policyToV3Keys`.
- Dans le path V3, après résolution du produit : `detectProductType` → `getSectionPolicy` → passer `recommended`/`discouraged` (mappés V3) et `min/max` à `buildV3SystemPrompt` (nouvel argument), avec la même consigne que Task 4 adaptée aux `V3SectionKey`.
- Après génération, avant `renderPageV3`, construire le `sectionOrder` en retirant les sections `discouraged` et en tronquant à `max` (priorité = ordre `recommended` puis défaut).

- [ ] **Step 1: Test qui échoue** — extraire la construction du system prompt V3 dans une fonction testable et asserter l'injection de la consigne (contient « NE PAS générer » + clé discouraged mappée).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implémenter injection + calcul du `sectionOrder` filtré/tronqué passé à `renderPageV3(styleId, v3Data, sectionOrder)`.
- [ ] **Step 4:** Run → PASS + `tsc`.
- [ ] **Step 5: Commit** `feat(generation): injecter la section-policy dans le path V3 + sectionOrder filtré`

---

### Task 6: Garde-fou de rendu (plafond max, indépendant de l'IA)

**Files:**
- Modify: `src/lib/sections-v3/render-page.ts` (respecter un `sectionOrder` déjà tronqué — vérifier qu'aucun plafond codé en dur ne s'y oppose)
- Modify: `src/lib/templates/sections.ts` (`renderRichSections` : après assemblage, si le nombre de sections rendues > `max` fourni, tronquer en gardant l'ordre `RICH_SECTION_ORDER` priorisé par la policy)
- Test: `src/lib/templates/__tests__/sections-maxcap.test.ts` (create)

**Interfaces:**
- `renderRichSections(...)` accepte un paramètre optionnel `maxSections?: number` ; si dépassé, tronque.

- [ ] **Step 1: Test qui échoue** — données avec 15 sections riches + `maxSections: 8` → le HTML rendu contient au plus 8 blocs `<section`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implémenter la troncature (compter les sections non vides, couper au-delà de `maxSections` selon l'ordre de priorité).
- [ ] **Step 4:** Run → PASS + `tsc`.
- [ ] **Step 5: Commit** `feat(render): garde-fou plafond de sections (anti-pavé)`

---

### Task 7: Vérification end-to-end + non-régression

**Files:** aucun code — vérification.

- [ ] **Step 1:** Lancer la suite ciblée : `vitest run src/lib/generation src/lib/templates/__tests__ src/lib/sections-v3` → tout vert.
- [ ] **Step 2:** `tsc --noEmit` cappé → 0 erreur.
- [ ] **Step 3:** Générer (script local ou preview) 3 produits : (a) écouteurs 25€ → page courte, aucune section before_after/story ; (b) sérum skincare 45€ → before_after + materials présents ; (c) collier bijou 120€ → materials/story présents, pas de comparison specs. Consigner le nombre de sections avant/après.
- [ ] **Step 4:** Ouvrir la PR `feat(generation): sections adaptatives par type de produit` (base `main`) avec le résumé + les 3 captures/relevés de sections.

---

## Self-Review

- **Spec coverage :** brique 4.1 détection (Task 4/5 via detectProductType) ✓ ; 4.2 policy (Task 2) ✓ ; 4.3 génération guidée (Task 4/5) ✓ ; 4.4 garde-fou (Task 6) ✓ ; benchmark (Task 1) ✓ ; deux moteurs (Task 3 mapping + 4 + 5) ✓ ; tests (Task 2/3/4/5/6) ✓.
- **Placeholders :** valeurs de policy = livrable explicite de Task 1 (pas un TODO caché) ; textes de prompt fournis.
- **Type consistency :** `PolicySectionKey`, `SectionPolicy`, `getSectionPolicy`, `policyToLegacyKeys`, `policyToV3Keys` cohérents entre Tasks 2→5. `renderRichSections(maxSections?)` et `renderPageV3(styleId, data, sectionOrder)` cohérents Task 5/6.
- **Hors-scope confirmé :** labels FR résiduels = ticket i18n séparé (déjà en cours).
