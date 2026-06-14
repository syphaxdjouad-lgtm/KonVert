# Chantier C2 — Settings Panel (builder Shopify-like)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le proto `SubPanelEdit` livré en C1 (titre/sous-titre hardcodés) en un PanelRight complet : 7 field renderers réutilisables, 21 section editors dynamiques, auto-save debounce 3s, câblage `renderTemplate` avec `overrides.visualSettings`. À l'issue de C2, l'éditeur est utilisable en production : sélection section → édition champs → preview live → sauvegarde auto.

**Architecture:** C2 étend le store Zustand (`updateSectionField`, `updateVisualSetting`, `scheduleAutoSave`) sans casser C1. `SubPanelEdit.tsx` est remplacé par `PanelRight.tsx` (slide-in générique) + `SectionEditor.tsx` (dispatcher vers 21 editors) + `fields/` (7 renderers) + `editors/` (1 fichier par section ou registry centralisé — décision ci-dessous).

**Spec source:** `docs/superpowers/specs/2026-05-25-konvert-chantier-c-editor-design.md` (§ 3.2, 3.3, 3.5, 3.7, 4.1, 4.2, 6)

**Branche prévue:** `feat/editor-settings-panel` (créée depuis `main` après merge de C1)

**Feature flag:** `NEXT_PUBLIC_KONVERT_NEW_EDITOR` — inchangé, pilote toujours l'éditeur entier.

---

## Pourquoi

C1 a livré la colonne vertébrale de l'éditeur : le store Zustand, le layout (Sidebar + PanelLeft + PreviewIframe), la migration legacy, le drag-drop. Mais l'édition est inexistante : `SubPanelEdit` affiche deux champs hardcodés (title, subtitle) qui ne modifient ni la preview ni la DB.

C2 donne à l'utilisateur le "moment Shopify" : cliquer sur une section dans la liste, voir un panel droit s'ouvrir avec tous ses champs éditables, modifier en temps réel, voir la preview se mettre à jour, et ne plus jamais avoir besoin de regénérer depuis zéro pour changer un texte ou une couleur.

---

## Périmètre IN / OUT

### IN

- `PanelRight.tsx` — slide-in 360px fixe à droite, remplace `SubPanelEdit.tsx`
- 7 field renderers dans `src/components/editor/fields/`
- 21 section editors dans `src/components/editor/editors/` (registry centralisé — voir Décisions)
- Store : actions `updateSectionField(sectionId, fieldPath, value)`, `updateVisualSetting(sectionId, patch)`, `scheduleAutoSave(pageId)`, selector `getRenderOverrides()`
- Auto-save : debounce 3s, indicateur visuel "Sauvegarde…" / "Sauvegardé à HH:MM" / "Erreur — retry"
- `renderTemplate` câblé avec `overrides.visualSettings` (extension C1 — les sections reçoivent les overrides visuels)
- Tests Vitest : 7 fichiers fields + 21 fichiers editors + store + debounce = ~35-40 nouveaux tests
- TS strict 0 erreur, lint clean

### OUT — Reporté à C3+

- Image upload Supabase Storage (ImageField MVP = URL texte seule, badge "Upload en C3")
- Ajout de nouvelles instances de section (bouton "+", clonage)
- Bibliothèque de blocks (C4)
- GlobalStyles palette (C5)
- Undo/Redo
- Édition responsive granulaire desktop vs mobile
- Keyboard shortcuts (`Cmd+S` manuel — l'auto-save couvre le besoin immédiat)

---

## Decisions à valider avant de coder

**D1 — Color picker : `react-colorful` (recommandé) vs natif `<input type=color>`**

La spec impose `react-colorful` (§ 3.1). C'est le bon choix : 2.8 KB gzippé, pas de popover natif peu stylable, couleur en temps réel sans dialog OS. Seul inconvénient : une dépendance de plus. Recommandation : **react-colorful**. Si la dépendance est bloquée pour raison de bundle, repli sur natif possible (ColorField isole le détail d'implémentation derrière son interface).

**D2 — Registry centralisé vs fichiers séparés pour les 21 editors**

Deux options :
- Option A — 21 fichiers `editors/HeroEditor.ts` : refactoring simple par section, pas de couplage entre editors, lecture facile.
- Option B — 1 fichier `editors/registry.ts` + 1 fichier `editors/schemas.ts` : chaque editor = un objet de config `{ sectionKey, groups: [ { label, fields: [...] } ] }`. `SectionEditor.tsx` itère sur le schema et rend les fields dynamiquement sans aucun `switch`.

**Recommandation : Option B (registry centralisé).** Raison : 21 fichiers × 3-5 fields = 63-105 petites fonctions quasi-identiques. Le registry factualise les patterns répétitifs, facilite l'ajout de nouveaux champs sans toucher le dispatcher, et permet de générer les tests depuis le schema (1 test = "le schema de la section X expose les bons fields avec les bons types"). Inconvénient : debugging légèrement moins direct — mitigé par des types stricts sur `SectionSchema`.

**D3 — PaddingField : 4 inputs top/right/bottom/left vs 1 input + lock symétrie**

La spec mentionne "Padding S/M/L" (§ 3.3 `VisualSettings.padding`) avec 3 valeurs possibles : `'sm' | 'md' | 'lg'` (60px / 80px / 120px). Ce n'est pas du padding CSS granulaire — c'est un preset de densité. **Recommandation : SelectField avec 3 options (S / M / L)**, pas de PaddingField à 4 inputs. Le PaddingField 4-inputs s'appliquera si C4 ajoute des blocks avec padding custom. Pour C2, `PaddingField` dans le cahier des charges est donc renommé en `DensityField` dans ce plan (implémenté comme SelectField avec options 'sm' | 'md' | 'lg'). Si le user préfère garder 4 inputs pour préparer C4, signaler avant code.

**D4 — 21 sections vs 19 annoncées dans le brief**

Le catalogue réel dans `sections.ts` compte **21 SectionKeys** (pas 19). La section `trust_badges_payment` (badges paiement CB/SSL) est présente dans `SectionKey` mais absente de `SECTION_LABELS` dans `SectionsList.tsx` et du `hasDataForSection` switch dans `store.ts`. C2 crée les 21 editors (y compris `TrustBadgesPaymentEditor`). Le plan documente l'écart pour que le user valide avant code. Si une 22e section a été ajoutée depuis ce plan, l'ajouter au registry.

**D5 — Auto-save : route API dédiée vs Supabase client direct**

Il n'existe pas de route `/api/pages/[id]/save` : la sauvegarde actuelle dans `page.tsx` appelle Supabase directement depuis le client (fonctions `savePage` et autosave V3). Deux options :
- Option A — Continuer avec Supabase client direct (RLS garantit l'autorisation). Pas de réseau supplémentaire. Simple.
- Option B — Créer `/api/pages/[id]/save` (POST, authMiddleware + Zod). Centralise la logique save, facilite les webhooks futurs et le rate-limit.

**Recommandation : Option A pour C2** (Supabase client direct depuis le store, pattern déjà établi). Option B devient pertinente si C3+ ajoute des triggers serveur (webhooks, re-génération LLM partielle, etc.).

**D6 — Image upload : URL texte seule (MVP) vs Supabase Storage dès C2**

`/api/upload-image/route.ts` et `/api/upload/route.ts` existent déjà. Supabase Storage bucket `landing-images` est provisionné. Techniquement faisable en C2. Cependant l'upload complexifie chaque `ImageField` (état de progression, gestion d'erreur réseau, permissions bucket par user). **Recommandation : URL texte seule en C2** pour rester bite-sized. Upgrader en C3 ou C4 en réutilisant `/api/upload-image`. Le bucket est prêt, le refactor sera minimal (swapper le `<input type="text">` par un `<input type="file">` + appel fetch dans `ImageField`).

---

## Architecture

### Nouveaux fichiers à créer

```
src/
├── components/editor/
│   ├── PanelRight.tsx                              [CREATE] slide-in 360px, remplace SubPanelEdit
│   ├── SectionEditor.tsx                           [CREATE] dispatcher registry → fields
│   ├── AutoSaveIndicator.tsx                       [CREATE] "Sauvegarde..." / "Sauvegardé à HH:MM"
│   ├── fields/
│   │   ├── index.ts                                [CREATE] re-export tous les fields
│   │   ├── TextField.tsx                           [CREATE]
│   │   ├── TextAreaField.tsx                       [CREATE]
│   │   ├── ImageField.tsx                          [CREATE] URL texte + preview (pas d'upload C2)
│   │   ├── ColorField.tsx                          [CREATE] react-colorful
│   │   ├── ToggleField.tsx                         [CREATE]
│   │   ├── SelectField.tsx                         [CREATE]
│   │   └── DensityField.tsx                        [CREATE] alias SelectField avec options S/M/L
│   ├── editors/
│   │   ├── registry.ts                             [CREATE] 21 SectionSchema objects
│   │   └── schemas.ts                              [CREATE] types SectionSchema, FieldDef, GroupDef
│   └── __tests__/
│       ├── PanelRight.test.ts                      [CREATE]
│       ├── SectionEditor.test.ts                   [CREATE]
│       ├── fields/
│       │   ├── TextField.test.ts                   [CREATE]
│       │   ├── TextAreaField.test.ts               [CREATE]
│       │   ├── ImageField.test.ts                  [CREATE]
│       │   ├── ColorField.test.ts                  [CREATE]
│       │   ├── ToggleField.test.ts                 [CREATE]
│       │   └── SelectField.test.ts                 [CREATE]
│       ├── editors/
│       │   └── registry.test.ts                    [CREATE] 21 × schema integrity tests
│       └── store-c2.test.ts                        [CREATE] nouvelles actions + debounce
├── lib/templates/
│   └── sections.ts                                 [MODIFY] renderRichSections lit visualSettings par section
└── types/
    └── editor.ts                                   [MODIFY] SectionSchema, FieldDef, GroupDef (si non exportés depuis editors/schemas.ts)
```

### Fichiers à modifier (C1 existants)

```
src/components/editor/
├── store.ts                [MODIFY] +updateSectionField, +updateVisualSetting, +scheduleAutoSave, +getRenderOverrides, +saveStatus
├── EditorRoot.tsx          [MODIFY] +AutoSaveIndicator dans topbar, +PanelRight rendu
├── PreviewIframe.tsx       [MODIFY] lire getRenderOverrides() pour passer visualSettings au render
└── SubPanelEdit.tsx        [DELETE ou vider] remplacé par PanelRight — garder le fichier vide avec re-export si des imports existent
```

**Note :** `Panel.tsx` (PanelLeft slide-in côté gauche) reste intact. Le grid editor `PreviewIframe` doit gérer la coexistence Panel gauche + PanelRight sans compression — le layout actuel est `fixed` position hors flux, donc pas de conflit à régler.

### Diagramme de flux (C2)

```
User clique section dans SectionsList (PanelLeft)
  ↓
setSelectedSection(sectionId) → store.selectedSectionId = id
                               → store.subPanelEditOpen = true (déjà câblé C1)
  ↓
PanelRight lit selectedSectionId → trouve SectionInstance → lit sectionKey
  ↓
SectionEditor(sectionKey) → registry.ts → SectionSchema
  ↓
SectionSchema.groups[].fields[] → rend chaque FieldDef via le bon field renderer
  ↓
User modifie un field
  ↓
onChange(value) → updateSectionField(sectionId, fieldPath, value)
             → mute store.sectionData[sectionId][fieldPath] = value (immédiat)
             → scheduleAutoSave(pageId, 3000ms) (debounce)
  ↓
PreviewIframe réagit (selector dépend de sectionData + visualSettings)
  → debounce 200ms → renderTemplate(templateId, mergedLandingData, getRenderOverrides())
  → setSrcdoc(html) → preview update
  ↓
Après 3s sans nouveau changement → saveToSupabase(pageId, jsonForDb)
  → AutoSaveIndicator: "Sauvegardé à HH:MM" (vert)
  → si erreur: retry 1x (exp backoff 2s) puis "Erreur — réessayer" (rouge)
```

### Types clés à créer dans `editors/schemas.ts`

```ts
// Un field dans un group d'un section editor
export type FieldType =
  | 'text'
  | 'textarea'
  | 'image'    // URL texte en C2, upload en C3
  | 'color'
  | 'toggle'
  | 'select'
  | 'density'  // alias select avec options S/M/L

export interface FieldDef {
  key: string              // chemin dans LandingPageData (ex: 'story.hero_title')
  type: FieldType
  label: string
  helpText?: string
  defaultValue?: unknown
  options?: { value: string; label: string }[]  // pour type=select/density
  // Pour les champs visuels (VisualSettings) : indiquer la cible
  target?: 'landingData' | 'visualSettings'     // defaut: 'landingData'
}

export interface GroupDef {
  label: string            // 'Contenu' | 'Style' | 'Mise en page'
  fields: FieldDef[]
}

export interface SectionSchema {
  sectionKey: SectionKey
  label: string            // label lisible (même que SECTION_LABELS)
  groups: GroupDef[]
}
```

### Contrat des field renderers

Chaque renderer accepte ces props et rien d'autre (testable isolément) :

```ts
interface FieldProps<T = string> {
  value: T
  onChange: (value: T) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}
```

Pas de `useEditorStore` direct dans les renderers. Le `SectionEditor` est responsable de mapper `store.sectionData[id][fieldPath]` → `value` + `onChange` → `store.updateSectionField(...)`.

---

## Tasks (bite-sized TDD)

---

### T0 — Setup branche

**Why:** Isoler C2 de `main` pour un rollback propre si besoin.

**What:** Créer `feat/editor-settings-panel` depuis `main` après merge C1. Vérifier que les tests C1 passent.

**Files:** aucun (opération git)

**Tests:** `npx vitest run` → tous PASS (~208 tests C1 existants)

**Done when:** branche créée, `npm run build` et `npx vitest run` verts.

- [ ] `git checkout main && git pull origin main`
- [ ] `git checkout -b feat/editor-settings-panel`
- [ ] `npx vitest run 2>&1 | tail -5` — tous PASS
- [ ] `npm run build 2>&1 | tail -5` — Compiled successfully
- [ ] `git commit --allow-empty -m "chore: branch feat/editor-settings-panel for chantier C2"`

---

### T1 — Dépendance react-colorful

**Why:** `ColorField` en a besoin. L'installer tôt évite de bloquer T6.

**What:** `npm install react-colorful`. Vérifier bundle size (+2.8 KB gzip acceptable). Vérifier que les types sont inclus (react-colorful les bundle nativement).

**Files:** `package.json`, `package-lock.json`

**Tests:** `npx tsc --noEmit` → 0 erreur. `npm list react-colorful` → version affichée.

**Done when:** `import { HexColorPicker } from 'react-colorful'` compile sans erreur.

- [ ] `npm install react-colorful`
- [ ] `npx tsc --noEmit 2>&1 | grep error | head -5` → 0
- [ ] `git add package.json package-lock.json && git commit -m "chore(deps): react-colorful pour ColorField C2"`

---

### T2 — Types `SectionSchema` + `FieldDef` + `GroupDef`

**Why:** Le registry et les tests en dépendent. TDD : définir le contrat avant l'implémentation.

**What:** Créer `src/components/editor/editors/schemas.ts` avec les types `FieldType`, `FieldDef`, `GroupDef`, `SectionSchema`. Ajouter `SectionFieldPath` utilitaire (string union des clés éditables de `LandingPageData`) si TypeScript le permet sans surcoût.

**Files:**
- Créer `src/components/editor/editors/schemas.ts`

**Tests:** `npx tsc --noEmit` → 0 erreur. Pas de test Vitest pour un fichier de types purs.

**Done when:** `import type { SectionSchema } from './schemas'` compile dans les fichiers suivants.

- [ ] Créer `src/components/editor/editors/schemas.ts` avec les types décrits dans Architecture ci-dessus
- [ ] `npx tsc --noEmit 2>&1 | grep "schemas" | head -5` → 0 erreur
- [ ] `git add src/components/editor/editors/schemas.ts && git commit -m "feat(editor): types SectionSchema FieldDef GroupDef (chantier C2)"`

---

### T3 — Store C2 : nouvelles actions (TDD)

**Why:** C'est la source de vérité. Les actions doivent être testées avant que les composants les consomment.

**What:** Ajouter dans `store.ts` :
- `sectionData: Record<string, Record<string, unknown>>` — données éditées par section (override de `landingData` par instance)
- `updateSectionField(sectionId: string, fieldPath: string, value: unknown): void` — mute `sectionData[sectionId][fieldPath]`
- `updateVisualSetting(sectionId: string, patch: Partial<VisualSettings[string]>): void` — mute `visualSettings[sectionId]`
- `saveStatus: 'idle' | 'saving' | 'saved' | 'error'` + `lastSavedAt: Date | null` + `setSaveStatus(s): void`
- `scheduleAutoSave(pageId: string, onSave: (json: object) => Promise<void>): void` — debounce 3s sur un `setTimeout` ref (annule le précédent à chaque appel)
- `getRenderOverrides(): { sectionOrder: SectionInstance[], visualSettings: VisualSettings }` — selector pur, retourne les overrides pour `renderTemplate`

**Files:**
- Créer `src/components/editor/__tests__/store-c2.test.ts`
- Modifier `src/components/editor/store.ts`

**Tests (store-c2.test.ts) :**
1. `updateSectionField('id1', 'story.hero_title', 'Nouveau titre')` → `store.sectionData['id1']['story.hero_title'] === 'Nouveau titre'`
2. Appel sur sectionId inconnu → crée l'entrée sans erreur
3. `updateVisualSetting('id1', { padding: 'lg' })` → `store.visualSettings['id1'].padding === 'lg'`
4. `updateVisualSetting` merge (ne remplace pas) les champs existants
5. `getRenderOverrides()` retourne `{ sectionOrder, visualSettings }` correct
6. `scheduleAutoSave` + fake timers : callback appelé après 3000ms, pas avant
7. Deux appels rapides de `scheduleAutoSave` → callback appelé 1 seule fois (debounce)
8. `setSaveStatus('saving')` → `saveStatus === 'saving'`

**Done when:** 8 nouveaux tests PASS, TS 0 erreur, tests C1 non-régressés.

- [ ] Écrire `store-c2.test.ts` (TDD : RED)
- [ ] `npx vitest run src/components/editor/__tests__/store-c2.test.ts` → FAIL
- [ ] Modifier `store.ts` pour ajouter les 6 nouvelles propriétés/actions
- [ ] `npx vitest run src/components/editor/__tests__/store-c2.test.ts` → PASS
- [ ] `npx vitest run` → 0 régression sur les tests C1
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] `git add src/components/editor/store.ts src/components/editor/__tests__/store-c2.test.ts && git commit -m "feat(editor): store C2 updateSectionField + updateVisualSetting + autoSave (chantier C2)"`

---

### T4 — Extension `renderRichSections` pour `visualSettings` (TDD)

**Why:** La preview doit refléter les tweaks visuels en temps réel. C1 a câblé `sectionOrder`. C2 câble `visualSettings`.

**What:** Modifier `renderRichSections` dans `sections.ts` pour qu'en présence de `visualSettings`, chaque section reçoive son override (padding, bgColor, alignment) injecté dans le HTML rendu. Étendre `renderTemplate` pour passer `overrides.visualSettings` via le même mécanisme `data._visualSettings` qu'utilisé pour `_sectionOrder`.

Concrètement :
- Chaque renderer de section (`renderStory`, `renderTestimonials`, etc.) accepte un 3e argument optionnel `sectionVisual?: VisualSettings[string]` (ou le lit depuis `data._visualSettings[sectionId]`)
- La valeur `padding` mappe vers des classes CSS : `sm` → padding 60px, `md` → 80px, `lg` → 120px
- `bgColor` overrides `theme.bg` pour cette section
- `alignment` ajoute une classe `text-left/center/right`

**Note d'implémentation :** plutôt que de modifier les 21 renderers un par un, envelopper le HTML rendu avec un `<div style="padding-top:Xpx; background:Y">` dans `renderRichSections` après appel du renderer. Cela isole le changement.

**Files:**
- Modifier `src/lib/templates/sections.ts` (`renderRichSections` + signature)
- Modifier `src/lib/templates/index.ts` (`renderTemplate` pour passer `_visualSettings`)
- Modifier `src/lib/templates/__tests__/render-template-overrides.test.ts` (ajouter 4 cas visualSettings)

**Tests (à ajouter dans render-template-overrides.test.ts) :**
1. `renderRichSections(data, theme, [section visible], visualSettings: { id1: { padding: 'lg' } })` → HTML contient `padding-top:120px` ou équivalent
2. `visualSettings: { id1: { bgColor: '#FF0' } }` → HTML contient `background:#FF0`
3. `visualSettings: { id1: { alignment: 'center' } }` → HTML contient `text-align:center`
4. Section sans visualSettings → comportement inchangé

**Done when:** 4 nouveaux tests PASS, tests C1 renderTemplate non-régressés.

- [ ] Écrire les 4 nouveaux cas dans `render-template-overrides.test.ts` → RED
- [ ] Modifier `sections.ts` et `index.ts`
- [ ] Tests → PASS
- [ ] `npx vitest run` → 0 régression
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] `git add src/lib/templates/ && git commit -m "feat(templates): renderTemplate câble overrides.visualSettings (chantier C2)"`

---

### T5 — `PreviewIframe` : lire `getRenderOverrides()` (TDD)

**Why:** La preview doit refléter à la fois `sectionOrder` ET `visualSettings`. Actuellement elle ne passe que `sectionOrder`.

**What:** Modifier `PreviewIframe.tsx` pour utiliser `getRenderOverrides()` du store et passer les deux overrides à `renderTemplate`. Modifier le test `PreviewIframe.test.ts` pour couvrir le cas `visualSettings`.

**Files:**
- Modifier `src/components/editor/PreviewIframe.tsx`
- Modifier `src/components/editor/__tests__/PreviewIframe.test.ts` (ajouter 1 cas)

**Tests (à ajouter) :**
1. Store avec `visualSettings: { id1: { bgColor: '#ABC' } }` → après debounce, `srcdoc` contient `#ABC`

**Done when:** PreviewIframe utilise `getRenderOverrides()`, test additionnel PASS.

- [ ] Modifier `PreviewIframe.tsx` pour consommer `getRenderOverrides()`
- [ ] Ajouter cas test
- [ ] `npx vitest run src/components/editor/__tests__/PreviewIframe.test.ts` → PASS
- [ ] `git add src/components/editor/PreviewIframe.tsx src/components/editor/__tests__/PreviewIframe.test.ts && git commit -m "feat(editor): PreviewIframe câble visualSettings via getRenderOverrides (chantier C2)"`

---

### T6 — 7 field renderers (TDD)

**Why:** Ce sont les briques atomiques. Les tester isolément garantit qu'ils fonctionnent sans context store.

**What:** Créer les 7 composants dans `src/components/editor/fields/`. Chaque renderer accepte `{ value, onChange, label, helpText?, error?, disabled? }`.

**Détail par renderer :**
- `TextField.tsx` — `<input type="text">` contrôlé, `onChange(e.target.value)`
- `TextAreaField.tsx` — `<textarea>` contrôlé, `rows={4}` par défaut configurable
- `ImageField.tsx` — `<input type="text">` pour URL + `<img>` preview si URL valide (détection simple : `url.startsWith('http')`). Badge "Upload en C3".
- `ColorField.tsx` — `HexColorPicker` de `react-colorful` + `<input type="text">` synchronisé pour saisie hexadécimale manuelle
- `ToggleField.tsx` — `<button role="switch" aria-checked={value}>` stylé (pas `<input type="checkbox">` difficile à styler)
- `SelectField.tsx` — `<select>` natif contrôlé avec `options: { value, label }[]`
- `DensityField.tsx` — wrapper de `SelectField` avec `options` préconfigurées : `[{ value:'sm', label:'Compact (60px)' }, { value:'md', label:'Normal (80px)' }, { value:'lg', label:'Spacieux (120px)' }]`

Créer `src/components/editor/fields/index.ts` qui re-exporte tous les 7.

**Files:**
- Créer `src/components/editor/fields/*.tsx` (7 fichiers + index.ts)
- Créer `src/components/editor/__tests__/fields/TextField.test.ts`
- Créer `src/components/editor/__tests__/fields/TextAreaField.test.ts`
- Créer `src/components/editor/__tests__/fields/ImageField.test.ts`
- Créer `src/components/editor/__tests__/fields/ColorField.test.ts`
- Créer `src/components/editor/__tests__/fields/ToggleField.test.ts`
- Créer `src/components/editor/__tests__/fields/SelectField.test.ts`

**Tests (pattern identique pour chaque renderer) :**
- Rend le `label` dans le DOM
- `onChange` appelé avec la bonne valeur au changement
- `disabled=true` → le champ est désactivé (attribut `disabled` ou `pointer-events:none` selon le composant)
- `error` → un texte d'erreur apparaît
- Spécifique `ColorField` : saisie hex dans l'input texte → `onChange('#AABBCC')` appelé
- Spécifique `ImageField` : URL valide → `<img>` preview visible ; URL vide → pas d'`<img>`
- Spécifique `ToggleField` : clic → `onChange(!value)` ; `aria-checked` correct

**Done when:** 6 fichiers de test × ~4 tests = ~25 tests PASS. TS strict 0 erreur.

- [ ] Écrire tous les tests (RED)
- [ ] Implémenter les 7 renderers (GREEN)
- [ ] `npx vitest run src/components/editor/__tests__/fields/` → tous PASS
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] `git add src/components/editor/fields/ src/components/editor/__tests__/fields/ && git commit -m "feat(editor): 7 field renderers TDD (TextField/Textarea/Image/Color/Toggle/Select/Density) — chantier C2"`

---

### T7 — Registry des 21 section editors (TDD)

**Why:** Le dispatcher `SectionEditor` lit le registry. Si le registry est correct, l'UI est correcte.

**What:** Créer `src/components/editor/editors/registry.ts` avec les 21 `SectionSchema`. Chaque schema déclare ses groups + fields conformément aux props éditables de chaque section.

**Mapping sections → fields (résumé) :**

| SectionKey | Groups | Fields clés |
|---|---|---|
| `social_proof_bar` | Contenu | `social_proof.rating` (select 1-5), `social_proof.count` (text), `social_proof.label` (text) |
| `story` | Contenu | `story.hero_title` (text), `story.problem` (textarea), `story.solution` (textarea), `story.transformation` (textarea) ; Style | `padding` (density), `bgColor` (color) |
| `target_audience` | Contenu | `target_audience[0..2].profile` (text), `target_audience[0..2].pain` (textarea) ; Style | `padding` (density) |
| `features` | Contenu | `features[0..5].title` (text), `features[0..5].description` (textarea) ; Style | `padding` (density), `alignment` (select left/center/right) |
| `gallery` | Contenu | `images[0..7]` (image × 8) ; Style | `padding` (density) |
| `unique_mechanism` | Contenu | `unique_mechanism.title` (text), `unique_mechanism.description` (textarea) ; Style | `bgColor` (color) |
| `how_it_works` | Contenu | `how_it_works[0..3].step` (text), `how_it_works[0..3].description` (textarea) ; Style | `padding` (density) |
| `before_after` | Contenu | `before_after[0].before_label` (text), `before_after[0].after_label` (text), `before_after[0].before_image` (image), `before_after[0].after_image` (image) |
| `comparison` | Contenu | `comparison.title` (text), `comparison.our_product` (text), `comparison.competitor` (text) ; Style | `bgColor` (color) |
| `competitor_comparison` | Contenu | `competitor_comparison.title` (text), champs features toggle |
| `testimonials` | Contenu | `testimonials[0..2].name` (text), `testimonials[0..2].text` (textarea), `testimonials[0..2].rating` (select 1-5), `testimonials[0..2].avatar` (image) ; Style | `padding` (density) |
| `press_mentions` | Contenu | `press_mentions[0..2].publication` (text), `press_mentions[0..2].quote` (textarea) |
| `founder_note` | Contenu | `founder_note.name` (text), `founder_note.message` (textarea), `founder_note.avatar` (image) |
| `value_stack` | Contenu | `value_stack.title` (text), `value_stack.items[0..3].label` (text), `value_stack.items[0..3].value` (text) |
| `bonuses` | Contenu | `bonuses[0..2].title` (text), `bonuses[0..2].description` (textarea), `bonuses[0..2].image` (image) |
| `guarantee` | Contenu | `guarantee.title` (text), `guarantee.description` (textarea), `guarantee.duration` (text) ; Style | `bgColor` (color) |
| `trust_badges_payment` | Contenu | `trust_badges.payment_methods` (toggle CB/PayPal/etc.), `trust_badges.ssl_badge` (toggle) ; Style | `alignment` (select) |
| `risk_reversal` | Contenu | `risk_reversal[0..2].title` (text), `risk_reversal[0..2].description` (textarea) |
| `objections` | Contenu | `objections[0..3].question` (text), `objections[0..3].answer` (textarea) |
| `community_callout` | Contenu | `community_callout.title` (text), `community_callout.description` (textarea), `community_callout.cta_label` (text) |
| `final_pitch` | Contenu | `final_pitch.title` (text), `final_pitch.urgency` (textarea), `final_pitch.cta_label` (text) ; Style | `bgColor` (color), `padding` (density) |

**Note :** les champs de tableaux (`features[0..5].title`) sont représentés comme autant de `FieldDef` avec des keys distincts (`features.0.title`, `features.1.title`…). `updateSectionField` reçoit ce path string et le résoudra via un helper `setNestedValue(obj, 'features.0.title', value)` à créer dans `store.ts` (T3 ou ici).

**Files:**
- Créer `src/components/editor/editors/registry.ts`
- Créer `src/components/editor/__tests__/editors/registry.test.ts`

**Tests (registry.test.ts) :**
- `SECTION_REGISTRY` exporte un tableau de 21 `SectionSchema`
- Chaque schema a un `sectionKey` unique
- Chaque schema a au moins 1 groupe avec au moins 1 field
- Chaque `FieldDef.type` est une valeur valide de `FieldType`
- `trust_badges_payment` est présent dans le registry
- `social_proof_bar` a un champ `rating` de type `select`

**Done when:** 6 tests de schema integrity PASS, 21 schemas déclarés. TS strict 0 erreur.

- [ ] Écrire `registry.test.ts` (RED)
- [ ] Implémenter `registry.ts` (GREEN)
- [ ] `npx vitest run src/components/editor/__tests__/editors/` → PASS
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] `git add src/components/editor/editors/ src/components/editor/__tests__/editors/ && git commit -m "feat(editor): registry 21 section schemas (chantier C2)"`

---

### T8 — `SectionEditor.tsx` dispatcher (TDD)

**Why:** Composant pivot : lit le registry + le store, rend les fields dynamiquement. Sa logique doit être testée indépendamment de PanelRight.

**What:** `SectionEditor` reçoit `(sectionId: string, sectionKey: SectionKey)` et :
1. Trouve le `SectionSchema` dans le registry
2. Pour chaque group, rend un header de groupe + les fields
3. Pour chaque field, lit `store.sectionData[sectionId][field.key]` (ou la valeur par défaut depuis `landingData`) et instancie le bon renderer
4. `onChange` appelle `store.updateSectionField(sectionId, field.key, value)` ou `store.updateVisualSetting(sectionId, patch)` selon `field.target`

**Pattern de lecture de la valeur** (résolution des nested paths) :
```ts
function resolveValue(landingData: LandingPageData, sectionData: Record<string, unknown>, fieldPath: string): unknown {
  // sectionData prend priorité sur landingData
  if (fieldPath in sectionData) return sectionData[fieldPath]
  return getNestedValue(landingData, fieldPath)  // helper lodash-like sans lodash
}
```

**Files:**
- Créer `src/components/editor/SectionEditor.tsx`
- Créer `src/components/editor/__tests__/SectionEditor.test.ts`

**Tests :**
1. Render `SectionEditor` avec `sectionKey='story'` → rend les labels définis dans le schema (ex: "Histoire PAS" group, champ "Titre")
2. Changement d'un `TextField` → `store.updateSectionField` appelé avec le bon path et la bonne valeur
3. Section inconnue (sectionKey pas dans le registry) → rend un message "Editor non disponible" sans crash
4. `FieldDef.target='visualSettings'` → `store.updateVisualSetting` appelé (pas `updateSectionField`)

**Done when:** 4 tests PASS. TS 0 erreur.

- [ ] Écrire `SectionEditor.test.ts` (RED)
- [ ] Implémenter `SectionEditor.tsx` (GREEN)
- [ ] `npx vitest run src/components/editor/__tests__/SectionEditor.test.ts` → PASS
- [ ] `git add src/components/editor/SectionEditor.tsx src/components/editor/__tests__/SectionEditor.test.ts && git commit -m "feat(editor): SectionEditor dispatcher registry → field renderers (chantier C2)"`

---

### T9 — `PanelRight.tsx` + `AutoSaveIndicator.tsx` (TDD)

**Why:** Le slide-in est le conteneur visible. Les tests vérifient l'animation et le câblage store → selectedSection.

**What:**

`PanelRight.tsx` :
- Position `fixed` à droite, top=52px (topbar), width=360px, height `calc(100vh - 52px)`
- `transform: translateX(0)` quand `subPanelEditOpen=true`, `translateX(100%)` sinon
- Transition 280ms cubic-bezier identique à `SubPanelEdit` existant (cohérence)
- Header : nom de section + bouton fermer (croix)
- Body scrollable : `<SectionEditor sectionId={editingSectionId} sectionKey={section.key} />`
- Footer : `AutoSaveIndicator`

`AutoSaveIndicator.tsx` :
- Lit `store.saveStatus` et `store.lastSavedAt`
- `idle` → rien affiché
- `saving` → "Sauvegarde..." (gris)
- `saved` → "Sauvegardé à HH:MM" (vert) — formater `lastSavedAt` avec `toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })`
- `error` → "Erreur — réessayer" (rouge) + bouton retry qui déclenche `scheduleAutoSave(pageId, 0)` (0ms = immédiat)

**Files:**
- Créer `src/components/editor/PanelRight.tsx`
- Créer `src/components/editor/AutoSaveIndicator.tsx`
- Créer `src/components/editor/__tests__/PanelRight.test.ts`

**Tests :**
1. `subPanelEditOpen=false` → PanelRight a `translateX(100%)` (style ou classe)
2. `subPanelEditOpen=true` → PanelRight a `translateX(0)`
3. `subPanelEditOpen=true` + `editingSectionId='id1'` → `SectionEditor` rendu (au moins un label du schema visible)
4. Clic sur bouton fermer → `setSubPanelEditOpen(false)` appelé
5. `saveStatus='saved'` + `lastSavedAt=new Date()` → texte "Sauvegardé à HH:MM" visible
6. `saveStatus='error'` → bouton "réessayer" visible

**Done when:** 6 tests PASS. TS 0 erreur.

- [ ] Écrire `PanelRight.test.ts` (RED)
- [ ] Implémenter `PanelRight.tsx` + `AutoSaveIndicator.tsx` (GREEN)
- [ ] `npx vitest run src/components/editor/__tests__/PanelRight.test.ts` → PASS
- [ ] `git add src/components/editor/PanelRight.tsx src/components/editor/AutoSaveIndicator.tsx src/components/editor/__tests__/PanelRight.test.ts && git commit -m "feat(editor): PanelRight slide-in + AutoSaveIndicator (chantier C2)"`

---

### T10 — Auto-save : câblage store → Supabase (TDD avec fake timers)

**Why:** L'auto-save est le feature la plus risquée (perte de données si bug). Tester le debounce avec fake timers avant d'intégrer le vrai appel Supabase.

**What:** Implémenter `scheduleAutoSave` dans le store pour appeler `supabase.from('pages').update(...)` avec `json_content` assemblé depuis `landingData` + `sectionData` + `_editor_state`. Le store ne doit pas importer Supabase directement (dépendance difficile à tester). À la place, `scheduleAutoSave` accepte un callback `onSave: (json: object) => Promise<void>` injecté par `EditorRoot`.

Architecture :
```ts
// store.ts
scheduleAutoSave(pageId: string, onSave: (jsonForDb: object) => Promise<void>): void {
  // Annule le debounce précédent
  if (state.autoSaveTimerRef) clearTimeout(state.autoSaveTimerRef)
  state.autoSaveTimerRef = setTimeout(async () => {
    set({ saveStatus: 'saving' })
    const jsonForDb = buildJsonForDb(state)  // assemble landingData + sectionData + _editor_state
    try {
      await onSave(jsonForDb)
      set({ saveStatus: 'saved', lastSavedAt: new Date() })
    } catch {
      // Retry 1x après 2s
      setTimeout(async () => {
        try {
          await onSave(jsonForDb)
          set({ saveStatus: 'saved', lastSavedAt: new Date() })
        } catch {
          set({ saveStatus: 'error' })
        }
      }, 2000)
    }
  }, 3000)
}
```

**EditorRoot** fournit le callback `onSave` via prop (déjà en place C1) et le passe au store via une action `setAutoSaveCallback(cb)` ou directement dans `scheduleAutoSave`.

**Files:**
- Modifier `src/components/editor/store.ts` (implémenter le debounce réel + `buildJsonForDb`)
- Modifier `src/components/editor/EditorRoot.tsx` (passer `onSave` callback au store)
- Modifier `src/components/editor/__tests__/store-c2.test.ts` (ajouter cas debounce + retry)

**Tests (à ajouter dans store-c2.test.ts) :**
1. `scheduleAutoSave('page1', mockSave)` → `mockSave` NON appelé avant 3000ms (fake timers)
2. `scheduleAutoSave` 2x rapidement → `mockSave` appelé 1 seule fois après 3000ms
3. `mockSave` qui throw → retry après 2000ms → `mockSave` appelé 2 fois total, `saveStatus='error'` si 2e throw
4. `buildJsonForDb` retourne un objet avec `_editor_state.sectionOrder`, `_editor_state.visualSettings`, les champs `sectionData` mergés dans `landingData`

**Done when:** 4 nouveaux tests PASS. Fake timers fonctionnent (`vi.useFakeTimers()`). TS 0 erreur.

- [ ] Écrire les 4 cas additionnels dans `store-c2.test.ts` (RED)
- [ ] Implémenter le debounce dans `store.ts` + `buildJsonForDb`
- [ ] Modifier `EditorRoot.tsx` pour passer le callback onSave
- [ ] `npx vitest run src/components/editor/__tests__/store-c2.test.ts` → PASS (12 tests total)
- [ ] `git add src/components/editor/store.ts src/components/editor/EditorRoot.tsx src/components/editor/__tests__/store-c2.test.ts && git commit -m "feat(editor): auto-save debounce 3s + retry 1x (chantier C2)"`

---

### T11 — Intégration `PanelRight` dans `EditorRoot` + suppression `SubPanelEdit`

**Why:** Brancher tout ensemble. `SubPanelEdit.tsx` était un proto C1, il est remplacé.

**What:**
- Importer et rendre `<PanelRight />` dans `EditorRoot.tsx` (en dehors du flux flex, `position: fixed`)
- Retirer l'import de `SubPanelEdit` et son usage
- Conserver `SubPanelEdit.tsx` comme fichier vide avec `export default null` (évite de casser d'éventuels imports indirects) ou supprimer si aucun import en dehors de `EditorRoot`
- Vérifier que le grid layout (Sidebar + PanelLeft + PreviewIframe) n'est pas compressé quand PanelRight est ouvert (les deux panels sont `position: fixed`, hors flux)

**Files:**
- Modifier `src/components/editor/EditorRoot.tsx`
- Modifier ou supprimer `src/components/editor/SubPanelEdit.tsx`

**Tests:** pas de nouveau test Vitest (l'intégration est couverte par le smoke browser). Vérifier `npx tsc --noEmit` → 0 erreur.

**Done when:** `EditorRoot` rend `PanelRight`. `SubPanelEdit` retiré. Build clean.

- [ ] Modifier `EditorRoot.tsx` pour rendre `<PanelRight />`
- [ ] Retirer `SubPanelEdit` (ou vider)
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] `npm run build` → Compiled successfully
- [ ] `npx vitest run` → 0 régression
- [ ] `git add src/components/editor/ && git commit -m "feat(editor): intégration PanelRight dans EditorRoot, retire SubPanelEdit (chantier C2)"`

---

### T12 — `SectionsList` : câbler `openSubPanelEdit` au clic label

**Why:** En C1, le clic sur le label d'une section appelle `setSelectedSection`. Il faut aussi `openSubPanelEdit` pour que PanelRight s'ouvre automatiquement. Cette action existe déjà dans le store.

**What:** Dans `SectionsList.tsx`, au clic sur le label de section, appeler séquentiellement `setSelectedSection(id)` + `openSubPanelEdit(id)`. Ou simplifier : `openSubPanelEdit` peut internally appeler `setSelectedSection` (vérifier la logique du store C1).

**Files:**
- Modifier `src/components/editor/SectionsList.tsx`
- Modifier `src/components/editor/__tests__/SectionsList.test.ts` (mettre à jour le test "sélectionne la section")

**Tests:** Vérifier que clic sur label → `subPanelEditOpen=true` + `editingSectionId=id`.

**Done when:** Clic sur label dans SectionsList → PanelRight s'ouvre avec le bon editor. Test mis à jour PASS.

- [ ] Modifier `SectionsList.tsx`
- [ ] Mettre à jour `SectionsList.test.ts`
- [ ] `npx vitest run src/components/editor/__tests__/SectionsList.test.ts` → PASS
- [ ] `git add src/components/editor/SectionsList.tsx src/components/editor/__tests__/SectionsList.test.ts && git commit -m "feat(editor): SectionsList câble openSubPanelEdit au clic label (chantier C2)"`

---

### T13 — Smoke test E2E browser (golden path)

**Why:** `superpowers:verification-before-completion` — preuve que le golden path fonctionne en dehors des tests unitaires.

**What:** Lancer `npm run dev` avec `NEXT_PUBLIC_KONVERT_NEW_EDITOR=true`. Ouvrir une page existante dans le dashboard. Vérifier manuellement :
1. L'éditeur se charge (EditorRoot affiché, pas de GrapesEditor)
2. SectionsList affiche les sections de la page
3. Clic sur "Histoire (PAS)" → PanelRight s'ouvre à droite avec les fields du story editor
4. Modifier le champ "Titre" → la preview se met à jour dans les 200ms (debounce iframe)
5. Modifier un champ color → la section change de couleur dans la preview
6. Attendre 3 secondes sans toucher → AutoSaveIndicator affiche "Sauvegardé à HH:MM"
7. Recharger la page → les modifications sont persistées (elles reviennent du JSON content en DB)
8. Feature flag `NEXT_PUBLIC_KONVERT_NEW_EDITOR=false` → GrapesEditor (legacy) s'affiche, pas de régression

**Files:** aucun (tests manuels)

**Tests:** vérification manuelle — résultat noté en commentaire du commit.

**Done when:** les 8 points validés manuellement.

- [ ] `npm run dev`
- [ ] Ouvrir `/dashboard/new?page_id=<id_existant>`
- [ ] Valider les 8 points ci-dessus
- [ ] `git commit --allow-empty -m "chore(smoke): golden path C2 validé manuellement — 8 points OK"`

---

### T14 — Vérification finale + PR

**Why:** Checklist pré-merge obligatoire.

**What:**
- `npm run build` → Compiled successfully
- `npm run lint` → 0 erreur sur les fichiers C2
- `npx vitest run` → tous PASS (~245+ tests : 208 C1 + ~37 nouveaux C2)
- `npx tsc --noEmit` → 0 erreur
- Pas de `console.log` oublié dans les fichiers C2
- Push + PR vers `main`

**Files:** N/A (opération git + GitHub)

**Done when:** PR ouverte, tous les checks verts.

- [ ] `npm run build 2>&1 | tail -10` → Compiled successfully
- [ ] `npm run lint 2>&1 | grep -E "(error|warning)" | grep -v "node_modules" | head -10` → 0 erreur
- [ ] `npx vitest run 2>&1 | tail -5` → tous PASS
- [ ] `npx tsc --noEmit 2>&1 | grep error | head -5` → 0
- [ ] Vérifier absence de `console.log` : `grep -r "console.log" src/components/editor/ src/lib/templates/ --include="*.ts" --include="*.tsx" | grep -v ".test." | grep -v "node_modules"` → 0 résultat
- [ ] `git push -u origin feat/editor-settings-panel`
- [ ] Ouvrir PR via `gh pr create` ou GitHub UI
- [ ] `git commit --allow-empty -m "chore: C2 settings panel terminé — PR ouverte"`

---

## Risques & rollback

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Nested path resolver (`features.0.title`) bugué → mauvaise valeur sauvegardée | Moyenne | Élevé | Tester `buildJsonForDb` + `resolveValue` exhaustivement en T10 ; utiliser une implémentation simple (split par `.`, réduction) sans dépendances |
| `renderRichSections` + `visualSettings` : les 21 renderers ne lisent pas tous `bgColor`/`padding` → override silencieusement ignoré | Moyenne | Moyen | Envelopper le HTML rendu au niveau de `renderRichSections` (T4), pas dans chaque renderer — 1 seul point de changement |
| PanelRight + PanelLeft ouverts simultanément → overlap visuel sur petits écrans | Faible | Faible | PanelLeft et PanelRight sont en `position:fixed` : gauche 0 / droite 0, pas de collision. Sur < 1024px on peut fermer automatiquement Panel gauche à l'ouverture de PanelRight |
| Auto-save race condition : 2 saves simultanés (debounce + save manuel) → dernière écriture gagne | Faible | Moyen | Le bouton Sauvegarder manuel annule le timer debounce (`clearTimeout`) avant d'appeler `onSave` |
| react-colorful introduit une regression dans le bundle (import côté SSR) | Faible | Faible | `PanelRight` est `'use client'`, `ColorField` aussi — jamais rendu côté serveur |
| `trust_badges_payment` : `hasDataForSection` ne couvre pas cette clé → toujours `visible:false` pour les legacy pages | Confirmé C1 | Faible | Ajouter le case dans le switch `hasDataForSection` en T3 ; hors scope C2 si pas de data `trust_badges` dans les pages existantes |

**Rollback :** `vercel env set NEXT_PUBLIC_KONVERT_NEW_EDITOR false` → retour à GrapesEditor sans rebuild. Aucune migration DB : `json_content` est rétrocompatible (`_editor_state` est ignoré par l'ancien éditeur).

---

## Done when (critères de merge)

- [ ] `npm run build` PASS (TypeScript + bundle)
- [ ] `npm run lint` PASS (0 erreur scope C2)
- [ ] `npx vitest run` PASS (~245 tests, 0 régression C1)
- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] Golden path validé manuellement (T13 — 8 points)
- [ ] Feature flag OFF (`NEXT_PUBLIC_KONVERT_NEW_EDITOR=false`) → GrapesEditor intact, 0 régression
- [ ] 21 section editors câblés dans le registry (y compris `trust_badges_payment`)
- [ ] Auto-save fonctionnel : debounce 3s + indicateur visuel + retry 1x
- [ ] `overrides.visualSettings` câblé dans `renderTemplate` → preview reflète bgColor/padding/alignment
- [ ] `SubPanelEdit.tsx` retiré ou vidé proprement
- [ ] PR description avec screenshots PanelRight ouvert + AutoSaveIndicator + preview update
- [ ] Pas de `console.log` en dehors des tests

---

## Estimation totale

| Task | Effort |
|---|---|
| T0 Setup branche | 5 min |
| T1 react-colorful | 5 min |
| T2 Types SectionSchema | 20 min |
| T3 Store C2 actions + tests | 1h30 |
| T4 renderTemplate visualSettings + tests | 1h |
| T5 PreviewIframe getRenderOverrides | 30 min |
| T6 7 field renderers TDD | 2h |
| T7 Registry 21 editors | 2h |
| T8 SectionEditor dispatcher | 1h |
| T9 PanelRight + AutoSaveIndicator | 1h |
| T10 Auto-save debounce câblage | 1h30 |
| T11 Intégration EditorRoot | 30 min |
| T12 SectionsList câblage openSubPanelEdit | 20 min |
| T13 Smoke browser | 30 min |
| T14 Vérification finale + PR | 30 min |

**Total estimé : ~13h** sur 2 jours de dev focus.

---

## Suite logique (sous-chantiers suivants)

- **C3 — Sections ajoutables** : bouton "+" dans SectionsList pour cloner une SectionInstance. ~1 sem
- **C4 — Blocks library** : 18 nouveaux blocks (renderers + editors + tests). ~3 sem
- **C5 — Global Styles** : PanelLeft mode Styles (palette + font). ~0.5 sem
- **ImageField upgrade** : swapper URL texte → upload Supabase Storage en réutilisant `/api/upload-image/route.ts` existant. ~0.5 jour
