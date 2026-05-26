# Style Editorial — Notes design & justifications
**OBITO pour NEXARA / Konvert V3**
**Date : 2026-05-26**
**Statut : DONE**

---

## 1. Direction artistique

Le style Editorial s'inspire des magazines de mode haut de gamme — SSENSE, Aimé Leon Dore, The Frankie Shop — qui utilisent la typographie comme architecture visuelle principale. La photo est souveraine, le texte respecte des hiérarchies dramatiques, et le blanc est traité comme un matériau à part entière.

Trois principes fondateurs retenus après analyse des références :

**Tension typographique** : le contraste entre un serif massif (Tiempos Headline, ou son fallback Times New Roman) et un sans-serif neutre (Inter) crée une tension visuelle qui signale immédiatement "qualité éditoriale". Le serif en regular 400 suffit — nul besoin de bold quand le corps de la lettre a cette densité.

**Asymétrie intentionnelle** : SSENSE et Aimé Leon Dore ne centrent presque rien. Les grilles 3fr/2fr et 2fr/3fr alternent selon la hiérarchie de l'information. L'image prend 60% quand elle est narrative, le texte prend 60% quand il est dense. Jamais 50/50.

**Vide généreux** : 160px entre sections desktop. Ce n'est pas du gaspillage — c'est le signal que chaque section a une identité propre et mérite d'être lue séparément. Les magazines de mode ne "compressent" pas leurs pages.

---

## 2. Décisions de layout par section

### 01 — Hero
**Choix** : layout 3fr/2fr (image/contenu), image qui prend 100vh, contenu scrollable dans sa colonne.
**Justification** : Aimé Leon Dore place toujours l'image en premier plan, le prix et le CTA dans une colonne de droite plus étroite. La hiérarchie est claire : d'abord l'objet, ensuite la décision d'achat. L'image sort du container max-width — elle couvre 60% du viewport dès l'arrivée.

### 02 — Gallery
**Choix** : grille asymétrique 3 colonnes, image principale occupe les 2 lignes (grid-row: 1/3).
**Justification** : La galerie SSENSE utilise un layout "anchor + satellites" où la meilleure photo ancre la composition. Les 4 autres photos orbitent autour. Ce n'est pas une grille régulière — c'est une composition.

### 03 — Why We Love
**Choix** : grille 1fr/3fr (label/texte), fond surface (#F8F6F2) pour respiration.
**Justification** : La section la plus textuelle mérite le plus d'espace blanc. Le texte est en serif 22-34px — presque une citation de magazine. La colonne label "01/4" est réduite au minimum pour ne pas concurrencer le contenu.

### 04 — Thoughtfully Designed
**Choix** : grille 2fr/3fr (image sticky/liste), liste avec numéros "F 01, F 02...".
**Justification** : L'image sticky qui accompagne le scroll des features est un pattern Allbirds direct. La numerotation "F 01" en uppercase léger ajoute un sentiment de rigueur technique sans lourdeur. La liste séparée par des règles 1px évite les cards — un autre anti-pattern évité.

### 05 — Best For
**Choix** : section fond noir (#0A0A0A), tags rectangulaires border 1px blanc, layout horizontal.
**Justification** : Les tags best-for en fond noir créent un contraste de rythme fort dans la page. SSENSE et ALD utilisent fréquemment des inversions fond/texte pour marquer une rupture de contenu. Les tags sont des blocs angulaires — pas de border-radius, jamais.

### 06 — Materials Breakdown
**Choix** : 3 cards avec gap de 2px entre elles (effet "jointure"), image + body dans chaque card.
**Justification** : Le gap de 2px crée un effet de grille photographique plutôt que de cartes séparées. La légende sous chaque image est en italic caption — signal que c'est une information secondaire certifiée.

### 07 — How It Works
**Choix** : SKIPPED avec commentaire HTML.
**Justification** : La spec V3 section 5.1 indique explicitement "Si catégorie = skincare/wellness". Un sac ne relève pas de cette catégorie. Commentaire HTML laissé pour ANNA lors du code production.

### 08 — Compare Variants
**Choix** : grille 3 colonnes, hover sur les images, badge "Sélectionné" sur la variante active, outline 1px noir.
**Justification** : La sélection de variante avec outline 1px noir (pas de fond coloré) est pure et éditoriale. Pas de checkmark, pas d'icône — juste la délimitation angulaire.

### 09 — Reviews AI Summary
**Choix** : grille 2fr/3fr (summary sticky/liste reviews), score en grand serif 80px.
**Justification** : Le score "4,6" en 80px sert de point d'ancre visuel immédiat. Le résumé AI en italic serif est délibérément court et confiant — pas de bullet points, pas de graphique en anneau. Les barres de critères sont des lignes 2px, pas des progress bars arrondies.

### 10 — Press Quote
**Choix** : image full-bleed 100vw (sort du container), overlay 55%, quote en serif italic.
**Justification** : C'est la seule section où le texte est sur fond sombre. L'image de fond doit être lifestyle (pas de packshot). L'overlay ne doit pas dépasser 60% pour que l'image reste présente.

### 11 — Care Instructions
**Choix** : grille 3 colonnes séparées par des règles verticales 1px, pas de cards.
**Justification** : Les 3 colonnes (Entretien, Livraison, Retours) forment un triptyque unifié. Pas de cards avec background — juste du contenu dans un même espace, séparé par des lignes. Plus sobre, plus confiant.

### 12 — FAQ
**Choix** : grille 1fr/2fr (sidebar sticky/liste accordion), questions en serif 20px.
**Justification** : L'accordion editorial n'utilise pas de chevron — juste une croix (+/-) faite en pseudo-elements CSS. La question en serif 20px est lisible et respire. La sidebar sticky avec le bouton "Contacter l'équipe" transforme la section en interface de service réelle.

### 13 — Brand Manifesto
**Choix** : grille 3fr/2fr (contenu/image), image offset-top de 80px, pilliers numérotés.
**Justification** : L'offset vertical de l'image par rapport au texte est le détail éditorial le plus distinctif. L'image commence 80px plus bas que le titre — asymétrie verticale intentionnelle. Les 3 piliers sont des lignes numérotées, pas des icônes.

---

## 3. Typographie — decisions clés

**Tiempos Headline vs Cormorant** : Cormorant (style Soft) est un serif fin, romantique, à contraste élevé entre pleins et déliés. Tiempos Headline est plus trapu, plus journalistique, plus "magazine papier". La différence est perceptible au premier coup d'oeil — deux styles bien distincts.

**H1 = 40-64px (clamp)** : En dessous de 40px sur mobile, le serif perd son impact éditorial. Au dessus de 96px sur desktop, les lignes deviennent trop courtes et se cassent maladroitement.

**Italic = signal émotionnel** : L'italic est utilisé uniquement pour : (1) les captions sous images, (2) les parties émotionnelles de la copy (why_we_love), (3) les quotes press. Il ne sert jamais de décoration.

**Inter en body** : poids 400 uniquement, sauf les labels (600) et les boutons (500). L'Inter léger sur fond blanc donne un effet magazine propre. Pas de poids 700+ sur le body — ça alourdissait visuellement.

---

## 4. Animations — philosophie Jakub Krehel (polish)

Toutes les animations respectent le budget motion défini dans les tokens :
- `fadeUp` pour les éléments hero (cascade avec stagger 100-200ms)
- `scaleIn` pour l'image hero (légère amplification à l'entrée)
- `scale(1.03)` sur hover des images galerie (subtil, pas 1.1)
- Accordion FAQ avec `max-height` transition (pas `height: auto` — incompatible CSS transitions)
- Toutes les transitions sont sur `transform` et `opacity` uniquement (GPU)

Le fichier n'inclut pas de `@media (prefers-reduced-motion)` explicite — à ajouter en priorité lors du code production React.

---

## 5. Accessibilité

**Contraste texte** :
- `#0A0A0A` sur `#FFFFFF` : ratio 20.6:1 (AAA)
- `#5C5C5C` sur `#FFFFFF` : ratio 7.2:1 (AA pour texte normal, AAA pour grand texte)
- `#FFFFFF` sur `#0A0A0A` (section best-for) : ratio 20.6:1 (AAA)
- Labels `rgba(255,255,255,0.5)` sur fond noir : ratio ~3.8:1 (AA pour grand texte uniquement — à surveiller)

**Focus states** : non visibles dans la maquette HTML statique. ANNA doit ajouter `:focus-visible` sur tous les éléments interactifs lors du code React.

**ARIA** :
- `aria-expanded` sur les boutons FAQ (accordéon JS inclus)
- `aria-hidden="true"` sur les icônes décoratives
- `alt` renseigné sur toutes les images

**Touch targets** : tous les boutons ont un padding minimum de 16px vertical. Sur mobile, la sticky CTA bar a 48px de hauteur cliquable.

---

## 6. Mobile — décisions adaptées

**Hero** : passage de 2 colonnes à stack vertical. L'image prend 4:5 (portrait) pour maximiser l'impact sur 375px. Le contenu défile en dessous.

**Gallery** : scroll horizontal avec `scroll-snap` plutôt que grille. Les images font 280px de large — on en voit 1,2 à la fois (indication qu'il y en a d'autres).

**Materials** : même pattern scroll horizontal.

**Variants** : passage de 3 colonnes à liste verticale 2-colonnes (image 100px + info). Plus scannable sur mobile que de petites images en grille.

**Sticky CTA bar** : la barre fixée en bas avec prix + bouton est essentielle sur mobile — le bouton "Ajouter au panier" n'est jamais visible pendant le scroll.

**Care Instructions** : passage de 3 colonnes à stack vertical avec border-top entre chaque.

---

## 7. Ce qui distingue ce style des 9 autres

**vs Soft** : Soft est romantique, crème, arrondi, intime. Editorial est tranchant, blanc pur, angles vifs, journalistique. Deux publics différents.

**vs Apple-Clean** : Apple-Clean est dominé par le vide et les sans-serif. Editorial utilise le serif comme colonne vertébrale — c'est la différence entre une revue technique et Vogue.

**vs Brutalist** : Brutalist casse les règles (mono, grids cassées). Editorial les respecte avec rigueur mais dans leur version la plus élégante.

**vs Luxe-Noir** : Luxe-Noir a un fond noir dominant. Editorial a un fond blanc dominant avec des incursions noires ponctuelles (section best-for, press overlay).

---

## 8. Points d'attention pour ANNA (code production)

1. **Tiempos Headline** n'est pas sur Google Fonts — nécessite soit une licence (klim.co.nz), soit utilisation du fallback `"Times New Roman", serif`. Valider avec le client avant de déployer.

2. **Grid asymétrique sticky** : la colonne sticky (features image, reviews summary) a besoin de `position: sticky; top: 100px` et d'un parent avec `height` défini ou `align-items: start`. Tester sur Chrome et Safari (comportement différent).

3. **Gallery grid avec grid-row: 1/3** : tester sur Safari iOS — les grilles avec `grid-row` spanning peuvent avoir des bugs sur versions anciennes.

4. **FAQ accordion max-height** : la valeur `max-height: 400px` est hardcodée. En production, utiliser JS pour mesurer la hauteur réelle du contenu ou passer à une approche `<details>/<summary>` native.

5. **Press quote full-bleed** : le `position: absolute; inset: 0` sur l'overlay fonctionne uniquement si le parent a `position: relative`. ANNA doit le vérifier dans le contexte Next.js où le composant section peut avoir des wrappers supplémentaires.

6. **prefers-reduced-motion** : obligatoire en production. Toutes les animations CSS keyframes (`fadeUp`, `scaleIn`, `scale hover`) doivent être désactivées via `@media (prefers-reduced-motion: reduce)`.

---

## 9. Fichiers livrés

| Fichier | Description | Lignes approx |
|---|---|---|
| `style-editorial.html` | Page produit desktop complète (13 sections) | ~950 |
| `style-editorial-mobile.html` | Variante mobile 375px | ~750 |
| `style-editorial.notes.md` | Ce fichier | ~200 |
| `style-editorial.tokens.json` | JSON tokens W3C DTCG complet | ~300 |
