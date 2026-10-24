> **Store Builder for Shopify — Sprint 7 (générateur IA page produit)**
> Auteur : MINATO · Date : 2026-07-27
> Statut : spec figée, prête pour implémentation ANNA. Aucun fichier de code modifié par ce doc.
> Sources lues : `konvert/src/lib/generation/generate.ts`, `konvert/src/lib/ai/deepseek-v3.ts` + `v3-schema.ts`,
> `konvert/src/lib/scraper/index.ts`, `konvert-dawn/templates/product.{dropshipping,beaute,tech}.json`,
> `konvert-dawn/sections/konvert-*.liquid` (schemas), `konvert-dawn/docs/verticals-copy.md`.

---

## 0. TL;DR

- **Modèle retenu : `deepseek-chat` via Vercel AI SDK `generateObject` + Zod** (même pattern que `deepseek-v3.ts`/`v3-schema.ts`, PAS le fetch brut de `generate.ts`). Prompt caching natif DeepSeek conservé. Coût estimé **~0.0016-0.0021 $/génération** vs **~0.022-0.029 $/génération** pour Sonnet 4.6 (≈13-14x). Justification complète en §6.
- **Guardrail R5 principal : exclusion de schéma, pas seulement instruction.** Les champs interdits (avis, chiffres de preuve sociale, code promo, nom du fondateur) ne sont **jamais envoyés au LLM ni jamais lus depuis sa sortie** — ils sont hardcodés côté ANNA. Ce que le LLM ne peut pas demander, il ne peut pas halluciner.
- **Scope strictement limité** à 8 sections : hero (H1/sous-titre), description, FAQ, garanties, comparison table, urgency bar, founder story, exit-intent. `konvert-testimonials-carousel`, `konvert-social-proof`, `konvert-sticky-atc-mobile` sont **hors scope Sprint 7** — jamais touchées par ce générateur, elles gardent les defaults `.liquid` (déjà conformes R5, cf. `verticals-copy.md`).
- **Escalade prévue** : si le golden set montre un taux de dérive factuelle > 5% sur DeepSeek, basculer le modèle par défaut sur `claude-sonnet-4-6` (tool use forcé) pour ce générateur précis uniquement — décision chiffrée, pas d'opinion (cf. §6.4).

---

## 1. Contexte technique — ce qui existe déjà et ce qu'on réutilise

| Composant existant | Rôle | Réutilisation Sprint 7 |
|---|---|---|
| `konvert/src/lib/scraper/index.ts` → `scrapeProduct()` | Cascade Firecrawl → ScrapingBee → Bright Data → fetch, retourne `ScrapedProduct` | **Entrée directe** du générateur — aucune modification scraper nécessaire |
| `konvert/src/types/index.ts` → `ScrapedProduct` | `{ title, description, images[], price, original_price, variants[], rating, reviews_count, source_url, partial?, scrape_warning? }` | Champs mappés dans le prompt utilisateur (§4) |
| `konvert/src/lib/generation/product-name.ts` | Mini-LLM qui nettoie le titre + déduit `category`/`product_type` | Réutilisé pour dériver le champ `vertical` (dropshipping/beaute/tech) en entrée — cf. §3.2 |
| `konvert/src/lib/ai/deepseek-v3.ts` + `v3-schema.ts` | Pattern `generateObject` + Zod + `maxRetries: 2` + timeout 50s | **Pattern d'implémentation retenu** pour ce générateur (voir §6.1) — PAS le fetch brut + `JSON.parse` de `generate.ts` |
| `konvert/src/lib/generation/generate.ts` (sanitizer, whitelist presse) | Montre le pattern de defense-in-depth déjà en place chez Konvert (whitelist post-LLM, gate reviews_count < 5000 → `press_logos = []`) | **Précédent direct** : l'incident du 2026-06-06 (58.5% hallucination `press_logos`, cf. mémoire `project_konvert_prompt_v2_rollback.md`) montre que la robustesse vient du **code**, pas du prompt seul. Ce générateur applique la même doctrine dès la conception (exclusion de schéma plutôt que rollback après coup). |
| `konvert-dawn/templates/product.{dropshipping,beaute,tech}.json` | 3 templates cibles, structure identique des sections `konvert-*`, seule la copy change de ton | Le générateur produit **un seul objet de sortie**, injecté dans le template correspondant au `vertical` détecté |
| `konvert-dawn/docs/verticals-copy.md` (ZARA) | Copy de référence FR par vertical + tableau récap R5 | **Source de vérité pour le ton et les valeurs par défaut** — le few-shot du prompt système reprend ce registre |

---

## 2. Ce que le générateur produit — scope exact (rappel)

8 objets de sortie, mappés sur 6 sections de thème + 2 champs produit Shopify Admin :

1. `hero` → `product.title` (Admin) + metafield `descriptors.subtitle`
2. `description_html` → `product.body_html` (Admin)
3. `faq` → section `konvert-faq-rich`, blocks `question`
4. `guarantees` → section `konvert-guarantees`, blocks `guarantee`
5. `comparison_table` → section `konvert-comparison-table`, settings + blocks `comparison_row`
6. `urgency_bar` → section `konvert-urgency-bar`, settings
7. `founder_story` → section `konvert-founder-story`, settings (hors `founder_name`)
8. `exit_intent` → section `konvert-exit-intent`, settings (hors `promo_code`, `cta_link`)

**Explicitement hors scope** (jamais dans le schéma d'entrée ni de sortie du LLM) :
- `konvert-testimonials-carousel` (tous settings/blocks)
- `konvert-social-proof` (tous settings)
- `konvert-sticky-atc-mobile` (tous settings)
- Tous les settings de couleur / `color_scheme` / layout (colonnes, scroll mobile...) de toutes les sections — hérités du preset thème par vertical, jamais générés par IA
- `founder_name`, `promo_code`, `cta_link` (cf. §5.3)

---

## 3. Prompt système — structure de caching

### 3.1 Principe de séparation cache/dynamique

```
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM PROMPT — 100% statique pour un (vertical, langue)     │
│ donné → CACHE_BREAKPOINT ici (DeepSeek : cache auto ;         │
│ Claude si escalade : cache_control: { type: 'ephemeral' })    │
│  - Rôle + frameworks (PAS/AIDA)                               │
│  - Guardrails R5 complets                                     │
│  - Enums autorisés (icônes, valeurs comparaison, labels       │
│    concurrent génériques par vertical)                        │
│  - Few-shot ton par vertical (repris de verticals-copy.md)    │
├─────────────────────────────────────────────────────────────┤
│ USER PROMPT — 100% dynamique, jamais caché                    │
│  - Données produit scrapées (title, description, price...)    │
│  - merchant_facts optionnels (délais/garantie réels si        │
│    déjà saisis par le marchand — jamais inventés si absents)  │
│  - vertical + langue (sélecteurs qui choisissent QUEL          │
│    system prompt statique a été envoyé, donc pas dans le       │
│    breakpoint caché lui-même — un system prompt par vertical) │
└─────────────────────────────────────────────────────────────┘
```

Règle dure (rappel fiche MINATO) : **aucune donnée user-specific dans le system prompt**. Le `vertical` sélectionne QUEL system prompt statique parmi 3 (dropshipping/beaute/tech) est envoyé — ce n'est pas une variable interpolée dans un template unique, donc chaque variante reste 100% statique et cacheable indépendamment (3 entrées de cache, pas 1 cache pollué par de la donnée produit).

### 3.2 Sélection du `vertical` (entrée, pas génération)

Le champ `vertical` (`'dropshipping' | 'beaute' | 'tech'`) n'est **pas** produit par ce générateur — il est déterminé **avant** l'appel, soit :
- fourni explicitement par le marchand au moment de l'import (sélecteur dans le wizard, recommandé — zéro coût, zéro ambiguïté) ;
- à défaut, dérivé du `category`/`product_type` déjà calculés par `cleanProductName()` (`product-name.ts`) via une petite table de correspondance codée en dur côté ANNA (ex. `category` contenant "soin"/"beauté"/"cosmétique" → `beaute` ; "audio"/"connecté"/"électronique" → `tech` ; sinon `dropshipping` par défaut).

Ne pas demander au générateur principal de deviner le vertical lui-même dans le même appel : ça mélangerait une tâche de classification (déterministe, peu coûteuse) avec une tâche de génération créative (coûteuse), et une erreur de classification changerait tout le système prompt utilisé — donc pas de caching possible dessus. Classification en amont, séparée.

### 3.3 Prompt système complet (variante `dropshipping`, FR) — prêt à coller

```
Tu es un rédacteur e-commerce senior spécialisé en pages produit Shopify haute conversion, marché francophone, vertical dropshipping/produits "wow".

CADRE DE TRAVAIL
Tu reçois les données brutes d'un produit scrapé (titre, description, prix, variantes, note, nombre d'avis) et tu rédiges le contenu textuel de 8 blocs précis d'une page produit Shopify. Tu ne rédiges RIEN d'autre. Tu ne génères jamais d'avis clients, de chiffres de preuve sociale, de code promo, ou de nom de fondateur — ces champs ne font PAS partie du schéma de sortie que tu dois remplir : n'essaie pas de les deviner ni de les ajouter.

FRAMEWORKS
- description_html suit PAS (Problème → Agitation → Solution → Preuve → clôture qui donne envie de cliquer), balisé en paragraphes <p>.
- Titres/accroches : image mentale forte orientée bénéfice, jamais une simple liste de caractéristiques.

═══════════════════════════════════════════════════════════
GUARDRAILS NON NÉGOCIABLES (art. L122-1 Code de la consommation
— publicité trompeuse, avis fictifs, fausses économies)
═══════════════════════════════════════════════════════════

RÈGLE 1 — INTERDICTION ABSOLUE d'inventer :
- un avis client, une note, une date d'avis, un nombre d'avis
- un chiffre de vente, un nombre de clients, un "X personnes regardent ce produit"
- un code promo ou une réduction chiffrée qui ne t'a pas été fournie explicitement
- un nom de marque concurrente réelle (utilise uniquement les libellés génériques fournis dans l'énumération `them_column_label`)
- une certification, norme technique ou label (IP67, Bluetooth 5.x, ISO xxxx, dermatologiquement testé, CE...) qui n'apparaît PAS littéralement dans les données produit fournies ci-dessous
- une allégation de santé, de résultat garanti, ou de performance non vérifiable ("élimine", "guérit", "garanti à 100%")

RÈGLE 2 — Fait incertain = placeholder, jamais une valeur plausible :
Chaque fois qu'un fait précis et vérifiable est nécessaire (délai de livraison, durée de garantie, délai de réponse SAV, politique de retour, moyens de paiement acceptés, composition/matière si non fournie) et que ce fait n'est PAS présent dans les données produit fournies ni dans les `merchant_facts` fournis :
→ tu écris un gabarit à trous entre crochets, au même registre que ces exemples :
  "[délai de traitement réel]", "[délai réel, ex. 5 à 10 jours ouvrés]", "[décrivez votre politique de retour réelle]", "[durée réelle, ex. 2 ans]"
→ Tu n'inventes JAMAIS un chiffre "plausible" à la place. Un chiffre faux dans une garantie ou un délai engage la responsabilité légale du marchand qui publie — mieux vaut un placeholder visible qu'une fausse promesse.

RÈGLE 3 — Ce qui vient des données produit peut être cité tel quel :
Si un fait technique apparaît littéralement dans la description produit fournie (ex. la description scrapée dit "autonomie 20h", "garantie 2 ans", "100% coton bio"), tu peux le reprendre et le reformuler fidèlement. Tu ne peux PAS l'extrapoler ni le généraliser au-delà de ce qui est écrit.

RÈGLE 4 — comparison_table :
- `them_column_label` : choisis UNIQUEMENT une valeur dans l'énumération fournie (jamais un nom de marque réelle, jamais une valeur hors liste).
- Pour chaque ligne : si le critère est factuel et incertain (délai, garantie, prix), mets `us_value: "custom"` et `us_text` en gabarit à trous (règle 2). Ne mets `us_value: "yes"` que pour des engagements structurels non chiffrés et non risqués (ex. "Paiement sécurisé", "Suivi de commande" — vrai pour toute boutique Shopify Payments standard).
- Ne mets jamais `them_value: "no"` de façon dénigrante sans que ce soit un fait générique vérifiable (ex. "délai variable" est acceptable, "produit de mauvaise qualité" ne l'est pas).

RÈGLE 5 — founder_story :
C'est un GABARIT, pas une histoire attribuée à une personne réelle. N'invente ni prénom, ni nom, ni anecdote biographique précise (date, lieu, chiffre). Écris à la 1ère personne du pluriel ("on a commencé quand...") avec des gabarits à trous pour le déclic précis, cohérents avec le produit fourni.

RÈGLE 6 — urgency_bar :
`message_with_stock` DOIT contenir le token littéral `[count]` (remplacé par Liquid côté Shopify avec le stock réel — ne l'invente jamais en dur). N'ajoute aucun chiffre de stock toi-même.

EN CAS DE DOUTE SUR UNE RÈGLE 1-6 : tu choisis TOUJOURS l'option la plus prudente (placeholder, formulation générique, omission) plutôt que l'option la plus vendeuse. Une page produit avec des gabarits visibles est normale et attendue à ce stade — le marchand les complète avant publication.
═══════════════════════════════════════════════════════════

ÉNUMÉRATIONS AUTORISÉES (respecte-les strictement, aucune autre valeur)
- icon (guarantees) : none | truck | return | lock | chat_bubble | check_mark | stopwatch | box | leaf | recycle | price_tag | plane
- us_value / them_value (comparison_table.rows) : yes | no | custom
- them_column_label (comparison_table) : "Boutique classique" | "Site concurrent générique" | "Boutique standard"

TON — VERTICAL DROPSHIPPING (produit "wow"/gadget)
Punchy, direct, bénéfice-first, urgence réelle, rythme mobile, phrases courtes, vouvoiement standard e-commerce FR.
Exemples de registre (à ne PAS copier, juste calibrer le ton) :
- ÉVITER : "Découvrez notre produit innovant aux multiples fonctionnalités"
- PRIVILÉGIER : "Cette galère, vous ne la revivrez plus"
- Garantie ÉVITER : "Garantie satisfait à 100%" — PRIVILÉGIER : "Un souci ? Vous avez [délai réel, ex. 14 jours] pour nous contacter."

Tu réponds STRICTEMENT en respectant le schéma d'outil fourni (`fill_product_template`). Tu n'ajoutes aucun champ, aucun commentaire, aucun texte hors du schéma. Tout le texte est en français.
```

> Les variantes `beaute` et `tech` reprennent la structure ci-dessus à l'identique **sauf** : le bloc "TON — VERTICAL" (repris des tons déjà écrits par ZARA dans `verticals-copy.md` — beauté = premium/rassurant/sensoriel avec rappel réglementaire cosmétique UE 1223/2009 ; tech = clair/précis/orienté preuve) et l'énumération `them_column_label` (beauté : "Alternative générique" / "Marque générique" / "Cosmétique standard" ; tech : "Marque générique" / "Accessoire premier prix" / "Marque standard"). Le reste (règles 1-6, énumérations icon/us_value/them_value) est identique — factoriser en une fonction `buildSystemPrompt(vertical: Vertical)` qui ne varie que sur ces deux blocs, comme le fait déjà `TONE_INSTRUCTIONS` dans `generate.ts`.

---

## 4. Prompt utilisateur (dynamique — jamais caché)

```
Remplis le schéma `fill_product_template` pour ce produit.

DONNÉES PRODUIT SCRAPÉES (source : ${source_url}, plateforme : ${platform}) :
- Titre brut : ${title}
- Description brute : ${description}
- Prix : ${price ? price + '€' : 'non renseigné'}
- Prix barré : ${original_price ? original_price + '€' : 'non renseigné'}
- Variantes : ${variants.map(v => `${v.name}: ${v.values.join(', ')}`).join(' | ') || 'aucune'}
- Note / avis (donnée interne, NE PAS reformuler en preuve sociale visible — sert uniquement à calibrer si le produit a du recul marché) : ${rating ?? 'inconnue'} / ${reviews_count ?? 'inconnu'}

DONNÉES MARCHAND CONNUES (optionnel — si un champ est fourni ici, tu DOIS l'utiliser tel quel à la place d'un placeholder ; si absent, applique la RÈGLE 2 du system prompt) :
- Délai de traitement réel : ${merchant_facts?.processing_delay ?? 'non fourni'}
- Délai de livraison réel : ${merchant_facts?.shipping_delay ?? 'non fourni'}
- Politique de retour réelle : ${merchant_facts?.return_policy ?? 'non fourni'}
- Durée de garantie réelle : ${merchant_facts?.warranty_duration ?? 'non fourni'}
- Délai de réponse SAV réel : ${merchant_facts?.support_response_time ?? 'non fourni'}
- Moyens de paiement réellement actifs : ${merchant_facts?.payment_methods?.join(', ') ?? 'non fourni'}
- Nom de la marque : ${merchant_facts?.brand_name ?? 'non fourni — utilise une formulation neutre ("votre marque", "notre boutique")'}

Vertical : ${vertical} (détermine le ton, déjà reflété dans tes instructions système).
Langue de sortie : français.
```

**Note importante** : le bloc "Note / avis" est transmis au LLM à titre de **contexte de calibration interne** (ex. décider si le produit a assez de recul pour un ton plus confiant) — le prompt précise explicitement qu'il ne doit **jamais** être reformulé en preuve sociale visible, car ce champ n'appartient à aucune section du scope (cf. §2, `konvert-social-proof` est hors scope). C'est une défense supplémentaire contre la fuite de la note/nombre d'avis vers `description_html` ou `faq`.

---

## 5. JSON Schema strict de la sortie

### 5.1 Zod (implémentation ANNA — fichier suggéré `konvert/src/lib/store-builder/schema.ts`)

```ts
import { z } from 'zod'

// ── Énumérations par vertical — injectées dans le schéma au moment de l'appel ──
export const GENERIC_COMPETITOR_LABELS: Record<'dropshipping' | 'beaute' | 'tech', [string, ...string[]]> = {
  dropshipping: ['Boutique classique', 'Site concurrent générique', 'Boutique standard'],
  beaute:       ['Alternative générique', 'Marque générique', 'Cosmétique standard'],
  tech:         ['Marque générique', 'Accessoire premier prix', 'Marque standard'],
}

const guaranteeIconEnum = z.enum([
  'none', 'truck', 'return', 'lock', 'chat_bubble', 'check_mark',
  'stopwatch', 'box', 'leaf', 'recycle', 'price_tag', 'plane',
])

const comparisonValueEnum = z.enum(['yes', 'no', 'custom'])

const comparisonRowSchema = z.object({
  label: z.string().min(3).max(40),
  us_value: comparisonValueEnum,
  us_text: z.string().max(90).optional(),
  them_value: comparisonValueEnum,
  them_text: z.string().max(90).optional(),
}).strict().superRefine((row, ctx) => {
  if (row.us_value === 'custom' && !row.us_text) {
    ctx.addIssue({ code: 'custom', message: 'us_text requis si us_value = custom', path: ['us_text'] })
  }
  if (row.them_value === 'custom' && !row.them_text) {
    ctx.addIssue({ code: 'custom', message: 'them_text requis si them_value = custom', path: ['them_text'] })
  }
})

export function buildStoreBuilderOutputSchema(vertical: 'dropshipping' | 'beaute' | 'tech') {
  const themColumnLabelEnum = z.enum(GENERIC_COMPETITOR_LABELS[vertical])

  return z.object({
    hero: z.object({
      h1_title: z.string().min(10).max(90),
      subtitle: z.string().min(10).max(140),
    }).strict(),

    description_html: z.string().min(200).max(2200),

    faq: z.array(z.object({
      question: z.string().min(5).max(120),
      answer_html: z.string().min(20).max(400),
    }).strict()).min(4).max(6),

    guarantees: z.array(z.object({
      icon: guaranteeIconEnum,
      title: z.string().min(3).max(40),
      text_html: z.string().min(20).max(220),
    }).strict()).min(3).max(4),

    comparison_table: z.object({
      heading: z.string().min(5).max(70),
      subheading: z.string().max(90).optional(),
      criteria_column_label: z.string().max(30).default('Critère'),
      us_column_label: z.string().min(2).max(40),
      them_column_label: themColumnLabelEnum,
      rows: z.array(comparisonRowSchema).min(4).max(5),
    }).strict(),

    urgency_bar: z.object({
      message_default: z.string().min(10).max(90),
      message_with_stock: z.string().min(10).max(90)
        .refine(s => s.includes('[count]'), 'message_with_stock doit contenir le token littéral [count]'),
    }).strict(),

    founder_story: z.object({
      heading: z.string().min(5).max(60),
      story_html: z.string().min(80).max(700)
        .refine(s => /\[[^\]]+\]/.test(s), 'story_html doit contenir au moins un gabarit [entre crochets]'),
      founder_role: z.string().min(3).max(30),
    }).strict(),

    exit_intent: z.object({
      heading: z.string().min(5).max(40),
      text_html: z.string().min(20).max(220),
      cta_label: z.string().min(3).max(30),
    }).strict(),
  }).strict()
}

export type StoreBuilderOutput = z.infer<ReturnType<typeof buildStoreBuilderOutputSchema>>
```

**Champs structurellement absents du schéma** (donc jamais générés, jamais lus) :
`founder_story.founder_name`, `exit_intent.promo_code`, `exit_intent.cta_link`, tout ce qui concerne `konvert-testimonials-carousel`, `konvert-social-proof`, `konvert-sticky-atc-mobile`, toutes les couleurs/`color_scheme`.

### 5.2 JSON Schema (Anthropic tool `input_schema` — si escalade Claude, cf. §6.4)

```json
{
  "name": "fill_product_template",
  "description": "Remplit le contenu textuel des 8 blocs de la page produit Konvert Store Builder, à l'exclusion stricte de tout avis client, chiffre de preuve sociale, code promo ou nom de fondateur.",
  "input_schema": {
    "type": "object",
    "additionalProperties": false,
    "required": ["hero", "description_html", "faq", "guarantees", "comparison_table", "urgency_bar", "founder_story", "exit_intent"],
    "properties": {
      "hero": {
        "type": "object",
        "additionalProperties": false,
        "required": ["h1_title", "subtitle"],
        "properties": {
          "h1_title": { "type": "string", "minLength": 10, "maxLength": 90 },
          "subtitle": { "type": "string", "minLength": 10, "maxLength": 140 }
        }
      },
      "description_html": { "type": "string", "minLength": 200, "maxLength": 2200 },
      "faq": {
        "type": "array", "minItems": 4, "maxItems": 6,
        "items": {
          "type": "object", "additionalProperties": false,
          "required": ["question", "answer_html"],
          "properties": {
            "question": { "type": "string", "minLength": 5, "maxLength": 120 },
            "answer_html": { "type": "string", "minLength": 20, "maxLength": 400 }
          }
        }
      },
      "guarantees": {
        "type": "array", "minItems": 3, "maxItems": 4,
        "items": {
          "type": "object", "additionalProperties": false,
          "required": ["icon", "title", "text_html"],
          "properties": {
            "icon": { "type": "string", "enum": ["none","truck","return","lock","chat_bubble","check_mark","stopwatch","box","leaf","recycle","price_tag","plane"] },
            "title": { "type": "string", "minLength": 3, "maxLength": 40 },
            "text_html": { "type": "string", "minLength": 20, "maxLength": 220 }
          }
        }
      },
      "comparison_table": {
        "type": "object", "additionalProperties": false,
        "required": ["heading", "criteria_column_label", "us_column_label", "them_column_label", "rows"],
        "properties": {
          "heading": { "type": "string", "minLength": 5, "maxLength": 70 },
          "subheading": { "type": "string", "maxLength": 90 },
          "criteria_column_label": { "type": "string", "maxLength": 30 },
          "us_column_label": { "type": "string", "minLength": 2, "maxLength": 40 },
          "them_column_label": { "type": "string", "enum": ["__INJECTÉ_PAR_VERTICAL__"] },
          "rows": {
            "type": "array", "minItems": 4, "maxItems": 5,
            "items": {
              "type": "object", "additionalProperties": false,
              "required": ["label", "us_value", "them_value"],
              "properties": {
                "label": { "type": "string", "minLength": 3, "maxLength": 40 },
                "us_value": { "type": "string", "enum": ["yes","no","custom"] },
                "us_text": { "type": "string", "maxLength": 90 },
                "them_value": { "type": "string", "enum": ["yes","no","custom"] },
                "them_text": { "type": "string", "maxLength": 90 }
              }
            }
          }
        }
      },
      "urgency_bar": {
        "type": "object", "additionalProperties": false,
        "required": ["message_default", "message_with_stock"],
        "properties": {
          "message_default": { "type": "string", "minLength": 10, "maxLength": 90 },
          "message_with_stock": { "type": "string", "minLength": 10, "maxLength": 90 }
        }
      },
      "founder_story": {
        "type": "object", "additionalProperties": false,
        "required": ["heading", "story_html", "founder_role"],
        "properties": {
          "heading": { "type": "string", "minLength": 5, "maxLength": 60 },
          "story_html": { "type": "string", "minLength": 80, "maxLength": 700 },
          "founder_role": { "type": "string", "minLength": 3, "maxLength": 30 }
        }
      },
      "exit_intent": {
        "type": "object", "additionalProperties": false,
        "required": ["heading", "text_html", "cta_label"],
        "properties": {
          "heading": { "type": "string", "minLength": 5, "maxLength": 40 },
          "text_html": { "type": "string", "minLength": 20, "maxLength": 220 },
          "cta_label": { "type": "string", "minLength": 3, "maxLength": 30 }
        }
      }
    }
  }
}
```

`them_column_label.enum` doit être remplacé programmatiquement par `GENERIC_COMPETITOR_LABELS[vertical]` avant l'appel (même valeur que côté Zod, §5.1) — ne jamais laisser un enum générique large type `string`, ça réintroduirait la surface d'hallucination qu'on cherche à éliminer.

### 5.3 Champs forcés-vides / interdits — récapitulatif exécutable

| Champ | Statut | Qui le fixe | Valeur forcée |
|---|---|---|---|
| `founder_story.founder_name` | **Absent du schéma LLM** | ANNA, côté endpoint, après réception de la sortie validée | `""` (le marchand renseigne dans l'éditeur de thème) |
| `exit_intent.promo_code` | **Absent du schéma LLM** | ANNA | `""` |
| `exit_intent.cta_link` | **Absent du schéma LLM** | ANNA | `""` |
| `konvert-testimonials-carousel.*` | **Jamais dans le flux** | Template `.liquid` (défauts déjà R5-safe) | inchangé |
| `konvert-social-proof.*` | **Jamais dans le flux** | Template `.liquid` | inchangé |
| `konvert-sticky-atc-mobile.*` | **Jamais dans le flux** | Template `.liquid` | inchangé |
| `comparison_table.them_column_label` | Contraint à un enum de 3 valeurs génériques par vertical | Zod + JSON Schema | jamais de nom de marque réelle |
| `guarantees[].icon` | Contraint à l'enum du `.liquid` | Zod + JSON Schema | jamais de valeur hors liste |

---

## 6. Choix du modèle — DeepSeek vs Claude, justifié

### 6.1 Recommandation : `deepseek-chat` via Vercel AI SDK `generateObject` + Zod

**Pas** le pattern `fetch` brut + `response_format: json_object` + `JSON.parse` de `generate.ts` (celui-ci est l'ancien pattern, déjà remplacé côté Konvert par `deepseek-v3.ts`/`v3-schema.ts` pour de bonnes raisons : validation Zod runtime + retry automatique du SDK). Ce générateur Store Builder doit repartir du pattern le plus récent, pas de l'historique.

```ts
import { generateObject, NoObjectGeneratedError } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { buildStoreBuilderOutputSchema } from './schema'
import { buildSystemPrompt, buildUserPrompt } from './prompts'

export async function generateStoreBuilderContent(
  product: ScrapedProduct,
  vertical: 'dropshipping' | 'beaute' | 'tech',
  merchantFacts?: MerchantFacts,
) {
  const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY })
  const schema = buildStoreBuilderOutputSchema(vertical)

  try {
    const { object, usage } = await generateObject({
      model: deepseek('deepseek-chat'),
      schema,
      system: buildSystemPrompt(vertical),       // 100% statique par vertical → cache DeepSeek auto
      prompt: buildUserPrompt(product, vertical, merchantFacts), // dynamique, jamais caché
      maxRetries: 2,
      abortSignal: AbortSignal.timeout(50_000),
    })
    logUsageForCostTracking({ model: 'deepseek-chat', vertical, usage }) // → Supabase/Notion, cf. §8
    return object
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
      // Fallback : template par défaut 100% gabarit (déjà écrit dans product.<vertical>.json)
      // + log Sentry. Ne jamais crasher le flux d'import produit.
      logToSentry('store-builder-generation-failed', { vertical, cause: err.cause })
      return DEFAULT_TEMPLATE_CONTENT[vertical]
    }
    throw err
  }
}
```

**Pourquoi DeepSeek reste le bon choix ici (et pas seulement "par cohérence avec le reste de Konvert")** :

1. **Le schéma strict fait le travail que Claude "tool use" ferait nativement.** DeepSeek-chat est compatible function-calling (API OpenAI-compatible) : `generateObject` du Vercel AI SDK exploite cette capacité pour forcer un appel d'outil synthétique conforme au schéma — ce n'est pas un simple "JSON mode" en best-effort. La validation Zod côté client + `maxRetries: 2` donne le même niveau de garantie structurelle que le tool use natif Anthropic, indépendamment du fournisseur. L'argument "Claude est plus sûr parce que tool use natif" ne tient donc pas ici — la sûreté vient du **design du schéma** (§5), pas du fournisseur.
2. **Les guardrails R5 les plus critiques sont déjà hors de portée du LLM par construction** (§5.3) — ce n'est pas une instruction que DeepSeek doit "bien suivre", c'est un champ qui n'existe pas dans son espace de sortie. Le risque résiduel (comparison_table, description factuelle, founder_story) est couvert par contraintes de schéma (enums, refine, longueur) + sanitizer déterministe (§8.3), pas par la qualité intrinsèque du modèle.
3. **Coût** (calcul détaillé §6.2) : ~13-14x moins cher que Sonnet 4.6 sur ce cas précis (moins spectaculaire que le "~50x" du cas Konvert landing pages parce que ce générateur est plus output-heavy en proportion, mais toujours massif).
4. **Cohérence infra** : même provider, même clé API, même pattern de code que `deepseek-v3.ts` — zéro nouvelle intégration, zéro nouveau point de défaillance vendor pour ANNA.
5. **Latence** : schéma nettement plus petit que le générateur landing page existant (8 blocs contraints vs ~25 champs + tableaux longs). Le comportement DeepSeek connu ("~3x plus lent que Haiku, ~18-22s" sur le schema landing complet) devrait rester **sous ce plafond** ici (moins de tokens de sortie) — cible p95 < 20s, à confirmer sur golden set (§7).

### 6.2 Calcul de coût (estimation, à recaler avec Anthropic Console / DeepSeek dashboard réel après premiers runs)

Hypothèses de tokens (schéma §5, prompt §3-4) :
- Prefix cacheable (system + définition schéma) : ~2 000 tokens
- User prompt dynamique (données produit + merchant_facts) : ~500 tokens
- Sortie : ~1 300 tokens (8 blocs, FAQ 4-6, guarantees 3-4, comparison 4-5 lignes)

| Modèle | Prix input/output ($/1M tok) | 1er appel (cache write) | Appel suivant (cache read, TTL) |
|---|---|---|---|
| **DeepSeek-chat** (retenu) | $0.27 / $1.10 (chiffre exact du code `generate.ts`) | ≈ $0.0021 | ≈ $0.0016 (cache DeepSeek auto ~80% réduction sur le prefix) |
| Claude Haiku 4.5 | $1 / $5 | ≈ $0.0088 | ≈ $0.0073 |
| Claude Sonnet 4.6 | $3 / $15 | ≈ $0.0285 (cache write +25%) | ≈ $0.0216 (cache read -90%) |

→ **DeepSeek ≈ 13-14x moins cher que Sonnet**, ≈ 4-5x moins cher que Haiku, sur ce générateur précis. À 1 000 générations/mois : ~$1.6-2.1 (DeepSeek) vs ~$22-29 (Sonnet). Écart qui reste négligeable en absolu à ce volume mais qui compte à l'échelle (10k+ imports/mois post-beta).

### 6.3 Ce qui NE justifierait PAS Claude ici
- **Pas de vision** (pas d'image en entrée).
- **Pas de reasoning multi-étapes complexe** — c'est de la rédaction contrainte par schéma, zero-shot avec guardrails explicites suffit (cf. règle anti-cargo-cult MINATO : pas de CoT ici, la tâche n'a rien d'un raisonnement séquentiel qui bénéficierait d'un "réfléchis étape par étape").
- **Pas de tool use agentique** (pas de boucle d'appels d'outils, un seul appel structuré).
- **Pas de contexte long** (scrape produit ≈ 500-1000 tokens, très loin de 200k).

### 6.4 Condition d'escalade vers Claude Sonnet 4.6 (règle chiffrée, pas d'opinion)

Basculer le modèle par défaut de ce générateur sur `claude-sonnet-4-6` (tool use forcé, `tool_choice: { type: 'tool', name: 'fill_product_template' }`, cache_control ephemeral sur system+tools) **si et seulement si**, sur le golden set (§7) :
- taux de violation R5 détectée (regex + review humaine, cf. §7.3) sur DeepSeek **> 5%**, OU
- score LLM-as-judge qualité rédactionnelle DeepSeek **< 6/10** en moyenne sur ≥ 30 cas, avec p < 0.05 vs Sonnet sur le même échantillon.

Si escalade : coût ×13-14, à documenter et faire valider (règle dure #5 de la fiche : "coût ≤ v1×1.1 sinon justifier ROI qualité" — ici le ROI invoqué serait le risque légal L122-1, décision à faire remonter à OROCHIMARU/MADARA avant ship, pas une décision MINATO seul).

---

## 7. Stratégie d'éval

### 7.1 Golden set minimal (5 URLs, 3 verticals)

| # | Vertical | Type produit | Pourquoi ce cas | Risque ciblé |
|---|---|---|---|---|
| 1 | dropshipping | Gadget "wow" AliExpress générique, peu de specs dans la description | Cas le plus fréquent en volume, description scrapée pauvre → forte tentation d'halluciner pour combler | Placeholders vs invention |
| 2 | dropshipping | Produit avec vraie note/nombre d'avis élevé (>5000) dans le scrape | Vérifie que `rating`/`reviews_count` ne fuient jamais vers `description_html`/`faq` malgré leur présence en contexte | Fuite preuve sociale hors scope |
| 3 | beaute | Sérum/soin avec liste INCI partielle dans la description | Zone réglementaire sensible (allégations cosmétiques UE 1223/2009) | Allégation de résultat non vérifiable |
| 4 | tech | Accessoire avec specs techniques précises dans la description (autonomie, norme) | Vérifie la RÈGLE 3 (reprise fidèle du fourni) sans extrapolation (ex. ne pas passer de "Bluetooth" mentionné à "Bluetooth 5.3" inventé) | Extrapolation de spec technique |
| 5 | tech ou beaute | `merchant_facts` complet fourni (délais, garantie, SAV réels) | Vérifie que le générateur utilise les vraies données fournies au lieu de placeholders quand elles existent (RÈGLE 2, cas positif) | Sous-utilisation des données réelles disponibles |

Format fichier (versionné Git, même convention que le reste de la fiche MINATO) : `konvert/eval/golden-set/store-builder-product-template.json`, structure `{ input: { product: ScrapedProduct, vertical, merchant_facts? }, notes_annotateur: string }`. **Pas de sortie "attendue" figée** (c'est génératif, pas extractif) — l'éval porte sur les critères automatiques ci-dessous, pas sur un exact-match.

### 7.2 Critères de validation automatique (bloquants — reject + retry si échec)

1. **Schema Zod valide** (`buildStoreBuilderOutputSchema(vertical).safeParse`) — 0 tolérance, sinon retry SDK (déjà géré par `maxRetries: 2`), puis fallback template par défaut.
2. **Aucun champ R5 présent hors schéma** — impossible par construction (§5.3), donc ce check porte plutôt sur la **non-régression** : un test unitaire qui échoue si quelqu'un ajoute un jour `founder_name`/`promo_code` au schéma sans revue MADARA/OROCHIMARU.
3. **`message_with_stock` contient `[count]` littéral** — refine Zod déjà présent, mais ajouter un test golden set explicite (cas limite : le modèle pourrait écrire `[Count]` ou `(count)` — normaliser/vérifier strictement `includes('[count]')`).
4. **`story_html` contient au moins un gabarit `[...]`** — refine Zod déjà présent (garde-fou contre une histoire "trop précise" sans aucun trou à compléter, signe probable d'invention).
5. **`them_column_label` ∈ enum du vertical** — impossible par construction (enum Zod), test de non-régression uniquement.
6. **Latence p95 < 20s** sur le golden set (cible du plan Store Builder) — mesurer `Date.now()` avant/après l'appel `generateObject`, logguer, agréger p50/p95.

### 7.3 Détection d'hallucination — règles + LLM-as-judge (non-bloquant, flag pour revue humaine)

**Détection par règles (rapide, gratuite, à lancer sur chaque génération avant publication)** — scanner `description_html`, `faq[].answer_html`, `guarantees[].text_html`, `comparison_table.rows[].{us_text,them_text}`, `founder_story.story_html`, `exit_intent.text_html` :

| Pattern regex (FR) | Ce qu'il détecte | Action |
|---|---|---|
| `/\d[\d\s]*(clients?|commandes?|avis|ventes?|acheteurs?)\b/i` | Chiffre de preuve sociale hors scope | Flag critique — ne devrait jamais matcher, cf. §7.2.2 |
| `/\d(\.\d)?\s*\/\s*5\b/` ou `/\d+\s*%\s*(satisfait|efficace|résultat)/i` | Note ou taux d'efficacité inventé | Flag critique |
| `/\bIP\d{2}\b/, /Bluetooth\s?\d/, /ISO\s?\d+/, /CE\b/` non présent dans `description brute` du produit source | Norme/certification non sourcée | Flag critique — comparer avec la description scrapée d'origine, pas juste "présence" |
| `/code\s*promo|-\d+\s*%|réduction\s*de\s*\d+/i` dans `exit_intent.text_html` | Promo chiffrée non fournie | Flag critique |
| Liste de marques connues (Shein, Temu, Amazon, Sephora, Apple, Samsung, Anker, JBL, Nyx, L'Oréal...) dans `comparison_table.rows[].them_text` ou `them_column_label` | Nom de concurrent réel | Flag critique (`them_column_label` protégé par enum, donc ne devrait matcher que dans `them_text` libre) |
| Chiffre nu (`/\d+\s*(jours?|ans?|mois|heures?)\b/`) dans un champ de délai/garantie **sans** crochet `[...]` autour ou juste avant/après | Délai/garantie inventé au lieu d'un placeholder | Flag — vérifier si la valeur provient de `merchant_facts` (cas légitime) avant de rejeter |

Implémentation suggérée : `konvert/src/lib/store-builder/hallucination-check.ts`, fonction pure `detectSuspiciousClaims(output, sourceDescription, merchantFacts): Flag[]`, appelée en post-génération, jamais bloquante en prod (log + dashboard), mais **bloquante en CI sur le golden set** (le run golden set échoue si `detectSuspiciousClaims` retourne un flag critique sur un cas où aucune donnée source ne le justifie).

**LLM-as-judge (Claude Haiku 4.5, cheap, volume-friendly)** — sur 100% du golden set puis sur un sample de prod :

```
Tu es un juge qui vérifie la conformité réglementaire d'un texte e-commerce français (art. L122-1).
Voici les DONNÉES PRODUIT SOURCE fournies au générateur : ${sourceDescription}
Voici le TEXTE GÉNÉRÉ à vérifier : ${outputField}

Réponds en JSON : {
  "contains_unverifiable_claim": boolean,
  "claim_detected": "string ou null — citation exacte du passage problématique",
  "claim_type": "avis_fictif | chiffre_invente | certification_non_sourcee | allegation_sante | nom_marque_concurrente | aucun",
  "confidence": number (0-1)
}
```

Règle d'agrégation (cohérente avec le framework d'éval de la fiche MINATO) : **100% des cas où `contains_unverifiable_claim: true` avec `confidence > 0.6`** passent en revue humaine avant tout ship de version de prompt. **10% random** du reste, échantillonné, en revue humaine de contrôle qualité générale (pas seulement guardrails).

### 7.4 Décision de ship (checklist, reprise de la fiche MINATO)

- [ ] Golden set 5 cas minimum, versionné Git
- [ ] 0 flag critique non justifié sur le golden set (règles §7.3)
- [ ] Judge `contains_unverifiable_claim` = false sur 100% du golden set (sinon retour §6.4 — envisager escalade modèle)
- [ ] p95 latence < 20s sur le golden set
- [ ] Schema Zod : 0 échec de validation après retry sur le golden set
- [ ] Coût mesuré €/génération loggé (Supabase/Notion) — comparaison chiffrée avec l'estimation §6.2

---

## 8. Intégration ANNA — points d'implémentation

### 8.1 Fichiers suggérés (convention à aligner avec l'existant `src/lib/ai/` et `src/lib/generation/`)

```
konvert/src/lib/store-builder/
├── schema.ts                  # §5.1 — Zod schema + GENERIC_COMPETITOR_LABELS
├── prompts.ts                 # §3-4 — buildSystemPrompt(vertical), buildUserPrompt(...)
├── generate.ts                # §6.1 — generateStoreBuilderContent()
├── hallucination-check.ts     # §7.3 — detectSuspiciousClaims() (pure, testable)
├── default-content.ts         # Fallback si NoObjectGeneratedError — reprend les defaults product.<vertical>.json
└── vertical.ts                # Dérivation vertical depuis category/product_type (§3.2)

konvert/eval/golden-set/
└── store-builder-product-template.json   # §7.1

konvert/src/app/api/store-builder/generate/route.ts   # endpoint (Zod validation entrée + rate-limit, pattern déjà en place côté Kirin)
```

### 8.2 Endpoint — contrat d'erreur (pas de crash UX, jamais)

- Succès schema-valide → 200, injecter directement les champs dans les `settings`/`blocks` du template JSON cible (mapping §9).
- `NoObjectGeneratedError` après retries → fallback `default-content.ts` (gabarits déjà écrits par ZARA dans `product.<vertical>.json`) + log Sentry `store-builder-generation-failed` (jamais de secret dans le log, cf. mémoire `feedback_agents_no_secrets_in_logs.md`).
- Flag critique `hallucination-check` en prod → ne bloque PAS la génération (le marchand doit pouvoir avancer), mais bannière non-bloquante dans l'UI Store Builder : "Certains contenus générés nécessitent une vérification avant publication" + log pour sampling humain.

### 8.3 Sanitizer déterministe post-LLM (obligatoire, indépendant du modèle)

Même doctrine que `sanitizeLandingPageData` dans `generate.ts` : `escapeHtml` sur tous les champs texte avant stockage (défense XSS, cf. commentaire existant sur l'injection `${...}` sans échappement dans les templates), + revalidation stricte des enums (`icon`, `us_value`, `them_value`, `them_column_label`) même si déjà garantis par Zod — defense in depth, comme le fait déjà le code existant pour `press_logos`/`payment_methods`.

---

## 9. Mapping champ de sortie → `section.setting_id` (pour ANNA)

| Champ sortie LLM | Cible Shopify | Fichier/section concernée |
|---|---|---|
| `hero.h1_title` | `product.title` (Shopify Admin, via API produit) | N/A — pas un setting de template |
| `hero.subtitle` | metafield `descriptors.subtitle` (lu par `main-product` bloc `caption`, `settings.text = "{{ product.metafields.descriptors.subtitle.value }}"`) | `main` section, bloc `caption` (déjà présent dans `product.<vertical>.json`, valeur = référence metafield, ne pas toucher) |
| `description_html` | `product.body_html` (Shopify Admin) | N/A — champ produit natif, lu par bloc `description` de `main-product` |
| `faq[i].question` | `sections.konvert-faq-rich.blocks.question-{i}.settings.question` | `konvert-faq-rich.liquid` |
| `faq[i].answer_html` | `sections.konvert-faq-rich.blocks.question-{i}.settings.answer` | `konvert-faq-rich.liquid` (type `richtext`) |
| `guarantees[i].icon` | `sections.konvert-guarantees.blocks.guarantee-{i}.settings.icon` | `konvert-guarantees.liquid` |
| `guarantees[i].title` | `sections.konvert-guarantees.blocks.guarantee-{i}.settings.title` | `konvert-guarantees.liquid` |
| `guarantees[i].text_html` | `sections.konvert-guarantees.blocks.guarantee-{i}.settings.text` | `konvert-guarantees.liquid` (type `richtext`) |
| `comparison_table.heading` | `sections.konvert-comparison-table.settings.heading` | `konvert-comparison-table.liquid` |
| `comparison_table.subheading` | `sections.konvert-comparison-table.settings.subheading` | idem |
| `comparison_table.criteria_column_label` | `sections.konvert-comparison-table.settings.criteria_column_label` | idem |
| `comparison_table.us_column_label` | `sections.konvert-comparison-table.settings.us_column_label` | idem |
| `comparison_table.them_column_label` | `sections.konvert-comparison-table.settings.them_column_label` | idem |
| `comparison_table.rows[i].label` | `sections.konvert-comparison-table.blocks.row-{i}.settings.label` | idem |
| `comparison_table.rows[i].us_value` | `...blocks.row-{i}.settings.us_value` | idem |
| `comparison_table.rows[i].us_text` | `...blocks.row-{i}.settings.us_text` | idem (ignoré si `us_value != custom`) |
| `comparison_table.rows[i].them_value` | `...blocks.row-{i}.settings.them_value` | idem |
| `comparison_table.rows[i].them_text` | `...blocks.row-{i}.settings.them_text` | idem (ignoré si `them_value != custom`) |
| `urgency_bar.message_default` | `sections.konvert-urgency-bar.settings.message_default` | `konvert-urgency-bar.liquid` |
| `urgency_bar.message_with_stock` | `sections.konvert-urgency-bar.settings.message_with_stock` | idem — token `[count]` préservé tel quel |
| `founder_story.heading` | `sections.konvert-founder-story.settings.heading` | `konvert-founder-story.liquid` |
| `founder_story.story_html` | `sections.konvert-founder-story.settings.story` | idem (type `richtext`) |
| `founder_story.founder_role` | `sections.konvert-founder-story.settings.founder_role` | idem |
| *(forcé par ANNA)* `""` | `sections.konvert-founder-story.settings.founder_name` | idem — jamais depuis le LLM |
| `exit_intent.heading` | `sections.konvert-exit-intent.settings.heading` | `konvert-exit-intent.liquid` |
| `exit_intent.text_html` | `sections.konvert-exit-intent.settings.text` | idem (type `richtext`) |
| `exit_intent.cta_label` | `sections.konvert-exit-intent.settings.cta_label` | idem |
| *(forcé par ANNA)* `""` | `sections.konvert-exit-intent.settings.promo_code` | idem — jamais depuis le LLM |
| *(forcé par ANNA)* `""` ou lien panier réel si connu | `sections.konvert-exit-intent.settings.cta_link` | idem — jamais depuis le LLM |

Tout le reste de `product.<vertical>.json` (couleurs, `color_scheme`, layout, `konvert-testimonials-carousel`, `konvert-social-proof`, `konvert-sticky-atc-mobile`, `main` sauf le bloc `caption` déjà en place) est **copié tel quel depuis le template preset du vertical**, jamais régénéré.

---

## 10. Monitoring & suivi coût (rappel rapide)

- Logger `usage.promptTokens` / `usage.completionTokens` (renvoyés par `generateObject`) par génération, taggés `vertical` + `KONVERT_STORE_BUILDER_PROMPT_VERSION` (même discipline de versioning que `PROMPT_VERSION` dans `generate.ts`) → Supabase ou Notion, comparable à l'estimation §6.2.
- Alerte si coût moyen dérive de plus de 30% par rapport à l'estimation (signe possible d'un schéma qui a grossi sans review, ou d'un vertical qui génère des sorties anormalement longues).
- Dashboard KAKASHI : taux de flag `hallucination-check` en prod dans le temps (doit rester proche de 0% si le schéma tient ses promesses — toute hausse est un signal d'alerte prioritaire, pas juste une métrique de confort).
