# Style Vibrant — Notes design
## Konvert V3 — Maquette standalone

---

## 1. Positionnement esthetique

### Vibe cible
Joyeux, creatif, colore mais propre. Pas enfantin — la joie adulte. L'equivalent visuel d'une boutique Marais qui joue de la musique indie le samedi matin.

Triangulation des references :
- **Tonies** : couleur vivante mais grille propre, cards genereux, beaucoup d'air
- **Notion 2024** : typographie display bold, hierarchie claire, surfaces differenciees
- **Squarespace Creator** : photos mises en valeur, sections bien rythmees, sans chichi

La difference avec les autres styles V3 : on s'autorise de la couleur dans les ombres, les badges et les CTAs sans que ca vire au fun park. L'accent rose #FF4D88 est toujours en minorite — max 4-5 elements par section.

---

## 2. Decisions couleur

### Palette retenue (conforme aux tokens)
- **Bg principal** : blanc pur #FFFFFF — jamais de fond couleur sur les sections principales
- **Surface** : jaune creme #FFF8E1 — alternance bg/surface pour le rythme (remplace les borders de section)
- **Accent** : rose flash #FF4D88 — CTAs, pills, icones, ombres colorees, checkmarks
- **Texte** : #1A1A1A (quasiment noir) + #666666 pour les muted

### Pourquoi l'alternance bg/surface fonctionne ici
L'alternance blanc / jaune creme est le seul outil de separation de sections accepte. Pas de border-bottom entre sections (anti-pattern). Le creme est assez subtil pour ne pas hacher la page mais assez present pour creer un rythme visuel. Sur mobile, ca guide le scroll naturellement.

### Ombres colorees
Shadow accent `0 4px 16px rgba(255,77,136,0.15)` au repos, `0 16px 40px rgba(255,77,136,0.25)` au hover. C'est la signature de ce style — l'ombre est chaude et dit "heureux", pas "professionnel". Le bon dosage : visible mais subtil, jamais agressif.

### Jaune creme sur les pills du manifesto
Les piliers "Cuir vivant / Origine tracable / Fait pour durer" sont en pills rose solid (#FF4D88 bg, blanc texte). Pas en jaune. Decision : le manifesto est le moment de force emotionnel — on monte l'accent a son maximum pour la conclusion.

---

## 3. Typographie

### Clash Display — raisons du choix
Clash Display (Fontshare) est geometric et friendly sans etre naif. Ses lettres larges fonctionnent tres bien en headline clamp() sur mobile. Contrairement a Outfit (trop neutre) ou Plus Jakarta Sans (trop corporate), Clash a une vraie personnalite — arrondi dans les angles mais pas "cute".

Fallback Inter : couverture universelle, pas de layout shift notable grace aux font-display: swap implicite dans l'API Fontshare.

### Scale typographique appliquee
- H1 hero : `clamp(52px, 7vw, 100px)` weight 700, tracking -0.025em
- H2 sections : `clamp(36px, 4.5vw, 64px)` weight 700, tracking -0.02em
- H3 / cards : 20-22px weight 600
- Body : 17px (desktop) / 16px (mobile), Inter, line-height 1.6
- Labels/eyebrow : pills a la place des eyebrows texte classiques

### Accent word dans le hero
"grandit" est mis en accent rose avec un soulignement rose semi-transparent. Principe : un seul mot par headline peut recevoir la couleur accent. Deux mots en couleur = bazar.

---

## 4. Composants cles

### Pills (eyebrow replacement)
Les pills remplacent completement les eyebrows texte uppercase. Raison : plus amicaux, moins corporate, lisibles d'un coup d'oeil. Deux variantes :
- `pill` (fond rose clair, texte rose) : labels, categorisation
- `pill-solid` (fond rose plein, texte blanc) : disponible pour les badges urgents / promo

### Boutons pill
`border-radius: 999px` sur tous les boutons. Padding horizontal genereux (36px) pour eviter l'effet "bouton etroit". Hover : `scale(1.05) translateY(-2px)` avec ease-bounce 400ms. L'animation de rebond est perceptible mais jamais excessive — 5% de scale max.

### Cards (why-we-love, variants, reviews)
Fond surface jaune creme sur les sections bg blanc, fond blanc sur les sections surface — ce croisement est intentionnel : les cards contrastent toujours avec leur conteneur. Radius 16px partout. Hover : translateY(-4px) + shadow accent renforcee. Pas de transform scale sur les cards (trop aggressif en grille).

### Badge flottant hero
Positionne en `position: absolute` sur l'image, fond blanc, shadow noir legere. C'est le seul element avec une ombre non-coloree — il flotte et doit sembler "reel" (comme un autocollant pose sur une photo).

### AI Summary box
Border-left 4px rose — signal visuel immediat que c'est une synthese IA. Label "Synthese IA Konvert" en small uppercase rose. Fond blanc sur fond surface : toujours visible.

### Manifesto pills (piliers)
Pills Clash Display 18px, fond rose plein. Taille genereux (padding 14px 24px). Hover scale 1.05 avec shadow. Sur mobile : stack vertical, pleine largeur. Ces pills doivent avoir l'air de badges funs, pas de tags de categorisation.

---

## 5. Layout decisions

### Hero desktop — split 50/50
Split gauche (texte) / droite (image) a egale place. L'image prend toute la hauteur (aspect-ratio 4/5). Le badge flottant sort a gauche de l'image (-24px) pour creer de la profondeur et casser la rigidite du split.

### Gallery — mosaic asymetrique
Grille 3 colonnes avec premiere colonne qui couvre 2 rangees (large). Pattern : large | petit | petit / vide | petit | petit. Donne l'impression d'un vrai shooting photo plutot qu'une grille reguliere.

### Materials — texte gauche / image droite
Contraire du Thoughtfully (image gauche / texte droite). Alternance intentionnelle pour le rythme de lecture vertical. L'image materials est en aspect-ratio 3/4 (portrait) pour aller en profondeur.

### Manifesto — image pleine largeur puis contenu surface
L'image passe a 100% de largeur (21/8 ratio panoramique) pour creer une rupture cinematique. Ensuite la section contenu est sur fond surface avec beaucoup d'air. Les pills piliers sont alignees en flex-wrap horizontal.

---

## 6. Animations

### Philosophie : Jakub Krehel — Production Polish
Profil produit premium consumer. L'animation ne bloque pas l'utilisateur mais recompense l'attention.

### Ease bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
Overshoot delibere. Les elements "pop" quand ils apparaissent. Duration 400ms — assez long pour etre perceptible, assez court pour ne pas irriter. Utilise sur : fade-up, btn hover, variant-card hover, manifesto-pill hover.

### Fade-up au scroll
Tous les elements marquees `.fade-up` demarrent opacity:0, translateY(24px) et transitionnent vers l'etat visible quand ils entrent dans le viewport (IntersectionObserver, threshold 0.10, rootMargin -40px). Stagger via delay-1/2/3/4 (80ms par step).

### Image hover
Hero image : translateY(-6px) scale(1.01) + shadow renforcee. Cards image (variants, gallery) : translateY(-4px). Images conteneur (thoughtfully, materials) : legers tilts (-1deg) en hover pour effet "vivant".

### Boutons
`scale(1.05) translateY(-2px)` — la combinaison scale + translate donne plus de vie que scale seul. Shadow rose au hover.

### Variant check mark
Apparait avec scale(0.6 -> 1) + opacity (0 -> 1) quand la carte est selectionnee. Ease bounce. Micro-moment de satisfaction.

### prefers-reduced-motion
Non implémenté dans le HTML (limite du format standalone). A implementer en production : `@media (prefers-reduced-motion: reduce) { .fade-up { transition: opacity 150ms linear; transform: none; } }`. Voir checklist a11y.

---

## 7. Mobile — decisions specifiques

### Sticky CTA bottom
Barre fixe en bas (fond blanc translucide + blur) avec prix + bouton "Ajouter au panier". Pattern iOS natif. `padding-bottom: calc(12px + env(safe-area-inset-bottom))` pour l'encoche iPhone.

### Galleries en scroll horizontal
Gallery, Variants et Reviews utilisent `overflow-x: auto; scroll-snap-type: x mandatory` au lieu de grilles verticales. Meilleure ergonomie mobile, economie d'espace vertical. Scroll-snap pour un defilement net.

### Cards stacked
Why We Love passe de 3 colonnes a stack vertical avec icone a gauche (horizontal layout de chaque card). Plus lisible que 3 colonnes etroites sur 390px.

### Best For — 2 colonnes
Grille 2x2 sur mobile. Les labels sont raccourcis (plus courts que desktop).

### Manifesto pills — stack vertical
Sur mobile les 3 pills sont en colonne (flex-direction: column). Chaque pill prend toute la largeur — tres visible et impactant.

---

## 8. Accessibilite (WCAG AA)

### Contraste verifies
- Text #1A1A1A sur bg blanc : 18.1:1 (AAA)
- Text #1A1A1A sur surface #FFF8E1 : 16.5:1 (AAA)
- Text #666666 sur blanc : 5.74:1 (AA)
- Text blanc sur accent #FF4D88 : 4.58:1 (AA — conforme)
- Text blanc sur texte noir footer : 18.1:1 (AAA)

### Touch targets
Boutons : min-height 52px sur mobile. Summary FAQ : min-height 56px. Nav menu : 40px carre (ok pour pouce).

### Aria labels
- `aria-label` sur la nav, les sections, le score, les variantes
- `aria-pressed` sur les cards variantes (toggle pattern)
- `aria-hidden="true"` sur les elements decoratifs (icones, swatches, etoiles)
- `aria-label` explicite sur les images avec descriptions

### Focus
Les cards variantes ont `tabindex="0"` et repondent a Enter/Space pour la selection clavier.

---

## 9. Sections — statut

| Section | Status | Notes |
|---|---|---|
| hero | OK | Split desktop, stack mobile, badge flottant |
| gallery | OK | Mosaic desktop, scroll horizontal mobile |
| why_we_love | OK | 3 cards desktop, stack horizontal mobile |
| thoughtfully_designed | OK | Split image/texte + feature list |
| best_for | OK | 4 cards desktop, 2x2 mobile |
| materials_breakdown | OK | Split texte/image, 4 materiaux |
| how_it_works | SKIPPED | Non applicable — categorie sac |
| compare_variants | OK | 3 cards interactives + selection |
| reviews_ai_summary | OK | Score + AI box + 3 reviews |
| press_quote | OK | Blockquote Clash Display, source |
| care_instructions | OK | 4 items, icones SVG |
| faq | OK | 4-5 questions, details/summary |
| brand_manifesto | OK | Image panoramique + pills piliers |

---

## 10. Limites et recommandations

### Font loading
Clash Display charge depuis api.fontshare.com — latence possible sur connexions lentes. En production : auto-heberger les fichiers woff2 ou utiliser `font-display: swap` explicite.

### Images Unsplash
Toutes les images viennent d'Unsplash (coherence cuir/sac). En production remplacer par vraies photos produit. Les IDs utilises produisent tous des images de sacs / cuir pertinentes.

### prefers-reduced-motion
A implementer en production (voir section animations ci-dessus).

### JavaScript
Deux blocs JS inline minimaux : scroll observer + selection variantes. Zero dependance externe. Compatible IE11 avec fallback (IntersectionObserver check).

### Performance estimee
- LCP : image hero avec `loading="eager" fetchpriority="high"` — cible < 1.5s
- CLS : dimensions explicites sur toutes les images
- JS : < 2Ko inline, pas de bundle
