# KONVERT — Launch Readiness Report v2 (2026-05-04)

## TL;DR — Verdict

**Prêt avec conditions.** 7 fixes sur 8 tiennent en prod (B1, B3-B7, Bonus). **B2 Stripe est encore en TEST avec un `\n` trailing** — bloquant absolu pour encaisser. **B8 POST `/api/email/unsubscribe` accepte sans token** (faille design active). Score pondéré **6.3/10** (vs 5.7 précédent). Aucun nouveau bug critique introduit, mais 2 pages de conversion (`/pricing`, `/essai`) sont rendues 100% client-side — invisibles aux bots.

---

## Validation des fixes B1-B8

| Fix | Statut prod | Preuve |
|---|---|---|
| **B1** Migration `processed_stripe_events` | ✅ OK | `supabase/migrations/20260503_processed_stripe_events.sql` — RLS actif, policy service_role only ; webhook `route.ts:61-67` consomme la table |
| **B2** Stripe LIVE | ❌ **KO** | `.env.production` : `STRIPE_SECRET_KEY="sk_test_placeholder\n"` — préfixe `sk_test_` + `\n` trailing |
| **B3** CRON_SECRET + crons | ✅ OK | `vercel.json` 2 crons (8h/9h), routes `/api/cron/*` retournent 401 sans Bearer |
| **B4** Rick Roll YouTube | ✅ OK | `grep dQw4w9WgXcQ src/` = 0 ; HTML prod = 0 occurrence ; placeholder + CTA `/essai` en place |
| **B5** Sitemap propre | ✅ OK | `https://konvert-ten.vercel.app/sitemap.xml` = 200, 24 URLs, XML valide, 0 `\n` ; `/login` `/signup` `/legal/*` exclus |
| **B6** 1 seul h1 homepage | ✅ OK | HTML rendu prod : `grep -c "<h1"` = 1 ; slides 2-5 en h2 (10 h2 visibles total) |
| **B7** RGPD consent gate | ✅ OK | HTML statique : 0 `posthog.init`, 0 `client.crisp.chat/l.js` ; `PostHogProvider.tsx:13` et `CrispChat.tsx:31` gated sur `getConsent() === 'accepted'` ; `setConsent` dispatch event listeners |
| **B8** Unsubscribe HMAC | ⚠️ **PARTIEL** | GET sans token → 400 ✅ ; GET token foo → 403 ✅ ; POST x7 → 400×3 puis 429×4 (rate limit OK) ; **POST sans token = unsubscribe direct** (route.ts:33-40 : `if (token && ...)`) |
| **Bonus** scraper bestPartial | ✅ OK | Diagnostic AliExpress : 200, partial extraction, retry intelligent ; UI dashboard/new ligne 389-394 affiche bandeau ambre |

---

## 🔴 BLOQUANTS RESTANTS (interdit de lancer)

| Item | Détail | Fix | ETA |
|---|---|---|---|
| **Stripe en TEST** | `STRIPE_SECRET_KEY=sk_test_placeholder\n` en prod Vercel — aucun paiement réel possible | Vercel env var → coller la vraie clé `sk_live_...` (sans `\n`) sur env Production, redeployer | 10 min |
| **POST /api/email/unsubscribe accepte sans token** | `route.ts:33-40` rend le token optionnel — n'importe qui peut désabonner n'importe quel email connu (rate limit 5/min compense partiellement, pas suffisant) | Rendre token+email obligatoires en POST comme en GET, ou retirer le POST | 10 min |

---

## 🟠 MAJEURS (J+2)

| Item | Détail | Fix |
|---|---|---|
| **`/pricing` et `/essai` en CSR** | `BAILOUT_TO_CLIENT_SIDE_RENDERING` → 0 h1 prérendu, contenu invisible Google | Convertir en Server Components, passer interactivité en îlots client |
| **Trustpilot fake résiduel** | `page.tsx:289-290` "4.9 · 127 avis" + logo Trustpilot hardcodé sans source — risque DGCCRF | Retirer le bloc OU remplacer par un vrai profil Trustpilot |
| **Tagline officielle absente du site** | "Tes produits méritent des pages qui vendent." — 0 occurrence dans `src/` | L'injecter en hero (sous-titre), meta description home, footer |
| **3 npm vulns HIGH** | `next@16.2.1` (DoS Server Components), `underscore` (DoS récursion), `postcss` transitif XSS | `npm audit fix --force` → next@16.2.4, tester staging |
| **CSP manque `*.sentry.io`** | Sentry browser SDK silent fail (events bloqués) | Ajouter `https://*.sentry.io https://*.ingest.sentry.io` à `connect-src` |
| **Conflit font Space Grotesk vs Inter** | `layout.tsx` charge Space Grotesk, `globals.css` impose Inter via `@apply` → Inter écrase. Font déclarée n'est jamais utilisée | Choisir une font, supprimer l'autre |
| **CTA `/pricing` en vert au lieu de violet** | `bg-green-600` ligne 558, drift palette flagrant sur la page convertissante | Remplacer par violet primary |
| **6 events PostHog définis mais jamais appelés** | `pricing_viewed`, `checkout_started`, `signup_started`, `signup_completed`, `essai_started`, `preview_viewed` — fonctions existent dans `analytics.ts`, aucun call site | Ajouter `track.xxx()` aux endroits funnel |
| **UTM capture absente** | Aucune persistence cookie/localStorage des `utm_*` → 0 attribution pub possible | Middleware Next.js + cookie first-party + passage signup |
| **Pixels ads tous absents** | Meta/Google/TikTok pixel + CAPI = 0 — bloque toute campagne payante | Installer pixels + Conversions API server-side via consent gate |
| **Bundle home 1033 kB uncompressed** | `lib/templates` (882 kB) importé client-side dans `page.tsx:5` pour rien | `dynamic(() => import(...))` ou Server Component |
| **9 `<img>` Unsplash JPEG en preload simultané** | 0% next/image, 0% AVIF, contention bande passante mobile | Migrer LCP image vers `next/image priority`, retirer preloads superflus |
| **llms.txt + llms-full.txt absents** | 404 sur les deux — GEO/AI Overviews loupés | Créer `app/llms.txt/route.ts` |
| **Bio fondateur Syphax `/about` absente** | E-E-A-T faible : "équipe" générique, pas de personne réelle, pas de photo, pas de LinkedIn | Ajouter section bio + crédibilité |
| **Schema Product/FAQ absents `/pricing` `/features`** | 0 schema sur `/pricing` (AggregateOffer + FAQPage attendus), idem `/features` | Ajouter JSON-LD |
| **Domaine cold email warmup non démarré** | `konvert-app.fr` / `trykonvert.fr` non achetés — 14j incompressibles | Acheter aujourd'hui, lancer warmup Instantly/Smartlead |
| **Vidéo démo non rendue** | Composition Remotion complète dans `/video/src/` jamais exportée — placeholder B4 ne tiendra pas longtemps | `npx remotion render` puis upload Loom/Mux |
| **Sentry `beforeSend` manquant** | Risque PII (emails, tokens) dans stack traces envoyées | Filtre `beforeSend` masquant emails et secrets |

---

## 🟡 MINEURS (J+7)

- **Tutoiement vs vouvoiement blog** : homepage tutoie ("ta page"), blog vouvoie ("vos visiteurs") + fautes accents ("Generer", "premiere", "credit")
- **Stats hardcodées non sourcées** : `+50 000 pages générées`, `98% Satisfaction` — sourcer ou retirer
- **Titles dupliqués `| KONVERT | KONVERT`** sur `/essai` et `/blog`
- **Iconographie mixte phosphor + lucide** sur 18+ pages
- **Touch targets cookie banner < 44px** sur mobile
- **`focus:outline-none` sans fallback** sur bouton play vidéo + close modal sans `aria-label`
- **Page `/affiliate` absente** + Rewardful/Tolt non configuré (pillar 20-30% récurrent)
- **ProductHunt assets absents** (logo 240x240, gallery 1270x760, hunters)
- **Hreflang absent** (FR + AR cible MENA non préparée)
- **Schema author = Organization** au lieu de Person sur `/blog/[slug]`
- **Robots.txt** : pas de directive explicite GPTBot/ClaudeBot/PerplexityBot
- **Routes API à passer Edge** : `/api/ab`, `/api/analytics/track`, `/api/notifications`, `/api/preview/[id]`, `/api/email/unsubscribe`, `/api/invitations/validate`
- **Stripe webhook insert error path** continue traitement si Supabase down (risque double-charge edge case)

---

## ✅ Nouvelles forces (depuis l'audit précédent)

- **HMAC SHA256 + `crypto.timingSafeEqual`** sur tokens unsubscribe (B8 niveau crypto solide)
- **Idempotence webhook Stripe** : table `processed_stripe_events` + INSERT atomique + check 23505 + RLS service_role only
- **CSP complète** sur connect-src Supabase/Stripe/PostHog/Crisp + frame-ancestors compensé par X-Frame-Options DENY
- **HSTS preload + permissions-policy** + 0 sourcemap publique (.js.map = 404)
- **Cache Vercel HIT cdg1** sur toutes les pages marketing (PRERENDER + stale-time 300s)
- **Consent gate RGPD réel** : 0 call sortant PostHog/Crisp avant clic Accepter (testé HTML + code)
- **Rate limit middleware fonctionnel** : 5 req/min sur `/api/email/unsubscribe` confirmé en live (4 OK puis 429)
- **Scraper degradé gracieux** : retourne `partial: true` au lieu de throw, UI prévient l'utilisateur
- **TypeScript propre** : 0 erreur `tsc --noEmit`, build Turbopack 6.9s, 77 pages
- **Sitemap valide** : 24 URLs, format propre, XML valide
- **SSRF guard** : `lib/security/url-allow.ts` bloque localhost/127./169.254.* et auth gate avant validation

---

## 📊 Scores (vs audit précédent 5.7/10)

| Domaine | Score | Précédent | Delta |
|---|---|---|---|
| Code | 7.5/10 | 7 | +0.5 |
| Design | 6.5/10 | 6.5 | 0 |
| Sécurité | 8.5/10 | 7.5 | **+1** |
| Perf | 6/10 | 5.5 | +0.5 |
| SEO | 71/100 | 62/100 | **+9** |
| UX | 6.5/10 | 6 | +0.5 |
| Analytics | 7/10 | 6.5 | +0.5 |
| GTM | 5/10 | 5 | 0 |
| Ads | 2/10 | 2 | 0 |
| Copy | 7/10 | 6.5 | +0.5 |
| **Pondéré** | **6.3/10** | **5.7** | **+0.6** |

Progrès massifs : sécurité (consent gate + HMAC + idempotence), SEO (sitemap propre + 1 h1). **Stagnation totale sur GTM et Ads** — les trous de l'audit précédent n'ont rien bougé.

---

## 🚀 Plan de lancement mis à jour

### J0 — bloquants stricts (≤ 30 min)
1. Mettre `STRIPE_SECRET_KEY` en `sk_live_...` sans `\n` (Vercel env Production), redeployer
2. Tester un vrai checkout end-to-end (CB test puis live)
3. Patch POST `/api/email/unsubscribe` : rendre token+email obligatoires (10 min de code)

### J0 — fortement recommandé avant trafic massif (≤ 2h)
4. `npm audit fix --force` (next@16.2.4) + `npm run build` + tests visuels rapides
5. Retirer ou sourcer le bloc Trustpilot fake `page.tsx:289-290` (risque DGCCRF)
6. Injecter la tagline officielle en hero + meta description home
7. Ajouter `https://*.sentry.io https://*.ingest.sentry.io` au CSP `connect-src`
8. Câbler les 6 events PostHog manquants (`pricing_viewed`, `checkout_started`, `signup_started/completed`, `preview_viewed`, `essai_started`)

### J0 — doivent démarrer aujourd'hui (chrono)
9. **Acheter `konvert-app.fr` ou `trykonvert.fr`** + lancer warmup Instantly/Smartlead (14 jours minimum, sinon cold email impossible au launch)
10. **`npx remotion render`** pour exporter la vidéo démo + upload Loom/Mux
11. Créer la page ProductHunt Upcoming avec assets minimaux

### J+2 — boucle qualité
12. Convertir `/pricing` et `/essai` en Server Components (le BAILOUT_TO_CLIENT_SIDE_RENDERING tue le SEO sur les 2 pages les plus convertissantes)
13. Migrer 9 `<img>` Unsplash homepage vers `next/image` + AVIF
14. Sortir `lib/templates` du bundle client (`dynamic` ou Server Component) → -800 kB sur home
15. Créer `app/llms.txt/route.ts` + `llms-full.txt`
16. Ajouter Schema Product/Offer + FAQPage sur `/pricing`, `/features`, `/demo`
17. Ajouter bio fondateur Syphax sur `/about` + Schema Person
18. Installer Meta Pixel + CAPI + Google tag + TikTok Pixel via consent gate
19. Capturer UTMs en middleware + cookie + passer au signup

### J+7 — affiliés et qualité long-terme
20. Créer `/affiliate` + intégrer Tolt ou Rewardful + webhook Stripe
21. Aligner tutoiement/vouvoiement blog + corriger fautes typographiques CTA
22. Unifier iconographie sur Lucide (retirer Phosphor)
23. Choisir font définitive (Space Grotesk ou Inter, pas les deux)
24. Sentry `beforeSend` filter PII

---

## 📎 Annexes

### Tests live exécutés (preuves)
- Headers prod : grade **A-** (HSTS preload + XFO DENY + CSP complète + 0 sourcemap)
- `GET /api/email/unsubscribe` (sans param) → **400** ✅
- `GET /api/email/unsubscribe?token=foo&email=...` → **403** ✅ (HMAC vérifie)
- `POST /api/email/unsubscribe` x7 → 400×3 / 429×4 ✅ (rate limit 5/min OK)
- `GET /api/preview/<fakeUUID>` → **404** ✅
- `GET /api/scrape/diagnostic` (sans secret) → **403** ✅
- `GET /sitemap.xml` → 200, 24 URLs, valide ✅
- `GET /llms.txt` → **404** ❌ (à créer)
- `GET /robots.txt` → 200, sitemap référencé ✅
- HTML home : 1 h1, 0 Rick Roll, 0 PostHog/Crisp inline ✅

### Commits validés
```
954c79c fix(scraper): timeouts cohérents (A) + dégradation gracieuse (C)
3659339 feat(scraper): consume partial flag — finalise bestPartial system
865c9ab chore: docs strategie NEXARA + utilitaire migrations + cleanup
776eaec feat(scraper): retry intelligent + dégradation gracieuse
e0add5d fix: launch readiness — B4 B5 B6 B7 B8
c4b45a4 fix: corrections E2E prod — CSP, layout, scraper, /api/health
```

### Rapports détaillés agents
- Anna (code) : build OK 6.9s / 0 erreur TS / 3 high vulns / B2 KO confirmé
- Obito (UI/UX) : score 6.5, 5 bugs critiques (vert pricing, conflit font, a11y)
- Security (general-purpose) : score 8.5, B7 valide HTML, B8 POST KO, CSP manque sentry
- Perf (vercel:performance-optimizer) : Lighthouse non runtime, bundle 1033 kB home
- SEO (general-purpose) : 71/100, /pricing /essai BAILOUT, llms.txt 404
- Zara (copy) : 7/10, Trustpilot fake résiduel, tagline absente
- Kakashi (analytics) : 7/10, consent OK, 6 events orphelins
- Nagato (GTM) : 5/10 stable, domaine warmup absent, vidéo non rendue
- Itachi (ads) : 2/10 stable, 0 pixel, 0 LP isolée

### Fichiers clés à toucher en priorité
- `/Users/mac/nexara/konvert/.env.production` (Stripe LIVE — via Vercel UI)
- `/Users/mac/nexara/konvert/src/app/api/email/unsubscribe/route.ts` (POST token obligatoire, ligne 33-40)
- `/Users/mac/nexara/konvert/src/app/(marketing)/page.tsx:289-290` (Trustpilot fake)
- `/Users/mac/nexara/konvert/src/app/(marketing)/pricing/page.tsx` + `essai/page.tsx` (CSR → SSR)
- `/Users/mac/nexara/konvert/src/middleware.ts` (CSP sentry.io)
- `/Users/mac/nexara/konvert/src/lib/analytics.ts` (call sites manquants)
