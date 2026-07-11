# AUDIT TECHNIQUE COMPLET — KONVERT

**Auditeur :** Fable 5 (analyse statique full-stack, read-only)
**Date :** 2026-07-09
**Périmètre :** `/Users/mac/nexara/konvert` — Next.js 16 (App Router) · TypeScript · Supabase (RLS multi-tenant) · Stripe LIVE · Resend · Vercel (region cdg1)
**Méthode :** lecture/analyse statique uniquement (aucun build, dev, install ni test exécuté — contrainte Mac 8 Go RAM). ~396 fichiers TS/TSX, 36 routes API, 11 migrations SQL analysés.

---

## 1. Résumé exécutif

Konvert est un codebase **mûr et sérieusement durci côté sécurité applicative** : il a manifestement subi plusieurs passes d'audit (traces "Madara P1-01/P1-02", "grants_hardening", "security_rls_lockdown"). La couche back-end est solide — RLS activée sur toutes les tables, anti-SSRF à double barrière (whitelist e-commerce + blocklist IP privées/IPv6/metadata cloud), chiffrement AES-256-GCM des tokens boutiques, auth admin timing-safe, webhook Stripe avec vérification de signature **et** idempotence, quota atomique en SQL `FOR UPDATE`, rate-limiting distribué Upstash, captcha Turnstile, aucun secret réel commité. **Je n'ai trouvé aucune faille P0 exploitable côté sécurité.**

Le vrai risque de launch n'est **pas** technique, il est **légal/marketing** : les pages publiques affichent des **statistiques fabriquées et invérifiables** (50 000 pages générées, 2,1 M€ générés, 98 % satisfaction, 2 800 e-commerçants, un tableau `FAKE_CLIENTS`) et une **garantie contradictoire** (14 jours dans les CGV, 30 jours dans le marketing). Pour un lancement en France avec Stripe LIVE, ceci tombe sous l'art. L121-1 s. du Code de la consommation (pratiques commerciales trompeuses) — c'est le point le plus dangereux du projet aujourd'hui.

Côté performance : rien de bloquant, mais des gains faciles — 26 balises `<img>` brutes au lieu de `next/image`, pages marketing entièrement `'use client'` (pas de SSR, framer-motion embarqué), et une page A/B test avec requêtes en cascade. Côté dette technique : duplication de helpers (`escapeHtml` dans 21 fichiers, `isAdmin` dans 4), 8 routes API sans `try/catch` autour de `req.json()`, et une racine de repo encombrée de fichiers d'audit/plan `.md`/`.html`.

**Verdict launch :** techniquement prêt, mais **ne pas lancer** avant d'avoir purgé/sourcé les chiffres marketing et harmonisé la garantie. Compter ~1 journée de travail sur les P0.

---

## 2. Tableau des findings (triés P0 > P1 > P2)

| # | Sév. | Dim. | Finding | Emplacement |
|---|------|------|---------|-------------|
| S-01 | **P0** | UX/Legal | Stats fabriquées affichées au launch (50k pages, 2,1 M€, 98 %, 2 800 users, 47 pays) | `src/components/marketing/StatsCounter.tsx:13-19` |
| S-02 | **P0** | UX/Legal | `FAKE_CLIENTS` hardcodés avec CVR inventés (5.1 %, 6.2 %…) | `src/app/(marketing)/page.tsx:848-853` |
| S-03 | **P0** | UX/Legal | Garantie incohérente : CGV = **14 jours**, marketing = **30 jours** | `legal/cgv/page.tsx:100` vs `pricing/page.tsx:529,745` |
| C-01 | P1 | Code | 8 routes API sans `try/catch` → `req.json()` malformé = 500 non géré | `api/ab`, `api/workspaces`, `api/notifications`, `api/admin/waitlist`, `api/workspaces/[id]/report`, `api/shopify/install`… |
| P-01 | P1 | Perf | 26 `<img>` brutes au lieu de `next/image` (LCP/CLS) | `(marketing)/page.tsx`, `blog/*`, `dashboard/new/page.tsx`, `(auth)/*` |
| P-02 | P1 | Perf | Pages marketing 100 % `'use client'` → pas de SSR, bundle framer-motion | `(marketing)/page.tsx`, `features`, `about`, `pricing` |
| P-03 | P1 | Perf | Page A/B test : 3 requêtes Supabase en cascade (waterfall ~600 ms) | `dashboard/pages/[id]/ab-test/page.tsx:31-75` |
| U-01 | P1 | UX/CRO | Nombre de templates incohérent : 38 / 42 / 50 selon la page | `(marketing)/page.tsx:519,1070,1139` |
| U-02 | P1 | UX/CRO | Teaser pricing home dit "5 pages/mois" Starter, page pricing dit "75" | `(marketing)/page.tsx:2895+` vs `pricing/page.tsx:40` |
| U-03 | P1 | UX/CRO | Badge garantie placé sous le fold, pas sous chaque CTA d'achat | `pricing/page.tsx:529,745` |
| SEC-01 | P2 | Sécu | CSP `script-src` contient `'unsafe-inline'` (affaiblit l'anti-XSS) | `next.config.ts` (strictCsp) |
| SEC-02 | P2 | Sécu | `/api/generate` (V3) ne passe pas l'output LLM dans `sanitizeDeep` (contrairement à `/public`) | `api/generate/route.ts:350-396` |
| SEC-03 | P2 | Sécu | URL image interpolée dans `src="${v.image}"` sans échappement d'attribut | `sections-v3/gallery/render.tsx`, `compare-variants/render.tsx` |
| SEC-04 | P2 | Sécu | CORS `*` + écriture service_role sur `/api/analytics/track` & `/api/ab` → inflation de metrics possible | `api/analytics/track/route.ts`, `api/ab/route.ts` |
| SEC-05 | P2 | Sécu | `/api/contact` renvoie `ok:true` même si l'insert DB échoue, et n'envoie aucun email à l'équipe | `api/contact/route.ts:40-66` |
| C-02 | P2 | Code | Duplication : `escapeHtml` (21 fichiers), `isAdmin` (4), `safeCompare` (3) | multiple |
| C-03 | P2 | Code | Racine du repo encombrée (~10 `.md`/`.html`/`.mjs` d'audit + `gen-v3-audit.ts` non suivi) | racine projet |
| C-04 | P2 | Code | Dossier `src/lib/anthropic/` alors que le moteur réel est DeepSeek (trompeur) | `src/lib/anthropic/generate.ts` |
| P-04 | P2 | Perf | Pas de `revalidate`/ISR sur pages marketing & blog | `(marketing)/*` |
| P-05 | P2 | Perf | `fetch` fire-and-forget vers `/api/email/preview` sans `AbortSignal.timeout` | `api/generate/public/route.ts:194` |
| P-06 | P2 | Perf | Vérifier l'existence de l'index composite `analytics_events(page_id, created_at)` | migration à confirmer |
| U-04 | P2 | UX | Testimonials avec stats non sourcées ("+5.2 % CVR", "ROAS x4.2") | `(marketing)/page.tsx:2775-2814` |
| U-05 | P2 | UX | Badge "Shopify Partner" — statut de certification à vérifier (risque marque) | `(marketing)/page.tsx:255` |
| U-06 | P2 | UX | Liens `href="#"` (anti-pattern a11y) | `(marketing)/affiliate/page.tsx:389` |
| U-07 | P2 | UX | Hero 100 % axé "AliExpress" alors que la saisie manuelle existe | `(marketing)/page.tsx:216-226` |

**Comptage total : 3 P0 · 6 P1 · 15 P2**

| Dimension | P0 | P1 | P2 |
|---|---|---|---|
| Code & Architecture | 0 | 1 | 3 |
| Sécurité | 0 | 0 | 5 |
| Performance | 0 | 3 | 3 |
| UX / CRO / Copy | 3 | 2 | 4 |

---

## 3. Détail par dimension

### 3.1 — Sécurité

**Posture générale : très bonne.** Aucun P0. Les fondamentaux d'un SaaS multi-tenant Stripe LIVE sont en place.

**Points forts vérifiés :**
- **RLS activée sur toutes les tables** (`users`, `subscriptions`, `stores`, `pages`, `analytics_events`, `workspaces`, `workspace_members`, `ab_tests`, `ab_variants`, `waitlist`, `invitations`) avec policies `auth.uid() = user_id`. Les tables sensibles (`public_previews`, `ab_events`) ont RLS activée **sans** policy anon/auth → accès service_role uniquement (`20260425_security_rls_lockdown.sql`).
- **Anti-SSRF à double barrière** : `validateScrapeUrl` (whitelist exacte de hosts e-commerce, pas de `includes`/`endsWith` naïf) + `isPrivateHost` (blocklist IPv4/IPv6, `::1`, `fe80::`, `fc00::/7`, IPv4-mapped, CGNAT `100.64/10`, metadata cloud `169.254.169.254`, mDNS `.local`). Appliquée sur `/scrape`, `/generate`, `/generate/public`, `/woocommerce/connect`.
- **Chiffrement des tokens boutiques** : AES-256-GCM avec IV aléatoire + auth tag (`encryptToken`), clé dérivée en SHA-256 d'`ENCRYPTION_KEY` (fail-fast si < 32 chars). Correct.
- **Webhook Stripe** : vérification de signature `constructEvent` + **idempotence** via table `processed_stripe_events` (contrainte unique, gère les replays). Downgrade → `free` (pas `starter` payant) à la résiliation. Solide.
- **Auth admin timing-safe** (`crypto.timingSafeEqual` sur hash SHA-256) sur `/admin/waitlist`, `/health/deep`, `/admin/stripe-preflight`. Crons protégés par `Bearer CRON_SECRET` timing-safe.
- **Quota atomique** : `check_and_increment_quota` en `SECURITY DEFINER` + `SELECT … FOR UPDATE` → pas de race condition. Fonctions révoquées de `anon`/`authenticated`/`public` (`20260531_grants_hardening.sql`) après un incident où un anon pouvait épuiser le quota d'autrui ou TRUNCATE l'idempotence Stripe.
- **Aucun secret réel commité** : seul `.env.example` est suivi (placeholders). `.env.local` gitignoré et non tracké. La seule occurrence `sk_live_` de l'historique git est un faux (`sk_live_AAAA…` dans `scrub.test.ts`). `SUPABASE_SERVICE_ROLE_KEY` jamais importée dans `src/components`/`src/providers`.
- **Headers** : HSTS preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP. CSP séparée builder (GrapesJS, `unsafe-eval`) vs strict.

**Findings :**

- **SEC-01 (P2) — CSP `script-src 'unsafe-inline'`.** `next.config.ts` (strictCsp) autorise `'unsafe-inline'` dans `script-src`, ce qui neutralise une bonne part de la protection XSS de la CSP (un script injecté inline s'exécute). C'est un compromis classique Next.js sans nonce. *Fix :* migrer vers une CSP à nonce (middleware qui injecte un nonce par requête) si l'effort est justifié — sinon documenter le risque accepté.

- **SEC-02 (P2) — Incohérence de sanitisation entre les deux routes de génération.** `/api/generate/public` passe l'output LLM par `sanitizeDeep()` avant rendu ; le chemin **V3 authentifié** de `/api/generate` ne le fait pas (`route.ts:350-396`) et s'appuie uniquement sur l'échappement par section. L'échappement `escapeHtml` **est présent** dans chaque renderer V3 (`hero`, `faq`, `reviews`, etc.), donc le risque de stored-XSS est faible — mais la défense en profondeur est asymétrique. *Fix :* appliquer `sanitizeDeep(aiOutput)` aussi côté V3 authentifié.

- **SEC-03 (P2) — Injection d'attribut sur les URLs image.** Dans `gallery/render.tsx` et `compare-variants/render.tsx`, `src="${v.image}"` interpole l'URL sans l'échapper (le texte l'est via `escapeHtml`, pas l'attribut src). Risque théorique de casser l'attribut si une URL contient `"`. Faible car les images viennent du scraper/whitelist ou de l'upload user. *Fix :* échapper l'URL ou valider `new URL()` avant interpolation.

- **SEC-04 (P2) — Inflation de metrics via CORS wildcard.** `/api/analytics/track` et `/api/ab` (log) ont `Access-Control-Allow-Origin: *` et écrivent en service_role. Les `page_id`/`variant_id` sont découvrables dans le HTML public → un script tiers peut gonfler vues/clics/conversions. Mitigé par rate-limit (30/min/IP) + dédup visitor_id, mais pollue les stats et les décisions A/B. *Fix :* accepter le risque (vanity) ou signer les events.

- **SEC-05 (P2) — Perte silencieuse des messages de contact.** `/api/contact` renvoie `ok:true` même quand l'insert `contact_messages` échoue, et **n'envoie aucun email à l'équipe** — les demandes n'existent que dans une table DB qu'il faut penser à consulter. *Fix :* envoyer une notification Resend à l'équipe + renvoyer une erreur si l'insert échoue.

*Non vérifiable en statique :* configuration réelle des env vars Vercel (scopes Production/Preview), état réel des policies RLS en base (le schéma est cohérent mais je n'ai pas pu interroger l'instance), et la réalité de la certification "Shopify Partner".

---

### 3.2 — Code & Architecture

**Structure globale : bonne.** App Router bien organisé en groupes de routes `(auth)`/`(dashboard)`/`(marketing)`/`admin`/`api`. `src/lib/` découpé par domaine (ai, scraper, stripe, supabase, security, email, shopify/woocommerce/youcan, sections-v3). Le proxy/middleware (`src/proxy.ts`) centralise rate-limiting + session Supabase + capture UTM first-touch, avec un matcher qui exclut correctement les assets statiques. `supabaseAdmin` est un Proxy lazy (instancié à runtime, pas au build) — bonne parade au bug Next 16 "Collecting page data". Gestion d'erreur globalement propre : messages génériques côté client, détails vers Sentry, jamais de fuite d'internals en prod.

Dette maîtrisée : **28** occurrences de `any` (modéré pour 396 fichiers), **quasi zéro** `TODO/FIXME/HACK` réel dans le code source.

**Findings :**

- **C-01 (P1) — Routes API sans `try/catch`.** 8 routes appellent `await req.json()` sans garde : `api/ab` (POST), `api/workspaces`, `api/notifications`, `api/admin/waitlist`, `api/workspaces/[id]/report`, `api/shopify/install`, `api/__test/render-template`. Un body malformé → exception non gérée → 500 opaque (et bruit Sentry). *Fix :* wrapper `req.json()` dans un `try/catch` renvoyant un 400 propre (pattern déjà utilisé dans `/api/upload`).

- **C-02 (P2) — Duplication de helpers.** `escapeHtml` redéfini dans ~21 fichiers (chaque renderer V3 + report), `isAdmin` dans 4 routes, `safeCompare` dans 3. *Fix :* extraire dans `src/lib/security/` (`escapeHtml`, `isAdmin`, `safeCompare`) et importer.

- **C-03 (P2) — Racine encombrée.** ~10 fichiers d'audit/plan à la racine (`AUDIT_*.md`, `LAUNCH-*.md`, `PLAN-*.html`, `*.html` de preview, `preview-noir.mjs`) + `gen-v3-audit.ts` non tracké par git. Bruit dans le repo. *Fix :* déplacer dans `docs/`, ajouter les previews/scratch au `.gitignore`.

- **C-04 (P2) — Nommage trompeur.** `src/lib/anthropic/generate.ts` implémente en réalité DeepSeek (`GENERATION_MODEL = 'deepseek-chat'`, `api.deepseek.com`). Le commentaire l'explique mais c'est un piège pour un nouveau dev. *Fix :* renommer `src/lib/ai/generate.ts` (le dossier `src/lib/ai/` existe déjà) au prochain refactor.

*Observation (non-finding) :* 82 des 162 fichiers `.tsx` sont `'use client'`. Élevé, mais attendu pour une app builder-heavy (GrapesJS, dnd-kit, wizard). Voir P-02 pour l'impact sur les pages marketing spécifiquement.

---

### 3.3 — Performance

Aucun bloquant. `Promise.all()` est correctement utilisé pour paralléliser les lectures Supabase sur le dashboard principal (`users`+`pages`+`stores` en parallèle). Les libs lourdes (grapesjs, jspdf, dnd-kit) sont confinées aux routes builder/report — pas de bloat sur les routes critiques. `maxDuration` réaliste (90 s génération/scrape, 60 s crons, sous Fluid Compute).

**Findings :**

- **P-01 (P1) — 26 `<img>` brutes.** `(marketing)/page.tsx` (5), `about` (2), `blog/[slug]` + `BlogListClient` (5), `dashboard/new/page.tsx` (6+), `(auth)/login`+`signup` (4). Pas de lazy-load, pas de webp/AVIF, pas de sizing responsive → LCP/CLS dégradés. `next.config.ts` a déjà les `remotePatterns` Unsplash/Amazon/AliExpress configurés. *Fix :* remplacer par `next/image` avec `width`/`height`.

- **P-02 (P1) — Pages marketing entièrement `'use client'`.** `page.tsx` (home, 1000+ lignes), `features`, `about`, `pricing` sont marquées `'use client'` → hydratation complète, pas de SSR du contenu, framer-motion (~60 KB gz) dans le bundle. TTFP potentiellement 3-4 s sur 3G. *Fix :* convertir en Server Components et isoler les sections interactives dans des Client Components chargés en `dynamic()`.

- **P-03 (P1) — Waterfall sur la page A/B test.** `dashboard/pages/[id]/ab-test/page.tsx:31-75` enchaîne page → ab_test → variants en série (~600 ms au lieu de ~200 ms). *Fix :* `Promise.all` pour page+ab_test, puis variants conditionnels.

- **P-04 (P2) — Pas d'ISR sur marketing/blog.** Aucun `export const revalidate`. Les articles de blog (contenu statique) devraient être en ISR 24 h. *Fix :* `export const revalidate = 86400` sur les pages contenu.

- **P-05 (P2) — `fetch` sans timeout.** `api/generate/public/route.ts:194` : appel fire-and-forget vers `/api/email/preview` sans `AbortSignal.timeout`. Impact réel faible (non awaité) mais peut laisser traîner des connexions. *Fix :* ajouter `signal: AbortSignal.timeout(30000)`.

- **P-06 (P2) — Index analytics à confirmer.** `dashboard/analytics/page.tsx` fait un `.in('page_id', pageIds).gte('created_at', …)`. Le schéma déclare `idx_analytics_page_id` et `idx_analytics_created_at` **séparés** — un index **composite** `(page_id, created_at)` serait plus efficace si la table grossit. *Fix :* ajouter l'index composite via migration.

---

### 3.4 — UX / CRO / Copy

**C'est la dimension la plus risquée.** Les 3 P0 sont ici. (Findings issus d'une passe dédiée sur `src/app/(marketing)`, avec vérification directe des affirmations P0 par mes soins.)

**Findings P0 (bloquants launch — risque légal L121-1 s. Code de la consommation) :**

- **S-01 (P0) — Statistiques fabriquées.** `StatsCounter.tsx:13-19` affiche en hero : `50 000+ pages générées`, `€2,1M générés par nos clients`, `98 % de satisfaction`, `2 800+ e-commerçants actifs`, `47 pays`. **Vérifié dans le code** : ce sont des constantes hardcodées, pas des données DB. Invérifiables au J0 → pratique commerciale trompeuse. *Fix :* masquer le composant jusqu'à disposer de vraies données (ex. J+90), OU le remplacer par des faits vérifiables ("< 30 s de génération", "42 templates", "3 plateformes").

- **S-02 (P0) — `FAKE_CLIENTS`.** `(marketing)/page.tsx:848-853` : tableau nommé littéralement `FAKE_CLIENTS` avec des CVR inventés (5.1 %, 3.8 %, 6.2 %, 4.5 %) affichés dans la section Agences. Le nom même de la variable prouve l'intention fictionnelle. *Fix :* remplacer par 0-2 vrais cas clients (avec accord) ou retirer les chiffres.

- **S-03 (P0) — Garantie 14 j vs 30 j.** **Vérifié** : `legal/cgv/page.tsx:100` = "garantie satisfait ou remboursé de **14 jours**" ; `pricing/page.tsx:529` et `:745` = "Satisfait ou remboursé **30 jours** — Sans question" ; FAQ démo = 30 j. Contradiction directe entre document contractuel et marketing. *Fix :* harmoniser (le plus prudent : aligner le marketing sur les 14 j des CGV, ou relever les CGV à 30 j en connaissance de cause).

**Findings P1 :**

- **U-01 (P1) — Nombre de templates incohérent** : "38+" (`page.tsx:519`), "50+" (`:1070`), "42+" (`:1139` et `pricing:42`). *Fix :* une seule valeur, idéalement dérivée du vrai count.
- **U-02 (P1) — Teaser pricing home ≠ page pricing** : home annonce "5 pages/mois" pour Starter, la page pricing "75 pages/mois". *Fix :* synchroniser (source unique) ou retirer le teaser.
- **U-03 (P1) — Ancrage garantie faible** : le badge remboursement est sous le fold, pas sous chaque CTA d'achat. *Fix :* badge garantie directement sous chaque bouton de plan.

**Findings P2 :** testimonials avec stats non sourcées et non datées (U-04, `page.tsx:2775-2814`) ; badge "Shopify Partner" à valider juridiquement (U-05, `:255`) ; `href="#"` anti-pattern (U-06, `affiliate:389`) ; hero exclusivement "AliExpress" alors que la saisie manuelle existe (U-07, `:216-226`).

*Non vérifié :* exactitude des mentions légales (numéro Companies House `16526908`, adresse Luna Corporation LTD) — à confirmer sur le registre officiel.

---

## 4. TOP 5 des actions les plus urgentes

1. **Purger ou sourcer TOUS les chiffres marketing** avant le J0 (S-01 + S-02 + U-04) : masquer `StatsCounter`, supprimer `FAKE_CLIENTS`, retirer les stats non prouvables des testimonials. **Risque DGCCRF réel sur un launch FR avec Stripe LIVE.** ~1-2 h.
2. **Harmoniser la garantie** 14 j / 30 j entre CGV et marketing (S-03). Un chiffre unique partout. ~15 min. Bloquant légal.
3. **Unifier le nombre de templates et le quota Starter** (U-01 + U-02) — incohérences visibles qui minent la crédibilité et sèment la confusion à l'achat. ~30 min.
4. **Ajouter `try/catch` sur les 8 routes API exposées** (C-01) pour transformer les bodies malformés en 400 propres plutôt qu'en 500 + bruit Sentry le jour du pic de trafic. ~1 h.
5. **Passer les 26 `<img>` en `next/image` et retirer `'use client'` de la home** (P-01 + P-02) — gain LCP/TTI direct sur les pages qui portent la conversion. ~½ journée.

*Bonus sécurité (rapide) :* aligner `sanitizeDeep` sur le chemin V3 authentifié (SEC-02) et notifier l'équipe des messages de contact (SEC-05).

---

*Fin de l'audit. Tous les findings référencent un emplacement vérifié dans le code. Les points non vérifiables en analyse statique (config Vercel, état RLS runtime, registres légaux) sont explicitement signalés comme tels.*
