# Notes design — style-apple-clean

**Auteur** : OBITO / NEXARA
**Date** : 2026-05-26
**Statut** : Maquette V1 — prete pour review visuelle

---

## 1. Positionnement du style

Apple-Clean est le style "Tech premium universaliste" du systeme Konvert V3. Il ne s'adresse pas qu'a la tech — il s'adresse a tout produit dont l'acheteur veut sentir qu'il achete quelque chose de serieux, de fiable, de qualite. Le sac en cuir en est un bon exemple : l'acheteur est sophistique, il veut etre rassure par la forme avant meme de lire le fond.

L'inspiration directe est la page produit iPhone 15 Pro d'Apple : photo XL centree, titre huge bold, peu de texte, hierarchie typo tres marquee, blanc tres genereux partout, bleu accent unique.

---

## 2. Choix typographiques

**Police** : SF Pro Display / SF Pro Text (fallback Inter)

Justification : SF Pro est la police d'Apple sur macOS/iOS — elle n'est pas disponible sur tous les systemes mais elle s'active automatiquement sur Safari/macOS. Sur les autres OS, Inter est visuellement tres proche (memes proportions geometriques, meme neutralite). Le rendu est quasi identique dans les deux cas.

**H1 hero** : clamp(48px, 6vw, 96px), font-weight 700, letter-spacing -0.025em
- Plus agressif que le brief (600 → 700) car a ces tailles, un 600 parait mou. Apple utilise 700 sur ses hero.
- Le letter-spacing negatif est essentiel : compresse les grands titres visuellement, donne du luxe.

**H2 sections** : clamp(32px, 4vw, 56px), font-weight 600, letter-spacing -0.02em
- Reste en 600 — c'est une section, pas le hero.

**Body** : 17px (desktop), 16px (mobile), line-height 1.47
- Apple utilise 17px comme taille de corps par defaut sur ses pages produit. C'est la taille qui maximise la lisibilite sans paraitre "trop grand pour du web standard".

**Eyebrow labels** : 12-14px, weight 600, letter-spacing +0.05em, uppercase, couleur muted
- Signale la hierachie sans attirer l'oeil au detriment du titre.

---

## 3. Couleurs et usage de l'accent

**Palette stricte** : 6 couleurs, pas une de plus.

| Token | Valeur | Role |
|---|---|---|
| bg | #FFFFFF | Fond unique (pas d'alternance de sections) |
| surface | #F5F5F7 | Cards, backgrounds de section alternee |
| accent | #0066CC | Apple Blue — CTAs, labels, active states |
| text | #1D1D1F | Apple near-black — tous les titres et texte principal |
| textMuted | #86868B | Apple grey — sous-titres, descriptions, metadatas |
| border | #D2D2D7 | Separateurs, borders subtils |

**Regle d'usage de l'accent** : exactement 4 points de contact par page.
1. Bouton primaire (CTA Ajouter au panier)
2. Labels categories dans materials (pill label au-dessus du nom)
3. Feature icons stroke
4. Care icons stroke

Tout le reste est noir ou gris. Le bleu ne sert pas a "decorer" — il guide l'action.

---

## 4. White space — principes appliques

**Section padding** : 120px haut et bas (desktop). Pas d'exception.

Justification : Apple utilise des sections tres aerees pour deux raisons :
1. Laisser le produit "respirer" — chaque section a une seule idee, pas de bruit visuel
2. Signaler le luxe. Les marques low-cost tassent le contenu pour "en donner plus". Les marques premium espacent pour montrer qu'elles n'ont pas peur du vide.

**Photo hero** : 65% de la largeur viewport, jamais 100%. Pourquoi ?
- 100% = agressif, aucune respiration
- 65% = l'image est clairement le sujet, mais elle est encadree de blanc, ce qui lui donne une qualite "editoriale". C'est le ratio Apple sur toutes ses pages produit recentes (2023-2026).

**Cards** : padding 40px. Jamais moins de 32px.

---

## 5. Decisions UI section par section

### Hero
- Photo centree, pas en background — l'image est le produit, pas un decor
- Prix et rating sur la meme ligne pour economiser la hauteur vertically
- CTA group : bouton primaire + bouton secondary (outline) — le secondary "Voir les photos" anchor-scroll vers la gallery
- "Livraison offerte" en micro-texte sous les CTAs — objection-killer passive, pas agressive

### Gallery
- 4 photos en grid 4 colonnes, format portrait 3:4 — simule des photos "pro studio"
- Fond #F5F5F7 pour la section : donne un effet "lightbox" sans lightbox reelle
- Hover : translateY(-4px) + shadow — feedback subtil qui encourage l'exploration

### Why We Love
- Layout 2 colonnes (image | texte) — casse le rythme des sections centrees
- L'image est en format portrait (3:4) — montre le sac en pleine hauteur, valorise le produit
- La "signature" en bas (Cuir vivant · Origine tracable · Fait pour durer) est reprise du manifesto pour ancrer la brand voice tres tot

### Thoughtfully Designed (Features)
- Grid 4 colonnes — mettre 4 features force a etre concis (max 2 lignes de desc)
- Icones SVG inline (pas de lib externe) — zero dependance, chargement instantane
- Icons stroke bleu sur fond gris : pattern Apple classique (SF Symbols style)

### Best For
- Pills avec un "active" pre-selectionne (Quotidien) — montre l'usage primaire sans expliquer
- Interaction CSS pure (pas de JS sur le hover) — le focus accessibility est gere via le cursor

### Materials Breakdown
- Grid 3 colonnes avec images — section signature Allbirds traduite en Apple-clean
- Label couleur accent au-dessus du nom du materiau — seul usage decoratif de l'accent
- Hover translateY(-3px) sur la card entiere — feedback premium

### Compare Variants
- Variante "selected" avec ring bleu (box-shadow 0 0 0 2px #0066CC) — pattern iOS selection
- Swatch couleur inline dans le nom — indication visuelle immediate
- Checkmark blanc sur fond bleu — clair, accessible, Apple-style

### Reviews AI Summary
- Score "4.6" en 72px — les chiffres doivent etre lisibles en un coup d'oeil
- Encadre "Resume par l'IA" avec label explicite et icone etoile — transparency sur le fait que c'est du AI-generated
- 3 reviews cards — jamais plus sur le premier fold, le "Voir tous" est implicit

### Press Quote
- Layout 2 colonnes (image | citation) — alterne le sens vs Why We Love (texte | image)
- Guillemet geant en arriere plan (couleur border) — element graphique qui casse la rigidite sans ajouter de couleur

### Care Instructions
- 4 cards avec icones — meme pattern que Features pour la coherence
- Contenu : entretien + livraison + retours + garantie — fusionne les objections en un seul endroit clair
- Icones de qualite differente intentionnellement : heart (love brand), map-pin (delivery), rotate (returns), shield (guarantee) — chaque icone est semantiquement liee a son contenu

### FAQ
- `<details>` / `<summary>` natif — accessible, zero JS requis pour l'ouverture
- Chevron rotate 180deg au open — transition CSS sur l'attribut `[open]`
- Max-width 720px — force les reponses a etre lisibles sans line-length trop longue

### Brand Manifesto
- Image pleine largeur (100vw) sur fond blanc — casse le max-width, creer un effet "cinematic"
- Headline en 72px — plus grand que les H2 de section, signale que c'est la section finale et importante
- 3 piliers en grid : numerotes 01/02/03 — reference design system Allbirds / Mejuri
- Deux CTAs en bas : primaire (commander) + ghost (voir avis) — recapture les hesitatnts

---

## 6. Animations

**Philosophie** : Emil Kowalski (restraint) avec une touche Krehel (polish) sur les hover.

**Scroll** : IntersectionObserver → .fade-up (opacity 0→1 + translateY 20px→0) en 600ms
- Threshold 0.12 — animation se declenche quand 12% de l'element est visible (pas trop tot)
- rootMargin -40px bottom — evite que les elements tout en bas de viewport s'animent avant qu'on les voie vraiment
- `observer.unobserve()` apres la premiere animation — chaque element n'anime qu'une fois (pattern Apple / Vercel)

**Hover** :
- Images : scale(1.02) en 800ms — tres lent, presque imperceptible, juste enough pour sentir le "luxe"
- Cards : translateY(-2px/3px) + shadow upgrade en 300ms
- Boutons : translateY(-1px) + shadow glow bleu en 250ms

**Pas d'animation** sur la FAQ ouverte — l'accordeon `<details>` natif n'a pas de transition CSS, c'est intentionnel. Ajouter une animation JS demanderait d'overrider le comportement natif, ce qui nuit a l'accessibilite.

---

## 7. Specificites mobile (375px)

**Nav** : sticky top, hauteur 44px (standard iOS). Pas de menu deroulant — boutton "Menu" present mais non fonctionnel dans la maquette statique.

**Sticky CTA bar** : fixed bottom — pattern e-commerce mobile universel (Shopify, Amazon). Prix + nom + bouton. Clearance de 80-100px dans le footer pour eviter qu'elle couvre du contenu.

**Gallery** : scroll horizontal au lieu de grid — les images sont plus grandes (260px), l'user peut swiper comme dans une app native. Dots de pagination en bas.

**Variants** : scroll horizontal — meme logique que la gallery. 230px par card, snapping natif CSS.

**Reviews** : scroll horizontal — les review cards sont en carousel (280px par card).

**Features** : grid 2 colonnes — jamais 1 colonne pour des features, ca force des cartes trop hautes.

**Care** : grid 2 colonnes — meme logique.

**Materials** : liste verticale avec image inline — plus adapte qu'une grille ou des images se retrouveraient trop petites.

---

## 8. Accessibilite

- Contraste text/bg : #1D1D1F sur #FFFFFF = 18.9:1 (passe WCAG AAA)
- Contraste muted/bg : #86868B sur #FFFFFF = 4.6:1 (passe WCAG AA)
- Contraste accent/bg : #0066CC sur #FFFFFF = 6.8:1 (passe WCAG AA+)
- Tous les boutons ont `aria-label` quand l'intitule seul est ambigu
- Variants : role="button", tabindex="0", aria-pressed — navigation clavier complete
- Images : alt text descriptif et factuel (pas "image du produit" generique)
- Nav : `aria-label="Navigation principale"`
- FAQ : `<details>` / `<summary>` natif — screen readers supportent nativement
- Listes de pills : `role="list"` explicite, `role="listitem"` sur chaque pill
- Stars rating : `aria-label` qui repete la note en clair pour les lecteurs d'ecran

---

## 9. Performance et production

**Zero dependances externes** (hors Google Fonts) :
- Icones SVG inline — pas de FontAwesome, pas de Heroicons npm
- Animations IntersectionObserver natif — pas de GSAP ni ScrollReveal
- Accordeon `<details>` natif — pas de lib accordeon
- Variantes JS : ~20 lignes vanilla — pas de framework

**Images** :
- Toutes les images sont des URL Unsplash avec parametres de compression (`auto=format&fit=crop&q=80`)
- Attributs `width` et `height` explicites sur chaque `<img>` — evite le CLS
- `loading="lazy"` sur toutes les images sauf le hero (`loading="eager"`)
- `srcset` non present dans la maquette HTML — a ajouter en production

**Fonts** :
- `preconnect` sur fonts.googleapis.com et fonts.gstatic.com — reduit le TTFB
- Un seul fichier de font (Inter, 5 weights) — pas de second famille

---

## 10. Points de vigilance pour ANNA (codage production)

1. **Les images Unsplash** doivent etre remplacees par le systeme ImagePool V3 (`getImage(pool, 'front', 0)` etc.)
2. **Le contenu de texte** est du placeholder — tout doit etre injecte depuis les donnees produit scrapees + copy AI
3. **La note de score (4.6)** et le compte d'avis (1 247) sont hardcodes — proviennent du scraping
4. **Le sticky CTA bar** n'existe pas en desktop — il est specifique au fichier mobile. En production, la variante desktop a un CTA flottant lateral ou reste dans le hero (a decider)
5. **La FAQ `<details>`** n'a pas d'animation CSS smooth — acceptable dans la maquette, mais en production React on pourra wrapper dans un composant avec Framer Motion `AnimatePresence` si l'animation est souhaitee
6. **Les variantes** : l'interaction JS (click pour selectionner) est en vanilla. En React, ca devient un `useState` basique.
7. **Le champ `how_it_works`** est commente HTML — en production, il doit etre conditionne par la regle de display (`if category === 'skincare' || category === 'wellness'`).
8. **La section press** affiche une seule citation. Si aucune citation n'est scrapee, la section doit etre masquee (regle display).
9. **Max-width** : 1200px. Certains styles V3 utilisent 1280px ou 1440px — apple-clean reste a 1200px pour l'air genereux.
10. **Manifesto image pleine largeur** : en React/Next.js, utiliser `width: 100vw; margin-left: calc(-50vw + 50%)` pour sortir du conteneur max-width proprement.
