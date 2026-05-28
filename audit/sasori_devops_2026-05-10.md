# KONVERT — Audit DevOps & Infra
**Auteur** : SASORI (DevOps & SRE NEXARA)
**Date** : 2026-05-10T00:00:00Z
**Scope** : vercel.json, next.config.ts, Sentry ×3, env vars, crons, health, CI/CD, logs, backups, rollback, alerting, observabilité
**Ref. précédent audit** : AUDIT_LAUNCH_READINESS_v2.md (2026-05-04)

---

## Résumé exécutif

Sur 13 domaines audités, 4 items **P0** (production à risque immédiat), 7 items **P1** (dégradation silencieuse de l'observabilité ou risque incident), 6 items **P2** (amélioration opérationnelle). Aucun trou de sécurité infra nouveau par rapport au v2, mais l'observabilité est incomplète sur les chemins critiques (crons, génération, scraping) et le health check est trop superficiel pour un monitoring uptime fiable.

---

## P0 — Bloquants production

### P0-1 : Sentry `beforeSend` absent sur les 3 configs — risque PII réel

**Constat.** `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` : aucun `beforeSend`. Les stack traces envoyées peuvent contenir des emails utilisateurs (ex. `[contact] Message from: user@example.com` — log direct en prod), des URLs produit avec tokens, des réponses API partielles.

Ce point était déjà flagué dans l'audit v2. Il n'a pas été traité.

**Fix concret.** Ajouter dans `sentry.server.config.ts` et `sentry.client.config.ts` :

```ts
beforeSend(event) {
  // Supprimer les breadcrumbs contenant des emails ou tokens
  if (event.breadcrumbs?.values) {
    event.breadcrumbs.values = event.breadcrumbs.values.map((b) => ({
      ...b,
      message: b.message?.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g, '[email]'),
    }))
  }
  // Supprimer les données de requête HTTP brutes
  if (event.request) {
    delete event.request.data
    delete event.request.cookies
    if (event.request.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['cookie']
    }
  }
  return event
},
```

---

### P0-2 : `release` et `environment` absents des 3 configs Sentry

**Constat.** Aucune des 3 configs Sentry ne déclare `release` ni `environment`. Conséquences directes :
- Impossible de corréler une erreur Sentry à un déploiement Vercel précis (pas de regression tracking)
- Tous les events arrivent dans Sentry sans label — impossible de filtrer preview vs prod
- Le release tagging est nécessaire pour que `deleteSourcemapsAfterUpload: true` (déjà configuré dans `next.config.ts`) serve à quelque chose : sans release, les source maps uploadées ne sont pas liées aux events

**Fix concret.** Dans les 3 fichiers Sentry :

```ts
Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? 'development',       // 'production' | 'preview' | 'development'
  release: process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev',
  // ... reste de la config
})
```

`VERCEL_ENV` et `VERCEL_GIT_COMMIT_SHA` sont injectés automatiquement par Vercel — pas de config supplémentaire nécessaire.

---

### P0-3 : Crons sans `maxDuration` déclaré — timeout silencieux à 10s (Hobby) ou variable (Pro)

**Constat.** `/api/cron/trial-emails/route.ts` et `/api/cron/preview-emails/route.ts` : aucune déclaration `export const maxDuration`. Sans cette déclaration, Vercel applique le default du plan (10s sur Hobby, non spécifié sur Pro). Les crons boucle sur jusqu'à 500 utilisateurs — chaque itération fait 2 appels Supabase + 1 appel Resend. À 500 users, le temps d'exécution peut dépasser 30s facilement.

Le timeout sera silencieux : Vercel tue la function sans erreur visible dans les logs Sentry (la function n'a pas le temps d'envoyer l'exception). Les emails de la fin du batch ne sont pas envoyés, et `trial_emails_sent` peut avoir été mis à jour partiellement.

**Fix concret.** Ajouter en tête de chaque route cron :

```ts
export const maxDuration = 60  // Vercel Pro limit
export const runtime = 'nodejs'
```

Et ajouter un guard explicite sur le temps d'exécution dans la boucle :

```ts
const DEADLINE_MS = 55_000
const startTime = Date.now()

for (const user of users ?? []) {
  if (Date.now() - startTime > DEADLINE_MS) {
    console.warn('[cron/trial-emails] deadline approchée, arrêt anticipé', { processed: sent + errors })
    break
  }
  // ... traitement
}
```

---

### P0-4 : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans `.env.example` mais introuvable dans `src/`

**Constat.** Le fichier `.env.example` déclare `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`. Cette variable n'est référencée nulle part dans `src/` (`grep` : 0 résultat). L'audit v2 indique que Stripe est encore en mode TEST (`sk_test_placeholder\n`). Si la variable côté client n'est pas consommée, cela signifie soit que Stripe.js est initialisé depuis une autre variable non documentée, soit que le checkout côté client est absent (redirection Stripe directe sans prebuilt UI). Ce point mérite vérification avant le go-live Stripe LIVE — une variable manquante côté client au moment du switch LIVE peut casser silencieusement le checkout.

**Fix concret.** Vérifier comment `@stripe/stripe-js` est initialisé dans le code :

```bash
grep -rn "loadStripe\|STRIPE_PUBLISHABLE\|pk_" src/ --include="*.ts" --include="*.tsx"
```

Si `loadStripe` n'est pas appelé, la var peut être supprimée du `.env.example`. Si elle l'est avec une variable non documentée, l'ajouter dans `.env.example` pour éviter une régression au prochain déploiement.

---

## P1 — Dégradation silencieuse / risque incident

### P1-1 : Health endpoint trop superficiel pour un monitoring uptime fiable

**Constat.** `/api/health` retourne toujours `{ status: 'ok' }` quel que soit l'état réel du système. Il tourne sur Edge runtime sans aucune sonde. Si Supabase est down, Resend est down, ou DEEPSEEK_API_KEY est invalide, le check retourne quand même `200 ok`. UptimeRobot/BetterStack déclarera le site "up" alors que 100% des générations échouent.

La décision de ne pas sonder les dépendances est documentée dans le code ("ne pas créer de dépendances qui feraient passer le check en rouge si Supabase a un blip"). C'est une décision valide pour le check uptime de base. Mais il manque un second endpoint de deep health.

**Fix concret.** Créer deux endpoints distincts :

`/api/health` (existant) — reste tel quel pour UptimeRobot (check uptime Vercel Edge uniquement).

`/api/health/deep` (nouveau, Node.js runtime, auth par `ADMIN_SECRET`) :

```ts
export const runtime = 'nodejs'
export const maxDuration = 10

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const checks: Record<string, 'ok' | 'error'> = {}

  // Supabase ping
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1)
    checks.supabase = error ? 'error' : 'ok'
  } catch { checks.supabase = 'error' }

  // DEEPSEEK_API_KEY présente
  checks.deepseek_key = process.env.DEEPSEEK_API_KEY ? 'ok' : 'error'

  // CRON_SECRET présente
  checks.cron_secret = process.env.CRON_SECRET ? 'ok' : 'error'

  const allOk = Object.values(checks).every(v => v === 'ok')
  return NextResponse.json({ status: allOk ? 'ok' : 'degraded', checks }, {
    status: allOk ? 200 : 503,
  })
}
```

Configurer une alerte BetterStack sur ce deep health toutes les 5 minutes avec notification Slack/Telegram.

---

### P1-2 : Logs non structurés (texte libre) — impossible à parser en prod

**Constat.** Tous les `console.log` / `console.error` des routes API sont en format texte libre : `[/api/generate] mode partial — génération avec données incomplètes:`. Vercel Logs (et tout log aggregator — Datadog, Axiom) ne peut pas indexer ces logs sans parsing regex fragile.

Cas particulier P1 : `/api/contact/route.ts:39` logue directement `email` et `subject` en clair (`[contact] Message from: user@example.com | Subject: ...`). En prod, cet email va dans les Vercel Logs et potentiellement dans Sentry via breadcrumbs.

**Fix concret.** Adopter un helper de log structuré minimal :

```ts
// src/lib/logger.ts
export const log = {
  info: (msg: string, ctx?: Record<string, unknown>) =>
    console.log(JSON.stringify({ level: 'info', msg, ...ctx, ts: new Date().toISOString() })),
  error: (msg: string, ctx?: Record<string, unknown>) =>
    console.error(JSON.stringify({ level: 'error', msg, ...ctx, ts: new Date().toISOString() })),
}
```

Pour le log PII contact, remplacer :
```ts
// Avant (PII)
console.log('[contact] Message from:', email, '| Subject:', subject)

// Après (safe)
log.info('contact.received', { subject_len: subject?.length, domain: email?.split('@')[1] })
```

---

### P1-3 : Crons sans instrumentation Sentry — erreurs avalées silencieusement

**Constat.** Les deux routes cron capturent les erreurs par-user dans `catch` et incrémentent `errors++`, mais ne rapportent jamais à Sentry. Si un batch de 500 users produit 200 errors, la réponse finale est `{ sent: 300, errors: 200 }` — mais aucune alerte ne se déclenche. Ce résultat n'est visible que si quelqu'un lit les logs Vercel manuellement.

**Fix concret.** Ajouter en fin de handler des deux crons :

```ts
if (errors > 0) {
  const Sentry = await import('@sentry/nextjs').catch(() => null)
  Sentry?.captureMessage(`[cron/trial-emails] ${errors} erreurs sur ${users?.length ?? 0} users`, {
    level: 'error',
    extra: { sent, errors, checked: users?.length ?? 0 },
  })
}
```

Et en cas d'erreur Supabase sur le fetch initial (le `if (error)` actuel retourne 500 sans Sentry) :

```ts
if (error) {
  Sentry?.captureException(error, { tags: { cron: 'trial-emails', phase: 'fetch' } })
  return NextResponse.json({ error: '...' }, { status: 500 })
}
```

---

### P1-4 : `vercel.json` — aucun `functionTimeout` par route, aucune région de fallback

**Constat.** `vercel.json` ne déclare aucune configuration `functions` avec timeout par route. Les timeouts sont définis dans le code (`export const maxDuration`) mais pas centralisés. Si un développeur oublie de déclarer `maxDuration` sur une nouvelle route coûteuse, elle tourne avec le default Vercel (variable selon le plan).

Par ailleurs, `"regions": ["cdg1"]` sans fallback : si la région Paris a un incident Vercel, le service est intégralement down. Vercel ne fait pas de failover automatique sur une région unique.

**Fix concret.** Ajouter dans `vercel.json` :

```json
{
  "regions": ["cdg1"],
  "functions": {
    "src/app/api/generate/**": { "maxDuration": 60 },
    "src/app/api/scrape/**": { "maxDuration": 55 },
    "src/app/api/cron/**": { "maxDuration": 60 },
    "src/app/api/stripe/webhook/**": { "maxDuration": 30 }
  }
}
```

Pour le multi-région : ajouter `"iad1"` (US-East) comme région secondaire si le public cible n'est pas exclusivement EU. Si EU-only (RGPD), laisser cdg1 seul mais documenter le SLA dans le runbook incident.

---

### P1-5 : CI/CD absent — aucun GitHub Actions workflow

**Constat.** `.github/workflows/` n'existe pas. Il n't y a que `dependabot.yml`. Cela signifie :
- Zéro lint automatique sur les PRs — des `eslint` errors peuvent merger sans blocage
- Zéro type-check sur CI — un `tsc` error ne bloque pas le merge
- Zéro test automatisé (même minimal)
- Vercel déploie directement depuis le push sur `main` sans gate de qualité

Husky et lint-staged sont absents du `package.json`. Le script `lint` dans `package.json` appelle `eslint` sans argument (`"lint": "eslint"`) — ne lint rien par défaut sans configuration supplémentaire.

**Fix concret.** Créer `.github/workflows/ci.yml` :

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint -- src/
      - run: npx tsc --noEmit
      - run: npm run build
        env:
          # Variables minimales pour que le build passe
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_APP_URL: https://konvert.app
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: konvert
```

Et corriger le script lint dans `package.json` :
```json
"lint": "eslint src/"
```

---

### P1-6 : `ANTHROPIC_API_KEY` fantôme dans `.env.example` — confusion opérationnelle

**Constat.** `.env.example` documente `ANTHROPIC_API_KEY=sk-ant-...` avec le commentaire "legacy, garde la clé tant que dossier `src/lib/anthropic` existe". Or `grep` dans `src/` retourne 0 résultat pour `ANTHROPIC_API_KEY`. Le module s'appelle `src/lib/anthropic/generate.ts` mais il utilise `DEEPSEEK_API_KEY`. C'est un vestige de nommage qui peut induire en erreur lors d'un onboarding ou d'un incident (quelqu'un cherche la clé Anthropic dans Vercel env vars alors qu'il faut chercher DEEPSEEK).

De même, `SCRAPERAPI_KEY` et `APIFY_API_KEY` sont dans `.env.example` mais ne sont pas consommés dans `src/` (0 résultat grep). Ces fallbacks scraper sont peut-être dans `src/lib/scraper.ts` — à vérifier.

**Fix concret.** Nettoyer `.env.example` :
- Supprimer `ANTHROPIC_API_KEY` ou la commenter avec `# SUPPRIMÉ — remplacé par DEEPSEEK_API_KEY`
- Vérifier si `SCRAPERAPI_KEY` / `APIFY_API_KEY` sont dans `src/lib/scraper.ts` et les conserver uniquement s'ils sont réellement consommés
- Renommer le dossier `src/lib/anthropic/` en `src/lib/ai/` ou `src/lib/generate/` pour éviter la confusion avec le SDK Anthropic

---

### P1-7 : Alerting Sentry non configuré — aucune alerte sur seuil d'erreurs

**Constat.** Les 3 configs Sentry sont fonctionnelles (DSN présent, enabled en prod, source maps uploadées). Mais aucune alerte Sentry n'est documentée ou vérifiable depuis le code. Sans `release` + `environment` (P0-2), il est impossible de créer des alertes fiables par environnement. En l'état, les erreurs arrivent dans Sentry mais personne n'est notifié automatiquement.

**Fix concret.** Après avoir appliqué P0-2, configurer dans Sentry Dashboard :

1. Alerte : `error rate > 5% sur 10 minutes` sur les transactions `/api/generate` et `/api/scrape` → notif Slack/Telegram
2. Alerte : toute erreur de type `ScrapeError` avec `level: fatal` → notif immédiate
3. Alerte : `errors count > 10 sur 5 minutes` sur cron routes → notif
4. Alerte sur `STRIPE_WEBHOOK_SECRET` manquant (capturé dans le webhook) → P0 immédiat

---

## P2 — Améliorations opérationnelles

### P2-1 : CSP manque `*.sentry.io` et `*.ingest.sentry.io`

**Constat.** Déjà flagué dans l'audit v2. `connect-src` dans `next.config.ts` ne liste pas les domaines Sentry. Le tunnel `/monitoring` est configuré (`tunnelRoute: '/monitoring'`) ce qui achemine les events côté client via notre propre domaine — mais la connexion WebSocket du SDK vers `ingest.sentry.io` pour d'autres features (profiling, uptime) peut être bloquée.

**Fix concret.** Vérifier si le tunnel couvre 100% des connexions Sentry (normalement oui pour les events). Si profiling ou autre feature Sentry est activée ultérieurement, ajouter à `connectSrc` dans `next.config.ts` :
```
https://*.sentry.io https://*.ingest.sentry.io
```

---

### P2-2 : Backups Supabase non documentés

**Constat.** Aucun fichier dans le repo ne documente la stratégie de backup Supabase. Supabase Pro inclut des backups PITR (Point-In-Time Recovery) sur 7 jours par défaut, mais il faut vérifier que le projet est bien sur Pro et que les backups sont activés. En cas d'incident DB, sans procédure documentée, le RTO est indéfini.

**Fix concret.** Vérifier dans le dashboard Supabase :
- `Settings > Backups` : PITR activé ? Rétention = 7 jours (Pro) ou 30 jours (Enterprise) ?
- Tester un restore en staging au moins une fois avant le go-live

Créer `/Users/mac/nexara/konvert/audit/runbook-incident.md` avec la procédure de restore Supabase PITR.

---

### P2-3 : Rollback Vercel non documenté

**Constat.** Aucun runbook de rollback dans le repo. Vercel conserve les 10 derniers deployments. En cas d'incident post-deploy, la procédure de rollback n'est pas documentée — sous stress incident, le temps de réaction est plus long.

**Fix concret.** Procédure de rollback (à documenter dans runbook-incident.md) :

```bash
# Lister les déploiements récents
vercel ls konvert --limit 10

# Promouvoir un déploiement précédent en prod
vercel promote <deployment-url> --scope=<team>

# Alternative via Vercel Dashboard :
# Deployments > sélectionner le bon > "Promote to Production"
```

Ajouter un alias de release : avant chaque deploy prod, taguer git :
```bash
git tag -a "release-$(date +%Y%m%d-%H%M)" -m "Deploy prod $(date)"
```

---

### P2-4 : `NEXT_TELEMETRY_DISABLED` absent

**Constat.** Next.js envoie des données de télémétrie anonymes par défaut. Non bloquant, mais en contexte SaaS RGPD EU, il est préférable de le désactiver explicitement.

**Fix concret.** Ajouter dans `vercel.json` sous `env` :
```json
"env": {
  "NEXT_PUBLIC_APP_URL": "https://konvert.app",
  "NEXT_TELEMETRY_DISABLED": "1"
}
```

---

### P2-5 : `dependabot.yml` cible `github-actions` mais aucun workflow n'existe

**Constat.** `dependabot.yml` configure des updates pour `github-actions` (interval mensuel) mais `.github/workflows/` est vide. Cette config est inoffensive mais génèrera des alertes Dependabot sans objet jusqu'à ce que P1-5 soit appliqué.

**Fix concret.** Aucune action immédiate — se résoudra automatiquement lors de la création du workflow CI (P1-5).

---

### P2-6 : Source maps edge config sans `release` — upload inutile

**Constat.** `sentry.edge.config.ts` est la config la plus minimale (4 lignes). L'edge runtime exécute `/api/health` et d'autres routes edge. Sans `release`, les source maps uploadées par `withSentryConfig` ne peuvent pas être associées aux erreurs edge en Sentry. Le `deleteSourcemapsAfterUpload: true` est bien configuré dans `next.config.ts` — les maps ne sont pas exposées publiquement.

**Fix concret.** Appliqué par P0-2 (ajout `release` dans les 3 configs).

---

## Plan de mise en place observabilité — 7 actions chronologiques

**Durée totale estimée : 3h**

### Action 1 — 15 min (immédiat) : Release + environment Sentry

Modifier les 3 fichiers `sentry.*.config.ts` pour ajouter `release` et `environment` (voir P0-2). Déployer. Vérifier dans Sentry Dashboard que les events arrivent avec le bon environment tag.

### Action 2 — 20 min : beforeSend PII filter

Ajouter le filtre `beforeSend` dans `sentry.server.config.ts` et `sentry.client.config.ts` (voir P0-1). Tester en local avec `NODE_ENV=production` simulé.

### Action 3 — 30 min : maxDuration crons + guard deadline

Ajouter `export const maxDuration = 60` et le guard deadline dans les deux routes cron (voir P0-3). Ajouter l'instrumentation Sentry sur les erreurs batch (voir P1-3).

### Action 4 — 45 min : Endpoint `/api/health/deep`

Créer le deep health endpoint avec sondes Supabase + présence des clés critiques (voir P1-1). Configurer un moniteur BetterStack ou UptimeRobot sur ce endpoint (interval 5 min, alerte Telegram/Slack sur 503).

### Action 5 — 30 min : GitHub Actions CI workflow

Créer `.github/workflows/ci.yml` avec lint + tsc + build (voir P1-5). Configurer les secrets GitHub nécessaires pour le build. Corriger le script `lint` dans `package.json`.

### Action 6 — 20 min : Logger structuré + fix PII contact

Créer `src/lib/logger.ts` avec le helper JSON (voir P1-2). Remplacer le `console.log` PII dans `/api/contact/route.ts`. Migrer progressivement les autres routes API vers le logger structuré.

### Action 7 — 20 min : Alertes Sentry Dashboard

Après que Action 1 est déployée et que les events arrivent avec environment/release, configurer les alertes Sentry (voir P1-7) : error rate > 5% sur generate/scrape, cron errors > 10 en 5 min, toute exception sur stripe/webhook.

---

## Tableau de synthèse

| ID | Priorité | Domaine | Description courte | Effort |
|---|---|---|---|---|
| P0-1 | P0 | Sentry | `beforeSend` absent — PII dans stack traces | 20 min |
| P0-2 | P0 | Sentry | `release` + `environment` absents — source maps inutilisables | 15 min |
| P0-3 | P0 | Crons | `maxDuration` absent — timeout silencieux batch | 20 min |
| P0-4 | P0 | Env vars | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` introuvable dans `src/` | 15 min |
| P1-1 | P1 | Health | Endpoint superficiel — ne sonde aucune dépendance | 45 min |
| P1-2 | P1 | Logs | Logs texte libre + PII email en clair dans contact | 30 min |
| P1-3 | P1 | Crons | Erreurs batch non reportées à Sentry | 20 min |
| P1-4 | P1 | Vercel | Pas de `functions` config centralisée dans `vercel.json` | 15 min |
| P1-5 | P1 | CI/CD | Aucun GitHub Actions workflow — 0 gate qualité | 30 min |
| P1-6 | P1 | Env vars | `ANTHROPIC_API_KEY` fantôme + scraper fallbacks non vérifiés | 15 min |
| P1-7 | P1 | Alerting | Aucune alerte Sentry configurée | 20 min |
| P2-1 | P2 | CSP | `*.sentry.io` absent de `connect-src` | 5 min |
| P2-2 | P2 | Backups | PITR Supabase non documenté | 30 min |
| P2-3 | P2 | Rollback | Procédure rollback Vercel non documentée | 20 min |
| P2-4 | P2 | Build | `NEXT_TELEMETRY_DISABLED` absent | 5 min |
| P2-5 | P2 | CI/CD | Dependabot cible des workflows inexistants | 0 min (auto) |
| P2-6 | P2 | Sentry | Edge config trop minimale (résolu par P0-2) | 0 min (inclus) |

---

## Points positifs confirmés (infra saine)

- `timingSafeEqual` sur les deux crons — protection timing attack correcte
- Idempotence crons : marquage AVANT envoi email — pattern correct
- Source maps : `deleteSourcemapsAfterUpload: true` — pas d'exposition publique
- Security headers : HSTS, X-Frame-Options, Permissions-Policy, CSP dual (strict + builder) — solide
- Rate limit Upstash sur les routes publiques — présent
- `CRON_SECRET` guard sur les deux crons — actif et bloquant si absent
- Supabase : RLS actif, `processed_stripe_events` idempotent, service_role isolé
- `tunnelRoute: '/monitoring'` — contourne les ad-blockers pour Sentry client
