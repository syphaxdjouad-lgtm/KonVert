# Dashboard Live Monitoring J0 — KONVERT
# Launch : mardi 2 juin 2026, 07h01 CET
# Auteur : KAKASHI — rédigé 30 mai 2026 UTC

---

## 1. KPIs prioritaires — 8 cards dashboard

Ces 8 metrics constituent la ligne du haut du dashboard PostHog "Konvert Launch J0".
Chaque card = 1 chiffre, 1 source, 1 refresh, 1 seuil d'alerte.

| # | KPI | Source | Event / endpoint | Refresh | Alerte si |
|---|---|---|---|---|---|
| 1 | Signups J0 | PostHog | `signup_completed` | 5 min | — |
| 2 | Paiements Stripe LIVE | Stripe Dashboard | `/v1/charges?created>1748822460&status=succeeded` | 5 min | — |
| 3 | MRR ajouté J0 | Stripe Dashboard | Subscriptions actives créées ce jour × ARPU | 15 min | — |
| 4 | Funnel /essai — worst drop | PostHog funnel | `essai_started` → `generate_started` → `generate_completed` → `essai_email_captured` | 5 min | Drop >50% entre 2 étapes adjacentes |
| 5 | Conversion pricing → paid | PostHog funnel | `pricing_page_viewed` → `checkout_started` → `generate_completed` (proxy paiement) | 15 min | <3% (bench interne : 8%) |
| 6 | Sentry error rate | Sentry API | Errors last 1h / requests last 1h | 5 min | >1% |
| 7 | Uptime monitors | UptimeRobot API | 5 endpoints actifs | 1 min | Tout endpoint down >2 min |
| 8 | Position Product Hunt | Fetch direct PH | Scrape ranking page `/posts?day=2026-06-02` | 10 min | Hors top 10 |

Note KPI 4 : les events trackés dans `analytics.ts` sont `essai_started`, `generate_started` (avec `source='public'`), `generate_completed` (avec `source='public'`), `essai_email_captured`. Ce sont les noms exacts à utiliser dans PostHog — pas `url_paste` ni `generate_success` (ces noms n'existent pas dans le code).

Note KPI 5 : `payment_success` n'est pas un event PostHog côté client. Le proxy le plus proche est la séquence `checkout_started` → absence de `subscription_cancelled` dans les 24h. La source de vérité paiement reste Stripe Dashboard.

---

## 2. Vues secondaires — drill-down

Six vues à ouvrir en tabs le jour J, en complément du dashboard PostHog principal.

### 2.1 Funnel signup détaillé

Séquence PostHog :
`signup_started` → `signup_completed` (method) → `dashboard_viewed` → `new_page_wizard_started` → `new_page_wizard_completed` → `page_published`

Objectif : repérer l'étape où les nouveaux signups s'arrêtent. Si >40% abandonnent entre `signup_completed` et `dashboard_viewed`, problème d'onboarding post-inscription (email de confirmation bloquant, redirect cassée).

### 2.2 Funnel essai anonyme → conversion

Séquence PostHog :
`essai_started` → `generate_started {source:'public'}` → `generate_completed {source:'public'}` → `essai_email_captured` → `signup_started`

Ce funnel mesure la performance du flow `/essai` sans compte, la feature d'acquisition principale de J0. Si `generate_completed` → `essai_email_captured` passe sous 20%, l'appel à l'action post-génération est cassé ou trop timide.

### 2.3 Top sources signups (UTM)

Dans PostHog : breakdown de `signup_completed` par `utm_source`.
Sources attendues J0 : `producthunt`, `meta`, `organic`, `direct`, `referral`, `newsletter`.
Si `direct` dépasse 30%, l'attribution est dégradée (UTM manquants sur un canal).

### 2.4 Erreurs Sentry groupées

Tab Sentry : vue "Issues" triée par fréquence, filtrée sur les dernières 1h glissantes.
Les 5 errors les plus fréquentes avec count + URL affectée.
Priorité absolue : toute erreur sur `/api/generate`, `/api/auth`, `/api/stripe`.

### 2.5 Webhook Stripe success rate

Dans Stripe Dashboard → Webhooks → événements récents.
Filtrer : `checkout.session.completed`, `customer.subscription.created`, `invoice.paid`.
Seuil critique : si >5% des webhooks sont en état `failed` ou `pending`, arrêter immédiatement les campagnes payantes (on encaisse sans délivrer).

### 2.6 Latence DeepSeek — génération AI

Event PostHog : `generate_completed` property `duration_ms`.
Créer un percentile chart (p50 / p95) sur la journée.
Seuil : p95 >25 000 ms = alerte (génération trop lente, churn immédiat sur /essai).
Backup signal : `generate_failed {reason}` — si le motif contient "timeout" ou "rate_limit", DeepSeek est saturé.

---

## 3. Alertes critiques — notification immédiate

Deux niveaux. P0 = réveille tout le monde. P1 = Discord équipe, résolution dans l'heure.

### P0 — Stopper ce qu'on fait et corriger maintenant

| Signal | Condition | Canaux | Owner réponse |
|---|---|---|---|
| Site principal down | `/` ou `/api/health/deep` inaccessible >2 min | SMS + Discord #nexara-alerts | SASORI (infra) |
| Webhook Stripe cassé | Success rate <90% sur 30 dernières mins | Email + Discord | ANNA (fix CAPI/webhook) |
| API génération en feu | `generate_failed` >10% des `generate_started` sur 30 min | Discord | ANNA + vérifier DeepSeek status |

### P1 — Résolution dans l'heure, campagnes ads non stoppées

| Signal | Condition | Canaux | Owner réponse |
|---|---|---|---|
| Sentry error rate | >1% requests last 1h | Discord | ANNA investigates |
| Signaux stalled | 0 nouveau `signup_completed` pendant 60 min sur tranche 09h-18h CET | Discord | ITACHI check ads + KAKASHI check funnel |
| PH ranking dégradé | Hors top 10 après 12h CET | Discord | NARUTO (community push Wave 2) |
| Latence génération | p95 `duration_ms` >25 000 ms sur 1h | Discord | ANNA (timeout tuning) |

---

## 4. Stack technique — recommandation

Trois options évaluées.

**Option A — PostHog Dashboards** (recommandée)
PostHog est déjà instrumenté avec 20+ events. Le dashboard "Konvert Launch J0" se crée en 45 minutes dans l'UI. Gratuit sur le plan actuel. Limite : pas de monitoring uptime natif, pas de données Stripe temps réel.

**Option B — Grafana + Prometheus self-hosted**
Overkill pour J0. Setup 4h minimum, maintenance infra pendant le launch. A rejeter.

**Option C — Tabs séparés navigateur** (Stripe + Sentry + Vercel + PostHog + UptimeRobot)
Rapide à setup, zéro intégration. Mais fragile : une tab refresh manquée = métrique manquée. Acceptable uniquement en backup si PostHog dashboard ne se monte pas à temps.

**Verdict** : Option A pour funnels + behavioral data. Option C en couche parallèle pour Stripe et Sentry (ouverts en tabs fixes, pinned). Les deux fonctionnent ensemble sans conflit.

---

## 5. Spec PostHog Dashboard — 12 queries HogQL

Créer ces insights dans PostHog UI → "Konvert Launch J0" → New Insight.

```sql
-- INSIGHT 1 : Signups totaux J0 (chiffre unique, affiché en card)
SELECT count() AS signups
FROM events
WHERE event = 'signup_completed'
  AND toDate(timestamp) = '2026-06-02'

-- INSIGHT 2 : Signups par heure (courbe J0)
SELECT toStartOfHour(timestamp) AS heure, count() AS signups
FROM events
WHERE event = 'signup_completed'
  AND toDate(timestamp) = '2026-06-02'
GROUP BY heure
ORDER BY heure

-- INSIGHT 3 : Signups par méthode (email vs Google)
SELECT properties.method AS methode, count() AS total
FROM events
WHERE event = 'signup_completed'
  AND toDate(timestamp) = '2026-06-02'
GROUP BY methode

-- INSIGHT 4 : Funnel essai public (entonnoir natif PostHog)
-- Créer un Funnel insight avec ces étapes dans l'ordre :
-- Étape 1 : essai_started
-- Étape 2 : generate_started (filtrer properties.source = 'public')
-- Étape 3 : generate_completed (filtrer properties.source = 'public')
-- Étape 4 : essai_email_captured
-- Window : 30 minutes (session essai courte)

-- INSIGHT 5 : Funnel signup → activation (premier wizard complété)
-- Funnel natif PostHog, window 24h :
-- Étape 1 : signup_completed
-- Étape 2 : new_page_wizard_started
-- Étape 3 : new_page_wizard_completed
-- Étape 4 : page_published

-- INSIGHT 6 : Funnel pricing → checkout
-- Funnel natif PostHog, window 2h :
-- Étape 1 : pricing_page_viewed
-- Étape 2 : plan_selected
-- Étape 3 : checkout_started

-- INSIGHT 7 : Top sources UTM signups
SELECT properties.$referring_domain AS source, count() AS signups
FROM events
WHERE event = 'signup_completed'
  AND toDate(timestamp) = '2026-06-02'
GROUP BY source
ORDER BY signups DESC
LIMIT 10

-- INSIGHT 8 : Erreurs génération par motif
SELECT properties.reason AS motif, count() AS occurrences
FROM events
WHERE event = 'generate_failed'
  AND toDate(timestamp) = '2026-06-02'
GROUP BY motif
ORDER BY occurrences DESC
LIMIT 10

-- INSIGHT 9 : Latence génération (p50 / p95)
SELECT
  quantile(0.50)(properties.duration_ms) AS p50_ms,
  quantile(0.95)(properties.duration_ms) AS p95_ms,
  count() AS total_generations
FROM events
WHERE event = 'generate_completed'
  AND toDate(timestamp) = '2026-06-02'

-- INSIGHT 10 : Plans sélectionnés (mix Starter/Pro/Agency)
SELECT properties.plan AS plan, properties.price AS prix, count() AS selections
FROM events
WHERE event = 'plan_selected'
  AND toDate(timestamp) = '2026-06-02'
GROUP BY plan, prix
ORDER BY selections DESC

-- INSIGHT 11 : Taux d'activation wizard (% ayant complété vs démarré)
SELECT
  countIf(event = 'new_page_wizard_started') AS wizard_starts,
  countIf(event = 'new_page_wizard_completed') AS wizard_completes,
  round(countIf(event = 'new_page_wizard_completed') * 100.0
    / nullIf(countIf(event = 'new_page_wizard_started'), 0), 1) AS taux_completion_pct
FROM events
WHERE event IN ('new_page_wizard_started', 'new_page_wizard_completed')
  AND toDate(timestamp) = '2026-06-02'

-- INSIGHT 12 : Essai → signup pipeline (taux de conversion anonyme → compte)
SELECT
  countIf(event = 'essai_started') AS essais,
  countIf(event = 'essai_email_captured') AS emails_captures,
  countIf(event = 'signup_completed') AS signups,
  round(countIf(event = 'essai_email_captured') * 100.0
    / nullIf(countIf(event = 'essai_started'), 0), 1) AS taux_email_pct,
  round(countIf(event = 'signup_completed') * 100.0
    / nullIf(countIf(event = 'essai_email_captured'), 0), 1) AS taux_signup_pct
FROM events
WHERE event IN ('essai_started', 'essai_email_captured', 'signup_completed')
  AND toDate(timestamp) = '2026-06-02'
```

---

## 6. Pre-flight checklist J-1 (dimanche 1er juin)

Valider chaque item avant 23h00 CET le 1er juin.

- [ ] PostHog dashboard "Konvert Launch J0" créé avec les 12 insights ci-dessus
- [ ] Tous les funnels PostHog (insights 4, 5, 6) testés avec données réelles (events de dev/staging)
- [ ] 4 Sentry alert rules configurées (voir seuils section 3)
  - Error rate >1% last 1h → Discord webhook
  - `/api/generate` errors >10% → Discord webhook
  - Tout `generate_failed` avec reason contenant "timeout" → Discord
  - Nouveau type d'error (first seen) sur `/api/stripe` ou `/api/auth` → email
- [ ] 5 UptimeRobot monitors actifs (check 1 min)
  - https://konvertpilot.com/
  - https://konvertpilot.com/api/health/deep
  - https://konvertpilot.com/dashboard
  - https://konvertpilot.com/essai
  - https://konvertpilot.com/api/stripe/webhook (HTTP 200 check)
- [ ] Discord #nexara-alerts webhook URL configuré dans Sentry + UptimeRobot
- [ ] Stripe Dashboard filtré sur "2 juin 2026" + pinned dans navigateur (tab fixe)
- [ ] Product Hunt page Konvert URL confirmée et scrape Firecrawl testée manuellement
- [ ] DeepSeek API status page bookmarked (https://status.deepseek.com)
- [ ] Vercel Analytics + Speed Insights confirmés actifs en prod
- [ ] Test end-to-end /essai réalisé en navigation privée (URL prod, pas staging)
- [ ] Test paiement Stripe LIVE avec carte test réelle validé la veille (refund immédiat)

---

## 7. Plan de bataille J0 — heure par heure

### Phase 1 : Décollage (07h01 – 09h00 CET)

| Heure CET | Action | Trigger / condition |
|---|---|---|
| 07h01 | Publier page Product Hunt | Manuel — lien PH + tweet/post LinkedIn immédiats |
| 07h05 | Vérifier monitors UptimeRobot = tous verts | Manuel — si rouge : alerte P0 immédiate SASORI |
| 07h05 | Vérifier Sentry : 0 erreur active | Manuel — si erreur `/api/generate` : call ANNA |
| 07h10 | PostHog : 1er `essai_started` attendu | Si 0 event à 07h20 : vérifier tracking PostHog en prod |
| 07h20 | Premier signup attendu | Si 0 `signup_completed` à 07h30 : vérifier funnel /essai |
| 07h30 | ITACHI : confirmer Meta Ads actives | 1er rapport CPA intermédiaire |
| 08h00 | Checkpoint H+1 | Objectif : 5 signups minimum, 0 incident P0 |
| 08h00 | Envoyer Wave 1 supporters (liste FR/EU) | DMs PH + email liste warmup |
| 08h30 | Lire les 5 premiers commentaires PH | Répondre dans les 15 min à chaque commentaire |

### Phase 2 : Accélération (09h00 – 14h00 CET)

| Heure CET | Action | Trigger / condition |
|---|---|---|
| 09h00 | Checkpoint H+2 | Objectif : 15 signups, PH top 15 |
| 09h00 | Vérifier drop-off funnel essai (Insight 4) | Si >50% drop `generate_completed` → `essai_email_captured` : A/B CTA |
| 10h00 | Checkpoint H+3 | Objectif : 20 signups, 1 paiement Stripe |
| 10h30 | Wave US East Coast (09h30 EST wake-up) | DMs PH supporters US |
| 11h00 | Vérifier latence p95 (Insight 9) | Si p95 >25s : ANNA + DeepSeek status |
| 12h00 | Checkpoint H+5 | Objectif : 28 signups, 2 paiements, PH top 10 |
| 12h00 | Bilan mi-journée complet | KAKASHI synthèse → ajustement budget ads si canal < 50% objectif |
| 13h00 | Post LinkedIn 2ème vague | "On est en route pour le top 10 PH — voici nos premiers chiffres" |
| 14h00 | Checkpoint H+7 | Objectif : 33 signups, 3 paiements |

### Phase 3 : Maintien (14h00 – 19h00 CET)

| Heure CET | Action | Trigger / condition |
|---|---|---|
| 14h00 | ITACHI : décision scale/kill créatifs Meta | Basé sur CPA réel vs objectif (<40€ = scale, >80€ = kill) |
| 15h00 | Checkpoint H+8 | Objectif : 38 signups, 4 paiements |
| 15h30 | Reply à tous commentaires PH non répondus | < 1h de délai max sur tous les commentaires |
| 16h00 | Wave US West Coast (08h00 PST wake-up) | DMs PH supporters US West |
| 17h00 | Checkpoint H+10 | Objectif : 43 signups, 4 paiements, PH top 10 confirmé |
| 18h00 | Vérifier cohort activation (Insight 5) | Si <20% wizards complétés / signups : bug ou onboarding confus |

### Phase 4 : Clôture (19h00 – 23h59 CET)

| Heure CET | Action | Trigger / condition |
|---|---|---|
| 19h00 | Checkpoint H+12 | Objectif : 47 signups, 5 paiements |
| 20h00 | PH vote window critique (minuit PST s'approche) | Derniers DMs supporters US |
| 21h00 | Checkpoint H+14 | Bilan quasi-final, ajustement objectif si dépassé |
| 22h00 | Vérifier Stripe webhooks success rate | Si <95% : investiguer avant fermeture |
| 23h00 | Arrêt campagnes Meta (sauf si ROAS >3x, continuer) | Décision ITACHI + KAKASHI |
| 23h59 | Bilan J0 complet | Pull données finales PostHog + Stripe, préparer rapport J+1 |

---

## 8. Rapport débrief J+1 — spec

À produire le mercredi 3 juin 2026 avant 12h00 CET.

### Structure du rapport

**Résumé exécutif** (1 paragraphe, 3 chiffres)
Signups réels vs objectif 50. Paiements réels vs objectif 5. Position PH finale vs objectif top 10.

**Achievement vs objectifs**

| Objectif | Cible | Réel | Statut |
|---|---|---|---|
| Signups J0 | 50 | [à remplir] | — |
| Paiements Stripe LIVE | 5 | [à remplir] | — |
| Position Product Hunt | Top 10 | [à remplir] | — |
| Incidents sev2 | 0 | [à remplir] | — |
| MRR ajouté | >195€ (5×39€) | [à remplir] | — |

**Top 3 surprises positives** (avec données chiffrées)
Format : observation → chiffre → implication pour J+7

**Top 3 surprises négatives** (avec données chiffrées)
Format : observation → chiffre → action corrective immédiate

**Analyse funnels**
- Funnel /essai : taux de conversion à chaque étape
- Funnel signup → activation : % wizard complété à J0
- Funnel pricing → checkout : CVR vs benchmark 8%
- Pire étape identifiée (worst drop) → action prioritaire

**Top 3 actions immédiates J+1**
Priorisées par impact estimé × probabilité × effort inverse. Pas plus de 3.

**Données à archiver**
Mettre à jour `project_konvert_launch_20mai.md` (renommer `project_konvert_launch_2juin.md`) avec :
- MRR J0 final
- Cohorte J0 (date de signup, plan, source UTM)
- CAC par canal J0
- Position PH finale + score upvotes
- Top funnel bottleneck identifié

---

## 9. Quick wins data J0

Trois segments à observer dès les premières heures pour décisions rapides.

**QW1 — Early adopters à identifier**
Surveiller qui complète le wizard ET publie une page dans les 2 premières heures. Ce sont les power users. Les contacter directement (email ou Telegram) pour feedback synchrone J0. Ils seront les meilleurs cas clients dans 30 jours.

**QW2 — Canal source top à scaler immédiatement**
Si l'Insight 7 (UTM breakdown) montre un canal avec >40% signups et un taux de completion wizard >50%, ITACHI reçoit le signal pour doubler le budget sur ce canal avant 12h CET. Ne pas attendre le bilan mi-journée.

**QW3 — Taux de conversion /essai → email**
Si `essai_email_captured` / `essai_started` > 30% dans les 2 premières heures, le flow anonyme fonctionne mieux que prévu — c'est l'argument pour orienter encore plus de trafic payant vers `/essai` plutôt que `/pricing`. Signal à communiquer à ITACHI avant 10h CET.

---

## 10. Risques data J0

**R1 — Biais mesure early hours**
Les premières heures PH (07h01-09h00 CET) attirent un public atypique : early adopters tech, followers du fondateur, communauté NEXARA. Le CVR de cette tranche sera artificiellement élevé. Ne pas projeter sur la journée entière avant H+5. Attendre N ≥ 30 signups avant toute conclusion sur le funnel.

**R2 — Attribution dégradée sur mobile**
Une part des trafics PH viendra de l'app mobile PH ou de partages directs sans UTM. Les signups "direct" ou "none" pourraient représenter 20-35% des conversions — ce ne sont pas des signups organiques, c'est de l'attribution cassée. Documenter cette limite dans le débrief J+1 avant d'annoncer un CAC organique.

**R3 — Fatigue tracker post-PH**
Les utilisateurs qui s'inscrivent après 18h CET ont souvent déjà vu le produit plusieurs fois (PH, Twitter, LinkedIn). Leur comportement d'onboarding sera différent de la cohorte 07h-12h. Ne pas mélanger les deux dans l'analyse d'activation — segmenter par tranche horaire dans PostHog (Insight 2) avant de tirer des conclusions sur le TTFV.

---

## 11. Recommandations analytics post-J0

**Cohort weekly retention (J+7)**
Dès le 9 juin : créer dans PostHog une cohort retention chart sur la cohorte "signup 2 juin". Métrique de retention : `page_published` dans la semaine. Si retention J7 < 20%, l'onboarding est le problème numéro 1, pas l'acquisition.

**Churn early indicator (J+14)**
Surveiller `subscription_cancelled` dans les 14 premiers jours. Tout utilisateur qui annule sans avoir déclenché `page_published` au moins 1 fois est un signal d'onboarding raté, pas de churn volontaire. Segmenter et contacter proactivement (DEIDARA).

**CAC par canal (J+7)**
Croiser Stripe subscriptions de la cohorte J0 avec UTM source (PostHog) et dépenses Meta/Google (ITACHI) pour calculer le CAC réel par canal. Ne pas se fier aux chiffres Meta Ads Manager seuls — appliquer la règle des 3 sources (Meta + GA4 + Stripe ground truth). Ce chiffre pilote les décisions de budget semaine 2.

---

*Dashboard J0 spec — KAKASHI, 30 mai 2026 UTC*
*Source events : /Users/mac/nexara/konvert/src/lib/analytics.ts (22 events trackés)*
