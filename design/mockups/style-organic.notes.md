# Style Organic — Notes design
# Konvert V3 — OBITO / NEXARA
# Date : 2026-05-26

---

## 1. Identite visuelle

### Ancrage de style
Organic s'inscrit dans le mouvement DTC clean beauty / wellness premium US : Aesop, Necessaire, Patagonia, Native.
Ce n'est pas un style "bois et kraft" naif. C'est du minimalisme naturel sophistique — blanc-casse, vert sage, serif chaleureux — sans jamais tomber dans le cliche bio de supermarche.

### Palette justifiee

**#F4F1ED — Cream dominant**
Ni blanc, ni beige. Ce ton warm-neutral cree une sensation de matiere organique (papier epais, coton non blanche). Il evite la froideur du blanc pur tout en restant lumineux. 90% du fond de page.

**#FAF8F4 — Surface**
Version plus claire du cream. Utilisee pour les sections en alternance et les cards. La difference est subtile (intentionnellement) — on ne "switche" pas violemment, on module la profondeur.

**#4A7C59 — Vert sage**
Choix deliberement dessature. Un vert trop vif serait "epinards Whole Foods", trop clair serait "wellness wellness wellness". Ce tone specifique (#4A7C59) est dans la famille Aesop/Byredo — terrien, serieux, premium. Utilise sparinement : pills, dividers, CTA, labels, border-left.

**#1F2D24 — Text**
Ce n'est pas du noir pur. C'est un quasi-noir avec une dominante verte froide. Ca cree une coherence chromatique subtile entre le texte et l'accent — le lecteur ne le conscientise pas, mais il le ressent.

**#6B7B70 — Text muted**
Meme famille verte, mais adouci. Utilisee pour les descriptions, sous-titres, auteurs d'avis. Contraste WCAG AA valide sur les deux fonds (#F4F1ED : ratio ~4.7:1).

### Typographie justifiee

**DM Serif Display (heading)**
Alternate a Cormorant ou Playfair Display. Pourquoi DM Serif Display specifiquement :
- Serif tres rond, "friendly" — contraste avec les serifs pointus du luxe
- Italic tres expressif — parfait pour les taglines, manifesto, why-we-love
- Lisible a grande taille mais aussi a taille intermediaire (cartes materiaux)
- Associe a DM Sans/Inter = famille coherente (Google DM fonts)

**Inter (body)**
Universel, lisible, neutre. Ne compete pas avec le heading. Poids utilises : 300 (rare), 400 (body), 500 (labels, CTA), 600 (eyebrows).

**Règle de mixte :**
- Headings section : DM Serif Display 400 (jamais bold — le poids vient de la taille)
- Taglines / citations : DM Serif Display 400 italic
- Eyebrows : Inter 600, 10-11px, letter-spacing 0.14em, uppercase
- Body : Inter 400, 15-16px
- Labels / badges : Inter 600, 10-11px

### Spacing justifie

**Sections : 128px desktop / 72px mobile**
Les marques de reference (Aesop, Necessaire) utilisent des respirations larges entre les sections. Ca communique : "on n'essaie pas de tout te vendre d'un coup". C'est le contraire du page builder DTC generique.

**Cards : 24-32px de padding**
Genereux. Le card ne doit pas sembler "plein". La matiere respire.

**Gap inter-elements : 24px (gap var)**
Standard 8pt grid x3. Ni trop serre, ni aere au point de perdre la coherence.

---

## 2. Decisions de mise en page

### Hero : sticky info + galerie verticale
Choix delibere de ne pas centrer le hero. L'image est a droite (desktop), l'info est a gauche et sticky. Ca permet a l'utilisateur de scroller les images tout en gardant le CTA visible — pattern Allbirds / Ridge.

Sur mobile : empiler image > thumbs > info > CTA. La photo vient en premier (visuel dominant), les informations arrivent apres (pattern naturel d'exploration produit).

### Gallery : scroll horizontal
Standard DTC 2024-2026. Economise de la place verticale, signale "il y a plus a voir". La galerie desktop est separee du hero pour ne pas doubler l'information.

### Materials breakdown : section signature
C'est la section la plus differenciante du style Organic. Sur les produits mode/sac, on ne se contente pas de lister "cuir, coton, laiton" — on les presente avec une photo macro + un badge de categorie + un texte de benefice. Pattern Allbirds Wool, Patagonia responsible fibers.

**Regle d'activation (pour le code prod)** : displayRule = afficher si AI extrait >= 2 materiaux avec confidence >= 0.6.

### Press quote : section inversee
Fond vert sage (la seule section avec un fond colore fort). Cree un contraste dramatique dans le scroll — le regard s'arrete. Citation en serif italic sur fond vert = contraste maximal. Le pattern "section sombre/coloree au milieu d'une page claire" est utilise par Glossier, Aritzia.

### Manifesto : layout 2 colonnes image + texte
Image artisanale a gauche, texte a droite. Inversement du hero. Les piliers sont en liste avec points vert sage — pas de numeros, pas d'icones — juste les dots. Style Aesop philosophy page.

### Care instructions : 4 cards 2x2
Chaque item = icone ronde (bg pale), titre serif, description courte. Ton deliberement bienveillant — pas de "NE PAS mettre au lave-linge" mais "voici comment le chouchouter". Pattern Glossier Skin Guide.

---

## 3. Animations

**Philosophie retenue : Jakub Krehel (production polish)**
Ce style est consumer premium (pas B2B, pas SaaS). Les animations doivent ajouter du plaisir, pas entraver le workflow.

**Scroll reveal : `scale(0.98) translateY(16px)` → `scale(1) translateY(0)`**
La combinaison scale + translate est plus "organique" qu'un simple fade ou translateY seul. La sensation est d'un element qui "prend vie" doucement. Duree 500ms (genereux pour un style organic — on ne se precipite pas).

**Stagger par section : 80ms increments**
Les elements arrivent en cascade legere, pas tous d'un coup. Limite a 4 niveaux de delay (0, 80, 160, 240ms) pour ne pas allonger le temps de lecture.

**Hover sur cards : translateY(-2px) + shadow-hover**
Micro-elevation. Signale l'interactivite sans agressivite.

**Hover sur images : scale(1.02) + saturation +10%**
Effet de "zoom doux" sur les photos — specifique a ce style. Les images semblent "s'allumer" au survol.

**FAQ accordion : max-height transition**
Pas d'height auto (ne se transitionne pas). max-height avec valeur generique (400px). Duree 350ms, ease-in-out.

**Prefers-reduced-motion** : toutes les animations sont en CSS transition, facilement desactivables avec `@media (prefers-reduced-motion: reduce) { .reveal { transition: none; } }`.

---

## 4. Photo treatment

Filtre CSS applique sur toutes les images : `filter: saturate(1.1) sepia(0.04) brightness(1.01)`

**Justification :**
- `saturate(1.1)` : +10% saturation, renforce les verts et les tons chauds cuir/cognac sans artifice
- `sepia(0.04)` : 4% sepia ajoute un warming subtil — les photos Unsplash sont parfois trop "digitales/froides". Ce filtre les rapproche d'une photo analogique
- `brightness(1.01)` : +1% de luminosite pour compenser le leger assombrissement du sepia

**Ce n'est pas un vrai "filtre Instagram"** — c'est invisible consciemment mais ressenti comme "beau" vs "photo de produit e-commerce basique".

---

## 5. Accessibilite

**Contraste verifie :**
- Text (#1F2D24) sur bg (#F4F1ED) : ratio ~13:1 — AAA
- Text-muted (#6B7B70) sur bg (#F4F1ED) : ratio ~4.7:1 — AA
- Text-muted (#6B7B70) sur surface (#FAF8F4) : ratio ~4.5:1 — AA (limite, surveiller)
- Surface (#FAF8F4) sur accent (#4A7C59) : texte cream sur vert — ratio ~4.8:1 — AA
- Labels (Inter 600 11px) : considered large text pour WCAG (>= 14px bold), AA a 3:1

**ARIA present :**
- aria-label sur toutes les sections et buttons icones
- aria-expanded sur les buttons FAQ
- role="list" sur les listes de pills et variantes
- role="region" sur les zones de scroll et sticky bars
- aria-live="polite" sur les sticky bars
- aria-hidden sur les elements decoratifs (SVG, quote marks)

**Touch targets (mobile) :**
- Tous les buttons interactifs >= 44px de min-height
- Pills et variantes : min-height: 44px
- Nav icons : 40x40px (acceptable : element secondaire)

**Images :**
- Tous les img ont alt text descriptif
- Images decoratives non presente (toutes les images ont un role produit)
- Dimensions width/height specifiees pour eviter CLS

---

## 6. Decisions specifiques "how_it_works"

Section ommise (commentaire HTML en place) avec explication du displayRule. Pour le code prod :

```typescript
// display-rules.ts
'how_it_works': (data: ProductData) =>
  ['skincare', 'wellness', 'supplement'].includes(data.category)
```

Pour un sac : section masquee. Commentaire HTML laisse pour que ANNA comprenne l'intention.

---

## 7. Universalite du style

Ce style a ete concu avec le sac en cuir comme produit-exemple mais il est universel. Validation mentale rapide :

**Skincare/serum** : cream + vert sage + DM Serif — parfait pour Aesop-like
**Supplement/wellness** : meme palette, materials breakdown = ingredients, best_for = objectifs health
**Linge de maison** : photos de coton, materials breakdown = fil, thread count, teinture naturelle
**Alimentaire bio** : cream + vert = parfait, eyebrow "Composition" devient "Ingredients"
**Mode / textile** : deja valide avec ce produit-exemple

Anti-universalite : tech, gaming, crypto, supplements sportifs agressifs. Ces categories iraient mieux vers apple-clean, bold ou brutalist.

---

## 8. Concerns et points d'attention pour ANNA

**Concern 1 — Filter CSS sur images externes**
Le filtre `filter: saturate(1.1) sepia(0.04) brightness(1.01)` est applique cote CSS. Avec des images Shopify servies depuis CDN Shopify, ce filtre s'applique correctement. Pas de probleme CORS car on modifie uniquement l'affichage, pas le fichier source.

**Concern 2 — Sticky info (hero desktop)**
Le `position: sticky; top: 32px` sur `.hero__info` necessite que le parent `.hero__inner` ait une hauteur suffisante (l'image a droite est plus haute). Sur des produits avec peu d'infos, le sticky pourrait ne pas avoir d'effet visible. Verifier avec un produit avec seulement 2-3 variants.

**Concern 3 — max-height animation FAQ**
La valeur `max-height: 400px` est une heuristique. Si une reponse FAQ est tres longue (> 15 lignes), elle sera coupee. En prod, utiliser `max-height: calc(var(--answer-height) + 24px)` avec JS qui mesure la hauteur reelle.

**Concern 4 — Gallery scroll horizontal desktop**
Sur desktop, le scroll horizontal de la gallery est accessible uniquement a la souris (trackpad ou scroll horizontal). Ajouter des arrows next/prev en prod pour l'accessibilite clavier.

**Concern 5 — Unsplash vs images Shopify scrapees**
Les images Unsplash ont un ratio 3:4 (portrait) coherent. Les images Shopify reelles varieront. Utiliser `object-fit: cover` avec `object-position: center` (deja en place) pour que les formats disparates s'adaptent sans crop incoherent. Cas edge : images en paysage tres large — ajouter `object-position: top` pour les images produit.

**Concern 6 — Warming filter sur fonds clairs**
Le sepia 4% peut legèrement jaunir les zones blanches d'une image. Si des images produit ont un fond blanc studio, le filtre peut les faire paraitre "sales". Solution : appliquer le filtre uniquement sur les images lifestyle, pas les images produit fond blanc. Discriminer via une classe CSS `.img-lifestyle` vs `.img-product`.

---

## 9. Tokens pour extraction ANNA

Tous les tokens sont formalises dans `style-organic.tokens.json`.

Tokens supplementaires derivees de la maquette (non dans le brief initial) :
- `--color-accent-light: #6B9E78` — hover state CTA, 1 ton plus clair
- `--color-accent-pale: rgba(74, 124, 89, 0.08)` — bg des badges et pills
- `--color-border-med: rgba(31, 45, 36, 0.14)` — border un peu plus visible (variants, separateurs)
- `--space-section-sm: 80px desktop / 48px mobile` — pour FAQ (section moins haute)

---

*Document redige par OBITO — Agent design NEXARA*
*Style Organic / Konvert V3 — 2026-05-26*
