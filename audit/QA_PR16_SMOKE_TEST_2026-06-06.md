# Smoke test PR #16 — 2026-06-06

## Verdict (1 ligne)
**NO-GO** — StickyAddToCartMobile injecté sur 43/43 templates mais dead-dead en prod : `id="main-cta"` absent de tous les boutons hero, IntersectionObserver fait un return silencieux, sticky jamais visible.

---

## 1. Audit `#main-cta` statique

- **Templates avec ID : 0/43**
- **Templates sans ID : 43/43** (liste exhaustive ci-dessous)
- **Ambiguïtés : 0**

### Résultat grep exhaustif
Commande exécutée :
```
grep -rln 'id="main-cta"\|id={"main-cta"}\|id={`main-cta`}' src/lib/templates/etec-*.ts
```
Résultat : 0 fichier. Confirmé via audit script tsx `audit/check-main-cta.ts` sur les 43 templates avec fixture `mockLandingDataFull` officielle.

### Templates sans `id="main-cta"` (43/43)
etec-agency, etec-artisan, etec-aura, etec-beauty, etec-blue, etec-blusho, etec-boost, etec-casa, etec-cosmetix, etec-electro, etec-ella, etec-energy, etec-gadget, etec-glow, etec-glowup, etec-gold, etec-homestyle, etec-hue, etec-interior, etec-jewel, etec-luxe, etec-natural, etec-noir, etec-nordic, etec-outfit, etec-pet, etec-platina, etec-poterie, etec-prestige, etec-prime, etec-pulse, etec-quarter, etec-rose, etec-sage, etec-shopz, etec-solo, etec-starter, etec-streetz, etec-style, etec-supreme, etec-techcase, etec-trendy, etec-velvety

### Note : tous les 43 templates utilisent `renderRichSections`
Confirmation via grep : 43/43 des templates etec importent et appellent `renderRichSections`. Donc 43/43 ont le sticky injecté. Mais 0/43 ont l'ID cible.

### Comportement runtime confirmé (StickyAddToCartMobile.ts ligne 224-225)
```javascript
var target = document.getElementById('main-cta'); // → null sur tous les templates
if (!bar || !target) return;                       // → return silencieux, IntersectionObserver jamais créé
```
Le sticky reste à `opacity: 0`, `transform: translateY(100%)`, classe `kvt-visible` jamais ajoutée.

---

## 2. Smoke test Playwright (5 templates — viewport 390×844 iPhone 14)

Environnement : HTML statique généré via `renderTemplate(templateId, mockLandingDataFull)`, servi sur `localhost:3001`. Scroll testé à 800px post-hero.

| Template | `#main-cta` présent | Sticky CTA visible après scroll 800px | Trust badges | Console clean | Screenshot |
|---|---|---|---|---|---|
| etec-beauty | Non (`mainCtaFound: false`) | Non (`opacity: 0`, `kvt-visible: false`) | Oui (97 SVG/trust elements) | Oui* | `screenshots/pr16/etec-beauty-scroll800-sticky-invisible.png` |
| etec-jewel | Non (`mainCtaFound: false`) | Non (`opacity: 0`, `kvt-visible: false`) | Oui | Oui* | `screenshots/pr16/etec-jewel-scroll800-sticky-invisible.png` |
| etec-techcase | Non (`mainCtaFound: false`) | Non (`opacity: 0`, `kvt-visible: false`) | Oui | Oui* | `screenshots/pr16/etec-techcase-scroll800-sticky-invisible.png` |
| etec-natural | Non (`mainCtaFound: false`) | Non (`opacity: 0`, `kvt-visible: false`) | Oui | Oui* | `screenshots/pr16/etec-natural-scroll800-sticky-invisible.png` |
| etec-streetz | Non (`mainCtaFound: false`) | Non (`opacity: 0`, `kvt-visible: false`) | Oui | Oui* | `screenshots/pr16/etec-streetz-scroll800-sticky-invisible.png` |

*Console errors uniquement : images fixture `cdn.shopify.com/serum-*.jpg` inexistantes (URLs de test bidon dans `mockLandingDataFull`) → non bloquant, attendu en test avec données mock. Zéro erreur JS applicative.

---

## 3. Bugs trouvés

### BUG-01 — Critical — StickyAddToCartMobile dead sur 43/43 templates etec

**Criticité :** Critical (feature entière à 0% d'impact)
**Composant :** `StickyAddToCartMobile.ts` + 43 templates etec
**Env :** Tous (local, preview, prod)

**Steps to reproduce :**
1. Générer une landing page avec n'importe quel template `etec-*`
2. Ouvrir sur iPhone 14 (390×844) ou DevTools mobile
3. Scroller au-delà du hero CTA (~600px)
4. Observer le bas du viewport
5. Exécuter en console : `document.getElementById('main-cta')` → `null`

**Expected :** Sticky bar apparaît en slide-up en bas du viewport, opacity 1, class `kvt-visible` présente.

**Actual :** Sticky bar injectée dans le DOM (`id="kvt-sticky-cta"`) mais `opacity: 0`, `transform: translateY(100%)`, classe `kvt-visible` jamais ajoutée. `document.getElementById('main-cta')` retourne `null` → guard `if (!bar || !target) return;` (ligne 224-225 `StickyAddToCartMobile.ts`) stoppe l'exécution, IntersectionObserver jamais créé.

**Cause racine :** Aucun des 43 templates `etec-*` ne pose `id="main-cta"` sur leur bouton hero principal. Le composant attend cet ID pour fonctionner mais aucune documentation, aucun test, aucun linting n'impose ce contrat aux templates.

**Preuve runtime (etec-beauty) :**
```javascript
// Après scroll à 800px
{ mainCtaFound: false, stickyFound: true, kvtVisible: false, opacity: "0" }
```

**Impact :** 100% des utilisateurs mobile sur 100% des templates. 0% de l'impact CRO attendu.

**Workaround :** Aucun côté user.

**Fix attendu (ANNA) :** Deux options :
- Option A (recommandée) : ajouter `id="main-cta"` sur le bouton CTA hero dans `buildStickyCta` via `mainCtaId` passé en option, ET modifier `renderRichSections` pour injecter l'ID sur le premier bouton hero détecté — mais fragile.
- Option B (plus robuste) : dans `buildStickyCta` / `renderRichSections`, activer le **fallback dégradé existant** dans `StickyAddToCartMobile.ts` ligne 229-232 si `IntersectionObserver` n'a pas de target : rendre le sticky visible par défaut au scroll via un listener `scroll` plutôt que de faire un return silencieux.
- Option C (propre, recommandée par KONAN) : modifier `buildStickyCta` pour passer le sélecteur CSS du premier bouton CTA identifié par classe (ex: `data-kvt-cta` attribute injecté côté template sur le bouton hero principal), au lieu d'un ID fixe attendu.

**Estimation fix ANNA :** 30-60 min pour Option B (fallback scroll), 2-3h pour Option C (contractuel).

---

### BUG-02 — Low — Fallback `IntersectionObserver` pas implémenté correctement (risque futur)

**Criticité :** Low
**Composant :** `StickyAddToCartMobile.ts` lignes 229-232

Le fallback prévu pour les navigateurs sans `IntersectionObserver` (`bar.classList.add('kvt-visible')` immédiatement) s'applique aussi si `target` est null — car le check `!('IntersectionObserver' in window)` est AVANT le guard `!target`. Mais le guard `!target` stop avant d'atteindre le fallback. Sur navigateurs anciens sans IO, le sticky serait toujours visible sans trigger — UX dégradée acceptable, mais non testée.

**Impact :** Mineur. Les navigateurs sans IntersectionObserver sont < 1% du trafic cible.

---

## 4. Recommandation

**Merge tel quel : NON**

La feature StickyAddToCartMobile est à 0% d'impact en prod. Les 17 tests Vitest du sticky passent car ils testent la génération HTML du composant (présence de `kvt-sticky-cta` dans le HTML), pas le comportement runtime de l'IntersectionObserver avec un target manquant.

**Si NO-GO — Fix exact ANNA :**

Fichier principal à modifier : `src/lib/templates/sections.ts` — fonction `buildStickyCta` (lignes 1094-1114).

Le fix le plus simple et le plus robuste (Option B, sans toucher les 43 templates) :
Dans `StickyAddToCartMobile.ts`, remplacer le guard silencieux par un fallback scroll si `target` est absent :

```typescript
// src/lib/sections-v3/shared/StickyAddToCartMobile.ts — dans le <script>

if (!bar) return;

// Si target absent : fallback scroll (show après 300px)
if (!target) {
  var scrollHandler = function() {
    if (window.scrollY > 300) {
      bar.classList.add('kvt-visible');
    } else {
      bar.classList.remove('kvt-visible');
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler(); // check initial
  return;
}
```

Cela active le sticky correctement même sans `id="main-cta"` et maintient la compatibilité avec les templates qui ajouteraient l'ID plus tard.

**Ce qui peut attendre post-merge :**
- Ajout de `id="main-cta"` sur les boutons hero des 43 templates (améliore la précision du trigger, non bloquant une fois le fallback scroll en place)
- BUG-02 (Low)

**Tests à re-valider après fix ANNA :**
- Ré-exécuter `audit/check-main-cta.ts` → vérifier que le sticky devient visible après fallback scroll
- Ré-exécuter les 5 smoke templates : sticky visible après scroll 300px sur iPhone 14
- Vitest : ajouter un test qui vérifie le comportement runtime quand `target` est null (actuellement non couvert)

---

## Annexes

### Scripts QA créés
- `audit/check-main-cta.ts` — audit statique 43 templates, résultats en CLI
- `audit/generate-html-snapshots.ts` — génère les HTML statiques des 5 templates cibles

### Screenshots
- `audit/screenshots/pr16/etec-beauty-hero-mobile.png` — hero mobile etec-beauty
- `audit/screenshots/pr16/etec-beauty-scroll800-sticky-invisible.png` — sticky invisible après scroll
- `audit/screenshots/pr16/etec-jewel-scroll800-sticky-invisible.png`
- `audit/screenshots/pr16/etec-natural-scroll800-sticky-invisible.png`
- `audit/screenshots/pr16/etec-streetz-scroll800-sticky-invisible.png`
- `audit/screenshots/pr16/etec-techcase-scroll800-sticky-invisible.png`

### Note trust badges
TrustBadgesPayment fonctionne correctement : 43/43 templates ont les badges injectés, confirmé statiquement et en runtime (97 éléments SVG/trust détectés sur etec-beauty).

### Timestamp
2026-06-06T15:10:00Z

### Reporter
KONAN — QA Expert NEXARA

---

## Re-test après fix ANNA commit 8cb015c — 2026-06-06

### Verdict
**GO** — StickyAddToCartMobile fonctionnel sur 5/5 templates testés. Fallback scroll (rAF + passive) opérationnel. Seuil 300px respecté.

---

### Contexte fix ANNA
- **Commit** : `8cb015c` — `fix(sticky-cta): fallback scroll listener when #main-cta absent`
- **Fichier modifié** : `src/lib/sections-v3/shared/StickyAddToCartMobile.ts` lignes 229-251
- **Approche** : quand `document.getElementById(mainCtaId)` retourne `null`, activation d'un scroll listener rAF (`passive: true`) au lieu d'un `return` silencieux. Seuil = `window.scrollY > 300`. Cleanup `pagehide`.
- **Vitest** : 18/18 tests verts (17 origine + 1 nouveau `fallback scroll : script contient requestAnimationFrame + passive scroll quand target absent`)
- **Templates touchés** : 0 — fix uniquement dans `StickyAddToCartMobile.ts`

---

### Résultats Playwright — iPhone 14 (390×844) — 5 templates

| Template | `#main-cta` présent | Invisible au chargement (scrollY=0) | Invisible à 100px (sous seuil) | Visible à 800px (au-delà seuil) | opacity@800 | transform@800 | Console errors JS |
|---|---|---|---|---|---|---|---|
| etec-beauty | Non (attendu) | Oui (opacity:0) | Oui (opacity:0) | Oui (`kvt-visible:true`) | 1.0 | matrix(1,0,0,1,0,0) | 0 applicatif |
| etec-jewel | Non (attendu) | Oui (opacity:0) | Oui (opacity:0) | Oui (`kvt-visible:true`) | 1.0 | matrix(1,0,0,1,0,0) | 0 applicatif |
| etec-techcase | Non (attendu) | Oui (opacity:0) | Oui (opacity:0) | Oui (`kvt-visible:true`) | 1.0 | matrix(1,0,0,1,0,0) | 0 applicatif |
| etec-natural | Non (attendu) | Oui (opacity:0) | Oui (opacity:0) | Oui (`kvt-visible:true`) | 1.0 | matrix(1,0,0,1,0,0) | 0 applicatif |
| etec-streetz | Non (attendu) | Oui (opacity:0) | Oui (opacity:0) | Oui (`kvt-visible:true`) | 1.0 | matrix(1,0,0,1,0,0) | 0 applicatif |

**Score visible scroll 800px : 5/5**
**Score invisible scroll 100px (sanity check seuil) : 5/5**

Note : les console errors présentes sur etec-jewel (5), etec-techcase (8), etec-streetz (5) sont toutes des `404` sur `cdn.shopify.com/serum-*.jpg` — images fixture mock inexistantes, non bloquantes, déjà documentées dans le premier test. Aucune erreur JS applicative, aucun warning rAF/scroll.

---

### Détail runtime etec-beauty (représentatif)

```json
{
  "initial":  { "mainCtaFound": false, "kvtVisible": false, "opacity": 0, "transform": "matrix(1,0,0,1,0,73)", "scrollY": 0 },
  "at100":    { "mainCtaFound": false, "kvtVisible": false, "opacity": 0, "transform": "matrix(1,0,0,1,0,73)", "scrollY": 100 },
  "at800":    { "mainCtaFound": false, "kvtVisible": true,  "opacity": 1, "transform": "matrix(1,0,0,1,0,0)",  "scrollY": 800 },
  "verdict":  { "mainCtaAbsent": true, "invisibleAt0": true, "invisibleAt100": true, "visibleAt800": true }
}
```

---

### Vérification statique fallback dans les HTML régénérés

Les 5 HTML ont été régénérés via `audit/generate-html-snapshots.ts` sur le commit `8cb015c` avant les tests Playwright. Vérification grep :

| Template | scrollFallback | requestAnimationFrame | passive:true | scrollY>300 |
|---|---|---|---|---|
| etec-beauty | 4 occurrences | 1 | 1 | 1 |
| etec-jewel | 4 occurrences | 1 | 1 | 1 |
| etec-techcase | 4 occurrences | 1 | 1 | 1 |
| etec-natural | 4 occurrences | 1 | 1 | 1 |
| etec-streetz | 4 occurrences | 1 | 1 | 1 |

---

### Screenshots re-test

- `audit/screenshots/pr16-retest/pr16-retest-etec-beauty-scroll800-sticky-visible.png`
- `audit/screenshots/pr16-retest/pr16-retest-etec-jewel-scroll800-sticky-visible.png`
- `audit/screenshots/pr16-retest/pr16-retest-etec-techcase-scroll800-sticky-visible.png`
- `audit/screenshots/pr16-retest/pr16-retest-etec-natural-scroll800-sticky-visible.png`
- `audit/screenshots/pr16-retest/pr16-retest-etec-streetz-scroll800-sticky-visible.png`

---

### Recommandation merge

**GO — merge autorisé.**

Le fix ANNA résout le bug BUG-01 sans toucher aux templates. Le fallback scroll est propre : rAF-throttled, passive, cleanup pagehide, seuil 300px correct, retour à l'état caché si re-scroll sous le seuil.

**Points restants post-merge (non bloquants) :**
- BUG-02 (Low) : fallback `!IntersectionObserver` toujours présent en code mort — acceptable, <1% browsers.
- Ajout de `id="main-cta"` sur les boutons hero des 43 templates permettrait d'utiliser l'IntersectionObserver (déclenchement plus précis que le seuil fixe 300px). À scheduler en sprint suivant, non bloquant pour le launch.

### Timestamp re-test
2026-06-06T15:48:00Z

### Reporter re-test
KONAN — QA Expert NEXARA
