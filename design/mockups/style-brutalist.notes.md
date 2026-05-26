# Style Brutalist — Notes Design
## Konvert V3 / OBITO / 2026-05-26

---

## Philosophie

Le Brutalist n'est pas un style "laid exprès". C'est une doctrine de l'honnêteté structurelle : montrer les ossatures, ne rien cacher, ne rien arrondir. Chaque bordure est une décision consciente. Chaque grid est visible. Chaque préfixe de section est fonctionnel (code notation), pas décoratif.

La référence n'est pas Myspace 2006 — c'est Linear, Vercel, Railway. Des outils pour des gens qui font des choses sérieuses. L'esthétique dit : "je ne vais pas te séduire, je vais te convaincre."

---

## Décisions typographiques

**JetBrains Mono partout** — pas une faute de goût, un choix systémique. La monospace crée trois effets :
1. Chaque caractère occupe exactement le même espace horizontal → grilles naturellement alignées
2. Le texte ressemble à du code source → signal de précision et de fiabilité
3. Les chiffres en tabular-nums s'alignent parfaitement dans les tableaux et barres de progression

Tailles utilisées :
- H1 hero : clamp(36px, 4.5vw, 64px) — volumineux, poids 800, letter-spacing -0.03em
- Body : 14px desktop, 13px mobile — légèrement sous la norme pour accentuer la densité d'info
- Labels sections : 11px, weight 500, letter-spacing 0.12em, uppercase — quasi-invisible, ne concurrence pas le contenu
- Prix : 48px desktop / 40px mobile, tabular-nums — seul élément qui "cry out" sans accent

---

## Décisions couleurs

**Palette délibérément pauvre** : noir, blanc, off-white #F5F5F0, gris #666666, orange #FF6B35.

Pourquoi off-white #F5F5F0 et non blanc pur ? Le blanc pur (#FFFFFF) est réservé aux surfaces de cards et aux zones de focus (hero image, tableaux). Le fond légèrement cassé crée une hiérarchie spatiale sans gradient ni ombre.

**Orange #FF6B35** — utilisé sur exactement 4 types d'éléments :
1. Bouton CTA principal
2. Préfixes FAQ `?>`
3. Flèches AI summary
4. Hover states des liens nav
Nulle part ailleurs. L'accent fonctionne parce qu'il est rare.

**Noir #000000 pur** pour les borders — pas rgba, pas #333. Le contraste brut est la marque de fabrique. Cela dit : sur la section press (fond noir), les borders passent en rgba(255,255,255,0.2) pour rester lisibles.

---

## Décisions de layout

**Grid "tableau de bord"** : le desktop utilise des grilles rigides border-collapse style. Pas de gap entre les cells — les borders jouent le rôle de séparateur. Cette approche vient de Linear App et des tableaux de monitoring devops.

**Section headers notation code** : chaque section annonce son identité avec un préfixe différent selon la nature du contenu :
- `// HERO` — commentaire JavaScript single-line
- `/* GALLERY */` — commentaire CSS multi-ligne
- `## SECTION` — Markdown heading
- `?> FAQ` — PHP opening tag (convention Q&A)

Ce système n'est pas aléatoire : les visiteurs tech le lisent immédiatement comme une convention. Les non-tech le lisent comme un style graphique. Les deux audiences sont servies.

**Spacing 100px entre sections** — généreux mais pas somptueux. En Brutalist, l'air est structurel : il crée des "blocs" distincts sans avoir besoin de background alternés (anti-pattern interdit).

---

## Décisions interactives

**Hover state : 4px 4px 0 #000 + translate(-2px, -2px)** — l'effet "élévation mécanique". Le shadow fixe + le déplacement de l'élément simule un tampon qui s'enfonce puis ressort. 150ms linear, pas de ease. Sec, comme un interrupteur.

**FAQ : accordéon avec `+` → rotation 45deg** — le + devient ×. Pas d'animation de hauteur (trop doux pour le style). L'answer toggle est instantané (display:none/block), seul l'icône s'anime en 150ms.

**Gallery mobile : scroll horizontal natif** — pas de slider JS. Le scroll natif est plus rapide, plus responsive, plus accessible. L'indication `SCROLL →` est en petit texte à droite pour guider sans imposer.

---

## Ce qui distingue ce style des autres V3

| Critère | Apple Clean | Editorial | Organic | Brutalist |
|---|---|---|---|---|
| Radius | 12px | 0 | 20px | 0 (strict) |
| Font heading | SF Pro | Playfair | Fraunces | JetBrains Mono |
| Border | Aucune | Légère | Organique | Omniprésente |
| Shadow | Soft | Minimal | Aucune | Flat 4px offset |
| Motion | 400ms ease | 600ms ease | 300ms ease | 150ms linear |
| Palette | Blanc/bleu | Noir/crème | Terre/vert | N/B/orange |
| Vibe | Premium retail | Magazine | Nature | Dev tool |

---

## Sections livrées / skippées

| Section | Statut | Notes |
|---|---|---|
| hero | OK | Layout 2-col, title code-style, prefix CVN-001 |
| gallery | OK | Grid 4-col desktop, scroll horizontal mobile |
| why_we_love | OK | Liste numérotée 01_-04_ |
| thoughtfully_designed | OK | 3 cards en grid, prefix >> |
| best_for | OK | 3 profils USR avec label technique |
| materials_breakdown | OK | Barres de progression, % affichés |
| how_it_works | SKIP | Spécifié dans le brief |
| compare_variants | OK | Table HTML native, swatches inline |
| reviews_ai_summary | OK | Score bloc + barres + AI summary + 3 cards |
| press_quote | OK | Section fond noir inversé |
| care_instructions | OK | [+] A faire / [-] A éviter |
| faq | OK | `?>` prefix, réponses `// ...` |
| brand_manifesto | OK | "Built to last." + 3 pilliers ## |

---

## Problèmes potentiels / Concerns

1. **Performance JetBrains Mono** : la font Google est chargée en weight 400/500/600/700/800. Sur connexions lentes, le FOUT (Flash of Unstyled Text) peut être visible. Recommandation pour prod : `font-display: swap` + preload du subset latin.

2. **Table mobile compare** : le tableau utilise un scroll horizontal natif avec `min-width: 520px`. Fonctionne sur iOS/Android natif mais peut surprendre des utilisateurs non-techno. Ajouter une indication "scroll horizontal" identique à la gallery.

3. **Contraste en section press** : fond #000000, texte en rgba(255,255,255,0.4) pour les labels secondaires. Ce ratio (~4:1) est en limite WCAG AA. Acceptable pour des éléments décoratifs (source presse) mais surveiller en audit formel.

4. **Accent orange #FF6B35 sur fond #F5F5F0** : ratio de contraste 3.2:1 — passe WCAG AA pour les grands textes (18px+ ou 14px bold), insuffisant pour les très petits textes (12px normal weight). Aucun texte informatif critique n'est en orange seul dans ce design.

5. **Images Unsplash** : les URLs utilisées sont des requêtes dynamiques Unsplash (auto=format&fit=crop). En production, préférer les IDs Pexels vérifiés du brief plutôt que des URLs Unsplash qui peuvent changer de résolution ou être rate-limitées.
