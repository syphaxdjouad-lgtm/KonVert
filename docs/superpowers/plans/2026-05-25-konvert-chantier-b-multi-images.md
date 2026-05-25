# KONVERT — Chantier B : Multi-images & galerie produit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Câbler une galerie hero cliquable + section gallery dédiée + image dans `renderUniqueMechanism` dans les 42 templates KONVERT, exploitant les 8 images du scraper avec fallback gracieux et feature flag `KONVERT_GALLERY`.

**Architecture:** Deux nouvelles fonctions exportées de `sections.ts` (`renderHeroThumbs` helper hero + `renderGallery` section), enrichissement de `renderUniqueMechanism` pour utiliser `images[4]`, et script de refactor scripté pour câbler les 42 templates sans toucher leur layout hero existant.

**Tech Stack:** TypeScript strict, Vitest unit, HTML inline styles, JS onclick inline (pattern FAQ existant), feature flag via `process.env`, Next.js 14 App Router.

**Spec source:** `docs/superpowers/specs/2026-05-25-konvert-chantier-b-multi-images-design.md`

**Branche prévue :** `feat/multi-images-gallery` (créée depuis `feat/sections-riches-dtc` car dépend des structures du chantier A : `SectionKey`, `DEFAULT_ORDER`, `renderUniqueMechanism`)

---

## File Structure (vue d'ensemble)

```
konvert/
├── src/lib/templates/
│   ├── sections.ts                              [MODIFY] ~900 → ~1100 lignes
│   │                                                     +renderHeroThumbs, +renderGallery
│   │                                                     +SectionKey 'gallery', +DEFAULT_ORDER pos 5
│   │                                                     +SECTION_RENDERERS.gallery
│   │                                                     +modif renderUniqueMechanism (image opt)
│   ├── __tests__/
│   │   ├── sections.test.ts                     [MODIFY] +1 test DEFAULT_ORDER nouvelle longueur
│   │   └── gallery.test.ts                      [CREATE] tests Vitest renderHeroThumbs + renderGallery
│   ├── __fixtures__/
│   │   ├── mock-landing-data-full.ts            [MODIFY] +images: 8 URLs
│   │   └── mock-landing-data-partial.ts         [MODIFY] +images: 1 URL
│   └── etec-*.ts                                [MODIFY] 42 fichiers via script :
│                                                          - id stable sur l'<img> hero
│                                                          - ${renderHeroThumbs(...)} après
│                                                          - import renderHeroThumbs
├── scripts/
│   └── refactor-templates-hero-gallery.ts       [CREATE] --dry-run / --apply
├── docs/superpowers/plans/
│   └── 2026-05-25-konvert-chantier-b-...md      [CE FICHIER]
└── .env.example                                 [MODIFY] +KONVERT_GALLERY=true
```

**Responsabilités par fichier :**

- `sections.ts` — ajouter 2 fonctions exportées + 1 modification non-breaking + étendre les structures (`SectionKey`, `DEFAULT_ORDER`, `SECTION_RENDERERS`)
- `gallery.test.ts` — couverture unit dédiée chantier B (helper hero, section, régression mécanisme, feature flag)
- `mock-landing-data-*.ts` — ajouter le champ `images` aux fixtures existantes
- `etec-*.ts` — chaque template gagne 1 id sur son `<img>` hero + 1 appel à `renderHeroThumbs` + 1 import
- `refactor-templates-hero-gallery.ts` — script Node CLI dry-run/apply, pattern match sur `<img src="${imgs[0]}"`
- `.env.example` — documenter le nouveau flag

---

## Convention de commit

Préfixes utilisés dans ce plan (cohérents avec l'historique git existant) :

- `feat(sections):` pour ajout fonctionnel dans `sections.ts`
- `feat(templates):` pour le refactor des 42 templates
- `test(sections):` pour les tests Vitest
- `chore(scripts):` pour les scripts CLI utilitaires
- `chore(env):` pour les variables d'environnement
- `docs(spec):` pour les docs

---

### Task 0 : Setup branche feature

**Files:**
- N/A (opération git)

- [ ] **Step 1 : Vérifier état courant**

Run :
```bash
cd /Users/mac/nexara/konvert && git status && git branch --show-current
```
Expected : sur `feat/sections-riches-dtc` (chantier A) avec working tree clean ou modifs non-liées tolérées. Si modifs non commitées critiques, les stash avant.

- [ ] **Step 2 : Créer la branche feature**

Run :
```bash
cd /Users/mac/nexara/konvert && git checkout -b feat/multi-images-gallery
```
Expected : `Switched to a new branch 'feat/multi-images-gallery'`

- [ ] **Step 3 : Vérifier que la branche est créée**

Run :
```bash
git branch --show-current
```
Expected : `feat/multi-images-gallery`

---

### Task 1 : Étendre `SectionKey` + `DEFAULT_ORDER` avec `'gallery'` (TDD)

**Files:**
- Modify: `src/lib/templates/sections.ts:16-58` (type + DEFAULT_ORDER)
- Modify: `src/lib/templates/__tests__/sections.test.ts`

- [ ] **Step 1 : Écrire le test pour la nouvelle longueur de `DEFAULT_ORDER`**

Localiser dans `src/lib/templates/__tests__/sections.test.ts` le bloc `describe('DEFAULT_ORDER', ...)`. Modifier les assertions pour passer de 19 à 20 sections et inclure `'gallery'` à la position 5 (index 4) :

```ts
describe('DEFAULT_ORDER', () => {
  it('contient exactement 20 sections', () => {
    expect(DEFAULT_ORDER).toHaveLength(20)
  })

  it('contient toutes les SectionKey attendues dans le bon ordre', () => {
    expect(DEFAULT_ORDER).toEqual([
      'social_proof_bar',
      'story',
      'target_audience',
      'features',
      'gallery',
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
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts -t "DEFAULT_ORDER" 2>&1 | tail -15
```
Expected : 2 tests FAIL : longueur 19 au lieu de 20, et l'ordre n'inclut pas `'gallery'`.

- [ ] **Step 3 : Ajouter `'gallery'` à `SectionKey`**

Ouvrir `src/lib/templates/sections.ts`. Modifier le type `SectionKey` (ligne ~16) pour ajouter `'gallery'` après `'features'` :

```ts
export type SectionKey =
  | 'social_proof_bar'
  | 'story'
  | 'target_audience'
  | 'features'
  | 'gallery'
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
```

- [ ] **Step 4 : Ajouter `'gallery'` à `DEFAULT_ORDER`**

Dans le même fichier, modifier `DEFAULT_ORDER` (ligne ~37) pour insérer `'gallery'` à la position 4 (index, soit position 5 humaine) :

```ts
export const DEFAULT_ORDER: SectionKey[] = [
  'social_proof_bar',
  'story',
  'target_audience',
  'features',
  'gallery',
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

- [ ] **Step 5 : Vérifier que la compilation TS échoue (SECTION_RENDERERS incomplet)**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep -E "(error|gallery)" | head -10
```
Expected : erreur du type `Property 'gallery' is missing in type '...' but required in type 'Record<SectionKey, SectionRenderer>'`.

C'est attendu — on va ajouter le renderer à Task 4. Pour passer Task 1 sans bloquer, on ajoute un renderer placeholder qui retourne `''`.

- [ ] **Step 6 : Ajouter un renderer placeholder dans `SECTION_RENDERERS`**

Localiser `SECTION_RENDERERS` (ligne ~832). Ajouter temporairement un renderer placeholder pour `gallery` (sera remplacé à Task 4) :

```ts
const SECTION_RENDERERS: Record<SectionKey, SectionRenderer> = {
  social_proof_bar:        renderSocialProofBarV2,
  story:                   renderStoryV2,
  target_audience:         renderTargetAudience,
  features:                renderFeatures,
  gallery:                 () => '',  // placeholder, voir Task 4
  unique_mechanism:        renderUniqueMechanism,
  // ... (laisser les autres tels quels)
}
```

- [ ] **Step 7 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/sections.test.ts -t "DEFAULT_ORDER" 2>&1 | tail -10
```
Expected : 4 tests PASS.

- [ ] **Step 8 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -10
```
Expected : 0 erreur.

- [ ] **Step 9 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/sections.test.ts
git commit -m "feat(sections): étendre SectionKey + DEFAULT_ORDER avec 'gallery' (TDD)"
```

---

### Task 2 : Étendre les fixtures avec `images`

**Files:**
- Modify: `src/lib/templates/__fixtures__/mock-landing-data-full.ts`
- Modify: `src/lib/templates/__fixtures__/mock-landing-data-partial.ts`

- [ ] **Step 1 : Lire les fixtures existantes**

Run :
```bash
cd /Users/mac/nexara/konvert && head -20 src/lib/templates/__fixtures__/mock-landing-data-full.ts src/lib/templates/__fixtures__/mock-landing-data-partial.ts
```

Identifier où ajouter le champ `images` (probablement juste après `product_name` ou en début d'objet).

- [ ] **Step 2 : Ajouter 8 URLs d'images dans `mock-landing-data-full.ts`**

Ouvrir `src/lib/templates/__fixtures__/mock-landing-data-full.ts`. Ajouter le champ `images` à l'objet exporté (en haut ou en bas, peu importe — TypeScript ne s'en soucie pas) :

```ts
images: [
  'https://cdn.example.com/product-front.jpg',
  'https://cdn.example.com/product-side.jpg',
  'https://cdn.example.com/product-back.jpg',
  'https://cdn.example.com/product-detail-1.jpg',
  'https://cdn.example.com/product-lifestyle-1.jpg',
  'https://cdn.example.com/product-lifestyle-2.jpg',
  'https://cdn.example.com/product-packaging.jpg',
  'https://cdn.example.com/product-ingredient.jpg',
],
```

- [ ] **Step 3 : Ajouter 1 URL d'image dans `mock-landing-data-partial.ts`**

Ouvrir `src/lib/templates/__fixtures__/mock-landing-data-partial.ts`. Ajouter :

```ts
images: ['https://cdn.example.com/product-only.jpg'],
```

(Une seule image pour tester le fallback "1 image → pas de thumbs, pas de section gallery, pas d'image mécanisme".)

- [ ] **Step 4 : Vérifier que tous les tests Vitest existants passent encore**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -10
```
Expected : tous PASS (les tests existants n'utilisent pas encore le champ `images`, donc aucune régression).

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/__fixtures__/
git commit -m "test(sections): ajouter champ images aux fixtures (full=8, partial=1)"
```

---

### Task 3 : `renderHeroThumbs` (TDD)

**Files:**
- Create: `src/lib/templates/__tests__/gallery.test.ts`
- Modify: `src/lib/templates/sections.ts` (ajout fn vers la fin du fichier, avant `renderRichSections`)

- [ ] **Step 1 : Créer `gallery.test.ts` avec les tests `renderHeroThumbs`**

Créer le fichier `src/lib/templates/__tests__/gallery.test.ts` :

```ts
import { describe, it, expect, afterEach } from 'vitest'
import {
  renderHeroThumbs,
  renderGallery,
  renderUniqueMechanism,
  DEFAULT_THEME,
} from '../sections'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'

describe('renderHeroThumbs', () => {
  it('retourne "" si 0 image', () => {
    expect(renderHeroThumbs([], DEFAULT_THEME, 'kvt-hero-img-test')).toBe('')
  })

  it('retourne "" si 1 image (pas de thumbs utiles)', () => {
    expect(renderHeroThumbs(['https://cdn.example.com/1.jpg'], DEFAULT_THEME, 'kvt-hero-img-test')).toBe('')
  })

  it('rend 2 thumbs si 2 images', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('class="kvt-thumb')
    expect((html.match(/class="kvt-thumb/g) ?? []).length).toBe(2)
  })

  it('rend max 4 thumbs même si 8 images (cap)', () => {
    const images = Array.from({ length: 8 }, (_, i) => `https://cdn.example.com/${i}.jpg`)
    const html = renderHeroThumbs(images, DEFAULT_THEME, 'kvt-hero-img-test')
    expect((html.match(/class="kvt-thumb/g) ?? []).length).toBe(4)
  })

  it('injecte le mainImgId dans le onclick JS', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-etec-blue',
    )
    expect(html).toContain("'kvt-hero-img-etec-blue'")
  })

  it('inclut le script kvtSwapHero', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('function kvtSwapHero')
  })

  it('utilise les URLs réelles dans les src des thumbs', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('https://cdn.example.com/a.jpg')
    expect(html).toContain('https://cdn.example.com/b.jpg')
  })

  it('ne contient pas de couleurs hardcodées hors theme', () => {
    const html = renderHeroThumbs(
      ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    // Pas de #DC2626 / #059669 attendus dans heroThumbs (uniquement comparison/competitor_comparison)
    expect(html).not.toMatch(/#dc2626/i)
    expect(html).not.toMatch(/#059669/i)
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts 2>&1 | tail -15
```
Expected : tous FAIL avec `"renderHeroThumbs" is not exported by "sections.ts"` ou similaire.

- [ ] **Step 3 : Implémenter `renderHeroThumbs` dans `sections.ts`**

Ouvrir `src/lib/templates/sections.ts`. Localiser la fin de la dernière fonction exportée (avant la map `SECTION_RENDERERS`, ligne ~825 ou similaire). Insérer **juste avant le commentaire `// ─── SECTION_RENDERERS ─` ou similaire** :

```ts
// ─── renderHeroThumbs ──────────────────────────────────────────────────────
// Helper hero appelé directement par les 42 templates etec-*.ts dans leur
// HTML hero, juste après leur <img> principal. Rend 2-4 thumbnails cliquables
// + un <script> global qui swap le src de l'image principale via mainImgId.
// Feature flag KONVERT_GALLERY=false → return ''.

export function renderHeroThumbs(
  images: string[],
  theme: SectionTheme = DEFAULT_THEME,
  mainImgId: string,
): string {
  if (process.env.KONVERT_GALLERY === 'false') return ''
  const real = images.filter(Boolean)
  if (real.length < 2) return ''

  const thumbs = real.slice(0, 4)
  const thumbsHtml = thumbs.map((src, i) => `
    <button
      type="button"
      class="kvt-thumb${i === 0 ? ' kvt-thumb-active' : ''}"
      onclick="kvtSwapHero('${mainImgId}', '${src}', this)"
      style="
        aspect-ratio:1;
        width:72px;
        padding:0;
        border:2px solid ${i === 0 ? theme.primary : 'transparent'};
        border-radius:${theme.radius};
        background:transparent;
        cursor:pointer;
        overflow:hidden;
        opacity:${i === 0 ? '1' : '0.7'};
        transition:opacity 0.15s ease, border-color 0.15s ease;
      "
      onmouseover="this.style.opacity='1'"
      onmouseout="this.style.opacity=this.classList.contains('kvt-thumb-active')?'1':'0.7'"
      aria-label="Vue ${i + 1}"
    >
      <img
        src="${src}"
        alt=""
        style="width:100%;height:100%;object-fit:cover;display:block;"
        loading="lazy"
      />
    </button>
  `).join('')

  return `
<div class="kvt-hero-thumbs" style="
  display:flex;
  gap:8px;
  margin-top:16px;
  flex-wrap:wrap;
">
  ${thumbsHtml}
</div>
<script>
(function(){
  if (window.kvtSwapHero) return;
  window.kvtSwapHero = function(id, src, el) {
    var img = document.getElementById(id);
    if (img) img.src = src;
    var thumbs = el.parentElement.querySelectorAll('.kvt-thumb');
    thumbs.forEach(function(t){
      t.classList.remove('kvt-thumb-active');
      t.style.borderColor = 'transparent';
      t.style.opacity = '0.7';
    });
    el.classList.add('kvt-thumb-active');
    el.style.borderColor = '${theme.primary}';
    el.style.opacity = '1';
  };
})();
</script>
`.trim()
}
```

- [ ] **Step 4 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "renderHeroThumbs" 2>&1 | tail -10
```
Expected : 8 tests `renderHeroThumbs` PASS.

- [ ] **Step 5 : Vérifier TS strict**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -5
```
Expected : 0 erreur.

- [ ] **Step 6 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/gallery.test.ts
git commit -m "feat(sections): renderHeroThumbs helper + tests TDD (8 tests)"
```

---

### Task 4 : `renderGallery` + intégration `SECTION_RENDERERS` (TDD)

**Files:**
- Modify: `src/lib/templates/__tests__/gallery.test.ts`
- Modify: `src/lib/templates/sections.ts`

- [ ] **Step 1 : Ajouter les tests `renderGallery` à `gallery.test.ts`**

Ajouter à la fin de `src/lib/templates/__tests__/gallery.test.ts` :

```ts
describe('renderGallery', () => {
  it('retourne "" si <8 images (seuil grid 2x2)', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'],
    }
    expect(renderGallery(data, DEFAULT_THEME)).toBe('')
  })

  it('retourne "" si images undefined', () => {
    const { images, ...dataNoImages } = mockLandingDataFull as Record<string, unknown>
    expect(renderGallery(dataNoImages as typeof mockLandingDataFull, DEFAULT_THEME)).toBe('')
  })

  it('rend grid 2x2 si 8 images', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).toContain('class="kvt-gallery')
    // 4 images affichées (indices 4 à 7)
    expect(html).toContain(mockLandingDataFull.images![4])
    expect(html).toContain(mockLandingDataFull.images![5])
    expect(html).toContain(mockLandingDataFull.images![6])
    expect(html).toContain(mockLandingDataFull.images![7])
  })

  it('ne rend pas les 4 premières images (déjà dans hero galerie)', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).not.toContain(mockLandingDataFull.images![0])
    expect(html).not.toContain(mockLandingDataFull.images![1])
    expect(html).not.toContain(mockLandingDataFull.images![2])
    expect(html).not.toContain(mockLandingDataFull.images![3])
  })

  it('inclut loading="lazy" sur les images', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('loading="lazy"')
  })

  it('inclut le product_name dans les alt text', () => {
    const html = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain(`alt="${mockLandingDataFull.product_name}`)
  })

  it('utilise theme.bg / bgAlt et theme.radius', () => {
    const customTheme = { ...DEFAULT_THEME, bg: '#abcdef', radius: '20px' }
    const html = renderGallery(mockLandingDataFull, customTheme)
    expect(html).toContain('#abcdef')
    expect(html).toContain('20px')
  })

  it('label "Voir le produit en détail" en français par défaut', () => {
    const data = { ...mockLandingDataFull, language: 'fr' }
    const html = renderGallery(data, DEFAULT_THEME)
    expect(html).toContain('Voir le produit en détail')
  })

  it('label en anglais si language=en', () => {
    const data = { ...mockLandingDataFull, language: 'en' }
    const html = renderGallery(data, DEFAULT_THEME)
    expect(html).toContain('See it in detail')
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "renderGallery" 2>&1 | tail -15
```
Expected : 9 tests FAIL — `renderGallery` est encore le placeholder `() => ''`.

- [ ] **Step 3 : Implémenter `renderGallery` dans `sections.ts`**

Ouvrir `src/lib/templates/sections.ts`. **Juste après** `renderHeroThumbs` ajouté à Task 3, insérer :

```ts
// ─── renderGallery ─────────────────────────────────────────────────────────
// Section dédiée appelée par renderRichSections à la position 5 (après features).
// Affichée uniquement si images.length >= 8 (grid 2x2 = 4 cases, après 4 du hero).
// Feature flag KONVERT_GALLERY=false → return ''.

const GALLERY_LABEL: Record<string, string> = {
  fr: 'Voir le produit en détail',
  en: 'See it in detail',
  es: 'Ver el producto en detalle',
  de: 'Im Detail ansehen',
  it: 'Vedere in dettaglio',
}

export function renderGallery(
  d: LandingPageData,
  t: SectionTheme = DEFAULT_THEME,
): string {
  if (process.env.KONVERT_GALLERY === 'false') return ''
  const images = (d.images ?? []).filter(Boolean)
  if (images.length < 8) return ''

  const galleryImages = images.slice(4, 8)
  const label = GALLERY_LABEL[d.language ?? 'fr'] ?? GALLERY_LABEL.fr
  const productName = d.product_name ?? 'Product'

  return `
<section class="kvt-gallery" style="
  padding:80px 24px;
  background:${t.bg};
  font-family:${t.fontFamily};
">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="
      text-align:center;
      font-size:12px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:0.12em;
      color:${t.textMuted};
      margin:0 0 32px 0;
    ">${label}</p>
    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
    ">
      ${galleryImages.map((src, i) => `
        <div style="
          aspect-ratio:1;
          overflow:hidden;
          border-radius:${t.radius};
          background:${t.bgAlt};
        ">
          <img
            src="${src}"
            alt="${productName} — vue ${i + 5}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;display:block;"
          />
        </div>
      `).join('')}
    </div>
  </div>
  <style>
    @media (max-width: 768px) {
      .kvt-gallery { padding:60px 20px !important; }
      .kvt-gallery > div > div { grid-template-columns:1fr !important; }
    }
  </style>
</section>
`.trim()
}
```

- [ ] **Step 4 : Brancher `renderGallery` dans `SECTION_RENDERERS`**

Localiser `SECTION_RENDERERS` (ligne ~832). Remplacer le placeholder `gallery: () => ''` par :

```ts
gallery:                 renderGallery,
```

- [ ] **Step 5 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "renderGallery" 2>&1 | tail -15
```
Expected : 9 tests `renderGallery` PASS.

- [ ] **Step 6 : Vérifier que `renderRichSections` rend bien la section gallery quand applicable**

Run un test manuel rapide :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/ 2>&1 | tail -10
```
Expected : tous les tests sections + gallery PASS.

- [ ] **Step 7 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/gallery.test.ts
git commit -m "feat(sections): renderGallery section grid 2x2 + branche dans SECTION_RENDERERS"
```

---

### Task 5 : Enrichir `renderUniqueMechanism` avec image (TDD régression)

**Files:**
- Modify: `src/lib/templates/__tests__/gallery.test.ts`
- Modify: `src/lib/templates/sections.ts:432` (renderUniqueMechanism)

- [ ] **Step 1 : Ajouter tests de régression + tests image à `gallery.test.ts`**

Ajouter à la fin de `src/lib/templates/__tests__/gallery.test.ts` :

```ts
describe('renderUniqueMechanism — enrichissement image', () => {
  it('régression : sans images, comportement identique à avant (layout texte)', () => {
    const { images, ...dataNoImages } = mockLandingDataFull as Record<string, unknown>
    const html = renderUniqueMechanism(dataNoImages as typeof mockLandingDataFull, DEFAULT_THEME)
    // Doit rendre normalement (data.unique_mechanism présent dans full)
    expect(html).toContain('<section')
    expect(html).not.toMatch(/<img[^>]*src=/)
  })

  it('régression : avec <5 images, pas d\'image rendue (évite duplication avec hero)', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    }
    const html = renderUniqueMechanism(data, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).not.toContain('1.jpg')
    expect(html).not.toContain('4.jpg')
  })

  it('avec >=5 images, rend l\'image[4] en split layout', () => {
    const data = {
      ...mockLandingDataFull,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    }
    const html = renderUniqueMechanism(data, DEFAULT_THEME)
    expect(html).toContain('src="5.jpg"')
  })

  it('avec 8 images, utilise bien images[4] (pas images[0])', () => {
    const html = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain(mockLandingDataFull.images![4])
    expect(html).not.toContain(`src="${mockLandingDataFull.images![0]}"`)
  })

  it('si data.unique_mechanism absent, retourne "" même avec images', () => {
    const { unique_mechanism, ...dataNoMechanism } = mockLandingDataFull
    expect(renderUniqueMechanism(dataNoMechanism, DEFAULT_THEME)).toBe('')
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils échouent partiellement**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "renderUniqueMechanism" 2>&1 | tail -15
```
Expected : tests "avec image" FAIL (fn actuelle ne gère pas l'image). Tests de régression "sans image" PASS.

- [ ] **Step 3 : Lire la fn `renderUniqueMechanism` actuelle pour la modifier sans casser**

Run :
```bash
cd /Users/mac/nexara/konvert && sed -n '432,470p' src/lib/templates/sections.ts
```

Noter le layout actuel (probablement un layout single-column texte). Le modifier pour : si `images.at(4)` existe ET feature flag actif → ajouter une div image gauche en split, sinon → comportement actuel.

- [ ] **Step 4 : Modifier `renderUniqueMechanism` dans `sections.ts`**

Localiser `renderUniqueMechanism` (ligne ~432). Au début de la fonction, après le early return existant `if (!d.unique_mechanism) return ''`, ajouter la détection d'image :

```ts
export function renderUniqueMechanism(d: LandingPageData, t: SectionTheme = DEFAULT_THEME): string {
  if (!d.unique_mechanism) return ''
  const m = d.unique_mechanism

  // Chantier B : si on a une 5ème image (après les 4 du hero), on la pose
  // en split layout. Sinon : layout texte plein (comportement chantier A).
  const galleryEnabled = process.env.KONVERT_GALLERY !== 'false'
  const images = (d.images ?? []).filter(Boolean)
  const splitImage = galleryEnabled && images.length >= 5 ? images[4] : null

  const textBlock = `
    <div style="flex:1;">
      <p style="
        font-size:12px;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:0.12em;
        color:${t.textMuted};
        margin:0 0 16px 0;
      ">Notre mécanisme unique</p>
      <h2 style="
        font-size:32px;
        font-weight:800;
        color:${t.text};
        margin:0 0 16px 0;
        line-height:1.2;
      ">${m.name}</h2>
      <p style="
        font-size:17px;
        line-height:1.7;
        color:${t.text};
        margin:0 0 16px 0;
      ">${m.description}</p>
      ${m.proof ? `
        <p style="
          font-size:14px;
          font-style:italic;
          color:${t.textMuted};
          margin:0;
          padding:16px;
          background:${t.bgAlt};
          border-radius:${t.radius};
          border-left:3px solid ${t.primary};
        ">${m.proof}</p>
      ` : ''}
    </div>
  `

  const imageBlock = splitImage ? `
    <div style="flex:1;">
      <div style="
        aspect-ratio:4/3;
        overflow:hidden;
        border-radius:${t.radius};
        background:${t.bgAlt};
      ">
        <img
          src="${splitImage}"
          alt="${d.product_name ?? ''} — mécanisme"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;display:block;"
        />
      </div>
    </div>
  ` : ''

  return `
<section class="kvt-unique-mechanism" style="
  padding:80px 24px;
  background:${t.bgAlt};
  font-family:${t.fontFamily};
">
  <div style="
    max-width:1100px;
    margin:0 auto;
    display:flex;
    gap:48px;
    align-items:center;
  ">
    ${imageBlock}
    ${textBlock}
  </div>
  <style>
    @media (max-width: 768px) {
      .kvt-unique-mechanism > div { flex-direction:column !important; gap:24px !important; }
      .kvt-unique-mechanism { padding:60px 20px !important; }
    }
  </style>
</section>
`.trim()
}
```

**Note :** si la fn actuelle a un layout différent (ex: pas de flex, pas de container split-ready), reprendre les classes/styles de l'existant et ajouter UNIQUEMENT le `imageBlock` en début de container. La structure ci-dessus est le pattern split classique cohérent avec OBITO chantier A.

**À vérifier avant l'implémentation :** lire le code actuel de `renderUniqueMechanism` et adapter le squelette HTML pour ne casser ni le visuel ni les tests existants. Si la fn actuelle a déjà un layout flex, juste ajouter `imageBlock` conditionnel à l'intérieur du container.

- [ ] **Step 5 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "renderUniqueMechanism" 2>&1 | tail -10
```
Expected : 5 tests `renderUniqueMechanism` PASS.

- [ ] **Step 6 : Vérifier qu'aucun test du chantier A n'est cassé**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -10
```
Expected : tous PASS (132 tests existants + nouveaux).

- [ ] **Step 7 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/sections.ts src/lib/templates/__tests__/gallery.test.ts
git commit -m "feat(sections): enrichir renderUniqueMechanism avec image[4] split layout"
```

---

### Task 6 : Tests feature flag `KONVERT_GALLERY`

**Files:**
- Modify: `src/lib/templates/__tests__/gallery.test.ts`

- [ ] **Step 1 : Ajouter le test feature flag à `gallery.test.ts`**

Ajouter à la fin de `src/lib/templates/__tests__/gallery.test.ts` :

```ts
describe('Feature flag KONVERT_GALLERY', () => {
  const originalEnv = process.env.KONVERT_GALLERY

  afterEach(() => {
    process.env.KONVERT_GALLERY = originalEnv
  })

  it('KONVERT_GALLERY=false : renderHeroThumbs retourne ""', () => {
    process.env.KONVERT_GALLERY = 'false'
    expect(renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )).toBe('')
  })

  it('KONVERT_GALLERY=false : renderGallery retourne ""', () => {
    process.env.KONVERT_GALLERY = 'false'
    expect(renderGallery(mockLandingDataFull, DEFAULT_THEME)).toBe('')
  })

  it('KONVERT_GALLERY=false : renderUniqueMechanism ne contient pas l\'image', () => {
    process.env.KONVERT_GALLERY = 'false'
    const html = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(html).toContain('<section')
    expect(html).not.toContain(mockLandingDataFull.images![4])
  })

  it('KONVERT_GALLERY=true : renderHeroThumbs rend normalement', () => {
    process.env.KONVERT_GALLERY = 'true'
    const html = renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    expect(html).toContain('kvt-thumb')
  })

  it('KONVERT_GALLERY undefined (défaut) : tout rend normalement', () => {
    delete process.env.KONVERT_GALLERY
    const heroHtml = renderHeroThumbs(
      ['1.jpg', '2.jpg', '3.jpg'],
      DEFAULT_THEME,
      'kvt-hero-img-test',
    )
    const galleryHtml = renderGallery(mockLandingDataFull, DEFAULT_THEME)
    const mechanismHtml = renderUniqueMechanism(mockLandingDataFull, DEFAULT_THEME)
    expect(heroHtml.length).toBeGreaterThan(50)
    expect(galleryHtml.length).toBeGreaterThan(50)
    expect(mechanismHtml).toContain(mockLandingDataFull.images![4])
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils passent**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "Feature flag" 2>&1 | tail -10
```
Expected : 5 tests feature flag PASS.

- [ ] **Step 3 : Vérifier toute la suite gallery + sections**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -10
```
Expected : tous PASS.

- [ ] **Step 4 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/__tests__/gallery.test.ts
git commit -m "test(sections): couverture feature flag KONVERT_GALLERY (5 tests)"
```

---

### Task 7 : Script de refactor des 42 templates

**Files:**
- Create: `scripts/refactor-templates-hero-gallery.ts`
- Modify: `package.json` (ajout du script npm)

- [ ] **Step 1 : Créer le script `refactor-templates-hero-gallery.ts`**

Créer `scripts/refactor-templates-hero-gallery.ts` :

```ts
#!/usr/bin/env node
/**
 * Script de refactor des 42 templates etec-*.ts pour câbler la galerie hero.
 * Trouve le pattern <img src="${imgs[0]}"...> ou <img src="${_real[0]}"...>
 * dans le hero, ajoute un id="kvt-hero-img-${slug}" sur la balise,
 * et insère ${renderHeroThumbs(_real, THEME_NAME, 'kvt-hero-img-${slug}')}
 * juste après. Met aussi à jour l'import depuis ./sections.
 *
 * Usage:
 *   npx tsx scripts/refactor-templates-hero-gallery.ts --dry-run
 *   npx tsx scripts/refactor-templates-hero-gallery.ts --apply
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

// Regex pour matcher la première <img src="${imgs[0]}" ...> ou <img src="${_real[0]}" ...>
// On capture les attributs existants pour les préserver et injecter un id en plus.
const IMG_PATTERN_RE = /<img\s+src="\$\{(?:imgs|_real)\[0\]\}"([^>]*)>/

// Regex pour matcher le bloc d'imports depuis './sections'
const IMPORT_BLOCK_RE = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/sections['"]/

function refactorFile(filepath: string): { changed: boolean; diff: string[] } {
  const original = readFileSync(filepath, 'utf-8')
  const slug = path.basename(filepath, '.ts') // ex: 'etec-blue'
  let next = original
  const diff: string[] = []

  // 1. Détecter le <img> hero
  const imgMatch = next.match(IMG_PATTERN_RE)
  if (!imgMatch) {
    return { changed: false, diff: ['no <img src="${imgs[0]}"> hero pattern found'] }
  }

  // 2. Détecter le nom du theme const (THEME_NAME) — varie par template
  // On cherche les const THEME_XXX = { ... } / const themeName = THEME_XXX
  // Pour simplifier : on regarde quel param le hero du template passe à
  // renderRichSections déjà existant (chantier A).
  const richMatch = next.match(/renderRichSections\(data,\s*(\w+)\)/)
  const themeName = richMatch?.[1] ?? 'DEFAULT_THEME'

  // 3. Ajouter id="kvt-hero-img-${slug}" sur le <img> (sans casser les attributs existants)
  const heroId = `kvt-hero-img-${slug}`
  const newImgTag = `<img id="${heroId}" src="\${(_real ?? imgs)[0]}"${imgMatch[1]}>`
  next = next.replace(IMG_PATTERN_RE, newImgTag)
  diff.push(`hero <img>: id="${heroId}" ajouté`)

  // 4. Insérer ${renderHeroThumbs(...)} juste après le <img>
  // On insère après la balise <img> sur la même ligne ou la ligne suivante
  const thumbsCall = `\${renderHeroThumbs(_real ?? imgs ?? [], ${themeName}, '${heroId}')}`
  next = next.replace(newImgTag, `${newImgTag}\n      ${thumbsCall}`)
  diff.push(`renderHeroThumbs ajouté avec theme=${themeName}`)

  // 5. Mettre à jour l'import depuis './sections' pour inclure renderHeroThumbs
  const importMatch = next.match(IMPORT_BLOCK_RE)
  if (importMatch) {
    const items = importMatch[1].split(',').map(s => s.trim()).filter(Boolean)
    if (!items.includes('renderHeroThumbs')) {
      items.push('renderHeroThumbs')
      next = next.replace(
        IMPORT_BLOCK_RE,
        `import {\n  ${items.join(',\n  ')},\n} from './sections'`,
      )
      diff.push(`import: +renderHeroThumbs`)
    }
  } else {
    diff.push(`WARNING: aucun import depuis './sections' trouvé — à ajouter manuellement`)
  }

  return { changed: next !== original, diff }
}

async function main() {
  const files = await glob('src/lib/templates/etec-*.ts', { cwd: process.cwd() })
  console.log(`Found ${files.length} template files\n`)

  let changedCount = 0
  let skipCount   = 0

  for (const file of files.sort()) {
    const { changed, diff } = refactorFile(file)
    if (changed) {
      changedCount++
      const action = isApply ? 'WRITE' : 'WOULD WRITE'
      console.log(`[${action}] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
      if (isApply) {
        // Re-exécuter le refactor avec writeFile cette fois
        const original = readFileSync(file, 'utf-8')
        const slug = path.basename(file, '.ts')
        const heroId = `kvt-hero-img-${slug}`
        const imgMatch = original.match(IMG_PATTERN_RE)
        if (!imgMatch) continue
        const richMatch = original.match(/renderRichSections\(data,\s*(\w+)\)/)
        const themeName = richMatch?.[1] ?? 'DEFAULT_THEME'
        const newImgTag = `<img id="${heroId}" src="\${(_real ?? imgs)[0]}"${imgMatch[1]}>`
        const thumbsCall = `\${renderHeroThumbs(_real ?? imgs ?? [], ${themeName}, '${heroId}')}`
        let newContent = original
          .replace(IMG_PATTERN_RE, newImgTag)
          .replace(newImgTag, `${newImgTag}\n      ${thumbsCall}`)
        const importMatch = newContent.match(IMPORT_BLOCK_RE)
        if (importMatch) {
          const items = importMatch[1].split(',').map(s => s.trim()).filter(Boolean)
          if (!items.includes('renderHeroThumbs')) {
            items.push('renderHeroThumbs')
            newContent = newContent.replace(
              IMPORT_BLOCK_RE,
              `import {\n  ${items.join(',\n  ')},\n} from './sections'`,
            )
          }
        }
        writeFileSync(file, newContent, 'utf-8')
      }
    } else {
      skipCount++
      console.log(`[SKIP] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
    }
  }

  console.log(`\n${changedCount}/${files.length} files ${isApply ? 'modified' : 'would be modified'}`)
  console.log(`${skipCount} skipped (no match) — à traiter manuellement si nécessaire`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2 : Ajouter une commande npm**

Ouvrir `package.json` et ajouter dans la section `"scripts"` :

```json
"refactor:hero-gallery": "tsx scripts/refactor-templates-hero-gallery.ts"
```

- [ ] **Step 3 : Vérifier que `tsx` et `glob` sont installés**

Run :
```bash
cd /Users/mac/nexara/konvert && npm list tsx glob 2>&1 | head -10
```

Si manquent (devraient être présents depuis le script chantier A) :
```bash
cd /Users/mac/nexara/konvert && npm install -D tsx glob @types/node
```

- [ ] **Step 4 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add scripts/refactor-templates-hero-gallery.ts package.json package-lock.json
git commit -m "chore(scripts): script de refactor 42 templates pour galerie hero (dry-run/apply)"
```

---

### Task 8 : Exécuter le script (dry-run + apply + cas manuels)

**Files:**
- Modify: `src/lib/templates/etec-*.ts` (42 fichiers via script + manuels)

- [ ] **Step 1 : Lancer en dry-run**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run refactor:hero-gallery -- --dry-run 2>&1 | tail -60
```
Expected : ~38-42 fichiers loggés avec `[WOULD WRITE]`, chacun montrant `hero <img>: id=...`, `renderHeroThumbs ajouté`, `import: +renderHeroThumbs`. Quelques `[SKIP]` possibles si pattern hero atypique.

- [ ] **Step 2 : Review manuel des 3 templates types**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -B 1 -A 2 '<img\s\+src="\${(imgs\|_real)\[0\]}"' src/lib/templates/etec-blue.ts src/lib/templates/etec-noir.ts src/lib/templates/etec-luxe.ts | head -30
```

Vérifier visuellement que le pattern matche bien sur ces 3 templates types.

- [ ] **Step 3 : Lancer en `--apply`**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run refactor:hero-gallery -- --apply 2>&1 | tail -10
```
Expected : `N/42 files modified` (N ≥ 35), avec un compte de skip cohérent.

- [ ] **Step 4 : Vérifier la compilation TS**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | grep error | head -10
```
Expected : 0 erreur.

Si erreurs sur un fichier précis : ouvrir le template, vérifier que `renderHeroThumbs` est bien importé et que la syntaxe template literal est correcte.

- [ ] **Step 5 : Identifier les templates skippés**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run refactor:hero-gallery -- --dry-run 2>&1 | grep -E "\[SKIP\]"
```

Pour chaque template skippé :
- Lire son hero HTML : `grep -n "<img" src/lib/templates/etec-XXX.ts | head -5`
- Identifier le pattern réel utilisé (ex: `<img src={\`...\`}>`, `<img src="data:..."`, etc.)
- Patcher manuellement : ajouter `id="kvt-hero-img-etec-XXX"` sur le `<img>` hero + insérer `${renderHeroThumbs(_real ?? imgs ?? [], THEME_NAME, 'kvt-hero-img-etec-XXX')}` après + ajouter `renderHeroThumbs` à l'import

- [ ] **Step 6 : Vérifier qu'au moins 40/42 templates ont bien renderHeroThumbs câblé**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -lE "renderHeroThumbs\(" src/lib/templates/etec-*.ts | wc -l
```
Expected : `≥ 40` (idéalement 42).

- [ ] **Step 7 : Vérifier qu'au moins 40/42 templates ont l'id sur leur `<img>` hero**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -lE 'id="kvt-hero-img-' src/lib/templates/etec-*.ts | wc -l
```
Expected : `≥ 40`.

- [ ] **Step 8 : Commit en 1 batch**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/etec-*.ts
git commit -m "feat(templates): câbler renderHeroThumbs dans les 42 templates etec"
```

---

### Task 9 : Smoke E2E étendu (Vitest pur)

**Files:**
- Modify: `src/lib/templates/__tests__/sections-rich.test.ts` (créé au chantier A) ou create `src/lib/templates/__tests__/gallery-e2e.test.ts`

- [ ] **Step 1 : Identifier le fichier de smoke E2E existant**

Run :
```bash
cd /Users/mac/nexara/konvert && ls src/lib/templates/__tests__/ | grep -E "(sections-rich|e2e)"
```

Si `sections-rich.test.ts` existe (créé au chantier A T10) : on l'étend. Sinon : on crée `gallery-e2e.test.ts`.

- [ ] **Step 2a : Si extension de `sections-rich.test.ts`**

Ouvrir le fichier et ajouter les assertions galerie aux tests existants. Pour chaque template testé, ajouter :

```ts
// Assertions galerie hero (fixture full = 8 images)
if (fixture.name === 'full') {
  expect(html).toMatch(/id="kvt-hero-img-/)
  expect(html).toContain(fixture.data.images![0]) // image hero principale
  expect(html).toContain('kvt-thumb') // thumbs présents
}

// Assertion section gallery (seuil 8 images)
if (fixture.name === 'full') {
  expect(html).toContain('kvt-gallery')
}
if (fixture.name === 'partial') {
  expect(html).not.toContain('kvt-gallery')
}
```

- [ ] **Step 2b : Si création de `gallery-e2e.test.ts`**

Créer `src/lib/templates/__tests__/gallery-e2e.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { renderTemplate } from '..'
import { mockLandingDataFull } from '../__fixtures__/mock-landing-data-full'
import { mockLandingDataPartial } from '../__fixtures__/mock-landing-data-partial'

const TEMPLATES = ['etec-blue', 'etec-noir', 'etec-rose', 'etec-luxe', 'etec-energy']

describe('E2E galerie hero + section gallery (5 templates × 2 fixtures)', () => {
  for (const templateId of TEMPLATES) {
    describe(templateId, () => {
      it('fixture full (8 images) : hero contient id kvt-hero-img + thumbs + section gallery', () => {
        const html = renderTemplate(templateId, mockLandingDataFull)
        expect(html).toMatch(/id="kvt-hero-img-/)
        expect(html).toContain(mockLandingDataFull.images![0])
        expect(html).toContain('kvt-thumb')
        expect(html).toContain('kvt-gallery')
        expect(html).not.toContain('undefined')
        expect(html).not.toContain('[object Object]')
        expect(html).not.toContain('NaN')
      })

      it('fixture partial (1 image) : hero sans thumbs, section gallery absente', () => {
        const html = renderTemplate(templateId, mockLandingDataPartial)
        expect(html).toMatch(/id="kvt-hero-img-/)
        expect(html).toContain(mockLandingDataPartial.images![0])
        // 1 image = pas de thumbs (renderHeroThumbs return '')
        expect(html).not.toContain('kvt-thumb-active')
        // 1 image < 8 = pas de section gallery
        expect(html).not.toContain('kvt-gallery')
      })
    })
  }
})
```

- [ ] **Step 3 : Lancer les tests E2E**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run src/lib/templates/__tests__/gallery-e2e.test.ts 2>&1 | tail -15
```
(ou `sections-rich.test.ts` si étendu)

Expected : 10 tests PASS (5 templates × 2 fixtures).

- [ ] **Step 4 : Si un template fail → debug rapide**

Si `etec-XXX` fail sur fixture partial : vérifier que le template n'a pas hardcodé un `<img src="${imgs[1]}">` ailleurs que dans le hero qui afficherait quand même une image fake (cas legacy).

Si `etec-XXX` fail sur fixture full : vérifier que le pattern de refactor a bien matché ce template (cas skip à patcher manuellement Task 8 Step 5).

- [ ] **Step 5 : Commit**

Run :
```bash
cd /Users/mac/nexara/konvert && git add src/lib/templates/__tests__/gallery-e2e.test.ts
git commit -m "test(sections): smoke E2E galerie hero + section gallery (Vitest pur)"
```

---

### Task 10 : Feature flag env + full tests + push + PR

**Files:**
- Modify: `.env.example`
- Modify: `.env.local` (manuel sur la machine du dev)

- [ ] **Step 1 : Documenter `KONVERT_GALLERY` dans `.env.example`**

Ouvrir `.env.example`. Localiser la section `# ─── FEATURE FLAGS ─────────` ajoutée au chantier A. Ajouter sous la ligne `KONVERT_RICH_SECTIONS=true` :

```
# Chantier B — galerie multi-images (spec 2026-05-25).
# 'false' = rollback rapide en prod sans rebuild (renderHeroThumbs,
# renderGallery, et l'image dans renderUniqueMechanism retournent '').
KONVERT_GALLERY=true
```

- [ ] **Step 2 : Ajouter `KONVERT_GALLERY=true` dans `.env.local`**

Run :
```bash
cd /Users/mac/nexara/konvert && grep -q KONVERT_GALLERY .env.local || printf '\n# Chantier B galerie multi-images (spec 2026-05-25)\nKONVERT_GALLERY=true\n' >> .env.local
tail -3 .env.local
```

- [ ] **Step 3 : Lancer la suite Vitest complète**

Run :
```bash
cd /Users/mac/nexara/konvert && npx vitest run 2>&1 | tail -15
```
Expected : tous PASS (132 + 27 nouveaux = ~159 tests verts).

- [ ] **Step 4 : Lancer le typecheck**

Run :
```bash
cd /Users/mac/nexara/konvert && npx tsc --noEmit 2>&1 | tail -5
```
Expected : 0 erreur.

- [ ] **Step 5 : Lancer le lint (scopé chantier B)**

Run :
```bash
cd /Users/mac/nexara/konvert && npm run lint 2>&1 | grep -E "(sections\.ts|etec-|scripts/refactor-templates-hero|gallery\.test|gallery-e2e)" | head -20
```
Expected : 0 erreur sur les fichiers du chantier B (warnings legacy hors scope tolérés).

- [ ] **Step 6 : Test rollback flag local**

Run :
```bash
cd /Users/mac/nexara/konvert && KONVERT_GALLERY=false npx vitest run src/lib/templates/__tests__/gallery.test.ts -t "KONVERT_GALLERY=false" 2>&1 | tail -10
```
Expected : 3 tests "KONVERT_GALLERY=false" PASS.

- [ ] **Step 7 : Commit env**

Run :
```bash
cd /Users/mac/nexara/konvert && git add .env.example
git commit -m "chore(env): documenter KONVERT_GALLERY (chantier B)"
```

- [ ] **Step 8 : Vérifier les commits de la branche**

Run :
```bash
cd /Users/mac/nexara/konvert && git log --oneline feat/multi-images-gallery ^feat/sections-riches-dtc
```
Expected : ~12 commits propres, messages clairs.

- [ ] **Step 9 : Push de la branche**

Run :
```bash
cd /Users/mac/nexara/konvert && git push -u origin feat/multi-images-gallery
```

- [ ] **Step 10 : Ouvrir la PR**

Run :
```bash
cd /Users/mac/nexara/konvert && gh pr create --base feat/sections-riches-dtc --head feat/multi-images-gallery \
  --title "feat: chantier B — multi-images & galerie produit" \
  --body "$(cat <<'EOF'
## Summary
- Câble la galerie hero cliquable (image principale + thumbs) dans les 42 templates
- Ajoute la section dédiée \`renderGallery\` (grid 2×2, seuil 8 images)
- Enrichit \`renderUniqueMechanism\` avec image[4] en split layout
- Fallback gracieux de 0 à 8 images
- Feature flag \`KONVERT_GALLERY\` séparé pour rollback indépendant

## Dépendance
Cette PR est basée sur \`feat/sections-riches-dtc\` (chantier A). À merger
après le chantier A.

## Spec
\`docs/superpowers/specs/2026-05-25-konvert-chantier-b-multi-images-design.md\`

## Plan
\`docs/superpowers/plans/2026-05-25-konvert-chantier-b-multi-images.md\`

## Test plan
- [x] Vitest unit (~27 nouveaux tests) verts
- [x] Smoke E2E 5 templates × 2 fixtures verts
- [x] Régression tests chantier A verts
- [x] Rollback flag KONVERT_GALLERY=false validé
- [ ] Smoke prod-like \`/api/generate\` sur preview Vercel après merge

## Rollback
\`vercel env set KONVERT_GALLERY false\` → retour comportement chantier A pur sans rebuild.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Note : si `gh auth` n'est pas configuré, ouvrir manuellement l'URL retournée par le push :
`https://github.com/syphaxdjouad-lgtm/KonVert/pull/new/feat/multi-images-gallery`

- [ ] **Step 11 : Mettre à jour la mémoire**

Mettre à jour `~/.claude/projects/-Users-mac-nexara/memory/MEMORY.md` avec un nouveau pointeur :

```
| [project_konvert_chantier_b.md](project_konvert_chantier_b.md) | project | KONVERT Chantier B — multi-images terminé, PR ouverte 2026-05-25 |
```

Et créer le fichier `project_konvert_chantier_b.md` avec récap (branche, commits, suite logique vers chantier C).

---

## Self-review checklist (à exécuter avant merge)

- [ ] **Spec coverage** — chaque section du spec a une task correspondante
  - § 3.1 Files touchés → Tasks 1, 2, 3, 4, 5, 7, 8
  - § 3.2 API publique → Tasks 3, 4
  - § 3.3 DEFAULT_ORDER → Task 1
  - § 3.4 Data flow → Tasks 3, 4, 5, 8
  - § 3.5 Fallback → Tasks 3, 4, 5
  - § 3.6 Feature flag → Tasks 3, 4, 5, 6, 10
  - § 4 Design visuel → Tasks 3, 4, 5
  - § 5 Refactor 42 templates → Tasks 7, 8
  - § 6 Tests → Tasks 3, 4, 5, 6, 9
  - § 7 Migration → Task 10
- [ ] **Type consistency** — `SectionKey`, `SectionTheme`, `renderHeroThumbs`, `renderGallery` ont la même signature dans toutes les tâches
- [ ] **No placeholders** — aucun "TBD", "TODO" dans le plan (sauf "à vérifier" Step 4 Task 5, justifié car dépend du code actuel)
- [ ] **Exact file paths** — tous les paths sont absolus depuis `/Users/mac/nexara/konvert/`
- [ ] **Commit messages** — préfixes cohérents avec l'historique git existant
- [ ] **TDD respecté** — test → fail → impl → pass → commit pour les tâches code (sauf Task 7 script, qui n'est pas testable en TDD)

---

## Estimation totale

- Task 0-1 (setup + types/DEFAULT_ORDER) : ~30 min
- Tasks 2-3 (fixtures + renderHeroThumbs) : ~1h30
- Tasks 4-5 (renderGallery + enrichissement renderUniqueMechanism) : ~1h45
- Task 6 (tests feature flag) : ~30 min
- Tasks 7-8 (script + refactor 42 templates + manuels) : ~2h
- Tasks 9-10 (smoke E2E + push + PR) : ~1h

**Total effectif : ~7h** en 1 session continue, ou 1 jour avec pauses.
