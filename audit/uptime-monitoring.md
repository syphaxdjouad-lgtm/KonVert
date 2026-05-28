# Monitoring uptime externe — config à appliquer

Sasori P1 (audit 2026-05-10) : KONVERT n'a aucun monitoring externe. Si Vercel
ou Supabase a un blackout, on l'apprend par un user énervé. À fixer avant launch.

## Endpoints à surveiller

L'app expose 2 health checks (commit `3b635cf`) :

| Endpoint | Auth | Fréquence | Use case |
|---|---|---|---|
| `GET /api/health` | aucune | toutes les **2 min** | uptime monitor public, juste check que le service répond |
| `GET /api/health/deep` | header `x-admin-secret: <ADMIN_SECRET>` | toutes les **5 min** | check Supabase + DeepSeek + Stripe + Resend en parallèle |
| `GET /` | aucune | toutes les **5 min** | check homepage serve OK (SSR + cache HIT) |

`/api/health/deep` retourne `{status: "ok" | "degraded", checks: [...]}` — un alerting fin doit lever sur `status != "ok"` même si HTTP 200.

## Option 1 — UptimeRobot (gratuit, simple)

**Plan free** : 50 monitors, intervalle 5 min. Suffit largement.

1. Créer compte sur [uptimerobot.com](https://uptimerobot.com)
2. **Add New Monitor** × 3 :

   ### Monitor 1 — Homepage
   - Type : `HTTP(s)`
   - URL : `https://<DOMAINE_FINAL>/`
   - Interval : `5 minutes`
   - Alert when: `Down`
   - Keyword check : `KONVERT` (assure que la page rend du contenu, pas juste un 200 vide)

   ### Monitor 2 — Health basique
   - Type : `HTTP(s)`
   - URL : `https://<DOMAINE_FINAL>/api/health`
   - Interval : `2 minutes`
   - Alert when: `Down` OU `Keyword Not Exist`
   - Keyword : `"status":"ok"`

   ### Monitor 3 — Health deep
   - Type : `HTTP(s) Keyword`
   - URL : `https://<DOMAINE_FINAL>/api/health/deep`
   - Interval : `5 minutes`
   - HTTP method : `GET`
   - Custom HTTP headers : `x-admin-secret: <VALEUR_DE_TON_ADMIN_SECRET>`
   - Keyword : `"status":"ok"`
   - Alert : `Keyword Not Exist`

3. **Notifications** :
   - Add Alert Contact : Email perso + Telegram bot (recommandé)
   - Setup Telegram bot : @BotFather → /newbot → coller token dans UptimeRobot
   - Routing : tous les monitors → Telegram (instant) + Email (digest)

## Option 2 — BetterUptime (plus pro, payant léger)

Si tu veux plus tard de la **status page publique** + meilleur dashboard :

- [betteruptime.com](https://betteruptime.com) → plan Freelancer 18$/mois
- Avantages vs UptimeRobot : status page publique brandée, on-call rotations, incident management workflow, intégration Slack/Telegram/PagerDuty

Setup identique aux 3 monitors ci-dessus, mais via UI BetterUptime.

## Option 3 — Vercel Monitoring (intégré, payant)

Vercel offre `Vercel Speed Insights` (déjà installé) + `Vercel Web Analytics`
mais **pas d'uptime monitoring externe** — le check Vercel teste la fonction,
pas le navigateur user. À ne PAS substituer aux options 1 ou 2.

## Critères d'alerte

| Signal | Sévérité | Action |
|---|---|---|
| `/api/health` down 3 checks consécutifs (~6 min) | **P0** | Telegram + SMS au fondateur |
| `/api/health/deep` `status:"degraded"` 2 checks consécutifs (~10 min) | **P1** | Telegram |
| Homepage HTTP 5xx ou keyword absent | **P0** | Telegram + SMS |
| Latency p95 sur `/api/health/deep` > 8 s | **P2** | Email digest hebdo |

## Status page publique (optionnel, S3+)

Une fois UptimeRobot/BetterUptime configuré, le SaaS expose une page publique
type `status.konvert.app` qu'on peut afficher dans le footer du site et
mentionner sur les CGV. Améliore la confiance B2B.

UptimeRobot : `https://stats.uptimerobot.com/<your-public-page-id>`
BetterUptime : page personnalisée avec domaine custom

## Setup ETA

- UptimeRobot 3 monitors + Telegram : **15 min**
- BetterUptime + status page : **45 min**

## Bloquant : domaine final

Toutes les URLs ci-dessus utilisent `<DOMAINE_FINAL>` qui n'est **pas encore
acheté** (cf memory `project_konvert_domain.md`). Setup à faire le jour J+1
de la Semaine 1, après branchement Vercel + DNS.

En attendant, tu peux tester les monitors sur `https://konvert-ten.vercel.app`
qui sert le commit prod actuel. Les déplacer sur le vrai domaine après.
