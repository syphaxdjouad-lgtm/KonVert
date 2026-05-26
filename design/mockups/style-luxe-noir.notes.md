# Notes design — Style Luxe Noir
**Konvert V3 / OBITO / NEXARA — 2026-05-26**

---

## 1. Intention design

Le style "Luxe Noir" vise la crédibilité des maisons de joaillerie et d'horlogerie haut de gamme (Cartier, Audemars Piguet) appliquée au DTC e-commerce. La contrainte centrale : obtenir un résultat **sombre mais chaleureux**, jamais froid ni cyber. C'est la différence entre un écrin de velours noir et un écran de terminal.

---

## 2. Discipline anti-noir-pur (feedback NEXARA)

Le feedback mémoire NEXARA interdit le noir pur comme fond dominant. Ce style est l'unique exception documentée — mais une exception avec contraintes strictes :

- **#000000 est interdit**. Le fond dominant est `#14110F` — un warm dark brun-noir avec une légère dominante rouge-brun (Hue ~30deg). Ce choix vient de l'étude des palettes Cartier : jamais de noir froid.
- **Deux niveaux de surface** : `#14110F` (BG principal) et `#1F1B17` (surface secondaire, sections alternées). La différence est de ~12% de luminosité — assez pour créer la hiérarchie, pas assez pour créer les "cases" interdites.
- **Zéro border de séparation entre sections**. La transition BG/surface suffit à créer la structure.
- **Le texte est cream `#F5F0E8`** — pas blanc pur. Le blanc pur sur noir chaud crée un contraste trop agressif qui détruit l'atmosphère luxe. Le cream atténue la tension tout en conservant WCAG AA (ratio calculé : ~14:1 sur #14110F).

---

## 3. Palette et justifications

### Couleur de fond : #14110F (warm dark)
- HSL : 25deg, 15%, 7%
- Pas du noir pur. La légère saturation warm empêche le côté "écran d'ordinateur" et crée l'atmosphère "écrin de velours".
- Référence directe : fond de page Cartier.com (brun-noir warm, jamais #000).

### Surface secondaire : #1F1B17
- HSL : 30deg, 10%, 11%
- Delta luminosité avec le BG : ~4%. Imperceptible en scan rapide mais lisible en comparaison directe.
- Utilisé pour : galerie, features grid, reviews, FAQ — les sections "dense content".

### Accent or : #C9A84C
- HSL : 40deg, 53%, 55%
- Or chaud, ni trop jaune (criard), ni trop brun (terne). Ratio de contraste sur fond dark : ~7:1. WCAG AAA.
- Usage strict : max 4-5 éléments par page. CTAs, overlines, séparateurs, badges, numéros de matériaux, piliers manifesto. Jamais en arrière-plan large.
- La règle des 60-30-10 est appliquée : 60% texte cream/muted, 30% surfaces dark, 10% or.

### Texte principal : #F5F0E8 (cream warm)
- Contraste sur #14110F : ~14:1. WCAG AAA.

### Texte muted : #A89E91
- Contraste sur #14110F : ~5.2:1. WCAG AA large text.
- Utilisé pour : descriptions, sous-titres, corps de texte secondaire.

### Border : rgba(245, 240, 232, 0.1)
- Border neutre — subtilement visible, jamais opaque.
- La border ne sépare pas, elle définit la matière.

### Border gold : rgba(201, 168, 76, 0.3)
- Utilisée uniquement sur hover/active/focus. Jamais au repos.
- Crée le glow doré sans l'appliquer en permanence.

---

## 4. Typographie

### Playfair Display — headings
- Serif dramatique à fort contraste de fûts. Référence directe : typographie Cartier.com, Mejuri.
- Weights utilisés : 400 italic (taglines, press quotes), 600 (sous-titres sections), 700 (H2 sections), 800 (manifesto headline).
- Letter-spacing : -0.03em à -0.04em sur les grands titres. Resserre visuellement pour le côté "haute horlogerie".
- Line-height : 1.08-1.15 pour les grands formats. Compressé intentionnellement — le luxe n'a pas peur du dense.

### Inter — body
- Sans serif neutre, ne concurrence pas le Playfair. Rôle : lisibilité pure.
- Weights : 300 (captions légères), 400 (body), 500 (labels), 600 (boutons, overlines).
- Font-size minimum : 12px (overlines et légales). Body : 14-16px.
- Letter-spacing overlines : 0.12-0.18em — trace de tradition typographique joaillerie.

---

## 5. Espacement et mise en page

### Section spacing : 140px (desktop), 72px (mobile)
- Les maisons de luxe respirent. L'espace est un signal de valeur, pas du vide.
- Référence Audemars Piguet : sections séparées par 120-160px de blanc/noir.

### Grid desktop : 2 colonnes asymétriques pour hero, gallery, why, materials, reviews
- Le pattern "image gauche / texte droit" est le standard joaillerie depuis des décennies.
- Gallery : grille 1.6fr + 1fr + 1fr. Le layout asymétrique signale l'éditorial vs le catalogue.

### Radius : 2px (cards), 0px (boutons)
- Presque vif. Un soupçon d'arrondi évite le côté "brutalist" mais reste très proche du carré — référence horlogerie et maroquinerie haut de gamme.
- 0px sur les boutons : la sobriété maximale pour les calls-to-action.

---

## 6. Traitement des images

Toutes les images reçoivent `filter: brightness(0.85-0.88) saturate(0.9)` via CSS.

### Justification
- La cohérence de luminosité entre des images de sources hétérogènes est le signal le plus fiable d'un design professionnel vs amateur.
- La désaturation légère (-10%) atténue les divergences colorimétriques et pousse vers une palette warm cohérente avec le fond.
- La règle Konvert V3 "images du produit scrapé, pas hardcodées" est respectée — les filtres CSS permettent d'homogénéiser n'importe quelle image produit automatiquement.

### Section Press
- Double assombrissement : `brightness(0.22) saturate(0.7)` + overlay rgba gradient.
- Crée un plein-écran dramatique sans perdre la lisibilité de la quote Playfair.

---

## 7. Effets et animations

### Hover cards : box-shadow glow doré
```css
box-shadow: 0 0 24px rgba(201, 168, 76, 0.3);
```
Le glow est **subtil et warm**. Pas un néon — une auréole. Référence : vitrines joaillerie avec éclairage directionnel sur les pièces.

### Image zoom au hover : transform scale(1.03-1.05)
Signale l'interactivité sans agressivité. Duration 500ms avec ease cubic-bezier(0.4, 0, 0.2, 1).

### Hero image : zoom lent au hover
Transition 8s — quasi imperceptible mais crée une "vie" sur la photo héro sans distraction.

### Scroll reveal : IntersectionObserver + classe `.reveal`
Décalages de 100ms entre éléments voisins (stagger). Seuil 8% viewport — déclenché tôt pour une fluidité apparente.

### Philosophie motion : Jakub Krehel (polish production)
Chaque micro-interaction est soignée. Spring physics non utilisées ici (CSS only, pas de JS library) — les transitions sont linéairement améliorées par l'easing cubic-bezier.

### Prefers-reduced-motion
Toutes les animations et transitions sont désactivées à 0.01ms si l'utilisateur a activé "réduire les animations" dans son OS.

---

## 8. Sections : décisions et déviations

### Hero : split 50/50 (image gauche / contenu droit)
Choix conscient vs le hero centered habituel. Justification : les maisons de joaillerie mettent TOUJOURS la photo en position dominante, le texte en position secondaire. Le produit prime.

### Gallery : grille asymétrique desktop, scroll horizontal mobile
Desktop : layout éditorial — une grande image + 4 petites. Mobile : scroll natif snap — le pattern le plus efficace UX mobile pour les galeries produit en 2026.

### Materials : cartes avec numéros 01/02/03
Référence directe Allbirds qui numérote ses matériaux. Signal de transparence et de rigueur.

### Press : full-bleed dramatique
Section signature du style. La quote Playfair italic grande taille sur fond photo assoumbri est le pattern le plus fort pour créer une rupture de rythme dans le scroll. Utilisée une seule fois — l'effet resterait intact.

### Manifesto : headline 80px bold + 3 piliers avec ligne or
La section finale doit avoir l'impact d'une pleine page de magazine. Le headline "Concu pour celles qui savent" avec l'italique sur "savent" — Playfair italic sur ce mot change le sens de la phrase.

### how_it_works : skip (conforme au brief)
Section réservée aux produits d'action (sérum, supplément). Un sac n'a pas de "mode d'emploi".

### Sticky CTA mobile uniquement
Price + bouton fixé en bas de viewport. Pattern Mejuri, Ridge, toutes les marques DTC premium mobile. Desktop n'a pas de sticky — le hero reste visible et la page est moins longue.

---

## 9. Accessibilité

- Contraste texte/#14110F : ~14:1 (WCAG AAA)
- Contraste texte-muted/#14110F : ~5.2:1 (WCAG AA)
- Contraste accent/#14110F : ~7:1 (WCAG AAA)
- aria-label sur tous les éléments interactifs
- role="group", role="list", role="listitem" sur les éléments de regroupement
- aria-expanded dynamique sur les accordéons FAQ
- aria-pressed sur les cartes variantes
- :focus-visible avec outline doré 2px
- Aucune information transmise par la couleur seule (les swatches ont des labels texte)

---

## 10. Anti-patterns évités

| Anti-pattern | Solution appliquée |
|---|---|
| Noir pur #000 en fond | #14110F warm dark |
| Alternance fond clair/foncé entre sections | Surface de base + surface secondaire proches, jamais alternées sur toute la page |
| Borders de section visibles | Zéro border entre sections. Séparation par spacing uniquement |
| Accent néon "gamer" | Or chaud #C9A84C — chaleur, pas cyber |
| Cards avec borders colorées en permanence | Border transparente au repos, or sur hover uniquement |
| Accent sur trop d'éléments | Max 5 éléments: overlines, CTA, separateurs, badges, numéros matériaux |
| Typographie trop petite | H1 clamp(42px, 4vw, 64px) desktop — manifesto 80px |
| Images placeholders | Vraies URLs Unsplash, même catégorie visuelle (sac en cuir, lifestyle nocturne) |
| Section spacing trop court | 140px desktop, 72px mobile |

---

## 11. Notes pour ANNA (implémentation Next.js/Tailwind)

- Le `filter: brightness(0.88) saturate(0.9)` doit être appliqué via une classe Tailwind custom ou une utility CSS globale — pas hardcodé sur chaque `<img>`.
- La gallery mobile scroll horizontal sera un composant avec `useRef` + scroll tracking pour les dots.
- Le sticky CTA mobile : `position: fixed` conditionnel — uniquement si `window.innerWidth < 768`. Sur desktop, pas de sticky.
- FAQ accordion : `max-height` transition CSS suffit. Pas de Framer Motion nécessaire pour ce composant.
- Le hover glow des cards : `transition: box-shadow 180ms` — côté Tailwind, une utility custom `hover:shadow-gold`.
- Le `clamp()` sur les font-sizes est obligatoire pour le responsive naturel entre 768px et 1280px.
- Gallery desktop : CSS Grid suffit. Pas de bibliothèque slider.

---

## 12. Comparaison avec style "Soft"

| Paramètre | Soft | Luxe Noir |
|---|---|---|
| Fond | #FAF7F2 cream | #14110F warm dark |
| Heading font | Cormorant Garamond | Playfair Display |
| Accent | or discret | or dominant (#C9A84C) |
| Ambiance | lumière du matin | nocturne velours |
| Radius | 6px | 2px |
| Sections | espacement généreux 120px | espacement dramatique 140px |
| Photos | naturelles, bien éclairées | assombries, dramatiques |
| Public perçu | bijoux milieu de gamme, beauté | joaillerie premium, maroquinerie luxe |
