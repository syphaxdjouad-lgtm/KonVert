# Konvert Pages V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte complète du système de pages produit Konvert vers une architecture "Style (~10 skins purs) + Sections V3 universelles (~13)" niveau Allbirds/Mejuri, avec gestion images utilisateur, ton de copy paramétrable et migration sans régression des pages existantes.

**Architecture:** Deux couches strictement découplées. **Styles** = tokens visuels purs (palette/typo/spacing/radius/anims) dans `src/lib/styles/{id}/`. **Sections V3** = renderers universels dans `src/lib/sections-v3/{key}/`. Le rendu = `renderPageV3(styleId, data, sectionOrder)`. Migration progressive via feature flag `KONVERT_V3_RENDERER` + double renderer pendant ~2 semaines. Workflow design : OBITO produit chaque style en maquette HTML/CSS standalone validée visuellement avant qu'ANNA code la version production.

**Tech Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS · React Server Components · Supabase (auth + DB + Storage) · DeepSeek API (copy AI) · Vitest (unit/HTML assertions) · Playwright (smoke E2E) · feature flag env var.

**Source spec:** `docs/superpowers/specs/2026-05-26-konvert-pages-v3-design.md`

---

## File Structure (vue d'ensemble)

```
src/
├── lib/
│   ├── styles/                          ← NOUVEAU
│   │   ├── index.ts                     # registry + StyleId type + STYLE_IDS
│   │   ├── types.ts                     # StyleTokens, StylePatterns interfaces
│   │   ├── auto-pick.ts                 # suggestStyle(product) → StyleId
│   │   ├── soft/
│   │   │   ├── tokens.ts                # palette, typo, spacing, radius
│   │   │   ├── patterns.css             # classes utilitaires skin
│   │   │   └── tokens.test.ts
│   │   ├── editorial/
│   │   ├── apple-clean/
│   │   ├── bold/
│   │   ├── organic/
│   │   ├── luxe-noir/
│   │   ├── brutalist/
│   │   ├── warm-neutral/
│   │   ├── minimal-mono/
│   │   └── vibrant/
│   │
│   ├── sections-v3/                     ← NOUVEAU
│   │   ├── index.ts                     # SECTION_V3_RENDERERS map + V3SectionKey
│   │   ├── types.ts                     # V3SectionKey, SectionRenderer, DisplayRule
│   │   ├── display-rules.ts             # shouldRenderSection(key, data) → boolean
│   │   ├── render-page.ts               # renderPageV3(styleId, data, sectionOrder)
│   │   ├── hero/
│   │   │   ├── render.tsx
│   │   │   └── render.test.ts
│   │   ├── gallery/
│   │   ├── why-we-love/
│   │   ├── thoughtfully-designed/
│   │   ├── best-for/
│   │   ├── materials-breakdown/
│   │   ├── how-it-works/
│   │   ├── compare-variants/
│   │   ├── reviews-ai-summary/
│   │   ├── press-quote/
│   │   ├── care-instructions/
│   │   ├── faq/
│   │   └── brand-manifesto/
│   │
│   ├── images/                          ← NOUVEAU
│   │   ├── pool.ts                      # ImagePool builder + getImage()
│   │   ├── pool.test.ts
│   │   ├── angle-detector.ts            # filename → angle heuristic
│   │   └── angle-detector.test.ts
│   │
│   ├── ai/                              ← NOUVEAU (séparé de anthropic legacy)
│   │   ├── extract-materials.ts         # confidence-scored extraction
│   │   ├── extract-materials.test.ts
│   │   ├── tone-prompts.ts              # CopyTone → system prompt
│   │   └── auto-pick-tone.ts            # autoPickTone(product) → CopyTone
│   │
│   ├── migration/                       ← NOUVEAU
│   │   ├── legacy-to-v3.ts              # map etec-* → StyleId
│   │   ├── section-v2-to-v3.ts          # map V2 SectionKey → V3SectionKey
│   │   └── migration.test.ts
│   │
│   └── templates/                       ← LEGACY (deprecated, supprimé S8)
│       └── ... (intouché jusqu'au cleanup final)
│
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── new/
│   │           ├── page.tsx                       # wizard (modifié S6+S7)
│   │           ├── components/
│   │           │   ├── ImageManager.tsx           ← NOUVEAU S7
│   │           │   ├── StyleSummaryStep.tsx       ← NOUVEAU S6
│   │           │   ├── StylePickerModal.tsx       ← NOUVEAU S6
│   │           │   ├── TonePickerModal.tsx        ← NOUVEAU S6
│   │           │   ├── StylePreview.tsx           ← NOUVEAU S6
│   │           │   └── DataValidationStep.tsx     ← NOUVEAU S6
│   └── api/
│       ├── generate/
│       │   └── route.ts                           # modifié pour V3 + tone
│       └── upload-image/
│           └── route.ts                           ← NOUVEAU S7 (Supabase Storage)
│
├── types/
│   ├── index.ts                                   # LandingPageData étendu V3
│   └── v3.ts                                      ← NOUVEAU types V3
│
scripts/
└── migrate-pages-to-v3.ts                         ← NOUVEAU S8 (dry-run/apply)

design/                                            ← NOUVEAU racine projet
└── mockups/
    ├── style-soft.html
    ├── style-soft-mobile.html
    ├── style-soft.notes.md
    ├── style-soft.tokens.json
    └── ... (10 styles × 4 files)

docs/superpowers/
├── specs/
│   └── 2026-05-26-konvert-pages-v3-design.md     # ce plan implémente cette spec
└── plans/
    └── 2026-05-26-konvert-pages-v3.md            # ce plan
```

## Conventions communes (à respecter pour toutes les tasks)

- **Branche dédiée** : `feat/pages-v3` (créée Task 1.1). PR à la fin.
- **TDD strict** : test rouge avant toute implémentation. Vitest pour unit + assertions HTML, pas Playwright (cf leçon Chantier A : Playwright avec dev local = crash macOS).
- **Tests** : `*.test.ts` à côté du fichier source. Pour les renderers de section : Vitest qui vérifie le HTML output contient les attendus (pas snapshot complet).
- **TypeScript strict** : zéro `any`, zéro `@ts-ignore`. Si nécessaire `@ts-expect-error` avec raison.
- **Feature flag** : `KONVERT_V3_RENDERER` (env var) par défaut `false`. Activée seulement en S8 après QA.
- **Commits** : un par task minimum, format `feat(v3): <quoi>` ou `test(v3): <quoi>` ou `chore(v3): <quoi>`.
- **Imports** : `@/lib/...` (alias paths existant projet).
- **Format prix/dates** : ne pas réinventer, importer les helpers existants si présents.
- **Pas de console.log** en prod code. Sentry pour erreurs runtime.

---

# Sprint 1 — Fondations (4j)

Goal sprint : Poser l'architecture complète V3 (types, dirs, ImagePool, feature flag, double renderer), implémenter UN style (`soft`) et UNE section (`hero`) en POC pour valider que le pipeline tourne bout en bout.

## Task 1.1: Branche + arborescence

**Files:**
- Create: arborescence dossiers vide
- Modify: rien

- [ ] **Step 1: Créer la branche**

```bash
cd /Users/mac/nexara/konvert
git checkout main
git pull origin main
git checkout -b feat/pages-v3
```

- [ ] **Step 2: Créer les dossiers**

```bash
mkdir -p src/lib/styles/{soft,editorial,apple-clean,bold,organic,luxe-noir,brutalist,warm-neutral,minimal-mono,vibrant}
mkdir -p src/lib/sections-v3/{hero,gallery,why-we-love,thoughtfully-designed,best-for,materials-breakdown,how-it-works,compare-variants,reviews-ai-summary,press-quote,care-instructions,faq,brand-manifesto}
mkdir -p src/lib/images
mkdir -p src/lib/ai
mkdir -p src/lib/migration
mkdir -p design/mockups
mkdir -p src/app/\(dashboard\)/dashboard/new/components
```

- [ ] **Step 3: Commit initial**

```bash
# Ajouter un .gitkeep par dossier vide pour qu'ils soient trackés
find src/lib/styles src/lib/sections-v3 src/lib/images src/lib/ai src/lib/migration design/mockups -type d -empty -exec touch {}/.gitkeep \;
git add -A
git commit -m "chore(v3): scaffold dirs for pages v3 architecture"
```

## Task 1.2: Types V3

**Files:**
- Create: `src/types/v3.ts`
- Create: `src/lib/styles/types.ts`
- Create: `src/lib/sections-v3/types.ts`
- Create: `src/lib/styles/index.ts`
- Create: `src/lib/sections-v3/index.ts`

- [ ] **Step 1: Écrire le test des invariants types**

Create `src/lib/styles/index.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { STYLE_IDS, type StyleId } from './index'

describe('STYLE_IDS', () => {
  it('contains exactly 10 styles', () => {
    expect(STYLE_IDS).toHaveLength(10)
  })

  it('all ids are kebab-case strings', () => {
    for (const id of STYLE_IDS) {
      expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })

  it('contains the canonical 10 styles', () => {
    expect(STYLE_IDS).toEqual([
      'soft', 'editorial', 'apple-clean', 'bold', 'organic',
      'luxe-noir', 'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant',
    ])
  })
})
```

- [ ] **Step 2: Run test → FAIL**

```bash
npx vitest run src/lib/styles/index.test.ts
# Expected: FAIL (STYLE_IDS not defined)
```

- [ ] **Step 3: Implémenter types styles**

Create `src/lib/styles/types.ts`:

```ts
export interface StyleTokens {
  colors: {
    bg: string
    surface: string
    accent: string
    text: string
    textMuted: string
    border: string
  }
  fonts: {
    heading: string
    body: string
    mono?: string
  }
  spacing: {
    section: string
    card: string
    gap: string
  }
  radius: {
    card: string
    button: string
    image: string
  }
  shadows: {
    card: string
    hover: string
  }
  motion: {
    ease: string
    duration: string
  }
}

export interface StyleDefinition {
  id: StyleId
  name: string
  description: string
  tokens: StyleTokens
}

export type StyleId =
  | 'soft' | 'editorial' | 'apple-clean' | 'bold' | 'organic'
  | 'luxe-noir' | 'brutalist' | 'warm-neutral' | 'minimal-mono' | 'vibrant'
```

Create `src/lib/styles/index.ts`:

```ts
export type { StyleId, StyleDefinition, StyleTokens } from './types'
import type { StyleId } from './types'

export const STYLE_IDS: readonly StyleId[] = [
  'soft', 'editorial', 'apple-clean', 'bold', 'organic',
  'luxe-noir', 'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant',
] as const

export const STYLE_LABELS: Record<StyleId, string> = {
  'soft':          'Soft — Mejuri / Glossier',
  'editorial':     'Editorial — Magazine',
  'apple-clean':   'Apple Clean',
  'bold':          'Bold — Bento',
  'organic':       'Organic — Natural',
  'luxe-noir':     'Luxe Noir',
  'brutalist':     'Brutalist',
  'warm-neutral':  'Warm Neutral',
  'minimal-mono':  'Minimal Mono',
  'vibrant':       'Vibrant',
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npx vitest run src/lib/styles/index.test.ts
# Expected: 3 tests pass
```

- [ ] **Step 5: Implémenter types V3 globaux**

Create `src/types/v3.ts`:

```ts
import type { StyleId } from '@/lib/styles/types'

export type CopyTone =
  | 'auto' | 'friendly' | 'premium' | 'bold' | 'storytelling' | 'educational'

export type V3SectionKey =
  | 'hero' | 'gallery' | 'why_we_love' | 'thoughtfully_designed'
  | 'best_for' | 'materials_breakdown' | 'how_it_works'
  | 'compare_variants' | 'reviews_ai_summary' | 'press_quote'
  | 'care_instructions' | 'faq' | 'brand_manifesto'

export interface MaterialEntry {
  name: string
  benefit: string
  confidence: number  // 0-1
  imageHint?: 'detail' | 'macro'
}

export interface V3PageData {
  styleId: StyleId
  tone: CopyTone
  sectionOrder?: V3SectionKey[]
  product: {
    title: string
    description: string
    price?: string
    rating?: { value: number; count: number }
    variants?: Array<{ name: string; image?: string }>
  }
  images: string[]                       // ordre final, finalisé par user à l'étape Produit
  copy: {
    hero?: { tagline: string; subtagline: string }
    why_we_love?: string
    features?: Array<{ name: string; description: string; isPropriety?: boolean }>
    best_for?: string[]
    materials?: MaterialEntry[]
    care?: string
    faq?: Array<{ q: string; a: string }>
    manifesto?: { headline: string; pillars: string[] }
    press_quote?: { quote: string; source: string }
    reviews_summary?: string
  }
}
```

- [ ] **Step 6: Implémenter types sections V3**

Create `src/lib/sections-v3/types.ts`:

```ts
import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export type SectionRenderer = (data: V3PageData, tokens: StyleTokens) => string

export interface DisplayRule {
  key: V3SectionKey
  shouldRender: (data: V3PageData) => boolean
}
```

Create `src/lib/sections-v3/index.ts`:

```ts
export type { V3SectionKey } from '@/types/v3'
export type { SectionRenderer, DisplayRule } from './types'

import type { V3SectionKey } from '@/types/v3'

export const DEFAULT_SECTION_ORDER_V3: readonly V3SectionKey[] = [
  'hero',
  'gallery',
  'why_we_love',
  'thoughtfully_designed',
  'best_for',
  'materials_breakdown',
  'how_it_works',
  'compare_variants',
  'reviews_ai_summary',
  'press_quote',
  'care_instructions',
  'faq',
  'brand_manifesto',
] as const
```

- [ ] **Step 7: Commit**

```bash
git add src/types/v3.ts src/lib/styles src/lib/sections-v3
git commit -m "feat(v3): types core (StyleId, V3SectionKey, V3PageData, CopyTone)"
```

## Task 1.3: ImagePool

**Files:**
- Create: `src/lib/images/pool.ts`
- Create: `src/lib/images/pool.test.ts`
- Create: `src/lib/images/angle-detector.ts`
- Create: `src/lib/images/angle-detector.test.ts`

- [ ] **Step 1: Test angle detector**

Create `src/lib/images/angle-detector.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { detectAngle } from './angle-detector'

describe('detectAngle', () => {
  it('detects front from LEFT/FRONT/SIDE', () => {
    expect(detectAngle('TR3MJBW080_SHOE_LEFT_GLOBAL.png')).toBe('front')
    expect(detectAngle('product_FRONT.jpg')).toBe('front')
    expect(detectAngle('img_SIDE_view.webp')).toBe('front')
  })
  it('detects back', () => {
    expect(detectAngle('product_BACK_view.png')).toBe('back')
  })
  it('detects detail from DETAIL/CLOSEUP/MACRO', () => {
    expect(detectAngle('shoe_DETAIL_close.jpg')).toBe('detail')
    expect(detectAngle('img_CLOSEUP_lace.png')).toBe('detail')
    expect(detectAngle('material_MACRO_zoom.webp')).toBe('detail')
  })
  it('detects lifestyle from LIFESTYLE/WORN/MODEL', () => {
    expect(detectAngle('shoes_LIFESTYLE_walking.jpg')).toBe('lifestyle')
    expect(detectAngle('product_WORN_outdoor.png')).toBe('lifestyle')
    expect(detectAngle('img_MODEL_pose.jpg')).toBe('lifestyle')
  })
  it('returns unknown if no pattern matches', () => {
    expect(detectAngle('IMG_4523.jpg')).toBe('unknown')
    expect(detectAngle('a8s7df6.png')).toBe('unknown')
  })
  it('is case-insensitive', () => {
    expect(detectAngle('product_back.png')).toBe('back')
    expect(detectAngle('PRODUCT_LIFESTYLE.JPG')).toBe('lifestyle')
  })
  it('handles full URLs', () => {
    expect(detectAngle('https://cdn.shopify.com/files/shoe_LEFT_v2.png?v=123')).toBe('front')
  })
})
```

- [ ] **Step 2: Run test → FAIL**

```bash
npx vitest run src/lib/images/angle-detector.test.ts
# Expected: FAIL
```

- [ ] **Step 3: Implémenter angle-detector**

Create `src/lib/images/angle-detector.ts`:

```ts
export type Angle = 'front' | 'back' | 'detail' | 'lifestyle' | 'unknown'

const PATTERNS: Array<{ angle: Angle; regex: RegExp }> = [
  { angle: 'front',     regex: /(_|^)(LEFT|FRONT|SIDE)(_|\.)/i },
  { angle: 'back',      regex: /(_|^)BACK(_|\.)/i },
  { angle: 'detail',    regex: /(_|^)(DETAIL|CLOSEUP|MACRO)(_|\.)/i },
  { angle: 'lifestyle', regex: /(_|^)(LIFESTYLE|WORN|MODEL)(_|\.)/i },
]

export function detectAngle(filenameOrUrl: string): Angle {
  // Extraire juste le filename si URL
  const name = filenameOrUrl.split('/').pop()?.split('?')[0] ?? filenameOrUrl
  for (const { angle, regex } of PATTERNS) {
    if (regex.test(name)) return angle
  }
  return 'unknown'
}
```

- [ ] **Step 4: Run test → PASS**

```bash
npx vitest run src/lib/images/angle-detector.test.ts
```

- [ ] **Step 5: Test ImagePool**

Create `src/lib/images/pool.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildImagePool, getImage } from './pool'

describe('buildImagePool', () => {
  it('builds from empty array', () => {
    const pool = buildImagePool([])
    expect(pool.primary).toBe('')
    expect(pool.all).toEqual([])
    expect(pool.byAngle).toEqual({})
  })
  it('builds with primary = first image', () => {
    const pool = buildImagePool(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(pool.primary).toBe('a.jpg')
    expect(pool.all).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
  })
  it('detects angles from filenames', () => {
    const pool = buildImagePool([
      'product_LEFT.jpg',
      'product_BACK.jpg',
      'product_DETAIL.jpg',
      'product_LIFESTYLE.jpg',
    ])
    expect(pool.byAngle?.front).toBe('product_LEFT.jpg')
    expect(pool.byAngle?.back).toBe('product_BACK.jpg')
    expect(pool.byAngle?.detail).toBe('product_DETAIL.jpg')
    expect(pool.byAngle?.lifestyle).toBe('product_LIFESTYLE.jpg')
  })
})

describe('getImage', () => {
  it('returns angle-specific image if available', () => {
    const pool = buildImagePool(['a_LEFT.jpg', 'b_BACK.jpg'])
    expect(getImage(pool, 'back', 0)).toBe('b_BACK.jpg')
  })
  it('falls back to rotation when angle not present', () => {
    const pool = buildImagePool(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(getImage(pool, 'any', 0)).toBe('a.jpg')
    expect(getImage(pool, 'any', 1)).toBe('b.jpg')
    expect(getImage(pool, 'any', 2)).toBe('c.jpg')
    expect(getImage(pool, 'any', 3)).toBe('a.jpg')  // boucle
    expect(getImage(pool, 'any', 5)).toBe('c.jpg')
  })
  it('returns primary when pool has 1 image and index > 0', () => {
    const pool = buildImagePool(['only.jpg'])
    expect(getImage(pool, 'any', 0)).toBe('only.jpg')
    expect(getImage(pool, 'any', 1)).toBe('only.jpg')
    expect(getImage(pool, 'any', 99)).toBe('only.jpg')
  })
  it('returns empty string when pool is empty', () => {
    const pool = buildImagePool([])
    expect(getImage(pool, 'any', 0)).toBe('')
  })
})
```

- [ ] **Step 6: Run test → FAIL**

```bash
npx vitest run src/lib/images/pool.test.ts
```

- [ ] **Step 7: Implémenter ImagePool**

Create `src/lib/images/pool.ts`:

```ts
import { detectAngle, type Angle } from './angle-detector'

export interface ImagePool {
  primary: string
  all: string[]
  byAngle?: {
    front?: string
    back?: string
    detail?: string
    lifestyle?: string
  }
}

export function buildImagePool(images: string[]): ImagePool {
  if (images.length === 0) {
    return { primary: '', all: [], byAngle: {} }
  }

  const byAngle: ImagePool['byAngle'] = {}
  for (const img of images) {
    const angle = detectAngle(img)
    if (angle !== 'unknown' && !byAngle[angle]) {
      byAngle[angle] = img
    }
  }

  return {
    primary: images[0],
    all: images,
    byAngle,
  }
}

export type ImageSlot = Angle | 'any'

export function getImage(pool: ImagePool, slot: ImageSlot, index: number): string {
  if (pool.all.length === 0) return ''
  if (pool.all.length === 1) return pool.primary

  if (slot !== 'any' && slot !== 'unknown' && pool.byAngle?.[slot]) {
    return pool.byAngle[slot]!
  }

  return pool.all[index % pool.all.length]
}
```

- [ ] **Step 8: Run test → PASS, commit**

```bash
npx vitest run src/lib/images
git add src/lib/images
git commit -m "feat(v3): ImagePool with angle heuristic + rotation fallback"
```

## Task 1.4: Style "Soft" tokens (POC)

**Files:**
- Create: `src/lib/styles/soft/tokens.ts`
- Create: `src/lib/styles/soft/tokens.test.ts`
- Create: `src/lib/styles/soft/index.ts`

- [ ] **Step 1: Test tokens**

Create `src/lib/styles/soft/tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { softTokens } from './tokens'

describe('softTokens', () => {
  it('has cream background', () => {
    expect(softTokens.colors.bg).toBe('#FAF7F2')
  })
  it('uses serif heading + sans body', () => {
    expect(softTokens.fonts.heading).toContain('Cormorant')
    expect(softTokens.fonts.body).toContain('Inter')
  })
  it('uses small radius (~6px) for understated feel', () => {
    expect(softTokens.radius.card).toBe('6px')
  })
})
```

- [ ] **Step 2: FAIL, then implémenter**

Create `src/lib/styles/soft/tokens.ts`:

```ts
import type { StyleTokens } from '../types'

export const softTokens: StyleTokens = {
  colors: {
    bg:        '#FAF7F2',
    surface:   '#FFFFFF',
    accent:    '#C9A77E',
    text:      '#1A1614',
    textMuted: '#7A6F66',
    border:    'rgba(26, 22, 20, 0.08)',
  },
  fonts: {
    heading: '"Cormorant Garamond", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: {
    section: '128px',
    card:    '32px',
    gap:     '24px',
  },
  radius: {
    card:   '6px',
    button: '999px',
    image:  '4px',
  },
  shadows: {
    card:  '0 1px 3px rgba(26, 22, 20, 0.04)',
    hover: '0 8px 24px rgba(26, 22, 20, 0.08)',
  },
  motion: {
    ease:     'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: '400ms',
  },
}
```

Create `src/lib/styles/soft/index.ts`:

```ts
import type { StyleDefinition } from '../types'
import { softTokens } from './tokens'

export const softStyle: StyleDefinition = {
  id: 'soft',
  name: 'Soft',
  description: 'Mejuri × Glossier — serif élégant, palette cream, white space',
  tokens: softTokens,
}

export { softTokens }
```

- [ ] **Step 3: Run test → PASS, commit**

```bash
npx vitest run src/lib/styles/soft
git add src/lib/styles/soft
git commit -m "feat(v3): style 'soft' tokens (Mejuri/Glossier vibe)"
```

## Task 1.5: Section "hero" V3 minimal (POC)

**Files:**
- Create: `src/lib/sections-v3/hero/render.tsx`
- Create: `src/lib/sections-v3/hero/render.test.ts`

- [ ] **Step 1: Test hero renderer**

Create `src/lib/sections-v3/hero/render.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHero } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const baseData: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: {
    title: 'Sac à bandoulière en cuir vintage',
    description: 'Cuir véritable...',
    price: '79€',
    rating: { value: 4.6, count: 1247 },
  },
  images: ['hero.jpg', 'detail.jpg'],
  copy: { hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique, finition main' } },
}

describe('renderHero', () => {
  it('includes product title', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Sac à bandoulière en cuir vintage')
  })
  it('includes price', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('79€')
  })
  it('includes rating value and count when present', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('4.6')
    expect(html).toContain('1247')
  })
  it('uses primary image (first in images)', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('hero.jpg')
  })
  it('uses tagline from copy.hero', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain('Un cuir qui vit avec toi')
  })
  it('does not render rating section when rating absent', () => {
    const data = { ...baseData, product: { ...baseData.product, rating: undefined } }
    const html = renderHero(data, softTokens)
    expect(html).not.toContain('★')
  })
  it('applies token colors via inline style', () => {
    const html = renderHero(baseData, softTokens)
    expect(html).toContain(softTokens.colors.bg)
    expect(html).toContain(softTokens.colors.accent)
  })
})
```

- [ ] **Step 2: FAIL, then implémenter**

Create `src/lib/sections-v3/hero/render.tsx`:

```tsx
import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderHero(data: V3PageData, tokens: StyleTokens): string {
  const { product, images, copy } = data
  const heroImage = images[0] ?? ''
  const tagline = copy.hero?.tagline ?? product.title
  const subtagline = copy.hero?.subtagline ?? ''

  const ratingBlock = product.rating
    ? `
      <div class="v3-hero__rating" style="color:${tokens.colors.textMuted};font-size:14px">
        <span style="color:${tokens.colors.accent}">★</span>
        ${product.rating.value} (${product.rating.count} avis)
      </div>`
    : ''

  return `
<section class="v3-hero" style="
  background:${tokens.colors.bg};
  padding:${tokens.spacing.section} 24px;
  font-family:${tokens.fonts.body};
">
  <div class="v3-hero__grid" style="
    max-width:1240px;margin:0 auto;
    display:grid;grid-template-columns:1fr 1fr;gap:${tokens.spacing.gap};
    align-items:center;
  ">
    <div class="v3-hero__image">
      <img src="${heroImage}"
           alt="${escapeHtml(product.title)}"
           style="width:100%;border-radius:${tokens.radius.image};display:block">
    </div>
    <div class="v3-hero__content" style="color:${tokens.colors.text}">
      <h1 style="
        font-family:${tokens.fonts.heading};
        font-size:clamp(40px,5vw,72px);
        line-height:1.05;font-weight:400;margin:0 0 16px
      ">${escapeHtml(product.title)}</h1>
      ${tagline !== product.title
        ? `<p style="font-size:20px;color:${tokens.colors.textMuted};margin:0 0 8px">${escapeHtml(tagline)}</p>`
        : ''}
      ${subtagline
        ? `<p style="font-size:16px;color:${tokens.colors.textMuted};margin:0 0 32px">${escapeHtml(subtagline)}</p>`
        : ''}
      ${product.price
        ? `<div style="font-size:24px;font-weight:600;margin:0 0 16px">${escapeHtml(product.price)}</div>`
        : ''}
      ${ratingBlock}
      <button style="
        margin-top:32px;
        background:${tokens.colors.text};color:${tokens.colors.surface};
        padding:18px 40px;border:0;border-radius:${tokens.radius.button};
        font-family:${tokens.fonts.body};font-size:16px;font-weight:500;
        cursor:pointer;transition:transform ${tokens.motion.duration} ${tokens.motion.ease}
      ">Ajouter au panier</button>
    </div>
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

- [ ] **Step 3: Run test → PASS, commit**

```bash
npx vitest run src/lib/sections-v3/hero
git add src/lib/sections-v3/hero
git commit -m "feat(v3): section 'hero' renderer with token-driven styling"
```

## Task 1.6: renderPageV3 + feature flag + double renderer

**Files:**
- Create: `src/lib/sections-v3/render-page.ts`
- Create: `src/lib/sections-v3/render-page.test.ts`
- Create: `src/lib/sections-v3/display-rules.ts`
- Modify: `src/lib/templates/index.ts` (ajout de la branche renderPageV3)
- Modify: `.env.example` (ajouter `KONVERT_V3_RENDERER`)

- [ ] **Step 1: Test display rules**

Create `src/lib/sections-v3/display-rules.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { shouldRenderSection } from './display-rules'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('shouldRenderSection', () => {
  it('hero: always true (mandatory)', () => {
    expect(shouldRenderSection('hero', base)).toBe(true)
  })
  it('gallery: needs >= 3 images', () => {
    expect(shouldRenderSection('gallery', { ...base, images: ['a', 'b'] })).toBe(false)
    expect(shouldRenderSection('gallery', { ...base, images: ['a', 'b', 'c'] })).toBe(true)
  })
  it('materials_breakdown: needs >= 2 materials with confidence >= 0.6', () => {
    const lowConf = { ...base, copy: { materials: [
      { name: 'X', benefit: 'y', confidence: 0.3 },
      { name: 'Y', benefit: 'z', confidence: 0.5 },
    ]}}
    const highConf = { ...base, copy: { materials: [
      { name: 'X', benefit: 'y', confidence: 0.8 },
      { name: 'Y', benefit: 'z', confidence: 0.7 },
    ]}}
    expect(shouldRenderSection('materials_breakdown', lowConf)).toBe(false)
    expect(shouldRenderSection('materials_breakdown', highConf)).toBe(true)
  })
  it('reviews_ai_summary: needs reviews_summary copy', () => {
    expect(shouldRenderSection('reviews_ai_summary', base)).toBe(false)
    expect(shouldRenderSection('reviews_ai_summary', {
      ...base, copy: { reviews_summary: 'Customers say...' }
    })).toBe(true)
  })
  it('compare_variants: needs >= 2 variants', () => {
    const oneVar = { ...base, product: { ...base.product, variants: [{ name: 'A' }] }}
    const twoVar = { ...base, product: { ...base.product, variants: [{ name: 'A' }, { name: 'B' }] }}
    expect(shouldRenderSection('compare_variants', oneVar)).toBe(false)
    expect(shouldRenderSection('compare_variants', twoVar)).toBe(true)
  })
})
```

- [ ] **Step 2: FAIL, then implémenter**

Create `src/lib/sections-v3/display-rules.ts`:

```ts
import type { V3PageData, V3SectionKey } from '@/types/v3'

const CONFIDENCE_THRESHOLD = 0.6

export function shouldRenderSection(key: V3SectionKey, data: V3PageData): boolean {
  switch (key) {
    case 'hero':
    case 'why_we_love':
    case 'thoughtfully_designed':
    case 'best_for':
    case 'care_instructions':
    case 'faq':
    case 'brand_manifesto':
      return true
    case 'gallery':
      return data.images.length >= 3
    case 'materials_breakdown': {
      const m = data.copy.materials ?? []
      const highConf = m.filter(x => x.confidence >= CONFIDENCE_THRESHOLD)
      return highConf.length >= 2
    }
    case 'how_it_works':
      // future: dépend du product type → S5 affinera
      return false
    case 'compare_variants':
      return (data.product.variants?.length ?? 0) >= 2
    case 'reviews_ai_summary':
      return Boolean(data.copy.reviews_summary)
    case 'press_quote':
      return Boolean(data.copy.press_quote)
    default:
      return false
  }
}
```

- [ ] **Step 3: Test renderPageV3**

Create `src/lib/sections-v3/render-page.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

const data: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'Sac vintage', description: '' },
  images: ['a.jpg'],
  copy: {},
}

describe('renderPageV3', () => {
  it('always renders hero', () => {
    const html = renderPageV3('soft', data)
    expect(html).toContain('Sac vintage')
    expect(html).toContain('v3-hero')
  })
  it('skips gallery when images < 3', () => {
    const html = renderPageV3('soft', data)
    expect(html).not.toContain('v3-gallery')
  })
  it('respects custom sectionOrder', () => {
    const html = renderPageV3('soft', data, ['hero'])
    expect(html).toContain('v3-hero')
    // S4+ ajoutera les autres tests
  })
  it('throws on unknown styleId', () => {
    // @ts-expect-error - intentional invalid value
    expect(() => renderPageV3('nonexistent', data)).toThrow()
  })
})
```

- [ ] **Step 4: FAIL, then implémenter**

Create `src/lib/sections-v3/render-page.ts`:

```ts
import type { V3PageData, V3SectionKey } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'
import { STYLE_IDS, DEFAULT_SECTION_ORDER_V3 } from '@/lib/styles'
// @ts-expect-error - DEFAULT_SECTION_ORDER_V3 actually exported from sections-v3/index.ts
import { DEFAULT_SECTION_ORDER_V3 as _SEC } from '@/lib/sections-v3'
import { shouldRenderSection } from './display-rules'
import { softTokens } from '@/lib/styles/soft/tokens'
import { renderHero } from './hero/render'

// Map style -> tokens. Sprint 6 ajoutera les 9 autres entries.
const STYLE_TOKENS = {
  'soft': softTokens,
} as const

// Map section -> renderer. Sprints 4-5 ajouteront les 12 autres entries.
const SECTION_RENDERERS = {
  'hero': renderHero,
} as const

export function renderPageV3(
  styleId: StyleId,
  data: V3PageData,
  sectionOrder?: readonly V3SectionKey[],
): string {
  if (!STYLE_IDS.includes(styleId)) {
    throw new Error(`Unknown styleId: ${styleId}`)
  }
  const tokens = STYLE_TOKENS[styleId as keyof typeof STYLE_TOKENS]
  if (!tokens) {
    throw new Error(`No tokens registered for styleId: ${styleId} (POC: only 'soft' until S6)`)
  }
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER_V3

  const sections = order
    .filter(key => shouldRenderSection(key, data))
    .map(key => {
      const renderer = SECTION_RENDERERS[key as keyof typeof SECTION_RENDERERS]
      if (!renderer) return ''  // section pas encore implémentée
      return renderer(data, tokens)
    })
    .filter(Boolean)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(data.product.title)}</title>
</head>
<body style="margin:0;padding:0">
${sections}
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
```

Fix le `index.ts` de sections-v3 pour bien exporter `DEFAULT_SECTION_ORDER_V3` (déjà fait Task 1.2). Retirer le `@ts-expect-error`.

- [ ] **Step 5: Brancher dans le renderer global avec feature flag**

Modify `src/lib/templates/index.ts` (ajouter en haut) :

```ts
// V3 imports (feature flag gated)
import { renderPageV3 } from '@/lib/sections-v3/render-page'
import type { V3PageData } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'

const V3_ENABLED = process.env.KONVERT_V3_RENDERER === 'true'

/**
 * Point d'entrée principal de rendu. Route entre V3 (si styleId présent + flag ON)
 * et legacy (renderTemplate sur templateId).
 */
export function renderPage(input: {
  styleId?: StyleId
  templateId?: string
  data: V3PageData & { _legacyData?: import('@/types').LandingPageData }
  sectionOrder?: import('@/types/v3').V3SectionKey[]
}): string {
  if (V3_ENABLED && input.styleId) {
    return renderPageV3(input.styleId, input.data, input.sectionOrder)
  }
  // Legacy path inchangé
  if (input.templateId && input.data._legacyData) {
    return renderTemplate(input.templateId, input.data._legacyData)
  }
  throw new Error('renderPage: ni styleId+V3_ENABLED ni templateId+legacy fournis')
}
```

- [ ] **Step 6: Documenter le flag**

Modify `.env.example` :

```
# V3 renderer (pages produit refondue). Default false = legacy renderTemplate.
KONVERT_V3_RENDERER=false
```

- [ ] **Step 7: Smoke test bout en bout**

Create `src/lib/sections-v3/render-page.smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

describe('renderPageV3 smoke', () => {
  it('produces valid HTML doc for soft style with rich data', () => {
    const data: V3PageData = {
      styleId: 'soft', tone: 'auto',
      product: {
        title: 'Sac à bandoulière en cuir vintage',
        description: 'Cuir véritable patiné main, finition italienne.',
        price: '79€',
        rating: { value: 4.6, count: 1247 },
      },
      images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'],
      copy: {
        hero: { tagline: 'Un cuir qui vit avec toi', subtagline: 'Patine unique' },
      },
    }
    const html = renderPageV3('soft', data)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<title>Sac à bandoulière en cuir vintage</title>')
    expect(html).toContain('Sac à bandoulière en cuir vintage')
    expect(html).toContain('79€')
    expect(html).toContain('a.jpg')  // hero image
  })
})
```

- [ ] **Step 8: Run all V3 tests + commit**

```bash
npx vitest run src/lib/sections-v3 src/lib/styles src/lib/images src/types
git add -A
git commit -m "feat(v3): renderPageV3 + display rules + feature flag KONVERT_V3_RENDERER"
```

---

# Sprint 2 — OBITO maquettes 1/2 (5j)

Goal sprint : Faire designer par OBITO 5 maquettes HTML/CSS standalone, validées visuellement avant tout code production. C'est de la **maquette pure** dans `design/mockups/`, zéro Next.js, zéro React.

## Task 2.1: Brief OBITO + style "soft" maquette

**Files:**
- Create: `design/mockups/style-soft.html`
- Create: `design/mockups/style-soft-mobile.html`
- Create: `design/mockups/style-soft.notes.md`
- Create: `design/mockups/style-soft.tokens.json`
- Create: `design/mockups/_brief-template.md` (réutilisable)

- [ ] **Step 1: Créer le brief template réutilisable**

Create `design/mockups/_brief-template.md`:

```markdown
# Brief OBITO — Style {STYLE_ID}

## Mission
Design le style "{STYLE_NAME}" pour Konvert V3.
**Vibe cible** : {VIBE_DESCRIPTION}.
**Références visuelles** : {REFS_URLS}.

## Sections à designer (13)
hero · gallery · why_we_love · thoughtfully_designed · best_for ·
materials_breakdown · how_it_works · compare_variants · reviews_ai_summary ·
press_quote · care_instructions · faq · brand_manifesto

## Produit-exemple
{PRODUCT_TITLE}
{PRODUCT_DESCRIPTION}
Prix : {PRICE}
Images : {IMAGES_URLS}

## Contraintes
- Universel : aucune logique thématique, doit marcher pour tout produit
- Responsive : desktop + mobile
- WCAG AA (contrast ratio ≥ 4.5:1)
- Pas d'icônes emoji
- Animations subtiles (CSS keyframes, max 400ms)
- Images = celles du produit-exemple uniquement (pas de stock)

## Livrables
- `style-{STYLE_ID}.html` : page complète scrollable, HTML/CSS pur
- `style-{STYLE_ID}-mobile.html` : variante mobile testée
- `style-{STYLE_ID}.notes.md` : justifications + décisions design
- `style-{STYLE_ID}.tokens.json` : palette, typo, spacing, radius, anims extraits
```

- [ ] **Step 2: Dispatch OBITO via Agent tool**

Lancer un agent OBITO avec le brief soft (Mejuri/Glossier). OBITO produit les 4 livrables. Délai estimé : 1-2 jours.

Code de la commande (à exécuter manuellement) :

```ts
// pseudo-code de l'invocation OBITO
Agent({
  subagent_type: 'obito',
  description: 'Maquette style soft',
  prompt: `
    Mission : design le style "Soft" pour Konvert V3.
    Voir brief complet dans /Users/mac/nexara/konvert/design/mockups/_brief-template.md
    Spec source : docs/superpowers/specs/2026-05-26-konvert-pages-v3-design.md (section 4 + 5)

    Vibe : Mejuri × Glossier. Serif élégant (Cormorant), palette cream (#FAF7F2),
    accent bronze doux (#C9A77E), white space généreux, radius petits (6px),
    animations subtiles.

    Tokens de référence : src/lib/styles/soft/tokens.ts (déjà codé en Sprint 1).
    NE PAS modifier les tokens, juste les utiliser visuellement.

    Produit-exemple : Sac à bandoulière en cuir vintage, 79€, 5 photos
    (utiliser unsplash placeholders neutres pour la démo).

    Livrables dans /Users/mac/nexara/konvert/design/mockups/ :
    - style-soft.html (desktop, page complète scrollable, toutes les 13 sections)
    - style-soft-mobile.html (variante mobile testée 375px)
    - style-soft.notes.md (justifications design + références)
    - style-soft.tokens.json (extraction tokens pour validation)
  `,
})
```

- [ ] **Step 3: Review visuelle (30 min Syphax)**

```bash
open /Users/mac/nexara/konvert/design/mockups/style-soft.html
```

Comparer side-by-side avec mejuri.com et allbirds.com.

Critères review :
- [ ] White space respiratoire (pas dense, pas claustrophobe)
- [ ] Typo hiérarchisée (h1 grand serif, body lisible)
- [ ] Photos produit dominent (>50% surface viewport)
- [ ] Pas de section avec image générique ou décorative inutile
- [ ] Section materials_breakdown lit bien (3 cartes alignées)
- [ ] Mobile : pas de scroll horizontal involontaire
- [ ] Animations discrètes au scroll (pas tape-à-l'œil)

Si OK → step 4. Si retouches → re-dispatch OBITO avec annotations précises.

- [ ] **Step 4: Commit la maquette validée**

```bash
git add design/mockups/style-soft*
git add design/mockups/_brief-template.md
git commit -m "design(v3): style 'soft' mockup validated (Mejuri/Glossier vibe)"
```

## Task 2.2: Maquette style "editorial"

**Files:**
- Create: `design/mockups/style-editorial.html`
- Create: `design/mockups/style-editorial-mobile.html`
- Create: `design/mockups/style-editorial.notes.md`
- Create: `design/mockups/style-editorial.tokens.json`

- [ ] **Step 1: Définir les tokens editorial avant brief**

Create `src/lib/styles/editorial/tokens.ts`:

```ts
import type { StyleTokens } from '../types'

export const editorialTokens: StyleTokens = {
  colors: {
    bg:        '#FFFFFF',
    surface:   '#F8F6F2',
    accent:    '#0A0A0A',
    text:      '#0A0A0A',
    textMuted: '#5C5C5C',
    border:    'rgba(10, 10, 10, 0.1)',
  },
  fonts: {
    heading: '"Tiempos Headline", "Times New Roman", serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '160px', card: '40px', gap: '32px' },
  radius:  { card: '0px', button: '0px', image: '0px' },
  shadows: { card: 'none', hover: '0 0 0 1px rgba(10,10,10,0.2)' },
  motion:  { ease: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: '600ms' },
}
```

Create `src/lib/styles/editorial/index.ts`:

```ts
import type { StyleDefinition } from '../types'
import { editorialTokens } from './tokens'

export const editorialStyle: StyleDefinition = {
  id: 'editorial',
  name: 'Editorial',
  description: 'Magazine — grand serif, grilles asymétriques, radius 0',
  tokens: editorialTokens,
}

export { editorialTokens }
```

- [ ] **Step 2: Dispatch OBITO avec brief editorial**

Vibe : magazine type Aimé Leon Dore × Ssense. Grilles asymétriques, captions italic, photos full-bleed, hiérarchie typo dramatique.
Références : aimeleondore.com, ssense.com.

- [ ] **Step 3: Review + commit**

```bash
open design/mockups/style-editorial.html
# Review critères : asymétrie, contraste typo, photo full-bleed
git add design/mockups/style-editorial* src/lib/styles/editorial
git commit -m "design(v3): style 'editorial' tokens + mockup (magazine vibe)"
```

## Task 2.3: Maquette style "apple-clean"

**Files:**
- Create: `src/lib/styles/apple-clean/tokens.ts`
- Create: `src/lib/styles/apple-clean/index.ts`
- Create: `design/mockups/style-apple-clean*`

- [ ] **Step 1: Tokens apple-clean**

```ts
// src/lib/styles/apple-clean/tokens.ts
import type { StyleTokens } from '../types'

export const appleCleanTokens: StyleTokens = {
  colors: {
    bg: '#FFFFFF', surface: '#F5F5F7', accent: '#0066CC',
    text: '#1D1D1F', textMuted: '#86868B', border: '#D2D2D7',
  },
  fonts: {
    heading: '"SF Pro Display", "Inter", system-ui, sans-serif',
    body:    '"SF Pro Text", "Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '40px', gap: '24px' },
  radius:  { card: '12px', button: '980px', image: '12px' },
  shadows: { card: '0 4px 12px rgba(0,0,0,0.04)', hover: '0 12px 32px rgba(0,0,0,0.08)' },
  motion:  { ease: 'cubic-bezier(0.42, 0, 0.58, 1)', duration: '600ms' },
}
```

- [ ] **Step 2: Brief OBITO apple-clean → maquette → review → commit**

```bash
git add design/mockups/style-apple-clean* src/lib/styles/apple-clean
git commit -m "design(v3): style 'apple-clean' tokens + mockup"
```

## Task 2.4: Maquette style "luxe-noir"

**Files:**
- Create: `src/lib/styles/luxe-noir/tokens.ts` + `index.ts`
- Create: `design/mockups/style-luxe-noir*`

⚠️ Note feedback mémoire : **JAMAIS de noir/quasi-noir en fond sur les designs NEXARA**. Exception ici : c'est LE style "Luxe Noir" pour des produits luxe/joaillerie. Mais on **doit avoir un usage très limité** : surfaces dark = sections specifiques (hero overlay, manifesto), pas la page entière. Le bg dominant peut être un dark warm (#1A1614 ou #14110F) plutôt qu'un noir pur.

- [ ] **Step 1: Tokens luxe-noir (avec discipline anti-noir-massif)**

```ts
// src/lib/styles/luxe-noir/tokens.ts
import type { StyleTokens } from '../types'

export const luxeNoirTokens: StyleTokens = {
  colors: {
    bg:        '#14110F',           // dark warm, pas noir pur (cf feedback NEXARA)
    surface:   '#1F1B17',
    accent:    '#C9A84C',           // or chaud
    text:      '#F5F0E8',
    textMuted: '#A89E91',
    border:    'rgba(245, 240, 232, 0.1)',
  },
  fonts: {
    heading: '"Playfair Display", "Times New Roman", serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '140px', card: '32px', gap: '24px' },
  radius:  { card: '2px', button: '0px', image: '2px' },
  shadows: { card: 'none', hover: '0 0 24px rgba(201, 168, 76, 0.3)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '500ms' },
}
```

- [ ] **Step 2: Brief OBITO luxe-noir → maquette → review → commit**

```bash
git add design/mockups/style-luxe-noir* src/lib/styles/luxe-noir
git commit -m "design(v3): style 'luxe-noir' tokens + mockup (dark warm + or)"
```

## Task 2.5: Maquette style "organic"

**Files:**
- Create: `src/lib/styles/organic/tokens.ts` + `index.ts`
- Create: `design/mockups/style-organic*`

- [ ] **Step 1: Tokens organic**

```ts
// src/lib/styles/organic/tokens.ts
import type { StyleTokens } from '../types'

export const organicTokens: StyleTokens = {
  colors: {
    bg: '#F4F1ED', surface: '#FAF8F4', accent: '#4A7C59',
    text: '#1F2D24', textMuted: '#6B7B70', border: 'rgba(31,45,36,0.08)',
  },
  fonts: {
    heading: '"DM Serif Display", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '128px', card: '32px', gap: '24px' },
  radius:  { card: '16px', button: '999px', image: '12px' },
  shadows: { card: '0 2px 8px rgba(31,45,36,0.06)', hover: '0 12px 32px rgba(31,45,36,0.1)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '500ms' },
}
```

- [ ] **Step 2: Brief OBITO organic → maquette → review → commit**

Référence : Aesop × Glossier. Vert sage, serif rond, photos botanique.

```bash
git add design/mockups/style-organic* src/lib/styles/organic
git commit -m "design(v3): style 'organic' tokens + mockup (Aesop vibe)"
```

---

# Sprint 3 — OBITO maquettes 2/2 (5j)

Goal : 5 maquettes restantes (bold, brutalist, warm-neutral, minimal-mono, vibrant).

## Task 3.1: Style "bold"

**Files:**
- Create: `src/lib/styles/bold/tokens.ts` + `index.ts`
- Create: `design/mockups/style-bold*`

- [ ] **Tokens + brief OBITO + commit**

```ts
// src/lib/styles/bold/tokens.ts
export const boldTokens: StyleTokens = {
  colors: {
    bg: '#FFFFFF', surface: '#FFF5E6', accent: '#FF2277',
    text: '#0F0F0F', textMuted: '#6B6B6B', border: '#0F0F0F',
  },
  fonts: {
    heading: '"PP Neue Machina", "Arial Black", sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '20px' },
  radius:  { card: '20px', button: '999px', image: '20px' },
  shadows: { card: '8px 8px 0 #0F0F0F', hover: '12px 12px 0 #FF2277' },
  motion:  { ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: '350ms' },
}
```

Vibe : DTC énergique type Olipop × Liquid Death. Bento layout, ombres dures décalées, accents flash.

```bash
git add design/mockups/style-bold* src/lib/styles/bold
git commit -m "design(v3): style 'bold' tokens + mockup (Olipop/bento vibe)"
```

## Task 3.2: Style "brutalist"

```ts
export const brutalistTokens: StyleTokens = {
  colors: {
    bg: '#F5F5F0', surface: '#FFFFFF', accent: '#FF6B35',
    text: '#000000', textMuted: '#666666', border: '#000000',
  },
  fonts: {
    heading: '"JetBrains Mono", "Courier New", monospace',
    body:    '"JetBrains Mono", "Courier New", monospace',
  },
  spacing: { section: '100px', card: '24px', gap: '16px' },
  radius:  { card: '0', button: '0', image: '0' },
  shadows: { card: 'none', hover: '4px 4px 0 #000' },
  motion:  { ease: 'linear', duration: '150ms' },
}
```

Vibe : Vercel + Linear + Bauhaus. Monospace, grilles strictes, anims sèches.

```bash
git add design/mockups/style-brutalist* src/lib/styles/brutalist
git commit -m "design(v3): style 'brutalist' tokens + mockup (monospace/Vercel)"
```

## Task 3.3: Style "warm-neutral"

```ts
export const warmNeutralTokens: StyleTokens = {
  colors: {
    bg: '#F4ECE0', surface: '#FAF5EC', accent: '#B5854B',
    text: '#3B2F23', textMuted: '#8B7D6E', border: 'rgba(59,47,35,0.1)',
  },
  fonts: {
    heading: '"PP Editorial New", Georgia, serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '128px', card: '32px', gap: '24px' },
  radius:  { card: '8px', button: '999px', image: '8px' },
  shadows: { card: '0 2px 8px rgba(59,47,35,0.06)', hover: '0 12px 32px rgba(59,47,35,0.1)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '450ms' },
}
```

Vibe : Aimé Leon Dore × Norse Projects. Tan, beige, sépia chaleureux.

```bash
git commit -m "design(v3): style 'warm-neutral' tokens + mockup (ALD/sepia)"
```

## Task 3.4: Style "minimal-mono"

```ts
export const minimalMonoTokens: StyleTokens = {
  colors: {
    bg: '#FFFFFF', surface: '#FAFAFA', accent: '#000000',
    text: '#000000', textMuted: '#737373', border: '#E5E5E5',
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '24px' },
  radius:  { card: '4px', button: '4px', image: '4px' },
  shadows: { card: 'none', hover: '0 4px 12px rgba(0,0,0,0.06)' },
  motion:  { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '300ms' },
}
```

Vibe : Apple noir et blanc, Muji. Strict, fonctionnel.

```bash
git commit -m "design(v3): style 'minimal-mono' tokens + mockup"
```

## Task 3.5: Style "vibrant"

```ts
export const vibrantTokens: StyleTokens = {
  colors: {
    bg: '#FFFFFF', surface: '#FFF8E1', accent: '#FF4D88',
    text: '#1A1A1A', textMuted: '#666666', border: '#1A1A1A',
  },
  fonts: {
    heading: '"Clash Display", "Inter", sans-serif',
    body:    '"Inter", system-ui, sans-serif',
  },
  spacing: { section: '120px', card: '32px', gap: '24px' },
  radius:  { card: '16px', button: '999px', image: '16px' },
  shadows: { card: '0 4px 16px rgba(255,77,136,0.15)', hover: '0 16px 40px rgba(255,77,136,0.25)' },
  motion:  { ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: '400ms' },
}
```

Vibe : Tonies × Lego × Squarespace coloré. Couleurs primaires saturées, créatif.

```bash
git commit -m "design(v3): style 'vibrant' tokens + mockup (kids/creative)"
```

## Task 3.6: Validation finale 10 styles

- [ ] **Step 1: Test consistency**

```bash
npx vitest run src/lib/styles
# All 10 style tokens files must exist + pass their schema test
```

- [ ] **Step 2: Galerie comparative (validation Syphax)**

```bash
# Ouvrir les 10 maquettes en tab navigateur
for f in design/mockups/style-*.html; do open "$f"; done
```

Confirmer : 10 styles tous visuellement distincts (>30% différents au moins).

- [ ] **Step 3: Commit final S3**

```bash
git add -A
git commit -m "chore(v3): sprint 3 done — 10 styles mockups validated"
```

---

# Sprint 4 — Sections V3 (1/2) (5j)

Goal : Coder en production 7 sections, en suivant les maquettes OBITO comme source of truth.

## Task 4.1: Section "gallery"

**Files:**
- Create: `src/lib/sections-v3/gallery/render.tsx` + `.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, it, expect } from 'vitest'
import { renderGallery } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const data: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'],
  copy: {},
}

describe('renderGallery', () => {
  it('renders all images from pool', () => {
    const html = renderGallery(data, softTokens)
    for (const img of data.images) expect(html).toContain(img)
  })
  it('uses horizontal scroll markup for mobile', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('overflow-x:auto')
  })
})
```

- [ ] **Step 2: Implémenter**

```tsx
import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

export function renderGallery(data: V3PageData, tokens: StyleTokens): string {
  const slides = data.images.map((src, i) => `
    <div class="v3-gallery__slide" style="
      flex: 0 0 auto; width: min(420px, 70vw);
      border-radius: ${tokens.radius.image};
      overflow: hidden;
    ">
      <img src="${src}" alt="${escapeHtml(data.product.title)} - vue ${i + 1}"
           style="width:100%;height:auto;display:block">
    </div>`).join('')

  return `
<section class="v3-gallery" style="
  background:${tokens.colors.bg};
  padding:${tokens.spacing.section} 0;
">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px 32px">
    <h2 style="
      font-family:${tokens.fonts.heading};color:${tokens.colors.text};
      font-size:clamp(28px,3vw,40px);margin:0
    ">Tous les angles</h2>
  </div>
  <div class="v3-gallery__track" style="
    display:flex;gap:${tokens.spacing.gap};
    overflow-x:auto;scroll-snap-type:x mandatory;
    padding: 0 24px;
  ">
    ${slides}
  </div>
</section>`.trim()
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
```

- [ ] **Step 3: Register dans render-page.ts + commit**

Modifier le `SECTION_RENDERERS` dans `render-page.ts` pour ajouter `gallery`.

```bash
git add src/lib/sections-v3/gallery src/lib/sections-v3/render-page.ts
git commit -m "feat(v3): section 'gallery' renderer (horizontal scroll)"
```

## Task 4.2: Section "why_we_love"

**Files:** `src/lib/sections-v3/why-we-love/render.tsx` + `.test.ts`

- [ ] **Tests**

```ts
describe('renderWhyWeLove', () => {
  it('renders copy.why_we_love text', () => {
    const html = renderWhyWeLove({ ...base, copy: { why_we_love: 'A breezier take on...' }}, softTokens)
    expect(html).toContain('A breezier take on...')
  })
  it('uses fallback when copy missing', () => {
    const html = renderWhyWeLove(base, softTokens)
    expect(html.length).toBeGreaterThan(0)  // ne crash pas
  })
  it('uses heading typo from tokens', () => {
    const html = renderWhyWeLove(base, softTokens)
    expect(html).toContain(softTokens.fonts.heading)
  })
})
```

- [ ] **Implementation**

```tsx
export function renderWhyWeLove(data: V3PageData, tokens: StyleTokens): string {
  const text = data.copy.why_we_love ?? data.product.description.slice(0, 280)
  return `
<section style="
  background:${tokens.colors.surface};
  padding:${tokens.spacing.section} 24px;
">
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <span style="
      display:inline-block;font-size:12px;letter-spacing:0.15em;
      color:${tokens.colors.textMuted};margin-bottom:24px;text-transform:uppercase
    ">Pourquoi on aime ça</span>
    <p style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(24px,2.5vw,36px);line-height:1.4;
      color:${tokens.colors.text};margin:0;font-weight:400
    ">${escapeHtml(text)}</p>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'why_we_love' renderer (story émotionnelle)"
```

## Task 4.3: Section "thoughtfully_designed"

**Files:** `src/lib/sections-v3/thoughtfully-designed/render.tsx` + `.test.ts`

- [ ] **Tests**

```ts
describe('renderThoughtfullyDesigned', () => {
  it('renders all features', () => {
    const features = [
      { name: 'TENCEL™ Lyocell', description: 'breathable tree fiber', isPropriety: true },
      { name: 'Soft lining', description: 'Merino wool', isPropriety: false },
    ]
    const html = renderThoughtfullyDesigned({ ...base, copy: { features }}, softTokens)
    expect(html).toContain('TENCEL™ Lyocell')
    expect(html).toContain('Soft lining')
  })
  it('renders empty when no features', () => {
    const html = renderThoughtfullyDesigned({ ...base, copy: { features: [] }}, softTokens)
    expect(html).toContain('Conçu avec soin')  // titre toujours
  })
})
```

- [ ] **Implementation**

```tsx
export function renderThoughtfullyDesigned(data: V3PageData, tokens: StyleTokens): string {
  const features = data.copy.features ?? []
  const items = features.map(f => `
    <li style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;
               border-bottom:1px solid ${tokens.colors.border}">
      <span style="
        width:8px;height:8px;border-radius:50%;
        background:${tokens.colors.accent};margin-top:8px;flex:0 0 auto
      "></span>
      <div>
        <strong style="
          font-family:${tokens.fonts.body};font-weight:600;color:${tokens.colors.text}
        ">${escapeHtml(f.name)}</strong>
        <p style="margin:4px 0 0;color:${tokens.colors.textMuted};font-size:15px;line-height:1.6">
          ${escapeHtml(f.description)}
        </p>
      </div>
    </li>`).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};
      margin:0 0 32px;font-weight:400
    ">Conçu avec soin</h2>
    <ul style="list-style:none;padding:0;margin:0">${items}</ul>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'thoughtfully_designed' renderer"
```

## Task 4.4: Section "best_for"

**Files:** `src/lib/sections-v3/best-for/render.tsx` + `.test.ts`

- [ ] **Tests**

```ts
describe('renderBestFor', () => {
  it('renders pills from best_for array', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Travelling', 'Walking', 'Everyday'] }}, softTokens)
    for (const pill of ['Travelling', 'Walking', 'Everyday']) {
      expect(html).toContain(pill)
    }
  })
})
```

- [ ] **Implementation**

```tsx
export function renderBestFor(data: V3PageData, tokens: StyleTokens): string {
  const pills = (data.copy.best_for ?? []).map(p => `
    <li style="
      padding:10px 20px;border:1px solid ${tokens.colors.border};
      border-radius:${tokens.radius.button};
      color:${tokens.colors.text};font-size:14px;font-weight:500
    ">${escapeHtml(p)}</li>`).join('')

  return `
<section style="background:${tokens.colors.surface};padding:80px 24px">
  <div style="max-width:1080px;margin:0 auto;text-align:center">
    <span style="
      font-size:12px;letter-spacing:0.15em;text-transform:uppercase;
      color:${tokens.colors.textMuted};display:block;margin-bottom:16px
    ">Idéal pour</span>
    <ul style="
      list-style:none;padding:0;margin:0;
      display:flex;flex-wrap:wrap;gap:12px;justify-content:center
    ">${pills}</ul>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'best_for' renderer (pills cas d'usage)"
```

## Task 4.5: Section "care_instructions"

**Files:** `src/lib/sections-v3/care-instructions/render.tsx` + `.test.ts`

- [ ] **Tests + Implementation**

```ts
describe('renderCareInstructions', () => {
  it('renders default care copy', () => {
    const html = renderCareInstructions(base, softTokens)
    expect(html.length).toBeGreaterThan(100)
  })
  it('renders custom care copy when provided', () => {
    const html = renderCareInstructions({ ...base, copy: { care: 'Lavable en machine 30°' }}, softTokens)
    expect(html).toContain('Lavable en machine 30°')
  })
})
```

```tsx
export function renderCareInstructions(data: V3PageData, tokens: StyleTokens): string {
  const care = data.copy.care ?? 'Pour conserver toute sa qualité, suis simplement les indications fournies avec le produit.'

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:880px;margin:0 auto">
    <div style="
      display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
      gap:${tokens.spacing.gap};
    ">
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">Entretien</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          ${escapeHtml(care)}
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">Livraison</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          Livraison gratuite à partir de 75€. Expédition sous 24-48h.
        </p>
      </div>
      <div>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:24px;
          color:${tokens.colors.text};margin:0 0 12px;font-weight:400
        ">Retours</h3>
        <p style="color:${tokens.colors.textMuted};line-height:1.6;margin:0">
          30 jours pour changer d'avis. Retour gratuit, remboursement sous 5 jours.
        </p>
      </div>
    </div>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'care_instructions' renderer (3 colonnes objection-killer)"
```

## Task 4.6: Section "faq"

**Files:** `src/lib/sections-v3/faq/render.tsx` + `.test.ts`

- [ ] **Tests + Implementation**

```ts
describe('renderFaq', () => {
  it('renders all faq entries', () => {
    const faq = [{ q: 'Q1', a: 'A1' }, { q: 'Q2', a: 'A2' }]
    const html = renderFaq({ ...base, copy: { faq }}, softTokens)
    expect(html).toContain('Q1')
    expect(html).toContain('A1')
    expect(html).toContain('Q2')
  })
  it('renders default faq when none provided', () => {
    const html = renderFaq(base, softTokens)
    expect(html).toContain('Questions fréquentes')
  })
})
```

```tsx
export function renderFaq(data: V3PageData, tokens: StyleTokens): string {
  const items = data.copy.faq ?? [
    { q: 'Combien de temps pour la livraison ?', a: '24 à 48h ouvrées en France.' },
    { q: 'Puis-je retourner le produit ?', a: 'Oui, sous 30 jours, retour gratuit.' },
  ]
  const list = items.map((f, i) => `
    <details style="
      border-bottom:1px solid ${tokens.colors.border};padding:24px 0
    ">
      <summary style="
        cursor:pointer;font-family:${tokens.fonts.body};font-weight:600;
        color:${tokens.colors.text};font-size:17px;list-style:none;
        display:flex;justify-content:space-between;align-items:center
      ">
        ${escapeHtml(f.q)}
        <span style="color:${tokens.colors.accent};font-size:24px;font-weight:300">+</span>
      </summary>
      <p style="margin:16px 0 0;color:${tokens.colors.textMuted};line-height:1.6">
        ${escapeHtml(f.a)}
      </p>
    </details>`).join('')

  return `
<section style="background:${tokens.colors.surface};padding:${tokens.spacing.section} 24px">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};
      margin:0 0 24px;font-weight:400
    ">Questions fréquentes</h2>
    ${list}
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'faq' renderer (details/summary)"
```

## Task 4.7: Section hero — finition production

L'implémentation POC du Sprint 1 est suffisante. Petites améliorations seulement :

- [ ] **Step 1: Ajouter ratings affichage propre + free shipping line**

Update `src/lib/sections-v3/hero/render.tsx` pour ajouter "Livraison gratuite dès 75€" sous le prix si applicable, et améliorer le rendering du rating (étoiles SVG simples).

- [ ] **Step 2: Tests additionnels + commit**

```ts
it('includes free shipping line when price >= 75', () => {
  const html = renderHero({ ...base, product: { ...base.product, price: '79€' }}, softTokens)
  expect(html).toContain('Livraison gratuite')
})
```

```bash
git commit -m "feat(v3): hero finition production (rating stars + free shipping)"
```

## Task 4.8: Sprint 4 validation

- [ ] **Step 1: Run all tests sections V3**

```bash
npx vitest run src/lib/sections-v3
# Expected: all green, 7 sections implémentées
```

- [ ] **Step 2: Smoke E2E render-page avec 7 sections**

Update `render-page.smoke.test.ts` :

```ts
it('renders 7 sections of S4 (hero, gallery, why, features, best_for, care, faq)', () => {
  const data: V3PageData = {
    styleId: 'soft', tone: 'auto',
    product: { title: 'Sac vintage', description: 'Cuir...' },
    images: ['a.jpg', 'b.jpg', 'c.jpg'],   // 3+ pour gallery
    copy: {
      hero: { tagline: 'X', subtagline: 'Y' },
      why_we_love: 'Some emotional text',
      features: [{ name: 'F1', description: 'D1' }],
      best_for: ['Quotidien', 'Sortie'],
      faq: [{ q: 'Q', a: 'A' }],
    },
  }
  const html = renderPageV3('soft', data)
  expect(html).toContain('v3-hero')
  expect(html).toContain('v3-gallery')
  // 5 autres sections présentes
  expect(html.match(/<section/g)?.length).toBeGreaterThanOrEqual(6)
})
```

```bash
git add -A
git commit -m "chore(v3): sprint 4 done — 7 sections code prod + smoke tests"
```

---

# Sprint 5 — Sections V3 (2/2) (5j)

Goal : 6 sections restantes (materials_breakdown, compare_variants, reviews_ai_summary, press_quote, brand_manifesto, how_it_works).

## Task 5.1: Section "materials_breakdown" ★

**Files:** `src/lib/sections-v3/materials-breakdown/render.tsx` + `.test.ts`

Section signature inspirée d'Allbirds. Affiche les matériaux extraits par AI + image de détail.

- [ ] **Tests**

```ts
describe('renderMaterialsBreakdown', () => {
  it('renders one card per material', () => {
    const materials = [
      { name: 'TENCEL™ Lyocell', benefit: 'breathable tree fiber', confidence: 0.9 },
      { name: 'Merino wool', benefit: 'soft lining', confidence: 0.85 },
    ]
    const html = renderMaterialsBreakdown({ ...base, copy: { materials }, images: ['a.jpg', 'b.jpg'] }, softTokens)
    expect(html).toContain('TENCEL™ Lyocell')
    expect(html).toContain('Merino wool')
  })
  it('uses detail images via rotation when no angle match', () => {
    const html = renderMaterialsBreakdown({
      ...base,
      copy: { materials: [
        { name: 'X', benefit: 'y', confidence: 0.8 },
        { name: 'Y', benefit: 'z', confidence: 0.8 },
        { name: 'Z', benefit: 'w', confidence: 0.8 },
      ]},
      images: ['a.jpg', 'b.jpg'],
    }, softTokens)
    expect(html).toContain('a.jpg')
    expect(html).toContain('b.jpg')
  })
})
```

- [ ] **Implementation**

```tsx
import { buildImagePool, getImage } from '@/lib/images/pool'

export function renderMaterialsBreakdown(data: V3PageData, tokens: StyleTokens): string {
  const materials = (data.copy.materials ?? []).filter(m => m.confidence >= 0.6)
  const pool = buildImagePool(data.images)

  const cards = materials.map((m, i) => {
    const img = getImage(pool, m.imageHint ?? 'detail', i)
    return `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="
        aspect-ratio:1;background:${tokens.colors.surface};
        border-radius:${tokens.radius.image};overflow:hidden
      ">
        <img src="${img}" alt="${escapeHtml(m.name)}"
             style="width:100%;height:100%;object-fit:cover;display:block">
      </div>
      <div>
        <span style="
          font-size:11px;letter-spacing:0.15em;text-transform:uppercase;
          color:${tokens.colors.textMuted}
        ">Matériau</span>
        <h3 style="
          font-family:${tokens.fonts.heading};font-size:20px;font-weight:400;
          color:${tokens.colors.text};margin:8px 0 6px
        ">${escapeHtml(m.name)}</h3>
        <p style="color:${tokens.colors.textMuted};font-size:14px;line-height:1.6;margin:0">
          ${escapeHtml(m.benefit)}
        </p>
      </div>
    </div>`
  }).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:1240px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);
      color:${tokens.colors.text};margin:0 0 48px;text-align:center;font-weight:400
    ">Les matériaux</h2>
    <div style="
      display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
      gap:${tokens.spacing.gap}
    ">${cards}</div>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'materials_breakdown' renderer (Allbirds signature)"
```

## Task 5.2: Section "compare_variants"

- [ ] **Tests + Implementation**

```ts
describe('renderCompareVariants', () => {
  it('renders all variants', () => {
    const variants = [
      { name: 'Noir', image: 'black.jpg' },
      { name: 'Cognac', image: 'cognac.jpg' },
    ]
    const html = renderCompareVariants({
      ...base, product: { ...base.product, variants }
    }, softTokens)
    expect(html).toContain('Noir')
    expect(html).toContain('Cognac')
    expect(html).toContain('black.jpg')
  })
})
```

```tsx
export function renderCompareVariants(data: V3PageData, tokens: StyleTokens): string {
  const variants = data.product.variants ?? []
  const cards = variants.map(v => `
    <div style="text-align:center">
      ${v.image ? `<div style="
        aspect-ratio:1;background:${tokens.colors.surface};
        border-radius:${tokens.radius.image};overflow:hidden;margin-bottom:12px
      ">
        <img src="${v.image}" alt="${escapeHtml(v.name)}"
             style="width:100%;height:100%;object-fit:cover">
      </div>` : ''}
      <span style="font-family:${tokens.fonts.body};color:${tokens.colors.text};font-size:14px">
        ${escapeHtml(v.name)}
      </span>
    </div>`).join('')

  return `
<section style="background:${tokens.colors.surface};padding:80px 24px">
  <div style="max-width:1080px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(24px,2.5vw,32px);
      color:${tokens.colors.text};margin:0 0 32px;text-align:center;font-weight:400
    ">Toutes les variantes</h2>
    <div style="
      display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
      gap:${tokens.spacing.gap}
    ">${cards}</div>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'compare_variants' renderer"
```

## Task 5.3: Section "reviews_ai_summary"

- [ ] **Tests + Implementation**

```ts
describe('renderReviewsAiSummary', () => {
  it('renders summary paragraph', () => {
    const html = renderReviewsAiSummary({
      ...base, copy: { reviews_summary: 'Customers love the comfort and breathability...' }
    }, softTokens)
    expect(html).toContain('Customers love the comfort')
  })
  it('shows rating count if present', () => {
    const html = renderReviewsAiSummary({
      ...base,
      product: { ...base.product, rating: { value: 4.6, count: 10190 }},
      copy: { reviews_summary: 'X' },
    }, softTokens)
    expect(html).toContain('10190')
  })
})
```

```tsx
export function renderReviewsAiSummary(data: V3PageData, tokens: StyleTokens): string {
  const summary = data.copy.reviews_summary
  if (!summary) return ''
  const rating = data.product.rating

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:880px;margin:0 auto;text-align:center">
    ${rating ? `
      <div style="margin-bottom:32px">
        <span style="
          font-family:${tokens.fonts.heading};font-size:48px;
          color:${tokens.colors.text};display:block;font-weight:400
        ">${rating.value}</span>
        <span style="color:${tokens.colors.accent};font-size:20px;letter-spacing:4px">★★★★★</span>
        <p style="color:${tokens.colors.textMuted};margin:8px 0 0">
          ${rating.count} avis vérifiés
        </p>
      </div>` : ''}
    <p style="
      font-family:${tokens.fonts.heading};font-size:clamp(20px,2vw,28px);
      color:${tokens.colors.text};line-height:1.5;margin:0;font-weight:400;font-style:italic
    ">"${escapeHtml(summary)}"</p>
    <p style="color:${tokens.colors.textMuted};margin:16px 0 0;font-size:13px">
      — Résumé généré à partir des avis clients
    </p>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'reviews_ai_summary' renderer"
```

## Task 5.4: Section "press_quote"

```ts
describe('renderPressQuote', () => {
  it('renders quote + source', () => {
    const html = renderPressQuote({
      ...base, copy: { press_quote: { quote: 'Game changer.', source: 'Vogue' }}
    }, softTokens)
    expect(html).toContain('Game changer.')
    expect(html).toContain('Vogue')
  })
})
```

```tsx
export function renderPressQuote(data: V3PageData, tokens: StyleTokens): string {
  const pq = data.copy.press_quote
  if (!pq) return ''
  const pool = buildImagePool(data.images)
  const lifestyleImg = getImage(pool, 'lifestyle', 0)

  return `
<section style="position:relative;padding:${tokens.spacing.section} 24px;overflow:hidden">
  ${lifestyleImg ? `
    <div style="position:absolute;inset:0;z-index:0">
      <img src="${lifestyleImg}" alt=""
           style="width:100%;height:100%;object-fit:cover;opacity:0.35">
      <div style="position:absolute;inset:0;background:${tokens.colors.bg};opacity:0.8"></div>
    </div>` : ''}
  <div style="
    position:relative;z-index:1;max-width:880px;margin:0 auto;text-align:center
  ">
    <p style="
      font-family:${tokens.fonts.heading};
      font-size:clamp(28px,3vw,42px);line-height:1.4;color:${tokens.colors.text};
      margin:0 0 24px;font-weight:400
    ">"${escapeHtml(pq.quote)}"</p>
    <span style="
      font-size:13px;letter-spacing:0.15em;text-transform:uppercase;
      color:${tokens.colors.textMuted}
    ">— ${escapeHtml(pq.source)}</span>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'press_quote' renderer"
```

## Task 5.5: Section "brand_manifesto"

```ts
describe('renderBrandManifesto', () => {
  it('renders headline + pillars', () => {
    const m = { headline: 'Better things, better way', pillars: ['Renewable', 'Recycled', 'Responsible'] }
    const html = renderBrandManifesto({ ...base, copy: { manifesto: m }}, softTokens)
    expect(html).toContain('Better things, better way')
    for (const p of m.pillars) expect(html).toContain(p)
  })
})
```

```tsx
export function renderBrandManifesto(data: V3PageData, tokens: StyleTokens): string {
  const m = data.copy.manifesto ?? {
    headline: `Conçu pour durer`,
    pillars: ['Qualité', 'Éthique', 'Transparence'],
  }
  const pool = buildImagePool(data.images)
  const lifestyle = getImage(pool, 'lifestyle', 0)

  const pillars = m.pillars.map(p => `
    <li style="font-family:${tokens.fonts.heading};font-size:18px;
               color:${tokens.colors.text};padding:8px 0;font-weight:400">
      <span style="color:${tokens.colors.accent};margin-right:12px">·</span>${escapeHtml(p)}
    </li>`).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="
    max-width:1240px;margin:0 auto;
    display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center
  ">
    <div>
      ${lifestyle ? `<img src="${lifestyle}" alt=""
        style="width:100%;border-radius:${tokens.radius.image};aspect-ratio:4/5;object-fit:cover">` : ''}
    </div>
    <div>
      <h2 style="
        font-family:${tokens.fonts.heading};font-size:clamp(36px,4vw,56px);
        color:${tokens.colors.text};margin:0 0 24px;font-weight:400;line-height:1.1
      ">${escapeHtml(m.headline)}</h2>
      <ul style="list-style:none;padding:0;margin:0">${pillars}</ul>
      <button style="
        margin-top:40px;background:${tokens.colors.text};color:${tokens.colors.surface};
        padding:16px 32px;border:0;border-radius:${tokens.radius.button};
        font-family:${tokens.fonts.body};font-size:15px;cursor:pointer
      ">Découvrir l'histoire</button>
    </div>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'brand_manifesto' renderer (mission + pillars)"
```

## Task 5.6: Section "how_it_works"

Section optionnelle, s'affiche pour skincare/wellness uniquement. Pour V3 simple : on l'affiche si copy contient `how_it_works` (steps).

D'abord, étendre V3PageData :

```ts
// src/types/v3.ts (ajouter dans copy)
copy: {
  // ...existing
  how_it_works?: Array<{ step: number; title: string; description: string }>
}
```

Et `display-rules.ts` :

```ts
case 'how_it_works':
  return Array.isArray(data.copy.how_it_works) && data.copy.how_it_works.length >= 2
```

```ts
describe('renderHowItWorks', () => {
  it('renders all steps', () => {
    const steps = [
      { step: 1, title: 'Nettoie', description: 'Applique sur peau sèche' },
      { step: 2, title: 'Patiente', description: 'Laisse poser 2 min' },
      { step: 3, title: 'Rince', description: 'À l\'eau tiède' },
    ]
    const html = renderHowItWorks({ ...base, copy: { how_it_works: steps }}, softTokens)
    expect(html).toContain('Nettoie')
    expect(html).toContain('Patiente')
    expect(html).toContain('Rince')
  })
})
```

```tsx
export function renderHowItWorks(data: V3PageData, tokens: StyleTokens): string {
  const steps = data.copy.how_it_works ?? []
  const items = steps.map(s => `
    <div style="text-align:center;flex:1">
      <div style="
        width:64px;height:64px;border-radius:50%;
        background:${tokens.colors.surface};display:flex;
        align-items:center;justify-content:center;margin:0 auto 16px;
        font-family:${tokens.fonts.heading};font-size:24px;
        color:${tokens.colors.accent};font-weight:600
      ">${s.step}</div>
      <h3 style="
        font-family:${tokens.fonts.heading};font-size:20px;
        color:${tokens.colors.text};margin:0 0 8px;font-weight:400
      ">${escapeHtml(s.title)}</h3>
      <p style="color:${tokens.colors.textMuted};font-size:14px;line-height:1.6;margin:0">
        ${escapeHtml(s.description)}
      </p>
    </div>`).join('')

  return `
<section style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 24px">
  <div style="max-width:1080px;margin:0 auto">
    <h2 style="
      font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);
      text-align:center;color:${tokens.colors.text};margin:0 0 48px;font-weight:400
    ">Comment l'utiliser</h2>
    <div style="display:flex;gap:${tokens.spacing.gap};flex-wrap:wrap">${items}</div>
  </div>
</section>`.trim()
}
```

```bash
git commit -m "feat(v3): section 'how_it_works' renderer (steps numbered)"
```

## Task 5.7: Register all 13 sections + smoke test

- [ ] **Step 1: Update SECTION_RENDERERS dans render-page.ts**

```ts
import { renderHero } from './hero/render'
import { renderGallery } from './gallery/render'
import { renderWhyWeLove } from './why-we-love/render'
import { renderThoughtfullyDesigned } from './thoughtfully-designed/render'
import { renderBestFor } from './best-for/render'
import { renderMaterialsBreakdown } from './materials-breakdown/render'
import { renderHowItWorks } from './how-it-works/render'
import { renderCompareVariants } from './compare-variants/render'
import { renderReviewsAiSummary } from './reviews-ai-summary/render'
import { renderPressQuote } from './press-quote/render'
import { renderCareInstructions } from './care-instructions/render'
import { renderFaq } from './faq/render'
import { renderBrandManifesto } from './brand-manifesto/render'

const SECTION_RENDERERS: Record<V3SectionKey, SectionRenderer> = {
  hero:                  renderHero,
  gallery:               renderGallery,
  why_we_love:           renderWhyWeLove,
  thoughtfully_designed: renderThoughtfullyDesigned,
  best_for:              renderBestFor,
  materials_breakdown:   renderMaterialsBreakdown,
  how_it_works:          renderHowItWorks,
  compare_variants:      renderCompareVariants,
  reviews_ai_summary:    renderReviewsAiSummary,
  press_quote:           renderPressQuote,
  care_instructions:     renderCareInstructions,
  faq:                   renderFaq,
  brand_manifesto:       renderBrandManifesto,
}
```

- [ ] **Step 2: Smoke test full page**

```ts
it('renders all 13 sections when data is complete', () => {
  const fullData: V3PageData = { /* complet, voir spec section 5 */ }
  const html = renderPageV3('soft', fullData)
  const sectionCount = (html.match(/<section/g) ?? []).length
  expect(sectionCount).toBeGreaterThanOrEqual(11)  // toutes sauf how_it_works si pas skincare
})
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(v3): sprint 5 done — 13 sections code prod + smoke full page"
```

---

# Sprint 6 — Styles code (10) + Wizard UX (5j)

Goal : Compléter les 9 styles restants en tokens code + implémenter l'UX wizard (StyleSummaryStep, StylePickerModal, TonePickerModal, DataValidationStep).

## Task 6.1: Register 10 styles dans render-page.ts

- [ ] **Step 1: Importer + map tous les tokens**

```ts
// src/lib/sections-v3/render-page.ts
import { softTokens } from '@/lib/styles/soft/tokens'
import { editorialTokens } from '@/lib/styles/editorial/tokens'
import { appleCleanTokens } from '@/lib/styles/apple-clean/tokens'
import { boldTokens } from '@/lib/styles/bold/tokens'
import { organicTokens } from '@/lib/styles/organic/tokens'
import { luxeNoirTokens } from '@/lib/styles/luxe-noir/tokens'
import { brutalistTokens } from '@/lib/styles/brutalist/tokens'
import { warmNeutralTokens } from '@/lib/styles/warm-neutral/tokens'
import { minimalMonoTokens } from '@/lib/styles/minimal-mono/tokens'
import { vibrantTokens } from '@/lib/styles/vibrant/tokens'

const STYLE_TOKENS: Record<StyleId, StyleTokens> = {
  'soft':          softTokens,
  'editorial':     editorialTokens,
  'apple-clean':   appleCleanTokens,
  'bold':          boldTokens,
  'organic':       organicTokens,
  'luxe-noir':     luxeNoirTokens,
  'brutalist':     brutalistTokens,
  'warm-neutral':  warmNeutralTokens,
  'minimal-mono':  minimalMonoTokens,
  'vibrant':       vibrantTokens,
}
```

- [ ] **Step 2: Test 10 styles**

```ts
it('renders successfully for all 10 styles', () => {
  const data: V3PageData = { /* base */ }
  for (const styleId of STYLE_IDS) {
    const html = renderPageV3(styleId, data)
    expect(html).toContain('<!DOCTYPE html>')
  }
})
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(v3): all 10 styles registered in renderPageV3"
```

## Task 6.2: Auto-pick logic

**Files:** `src/lib/styles/auto-pick.ts` + `.test.ts`

- [ ] **Tests**

```ts
import { describe, it, expect } from 'vitest'
import { suggestStyle } from './auto-pick'

describe('suggestStyle', () => {
  it('returns luxe-noir for jewelry products > 200€', () => {
    expect(suggestStyle({ title: 'Bague en or 18k', description: '', price: 450 })).toBe('luxe-noir')
  })
  it('returns soft for jewelry products < 200€', () => {
    expect(suggestStyle({ title: 'Collier en argent', description: '', price: 89 })).toBe('soft')
  })
  it('returns organic for skincare', () => {
    expect(suggestStyle({ title: 'Sérum hyaluronique', description: '' })).toBe('organic')
  })
  it('returns apple-clean for tech', () => {
    expect(suggestStyle({ title: 'Chargeur USB-C 65W', description: '' })).toBe('apple-clean')
  })
  it('returns minimal-mono when no category detected', () => {
    expect(suggestStyle({ title: 'Truc bidule', description: '' })).toBe('minimal-mono')
  })
})
```

- [ ] **Implementation**

```ts
import type { StyleId } from './types'
import { detectProductType } from '@/lib/templates/detect-product-type'

interface ProductInput {
  title?: string
  description?: string
  price?: number
}

export function suggestStyle(product: ProductInput): StyleId {
  const type = detectProductType({ title: product.title, description: product.description })
  if (!type) return 'minimal-mono'

  if (type === 'jewelry' && (product.price ?? 0) > 200) return 'luxe-noir'
  if (type === 'luxury') return 'luxe-noir'

  const map: Record<NonNullable<typeof type>, StyleId> = {
    jewelry:   'soft',
    skincare:  'organic',
    beauty:    'soft',
    tech:      'apple-clean',
    wellness:  'organic',
    fashion:   'warm-neutral',
    home:      'editorial',
    pet:       'vibrant',
    luxury:    'luxe-noir',
    universal: 'minimal-mono',
  }
  return map[type] ?? 'minimal-mono'
}
```

```bash
git commit -m "feat(v3): suggestStyle auto-pick logic (product → style)"
```

## Task 6.3: Tone prompts + auto-pick tone

**Files:** `src/lib/ai/tone-prompts.ts` + `auto-pick-tone.ts` + tests

- [ ] **Tests**

```ts
describe('autoPickTone', () => {
  it('returns premium for luxury items > 200€', () => {
    expect(autoPickTone({ title: 'Bague or', description: '', price: 350 })).toBe('premium')
  })
  it('returns educational for wellness/skincare', () => {
    expect(autoPickTone({ title: 'Sérum', description: '' })).toBe('educational')
  })
  it('returns bold for tech', () => {
    expect(autoPickTone({ title: 'Drone 4K', description: '' })).toBe('bold')
  })
  it('default friendly', () => {
    expect(autoPickTone({ title: 'Sac', description: '' })).toBe('friendly')
  })
})
```

- [ ] **Implementation**

```ts
// src/lib/ai/tone-prompts.ts
import type { CopyTone } from '@/types/v3'

export const TONE_PROMPTS: Record<CopyTone, string> = {
  auto: '',  // pas injecté, fallback heuristique
  friendly: `
Voice: tutoiement chaleureux. Phrases courtes et accessibles. Exemples concrets de la vie quotidienne.
Évite : jargon marketing, superlatifs creux, ton corporate. Va droit au but.
Exemple ton : "T'as déjà ressenti ce moment où tu voulais juste un truc qui marche, sans chichis ?"`.trim(),
  premium: `
Voice: vouvoiement. Vocabulaire raffiné, peu d'exclamations, phrases riches mais lisibles.
Évite : tutoiement, emojis, langage familier, fausses urgences.
Exemple ton : "Conçu pour celles qui savent reconnaître la qualité d'un geste simple."`.trim(),
  bold: `
Voice: direct, phrases courtes, claims forts. Énergie palpable. Verbe d'action en premier.
Évite : circonlocutions, hedging ("peut-être", "souvent"), longueurs.
Exemple ton : "Tu veux du résultat. Voilà. Pas de bla-bla."`.trim(),
  storytelling: `
Voice: narratif. Ouvre par une scène ou un moment précis. Voyage émotionnel.
Évite : bullet points secs, données chiffrées comme argument unique.
Exemple ton : "Tout commence un matin de juin, quand Sarah cherchait le sac parfait..."`.trim(),
  educational: `
Voice: pédagogique mais accessible. Explique le pourquoi avant le quoi. Référence scientifique si pertinent.
Évite : jargon non expliqué, suractivation marketing.
Exemple ton : "Le rétinol fonctionne en stimulant le renouvellement cellulaire — voici pourquoi c'est efficace."`.trim(),
}
```

```ts
// src/lib/ai/auto-pick-tone.ts
import type { CopyTone } from '@/types/v3'
import { detectProductType } from '@/lib/templates/detect-product-type'

export function autoPickTone(product: { title?: string; description?: string; price?: number }): CopyTone {
  const type = detectProductType({ title: product.title, description: product.description })

  if ((product.price ?? 0) > 200 && (type === 'jewelry' || type === 'luxury')) return 'premium'
  if (type === 'skincare' || type === 'wellness') return 'educational'
  if (type === 'tech') return 'bold'
  if (type === 'fashion' || type === 'beauty') return 'friendly'
  return 'friendly'
}
```

```bash
git commit -m "feat(v3): tone prompts (6 tones) + autoPickTone heuristic"
```

## Task 6.4: Update API generate route pour V3

**Files:** Modify `src/app/api/generate/route.ts`

Le détail dépend du code existant. Approche : ajouter en option un `engine: 'v3' | 'legacy'` dans le body, et si `v3` :
1. Détecter style auto-picked
2. Détecter tone auto-picked
3. Injecter `TONE_PROMPTS[tone]` dans le system prompt DeepSeek
4. Demander à DeepSeek de retourner `materials` avec champ `confidence`
5. Construire `V3PageData` et le retourner

- [ ] **Step 1: Lire le route.ts existant pour comprendre la signature**

```bash
cat src/app/api/generate/route.ts
```

- [ ] **Step 2: Étendre avec branche V3**

Pseudocode :

```ts
const body = await request.json()
const useV3 = body.engine === 'v3' || process.env.KONVERT_V3_RENDERER === 'true'

if (useV3) {
  const styleId = body.styleId ?? suggestStyle(scrapedProduct)
  const tone = body.tone ?? autoPickTone(scrapedProduct)
  const systemPrompt = buildV3SystemPrompt({ tone, product: scrapedProduct })
  const aiOutput = await callDeepSeek(systemPrompt, scrapedProduct)
  const v3Data: V3PageData = {
    styleId, tone,
    product: scrapedProduct,
    images: body.images ?? scrapedProduct.images,  // user-provided override
    copy: aiOutput,
  }
  const html = renderPageV3(styleId, v3Data)
  return Response.json({ html, data: v3Data })
}
// legacy path unchanged
```

- [ ] **Step 3: Tests integration**

```ts
// tests/api/generate-v3.test.ts (Vitest, mock fetch DeepSeek)
it('returns V3 HTML when engine=v3', async () => { ... })
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(v3): API generate supports engine=v3 (style + tone + materials confidence)"
```

## Task 6.5: StyleSummaryStep component (étape Style du wizard)

**Files:** `src/app/(dashboard)/dashboard/new/components/StyleSummaryStep.tsx`

- [ ] **Implementation** (composant client)

```tsx
'use client'

import { useState } from 'react'
import { suggestStyle } from '@/lib/styles/auto-pick'
import { autoPickTone } from '@/lib/ai/auto-pick-tone'
import { STYLE_LABELS } from '@/lib/styles'
import type { StyleId } from '@/lib/styles/types'
import type { CopyTone } from '@/types/v3'
import { StylePickerModal } from './StylePickerModal'
import { TonePickerModal } from './TonePickerModal'

interface Props {
  product: { title: string; description?: string; price?: number }
  imagesCount: number
  onContinue: (config: { styleId: StyleId; tone: CopyTone }) => void
  onBack: () => void
}

export function StyleSummaryStep({ product, imagesCount, onContinue, onBack }: Props) {
  const [styleId, setStyleId] = useState<StyleId>(() => suggestStyle(product))
  const [tone, setTone] = useState<CopyTone>('auto')
  const [showStyleModal, setShowStyleModal] = useState(false)
  const [showToneModal, setShowToneModal] = useState(false)

  const effectiveTone = tone === 'auto' ? autoPickTone(product) : tone

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-2">Étape 4/8 — Style de ta page</h1>

      <div className="bg-white rounded-lg shadow-sm border p-8 mt-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span aria-hidden>✨</span> Voici ce qu'on va créer pour toi
        </h2>

        <Field icon="🛍️" label="Produit">
          <strong>{product.title}</strong>
        </Field>

        <Field icon="🎨" label="Style auto-sélectionné">
          <strong>{STYLE_LABELS[styleId]}</strong>
        </Field>

        <Field icon="🗣️" label="Ton de la copy">
          <strong>{tone === 'auto' ? `Auto (${effectiveTone})` : effectiveTone}</strong>
        </Field>

        <Field icon="📐" label="Page générée">
          13 sections premium, mobile-first
          <div className="text-sm text-neutral-600 mt-1">
            Hero · Galerie · Story · Features · Best for ·
            Materials · Reviews · FAQ · Manifesto …
          </div>
        </Field>

        <Field icon="🖼️" label="Images">
          {imagesCount} (finalisées étape précédente)
        </Field>

        <Field icon="✍️" label="Copy">
          Générée par AI, éditable après publication
        </Field>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={() => setShowStyleModal(true)}
          className="px-6 py-3 border border-neutral-200 rounded-lg text-left
                     hover:border-neutral-400 transition-colors"
        >
          🎨 Choisir une template manuellement
        </button>
        <button
          onClick={() => setShowToneModal(true)}
          className="px-6 py-3 border border-neutral-200 rounded-lg text-left
                     hover:border-neutral-400 transition-colors"
        >
          🗣️ Personnaliser le ton de la copy
        </button>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3">← Retour</button>
        <button
          onClick={() => onContinue({ styleId, tone })}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold"
        >
          Générer ma page →
        </button>
      </div>

      {showStyleModal && (
        <StylePickerModal
          currentStyle={styleId}
          product={product}
          onSelect={(id) => { setStyleId(id); setShowStyleModal(false) }}
          onClose={() => setShowStyleModal(false)}
        />
      )}
      {showToneModal && (
        <TonePickerModal
          currentTone={tone}
          onSelect={(t) => { setTone(t); setShowToneModal(false) }}
          onClose={() => setShowToneModal(false)}
        />
      )}
    </div>
  )
}

function Field({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="text-2xl" aria-hidden>{icon}</span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{label}</div>
        <div className="text-neutral-900">{children}</div>
      </div>
    </div>
  )
}
```

```bash
git commit -m "feat(v3): StyleSummaryStep component (wizard étape 4)"
```

## Task 6.6: StylePickerModal

**Files:** `src/app/(dashboard)/dashboard/new/components/StylePickerModal.tsx`

```tsx
'use client'

import { useState } from 'react'
import { STYLE_IDS, STYLE_LABELS } from '@/lib/styles'
import type { StyleId } from '@/lib/styles/types'

interface Props {
  currentStyle: StyleId
  product: { title: string; description?: string }
  onSelect: (id: StyleId) => void
  onClose: () => void
}

export function StylePickerModal({ currentStyle, product, onSelect, onClose }: Props) {
  const [picked, setPicked] = useState<StyleId>(currentStyle)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8"
           onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Choisis une template</h2>
            <p className="text-neutral-600 mt-1">
              Style auto-sélectionné en fonction de ton produit. Tu peux en choisir une autre.
            </p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-2 hover:bg-neutral-100 rounded">
            ✕
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STYLE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setPicked(id)}
              className={`relative aspect-square rounded-lg border-2 p-3 text-left transition-all ${
                picked === id ? 'border-purple-600' : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {picked === id && (
                <span className="absolute top-2 right-2 text-purple-600 text-xl">✓</span>
              )}
              <StyleMiniPreview styleId={id} />
              <div className="text-sm font-semibold mt-2">{STYLE_LABELS[id].split(' — ')[0]}</div>
              <div className="text-xs text-neutral-500">{STYLE_LABELS[id].split(' — ')[1] ?? ''}</div>
            </button>
          ))}
        </div>

        <footer className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-3">Annuler</button>
          <button
            onClick={() => onSelect(picked)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold"
          >
            Utiliser cette template
          </button>
        </footer>
      </div>
    </div>
  )
}

function StyleMiniPreview({ styleId }: { styleId: StyleId }) {
  // V3 simple : mini gradient preview basé sur les tokens. V4 : preview HTML réel cachée 24h.
  const colors: Record<StyleId, string> = {
    'soft': 'linear-gradient(135deg, #FAF7F2, #C9A77E)',
    'editorial': 'linear-gradient(135deg, #FFFFFF, #0A0A0A)',
    'apple-clean': 'linear-gradient(135deg, #FFFFFF, #0066CC)',
    'bold': 'linear-gradient(135deg, #FFFFFF, #FF2277)',
    'organic': 'linear-gradient(135deg, #F4F1ED, #4A7C59)',
    'luxe-noir': 'linear-gradient(135deg, #14110F, #C9A84C)',
    'brutalist': 'linear-gradient(135deg, #F5F5F0, #FF6B35)',
    'warm-neutral': 'linear-gradient(135deg, #F4ECE0, #B5854B)',
    'minimal-mono': 'linear-gradient(135deg, #FFFFFF, #000000)',
    'vibrant': 'linear-gradient(135deg, #FFF8E1, #FF4D88)',
  }
  return <div style={{ width: '100%', height: '60%', background: colors[styleId], borderRadius: '4px' }} />
}
```

```bash
git commit -m "feat(v3): StylePickerModal (grille 10 styles avec preview gradient)"
```

## Task 6.7: TonePickerModal

```tsx
'use client'

import { useState } from 'react'
import type { CopyTone } from '@/types/v3'

const TONES: Array<{ id: CopyTone; label: string; description: string; example: string }> = [
  { id: 'auto', label: 'Auto (recommandé)', description: "L'AI choisit selon ton produit", example: '—' },
  { id: 'friendly', label: 'Friendly & accessible', description: 'Tutoiement, exemples concrets, chaleureux',
    example: '"T\'as déjà ressenti ce moment où…"' },
  { id: 'premium', label: 'Premium & élégant', description: 'Vouvoiement, vocabulaire raffiné',
    example: '"Conçu pour celles qui savent…"' },
  { id: 'bold', label: 'Bold & punchy', description: 'Direct, court, claims forts',
    example: '"Tu veux du résultat. Voilà."' },
  { id: 'storytelling', label: 'Storytelling émotionnel', description: 'Narratif, voyage, sens',
    example: '"Tout commence un matin de juin…"' },
  { id: 'educational', label: 'Éducatif & expert', description: 'Pédagogique, jargon métier',
    example: '"Le rétinol fonctionne en stimulant…"' },
]

interface Props {
  currentTone: CopyTone
  onSelect: (t: CopyTone) => void
  onClose: () => void
}

export function TonePickerModal({ currentTone, onSelect, onClose }: Props) {
  const [picked, setPicked] = useState<CopyTone>(currentTone)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8"
           onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Choisis le ton de ta copy</h2>
            <p className="text-neutral-600 mt-1">Comment ta page doit-elle parler au client ?</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-2 hover:bg-neutral-100 rounded">✕</button>
        </header>

        <div className="space-y-3">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setPicked(t.id)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                picked === t.id ? 'border-purple-600 bg-purple-50' : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <strong>{t.label}</strong>
                {picked === t.id && <span className="text-purple-600">✓</span>}
              </div>
              <div className="text-sm text-neutral-600 mb-2">{t.description}</div>
              {t.example !== '—' && (
                <div className="text-sm italic text-neutral-500">Ex : {t.example}</div>
              )}
            </button>
          ))}
        </div>

        <footer className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-6 py-3">Annuler</button>
          <button
            onClick={() => onSelect(picked)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold"
          >
            Appliquer
          </button>
        </footer>
      </div>
    </div>
  )
}
```

```bash
git commit -m "feat(v3): TonePickerModal (6 tones + Auto default)"
```

## Task 6.8: DataValidationStep

**Files:** `src/app/(dashboard)/dashboard/new/components/DataValidationStep.tsx`

S'affiche après génération, avant publication, si au moins 1 champ a confidence < 0.6.

```tsx
'use client'

import { useState } from 'react'
import type { V3PageData, MaterialEntry } from '@/types/v3'

interface Props {
  data: V3PageData
  onContinue: (data: V3PageData) => void
  onBack: () => void
}

export function DataValidationStep({ data, onContinue, onBack }: Props) {
  const [materials, setMaterials] = useState<MaterialEntry[]>(data.copy.materials ?? [])
  const [showReviews, setShowReviews] = useState(Boolean(data.copy.reviews_summary))

  const lowConfMaterials = materials.filter(m => m.confidence < 0.6)
  const hasReviews = Boolean(data.copy.reviews_summary)

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Vérifie les infos extraites</h1>

      <div className="space-y-4">
        <ValidatedRow status="ok" label="Nom" value={data.product.title} />
        <ValidatedRow status="ok" label="Prix" value={data.product.price ?? '—'} />

        <div className={`p-4 rounded-lg border ${
          lowConfMaterials.length > 0 ? 'border-yellow-300 bg-yellow-50' : 'border-green-200 bg-green-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {lowConfMaterials.length > 0 ? '⚠️' : '✅'}
            <strong>Matériaux extraits</strong>
            {lowConfMaterials.length > 0 && <span className="text-sm">(confidence basse — confirme ou complète)</span>}
          </div>
          {materials.map((m, i) => (
            <MaterialEditor
              key={i}
              material={m}
              onUpdate={(newM) => {
                const next = [...materials]; next[i] = newM; setMaterials(next)
              }}
              onDelete={() => setMaterials(materials.filter((_, j) => j !== i))}
            />
          ))}
          <button
            onClick={() => setMaterials([...materials, { name: '', benefit: '', confidence: 1 }])}
            className="text-sm text-purple-600 mt-2"
          >+ Ajouter un matériau</button>
        </div>

        {!hasReviews && (
          <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!showReviews}
                onChange={(e) => setShowReviews(!e.target.checked)}
              />
              Ne pas afficher la section reviews (aucun avis trouvé)
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3">← Retour</button>
        <button
          onClick={() => onContinue({
            ...data,
            copy: {
              ...data.copy,
              materials,
              reviews_summary: showReviews ? data.copy.reviews_summary : undefined,
            },
          })}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold"
        >
          Publier ma page →
        </button>
      </div>
    </div>
  )
}

function ValidatedRow({ status, label, value }: { status: 'ok' | 'warn'; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span>{status === 'ok' ? '✅' : '⚠️'}</span>
      <span className="text-neutral-500">{label} :</span>
      <strong>{value}</strong>
    </div>
  )
}

function MaterialEditor({ material, onUpdate, onDelete }: {
  material: MaterialEntry
  onUpdate: (m: MaterialEntry) => void
  onDelete: () => void
}) {
  return (
    <div className="flex gap-2 mb-2">
      <input
        value={material.name}
        onChange={(e) => onUpdate({ ...material, name: e.target.value, confidence: 1 })}
        placeholder="Nom du matériau"
        className="flex-1 px-3 py-2 border rounded"
      />
      <input
        value={material.benefit}
        onChange={(e) => onUpdate({ ...material, benefit: e.target.value, confidence: 1 })}
        placeholder="Bénéfice"
        className="flex-1 px-3 py-2 border rounded"
      />
      <button onClick={onDelete} className="px-3 py-2 text-red-600">✕</button>
    </div>
  )
}
```

```bash
git commit -m "feat(v3): DataValidationStep (confidence flag + manual edit)"
```

## Task 6.9: Brancher le wizard

**Files:** Modify `src/app/(dashboard)/dashboard/new/page.tsx`

Intégrer `StyleSummaryStep` à l'étape 4 et `DataValidationStep` après génération si nécessaire. Le détail dépend du code existant du wizard ; le pattern :

```ts
// pseudo
{step === 4 && <StyleSummaryStep
  product={product}
  imagesCount={images.length}
  onContinue={async ({ styleId, tone }) => {
    const result = await fetch('/api/generate', { method: 'POST', body: JSON.stringify({
      engine: 'v3', styleId, tone, product, images
    })}).then(r => r.json())
    const needsValidation = checkLowConfidence(result.data)
    setStep(needsValidation ? 4.5 : 5)
    setGeneratedData(result.data)
  }}
  onBack={() => setStep(3)}
/>}
{step === 4.5 && <DataValidationStep
  data={generatedData}
  onContinue={(validatedData) => publishAndGoToStep(5, validatedData)}
  onBack={() => setStep(4)}
/>}
```

```bash
git commit -m "feat(v3): wizard branche StyleSummaryStep + DataValidationStep"
```

---

# Sprint 7 — Dashboard images (4j)

Goal : Implémenter la gestion d'images à l'étape Produit (upload, drag-reorder, delete).

## Task 7.1: Setup Supabase Storage bucket

- [ ] **Step 1: Créer le bucket via Supabase dashboard**

```sql
-- via Supabase SQL editor
insert into storage.buckets (id, name, public)
values ('konvert-product-images', 'konvert-product-images', true);

-- RLS policy: users can upload to their own folder
create policy "Users can upload to own folder"
on storage.objects for insert
with check (
  bucket_id = 'konvert-product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Anyone can read"
on storage.objects for select
using (bucket_id = 'konvert-product-images');
```

- [ ] **Step 2: Helper côté serveur**

Create `src/lib/storage/images.ts`:

```ts
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function uploadProductImage(file: File, userId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from('konvert-product-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: pub } = supabase.storage
    .from('konvert-product-images')
    .getPublicUrl(data.path)
  return pub.publicUrl
}
```

- [ ] **Step 3: API route**

Create `src/app/api/upload-image/route.ts`:

```ts
import { NextRequest } from 'next/server'
import { uploadProductImage } from '@/lib/storage/images'
import { getServerUser } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return new Response('No file', { status: 400 })
  if (file.size > 10 * 1024 * 1024) return new Response('File too large (max 10MB)', { status: 413 })
  if (!file.type.startsWith('image/')) return new Response('Not an image', { status: 415 })

  const url = await uploadProductImage(file, user.id)
  return Response.json({ url })
}
```

```bash
git commit -m "feat(v3): Supabase Storage bucket + upload API"
```

## Task 7.2: ImageManager component

**Files:** `src/app/(dashboard)/dashboard/new/components/ImageManager.tsx`

```tsx
'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageManager({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    try {
      const newUrls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const r = await fetch('/api/upload-image', { method: 'POST', body: fd })
        if (r.ok) {
          const { url } = await r.json()
          newUrls.push(url)
        }
      }
      onChange([...images, ...newUrls])
    } finally {
      setUploading(false)
    }
  }

  function removeAt(i: number) {
    onChange(images.filter((_, j) => j !== i))
  }

  function move(from: number, to: number) {
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
        {images.map((src, i) => (
          <div
            key={src}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData('text/plain'))
              move(from, i)
            }}
            className="relative aspect-square rounded-lg overflow-hidden border bg-neutral-100 group cursor-move"
          >
            <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-7 h-7 bg-white/90 rounded-full
                         opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Supprimer"
            >✕</button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                Hero
              </span>
            )}
          </div>
        ))}
        <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300
                          flex items-center justify-center cursor-pointer hover:border-purple-400
                          text-neutral-400 hover:text-purple-600">
          <input type="file" accept="image/*" multiple onChange={handleUpload}
                 className="hidden" disabled={uploading} />
          <span className="text-3xl">+</span>
        </label>
      </div>
      <p className="text-xs text-neutral-500">
        {images.length} images · Drag pour réordonner · Clic ✕ pour supprimer · La première = hero
        {uploading && ' · Upload en cours…'}
      </p>
    </div>
  )
}
```

```bash
git commit -m "feat(v3): ImageManager component (upload + drag-reorder + delete)"
```

## Task 7.3: Brancher ImageManager dans l'étape Produit du wizard

Modify `src/app/(dashboard)/dashboard/new/page.tsx` étape 3 :

```tsx
{step === 3 && (
  <div className="max-w-3xl mx-auto p-8">
    <h1 className="text-3xl font-semibold mb-6">Étape 3/8 — Ton produit</h1>
    <input value={product.title} onChange={...} />
    <input value={product.price} onChange={...} />
    <textarea value={product.description} onChange={...} />

    <div className="mt-6">
      <label className="font-semibold block mb-2">🖼️ Images du produit</label>
      <ImageManager images={images} onChange={setImages} />
    </div>

    <button
      disabled={images.length === 0 || !product.title}
      onClick={() => setStep(4)}
      className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
    >
      Continuer →
    </button>
  </div>
)}
```

```bash
git commit -m "feat(v3): wizard étape Produit avec ImageManager intégré"
```

## Task 7.4: E2E smoke (manuel)

- [ ] **Step 1: Démarrer dev local**

```bash
cd /Users/mac/nexara/konvert
npm run dev
# → http://localhost:3000
```

- [ ] **Step 2: Test scénario complet**

1. Login dashboard
2. New page → entrer URL produit → scrape OK
3. Étape Produit : voir images scrapées, en supprimer 1, uploader 1 perso, drag-reorder
4. Étape Style : voir résumé, clic "Personnaliser ton" → choisir "premium" → revenir → générer
5. Vérifier : page générée avec style auto, ton premium, images user-ordered

- [ ] **Step 3: Bug fixes éventuels + commit final S7**

```bash
git commit -m "chore(v3): sprint 7 done — image upload management E2E validated"
```

---

# Sprint 8 — Migration + cleanup (3j)

Goal : Mapper les pages existantes vers le V3 et nettoyer la dette des 42 templates `etec-*`.

## Task 8.1: Mapping legacy → V3 + section migration

**Files:** `src/lib/migration/legacy-to-v3.ts` + `section-v2-to-v3.ts` + `.test.ts`

- [ ] **Implementation**

```ts
// src/lib/migration/legacy-to-v3.ts
import type { StyleId } from '@/lib/styles/types'

export const LEGACY_TEMPLATE_TO_STYLE: Record<string, StyleId> = {
  'etec-blue':      'apple-clean',
  'etec-noir':      'luxe-noir',
  'etec-rose':      'soft',
  'etec-sage':      'organic',
  'etec-gold':      'luxe-noir',
  'etec-energy':    'bold',
  'etec-beauty':    'soft',
  'etec-style':     'warm-neutral',
  'etec-shopz':     'minimal-mono',
  'etec-velvety':   'organic',
  'etec-prime':     'apple-clean',
  'etec-blusho':    'soft',
  'etec-casa':      'warm-neutral',
  'etec-pet':       'vibrant',
  'etec-gadget':    'apple-clean',
  'etec-aura':      'organic',
  'etec-luxe':      'luxe-noir',
  'etec-pulse':     'bold',
  'etec-nordic':    'editorial',
  'etec-cosmetix':  'soft',
  'etec-trendy':    'warm-neutral',
  'etec-solo':      'minimal-mono',
  'etec-prestige':  'luxe-noir',
  'etec-glow':      'soft',
  'etec-homestyle': 'warm-neutral',
  'etec-jewel':     'luxe-noir',
  'etec-techcase':  'minimal-mono',
  'etec-artisan':   'organic',
  'etec-outfit':    'warm-neutral',
  'etec-ella':      'soft',
  'etec-starter':   'minimal-mono',
  'etec-glowup':    'vibrant',
  'etec-hue':       'vibrant',
  'etec-interior':  'organic',
  'etec-platina':   'luxe-noir',
  'etec-streetz':   'brutalist',
  'etec-poterie':   'warm-neutral',
  'etec-electro':   'bold',
  'etec-agency':    'minimal-mono',
  'etec-supreme':   'brutalist',
  'etec-quarter':   'minimal-mono',
  'etec-boost':     'bold',
}

export function mapLegacyToStyle(templateId: string): StyleId {
  return LEGACY_TEMPLATE_TO_STYLE[templateId] ?? 'minimal-mono'
}
```

```ts
// src/lib/migration/section-v2-to-v3.ts
import type { V3SectionKey } from '@/types/v3'

const MAP: Record<string, V3SectionKey | null> = {
  'social_proof_bar':       'press_quote',
  'story':                  'why_we_love',
  'target_audience':        'best_for',
  'features':               'thoughtfully_designed',
  'gallery':                'gallery',
  'unique_mechanism':       'materials_breakdown',
  'how_it_works':           'how_it_works',
  'before_after':           null,
  'comparison':             null,
  'competitor_comparison':  null,
  'testimonials':           'reviews_ai_summary',
  'press_mentions':         'press_quote',
  'founder_note':           'brand_manifesto',
  'value_stack':            'care_instructions',
  'bonuses':                'care_instructions',
  'guarantee':              'care_instructions',
  'risk_reversal':          'care_instructions',
  'objections':             'faq',
  'community_callout':      'brand_manifesto',
  'final_pitch':            'brand_manifesto',
}

export function mapV2SectionsToV3(v2: string[]): V3SectionKey[] {
  const seen = new Set<V3SectionKey>()
  const result: V3SectionKey[] = ['hero']
  for (const key of v2) {
    const v3 = MAP[key]
    if (v3 && !seen.has(v3)) {
      seen.add(v3)
      result.push(v3)
    }
  }
  return result
}
```

- [ ] **Tests**

```ts
describe('mapLegacyToStyle', () => {
  it('maps all 42 etec-* templates to a valid StyleId', () => {
    for (const tpl of Object.keys(LEGACY_TEMPLATE_TO_STYLE)) {
      expect(STYLE_IDS).toContain(mapLegacyToStyle(tpl))
    }
  })
  it('returns minimal-mono for unknown template', () => {
    expect(mapLegacyToStyle('unknown-xyz')).toBe('minimal-mono')
  })
})

describe('mapV2SectionsToV3', () => {
  it('always includes hero first', () => {
    expect(mapV2SectionsToV3(['story', 'features'])[0]).toBe('hero')
  })
  it('removes duplicates', () => {
    const r = mapV2SectionsToV3(['testimonials', 'value_stack', 'bonuses'])
    expect(new Set(r).size).toBe(r.length)
  })
  it('drops null mappings (before_after, comparison)', () => {
    const r = mapV2SectionsToV3(['before_after', 'comparison'])
    expect(r).not.toContain('before_after')
    expect(r).toContain('hero')
  })
})
```

```bash
git commit -m "feat(v3): migration mappings legacy→v3 (template + sections)"
```

## Task 8.2: Migration script

**Files:** `scripts/migrate-pages-to-v3.ts`

```ts
#!/usr/bin/env tsx
/**
 * Migrate pages from legacy templates to V3 styles.
 *
 * Usage:
 *   tsx scripts/migrate-pages-to-v3.ts --dry-run   # default
 *   tsx scripts/migrate-pages-to-v3.ts --apply
 */
import { createClient } from '@supabase/supabase-js'
import { mapLegacyToStyle } from '@/lib/migration/legacy-to-v3'
import { mapV2SectionsToV3 } from '@/lib/migration/section-v2-to-v3'

const APPLY = process.argv.includes('--apply')
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (writing changes)' : 'DRY-RUN (no writes)'}`)

  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, template_id, section_order, style_id')

  if (error) throw error

  let migratedCount = 0
  let skippedCount = 0

  for (const page of pages ?? []) {
    if (page.style_id) {
      skippedCount++
      continue
    }
    const styleId = mapLegacyToStyle(page.template_id)
    const v3Sections = page.section_order
      ? mapV2SectionsToV3(page.section_order)
      : null

    console.log(`Page ${page.id}: ${page.template_id} → ${styleId}`)
    if (v3Sections) console.log(`  sections: ${v3Sections.join(', ')}`)

    if (APPLY) {
      const { error: upErr } = await supabase
        .from('pages')
        .update({
          style_id: styleId,
          section_order_v3: v3Sections,
        })
        .eq('id', page.id)
      if (upErr) {
        console.error(`  ❌ ${upErr.message}`)
      } else {
        migratedCount++
      }
    } else {
      migratedCount++
    }
  }

  console.log(`\nDone. Migrated: ${migratedCount}, Skipped (already migrated): ${skippedCount}`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 1: Migration DB schema (ajouter colonnes style_id + section_order_v3)**

```sql
-- supabase/migrations/20260526_v3_columns.sql
alter table pages add column if not exists style_id text;
alter table pages add column if not exists section_order_v3 text[];
create index if not exists pages_style_id_idx on pages(style_id);
```

- [ ] **Step 2: Dry-run**

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... tsx scripts/migrate-pages-to-v3.ts
# Output: liste des pages qui seraient migrées
```

- [ ] **Step 3: Apply (après validation manuelle du dry-run)**

```bash
tsx scripts/migrate-pages-to-v3.ts --apply
```

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-pages-to-v3.ts supabase/migrations/20260526_v3_columns.sql
git commit -m "feat(v3): migration script pages legacy → v3 (dry-run + apply)"
```

## Task 8.3: Activer le feature flag en prod

- [ ] **Step 1: Vérifier que tous les tests passent**

```bash
npx vitest run
npm run build
# Expected: 0 erreur, build clean
```

- [ ] **Step 2: Set env var Vercel**

```bash
# Via Vercel dashboard ou CLI
vercel env add KONVERT_V3_RENDERER production
# Value: true
vercel env add KONVERT_V3_RENDERER preview
# Value: true
```

- [ ] **Step 3: Deploy + smoke prod**

```bash
git push origin feat/pages-v3
# → PR
# → review
# → merge main
# → Vercel auto-deploy
# → vérifier https://konvertpilot.com sur 2-3 pages migrées
```

- [ ] **Step 4: Monitoring 24h**

Surveiller Sentry + analytics. Si régression → flip `KONVERT_V3_RENDERER=false` instantanément (rollback en < 1 min).

## Task 8.4: Cleanup legacy

⚠️ À faire **uniquement après 1-2 semaines stable en prod**.

- [ ] **Step 1: Supprimer les 42 fichiers etec-***

```bash
cd /Users/mac/nexara/konvert
git rm src/lib/templates/etec-*.ts
```

- [ ] **Step 2: Simplifier index.ts**

Réduire `src/lib/templates/index.ts` à un re-export de migration helpers seulement (les vrais renderers sont supprimés). Garder l'export `renderTemplate` qui DROP-IN renvoie vers V3 :

```ts
import { renderPageV3 } from '@/lib/sections-v3/render-page'
import { mapLegacyToStyle } from '@/lib/migration/legacy-to-v3'
import type { LandingPageData } from '@/types'

export function renderTemplate(templateId: string, data: LandingPageData): string {
  // Legacy fallback : convertir ancien LandingPageData → V3PageData minimaliste
  const styleId = mapLegacyToStyle(templateId)
  const v3Data = convertLegacyDataToV3(data, styleId)
  return renderPageV3(styleId, v3Data)
}
```

- [ ] **Step 3: Refondre la vitrine /templates marketing**

`src/app/(marketing)/templates/page.tsx` → présenter les 10 styles V3 avec thumbnails de pages générées (réutiliser StyleMiniPreview ou mockups OBITO).

- [ ] **Step 4: Tests + commit**

```bash
npx vitest run
git add -A
git commit -m "chore(v3): cleanup 42 etec-* legacy templates + revamp /templates page"
```

## Task 8.5: PR finale

```bash
gh pr create \
  --title "feat(v3): pages produit V3 architecture (styles + sections universelles)" \
  --body "$(cat <<'EOF'
## Summary
- 42 templates legacy → 10 styles purs (skins only)
- 20 sections V2 → 13 sections V3 Allbirds-grade
- Nouveau wizard UX : résumé textuel + boutons options (style/ton)
- Dashboard images management (upload/drag-reorder)
- Migration progressive via feature flag `KONVERT_V3_RENDERER`

## Test plan
- [x] 132+ tests Vitest verts
- [x] Build TS strict 0 erreur
- [x] Smoke test 10 styles × données complètes
- [x] Migration dry-run validé
- [x] Migration apply prod (`pages` table mise à jour)
- [x] Feature flag activé prod 1 semaine sans régression Sentry
- [ ] Cleanup 42 fichiers etec-* (après cette PR)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Self-Review (after writing the plan)

## Spec coverage check

Reading the spec section by section :

- **Section 1 (Problèmes)** : adressés via Sprints 1-7 ✓
- **Section 2 (Vision)** : impl. dans architecture Sprint 1 ✓
- **Section 3 (Architecture)** : Sprint 1 (Tasks 1.2, 1.4-1.6) ✓
- **Section 4 (10 styles)** : Sprints 2-3 (maquettes) + Task 6.1 (registration) ✓
- **Section 5 (13 sections V3)** : Sprints 4-5 (Tasks 4.1-5.7) ✓
- **Section 6 (ImagePool)** : Task 1.3 ✓
- **Section 7.1 (Étape Produit)** : Task 7.3 ✓
- **Section 7.2 (Étape Style)** : Task 6.5 ✓
- **Section 7.3 (Auto-pick)** : Task 6.2 ✓
- **Section 7.4 (DataValidationStep)** : Task 6.8 ✓
- **Section 8 (Workflow OBITO)** : Sprints 2-3 ✓
- **Section 9 (Migration)** : Sprint 8 (Tasks 8.1-8.4) ✓
- **Section 10 (Plan)** : matché 1:1 ✓
- **Section 11 (Risques)** : mitigations dans la prose des tasks ✓
- **Section 12 (Hors scope)** : aucune task pour IA images, multi-modèle copy, etc. ✓
- **Section 13 (Métriques succès)** : à instrumenter post-launch (pas dans plan) — ⚠️ ajouter task instrumentation ? Non, c'est post-V3.

Aucun gap détecté.

## Placeholder scan

Recherche de "TODO", "TBD", "implement later" : aucun trouvé dans le plan.

Quelques zones où l'engineer devra adapter au code réel :
- Task 6.4 (API generate) : "Le détail dépend du code existant" → c'est annoncé explicitement, l'engineer doit lire le route.ts existant. Acceptable.
- Task 6.9 (Wizard branche) : pseudo-code annoncé comme tel. Acceptable.
- Task 7.3 (étape Produit) : code stub à adapter. Acceptable.

## Type consistency

- `StyleId` cohérent partout (sect. 1.2 → 8.1)
- `V3SectionKey` cohérent
- `CopyTone` cohérent (sect. 1.2 + 6.3 + 6.7)
- `V3PageData.copy.materials: MaterialEntry[]` : défini Task 1.2, utilisé Tasks 5.1, 6.8 → OK
- `V3PageData.copy.how_it_works` ajouté Task 5.6 → cohérent avec display-rules.ts

Aucune incohérence détectée.

---

**Plan committed to** : `/Users/mac/nexara/konvert/docs/superpowers/plans/2026-05-26-konvert-pages-v3.md`
