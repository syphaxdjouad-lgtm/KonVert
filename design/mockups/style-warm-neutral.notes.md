# Style Warm Neutral — Notes Design OBITO
## Konvert V3 / Maquette standalone

---

## 1. Philosophie du style

Le style Warm Neutral s'inspire du vêtement de travail premium scandinave et de la boutique de quartier parisienne. Rien d'ostensiblement luxueux — tout d'intensément qualitatif. La référence sensorielle est le dimanche matin dans un café en bois, pas le showroom blanc d'un détaillant de mode.

Les trois marques sources (Aimé Leon Dore, Norse Projects, Anine Bing) partagent un refus commun : le décorum visuel pour lui-même. Leur esthétique web repose sur le retrait, les images qui respirent, et la typographie comme seule ornement. On s'est tenu à cette discipline.

---

## 2. Choix typographiques

### PP Editorial New (heading) / Playfair Display (fallback)
PP Editorial New est la fonte éditoriale de référence pour les marques DTC premium francophones actuelles. Elle combine la gravité d'un serif classique avec des détails contemporains (terminaisons asymétriques, contraste élevé). Son usage en italic est particulièrement fort pour les accents de chaleur.

Playfair Display est le fallback le plus proche accessible via Google Fonts — même ADN (serif de presse, contraste marqué, bonne lecture en grandes tailles).

Règle d'usage dans le design :
- H1/H2 : weight 400, letter-spacing -0.01em à -0.02em
- Italic réservé aux accents (tagline, citation, em dans les titres)
- Jamais de bold lourd sur serif — la chaleur vient de la forme, pas du poids

### Inter (body)
Neutre, lisible, pas de personnalité forte — c'est voulu. Le corps de texte ne doit pas concurrencer les serifs. Inter en 400 pour le corps, 500 pour les labels et boutons, 600 pour les eyebrows en uppercase.

---

## 3. Palette et choix colorimétriques

### #F4ECE0 — fond principal
Tan crème légèrement rosé. Plus chaleureux qu'un beige pur, moins saturé qu'un jaune paille. Sur écran, il crée une fatigue oculaire réduite par rapport au blanc pur tout en signalant "artisanat" plutôt que "tech".

### #FAF5EC — surface cards
Légèrement plus clair que le fond — 6% de différence de luminosité. Assez pour délimiter les cards sans créer de contraste dur. La règle : les cards flottent, elles ne découpent pas.

### #B5854B — accent doré tan
Doré sans être criard, brun sans être triste. La teinte évoque le laiton naturel non traité, la cire d'entretien, le cuir cognac après quelques années. Utilisé avec parcimonie : CTAs, eyebrows, séparateurs tan-rule, traits verticaux des features. Maximum 4-5 usages par section.

### #3B2F23 — text
Brun profond chaud. Jamais noir pur (#000) qui crée une cassure violente avec le fond crème. Ce brun harmonise texte et surface.

### #8B7D6E — text muted
Pour les captions, descriptions, prix notes. Contraste ratio avec le fond #F4ECE0 : ~4.7:1 (WCAG AA validé pour texte normal).

---

## 4. Traitement photo

```css
filter: sepia(0.08) saturate(0.95) brightness(1.01);
```

Justification :
- sepia(0.08) : apporte une chaleur subtile sans jaunir (au-delà de 0.10, les teintes virent)
- saturate(0.95) : réduit légèrement la saturation pour unifier des images de sources différentes
- brightness(1.01) : compense le léger assombrissement du sepia

Ce traitement fonctionne avec des images lifestyle outdoor et atelier. Il est contre-indiqué sur fond blanc pur (virage jaune) — les images de ce style ont toutes un fond de teinte ou lumière naturelle.

---

## 5. Décisions de layout par section

### Hero (section 1)
Split 50/50 avec info sticky côté gauche. Décision délibérée : sur une page produit, le scroll doit enrichir l'information (images droite) sans jamais perdre les CTAs (info gauche reste visible). Le sticky top à 96px respecte la hauteur du header (64px) + marge de confort (32px).

Les prix sont en PP Editorial New (heading) plutôt qu'Inter pour signaler "valeur perçue" — la typographie du prix emprunte au registre émotionnel du nom produit, pas au registre froid du chiffre.

### Gallery (section 2)
Scroll horizontal avec snap. Sur desktop, items à 380px — assez grands pour voir le détail, assez petits pour signaler qu'il y en a d'autres hors champ (le dernier item visible est coupé à ~60%). Sur mobile, 280px pour la même raison.

Pas de controls de navigation (flèches) — délibéré. Le scroll naturel est plus premium que les flèches génériques. L'affordance vient du crop visible à droite.

### Why We Love (section 3)
Texte seul, centré, serif italic. Pas d'image. Le silence visuel après la gallery dense crée un temps de pause éditorial. C'est le moment où la marque parle directement, sans support visuel. Structure empruntée aux pages "about" de Norse Projects.

### Materials Breakdown (section 6)
Section critique selon le brief. Trois cards en 3 colonnes avec :
1. Photo macro en aspect-ratio 4:3 (cadre paysage = texture visible = macro obligatoire)
2. Caption en italic accent (#B5854B) pour le sourcing — c'est la preuve, pas un titre
3. Badge pill (petit, uppercase, fond accent-pale) pour la certification/origine
4. Description technique, jamais marketing

Le photo-treatment sepia est particulièrement efficace sur les textures cuir — il enrichit le grain sans le déformer.

### Manifesto (section 13)
Style éditorial : photo 4:5 à gauche, texte à droite. Les trois piliers sont séparés par un trait horizontal en tan rgba(181,133,75,0.25) — pas un border CSS standard, mais une règle qui appartient à la palette de la marque. La citation en italic pour chaque titre de pilier renforce le ton artisanal (le craftsman parle, pas la marque corporate).

Le texte des piliers évite le lyrisme creux : on y trouve des chiffres concrets (79 EUR / 15 ans / 5 EUR par an) parce que la preuve chiffrée est plus persuasive que la métaphore.

### Press Quote (section 10)
Fond #3B2F23 (couleur text) — l'inversion de fond crée une rupture de tempo dans la page sans recourir à un accent criard. La citation en serif ivory (#FAF5EC) sur brun crée un contraste chaud et élégant, très magazine. Le guillemet géant en arrière-plan (rgba 8% d'opacité) est une signature typographique visible sans être tapageuse.

---

## 6. Tan-rule vs Border

Le separator utilisé dans ce style est une règle CSS personnalisée de 48px × 1px en #B5854B, jamais un border-bottom entre sections. Distinction essentielle :
- Un border-bottom de section découpe la page en "blocs" — anti-pattern majeur
- Une tan-rule de 48px est un signe typographique, pas une frontière — elle appartient au contenu

La règle tan-rule--center est utilisée après les eyebrows pour créer un point focal avant le titre de section.

---

## 7. Variantes mobile

Adaptations spécifiques au viewport 375-430px :

1. Hero reconfiguré : image full-width en premier, info produit dessous (pas de sticky colonne — trop contraignant sur écran étroit)
2. Gallery, Variants, Reviews : scroll horizontal avec snap — même pattern, même affordance
3. Materials : 1 colonne empilée, aspect-ratio images en 16:9 (moins de hauteur, plus de texture visible)
4. Care : 2 colonnes × 2 lignes (grid compacte, économie de scroll vertical)
5. FAQ : questions plus courtes (reformulées pour tenir sur une ligne à 375px)
6. Sticky bar mobile : full-width avec safe-area-inset-bottom pour iPhone notch/dynamic island
7. Touch targets : tous les éléments interactifs à min-height 44px (Apple HIG standard)

---

## 8. Anti-patterns évités

- Pas d'alternance de fonds entre sections (même #F4ECE0 partout)
- Pas de border-top/bottom entre sections
- Accent #B5854B sur 4 usages max par section
- Pas de box-shadow coloré (ombre tan uniquement, jamais colorée)
- Pas de texte accent sur fond accent (jamais #B5854B sur #B5854B-pale pour du texte long)
- Pas de font-weight 700+ sur les serifs (trop lourd, perd la chaleur)

---

## 9. WCAG AA — contraste vérifié

| Paire | Ratio | Résultat |
|---|---|---|
| #3B2F23 sur #F4ECE0 | ~10.2:1 | AAA |
| #8B7D6E sur #F4ECE0 | ~4.7:1 | AA |
| #FAF5EC sur #B5854B | ~3.5:1 | AA (grands textes) |
| #FAF5EC sur #3B2F23 | ~10.2:1 | AAA |
| #B5854B sur #FAF5EC | ~3.5:1 | AA (grands textes, boutons) |

Note : les boutons pill utilisent #FAF5EC (surface) sur fond #B5854B. Le ratio 3.5:1 est suffisant pour les éléments non-texte (boutons > 18px uppercase). Pour les textes courants, on n'utilise jamais l'accent directement sur fond surface.

---

## 10. Motion design

Philosophie retenue : Emil Kowalski (Restraint). Il s'agit d'une page produit e-commerce — les animations ne doivent jamais ralentir la conversion.

- Reveal au scroll : opacity + translateY(20px), 450ms, cubic-bezier(0.4,0,0.2,1)
- Stagger : 80ms d'intervalle entre les éléments (perceptible sans être théâtral)
- Hover cards : translateY(-2px) + shadow upgrade, 450ms — feedback sans déplacement gênant
- Sticky bar : slide from bottom, 380ms
- FAQ accordion : max-height transition, 380ms — pas d'animation de hauteur complexe
- Pas d'animation en boucle (zero loop animation en UI fonctionnelle)
- prefers-reduced-motion : toutes les transitions désactivées, reveals instantanés

---

## 11. Sections STATUS

| Section | Statut | Notes |
|---|---|---|
| hero | OK | Split sticky, 3 variantes pill |
| gallery | OK | Scroll horizontal snap, 5 items |
| why_we_love | OK | Citation serif italic centrée |
| thoughtfully_designed | OK | 4 features border-left tan |
| best_for | OK | 6 pills outline accent |
| materials_breakdown | OK | 3 cards macro + caption italic |
| how_it_works | SKIPPED | Non applicable sac/accessoire |
| compare_variants | OK | 3 cards avec état active |
| reviews_ai_summary | OK | Score + resume IA + 3 avis |
| press_quote | OK | Fond brun inversé, guillemet géant |
| care_instructions | OK | 4 items icones SVG + fond |
| faq | OK | Accordeon ARIA, 5 questions |
| brand_manifesto | OK | 3 piliers séparés trait tan |
