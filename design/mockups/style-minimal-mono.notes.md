# Notes design — Style Minimal Mono
## Konvert V3 — Maquette standalone

---

## Identite du style

**Minimal Mono** est le style le plus universellement applicable de la suite V3. Il ne raconte pas d'histoire particuliere — il s'efface pour laisser le produit parler. Un blanc de page, une typographie Inter tres bien dosee en weights, des borders fines #E5E5E5, aucune decoration parasite.

Vibe cible reussie : MUJI x Apple noir et blanc x Kinfolk. Fonctionnel et silencieux.

---

## Decisions typographiques

### Une seule famille — Inter
Contrainte de spec respectee a la lettre. La hierarchie repose entierement sur les weights :
- `font-weight: 300` — titres principaux H1 et H2. Choix volontairement contre-intuitif : la legerte des gros titres cree l'elegance. Pas besoin de gras pour dominer a 64px.
- `font-weight: 400` — body, descriptions, contenu courant
- `font-weight: 500` — labels, eyebrows, elements UI (boutons, spec keys)
- `font-weight: 700` — reserve aux cas d'urgence (non utilise dans ce design)

### Letter-spacing
- H1 : -0.03em — compense le crennage Inter sur les grandes tailles
- H2 : -0.02em — idem
- Eyebrows/labels : +0.08 a +0.12em — micro-caps lisibles

### Taille body : 16px
Pas 17px (Apple) ni 18px (editorial). 16px est le standard web universel — cohere avec la posture "standard" du style.

---

## Decisions couleur

Strictement noir/blanc/gris. Zero couleur autre.

- `#000000` — texte et accent (boutons primaires, check marks, bars)
- `#FAFAFA` — surface (cards, panels). Tres legerement off-white — invisible a l'oeil mais casse la platitude du blanc pur sur fond blanc
- `#737373` — muted text. Gris moyen, contraste WCAG AA sur blanc (ratio ~4.8:1)
- `#E5E5E5` — borders. Gris tres clair — structure sans peser

### Manifesto section
La seule inversion : section fond noir `#000000`, texte blanc. Cree un point d'ancrage visuel fort sans introduire de couleur.

---

## Decisions spatiales

### Section padding : 120px
Spec respectee. A cette echelle, les sections "respirent" naturellement — pas besoin de border ou de fond colore pour les separer. L'espace blanc EST la separation.

### Dividers entre sections
Ligne `border-top: 1px solid #E5E5E5` entre chaque section. Alternative a l'alternance fond — elle structure sans colorer.

### Gap 2px entre elements de grille (gallery, designed-grid)
Le 2px cree un effet de "grille couture" — joints quasiment invisibles mais perceptibles. Referentiel MUJI et Apple Store en physique.

---

## Anti-patterns evites

Chaque item verifie :
- Pas d'alternance de fonds entre sections — un seul fond blanc
- Pas de borders solides colorees sur les cards — fond #FAFAFA suffit
- Pas de shadow au repos — uniquement `0 4px 12px rgba(0,0,0,0.06)` au hover
- Pas d'accent colore — `#000000` strict
- Pas de radius > 4px — minimaliste mais pas zero (antialiased corners)
- H1 a 40px minimum (clamp), 72px max — pas timide
- Accent utilise avec parcimonie : boutons, check marks, barres materiaux, manifesto section

---

## Decisions structurelles par section

### Hero
Layout 50/50 image / contenu. Image a gauche — convention de lecture occidentale, le regard arrive d'abord sur l'image. Badge "cuir pleine fleur" en version minimaliste (border 1px, pas de couleur de fond). Specs produit en tableau de lignes — pattern information-dense sans etre charge.

### Gallery
Grille 3 colonnes avec gap 2px. Colonne main (2fr) a gauche pour donner le rythme. Images auto-zoomees au hover (scale 1.02) — subtil.

### Why We Love
Layout sticky/scroll. Colonne gauche avec numero surdimensionne (80px, weight 300, couleur #E5E5E5) — clin d'oeil MUJI catalogue. Items numerotes 01-05 avec borders fines entre chaque.

### Thoughtfully Designed
Grille 2x2 alternant panels info et images. Gap 2px — joint couture. Les panels info ont un fond #FAFAFA, les images saignent sans padding.

### Best For
3 cartes sur fond #FAFAFA. Icons SVG minimalistes dans un cadre 32x32 a border fine. Pas de couleur dans les icones — stroke noir.

### Materials Breakdown
Barres de progression a 1px d'epaisseur — ultra-minimal. Pas de hauteur type "progress bar" habituelle de 4-8px. Choix de design : a 1px, la barre devient un element typographique plus qu'un widget UI.

### Compare Variants
Tableau HTML semantique (thead/tbody, scope, aria-label). check-mark circulaire noir, dash-mark 1px gris. Badge "Bestseller" en petit caps avec border.

### Reviews AI Summary
Score en typographie 300-weight (72px) — chiffre comme element design. Barres de rating a 1px. AI Summary encadre (border 1px) avec badge "Resume IA" en micro-caps.

### Press Quote
Guillemet en 80px weight 300 couleur #E5E5E5 — element purement visuel, non lu. Citation en weight 300. Simple, sobre.

### Care Instructions
4 cartes en grille horizontale. Icons SVG outline, 24px, stroke 1.5px. Pattern MUJI notice entretien.

### FAQ
Accordeon avec toggle +/− en pur CSS (::before/::after). Animation max-height. Aria-expanded pour l'accessibilite.

### Brand Manifesto
Seule section fond noir. Titre weight 300 blanc. Body en rgba(255,255,255,0.55) — texte "en retrait". Bouton blanc sur noir. Court, factuel : "La forme suit la fonction."

---

## Mobile — decisions specifiques

### Navigation
Logo + bouton panier. Pas de menu hamburger — le scroll vertical suffit pour une page produit.

### Hero
Image pleine largeur en haut (aspect 4:5), puis contenu en dessous. Stack vertical classique — zero friction.

### Sticky CTA Bottom
Barre fixe en bas avec nom produit, prix et bouton "Ajouter". Se masque (translateY 100%) quand les boutons hero sont visibles — evite la redondance.

### Sections horizontales scrollables
Gallery, Best For, Care : scroll horizontal avec `overflow-x: auto; scrollbar-width: none`. Swipeable nativement sans JS supplementaire.

### Compare Variants
Scroll horizontal contenant le tableau a largeur fixe 600px. Meilleure UX que de compresser 4 colonnes sur 390px.

### Typographie mobile
H1 : clamp(32px, 9vw, 40px). Body 15px. Espacement sections 72px (vs 120px desktop) — l'espace reste genereux sur mobile sans etre excessif.

---

## Accessibilite — WCAG AA

- Tous les textes couleur muted (#737373 sur #FFFFFF) : ratio 4.81:1 — passe AA
- Texte principal (#000000 sur #FFFFFF) : ratio 21:1 — parfait
- Texte blanc sur noir manifesto : ratio 21:1
- Focus-visible : outline 2px solid #000, offset 4px
- Stars en aria-label explicite ("4.6 sur 5 etoiles")
- check-mark et dash-mark en aria-label ("Oui" / "Non")
- Images : alt text descriptif sur toutes
- FAQ : aria-expanded + aria-controls
- Tables : scope="col", aria-label sur le tableau
- Navigation : aria-label="Navigation principale"
- Sections : aria-labelledby pointant vers les titres h2

---

## Performance

- Fonts Google : preconnect + display=swap
- Hero image : loading="eager" — au-dessus de la ligne de flottaison
- Toutes les autres images : loading="lazy"
- width/height explicites sur chaque img — evite CLS
- Aucune librairie externe
- Animations uniquement sur opacity et transform — GPU, pas de layout thrashing
- IntersectionObserver pour les fade-up — pas de scroll listener lourd

---

## Ce que ce style peut habiller

Le style Minimal Mono est compatible avec n'importe quel produit sans modification de tokens :
- Electronique premium (ecouteurs, montres)
- Mode et maroquinerie
- Cosmetiques et soins
- Deco et maison
- Nourriture premium / gastronomie
- Accessoires sport haut de gamme

Il est deliberement neutre. Aucune decoration n'evoque un univers particulier. C'est sa force et sa limite : il ne surprend pas, il rassure.

---

## Concerns et limites

1. **Monotonie du gris** — Sur des produits tres colores, le style peut creer une dissonance entre la photo produit saturee et le fond desature. Compenser en veillant a des photos produit sur fond blanc/neutre.

2. **Differentiation faible entre sections** — Sans couleurs de fond alternees, les sections peuvent sembler fusionner sur les longs scrolls. Le 120px de padding section est crucial — ne pas reduire.

3. **Pas de personnalite forte** — Par construction. Les marques qui veulent s'affirmer avec un caractere fort choisiront Editorial, Organic ou Luxe Noir. Minimal Mono est pour les marques qui veulent que le produit prime.

4. **Weight 300 sur petits ecrans** — Inter 300 en dessous de 14px peut souffrir sur des ecrans basse resolution. Sur mobile, le body est remonte a 15px et les titres H3 utilisent 500. A surveiller sur devices Android mid-range.
