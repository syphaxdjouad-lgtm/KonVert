# KONVERT — Chantier A : Sections riches DTC premium

**Date** : 2026-05-23
**Statut** : Design validé en brainstorming, en attente d'écriture du plan d'implémentation
**Owners** : OBITO (design), ANNA (code), KONAN (QA)
**Lié à** : Chantier B (multi-images) et Chantier C (éditeur) — specs séparés

---

## 1. Contexte

### Constat utilisateur (23 mai 2026)
> « D'un point de vue e-commerçant je trouve que les résultats manquent encore, en gros c'est claqué au sol. En bas je voudrais avoir plus de sections pour présenter le produit mieux. »

### Diagnostic technique
1. Le LLM (DeepSeek) génère **19 sections potentielles** dans `LandingPageData`
   (cf. `src/types/index.ts` lignes 86-234).
2. Seules **6 sections** sont rendues par `src/lib/templates/sections.ts` :
   `story`, `social_proof_bar`, `testimonials`, `comparison`, `bonuses`, `guarantee`.
3. Les **13 sections orphelines** ne sont jamais affichées :
   `hero_badges`, `target_audience`, `unique_mechanism`, `features`, `how_it_works`,
   `before_after`, `competitor_comparison`, `press_mentions`, `founder_note`,
   `risk_reversal`, `value_stack`, `objections`, `community_callout`, `final_pitch`.
4. Le pattern d'insertion est strictement identique dans les **41 templates `etec-*`**
   (6 imports + 6 appels, lignes ~216-226 en moyenne).
5. La qualité visuelle des 6 renderers existants est basique (emojis, cards plates,
   peu de hiérarchie typo) → ne correspond pas au standard DTC premium 2026.

### Scope du chantier A
- Câbler les 13 sections orphelines dans `sections.ts`.
- Refondre les 6 existantes au niveau visuel premium.
- Refactorer les 41 templates pour appeler une fonction unique `renderRichSections`.
- Ajouter un feature flag pour rollback rapide.

### Hors scope (chantiers séparés)
- **Chantier B** : exploitation multi-images (galerie produit, thumbnails).
- **Chantier C** : enrichissement de l'éditeur GrapesJS (panels, bibliothèque blocks).
- **Future** : adaptation per-template de l'ordre via `order?` — disponible dès la
  livraison mais non câblée template par template.
- **Future** : micro-interactions / animations au scroll.

---

## 2. Décisions validées en brainstorming

| # | Question | Décision |
|---|----------|----------|
| Q1 | Portée des sections à câbler | **A1** — toutes les 13 sections d'un coup |
| Q2 | Stratégie d'insertion dans les 41 templates | **A1-γ** — fonction `renderRichSections` + override `order?` optionnel |
| Q3 | Ordre canonique des 19 sections | Validé tel quel (cf. table § 3.2) |
| Q4 | Comportement si data absente | **A-skip** — return `''` silencieux |
| Q5 | Niveau de qualité visuelle | **A-V2** — premium DTC + refonte des 6 existantes |
| — | Approche d'exécution | **1** — OBITO design → ANNA code → KONAN QA |
| — | Feature flag rollback | **Oui** — `KONVERT_RICH_SECTIONS=true|false` |

---

## 3. Architecture

### 3.1 Fichiers touchés

```
src/lib/templates/
├── sections.ts          ← ÉTENDU (passe de ~210 à ~600 lignes)
│   ├── 6 renderers EXISTANTS    → refondus au niveau premium (V2)
│   ├── 13 renderers NOUVEAUX    → ajoutés
│   ├── DEFAULT_ORDER            → tableau des 19 SectionKey
│   ├── SECTION_RENDERERS map    → SectionKey → fn
│   └── renderRichSections(data, theme, order?) → string
│
├── etec-blue.ts          ← REFACTORÉ (6 appels → 1 appel)
├── etec-noir.ts          ← idem
├── ... 39 autres .ts     ← idem (41 total)
└── index.ts              ← INCHANGÉ
```

### 3.2 Ordre canonique (DEFAULT_ORDER)

Ordre psychologique e-com DTC : autorité → émotion → identification → preuve →
différenciation → social proof → réassurance → CTA final.

`hero_badges` reste dans le hero du template (pas dans `renderRichSections`).

| # | SectionKey | Pourquoi à cette place |
|---|------------|------------------------|
| 1 | `social_proof_bar` | Chiffres clés tôt → autorité instantanée après hero |
| 2 | `story` | Accroche émotionnelle problème → solution (PAS) |
| 3 | `target_audience` | « C'est pour toi » → identification |
| 4 | `features` | Caractéristiques tangibles avec icônes |
| 5 | `unique_mechanism` | Différenciation : pourquoi ce produit |
| 6 | `how_it_works` | Désamorce « comment ça marche en pratique » |
| 7 | `before_after` | Preuve visuelle de transformation |
| 8 | `comparison` | Cadre d'opposition sans / avec |
| 9 | `competitor_comparison` | Vs concurrents → positionnement |
| 10 | `testimonials` | Preuve sociale détaillée |
| 11 | `press_mentions` | Autorité externe (médias / certifs) |
| 12 | `founder_note` | Humanise la marque |
| 13 | `value_stack` | Ancrage prix avant la garantie |
| 14 | `bonuses` | Valeur perçue ++ |
| 15 | `guarantee` | Risk reversal principal |
| 16 | `risk_reversal` | Triple réassurance livraison / retour / support |
| 17 | `objections` | Lève les derniers freins |
| 18 | `community_callout` | Invitation IG / TikTok |
| 19 | `final_pitch` | Push final avant dernier CTA |

### 3.3 API publique

```ts
// src/lib/templates/sections.ts

export type SectionKey =
  | 'social_proof_bar' | 'story' | 'target_audience' | 'features'
  | 'unique_mechanism' | 'how_it_works' | 'before_after' | 'comparison'
  | 'competitor_comparison' | 'testimonials' | 'press_mentions'
  | 'founder_note' | 'value_stack' | 'bonuses' | 'guarantee'
  | 'risk_reversal' | 'objections' | 'community_callout' | 'final_pitch'

export const DEFAULT_ORDER: SectionKey[] = [/* table 3.2 */]

export interface SectionTheme {
  primary: string; accent: string; text: string; textMuted: string;
  bg: string; bgAlt: string; border: string; fontFamily: string; radius: string;
}

export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[]
): string
```

### 3.4 Data flow

```
DeepSeek → LandingPageData (19 champs potentiels)
            ↓
renderTemplate('etec-blue', data)
            ↓
templateEtecBlue(data) construit son HTML :
    <hero>…</hero>
    <benefits>…</benefits>
    ${renderRichSections(data, BLUE_THEME)}   ← 1 ligne, 19 sections derrière
    <faq>…</faq>
    <footer>…</footer>
            ↓
renderRichSections : join('') des renderers non-vides
```

### 3.5 Comportement skip (A-skip)

- Chaque renderer retourne `''` si sa data est absente / vide / partielle.
- `renderRichSections` join sans filtre supplémentaire — naturel.
- Clé inconnue dans `order?` → skip silencieux (pas d'exception).
- Aucun fallback générique — assumé.

### 3.6 Feature flag

```ts
// src/lib/templates/sections.ts (en tête de renderRichSections)
if (process.env.KONVERT_RICH_SECTIONS === 'false') {
  return ''  // rollback complet = comportement état pré-chantier-A
}
```

Variable Vercel à provisionner : `KONVERT_RICH_SECTIONS=true` en prod par défaut.
En cas de régression critique, `vercel env set KONVERT_RICH_SECTIONS false`
sans rebuild → retour à un état proche de l'actuel (avec les 41 templates
refactorés qui ne contiennent plus que l'appel unique, donc on perd aussi les
6 anciennes sections — c'est accepté car un rollback aussi grossier est un cas
de secours, pas une opération courante).

---

## 4. Contrat OBITO (Phase 1 — design)

### Mission
Designer **19 sections HTML inline** pour landing pages produit DTC premium
(niveau Glossier / Mejuri / Ridge / Allbirds / Sézane), à intégrer dans
`src/lib/templates/sections.ts`.

### Contraintes techniques (non-négociables)

- Output = 19 fonctions TypeScript, signature identique aux 6 existantes :
  `(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string`
- HTML inline styles uniquement
  (cohérent avec l'archi templates — **pas de Tailwind, pas de CSS externe**)
- Theming via `SectionTheme` uniquement (`primary`, `accent`, `text`,
  `textMuted`, `bg`, `bgAlt`, `border`, `fontFamily`, `radius`).
  **Aucune couleur hardcodée** sauf `danger red` (#DC2626) et `success green`
  (#059669) dans `comparison` et `competitor_comparison`.
- Mobile responsive via media queries inline (breakpoint 768px, single column).
- Pas de JavaScript (sauf accordéons `objections` → pattern `onclick` inline
  comme la FAQ existante).
- Si data absente → `return ''`.

### Design system imposé

- **Icônes** : SVG inline custom (24×24, stroke-width:1.5). **Pas d'emoji comme
  icône principale**. Emojis tolérés uniquement dans badges contextuels
  (« ✨ Nouveau », « 🔥 Top vente »).
- **Typo** : H2 32-34px / weight 800, body 15-17px / weight 400, small 11-13px /
  weight 600-700 uppercase letterspacing 0.08-0.12em.
- **Spacing** : `padding:80px 24px` desktop, `padding:60px 20px` mobile.
- **Border-radius** : `theme.radius` (12-16px).
- **Rythme** : alterner `theme.bg` / `theme.bgAlt` entre sections successives
  dans `DEFAULT_ORDER` pour éviter le mur visuel.

### Spec des 19 sections

| # | Section | Data input | Layout type |
|---|---------|------------|-------------|
| 1 | `social_proof_bar` | 3 chiffres (customers/rating/sold) | Bandeau horizontal 3 colonnes |
| 2 | `story` | problem/agitation/solution/transformation | Timeline verticale icônes SVG |
| 3 | `target_audience` | 3 profils + pain | Grid 3 cards |
| 4 | `features` | 6 features (icon/title/desc) | Grid 3×2 |
| 5 | `unique_mechanism` | name/desc/proof | Section split texte + visuel |
| 6 | `how_it_works` | 4 étapes (step/title/desc) | Timeline horizontale numérotée |
| 7 | `before_after` | array before/after | Slider 2 colonnes |
| 8 | `comparison` | sans/avec arrays | 2 colonnes opposées |
| 9 | `competitor_comparison` | nous vs concurrents | Table comparative scrollable |
| 10 | `testimonials` | 3 reviews (name/rating/text/variant) | Grid 3 cards |
| 11 | `press_mentions` | array logos/noms | Bandeau monochrome 5-6 logos |
| 12 | `founder_note` | name/role/message | Split photo + citation |
| 13 | `value_stack` | items/total/you_pay/savings | Table valeur barrée + prix |
| 14 | `bonuses` | array (title/description/value) | Cards listées ribbon « OFFERT » |
| 15 | `guarantee` | title/description/duration | Section centrale focus shield |
| 16 | `risk_reversal` | 3 items (icon/title/desc) | Grid 3 cards livraison/retour/support |
| 17 | `objections` | 5 (objection/response) | Accordéon |
| 18 | `community_callout` | title/desc/cta | Banner CTA réseaux sociaux |
| 19 | `final_pitch` | string | Paragraphe central + CTA bouton |

### Livrable attendu

- Fichier `src/lib/templates/sections.premium.draft.ts` avec :
  - Les 19 fonctions complètes (les 13 nouvelles + les 6 V2 refondues).
  - Compile en TS strict.
  - Toutes les fns retournent `''` si data absente.
  - Commentaires d'intent minimaux (1 ligne par section max).

### Anti-patterns interdits

- Emojis comme icônes principales.
- Gradients flashy multi-color.
- Hard-coded colors (sauf danger/success indiqués).
- Lorem ipsum / contenu placeholder.
- Layout non-responsive.

---

## 5. Refactor des 41 templates (Phase 2 — ANNA)

### Pattern de transformation

**AVANT** (12 lignes par template) :
```ts
import {
  renderStorySection, renderSocialProofBar, renderTestimonialsSection,
  renderComparisonSection, renderBonusesSection, renderGuaranteeSection,
  type SectionTheme,
} from './sections'

// ... dans le HTML, position courante ...
${renderSocialProofBar(data, THEME_NAME)}
${renderStorySection(data, THEME_NAME)}
${renderComparisonSection(data, THEME_NAME)}
${renderTestimonialsSection(data, THEME_NAME)}
${renderBonusesSection(data, THEME_NAME)}
${renderGuaranteeSection(data, THEME_NAME)}
```

**APRÈS** (1 import + 1 appel) :
```ts
import { renderRichSections, type SectionTheme } from './sections'

// ... dans le HTML, même position ...
${renderRichSections(data, THEME_NAME)}
```

### Stratégie d'exécution

ANNA écrit `scripts/refactor-templates-rich-sections.ts` :

1. Glob `src/lib/templates/etec-*.ts` (41 fichiers).
2. Pour chaque fichier :
   - Remplace le bloc d'imports (regex sur les 6 imports nommés).
   - Remplace le bloc des 6 appels par `${renderRichSections(data, THEME_NAME)}`
     (regex sur les 6 lignes consécutives, conserve la position).
3. Mode `--dry-run` par défaut, log les diffs.
4. Mode `--apply` pour write.

Procédure :
- ANNA lance `--dry-run`, review 3 templates aléatoires (sortie diff).
- Si OK → `--apply` + commit en 1 batch.

### Backward compatibility

`sections.ts` conserve les 6 anciennes fns exportées (alias vers les versions V2) :

```ts
export const renderStorySection      = renderStoryV2
export const renderSocialProofBar    = renderSocialProofBarV2
export const renderTestimonialsSection = renderTestimonialsV2
export const renderComparisonSection = renderComparisonV2
export const renderBonusesSection    = renderBonusesV2
export const renderGuaranteeSection  = renderGuaranteeV2
```

Coût : ~6 lignes. Bénéfice : aucun risque pour du code externe éventuel.

---

## 6. QA & validation (Phase 3 — KONAN + ANNA)

### Vitest unit (ANNA)

Fichier `src/lib/templates/__tests__/sections.test.ts` :

- `renderRichSections({} as LandingPageData, DEFAULT_THEME)` → `''`
- `renderRichSections({...mockMinimal, story: {...}}, DEFAULT_THEME)` → contient
  uniquement le HTML de `story`.
- `renderRichSections(mockFull, theme, ['features', 'story'])` → respecte
  l'ordre custom (features avant story dans la sortie).
- `renderRichSections(mockFull, theme, ['UNKNOWN_KEY' as any])` → `''`.
- Pour chacun des 19 renderers : test avec data full + data empty.
- `renderRichSections` quand `process.env.KONVERT_RICH_SECTIONS === 'false'`
  → `''` (test du feature flag).

### Playwright E2E (KONAN)

Fichier `e2e/sections-rich.spec.ts` :

- 2 fixtures : `mockDataFull.ts` (19 sections remplies) + `mockDataPartial.ts`
  (50 % des sections absentes).
- 5 templates représentatifs : `etec-blue`, `etec-noir`, `etec-rose`,
  `etec-luxe`, `etec-energy`.
- Pour chaque (5 × 2 = 10 cas) :
  - Render via la route preview, screenshot desktop (1440px) + mobile (390px).
  - Assert : aucune section vide rendue dans le DOM.
  - Assert : ordre des sections respecté (sélecteurs par section + asserts
    `expect.toBeBefore`).
- Visual diff : screenshot avant refactor (git stash) vs après → review humaine
  sur les 10 captures.

### Smoke prod-like (KONAN)

- Génération end-to-end d'une page sur un produit Shopify de test (route
  `/api/generate`).
- Vérifier que le HTML produit :
  - Taille raisonnable (< 500 ko).
  - Pas de `undefined`, `null`, `NaN`, `[object Object]`.
  - Balisage propre (HTML valide via validator).

### Gate de merge

- ✅ Vitest vert
- ✅ Playwright vert
- ✅ Review humaine des 10 captures visuelles OK
- ✅ Smoke prod-like OK
- ✅ ANNA review du refactor des 41 templates (3 aléatoires + 5 testés en E2E)

---

## 7. Rollback plan

| Cas | Action |
|-----|--------|
| OBITO livre un design en-dessous des attentes après 1 retour | Garder les 6 sections V1 + câbler les 13 nouvelles au niveau V1. Quality dégradée mais delivery. |
| Script de refactor casse 1+ template en dry-run | Fix script avant `--apply`. |
| Script de refactor casse en `--apply` | `git checkout HEAD~1 -- src/lib/templates/etec-*.ts` puis fix manuel. |
| Vitest fail en review | Fix avant merge ; pas de merge si rouge. |
| Régression visible en prod | `vercel env set KONVERT_RICH_SECTIONS false` → rollback sans rebuild. |

---

## 8. Estimation

- **OBITO design** : ~4-6h (1 prompt structuré bien briefé)
- **ANNA implémentation** :
  - Merge livrable OBITO dans `sections.ts` : ~2h
  - Script refactor + exécution : ~2h
  - Vitest : ~2h
  - Total : ~6h
- **KONAN QA** :
  - Fixtures mock : ~1h
  - Playwright E2E : ~3h
  - Smoke + review captures : ~1h
  - Total : ~5h

Total : **~15-17h de travail effectif**, étalé sur 2-3 jours calendaires
(parallélisation OBITO ⇄ KONAN ⇄ ANNA).
