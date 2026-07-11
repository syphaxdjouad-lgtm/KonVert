# 🚀 LAUNCH PLAN J-8 + J-7 — Target : 20 mai 2026 (mercredi)

> **Brief généré le 2026-05-12 22:00 GMT+1**
> Ouvert dans une nouvelle session Claude pour exécuter à la suite.

---

## 🎯 État précis au moment de ce brief

### ✅ Déjà fait (session précédente)
- Domaine `konvertpilot.com` acheté Namecheap, branché Vercel, HTTPS actif
- Code refactoré 37 fichiers → `konvertpilot.com` partout (commit `d8680b3`)
- Build clean 82/82 pages
- Sitemap URLs clean (B5 résolu, `.trim()` défensif)
- **Resend** verified (SPF/DKIM/DMARC/MX) — région EU Frankfurt
- **B8** rate limit `/api/email/unsubscribe` ajouté (commit `47e48ca`)
- **GA4** créé : `NEXT_PUBLIC_GOOGLE_TAG_ID=G-RZCLQ21ZTK` (Production + Development OK)
  - ⚠️ **Preview env var à ajouter manuellement** dans Vercel dashboard
- **Search Console** : domain property `konvertpilot.com` verified via TXT record
  - Sitemap soumis `https://konvertpilot.com/sitemap.xml` (24 URLs)
  - Linking GA4 ↔ GSC : **à finir** (5 min, voir J-8 ci-dessous)

### 🔍 Audit live trouvé
- **Tagline officielle = "Tes produits méritent des pages qui vendent."** → DÉJÀ injectée hero (ligne 230) + metadata title `src/app/layout.tsx`
- **Trustpilot fake** confirmé `src/app/(marketing)/page.tsx:275-291` — note 4.9, 127 avis bidons (risque légal)
- **Bio /about** : pas de mention de Syphax actuelle (conforme consigne pseudonymisation, juste à enrichir avec LUNAnCO)
- **console.log/error/warn** : **55 occurrences** (pas 57) — 24 dans `app/api/`, 2 dans `app/(dashboard)/`
- **Stripe env vars** présentes mais `STRIPE_SECRET_KEY = sk_test_...` → **encore TEST, pas LIVE**
- **3 prices manquants** (annual) : seuls `STRIPE_PRICE_{STARTER,PRO,AGENCY}` existent

---

## 🔴 J-8 — MARDI 12 mai (CE SOIR — 1h30 restant)

### Action 1 — Finir link GA4 ↔ GSC (5 min) ⏸ EN COURS
**État** : user était dans Search Console → Paramètres → Associations.
**Suite** : scroller jusqu'à "Demandes en attente" OU cliquer le bouton "Associer" à côté de Google Analytics.
**Alternative** : si bloqué, faire le link depuis GA4 → Admin → barre recherche "search console".

### Action 2 — Retirer Trustpilot fake (15 min) 🔴 RISQUE LÉGAL
**Fichier** : `src/app/(marketing)/page.tsx`
**Lignes** : 275-291 (bloc Trustpilot)
**Action** : remplacer tout ce bloc par soit :
- Option A : vrais badges Shopify Partner + Stripe sécurisé (déjà dans le code après ligne 292)
- Option B : retirer complètement et garder uniquement les vrais signaux de confiance

**Risque conservé si pas fait** : pratique commerciale trompeuse (article L121-2 Code conso, jusqu'à 300k€ amende + 2 ans prison).

### Action 3 — Auditer si tagline est bien partout (15 min)
**État actuel** :
- Hero h1 : ✅ "Colle ton lien AliExpress. Ta page est prête en 30 secondes."
- Metadata title : ✅ "KONVERT — Tes produits méritent des pages qui vendent"
- **À vérifier** :
  - Footer (`src/components/marketing/Footer.tsx`)
  - OG image text (`src/app/opengraph-image.*.ts`)
  - llms.txt (`src/app/llms.txt/route.ts`)

### Action 4 — Démarrer création Gmail projet (5 min)
**Action user** : créer compte Gmail dédié projet (ex: `konvertpilot.app@gmail.com`)
- Activer 2FA Authenticator app immédiatement
- Récupération via numéro de tél
- **Bloque** : Stripe LIVE, ImprovMX, futur Meta/TikTok

### Action 5 — Indexer 5 pages produit dans GSC (10 min)
Dans Search Console → Inspecter URL → Demander indexation pour :
1. `https://konvertpilot.com`
2. `https://konvertpilot.com/pricing`
3. `https://konvertpilot.com/features`
4. `https://konvertpilot.com/templates`
5. `https://konvertpilot.com/essai`

⚠️ Quota 10/jour. Pas d'indexation manuelle blog aujourd'hui (étalé J-7/J-6).

### Action 6 — Décision Stripe LIVE (3 min)
**Question** : Stripe LIVE ce soir ou demain matin ?
- Ce soir = +1h supplémentaire ce soir
- Demain matin = première chose à attaquer J-7

**Reco** : demain matin, mieux frais d'esprit pour les manips Stripe critiques.

---

## 🟠 J-7 — MERCREDI 13 mai (journée pleine ~7h)

### Action 1 — Stripe LIVE complet (~2h30)

#### 1a. Créer 3 prices annual manquants (30 min)
**Stripe Dashboard → Products** :
- Starter Annual : 31€/mois facturé annuellement (372€/an) avec 25% discount
- Pro Annual : 63€/mois facturé annuellement (756€/an)
- Agency Annual : 159€/mois facturé annuellement (1908€/an)

Récupérer les 3 `price_xxx` créés.

#### 1b. Basculer en LIVE mode (30 min)
**Stripe Dashboard** : toggle "Test data" OFF → "Live data" ON.

**Vercel env vars à updater** (production) :
- `STRIPE_SECRET_KEY` : `sk_live_...` (récupéré depuis Stripe → Developers → API keys → Live)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : `pk_live_...`
- `STRIPE_PRICE_STARTER` : nouveau price_id LIVE monthly
- `STRIPE_PRICE_PRO` : nouveau price_id LIVE monthly
- `STRIPE_PRICE_AGENCY` : nouveau price_id LIVE monthly
- `STRIPE_PRICE_STARTER_ANNUAL` : nouveau price_id LIVE annual
- `STRIPE_PRICE_PRO_ANNUAL` : nouveau price_id LIVE annual
- `STRIPE_PRICE_AGENCY_ANNUAL` : nouveau price_id LIVE annual

⚠️ **Vérifier code** : actuellement il n'y a que 3 vars STRIPE_PRICE_*. Le code lit-il les ANNUAL ? À vérifier dans `src/lib/stripe/index.ts`.

#### 1c. Webhook prod (15 min)
**Stripe → Developers → Webhooks → Add endpoint** :
- URL : `https://konvertpilot.com/api/stripe/webhook`
- Events : `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Récupérer le **Signing secret** `whsec_...`
- Updater env Vercel : `STRIPE_WEBHOOK_SECRET=whsec_...`
- **Disable l'ancien webhook** (qui pointait sur konvert.app)

#### 1d. Smoke test complet (45 min)
- Aller sur `https://konvertpilot.com/pricing`
- Cliquer Starter monthly → Checkout → Carte test live `4242 4242 4242 4242` (en mode LIVE, faut une vraie carte ou TEST = mauvais. Solution : utiliser carte perso + refund après)
- **Alternative safer** : créer un coupon 100% off temporaire pour tester sans charge réelle
- Vérifier :
  - Webhook reçu (`/api/stripe/webhook` 200 OK)
  - Row `subscriptions` créée en DB
  - Email confirmation envoyé via Resend
  - `subscription_status` mis à jour côté user
- Test annulation depuis dashboard

### Action 2 — Gmail projet + ImprovMX (30 min)

#### 2a. Créer compte ImprovMX (5 min)
- improvmx.com → Sign up
- Add domain : `konvertpilot.com`
- Créer aliases :
  - `hello@konvertpilot.com` → Gmail projet
  - `support@konvertpilot.com` → Gmail projet
  - `contact@konvertpilot.com` → Gmail projet
  - `privacy@konvertpilot.com` → Gmail projet

#### 2b. DNS Namecheap (15 min)
Ajouter sur `konvertpilot.com` :
- MX Record `@` → `mx1.improvmx.com` priority `10`
- MX Record `@` → `mx2.improvmx.com` priority `20`
- TXT Record `@` → `v=spf1 include:spf.improvmx.com include:amazonses.com ~all`

⚠️ **Attention** : il y a déjà un TXT `@` pour Google verification. Garder les deux (TXT records cohabitent).

#### 2c. Vérification (10 min)
- Attendre propagation (5-10 min)
- ImprovMX dashboard → click "Verify"
- Test : envoyer email à `hello@konvertpilot.com` depuis perso → reçu sur Gmail projet ?

### Action 3 — Cleanup console.log (1h)
**55 occurrences** à virer (priorité PII/sécu) :
- 24 dans `src/app/api/` — **PRIORITÉ MAX** (logs serveur potentiellement PII)
- 2 dans `src/app/(dashboard)/`
- 1 dans `src/lib/scraper/`
- 1 dans `src/app/test-builder/`

**Méthode** :
```bash
# Lister
grep -rn "console\.\(log\|error\|warn\|info\|debug\)" src --include="*.ts" --include="*.tsx" | grep -v "\.test\." | grep -v "/scripts/"

# Pour chaque fichier : virer les console.log de logging trivial, GARDER les console.error légitimes (catch blocks).
# Remplacer console.log de debug par Sentry.captureMessage si utile.
```

**Stratégie** : garder uniquement les `console.error` dans les `catch` blocks (ils alimentent Sentry). Tout le reste = degager.

### Action 4 — P1 sécu (1h30)

#### 4a. SSRF WooCommerce IPv6 (45 min)
**Fichier** : `src/lib/security/private-host.ts`
**Bug** : la regex actuelle de `isPrivateHost` ne couvre que IPv4. Faut ajouter IPv6 :
- `::1` (localhost)
- `fe80::/10` (link-local)
- `fc00::/7` (unique local)
- `::ffff:0:0/96` (IPv4-mapped)

**Tests** : `src/lib/security/private-host.test.ts` — ajouter cas IPv6.

#### 4b. Rate limit /api/upload (45 min)
**Fichier** : `src/app/api/upload/route.ts`
**Action** : copier le pattern utilisé dans `src/app/api/email/unsubscribe/route.ts` (commit `47e48ca`) :
- Importer `rateLimitAsync` depuis `@/lib/security/ratelimit`
- Helper `checkRateLimit(req)` en tête de fichier
- Appel en début de POST/PUT
- Limite : 20 uploads/min/IP (à ajuster selon usage)

Aussi vérifier `/api/workspaces` et `/api/push` mentionnés dans la mémoire.

### Action 5 — Bio /about LUNAnCO (45 min)
**Fichier** : `src/app/(marketing)/about/page.tsx`
**Consigne mémoire** : ne PAS écrire le nom "Syphax" ni email perso. Parler de **LUNAnCO** ou NEXARA.

**À inclure** :
- Story de fondation (mission, problème observé, solution)
- Mention "Édité par LUNAnCO" (entité légale)
- Photo générique / logo (pas photo perso)
- Schema.org `Organization` (pas `Person`) → maj `src/lib/schema/index.ts` si besoin
- Contact via formulaire `/contact` (pas email direct)

⚠️ **Différent du plan original** qui demandait bio Syphax — adapté à la consigne pseudonymisation.

---

## 📋 Ordre d'exécution recommandé (J-7)

```
09:00 → Stripe LIVE 1a (3 prices annual)        [30 min]
09:30 → Stripe LIVE 1b (env vars sk_live)       [30 min]
10:00 → Stripe LIVE 1c (webhook prod)            [15 min]
10:15 → ☕ Pause
10:30 → Stripe LIVE 1d (smoke test paiement)    [45 min]
11:15 → Cleanup console.log                      [1h]
12:15 → 🍽 Lunch
13:30 → P1 sécu 4a (SSRF IPv6)                  [45 min]
14:15 → P1 sécu 4b (rate limit upload)          [45 min]
15:00 → Bio /about LUNAnCO                      [45 min]
15:45 → Gmail projet + ImprovMX                 [30 min]
16:15 → Build + commit + push (validation)      [15 min]
16:30 → ✅ FIN J-7
```

**Total : ~7h actives** + pauses

---

## ⚠️ Points de vigilance

1. **Stripe smoke test** : utiliser coupon 100% off plutôt que vraie carte, sinon il faut refund manuellement après.
2. **DNS Namecheap** : ne PAS supprimer les TXT records Google verification + Resend SPF en ajoutant ImprovMX.
3. **Console.log cleanup** : ne PAS virer les `console.error` dans catch blocks (alimentent Sentry).
4. **Webhook Stripe** : DISABLE l'ancien (qui pointait `konvert.app`) après création du nouveau, sinon doublons d'events.
5. **GA4 preview env** : ajouter manuellement dans Vercel dashboard (CLI bug connu).

---

## 🟢 Critère de fin J-7

Tous ces points doivent être OK avant de marquer J-7 comme done :

- [ ] Stripe LIVE actif (sk_live_, pk_live_, 6 prices, webhook prod, ancien disabled)
- [ ] Smoke test paiement réussi (checkout → webhook → DB → email)
- [ ] Gmail projet créé + ImprovMX verified + test email reçu
- [ ] < 5 console.log restants dans `src/` (uniquement catch error légitimes)
- [ ] SSRF IPv6 test passe (`npm test private-host`)
- [ ] `/api/upload` rate limit ajouté + build clean
- [ ] Bio /about live sans mention Syphax
- [ ] Build clean `npm run build` (82+ pages, 0 erreur)
- [ ] Push pushed sur main, déploiement Vercel green

---

## 🔗 Références mémoire à consulter

- `project_konvert.md` — chemins, git, Vercel, stack
- `project_konvert_manual_tasks.md` — bloquants launch détaillés
- `project_konvert_domain.md` — état migration domaine
- `project_konvert_persona.md` — tagline officielle, ICP
- `feedback_branding_personne.md` — règle pseudonymisation Syphax
- `feedback_workspace.md` — tout reste dans /Users/mac/nexara
