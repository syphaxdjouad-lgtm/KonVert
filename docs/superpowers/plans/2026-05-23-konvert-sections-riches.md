# KONVERT — Chantier A : Sections riches DTC premium — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Câbler les 13 sections orphelines du LLM dans les 41 templates KONVERT via une fonction unique `renderRichSections`, refondre les 6 sections existantes au niveau visuel DTC premium, et déployer derrière un feature flag avec QA Playwright.

**Architecture:** Une seule fonction `renderRichSections(data, theme, order?)` rend les 19 sections dans un ordre canonique en skippant celles dont la data est absente. Chaque template appelle cette fonction unique à la place des 6 appels individuels actuels. Pipeline d'exécution OBITO (design) → ANNA (code) → KONAN (QA).

**Tech Stack:** TypeScript strict, Vitest (unit), Playwright (E2E), GrapesJS-rendered HTML inline styles, feature flag via `process.env`, Next.js 14 App Router.

**Spec source:** `docs/superpowers/specs/2026-05-23-konvert-sections-riches-design.md`

---

## File Structure (vue d'ensemble)

```
konvert/
├── src/lib/templates/
│   ├── sections.ts                              [MODIFY] ~210 → ~600 lignes
│   ├── sections.premium.draft.ts                [CREATE puis DELETE] livrable OBITO temporaire
│   ├── __tests__/
│   │   └── sections.test.ts                     [CREATE] tests Vitest unit
│   ├── __fixtures__/
│   │   ├── mock-landing-data-full.ts            [CREATE] data avec les 19 sections remplies
│   │   └── mock-landing-data-partial.ts         [CREATE] data avec 50% sections absentes
│   ├── etec-blue.ts ... etec-boost.ts           [MODIFY] 41 fichiers, refactor des appels
│   └── index.ts                                 [INCHANGÉ]
├── scripts/
│   └── refactor-templates-rich-sections.ts      [CREATE] script de refactor scripté
├── e2e/
│   ├── sections-rich.spec.ts                    [CREATE] tests Playwright E2E
│   └── fixtures/
│       └── preview-route.ts                     [CREATE] helper pour render preview
├── docs/superpowers/plans/
│   └── 2026-05-23-konvert-sections-riches.md    [CE FICHIER]
└── .env.local                                   [MODIFY] ajouter KONVERT_RICH_SECTIONS=true
```

**Responsabilités par fichier :**

- `sections.ts` — types `SectionKey`, `SectionTheme`, `DEFAULT_THEME`, `DEFAULT_ORDER`, les 19 renderers V2, la map `SECTION_RENDERERS`, la fonction `renderRichSections`, et les aliases backward-compat.
- `sections.test.ts` — couverture unit de `renderRichSections` + chaque renderer en data full / data empty + feature flag.
- `mock-landing-data-*.ts` — fixtures réutilisables par les tests Vitest **et** Playwright.
- `etec-*.ts` — chaque template appelle `renderRichSections(data, THEME_NAME)` à la place des 6 appels actuels.
- `refactor-templates-rich-sections.ts` — script Node CLI avec modes `--dry-run` et `--apply` pour automatiser la migration des 41 templates.
- `sections-rich.spec.ts` — vérifie le rendu réel sur 5 templates types × 2 viewports × 2 fixtures.

---

## Convention de commit

Préfixes utilisés dans ce plan (cohérents avec l'historique git existant) :

- `feat(sections):` pour ajout fonctionnel dans `sections.ts`
- `feat(templates):` pour le refactor des 41 templates
- `test(sections):` pour les tests Vitest
- `test(e2e):` pour Playwright
- `chore(scripts):` pour les scripts CLI utilitaires
- `chore(env):` pour les variables d'environnement
- `docs(spec):` pour les docs

---

### Task 0 : Setup branche feature

**Files:**
- N/A (opération git)

- [ ] **Step 1 : Vérifier état courant sur main**

Run :
```bash
cd /Users/mac/nexara/konvert && git status && git log --oneline -3
```
Expected : working tree clean ou les modifs non-liées à ce chantier (sitemap, marketing) → on les laisse de côté, on travaille sur une branche dédiée.

- [ ] **Step 2 : Créer la branche feature**

Run :
```bash
cd /Users/mac/nexara/konvert && git checkout -b feat/sections-riches-dtc
```
Expected : `Switched to a new branch 'feat/sections-riches-dtc'`

- [ ] **Step 3 : Vérifier que la branche est créée**

Run :
```bash
git branch --show-current
```
Expected : `feat/sections-riches-dtc`

---

### Task 1 : Dispatch OBITO — design des 19 sections premium

**Files:**
- Create: `src/lib/templates/sections.premium.draft.ts` (généré par OBITO)

**Note importante :** Cette tâche ne contient pas de code à écrire à la main. Elle consiste à dispatcher l'agent OBITO avec un brief précis (issu du spec § 4) et à intégrer son livrable comme fichier draft. Le code réel sera écrit par les tâches suivantes en mergeant le draft.

- [ ] **Step 1 : Dispatcher OBITO via le tool Agent**

Utiliser l'outil `Agent` avec `subagent_type: "obito"` et le prompt exact du contrat OBITO (spec § 4). Le prompt doit inclure :
- Mission : 19 sections HTML inline DTC premium niveau Glossier/Mejuri/Ridge
- Contraintes techniques (HTML inline, theming `SectionTheme`, mobile responsive, pas de JS sauf objections)
- Design system imposé (SVG inline, typo scale, spacing, rythme bg/bgAlt)
- Spec des 19 sections (table 4.3 du spec)
- Format de livrable : fichier `src/lib/templates/sections.premium.draft.ts` avec 19 fonctions complètes
- Anti-patterns interdits

Prompt à envoyer (en français, OBITO parle français) :

```
Tu reçois un livrable issu d'un spec validé.

Source : /Users/mac/nexara/konvert/docs/superpowers/specs/2026-05-23-konvert-sections-riches-design.md
À lire en priorité : sections 3, 4, et 5.

MISSION
Designer 19 sections HTML inline pour les landing pages produit DTC premium de
KONVERT, au niveau visuel Glossier / Mejuri / Ridge / Allbirds / Sézane. Le
livrable doit s'intégrer dans src/lib/templates/sections.ts existant.

CONTRAINTES (non-négociables, cf. spec § 4)
- Signature obligatoire de chaque fn :
  (d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string
- HTML inline styles uniquement, pas de Tailwind, pas de CSS externe
- Theming via SectionTheme (primary, accent, text, textMuted, bg, bgAlt,
  border, fontFamily, radius). Aucune couleur hardcodée sauf danger #DC2626
  et success #059669 dans comparison et competitor_comparison.
- Mobile responsive via media queries inline (breakpoint 768px → single col)
- Pas de JS sauf accordéon de la section objections (onclick inline comme
  la FAQ existante de etec-blue.ts)
- Si data absente → return ''

DESIGN SYSTEM IMPOSÉ
- Icônes : SVG inline 24x24 stroke-width:1.5. PAS d'emoji comme icône
  principale. Emojis tolérés uniquement dans badges contextuels.
- Typo : H2 32-34px weight 800 ; body 15-17px weight 400 ; small 11-13px
  weight 600-700 uppercase letterspacing 0.08-0.12em
- Spacing : padding:80px 24px desktop, padding:60px 20px mobile
- Border-radius : theme.radius (12-16px)
- Rythme : alterner theme.bg / theme.bgAlt entre sections successives

19 SECTIONS À PRODUIRE

V2 (refonte des 6 existantes) :
1. renderSocialProofBarV2(d, t) — bandeau horizontal 3 chiffres clés
   data : d.social_proof.{customers, rating, sold}
2. renderStoryV2(d, t) — timeline verticale PAS avec icônes SVG
   data : d.story.{problem, agitation, solution, transformation}
3. renderTestimonialsV2(d, t) — grid 3 cards reviews
   data : d.testimonials[] {name, rating, text, variant?}
4. renderComparisonV2(d, t) — 2 colonnes opposées sans/avec
   data : d.comparison.{without_title, without[], with_title, with[]}
5. renderBonusesV2(d, t) — cards listées avec ribbon "OFFERT"
   data : d.bonuses[] {title, description, value}
6. renderGuaranteeV2(d, t) — section centrale focus shield SVG
   data : d.guarantee.{title, description, duration}

13 nouvelles :
7. renderTargetAudience(d, t) — grid 3 cards profils ICP
   data : d.target_audience[] {profile, pain}
8. renderFeatures(d, t) — grid 3x2 avec icônes SVG
   data : d.features[] {icon, title, description}
9. renderUniqueMechanism(d, t) — section split texte + visuel
   data : d.unique_mechanism.{name, description, proof}
10. renderHowItWorks(d, t) — timeline horizontale numérotée 4 étapes
    data : d.how_it_works[] {step, title, description}
11. renderBeforeAfter(d, t) — slider 2 colonnes
    data : d.before_after[] {before, after}
12. renderCompetitorComparison(d, t) — table comparative scrollable
    data : d.competitor_comparison.{criteria[], us, them[]}
13. renderPressMentions(d, t) — bandeau monochrome 5-6 logos textuels
    data : d.press_mentions[]
14. renderFounderNote(d, t) — split photo + citation
    data : d.founder_note.{name, role, message}
15. renderValueStack(d, t) — table valeur barrée + prix final
    data : d.value_stack.{items[], total, you_pay, savings}
16. renderRiskReversal(d, t) — grid 3 cards livraison/retour/support
    data : d.risk_reversal[] {icon, title, description}
17. renderObjections(d, t) — accordéon 5 entrées (JS onclick inline)
    data : d.objections[] {objection, response}
18. renderCommunityCallout(d, t) — banner CTA réseaux sociaux
    data : d.community_callout.{title, description, cta}
19. renderFinalPitch(d, t) — paragraphe central + CTA bouton
    data : d.final_pitch (string)

CONTRAINTES SUR CHAQUE FONCTION
- Si la donnée d'entrée est undefined/null/array vide → return ''
- Aucun JS inline sauf objections (accordéon onclick comme la FAQ etec-blue)
- Utilise t.primary/accent/text/textMuted/bg/bgAlt/border/fontFamily/radius
- Couleurs hardcodées autorisées UNIQUEMENT : #DC2626 (danger), #059669 (success)
  → uniquement dans renderComparisonV2 et renderCompetitorComparison
- Mobile breakpoint 768px (media query inline → flex-direction:column ou grid-template-columns:1fr)

LIVRABLE ATTENDU
- Fichier src/lib/templates/sections.premium.draft.ts
- 19 fonctions : 13 nouvelles + 6 V2 refondues (renderStoryV2,
  renderSocialProofBarV2, renderTestimonialsV2, renderComparisonV2,
  renderBonusesV2, renderGuaranteeV2)
- Compile en TS strict
- Toutes retournent '' si data absente
- Commentaires d'intent minimaux (1 ligne max par section)

ANTI-PATTERNS INTERDITS
- Emojis comme icônes principales
- Gradients flashy multi-color
- Hard-coded colors (sauf danger/success indiqués)
- Lorem ipsum
- Layout non-responsive

LECTURE DE CONTEXTE OBLIGATOIRE
Lire avant d'écrire :
- src/lib/templates/sections.ts (pattern actuel des 6 fns existantes)
- src/lib/templates/etec-blue.ts (pour voir comment le HTML inline marche)
- src/types/index.ts ligne 86-234 (structure de LandingPageData)

RAPPEL : feedback_design_no_black — JAMAIS de noir/quasi-noir en fond
général. Les fonds sont theme.bg / theme.bgAlt qui sont light par défaut.
Le noir est réservé au texte et aux templates dark.
```

- [ ] **Step 2 : Vérifier le livrable**

Lire le fichier `src/lib/templates/sections.premium.draft.ts` créé par OBITO. Checks :
- 19 fonctions exportées (`renderStoryV2`, `renderSocialProofBarV2`, `renderTestimonialsV2`, `renderComparisonV2`, `renderBonusesV2`, `renderGuaranteeV2`, et 13 nouvelles : `renderTargetAudience`, `renderFeatures`, `renderUniqueMechanism`, `renderHowItWorks`, `renderBeforeAfter`, `renderCompetitorComparison`, `renderPressMentions`, `renderFounderNote`, `renderValueStack`, `renderRiskReversal`, `renderObjections`, `renderCommunityCallout`, `renderFinalPitch`)
- Chaque fonction retourne `''` si sa data est absente (vérifier au moins 3 fonctions visuellement)
- Aucune couleur hardcodée hors danger/success (grep `#[0-9a-fA-F]{3,6}` doit ne matcher que `#DC2626`, `#059669`, ou des couleurs utilisées comme variables theme)
- Compile TS : `npx tsc --noEmit src/lib/templates/sections.premium.draft.ts`

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "sections.premium.draft|error" | head -20
```
Expected : 0 erreur TS sur ce fichier.

- [ ] **Step 3 : Si OBITO a livré du moche → fallback**

Si la review du livrable montre que la qualité visuelle est en-dessous du brief (emojis comme icônes principales, hardcoded colors partout, layouts non responsive), invoquer le rollback du spec § 7 : conserver les 6 V1 + câbler les 13 nouvelles au niveau V1 (basique). Sinon, continuer.

- [ ] **Step 4 : Commit le draft**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.premium.draft.ts
git commit -m "feat(sections): livrable OBITO — 19 sections premium DTC (draft)"
```

---

### Task 2 : Types SectionKey + DEFAULT_ORDER (TDD)

**Files:**
- Modify: `src/lib/templates/sections.ts` (ajout en début de fichier)
- Create: `src/lib/templates/__tests__/sections.test.ts`

- [ ] **Step 1 : Écrire le test pour `DEFAULT_ORDER`**

Créer le fichier `src/lib/templates/__tests__/sections.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { DEFAULT_ORDER, type SectionKey } from '../sections'

describe('DEFAULT_ORDER', () => {
  it('contient exactement 19 sections', () => {
    expect(DEFAULT_ORDER).toHaveLength(19)
  })

  it('contient toutes les SectionKey attendues dans le bon ordre', () => {
    expect(DEFAULT_ORDER).toEqual([
      'social_proof_bar',
      'story',
      'target_audience',
      'features',
      'unique_mechanism',
      'how_it_works',
      'before_after',
      'comparison',
      'competitor_comparison',
      'testimonials',
      'press_mentions',
      'founder_note',
      'value_stack',
      'bonuses',
      'guarantee',
      'risk_reversal',
      'objections',
      'community_callout',
      'final_pitch',
    ] satisfies SectionKey[])
  })

  it('ne contient pas de hero_badges (qui reste dans le hero du template)', () => {
    expect(DEFAULT_ORDER).not.toContain('hero_badges' as SectionKey)
  })

  it('ne contient pas de doublon', () => {
    expect(new Set(DEFAULT_ORDER).size).toBe(DEFAULT_ORDER.length)
  })
})
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -20
```
Expected : FAIL avec message du genre `"DEFAULT_ORDER" is not exported by "sections.ts"` ou `Cannot find module`.

- [ ] **Step 3 : Ajouter `SectionKey` et `DEFAULT_ORDER` dans `sections.ts`**

Ouvrir `src/lib/templates/sections.ts`. **Avant** la ligne `export interface SectionTheme` (ligne 11), insérer :

```ts
// ─── Section keys & ordre canonique ──────────────────────────────────────────
// Liste exhaustive des sections rendues par renderRichSections, dans l'ordre
// psychologique e-com DTC validé en brainstorming (spec § 3.2).
// `hero_badges` n'est PAS dans cette liste — il reste dans le hero du template.

export type SectionKey =
  | 'social_proof_bar'
  | 'story'
  | 'target_audience'
  | 'features'
  | 'unique_mechanism'
  | 'how_it_works'
  | 'before_after'
  | 'comparison'
  | 'competitor_comparison'
  | 'testimonials'
  | 'press_mentions'
  | 'founder_note'
  | 'value_stack'
  | 'bonuses'
  | 'guarantee'
  | 'risk_reversal'
  | 'objections'
  | 'community_callout'
  | 'final_pitch'

export const DEFAULT_ORDER: SectionKey[] = [
  'social_proof_bar',
  'story',
  'target_audience',
  'features',
  'unique_mechanism',
  'how_it_works',
  'before_after',
  'comparison',
  'competitor_comparison',
  'testimonials',
  'press_mentions',
  'founder_note',
  'value_stack',
  'bonuses',
  'guarantee',
  'risk_reversal',
  'objections',
  'community_callout',
  'final_pitch',
]

```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -15
```
Expected : 4 tests PASS sur `DEFAULT_ORDER`.

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/sections.test.ts
git commit -m "feat(sections): SectionKey type + DEFAULT_ORDER 19 sections (TDD)"
```

---

### Task 3 : Migrer les 19 renderers OBITO dans `sections.ts`

**Files:**
- Modify: `src/lib/templates/sections.ts` (ajout des 19 fonctions)
- Delete: `src/lib/templates/sections.premium.draft.ts` (consommé)

- [ ] **Step 1 : Copier les 19 fonctions du draft vers sections.ts**

Le draft OBITO contient 19 fonctions (6 V2 + 13 nouvelles). Les copier dans `src/lib/templates/sections.ts`, **après** les 6 fonctions V1 existantes (qui finissent ligne 206) et **avant** la fin du fichier.

Les 19 fonctions doivent être exportées avec ces noms exacts :
- `renderStoryV2` (refonte de renderStorySection)
- `renderSocialProofBarV2` (refonte de renderSocialProofBar)
- `renderTestimonialsV2` (refonte de renderTestimonialsSection)
- `renderComparisonV2` (refonte de renderComparisonSection)
- `renderBonusesV2` (refonte de renderBonusesSection)
- `renderGuaranteeV2` (refonte de renderGuaranteeSection)
- `renderTargetAudience`
- `renderFeatures`
- `renderUniqueMechanism`
- `renderHowItWorks`
- `renderBeforeAfter`
- `renderCompetitorComparison`
- `renderPressMentions`
- `renderFounderNote`
- `renderValueStack`
- `renderRiskReversal`
- `renderObjections`
- `renderCommunityCallout`
- `renderFinalPitch`

- [ ] **Step 2 : Vérifier la compilation TypeScript**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep -E "sections\.ts|error" | head -20
```
Expected : 0 erreur sur `sections.ts`.

- [ ] **Step 3 : Vérifier que les 19 fonctions sont exportées**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -E "^export function render(StoryV2|SocialProofBarV2|TestimonialsV2|ComparisonV2|BonusesV2|GuaranteeV2|TargetAudience|Features|UniqueMechanism|HowItWorks|BeforeAfter|CompetitorComparison|PressMentions|FounderNote|ValueStack|RiskReversal|Objections|CommunityCallout|FinalPitch)" src/lib/templates/sections.ts | wc -l
```
Expected : `19`

- [ ] **Step 4 : Supprimer le draft**

Run :
```bash
cd /Users/mac/nexara/konvert && rm src/lib/templates/sections.premium.draft.ts
```

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/sections.premium.draft.ts
git commit -m "feat(sections): intégrer les 19 renderers OBITO dans sections.ts"
```

---

### Task 4 : Fixtures mock pour les tests

**Files:**
- Create: `src/lib/templates/__fixtures__/mock-landing-data-full.ts`
- Create: `src/lib/templates/__fixtures__/mock-landing-data-partial.ts`

- [ ] **Step 1 : Créer la fixture "data complète"**

Créer `src/lib/templates/__fixtures__/mock-landing-data-full.ts` :

```ts
import type { LandingPageData } from '@/types'

// Fixture utilisée par les tests Vitest et Playwright — les 19 sections
// (hors hero_badges qui reste dans le hero) sont remplies avec des données
// réalistes pour tester le rendu nominal complet.

export const mockLandingDataFull: LandingPageData = {
  headline: 'Le sérum qui transforme votre peau en 14 jours',
  subtitle: 'Concentré botanique haute performance, certifié Cosmos Organic',
  benefits: [
    'Réduit les rides visibles de 32%',
    'Hydratation longue durée 24h',
    'Texture légère non grasse',
    'Sans parfum ni perturbateurs',
    '100% origine naturelle',
  ],
  faq: [
    { question: 'Convient-il aux peaux sensibles ?', answer: 'Oui, testé dermatologiquement.' },
    { question: 'Quel délai de livraison ?', answer: '48h en France, 5j en Europe.' },
  ],
  cta: 'Commander maintenant',
  urgency: 'Stock limité — plus que 23 unités',
  product_name: 'Sérum Renaissance',
  price: '49',
  original_price: '79',
  images: [
    'https://cdn.shopify.com/serum-1.jpg',
    'https://cdn.shopify.com/serum-2.jpg',
    'https://cdn.shopify.com/serum-3.jpg',
    'https://cdn.shopify.com/serum-4.jpg',
  ],
  language: 'fr',

  hero_badges: ['Cosmos Organic', 'Made in France', 'Cruelty free'],

  story: {
    problem: 'Votre peau perd 1% de collagène par an après 25 ans',
    agitation: 'Les crèmes classiques effleurent la surface sans rien réparer en profondeur',
    solution: 'Un complexe peptide+vitamine C stabilisé qui stimule la production de collagène',
    transformation: 'Une peau ferme, lumineuse, qui rajeunit visiblement en quelques semaines',
  },

  target_audience: [
    { profile: 'Femme 30-45 ans active', pain: 'Premiers signes du temps malgré une bonne hygiène' },
    { profile: 'Peau mixte à sensible', pain: 'Difficile de trouver un soin efficace sans irriter' },
    { profile: 'Routine minimaliste', pain: 'Veut UN produit qui fait tout sans empiler 5 couches' },
  ],

  unique_mechanism: {
    name: 'Bio-Stim Complex™',
    description: 'Combinaison brevetée de peptides marins + vitamine C encapsulée libérée progressivement',
    proof: 'Étude clinique 2024 sur 87 femmes : +41% de fermeté en 28 jours',
  },

  features: [
    { icon: '🌿', title: 'Botanique', description: 'Extrait de centella asiatica + acide hyaluronique végétal' },
    { icon: '⚡', title: 'Pénétration rapide', description: 'Texture huile sèche absorbée en 30 secondes' },
    { icon: '🛡', title: 'Stable', description: 'Vitamine C protégée par capsule liposomale, ne s\'oxyde pas' },
    { icon: '💧', title: 'Hydratation 24h', description: 'Acide hyaluronique 3 poids moléculaires différents' },
    { icon: '✨', title: 'Éclat visible', description: 'Teint unifié et lumineux dès la première semaine' },
    { icon: '🌱', title: 'Clean', description: 'Sans silicones, sans parabens, sans perturbateurs endocriniens' },
  ],

  how_it_works: [
    { step: 1, title: 'Nettoyer', description: 'Sur peau propre, matin et soir' },
    { step: 2, title: 'Appliquer', description: '3-4 gouttes sur le visage et le cou' },
    { step: 3, title: 'Masser', description: 'Mouvements doux ascendants jusqu\'à pénétration' },
    { step: 4, title: 'Hydrater', description: 'Compléter avec votre crème habituelle' },
  ],

  before_after: [
    { before: 'Peau terne, rides marquées au coin des yeux', after: 'Peau lumineuse, ridules atténuées' },
    { before: 'Pores dilatés et teint irrégulier', after: 'Grain de peau affiné, teint unifié' },
  ],

  comparison: {
    without_title: 'Sans Sérum Renaissance',
    without: [
      'Rides qui se creusent année après année',
      'Peau qui tire, sensation d\'inconfort',
      'Teint terne malgré le maquillage',
      'Multiples produits empilés sans résultat',
    ],
    with_title: 'Avec Sérum Renaissance',
    with: [
      'Rides visiblement atténuées en 14 jours',
      'Peau souple et confortable du matin au soir',
      'Teint éclatant naturellement, sans fond de teint',
      'UN seul produit qui remplace 3 étapes',
    ],
  },

  competitor_comparison: {
    criteria: ['Origine naturelle', 'Étude clinique', 'Prix par cure', 'Sans parfum', 'Made in France'],
    us: { name: 'Sérum Renaissance', values: ['100%', 'Oui (87 femmes)', '49€', 'Oui', 'Oui'] },
    them: [
      { name: 'Marque A (luxe)', values: ['60%', 'Non', '180€', 'Non', 'Non'] },
      { name: 'Marque B (pharma)', values: ['40%', 'Oui', '35€', 'Oui', 'Non'] },
    ],
  },

  social_proof: { customers: '12 480 +', rating: '4,8 / 5', sold: '847 cette semaine' },

  press_mentions: ['Vogue', 'Elle', 'Marie Claire', 'Cosmopolitan', 'L\'Express Styles'],

  testimonials: [
    { name: 'Sophie L.', rating: 5, text: 'Ma peau n\'a jamais été aussi belle. Adopté pour la vie.', variant: 'Achat 30ml' },
    { name: 'Camille R.', rating: 5, text: 'Résultats visibles en 10 jours. Je recommande à toutes mes amies.', variant: 'Achat cure 3 mois' },
    { name: 'Émilie B.', rating: 4, text: 'Très bon produit, texture agréable. Effet flash dès la 1re application.', variant: 'Achat 30ml' },
  ],

  founder_note: {
    name: 'Léa Moreau',
    role: 'Fondatrice & formulatrice',
    message: 'J\'ai créé ce sérum après 8 ans en labo cosmétique : un seul soin qui fait vraiment ce qu\'il promet, sans compromis sur la naturalité.',
  },

  guarantee: { title: 'Satisfait ou remboursé', description: 'Si après 30 jours vous ne voyez aucune différence, on vous rembourse sans question.', duration: '30 jours' },

  risk_reversal: [
    { icon: '🚚', title: 'Livraison gratuite', description: 'Dès 50€ d\'achat partout en Europe' },
    { icon: '↩', title: 'Retour offert', description: '30 jours pour changer d\'avis, retour sans frais' },
    { icon: '💬', title: 'Support 7/7', description: 'Une conseillère beauté répond en moins de 2h' },
  ],

  bonuses: [
    { title: 'Mini contour des yeux', description: '15ml offert pour cibler le regard', value: '29€' },
    { title: 'Routine personnalisée', description: 'Diagnostic + protocole 4 semaines par notre formulatrice', value: '49€' },
    { title: 'Pochette signature', description: 'Pochette satin pour transporter votre sérum', value: '15€' },
  ],

  value_stack: {
    items: [
      { label: 'Sérum Renaissance 30ml', value: '79€' },
      { label: 'Mini contour des yeux', value: '29€' },
      { label: 'Routine personnalisée', value: '49€' },
      { label: 'Pochette signature', value: '15€' },
    ],
    total: '172€',
    you_pay: '49€',
    savings: '123€',
  },

  objections: [
    { objection: 'C\'est cher pour un sérum', response: 'À 49€ pour 2 mois d\'utilisation, ça revient à 0,80€/jour — moins qu\'un café.' },
    { objection: 'J\'ai déjà essayé plein de sérums sans résultat', response: 'Notre complexe Bio-Stim est breveté, étudié cliniquement sur 87 femmes : +41% de fermeté mesurés en 28 jours.' },
    { objection: 'Et si ça ne marche pas sur ma peau ?', response: '30 jours pour le tester, remboursé sans condition si vous n\'êtes pas convaincue.' },
    { objection: 'Je n\'ai pas le temps pour une routine complexe', response: 'Une seule application matin OU soir suffit — c\'est la routine la plus simple du marché.' },
    { objection: 'C\'est vraiment naturel ou c\'est du marketing ?', response: 'Certifié Cosmos Organic par Ecocert, ingrédients tracés à la source, formule publiée intégralement sur notre site.' },
  ],

  community_callout: {
    title: 'Rejoignez les 12 000 femmes de la communauté',
    description: 'Astuces beauté, rituels saisonniers, accès aux nouveautés en avant-première',
    cta: 'Suivre sur Instagram',
  },

  final_pitch: 'Votre peau le mérite. Notre sérum est conçu pour la transformer, pas pour la masquer. Commandez aujourd\'hui, recevez demain, voyez la différence dans 14 jours.',
}
```

- [ ] **Step 2 : Créer la fixture "data partielle"**

Créer `src/lib/templates/__fixtures__/mock-landing-data-partial.ts` :

```ts
import type { LandingPageData } from '@/types'

// Fixture pour tester le comportement A-skip — données partielles, 50% des
// sections enrichies absentes. Permet de vérifier que renderRichSections
// skippe silencieusement et ne génère pas de HTML vide ni de "undefined".

export const mockLandingDataPartial: LandingPageData = {
  headline: 'Le sérum qui transforme votre peau en 14 jours',
  subtitle: 'Concentré botanique haute performance',
  benefits: ['Réduit les rides', 'Hydratation 24h', 'Texture légère'],
  faq: [{ question: 'Convient peaux sensibles ?', answer: 'Oui.' }],
  cta: 'Commander',
  urgency: 'Stock limité',
  product_name: 'Sérum Renaissance',
  price: '49',
  images: ['https://cdn.shopify.com/serum-1.jpg'],
  language: 'fr',

  // Présentes : ~10 sections
  social_proof: { customers: '12 480 +', rating: '4,8 / 5', sold: '847 cette semaine' },
  story: { problem: 'Peau qui vieillit', agitation: 'Crèmes inefficaces', solution: 'Sérum Bio-Stim', transformation: 'Peau ferme' },
  features: [
    { icon: '🌿', title: 'Botanique', description: 'Centella asiatica' },
    { icon: '⚡', title: 'Pénétration rapide', description: 'Absorbé en 30s' },
  ],
  testimonials: [
    { name: 'Sophie L.', rating: 5, text: 'Adopté pour la vie.' },
  ],
  guarantee: { title: 'Satisfait ou remboursé', description: 'Retour facile', duration: '30 jours' },
  bonuses: [{ title: 'Pochette', description: 'Offerte', value: '15€' }],
  comparison: { without_title: 'Sans', without: ['Rides'], with_title: 'Avec', with: ['Peau lisse'] },

  // Absentes : target_audience, unique_mechanism, how_it_works, before_after,
  // competitor_comparison, press_mentions, founder_note, value_stack,
  // risk_reversal, objections, community_callout, final_pitch, hero_badges
}
```

- [ ] **Step 3 : Vérifier la compilation des fixtures**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep -E "__fixtures__|error" | head -10
```
Expected : 0 erreur.

- [ ] **Step 4 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/__fixtures__/
git commit -m "test(sections): fixtures mock landing data full + partial"
```

---

### Task 5 : `renderRichSections` + `SECTION_RENDERERS` (TDD)

**Files:**
- Modify: `src/lib/templates/sections.ts` (ajout map + fonction)
- Modify: `src/lib/templates/__tests__/sections.test.ts` (ajout tests)

- [ ] **Step 1 : Écrire les tests pour `renderRichSections`**

Ajouter à la fin de `src/lib/templates/__tests__/sections.test.ts` :

```ts
import { renderRichSections, type SectionKey as _SK } from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'
import type { LandingPageData } from '@/types'

describe('renderRichSections', () => {
  it('retourne "" quand toutes les sections sont absentes', () => {
    const emptyData = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
    } as LandingPageData
    expect(renderRichSections(emptyData)).toBe('')
  })

  it('rend du HTML quand au moins une section a de la data', () => {
    const data = {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
      story: { problem: 'P', agitation: 'A', solution: 'S', transformation: 'T' },
    } as LandingPageData
    const html = renderRichSections(data)
    expect(html).toContain('<section')
    expect(html).toContain('P')
  })

  it('respecte l\'ordre custom via le paramètre order', () => {
    const data = mockLandingDataFull
    const html = renderRichSections(data, undefined, ['features', 'story'])
    const idxFeatures = html.indexOf('Botanique')          // mot dans features
    const idxStory = html.indexOf('1% de collagène')       // mot dans story.problem
    expect(idxFeatures).toBeGreaterThan(-1)
    expect(idxStory).toBeGreaterThan(-1)
    expect(idxFeatures).toBeLessThan(idxStory)
  })

  it('skippe les clés inconnues sans throw', () => {
    const data = mockLandingDataFull
    const html = renderRichSections(data, undefined, ['UNKNOWN_KEY' as _SK])
    expect(html).toBe('')
  })

  it('rend les ~10 sections présentes dans mockLandingDataPartial et skippe les autres', () => {
    const html = renderRichSections(mockLandingDataPartial)
    // Sections présentes : doivent apparaître
    expect(html).toContain('12 480')              // social_proof_bar
    expect(html).toContain('Bio-Stim')            // story.solution
    expect(html).toContain('Botanique')           // features
    expect(html).toContain('Sophie L.')           // testimonials
    expect(html).toContain('Satisfait ou remboursé') // guarantee
    expect(html).toContain('Pochette')            // bonuses
    expect(html).toContain('Rides')               // comparison
    // Sections absentes : NE doivent pas générer de HTML "vide" ou "undefined"
    expect(html).not.toContain('undefined')
    expect(html).not.toContain('[object Object]')
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -25
```
Expected : 5 nouveaux tests FAIL avec `"renderRichSections" is not exported`.

- [ ] **Step 3 : Implémenter `SECTION_RENDERERS` et `renderRichSections`**

Ajouter à la fin de `src/lib/templates/sections.ts` (après les 19 renderers de la Task 3) :

```ts
// ─── Section renderers map ──────────────────────────────────────────────────
// Map qui associe chaque SectionKey à son renderer V2. Utilisée par
// renderRichSections pour itérer dans l'ordre voulu.

type SectionRenderer = (d: LandingPageData, t: SectionTheme) => string

const SECTION_RENDERERS: Record<SectionKey, SectionRenderer> = {
  social_proof_bar:      renderSocialProofBarV2,
  story:                 renderStoryV2,
  target_audience:       renderTargetAudience,
  features:              renderFeatures,
  unique_mechanism:      renderUniqueMechanism,
  how_it_works:          renderHowItWorks,
  before_after:          renderBeforeAfter,
  comparison:            renderComparisonV2,
  competitor_comparison: renderCompetitorComparison,
  testimonials:          renderTestimonialsV2,
  press_mentions:        renderPressMentions,
  founder_note:          renderFounderNote,
  value_stack:           renderValueStack,
  bonuses:               renderBonusesV2,
  guarantee:             renderGuaranteeV2,
  risk_reversal:         renderRiskReversal,
  objections:            renderObjections,
  community_callout:     renderCommunityCallout,
  final_pitch:           renderFinalPitch,
}

// ─── renderRichSections — l'API publique ────────────────────────────────────
// Rend les 19 sections riches dans l'ordre voulu, en skippant celles dont la
// data est absente. Si KONVERT_RICH_SECTIONS=false (rollback prod), retourne
// '' (aucune section).

export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[],
): string {
  // Feature flag rollback (spec § 3.6)
  if (process.env.KONVERT_RICH_SECTIONS === 'false') return ''

  const keys = order ?? DEFAULT_ORDER
  return keys
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
      if (!renderer) return '' // clé inconnue → skip silencieux
      return renderer(data, theme)
    })
    .filter(html => html.trim().length > 0)
    .join('\n')
}
```

- [ ] **Step 4 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -15
```
Expected : tous les tests PASS (9 total : 4 DEFAULT_ORDER + 5 renderRichSections).

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/sections.test.ts
git commit -m "feat(sections): renderRichSections + SECTION_RENDERERS map (TDD)"
```

---

### Task 6 : Tests feature flag KONVERT_RICH_SECTIONS

**Files:**
- Modify: `src/lib/templates/__tests__/sections.test.ts`

- [ ] **Step 1 : Ajouter le test feature flag**

Ajouter à la fin de `src/lib/templates/__tests__/sections.test.ts` :

```ts
import { afterEach } from 'vitest'

describe('renderRichSections — feature flag', () => {
  const originalEnv = process.env.KONVERT_RICH_SECTIONS

  afterEach(() => {
    process.env.KONVERT_RICH_SECTIONS = originalEnv
  })

  it('retourne "" quand KONVERT_RICH_SECTIONS=false (rollback)', () => {
    process.env.KONVERT_RICH_SECTIONS = 'false'
    expect(renderRichSections(mockLandingDataFull)).toBe('')
  })

  it('rend normalement quand KONVERT_RICH_SECTIONS=true', () => {
    process.env.KONVERT_RICH_SECTIONS = 'true'
    const html = renderRichSections(mockLandingDataFull)
    expect(html.length).toBeGreaterThan(100)
  })

  it('rend normalement quand KONVERT_RICH_SECTIONS est undefined (défaut)', () => {
    delete process.env.KONVERT_RICH_SECTIONS
    const html = renderRichSections(mockLandingDataFull)
    expect(html.length).toBeGreaterThan(100)
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -10
```
Expected : tous les tests PASS (12 total).

- [ ] **Step 3 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/__tests__/sections.test.ts
git commit -m "test(sections): couverture feature flag KONVERT_RICH_SECTIONS"
```

---

### Task 7 : Aliases backward-compat

**Files:**
- Modify: `src/lib/templates/sections.ts`
- Modify: `src/lib/templates/__tests__/sections.test.ts`

- [ ] **Step 1 : Écrire les tests pour les aliases**

Ajouter à la fin de `src/lib/templates/__tests__/sections.test.ts` :

```ts
import * as sections from '../sections'

describe('Backward compatibility aliases (V1 names)', () => {
  it('exporte renderStorySection qui pointe vers renderStoryV2', () => {
    expect(sections.renderStorySection).toBe(sections.renderStoryV2)
  })

  it('exporte renderSocialProofBar qui pointe vers renderSocialProofBarV2', () => {
    expect(sections.renderSocialProofBar).toBe(sections.renderSocialProofBarV2)
  })

  it('exporte renderTestimonialsSection qui pointe vers renderTestimonialsV2', () => {
    expect(sections.renderTestimonialsSection).toBe(sections.renderTestimonialsV2)
  })

  it('exporte renderComparisonSection qui pointe vers renderComparisonV2', () => {
    expect(sections.renderComparisonSection).toBe(sections.renderComparisonV2)
  })

  it('exporte renderBonusesSection qui pointe vers renderBonusesV2', () => {
    expect(sections.renderBonusesSection).toBe(sections.renderBonusesV2)
  })

  it('exporte renderGuaranteeSection qui pointe vers renderGuaranteeV2', () => {
    expect(sections.renderGuaranteeSection).toBe(sections.renderGuaranteeV2)
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent (les V1 existent encore avec leur ancien code, mais ne pointent pas vers V2)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -15
```
Expected : 6 tests FAIL — `renderStorySection !== renderStoryV2`.

- [ ] **Step 3 : Remplacer les 6 fonctions V1 par des aliases**

Ouvrir `src/lib/templates/sections.ts`. Supprimer les 6 fonctions V1 existantes (`renderStorySection`, `renderSocialProofBar`, `renderTestimonialsSection`, `renderComparisonSection`, `renderBonusesSection`, `renderGuaranteeSection` aux lignes ~37-206) et les remplacer par des aliases en fin de fichier :

```ts
// ─── Backward compat ────────────────────────────────────────────────────────
// Les noms V1 sont conservés comme aliases vers les versions V2 refondues.
// Permet à du code externe (ou aux 41 templates pas encore migrés pendant le
// rollout) de continuer à fonctionner.

export const renderStorySection         = renderStoryV2
export const renderSocialProofBar       = renderSocialProofBarV2
export const renderTestimonialsSection  = renderTestimonialsV2
export const renderComparisonSection    = renderComparisonV2
export const renderBonusesSection       = renderBonusesV2
export const renderGuaranteeSection     = renderGuaranteeV2
```

- [ ] **Step 4 : Lancer tous les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -10
```
Expected : tous les tests PASS (18 total).

- [ ] **Step 5 : Vérifier que la compilation TS marche encore (les 41 templates importent les V1)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -10
```
Expected : 0 erreur.

- [ ] **Step 6 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/sections.test.ts
git commit -m "feat(sections): remplacer V1 par aliases vers V2 refondues"
```

---

### Task 8 : Script de refactor des 41 templates

**Files:**
- Create: `scripts/refactor-templates-rich-sections.ts`
- Modify: `package.json` (ajout du script npm)

- [ ] **Step 1 : Créer le script**

Créer `scripts/refactor-templates-rich-sections.ts` :

```ts
#!/usr/bin/env node
/**
 * Script de refactor des 41 templates etec-*.ts pour remplacer les 6 appels
 * individuels (renderStorySection, renderSocialProofBar, ...) par un seul
 * appel à renderRichSections(data, THEME_NAME).
 *
 * Usage:
 *   npx tsx scripts/refactor-templates-rich-sections.ts --dry-run
 *   npx tsx scripts/refactor-templates-rich-sections.ts --apply
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'
import path from 'node:path'

const isDryRun = process.argv.includes('--dry-run')
const isApply  = process.argv.includes('--apply')

if (!isDryRun && !isApply) {
  console.error('Usage: --dry-run | --apply')
  process.exit(1)
}

// Regex pour matcher le bloc d'imports des 6 V1 noms (avec ou sans whitespace)
const IMPORT_BLOCK_RE = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/sections['"]/

// Regex pour matcher la séquence des 6 appels (ordre actuel ou ordre alternatif)
// Format ${renderXxxSection(data, THEME_NAME)} sur lignes consécutives
const CALLS_RE = /\$\{renderSocialProofBar\(data,\s*(\w+)\)\}\s*\n\s*\$\{renderStorySection\(data,\s*\1\)\}\s*\n\s*\$\{renderComparisonSection\(data,\s*\1\)\}\s*\n\s*\$\{renderTestimonialsSection\(data,\s*\1\)\}\s*\n\s*\$\{renderBonusesSection\(data,\s*\1\)\}\s*\n\s*\$\{renderGuaranteeSection\(data,\s*\1\)\}/g

const V1_IMPORTS = [
  'renderStorySection',
  'renderSocialProofBar',
  'renderTestimonialsSection',
  'renderComparisonSection',
  'renderBonusesSection',
  'renderGuaranteeSection',
]

function refactorFile(filepath: string): { changed: boolean; diff: string[] } {
  const original = readFileSync(filepath, 'utf-8')
  let next = original
  const diff: string[] = []

  // 1. Remplacer les imports : retirer les 6 V1, ajouter renderRichSections
  next = next.replace(IMPORT_BLOCK_RE, (_, contents: string) => {
    const items = contents.split(',').map(s => s.trim()).filter(Boolean)
    const remaining = items.filter(name => !V1_IMPORTS.includes(name.replace(/^type\s+/, '')))
    if (!remaining.includes('renderRichSections')) {
      remaining.unshift('renderRichSections')
    }
    diff.push(`imports: ${items.length} → ${remaining.length}`)
    return `import {\n  ${remaining.join(',\n  ')},\n} from './sections'`
  })

  // 2. Remplacer les 6 appels par 1 seul
  next = next.replace(CALLS_RE, (_, themeName: string) => {
    diff.push(`calls: 6 → 1 (theme=${themeName})`)
    return `\${renderRichSections(data, ${themeName})}`
  })

  return { changed: next !== original, diff }
}

async function main() {
  const files = await glob('src/lib/templates/etec-*.ts', { cwd: process.cwd() })
  console.log(`Found ${files.length} template files\n`)

  let changedCount = 0
  for (const file of files.sort()) {
    const { changed, diff } = refactorFile(file)
    if (changed) {
      changedCount++
      const action = isApply ? 'WRITE' : 'WOULD WRITE'
      console.log(`[${action}] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
      if (isApply) {
        const { changed: _, diff: _d } = refactorFile(file)
        const original = readFileSync(file, 'utf-8')
        const newContent = original
          .replace(IMPORT_BLOCK_RE, (_, contents: string) => {
            const items = contents.split(',').map(s => s.trim()).filter(Boolean)
            const remaining = items.filter(name => !V1_IMPORTS.includes(name.replace(/^type\s+/, '')))
            if (!remaining.includes('renderRichSections')) remaining.unshift('renderRichSections')
            return `import {\n  ${remaining.join(',\n  ')},\n} from './sections'`
          })
          .replace(CALLS_RE, (_, themeName: string) => `\${renderRichSections(data, ${themeName})}`)
        writeFileSync(file, newContent, 'utf-8')
      }
    } else {
      console.log(`[SKIP] ${file} (no match)`)
    }
  }

  console.log(`\n${changedCount}/${files.length} files ${isApply ? 'modified' : 'would be modified'}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2 : Ajouter une commande npm**

Ouvrir `package.json` et ajouter dans la section `"scripts"` :

```json
"refactor:rich-sections": "tsx scripts/refactor-templates-rich-sections.ts"
```

- [ ] **Step 3 : Vérifier que `tsx` et `glob` sont installés**

Run :
```bash
cd /Users/mac/nexara/konvert && npm list tsx glob 2>&1 | head -10
```

Si `tsx` ou `glob` manquent :
```bash
cd /Users/mac/nexara/konvert && npm install -D tsx glob @types/node
```

- [ ] **Step 4 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add scripts/ package.json package-lock.json
git commit -m "chore(scripts): script de refactor des 41 templates (dry-run/apply)"
```

---

### Task 9 : Exécuter le script en dry-run + review + apply

**Files:**
- Modify: `src/lib/templates/etec-*.ts` (41 fichiers via script)

- [ ] **Step 1 : Lancer en dry-run**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run refactor:rich-sections -- --dry-run 2>&1 | tail -50
```
Expected : 41 fichiers loggés avec `[WOULD WRITE]`, chacun montrant `imports: N → M` et `calls: 6 → 1`.

- [ ] **Step 2 : Review manuel de 3 templates aléatoires**

Choisir 3 fichiers parmi `etec-blue.ts`, `etec-noir.ts`, `etec-rose.ts`, `etec-luxe.ts`, `etec-energy.ts` (5 templates types) — vérifier que le pattern de regex va bien matcher leurs blocs.

Run pour chaque (exemple sur etec-blue) :
```bash
cd /Users/mac/nexara/konvert && grep -A 8 "renderSocialProofBar(data" src/lib/templates/etec-blue.ts | head -10
```
Vérifier visuellement que les 6 appels sont bien sur des lignes consécutives.

- [ ] **Step 3 : Lancer en `--apply`**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run refactor:rich-sections -- --apply 2>&1 | tail -50
```
Expected : `41/41 files modified`.

- [ ] **Step 4 : Vérifier que la compilation passe encore**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -20
```
Expected : 0 erreur.

- [ ] **Step 5 : Vérifier qu'aucun template ne contient plus les 6 V1 appels**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -lE "renderStorySection\(data|renderSocialProofBar\(data|renderTestimonialsSection\(data|renderComparisonSection\(data|renderBonusesSection\(data|renderGuaranteeSection\(data" src/lib/templates/etec-*.ts | wc -l
```
Expected : `0`

- [ ] **Step 6 : Vérifier que chaque template appelle renderRichSections**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -lE "renderRichSections\(data" src/lib/templates/etec-*.ts | wc -l
```
Expected : `41`

- [ ] **Step 7 : Commit en 1 batch**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/etec-*.ts
git commit -m "feat(templates): refactor 41 templates vers renderRichSections unique"
```

---

### Task 10 : Test E2E Playwright sur 5 templates

**Files:**
- Create: `e2e/sections-rich.spec.ts`

- [ ] **Step 1 : Investiguer la route de preview existante**

Run :
```bash
cd /Users/mac/nexara/konvert && ls src/app/api/preview/ src/app/test-builder/ src/app/test-generate/
```

- [ ] **Step 2 : Lire le code des routes preview pour connaître leur contrat**

Run :
```bash
cd /Users/mac/nexara/konvert && cat src/app/api/preview/route.ts 2>/dev/null
cat src/app/test-builder/page.tsx 2>/dev/null | head -80
cat src/app/test-generate/page.tsx 2>/dev/null | head -80
```

**Cas 1 — Une route preview existe et accepte `{template, landingPageData}`** :
adapter le `previewUrl` du Step 3 ci-dessous à la signature réelle.

**Cas 2 — Aucune route preview n'accepte un payload data direct** :
créer une route de test dédiée `src/app/api/__test/render-template/route.ts` :

```ts
import { NextRequest, NextResponse } from 'next/server'
import { renderTemplate } from '@/lib/templates'
import type { LandingPageData } from '@/types'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in prod' }, { status: 404 })
  }
  const { templateId, data } = await req.json() as {
    templateId: string
    data: LandingPageData
  }
  const html = renderTemplate(templateId, data)
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
```

Et adapter `previewUrl` du Step 3 vers `/api/__test/render-template`.

Commit cette route à part avant de continuer :
```bash
git add src/app/api/__test/ && git commit -m "test(e2e): route de test interne pour render-template (dev only)"
```

- [ ] **Step 3 : Écrire le spec Playwright**

Créer `e2e/sections-rich.spec.ts` :

```ts
import { test, expect } from '@playwright/test'
import { mockLandingDataFull } from '../src/lib/templates/__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../src/lib/templates/__fixtures__/mock-landing-data-partial'

// Tests E2E des sections riches sur 5 templates × 2 fixtures × 2 viewports.
// REQUIERT : route /api/preview (ou équivalent) qui accepte template+data
// et retourne le HTML rendu.

const TEMPLATES = ['etec-blue', 'etec-noir', 'etec-rose', 'etec-luxe', 'etec-energy']

const FIXTURES = [
  { name: 'full',    data: mockLandingDataFull },
  { name: 'partial', data: mockLandingDataPartial },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 390,  height: 844 },
]

for (const template of TEMPLATES) {
  for (const fixture of FIXTURES) {
    for (const viewport of VIEWPORTS) {
      test(`${template} · ${fixture.name} · ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })

        // Si Step 2 a montré que la route /api/preview existe avec la signature
        // {template, landingPageData} → utiliser previewUrl ci-dessous.
        // Sinon (route de test interne créée au Step 2 cas 2), remplacer par
        // /api/__test/render-template et payload {templateId, data}.
        const previewUrl = `/api/__test/render-template`
        const response = await page.request.post(previewUrl, {
          data: { templateId: template, data: fixture.data },
        })
        expect(response.status()).toBe(200)
        const html = await response.text()

        await page.setContent(html)

        // Vérifications communes
        await expect(page.locator('body')).toBeVisible()

        // Pas de undefined/null/NaN qui traînent
        const bodyText = await page.locator('body').innerText()
        expect(bodyText).not.toContain('undefined')
        expect(bodyText).not.toContain('[object Object]')
        expect(bodyText).not.toContain('NaN')

        // Sur fixture full : au moins 10 sections distinctes
        if (fixture.name === 'full') {
          const sections = await page.locator('section').count()
          expect(sections).toBeGreaterThanOrEqual(10)
        }

        // Screenshot pour visual diff manuel
        await page.screenshot({
          path: `test-results/sections-rich/${template}-${fixture.name}-${viewport.name}.png`,
          fullPage: true,
        })
      })
    }
  }
}

test('feature flag KONVERT_RICH_SECTIONS=false rend sans sections riches', async ({ page }) => {
  // Ce test nécessite que la route preview accepte un override d'env.
  // Si pas supporté, mark as test.skip et ouvrir issue follow-up.
  test.skip(true, 'À implémenter si la route preview supporte env override')
})
```

- [ ] **Step 4 : Lancer le serveur Next.js local (pré-requis)**

Run dans un terminal séparé :
```bash
cd /Users/mac/nexara/konvert && npm run dev
```

Attendre le message `Ready` (~5s).

- [ ] **Step 5 : Lancer les tests Playwright contre localhost**

Run dans le terminal principal :
```bash
cd /Users/mac/nexara/konvert && PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/sections-rich.spec.ts 2>&1 | tail -30
```
Expected : 20 tests PASS (5 templates × 2 fixtures × 2 viewports).

- [ ] **Step 6 : Review visuel des 20 screenshots**

Run :
```bash
cd /Users/mac/nexara/konvert && ls test-results/sections-rich/ | head -25
```

Ouvrir les screenshots dans le Finder / Preview et vérifier :
- Aucune section "vide" affichée
- Rythme bg/bgAlt visible (sections alternées)
- Pas d'overlap / débordement
- Mobile single-column propre

Si une régression visuelle : noter le template/viewport problématique, ouvrir un follow-up. Si bloquant, revert + ajustement.

- [ ] **Step 7 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add e2e/sections-rich.spec.ts
git commit -m "test(e2e): sections riches sur 5 templates × 2 fixtures × 2 viewports"
```

---

### Task 11 : Smoke prod-like + feature flag env

**Files:**
- Create: `.env.local.example` ajout `KONVERT_RICH_SECTIONS`
- Modify: `vercel.json` (si besoin de provisionner la var en prod)

- [ ] **Step 1 : Vérifier que le `.env.local` contient le flag**

Run :
```bash
cd /Users/mac/nexara/konvert && grep KONVERT_RICH_SECTIONS .env.local 2>/dev/null || echo "missing"
```

Si missing, ajouter dans `.env.local` :
```
KONVERT_RICH_SECTIONS=true
```

- [ ] **Step 2 : Documenter le flag dans `.env.local.example` (s'il existe)**

Run :
```bash
cd /Users/mac/nexara/konvert && ls .env.local.example 2>/dev/null
```

Si le fichier existe, ajouter à la fin :
```
# Feature flag chantier A — sections riches DTC (spec 2026-05-23)
# Mettre à 'false' pour rollback rapide en prod sans rebuild.
KONVERT_RICH_SECTIONS=true
```

- [ ] **Step 3 : Smoke test complet — génération end-to-end d'une page**

Run (en local, dev server lancé) :
```bash
cd /Users/mac/nexara/konvert && curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"productUrl": "https://www.shopify-test-store.com/products/example", "templateId": "etec-blue"}' \
  | head -c 5000
```

Vérifier :
- Status 200
- HTML retourné contient `<section`
- Pas de `undefined`, `[object Object]`, `NaN`
- Taille raisonnable (`wc -c` < 500 ko)

- [ ] **Step 4 : Vérifier le rollback flag en local**

Run :
```bash
cd /Users/mac/nexara/konvert && KONVERT_RICH_SECTIONS=false npx vitest run src/lib/templates/__tests__/sections.test.ts 2>&1 | tail -10
```
Expected : tests feature flag PASS.

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add .env.local.example 2>/dev/null || true
git diff --cached --quiet || git commit -m "chore(env): documenter KONVERT_RICH_SECTIONS"
```

---

### Task 12 : Run all tests + final review

**Files:** N/A

- [ ] **Step 1 : Lancer toute la suite Vitest**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -20
```
Expected : tous les tests PASS, aucune régression sur les autres fichiers test.

- [ ] **Step 2 : Lancer le lint**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run lint 2>&1 | tail -15
```
Expected : 0 erreur de lint.

- [ ] **Step 3 : Lancer le typecheck**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | tail -5
```
Expected : 0 erreur TS.

- [ ] **Step 4 : Vérifier les diffs récents**

Run :
```bash
cd /Users/mac/nexara/konvert && git log --oneline feat/sections-riches-dtc ^main
```
Expected : ~10-12 commits propres, messages clairs.

- [ ] **Step 5 : Push de la branche**

Run :
```bash
cd /Users/mac/nexara/konvert && git push -u origin feat/sections-riches-dtc
```

- [ ] **Step 6 : Ouvrir la PR (manuel ou via gh)**

Run :
```bash
cd /Users/mac/nexara/konvert && gh pr create --base main --head feat/sections-riches-dtc \
  --title "feat: chantier A — sections riches DTC premium" \
  --body "$(cat <<'EOF'
## Summary
- Câble les 13 sections orphelines générées par le LLM dans les 41 templates
- Refond les 6 sections existantes au niveau visuel premium DTC
- Une fonction unique renderRichSections(data, theme, order?) avec skip auto
- Feature flag KONVERT_RICH_SECTIONS pour rollback rapide en prod

## Spec
docs/superpowers/specs/2026-05-23-konvert-sections-riches-design.md

## Plan
docs/superpowers/plans/2026-05-23-konvert-sections-riches.md

## Test plan
- [x] Vitest unit (18 tests) verts
- [x] Playwright E2E (20 cas : 5 templates × 2 fixtures × 2 viewports) verts
- [x] Smoke prod-like sur /api/generate vert
- [x] Review visuelle 20 screenshots OK

## Rollback
`vercel env set KONVERT_RICH_SECTIONS false` → retour comportement quasi-actuel sans rebuild.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 7 : Marquer le chantier A complete**

Mettre à jour la mémoire utilisateur (si applicable) et passer aux chantiers B (multi-images) et C (éditeur enrichi).

---

## Self-review checklist (à exécuter avant merge)

- [ ] **Spec coverage** — chaque section du spec a une task correspondante
  - § 3.1 Files touchés → Tasks 2, 3, 5, 7, 9
  - § 3.2 DEFAULT_ORDER → Task 2
  - § 3.3 API publique → Task 5
  - § 3.4 Data flow → Tasks 5, 9
  - § 3.5 Skip → Tasks 5, 10
  - § 3.6 Feature flag → Tasks 5, 6, 11
  - § 4 Contrat OBITO → Task 1
  - § 5 Refactor 41 templates → Tasks 8, 9
  - § 6 QA → Tasks 6, 10, 11, 12
  - § 7 Rollback → Tasks 6, 11
- [ ] **Type consistency** — `SectionKey`, `SectionTheme`, `renderRichSections` ont la même signature dans toutes les tâches qui les référencent
- [ ] **No placeholders** — aucun "TBD", "TODO" dans le plan
- [ ] **Exact file paths** — tous les paths sont absolus depuis `/Users/mac/nexara/konvert/`
- [ ] **Commit messages** — préfixes cohérents avec l'historique git existant
- [ ] **TDD respecté** — test → fail → impl → pass → commit pour les tâches code (sauf Task 1 OBITO et Task 9 refactor scripté, qui ne sont pas testables en TDD)

---

## Estimation totale

- Task 0-1 (setup + OBITO dispatch) : ~30 min + temps OBITO async
- Tasks 2-7 (sections.ts + tests) : ~3h
- Tasks 8-9 (script + refactor 41 templates) : ~2h
- Tasks 10-12 (E2E + smoke + PR) : ~3h

**Total effectif : ~9h** étalé sur 2 jours (jour 1 = OBITO async + setup + sections.ts, jour 2 = refactor + E2E + PR).
