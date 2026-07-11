# KONVERT — Actions manuelles avant launch 20 mai

Tout le code est en place. Voici ce qui se configure obligatoirement dans les UI externes (pas faisable depuis le repo). Ordre par urgence.

---

## 1. 🔴 Vérifier Stripe LIVE (5 min) — BLOQUANT

Le `STRIPE_SECRET_KEY` est encrypted en Vercel prod (créé il y a 2 jours) mais on n'a pas pu vérifier que c'est bien `sk_live_*` et pas `sk_test_*`.

### À faire
1. Aller sur Vercel → `syphaxdjouad-lgtms-projects/konvert` → Settings → Environment Variables
2. Edit `STRIPE_SECRET_KEY` → doit commencer par `sk_live_` (pas `sk_test_`)
3. Vérifier aussi qu'il n'y a **pas de `\n` trailing** (bug récurrent, l'audit v2 l'avait choppé)
4. Idem pour `STRIPE_WEBHOOK_SECRET` (commence par `whsec_` et c'est celui du **endpoint LIVE**, pas test)
5. Vérifier les 6 PRICE IDs : ce sont bien les prices LIVE Stripe, pas les test

### Test final
```bash
# Depuis ton terminal local, après auth Stripe CLI :
stripe trigger checkout.session.completed --api-key sk_live_...
```
Tu dois voir le webhook arriver dans Vercel logs en quelques secondes.

---

## 2. 🔴 Créer le coupon LAUNCH50 dans Stripe (3 min) — BLOQUANT

Les pages `/launch-day` et `/producthunt` poussent le code `LAUNCH50` partout, mais **il n'existe pas encore dans Stripe**. Si quelqu'un l'utilise aujourd'hui = 500 au checkout.

### À faire
1. Stripe Dashboard → **Products** → **Coupons** → New coupon
2. Configurer :
   - **ID** : `LAUNCH50` (exactement, casse incluse)
   - **Type** : Percentage off → **50 %**
   - **Duration** : Once (premier mois uniquement)
   - **Redemption limit** : 100 redemptions max (cohérent avec "100 premiers signups" sur la landing)
   - **Expiry** : 27 mai 2026 23:59 UTC (1 semaine après launch)
   - **Eligible products** : tous les plans Starter/Pro/Agency (mensuel + annuel)
3. Save
4. Tester immédiatement : aller sur `https://konvertpilot.com/pricing?coupon=LAUNCH50` → cliquer Pro → checkout doit afficher "-50 %" sur la première facture

---

## 3. 🟠 UptimeRobot — Setup gratuit (10 min)

Compte gratuit chez [uptimerobot.com](https://uptimerobot.com) = 50 monitors / 5min interval. Largement suffisant.

### Monitors à créer (5 au total)

| Nom | URL | Type | Interval | Alerte |
|---|---|---|---|---|
| KONVERT — Homepage | `https://konvertpilot.com` | HTTP(s) | 5 min | Si down > 2 min |
| KONVERT — Health | `https://konvertpilot.com/api/health` | Keyword | 5 min | Mot-clé attendu : `"ok"` |
| KONVERT — Pricing | `https://konvertpilot.com/pricing` | HTTP(s) | 5 min | Si down > 5 min |
| KONVERT — Essai | `https://konvertpilot.com/essai` | HTTP(s) | 5 min | Si down > 5 min |
| KONVERT — Sitemap | `https://konvertpilot.com/sitemap.xml` | HTTP(s) | 30 min | Si down > 30 min |

### Pour `/api/health/deep` (ping Supabase + DeepSeek + Stripe)
UptimeRobot gratuit ne supporte pas les headers custom (besoin de `x-admin-secret`). Deux options :
- **Option A** — Skip ce monitor (les autres suffisent pour le launch)
- **Option B** — Upgrade UptimeRobot Pro ($7/mois) pour custom headers, ou utiliser [BetterUptime](https://betterstack.com/better-uptime) free tier qui le supporte

### Alertes
Dans **My Settings → Alert Contacts** :
- Ajouter ton email → notif sur tous les monitors
- Ajouter Telegram (gratuit, via leur bot) pour notif instantanée

### Test
Une fois configuré, force un down en mettant `https://konvertpilot.com/api/nonexistent` 1 min, vérifie que la notif arrive bien.

---

## 4. 🟠 Sentry — Alert Rules (10 min)

Le SDK Sentry est branché (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) avec scrubbing PII RGPD. Mais aucune règle d'alerte n'est définie → tu vois rien si ça pète.

### Règles à créer dans Sentry → Alerts → Create Alert

#### Rule 1 — Erreurs critiques sur `/api/generate/public` (la machine à cash)
- **Condition** : `event.type` = error
- **Filter** : `transaction` contient `/api/generate/public`
- **When** : `> 5 events in 5 minutes`
- **Action** : Send email + Slack (si configuré)
- **Environment** : production uniquement

#### Rule 2 — Stripe webhook qui pète
- **Condition** : `event.type` = error
- **Filter** : `transaction` contient `/api/stripe/webhook`
- **When** : `> 2 events in 10 minutes`
- **Action** : Email immédiat (chaque event est critique = paiement non enregistré)
- **Environment** : production uniquement

#### Rule 3 — Cron jobs qui pètent
- **Condition** : `event.type` = error
- **Filter** : `transaction` contient `/api/cron/`
- **When** : `> 1 event in 1 hour`
- **Action** : Email
- **Environment** : production uniquement

#### Rule 4 — Spike d'erreurs global (early warning)
- **Condition** : Number of errors
- **When** : `> 50 events in 10 minutes`
- **Action** : Email + Telegram si tu l'as
- **Environment** : production uniquement

### Bonus — Performance alert
- **Condition** : p95 transaction duration
- **Filter** : `transaction` contient `/api/generate/public`
- **When** : `> 25000 ms` (25s — au-delà DeepSeek timeout)
- **Action** : Email

---

## 5. 🟠 Variable launch date à pousser en Vercel (2 min)

La page `/launch-day` a un countdown qui pointe vers `2026-06-08` par défaut. Pour le launch 20 mai :

### À faire
Vercel → konvert → Settings → Environment Variables → Add new :
- **Name** : `NEXT_PUBLIC_LAUNCH_DATE`
- **Value** : `2026-05-20T07:00:00Z` (9h Paris = 7h UTC le jour J)
- **Environments** : Production
- **Save** puis **Redeploy** la dernière prod (ou push n'importe quel commit pour trigger)

Tu peux vérifier sur `https://konvertpilot.com/launch-day` — le countdown doit afficher ~5 jours restants.

---

## 6. 🟡 Pixels publicitaires — IDs à pousser en Vercel (5 min)

Les pixels Meta + Google + TikTok sont installés côté code (gated RGPD) mais **non-actifs** sans leurs IDs. Tu peux les pousser maintenant ou attendre le post-launch quand tu actives les pubs.

### Vars à ajouter en Vercel (toutes en `NEXT_PUBLIC_*` car client-side)
- `NEXT_PUBLIC_META_PIXEL_ID` = ID de ton Meta Business Manager
- `NEXT_PUBLIC_GOOGLE_TAG_ID` = déjà présent (`G-RZCLQ21ZTK`) — vérifier qu'il est bien là
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID` = ID TikTok Ads Manager

Côté serveur (CAPI) si tu veux le tracking server-side complet :
- `META_CAPI_ACCESS_TOKEN`
- `META_PIXEL_ID` (sans `NEXT_PUBLIC_`)
- `TIKTOK_CAPI_ACCESS_TOKEN`
- `TIKTOK_PIXEL_ID`

Si tu n'as pas encore créé les comptes pubs, **skip jusqu'au post-launch**. Pas bloquant pour le 20 mai.

---

## 7. ⚪ Crisp — Workflows à configurer (15 min) — non bloquant

Crisp est intégré (`CrispChat.tsx`) gated consent. Workflows à configurer dans Crisp Dashboard :

1. **Bot welcome** : message auto à la 1ère visite
   - "Salut 👋 Je suis l'équipe KONVERT. Une question sur le launch ou un bug ? Réponds ici."
2. **Scenario "pricing"** : si l'user est sur `/pricing` > 30s → message proactif
   - "Une question sur les plans ? On peut faire un appel rapide si tu veux."
3. **Hors heures** : 22h → 8h Paris → message "On répond demain matin <9h. Pour les bugs critiques, écris-nous à support@konvertpilot.com."
4. **Tag auto launch day** : tous les visiteurs J0 → tag `launch-day` pour les retrouver après

---

## Checklist finale 20 mai

Le 20 mai au matin avant le post Product Hunt, vérifier dans l'ordre :

- [ ] Stripe LIVE actif (coupon LAUNCH50 testé sur un produit)
- [ ] UptimeRobot all green
- [ ] Sentry alerts armées
- [ ] `NEXT_PUBLIC_LAUNCH_DATE` à 20 mai poussé + redeploy
- [ ] Push commits récents (bug-bash tests, etc.)
- [ ] Smoke tests verts : `npx playwright test` depuis le repo
- [ ] Load test passé : `node scripts/load-test-generate.mjs`
- [ ] Crisp en ligne (au moins toi connecté)
- [ ] Email contact@konvertpilot.com qui marche (test envoi → réception)
- [ ] Page `/producthunt` testée mobile + desktop
