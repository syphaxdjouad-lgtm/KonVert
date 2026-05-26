# Style Soft — Notes design OBITO
**Version** : V3 maquette initiale
**Date** : 2026-05-26
**Auteur** : OBITO / NEXARA

---

## 1. Hiérarchie typographique

### Échelle appliquée

| Niveau | Tag | Font | Size (desktop) | Size (mobile) | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|---|
| H1 produit | `h1.h1` | Cormorant Garamond | clamp(2.5rem, 4vw, 4rem) | 2.125rem (34px fixe) | 400 | 1.1 | -0.02em |
| H2 sections | `h2.h2` | Cormorant Garamond | clamp(1.75rem, 3vw, 2.75rem) | 1.75rem | 400 | 1.15 | -0.01em |
| Eyebrow labels | `.eyebrow` | Inter | 0.6875rem (11px) | 0.625rem (10px) | 500 | — | 0.14em + uppercase |
| Body | `p` | Inter | 1rem (16px) | 1rem (16px) | 400 | 1.6 | normal |
| Body muted | `.body-sm` | Inter | 0.875rem (14px) | 0.875rem | 400 | 1.6 | normal |
| Prix | `.hero-price` | Cormorant Garamond | 2rem (32px) | 1.75rem (28px) | 400 | 1 | normal |
| Quote édito | `.why-we-love-text` | Cormorant Garamond | clamp(1.375rem, 2.5vw, 1.875rem) | 1.25rem | 300 italic | 1.55 | — |

### Justification des choix
- **Cormorant Garamond 400 (regular)** pour les titres — pas 600 ni bold. Les marques DTC premium (Mejuri, Reformation) utilisent le poids fin pour signaler le luxe accessible. Le gras appartient à Zara, pas à Mejuri.
- **Inter 400 pour le body** — absolument neutre, lisible, Google Fonts. Aucune friction de lecture.
- **H1 à weight 400, pas 700** — la hiérarchie vient de la taille, pas du poids. Anti-pattern des landing pages génériques qui compensent la faiblesse de la typo par du bold partout.
- **Eyebrow en uppercase Inter 11px, lettrespace +0.14em** — pattern Allbirds / Reformation. Permet de créer un niveau supplémentaire de hiérarchie sans serif.

---

## 2. Système de spacing

### Base
Grille 8px. Toutes les valeurs sont multiples de 8 (ou 4 pour le micro-spacing).

| Token | Valeur | Usage |
|---|---|---|
| `--space-section` | 128px | Padding vertical de chaque section |
| `--space-section` mobile | 72px | Réduit sur mobile pour économiser le vertical space |
| `--space-card` | 32px | Padding interne des cartes |
| `--space-gap` | 24px | Gap entre éléments d'une grille |
| 8px | micro | Espace entre eyebrow et titre |
| 16px | small | Gap intra-composant |
| 32px | medium | Gap entre blocs dans une section |
| 48px | large | Gap entre éléments de section (features list) |
| 96px | XL | Gap colonnes split-layout (desktop) |

### Logique du white space
Le style "Soft" respire. Le principe : si on doute entre deux valeurs de spacing, on choisit la plus grande. La densité est l'ennemi de la perception premium.

Chaque section a 128px de padding vertical — soit ~1.5-2 écrans de hauteur visuelle de breathing room au total sur la page. C'est Mejuri, pas Shopify template gratuit.

---

## 3. Patterns d'animation au scroll

### Philosophie : Jakub Krehel (polish, consumer premium)
On est sur une page produit e-commerce premium, pas un outil B2B. Chaque micro-interaction est une opportunité de raffinement. Mais on reste sobre — on ne joue pas à Framer.

### Pattern appliqué : fade-in + translateY
```css
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- **400ms** — token `--duration` du fichier tokens.ts
- **cubic-bezier(0.4, 0, 0.2, 1)** — token `--ease`. Ease-out vers la fin, naturel
- **translateY 24px** — discret. Pas 60px, pas de zoom, pas de bounce. L'animation ne doit pas attirer l'attention sur elle-même.
- **Stagger via classes** `.fade-in-delay-1/2/3/4` → 80ms d'incréments. Les grilles de cartes apparaissent en cascade.
- **IntersectionObserver threshold 0.12** — déclenche tôt, avant que l'élément soit complètement visible. L'utilisateur ne voit pas le début de l'animation.

### Hover
- Images : `transform: scale(1.02-1.04)` en 600ms — imperceptible sauf à surveiller
- Cartes : `transform: translateY(-2px) + shadow hover` — feedback discret
- CTA primary : `translateY(-1px) + shadow` — signal d'interaction sans surjeu

### Aucune animation en boucle, aucun parallaxe excessif.

---

## 4. Décisions de layout

### Hero : sticky image + scroll content (desktop)
Inspiré Allbirds / Mejuri. La photo produit est sticky sur la moitié gauche du viewport pendant que le contenu (prix, variants, CTA) défile à droite. L'image reste présente pendant toute la lecture. Résultat : l'utilisateur ne perd jamais le contexte visuel du produit pendant qu'il lit les features.

Sur mobile, on casse ce pattern : image pleine largeur en haut → contenu en dessous. Le scroll horizontal sticky est impossible à faire bien sur iOS.

### Gallery : grille asymétrique desktop
`1fr 1fr + grid-column: span 2` pour la première image (featured). La grille 3 colonnes avec un élément étendu crée une composition plus éditoriale qu'une simple grille uniforme. Inspiration : pages éditorial Vogue digital.

### Thoughtfully Designed : split 1/1 image + liste
Image à gauche, liste de features à droite, `gap: 96px`. L'image occupe un ratio 4:5 (portrait) — plus luxueux qu'un paysage 16:9 pour un sac.

### Materials Breakdown : grille 3 colonnes horizontale
Section signature Allbirds. 3 cartes égales, image en ratio 4:3, padding card 32px. Sobre, clair, documentaire. Le but est de décrédibiliser l'idée que le produit est générique.

### Compare Variants : grille 3 colonnes avec état "selected"
Anneau accent color sur la variante active. Pattern Glossier. Sur mobile, scroll horizontal snap-to.

### Press Quote : full-bleed avec overlay cream
Pas de fond noir — respect du feedback NEXARA. L'overlay est `rgba(250, 247, 242, 0.82)` — cream semi-transparent sur la photo lifestyle. Le texte reste lisible (contraste > 4.5:1 vérifié manuellement) sans jamais sentir "sombre".

### Brand Manifesto : mirror du split hero
Image à gauche, contenu à droite — inverse du layout "Thoughtfully Designed" (qui est image gauche également mais différente composition). Cohérence systémique.

---

## 5. Inspirations Allbirds / Mejuri traduites

### Eyebrow labels partout
Allbirds utilise des labels uppercase Inter avant chaque section (ex: "OUR MATERIALS", "THE DETAILS"). J'ai traduit en français, même fréquence.

### Mots propriétaires en gras dans les features
"**SoftFit™**", "**Cuir véritable italien**" — pattern Allbirds exact. Les mots-clés différenciants sont mis en valeur dans le nom de la feature, avant la description. Scan-friendly.

### Patine narrative dans le copy
Mejuri ne vend pas des bijoux — elle vend "la pièce qui t'accompagne toute ta vie". J'ai appliqué le même cadrage pour le sac : "patine vivante", "unique à toi", "s'embellit avec le temps". C'est du storytelling produit premium.

### Score d'avis en grand typographique
Le "4.6" en Cormorant Garamond 80px est une pattern Mejuri / Glossier : la note devient un élément typographique, pas un widget review générique.

### Pills "Best For"
Glossier utilise des pills pour catégoriser les produits par usage ("Everyday", "On-the-go"). J'ai traduit pour le sac : Quotidien, Travail, Sortie, Voyage léger.

### FAQ en details/summary natif
Pas de JS pour l'accordion — `<details>/<summary>` HTML natif. Accessible par défaut, keyboard-navigable, fonctionne sans JS. Allbirds fait ça. L'icon se rotate à 45° en CSS pur sur `[open]`.

---

## 6. Décisions d'accessibilité (WCAG AA)

- Contraste texte principal `#1A1614` sur `#FAF7F2` : ratio ~16:1 (large AAA)
- Contraste texte muted `#7A6F66` sur `#FAF7F2` : ratio ~4.8:1 (AA)
- Contraste accent `#C9A77E` : utilisé sur surfaces light uniquement, jamais comme couleur de texte standalone
- Toutes les images ont un `alt` descriptif (pas "image" ou "photo")
- Images décoratives (press-quote background) : `alt=""` + `aria-hidden="true"`
- Touch targets mobiles : min 44px (buttons, swatches 40px+outline, pills min-height 44px)
- Swatches en radiogroup avec aria-checked
- FAQ summary avec indication d'état open/closed via aria
- Stars avec role="img" et aria-label de la note

---

## 7. Décisions spécifiques à noter pour ANNA (implémentation React/Tailwind)

- Le hero sticky-image est un `position: sticky; top: 64px; height: calc(100vh - 64px)` — vérifier que le wrapper parent n'a pas `overflow: hidden` (tue le sticky).
- Le gallery-scroll mobile utilise `scroll-snap-type: x mandatory` + `scroll-snap-align: start` — à reproduire exactement.
- L'animation scroll utilise IntersectionObserver vanilla JS. En React, utiliser `useInView` de `framer-motion` ou `react-intersection-observer`.
- Les variantes couleur (swatches) sont des `<button role="radio">` dans un `radiogroup`. Pas de checkbox, pas de div clickable.
- La press-quote overlay est `rgba(250, 247, 242, 0.82)` — pas rgba(0,0,0,0.x). Respect feedback NEXARA no-black-bg.
- Les cartes materials et variants ont `transition: transform + box-shadow` sur hover — GPU-only (pas de width/height).

---

## 8. Anti-patterns évités

- Pas d'alternance de fonds entre sections (tout en `#FAF7F2` ou `#FFFFFF` — deux niveaux max)
- Pas de borders entre sections
- Pas de placeholder images — toutes URLs Unsplash réelles, catégorie cohérente (cuir/sac)
- Pas d'emoji dans le contenu visible
- Pas d'accent `#C9A77E` utilisé en couleur de fond de section
- Pas de h1 < 34px
- Pas de cards avec border colorée (les cartes ont `box-shadow` uniquement)
- Pas d'animation > 400ms
- Pas d'animation en linear easing — tout en `cubic-bezier(0.4, 0, 0.2, 1)`
