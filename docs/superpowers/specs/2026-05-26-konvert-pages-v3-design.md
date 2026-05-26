# Konvert — Refonte pages produit V3 (Allbirds-grade)

**Auteur** : brainstorm Syphax × Claude
**Date** : 2026-05-26
**Statut** : Design validé, en attente plan d'implémentation
**Objectif** : Atteindre 85-90% de la qualité visuelle Allbirds/Mejuri/Glossier sur les pages produit générées par Konvert, en résolvant trois problèmes structurels du système actuel.

---

## 1. Problèmes adressés

Les pages produit générées par Konvert souffrent de trois défauts cumulés observés en production :

1. **Images du template qui restent affichées** quand le template ne matche pas le produit (ex : photos de diamants sur une page de sac en cuir). Le warning "template incompatible" actuel est non bloquant et laisse passer des rendus catastrophiques.
2. **Sections AI faibles** : copy plat (`"Sac générique sans âme"`), design basique (cartes rouge/verte Sans/Avec), images absentes ou mal exploitées, sections inadaptées au produit.
3. **Trop de templates à choisir** : 42 templates `etec-*` créent une analysis paralysis à l'étape sélection. La curation manuelle par catégorie complique le parcours utilisateur.

Cause racine commune : on a 42 templates *spécifiques par catégorie* alors qu'on devrait avoir *peu de styles universels + beaucoup de sections de qualité*, et le système de rendu n'exploite pas correctement les images scrapées.

## 2. Vision et principes

- **Template = skin visuel pur** : un template ne contient que des tokens (couleurs, typo, spacing, radius, animations). Aucun contenu thématique, aucune image hardcodée. Inspiration : Framer, Notion.
- **Sections universelles** : les sections sont identiques pour tous les produits. Elles s'adaptent au contenu via injection de données. Pas de section "spéciale jewelry" ou "spéciale skincare".
- **Images = uniquement du produit scrapé** : aucune image fallback du template. Rotation avec réutilisation si la source n'en a pas assez.
- **Référence visuelle cible** : DTC premium US — Allbirds, Mejuri, Glossier, Ridge.
- **Pas d'image générée par IA en V3** : le client maitrise ses images (upload/remplacement dans le dashboard).

## 3. Architecture cible

```
┌────────────────────────────────────────────────────────────┐
│                  PAGE PRODUIT KONVERT V3                   │
└────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌──────────────────────┐      ┌────────────────────────────┐
│   STYLE (~10 skins)  │      │  SECTIONS V3 (~13 univ.)   │
│                      │      │                            │
│  Design tokens :     │      │  hero · gallery ·          │
│  - palette           │      │  why_we_love · features ·  │
│  - typo (h+body)     │      │  best_for · materials ·    │
│  - spacing/radius    │      │  how_it_works · compare ·  │
│  - boutons/cards     │      │  reviews · press · care ·  │
│  - anims subtiles    │      │  faq · brand_manifesto     │
│                      │      │                            │
│  Ex : Soft, Apple-   │      │  Universelles, jamais      │
│  Clean, Luxe Noir,   │      │  thématiques. Images       │
│  Editorial, Bold...  │      │  injectées via ImagePool   │
└──────────────────────┘      └────────────────────────────┘
            │                              │
            └──────────────┬───────────────┘
                           ▼
             ┌─────────────────────────────┐
             │   PAGE = STYLE × SECTIONS   │
             │   1 fichier renderPage()    │
             └─────────────────────────────┘
                           │
                           ▼
                 Images produit (scraper + user upload)
                 Copy AI (DeepSeek, prompt par ton)
```

**Conséquences directes** :
- Les 42 templates `etec-*` sont dépréciés. Migration vers ~10 styles dans `src/lib/styles/`.
- Les 20 sections V2 du Chantier A sont rationalisées vers 13 sections V3 universelles, redesignées niveau Allbirds.
- Plus de champ `themed: true/false`, plus de `productType` au niveau du template.
- La détection de produit ne sert plus qu'à : (1) suggérer le style par défaut, (2) personnaliser le ton de la copy AI.
- Le composant `renderTemplate(templateId, data)` devient `renderPage(styleId, data, sectionOrder)`.

## 4. Couche STYLES (~10 skins)

Chaque style est défini par un fichier de tokens et un fichier de patterns CSS. Aucune logique métier.

| Style | Vibe | Tokens clés (palette / typo / radius) | Cas d'usage |
|---|---|---|---|
| **soft** | Mejuri/Glossier — serif fin, cream | `#FAF7F2` · Cormorant + Inter · 6px | Bijoux, beauté, fashion premium |
| **editorial** | Magazine — grand serif, grilles asym | `#FFFFFF` · Tiempos + Inter · 0px | Lifestyle, mode, déco |
| **apple-clean** | Sans serif sharp, white space | `#FFFFFF` · SF Pro / Inter · 12px | Tech, gadgets premium |
| **bold** | Bento, couleurs saturées | blanc + accents vifs · sans grotesque · 20px | Suppléments, fitness, DTC énergique |
| **organic** | Natural — vert sage, serif rond | `#F4F1ED` · DM Serif + Inter · 16px | Wellness, bio, skincare clean |
| **luxe-noir** | Dark luxe — noir + or | `#0A0A0A` · Playfair · 2px | Joaillerie, luxe |
| **brutalist** | Mono + grids cassées | `#F5F5F0` · JetBrains Mono · 0px | Tech edge, street, créatif |
| **warm-neutral** | Tan/beige, serif chaleureux | `#F4ECE0` · PP Editorial · 8px | Mode, café, accessoires |
| **minimal-mono** | N&B pur, Helvetica | `#FFFFFF` · Inter · 4px | Universel propre |
| **vibrant** | Couleurs vives, créatif | `#FFFFFF` · sans grotesque · 16px | Kids, créatif, événementiel |

**Critère de curation** : deux styles ne peuvent pas être visuellement similaires à plus de 70%. Les ajouts futurs (style #11+) devront prouver leur différenciation.

**Structure code** :

```
src/lib/styles/
├── index.ts                  # registry + StyleId type
├── types.ts                  # interfaces tokens
├── soft/
│   ├── tokens.ts             # palette, typo, spacing, radius
│   ├── patterns.css          # classes utilitaires spécifiques au skin
│   └── mockup.html           # référence visuelle OBITO (validée)
├── editorial/
│   └── ...
└── ... (10 styles)
```

## 5. Couche SECTIONS V3 (~13 sections universelles)

Refonte complète des 20 sections V2. Chaque section a une **règle de display** qui détermine si elle s'affiche selon les données disponibles.

### 5.1 Inventaire des sections V3

| # | Section | Contenu | Règle display | Slots images |
|---|---|---|---|---|
| 1 | `hero` | Photo XL produit, nom, prix, rating, CTA, free shipping line | Toujours | 1 (best image) |
| 2 | `gallery` | Multi-angles produit, scroll horizontal mobile | Si ≥ 3 images dans le pool | Toutes |
| 3 | `why_we_love` | Story émotionnelle 3-4 lignes générée par AI | Toujours | 0 |
| 4 | `thoughtfully_designed` | 4 bullets features avec mots propriétaires extraits par AI | Toujours | 0 |
| 5 | `best_for` | Pills cas d'usage (Travelling · Walking · Everyday) générés par AI | Toujours | 0 |
| 6 | `materials_breakdown` ★ | Cartes (photo + matériau + bénéfice) — section signature Allbirds | Si AI extrait ≥ 2 matériaux avec confidence haute | 1 par carte (rotation détail) |
| 7 | `how_it_works` | 3 étapes simples avec icônes (produits action : sérum, supplément) | Si catégorie = skincare/wellness | 0 (icônes) |
| 8 | `compare_variants` | Variantes maison (couleurs/tailles) si scrapées | Si ≥ 2 variantes scrapées | 1 par variante |
| 9 | `reviews_ai_summary` | Paragraphe "Customers say..." synthétisé par AI + reviews scrollables | Si reviews scrapées | 0 (avatars génériques) |
| 10 | `press_quote` | 1 quote forte d'une source crédible | Si quote scrapée ou inventée plausible (flag user) | 1 lifestyle |
| 11 | `care_instructions` | Objection-killer chaleureuse (entretien, garantie, livraison) | Toujours | 0 |
| 12 | `faq` | 4-5 questions/réponses générées par AI | Toujours | 0 |
| 13 | `brand_manifesto` | Mission + 3 piliers brand + CTA final | Toujours | 1 lifestyle |

### 5.2 Sections V2 supprimées (20 → 13)

| V2 supprimée | Raison | Remplacement V3 |
|---|---|---|
| `before_after`, `comparison` | Pattern Sans/Avec rouge/vert = cheap | Fusion dans `why_we_love` + `thoughtfully_designed` |
| `competitor_comparison` | Trop agressif vs concurrents, pas Allbirds-style | Suppression ; `compare_variants` à la place (variantes maison) |
| `target_audience` | Format "Porté au quotidien" trop flou | `best_for` (pills concrets) |
| `social_proof_bar`, `press_mentions` | Trop fragmentés | Fusion dans `press_quote` |
| `founder_note` | Optionnel, peu utilisé | Intégré dans `brand_manifesto` si pertinent |
| `value_stack`, `bonuses`, `guarantee`, `risk_reversal` | Trop "infopreneur" | Fusion dans `care_instructions` |
| `unique_mechanism` | Redondant avec features | Fusion dans `materials_breakdown` |
| `objections`, `community_callout`, `final_pitch` | Doublons fonctionnels | Fusion dans `faq` + `brand_manifesto` |

### 5.3 Structure code

```
src/lib/sections-v3/
├── index.ts                     # SectionRenderer<V3SectionKey> map
├── types.ts                     # V3SectionKey, SectionDisplayRule
├── display-rules.ts             # règles de visibilité par section
├── hero/
│   ├── render.tsx               # rendu React/HTML
│   ├── mockup.html              # référence OBITO
│   └── test.spec.ts             # Vitest
├── gallery/
│   └── ...
└── ... (13 sections)
```

## 6. Gestion des images (ImagePool)

### 6.1 Modèle de données

```ts
// src/lib/images/pool.ts
interface ImagePool {
  primary: string                   // meilleure image, hero
  all: string[]                     // toutes images (scrapées + uploadées)
  byAngle?: {                       // détection heuristique optionnelle
    front?: string
    back?: string
    detail?: string
    lifestyle?: string
  }
}

type ImageSlotKey = 'front' | 'back' | 'detail' | 'lifestyle' | 'any'

function getImage(
  pool: ImagePool,
  slot: ImageSlotKey,
  index: number
): string {
  // 1. angle spécifique demandé → retourne si dispo
  // 2. sinon rotation sur pool.all par modulo index
  // 3. fallback : pool.primary
}
```

### 6.2 Détection d'angle (heuristique filename)

Pour produits avec naming pro (Shopify marques pro), on infère l'angle depuis le nom de fichier :

| Pattern filename | Angle inféré |
|---|---|
| `*_LEFT.*`, `*_FRONT.*`, `*_SIDE.*` | `front` |
| `*_BACK.*` | `back` |
| `*_DETAIL_*`, `*_CLOSEUP_*`, `*_MACRO_*` | `detail` |
| `*_LIFESTYLE_*`, `*_WORN_*`, `*_MODEL_*` | `lifestyle` |
| Tout autre | `unknown` (distribué en ordre d'apparition) |

Pas de vision AI en V3 (trop cher, trop lent). Reporté en V4.

### 6.3 Sources d'images

L'`ImagePool` est constitué de deux sources combinées :

1. **Scraping** (Firecrawl) : récupère ce qui est disponible sur l'URL source
2. **Upload utilisateur** (étape Produit) : drag-drop dans le wizard, stockage Supabase Storage

L'ordre final = ordre validé par l'utilisateur à l'étape Produit (drag-drop reorder).

### 6.4 Règle de rotation

Si une section demande N images mais le pool n'en a que M < N :
- On utilise les M images disponibles
- Pour les slots restants on boucle (image_1, image_2, image_1, image_2...) avec, si possible, un `object-position` CSS différent (zoom/crop) pour limiter la sensation de répétition

## 7. Wizard utilisateur

Le wizard de création de page passe de 8 à 8 étapes (inchangé en nombre), mais 2 étapes sont fortement remaniées : **Produit** (gestion images) et **Style** (résumé + ton).

### 7.1 Étape "Produit" (étape 3/8)

L'utilisateur édite les données scrapées avant génération. Nouveauté V3 : gestion complète des images.

**Contenu :**
- Nom du produit (éditable)
- Prix (éditable)
- Description (éditable, alimente le prompt AI)
- **Bloc Images** :
  - Affichage grille des images scrapées (5-8 typique)
  - Drag-and-drop pour réordonner (la première = hero)
  - Bouton `✕` par image pour supprimer
  - Bouton `[+]` pour uploader ses propres images (Supabase Storage)
  - Légende : "Drag pour réordonner · Clic ✕ pour supprimer · `[+]` pour ajouter"

**Contrainte** : minimum 1 image avant de passer à l'étape suivante.

### 7.2 Étape "Style" (étape 4/8)

Refonte UX majeure : remplacer la grille de 42 templates par un **résumé textuel + 2 boutons options**.

**Affichage par défaut** (90% des users s'arrêtent là) :

```
✨ Voici ce qu'on va créer pour toi

🛍️  Produit
    Sac à bandoulière en cuir vintage
    Détecté : Mode · Accessoires

🎨  Style
    Soft — élégant, serif fin, palette cream

🗣️  Ton de la copy
    Auto — l'AI choisit selon le produit

📐  Page
    13 sections premium, mobile-first
    Hero · Galerie · Story · Features · Best for ·
    Materials · Reviews · FAQ · Manifesto ...

🖼️  Images : 5 (finalisées étape précédente)
✍️  Copy : générée par AI, éditable après

[ 🎨 Choisir une template manuellement ]
[ 🗣️ Personnaliser le ton de la copy   ]

[← Retour]                    [Générer ma page →]
```

**Le user clique `Générer` directement** → 90% des cas. Aucune friction.

**Bouton "Choisir une template manuellement"** → ouvre une modale avec les 10 styles en mini-previews du produit en cours. Le style auto-sélectionné a un check `✓`. L'user peut en choisir un autre.

**Bouton "Personnaliser le ton de la copy"** → ouvre une modale avec 6 tons :

| Ton | Description courte | Exemple |
|---|---|---|
| **Auto** (recommandé) | L'AI choisit selon le produit | — |
| Friendly & accessible | Tutoiement, exemples concrets, chaleureux | *"T'as déjà ressenti ce moment où..."* |
| Premium & élégant | Vouvoiement, vocabulaire raffiné | *"Conçu pour celles qui savent..."* |
| Bold & punchy | Direct, court, claims forts | *"Tu veux du résultat. Voilà."* |
| Storytelling émotionnel | Narratif, voyage, sens | *"Tout commence un matin de juin..."* |
| Éducatif & expert | Pédagogique, jargon métier | *"Le retinol fonctionne en stimulant..."* |

**Auto-pick du ton** (si user laisse `Auto`) :
- Prix > 200€ + catégorie luxe/jewelry → `premium`
- Catégorie skincare/wellness → `educational`
- Catégorie fashion/beauty → `friendly`
- Catégorie tech → `bold`
- Sinon → `friendly`

### 7.3 Mécanique auto-pick du style

```ts
// src/lib/styles/auto-pick.ts
function suggestStyle(product: ScrapedProduct): StyleId {
  const type = detectProductType(product)  // existant, étendu
  const map: Record<ProductType, StyleId> = {
    jewelry:   'soft',         // ou luxe-noir si prix élevé
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

### 7.4 DataValidationStep (étape conditionnelle après génération)

Vu qu'on choisit le mode hybride "AI extrait + flag user", on insère une étape de validation **après génération AI, avant publication**, conditionnelle :

**Apparait uniquement si au moins 1 champ a confidence basse** (< 0.6) :

```
Vérifie les infos extraites de ton produit

✅ Nom : Sac à bandoulière en cuir vintage
✅ Prix : 79€
⚠️  Matériaux extraits (confidence basse) :
   [Cuir véritable]  [✗] [+ ajouter]
   L'AI a deviné — confirme ou complète
✅ Cas d'usage : Quotidien · Travail · Sortie
⚠️  Reviews : aucune trouvée sur la source
   [ ] Ne pas afficher la section reviews

[← Retour]                  [Publier ma page →]
```

Si toutes les confidences sont hautes, l'étape est sautée → publication directe.

## 8. Workflow OBITO maquette → ANNA code

Pour atteindre la qualité Allbirds-grade, chaque style passe par une étape de **maquette HTML/CSS validée visuellement avant code production**.

### 8.1 Cycle par style

```
1. Brief OBITO         (15 min)  → mission + références + sections + contraintes
2. OBITO maquette      (1-2 j)   → /design/mockups/style-{id}.html (standalone)
3. Review visuelle     (30 min)  → tu compares side-by-side avec Allbirds
   - OK                          → passe au code
   - Retouches mineures (30 min) → OBITO ajuste
   - Refonte majeure             → relance brief affiné
4. Extraction tokens   (2 h)     → tokens.ts + patterns.css
5. ANNA code prod      (2-3 j)   → sections React/Tailwind pixel-perfect vs maquette
```

### 8.2 Structure livrables OBITO

```
/Users/mac/nexara/konvert/design/mockups/
├── style-soft.html           # page produit complète scrollable (HTML/CSS pur)
├── style-soft-mobile.html    # variante mobile (responsive testé)
├── style-soft.notes.md       # justifications design + tokens
└── style-soft.tokens.json    # couleurs/typo/spacing extraits
```

**Format maquette** : HTML/CSS standalone, zéro Next.js, zéro React. Vraies images du produit-exemple, vraie copy, vraies animations (CSS keyframes). Objectif : valider visuellement en 30 minutes.

### 8.3 Validation pixel-perfect

Une fois ANNA code la version prod, comparaison via Playwright screenshots :
- Capture de la maquette HTML
- Capture du rendu Next.js
- Si divergence visuelle > 5% (pixel diff) → ANNA itère

## 9. Migration des pages existantes

### 9.1 Double renderer temporaire

Pendant la phase de migration, on garde les deux systèmes actifs :

```ts
function renderPage(pageData) {
  if (pageData.styleId && STYLE_IDS.includes(pageData.styleId)) {
    return renderPageV3(pageData.styleId, pageData)
  }
  return renderTemplate(pageData.templateId, pageData)  // legacy
}
```

### 9.2 Mapping legacy → V3

```ts
// src/lib/migration/legacy-to-v3.ts
const LEGACY_TO_V3: Record<string, StyleId> = {
  'etec-platina': 'luxe-noir',
  'etec-rose':    'soft',
  'etec-gold':    'luxe-noir',
  'etec-blue':    'apple-clean',
  'etec-noir':    'luxe-noir',
  'etec-sage':    'organic',
  // ... 42 entries au total
}
```

### 9.3 Script migration

`scripts/migrate-pages-to-v3.ts` :
- Parcourt toutes les pages en DB
- Pour chaque page : ajoute `styleId` (depuis mapping), garde `templateId` pour rollback
- Migre les `sectionOrder` V2 → V3 (table de correspondance section 5.2)
- Modes : `--dry-run` (par défaut) puis `--apply`

### 9.4 Feature flag

`KONVERT_V3_RENDERER` (env var) :
- `false` (par défaut) → legacy renderer pour toutes pages
- `true` → nouveau renderer pour pages avec `styleId`, legacy pour les autres

Désactivation instantanée si régression détectée en production.

### 9.5 Suppression de la dette

Une fois la migration validée (1-2 sem en prod) :
- 42 fichiers `etec-*.ts` supprimés (~60KB de code mort en moins)
- 7 templates universels archivés en `legacy/` pour référence historique
- `src/lib/templates/index.ts` simplifié (passe de 280 lignes à ~50)
- Route `/templates` (marketing) refondue : vitrine des 10 styles V3 avec previews live

## 10. Plan d'exécution

| Sprint | Durée | Livrable | Owner |
|---|---|---|---|
| **S1 — Fondations** | 4j | Architecture `styles/` + `sections-v3/` · `ImagePool` · feature flag `KONVERT_V3_RENDERER` · POC 1 style + 1 section | ANNA |
| **S2 — OBITO maquettes 1/2** | 5j | 5 maquettes HTML/CSS validées : Soft, Editorial, Apple-Clean, Luxe Noir, Organic | OBITO + Syphax (validation) |
| **S3 — OBITO maquettes 2/2** | 5j | 5 maquettes HTML/CSS validées : Bold, Brutalist, Warm Neutral, Minimal Mono, Vibrant | OBITO + Syphax |
| **S4 — Sections V3 (1/2)** | 5j | 7 sections code production : hero · gallery · why_we_love · thoughtfully_designed · best_for · care_instructions · faq | ANNA (sur maquettes OBITO) |
| **S5 — Sections V3 (2/2)** | 5j | 6 sections code production : materials_breakdown · compare_variants · reviews_ai_summary · press_quote · brand_manifesto · how_it_works | ANNA |
| **S6 — Styles code + Wizard** | 5j | 10 styles code Tailwind/CSS · auto-pick logic · `<StylePreview>` · nouveau picker UX · modale ton · DataValidationStep | ANNA |
| **S7 — Dashboard images** | 4j | Upload/replace/crop UI dans étape Produit + Supabase Storage · drag-reorder galerie | ANNA + OBITO (UI) |
| **S8 — Migration + cleanup** | 3j | Script `migrate-pages-to-v3` · QA E2E · flag activé prod · vitrine `/templates` refondue · suppression 42 `etec-*` | ANNA + KONAN (QA) |

**Total : ~36 jours ouvrés, ~7 semaines.**

**Optimisation parallélisation** : S2/S3 (OBITO) peuvent partiellement chevaucher S4/S5 (ANNA) dès que 3 maquettes sont validées. Gain réaliste ~1 semaine → **~6 semaines total**.

## 11. Risques et mitigations

| Risque | Probabilité | Mitigation |
|---|---|---|
| Régression visuelle sur pages existantes | Moyenne | Feature flag + double renderer parallèle + tests Vitest comparant HTML output |
| Scraping insuffisant pour `materials_breakdown` | Haute | Section masquée si confidence basse. DataValidationStep permet à l'user de combler manuellement |
| Migration data casse pages prod | Faible | Dry-run obligatoire + backup Supabase + rollback via toggle flag |
| Périmètre qui explose | Moyenne | Discipline stricte V3 → V4 : tout ce qui n'est pas listé en sections 4-7 = V4 (notamment IA vision pour détection angle, génération images IA) |
| OBITO maquettes en retard sur ANNA | Moyenne | Parallélisation S2/S3 ↔ S4/S5 ; ANNA peut commencer par sections sans dépendance style (logique pure) |
| Qualité copy DeepSeek insuffisante pour sections premium | Faible (mitigation hors V3) | Reporté en V4 : routing multi-modèle (Sonnet pour hero/manifesto, DeepSeek pour bulk) |

## 12. Hors scope V3 (différé en V4)

Explicitement exclus de cette spec pour éviter le scope creep :

- **Génération d'images IA** (fal.ai Nano Banana Pro pour packshots / lifestyle synthétiques)
- **Routing multi-modèle copy** (Claude Sonnet pour sections premium)
- **Détection d'angle par vision AI** (alternative à l'heuristique filename)
- **Chat itératif** sur la page générée (mentionné dans ROADMAP_V2_EMERGENT)
- **Versioning pages façon GitHub**
- **Pipeline multi-agents** (scraper/strategist/copywriter/designer/QA séparés)

## 13. Métriques de succès

À mesurer post-launch V3 :

- **Qualité perçue** : % de pages où l'user n'édite pas la copy avant publication (target ≥ 60%)
- **Adoption auto-pick** : % de users qui acceptent le style auto sans ouvrir la modale (target ≥ 80%)
- **Confidence AI** : moyenne de confidence sur extraction matériaux (target ≥ 0.7)
- **Conversion landing pages générées** : taux de conversion moyen des pages V3 vs V2 sur la même cible (target +15%)
- **Tickets support liés à template incompatible** : doit tomber à zéro après migration

## 14. Décisions verrouillées

Décisions prises pendant le brainstorm 2026-05-25/26, non re-négociables sans nouveau brainstorm :

1. **Approche A** retenue (Style + Sections universelles, vs B Themes+Variants et C Mono-template)
2. **Référence visuelle** : DTC premium US (Allbirds, Mejuri, Glossier, Ridge)
3. **Stratégie images** : rotation sur images produit, jamais d'images hardcodées de template, pas d'IA image en V3
4. **Hybride extraction** : AI extrait + flag user via DataValidationStep
5. **UX picker** : résumé textuel par défaut + 2 boutons options (template manuelle, ton custom)
6. **Workflow OBITO maquette → ANNA code** : obligatoire pour les 10 styles
7. **Gestion images utilisateur** : à l'étape Produit (avant Style), pas après publication
8. **6 tons de copy** + mode Auto (default)
