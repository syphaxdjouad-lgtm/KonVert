# KONVERT — Chantier C1 : Editor Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer `GrapesEditor.tsx` par une nouvelle architecture React custom (EditorRoot + Sidebar + PanelLeft mode Sections + PreviewIframe iframe) qui pilote `LandingPageData` via Zustand, supporte le drag-drop des sections et permet la migration big bang des landings legacy.

**Architecture:** Zustand store comme source unique de vérité (`EditorState` = `landingData` + `sectionOrder`). PreviewIframe re-render via `renderTemplate(templateId, landingData, { sectionOrder })` en debounce 200ms. Drag-drop `@dnd-kit/sortable`. Migration : si `pages.json_content._editor_state` absent → hydrate defaults depuis `DEFAULT_ORDER`. Feature flag `KONVERT_NEW_EDITOR` pour rollback vers GrapesEditor.

**Tech Stack:** React 18, TypeScript strict, Zustand 4.x, @dnd-kit/core + @dnd-kit/sortable, uuid, Vitest, Next.js 16 App Router, Supabase client.

**Spec source:** `docs/superpowers/specs/2026-05-25-konvert-chantier-c-editor-design.md`

**Branche prévue :** `feat/editor-foundation` (créée depuis `main` qui contient déjà chantiers A + B + A.5 + fix save)

---

## File Structure (vue d'ensemble)

```
konvert/
├── src/
│   ├── types/
│   │   └── editor.ts                              [CREATE] EditorState + types
│   ├── components/editor/
│   │   ├── EditorRoot.tsx                         [CREATE] orchestrateur + hydratation
│   │   ├── Sidebar.tsx                            [CREATE] 48px verticale, 4 icônes
│   │   ├── PanelLeft.tsx                          [CREATE] 320px, switch modes
│   │   ├── SectionsList.tsx                       [CREATE] dnd + toggle + supprimer
│   │   ├── PreviewIframe.tsx                      [CREATE] iframe srcdoc + debounce
│   │   ├── DeviceSwitcher.tsx                     [CREATE] desktop/tablet/mobile
│   │   ├── store.ts                               [CREATE] Zustand + actions
│   │   └── __tests__/
│   │       ├── store.test.ts                      [CREATE]
│   │       ├── SectionsList.test.ts               [CREATE]
│   │       ├── PreviewIframe.test.ts              [CREATE]
│   │       └── migration.test.ts                  [CREATE]
│   ├── lib/templates/
│   │   ├── sections.ts                            [MODIFY] renderRichSections accepte sectionOrder
│   │   ├── index.ts                               [MODIFY] renderTemplate accepte overrides
│   │   └── __tests__/
│   │       └── render-template-overrides.test.ts  [CREATE]
│   └── app/(dashboard)/dashboard/new/
│       └── page.tsx                               [MODIFY] BuilderLoader → EditorRoot conditionné par flag
├── .env.example                                   [MODIFY] +KONVERT_NEW_EDITOR=true
├── package.json                                   [MODIFY] +@dnd-kit/core @dnd-kit/sortable zustand uuid
└── docs/superpowers/plans/
    └── 2026-05-25-konvert-chantier-c1-foundation.md [CE FICHIER]
```

**Responsabilités par fichier :**

- `types/editor.ts` — Types `EditorState`, `SectionInstance`, `VisualSettings`, `GlobalStyles`, `PanelMode`, `Device`, `EditorActions`
- `store.ts` — Zustand `useEditorStore` + actions `hydrate`, `moveSection`, `toggleVisible`, `removeSection`, `setSelectedSection`, `setPanelMode`, `setDevice`
- `EditorRoot.tsx` — Composant top-level qui hydrate le store depuis `pages.json_content`, log Sentry warning si legacy page, rend Sidebar + PanelLeft + PreviewIframe
- `Sidebar.tsx` — 48px verticale, 4 boutons icône (Sections actif C1, Blocks/Styles/Settings disabled = grayed C1)
- `PanelLeft.tsx` — 320px, switch entre modes via `panelMode`, C1 affiche uniquement `SectionsList`
- `SectionsList.tsx` — Liste re-orderable avec `@dnd-kit/sortable`, chaque row a un drag handle + label + toggle visibility + bouton supprimer
- `PreviewIframe.tsx` — iframe avec `srcdoc` calculé depuis store, debounce 200ms, width responsive selon device
- `DeviceSwitcher.tsx` — 3 boutons toggle (desktop / tablet / mobile)
- `sections.ts` — `renderRichSections` modifié pour itérer sur `sectionOrder` si fourni (instances visibles seulement) au lieu de `DEFAULT_ORDER`
- `index.ts` (templates) — `renderTemplate` étendu avec param optionnel `overrides`
- `page.tsx` — Si `KONVERT_NEW_EDITOR=true`, instancie `EditorRoot` à la place de `BuilderLoader`

---

## Convention de commit

Préfixes cohérents avec l'historique git :

- `feat(editor):` ajout fonctionnel dans `src/components/editor/`
- `feat(sections):` modif `sections.ts` pour overrides
- `feat(templates):` modif `index.ts` pour renderTemplate signature
- `test(editor):` tests Vitest dans `__tests__/`
- `chore(deps):` install dépendances npm
- `chore(env):` `.env.example`
- `refactor(dashboard):` swap GrapesEditor → EditorRoot dans page.tsx

---

### Task 0 : Setup branche feature

**Files:** N/A (opération git)

- [ ] **Step 1 : Vérifier état courant**

Run :
```bash
cd /Users/mac/nexara/konvert && git status && git branch --show-current && git log --oneline -3
```
Expected : sur `main`, working tree clean ou modifs non-liées (sitemap.ts tolérée). Si modifs critiques non commitées, les stash.

- [ ] **Step 2 : Pull main pour être à jour**

Run :
```bash
cd /Users/mac/nexara/konvert && git pull origin main
```
Expected : `Already up to date` ou fast-forward propre.

- [ ] **Step 3 : Créer la branche feature**

Run :
```bash
cd /Users/mac/nexara/konvert && git checkout -b feat/editor-foundation
```
Expected : `Switched to a new branch 'feat/editor-foundation'`

- [ ] **Step 4 : Vérifier la branche**

Run :
```bash
git branch --show-current
```
Expected : `feat/editor-foundation`

---

### Task 1 : Installer dépendances (Zustand + dnd-kit + uuid)

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1 : Installer les dépendances**

Run :
```bash
cd /Users/mac/nexara/konvert && npm install zustand@^4.5.0 @dnd-kit/core@^6.1.0 @dnd-kit/sortable@^8.0.0 @dnd-kit/utilities@^3.2.2 uuid@^9.0.0
npm install -D @types/uuid@^9.0.0
```
Expected : packages installés, pas d'erreur peer dep majeure.

- [ ] **Step 2 : Vérifier installation**

Run :
```bash
cd /Users/mac/nexara/konvert && npm list zustand @dnd-kit/sortable uuid 2>&1 | head -10
```
Expected : versions affichées sans `(empty)` ou `missing`.

- [ ] **Step 3 : Vérifier que rien n'est cassé côté build**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 4 : Vérifier que les tests existants passent encore**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -5
```
Expected : tous PASS (suite avant chantier C = ~170 tests).

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add package.json package-lock.json
git commit -m "chore(deps): zustand + @dnd-kit + uuid pour chantier C1 editor"
```

---

### Task 2 : Types `EditorState` (TDD)

**Files:**
- Create: `src/types/editor.ts`

- [ ] **Step 1 : Créer le fichier de types**

Créer `src/types/editor.ts` :

```ts
import type { LandingPageData } from './index'
import type { SectionKey } from '@/lib/templates/sections'

// Une instance de section dans la timeline éditeur. Permet d'avoir plusieurs
// instances d'une même SectionKey (ex: 2 zones testimonials différentes).
// Chantier C1 : seules les sections du chantier A (DEFAULT_ORDER) sont supportées.
// Chantier C3 : ajoutera la possibilité de cloner.
// Chantier C4 : ajoutera de nouvelles SectionKey (countdown, video_embed, etc.).
export interface SectionInstance {
  id: string              // uuid stable (clé React + dnd)
  key: SectionKey
  visible: boolean
  data?: Record<string, unknown>  // override de landingData pour cette instance (C3+)
}

// Tweaks visuels par instance (chantier C2). C1 : type défini mais inutilisé.
export interface VisualSettings {
  [sectionId: string]: {
    padding?: 'sm' | 'md' | 'lg'
    bgColor?: string
    alignment?: 'left' | 'center' | 'right'
    hiddenElements?: string[]
  }
}

// Palette globale (chantier C5). C1 : type défini mais inutilisé.
export interface GlobalStyles {
  primary?: string
  accent?: string
  fontFamily?: string
  radius?: string
}

// État complet de l'éditeur. Persisté dans pages.json_content._editor_state.
export interface EditorState {
  templateId: string
  landingData: LandingPageData
  sectionOrder: SectionInstance[]
  visualSettings: VisualSettings
  globalStyles: GlobalStyles
}

export type PanelMode = 'sections' | 'blocks' | 'styles' | 'settings'
export type Device = 'desktop' | 'tablet' | 'mobile'
```

- [ ] **Step 2 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "src/types/editor" | head -5
```
Expected : 0 erreur sur ce fichier.

- [ ] **Step 3 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/types/editor.ts
git commit -m "feat(editor): types EditorState + SectionInstance (chantier C1)"
```

---

### Task 3 : Zustand store `useEditorStore` (TDD)

**Files:**
- Create: `src/components/editor/__tests__/store.test.ts`
- Create: `src/components/editor/store.ts`

- [ ] **Step 1 : Écrire les tests pour le store**

Créer `src/components/editor/__tests__/store.test.ts` :

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '../store'
import type { EditorState, SectionInstance } from '@/types/editor'
import type { LandingPageData } from '@/types'

const fakeLandingData: LandingPageData = {
  headline: 'H',
  subtitle: 'S',
  benefits: ['b'],
  faq: [],
  cta: 'CTA',
  urgency: 'U',
  product_name: 'P',
}

const fakeSections: SectionInstance[] = [
  { id: 'id1', key: 'social_proof_bar', visible: true },
  { id: 'id2', key: 'story', visible: true },
  { id: 'id3', key: 'testimonials', visible: false },
]

describe('useEditorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      templateId: '',
      landingData: { ...fakeLandingData },
      sectionOrder: [],
      visualSettings: {},
      globalStyles: {},
      selectedSectionId: null,
      panelMode: 'sections',
      device: 'desktop',
    })
  })

  describe('hydrate', () => {
    it('charge un EditorState complet dans le store', () => {
      const state: EditorState = {
        templateId: 'etec-blue',
        landingData: fakeLandingData,
        sectionOrder: fakeSections,
        visualSettings: {},
        globalStyles: {},
      }
      useEditorStore.getState().hydrate(state)
      const s = useEditorStore.getState()
      expect(s.templateId).toBe('etec-blue')
      expect(s.sectionOrder).toHaveLength(3)
      expect(s.landingData.headline).toBe('H')
    })
  })

  describe('moveSection', () => {
    it('déplace une section par index source → cible', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(0, 2)
      const order = useEditorStore.getState().sectionOrder
      expect(order.map(s => s.id)).toEqual(['id2', 'id3', 'id1'])
    })

    it('no-op si index identiques', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(1, 1)
      const order = useEditorStore.getState().sectionOrder
      expect(order.map(s => s.id)).toEqual(['id1', 'id2', 'id3'])
    })

    it('clamp les indices hors bornes', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().moveSection(0, 99)
      const order = useEditorStore.getState().sectionOrder
      expect(order[order.length - 1].id).toBe('id1')
    })
  })

  describe('toggleVisible', () => {
    it('toggle visible d\'une section par id', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().toggleVisible('id1')
      const section = useEditorStore.getState().sectionOrder.find(s => s.id === 'id1')
      expect(section?.visible).toBe(false)
    })

    it('toggle inverse marche en boucle', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().toggleVisible('id3')  // false → true
      const s = useEditorStore.getState().sectionOrder.find(s => s.id === 'id3')
      expect(s?.visible).toBe(true)
    })

    it('ignore les ids inconnus (no-op)', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      const before = JSON.stringify(useEditorStore.getState().sectionOrder)
      useEditorStore.getState().toggleVisible('unknown-id')
      const after = JSON.stringify(useEditorStore.getState().sectionOrder)
      expect(after).toBe(before)
    })
  })

  describe('removeSection', () => {
    it('supprime une section par id', () => {
      useEditorStore.setState({ sectionOrder: [...fakeSections] })
      useEditorStore.getState().removeSection('id2')
      const order = useEditorStore.getState().sectionOrder
      expect(order).toHaveLength(2)
      expect(order.map(s => s.id)).toEqual(['id1', 'id3'])
    })

    it('reset selectedSectionId si on supprime la section sélectionnée', () => {
      useEditorStore.setState({
        sectionOrder: [...fakeSections],
        selectedSectionId: 'id2',
      })
      useEditorStore.getState().removeSection('id2')
      expect(useEditorStore.getState().selectedSectionId).toBeNull()
    })
  })

  describe('setSelectedSection / setPanelMode / setDevice', () => {
    it('setSelectedSection met à jour l\'id', () => {
      useEditorStore.getState().setSelectedSection('id42')
      expect(useEditorStore.getState().selectedSectionId).toBe('id42')
    })
    it('setPanelMode accepte les 4 modes', () => {
      useEditorStore.getState().setPanelMode('blocks')
      expect(useEditorStore.getState().panelMode).toBe('blocks')
    })
    it('setDevice accepte les 3 devices', () => {
      useEditorStore.getState().setDevice('mobile')
      expect(useEditorStore.getState().device).toBe('mobile')
    })
  })
})
```

- [ ] **Step 2 : Lancer les tests (fail attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/store.test.ts 2>&1 | tail -10
```
Expected : tous FAIL avec `Cannot find module '../store'`.

- [ ] **Step 3 : Implémenter le store**

Créer `src/components/editor/store.ts` :

```ts
import { create } from 'zustand'
import type { EditorState, SectionInstance, VisualSettings, GlobalStyles, PanelMode, Device } from '@/types/editor'
import type { LandingPageData } from '@/types'

interface EditorActions {
  hydrate: (state: EditorState) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  toggleVisible: (id: string) => void
  removeSection: (id: string) => void
  setSelectedSection: (id: string | null) => void
  setPanelMode: (mode: PanelMode) => void
  setDevice: (device: Device) => void
}

interface EditorStore {
  // EditorState fields
  templateId: string
  landingData: LandingPageData
  sectionOrder: SectionInstance[]
  visualSettings: VisualSettings
  globalStyles: GlobalStyles
  // UI state
  selectedSectionId: string | null
  panelMode: PanelMode
  device: Device
  // Actions
  hydrate: EditorActions['hydrate']
  moveSection: EditorActions['moveSection']
  toggleVisible: EditorActions['toggleVisible']
  removeSection: EditorActions['removeSection']
  setSelectedSection: EditorActions['setSelectedSection']
  setPanelMode: EditorActions['setPanelMode']
  setDevice: EditorActions['setDevice']
}

const emptyLanding: LandingPageData = {
  headline: '', subtitle: '', benefits: [], faq: [],
  cta: '', urgency: '', product_name: '',
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export const useEditorStore = create<EditorStore>((set, get) => ({
  templateId: '',
  landingData: emptyLanding,
  sectionOrder: [],
  visualSettings: {},
  globalStyles: {},
  selectedSectionId: null,
  panelMode: 'sections',
  device: 'desktop',

  hydrate: (state) => set({
    templateId: state.templateId,
    landingData: state.landingData,
    sectionOrder: state.sectionOrder,
    visualSettings: state.visualSettings,
    globalStyles: state.globalStyles,
    selectedSectionId: null,
  }),

  moveSection: (fromIndex, toIndex) => set(state => {
    const order = [...state.sectionOrder]
    if (order.length === 0) return state
    const from = clamp(fromIndex, 0, order.length - 1)
    const to = clamp(toIndex, 0, order.length - 1)
    if (from === to) return state
    const [moved] = order.splice(from, 1)
    order.splice(to, 0, moved)
    return { sectionOrder: order }
  }),

  toggleVisible: (id) => set(state => ({
    sectionOrder: state.sectionOrder.map(s =>
      s.id === id ? { ...s, visible: !s.visible } : s
    ),
  })),

  removeSection: (id) => set(state => ({
    sectionOrder: state.sectionOrder.filter(s => s.id !== id),
    selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
  })),

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  setPanelMode: (mode) => set({ panelMode: mode }),
  setDevice: (device) => set({ device }),
}))
```

- [ ] **Step 4 : Lancer les tests (pass attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/store.test.ts 2>&1 | tail -10
```
Expected : tous les tests PASS (10 tests).

- [ ] **Step 5 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 6 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/store.ts src/components/editor/__tests__/store.test.ts
git commit -m "feat(editor): Zustand useEditorStore + actions TDD (chantier C1)"
```

---

### Task 4 : Extension `renderRichSections` pour accepter `sectionOrder` (TDD)

**Files:**
- Create: `src/lib/templates/__tests__/render-template-overrides.test.ts`
- Modify: `src/lib/templates/sections.ts` (signature de `renderRichSections`)
- Modify: `src/lib/templates/index.ts` (signature de `renderTemplate`)

- [ ] **Step 1 : Écrire les tests pour l'extension**

Créer `src/lib/templates/__tests__/render-template-overrides.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { renderRichSections, DEFAULT_THEME, DEFAULT_ORDER } from '../sections'
import { renderTemplate } from '../index'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import type { SectionInstance } from '@/types/editor'

describe('renderRichSections — overrides.sectionOrder (chantier C1)', () => {
  it('comportement legacy preservé : sans sectionOrder, utilise DEFAULT_ORDER', () => {
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME)
    // Toutes les sections avec data sont rendues
    expect(html.length).toBeGreaterThan(1000)
  })

  it('respecte sectionOrder fourni (ordre custom)', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'guarantee', visible: true },
      { id: 'b', key: 'story', visible: true },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    const guaranteeIdx = html.indexOf(mockLandingDataFull.guarantee!.title)
    const storyIdx = html.indexOf(mockLandingDataFull.story!.problem)
    expect(guaranteeIdx).toBeGreaterThan(-1)
    expect(storyIdx).toBeGreaterThan(-1)
    // guarantee doit apparaître avant story dans le HTML
    expect(guaranteeIdx).toBeLessThan(storyIdx)
  })

  it('skippe les sections invisible:false', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'story', visible: true },
      { id: 'b', key: 'testimonials', visible: false },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    expect(html).toContain(mockLandingDataFull.story!.problem)
    // testimonials caché → son texte ne doit pas apparaître
    expect(html).not.toContain(mockLandingDataFull.testimonials![0].text)
  })

  it('accepte des SectionKey inconnues (skip silencieux)', () => {
    const customOrder = [
      { id: 'a', key: 'story' as const, visible: true },
      { id: 'b', key: 'inconnue' as never, visible: true },
    ]
    const html = renderRichSections(mockLandingDataFull, DEFAULT_THEME, customOrder)
    expect(html).toContain(mockLandingDataFull.story!.problem)
    expect(html).not.toContain('inconnue')
  })

  it('liste vide → ""', () => {
    expect(renderRichSections(mockLandingDataFull, DEFAULT_THEME, [])).toBe('')
  })
})

describe('renderTemplate — overrides.sectionOrder (chantier C1)', () => {
  it('comportement legacy preservé : sans overrides, rend normalement', () => {
    const html = renderTemplate('etec-blue', mockLandingDataFull)
    expect(html).toContain('<!DOCTYPE html')
    expect(html.length).toBeGreaterThan(5000)
  })

  it('avec overrides.sectionOrder, applique l\'ordre custom dans la section riche', () => {
    const customOrder: SectionInstance[] = [
      { id: 'a', key: 'guarantee', visible: true },
      { id: 'b', key: 'story', visible: true },
    ]
    const html = renderTemplate('etec-blue', mockLandingDataFull, { sectionOrder: customOrder })
    const guaranteeIdx = html.indexOf(mockLandingDataFull.guarantee!.title)
    const storyIdx = html.indexOf(mockLandingDataFull.story!.problem)
    expect(guaranteeIdx).toBeLessThan(storyIdx)
  })
})
```

- [ ] **Step 2 : Lancer les tests (fail attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/render-template-overrides.test.ts 2>&1 | tail -10
```
Expected : tests qui passent `sectionOrder` en 3e arg → TS erreurs (signature actuelle accepte `order?: SectionKey[]`).

- [ ] **Step 3 : Modifier la signature de `renderRichSections` dans `sections.ts`**

Ouvrir `src/lib/templates/sections.ts`. Trouver `renderRichSections` (vers ligne 859) :

```ts
// AVANT
export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[],
): string {
  if (process.env.KONVERT_RICH_SECTIONS === 'false') return ''
  const keys = order ?? DEFAULT_ORDER
  return keys
    .map(key => {
      const renderer = SECTION_RENDERERS[key]
      if (!renderer) return ''
      return renderer(data, theme)
    })
    .filter(html => html.trim().length > 0)
    .join('\n')
}
```

Remplacer par :

```ts
// Le 3e param accepte soit un SectionKey[] (legacy, chantiers A/B), soit un
// SectionInstance[] (chantier C1+ avec id + visibility). On détecte le type
// par la présence du champ `id`.
import type { SectionInstance } from '@/types/editor'

export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[] | SectionInstance[],
): string {
  if (process.env.KONVERT_RICH_SECTIONS === 'false') return ''

  // Cas 1 : pas d'order → DEFAULT_ORDER (comportement chantier A)
  if (!order) {
    return DEFAULT_ORDER
      .map(key => SECTION_RENDERERS[key]?.(data, theme) ?? '')
      .filter(html => html.trim().length > 0)
      .join('\n')
  }

  // Cas 2 : array vide → ""
  if (order.length === 0) return ''

  // Cas 3 : détecter SectionInstance[] vs SectionKey[]
  const isInstanceArray = typeof order[0] === 'object' && order[0] !== null && 'id' in order[0]

  if (isInstanceArray) {
    return (order as SectionInstance[])
      .filter(s => s.visible)
      .map(s => SECTION_RENDERERS[s.key]?.(data, theme) ?? '')
      .filter(html => html.trim().length > 0)
      .join('\n')
  }

  // Legacy : SectionKey[]
  return (order as SectionKey[])
    .map(key => SECTION_RENDERERS[key]?.(data, theme) ?? '')
    .filter(html => html.trim().length > 0)
    .join('\n')
}
```

- [ ] **Step 4 : Modifier la signature de `renderTemplate` dans `index.ts`**

Localiser `renderTemplate` (vers ligne 182). Il appelle `renderRichSections(data, theme)` quelque part. Étendre :

```bash
cd /Users/mac/nexara/konvert && grep -n "renderTemplate\|renderRichSections" src/lib/templates/index.ts | head -10
```

Lire la fonction actuelle, puis modifier :

```ts
// AVANT (signature actuelle)
export function renderTemplate(templateId: string, data: LandingPageData): string {
  const template = TEMPLATES_BY_ID[templateId]
  if (!template) throw new Error(`Template inconnu: ${templateId}`)
  return template.render(data)
}
```

Remplacer par :

```ts
import type { SectionInstance, VisualSettings, GlobalStyles } from '@/types/editor'

export interface TemplateOverrides {
  sectionOrder?: SectionInstance[]
  visualSettings?: VisualSettings   // ignoré en C1, supporté en C2
  globalStyles?: GlobalStyles       // ignoré en C1, supporté en C5
}

export function renderTemplate(
  templateId: string,
  data: LandingPageData,
  overrides?: TemplateOverrides,
): string {
  const template = TEMPLATES_BY_ID[templateId]
  if (!template) throw new Error(`Template inconnu: ${templateId}`)

  // C1 : on injecte sectionOrder dans data via un champ caché que
  // renderRichSections lit. Plus simple que de modifier la signature
  // de chaque template.render() (42 fonctions). Le champ commence
  // par _ pour éviter collision avec LandingPageData.
  if (overrides?.sectionOrder) {
    const augmented = { ...data, _sectionOrder: overrides.sectionOrder }
    return template.render(augmented as LandingPageData)
  }
  return template.render(data)
}
```

**ATTENTION :** la solution ci-dessus passe `_sectionOrder` via `data` mais les templates appellent `renderRichSections(data, THEME)` sans 3e arg. Donc on doit aussi modifier `renderRichSections` pour qu'elle lise `data._sectionOrder` si présent :

Re-modifier `renderRichSections` dans `sections.ts`. **Remplacer** :

```ts
export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[] | SectionInstance[],
): string {
```

Par :

```ts
export function renderRichSections(
  data: LandingPageData,
  theme: SectionTheme = DEFAULT_THEME,
  order?: SectionKey[] | SectionInstance[],
): string {
  // Si data porte un _sectionOrder injecté par renderTemplate (chantier C1),
  // il prend priorité sur le param order (qui restera utilisé par les tests
  // directs du chantier A).
  const dataSectionOrder = (data as LandingPageData & { _sectionOrder?: SectionInstance[] })._sectionOrder
  if (dataSectionOrder) order = dataSectionOrder
```

(Garder le reste du body intact.)

- [ ] **Step 5 : Lancer les tests (pass attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/render-template-overrides.test.ts 2>&1 | tail -15
```
Expected : 7 tests PASS.

- [ ] **Step 6 : Vérifier non-régression sur les autres tests**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -8
```
Expected : tous PASS (170 chantier A/B + 10 store + 7 overrides = ~187 tests verts).

- [ ] **Step 7 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 8 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/index.ts src/lib/templates/__tests__/render-template-overrides.test.ts
git commit -m "feat(templates): renderTemplate accepte overrides.sectionOrder (chantier C1)"
```

---

### Task 5 : Composant `Sidebar.tsx`

**Files:**
- Create: `src/components/editor/Sidebar.tsx`

- [ ] **Step 1 : Créer le composant**

Créer `src/components/editor/Sidebar.tsx` :

```tsx
'use client'

import { useEditorStore } from './store'
import type { PanelMode } from '@/types/editor'

interface IconButton {
  mode: PanelMode
  icon: string
  label: string
  disabled?: boolean  // C1 : seul "sections" est actif
}

const BUTTONS: IconButton[] = [
  { mode: 'sections', icon: '📑', label: 'Sections' },
  { mode: 'blocks',   icon: '🧩', label: 'Blocks (C4)',   disabled: true },
  { mode: 'styles',   icon: '🎨', label: 'Styles (C5)',   disabled: true },
  { mode: 'settings', icon: '⚙️', label: 'Settings (C2)', disabled: true },
]

export default function Sidebar() {
  const panelMode = useEditorStore(s => s.panelMode)
  const setPanelMode = useEditorStore(s => s.setPanelMode)

  return (
    <aside className="flex flex-col items-center gap-2 bg-gray-900 py-3 px-2 w-12 flex-shrink-0">
      {BUTTONS.map(btn => (
        <button
          key={btn.mode}
          onClick={() => !btn.disabled && setPanelMode(btn.mode)}
          disabled={btn.disabled}
          title={btn.label}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-base transition-all ${
            btn.disabled
              ? 'opacity-30 cursor-not-allowed'
              : panelMode === btn.mode
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {btn.icon}
        </button>
      ))}
    </aside>
  )
}
```

- [ ] **Step 2 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "Sidebar" | head -5
```
Expected : 0 erreur.

- [ ] **Step 3 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/Sidebar.tsx
git commit -m "feat(editor): Sidebar 48px verticale + 4 icones (chantier C1)"
```

---

### Task 6 : Composant `SectionsList.tsx` (TDD)

**Files:**
- Create: `src/components/editor/__tests__/SectionsList.test.ts`
- Create: `src/components/editor/SectionsList.tsx`

- [ ] **Step 1 : Écrire les tests basiques (render only — pas de DnD en jsdom)**

Créer `src/components/editor/__tests__/SectionsList.test.ts` :

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionsList from '../SectionsList'
import { useEditorStore } from '../store'
import type { SectionInstance } from '@/types/editor'
import React from 'react'

const fakeSections: SectionInstance[] = [
  { id: 'id1', key: 'social_proof_bar', visible: true },
  { id: 'id2', key: 'story', visible: true },
  { id: 'id3', key: 'testimonials', visible: false },
]

describe('SectionsList', () => {
  beforeEach(() => {
    useEditorStore.setState({
      sectionOrder: [...fakeSections],
      selectedSectionId: null,
    })
  })

  it('rend une row par section', () => {
    render(React.createElement(SectionsList))
    // Au moins 3 boutons de toggle (un par section)
    const toggles = screen.getAllByRole('button', { name: /Toggle visibility/i })
    expect(toggles).toHaveLength(3)
  })

  it('toggle visible au clic sur le bouton visibility', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /Toggle visibility/i })
    fireEvent.click(toggles[0])  // toggle id1
    const updated = useEditorStore.getState().sectionOrder.find(s => s.id === 'id1')
    expect(updated?.visible).toBe(false)
  })

  it('supprime au clic sur le bouton supprimer', () => {
    render(React.createElement(SectionsList))
    const removeButtons = screen.getAllByRole('button', { name: /Supprimer/i })
    fireEvent.click(removeButtons[1])  // supprime id2
    const order = useEditorStore.getState().sectionOrder
    expect(order).toHaveLength(2)
    expect(order.map(s => s.id)).toEqual(['id1', 'id3'])
  })

  it('sélectionne la section au clic sur le label', () => {
    render(React.createElement(SectionsList))
    const labels = screen.getAllByRole('button', { name: /Sélectionner/i })
    fireEvent.click(labels[2])
    expect(useEditorStore.getState().selectedSectionId).toBe('id3')
  })

  it('affiche un style différent pour les sections invisibles', () => {
    render(React.createElement(SectionsList))
    // L'élément racine de la row id3 doit avoir une classe opacity-50
    const labels = screen.getAllByRole('button', { name: /Sélectionner/i })
    expect(labels[2].className).toContain('opacity-50')
  })
})
```

- [ ] **Step 2 : Vérifier que @testing-library/react est installé**

Run :
```bash
cd /Users/mac/nexara/konvert && npm list @testing-library/react 2>&1 | head -3
```

Si manquant :
```bash
cd /Users/mac/nexara/konvert && npm install -D @testing-library/react @testing-library/dom jsdom
```

Vérifier que vitest est configuré avec environment jsdom. Run :
```bash
grep -n "environment" vitest.config.ts vite.config.ts vitest.config.mts 2>/dev/null | head -3
```

Si pas configuré, ouvrir `vitest.config.ts` (ou créer si absent) et ajouter :
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
  },
})
```

- [ ] **Step 3 : Lancer les tests (fail attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/SectionsList.test.ts 2>&1 | tail -10
```
Expected : FAIL avec `Cannot find module '../SectionsList'`.

- [ ] **Step 4 : Implémenter `SectionsList.tsx`**

Créer `src/components/editor/SectionsList.tsx` :

```tsx
'use client'

import { useEditorStore } from './store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SectionInstance } from '@/types/editor'

// Labels lisibles pour les SectionKey. Si une clé est absente, on affiche
// la SectionKey brute (cas des futurs blocks chantier C4).
const SECTION_LABELS: Record<string, string> = {
  social_proof_bar:      'Bandeau social proof',
  story:                 'Histoire (PAS)',
  target_audience:       'Pour qui c\'est',
  features:              'Caractéristiques',
  gallery:               'Galerie produit',
  unique_mechanism:      'Mécanisme unique',
  how_it_works:          'Comment ça marche',
  before_after:          'Avant / Après',
  comparison:            'Comparaison',
  competitor_comparison: 'Vs concurrents',
  testimonials:          'Témoignages',
  press_mentions:        'Mentions presse',
  founder_note:          'Mot du fondateur',
  value_stack:           'Récap valeur',
  bonuses:               'Bonus',
  guarantee:             'Garantie',
  risk_reversal:         'Réassurance',
  objections:            'Objections',
  community_callout:     'Communauté',
  final_pitch:           'Pitch final',
}

function SectionRow({ section }: { section: SectionInstance }) {
  const toggleVisible = useEditorStore(s => s.toggleVisible)
  const removeSection = useEditorStore(s => s.removeSection)
  const setSelectedSection = useEditorStore(s => s.setSelectedSection)
  const selectedSectionId = useEditorStore(s => s.selectedSectionId)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const label = SECTION_LABELS[section.key] ?? section.key
  const isSelected = selectedSectionId === section.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-2 rounded-md border ${
        isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
      } ${!section.visible ? 'opacity-50' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 text-base"
      >
        ⋮⋮
      </button>

      {/* Label cliquable (sélection) */}
      <button
        onClick={() => setSelectedSection(section.id)}
        aria-label={`Sélectionner ${label}`}
        className={`flex-1 text-left text-sm font-medium ${section.visible ? 'text-gray-900' : 'text-gray-500'} ${!section.visible ? 'opacity-50' : ''}`}
      >
        {label}
      </button>

      {/* Toggle visibility */}
      <button
        onClick={() => toggleVisible(section.id)}
        aria-label="Toggle visibility"
        title={section.visible ? 'Masquer la section' : 'Afficher la section'}
        className="w-7 h-7 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center text-sm"
      >
        {section.visible ? '👁' : '🚫'}
      </button>

      {/* Supprimer */}
      <button
        onClick={() => {
          if (confirm(`Supprimer la section "${label}" ?`)) removeSection(section.id)
        }}
        aria-label="Supprimer"
        title="Supprimer la section"
        className="w-7 h-7 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-sm"
      >
        🗑
      </button>
    </div>
  )
}

export default function SectionsList() {
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const moveSection = useEditorStore(s => s.moveSection)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = sectionOrder.findIndex(s => s.id === active.id)
    const toIndex = sectionOrder.findIndex(s => s.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    moveSection(fromIndex, toIndex)
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
        Sections ({sectionOrder.length})
      </h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sectionOrder.map(section => (
            <SectionRow key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
```

**Note :** `arrayMove` est importé mais non utilisé directement (on délègue à `moveSection` du store). Si TS strict râle sur l'import inutilisé, le retirer.

- [ ] **Step 5 : Lancer les tests (pass attendu)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/SectionsList.test.ts 2>&1 | tail -10
```
Expected : 5 tests PASS.

- [ ] **Step 6 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "editor/" | head -5
```
Expected : 0 erreur.

- [ ] **Step 7 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/SectionsList.tsx src/components/editor/__tests__/SectionsList.test.ts
git commit -m "feat(editor): SectionsList drag-drop + toggle + supprimer (chantier C1)"
```

---

### Task 7 : Composant `PanelLeft.tsx`

**Files:**
- Create: `src/components/editor/PanelLeft.tsx`

- [ ] **Step 1 : Créer le composant**

Créer `src/components/editor/PanelLeft.tsx` :

```tsx
'use client'

import { useEditorStore } from './store'
import SectionsList from './SectionsList'

export default function PanelLeft() {
  const panelMode = useEditorStore(s => s.panelMode)

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      {panelMode === 'sections' && <SectionsList />}
      {panelMode === 'blocks' && (
        <div className="p-4 text-sm text-gray-500">
          Bibliothèque de blocks à venir (chantier C4)
        </div>
      )}
      {panelMode === 'styles' && (
        <div className="p-4 text-sm text-gray-500">
          Palette globale à venir (chantier C5)
        </div>
      )}
      {panelMode === 'settings' && (
        <div className="p-4 text-sm text-gray-500">
          Réglages page à venir
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "PanelLeft" | head -5
```
Expected : 0 erreur.

- [ ] **Step 3 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/PanelLeft.tsx
git commit -m "feat(editor): PanelLeft 320px + switch panelMode (chantier C1)"
```

---

### Task 8 : Composant `PreviewIframe.tsx` (TDD)

**Files:**
- Create: `src/components/editor/__tests__/PreviewIframe.test.ts`
- Create: `src/components/editor/PreviewIframe.tsx`

- [ ] **Step 1 : Écrire les tests**

Créer `src/components/editor/__tests__/PreviewIframe.test.ts` :

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PreviewIframe from '../PreviewIframe'
import { useEditorStore } from '../store'
import { mockLandingDataFull } from '@/lib/templates/__fixtures__/mock-landing-data-full'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

describe('PreviewIframe', () => {
  beforeEach(() => {
    useEditorStore.setState({
      templateId: 'etec-blue',
      landingData: mockLandingDataFull,
      sectionOrder: DEFAULT_ORDER.map(key => ({
        id: uuidv4(),
        key,
        visible: true,
      })),
      visualSettings: {},
      globalStyles: {},
      device: 'desktop',
    })
  })

  it('rend un <iframe> dans le DOM', () => {
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
  })

  it('définit srcdoc avec le rendu de renderTemplate après le debounce', async () => {
    vi.useFakeTimers()
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')!
    // Initialement vide ou en attente
    vi.advanceTimersByTime(250)
    await waitFor(() => {
      expect(iframe.getAttribute('srcdoc')).toContain('<!DOCTYPE html')
    })
    vi.useRealTimers()
  })

  it('change la largeur selon le device', () => {
    useEditorStore.setState({ device: 'mobile' })
    render(React.createElement(PreviewIframe))
    const wrapper = document.querySelector('[data-testid="preview-wrapper"]')
    expect(wrapper?.getAttribute('style')).toContain('390px')
  })
})
```

- [ ] **Step 2 : Lancer les tests (fail)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/PreviewIframe.test.ts 2>&1 | tail -10
```
Expected : FAIL `Cannot find module '../PreviewIframe'`.

- [ ] **Step 3 : Implémenter `PreviewIframe.tsx`**

Créer `src/components/editor/PreviewIframe.tsx` :

```tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from './store'
import { renderTemplate } from '@/lib/templates'

const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
}

export default function PreviewIframe() {
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const device = useEditorStore(s => s.device)

  // srcdoc calculé avec debounce 200ms pour éviter les re-renders à chaque
  // keystroke quand on éditera depuis le panel droit (C2).
  const [srcdoc, setSrcdoc] = useState<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const renderInputs = useMemo(() => ({
    templateId, landingData, sectionOrder,
  }), [templateId, landingData, sectionOrder])

  useEffect(() => {
    if (!templateId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const html = renderTemplate(templateId, landingData, { sectionOrder })
        setSrcdoc(html)
      } catch (err) {
        console.error('[PreviewIframe] renderTemplate failed', err)
      }
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderInputs])

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex items-center justify-center p-4">
      <div
        data-testid="preview-wrapper"
        className="bg-white shadow-lg overflow-hidden transition-all duration-200"
        style={{
          width: DEVICE_WIDTHS[device],
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100%',
        }}
      >
        <iframe
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4 : Lancer les tests (pass)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/PreviewIframe.test.ts 2>&1 | tail -10
```
Expected : 3 tests PASS.

- [ ] **Step 5 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "PreviewIframe" | head -5
```
Expected : 0 erreur.

- [ ] **Step 6 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/PreviewIframe.tsx src/components/editor/__tests__/PreviewIframe.test.ts
git commit -m "feat(editor): PreviewIframe iframe + debounce 200ms + device responsive (chantier C1)"
```

---

### Task 9 : Composant `DeviceSwitcher.tsx`

**Files:**
- Create: `src/components/editor/DeviceSwitcher.tsx`

- [ ] **Step 1 : Créer le composant**

Créer `src/components/editor/DeviceSwitcher.tsx` :

```tsx
'use client'

import { useEditorStore } from './store'
import type { Device } from '@/types/editor'

const DEVICES: { key: Device; icon: string; label: string }[] = [
  { key: 'desktop', icon: '🖥', label: 'Desktop' },
  { key: 'tablet',  icon: '💻', label: 'Tablet' },
  { key: 'mobile',  icon: '📱', label: 'Mobile' },
]

export default function DeviceSwitcher() {
  const device = useEditorStore(s => s.device)
  const setDevice = useEditorStore(s => s.setDevice)

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {DEVICES.map(d => (
        <button
          key={d.key}
          onClick={() => setDevice(d.key)}
          title={d.label}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
            device === d.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {d.icon} {d.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/DeviceSwitcher.tsx
git commit -m "feat(editor): DeviceSwitcher desktop/tablet/mobile (chantier C1)"
```

---

### Task 10 : Migration helper + tests

**Files:**
- Create: `src/components/editor/__tests__/migration.test.ts`
- Modify: `src/components/editor/store.ts` (ajouter fn `hydrateFromPage`)

- [ ] **Step 1 : Écrire les tests de migration**

Créer `src/components/editor/__tests__/migration.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { hydrateFromPage } from '../store'
import { mockLandingDataFull } from '@/lib/templates/__fixtures__/mock-landing-data-full'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import type { EditorState } from '@/types/editor'

describe('hydrateFromPage (migration big bang)', () => {
  it('legacy page sans _editor_state : hydrate defaults depuis DEFAULT_ORDER', () => {
    const jsonContent = {
      ...mockLandingDataFull,
      _template_slug: 'etec-blue',
    }
    const state: EditorState = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-blue')
    expect(state.sectionOrder).toHaveLength(DEFAULT_ORDER.length)
    // visible:true pour les sections avec data
    const storyInstance = state.sectionOrder.find(s => s.key === 'story')
    expect(storyInstance?.visible).toBe(true)
    // visible:false pour les sections sans data dans la fixture
    // (mockLandingDataFull n'a pas toutes les 19 sections remplies)
  })

  it('legacy page sans _template_slug : fallback etec-blue', () => {
    const jsonContent = { ...mockLandingDataFull }
    const state = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-blue')
  })

  it('page récente avec _editor_state : préserve sectionOrder + settings', () => {
    const customSections = [
      { id: 'custom-1', key: 'story' as const, visible: true },
      { id: 'custom-2', key: 'testimonials' as const, visible: false },
    ]
    const jsonContent = {
      ...mockLandingDataFull,
      _template_slug: 'etec-noir',
      _editor_state: {
        sectionOrder: customSections,
        visualSettings: { 'custom-1': { padding: 'lg' as const } },
        globalStyles: { primary: '#FF6B35' },
      },
    }
    const state = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-noir')
    expect(state.sectionOrder).toEqual(customSections)
    expect(state.visualSettings['custom-1']?.padding).toBe('lg')
    expect(state.globalStyles.primary).toBe('#FF6B35')
  })

  it('chaque SectionInstance reçoit un id unique non vide', () => {
    const jsonContent = { ...mockLandingDataFull, _template_slug: 'etec-blue' }
    const state = hydrateFromPage(jsonContent)
    const ids = state.sectionOrder.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every(id => id.length > 0)).toBe(true)
  })
})
```

- [ ] **Step 2 : Lancer les tests (fail)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/migration.test.ts 2>&1 | tail -10
```
Expected : FAIL `hydrateFromPage is not exported`.

- [ ] **Step 3 : Ajouter `hydrateFromPage` dans `store.ts`**

Ouvrir `src/components/editor/store.ts`. Ajouter en tête de fichier :

```ts
import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import type { SectionKey } from '@/lib/templates/sections'
```

Ajouter à la fin du fichier (après la définition de `useEditorStore`) :

```ts
// Helpers pour hydrater le store depuis pages.json_content (DB Supabase).
// Gère 2 cas :
// - Legacy page (sans _editor_state) : génère sectionOrder depuis DEFAULT_ORDER
//   avec visible=true pour les sections ayant de la data
// - Page récente (avec _editor_state) : préserve l'état complet de l'éditeur

interface PageJsonContent extends LandingPageData {
  _template_slug?: string
  _editor_state?: {
    sectionOrder?: SectionInstance[]
    visualSettings?: VisualSettings
    globalStyles?: GlobalStyles
  }
}

// Heuristique : la section est "remplie" si la data correspondante est présente.
// hero_badges et price ne comptent pas (ils restent dans le hero des templates).
function hasDataForSection(data: LandingPageData, key: SectionKey): boolean {
  switch (key) {
    case 'social_proof_bar':      return !!data.social_proof
    case 'story':                 return !!data.story
    case 'target_audience':       return Array.isArray(data.target_audience) && data.target_audience.length > 0
    case 'features':              return Array.isArray(data.features) && data.features.length > 0
    case 'gallery':               return Array.isArray(data.images) && data.images.length >= 8
    case 'unique_mechanism':      return !!data.unique_mechanism
    case 'how_it_works':          return Array.isArray(data.how_it_works) && data.how_it_works.length > 0
    case 'before_after':          return Array.isArray(data.before_after) && data.before_after.length > 0
    case 'comparison':            return !!data.comparison
    case 'competitor_comparison': return !!data.competitor_comparison
    case 'testimonials':          return Array.isArray(data.testimonials) && data.testimonials.length > 0
    case 'press_mentions':        return Array.isArray(data.press_mentions) && data.press_mentions.length > 0
    case 'founder_note':          return !!data.founder_note
    case 'value_stack':           return !!data.value_stack
    case 'bonuses':               return Array.isArray(data.bonuses) && data.bonuses.length > 0
    case 'guarantee':             return !!data.guarantee
    case 'risk_reversal':         return Array.isArray(data.risk_reversal) && data.risk_reversal.length > 0
    case 'objections':            return Array.isArray(data.objections) && data.objections.length > 0
    case 'community_callout':     return !!data.community_callout
    case 'final_pitch':           return !!data.final_pitch
    default:                      return false
  }
}

export function hydrateFromPage(jsonContent: PageJsonContent): EditorState {
  const templateId = jsonContent._template_slug || 'etec-blue'
  const editorState = jsonContent._editor_state

  // Page récente : préserve l'état complet
  if (editorState?.sectionOrder) {
    return {
      templateId,
      landingData: jsonContent,
      sectionOrder: editorState.sectionOrder,
      visualSettings: editorState.visualSettings ?? {},
      globalStyles: editorState.globalStyles ?? {},
    }
  }

  // Legacy : génère sectionOrder depuis DEFAULT_ORDER, visible si data présente
  return {
    templateId,
    landingData: jsonContent,
    sectionOrder: DEFAULT_ORDER.map(key => ({
      id: uuidv4(),
      key,
      visible: hasDataForSection(jsonContent, key),
    })),
    visualSettings: {},
    globalStyles: {},
  }
}
```

**ATTENTION** : importer aussi `EditorState`, `SectionInstance`, `VisualSettings`, `GlobalStyles`, `LandingPageData` si pas déjà dans les imports.

- [ ] **Step 4 : Lancer les tests (pass)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/components/editor/__tests__/migration.test.ts 2>&1 | tail -10
```
Expected : 4 tests PASS.

- [ ] **Step 5 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 6 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/store.ts src/components/editor/__tests__/migration.test.ts
git commit -m "feat(editor): hydrateFromPage migration big bang legacy → EditorState (chantier C1)"
```

---

### Task 11 : Composant `EditorRoot.tsx` (orchestrateur)

**Files:**
- Create: `src/components/editor/EditorRoot.tsx`

- [ ] **Step 1 : Créer le composant**

Créer `src/components/editor/EditorRoot.tsx` :

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useEditorStore, hydrateFromPage } from './store'
import Sidebar from './Sidebar'
import PanelLeft from './PanelLeft'
import PreviewIframe from './PreviewIframe'
import DeviceSwitcher from './DeviceSwitcher'
import type { LandingPageData } from '@/types'

interface Props {
  // pages.json_content déjà parsé. Peut être :
  // - undefined (nouvelle page)
  // - LandingPageData legacy (sans _editor_state)
  // - LandingPageData enrichi de _template_slug et _editor_state (page récente)
  jsonContent?: LandingPageData & {
    _template_slug?: string
    _editor_state?: unknown
  }
  // Template par défaut si jsonContent absent.
  defaultTemplateId?: string
  // Callback save appelé avec l'EditorState complet.
  onSave?: (html: string, jsonForDb: object) => Promise<void>
  saving?: boolean
}

export default function EditorRoot({ jsonContent, defaultTemplateId = 'etec-blue', onSave, saving }: Props) {
  const hydrate = useEditorStore(s => s.hydrate)
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const visualSettings = useEditorStore(s => s.visualSettings)
  const globalStyles = useEditorStore(s => s.globalStyles)

  const [legacyWarningSent, setLegacyWarningSent] = useState(false)

  // Hydrate au mount uniquement
  useEffect(() => {
    if (jsonContent) {
      const state = hydrateFromPage(jsonContent)
      hydrate(state)
      // Log Sentry warning si page legacy (sans _editor_state)
      if (!jsonContent._editor_state && !legacyWarningSent) {
        try {
          // @ts-expect-error Sentry global possibly absent côté client
          if (typeof window !== 'undefined' && window.Sentry) {
            // @ts-expect-error
            window.Sentry.captureMessage('editor.legacy_page_opened', { level: 'warning' })
          }
        } catch { /* noop */ }
        setLegacyWarningSent(true)
      }
    } else {
      // Nouvelle page : pas de jsonContent, on initialise avec le templateId par défaut
      // et une data vide. La data sera hydratée par la page parente après /api/generate.
      hydrate({
        templateId: defaultTemplateId,
        landingData: {
          headline: '', subtitle: '', benefits: [], faq: [],
          cta: '', urgency: '', product_name: '',
        },
        sectionOrder: [],
        visualSettings: {},
        globalStyles: {},
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    if (!onSave) return
    const { renderTemplate } = await import('@/lib/templates')
    const html = renderTemplate(templateId, landingData, { sectionOrder, visualSettings, globalStyles })
    const jsonForDb = {
      ...landingData,
      _template_slug: templateId,
      _editor_state: { sectionOrder, visualSettings, globalStyles },
    }
    await onSave(html, jsonForDb)
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-12 flex-shrink-0">
        <div className="text-sm font-bold text-gray-700">Konvert Editor</div>
        <div className="flex items-center gap-3">
          <DeviceSwitcher />
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {saving ? '...' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      {/* Body : sidebar + panel + preview */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <PanelLeft />
        <PreviewIframe />
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep "EditorRoot" | head -5
```
Expected : 0 erreur.

- [ ] **Step 3 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/components/editor/EditorRoot.tsx
git commit -m "feat(editor): EditorRoot orchestrateur + hydratation legacy (chantier C1)"
```

---

### Task 12 : Intégration dans `/dashboard/new/page.tsx` avec feature flag

**Files:**
- Modify: `src/app/(dashboard)/dashboard/new/page.tsx`

- [ ] **Step 1 : Localiser l'usage actuel de BuilderLoader**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -n "BuilderLoader\|onSave={savePage}" "src/app/(dashboard)/dashboard/new/page.tsx" | head -5
```
Expected : 1-2 occurrences (probablement ligne ~801).

- [ ] **Step 2 : Lire le contexte (5 lignes avant/après)**

Run :
```bash
cd /Users/mac/nexara/konvert && sed -n '795,810p' "src/app/(dashboard)/dashboard/new/page.tsx"
```

- [ ] **Step 3 : Ajouter l'import EditorRoot + l'usage conditionné par feature flag**

Ouvrir `src/app/(dashboard)/dashboard/new/page.tsx`. Localiser les imports en haut. Ajouter :

```tsx
import EditorRoot from '@/components/editor/EditorRoot'
```

Puis localiser la ligne `<BuilderLoader html={html} onSave={savePage} />` (ou similaire). Remplacer par :

```tsx
{process.env.NEXT_PUBLIC_KONVERT_NEW_EDITOR === 'true' ? (
  <EditorRoot
    jsonContent={
      landingData
        ? { ...landingData, _template_slug: selectedStyle }
        : undefined
    }
    defaultTemplateId={selectedStyle}
    onSave={async (savedHtml, jsonForDb) => {
      // savePage attend (savedHtml: string), on ignore jsonForDb car savePage
      // a sa propre logique d'assemblage du json_content depuis le state actuel.
      // En C2+ on étendra savePage pour accepter le jsonForDb du nouvel éditeur.
      await savePage(savedHtml)
    }}
    saving={saving}
  />
) : (
  <BuilderLoader html={html} onSave={savePage} />
)}
```

**Note importante** : le flag `KONVERT_NEW_EDITOR` est exposé via `NEXT_PUBLIC_` car il est lu côté client (composant React). Différent des flags `KONVERT_RICH_SECTIONS` et `KONVERT_GALLERY` qui sont lus côté serveur uniquement.

- [ ] **Step 4 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add "src/app/(dashboard)/dashboard/new/page.tsx"
git commit -m "refactor(dashboard): EditorRoot conditionnel par NEXT_PUBLIC_KONVERT_NEW_EDITOR (chantier C1)"
```

---

### Task 13 : Feature flag `.env` + smoke local

**Files:**
- Modify: `.env.example`
- Modify: `.env.local` (manuel sur la machine)

- [ ] **Step 1 : Documenter le flag dans `.env.example`**

Ouvrir `.env.example`. Sous la section `# ─── FEATURE FLAGS ──`, ajouter :

```
# Chantier C — nouvel editor React custom (spec 2026-05-25).
# 'true' = utilise le nouvel EditorRoot a la place de GrapesEditor.
# 'false' (ou absent) = legacy GrapesEditor (rollback).
# IMPORTANT : prefixe NEXT_PUBLIC_ car lu cote client (composant React).
NEXT_PUBLIC_KONVERT_NEW_EDITOR=true
```

- [ ] **Step 2 : Ajouter au `.env.local` local**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -q NEXT_PUBLIC_KONVERT_NEW_EDITOR .env.local || printf '\n# Chantier C nouvel editor (spec 2026-05-25)\nNEXT_PUBLIC_KONVERT_NEW_EDITOR=true\n' >> .env.local
tail -3 .env.local
```

- [ ] **Step 3 : Smoke build local**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run build 2>&1 | tail -20
```
Expected : `Compiled successfully`. Pas d'erreur de type sur `EditorRoot`, `useEditorStore`, `@dnd-kit`.

- [ ] **Step 4 : Vérifier que tous les tests passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -8
```
Expected : tous PASS (~190 tests : 170 chantiers A/B + ~20 chantier C1).

- [ ] **Step 5 : Lint chantier C1**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run lint 2>&1 | grep -E "(editor/|src/types/editor|src/lib/templates/sections|src/lib/templates/index|dashboard/new/page)" | head -10
```
Expected : 0 erreur sur les fichiers du chantier C1.

- [ ] **Step 6 : Commit env**

Run :
```bash
cd /Users/mac/nexara/konvert && git add .env.example
git commit -m "chore(env): documenter NEXT_PUBLIC_KONVERT_NEW_EDITOR (chantier C1)"
```

---

### Task 14 : Push + PR + monitoring Sentry

**Files:** N/A (opération git)

- [ ] **Step 1 : Vérifier l'état des commits**

Run :
```bash
cd /Users/mac/nexara/konvert && git log --oneline main..feat/editor-foundation
```
Expected : ~12-13 commits propres, messages clairs.

- [ ] **Step 2 : Push de la branche**

Run :
```bash
cd /Users/mac/nexara/konvert && git push -u origin feat/editor-foundation
```

- [ ] **Step 3 : Ouvrir la PR (CLI gh si auth, sinon URL manuelle)**

Tester `gh auth status`. Si OK :

```bash
cd /Users/mac/nexara/konvert && gh pr create --base main --head feat/editor-foundation \
  --title "feat: chantier C1 — editor foundation (React custom, drop GrapesJS)" \
  --body "$(cat <<'EOF'
## Summary
- Nouvel editeur React custom (EditorRoot + Sidebar + PanelLeft + PreviewIframe)
- Zustand store comme source unique de verite (EditorState)
- Drag-drop des sections via @dnd-kit/sortable
- Migration big bang : legacy pages re-rendues via renderTemplate from json_content
- Feature flag NEXT_PUBLIC_KONVERT_NEW_EDITOR pour rollback vers GrapesEditor

## Spec
docs/superpowers/specs/2026-05-25-konvert-chantier-c-editor-design.md

## Plan
docs/superpowers/plans/2026-05-25-konvert-chantier-c1-foundation.md

## Test plan
- [x] Vitest unit (~20 nouveaux tests) verts
- [x] TS strict 0 erreur
- [x] Lint scope C1 clean
- [x] Build npm run build OK
- [ ] Smoke prod : ouvrir une page legacy via /dashboard/new?page_id=XXX et verifier que les sections riches sont rendues correctement
- [ ] Verifier Sentry editor.legacy_page_opened sur 1 semaine

## Hors scope (chantiers C2-C5)
- PanelRight slide-in avec settings (C2)
- Ajout d'instances multiples (C3)
- Bibliotheque de 18 nouveaux blocks (C4)
- GlobalStyles palette (C5)

## Rollback
\`vercel env set NEXT_PUBLIC_KONVERT_NEW_EDITOR false\` -> retour a GrapesEditor sans rebuild.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Sinon (gh non auth), ouvrir manuellement :
`https://github.com/syphaxdjouad-lgtm/KonVert/pull/new/feat/editor-foundation`

- [ ] **Step 4 : Mettre à jour la mémoire**

Mettre à jour `~/.claude/projects/-Users-mac-nexara/memory/MEMORY.md` avec :

```
| [project_konvert_chantier_c.md](project_konvert_chantier_c.md) | project | KONVERT Chantier C — builder Shopify-like, C1 Foundation mergé/PR 2026-05-25, C2-C5 à venir |
```

Créer `~/.claude/projects/-Users-mac-nexara/memory/project_konvert_chantier_c.md` avec récap (5 sous-chantiers, C1 fait, suite C2 settings panel).

---

## Self-review checklist

- [ ] **Spec coverage** — chaque section du spec a une task correspondante
  - § 2 Objectifs → Tasks 5, 6, 8, 10, 11
  - § 3.1 Stack tech → Task 1 (deps)
  - § 3.2 Layout → Tasks 5, 7, 8, 11
  - § 3.3 Data model → Tasks 2, 3
  - § 3.4 Storage Supabase → Task 11 (handleSave)
  - § 3.5 Extension renderTemplate → Task 4
  - § 3.6 Migration big bang → Task 10 (hydrateFromPage)
  - § 3.7 Sauvegarde → Task 11 (handleSave) — auto-save debounce traité en C2
  - § 4 Composants → Tasks 5, 6, 7, 8, 9, 11
  - § 6 Tests → Tasks 3, 4, 6, 8, 10
  - § 8 Découpage C1 — couvert par ce plan
- [ ] **Type consistency** — `EditorState`, `SectionInstance`, `PanelMode`, `Device`, `useEditorStore`, `hydrateFromPage`, `renderTemplate` ont la même signature dans toutes les tasks qui les référencent
- [ ] **No placeholders** — aucun "TBD", "TODO" (sauf mentions explicites "chantier C2/C3/C4/C5" qui sont des delimitations de scope, pas des dette)
- [ ] **Exact file paths** — tous les paths sont absolus depuis `/Users/mac/nexara/konvert/`
- [ ] **Commit messages** — préfixes `feat(editor):`, `feat(sections):`, `chore(deps):`, `chore(env):`, `refactor(dashboard):`, `test(editor):` cohérents
- [ ] **TDD respecté** — pattern test fail → impl → test pass → commit appliqué sur Tasks 3, 4, 6, 8, 10

---

## Estimation totale

| Task | Effort |
|---|---|
| T0 Setup branche | 5 min |
| T1 Install deps | 10 min |
| T2 Types editor.ts | 15 min |
| T3 Zustand store + tests | 1h |
| T4 renderTemplate overrides + tests | 1h |
| T5 Sidebar | 20 min |
| T6 SectionsList + DnD + tests | 1h30 |
| T7 PanelLeft | 15 min |
| T8 PreviewIframe + tests | 1h |
| T9 DeviceSwitcher | 15 min |
| T10 hydrateFromPage + tests migration | 1h |
| T11 EditorRoot orchestrateur | 1h |
| T12 Intégration dashboard | 30 min |
| T13 Feature flag + smoke | 30 min |
| T14 Push + PR + mémoire | 30 min |

**Total : ~9-10h** sur 1.5 jour de dev focus.

---

## Suite logique (sous-chantiers à venir)

- **C2 — Settings panel** : PanelRight slide-in, 7 fields React, 19 editors pour sections chantier A, auto-save debounce 3s. ~1.5 sem
- **C3 — Sections ajoutables** : bouton "+" qui clone une SectionInstance. ~1 sem
- **C4 — Blocks library** : 18 nouveaux blocks (renderers + editors + tests). ~3 sem
- **C5 — Global Styles** : PanelLeft mode Styles (palette + font). ~0.5 sem

Chaque sous-chantier aura son propre spec court (si décisions design propres à valider) + plan détaillé.
