# KONVERT — Launch Readiness Report (2026-05-04)

## TL;DR — Verdict

**🔴 PAS PRÊT.** 7 bloquants à fixer avant go-live (3 SQL non appliquées + Stripe LIVE + tracking RGPD non gaté + 5 H1 homepage + Rick Roll en prod + sitemap cassé + domaine canonical incohérent). Délai réaliste pour fix tout : **3 à 5 jours** si exécution focalisée — pas avant.

---

## 🔴 BLOQUANTS (interdit de lancer)

| # | Item | Domaine | Détail | Owner | ETA |
|---|---|---|---|---|---|
| B1 | 3 migrations Supabase non appliquées | DB | `20260503_quota_rollback.sql`, `20260503_processed_stripe_events.sql`, `20260503_pages_images_bucket.sql` — sans elles, idempotence webhook Stripe ne marche pas, rollback quota échoue, upload images bucket KO | Toi (Supabase SQL Editor) | 30 min |
| B2 | Stripe LIVE non configuré | Paiement | Aucun `sk_live_`, `pk_live_`, `whsec_` ni PRICE IDs prod sur Vercel — 0 paiement possible | Toi (dashboard.stripe.com + Vercel env) | 30 min |
| B3 | `CRON_SECRET` absent en prod | Backend | `/api/cron/preview-emails` + `/api/cron/trial-emails` retournent 401 systématiquement → la séquence email "1 page gratuite" ne s'envoie jamais → tunnel /essai = leak fermé | Toi (Vercel env) | 5 min |
| B4 | Rick Roll YouTube en prod | Trust | `src/app/(marketing)/page.tsx:1589` → `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1` au clic "Voir la démo (45 sec)" — un seul prospect qui clique et la marque est morte | Toi (5 min) — soit retirer le bouton, soit poser la vraie démo | 15 min |
| B5 | Sitemap **cassé** | SEO | `https://konvert-ten.vercel.app/sitemap.xml` retourne des URLs avec retour à la ligne dans la balise `<loc>` (ex: `https://konvert.vercel.app\n/features`) → Google ignore tout. À noter aussi : domaine sitemap = `konvert.vercel.app`, prod actuelle = `konvert-ten.vercel.app`, alias attendu = `konvert.app` — **3 domaines différents en circulation** | Anna | 30 min |
| B6 | 5 `<h1>` sur homepage | SEO | HeroSlider 5 slides, chaque slide a son `<h1>`. Google n'en attend qu'un. Confirmé sur prod (`grep "<h1" /tmp/konvert_home.html` = 5) | Obito/Anna | 15 min |
| B7 | RGPD : tracking sans consentement | Légal + analytics | `CookieBanner` stocke le choix en localStorage mais `PostHogProvider` init sans le lire. Crisp + PostHog démarrent **avant** que l'utilisateur clique "Accepter". Non conforme ePrivacy/CNIL — sanctionnable | Anna/Kakashi | 2 h |
| B8 | `/api/email/unsubscribe` sans auth ni rate limit | Sécurité | Route POST publique, n'importe qui désabonne n'importe quel email par bruteforce, et le flag `converted: true` stoppe la séquence preview → utilisable pour saboter la conversion | Anna | 1 h |

---

## 🟠 MAJEURS (à fixer dans les 48 h après go-live)

| Item | Domaine | Détail | Impact | Effort |
|---|---|---|---|---|
| Aucun pixel ads (Meta/Google/TikTok) ni CAPI | Acquisition | Tu ne peux pas mesurer un seul euro dépensé en paid. Bloque toute acquisition payante. | 5/5 | 4 h dev |
| 7 events PostHog définis mais jamais appelés | Analytics | `pricing_viewed`, `checkout_started`, `preview_viewed`, `signup_started`, `signup_completed`, `essai_started`, `subscriptionActive` existent dans `analytics.ts` mais ne sont nulle part déclenchés. Funnel inexploitable. | 5/5 | 2 h |
| `safeCompare` fuite de longueur | Sécurité | `cron/preview-emails`, `cron/trial-emails`, `email/welcome`, `email/preview` checkent `if (a.length !== b.length) return false` AVANT `timingSafeEqual` — pattern hash SHA-256 de `admin/waitlist` à appliquer partout | 3/5 | 30 min |
| Bundle home 1 MB uncompressed (`'use client'` 3282 lignes) | Perf | `(marketing)/page.tsx` entièrement client-side. `templateEtecBeauty` (44 kB) importé en statique. Crisp + PostHog + Sentry Replay en chargement immédiat. LCP/INP cassés sur mobile. | 4/5 | 1 jour |
| `/framer-test` + `/framer-demo` accessibles publiquement | Perf + sécu | Pages de test embarquant `framer-motion` (894 kB + 860 kB), publiques, pas de noindex meta — exposées au crawl | 3/5 | 5 min (delete) |
| Drift design system : token vert `--kv-accent: #16a34a` parasite `/pricing` | Brand | Footer dupliqué sur `/pricing`, logo `KON<span style="color:#16a34a">VERT</span>` (vert) ≠ Navbar `<span style="color:#b5f23d">K</span>ONVERT` (lime) ≠ Footer global gradient violet. 3 versions du logo. | 4/5 | 2 h |
| Iconographie mixte : `lucide-react` (18 fichiers) + `@phosphor-icons/react` (3 fichiers) | Brand | Cohabitent sur la même homepage, styles incompatibles | 2/5 | 1 h migration |
| Space Grotesk chargé via `next/font` mais Inter sert | Typo | `globals.css` impose `font-family: 'Inter'` sur `body` qui écrase le `--font-space-grotesk`. Le site charge une font inutile et en sert une autre. | 3/5 | 15 min |
| Domaine cold email non acheté/warmup | GTM | Aucun `konvert-app.fr` ou `trykonvert.fr` configuré. Tu peux pas envoyer 1 cold email sans cramer `konvert.app` | 4/5 | 14 j de warmup |
| ProductHunt assets manquants | GTM | Aucun logo 240×240, aucune gallery, aucun GIF demo — tu peux pas lancer sur PH | 3/5 | 1 j |
| Vidéo démo non rendue | GTM + trust | Scènes Remotion présentes, jamais exportées. Pas de Loom/YouTube réel | 3/5 | 1 j |
| Page `/affiliate` + plateforme inexistantes | Croissance | Programme affilié décidé (20-30%) mais zéro implémentation, zéro Rewardful/Tolt | 3/5 | 4 h |
| Faux Trustpilot "4.9 · 127 avis" hardcodé homepage | Trust | Vérifiable en 5 sec — si profil Trustpilot vide, crédibilité morte | 5/5 | 5 min retirer |
| Stats hardcodées sans source ("50 000+ pages", "2 800+ boutiques", "98% satisfaction") | Trust | Visiblement fictives au lancement. Idem `/about` et `/agence` | 4/5 | 30 min |
| Vouvoiement blog vs tutoiement reste du site | Copy | Articles blog en "vous", reste en "tu" — incohérence systémique | 3/5 | 2 h pass |
| AVIF absent (`images.formats: ['image/webp']` seul) | Perf | -20% poids images possible | 2/5 | 5 min |
| Schema.org incomplet | SEO | Pas de Product JSON-LD `/templates/[id]`, pas de FAQPage `/pricing` ni `/features`, pas de WebSite+SearchAction | 3/5 | 3 h |
| `/dashboard/*` sans `noindex` meta | SEO | Bloqué par robots.txt mais défense en profondeur manque | 2/5 | 10 min |
| /api/health expose commit SHA + région | Info leak | Verbose : `{"commit":"c4b45a4","region":"lhr1"}` — exploit ciblé facilité | 2/5 | 5 min |

---

## 🟡 MINEURS (à faire en J+7)

- `/test-builder`, `/test-generate`, `/framer-*` listés dans build prod — supprimer ou protéger
- `ANTHROPIC_API_KEY` documenté dans `.env.example` "legacy" — supprimer (DeepSeek depuis mai 2026)
- `error.tsx` marketing : "ne s'est pas passe comme prevu" sans accents
- Hreflang FR + AR absents (cible MENA arabophone du persona)
- `llms.txt` + `llms-full.txt` absents (AEO/GEO)
- About + blog : pas de bio fondateur (E-E-A-T faible)
- Footer `SOCIALS = []` (tableau vide) — pas de signaux sociaux
- 4 weights Space Grotesk chargés (400/500/600/700) — réduire à 2
- `next/font` chargé mais Inter servi (cf majeurs)
- CTA slide 3 home pointe vers `/dashboard/analytics` (route bloquée robots.txt → lien interne mort)
- Burger menu Navbar sans `aria-label` ni `aria-expanded`
- Toggle pricing Mensuel/Annuel sans `aria-pressed`/`role="tab"`
- Contraste `#9ca3af` sur blanc = 2.8:1 (sous WCAG AA)
- Coquilles copy : "freelances" vs "freelance", "À retenir" sans accent dans articles
- Pricing FAQ manque 2 questions : "Pourquoi pas Fiverr ?" + "Différent des templates Canva ?"
- Zéro lead magnet hors `/essai` — checklist 12 elements + calculateur ventes perdues à produire
- /preview/<fakeId> renvoie 200 (page se charge avec état dégradé) — à robustifier en 404 explicite
- Meta descriptions /pricing /features /demo /templates 200+ char (tronquées en SERP, max 160)
- Logo Organization JSON-LD pointe vers `/icon.svg` — Google attend du PNG dimensionné
- Mentions légales = "France" sans adresse précise ni SIREN

---

## ✅ Ce qui est PRÊT

- **Build & TypeScript** : 77 pages, build propre, 0 erreur TS, 0 secret en dur dans `src/`
- **Sécurité headers prod** : HSTS preload + X-Frame-Options DENY + nosniff + Referrer-Policy + Permissions-Policy → grade A-
- **CSP stricte** sans `unsafe-eval` (sauf builder GrapesJS isolé `/dashboard/new`, `/dashboard/pages`, `/test-builder`)
- **SSRF guard solide** : `validateScrapeUrl` avec whitelist exacte (`Set` strict, pas de `endsWith` bancal) + blacklist IP privées/cloud-meta
- **Webhook Stripe** : signature `constructEvent` OK, idempotence implémentée (devient effective après B1)
- **Auth API critiques** : `/api/scrape` 401 sans session, `/api/generate/public` Turnstile + 1/email + 3/5min, `/api/stripe/webhook` 400 sans signature, `/api/scrape/diagnostic` 403 sans secret
- **RLS Supabase activée** sur `public_previews`, `ab_events`, `processed_stripe_events`, `workspace_members`, bucket `pages-images`
- **Sentry tunnelé** via `/monitoring` (contourne adblockers), source maps uploadées, sample rates raisonnables
- **Sitemap dynamique** structurellement OK (32 URLs, lastmod réel) — il faut juste fixer les retours à la ligne
- **Schema BlogPosting + Breadcrumb + FAQ** sur tous les articles blog
- **Tunnel `/essai`** : meilleure page du site copy-wise (clair, friction faible, Turnstile, i18n FR/EN)
- **Articles blog** : 10 articles ~2000 mots, structure solide, CTAs internes vers `/essai`
- **Vercel Analytics + Speed Insights** posés dans `layout.tsx`
- **Resend transactionnel** (welcome, séquence preview) prêt
- **CookieBanner** présent (manque juste le gating effectif)
- **Cold email** : 5+5 templates rédigés dans `/strategie/outbound_strategy.md`

---

## 📊 Scores

| Domaine | Score | Justification courte |
|---|---|---|
| Code | **7/10** | Build propre, TS clean, SSRF guard solide. Pénalisé par les 3 migrations + CRON_SECRET + safeCompare timing |
| Design | **6.5/10** | Hero dark fort, mais drift token vert/violet, iconographie mixte, font qui ne s'applique pas |
| Sécurité | **7.5/10** | Headers + CSP + SSRF + RLS solides. Pénalisé par /api/email/unsubscribe + safeCompare timing + info leak /api/health |
| Perf | **5.5/10** | Bundle 1 MB, 'use client' partout, third-party non gaté, AVIF absent. CWV non mesurés (pas de field data accessible) |
| SEO | **62/100** | Bases solides (sitemap/robots/blog schema). Cassé par 5 H1, sitemap retours-ligne, llms.txt absent, hreflang absent |
| UX | **6/10** | `/essai` excellent, /pricing footer dupliqué, états vides corrects, accessibilité ARIA insuffisante |
| Analytics | **6.5/10** | PostHog propre, Sentry OK, webhook Stripe instrumenté. Pénalisé par 7 events non câblés + RGPD non respecté |
| GTM | **5/10** | Cold email rédigé, communautés identifiées. Bloqué par migration + Stripe + domaine + ProductHunt + démo |
| Ads readiness | **2/10** | Zéro pixel partout, zéro CAPI, zéro UTM cookie, zéro LP par campagne |
| Copy | **6.5/10** | Hooks forts homepage/`/essai`. Plombé par Rick Roll + Trustpilot fake + tagline officielle absente + stats hardcodées |

**Score global pondéré : 5.7/10** → pas-prêt-mais-réparable.

---

## 🚀 Plan de lancement recommandé

### J-5 (today, 04 mai 2026)
- [ ] **B1** Appliquer les 3 migrations SQL `20260503_*` sur Supabase prod (Dashboard → SQL Editor → coller chaque fichier dans l'ordre quota_rollback → processed_stripe_events → pages_images_bucket)
- [ ] **B2** Stripe LIVE : créer Starter 39€, Pro 79€, Agency 199€ → coller `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, 3 PRICE IDs, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans Vercel env (production + preview)
- [ ] **B3** Générer un `CRON_SECRET` 32+ chars + l'injecter dans Vercel env
- [ ] **B4** Retirer ou remplacer le lien YouTube `dQw4w9WgXcQ` ligne 1589 de `(marketing)/page.tsx`
- [ ] **B6** Convertir slides 2-5 du HeroSlider en `<h2>` (1 seul `<h1>` slide 1)
- [ ] **B5** Fixer le sitemap : retirer les `\n` dans les `<loc>` + décider domaine canonical (`konvert.app`) + caler `NEXT_PUBLIC_APP_URL`
- [ ] Acheter `konvert-app.fr` + `trykonvert.fr` → setup Instantly warmup 14 j

### J-3
- [ ] **B7** Brancher `CookieBanner` sur PostHog/Crisp : init seulement après acceptation explicite (lire `localStorage.konvert-cookie-consent` avant `posthog.init`)
- [ ] **B8** Ajouter auth + rate limit + token signé HMAC sur `/api/email/unsubscribe`
- [ ] Câbler les 7 events PostHog manquants (`pricing_viewed`, `checkout_started`, `preview_viewed`, `signup_started`, `signup_completed`, `essai_started`, `subscriptionActive`)
- [ ] Retirer Trustpilot badge homepage + stats hardcodées non sourcées
- [ ] Corriger CTA slide 3 home (`/dashboard/analytics` → `/features#analytics`)
- [ ] Test E2E complet en prod : visiteur → /essai → email → generate → preview → signup → /pricing → checkout LIVE → /success → vérifier webhook reçu + subscription DB + email welcome
- [ ] Supprimer `/framer-demo`, `/framer-test`, `/test-builder`, `/test-generate` du build prod
- [ ] Pose Meta Pixel + Google Ads tag + TikTok Pixel dans `layout.tsx` (gated par consent)

### J-1
- [ ] Migrer `safeCompare` → SHA-256 sur 4 routes (cron preview/trial + email welcome/preview)
- [ ] Ajouter FAQPage JSON-LD sur `/pricing` et `/features`
- [ ] Ajouter Product JSON-LD sur `/templates/[id]`
- [ ] Créer `/public/llms.txt` + `/public/llms-full.txt`
- [ ] Bio fondateur Syphax sur `/about` + author humain dans schema BlogPosting
- [ ] Vercel : pin domaine custom `konvert.app` (ou décider de rester sur `konvert-ten.vercel.app`)
- [ ] ProductHunt assets prêts (logo 240×240, gallery 5, GIF démo, thumbnail) → page Upcoming en ligne
- [ ] LinkedIn fondateur : 5 posts pré-rédigés
- [ ] Smoke test final : `curl -sI https://konvert.app/` + `pagespeed.web.dev` mobile

### J0 (lancement)
- [ ] Publier sur ProductHunt 00:01 PST mardi/mercredi
- [ ] Cold email batch 1 (20-30/jour, warmup en cours)
- [ ] Post LinkedIn fondateur
- [ ] Posts r/ecommerce, r/shopify, IndieHackers
- [ ] Activer affilié Rewardful + envoyer liens aux 5 premiers partenaires
- [ ] Démo TikTok live "génère une page en 30 sec"
- [ ] Monitorer Supabase + Sentry + PostHog en temps réel toute la journée

### J+7
- [ ] Convertir `(marketing)/page.tsx` en Server Components + îlots `'use client'` (split bundle home)
- [ ] Lazy-load `templateEtecBeauty`, Crisp, PostHog (idle + consent gate)
- [ ] AVIF activé + Space Grotesk weights réduits à 2
- [ ] Page `/affiliate` + intégration Rewardful déployée
- [ ] CAPI Meta server-side + Google Enhanced Conversions
- [ ] Hreflang FR `<link rel="alternate"...>` + `x-default`
- [ ] Cleanup : ANTHROPIC_API_KEY, AnnouncementBar mort, GLOBAL_CSS dupliqué x5

### J+30
- [ ] i18n MENA (next-intl + `/ar/` + RTL) — bloquant pour scaler la cible arabophone
- [ ] Lead magnets 2 et 3 (checklist 12 elements + calculateur ventes perdues)
- [ ] LP dédiées par campagne (`/lp/shopify-dropshipping`, `/lp/agence-smma`, `/lp/mena`)
- [ ] Performance Max Google + audiences LAL Meta (besoin volume pixel)

---

## 📎 Annexes — Sources

Rapports détaillés des 8 agents (transcripts complets) :
- ANNA — Audit code : `/private/tmp/claude-501/-Users-mac-nexara/.../tasks/a0a74c7c690c31bdd.output`
- OBITO — UI/UX : `…/ac1b2760503b76e1e.output`
- PERF (vercel:performance-optimizer) : `…/ae5e5a53759cd00f3.output`
- SEO (general-purpose) : `…/a088619bee7708883.output`
- ZARA — Copy : `…/a4b5222c6129f251f.output`
- KAKASHI — Analytics : `…/ad094053e3d53907f.output`
- ITACHI — Ads : `…/acb6a6b3ce546f53a.output`
- NAGATO — GTM : `…/ae6125727f14f22de.output`

Findings sécurité boîte noire (curl direct, ce rapport) :
- Headers prod homepage : HSTS preload OK, CSP stricte avec `unsafe-eval` isolé builder, X-Frame DENY, nosniff, Permissions-Policy restrictive
- /robots.txt : Disallow correct sur `/dashboard/`, `/api/`, `/auth/`, `/test-*`, `/framer-*`, `/preview/`
- /.env, /.git/config, /llms.txt, /_next/.../*.js.map → tous 404 ✅
- /api/scrape/diagnostic → 403 sans secret, 200 avec — Firecrawl key valide (test scrape example.com OK)
- /api/cron/trial-emails sans Authorization → 401 ✅
- 5 requêtes /api/contact → 5×400 (payload refusé, pas de 429 — rate limit pas testé jusqu'au seuil)
- /api/preview/<fakeId> → 404 ✅, /preview/<fakeId> → 200 (page se charge en état dégradé, à robustifier)
- Auth coverage : /api/scrape 401, /api/generate/public 400, /api/stripe/webhook 400 ✅

Limitations de cet audit :
- CWV terrain (Lighthouse / CrUX) non mesurés — `npx lighthouse https://konvert-ten.vercel.app --form-factor=mobile` à lancer manuellement
- Test Playwright E2E browser bloqué (instance déjà active dans une autre session) — flow signup→checkout LIVE à exécuter manuellement avant J0
- Audit ads boîte noire (Meta Events Manager, Google Ads conversion test) non faisable depuis cette session — confirmer post-pose des pixels
