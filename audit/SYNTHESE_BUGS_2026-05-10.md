# KONVERT — Synthèse bugs 2026-05-10

**Méthode :** 5 audits parallèles (Anna code · Madara sécu · Konan QA · général dette tech · Sasori devops) + build local (tsc, lint, npm audit). Croisé contre `AUDIT_LAUNCH_READINESS_v2.md` (2026-05-04) — ne sont listés ici que les bugs **non encore corrigés** ou **nouveaux**.

**Verdict :** ~85 bugs identifiés. **0 erreur TypeScript** (`tsc --noEmit` propre). **9 vulnérabilités npm** (4 HIGH, 5 MODERATE). **0 % coverage tests** (0 fichiers test sur 222). **153 lint warnings/errors** (concentrés dans `/video/`, hors prod).

---

## 🔴 P0 — Bloquants stricts (à fixer avant trafic)

### Sécurité exploitable

| # | Bug | Fichier | Risque | Fix | Source |
|---|---|---|---|---|---|
| **P0-1** | XSS stocké via `/api/generate/public` — pas de `cleanProduct()` ni `looksHallucinated()` sur le tunnel public ; HTML dans les champs servi à tous les visiteurs de `/preview/[id]` | `src/app/api/generate/public/route.ts` | Élevé (public, sans auth) | Réutiliser les sanitizers de la route authentifiée | Anna |
| **P0-2** | Timing attack + secret en query param sur `/api/scrape/diagnostic` — comparaison `!==` au lieu de `crypto.timingSafeEqual`, secret loggé par Vercel/Sentry | `src/app/api/scrape/diagnostic/route.ts:19` | Moyen | Pattern de `/api/admin/waitlist/route.ts:14-21` : `timingSafeEqual` + header | Madara |
| **P0-3** | Next.js 16.2.1 vulnérable HIGH (DoS Server Components, GHSA-q4gf-8mx6-v5v3) | `package.json` | Moyen-élevé | `npm install next@16.2.3` + retest | Madara |
| **P0-4** | `fast-uri` ≤3.1.1 (transitif `@sentry/nextjs`) — path traversal + host confusion (2 CVE HIGH) | `package.json` | Moyen | `"overrides": { "fast-uri": "^3.1.2" }` | Madara |
| **P0-5** | Stripe encore en TEST en prod (`STRIPE_SECRET_KEY=sk_test_placeholder\n`) | env Vercel prod | **Bloquant absolu** (aucun paiement) | Coller `sk_live_...` sans `\n` puis redeploy | Audit v2 (toujours valable) |
| **P0-6** | Pages debug `/test-generate` et `/test-builder` présentes dans `src/app` — accessibles publiquement sans guard | `src/app/test-generate/`, `src/app/test-builder/` | Moyen | Supprimer ou guarder par `ADMIN_SECRET` + middleware | Konan |

### Perte financière directe

| # | Bug | Fichier | Risque | Fix | Source |
|---|---|---|---|---|---|
| **P0-7** | **Toggle annuel Stripe silencieux** — UI affiche un prix annuel réduit, mais `handleCheckout` n'envoie jamais `annual` à l'API ; `STRIPE_PRICES` ne contient que des price IDs mensuels. Chaque user qui choisit l'annuel est débité au mensuel | `src/app/(marketing)/pricing/page.tsx` + `src/lib/stripe/index.ts` | **Très élevé** (revenu) | Ajouter price IDs annuels + passer `interval` à l'API | Konan |

### RGPD / fiabilité utilisateur

| # | Bug | Fichier | Risque | Fix | Source |
|---|---|---|---|---|---|
| **P0-8** | **Désabonnement preview emails ne marche pas** — `/api/email/unsubscribe` met `trial_emails_sent=[-1]` sur `users` mais ne touche jamais `emails_sent` sur `public_previews`. Un user désabonné reçoit quand même J+1, J+3, J+5, J+7 | `src/app/api/email/unsubscribe/route.ts` + `src/app/api/cron/preview-emails/route.ts` | Élevé (RGPD + plaintes) | Mettre aussi `public_previews.emails_sent=[-1]` pour l'email cible | Anna |
| **P0-9** | Sentry `beforeSend` absent (3 configs) → emails et secrets fuient dans les events Sentry. Logs `[contact] Message from: user@example.com` indexés en clair | `sentry.{client,server,edge}.config.ts` | Élevé (RGPD) | Filtre `beforeSend` qui masque emails / tokens / clés | Sasori + Explore |

### Observabilité critique

| # | Bug | Fichier | Risque | Fix | Source |
|---|---|---|---|---|---|
| **P0-10** | Crons sans `maxDuration` — `trial-emails` et `preview-emails` bouclent 500 users × 3 appels. Vercel coupe silencieusement à mi-batch, `trial_emails_sent` partiellement mis à jour, zéro alerte | `src/app/api/cron/{trial,preview}-emails/route.ts` | Élevé (perte data) | `export const maxDuration = 60` + chunk + try/catch + Sentry capture | Sasori |
| **P0-11** | Sentry `release` et `environment` absents → source maps uploadées non rattachées aux events. Stacks illisibles en prod | `sentry.{client,server,edge}.config.ts` | Moyen | Ajouter `release: process.env.VERCEL_GIT_COMMIT_SHA` + `environment` | Sasori |
| **P0-12** | Pas de toast d'erreur sur le checkout — `handleCheckout` catch fait `console.error + setLoading(null)`, le user voit le spinner disparaître sans message | `src/app/(marketing)/pricing/page.tsx` | Moyen-élevé (conversion) | Toast erreur + Sentry capture | Konan |
| **P0-13** | Rollback quota non monitoré — si `decrement_quota` échoue après timeout DeepSeek, log console seulement, pas de Sentry. Quota perdu définitivement | `src/app/api/generate/route.ts` | Moyen (revenu) | `Sentry.captureException` + alert | Konan |

### Auth flow

| # | Bug | Fichier | Risque | Fix | Source |
|---|---|---|---|---|---|
| **P0-14** | **Signup redirect avant confirmation email** — `router.push('/dashboard')` immédiat après `supabase.auth.signUp()`. Si email confirm activée, user arrive sans session valide ; emails de bienvenue partent même pour de faux emails | `src/app/(auth)/signup/page.tsx` | Élevé (UX cassée + spam) | Page intermédiaire "Vérifiez votre email" + check session avant push | Konan |
| **P0-15** | POST `/api/email/unsubscribe` sans token — `route.ts:33-40` rend le token optionnel | `src/app/api/email/unsubscribe/route.ts` | **L'audit v2 le flagguait** ; à reconfirmer (Madara dit que c'est corrigé, Anna confirme aussi). **À vérifier en prod** | Source contradictoire entre rapports | Audit v2 / Anna / Madara |

---

## 🟠 P1 — Majeurs (avant trafic massif)

### Code & logique métier (Anna)

- **Cron trial-emails utilise `Array.find` au lieu de `findLast`** — si cron tombe pendant 8 jours, le rattrapage envoie J+1 au lieu de J+7
- **Test A/B sans variante** : si insert variante A échoue, le test est créé sans variante, tous les visiteurs voient "Variante introuvable"
- 22 types abusés (`any`, `as unknown as`, `eslint-disable`)
- 8 promesses Supabase sans `.catch()` → loading bloqué silencieux

### Sécurité conditionnelle (Madara)

- **SSRF WooCommerce connect** : blocklist incomplète, IPv6 `::1` (sans crochets) + `fe80::/10` non bloqués
- **Pas de validation taille** sur `productInput` dans `/api/generate/public` → prompt injection économique (500 KB DeepSeek)
- **GrapesJS/underscore DoS** : `underscore@1.13.1` récursion illimitée via `_.flatten()`
- **Rate limiting manquant** : `/api/upload`, `/api/workspaces`, `/api/{shopify,woocommerce,youcan}/push`, `/api/notifications`, `/api/workspaces/[id]/report` (PDF jsPDF CPU-bound)
- **Webhook Stripe** : si insert idempotence échoue (autre que doublon), traitement continue sans garantie

### QA & flows (Konan)

- Race condition double-clic sur `/essai`
- Navigation Back navigateur pendant génération = perte tout le wizard
- F5 pendant génération = quota brûlé + perte données
- Bouton Retour en éditeur = HTML perdu sans confirmation
- **Drift timezone jusqu'à 8h sur crons emails** MENA/Asie
- iframe preview mobile coupée par barre CTA sticky
- **Ratio aria-label 9.4 % sur 138 boutons** (a11y)
- Wizard accepte `zh` (silently fallback FR)

### DevOps (Sasori)

- **0 GitHub Actions workflow** — Vercel déploie depuis `main` sans lint, sans tsc, sans build check
- Crons n'envoient rien à Sentry (200 erreurs/500 users = 1 ligne logs Vercel)
- `/api/health` toujours `200 ok` même si Supabase down → endpoint `/api/health/deep` à créer
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans `.env.example` mais introuvable dans `src/` → vérifier init `loadStripe`

### Dette / hardcoded

- **6 fichiers en prod avec fallback `http://localhost:3000`** : Stripe checkout, Shopify push, etc. → bug si env manque
- 57 `console.log/error` résiduels dans `src/` (29 fichiers)
- Homepage marketing en Client Component avec import eager des templates → bundle 169 KB
- 5 composants client lourds importent `lib/templates`

### Hérités audit v2 toujours valables

- BAILOUT_TO_CLIENT_SIDE_RENDERING sur `/pricing` et `/essai` (SEO 0)
- Trustpilot fake `page.tsx:289-290` (risque DGCCRF)
- Tagline officielle absente du site
- CSP manque `*.sentry.io`
- Conflit font Space Grotesk vs Inter
- CTA `/pricing` en `bg-green-600` au lieu de violet
- 6 events PostHog définis sans call site
- UTM capture absente
- Pixels ads tous absents (Meta/Google/TikTok)
- 9 `<img>` Unsplash sans `next/image`
- `llms.txt` + `llms-full.txt` 404
- Bio fondateur Syphax absente sur `/about`
- Schema Product/FAQ absents `/pricing` `/features`
- Vidéo démo non rendue
- Domaine cold email warmup non démarré

---

## 🟡 P2 — Mineurs (J+7)

### Sécurité (Madara)

- COEP/COOP headers absents
- CSP `unsafe-inline` sans nonce
- RGPD unsubscribe : marque sans anonymiser PII
- `deleteAccount()` ne purge pas Storage ni invitations

### Observabilité (Sasori)

- Lint script `eslint` sans argument → ne lint rien
- Pas de Dependabot/Renovate
- Logs non structurés (texte vs JSON)
- Procédure rollback non documentée

### Dette

- 1 import mort confirmé (`_Palette = Palette`)
- 2 `'use client'` superflus (LogoMarquee, TrustBadges)
- Magic strings : routes `/dashboard/*` répétées 47×, fallback URL 13×
- 1 route API >300 lignes (`workspaces/[id]/report/route.ts`)
- 7 fichiers source >50 KB (homepage 169 KB en tête)
- Tutoiement vs vouvoiement blog
- Stats hardcodées non sourcées (`+50 000 pages générées`)
- Titles dupliqués `| KONVERT | KONVERT`
- Iconographie mixte phosphor + lucide
- Touch targets cookie banner < 44 px mobile
- Hreflang absent (FR + AR MENA)
- Robots.txt sans GPTBot/ClaudeBot/PerplexityBot

### Tests (urgent ⚠️ mais classé P2 stratégie)

- **0 % coverage** — 0 fichiers test sur 222. Aucun test runner installé. À installer en priorité (Vitest + Playwright) avant tout refactor.

### Build/lint

- 153 lint warnings/errors **mais 100 % concentrés dans `/video/`** (composants Remotion hors prod) — non bloquant pour le site

---

## 📊 Compteur global par origine

| Source | P0 | P1 | P2 |
|---|---|---|---|
| Anna (code) | 4 | 6 | 4 |
| Madara (sécu) | 4 | 5 | 4 |
| Konan (QA) | 4 | 10 | — |
| Sasori (devops) | 3 | 4 | 4 |
| Dette tech | — | 6 | 8 |
| **Total uniques** | **~15** | **~30** | **~20** |

---

## 🚀 Plan d'action recommandé (chrono)

### J0 — 2h chrono (P0 bloquants stricts)

1. Stripe LIVE en prod (10 min) — P0-5
2. Patch sanitizers `/api/generate/public` (15 min) — P0-1
3. Patch toggle annuel pricing (30 min) — P0-7
4. Patch désabonnement preview emails (15 min) — P0-8
5. `npm install next@16.2.3` + override fast-uri + `npm run build` + smoke test (20 min) — P0-3, P0-4
6. Supprimer/guarder `/test-generate` `/test-builder` (5 min) — P0-6
7. Sentry `beforeSend` filter PII + release/environment (15 min) — P0-9, P0-11
8. Crons `maxDuration` + try/catch + Sentry capture (20 min) — P0-10
9. Toast erreur checkout + Sentry rollback quota (15 min) — P0-12, P0-13

### J0 +2h — Hardening rapide

10. Patch timing-safe sur `/api/scrape/diagnostic` (10 min) — P0-2
11. Page intermédiaire signup confirmation email (30 min) — P0-14
12. Vérifier statut POST unsubscribe en prod (5 min) — P0-15

### J+1 / J+2 — P1 majeurs

13. SSRF WooCommerce IPv6 (Madara P1-01)
14. Rate limit endpoints exposés (Madara P1-04)
15. Race conditions wizard + `/essai` (Konan P1-1, P1-2, P1-3)
16. GitHub Actions workflow CI (lint + tsc + build avant deploy) — Sasori P1
17. `/api/health/deep` réel (Sasori P1)
18. Drift timezone crons emails (Konan P1-7)

### J+3 — Stabilité

19. Installer Vitest + Playwright + écrire les 10 smoke tests Konan
20. Remplacer 6 fallback `localhost:3000` par check env explicite
21. Cleanup 57 `console.log` résiduels (PII)
22. Couler les 22 types `any` un par un

### J+7 — Polish (P2)

23. Tout le reste de la liste P2

---

## 📎 Rapports détaillés

- `audit/anna_code_2026-05-10.md` — bugs code & API routes
- `audit/madara_security_2026-05-10.md` — sécurité OWASP + RGPD
- `audit/konan_qa_2026-05-10.md` — flows + edge cases + 10 cas Playwright
- `audit/sasori_devops_2026-05-10.md` — infra + Sentry + crons
- `audit/dette_2026-05-10.md` — TODO/any/console/imports morts
- `audit/lint.log` — 153 problèmes (concentrés `/video/`)
- `audit/tsc.log` — vide (0 erreur TypeScript)
