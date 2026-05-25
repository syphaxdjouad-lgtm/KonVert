# KONVERT — Chantier B : Multi-images & galerie produit

**Date :** 2026-05-25
**Statut :** Design validé, prêt pour plan d'implémentation
**Branche prévue :** `feat/multi-images-gallery`
**Spec parent :** néant — chantier autonome
**Spec liée :** `2026-05-23-konvert-sections-riches-design.md` (chantier A)

---

## 1. Contexte & problème

Le scraper Konvert (Brightdata + Firecrawl + fallback) renvoie jusqu'à 8 images produit valides, filtrées et dédupliquées (`LandingPageData.images: string[]`). Pourtant les 42 templates `etec-*.ts` utilisent un hack hérité :

```ts
const _real = data.images?.filter(Boolean) ?? []
const imgs = _real.length >= 1
  ? Array.from({ length: Math.max(4, _real.length) }, (_, i) => _real[i % _real.length])
  : IMGS // placeholders Unsplash hardcodés
```

Conséquence : quand le scraper sort 1 image, le template l'affiche 4 fois en thumbnails identiques. Quand il en sort 8, on n'en utilise que `imgs[0..3]` (et encore, certains templates n'utilisent même qu'une seule). Résultat : **gâchis total de la data scrappée et galerie produit pauvre sur un livrable censé être premium DTC.**

Le chantier A a livré 19 sections riches au niveau visuel Glossier/Mejuri/Ridge, mais la zone image reste claquée au sol. Le chantier B comble ce trou.

---

## 2. Objectifs

1. Exploiter les 8 images produit du scraper de bout en bout
2. Câbler une **galerie hero cliquable** (image principale + thumbs) dans les 42 templates sans casser leurs layouts existants
3. Ajouter une **section gallery dédiée** (grid 2×2) qui s'affiche quand on a 5+ images
4. Enrichir `renderUniqueMechanism` avec une image produit en split layout
5. **Fallback gracieux** : la page reste belle même avec 0, 1, 2 ou 3 images
6. **Zéro régression** sur les 42 templates : si feature flag off, comportement identique à aujourd'hui

---

## 3. Architecture

### 3.1 Fichiers touchés

```
konvert/
├── src/lib/templates/
│   ├── sections.ts                              [MODIFY] +renderHeroThumbs +renderGallery
│   │                                                     +SectionKey 'gallery'
│   │                                                     +DEFAULT_ORDER position 5
│   │                                                     +modif renderUniqueMechanism
│   ├── __tests__/
│   │   └── gallery.test.ts                      [CREATE] tests Vitest gallery + hero thumbs
│   ├── __fixtures__/
│   │   ├── mock-landing-data-full.ts            [MODIFY] images: 8 URLs
│   │   └── mock-landing-data-partial.ts         [MODIFY] images: 1 URL
│   └── etec-*.ts                                [MODIFY] 42 fichiers via script :
│                                                          - id sur l'<img> hero
│                                                          - ligne renderHeroThumbs(...)
│                                                          - import renderHeroThumbs
├── scripts/
│   └── refactor-templates-hero-gallery.ts       [CREATE] --dry-run / --apply
├── docs/superpowers/specs/
│   └── 2026-05-25-konvert-chantier-b-...md      [CE FICHIER]
└── .env.example                                 [MODIFY] +KONVERT_GALLERY=true
```

### 3.2 API publique (sections.ts)

```ts
// Helper hero — appelé par les 42 templates dans leur HTML hero
// Rend les thumbs cliquables + le <script> onclick qui swap le src de mainImgId
// Si <2 images : return '' (pas la peine d'afficher des thumbs)
export function renderHeroThumbs(
  images: string[],
  theme: SectionTheme,
  mainImgId: string,
): string

// Nouvelle section — appelée automatiquement par renderRichSections
// Si <5 images : return ''
// Sinon : grid 2x2 desktop / 1col mobile, des images[4..7]
export function renderGallery(
  data: LandingPageData,
  theme: SectionTheme,
): string
```

### 3.3 DEFAULT_ORDER mis à jour (20 sections)

```ts
export const DEFAULT_ORDER: SectionKey[] = [
  'social_proof_bar',
  'story',
  'target_audience',
  'features',
  'gallery',            // ← NOUVEAU position 5
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

`SectionKey` étendu avec `'gallery'`. `SECTION_RENDERERS` étendu avec `gallery: renderGallery`.

### 3.4 Data flow

```
Scraper → LandingPageData.images: string[] (0-8 URLs filtrées)
         │
         ├──→ Template hero existant : <img src="${images[0]}" id="kvt-hero-img-XXX">
         │                              ${renderHeroThumbs(images, THEME, 'kvt-hero-img-XXX')}
         │                              → rendu : 2-4 thumbs + JS onclick global
         │
         ├──→ renderRichSections(data, theme)
         │         └──→ renderGallery(data, theme)
         │              └──→ si images.length >= 5 : grid 2x2 des images[4..7]
         │
         └──→ renderUniqueMechanism(data, theme)
                   └──→ si data.unique_mechanism ET images.at(-1) :
                        split layout (image gauche desktop / dessus mobile)
                        sinon : layout texte plein (comportement actuel)
```

### 3.5 Comportement fallback selon le nombre d'images

| images.length | Hero `<img>` | renderHeroThumbs | renderGallery | renderUniqueMechanism |
|---|---|---|---|---|
| 0 | placeholder template (legacy IMGS) | `''` | `''` | layout texte |
| 1 | images[0] | `''` (1 seule image = pas de thumbs) | `''` | layout texte (pas de gâchis sur image hero) |
| 2 | images[0] | 2 thumbs | `''` | layout texte |
| 3 | images[0] | 3 thumbs | `''` | layout texte |
| 4 | images[0] | 4 thumbs | `''` | layout texte |
| 5 | images[0] | 4 thumbs (0-3) | 1 image (4) en grid (avec 3 placeholders ?) → **NON, on skip si <8 images en pratique : grid 2×2 nécessite 4 images** → seuil 8 alors ? | layout texte |
| 6-7 | images[0] | 4 thumbs (0-3) | skip (grid 2×2 = 4 cases) | layout texte |
| 8 | images[0] | 4 thumbs (0-3) | grid 2×2 (images 4-7) | image 4 réutilisée |

**Décision sur le seuil section gallery :** comme la grid 2×2 a besoin de 4 images pleines pour ne pas avoir de trous, le seuil minimum est **8 images** (4 pour hero + 4 pour gallery). Si on en a 5-7, la section gallery reste skippée. C'est cohérent avec le principe "skip si data insuffisante" et évite des cases vides.

**Décision sur l'image de `renderUniqueMechanism` :**
- Si `images.length >= 5` : utiliser `images[4]` (la première après la galerie hero)
- Si `images.length === 0` à `4` : pas d'image (layout texte)
- Ne JAMAIS réutiliser une image déjà dans hero ou gallery pour éviter la sensation de duplication

### 3.6 Feature flag

```bash
KONVERT_GALLERY=true   # défaut : actif
KONVERT_GALLERY=false  # rollback : renderGallery, renderHeroThumbs et l'image
                       # dans renderUniqueMechanism retournent '' / sont skip
```

Flag **séparé** de `KONVERT_RICH_SECTIONS` (chantier A) pour pouvoir rollback indépendamment chacun.

---

## 4. Spécifications de design (visuel)

### 4.1 Galerie hero (renderHeroThumbs)

- Thumbs : carrés `aspect-ratio:1`, taille `64-80px` desktop / `56px` mobile
- Espacement : `gap: 8px`
- Border-radius : `theme.radius` (ou 6-8px)
- Thumb actif : border `2px solid theme.primary`, scale légère (1.05)
- Thumb inactif : opacity 0.7, hover → opacity 1
- Pas de label texte sur les thumbs
- JS onclick inline :
  ```js
  function kvtSwapHero(id, src, el) {
    document.getElementById(id).src = src;
    el.parentElement.querySelectorAll('.kvt-thumb').forEach(t => t.classList.remove('kvt-thumb-active'));
    el.classList.add('kvt-thumb-active');
  }
  ```

### 4.2 Section gallery (renderGallery)

- Padding section : `80px 24px` desktop, `60px 20px` mobile (cohérent chantier A)
- Background : `theme.bg` (alterné automatiquement par `renderRichSections` selon position)
- Label uppercase : "Voir le produit en détail" (FR) / "See it in detail" (EN) / etc. via `data.language`
- Grid : `2×2` desktop (768px+), `1×4` mobile
- Image : `aspect-ratio:1`, `object-fit:cover`, border-radius `theme.radius`, `loading="lazy"`
- Pas de hover effect (kept minimal, pas de lightbox V1)
- Alt text : `${data.product_name} — vue ${index + 1}`

### 4.3 Image dans renderUniqueMechanism

- Split layout desktop : 50/50 image gauche, texte droite (ou inversé selon esthétique OBITO du chantier A — à vérifier dans le code existant)
- Mobile : image dessus, texte dessous
- Image : `aspect-ratio:4/3` ou `1/1`, `object-fit:cover`, border-radius `theme.radius`
- Si l'image existante de la fn V2 (placeholder OBITO) doit être remplacée, conserver le comportement actuel comme fallback quand `images.at(-1)` n'existe pas

---

## 5. Refactor des 42 templates

### 5.1 Script `scripts/refactor-templates-hero-gallery.ts`

CLI Node avec `--dry-run` / `--apply`. Pour chaque fichier `src/lib/templates/etec-*.ts` :

1. **Détecter le pattern hero `<img>`** : regex sur `<img\s+src="\$\{imgs\[0\]\}"[^>]*>` ou variantes (`data.images?.[0]`, `_real[0]`, etc.)
2. **Injecter un id stable** : `id="kvt-hero-img-${templateSlug}"` sur la balise (où `templateSlug` = nom du fichier sans extension)
3. **Insérer renderHeroThumbs après** : `\n${renderHeroThumbs(_real, THEME_NAME, 'kvt-hero-img-${templateSlug}')}\n` (sur la ligne suivante, indentation cohérente)
4. **Mettre à jour l'import** : ajouter `renderHeroThumbs` au bloc d'imports existant depuis `./sections`

### 5.2 Cas non-matchés

Si la regex échoue sur un template (hero atypique, image dans un wrapper SVG, etc.), le script logge `[SKIP] {file} (no match)` et le template doit être traité **manuellement** (1-4 templates estimés). Pas de blocage : ces templates conserveront leur comportement actuel (juste pas de galerie hero, le reste du chantier B fonctionne quand même).

### 5.3 Templates de référence à valider en priorité

- `etec-blue.ts` (template par défaut)
- `etec-noir.ts` (dark theme — pas de hardcoded #fff sur thumbs)
- `etec-luxe.ts` (premium — vérifier rendu thumbs)
- `etec-rose.ts` (couleurs vives — contraste actif)
- `etec-energy.ts` (sportif — densité visuelle)

---

## 6. Tests

### 6.1 Vitest unit (`src/lib/templates/__tests__/gallery.test.ts`)

**`renderHeroThumbs` :**
- `images = []` → `''`
- `images = ['url1']` → `''` (1 seule image, pas de thumbs utiles)
- `images = ['url1', 'url2']` → contient `<button class="kvt-thumb"` × 2 + `<script>` `kvtSwapHero`
- `images = ['u1', ..., 'u8']` → 4 thumbs (cap), pas 8
- `mainImgId` est bien injecté dans le `onclick` du JS
- Pas de couleurs hardcodées hors danger/success (cf. règle chantier A)

**`renderGallery` :**
- `images.length < 8` → `''`
- `images.length === 8` → grid 2×2 contenant `images[4..7]`
- `data.product_name` est dans les `alt`
- `loading="lazy"` présent
- Label traduit selon `data.language` (fr/en au minimum)

**`renderUniqueMechanism` (régression) :**
- Sans `images.at(-1)` (length < 5) → comportement identique au chantier A (layout texte seul)
- Avec `images.length >= 5` → contient `<img src="${images[4]}"` dans le rendu split

**Feature flag :**
- `KONVERT_GALLERY=false` → `renderHeroThumbs` retourne `''`, `renderGallery` retourne `''`, `renderUniqueMechanism` ne contient pas l'image

**Fixtures :**
- `mockLandingDataFull` : ajouter `images: ['https://cdn.example.com/p1.jpg', ..., 'p8.jpg']`
- `mockLandingDataPartial` : ajouter `images: ['https://cdn.example.com/p1.jpg']` (1 image = fallback gracieux testable)

### 6.2 Smoke E2E (Vitest pur — pas Playwright)

Étendre le test E2E existant `__tests__/sections-rich.test.ts` du chantier A pour :
- Render 5 templates × 2 fixtures (full / partial) via `renderTemplate(templateId, data)`
- Vérifier que le HTML contient bien la balise `id="kvt-hero-img-${templateSlug}"`
- Vérifier que `${data.images[0]}` est dans le `<img src=...>` du hero
- Avec fixture full : vérifier présence de `<section class="kvt-gallery">` (id de la section gallery)
- Avec fixture partial : vérifier absence de la section gallery

**Pas de Playwright** (leçon chantier A : Mac crash avec dev server + 42 templates + workers parallèles).

---

## 7. Migration & déploiement

### 7.1 Compatibilité

- Chantier B n'introduit **aucun breaking change** sur l'API publique
- L'ajout de `'gallery'` dans `SectionKey` est purement additif
- `renderUniqueMechanism` garde la même signature
- Le hack `_real[i % _real.length]` dans les templates **n'est pas supprimé** par ce chantier (out of scope) — il continue à fonctionner pour les templates qui l'utilisent ailleurs que dans le hero (ex: 4 images en grid décorative dans certains layouts). Sa suppression sera traitée dans un chantier de cleanup ultérieur si nécessaire.

### 7.2 Rollback

- Local : `KONVERT_GALLERY=false` dans `.env.local`
- Prod Vercel : `vercel env add KONVERT_GALLERY production` valeur `false` puis redeploy
- Comportement : galerie hero retourne `''`, section gallery skip, `renderUniqueMechanism` ignore l'image (= comportement chantier A pur)
- **Pas besoin de revert git** pour rollback

### 7.3 Monitoring post-deploy

- Vérifier que les pages générées contiennent bien `<section class="kvt-gallery">` quand le scraper renvoie 8 images (sample 5 URLs Shopify connues)
- Vérifier en console qu'il n'y a pas d'erreur JS sur `kvtSwapHero` (test manuel sur 3 templates différents)
- Pas de monitoring automatique requis (chantier visuel pur, pas de logique business)

---

## 8. Non-goals (explicitement hors scope)

- Lightbox / zoom au clic sur image
- Carousel swipe mobile (Swiper, Glide, etc.)
- Vidéo produit
- Image alt text auto-généré par LLM (utilisation du `product_name` suffit)
- Image dans `before_after` (visuel non garanti côté data)
- Image dans `testimonials` (avatars clients non scrappés)
- Image dans `target_audience` (photos profil ICP non scrappés)
- Image dans `founder_note` (photo fondateur non scrappée)
- Optimisation des images (compression, format WebP/AVIF, srcset responsive) — déjà géré par Next.js si on passe par `next/image`, mais le HTML inline des templates n'utilise pas next/image
- Image lightbox accessibilité ARIA (V2 si retour users)
- Migration des templates ayant un layout hero atypique non matché par la regex (traité manuellement au cas par cas)
- Cleanup du hack legacy `_real[i % _real.length]` partout dans les templates (chantier séparé)

---

## 9. Risques & mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Le regex de refactor casse 1-2 templates atypiques | Moyenne | Faible | Mode `--dry-run` obligatoire avant `--apply` + log des skip + traitement manuel |
| JS `kvtSwapHero` conflict avec un autre script du template | Faible | Moyen | Préfixe `kvt` sur toutes les classes/fonctions, IDs stables et uniques par template |
| Cumulative Layout Shift sur grid 2×2 (images sans dimensions) | Moyenne | Moyen | `aspect-ratio:1` forcé sur les images, `loading="lazy"` mais avec dimensions implicites |
| Scraper qui ne renvoie pas 8 images (cas le plus fréquent) | Élevée | N/A | Fallback gracieux conçu pour 0-7 images, c'est la feature, pas un bug |
| Image #4 mal cadrée → fait moche dans split unique_mechanism | Moyenne | Faible | `object-fit:cover` + `aspect-ratio:4/3` cadrent toujours proprement |
| Régression de design sur 1 des 42 templates après refactor | Faible | Moyen | Smoke E2E sur 5 templates types + review visuelle manuelle sur 5-10 templates |

---

## 10. Estimation

| Phase | Effort |
|---|---|
| Setup branche + types/DEFAULT_ORDER + fixtures | 30min |
| `renderHeroThumbs` + tests Vitest | 1h |
| `renderGallery` + tests Vitest + intégration `SECTION_RENDERERS` | 1h |
| Enrichissement `renderUniqueMechanism` + tests régression | 45min |
| Script refactor 42 templates (dry-run + apply) | 1h30 |
| Traitement manuel templates non-matchés | 30min-1h |
| Smoke E2E étendu + full Vitest suite + lint + typecheck | 1h |
| Feature flag `.env.example` + push + PR | 30min |

**Total : ~6-7h sur 1 jour (1 session continue).**

---

## 11. Suite logique (après merge B)

- **Chantier C — éditeur enrichi GrapesJS** : panels custom + bibliothèque de blocks (édition manuelle post-génération)
- **V2 gallery** (si feedback users) : carousel swipe mobile + lightbox + optimisation WebP
- **Chantier image-quality** (post-launch) : auto-crop, retouche IA, génération packshot manquant via fal.ai
