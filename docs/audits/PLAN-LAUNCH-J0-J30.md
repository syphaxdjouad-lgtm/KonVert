# PLAN — Lancement KONVERT + 1er client payant

**Aujourd'hui** : samedi 30 mai 2026 (J-3)
**Launch J0** : mardi 2 juin 2026 7h01 Paris
**Cible succès** : 1 paiement Stripe Pro 79€ ou Agency 199€ d'ici 2 juillet (J+30)

---

## Stratégie en 1 phrase

SEO long terme + cold email court terme depuis `hello@konvertpilot.com` à 30-50/jour, zéro budget ads, premier client probable via cold email semaine 3-4.

---

## J-3 → J0 — Préparation (4 jours)

### Dimanche 31 mai

- [ ] **Matin (3 min)** — Lancer le script visuels :
  ```bash
  source /Users/mac/nexara/konvert/.env.local
  python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py
  ```
  → 14 PNG dans `launch/assets/` (~$0.23 fal.ai). Sélectionner les meilleurs.

- [ ] **14h-16h (2h)** — Vidéo Loom 60s :
  ```bash
  brew install ffmpeg gifski
  ```
  Puis Loom screen-record sur konvertpilot.com/essai, voix-over selon `launch/video-script-60s.md`, upload **YouTube Unlisted**. Créer le GIF avec ffmpeg+Gifski.

- [ ] **Soir (15 min)** — Importer base Notion CRM depuis `cold-email/notion-crm-setup.md` (3 min de copier-coller). Importer `leads-verified-template.csv`.

### Lundi 1 juin

- [ ] **Actions Vercel prod (15 min)** :
  - `NEXT_PUBLIC_LAUNCH_DATE=2026-06-02T05:01:00Z`
  - `ENCRYPTION_KEY=$(openssl rand -base64 32)`
  - Vérifier `TURNSTILE_SECRET_KEY` présente (finding H-01 MADARA — sinon bot peut spammer /api/generate/public)
  - Vérifier `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - Redeploy

- [ ] **Stripe (10 min)** :
  - Confirmer `STRIPE_SECRET_KEY = sk_live_***`
  - Créer coupon `LAUNCH50` : 50% once, 100 redemptions, **expire 9 juin**

- [ ] **UptimeRobot (10 min)** — 5 monitors : `/`, `/api/health/deep`, `/dashboard`, `/essai`, `/api/stripe/webhook`

- [ ] **Sentry (10 min)** — 4 alert rules : error rate >1%, p95 >3s, Stripe webhook fail, /api/generate fail >10%

- [ ] **Gmail (20 min)** — 3 filtres `hello@konvertpilot.com` :
  - Label `transac` (P1) : from `stripe.com`, `supabase.io`, `noreply@`
  - Label `support` (P1) : to `hello@konvertpilot.com` mais pas réponse à séquence
  - Label `outbound-cold` (P2) : réponses aux mails partis depuis hello@

- [ ] **Warmup naturel (30 min)** — Envoyer 5-10 mails "vrais" depuis hello@konvertpilot.com (à des amis/contacts perso) — chauffe la rep avant les 30 cold/jour.

- [ ] **Merge feat/pages-v3 → main (30 min)** — PR ou push direct, Vercel auto-deploy. **Avant cette étape, code est juste sur la branche, pas en prod.**

### Mardi 2 juin — J0

- **06h45** : café, connecté, écran prêt
- **07h01** : Post live Product Hunt (copies dans `launch/producthunt-launch-kit.md`)
- **07h05** : First comment maker (texte pré-écrit)
- **07h15** : Twitter thread + LinkedIn LUNAnCO + IndieHackers (copies dans `launch/soft-launch-multi-canal.md`)
- **08h00-23h59** : Monitoring PostHog dashboard + replies PH + 200 premiers cold emails (depuis hello@, 30 max ce jour)
- **23h59** : Bilan J0 = ?signups / ?paiements / ?rank PH

---

## J+1 → J+30 — Acquisition (routine quotidienne)

### Cold email — routine quotidienne

```
09h00  Revue replies dans Gmail label outbound-cold → tag Notion CRM
10h-12h  Envoi 30 cold emails (S1) puis 40 (S2) puis 50 (S3)
14h-17h  Réponses 1-to-1 sur warm replies + demos Cal.com bookées
17h-18h  Mise à jour CRM Notion + tags + planning lendemain
```

### Pipeline math (cible J+30)

| Semaine | Envois cumulés | Replies | Meetings | Trials | Paiements cible |
|---|---|---|---|---|---|
| S1 (J0→J+7) | 300-500 | 10-25 | 1-3 | 0-1 | 0 (ramp) |
| S2 (J+7→J+14) | 700-1000 | 25-50 | 3-6 | 1-3 | 0-1 |
| S3 (J+14→J+21) | 1100-1500 | 50-75 | 6-10 | 3-5 | 0-1 |
| S4 (J+21→J+30) | 1500-2000 | 75-100 | 10-15 | 5-8 | **1+ Pro/Agency** |

### SEO — calendrier publication (RYUK + ZARA)

15 articles déjà écrits dans `seo/articles/`. À publier sur le blog Konvert au rythme :

- J0 : `erreurs-fiche-produit-shopify.md` (quick win)
- J+2 : `alternative-gempages-gratuit-shopify.md`
- J+4 : `fiche-produit-shopify-qui-convertit.md` (Hub 1)
- J+6 → J+26 : 12 autres articles selon calendrier RYUK dans `seo/cluster-plan-30j.md`

**ANNA doit intégrer chaque article + JSON-LD schemas + sitemap** avant publication.

### Backlinks (NARUTO)

Soumettre 15 directories selon `launch/directory-submissions.md` :

- J0 : Product Hunt
- J0-J+3 : BetaList ($129), IndieHackers (free), Show HN (free), AlternativeTo (free)
- J+4-J+6 : SaaSHub, TAAFT ($347 net ~$47 avec PPC bonus), Futurepedia, G2, Capterra
- J+7-J+10 : Toolify, Aitools.fyi, AppSumo go/no-go

---

## Action en attente — décisions à prendre

| # | Quoi | Quand |
|---|---|---|
| 1 | Lancer script HINATA visuels | Dimanche matin |
| 2 | Setup Vercel + Stripe + UR + Sentry | Lundi matin |
| 3 | Loom screen record + YouTube Unlisted | Dimanche après-midi |
| 4 | Setup Gmail filters + Notion CRM | Dimanche/lundi |
| 5 | Warmup naturel hello@ | Lundi soir |
| 6 | Merge feat/pages-v3 → main | Lundi soir |
| 7 | Tagline EN finale validée | "Generate Shopify product pages that convert. In 30 seconds." ✅ |
| 8 | Stratégie inboxes confirmée | hello@konvertpilot.com seul ✅ |
| 9 | Budget ads | 0€ ✅ |
| 10 | Rotate FAL_KEY (sécu) | Cette semaine |

---

## Findings sécu (MADARA) à fixer avant J+7

1. **H-01** Turnstile : vérifier `TURNSTILE_SECRET_KEY` en prod Vercel (sinon /api/generate/public spammable)
2. **H-02** /api/generate auth : ajouter rate limit Upstash 10/min/user
3. **H-03** PreviewIframe : remplacer `postMessage(msg, '*')` par `targetOrigin = window.location.origin`
4. **H-04** /api/contact + /api/waitlist : ajouter rate limit Upstash 5/min/IP
5. **Middleware Edge absent** : créer `src/middleware.ts` qui invoque `updateSession()` (sinon JWT pas auto-refresh)
6. **RGPD endpoints manquants** : créer `/api/user/export` (art.15) + `/api/user/delete` (art.17)

---

## Si pas de paiement J+30 — plan B

- Activer un client SMMA existant en client Konvert Pro (warm sale interne)
- Doubler le volume cold à 80-100/jour avec une 2e inbox Gmail perso (warm)
- Ajouter LinkedIn DM en couche 2 sur les non-répondeurs J+7

---

## Fichiers de référence (tous dans `/Users/mac/nexara/konvert/`)

```
cold-email/
├── playbook-nagato.md           routine quotidienne envoi
├── sourcing-2000-leads.md       plan sourcing
├── sequences-zara.md            3 emails FR/MENA/EN
├── leads-verified-template.csv  CSV à importer Notion
└── notion-crm-setup.md          schema CRM + vues

seo/
├── cluster-plan-30j.md          stratégie 3 piliers + calendrier
└── articles/                    17 articles markdown prêts à publier

launch/
├── producthunt-launch-kit.md    PH J0 copies + first comment
├── soft-launch-multi-canal.md   LinkedIn + Twitter + Reddit + IH copies
├── directory-submissions.md     15 directories pré-remplis
├── video-script-60s.md          script Loom FR+EN scene-by-scene
├── gif-demo-spec.md             workflow ffmpeg + Gifski
├── dashboard-J0-spec.md         KPIs PostHog + plan horaire J0
├── deidara-onboarding-audit.md  audit onboarding + save offers
└── assets/generate-ph-assets.py script Python visuels fal.ai
```
