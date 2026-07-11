# Audit comparatif pages produit Konvert vs concurrents — 2026-06-05

**Auteur** : KISAME (PM)
**Périmètre** : pages produit générées par Konvert — templates etec-* + sections v3 + prompt DeepSeek
**Non couvert** : builder Shopify, dashboard, pricing

---

## TL;DR (5 lignes max)

Konvert génère des pages visuellement acceptables mais avec des lacunes CRO critiques. Sur 43 templates : 54% n'ont pas de sticky CRO bar mobile, 97% n'ont pas de bundle/upsell, 94% n'ont pas de countdown, 94% sont sans trust badges paiement, et 100% sont sans reviews avec photos utilisateurs (UGC photo). La variation entre templates est **réelle mais superficielle** : même scaffold HTML, même ordre de sections, palettes différentes. Le prompt DeepSeek est solide sur le copy narrative mais ne génère aucune donnée pour les composants CRO dynamiques (sticky, countdown, stock, bundle). Trois priorités absolues : (1) sticky add-to-cart mobile universel, (2) reviews avec photos dans le prompt + rendu, (3) bundle section dans au moins les 10 templates les plus utilisés.

---

## 1. État actuel Konvert

### 1.1 Inventaire sections v3 disponibles

Le dossier `/src/lib/sections-v3/` contient **13 sections** :

| Section v3 | Type | Standard DTC |
|---|---|---|
| `hero` | Core | Oui |
| `gallery` | Core | Oui |
| `reviews-ai-summary` | Proof | Partiel (pas de photos UGC) |
| `faq` | Trust | Oui |
| `compare-variants` | Conversion | Partiel |
| `how-it-works` | Educatif | Oui |
| `materials-breakdown` | Proof | Niche (artisanal, beauty) |
| `brand-manifesto` | Story | Non standard — rare chez concurrents |
| `why-we-love` | Bénéfices | Oui |
| `best-for` | Ciblage | Partiel |
| `care-instructions` | Post-achat | Niche |
| `thoughtfully-designed` | Brand | Non standard |
| `press-quote` | Social proof | Oui |

Sections v3 **absentes vs standards DTC 2026** :
- Sticky CRO bar (add-to-cart flottant mobile)
- Bundle / frequently bought together
- Countdown timer d'urgence
- Reviews avec photos utilisateurs (UGC photo)
- Selector quantité avec +/–
- Trust badges paiement (Visa/Mastercard/PayPal/Apple Pay)
- Stock counter / scarcity indicator
- Quiz / product finder
- Subscription toggle (one-time vs récurrent)
- Scroll-spy navigation (ancres sections)

### 1.2 Inventaire templates (variation réelle ?)

**43 templates etec-*** au total. **Tous appellent `renderRichSections`**, ce qui est positif : la couche copy riche (story, comparison, testimonials, etc.) est universelle.

Mais la variation entre templates est **principalement cosmétique** :
- Même scaffold : nav sticky → hero (texte gauche + image droite) → stats bar → why choose → products grid → testimonials → FAQ → subscribe → footer
- Même ordre de sections renderRichSections pour tous
- Différences réelles : palette couleurs, police (Cormorant vs Bodoni vs Jost vs Inter), forme des boutons (rounded vs square), mise en page hero (plein écran vs split)

**Composants CRO par template (sur 43)** :

| Composant | Templates qui l'ont | % couverture |
|---|---|---|
| Sticky add-to-cart mobile | 20 | 46% |
| Reviews avec avatars photo | ~12 (avatars fixes Unsplash) | 28% (mais photos stock, pas UGC) |
| Countdown/timer urgence | 3 | 7% |
| Bundle / cross-sell | 1 (etec-casa seulement) | 2% |
| Trust badges paiement | 3 | 7% |
| Stock counter | 0 | 0% |
| Reviews avec PHOTOS clients (UGC) | 0 | 0% |
| Scroll-spy navigation | 0 | 0% |

**Diagnostic** : etec-beauty, etec-jewel, etec-techcase, etec-pet sont représentatifs de la majorité des templates — bien codés, soignés visuellement, mais sans les composants de conversion avancés que les concurrents ont standardisés.

### 1.3 Qualité du prompt système de génération

Le prompt DeepSeek (`/src/lib/anthropic/generate.ts`) est **bien structuré pour le copy narratif** :
- PAS + AIDA + 7 leviers Cialdini — cadre correct
- 25 règles de génération explicites — bon niveau de détail
- Génère : story, before/after, competitor_comparison, value_stack, objections, founder_note — couverture sérieuse

**Faiblesses du prompt** :
1. Il ne demande **aucune donnée pour les composants CRO dynamiques** : pas de champ `bundle_items`, pas de `countdown_minutes`, pas de `stock_remaining`, pas de `review_photos`
2. Les `testimonials` générés ont `name + rating + text` mais **zéro champ photo** — les reviews avec photo UGC sont impossibles structurellement
3. `press_mentions` = liste de noms de médias — aucun logo, aucune citation réelle, rendu générique
4. `risk_reversal` = 3 items avec icônes emoji, mais jamais mappé sur des visuels trust badge réels
5. Pas de `payment_icons` ni `certification_logos` dans le schema — les trust badges visuels (Visa, PayPal, etc.) sont absents de la spec

**Conclusion prompt** : solide pour le copywriting long-form, insuffisant pour les composants visuels de conversion. Ce n'est pas uniquement un problème de templates — c'est un problème de schema de données.

---

## 2. Benchmark concurrents

**Note préliminaire** : "Mercado AI" (mercadoai.com) n'est pas un concurrent DTC — c'est une startup agri B2B. Il a été retiré du benchmark. Les 3 concurrents analysés sont PageFly, GemPages et Replo, avec sources Firecrawl directes.

### 2.1 Matrice sections présentes — Konvert vs concurrents (table)

Source PageFly : https://pagefly.io/pages/templates (129 templates, features listées)
Source GemPages : https://gempages.net/pages/gempages-template-listing (35 product page templates, template Powder Collagen analysé)
Source Replo : https://www.replo.app/blog/shopify-product-page (guide 10 éléments, jan 2026)

| Section / Composant | Konvert | PageFly | GemPages | Replo |
|---|---|---|---|---|
| Hero split (image + copy) | Oui (tous) | Oui | Oui | Oui |
| Galerie images | Oui (renderGallery) | Oui | Oui | Oui |
| FAQ accordion | Oui (100% templates) | Oui (feature filtre "Accordion") | Oui | Oui |
| Reviews / testimonials | Oui (texte + avatar stock) | Oui (feature "Testimonials") | Oui | Oui |
| Comparatif produit / sans-avec | Oui (renderComparisonV2) | Oui | Oui | Oui |
| Comparatif concurrents (tableau) | Oui (renderCompetitorComparison) | Partiel | Oui | Oui |
| Sticky add-to-cart mobile | 46% templates | Standard (feature native) | Standard | Standard (recommandé) |
| Reviews avec PHOTOS clients | Non (0%) | Oui (feature "Instagram Feed" + UGC) | Oui (key feature trust) | Oui (recommandé comme #4) |
| Bundle / frequently bought | 2% (1 template) | Oui (feature "Product List") | Oui (CRO focus) | Oui (bundle builder) |
| Countdown timer urgence | 7% templates | Oui (feature "Countdown Timer") | Oui | Oui (urgency #8) |
| Trust badges paiement | 7% templates | Oui (feature "Trust Logos") | Oui ("Trust badges key feature") | Oui (trust signals #9) |
| Stock counter scarcity | Non (0%) | Oui | Partiel | Oui (real inventory counter) |
| Selector quantité +/– | 5% (2 templates) | Standard | Standard | Standard |
| Subscription toggle | Non | Oui | Oui | Oui (subscription plans) |
| Scroll-spy navigation | Non | Partiel | Partiel | Non mentionné |
| Before/after visuel | Oui (renderBeforeAfter) | Oui | Oui | Partiel |
| Value stack (prix barré / économie) | Oui (renderValueStack) | Partiel | Oui | Oui |
| Garantie visuelle | Oui (renderGuaranteeV2) | Oui | Oui | Oui |
| Founder note | Oui (renderFounderNote) | Rare | Rare | Rare |
| Target audience | Oui (renderTargetAudience) | Non | Non | Non |

**Score couverture composants CRO critiques** :
- PageFly : 11/15 = 73%
- GemPages : 12/15 = 80%
- Replo : 13/15 = 87%
- Konvert : 7/15 = 47%

### 2.2 Composants conversion manquants chez Konvert

**Critiques (manquent dans >90% des templates)** :
1. Reviews avec photos clients — 0% des templates. PageFly propose "Instagram Feed" + "Testimonials with photos" comme features de filtrage. GemPages marque "trust badges and security seals + high-quality image support" comme key features sur ses product page templates. Replo classe les reviews avec photos comme #4 des éléments prioritaires (conversion 2-4x vs texte seul).
2. Bundle / cross-sell — 2% (1 template). GemPages propose un "Increased AOV" comme value proposition de ses product page templates. Replo recommande explicitement les bundle builders pour +10-18% AOV.
3. Trust badges paiement — 7%. PageFly a "Trust Logos" dans ses features de filtrage. GemPages liste "trust badges and security seals" comme key feature systématique.
4. Countdown timer — 7%. PageFly a "Countdown Timer" en feature filtre native. Replo recommande urgency (#8) avec vrais end times.
5. Stock counter — 0%. Replo recommande les "real-time inventory counters". PageFly l'intègre nativement.

**Importants (manquent dans >50% des templates)** :
6. Sticky add-to-cart mobile — 54% des templates n'en ont pas. Replo cite +3-7% add-to-cart mobile. Standard chez PageFly, GemPages, Replo.
7. Selector quantité +/– — présent dans 2 templates sur 43. Standard absolu chez les concurrents.

### 2.3 Standards design DTC 2026

**Typography** :
- Konvert : bien. Cormorant Garamond + DM Sans (beauty), Bodoni + Poppins (jewel), Jost (techcase) — choix cohérents et premium. Scale h1 56-68px desktop, lisible.
- Concurrents (GemPages, PageFly) : similaire. Pas d'écart significatif sur la typographie.

**Spacing** :
- Konvert : correct. Padding section 80-96px desktop, réduit mobile. Grilles 2-col bien proportionnées.
- Concurrents : similaire.

**Contrast et couleurs** :
- Konvert : global correct. Mais sur etec-jewel, le contraste texte gris (#868686) sur fond noir est potentiellement en dessous du WCAG AA pour la taille 14px.
- Concurrents : généralement WCAG AA conformes sur leurs templates premium.

**Trust visuels** :
- Konvert : visuellement pauvre. Les garanties sont du texte dans un container, les trust badges sont absents dans 93% des templates.
- GemPages template Powder Collagen : "trust badges and security seals" explicitement listés comme key feature.

**Mobile** :
- Konvert : responsive partout (media queries systématiques), mais sticky bar absente sur 54% des templates — ce qui est le point de friction #1 sur mobile selon Replo (>59% du trafic mobile en 2026).

### 2.4 Standards copy DTC 2026

**Ce que Konvert fait bien** :
- Storytelling PAS + AIDA — structuré et correct
- Unique mechanism nommé — différenciant vs PageFly (qui ne génère pas le copy)
- Before/after 3 paires — bien
- Objections 5 items — bien
- Competitor comparison générique — bien
- Value stack avec prix barrés — bien

**Ce que Konvert ne fait pas** :
- Le prompt génère des `testimonials` sans champ photo — les reviews restent du texte + avatar Unsplash générique. Un review avec photo réelle client convertit 2-4x plus (source : Replo blog, jan 2026).
- Les `press_mentions` sont de simples noms de médias, jamais affichés avec logos. Résultat : la section "Vu dans" est du texte brut, alors que les concurrents (GemPages, Replo) affichent des logos vectoriels reconnaissables.
- L'urgence (`urgency` field) est un string générique. Pas de mécanisme de countdown réel ni de stock count dynamique.
- Pas de copy pour les trust badges paiement — le prompt ne demande jamais "quels modes de paiement sont acceptés".

---

## 3. Écarts critiques (priorisés RICE)

Reach = utilisateurs actifs impactés sur Q3 2026 (estimation 300 users actifs post-launch)
Impact = 3 massif / 2 high / 1 medium / 0.5 low
Confidence = données concurrents + études secteur
Effort = personne-mois cumulés ANNA + OBITO

| # | Écart | Reach | Impact | Conf. | Effort | RICE | Owner suggéré |
|---|---|---|---|---|---|---|---|
| 1 | Sticky add-to-cart mobile universel (tous templates) | 300 | 3 | 0.9 | 1 | **810** | ANNA |
| 2 | Reviews avec photos dans schema + rendu (prompt + template) | 300 | 2 | 0.9 | 1.5 | **360** | MINATO (prompt) + ANNA |
| 3 | Trust badges paiement (visuels SVG/PNG) universels | 300 | 2 | 0.8 | 0.5 | **960** | ANNA + OBITO |
| 4 | Bundle / cross-sell section (top 10 templates) | 200 | 2 | 0.8 | 2 | **160** | ANNA + OBITO |
| 5 | Countdown timer (section renderRichSections) | 200 | 1.5 | 0.7 | 1 | **210** | ANNA |
| 6 | Selector quantité +/– universel | 250 | 1.5 | 0.9 | 0.5 | **675** | ANNA |
| 7 | Stock counter / scarcity indicator | 150 | 1.5 | 0.6 | 1 | **135** | ANNA |
| 8 | Photos UGC simulées dans prompt (noms + descriptions photos) | 300 | 2 | 0.8 | 0.5 | **960** | MINATO |
| 9 | Logos presse vectoriels (remplacement texte brut) | 250 | 1 | 0.8 | 0.5 | **400** | OBITO |
| 10 | Subscription toggle one-time vs récurrent | 100 | 1.5 | 0.5 | 2 | **37** | ANNA |

**Top 5 priorités par RICE** :
1. Trust badges paiement visuels (RICE 960) — impact/effort excellent
2. Photos UGC simulées dans prompt (RICE 960) — coût quasi nul, impact fort
3. Sticky add-to-cart mobile universel (RICE 810) — standard absolu manquant
4. Selector quantité +/– universel (RICE 675) — effort 0.5, quick win
5. Logos presse vectoriels (RICE 400) — OBITO, 0.5 PM

---

## 4. Plan d'action 30 jours

### 4.1 Quick wins semaine 1 (effort < 0.5 PM chacun)

Ces items ne nécessitent pas de refonte — ce sont des ajouts ponctuels dans sections.ts ou le prompt.

**W1.A — Trust badges paiement universels (RICE 960)**
- Créer un composant HTML statique avec SVG Visa / Mastercard / PayPal / Apple Pay / CB
- L'injecter dans `renderRichSections` juste avant la section `guarantee`
- Ou l'ajouter dans le hero buy-box de chaque template lors du prochain pass
- Owner : ANNA (2 jours), OBITO valide le style

**W1.B — Photos UGC simulées dans le prompt (RICE 960)**
- Brief MINATO : ajouter un champ `testimonials[].photo_description` dans le schema DeepSeek
- Exemple : `"photo_description": "Femme 30-35 ans, selfie dans la salle de bain, sourire naturel, avant/après cheveux"`
- Les templates utilisent cette description comme alt text + déclenche un placeholder photo réaliste
- Owner : MINATO (refonte prompt schema, ~1 jour)

**W1.C — Selector quantité +/– universel (RICE 675)**
- Composant JS vanilla 20 lignes, déjà présent dans etec-pet et etec-prime
- Copier/adapter vers `renderRichSections` ou ajouter dans le buy-box hero de tous les templates restants
- Owner : ANNA (1 jour)

### 4.2 Refonte prompt IA semaine 2 (briefe MINATO)

Brief pour MINATO :

Ajouter les champs suivants dans le schema DeepSeek V3 :

```json
"testimonials": [
  {
    "name": "string",
    "rating": 5,
    "text": "string",
    "variant": "string",
    "photo_description": "description courte de la photo du client (genre, âge apparent, contexte usage)"
  }
],
"payment_methods": ["Visa", "Mastercard", "PayPal", "Apple Pay"],
"press_logos": [
  { "name": "string — nom média", "style": "dark|light" }
],
"stock_signal": {
  "type": "low|normal|none",
  "count": "ex: '8 restants'"
},
"bundle_offer": {
  "enabled": true,
  "items": [
    { "label": "string", "price": "string", "image_hint": "string" }
  ],
  "discount": "ex: '-15%'"
}
```

Règles de génération à ajouter (26-30) :
- 26. `testimonials[].photo_description` : description visuelle d'1 phrase (genre apparent, contexte d'usage)
- 27. `payment_methods` : liste réaliste selon catégorie produit (Beauty → Klarna en plus ; Tech → Apple Pay prioritaire)
- 28. `stock_signal` : `low` si produit trending/saisonnier, `normal` sinon
- 29. `bundle_offer` : 1 bundle complémentaire logique si catégorie beauty/wellness/pet (sinon `enabled: false`)
- 30. `press_logos` : uniquement si presse cohérente avec catégorie (beauty → Vogue, Marie Claire ; tech → Wired, TechCrunch)

### 4.3 Sections nouvelles à coder semaine 3-4 (briefer ANNA + OBITO)

**Section countdown (renderCountdownTimer)** — RICE 210
- HTML/CSS pur, JS vanilla setInterval
- Paramètres : `end_time` (calculé à N+24h depuis génération), couleurs du theme
- Inséré dans `renderRichSections` à la position `guarantee` ou `risk_reversal`
- Déclenché uniquement si `data.urgency` est présent et non vide
- Owner : ANNA (2 jours)

**Section bundle offer (renderBundleOffer)** — RICE 160
- Layout 3 cards horizontales : produit principal + 2 complémentaires
- Bouton "Ajouter les 3 — Économisez X%"
- Déclenché uniquement si `data.bundle_offer?.enabled === true`
- Owner : ANNA + OBITO (3-4 jours dont maquette OBITO)

**Section reviews avec photos (upgrade renderTestimonialsV2)** — RICE 360
- Upgrade de la section testimonials existante
- Si `testimonials[].photo_description` présent → afficher placeholder avec alt text descriptif + badge "Achat vérifié" + étoiles
- Design : carte large avec photo à gauche, review à droite, tag variante en bas
- Owner : ANNA (2 jours)

### 4.4 Refonte templates etec-* (briefer OBITO + ZARA pour le copy)

Ce chantier est le plus long (semaines 3-4 minimum) — le prioriser sur les 10 templates les plus assignés en production.

**Priorité 1 (templates sans sticky CRO bar) : etec-beauty, etec-jewel, etec-techcase, etec-pet, etec-prestige, etec-luxe, etec-noir, etec-rose, etec-nordic, etec-natural**
- Ajouter sticky bar mobile : `position:fixed; bottom:0; z-index:999; background:[primary color]; display:flex; padding:12px 16px; gap:12px`
- Contenu : nom produit tronqué + prix + bouton "Ajouter au panier" primary
- Masqué une fois buy-box hero visible (IntersectionObserver, 10 lignes JS)
- Owner : ANNA (1 jour pour le composant universel, 0.5j pour intégrer dans chaque template)

**Priorité 2 (OBITO) — Design trust badges + press logos**
- Fournir les SVG officiels Visa/Mastercard/PayPal (usage commercial autorisé)
- Créer une rangée "Paiement sécurisé" standardisée pour injection dans tous les templates
- Créer une rangée logos presse vectoriels pour les 5 médias les plus demandés par catégorie
- Brief OBITO : composant "trust strip" en 3 variantes (dark bg, light bg, border only)

**Priorité 3 (ZARA) — Copy des trust badges et bundle**
- Les micro-copies autour des badges ("Paiement 100% sécurisé", "Retours gratuits 30j", "Livré en 48h") doivent être rédigées par ZARA pour chaque ton (persuasif, premium, fun, informatif)
- Brief ZARA : 4 variantes de copy trust strip × 4 tons × 3 langues (FR/EN/AR)

---

## 5. Décision recommandée

**Refonte partielle, pas big bang.**

Les templates Konvert ont une base solide : typographie soignée, sections copy riches uniques vs concurrents (competitor_comparison, target_audience, founder_note — que PageFly et GemPages ne génèrent pas). C'est un avantage différenciant à préserver.

Les lacunes sont **ciblées et adressables en 3-4 semaines** sans tout reconstruire :
- 4 composants universels à ajouter (trust badges, sticky CTA, quantité, UGC photo)
- 1 refonte prompt MINATO (schema + règles)
- 2 nouvelles sections (countdown + bundle)

Si ces 7 chantiers sont livrés avant fin juin 2026, Konvert passe de 47% à ~80% de couverture des composants CRO standards — en ligne avec PageFly et GemPages.

**Ce qui resterait comme écart structurel** : les composants vraiment dynamiques (stock en temps réel depuis Shopify, subscription toggle Recharge, quiz interactif) — mais ceux-ci nécessitent une intégration Shopify plus profonde, hors périmètre du générateur IA actuel.

---

## Annexes

### URLs sources scrapées

- Replo blog produit page (jan 2026) : https://www.replo.app/blog/shopify-product-page
- GemPages template listing : https://gempages.net/pages/gempages-template-listing
- GemPages template Powder Collagen : https://gempages.net/pages/gempages-template-detail?template_id=612939860436582971
- PageFly templates (129) : https://pagefly.io/pages/templates
- Replo product page templates : https://www.replo.app/templates/pages

### Fichiers Konvert analysés

- `/Users/mac/nexara/konvert/src/lib/templates/etec-beauty.ts` — template complet lu
- `/Users/mac/nexara/konvert/src/lib/templates/etec-jewel.ts` — structure lue
- `/Users/mac/nexara/konvert/src/lib/templates/etec-techcase.ts` — structure lue
- `/Users/mac/nexara/konvert/src/lib/templates/etec-pet.ts` — structure lue
- `/Users/mac/nexara/konvert/src/lib/templates/sections.ts` — inventaire complet des 20 sections renderRichSections
- `/Users/mac/nexara/konvert/src/lib/sections-v3/index.ts` — inventaire 13 sections v3
- `/Users/mac/nexara/konvert/src/lib/anthropic/generate.ts` — prompt system complet lu
- `/Users/mac/nexara/konvert/src/lib/ai/deepseek-v3.ts` — wrapper API lu

### Note sur "Mercado AI"

Le site mercadoai.com n'est pas un concurrent de Konvert — c'est une startup agrotech B2B (robots agricoles + marketplace bétail). Il a été exclu du benchmark.

---

*Audit produit KISAME — NEXARA — 2026-06-05*
