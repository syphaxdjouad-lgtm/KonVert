# KONVERT — Chantier C : Builder Shopify-like (refonte éditeur)

**Date :** 2026-05-25
**Statut :** Design validé, prêt pour découpage en plans d'implémentation par sous-chantier
**Branche prévue :** `feat/editor-foundation` (sous-chantier C1) puis branches dédiées par sous-chantier
**Spec parent :** néant — chantier autonome
**Specs liées :** chantiers A (sections riches), B (multi-images), A.5 (prompt LLM)

---

## 1. Contexte & problème

L'éditeur actuel (`src/components/builder/GrapesEditor.tsx`, 243 lignes) utilise GrapesJS en mode "canvas pur" avec tous ses panels désactivés. Concrètement, l'utilisateur peut :
- Sélectionner un élément, le déplacer/dupliquer/supprimer (toolbar contextuelle minimale)
- Éditer du texte inline (double-click)
- Switcher device (desktop/tablet/mobile)
- Cliquer Sauvegarder ou Export HTML

Il ne peut PAS :
- Réorganiser les sections de la landing (drag-drop)
- Masquer une section sans la supprimer
- Ajouter une nouvelle section depuis une bibliothèque
- Modifier des champs structurés (text, image, color) via une UI dédiée
- Changer la palette globale de la page
- Ajouter une seconde instance d'une section (ex: 2 zones témoignages)

Conséquence : pour customiser sa landing au-delà du contenu généré par LLM, l'utilisateur doit éditer manuellement du HTML — ou redemander une regénération. Friction énorme vs les standards modernes (Shopify Theme Editor, Webflow, Wix Studio).

GrapesJS n'est pas l'outil adapté à notre besoin : il édite le DOM brut, alors qu'on a déjà une **source de vérité structurée** (`LandingPageData` du chantier A) qui modélise 19 sections riches. Garder GrapesJS = synchroniser DOM ↔ data dans les 2 sens, fightre contre les comportements par défaut, gérer 2 sources de vérité qui dérivent.

Le chantier C remplace GrapesJS par un **éditeur React custom section-level** qui pilote directement `LandingPageData` + un nouvel `EditorState` enrichi.

---

## 2. Objectifs

1. Éditeur Shopify Theme Editor-like : sidebar verticale + panel gauche (sections/blocks/styles) + preview centrale iframe + panel droit slide-in (settings de la sélection)
2. Drag-drop des sections, toggle visibility, suppression
3. Settings panel droit avec fields React (text, textarea, image upload, color picker, padding S/M/L, alignment, toggles)
4. Bibliothèque de **18 nouveaux blocks** indépendants des templates (hero variants, countdown, video, partners, etc.)
5. Palette globale (couleurs primary/accent, font, radius) qui override le thème du template
6. Migration big bang des landings legacy GrapesJS → nouvel éditeur (re-render via `renderTemplate(templateId, json_content)`)
7. Architecture React + Zustand + iframe + @dnd-kit, **drop GrapesJS** (bundle -500 KB)

---

## 3. Architecture

### 3.1 Stack technique

- **State management :** Zustand (`useEditorStore`)
- **Drag-drop :** `@dnd-kit/sortable`
- **Color picker :** `react-colorful`
- **Image upload :** Supabase Storage bucket `landing-images` (déjà provisionné, cf migration `20260503_pages_images_bucket.sql`)
- **Preview :** `<iframe srcdoc={...} sandbox="allow-scripts">` re-rendu en debounce 200ms
- **Forms :** React standard (pas de react-hook-form, surdimensionné pour notre besoin)

### 3.2 Layout du builder

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Topbar 56px : breadcrumb + device switcher + bouton Sauvegarder + Publier   │
├──┬──────────────┬───────────────────────────────────┬───────────────────────┤
│  │              │                                   │                       │
│ 48│  PanelLeft   │       Preview iframe              │  PanelRight (slide-in)│
│ S │  320px       │       (responsive)                │  360px                │
│ I │              │                                   │  S'ouvre quand        │
│ D │  Mode :      │       srcdoc = renderTemplate(   │  section selected     │
│ E │  - Sections  │         templateId,               │                       │
│ B │  - Blocks    │         landingData,              │  Form fields :        │
│ A │  - Styles    │         { sectionOrder,           │  - Title              │
│ R │  - Settings  │           visualSettings,         │  - Subtitle           │
│   │              │           globalStyles }          │  - Image              │
│ Icons│           │       )                           │  - Color              │
│ verticaux        │                                   │  - Padding S/M/L      │
│  │              │                                   │  - Alignment          │
│  │              │                                   │  - Toggles            │
└──┴──────────────┴───────────────────────────────────┴───────────────────────┘
```

**Comportement clé :**
- Sidebar verticale toujours visible, switch entre 4 modes via icônes
- PanelLeft : 320px, contenu varie selon le mode actif (Sections / Blocks / Styles / Settings)
- Preview centrale prend tout l'espace restant, iframe sandbox isolée
- PanelRight : 360px, slide-in seulement quand une section est sélectionnée (click sur la section dans la liste OU click sur la section dans la preview)

### 3.3 Data model

`LandingPageData` (chantier A) reste la source de vérité pour le **contenu**. On ajoute un wrapper `EditorState` :

```ts
interface EditorState {
  templateId: string                    // ex: 'etec-blue'
  landingData: LandingPageData          // contenu (story, features, testimonials...)
  sectionOrder: SectionInstance[]       // ordre + visibility + instances
  visualSettings: VisualSettings        // tweaks visuels par instance
  globalStyles: GlobalStyles            // palette + font globaux (override theme)
}

interface SectionInstance {
  id: string              // uuid pour identifier une instance (permet 2x testimonials)
  key: SectionKey         // 'story' | 'testimonials' | ... | 'countdown' (nouveaux blocks)
  visible: boolean        // toggle on/off (cacher sans supprimer)
  data?: object           // pour nouveaux blocks ou override de landingData
}

interface VisualSettings {
  [sectionId: string]: {
    padding?: 'sm' | 'md' | 'lg'        // 60px / 80px / 120px
    bgColor?: string                     // override theme.bg pour cette section
    alignment?: 'left' | 'center' | 'right'
    hiddenElements?: string[]            // ex: ['cta', 'icon'] pour cacher des sous-éléments
  }
}

interface GlobalStyles {
  primary?: string                       // override theme.primary
  accent?: string
  fontFamily?: string
  radius?: string                        // override theme.radius
}
```

### 3.4 Storage Supabase

Tout va dans `pages.json_content` (jsonb, déjà existant) — pas de migration DB nécessaire.

```ts
// Format json_content après chantier C
{
  // ─── Contenu (LandingPageData chantier A) ─────────────────────────────────
  headline: "...",
  subtitle: "...",
  benefits: [...],
  story: { ... },
  features: [ ... ],
  // ... tous les champs LandingPageData

  // ─── Métadonnées éditeur (chantier C) ─────────────────────────────────────
  _template_slug: 'etec-blue',          // déjà introduit dans le fix UUID
  _editor_state: {
    sectionOrder: [
      { id: 'uuid1', key: 'social_proof_bar', visible: true },
      { id: 'uuid2', key: 'story', visible: true },
      { id: 'uuid3', key: 'testimonials', visible: true },
      { id: 'uuid4', key: 'testimonials', visible: true, data: { ... } },  // 2e instance
      // ...
    ],
    visualSettings: {
      'uuid2': { padding: 'lg', bgColor: '#f5f4fa' },
      // ...
    },
    globalStyles: {
      primary: '#FF6B35',
      fontFamily: "'Playfair Display', serif",
    },
  },
}
```

### 3.5 Extension de `renderTemplate`

```ts
// Avant chantier C
renderTemplate(templateId: string, data: LandingPageData): string

// Après chantier C — signature étendue, rétrocompatible
renderTemplate(
  templateId: string,
  data: LandingPageData,
  overrides?: {
    sectionOrder?: SectionInstance[]
    visualSettings?: VisualSettings
    globalStyles?: GlobalStyles
  }
): string
```

Si `overrides` absent : comportement actuel inchangé (compatibilité legacy).
Si présent : `renderRichSections` itère sur `sectionOrder` au lieu de `DEFAULT_ORDER`, applique `visualSettings` par section, et `globalStyles` override le thème.

### 3.6 Migration big bang

Quand l'utilisateur ouvre une landing créée avant le chantier C :
- `pages.json_content._editor_state` est absent → on hydrate des defaults :
  - `sectionOrder` = `DEFAULT_ORDER.map(key => ({ id: uuid(), key, visible: hasData(landingData, key) }))`
  - `visualSettings` = `{}` (toutes sections en défauts thème)
  - `globalStyles` = `{}` (palette défaut thème)
- `pages.html_content` est ignoré (on re-rend via `renderTemplate(templateId, landingData)`)
- Conséquence : les modifs DOM brutes faites dans GrapesJS sont **perdues**. Acceptable car (1) volume faible (peu de users existants), (2) workflow attendu = générer puis retoucher textes (pas hacker le DOM), (3) `landingData` reste intact.

**Mitigation** : log Sentry `editor.legacy_page_opened` la 1ère fois qu'un user X ouvre une legacy page. Monitoring 1 semaine post-merge :
- <5 warnings → migration OK
- >50 warnings → on revoit la stratégie (option backup `legacy_html`)

### 3.7 Sauvegarde

**Auto-save** : debounce 3s après le dernier change Zustand. Indicateur visuel :
- "Sauvegardé il y a 3s" (vert)
- "Modification non sauvée" (orange)
- "Erreur de sauvegarde" (rouge, avec bouton Retry)

**Sauvegarde manuelle** (bouton Sauvegarder explicite) : `await supabase.from('pages').update({ ... })`.

```ts
await supabase.from('pages').update({
  title,
  html_content: renderTemplate(templateId, landingData, {
    sectionOrder, visualSettings, globalStyles,
  }),
  json_content: {
    ...landingData,
    _template_slug: templateId,
    _editor_state: { sectionOrder, visualSettings, globalStyles },
  },
}).eq('id', pageId)
```

`html_content` reste populé pour servir les preview publiques `/p/[slug]` sans re-render côté serveur.

---

## 4. Composants React

### 4.1 Arborescence

```
src/components/editor/
├── EditorRoot.tsx              [orchestrateur, hydrate Zustand depuis json_content]
├── Sidebar.tsx                 [48px, 4 icônes : Sections/Blocks/Styles/Settings]
├── PanelLeft.tsx               [320px, switch entre 3 modes selon icône active]
│   ├── SectionsList.tsx        [drag-drop @dnd-kit, toggle visibility, supprimer]
│   ├── BlocksLibrary.tsx       [grille des 18 blocks à ajouter par drag-drop]
│   └── GlobalStyles.tsx        [palette couleurs + font globaux]
├── PanelRight.tsx              [360px slide-in, props: selectedSectionId]
│   ├── SectionEditor.tsx       [dispatcher selon section.key → renderXxxEditor]
│   ├── fields/
│   │   ├── TextField.tsx
│   │   ├── TextAreaField.tsx
│   │   ├── ImageField.tsx       [upload Supabase Storage bucket landing-images]
│   │   ├── ColorField.tsx       [react-colorful]
│   │   ├── ToggleField.tsx
│   │   ├── SelectField.tsx
│   │   └── PaddingField.tsx     [S/M/L pills]
│   └── editors/
│       ├── StoryEditor.tsx
│       ├── TestimonialsEditor.tsx
│       └── ... (1 éditeur par SectionKey, ~37 fichiers : 19 chantier A + 18 nouveaux blocks)
├── PreviewIframe.tsx           [iframe srcdoc + debounce 200ms + device responsive]
├── DeviceSwitcher.tsx          [desktop/tablet/mobile, dans topbar]
└── store.ts                    [Zustand : useEditorStore + actions]
```

### 4.2 Patterns clés

- **Pas de prop drilling Zustand** : chaque `XxxEditor` reçoit `(data, onChange)` props, n'utilise pas `useEditorStore` directement → testable isolément
- **PreviewIframe minimaliste** : ne lit que `useEditorStore(s => ({ ...renderInputs }))` avec selector + debounce 200ms → re-renders ciblés
- **SectionsList** : utilise `@dnd-kit/sortable` avec `useEditorStore(s => s.sectionOrder)` + actions `moveSection`, `toggleSectionVisible`, `removeSection`
- **ImageField** : upload via `supabase.storage.from('landing-images').upload(path, file)` → retourne `publicUrl` → injecte dans field correspondant

---

## 5. Bibliothèque de 18 nouveaux blocks

Chaque nouveau block = 1 nouvelle fn `renderXxx(d, t)` exportée de `sections.ts` + 1 entrée `SectionKey` + 1 entrée `SECTION_RENDERERS` + 1 `XxxEditor.tsx` dans `editors/`.

**Hero alternatifs (3) :**
- `hero_video` — vidéo en background avec overlay (mp4/webm URL)
- `hero_split` — texte + image côte-à-côte minimaliste
- `hero_centered` — sobre centré (style Glossier/Aesop)

**Engagement (4) :**
- `countdown` — compteur temps réel (date cible configurable, label)
- `video_embed` — embed YouTube/Vimeo/MP4 (URL)
- `instagram_feed` — grid 6 posts (URLs IG manuelles)
- `gallery_lifestyle` — grid d'images séparé du produit (lifestyle/UGC)

**Trust (4) :**
- `partners_logos` — 4-6 logos partenaires (URLs ou upload)
- `certifications` — badges (CE, Bio, Made-in, etc.) en grid (emoji + label)
- `awards` — médailles/récompenses presse (label + année)
- `stats_counter` — 3-4 chiffres clés animés (X clients, Y pays, Z étoiles)

**Conversion (4) :**
- `sticky_cta_bar` — barre CTA fixe en bas qui apparaît au scroll
- `exit_intent_popup` — modal au scroll-out (titre + offre + CTA)
- `email_capture` — formulaire newsletter inline (intégration future via webhook)
- `quiz_recommendation` — mini-quiz 3 questions pour recommander variante

**Social (3) :**
- `shareable_card` — bouton "Partager" avec preview (OG image generated)
- `reviews_widget_embed` — embed widget Trustpilot/Yotpo (URL/widget ID)
- `tiktok_embed` — embed TikTok par URL

**Total : 18 blocks.** Compatibilité avec les 42 thèmes : chaque block utilise `theme.primary/accent/bg/bgAlt/border/fontFamily/radius` comme les sections chantier A (zero hardcoded colors hors danger/success).

---

## 6. Tests

### 6.1 Vitest unit

```
src/components/editor/__tests__/
├── store.test.ts                   [actions : addSection, moveSection, removeSection,
│                                     toggleVisible, updateField, applyVisualSetting,
│                                     applyGlobalStyle]
├── PreviewIframe.test.ts           [debounce, srcdoc rendu correct selon state]
├── SectionsList.test.ts            [drag-drop ordre, toggle, supprimer]
├── PanelRight.test.ts              [slide-in selon selectedSectionId, dispatcher correct]
├── editors/StoryEditor.test.ts     [form binding texte → onChange]
├── editors/CountdownEditor.test.ts [date picker, label]
├── editors/InstagramFeedEditor.test.ts [array URLs management]
├── fields/ColorField.test.ts       [color picker emit hex valide]
├── fields/ImageField.test.ts       [upload Supabase mock, publicUrl retourné]
└── migration.test.ts               [hydratation EditorState from legacy json_content
                                     (sans _editor_state), defaults sensés]
```

### 6.2 Smoke E2E

Étendre `sections-rich-render.test.ts` :
- `renderTemplate(templateId, data, { sectionOrder: [...visible:false] })` n'inclut pas la section
- `renderTemplate(templateId, data, { visualSettings: { sectionId: { padding: 'lg' } } })` applique le padding
- `renderTemplate(templateId, data, { globalStyles: { primary: '#FF0' } })` override la couleur

**Total estimé : 25-30 nouveaux tests.** Pas de Playwright (leçon chantier A T10).

---

## 7. Hors scope (V2 si feedback users)

- **Undo/Redo** (Cmd+Z)
- **Multi-page** (édition de plusieurs pages dans le même éditeur)
- **Collaboration temps réel** (multi-curseur, Figma-style)
- **Versioning** (timeline des sauvegardes avec restore)
- **A/B testing intégré** (variant A vs B depuis l'éditeur)
- **CSS custom inline** (textarea CSS par section)
- **Animations Framer Motion configurables**
- **Slash commands** (`/` pour insérer un block)
- **Keyboard shortcuts complets** (Cmd+S, Cmd+D, Cmd+/)
- **Templates de page entière** (presets de landing pré-arrangée à charger)
- **Édition responsive granulaire** (settings différents desktop vs mobile)
- **Mode preview public sans iframe** (édition WYSIWYG directe au lieu d'iframe)
- **API webhooks pour blocks externes** (Calendly, Stripe Checkout, etc.)
- **Export Shopify section** (générer une section Liquid pour push direct dans le thème)

---

## 8. Découpage en sous-chantiers (specs + plans dédiés)

| # | Périmètre | Effort | Dépend de | Livrable |
|---|---|---|---|---|
| **C1 — Foundation** | Drop GrapesJS, EditorRoot, Zustand store (`sectionOrder` + actions), Sidebar + PanelLeft mode Sections (drag-drop @dnd-kit + toggle + supprimer), PreviewIframe (iframe + debounce + device switcher), migration big bang depuis legacy json_content, extension `renderTemplate` pour accepter `overrides.sectionOrder` | ~1.5 sem | — | Éditeur fonctionnel mais sans settings (lecture seule + réordonnement) |
| **C2 — Settings panel** | PanelRight slide-in, 7 fields (Text, TextArea, Image, Color, Toggle, Select, Padding), 19 editors pour sections chantier A, extension `renderTemplate` pour `overrides.visualSettings`, auto-save debounce 3s | ~1.5 sem | C1 | Éditeur Shopify-like 100% utilisable sur les sections existantes |
| **C3 — Sections ajoutables** | Permettre ajout d'instances multiples de sections existantes (ex: 2 testimonials, 2 FAQ). `renderRichSections` itère déjà sur `sectionOrder` depuis C1 — C3 ajoute juste le bouton "+" dans `PanelLeft > SectionsList` qui pousse une nouvelle `SectionInstance` avec `data` clone de l'existante | ~1 sem | C1+C2 | Power user peut multiplier les sections existantes |
| **C4 — Blocks library** | 18 nouveaux blocks (renderers TypeScript + editors React + tests), PanelLeft mode Blocks avec grille drag-droppable, integration dans 42 thèmes (compatibilité couleurs/typo via `theme`) | ~3 sem | C1+C2+C3 | Bibliothèque de blocks pro |
| **C5 — Global Styles** | PanelLeft mode Styles (palette couleurs primary/accent + font + radius), override theme via `globalStyles`, extension `renderTemplate` pour `overrides.globalStyles` | ~0.5 sem | C1+C2 | Customisation de marque globale |

**Total estimé : 7-8 semaines** sur 1 dev full-time.

**MVP recommandé : C1 + C2 = 3 semaines** → éditeur Shopify-like utilisable, sans bibliothèque de nouveaux blocks. Validation users, puis C3/C4/C5 selon priorité observée.

Chaque sous-chantier aura :
1. Son propre spec court (s'il a des décisions design propres à valider)
2. Son propre plan d'implémentation détaillé (`docs/superpowers/plans/2026-05-25-konvert-chantier-c1-foundation.md`, etc.)
3. Sa propre branche feature + PR
4. Son propre rollback en cas de bug critique (flag `KONVERT_NEW_EDITOR=false` revient à GrapesEditor sur tous les sous-chantiers tant que C2 n'est pas mergé)

---

## 9. Risques & mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Migration big bang casse des landings legacy | Moyenne | Élevé | Log Sentry warning sur 1 semaine post-merge ; option backup `legacy_html` en standby |
| Iframe re-render trop lent en débounce 200ms | Faible | Moyen | Profiling React DevTools sur fixture 19 sections, fallback debounce 400ms |
| Bundle React + Zustand + @dnd-kit pèse plus lourd que GrapesJS | Faible | Faible | Mesure bundle avant/après, code split éditeur si nécessaire |
| 18 nouveaux blocks compatibles 42 thèmes = matrice 756 cas | Moyenne | Élevé | Tester chaque block sur 5 thèmes types (blue/noir/luxe/rose/energy) suffit pour le pattern, les 37 restants suivent |
| Supabase Storage `landing-images` saturé par uploads users | Faible | Moyen | Quota déjà en place par user (cf migrations), monitoring storage |
| Sentry `editor.legacy_page_opened` > 50 warnings | Faible | Élevé | Plan B : on développe la migration auto avec backup `legacy_html` pour permettre rollback per-page |
| Zustand store état complexe → bugs subtils | Moyenne | Moyen | Tests unit exhaustifs sur store.ts (toutes les actions) + dev tools Zustand pour debug en runtime |

---

## 10. Métriques de succès post-merge

À mesurer 2 semaines après merge C1+C2 (MVP) :

- **Engagement éditeur** : % de pages créées dont l'utilisateur ouvre le PanelRight au moins 1 fois (target : >60%)
- **Save success rate** : % de clics "Sauvegarder" qui aboutissent à un update DB réussi (target : >99%, le bug template_id UUID fixé récemment doit être derrière nous)
- **Latence iframe** : temps moyen entre change Zustand et re-render iframe (target : <250ms p95)
- **Sentry errors éditeur** : <0.1% des sessions (rollback flag `KONVERT_NEW_EDITOR=false` si >1%)
- **Adoption nouvelle UX** : % d'users qui complètent une page (génération → publication) avec le nouvel éditeur vs ratio historique avec GrapesEditor (target : ≥ratio historique, idéalement +20%)
