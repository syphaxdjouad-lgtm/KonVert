# Konvert Store Builder for Shopify — Plan stratégique (2026-06-14)

**Owner :** KISAME (PM)  
**Status :** Draft — attente validation founder  
**Projet :** KONVERT — module additif (pas pivot)  
**Date cible démarrage Sprint 0 :** 2026-07-07 (post-C2 mergé)

---

## TL;DR

Konvert ajoute un mode "Store Builder for Shopify" basé sur un fork Dawn 15.4 : l'IA remplit un schema JSON Shopify depuis une URL produit, on installe le thème + une extension Shopify privée (upsells + tracking) en 1 clic OAuth. Le moteur page-produit-standalone Next.js existant n'est pas touché. On écrase Copyfy sur 5 axes CRO que leur Store Builder n'a pas. Durée : 10 sprints / 10 semaines calendaires / ~110 jours-homme. Launch privé beta T+10 sem.

---

## Why now / Why this

**Signal #1 — Copyfy a validé le marché.** Leur Store Builder (fork Dawn 15.4 + extension Shopify privée + IA fill JSON) est en production sur des stores réels. Stack décodée intégralement au 2026-06-05 : 0 secret industriel, 0 dépendance technique opaque. Si eux l'ont fait avec des moyens bootstrappés en 6-10 sem, Konvert peut faire la même chose avec 5 différenciateurs CRO que Copyfy n'a pas — et notre stack ANNA/ANNA-grade est techniquement supérieure.

**Signal #2 — Gap promesse/réalité chez Copyfy = notre fenêtre d'entrée.** Leur Store Builder génère une page produit basique avec la home Dawn par défaut : pas de branding, pas de homepage générée, pas d'A/B test, pas de re-audit continu. C'est leur principale source de churn documentée. Notre différenciation = livrer un mini-store complet (home + produit + checkout customisé) avec CRO premium intégré.

**Signal #3 — Module additif = risque minimal.** Notre moteur page-produit-standalone (Next.js + V3 sections + prompt v2.2) reste intact. Le Store Builder est un mode parallèle dans le dashboard. Pas de pivot, pas de régression.

**Signal #4 — Timing produit.** C2 (Settings panel) se termine autour du 2026-07-04. C3 à C5 ne sont pas démarrés. C'est le bon moment pour arbitrer : shipper C3-C5 (builder interne) ou shipper Store Builder Shopify (marché externe validé) en premier.

---

## Scope IN / Scope OUT

### Scope IN

- Fork Dawn 15.4 → "Konvert CRO - V1" (thème Shopify uploadé via API Admin)
- 10 sections CRO premium custom en Liquid (absent chez Copyfy) :
  - Urgency/scarcity bar dynamique (stock countdown)
  - Comparison table (produit vs concurrent)
  - Founder story / brand video embed
  - Testimonials carousel rich (photo + note + date)
  - Sticky ATC mobile (bouton flottant)
  - FAQ rich (JSON-LD Schema intégré)
  - Garanties visuelles (icônes + textes configurables)
  - Social proof configurable (chiffre déclaré par le marchand — redéfini 2026-07-27, la version "live" via backend se rebranche Sprint 5-6, voir Decision log)
  - ~~Packshot 3D / galerie multi-vues carousel~~ → KILLÉ 2026-07-27 : on s'appuie sur la galerie native Dawn (`product-media.liquid` model-viewer OS 2.0 + settings `gallery_layout`/`media_size`/`image_zoom` de `main-product.liquid`). Config déléguée au générateur IA Sprint 7. (Total sections custom : 10 → 9)
  - Exit-intent popup (discount triggered)
- Générateur IA Claude : scrape URL produit → remplit schema JSON Dawn-compatible (titres, descriptions, sections, FAQ, témoignages)
- 3 templates JSON par vertical au launch beta : dropshipping généraliste, beauté/skincare, tech/accessoires
- Extension Shopify privée Konvert : upsell post-ATC + tracking events vers dashboard Konvert + discount stacking
- OAuth Shopify (scopes minimaux : themes/write, products/write, script_tags/write)
- Installation automatisée : upload thème + create product + activer thème + installer extension = flux en 1 clic
- Schema markup avancé : Product + Review + Offer + Organization JSON-LD dans les sections Liquid
- A/B test natif : 2 variantes JSON de section (titre H1 ou description) avec tracking conversions par variante
- Re-audit CRO J+7 / J+30 : score automatique basé sur critères checklist + recos email
- Dashboard Konvert : onglet "Store Builder" distinct du "Page Builder" existant

### Scope OUT (anti-scope-creep — réponse préparée à l'avance)

- Pages SEO programmatiques "alternatives to X" → plan séparé (M2-M3 2026)
- Free tools SEO (CRO checker, above-the-fold analyzer, etc.) → plan séparé
- Programme affiliate code promo creators → plan séparé
- Génération d'avatars / photos UGC / vidéo IA → SHISUI plan séparé
- Editor visuel Shopify (drag-drop de sections dans l'interface Konvert) → réservé post-beta si demande validée
- Support WooCommerce / PrestaShop dans ce module → hors scope v1
- Marketplace publique de templates Dawn → post-beta, pas dans ce plan
- Génération homepage hero IA (complex : nécessite assets brand) → uniquement pré-filled template au launch
- Chantiers C3/C4/C5 Konvert builder interne → séquencés après, pas en parallèle
- Multilingue du thème généré (FR/EN/AR) → post-beta sprint 11+

---

## Architecture cible

Le Store Builder Konvert est un mode parallèle dans le dashboard existant. Il ne touche pas au moteur page-produit-standalone (Next.js + `/api/generate` + `/preview`). Il ajoute :

1. Une couche Shopify API Admin (thème upload, product create, extension install) dans `/src/lib/shopify/store-builder/`
2. Un générateur IA dédié dans `/src/lib/ai/store-builder-generator.ts` (prompt distinct du générateur page-produit)
3. Un répertoire Dawn forké versionné dans `/konvert-dawn/` (hors du repo Next.js, repo Git séparé)
4. Une extension Shopify privée dans `/konvert-shopify-extension/` (Shopify CLI)

```
[User dashboard Konvert]
        │
        ├── [Page Builder] (existant — V3 sections + prompt v2.2)
        │
        └── [Store Builder] (nouveau)
                │
                ├── Step 1 : Paste URL produit source
                ├── Step 2 : Scrape + IA fill JSON (Claude)
                ├── Step 3 : Preview thème (Dawn fork) in iframe
                ├── Step 4 : Connect Shopify OAuth
                └── Step 5 : 1-clic install
                           │
                           ├── Upload "Konvert CRO - V1" (.zip) via Themes API
                           ├── Create product + images via Products API
                           ├── Activate theme
                           └── Install Extension Konvert (upsell + tracking)

[konvert-dawn/]                [konvert-shopify-extension/]
  └── Dawn 15.4 forké           └── Extension Shopify CLI
      + 10 sections Liquid           (upsell post-ATC + events)
      + 3 templates JSON
      + schema markup JSON-LD
```

**Règle d'or** : on étend Dawn, on ne le remplace pas. Toute section custom est un fichier Liquid isolé dans `/sections/konvert-*.liquid`. Upstream Dawn met à jour = merge ciblé uniquement sur les fichiers core, pas les sections custom.

---

## Sprints chiffrés

Démarrage proposé : **2026-07-07** (semaine suivant merge C2 estimé ~2026-07-04).

| Sprint | Semaines | Périmètre | Effort estimé | Owner |
|---|---|---|---|---|
| **Sprint 0** | S1 (7-11 juil) | Foundation : repo `konvert-dawn`, fork Dawn 15.4, renommage "Konvert CRO - V1", repo `konvert-shopify-extension` init Shopify CLI, Shopify Partner Account configuré, OAuth scopes documentés, CI lint Liquid | 5 jours-homme | ANNA |
| **Sprint 1** | S2 (14-18 juil) | 5 sections Liquid CRO premium (urgency bar, comparison table, testimonials carousel, sticky ATC mobile, FAQ rich + JSON-LD) | 8 jours-homme | ANNA + OBITO |
| **Sprint 2** | S3 (21-25 juil) | 5 sections Liquid CRO premium suite (founder story video, garanties visuelles, social proof live, packshot 3D carousel, exit-intent popup) + intégration schema markup JSON-LD Product + Review + Offer | 8 jours-homme | ANNA + OBITO |
| **Sprint 3** | S4 (28 juil - 1 août) | Template JSON vertical #1 dropshipping généraliste + #2 beauté/skincare (valeurs par défaut toutes sections, copy pré-remplie en FR) | 5 jours-homme | ANNA + ZARA |
| **Sprint 4** | S5 (4-8 août) | Template JSON vertical #3 tech/accessoires + API Shopify Admin : upload thème .zip, create product, activate theme (endpoints + error handling) | 6 jours-homme | ANNA |
| **Sprint 5** | S6 (11-15 août) | Extension Shopify privée Konvert : upsell post-ATC (discount stacking), tracking events (add_to_cart, purchase, page_view) vers endpoint Konvert, install via API | 8 jours-homme | ANNA |
| **Sprint 6** | S7 (18-22 août) | OAuth flow Shopify complet dans dashboard Konvert (connect store, token storage Supabase, scope validation, revoke) + onglet "Store Builder" UI | 6 jours-homme | ANNA + OBITO |
| **Sprint 7** | S8 (25-29 août) | Générateur IA Claude (prompt dédié : scrape URL → JSON Dawn-compatible → 3 sections pré-remplies : titre, description, FAQ, témoignages) + preview iframe thème dans dashboard | 7 jours-homme | ANNA + MINATO |
| **Sprint 8** | S9 (1-5 sept) | A/B test natif (2 variantes JSON section titre H1 / description, tracking conversions par variante, switch variante depuis dashboard) + re-audit CRO auto J+7 (score checklist email) | 8 jours-homme | ANNA + KAKASHI |
| **Sprint 9** | S10 (8-12 sept) | Tests E2E (Playwright : flux install complet, génération IA, OAuth, upload thème, A/B toggle) + polish UI + fix bugs QA | 7 jours-homme | KONAN + ANNA |
| **Sprint 10** | S11 (15-19 sept) | Launch privé beta : 10-20 users sélectionnés (cohort Agency + Pro), onboarding email, NPS J+7, collecte feedback DEIDARA | 4 jours-homme | DEIDARA + NARUTO |

**Total effort : 72 jours-homme** (ANNA ~50j, OBITO ~8j, KONAN ~5j, ZARA ~3j, KAKASHI ~2j, MINATO ~2j, DEIDARA ~1j, NARUTO ~1j)  
**Durée calendaire : 11 semaines** (7 juil → 19 sept 2026)  
**Buffer recommandé : +2 semaines** pour Shopify Partner App Review (voir Risques)  
**Date cible launch beta : 2026-09-21**

---

## Risques majeurs + mitigation

### R1 — Shopify Partner App Review (probabilité : élevée, impact : bloquant)

L'extension Shopify privée doit passer une review Shopify avant d'être distribuable même sur des stores individuels (si on dépasse 1 store en mode development). Copyfy a déjà franchi cet obstacle — preuve que c'est possible, mais ça peut prendre 2 à 4 semaines.

**Mitigation :** Soumettre l'extension en review dès Sprint 5 (mi-août), ne pas attendre Sprint 9. En parallèle, prévoir un mode dégradé "sans extension" (upload thème + produit seulement, upsell/tracking désactivés) pour ne pas bloquer le launch beta. Si review refusée, analyser les motifs et resubmit.

### R2 — Maintenance fork Dawn upstream (probabilité : certaine, impact : moyen)

Shopify met à jour Dawn régulièrement (patches sécurité, nouvelles features OS 2.0). Chaque update peut créer des conflits avec nos sections custom.

**Mitigation :** Stratégie de fork disciplinée dès Sprint 0 — toutes les sections custom Konvert dans des fichiers préfixés `/sections/konvert-*.liquid`, jamais de modification des fichiers Dawn core. Update upstream = merge ciblé sur fichiers core uniquement. Nommer explicitement dans le README du fork les fichiers "ne pas modifier". Review upstream Dawn 1x/trimestre (owner : ANNA).

### R3 — Cannibalisation du moteur page-produit-standalone (probabilité : faible, impact : moyen)

Un utilisateur pourrait préférer le Store Builder Shopify et délaisser le moteur page-produit Next.js actuel. Risque de confusion ICP : "lequel utiliser ?".

**Mitigation :** Messaging clair dès le dashboard — "Tu n'as pas de boutique Shopify ? → Page Builder. Tu as une boutique Shopify et tu veux installer un store complet ? → Store Builder." Deux modes, deux entrées distinctes, pas de chevauchement UX. Surveiller la métrique pages générées/user sur le moteur standalone post-launch beta — si chute > 20%, briefer DEIDARA pour enquête qualitative.

### R4 — Dérapage 10 sem → 14-16 sem (probabilité : moyenne, impact : élevé)

L'effort Liquid (sections custom), l'extension Shopify (nouveau domaine technique pour ANNA), et le générateur IA dédié sont 3 chantiers distincts. La Shopify Partner API a des edge cases non documentés.

**Mitigation :** Sprint 0 = spike technique obligatoire (fork Dawn + 1 section Liquid + endpoint upload thème en local), avant de committer toute la roadmap. Si spike Sprint 0 révèle complexité > 5j, re-estimer sprint par sprint. Ne jamais paralléliser extension Shopify et générateur IA avant que le thème upload soit validé en conditions réelles.

### R5 — Témoignages générés = risque juridique (probabilité : faible, impact : élevé)

Le générateur IA qui remplit des témoignages "génériques" dans le template = risque article L122-1 (publicité trompeuse), déjà documenté dans le rollback prompt v2 du 2026-06-06.

**Mitigation :** Scope IN explicite — le générateur IA remplit titre, description, FAQ, garanties. Les témoignages sont des placeholders visuels marqués "[Remplacez par vos avis clients réels]" + bandeau d'avertissement visible. Aucun témoignage fictif généré. MADARA valide ce point avant Sprint 7.

---

## Dependencies critiques

### Techniques

- **Shopify Partner Account** configuré avec app privée (ANNA Sprint 0 — bloquant pour Sprint 5+)
- **OAuth scopes minimaux validés** : `write_themes`, `write_products`, `write_script_tags` — vérifier si `write_publications` nécessaire pour activer le thème
- **Shopify CLI** installé + env de dev Shopify (development store pour tests Sprint 1-8)
- **Endpoint Konvert backend** pour recevoir les events de l'extension (POST `/api/shopify/events`)
- **Supabase table** `shopify_store_connections` (token OAuth, store domain, theme_id, extension_id)

### Business

- **Décision pricing** validée par founder avant Sprint 0 (TSUNADE brief à déclencher)
- **Shopify Partner App Review** soumise au plus tôt (Sprint 5, pas Sprint 9)
- **Contrat legal mode beta** : clause "output IA = placeholder, remplacer avant publication" dans CGU

### Equipe

| Agent | Rôle dans ce plan | Sprint critique |
|---|---|---|
| ANNA | Lead impl (Liquid, API Shopify, extension, IA, OAuth) | Tous sprints |
| OBITO | UI onglet Store Builder + preview iframe design | S1, S2, S6 |
| KONAN | Tests E2E Playwright (OAuth, install, génération) | S9 |
| MINATO | Prompt dédié store builder (schema JSON, guardrails) | S7 |
| KAKASHI | NSM tracking (stores installés, A/B conversions) | S8 |
| ZARA | Copy templates JSON + onboarding email beta | S3, S10 |
| DEIDARA | NPS J+7 beta + collecte feedback qualitatif | S10 |
| MADARA | Audit risques juridiques (témoignages, données OAuth) | Avant S7 |
| TSUNADE | Validation pricing add-on + impact MRR | Avant S0 |
| NARUTO | Launch privé beta (email annonce + DM cohort sélectionnée) | S10 |

---

## Success metrics

| Metric | Type | Baseline | Cible | Deadline |
|---|---|---|---|---|
| Stores Shopify installés via Store Builder | NSM primaire | 0 (nouveau module) | 30 stores actifs | T+12 sem (2026-10-05) |
| CR install → premier thème activé | Activation | -- | > 70% | Mesuré dès T+1 sem beta |
| Time-to-value (URL produit collée → store live) | UX | -- | < 8 minutes | Mesuré en test utilisateur S9 |
| Churn semaine 1 (stores désinstallés J0-J7) | Rétention | -- | < 20% | T+2 sem beta |
| Score NPS beta cohort J+7 | Satisfaction | -- | > 40 | T+2 sem beta |
| Pages produit standalone conservées après install | Anti-cannibalisation | baseline au 2026-09-21 | Pas de chute > 20% | T+4 sem post-beta |

**Counter-metric :** latence step génération IA (URL → JSON complet) — cible p95 < 20 secondes. Si > 30s, UX dégrade et le CR install s'effondre.

---

## Séquencement vs autres chantiers en cours

### Chantiers actifs au 2026-06-14

| Chantier | Branche / Worktree | État | Impact sur ce plan |
|---|---|---|---|
| **C2 Settings panel** | `konvert-c2` / `feat/editor-settings-panel` | En cours (5 commits) | Doit merger avant Sprint 0. Estimation merge : ~2026-07-04. |
| **Audit-360 J-1 fixes** | `feat/audit-360-jmoins1-fixes` | Branche locale, non mergée | À merger ou archiver avant Sprint 0 |
| **PR #19 V3 P0+P1** | `main` | Mergée aujourd'hui | Pas d'impact |
| **PR #20 prompt v2.2** | `main` | Mergée aujourd'hui | Pas d'impact |
| **Prompt v2.1 brand-based** | Plan `2026-06-11-prompt-v2-1-brand-based.md` | Plan rédigé, non implémenté | Non bloquant — peut attendre |

### Chantiers non démarrés (décision de séquencement)

| Chantier | Décision recommandée |
|---|---|
| **C3 Sections ajoutables** | Suspendre — démarrer après beta Store Builder (T+12 sem minimum) |
| **C4 Blocks library** | Suspendre — même raison, chantier 3 sem seul |
| **C5 Global Styles** | Suspendre — idem |
| **SEO cluster 15 articles** | Peut démarrer en parallèle (RYUK/ZARA, pas ANNA) — pas de contention ressource |
| **V3 phases 2-3 (architecture décidée)** | Mettre en pause — après beta Store Builder |
| **Roadmap V2 multi-agents** | Planifiée post-launch — pas de changement |

**Règle de séquencement :** ANNA est la ressource contrainte. Elle ne peut pas mener C2 + Store Builder Shopify en parallèle. Séquence imposée : C2 merge → Store Builder Sprint 0.

---

## Décision pricing (esquisse — à valider TSUNADE)

**Question centrale :** le Store Builder est-il inclus dans Agency 199€, ou add-on payant séparé ?

### Option A — Add-on $59/mois (recommandée)

- Store Builder disponible en add-on pour les tiers Pro (79€) et Agency (199€)
- Pricing : +59€/mois (ou +49€ si annuel)
- Rationale : le Store Builder crée une valeur distincte (store complet Shopify), justifie un pricing séparé
- Avantage : MRR additionnel par user existant (expansion revenue), pas de cannibalisation du pricing de base
- Risque : friction d'activation si l'user doit payer plus pour tester

### Option B — Inclus dans Agency 199€ uniquement

- Réservé au tier le plus haut, signal "premium"
- Rationale : Agency = multi-boutiques, Store Builder = multi-boutiques par définition
- Avantage : pas de friction, test rapide en beta
- Risque : sous-monétisé si les Pro veulent aussi accès

### Option C — Tier dédié "Store Builder" $99/mois standalone

- Produit séparé, pas forcément lié au Page Builder
- Rationale : cible des users qui n'ont pas de besoin de page standalone mais veulent un store complet
- Risque : fragmentation du brand Konvert, complexité support

**Recommandation KISAME :** Option A (add-on $59/mois) pour le launch beta (feedback pricing inclus). Décision finale à confirmer par TSUNADE après modélisation MRR/churn.

---

## Out-of-scope explicite

Les 4 points suivants feront l'objet de plans séparés, séquencés après validation du beta Store Builder :

1. **SEO programmatique** (~250 URLs "alternatives to X" × 5 langues) — plan dédié, owner RYUK + ZARA + ANNA, cible Q3 2026
2. **Free tools SEO** (CRO checker, above-the-fold analyzer, DTC headline generator) — plan dédié, 1 sem par tool, cible Q4 2026
3. **Programme affiliate code promo creators** — plan dédié, owner NAGATO + TSUNADE, cible Q3 2026
4. **Génération avatars / photos UGC / vidéo ads** — SHISUI plan séparé, hors scope Konvert core

---

## 3 questions ouvertes pour le founder avant Sprint 0

### Q1 — Pricing : add-on $59/mois ou inclus Agency 199€ ?

C'est la décision la plus structurante pour le plan go-to-market. Elle conditionne la promesse faite aux beta users et le message d'onboarding. Elle doit être tranchée avant de briefer DEIDARA et NARUTO sur le launch beta.

### Q2 — Faut-il séquencer Store Builder AVANT ou APRES C3-C5 du builder interne ?

Ce plan recommande de prioriser Store Builder (marché Shopify validé par Copyfy, 30 stores cible T+12 sem) avant de finir le builder interne (C3 sections ajoutables, C4 blocks library, C5 styles). Mais si le moteur page-produit standalone est jugé insuffisant sans C3-C5, il faut inverser l'ordre. La décision founder ici est : lequel des deux marchés (store Shopify complet vs page standalone enrichie) est prioritaire Q3 2026 ?

### Q3 — Shopify Partner Account : est-il déjà créé et actif ?

C'est le prérequis bloquant du Sprint 0. Si le compte Shopify Partner n'existe pas encore, il faut le créer maintenant (gratuit, 15 min) et créer l'app privée dans le Partner Dashboard avant même le 7 juillet. Sans ça, impossible de tester l'upload de thème via API en dev.

---

## Decision log

| Date | Decision | Options | Rationale |
|---|---|---|---|
| 2026-06-14 | Module additif, pas pivot | Module additif / pivot complet vers Shopify | Moteur page-produit standalone en production, revenue existant, pas de raison de casser ce qui marche |
| 2026-06-14 | Fork Dawn 15.4 comme base, pas custom | Dawn fork / HTML/CSS custom / GrapesJS templating | Dawn = perf native Lighthouse 95+, sections JSON = IA facile, licence MIT, preuve Copyfy en prod |
| 2026-06-14 | Démarrage Sprint 0 post-merge C2 (7 juil) | Démarrer maintenant / attendre C2 | ANNA ressource contrainte — C2 est en cours sur worktree, pas d'arrêt à mi-chemin |
| 2026-06-14 | Témoignages = placeholders uniquement | Témoignages IA / placeholders | Risque L122-1 documenté au rollback prompt v2 (2026-06-06) — zéro tolérance |
| 2026-06-14 | Extension Shopify review soumise Sprint 5 (pas Sprint 9) | Review en fin de plan / review en milieu | Review Shopify = 2-4 sem, soumettre tôt = mode dégradé possible si refus, pas de blocage launch |
| 2026-07-27 | `konvert-social-proof-live` redéfinie en `konvert-social-proof` (déclaratif marchand, pas de live) | Live via endpoint backend (B) / Storefront API (C) / report V2 (D) / déclaratif statique (A modifiée) | Storefront API n'expose pas les données commandes ; vrai live dépend d'infra Sprint 5-6 inexistante ; version déclarative réutilise le pattern R5 déjà validé sur `promo_code`, buildable immédiatement sans risque juridique |
| 2026-07-27 | `konvert-gallery-carousel` / packshot 3D killée comme section custom | Upload manuel + carousel custom / génération IA HINATA / connecteur externe / galerie native Dawn + config | Dawn 15.4 a déjà `product-media.liquid` (model-viewer natif OS 2.0) + settings `gallery_layout`/`media_size`/`image_zoom` — dupliquer = ingénierie inutile sur fonctionnalité déjà en prod |
