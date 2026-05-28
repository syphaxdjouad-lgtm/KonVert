# Sentry — Alert rules à créer manuellement (UI)

À configurer dans Sentry Dashboard → Project `konvert` → Alerts → **Create Alert**.

Ces règles couvrent les chemins critiques où une dégradation passe sinon sous le radar (cf audit Sasori 2026-05-10).

---

## 🔴 Critique — paging immédiat (Slack/Telegram, hors heures incluses)

### 1. Webhook Stripe en erreur
- **When** : `event.type:error AND tags.route:"api/stripe/webhook"`
- **Threshold** : 1 occurrence en 5 min
- **Why** : un webhook Stripe en erreur = paiement non rattaché → user payé sans plan activé → ticket support garanti

### 2. /api/generate fail rate > 10 % sur 10 min
- **When** : metric `failure_rate` > 10 % sur `tags.route:"api/generate" OR tags.route:"api/generate/public"`
- **Window** : 10 min, évalué chaque 1 min
- **Why** : DeepSeek down ou Firecrawl bloqué = tunnel principal cassé

### 3. Webhook Stripe NEW unknown priceId
- **When** : `event.message:"Unknown priceId"` (level warning)
- **Threshold** : 1 occurrence
- **Why** : signifie que la table de mapping `getPlanFromStripePrice` rate un price ID — soit env var manquante, soit un new price créé en Dashboard sans déploiement code

### 4. /api/generate quota rollback failed
- **When** : `tags.phase:"rollback_quota"`
- **Threshold** : 1 occurrence en 1 h
- **Why** : un user a son quota brûlé sans page générée — il viendra réclamer

---

## 🟠 Sérieux — Slack en heures ouvrées

### 5. Cron trial-emails error rate
- **When** : `event.message:"taux d'erreur élevé" AND tags.cron:"trial-emails"`
- **Threshold** : 1 occurrence
- **Why** : déjà filtré côté code (>5 % du batch), donc une seule occurrence = vraie panne

### 6. Cron preview-emails error rate
- **When** : `event.message:"taux d'erreur élevé" AND tags.cron:"preview-emails"`
- **Threshold** : 1 occurrence

### 7. SSRF tentative bloquée
- **When** : `event.message:~"private IP|localhost|169.254"` AND `tags.route:~"scrape|generate"`
- **Threshold** : 5 occurrences en 1 h
- **Why** : sur une seule IP = curieux, sur 5 = scan de vulnérabilité ciblé

### 8. Rate limit middleware 429 en pic
- **When** : metric `http.request.rate_limited` > 50 / min
- **Window** : 5 min
- **Why** : soit attaque DoS, soit bug client qui boucle

---

## 🟡 Info — digest hebdo

### 9. Top 10 erreurs uniques de la semaine
- **Type** : weekly digest, lundi 9h FR
- **Filter** : `level:error AND environment:production`

### 10. Slow transactions /api/generate
- **When** : p95 latence > 50 s
- **Window** : 1 h
- **Why** : approche du timeout Vercel 60 s, signe que DeepSeek se dégrade ou Firecrawl traîne

---

## Routing recommandé

| Sévérité | Channel | Owner |
|---|---|---|
| Critique (1-4) | Telegram `@syphax` direct | toi (24/7) |
| Sérieux (5-8) | Slack `#ops` | toi (heures ouvrées) |
| Info (9-10) | Email hebdo | toi |

---

## Configuration "Notifications" (Sentry)

- Personal Notifications → Workflow Notifications → ON pour : new issue, regression, escalating issue
- Project Notifications → Slack/Telegram integration installée
- Ignored issues : aucune (jamais ignorer aveuglément, plutôt résoudre ou créer une règle de filtrage)
- Quiet hours : aucune sur les critiques 1-4 ; 22h-8h sur les sérieux 5-8
