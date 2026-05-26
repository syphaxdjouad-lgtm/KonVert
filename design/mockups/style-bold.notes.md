# Notes design — Style Bold
**Produit-exemple** : Sac a bandouliere en cuir vintage, 79 EUR, 4.6/5 (1247 avis)
**Date** : 2026-05-26
**Auteur** : OBITO / NEXARA

---

## 1. Philosophie de direction

Le style Bold emprunte a trois univers DTC americains qui ont redefinit ce que "cool avec de l'argent" veut dire : Olipop (energie sans artifice), Liquid Death (subversion avec substance), Chamberlain Coffee (personnalite jeune mais credible). Ce n'est pas du brutalisme pur — c'est du neo-brutalisme soft, c'est-a-dire que les ombres offset et les bordures dures coexistent avec des radius genereux (20px) et une palette propre. Le resultat est jeune et confiant sans etre agressif.

La cle de lecture est la suivante : l'accent rose (#FF2277) est utilise avec parcimonie — maximum 3 a 4 elements par section — pour conserver son pouvoir de rupture. Le fond peche pale (#FFF5E6) intervient sur les sections paires pour creer un rythme sans recourir aux bordures de section (anti-pattern eliminee).

---

## 2. Decisions couleur

**Fond blanc #FFFFFF** : base propre qui laisse les ombres offset respirer. Un fond gris aurait attenuer l'effet hardline.

**Surface peche #FFF5E6** : evoque le kraft, le naturel, le cuir. Complementaire au rose flash sans entrer en competition. Applicable sur sections paires pour rythme visuel sans border.

**Accent rose #FF2277** : chaque section en contient exactement 1 instance minimum (badge, ombre hover, separateur, stat banner, dot actif). Jamais sur le texte courant — uniquement sur les elements a forte charge visuelle.

**Noir #0F0F0F** : utilise comme fond sur deux sections (best_for, press, reviews card alternee) pour creer un contraste maximal sans passer en fond de page sombre. L'accent rose sur noir = combinaison la plus percutante.

**Contraste WCAG AA** :
- Noir #0F0F0F sur blanc #FFFFFF : ratio 21:1 (AAA)
- Blanc sur noir #0F0F0F : ratio 21:1 (AAA)
- Rose #FF2277 sur blanc : ratio 3.8:1 (AA grands textes uniquement — utilise exclusivement sur gros titres et elements decoratifs, jamais sur texte courant)
- Texte muted #6B6B6B sur blanc : ratio 5.7:1 (AA texte normal)

---

## 3. Decisions typographiques

**PP Neue Machina** (fallback Arial Black) : choisie pour son caractere condensed-grotesque qui evoque l'industrie et l'energie. Uppercase systematique sur les headings. Letter-spacing negatif (-0.02 a -0.04em) pour resserrer les grands titres et leur donner du poids.

**Inter** : corps de texte. Neutral, lisible, aucune distraction. La personnalite vient du heading — le body doit s'effacer.

**Nombres geants (01-04)** : utilises comme elements decoratifs en opacity 0.15 derriere les feature cards. Permettent de numeroter implicitement sans surcharger la lecture. Taille 80px desktop / 60px mobile.

**Hierarchie typographique utilisee** :
- H1 hero : clamp(40px, 5vw, 72px), weight 900, uppercase, letter-spacing -0.03em
- H2 sections : clamp(36px, 5vw, 64px), weight 900, uppercase
- H3 cards : 18-20px, weight 900, uppercase
- Body : 16-18px, weight 400, line-height 1.6-1.7
- Labels/badges : 10-11px, weight 900, tracking 0.1em, uppercase

---

## 4. Decisions layout

**Bento grid** : les sections features, variants, materials et reviews utilisent des grilles 3 ou 4 colonnes avec gap 20px. Chaque cellule est une card autonome avec ombre hardline 8px. Le tout forme une composition bloc-par-bloc qui evoque les dashboards Notion ou les maquettes Olipop.

**Sections alternees** : sections surface (#FFF5E6) sur why_we_love, materials, care, reviews. Les autres restent blanc. Aucune border entre sections — seul le padding (120px desktop / 72px mobile) joue le role de separateur. Respect strict de l'anti-pattern #2.

**Sections noires** : best_for et press utilisent un fond #0F0F0F. Effet cinema qui permet au rose d'eclater. Limite a 2 sections maximum pour eviter l'effet "dark mode partiel" incoherent.

**Cards neobrutalist** :
- Border 2px solid #0F0F0F
- Box-shadow 8px 8px 0 #0F0F0F (offset de 8px)
- Hover : shadow passe a 12px 12px 0 #FF2277 + translate(-4px, -4px)
- Ease bounce cubic-bezier(0.34, 1.56, 0.64, 1) sur 350ms

**Grille responsive** :
- Desktop : container max-width 1280px, padding 48px
- Features grid : 4 colonnes desktop
- Materials / variants : 3 colonnes desktop
- Reviews cards : 3 colonnes desktop
- Mobile : tout passe en colonne unique, gallery en scroll horizontal snap

---

## 5. Decisions motion

**Philosophie selectionnee** : Jakub Krehel (Production Polish) pour les micro-interactions + Jhey Tompkins (Creative Experimentation) pour les hover states expressifs. Pas de Emil Kowalski — ce style n'est pas un produit SaaS de productivite, on peut se permettre plus de personnalite.

**Ease bounce** cubic-bezier(0.34, 1.56, 0.64, 1) : spring leger avec overshoot. Donne au style son caractere "pop" sans tomber dans le cartoon. Applique sur : hover cards, hover boutons, hover pills.

**Entrances desktop** : fadeUp (opacity 0 -> 1 + translateY 32px -> 0) et popIn (scale 0.88 -> 1) sur les elements hero. Delays staggered 80ms. Uniquement au load, jamais en scrolltrigger (implementation CSS keyframes suffisante pour la maquette).

**Hover buttons** : transform translate(-2px, -2px) + box-shadow 10px 10px 0 accent. Effet "le bouton s'eloigne du fond" qui renforce la metaphore hardline.

**prefers-reduced-motion** : media query presente, desactive toutes les animations et transitions.

**Pulse dot** : animation pulse sur le dot de synthese IA en reviews. 2s infini, opacity 1 -> 0.5 + scale 1 -> 1.4. Subtil, evocateur du "live" sans etre distrayant.

---

## 6. Decisions par section

### hero
Grid 2 colonnes, image a gauche (aspect 4/5, border + shadow card), contenu a droite. Badge flottant top-right. Titre uppercase split sur 2 lignes avec ligne accent. Price en display, rating inline. Feature pills en flex-wrap. 2 boutons CTA (primary + outline). Note shipping verte pour objection-killer immediat.

### gallery
Grid 4 colonnes asymetrique : premiere colonne standard, deuxieme en grid-row span 2 (taller). Chaque item hover decale + shadow rose. Gap 20px.

### why_we_love
Grid 2 colonnes : texte a gauche (story + btn), visual a droite (card image + floating stat). Le floating stat est la version "chiffre fort" en card accent rose absolument positionnee hors du cadre image (-24px bottom-left) pour casser la rigueur du grid.

### thoughtfully_designed (features)
Header centre avec sep. Grid 4 colonnes. Feature numbers en 80px opacity 15% derriere le titre — decoratifs, pas narratifs. Cards alternees blanc/peche. Feature tag en pill rose en bas de chaque card.

### best_for
Section entierement sur fond noir avec grid 2 colonnes (intro + pills). Usage pills : fond rgba blanc, border rgba blanc, hover -> fond rose + shadow rose. Effet club / selection.

### materials_breakdown
Header 2 colonnes (titre + paragraphe intro). Grid 3 colonnes. Card 1 blanc, card 2 peche, card 3 noir (contraste maximal). Image en 16/9 en header de card. Material certified en pill avec couleur propre a chaque matiere.

### how_it_works
SKIP. Commentaire HTML inclus dans les deux fichiers.

### compare_variants
Header avec badge "3 variantes". Grid 3 colonnes, card active avec border + shadow rose. Image 1:1, body avec swatch couleur. Tap-to-select JS.

### reviews_ai_summary
Section sur fond peche avec card interieure blanche. Score 4.6 en 80px avec span accent. Stars. Synthese IA avec dot pulse. 3 reviews cards dont 1 sur fond noir.

### press_quote
Section full-bleed noire avec grid 2 colonnes. Texte a gauche (logo en rose, quote en display blanc, cite grise). Image a droite avec overlay gradient pour fusion visuelle.

### care_instructions
Header centre. Grid 3 colonnes. Card 2 en fond rose plein (accent card) pour mettre en avant la valeur principale (retours 30 jours — la plus importante pour le DTC). Care icon emoji — about compat dans la maquette HTML.

### faq
Grid 2 colonnes : intro sticky a gauche, accordeon a droite. Items alternees blanc/peche. Chevron circulaire devient rose + fond rose quand actif. FAQ ouvre un seul item a la fois (JS).

### brand_manifesto
Card full-width en fond peche, grid 2 colonnes. Contenu a gauche : badge, titre avec ligne accent, texte, 3 pilliers avec dot rose, 2 CTA. Image a droite : cover, zoom-scale au hover de la card parente.

---

## 7. Mobile specificites

- Sticky CTA bar fixe en bas (position fixed) avec prix + bouton pleine largeur — anti-pattern DTC absolu si absent
- Gallery en scroll horizontal avec scroll-snap-type : x mandatory
- Section best_for : colonne unique, pills en flex-wrap
- Variants en ligne horizontale (image 100px + body flex) plutot que grid
- Press : image 16/9 en header de card, texte en dessous
- Manifesto : image en tete, contenu en dessous
- Ombres reduites a 5px (vs 8px desktop) pour eviter l'encombrement
- FAQ : 4 questions (vs 5 desktop) pour ne pas surcharger le scroll

---

## 8. Sections — statut

| # | Section | Desktop | Mobile | Commentaire |
|---|---|---|---|---|
| 1 | hero | OK | OK | Sticky CTA mobile ajoutee |
| 2 | gallery | OK | OK | Horizontal scroll mobile |
| 3 | why_we_love | OK | OK | Floating stat remplace en banner mobile |
| 4 | thoughtfully_designed | OK | OK | Giant numbers preserves |
| 5 | best_for | OK | OK | Dark section, pills hover rose |
| 6 | materials_breakdown | OK | OK | 3 cards tricolores |
| 7 | how_it_works | SKIP | SKIP | Commentaire HTML present dans les 2 fichiers |
| 8 | compare_variants | OK | OK | Selection interactive JS |
| 9 | reviews_ai_summary | OK | OK | Dot pulse IA, score giant |
| 10 | press_quote | OK | OK | Image-header mobile |
| 11 | care_instructions | OK | OK | Card 2 rose pour retours |
| 12 | faq | OK | OK | Accordeon JS, chevron anime |
| 13 | brand_manifesto | OK | OK | Piliers + 2 CTA |

---

## 9. Concerns et points d'attention pour ANNA

1. **PP Neue Machina** n'est pas disponible sur Google Fonts — c'est une police payante (Pangram Pangram Foundry). Pour la prod, trois options : (a) licence achat, (b) Arial Black en fallback permanent (deja presente), (c) substitut gratuit approchant : "Space Grotesk" ou "Bebas Neue" pour le caractere condensed. A discuter avec le client.

2. **Ombres offset CSS** (box-shadow 8px 8px 0) : compatibilite parfaite sur tous navigateurs modernes. Pas de prefixe vendor necessaire.

3. **Ease bounce** cubic-bezier(0.34, 1.56, 0.64, 1) : valide CSS. Peut etre exporte en variable CSS et reutilise dans Framer Motion via `transition={{ ease: [0.34, 1.56, 0.64, 1] }}`.

4. **Images Unsplash** (parametre `?w=1600`) : en prod, remplacer par les URLs ImagePool du produit scrape. Les IDs Unsplash sont uniquement pour la maquette de validation visuelle.

5. **Section how_it_works** : commentaire HTML present dans les 2 fichiers. La logique de display-rule (if categorie = skincare/wellness) doit etre implementee cote renderPage(), pas cote token.

6. **Sticky CTA mobile** : le footer a un padding-bottom augmente (100px) pour ne pas etre masque par la barre fixe. A ajuster si la hauteur de la barre change en prod.

7. **FAQ accordeon** : le JS inclus est minimal et suffisant pour la maquette. En prod, utiliser un composant React avec AnimatePresence (Framer Motion) pour les transitions height smoothes.

8. **Alternance sections** : la logique "section paire = fond peche" ne doit PAS etre implementee via nth-child en prod (l'ordre des sections peut varier selon les display-rules). Chaque section doit porter son propre token de fond (`surfaceBg` ou `defaultBg`) explicitement.
